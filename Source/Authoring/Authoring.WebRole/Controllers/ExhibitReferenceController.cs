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
    public class ExhibitReferenceController: BaseController
    {
        
        private string table = AuthTable.ExhibitKeyword.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ExhibitReferenceController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }

        //
        // GET: /ExhibitReference/

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
            
            var exhibitreferenceentities = db.ExhibitReferenceEntities.Include("Exhibit").Include("Reference").Include("User").Include("User1");
            return View(exhibitreferenceentities.ToList().Where(k => (k.IsDeleted == null || k.IsDeleted == false)).OrderBy(e=> e.Exhibit.Title));
        }

        //
        // GET: /ExhibitReference/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            ExhibitReferenceEntity exhibitreferenceentity = db.ExhibitReferenceEntities.Single(e => e.ExhibitReferenceID == id);
            return View(exhibitreferenceentity);
        }

        //
        // GET: /ExhibitReference/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Title), "ID", "Title");
            ViewBag.ReferenceID = new SelectList(db.References.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Title), "ID", "Authors");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /ExhibitReference/Create

        [HttpPost]
        public ActionResult Create(ExhibitReferenceEntity exhibitreferenceentity)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibitreferenceentity.ExhibitReferenceID = Guid.NewGuid();
                exhibitreferenceentity.CreatedBy = Guid.Parse(Session["userid"].ToString());
                exhibitreferenceentity.CreatedOn = DateTime.Now;
                db.ExhibitReferenceEntities.AddObject(exhibitreferenceentity);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.ExhibitID = new SelectList(db.Exhibits, "ID", "Title", exhibitreferenceentity.ExhibitID);
            ViewBag.ReferenceID = new SelectList(db.References, "ID", "Authors", exhibitreferenceentity.ReferenceID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitreferenceentity.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitreferenceentity.ModifiedBy);
            return View(exhibitreferenceentity);
        }
        
        //
        // GET: /ExhibitReference/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ExhibitReferenceEntity exhibitreferenceentity = db.ExhibitReferenceEntities.Single(e => e.ExhibitReferenceID == id);
            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Title), "ID", "Title", exhibitreferenceentity.ExhibitID);
            ViewBag.ReferenceID = new SelectList(db.References.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Title), "ID", "Authors", exhibitreferenceentity.ReferenceID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitreferenceentity.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitreferenceentity.ModifiedBy);
            return View(exhibitreferenceentity);
        }

        //
        // POST: /ExhibitReference/Edit/5

        [HttpPost]
        public ActionResult Edit(ExhibitReferenceEntity exhibitreferenceentity)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                db.ExhibitReferenceEntities.Attach(exhibitreferenceentity);
                exhibitreferenceentity.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                exhibitreferenceentity.ModifiedOn = DateTime.Now;
                db.ObjectStateManager.ChangeObjectState(exhibitreferenceentity, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ExhibitID = new SelectList(db.Exhibits, "ID", "Title", exhibitreferenceentity.ExhibitID);
            ViewBag.ReferenceID = new SelectList(db.References, "ID", "Authors", exhibitreferenceentity.ReferenceID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitreferenceentity.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitreferenceentity.ModifiedBy);
            return View(exhibitreferenceentity);
        }

        //
        // GET: /ExhibitReference/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ExhibitReferenceEntity exhibitreferenceentity = db.ExhibitReferenceEntities.Single(e => e.ExhibitReferenceID == id);
            return View(exhibitreferenceentity);
        }

        //
        // POST: /ExhibitReference/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            ExhibitReferenceEntity exhibitreferenceentity = db.ExhibitReferenceEntities.Single(e => e.ExhibitReferenceID == id);
            exhibitreferenceentity.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            exhibitreferenceentity.ModifiedOn = DateTime.Now;
            exhibitreferenceentity.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(exhibitreferenceentity, EntityState.Modified);
//            db.ExhibitReferenceEntities.DeleteObject(exhibitreferenceentity);
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