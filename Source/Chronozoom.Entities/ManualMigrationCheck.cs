using Microsoft.SqlServer;
using Microsoft.SqlServer.Management.Common;
using Microsoft.SqlServer.Management.Smo;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data.SqlServerCe;
using System.Diagnostics;
using System.Linq;
using System.IO;

namespace Chronozoom.Entities
{
    public class ManualMigrationCheck : IDisposable
    {
        public  Boolean                     NewInstall  { get; private set; }

        private ConnectionStringSettings    _cnConfig   = ConfigurationManager.ConnectionStrings["Storage"];
        private Dictionary<string, string>  _migrated   = new Dictionary<string,string>();
        private String                      _sql;

        /// <summary>
        /// constructor - undertakes a migration needed check
        /// </summary>
        public ManualMigrationCheck()
        {
            NewInstall = false;

            if (_cnConfig.ProviderName.StartsWith("System.Data.SqlServerCe."))
            {
                CheckCE();      // SQL Server Compact Edition
            }
            else
            {
                CheckFull();    // SQL Server Express, Standard, Enterprise or Azure Editions
            }
        }

        /// <summary>
        /// manual migration check for SQL Server full editions and Azure
        /// </summary>
        private void CheckFull()
        {
            Boolean rename = false;

            // connect to db using connection string from parent app
            using (SqlConnection cn = new SqlConnection(_cnConfig.ToString()))
            {

                // at least an empty db needs to pre-exist but a schema is not required
                cn.Open();

                // check if schema exists - if so there should always be a migration history table
                _sql =
                    @"
                    SELECT 
                    OBJECT_ID(N'[dbo].[__MigrationHistory]', 'U') AS OldHistory,
                    OBJECT_ID(N'[dbo].[MigrationHistory]',   'U') AS NewHistory
                    ";
                using (SqlCommand cmd = new SqlCommand(_sql, cn))
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
                    ExecFullNativeSQL(Properties.Resources.RenameMigrationHistory, cn);
                }

                // if no schema then create entire schema then populate bitmasks
                if (NewInstall)
                {
                    // create main schema
                    _sql = Properties.Resources.CreateEntireSchema;
                    if (_cnConfig.ProviderName.Equals("System.Data.?SqlClient"))        // should never be true - lifted logic as-is from "broken" migration
                    {                                                                   // so exactly matches latest db structure that theoretically should
                        _sql += Properties.Resources._201306050753190_ProgressiveLoad;  // not have the sprocs that ProgressiveLoad introduces.
                    }
                    ExecFullNativeSQL(_sql, cn);

                    // populate bitmasks
                    EnsureBitmasksPopulated();
                }
                else
                {
                    // schema exists - build list of already executed migration steps
                    _sql = "SELECT MigrationId AS MigrationTitle FROM [MigrationHistory] WITH (NOLOCK) ORDER BY MigrationId";
                    using (SqlCommand cmd = new SqlCommand(_sql, cn))
                    {
                        using (SqlDataReader rs = cmd.ExecuteReader())
                        {
                            if (rs.HasRows)
                            {
                                while (rs.Read())
                                {
                                    string[] titleParts = rs["MigrationTitle"].ToString().Split('_'); // 0 will be key, 1 will be value (description).
                                    if (!_migrated.ContainsKey(titleParts[0]))
                                    {
                                        _migrated.Add(titleParts[0], titleParts[1]);
                                    }
                                }
                            }
                        }
                    }

                    // see if any migration stepa are missing - if so build sql in correct order which should also note step completed in db
                    _sql = BuildAnyMissingMigrationStepsSQL(_migrated);

                    // if any steps were missing
                    if (_sql != "")
                    {
                        // execute sql for any missing steps
                        ExecFullNativeSQL(_sql, cn);

                        // ensure bitmasks are populated/repopulated
                        EnsureBitmasksPopulated();
                    }
                }

                cn.Close();
            }
        }

