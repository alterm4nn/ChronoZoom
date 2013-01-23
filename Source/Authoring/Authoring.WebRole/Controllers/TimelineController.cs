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
    public class TimelineController: BaseController
    {
        
        private string table = AuthTable.Timeline.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        private const decimal GA = -1000000000;
        private const decimal MA = -1000000;
        private const decimal KA = -1000;
        private const decimal BCE = -1;
        private const decimal CE = 1;

        public TimelineController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /Timeline/

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

            var timelines = db.Timelines.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("Regime").Include("Threshold").Include("Timeline2").Include("User").Include("User1");
            return View(timelines.ToList().OrderBy(t => t.Title));
        }

        //
        // GET: /Timeline/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            Timeline timeline = db.Timelines.Single(t => t.ID == id && (t.IsDeleted == null ||t.IsDeleted == false));
            return View(timeline);
        }

        //
        // GET: /Timeline/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            populateLists();
            return View();
        } 

        //
        // POST: /Timeline/Create

        [HttpPost]
        public ActionResult Create(Timeline timeline)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (!ModelState.IsValid)
            {
                populateListsWithSelection(timeline);
                return View(timeline);
            }

            Timeline parentTimeline = db.Timelines.Where(t => t.ID == timeline.ParentTimelineID).FirstOrDefault();
            TimeUnit fromTimeUnit = db.TimeUnits.Where(t => t.ID == timeline.FromTimeUnit).FirstOrDefault();
            TimeUnit toTimeUnit = db.TimeUnits.Where(t => t.ID == timeline.ToTimeUnit).FirstOrDefault();


            if (isInBounds(timeline, parentTimeline, fromTimeUnit, toTimeUnit))
            {
                timeline.ID = Guid.NewGuid();
                timeline.CreatedBy = Guid.Parse(Session["userid"].ToString());
                timeline.CreatedOn = DateTime.Now;
                db.Timelines.AddObject(timeline);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            populateListsWithSelection(timeline);
            return View(timeline);
        }

        public ActionResult CreateFromCopy(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Timeline timeline = db.Timelines.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            populateListsWithSelection(timeline);
            return View(timeline);
        }
        //
        // GET: /Timeline/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Timeline timeline = db.Timelines.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            populateListsWithSelection(timeline);
            return View(timeline);
        }

        //
        // POST: /Timeline/Edit/5

        [HttpPost]
        public ActionResult Edit(Timeline timeline)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (!ModelState.IsValid)
            {
                populateListsWithSelection(timeline);
                return View(timeline);
            }

            Timeline parentTimeline = db.Timelines.Where(t => t.ID == timeline.ParentTimelineID).FirstOrDefault();
            TimeUnit fromTimeUnit = db.TimeUnits.Where(t => t.ID == timeline.FromTimeUnit).FirstOrDefault();
            TimeUnit toTimeUnit = db.TimeUnits.Where(t => t.ID == timeline.ToTimeUnit).FirstOrDefault();


            if (isInBounds(timeline, parentTimeline, fromTimeUnit, toTimeUnit))
            {
                timeline.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                timeline.ModifiedOn = DateTime.Now;
                db.Timelines.Attach(timeline);
                db.ObjectStateManager.ChangeObjectState(timeline, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            
            populateListsWithSelection(timeline);
            return View(timeline);
        }

        //
        // GET: /Timeline/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Timeline timeline = db.Timelines.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            return View(timeline);
        }

        //
        // POST: /Timeline/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Timeline timeline = db.Timelines.Single(t => t.ID == id && (t.IsDeleted == null || t.IsDeleted == false));
            timeline.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            timeline.ModifiedOn = DateTime.Now;
            timeline.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(timeline, EntityState.Modified);
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
            ViewBag.ParentTimelineID = new SelectList(db.Timelines.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Title), "ID", "Title");
            ViewBag.FromTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1");
            ViewBag.ToTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
        }
        private void populateListsWithSelection(Timeline timeline)
        {
            ViewBag.RegimeID = new SelectList(db.Regimes.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(r => r.Regime1), "ID", "Regime1", timeline.RegimeID);
            ViewBag.ThresholdID = new SelectList(db.Thresholds.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Threshold1), "ID", "Threshold1", timeline.ThresholdID);
            ViewBag.FromTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", timeline.FromTimeUnit);
            ViewBag.ToTimeUnit = new SelectList(db.TimeUnits.Where(tu => tu.IsDeleted == null || tu.IsDeleted == false), "ID", "TimeUnit1", timeline.ToTimeUnit);
            ViewBag.ParentTimelineID = new SelectList(db.Timelines.Where(r => r.IsDeleted == null || r.IsDeleted == false).OrderBy(t => t.Title), "ID", "Title", timeline.ParentTimelineID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", timeline.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", timeline.ModifiedBy);
        }

        private bool isValidTime(decimal? year, string timeUnit, out string errorMessage)
        {
            errorMessage = string.Empty;
            if (!year.HasValue)
            {
                errorMessage = "Required";
                return false;
            }
            if (string.IsNullOrEmpty(timeUnit))
            {
                errorMessage = "Required";
                return false;
            }
            if (year.Value == 0 && (timeUnit == "CE" || timeUnit == "BCE"))
            {
                errorMessage = "Content year cannot be 0 when TimeUnit is CE or BCE.";
                return false;
            }
            return true;
        }

        private bool isInBounds(Timeline timeline, Timeline parentTimeline, TimeUnit fromTimeUnit, TimeUnit toTimeUnit)
        {
            decimal fromTime = 0, toTime = 0;
            string toTimeUnitValue = toTimeUnit.TimeUnit1.ToUpper();
            string fromTimeUnitValue = fromTimeUnit.TimeUnit1.ToUpper();

            if (timeline.ToContentYear == 0 && (toTimeUnitValue == "GA" || toTimeUnitValue == "MA" || toTimeUnitValue == "KA"))
                return true;

            if (timeline.FromContentYear == 0)
            {
                ModelState.AddModelError("FromContentYear", "From content year cannot be 0.");
                return false;
            }

            //Validate Toyear and timeunit
            if (timeline.ToContentYear == 0 && (toTimeUnitValue == "CE" || toTimeUnitValue == "BCE"))
            {
                ModelState.AddModelError("ToContentYear", "To content year cannot be 0 for timeunits CE and BCE.");
                return false;
            }

            if (!checkLimits(timeline.FromContentYear, fromTimeUnitValue))
            {
                ModelState.AddModelError("FromContentYear", "From content year must be within the range of the selected timeunit.");
                return false;
            }
            if (!checkLimits(timeline.ToContentYear, toTimeUnitValue))
            {
                ModelState.AddModelError("ToContentYear", "To content year must be within the range of the selected timeunit.");
                return false;
            }

            if (!checkTimeunits(fromTimeUnitValue, toTimeUnitValue))
            {
                ModelState.AddModelError("ToTimeUnit", "ToTimeUnit must be within the bounds of the FromTimeUnit.");
                return false;
            }

            fromTime = timeline.FromContentYear * determineFactor(fromTimeUnitValue);
            toTime = timeline.ToContentYear * determineFactor(toTimeUnitValue);

            if (toTime < fromTime)
            {
                ModelState.AddModelError("ToContentYear", "ToContent year must be greater than the fromContent year.");
                return false;
            }
            
            if (parentTimeline != null)
            {
                return isInBoundsWithParent(timeline, parentTimeline, fromTimeUnit, toTimeUnit);
            }

            return true;
        }

        private bool checkLimits(decimal year, string timeUnit)
        {
            switch (timeUnit)
            {
                case "GA":
                    if (year < 0 || year > 13.70M)
                        return false;
                    break;
                case "MA":
                case "KA":
                    if (year < 0 || year > 100.00M)
                        return false;
                    break;
                case "BCE":
                    if (year < 0 || year > 8000.00M)
                        return false;
                    break;
            }
            return true;
        }

        private bool checkTimeunits(string from, string to)
        {
            switch (from)
            {
                case "MA":
                    if (to == "GA")
                        return false;
                    break;
                case "KA":
                    if (to == "GA" || to == "MA")
                        return false;
                    break;
                case "BCE":
                    if (to != "BCE" && to != "CE")
                        return false;
                    break;
                case "CE":
                    if (to != "CE")
                        return false;
                    break;
            }
            return true;
        }

        private bool isInBoundsWithParent(Timeline timeline, Timeline parentTimeline, TimeUnit fromTimeUnit, TimeUnit toTimeUnit)
        {
            bool isYearValid = true;
            decimal parentTime = 0, childTime = 0;
            string parentFromTimeUnit = parentTimeline.TimeUnit.TimeUnit1.ToUpper();
            string childFromTimeUnit = fromTimeUnit.TimeUnit1.ToUpper();
            string parentToTimeUnit = parentTimeline.TimeUnit1.TimeUnit1.ToUpper();
            string childToTimeUnit = toTimeUnit.TimeUnit1.ToUpper();

            parentTime = parentTimeline.FromContentYear * determineFactor(parentFromTimeUnit);
            childTime = timeline.FromContentYear * determineFactor(childFromTimeUnit);

            if (childTime < parentTime)
            {
                isYearValid = false;
            }
            
            if (!isYearValid)
            {
                ModelState.AddModelError("FromContentYear", "Child timeline must be within the bounds of the parent timeline");
                return false;
            }

            if (!(parentTimeline.ToContentYear == 0 && (parentToTimeUnit == "GA" || parentToTimeUnit == "MA" || parentToTimeUnit == "KA"))) //if 0 then its today
            {
                parentTime = parentTimeline.ToContentYear * determineFactor(parentToTimeUnit);
                childTime = timeline.ToContentYear * determineFactor(childToTimeUnit);
                
                if (childTime > parentTime)
                {
                    isYearValid = false;
                }
            }

            if (!isYearValid)
            {
                ModelState.AddModelError("ToContentYear", "Child timeline must be within the bounds of the parent timeline");
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