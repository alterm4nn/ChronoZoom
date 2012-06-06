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
    public class KeywordController: BaseController
    {
        

        private string table = AuthTable.Keyword.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public KeywordController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /Keyword/

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
            var keywords = db.Keywords.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("User").Include("User1");
            return View(keywords.ToList());
        }

        //
        // GET: /Keyword/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");
            Keyword keyword = db.Keywords.Single(k => k.ID == id && (k.IsDeleted == null || k.IsDeleted == false));
            return View(keyword);
        }

        //
        // GET: /Keyword/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        }

        //
        // POST: /Keyword/Create

        [HttpPost]
        public ActionResult Create(Keyword keyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                keyword.ID = Guid.NewGuid();
                keyword.CreatedBy = Guid.Parse(Session["userid"].ToString());
                keyword.CreatedOn = DateTime.Now;
                db.Keywords.AddObject(keyword);                
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", keyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", keyword.ModifiedBy);
            return View(keyword);
        }
        
        //
        // GET: /Keyword/Edit/5

        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            Keyword keyword = db.Keywords.Single(k => k.ID == id && (k.IsDeleted == null || k.IsDeleted == false));
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", keyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", keyword.ModifiedBy);
            return View(keyword);
        }

        //
        // POST: /Keyword/Edit/5

        [HttpPost]
        public ActionResult Edit(Keyword keyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                keyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                keyword.ModifiedOn = DateTime.Now;
                db.Keywords.Attach(keyword);
                db.ObjectStateManager.ChangeObjectState(keyword, EntityState.Modified);
                
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", keyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", keyword.ModifiedBy);
            return View(keyword);
        }

        //
        // GET: /Keyword/Delete/5

        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Keyword keyword = db.Keywords.Single(k => k.ID == id && (k.IsDeleted == null || k.IsDeleted == false));
            return View(keyword);
        }

        //
        // POST: /Keyword/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            Keyword keyword = db.Keywords.Single(k => k.ID == id && (k.IsDeleted == null || k.IsDeleted == false));
            keyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            keyword.ModifiedOn = DateTime.Now;
            keyword.IsDeleted = true;    
            //db.Keywords.DeleteObject(keyword);
            db.ObjectStateManager.ChangeObjectState(keyword, EntityState.Modified);
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