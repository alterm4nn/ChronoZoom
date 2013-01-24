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
    public class AuthoringTableController: BaseController
    {
        
       
        private string table = AuthTable.AuthoringTable.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();
        
        //
        // GET: /AuthoringTable/

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
            if (ViewBag.read)
            {
                var authoringtables = db.AuthoringTables.Where(a => (a.IsDeleted == null || a.IsDeleted == false)).Include("User").Include("User1");
                return View(authoringtables.ToList());
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        //
        // GET: /AuthoringTable/Details/5

        public ActionResult Details(Guid id)
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, read);
            if (permission)
            {
                AuthoringTable authoringtable = db.AuthoringTables.Single(a => a.ID == id && (a.IsDeleted == null || a.IsDeleted == false));
                return View(authoringtable);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        //
        // GET: /AuthoringTable/Create

        public ActionResult Create()
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, write);
            if (permission)
            {
                ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
                ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        //
        // POST: /AuthoringTable/Create

        [HttpPost]
        public ActionResult Create(AuthoringTable authoringtable)
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, write);
            if (permission)
            {
                if (ModelState.IsValid)
                {
                    authoringtable.ID = Guid.NewGuid();
                    authoringtable.CreatedBy = Guid.Parse(Session["userid"].ToString());
                    authoringtable.CreatedOn = DateTime.Now;
                    db.AuthoringTables.AddObject(authoringtable);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }

                ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", authoringtable.CreatedBy);
                ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", authoringtable.ModifiedBy);
                return View(authoringtable);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
        
        //
        // GET: /AuthoringTable/Edit/5

        public ActionResult Edit(Guid id)
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, write);
            if (permission)
            {
                AuthoringTable authoringtable = db.AuthoringTables.Single(a => a.ID == id && (a.IsDeleted == null || a.IsDeleted == false));
                ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", authoringtable.CreatedBy);
                ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", authoringtable.ModifiedBy);
                return View(authoringtable);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        //
        // POST: /AuthoringTable/Edit/5

        [HttpPost]
        public ActionResult Edit(AuthoringTable authoringtable)
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, write);
            if (permission)
            {
                if (ModelState.IsValid)
                {
                    authoringtable.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                    authoringtable.ModifiedOn = DateTime.Now;
                    db.ObjectStateManager.ChangeObjectState(authoringtable, EntityState.Modified);
                    db.AuthoringTables.Attach(authoringtable);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
                ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", authoringtable.CreatedBy);
                ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", authoringtable.ModifiedBy);
                return View(authoringtable);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        //
        // GET: /AuthoringTable/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete);
            if (permission)
            {
            AuthoringTable authoringtable = db.AuthoringTables.Single(a => a.ID == id && (a.IsDeleted == null || a.IsDeleted == false));
            return View(authoringtable);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        //
        // POST: /AuthoringTable/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            bool permission = Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete);
            if (permission)
            {
                AuthoringTable authoringtable = db.AuthoringTables.Single(a => a.ID == id && (a.IsDeleted == null || a.IsDeleted == false));
                //db.AuthoringTables.DeleteObject(authoringtable);
                authoringtable.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                authoringtable.ModifiedOn = DateTime.Now;
                authoringtable.IsDeleted = true;
                db.ObjectStateManager.ChangeObjectState(authoringtable, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}