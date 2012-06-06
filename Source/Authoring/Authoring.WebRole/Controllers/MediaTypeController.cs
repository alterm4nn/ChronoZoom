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
    public class MediaTypeController: BaseController
    {
        
        private string table = AuthTable.MediaType.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public MediaTypeController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /MediaType/

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
            var mediatypes = db.MediaTypes.Where(m => (m.IsDeleted == null || m.IsDeleted == false)).Include("User").Include("User1");
            return View(mediatypes.ToList());
        }

        //
        // GET: /MediaType/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");
            MediaType mediatype = db.MediaTypes.Single(m => m.ID == id && (m.IsDeleted == null || m.IsDeleted == false));
            return View(mediatype);
        }

        //
        // GET: /MediaType/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /MediaType/Create

        [HttpPost]
        public ActionResult Create(MediaType mediatype)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                mediatype.ID = Guid.NewGuid();
                mediatype.CreatedBy = Guid.Parse(Session["userid"].ToString());
                mediatype.CreatedOn = DateTime.Now;
                db.MediaTypes.AddObject(mediatype);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", mediatype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", mediatype.ModifiedBy);
            return View(mediatype);
        }
        
        //
        // GET: /MediaType/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            MediaType mediatype = db.MediaTypes.Single(m => m.ID == id && (m.IsDeleted == null || m.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", mediatype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", mediatype.ModifiedBy);
            return View(mediatype);
        }

        //
        // POST: /MediaType/Edit/5

        [HttpPost]
        public ActionResult Edit(MediaType mediatype)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                mediatype.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                mediatype.ModifiedOn = DateTime.Now;
                db.MediaTypes.Attach(mediatype);
                db.ObjectStateManager.ChangeObjectState(mediatype, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", mediatype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", mediatype.ModifiedBy);
            return View(mediatype);
        }

        //
        // GET: /MediaType/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            MediaType mediatype = db.MediaTypes.Single(m => m.ID == id && (m.IsDeleted == null || m.IsDeleted == false));
            return View(mediatype);
        }

        //
        // POST: /MediaType/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            MediaType mediatype = db.MediaTypes.Single(m => m.ID == id && (m.IsDeleted == null || m.IsDeleted == false));
            mediatype.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            mediatype.ModifiedOn = DateTime.Now;
            mediatype.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(mediatype, EntityState.Modified);
            //db.MediaTypes.DeleteObject(mediatype);
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