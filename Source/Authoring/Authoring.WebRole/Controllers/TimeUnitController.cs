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
    public class TimeUnitController: BaseController
    {
        

        private string table = AuthTable.TimeUnit.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public TimeUnitController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /TimeUnit/

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
            var timeunits = db.TimeUnits.Where(tu => (tu.IsDeleted == null || tu.IsDeleted == false)).Include("User").Include("User1");
            return View(timeunits.ToList());
        }

        //
        // GET: /TimeUnit/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");
            TimeUnit timeunit = db.TimeUnits.Single(t => t.ID == id);
            return View(timeunit);
        }

        //
        // GET: /TimeUnit/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /TimeUnit/Create

        [HttpPost]
        public ActionResult Create(TimeUnit timeunit)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                timeunit.ID = Guid.NewGuid();
                timeunit.CreatedBy = Guid.Parse(Session["userid"].ToString());
                timeunit.CreatedOn = DateTime.Now;
                db.TimeUnits.AddObject(timeunit);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timeunit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timeunit.ModifiedBy);
            return View(timeunit);
        }
        
        //
        // GET: /TimeUnit/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            TimeUnit timeunit = db.TimeUnits.Single(t => t.ID == id);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timeunit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timeunit.ModifiedBy);
            return View(timeunit);
        }

        //
        // POST: /TimeUnit/Edit/5

        [HttpPost]
        public ActionResult Edit(TimeUnit timeunit)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                timeunit.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                timeunit.ModifiedOn = DateTime.Now;
                db.TimeUnits.Attach(timeunit);
                db.ObjectStateManager.ChangeObjectState(timeunit, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timeunit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timeunit.ModifiedBy);
            return View(timeunit);
        }

        //
        // GET: /TimeUnit/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            TimeUnit timeunit = db.TimeUnits.Single(t => t.ID == id);
            return View(timeunit);
        }

        //
        // POST: /TimeUnit/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            TimeUnit timeunit = db.TimeUnits.Single(t => t.ID == id);
            timeunit.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            timeunit.ModifiedOn = DateTime.Now;
            timeunit.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(timeunit, EntityState.Modified);
            //db.TimeUnits.DeleteObject(timeunit);
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