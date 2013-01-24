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
    public class AuthoringRolePermissionsController: BaseController
    {
        
        private string table = AuthTable.Timeline.ToString();
        private string admin = Permission.admin.ToString();

 
        public AuthoringRolePermissionsController()
        {
            ViewBag.admin = false;
        }

        //
        // GET: /AuthoringRolePermissions/

        public ActionResult Index()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            var authoringtablerolepermissions = db.AuthoringTableRolePermissions.Include("AuthoringTable").Include("Role").Include("User").Include("User1");
            return View(authoringtablerolepermissions.ToList().Where(k => (k.IsDeleted == null || k.IsDeleted == false)).OrderBy(a => a.AuthoringTable.AuthoringTable1));
        }

        //
        // GET: /AuthoringRolePermissions/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            AuthoringTableRolePermission authoringtablerolepermission = db.AuthoringTableRolePermissions.Single(a => a.AuthoringTableRolePermissionID == id);
            return View(authoringtablerolepermission);
        }

        //
        // GET: /AuthoringRolePermissions/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            ViewBag.AuthoringTableID = new SelectList(db.AuthoringTables, "ID", "AuthoringTable1");
            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /AuthoringRolePermissions/Create

        [HttpPost]
        public ActionResult Create(AuthoringTableRolePermission authoringtablerolepermission)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                authoringtablerolepermission.AuthoringTableRolePermissionID = Guid.NewGuid();
                authoringtablerolepermission.CreatedBy = Guid.Parse(Session["userid"].ToString());
                authoringtablerolepermission.CreatedOn = DateTime.Now;
                db.AuthoringTableRolePermissions.AddObject(authoringtablerolepermission);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.AuthoringTableID = new SelectList(db.AuthoringTables, "ID", "AuthoringTable1", authoringtablerolepermission.AuthoringTableID);
            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1", authoringtablerolepermission.RoleID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", authoringtablerolepermission.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", authoringtablerolepermission.ModifiedBy);
            return View(authoringtablerolepermission);
        }
        
        //
        // GET: /AuthoringRolePermissions/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            AuthoringTableRolePermission authoringtablerolepermission = db.AuthoringTableRolePermissions.Single(a => a.AuthoringTableRolePermissionID == id);
            ViewBag.AuthoringTableID = new SelectList(db.AuthoringTables, "ID", "AuthoringTable1", authoringtablerolepermission.AuthoringTableID);
            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1", authoringtablerolepermission.RoleID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", authoringtablerolepermission.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", authoringtablerolepermission.ModifiedBy);
            return View(authoringtablerolepermission);
        }

        //
        // POST: /AuthoringRolePermissions/Edit/5

        [HttpPost]
        public ActionResult Edit(AuthoringTableRolePermission authoringtablerolepermission)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                db.AuthoringTableRolePermissions.Attach(authoringtablerolepermission);
                authoringtablerolepermission.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                authoringtablerolepermission.ModifiedOn = DateTime.Now;
                db.ObjectStateManager.ChangeObjectState(authoringtablerolepermission, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.AuthoringTableID = new SelectList(db.AuthoringTables, "ID", "AuthoringTable1", authoringtablerolepermission.AuthoringTableID);
            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1", authoringtablerolepermission.RoleID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", authoringtablerolepermission.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", authoringtablerolepermission.ModifiedBy);
            return View(authoringtablerolepermission);
        }

        //
        // GET: /AuthoringRolePermissions/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            AuthoringTableRolePermission authoringtablerolepermission = db.AuthoringTableRolePermissions.Single(a => a.AuthoringTableRolePermissionID == id);
            return View(authoringtablerolepermission);
        }

        //
        // POST: /AuthoringRolePermissions/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            AuthoringTableRolePermission authoringtablerolepermission = db.AuthoringTableRolePermissions.Single(a => a.AuthoringTableRolePermissionID == id);
            authoringtablerolepermission.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            authoringtablerolepermission.ModifiedOn = DateTime.Now;
            authoringtablerolepermission.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(authoringtablerolepermission, EntityState.Modified);
            //db.AuthoringTableRolePermissions.DeleteObject(authoringtablerolepermission);
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