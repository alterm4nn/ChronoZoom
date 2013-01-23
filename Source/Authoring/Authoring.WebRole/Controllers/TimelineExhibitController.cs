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
    public class TimelineExhibitController: BaseController
    {
        
        private string table = AuthTable.TimelineExhibit.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        private const decimal GA = -1000000000;
        private const decimal MA = -1000000;
        private const decimal KA = -1000;
        private const decimal BCE = -1;
        private const decimal CE = 1;

        public TimelineExhibitController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /TimelineExhibit/

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

            var timelineexhibits = db.TimelineExhibits.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("Exhibit").Include("Timeline").Include("User").Include("User1");
            return View(timelineexhibits.ToList());
        }

        //
        // GET: /TimelineExhibit/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            TimelineExhibit timelineexhibit = db.TimelineExhibits.Single(t => t.TimelineExhibitID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(timelineexhibit);
        }

        //
        // GET: /TimelineExhibit/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderByDescending(e => e.CreatedOn), "ID", "Title");
            ViewBag.TimelineID = new SelectList(db.Timelines.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Title), "ID", "Title");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /TimelineExhibit/Create

        [HttpPost]
        public ActionResult Create(TimelineExhibit timelineexhibit)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {

                Exhibit exhibit = db.Exhibits.Where(e => e.ID == timelineexhibit.ExhibitID).FirstOrDefault();
                Timeline timeline = db.Timelines.Where(t => t.ID == timelineexhibit.TimelineID).FirstOrDefault();

                if (isValid(timeline, exhibit))
                {
                    timelineexhibit.TimelineExhibitID = Guid.NewGuid();
                    timelineexhibit.CreatedBy = Guid.Parse(Session["userid"].ToString());
                    timelineexhibit.CreatedOn = DateTime.Now;
                    db.TimelineExhibits.AddObject(timelineexhibit);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }

            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderByDescending(e => e.CreatedOn), "ID", "Title", timelineexhibit.ExhibitID);
            ViewBag.TimelineID = new SelectList(db.Timelines.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Title), "ID", "Title", timelineexhibit.TimelineID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timelineexhibit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timelineexhibit.ModifiedBy);
            return View(timelineexhibit);
        }
        
        //
        // GET: /TimelineExhibit/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            TimelineExhibit timelineexhibit = db.TimelineExhibits.Single(t => t.TimelineExhibitID == id && (t.IsDeleted == null || t.IsDeleted == false));
            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderByDescending(e => e.CreatedOn), "ID", "Title", timelineexhibit.ExhibitID);
            ViewBag.TimelineID = new SelectList(db.Timelines.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Title), "ID", "Title", timelineexhibit.TimelineID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timelineexhibit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timelineexhibit.ModifiedBy);
            return View(timelineexhibit);
        }

        //
        // POST: /TimelineExhibit/Edit/5

        [HttpPost]
        public ActionResult Edit(TimelineExhibit timelineexhibit)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {

                Exhibit exhibit = db.Exhibits.Where(e => e.ID == timelineexhibit.ExhibitID).FirstOrDefault();
                Timeline timeline = db.Timelines.Where(t => t.ID == timelineexhibit.TimelineID).FirstOrDefault();
                if (isValid(timeline, exhibit))
                {
                    timelineexhibit.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                    timelineexhibit.ModifiedOn = DateTime.Now;
                    db.TimelineExhibits.Attach(timelineexhibit);
                    db.ObjectStateManager.ChangeObjectState(timelineexhibit, EntityState.Modified);
                    db.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            ViewBag.ExhibitID = new SelectList(db.Exhibits.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderByDescending(e => e.CreatedOn), "ID", "Title", timelineexhibit.ExhibitID);
            ViewBag.TimelineID = new SelectList(db.Timelines.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Title), "ID", "Title", timelineexhibit.TimelineID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timelineexhibit.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timelineexhibit.ModifiedBy);
            return View(timelineexhibit);
        }

        //
        // GET: /TimelineExhibit/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            TimelineExhibit timelineexhibit = db.TimelineExhibits.Single(t => t.TimelineExhibitID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(timelineexhibit);
        }

        //
        // POST: /TimelineExhibit/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            TimelineExhibit timelineexhibit = db.TimelineExhibits.Single(t => t.TimelineExhibitID == id && (t.IsDeleted == null || t.IsDeleted == false));
            timelineexhibit.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            timelineexhibit.ModifiedOn = DateTime.Now;
            timelineexhibit.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(timelineexhibit, EntityState.Modified);
            //db.TimelineExhibits.DeleteObject(timelineexhibit);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        private bool isValid(Timeline timeline, Exhibit exhibit)
        {
            if (timeline == null)
            {
                ModelState.AddModelError("TimelineID", "Timeline is required.");
                return false;
            }

            if (exhibit == null)
            {
                ModelState.AddModelError("ExhibitID", "Exhibit is required.");
                return false;
            }

            return isInBoundsWithParent(exhibit, timeline);
        }

        private bool isInBoundsWithParent(Exhibit exhibit, Timeline timeline)
        {
            bool isYearValid = true;
            string childTimeUnit = exhibit.TimeUnit.TimeUnit1.ToUpper();
            string parentFromTimeUnit = timeline.TimeUnit.TimeUnit1.ToUpper();
            string parentToTimeUnit = timeline.TimeUnit1.TimeUnit1.ToUpper();
           
            decimal parentTime = timeline.FromContentYear * determineFactor(parentFromTimeUnit);
            decimal childTime = exhibit.ContentYear.Value * determineFactor(childTimeUnit);

            if (childTime < parentTime)
            {
                isYearValid = false;
            }
            
            if (!isYearValid)
            {
                ModelState.AddModelError("ExhibitID", "Exhibit ContentYear and Timeunit must be within the bounds of the timeline");
                return false;
            }

            if (!(timeline.ToContentYear == 0 && (parentToTimeUnit == "GA" || parentToTimeUnit == "MA" || parentToTimeUnit  == "KA"))) //if 0 then its today
            {
                parentTime = timeline.ToContentYear * determineFactor(parentToTimeUnit);

                if (childTime > parentTime)
                {
                    isYearValid = false;
                }
            }

            if (!isYearValid)
            {
                ModelState.AddModelError("ExhibitID", "Exhibit ContentYear and Timeunit must be within the bounds of the timeline");
                return false;
            }

            return true;
        }

        private decimal determineFactor(string timeUnit)
        {
            switch (timeUnit)
            {
                case "GA":
                    return GA;
                case "MA":
                    return MA;
                case "KA":
                    return KA;
                case "BCE":
                    return BCE;
                case "CE":
                    return CE;
            }
            return 0;
        }

    }
}