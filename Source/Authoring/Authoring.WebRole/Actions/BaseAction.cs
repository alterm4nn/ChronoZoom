using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Authoring.WebRole.Actions
{
    public abstract class BaseAction
    {
        public Exception Exception { get; protected set; }

        public abstract void Execute();
    }
}