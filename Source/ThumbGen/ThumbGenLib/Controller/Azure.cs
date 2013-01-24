using System;
using System.IO;
using System.Windows.Media.Imaging;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.Drawing;

namespace ThumbGen
{
    public partial class Controller
    {
        /// <summary>
        /// Configures Azure account and container
        /// </summary>
        /// <param name="bloburl">string with url to the blob</param>
        /// <param name="accountName">string containing name </param>
        /// <param name="accesskey"></param>
        public void ConfigureAzure(string bloburl, string accountName, string accesskey)
        {
            // Azure preparations
            DestinationBlobUrl = bloburl;

            // Set storage account
            cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=http;AccountName="
                + accountName + ";AccountKey=" + accesskey);

            // Initialize client
            blobClient = new Microsoft.WindowsAzure.StorageClient.CloudBlobClient(cloudStorageAccount.BlobEndpoint,
                cloudStorageAccount.Credentials);

            // Get the container reference.
            blobContainer = blobClient.GetContainerReference(bloburl);
            // Create the container if it does not exist.
            blobContainer.CreateIfNotExist();

            // Set permissions on the container.
            containerPermissions = new BlobContainerPermissions();
            containerPermissions.PublicAccess = BlobContainerPublicAccessType.Blob;
            blobContainer.SetPermissions(containerPermissions);
        }

        /// <summary>
        /// Connects to blob storage and saves bitmap under the specified path with given name
        /// </summary>
        /// <param name="bmp">BitmapSource to upload into the blob</param>
        /// <param name="relativePath"></param>
        /// <param name="filename"></param>
        private void SaveThumbnailAsPng(BitmapSource bmp, Guid id)
        {   
            using (var stream = new MemoryStream())
            {
                PngBitmapEncoder encoder = new PngBitmapEncoder();
                encoder.Interlace = PngInterlaceOption.On;
                encoder.Frames.Add(BitmapFrame.Create(bmp));
                encoder.Save(stream);
                stream.Seek(0, SeekOrigin.Begin);

                CloudBlob blob = blobContainer.GetBlobReference(Thumbs.GenerateThumbnailUrlString(id, bmp.Width.ToString()));
                mrLogger.Log("Azure: started uploading png picture to the blob: " + blob.Uri);
                // Upload a file from the memory stream to the blob.
                blob.UploadFromStream(stream);
                blob.Properties.ContentType = "image/png";
                blob.SetProperties();

                mrLogger.Log("Azure: finishing uploading blob");

            }
        }

        private void SaveThumbnailAsPng(Stream remoteStream, Guid id)
        {
                CloudBlob blob = blobContainer.GetBlobReference(Thumbs.GenerateThumbnailUrlString(id, remoteStream.Length.ToString()));
                mrLogger.Log("Azure: started uploading png picture to the blob: " + blob.Uri);
                // Upload a file from the memory stream to the blob.
                blob.UploadFromStream(remoteStream);
                blob.Properties.ContentType = "image/png";
                blob.SetProperties();

                mrLogger.Log("Azure: finishing uploading blob");

        }
    }
}
