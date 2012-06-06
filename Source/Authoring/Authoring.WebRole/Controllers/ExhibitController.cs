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
    public class ExhibitController: BaseController
    {
        
        private string table = AuthTable.Exhibit.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ExhibitController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /Exhibit/

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

            var exhibits = db.Exhibits.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("Regime").Include("Threshold").Include("User").Include("User1");
            return View(exhibits.ToList());
        }

        //
        // GET: /Exhibit/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            Exhibit exhibit = db.Exhibits.Single(e => e.ID == id && (e.IsDeleted == null || e.IsDeleted == false));
            return View(exhibit);
        }

        //
        // GET: /Exhibit/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            populateLists();
            return View();
        } 

        //
        // POST: /Exhibit/Create

        [HttpPost]
        public ActionResult Create(Exhibit exhibit)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibit.ID = Guid.NewGuid();
                exhibit.CreatedBy = Guid.Parse(Session["userid"].ToString());
                exhibit.CreatedOn = DateTime.Now;
                db.Exhibits.AddObject(exhibit);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            populateListsWithSelection(exhibit);
            return View(exhibit);
        }

        public ActionResult CreateFromCopy(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Exhibit exhibit = db.Exhibits.Single(e => e.ID == id && (e.IsDeleted == null || e.IsDeleted == false));
            populateListsWithSelection(exhibit);
            return View(exhibit);
        }

        //
        // GET: /Exhibit/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Exhibit exhibit = db.Exhibits.Single(e => e.ID == id && (e.IsDeleted == null || e.IsDeleted == false));
            populateListsWithSelection(exhibit);
            return View(exhibit);
        }

        //
        // POST: /Exhibit/Edit/5

        [HttpPost]
        public ActionResult Edit(Exhibit exhibit)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibit.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                exhibit.ModifiedOn = DateTime.Now;
                db.Exhibits.Attach(exhibit);
                db.ObjectStateManager.ChangeObjectState(exhibit, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            populateListsWithSelection(exhibit);
            return View(exhibit);
        }

        //
        // GET: /Exhibit/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Exhibit exhibit = db.Exhibits.Single(e => e.ID == id && (e.IsDeleted == null || e.IsDeleted == false));
            return View(exhibit);
        }

        //
        // POST: /Exhibit/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Exhibit exhibit = db.Exhibits.Single(e => e.ID == id && (e.IsDeleted == null || e.IsDeleted == false));
            exhibit.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            exhibit.ModifiedOn = DateTime.Now;
            exhibit.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(exhibit, EntityState.Modified);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        private void populateLists()
        {
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Regime1), "ID", "Regime1");
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Threshold1), "ID", "Threshold1");
            ViewBag.TimeUnitID = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
        }
        private void populateListsWithSelection(Exhibit exhibit)
        {
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Regime1), "ID", "Regime1", exhibit.RegimeID);
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Threshold1), "ID", "Threshold1", exhibit.ThresholdID);
            ViewBag.TimeUnitID = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", exhibit.TimeUnitID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibit.ModifiedBy);
        }

    }
}