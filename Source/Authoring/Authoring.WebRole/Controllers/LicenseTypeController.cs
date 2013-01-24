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
    public class LicenseTypeController: BaseController
    {
        

        private string table = AuthTable.LicenseType.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public LicenseTypeController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /LicenseType/

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
            var licensetypes = db.LicenseTypes.Where(l => (l.IsDeleted == null || l.IsDeleted == false)).Include("User").Include("User1");
            return View(licensetypes.ToList());
        }

        //
        // GET: /LicenseType/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");
            LicenseType licensetype = db.LicenseTypes.Single(l => l.ID == id && (l.IsDeleted == null || l.IsDeleted == false));
            return View(licensetype);
        }

        //
        // GET: /LicenseType/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /LicenseType/Create

        [HttpPost]
        public ActionResult Create(LicenseType licensetype)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                licensetype.ID = Guid.NewGuid();
                licensetype.CreatedBy = Guid.Parse(Session["userid"].ToString());
                licensetype.CreatedOn = DateTime.Now;
                db.LicenseTypes.AddObject(licensetype);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", licensetype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", licensetype.ModifiedBy);
            return View(licensetype);
        }
        
        //
        // GET: /LicenseType/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            LicenseType licensetype = db.LicenseTypes.Single(l => l.ID == id && (l.IsDeleted == null || l.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", licensetype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", licensetype.ModifiedBy);
            return View(licensetype);
        }

        //
        // POST: /LicenseType/Edit/5

        [HttpPost]
        public ActionResult Edit(LicenseType licensetype)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                licensetype.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                licensetype.ModifiedOn = DateTime.Now;
                db.LicenseTypes.Attach(licensetype);
                db.ObjectStateManager.ChangeObjectState(licensetype, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", licensetype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", licensetype.ModifiedBy);
            return View(licensetype);
        }

        //
        // GET: /LicenseType/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            LicenseType licensetype = db.LicenseTypes.Single(l => l.ID == id && (l.IsDeleted == null || l.IsDeleted == false));
            return View(licensetype);
        }

        //
        // POST: /LicenseType/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            LicenseType licensetype = db.LicenseTypes.Single(l => l.ID == id && (l.IsDeleted == null || l.IsDeleted == false));
            licensetype.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            licensetype.ModifiedOn = DateTime.Now;
            licensetype.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(licensetype, EntityState.Modified);
            //db.LicenseTypes.DeleteObject(licensetype);
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