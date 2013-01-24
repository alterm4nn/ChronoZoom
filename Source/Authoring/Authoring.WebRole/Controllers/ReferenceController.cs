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
    public class ReferenceController: BaseController
    {
        
        private string table = AuthTable.Reference.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ReferenceController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /Reference/

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

            var references = db.References.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("CitationType").Include("User").Include("User1");
            return View(references.ToList());
        }

        //
        // GET: /Reference/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            Reference reference = db.References.Single(r => r.ID == id && (r.IsDeleted == null ||r.IsDeleted == false));
            return View(reference);
        }

        //
        // GET: /Reference/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.CitationTypeID = new SelectList(db.CitationTypes, "ID", "CitationType1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /Reference/Create

        [HttpPost]
        public ActionResult Create(Reference reference)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                reference.ID = Guid.NewGuid();
                reference.CreatedBy = Guid.Parse(Session["userid"].ToString());
                reference.CreatedOn = DateTime.Now;
                db.References.AddObject(reference);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CitationTypeID = new SelectList(db.CitationTypes, "ID", "CitationType1", reference.CitationTypeID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", reference.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", reference.ModifiedBy);
            return View(reference);
        }
        
        //
        // GET: /Reference/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Reference reference = db.References.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            ViewBag.CitationTypeID = new SelectList(db.CitationTypes, "ID", "CitationType1", reference.CitationTypeID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", reference.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", reference.ModifiedBy);
            return View(reference);
        }

        //
        // POST: /Reference/Edit/5

        [HttpPost]
        public ActionResult Edit(Reference reference)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                reference.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                reference.ModifiedOn = DateTime.Now;
                db.References.Attach(reference);
                db.ObjectStateManager.ChangeObjectState(reference, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CitationTypeID = new SelectList(db.CitationTypes, "ID", "CitationType1", reference.CitationTypeID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", reference.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", reference.ModifiedBy);
            return View(reference);
        }

        //
        // GET: /Reference/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Reference reference = db.References.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            return View(reference);
        }

        //
        // POST: /Reference/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Reference reference = db.References.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            reference.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            reference.ModifiedOn = DateTime.Now;
            reference.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(reference, EntityState.Modified);
            //db.References.DeleteObject(reference);
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