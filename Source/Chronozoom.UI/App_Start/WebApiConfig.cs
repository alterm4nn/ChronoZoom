using System.Web.Http;

namespace Chronozoom.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "RestApi",
                routeTemplate: "api/{collection}/{controller}"
            );

            config.Routes.MapHttpRoute(
                name: "RestApiCollection",
                routeTemplate: "api/{collection}",
                defaults: new { controller="Collection"}
            );


        }
    }
}
