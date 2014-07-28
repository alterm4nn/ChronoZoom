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
    public class Version : IDisposable
    {
        private ConnectionStringSettings _cnConfig = ConfigurationManager.ConnectionStrings["Storage"];

        public string LastUpdate()
        {
            string sql = "SELECT TOP 1 MigrationId FROM MigrationHistory WITH (NOLOCK) ORDER BY MigrationId DESC";

            if (_cnConfig.ProviderName.StartsWith("System.Data.SqlServerCe."))
            {
                return LastUpdateCE(sql);   // SQL Server Compact Edition
            }
            else
            {
                return LastUpdateFull(sql); // SQL Server Express, Standard, Enterprise or Azure Editions
            }
        }

        private string LastUpdateCE(string sql)
        {
            string rv = "";

            using (SqlCeConnection cn = new SqlCeConnection(_cnConfig.ToString()))
            {
                cn.Open();

                using (SqlCeCommand cmd = new SqlCeCommand(sql, cn))
                {
                    object result = cmd.ExecuteScalar();
                    if (result != null) rv = result.ToString();
                }

                cn.Close();
            }

            return rv;
        }

        private string LastUpdateFull(string sql)
        {
            string rv = "";

            using (SqlConnection cn = new SqlConnection(_cnConfig.ToString()))
            {
                cn.Open();

                using (SqlCommand cmd = new SqlCommand(sql, cn))
                {
                    object result = cmd.ExecuteScalar();
                    if (result != null) rv = result.ToString();
                }

                cn.Close();
            }

            return rv;
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
