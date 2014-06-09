using Microsoft.SqlServer;
using Microsoft.SqlServer.Management.Common;
using Microsoft.SqlServer.Management.Smo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.IO;

namespace Chronozoom.Entities
{
    public class ManualMigrationCheck : IDisposable
    {
        public bool NewInstall { get; private set; }

        // constructor - undertakes a migration needed check
        public ManualMigrationCheck()
        {
            Dictionary<string, string>  migrated    = new Dictionary<string,string>();
            bool                        rename      = false;
            string                      sql;

            NewInstall = false;

            // connect to db using connection string from parent app - at least empty db needs to pre-exist
            using (SqlConnection cn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["Storage"].ToString()))
            {
                cn.Open();

                // check if schema exists - should always be a migration history table
                sql =
                    @"
                    SELECT 
                    OBJECT_ID(N'[dbo].[__MigrationHistory]', 'U') AS OldHistory,
                    OBJECT_ID(N'[dbo].[MigrationHistory]',   'U') AS NewHistory
                    ";
                using (SqlCommand cmd = new SqlCommand(sql, cn))
                {
                    using (SqlDataReader rs = cmd.ExecuteReader())
                    {
                        rs.Read();

                        // note new install if no schema exists
                        if (rs["OldHistory"].ToString() == "" && rs["NewHistory"].ToString() == "") NewInstall = true;

                        // note to rename table if __MigrationHistory table exists
                        if (rs["OldHistory"].ToString() != "") rename = true;
                    }
                }

                // Rename __MigrationHistory table to MigrationHistory (prevents entity framework version check)
                if (rename)
                {
                    ExecNativeSQL(Properties.Resources.RenameMigrationHistory, cn);
                }

                // if no schema then create entire schema then populate bitmasks
                if (NewInstall)
                {
                    // create main schema
                    sql = Properties.Resources.CreateEntireSchema;
                    if (System.Configuration.ConfigurationManager.ConnectionStrings["Storage"].ProviderName.Equals("System.Data.?SqlClient"))   // should never be true - lifted logic as-is from "broken" migration
                    {                                                                                                                           // so exactly matches latest db structure that theoretically should
                        sql += Properties.Resources._201306050753190_ProgressiveLoad;                                                           // not have the sprocs that ProgressiveLoad introduces.
                    }
                    ExecNativeSQL(sql, cn);

                    // populate bitmasks
                    EnsureBitmasksPopulated();
                }
                else
                {
                    // schema exists - build list of already executed migration steps
                    sql = "SELECT MigrationId AS MigrationTitle FROM [MigrationHistory] WITH (NOLOCK) ORDER BY MigrationId";
                    using (SqlCommand cmd = new SqlCommand(sql, cn))
                    {
                        using (SqlDataReader rs = cmd.ExecuteReader())
                        {
                            if (rs.HasRows)
                            {
                                while (rs.Read())
                                {
                                    string[] titleParts = rs["MigrationTitle"].ToString().Split('_'); // 0 will be key, 1 will be value (description).
                                    if (!migrated.ContainsKey(titleParts[0]))
                                    {
                                        migrated.Add(titleParts[0], titleParts[1]);
                                    }
                                }
                            }
                        }
                    }

                    // see if any migration stepa are missing - if so build sql in correct order which should also note step completed in db
                    sql = "";
                    if (!migrated.ContainsKey("201305102053361")) sql += Properties.Resources._201305102053361_RemoveBetaFields;
                    if (!migrated.ContainsKey("201305102115428")) sql += Properties.Resources._201305102115428_RemoveRITree;
                    if (!migrated.ContainsKey("201305102117597")) sql += Properties.Resources._201305102117597_AddRITreeWithIndex;
                    if (!migrated.ContainsKey("201305240425388")) sql += Properties.Resources._201305240425388_ChangeTours;                         // Note: original migration broken as doesn't do anything
                    if (!migrated.ContainsKey("201305282325585")) sql += Properties.Resources._201305282325585_TitleLength;
                    if (!migrated.ContainsKey("201306040017265")) sql += Properties.Resources._201306040017265_ToursDescription;
                    if (!migrated.ContainsKey("201306040017265")) // this step has qualifier logic
                    {
                        if (System.Configuration.ConfigurationManager.ConnectionStrings["Storage"].ProviderName.Equals("System.Data.?SqlClient"))   // Note: original migration broken as should never be true
                        {
                            sql += Properties.Resources._201306050753190_ProgressiveLoad; // adds two sprocs
                        }
                        // even if logic in qualifier to add sprocs is not true, we still need to note this migration step has completed
                        sql +=
                            @"
                            INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
                            VALUES
                                ('201306050753190_ProgressiveLoad', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
                            GO;
                            ";
                    }
                    if (!migrated.ContainsKey("201306072040327")) sql += Properties.Resources._201306072040327_ToursUserMissingMaxLen;              // Note: original migration broken as doesn't do anything
                    if (!migrated.ContainsKey("201306210425512")) sql += Properties.Resources._201306210425512_IncreaseYearPrecision;
                    if (!migrated.ContainsKey("201306210557399")) sql += Properties.Resources._201306210557399_RemoveBFSCachedFields;
                    if (!migrated.ContainsKey("201406020351501")) sql += Properties.Resources._201406020351501_MultipleEditors;

                    // if any steps were missing
                    if (sql != "")
                    {
                        // execute sql for any missing steps
                        ExecNativeSQL(sql, cn);

                        // ensure bitmasks are populated/repopulated
                        EnsureBitmasksPopulated();
                    }
                }

                cn.Close();
            }
        }

        private void EnsureBitmasksPopulated()
        {
            using (Storage storage = new Storage())
            {
                if (storage.Bitmasks.Any()) return;
                long v = 1;
                foreach (var b in storage.Bitmasks)
                {
                    storage.Bitmasks.Remove(b);
                }
                storage.SaveChanges();
                for (int r = 0; r < 63; ++r)
                {
                    var b = new Bitmask { B1 = -(v << 1), B2 = v, B3 = v << 1 };
                    storage.Bitmasks.Add(b);
                    v <<= 1;
                }
                storage.SaveChanges();
            }
        }

        /// <summary>
        /// Use to run T-SQL scripts which can't be run through DbCommand since they include native, non-standard commands such as "GO".
        /// </summary>
        /// <param name="sqlScript">The text of the script to be run.</param>
        /// <param name="sqlConnection">The SQLConnection to run the script against, which should already be established.</param>
        private void ExecNativeSQL(string sqlScript, SqlConnection sqlConnection)
        {
            ServerConnection serverConnection   = new ServerConnection(sqlConnection);
            Server           server             = new Server(serverConnection);
            server.ConnectionContext.ExecuteNonQuery(sqlScript);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // free any managed resources
            }
            // free any native resources
        }
    }
}
