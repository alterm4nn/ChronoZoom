using System.Web.Http;
using System.Web.Http.Controllers;

namespace Thinktecture.IdentityModel.Authorization.WebApi
{
    public class ClaimsAuthorizeAttribute : AuthorizeAttribute
    {
        private string _resource;
        private string _action;
        private string[] _resources;

        public ClaimsAuthorizeAttribute()
        { }

        public ClaimsAuthorizeAttribute(string action, params string[] resources)
        {
            _action = action; 
            _resources = resources;
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            if (!string.IsNullOrWhiteSpace(_action))
            {
                return ClaimsAuthorization.CheckAccess(_action, _resources);
            }
            else
            {
                return CheckAccess(actionContext);
            }
        }

        protected virtual bool CheckAccess(HttpActionContext actionContext)
        {
            var action = actionContext.ActionDescriptor.ActionName;
            var resource = actionContext.ControllerContext.ControllerDescriptor.ControllerName;

            return ClaimsAuthorization.CheckAccess(
                action,
                resource);
        }
    }
}
