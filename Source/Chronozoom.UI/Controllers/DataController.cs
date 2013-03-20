using System.Web.Http;

namespace UI.Controllers
{
    public class DataController : ApiController
    {
        public string Post([FromBody]string value)
        {
            return "Hello from DataController.Post()";
        }
    }
}