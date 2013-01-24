using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.OleDb;
using System.Data;
using Authoring.WebRole.Models;
using System.IO;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml;
using System.IO.Packaging;
using System.Threading;
using System.Threading.Tasks;

namespace Authoring.WebRole.Controllers
{
    public class UploadController: BaseController
    {
        
        private CloudStorageAccount storageAccount;
        private CloudBlobClient blobStorageClient;
        private CloudBlobContainer blobExcelContainer;
        private string containerName;

        [HttpPost]
        public ActionResult UploadTimeline(HttpPostedFileBase excelFile)
        {
            if (excelFile != null)
            {
                //Error records
                ViewBag.ExcelUploadError = string.Empty;

                //Save the uploaded file to blob.
                CheckContainer("ExcelDataContainerName");
                string uniqueBlobExcelName = string.Format(containerName + "/Timeline_{0}{1}", Guid.NewGuid().ToString(), Path.GetFileName(excelFile.FileName));
                CloudBlockBlob blob = blobStorageClient.GetBlockBlobReference(uniqueBlobExcelName);
                blob.Properties.ContentType = excelFile.ContentType;
                byte[] fileData = new byte[excelFile.ContentLength];
                excelFile.InputStream.Read(fileData, 0, excelFile.ContentLength);
                blob.UploadByteArray(fileData);

                LocalResource myConfigStorage = RoleEnvironment.GetLocalResource("ExcelStorage");
                string localFile = myConfigStorage.RootPath + Path.GetFileName(excelFile.FileName);
                blob.DownloadToFile(localFile);
                using (SpreadsheetDocument excelDoc = SpreadsheetDocument.Open(localFile, false))
                {
                    Worksheet sheet = excelDoc.WorkbookPart.WorksheetParts.First().Worksheet;
                    SheetData wsheet = sheet.GetFirstChild<SheetData>();
                    foreach (Row row in wsheet.Elements())
                    {
                        if (row.RowIndex == 1)
                            continue; //header row
                        string tempData;
                        try
                        {
                            Timeline newTimeline = new Timeline();
                            Cell cell = GetCell(sheet, row, "A");
                            if (cell != null && cell.CellValue != null)
                            {
                                newTimeline.Title = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //Title
                            }
                            cell = GetCell(sheet, row, "B");
                            if (cell != null && cell.CellValue != null)
                            {
                                tempData = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //Threshold
                                newTimeline.ThresholdID = (from threshold in db.Thresholds
                                                           where threshold.Threshold1 == tempData
                                                           select threshold.ID).FirstOrDefault();
                            }
                            cell = GetCell(sheet, row, "C");
                            if (cell != null && cell.CellValue != null)
                            {

                                tempData = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //Regime
                                newTimeline.RegimeID = (from regime in db.Regimes
                                                        where regime.Regime1 == tempData
                                                        select regime.ID).FirstOrDefault();
                            }
                            cell = GetCell(sheet, row, "D");
                            if (cell != null && cell.CellValue != null)
                            {
                                newTimeline.FromContentYear = Convert.ToDecimal(cell.CellValue.Text); //FromContentYear
                            }
                            cell = GetCell(sheet, row, "E");
                            if (cell != null && cell.CellValue != null)
                            {
                                tempData = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //FromTimeUnit
                                newTimeline.FromTimeUnit = (from timeunit in db.TimeUnits
                                                            where timeunit.TimeUnit1 == tempData
                                                            select timeunit.ID).FirstOrDefault();
                            }
                            cell = GetCell(sheet, row, "F");
                            if (cell != null && cell.CellValue != null)
                            {

                                newTimeline.ToContentYear = Convert.ToDecimal(cell.CellValue.Text); //ToContentYear
                            }
                            cell = GetCell(sheet, row, "G");
                            if (cell != null && cell.CellValue != null)
                            {
                                tempData = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //ToTimeUnit
                                newTimeline.ToTimeUnit = (from timeunit in db.TimeUnits
                                                          where timeunit.TimeUnit1 == tempData
                                                          select timeunit.ID).FirstOrDefault();
                            }
                            cell = GetCell(sheet, row, "H");
                            if (cell != null && cell.CellValue != null)
                            {
                                tempData = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //Timeline2
                                int count = (from timeline in db.Timelines
                                             where timeline.Title == tempData
                                             select timeline.ID).Count();
                                if (count > 0)
                                {
                                    newTimeline.ParentTimelineID = (from timeline in db.Timelines
                                                                    where timeline.Title == tempData
                                                                    select timeline.ID).FirstOrDefault();
                                }
                            }
                            cell = GetCell(sheet, row, "I");
                            if (cell != null && cell.CellValue != null)
                            {
                                tempData = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text;
                                if (tempData != null) //IsVisible
                                {
                                    newTimeline.IsVisible = tempData.Trim().ToLower() == "true" ? true : false;
                                }
                            }
                            cell = GetCell(sheet, row, "J");
                            if (cell != null && cell.CellValue != null)
                            {
                                newTimeline.Attribution = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //Attribution
                            }
                            cell = GetCell(sheet, row, "K");
                            if (cell != null && cell.CellValue != null)
                            {
                                newTimeline.SourceURL = GetSharedStringItemById(excelDoc.WorkbookPart, Convert.ToInt32(cell.CellValue.Text)).Text.Text; //SourceUrl
                            }
                            if (ModelState.IsValid)
                            {
                                newTimeline.ID = Guid.NewGuid();
                                newTimeline.CreatedBy = Guid.Parse(Session["userid"].ToString());
                                newTimeline.CreatedOn = DateTime.Now;
                                db.Timelines.AddObject(newTimeline);
                            }
                        }
                        catch (Exception ex)
                        {
                            ViewBag.ExcelUploadError += "Row " + (row.RowIndex) + ": Error message: " + ex.Message + "\n";
                        }

                    }
                    db.SaveChanges();
                }
            }

            return RedirectToAction("Index", "Timeline");
        }

