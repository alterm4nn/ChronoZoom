using System;
using System.Data.Linq;
using System.Windows;
using System.Windows.Media.Imaging;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.Net;
using System.Drawing;
using System.IO;
namespace ThumbGen
{
    public partial class Controller
    {
        #region Fields
        private CloudStorageAccount cloudStorageAccount;
        private CloudBlobClient blobClient;
        private CloudBlobContainer blobContainer;
        private BlobContainerPermissions containerPermissions;

        private DataContext db;

        private string SourceConnectionString;
        private string DestinationBlobUrl;

        private System.Windows.Size InitialSize;

        private Logger mrLogger;
        #endregion

        #region Configure
        /// <summary>
        /// Initialize contoller to begin work with thumbnails
        /// </summary>
    
        public Controller()
        {
            var now = DateTime.Now;
            string logfilePath = String.Format("Log_{0:0000}_{1:00}_{2:00}_{3:00}_{4:00}.txt", now.Year, now.Month, now.Day,
                now.Minute, now.Hour);

            mrLogger = new Logger(logfilePath);

            // Setting default preview size
            SetPreviewSize(new System.Windows.Size(512, 512));
        }

        /// <summary>
        /// Sets controller settings
        /// </summary>
        /// <param name="cs">ControllerSettings to set up</param>
        public void SetControllerSettings(ControllerSettings cs)
        {
            SetPreviewSize(cs.PreviewSize);
            ConfigureAzure(cs.AzureBlobUrl, cs.AzureAccountName, cs.AzureKeytoBlob);
            ConfigureSQL(cs.SqlConnectionString);
        }

        /// <summary>
        /// Sets initial size of the preview image of the infodot
        /// </summary>
        /// <param name="previewSize"></param>
        public void SetPreviewSize(System.Windows.Size previewSize)
        {
            InitialSize = previewSize;
        }
        #endregion

        /// <summary>
        /// Create thumbs for specific item
        /// </summary>
        /// <param name="ciGuid">Guid of the ContentItem</param>
        public void MakeThumbsForItemID(Guid ciGuid)
        {
            // Get Content Item by ID
            ContentItem ci = GetContentItemByGuid(ciGuid);

            if (ci == null)
            {
                string p = "Item with specified id " + ciGuid + " was not found in the database";

                mrLogger.Log(p);
                Console.WriteLine(p);

                return;
            }

            MakeThumbsForItem(ci);
        }

        /// <summary>
        /// Create thumbs for specific item
        /// </summary>
        /// <param name="ciGuid">ContentItem to create thumbnail of</param>
        public void MakeThumbsForItem(ContentItem ci)
        {
            MediaTypes mt = MediaType.GetMediaType(ci.MediaTypeID);
            
             
            if (mt == MediaTypes.Video || mt == MediaTypes.Image || mt == MediaTypes.PDF || mt == MediaTypes.Photosynth)
            {
                mrLogger.Log("Making thumbs for content item with id " + ci.ID.ToString());
                // Create bitmaps of Infodot
                BitmapSource[] resultBmps = Thumbs.MakeThumbs(ci, Utils.GetSizes(), InitialSize);

                if (resultBmps == null)
                {
                    string c = "Cannot create thumbnails for Content Item with ID " + ci.ID.ToString() + ", skipping.";
                    Console.WriteLine(c);
                    mrLogger.Log(c);

                    return;
                }

                // Save thumbnails
                foreach (BitmapSource bmp in resultBmps)
                {
                    SaveThumbnailAsPng(bmp, ci.ID);
                }
            }
            else 
            {
                string ms = "Media Type for Content Item " + ci.ID.ToString() + " is not supported";

                Console.WriteLine(ms);
                mrLogger.Log(ms);
            }
            
        }

        /// <summary>
        /// Rebuilds thumbnails for all content items
        /// </summary>
        public void RebuildAllThumbnails()
        {
            mrLogger.Log("Re-creating thumbnails for all content items");
            // Get all ContentItems
            ContentItem[] cis = GetAllContentItems();
            mrLogger.Log("Working with " + cis.Length + "objects.");

            foreach (ContentItem ci in cis)
            {
                MakeThumbsForItemID(ci.ID);
            }
            
        }

        /// <summary>
        /// Removes all thumbnails
        /// </summary>
        public void RemoveAllThumbnails()
        {
            mrLogger.Log("Deleting thumbnails of all content items");
            // Get all ContentItems
            ContentItem[] cis = GetAllContentItems();
            mrLogger.Log("Going to delete thumbnails for " + cis.Length + "objects.");

            foreach (ContentItem ci in cis)
            {
                DeleteThumbsForItemID(ci.ID);
            }            
        }

        /// <summary>
        /// Creates thumbnails if absent for existing ContentItems
        /// </summary>
        public void UpdateThumbnails()
        {
            mrLogger.Log("Creating thumbnails for content items with absent previews");
            // Get all ContentItems
            ContentItem[] cis = GetAllContentItems();
            mrLogger.Log("Working with " + cis.Length + "objects.");
            // Get Id's
            // Check if there are thumbnails for given ids
            foreach (ContentItem ci in cis)
            {
                mrLogger.Log("Checking existance of thumbnails for CI with ID: " );
                // if exist - skip.
                if (CheckThumbnailExistenceByItemID(ci.ID))
                {
                    mrLogger.Log("thumbnails for item id " + ci.ID.ToString() + " exist");
                    continue;
                }
                else
                    MakeThumbsForItemID(ci.ID);
            }
            
        }
    }
}
