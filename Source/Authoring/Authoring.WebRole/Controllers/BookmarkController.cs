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
    public class BookmarkController: BaseController
    {
        
        private string table = AuthTable.Bookmark.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public BookmarkController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /Bookmark/

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

            var bookmarks = db.BookMarks.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("User").Include("User1");
            return View(bookmarks.ToList());
        }

        //
        // GET: /Bookmark/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            BookMark bookmark = db.BookMarks.Single(b => b.ID == id && (b.IsDeleted == null || b.IsDeleted == false));
            return View(bookmark);
        }

        //
        // GET: /Bookmark/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /Bookmark/Create

        [HttpPost]
        public ActionResult Create(BookMark bookmark)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                bookmark.ID = Guid.NewGuid();
                bookmark.CreatedBy = Guid.Parse(Session["userid"].ToString());
                bookmark.CreatedOn = DateTime.Now;
                db.BookMarks.AddObject(bookmark);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", bookmark.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", bookmark.ModifiedBy);
            return View(bookmark);
        }
        
        //
        // GET: /Bookmark/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            BookMark bookmark = db.BookMarks.Single(b => b.ID == id && (b.IsDeleted == null || b.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", bookmark.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", bookmark.ModifiedBy);
            return View(bookmark);
        }

        //
        // POST: /Bookmark/Edit/5

        [HttpPost]
        public ActionResult Edit(BookMark bookmark)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                bookmark.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                bookmark.ModifiedOn = DateTime.Now;
                db.BookMarks.Attach(bookmark);
                db.ObjectStateManager.ChangeObjectState(bookmark, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", bookmark.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", bookmark.ModifiedBy);
            return View(bookmark);
        }

        //
        // GET: /Bookmark/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            BookMark bookmark = db.BookMarks.Single(b => b.ID == id && (b.IsDeleted == null || b.IsDeleted == false));
            return View(bookmark);
        }

        //
        // POST: /Bookmark/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            BookMark bookmark = db.BookMarks.Single(b => b.ID == id && (b.IsDeleted == null || b.IsDeleted == false));
            bookmark.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            bookmark.ModifiedOn = DateTime.Now;
            bookmark.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(bookmark, EntityState.Modified);
            //db.BookMarks.DeleteObject(bookmark);
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