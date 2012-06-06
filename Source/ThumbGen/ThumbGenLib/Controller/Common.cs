using System;
using System.Windows;
using Microsoft.WindowsAzure.StorageClient;

namespace ThumbGen
{
    public partial class Controller
    {
        /// <summary>
        /// Create thumbs for an array of items
        /// </summary>
        /// <param name="ciGuidArray">Array of ContentItems guids</param>
        private void MakeThumbsForIdArray(Guid[] ciGuidArray)
        {
            // Make thumbnails for all items
            foreach (Guid ci in ciGuidArray)
            {
                MakeThumbsForItemID(ci);
            }
        }

        /// <summary>
        /// Check whether thumbnail exists for specified contentitem id
        /// </summary>
        /// <param name="id">ContentItem Id</param>
        /// <returns>True if all thumbnails for specified ContentItem id exist, False if any of them doesn't</returns>
        private bool CheckThumbnailExistenceByItemID(Guid id)
        {
            foreach (Size s in Utils.GetSizes())
            {
                // Get name of the blob
                CloudBlob blob = blobContainer.GetBlobReference(Thumbs.GenerateThumbnailUrlString(id, s.Width.ToString()));

                // Check it existence
                if (!BlobExists(blob))
                {
                    return false;
                }                
            }

            return true;
        }

        /// <summary>
        /// Delete blob if it exists
        /// </summary>
        /// <param name="id">Id of the ContentItem for which blob was created</param>
        public void DeleteThumbsForItemID(Guid id)
        {            
            foreach (Size s in Utils.GetSizes())
            {
                String p = Thumbs.GenerateThumbnailUrlString(id, s.Width.ToString());
                mrLogger.Log("Performing deletion of thumbnails with path " + p);
                // Get name of the blob
                CloudBlob blob = blobContainer.GetBlobReference(p);
                blob.DeleteIfExists();
            }
        }

        /// <summary>
        /// Check whether the specified blob exists
        /// </summary>
        /// <param name="blob">Blob to check</param>
        /// <returns>true if specified blob exists, and false if it doesn't</returns>
        private static bool BlobExists(CloudBlob blob)
        {
            try
            {
                // try fetching Attributes
                blob.FetchAttributes();
                return true;
            }
            catch (StorageClientException e)
            {
                if (e.ErrorCode == StorageErrorCode.ResourceNotFound)
                {
                    // if failed with ResourceNotFound error code, then the blob doesn't exist
                    return false;
                }
                else
                {
                    // something else went wrong
                    //throw;
                    Console.Write(e);
                    return false;

                }
            }
            catch (Exception e)
            {
                Console.Write(e);
                return false;
            }
        }

    }
}