        /// <summary>
        /// manual migration check for SQL Server Compact Edition (CE)
        /// </summary>
        private void CheckCE()
        {
            // connect to db using connection string from parent app
            using (SqlCeConnection cn = new SqlCeConnection(_cnConfig.ToString()))
            {

                // try to open db file but if can't locate then create and try again
                try
                {
                    cn.Open();
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("The database file cannot be found."))
                    {
                        using (SqlCeEngine ce = new SqlCeEngine(_cnConfig.ToString()))
                        {
                            ce.CreateDatabase();
                        }
                        cn.Open();
                    }
                    else
                    {
                        throw;
                    }
                }

                // check if schema exists - if so there should always be a migration history table
                if (!CETableExists("__MigrationHistory", cn) && !CETableExists("MigrationHistory", cn)) NewInstall = true;

                // Rename __MigrationHistory table to MigrationHistory (prevents entity framework version check)
                if (CETableExists("__MigrationHistory", cn))
                {
                    ExecCENativeSQL(Properties.Resources.RenameMigrationHistory, cn);
                }

                // if no schema then create entire schema then populate bitmasks
                if (NewInstall)
                {
                    // create main schema
                    _sql = Properties.Resources.CreateEntireSchema;
                    if (_cnConfig.ProviderName.Equals("System.Data.?SqlClient"))        // should never be true - lifted logic as-is from "broken" migration
                    {                                                                   // so exactly matches latest db structure that theoretically should
                        _sql += Properties.Resources._201306050753190_ProgressiveLoad;  // not have the sprocs that ProgressiveLoad introduces.
                    }
                    ExecCENativeSQL(_sql, cn);

                    // populate bitmasks
                    EnsureBitmasksPopulated();
                }
                else
                {
                    // schema exists - build list of already executed migration steps
                    _sql = "SELECT MigrationId AS MigrationTitle FROM [MigrationHistory] WITH (NOLOCK) ORDER BY MigrationId";
                    using (SqlCeCommand cmd = new SqlCeCommand(_sql, cn))
                    {
                        using (SqlCeDataReader rs = cmd.ExecuteResultSet(ResultSetOptions.Scrollable)) //cmd.ExecuteReader())
                        {
                            if (rs.HasRows)
                            {
                                while (rs.Read())
                                {
                                    string[] titleParts = rs["MigrationTitle"].ToString().Split('_'); // 0 will be key, 1 will be value (description).
                                    if (!_migrated.ContainsKey(titleParts[0]))
                                    {
                                        _migrated.Add(titleParts[0], titleParts[1]);
                                    }
                                }
                            }
                        }
                    }

                    // see if any migration stepa are missing - if so build sql in correct order which should also note step completed in db
                    _sql = BuildAnyMissingMigrationStepsSQL(_migrated);

                    // if any steps were missing
                    if (_sql != "")
                    {
                        // execute sql for any missing steps
                        ExecCENativeSQL(_sql, cn);

                        // ensure bitmasks are populated/repopulated
                        EnsureBitmasksPopulated();
                    }
                }

                cn.Close();
            }
        }

        /// <summary>
        /// Function to check if a table exists in a CE database.
        /// </summary>
        /// <param name="tableName">The name of the table to check if exists</param>
        /// <param name="sqlConnection">The SQLCeConnection to run the script against, which should already be established.</param>
        /// <returns>True or False depending on if the specified table name exists.</returns>
        private bool CETableExists(string tableName, SqlCeConnection sqlConnection)
        {
            bool rv = false;

            using (SqlCeCommand cmd = new SqlCeCommand("SELECT COUNT(1) FROM information_schema.tables WITH (NOLOCK) WHERE table_name = '" + tableName + "'", sqlConnection))
            {
                rv = (int) cmd.ExecuteScalar() == 1;
            }

            return rv;
        }
        
        /// <summary>
        /// Use to run T-SQL scripts for SQL Server or Azure which can't be run through DbCommand since they include native, non-standard commands such as "GO".
        /// This runs the scripts through a native interface instead. (Faster than splitting into separate DbCommand calls.)
        /// </summary>
        /// <param name="sqlScript">The text of the script to be run.</param>
        /// <param name="sqlConnection">The SQLConnection to run the script against, which should already be established.</param>
        private void ExecFullNativeSQL(string sqlScript, SqlConnection sqlConnection)
        {
            try
            {
                ServerConnection serverConnection = new ServerConnection(sqlConnection);
                Server server = new Server(serverConnection);
                server.ConnectionContext.ExecuteNonQuery(sqlScript);
            }
            catch (Exception ex)
            {
                // ensure full text of SQL is included in any error details
                throw new Exception("ExecFullNativeSQL sqlScript:\n\n" + sqlScript, ex);
            }
        }

        /// <summary>
        /// Use to run T-SQL scripts for SQL Server CE which can't be run through DbCommand since they include native, non-standard commands such as "GO".
        /// As there is no CE equivilent to ServerConnection, we will chunk the script into segments seperated by each GO and make each segment a unique DbCommand call.
        /// We will also remove the key/index ASC option, CLUSTERED option, [dbo] schema name, WITH CHECK parameter from any script since these are not supported,
        /// and convert the (MAX) option to an appropriate value and GetUTCDate to GetDate since these is not supported either. Additionally, any chunk containing a
        /// trigger will be completely ignored (the entire chunk) and not run since triggers are not supported. Thus this function is also a translator for CE scripts.
        /// </summary>
        /// <param name="sqlScript">The text of the script to be run.</param>
        /// <param name="sqlConnection">The SQLCeConnection to run the script against, which should already be established.</param>
        private void ExecCENativeSQL(string sqlScript, SqlCeConnection sqlConnection)
        {
            string[] sqlScriptChunks = sqlScript
                .Replace(" ASC,", ",")
                .Replace(" ASC\r\n", "\r\n")
                .Replace(" CLUSTERED", "")
                .Replace("[dbo].", "")
                .Replace("GetUTCDate()", "GetDate()")
                .Replace("GETUTCDATE()", "GETDATE()")
                .Replace("[nvarchar](max)",  "[nvarchar](4000)")
                .Replace("nvarchar(max)",    "nvarchar(4000)")
                .Replace("[varbinary](max)", "[varbinary](8000)")
                .Replace("varbinary(max)",   "varbinary(8000)")
                .Replace("CONVERT(VARBINARY(MAX)", "CONVERT(VARBINARY")
                .Replace("WITH CHECK", "")
                .Split(new string[] { "\nGO", "\nGo", "\ngo" }, StringSplitOptions.RemoveEmptyEntries);
            
            foreach (string sqlScriptChunk in sqlScriptChunks)
            {
                // only execute if script doesn't contain trigger code and is more than blank space/lines
                if
                (
                    (!sqlScriptChunk.Contains(" TRIGGER ")) && 
                    (sqlScriptChunk.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace(" ", "") != "")
                )
                {
                    try
                    {
                        using (SqlCeCommand cmd = new SqlCeCommand(sqlScriptChunk, sqlConnection))
                        {
                            cmd.ExecuteNonQuery();
                        }
                    }
                    catch (Exception ex)
                    {
                        // ensure full text of SQL chunk is included in any error details
                        // - useful for when testing translation to CE-compatible script
                        throw new Exception("ExecCENativeSQL Chunk:\n\n" + sqlScriptChunk, ex);
                    }
                }
            }
        }

        private string BuildAnyMissingMigrationStepsSQL(Dictionary<string, string> migrated)
        {
            string sql = "";

            if (!migrated.ContainsKey("201305102053361")) sql += Properties.Resources._201305102053361_RemoveBetaFields;
            if (!migrated.ContainsKey("201305102115428")) sql += Properties.Resources._201305102115428_RemoveRITree;
            if (!migrated.ContainsKey("201305102117597")) sql += Properties.Resources._201305102117597_AddRITreeWithIndex;
            if (!migrated.ContainsKey("201305240425388")) sql += Properties.Resources._201305240425388_ChangeTours;                 // Note: original migration broken as doesn't do anything
            if (!migrated.ContainsKey("201305282325585")) sql += Properties.Resources._201305282325585_TitleLength;
            if (!migrated.ContainsKey("201306040017265")) sql += Properties.Resources._201306040017265_ToursDescription;
            if (!migrated.ContainsKey("201306040017265")) // this step has qualifier logic
            {
                if (_cnConfig.ProviderName.Equals("System.Data.?SqlClient"))                                                        // Note: original migration broken as should never be true
                {
                    sql += Properties.Resources._201306050753190_ProgressiveLoad; // adds two sprocs
                }
                // even if logic in qualifier to add sprocs is not true, we still need to note this migration step has completed
                sql +=
                    @"
                    INSERT INTO [MigrationHistory] (MigrationId, Model, ProductVersion)
                    VALUES
                        ('201306050753190_ProgressiveLoad', CONVERT(VARBINARY(MAX), ''), 'Manual Migration');
                    GO
                    ";
            }
            if (!migrated.ContainsKey("201306072040327")) sql += Properties.Resources._201306072040327_ToursUserMissingMaxLen;      // Note: original migration broken as doesn't do anything
            if (!migrated.ContainsKey("201306210425512")) sql += Properties.Resources._201306210425512_IncreaseYearPrecision;
            if (!migrated.ContainsKey("201306210557399")) sql += Properties.Resources._201306210557399_RemoveBFSCachedFields;
            if (!migrated.ContainsKey("201406020351501")) sql += Properties.Resources._201406020351501_MultipleEditors;
            if (!migrated.ContainsKey("201408040000000")) sql += Properties.Resources._201408040000000_PubliclySearchable;
            if (!migrated.ContainsKey("201408130000000")) sql += Properties.Resources._201408130000000_MultipleCollections;
            if (!migrated.ContainsKey("201409250000000")) sql += Properties.Resources._201409250000000_PubliclySearchableChange;
            if (!migrated.ContainsKey("201502100000000")) sql += Properties.Resources._201502100000000_AddBackgroundUrlAspectRatio;

            return sql;
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