        #region HelperMethod
        private void CheckContainer(string containerConfigName)
        {
            // Get a handle on account, create a blob service client and get container proxy
            storageAccount = CloudStorageAccount.FromConfigurationSetting("BlobConnectionString");
            blobStorageClient = storageAccount.CreateCloudBlobClient();
            containerName = RoleEnvironment.GetConfigurationSettingValue(containerConfigName);

            blobExcelContainer = blobStorageClient.GetContainerReference(containerName);
            blobExcelContainer.CreateIfNotExist();

            var permissions = blobExcelContainer.GetPermissions();
            permissions.PublicAccess = BlobContainerPublicAccessType.Container;
            blobExcelContainer.SetPermissions(permissions);
        }
 
        private static SharedStringItem GetSharedStringItemById(WorkbookPart workbookPart, int id)
        {
            return workbookPart.SharedStringTablePart.SharedStringTable.Elements<SharedStringItem>().ElementAt(id);
        }

        private static Cell GetCell(Worksheet worksheet, Row row, string columnName)
        {
            try
            {
                return row.Elements<Cell>().Where(c => string.Compare
                       (c.CellReference.Value, columnName +
                       row.RowIndex, true) == 0).First();
            }
            catch (Exception)
            {
                return null;
            }
        } 

        #endregion

        #region Helper
        public string UploadFileToBlob(HttpPostedFileBase uplFileUpload, Guid id, string cName, string blobFileName)
        {
            //verify container exists
            CheckContainer(cName);
            //upload the content to container
            string uniqueBlobFileName = string.Empty;
            if (string.IsNullOrEmpty(blobFileName))
            {
                uniqueBlobFileName = string.Format(containerName + "/{0}_{1}", id, Path.GetFileName(uplFileUpload.FileName));
            }
            else
            {
                uniqueBlobFileName = string.Format(containerName + "/{0}", blobFileName);
            }
            CloudBlockBlob blob = blobStorageClient.GetBlockBlobReference(uniqueBlobFileName);
            if (Path.GetExtension(uplFileUpload.FileName).ToLower() == ".ogg")
            {
                blob.Properties.ContentType = "audio/ogg";
            }
            else
            {
                blob.Properties.ContentType = uplFileUpload.ContentType;
            }

            byte[] fileData = new byte[uplFileUpload.ContentLength];
            uplFileUpload.InputStream.Read(fileData, 0, uplFileUpload.ContentLength);

            Int64 contentLength = fileData.Length;
            int numBytesPerBlock = 250 * 1024; // 250KB per block 
            int blocksCount = (int)Math.Ceiling((double)contentLength / numBytesPerBlock);  // number of blocks  
            MemoryStream ms = null;
            List<string> BlockIds = new List<string>();
            string block;
            int offset = 0;

            for (int i = 0; i < blocksCount; i++, offset = offset + numBytesPerBlock)
            {
                block = Convert.ToBase64String(BitConverter.GetBytes(i));
                ms = new MemoryStream();
                if ((offset + numBytesPerBlock) > contentLength)
                {
                    ms.Write(fileData, offset, (int)(contentLength - offset));
                }
                else
                {
                    ms.Write(fileData, offset, numBytesPerBlock);
                }
                ms.Position = 0;

                blob.PutBlock(block, ms, null);
                BlockIds.Add(block);
            }
            
            blob.PutBlockList(BlockIds);
            ms.Dispose();
            return blob.Uri.ToString();
        }

