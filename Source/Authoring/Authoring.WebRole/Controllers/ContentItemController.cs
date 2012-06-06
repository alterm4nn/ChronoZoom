using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Authoring.WebRole.Models;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;
using System.IO;

namespace Authoring.WebRole.Controllers
{ 
    public class ContentItemController: BaseController
    {
        
        private CloudStorageAccount storageAccount;
        private CloudBlobClient blobStorageClient;
        private CloudBlobContainer blobImageContainer;
        private string containerName;

        private string table = AuthTable.ContentItem.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ContentItemController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /ContentItem/

        public ActionResult Index()
        {
            string permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name);
            if (permission == admin)
                ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = true;
            else if (permission == delete)
                ViewBag.read = ViewBag.write = ViewBag.delete = true;
            else if (permission == write)
                ViewBag.read = ViewBag.write = true;
            else if (permission == read)
                ViewBag.read = true;
            else
                ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;

            if (!ViewBag.read)
                return RedirectToAction("Index", "Home");
            var contentitems = db.ContentItems.Where(c => (c.IsDeleted == null || c.IsDeleted == false)).Include("LicenseType").Include("MediaType").Include("Regime").Include("Threshold").Include("TimeUnit").Include("User").Include("User1");
            return View(contentitems.ToList().OrderBy(c=>int.Parse(c.Topic)));
        }

        //
        // GET: /ContentItem/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            ContentItem contentitem = db.ContentItems.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            return View(contentitem);
        }

        //
        // GET: /ContentItem/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.LicenseTypeID = new SelectList(db.LicenseTypes.Where(l => l.IsDeleted == null || l.IsDeleted == false), "ID", "LicenseType1");
            ViewBag.MediaTypeID = new SelectList(db.MediaTypes.Where(m => m.IsDeleted == null || m.IsDeleted == false), "ID", "MediaType1");
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false), "ID", "Regime1");
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(t => t.IsDeleted == null || t.IsDeleted == false), "ID", "Threshold1");
            ViewBag.TimeUnitID = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /ContentItem/Create

        [HttpPost]
        public ActionResult Create(ContentItem contentitem)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                contentitem.ID = Guid.NewGuid();
                contentitem.CreatedBy = Guid.Parse(Session["userid"].ToString());
                contentitem.CreatedOn = DateTime.Now;
               
                if (contentitem.ImageFile != null)
                {
                    UploadController uc = new UploadController();
                    contentitem.MediaBlobURL = uc.UploadFileToBlob(contentitem.ImageFile, contentitem.ID, "ImageContainerName", string.Empty);
                }

                if (!string.IsNullOrEmpty(contentitem.MediaBlobURL))
                {
                    db.ContentItems.AddObject(contentitem);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }

            ViewBag.LicenseTypeID = new SelectList(db.LicenseTypes.Where(l => l.IsDeleted == null || l.IsDeleted == false), "ID", "LicenseType1", contentitem.LicenseTypeID);
            ViewBag.MediaTypeID = new SelectList(db.MediaTypes.Where(m => m.IsDeleted == null || m.IsDeleted == false), "ID", "MediaType1", contentitem.MediaTypeID);
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false), "ID", "Regime1", contentitem.RegimeID);
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(t => t.IsDeleted == null || t.IsDeleted == false), "ID", "Threshold1", contentitem.ThresholdID);
            ViewBag.TimeUnitID = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", contentitem.TimeUnitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", contentitem.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", contentitem.ModifiedBy);
            
                
            return View(contentitem);
        }

       
        //
        // GET: /ContentItem/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ContentItem contentitem = db.ContentItems.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            ViewBag.LicenseTypeID = new SelectList(db.LicenseTypes.Where(l => l.IsDeleted == null || l.IsDeleted == false), "ID", "LicenseType1", contentitem.LicenseTypeID);
            ViewBag.MediaTypeID = new SelectList(db.MediaTypes.Where(m => m.IsDeleted == null || m.IsDeleted == false), "ID", "MediaType1", contentitem.MediaTypeID);
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false), "ID", "Regime1", contentitem.RegimeID);
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(t => t.IsDeleted == null || t.IsDeleted == false), "ID", "Threshold1", contentitem.ThresholdID);
            ViewBag.TimeUnitID = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", contentitem.TimeUnitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", contentitem.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", contentitem.ModifiedBy);
            return View(contentitem);
        }

        //
        // POST: /ContentItem/Edit/5

        [HttpPost]
        public ActionResult Edit(ContentItem contentitem)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                contentitem.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                contentitem.ModifiedOn = DateTime.Now;
                contentitem.MediaTypeID = Guid.Parse(Request.Form["MediaTypeIDList"]);
                if (contentitem.ImageFile != null)
                {
                    UploadController uc = new UploadController();
                    contentitem.MediaBlobURL = uc.UploadFileToBlob(contentitem.ImageFile, contentitem.ID, "ImageContainerName",string.Empty);
                }
                db.ContentItems.Attach(contentitem);
                db.ObjectStateManager.ChangeObjectState(contentitem, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.LicenseTypeID = new SelectList(db.LicenseTypes.Where(l => l.IsDeleted == null || l.IsDeleted == false), "ID", "LicenseType1", contentitem.LicenseTypeID);
            ViewBag.MediaTypeID = new SelectList(db.MediaTypes.Where(m => m.IsDeleted == null || m.IsDeleted == false), "ID", "MediaType1", contentitem.MediaTypeID);
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false), "ID", "Regime1", contentitem.RegimeID);
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(t => t.IsDeleted == null || t.IsDeleted == false), "ID", "Threshold1", contentitem.ThresholdID);
            ViewBag.TimeUnitID = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", contentitem.TimeUnitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", contentitem.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", contentitem.ModifiedBy);
            return View(contentitem);
        }

        //
        // GET: /ContentItem/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            ContentItem contentitem = db.ContentItems.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            return View(contentitem);
        }

        //
        // POST: /ContentItem/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            ContentItem contentitem = db.ContentItems.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            contentitem.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            contentitem.ModifiedOn = DateTime.Now;
            contentitem.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(contentitem, EntityState.Modified);
            //db.ContentItems.DeleteObject(contentitem);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

    }
}