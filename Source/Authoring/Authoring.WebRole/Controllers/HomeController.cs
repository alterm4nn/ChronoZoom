using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Authoring.WebRole.Models;
using System.Web.Configuration;
using Authoring.WebRole.Actions;

namespace Authoring.WebRole.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {                          
            int maxVersion = db.CZVersions.Max(x => x.VersionNumber);
            CZSystemVersion systemVersion = db.CZSystemVersions.Single();

            ViewBag.Message = "Chronozoom Content Authoring ";
            return View();
        }

        public ActionResult PublishToProd()
        {
            this.ExecuteAction(new Actions.PublishToProd());
            return this.RedirectToAction("Index");
        }

        public ActionResult PublishToStaging(int version)
        {
            this.ExecuteAction(new Actions.PublishToStaging()
            {
                Version = version
            });
            return this.RedirectToAction("Index");
        }

        public ActionResult GenerateVersion()
        {
            this.ExecuteAction(new Actions.GenerateVersion());
            return this.RedirectToAction("Index");
        }

        private void ExecuteAction(BaseAction action)
        {
            if (action != null)
            {
                action.Execute();
            }
        }
    }
}
