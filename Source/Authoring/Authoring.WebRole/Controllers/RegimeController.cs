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
    public class RegimeController: BaseController
    {
        

        private string table = AuthTable.Regime.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public RegimeController()
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

            var regimes = db.Regimes.Where(r => (r.IsDeleted == null || r.IsDeleted == false)).Include("User").Include("User1");

            return View(regimes.ToList());
        }

        //
        // GET: /Regime/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            Regime regime = db.Regimes.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            return View(regime);
        }

        //
        // GET: /Regime/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        }

        //
        // POST: /Regime/Create

        [HttpPost]
        public ActionResult Create(Regime regime)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                regime.ID = Guid.NewGuid();
                regime.CreatedBy = Guid.Parse(Session["userid"].ToString());
                regime.CreatedOn = DateTime.Now;
                db.Regimes.AddObject(regime);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", regime.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", regime.ModifiedBy);
            return View(regime);
        }
        
        //
        // GET: /Regime/Edit/5

        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            Regime regime = db.Regimes.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", regime.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", regime.ModifiedBy);
            return View(regime);
        }

        //
        // POST: /Regime/Edit/5

        [HttpPost]
        public ActionResult Edit(Regime regime)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                regime.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                regime.ModifiedOn = DateTime.Now;
                db.Regimes.Attach(regime);
                db.ObjectStateManager.ChangeObjectState(regime, EntityState.Modified);                
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", regime.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", regime.ModifiedBy);
            return View(regime);
        }

        //
        // GET: /Regime/Delete/5

        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Regime regime = db.Regimes.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            return View(regime);
        }

        //
        // POST: /Regime/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Regime regime = db.Regimes.Single(r => r.ID == id && (r.IsDeleted == null || r.IsDeleted == false));
            regime.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            regime.ModifiedOn = DateTime.Now;
            //db.Regimes.DeleteObject(regime);
            regime.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(regime, EntityState.Modified);
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