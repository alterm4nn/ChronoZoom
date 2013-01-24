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
    public class RoleController: BaseController
    {
        
        private string table = AuthTable.Timeline.ToString();
        private string admin = Permission.admin.ToString();

 
        public RoleController()
        {
            ViewBag.admin = false;
        }
       //
        // GET: /Role/

        public ActionResult Index()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            var roles = db.Roles.Include("User").Include("User1");
            return View(roles.ToList().Where(k => (k.IsDeleted == null || k.IsDeleted == false)));
        }

        //
        // GET: /Role/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Role role = db.Roles.Single(r => r.ID == id);
            return View(role);
        }

        //
        // GET: /Role/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /Role/Create

        [HttpPost]
        public ActionResult Create(Role role)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                role.ID = Guid.NewGuid();
                role.CreatedBy = Guid.Parse(Session["userid"].ToString());
                role.CreatedOn = DateTime.Now;
                db.Roles.AddObject(role);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", role.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", role.ModifiedBy);
            return View(role);
        }
        
        //
        // GET: /Role/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Role role = db.Roles.Single(r => r.ID == id);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", role.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", role.ModifiedBy);
            return View(role);
        }

        //
        // POST: /Role/Edit/5

        [HttpPost]
        public ActionResult Edit(Role role)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                role.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                role.ModifiedOn = DateTime.Now;
                db.Roles.Attach(role);
                db.ObjectStateManager.ChangeObjectState(role, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", role.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", role.ModifiedBy);
            return View(role);
        }

        //
        // GET: /Role/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Role role = db.Roles.Single(r => r.ID == id);
            return View(role);
        }

        //
        // POST: /Role/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            Role role = db.Roles.Single(r => r.ID == id);
            role.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            role.ModifiedOn = DateTime.Now;
            role.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(role, EntityState.Modified);
            //db.Roles.DeleteObject(role);
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