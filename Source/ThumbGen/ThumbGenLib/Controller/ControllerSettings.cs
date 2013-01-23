using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;

namespace ThumbGen
{
    /// <summary>
    /// Stores settings required by controller to start operating
    /// </summary>
    public class ControllerSettings
    {
        public Size PreviewSize;
        public string AzureBlobUrl;
        public string AzureAccountName;
        public string AzureKeytoBlob;
        public string SqlConnectionString;

        public ControllerSettings(Size pSize, string sqlConnection, string azureBlobAdress, string azureUsename, string azureKey)
        {
            PreviewSize = pSize;
            SqlConnectionString = sqlConnection;
            AzureBlobUrl = azureBlobAdress;
            AzureAccountName = azureUsename;
            AzureKeytoBlob = azureKey;
        }
    }
}
