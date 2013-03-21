using Chronozoom.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using UI.Models;

namespace UI.Controllers
{

    public class CollectionController : ApiController
    {
        public void Delete(string collection, [FromBody]Collection collectionData)
        {
            if (collectionData != null)
            {
                if (!String.IsNullOrEmpty(collection))
                {
                    Globals.Collections.Remove(collectionData);
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
                Globals.Collections.Add(collectionData);
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }
    }
}