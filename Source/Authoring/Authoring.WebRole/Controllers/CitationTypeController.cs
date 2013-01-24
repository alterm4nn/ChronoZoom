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
    public class CitationTypeController: BaseController
    {
        
        private string table = AuthTable.CitationType.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public CitationTypeController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }

        //
        // GET: /CitationType/

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

            var citationtypes = db.CitationTypes.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("User").Include("User1");
            return View(citationtypes.ToList());
        }

        //
        // GET: /CitationType/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            CitationType citationtype = db.CitationTypes.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            return View(citationtype);
        }

        //
        // GET: /CitationType/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /CitationType/Create

        [HttpPost]
        public ActionResult Create(CitationType citationtype)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                citationtype.ID = Guid.NewGuid();
                citationtype.CreatedBy = Guid.Parse(Session["userid"].ToString());
                citationtype.CreatedOn = DateTime.Now;
                db.CitationTypes.AddObject(citationtype);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", citationtype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", citationtype.ModifiedBy);
            return View(citationtype);
        }
        
        //
        // GET: /CitationType/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            CitationType citationtype = db.CitationTypes.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", citationtype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", citationtype.ModifiedBy);
            return View(citationtype);
        }

        //
        // POST: /CitationType/Edit/5

        [HttpPost]
        public ActionResult Edit(CitationType citationtype)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                citationtype.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                citationtype.ModifiedOn = DateTime.Now;
                db.CitationTypes.Attach(citationtype);
                db.ObjectStateManager.ChangeObjectState(citationtype, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", citationtype.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", citationtype.ModifiedBy);
            return View(citationtype);
        }

        //
        // GET: /CitationType/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            CitationType citationtype = db.CitationTypes.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            return View(citationtype);
        }

        //
        // POST: /CitationType/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            CitationType citationtype = db.CitationTypes.Single(c => c.ID == id && (c.IsDeleted == null || c.IsDeleted == false));
            citationtype.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            citationtype.ModifiedOn = DateTime.Now;
            citationtype.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(citationtype, EntityState.Modified);
            //db.CitationTypes.DeleteObject(citationtype);
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