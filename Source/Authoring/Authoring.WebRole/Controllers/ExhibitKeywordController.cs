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
    public class ExhibitKeywordController: BaseController
    {
        
        private string table = AuthTable.ExhibitKeyword.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ExhibitKeywordController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
       //
        // GET: /ExhibitKeyword/

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

            var exhibitkeywords = db.ExhibitKeywords.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("Exhibit").Include("Keyword").Include("User").Include("User1");
            return View(exhibitkeywords.ToList());
        }

        //
        // GET: /ExhibitKeyword/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            ExhibitKeyword exhibitkeyword = db.ExhibitKeywords.Single(e => e.ExhibitKeywordID == id && (e.IsDeleted == null || e.IsDeleted == false));
            return View(exhibitkeyword);
        }

        //
        // GET: /ExhibitKeyword/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.ExhibitID = new SelectList(db.Exhibits, "ID", "Title");
            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /ExhibitKeyword/Create

        [HttpPost]
        public ActionResult Create(ExhibitKeyword exhibitkeyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibitkeyword.ExhibitKeywordID = Guid.NewGuid();
                exhibitkeyword.CreatedBy = Guid.Parse(Session["userid"].ToString());
                exhibitkeyword.CreatedOn = DateTime.Now;
                db.ExhibitKeywords.AddObject(exhibitkeyword);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.ExhibitID = new SelectList(db.Exhibits, "ID", "Title", exhibitkeyword.ExhibitID);
            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1", exhibitkeyword.KeywordID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitkeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitkeyword.ModifiedBy);
            return View(exhibitkeyword);
        }
        
        //
        // GET: /ExhibitKeyword/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ExhibitKeyword exhibitkeyword = db.ExhibitKeywords.Single(e => e.ExhibitKeywordID == id && (e.IsDeleted == null || e.IsDeleted == false));
            ViewBag.ExhibitID = new SelectList(db.Exhibits, "ID", "Title", exhibitkeyword.ExhibitID);
            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1", exhibitkeyword.KeywordID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitkeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitkeyword.ModifiedBy);
            return View(exhibitkeyword);
        }

        //
        // POST: /ExhibitKeyword/Edit/5

        [HttpPost]
        public ActionResult Edit(ExhibitKeyword exhibitkeyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                exhibitkeyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                exhibitkeyword.ModifiedOn = DateTime.Now;
                db.ExhibitKeywords.Attach(exhibitkeyword);
                db.ObjectStateManager.ChangeObjectState(exhibitkeyword, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ExhibitID = new SelectList(db.Exhibits, "ID", "Title", exhibitkeyword.ExhibitID);
            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1", exhibitkeyword.KeywordID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", exhibitkeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", exhibitkeyword.ModifiedBy);
            return View(exhibitkeyword);
        }

        //
        // GET: /ExhibitKeyword/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ExhibitKeyword exhibitkeyword = db.ExhibitKeywords.Single(e => e.ExhibitKeywordID == id && (e.IsDeleted == null || e.IsDeleted == false));
            return View(exhibitkeyword);
        }

        //
        // POST: /ExhibitKeyword/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ExhibitKeyword exhibitkeyword = db.ExhibitKeywords.Single(e => e.ExhibitKeywordID == id && (e.IsDeleted == null || e.IsDeleted == false));
            exhibitkeyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            exhibitkeyword.ModifiedOn = DateTime.Now;
            exhibitkeyword.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(exhibitkeyword, EntityState.Modified);
            //db.ExhibitKeywords.DeleteObject(exhibitkeyword);
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