        public static void ParallelDownloadToFile(CloudBlockBlob blob, string fileName, int maxBlockSize)
        {
            try
            {
                // refresh the values
                blob.FetchAttributes();
                long fileSize = blob.Attributes.Properties.Length;
                var filePath = Path.GetDirectoryName(fileName);
                var fileNameWithoutPath = Path.GetFileNameWithoutExtension(fileName);

                // let's figure out how big the file is here
                long leftToRead = fileSize;
                int startPosition = 0;

                // have 1 block for every maxBlockSize bytes plus 1 for the remainder
                var blockCount =
                ((int)Math.Floor((double)(fileSize / maxBlockSize))) + 1;

                // setup the control array
                BlockTransferDetail[] transferDetails =
                new BlockTransferDetail[blockCount];

                // create an array of block keys
                string[] blockKeys = new string[blockCount];
                var blockIds = new List<string>();

                // populate the control array...
                for (int j = 0; j < transferDetails.Length; j++)
                {
                    int toRead = (int)(maxBlockSize < leftToRead ?
                    maxBlockSize :
                    leftToRead);

                    string blockId = Path.Combine(filePath,
                    string.Format("{0}_{1}.dat",
                    fileNameWithoutPath,
                    j.ToString("00000000000")));

                    if (startPosition < 0)
                        startPosition = startPosition * -1;
                    if (toRead < 0)
                        toRead = toRead * -1;
                    transferDetails[j] = new BlockTransferDetail()
                    {
                        StartPosition = startPosition,
                        BytesToRead = toRead,
                        BlockId = blockId
                    };

                    if (toRead > 0)
                    {
                        blockIds.Add(blockId);
                    }

                    // increment the starting position
                    startPosition += toRead;
                    leftToRead -= toRead;
                }

                // now we do a || download of the file.
                var result = Parallel.For(0, transferDetails.Length, j =>
                {
                    // get the blob as a stream
                    try
                    {
                        using (BlobStream stream = blob.OpenRead())
                        {
                            Thread.Sleep(10000);
                            stream.Seek(transferDetails[j].StartPosition, SeekOrigin.Begin);

                            // setup a buffer with the proper size
                            byte[] buff = new byte[transferDetails[j].BytesToRead];

                            // read into the buffer
                            stream.Read(buff, 0, transferDetails[j].BytesToRead);

                            using (Stream fileStream = new FileStream(transferDetails[j].BlockId,
                                FileMode.Create, FileAccess.Write, FileShare.None))
                            {
                                using (BinaryWriter bw = new BinaryWriter(fileStream))
                                {
                                    bw.Write(buff);
                                    bw.Close();
                                }
                            }
                            buff = null;
                        }
                    }
                    catch (Exception )
                    {
                        throw;
                    }
                });

                // assemble the file into one now...
                using (Stream fileStream = new FileStream(fileName,
                FileMode.Append, FileAccess.Write, FileShare.None))
                {
                    using (BinaryWriter bw = new BinaryWriter(fileStream))
                    {
                        // loop through each of the files on the disk
                        for (int j = 0; j < transferDetails.Length; j++)
                        {
                            // read them into the file (append)
                            bw.Write(System.IO.File.ReadAllBytes(transferDetails[j].BlockId));

                            // and then delete them
                            System.IO.File.Delete(transferDetails[j].BlockId);
                        }
                    }
                }

                transferDetails = null;
            }
            catch (Exception )
            {
                throw;
            }
        }

        class BlockTransferDetail
        {
            public int StartPosition { get; set; }
            public int BytesToRead { get; set; }
            public string BlockId { get; set; }
        }

        #endregion
    }
}
