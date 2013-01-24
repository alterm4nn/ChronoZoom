using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Authoring.WebRole.Models;

namespace Authoring.WebRole.Actions
{
    public class PublishToStaging : BaseAction
    {
        public int Version { get; set; }

        public override void Execute()
        {
            try
            {
                this.Exception = null;
                ChronozoomEntities db = new ChronozoomEntities();
                db.Publish(this.Version, 1);
            }
            catch (Exception ex)
            {
                this.Exception = ex;
            }
        }
    }
}