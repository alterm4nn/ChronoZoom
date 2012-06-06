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
    public class ThresholdController: BaseController
    {
        
        private string table = AuthTable.Threshold.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ThresholdController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /Regime/

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

            var thresholds = db.Thresholds.Where(t => (t.IsDeleted == null || t.IsDeleted == false)).Include("BookMark").Include("TimeUnit").Include("User").Include("User1");
            return View(thresholds.ToList());
        }

        //
        // GET: /Threshold/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");
            Threshold threshold = db.Thresholds.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(threshold);
        }

        //
        // GET: /Threshold/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ThresholdTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1");
            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name");
            return View();
        } 

        //
        // POST: /Threshold/Create

        [HttpPost]
        public ActionResult Create(Threshold threshold)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                threshold.ID = Guid.NewGuid();
                threshold.CreatedBy = Guid.Parse(Session["userid"].ToString());
                threshold.CreatedOn = DateTime.Now;
                db.Thresholds.AddObject(threshold);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", threshold.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", threshold.ModifiedBy);
            ViewBag.ThresholdTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1");
            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name");
            return View(threshold);
        }
        
        //
        // GET: /Threshold/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            Threshold threshold = db.Thresholds.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", threshold.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", threshold.ModifiedBy);
            ViewBag.ThresholdTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", threshold.ThresholdTimeUnit);
            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name");
            return View(threshold);
        }

        //
        // POST: /Threshold/Edit/5

        [HttpPost]
        public ActionResult Edit(Threshold threshold)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                threshold.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                threshold.ModifiedOn = DateTime.Now;
                db.Thresholds.Attach(threshold);
                db.ObjectStateManager.ChangeObjectState(threshold, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", threshold.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", threshold.ModifiedBy);
            ViewBag.ThresholdTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", threshold.ThresholdTimeUnit);
            ViewBag.BookmarkID = new SelectList(db.BookMarks.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "Name");
            return View(threshold);
        }

        //
        // GET: /Threshold/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            Threshold threshold = db.Thresholds.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(threshold);
        }

        //
        // POST: /Threshold/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            Threshold threshold = db.Thresholds.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            threshold.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            threshold.ModifiedOn = DateTime.Now;
            threshold.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(threshold, EntityState.Modified);
            //db.Thresholds.DeleteObject(threshold);
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