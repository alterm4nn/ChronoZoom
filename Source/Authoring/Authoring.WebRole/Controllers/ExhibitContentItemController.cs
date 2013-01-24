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
    public class ExhibitContentItemController : BaseController
    {
        
        private string table = AuthTable.ExhibitContentItem.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ExhibitContentItemController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /ExhibitContentItem/

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

            var exhibitcontentitems = db.ExhibitContentItems.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("ContentItem").Include("Exhibit").Include("User").Include("User1");
            return View(exhibitcontentitems.ToList().OrderBy(e => e.Exhibit.Title));
        }

        //
        // GET: /ExhibitContentItem/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            ExhibitContentItem exhibitcontentitem = db.ExhibitContentItems.Single(e => e.ExhibitContentItemID == id && (e.IsDeleted == null || e.IsDeleted == false));
            return View(exhibitcontentitem);
        }

        //
        // GET: /ExhibitContentItem/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.ContentItemID = new SelectList(db.ContentItems.Where(e => e.IsDeleted == null || e.IsDeleted == false).OrderBy(e => e.Title), "ID", "Title");
            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(e => e.IsDeleted == null || e.IsDeleted == false).OrderBy(e => e.Title), "ID", "Title");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /ExhibitContentItem/Create

        [HttpPost]
        public ActionResult Create(ExhibitContentItem exhibitcontentitem)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibitcontentitem.ExhibitContentItemID = Guid.NewGuid();
                exhibitcontentitem.CreatedBy = Guid.Parse(Session["userid"].ToString());
                exhibitcontentitem.CreatedOn = DateTime.Now;
                db.ExhibitContentItems.AddObject(exhibitcontentitem);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.ContentItemID = new SelectList(db.ContentItems.OrderByDescending(e => e.CreatedOn), "ID", "Title", exhibitcontentitem.ContentItemID);
            ViewBag.ExhibitID = new SelectList(db.Exhibits.OrderByDescending(e => e.CreatedOn), "ID", "Title", exhibitcontentitem.ExhibitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitcontentitem.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitcontentitem.ModifiedBy);
            return View(exhibitcontentitem);
        }
        
        //
        // GET: /ExhibitContentItem/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ExhibitContentItem exhibitcontentitem = db.ExhibitContentItems.Single(e => e.ExhibitContentItemID == id && (e.IsDeleted == null || e.IsDeleted == false));
            ViewBag.ContentItemID = new SelectList(db.ContentItems.OrderByDescending(e => e.CreatedOn), "ID", "Title", exhibitcontentitem.ContentItemID);
            ViewBag.ExhibitID = new SelectList(db.Exhibits.OrderByDescending(e => e.CreatedOn), "ID", "Title", exhibitcontentitem.ExhibitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitcontentitem.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitcontentitem.ModifiedBy);
            return View(exhibitcontentitem);
        }

        //
        // POST: /ExhibitContentItem/Edit/5

        [HttpPost]
        public ActionResult Edit(ExhibitContentItem exhibitcontentitem)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibitcontentitem.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                exhibitcontentitem.ModifiedOn = DateTime.Now;
                db.ExhibitContentItems.Attach(exhibitcontentitem);
                db.ObjectStateManager.ChangeObjectState(exhibitcontentitem, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ContentItemID = new SelectList(db.ContentItems.OrderByDescending(e => e.CreatedOn), "ID", "Title", exhibitcontentitem.ContentItemID);
            ViewBag.ExhibitID = new SelectList(db.Exhibits.OrderByDescending(e => e.CreatedOn), "ID", "Title", exhibitcontentitem.ExhibitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitcontentitem.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitcontentitem.ModifiedBy);
            return View(exhibitcontentitem);
        }

        //
        // GET: /ExhibitContentItem/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ExhibitContentItem exhibitcontentitem = db.ExhibitContentItems.Single(e => e.ExhibitContentItemID == id && (e.IsDeleted == null || e.IsDeleted == false));
            return View(exhibitcontentitem);
        }

        //
        // POST: /ExhibitContentItem/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ExhibitContentItem exhibitcontentitem = db.ExhibitContentItems.Single(e => e.ExhibitContentItemID == id && (e.IsDeleted == null || e.IsDeleted == false));
            exhibitcontentitem.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            exhibitcontentitem.ModifiedOn = DateTime.Now;
            exhibitcontentitem.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(exhibitcontentitem, EntityState.Modified);
            //db.ExhibitContentItems.DeleteObject(exhibitcontentitem);
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