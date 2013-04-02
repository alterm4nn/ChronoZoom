using System.Web.Mvc;

namespace Thinktecture.IdentityModel.Authorization.Mvc
{
    public class ClaimsAuthorizeAttribute : AuthorizeAttribute
    {
        private string _action;
        private string[] _resources;

        private const string _label = "Thinktecture.IdentityModel.Authorization.Mvc.ClaimsAuthorizeAttribute";

        public ClaimsAuthorizeAttribute()
        { }

        public ClaimsAuthorizeAttribute(string action, params string[] resources)
        {
            _action = action;
            _resources = resources;
        }

        public override void OnAuthorization(System.Web.Mvc.AuthorizationContext filterContext)
        {
            filterContext.HttpContext.Items[_label] = filterContext;
            base.OnAuthorization(filterContext); 
        }

        protected override bool AuthorizeCore(System.Web.HttpContextBase httpContext)
        {
            if (!string.IsNullOrWhiteSpace(_action))
            {
                return ClaimsAuthorization.CheckAccess(_action, _resources);
            }
            else
            {
                var filterContext = httpContext.Items[_label] as System.Web.Mvc.AuthorizationContext;
                return CheckAccess(filterContext);
            }
        }

        protected virtual bool CheckAccess(System.Web.Mvc.AuthorizationContext filterContext)
        {
            var action = filterContext.RouteData.Values["action"] as string;
            var controller = filterContext.RouteData.Values["controller"] as string;

            return ClaimsAuthorization.CheckAccess(action, controller);
        }
    }
}
