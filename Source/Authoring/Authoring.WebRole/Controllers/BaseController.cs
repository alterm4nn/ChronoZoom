namespace Authoring.WebRole.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Authoring.WebRole.Models;
    using System.Web.Configuration;
    using Authoring.WebRole.Actions;

    public class BaseController: Controller
    {
        protected ChronozoomEntities db { get; set; }

        public BaseController() : base()
        {
            this.db = new ChronozoomEntities();

            int maxVersion = db.CZVersions.Max(x => x.VersionNumber);
            CZSystemVersion systemVersion = db.CZSystemVersions.Single();

            ViewBag.MaxVersion = maxVersion + "";
            ViewBag.StagingVersion = systemVersion.StagingVersion;
            ViewBag.ProductionVersion = systemVersion.ProdVersion;
        }
    }
}
