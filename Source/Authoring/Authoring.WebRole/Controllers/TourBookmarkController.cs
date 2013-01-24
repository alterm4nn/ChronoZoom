using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Authoring.WebRole.Models;

namespace Authoring.WebRole.Controllers
{ 
    [Authorize]
    public class TourBookmarkController: BaseController
    {
        
        private string table = AuthTable.TourBookmark.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public TourBookmarkController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /TourBookmark/

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

            var tourbookmarks = db.TourBookmarks.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("BookMark").Include("Tour").Include("User").Include("User1");
            return View(tourbookmarks.ToList());
        }

        //
        // GET: /TourBookmark/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            TourBookmark tourbookmark = db.TourBookmarks.Single(t => t.TourBookmarkID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(tourbookmark);
        }

        //
        // GET: /TourBookmark/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name");
            ViewBag.TourID = new SelectList(db.Tours.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /TourBookmark/Create

        [HttpPost]
        public ActionResult Create(TourBookmark tourbookmark)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                tourbookmark.TourBookmarkID = Guid.NewGuid();
                tourbookmark.CreatedBy = Guid.Parse(Session["userid"].ToString());
                tourbookmark.CreatedOn = DateTime.Now;
                db.TourBookmarks.AddObject(tourbookmark);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name", tourbookmark.BookmarkID);
            ViewBag.TourID = new SelectList(db.Tours.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name", tourbookmark.TourID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", tourbookmark.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", tourbookmark.ModifiedBy);
            return View(tourbookmark);
        }
        
        //
        // GET: /TourBookmark/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            TourBookmark tourbookmark = db.TourBookmarks.Single(t => t.TourBookmarkID == id && (t.IsDeleted == null || t.IsDeleted == false));
            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name", tourbookmark.BookmarkID);
            ViewBag.TourID = new SelectList(db.Tours.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name", tourbookmark.TourID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", tourbookmark.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", tourbookmark.ModifiedBy);
            return View(tourbookmark);
        }

        //
        // POST: /TourBookmark/Edit/5

        [HttpPost]
        public ActionResult Edit(TourBookmark tourbookmark)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                tourbookmark.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                tourbookmark.ModifiedOn = DateTime.Now;
                db.TourBookmarks.Attach(tourbookmark);
                db.ObjectStateManager.ChangeObjectState(tourbookmark, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name", tourbookmark.BookmarkID);
            ViewBag.TourID = new SelectList(db.Tours.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name", tourbookmark.TourID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", tourbookmark.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", tourbookmark.ModifiedBy);
            return View(tourbookmark);
        }

        //
        // GET: /TourBookmark/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            TourBookmark tourbookmark = db.TourBookmarks.Single(t => t.TourBookmarkID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(tourbookmark);
        }

        //
        // POST: /TourBookmark/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            TourBookmark tourbookmark = db.TourBookmarks.Single(t => t.TourBookmarkID == id && (t.IsDeleted == null || t.IsDeleted == false));
            tourbookmark.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            tourbookmark.ModifiedOn = DateTime.Now;
            tourbookmark.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(tourbookmark, EntityState.Modified);
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