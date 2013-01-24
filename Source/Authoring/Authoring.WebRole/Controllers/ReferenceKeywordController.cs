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
    public class ReferenceKeywordController: BaseController
    {
        
        private string table = AuthTable.ReferenceKeyword.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ReferenceKeywordController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /ReferenceKeyword/

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

            var referencekeywords = db.ReferenceKeywords.Where(k => (k.IsDeleted == null || k.IsDeleted == false)).Include("Keyword").Include("Reference").Include("User").Include("User1");
            return View(referencekeywords.ToList());
        }

        //
        // GET: /ReferenceKeyword/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");

            ReferenceKeyword referencekeyword = db.ReferenceKeywords.Single(r => r.ReferenceKeywordID == id && (r.IsDeleted == null || r.IsDeleted == false));
            return View(referencekeyword);
        }

        //
        // GET: /ReferenceKeyword/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1");
            ViewBag.ReferenceID = new SelectList(db.References, "ID", "Authors");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /ReferenceKeyword/Create

        [HttpPost]
        public ActionResult Create(ReferenceKeyword referencekeyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                referencekeyword.ReferenceKeywordID = Guid.NewGuid();
                referencekeyword.CreatedBy = Guid.Parse(Session["userid"].ToString());
                referencekeyword.CreatedOn = DateTime.Now;
                db.ReferenceKeywords.AddObject(referencekeyword);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1", referencekeyword.KeywordID);
            ViewBag.ReferenceID = new SelectList(db.References, "ID", "Authors", referencekeyword.ReferenceID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", referencekeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", referencekeyword.ModifiedBy);
            return View(referencekeyword);
        }
        
        //
        // GET: /ReferenceKeyword/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            ReferenceKeyword referencekeyword = db.ReferenceKeywords.Single(r => r.ReferenceKeywordID == id && (r.IsDeleted == null || r.IsDeleted == false));
            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1", referencekeyword.KeywordID);
            ViewBag.ReferenceID = new SelectList(db.References, "ID", "Authors", referencekeyword.ReferenceID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", referencekeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", referencekeyword.ModifiedBy);
            return View(referencekeyword);
        }

        //
        // POST: /ReferenceKeyword/Edit/5

        [HttpPost]
        public ActionResult Edit(ReferenceKeyword referencekeyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");

            if (ModelState.IsValid)
            {
                referencekeyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                referencekeyword.ModifiedOn = DateTime.Now;
                db.ReferenceKeywords.Attach(referencekeyword);
                db.ObjectStateManager.ChangeObjectState(referencekeyword, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.KeywordID = new SelectList(db.Keywords, "ID", "Keyword1", referencekeyword.KeywordID);
            ViewBag.ReferenceID = new SelectList(db.References, "ID", "Authors", referencekeyword.ReferenceID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", referencekeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", referencekeyword.ModifiedBy);
            return View(referencekeyword);
        }

        //
        // GET: /ReferenceKeyword/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ReferenceKeyword referencekeyword = db.ReferenceKeywords.Single(r => r.ReferenceKeywordID == id && (r.IsDeleted == null || r.IsDeleted == false));
            return View(referencekeyword);
        }

        //
        // POST: /ReferenceKeyword/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");

            ReferenceKeyword referencekeyword = db.ReferenceKeywords.Single(r => r.ReferenceKeywordID == id && (r.IsDeleted == null || r.IsDeleted == false));
            referencekeyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            referencekeyword.ModifiedOn = DateTime.Now;
            referencekeyword.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(referencekeyword, EntityState.Modified);
            //db.ReferenceKeywords.DeleteObject(referencekeyword);
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