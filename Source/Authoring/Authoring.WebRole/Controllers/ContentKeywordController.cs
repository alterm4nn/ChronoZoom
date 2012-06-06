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
    public class ContentKeywordController: BaseController
    {
        

        private string table = AuthTable.ContentKeyword.ToString();
        private string read = Permission.read.ToString();
        private string write = Permission.write.ToString();
        private string delete = Permission.delete.ToString();
        private string admin = Permission.admin.ToString();

        public ContentKeywordController()
        {
            ViewBag.read = ViewBag.write = ViewBag.delete = ViewBag.admin = false;
        }
        //
        // GET: /ContentKeyword/

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
            var contentkeywords = db.ContentKeywords.Where(ck => (ck.IsDeleted == null || ck.IsDeleted == false)).Include("ContentItem").Include("Keyword").Include("User").Include("User1");
            return View(contentkeywords.ToList());
        }

        //
        // GET: /ContentKeyword/Details/5

        public ActionResult Details(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, read))
                return RedirectToAction("Index", "Home");
            ContentKeyword contentkeyword = db.ContentKeywords.Single(c => c.ContentKeywordID == id);
            return View(contentkeyword);
        }

        //
        // GET: /ContentKeyword/Create

        public ActionResult Create()
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ViewBag.ContentID = new SelectList(db.ContentItems.Where(c => c.IsDeleted == null || c.IsDeleted == false), "ID", "Title");
            ViewBag.KeywordID = new SelectList(db.Keywords.Where(k => k.IsDeleted == null || k.IsDeleted == false), "ID", "Keyword1");
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName");
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName");
            return View();
        } 

        //
        // POST: /ContentKeyword/Create

        [HttpPost]
        public ActionResult Create(ContentKeyword contentkeyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                contentkeyword.ContentKeywordID = Guid.NewGuid();
                contentkeyword.CreatedBy = Guid.Parse(Session["userid"].ToString());
                contentkeyword.CreatedOn = DateTime.Now;
                db.ContentKeywords.AddObject(contentkeyword);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.ContentID = new SelectList(db.ContentItems.Where(c => c.IsDeleted == null || c.IsDeleted == false), "ID", "Title", contentkeyword.ContentID);
            ViewBag.KeywordID = new SelectList(db.Keywords.Where(k => k.IsDeleted == null || k.IsDeleted == false), "ID", "Keyword1", contentkeyword.KeywordID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", contentkeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", contentkeyword.ModifiedBy);
            return View(contentkeyword);
        }
        
        //
        // GET: /ContentKeyword/Edit/5
 
        public ActionResult Edit(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            ContentKeyword contentkeyword = db.ContentKeywords.Single(ck => ck.ContentKeywordID == id && (ck.IsDeleted == null || ck.IsDeleted == false));
            ViewBag.ContentID = new SelectList(db.ContentItems.Where(c => c.IsDeleted == null || c.IsDeleted == false), "ID", "Title", contentkeyword.ContentID);
            ViewBag.KeywordID = new SelectList(db.Keywords.Where(k => k.IsDeleted == null || k.IsDeleted == false), "ID", "Keyword1", contentkeyword.KeywordID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", contentkeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", contentkeyword.ModifiedBy);
            return View(contentkeyword);
        }

        //
        // POST: /ContentKeyword/Edit/5

        [HttpPost]
        public ActionResult Edit(ContentKeyword contentkeyword)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, write))
                return RedirectToAction("Index", "Home");
            if (ModelState.IsValid)
            {
                contentkeyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
                contentkeyword.ModifiedOn = DateTime.Now;
                db.ContentKeywords.Attach(contentkeyword);
                db.ObjectStateManager.ChangeObjectState(contentkeyword, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ContentID = new SelectList(db.ContentItems.Where(c => c.IsDeleted == null || c.IsDeleted == false), "ID", "Title", contentkeyword.ContentID);
            ViewBag.KeywordID = new SelectList(db.Keywords.Where(k => k.IsDeleted == null || k.IsDeleted == false), "ID", "Keyword1", contentkeyword.KeywordID);
            ViewBag.CreatedBy = new SelectList(db.Users, "ID", "UserName", contentkeyword.CreatedBy);
            ViewBag.ModifiedBy = new SelectList(db.Users, "ID", "UserName", contentkeyword.ModifiedBy);
            return View(contentkeyword);
        }

        //
        // GET: /ContentKeyword/Delete/5
 
        public ActionResult Delete(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            ContentKeyword contentkeyword = db.ContentKeywords.Single(ck => ck.ContentKeywordID == id && (ck.IsDeleted == null || ck.IsDeleted == false));
            return View(contentkeyword);
        }

        //
        // POST: /ContentKeyword/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(Guid id)
        {
            if (!Authorization.GetAccess(table, HttpContext.User.Identity.Name, delete))
                return RedirectToAction("Index", "Home");
            ContentKeyword contentkeyword = db.ContentKeywords.Single(ck => ck.ContentKeywordID == id && (ck.IsDeleted == null || ck.IsDeleted == false));
            contentkeyword.ModifiedBy = Guid.Parse(Session["userid"].ToString());
            contentkeyword.ModifiedOn = DateTime.Now;
            contentkeyword.IsDeleted = true;
            db.ObjectStateManager.ChangeObjectState(contentkeyword, EntityState.Modified);
            db.SaveChanges();
            //db.ContentKeywords.DeleteObject(contentkeyword);
            
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}