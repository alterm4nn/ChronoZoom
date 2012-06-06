using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Authoring.WebRole.Models;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.IO;

namespace Authoring.WebRole.Controllers
{ 
    [Authorize]
    public class TourController: BaseController
    {
        
        private CloudStorageAccount storageAccount;
        private CloudBlobClient blobStorageClient;
        private CloudBlobContainer blobImageContainer;
        private string containerName;

        private string table = AuthTable.Tour.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public TourController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /Tour/

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

            var tours = db.Tours.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("User").Include("User1");
            return View(tours.ToList());
        }

        //
        // GET: /Tour/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            Tour tour = db.Tours.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(tour);
        }

        //
        // GET: /Tour/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /Tour/Create

        [HttpPost]
        public ActionResult Create(Tour tour)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                UploadController uc = new UploadController();
                tour.ID = Guid.NewGuid();
                tour.CreatedBy = Guid.Parse(Session["userid"].ToString());
                tour.CreatedOn = DateTime.Now;
                if (tour.AudioFile != null)
                {
                    tour.AudioBlobUrl = uc.UploadFileToBlob(tour.AudioFile, tour.ID, "AudioContainerName", string.Format("{0}.{1}", tour.ID, "mp3"));
                }
                if (tour.OggAudioFile != null)
                {
                    uc.UploadFileToBlob(tour.OggAudioFile, tour.ID, "AudioContainerName", string.Format("{0}.{1}", tour.ID, "wav"));
                }
                db.Tours.AddObject(tour);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", tour.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", tour.ModifiedBy);
            return View(tour);
        }
        //
        // GET: /Tour/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Tour tour = db.Tours.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", tour.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", tour.ModifiedBy);
            return View(tour);
        }

        //
        // POST: /Tour/Edit/5

        [HttpPost]
        public ActionResult Edit(Tour tour)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                UploadController uc = new UploadController();
                tour.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                tour.ModifiedOn = DateTime.Now;
                if (tour.AudioFile != null)
                {
                    tour.AudioBlobUrl = uc.UploadFileToBlob(tour.AudioFile, tour.ID, "AudioContainerName", string.Format("{0}.{1}", tour.ID, "mp3"));
                }
                if (tour.OggAudioFile != null)
                {
                    uc.UploadFileToBlob(tour.OggAudioFile, tour.ID, "AudioContainerName", string.Format("{0}.{1}", tour.ID, "wav"));
                }
                db.Tours.Attach(tour);
                db.ObjectStateManager.ChangeObjectState(tour, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", tour.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", tour.ModifiedBy);
            return View(tour);
        }

        //
        // GET: /Tour/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Tour tour = db.Tours.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(tour);
        }

        //
        // POST: /Tour/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Tour tour = db.Tours.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            tour.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            tour.ModifiedOn = DateTime.Now;
            tour.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(tour, EntityState.Modified);
            //db.Tours.DeleteObject(tour);
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