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
    public class PermissionController: BaseController
    {
        
        private string table = AuthTable.Timeline.ToString();
        private string admin = Permission.admin.ToString();

        public PermissionController()
        {
            ViewBag.admin = false;
        }
        //
        // GET: /Permission/

        public ActionResult Index()
        {
            string permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name);
            if (permission == admin)
                ViewBag.admin = true;
            else
                ViewBag.admin = false;

            if (!ViewBag.admin)
                return RedirectToAction("Index", "Home");
            var permissions = db.Permissions.Include("User").Include("User1");
            return View(permissions.ToList().Where(k => (k.IsDeleted == null || k.IsDeleted == false)));
        }

        //
        // GET: /Permission/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Authoring.WebRole.Models.Permission permission = db.Permissions.Single(p => p.ID == id);
            return View(permission);
        }

        //
        // GET: /Permission/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");
            
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /Permission/Create

        [HttpPost]
        public ActionResult Create(Authoring.WebRole.Models.Permission permission)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                permission.ID = Guid.NewGuid();
                permission.CreatedBy = Guid.Parse(Session["userid"].ToString());
                permission.CreatedOn = DateTime.Now;
                db.Permissions.AddObject(permission);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", permission.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", permission.ModifiedBy);
            return View(permission);
        }
        
        //
        // GET: /Permission/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Authoring.WebRole.Models.Permission permission = db.Permissions.Single(p => p.ID == id);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", permission.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", permission.ModifiedBy);
            return View(permission);
        }

        //
        // POST: /Permission/Edit/5

        [HttpPost]
        public ActionResult Edit(Authoring.WebRole.Models.Permission permission)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                db.Permissions.Attach(permission);
                permission.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                permission.ModifiedOn = DateTime.Now;
                db.ObjectStateManager.ChangeObjectState(permission, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", permission.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", permission.ModifiedBy);
            return View(permission);
        }

        //
        // GET: /Permission/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Authoring.WebRole.Models.Permission permission = db.Permissions.Single(p => p.ID == id);
            return View(permission);
        }

        //
        // POST: /Permission/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Authoring.WebRole.Models.Permission permission = db.Permissions.Single(p => p.ID == id);
            permission.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            permission.ModifiedOn = DateTime.Now;
            permission.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(permission, EntityState.Modified);
            //db.Permissions.DeleteObject(permission);
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