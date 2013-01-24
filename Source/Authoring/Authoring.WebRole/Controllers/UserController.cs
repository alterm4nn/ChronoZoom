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
    public class UserController: BaseController
    {
        
        private string table = AuthTable.Timeline.ToString();
        private string admin = Permission.admin.ToString();

        public UserController()
        {
            ViewBag.admin = false;
        }

        //
        // GET: /User/

        public ActionResult Index()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            var users = db.Users.Include("Role").Include("User2").Include("User3");
            return View(users.ToList().Where(k => (k.IsDeleted == null || k.IsDeleted == false)).OrderBy(u => u.UserName));
        }

        //
        // GET: /User/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            User user = db.Users.Single(u => u.ID == id);
            return View(user);
        }

        //
        // GET: /User/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /User/Create

        [HttpPost]
        public ActionResult Create(User user)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                user.ID = Guid.NewGuid();
                user.CreatedBy = Guid.Parse(Session["userid"].ToString());
                user.CreatedOn = DateTime.Now;
                db.Users.AddObject(user);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1", user.RoleID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", user.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", user.ModifiedBy);
            return View(user);
        }
        
        //
        // GET: /User/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            User user = db.Users.Single(u => u.ID == id);
            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1", user.RoleID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", user.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", user.ModifiedBy);
            return View(user);
        }

        //
        // POST: /User/Edit/5

        [HttpPost]
        public ActionResult Edit(User user)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                user.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                user.ModifiedOn = DateTime.Now;
                db.Users.Attach(user);
                db.ObjectStateManager.ChangeObjectState(user, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.RoleID = new SelectList(db.Roles, "ID", "Role1", user.RoleID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", user.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", user.ModifiedBy);
            return View(user);
        }

        //
        // GET: /User/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            User user = db.Users.Single(u => u.ID == id);
            return View(user);
        }

        //
        // POST: /User/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, admin))
                return RedirectToAction("Index", "Home");

            User user = db.Users.Single(u => u.ID == id);
            user.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            user.ModifiedOn = DateTime.Now;
            user.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(user, EntityState.Modified);
            //db.Users.DeleteObject(user);
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