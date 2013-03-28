using Chronozoom.Api.Models;
using System;
using System.Web.Http;

namespace Chronozoom.Api.Controllers
{

    public class CollectionController : ApiController
    {
        public void Delete(string collection, [FromBody]Collection collectionData)
        {
            if (collectionData != null)
            {
                if (!String.IsNullOrEmpty(collection))
                {
                    Globals.Mutex.WaitOne();
                    Globals.Collections.Remove(collectionData);
                    Globals.Mutex.ReleaseMutex();
                }
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }

        public void Put(string collection, [FromBody]Collection collectionData)
        {
            if (collectionData != null && !String.IsNullOrEmpty(collectionData.name) && !String.IsNullOrEmpty(collectionData.description))
            {
                Globals.Mutex.WaitOne();
                Globals.Collections.Add(collectionData);
                Globals.Mutex.ReleaseMutex();
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }
    }
}