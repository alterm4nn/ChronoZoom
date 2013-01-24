using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Authoring.WebRole.Models;

namespace Authoring.WebRole.Actions
{
    public class PublishToProd : BaseAction
    {
        public override void Execute()
        {
            try
            {
                this.Exception = null;
                ChronozoomEntities db = new ChronozoomEntities();
                db.Publish(0, 0); 
            }
            catch (Exception ex)
            {
                this.Exception = ex;
            }
        }
    }
}