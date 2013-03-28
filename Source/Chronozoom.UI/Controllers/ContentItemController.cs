using Chronozoom.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace UI.Controllers
{
    public class ContentItemController : ApiController
    {
        public void Delete(string collection, ContentItem contentItemData)
        {
            if (collection == null || contentItemData == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            if (contentItemData.parent != null)
            {
                Exhibit exh;
                if (FindExhibit(Globals.Root, contentItemData.parent, out exh))
                {

                    for (int j = 0; j < exh.contentItems.Count(); j++)
                    {
                        //Remove ContentItem
                        if (exh.contentItems[j].id == contentItemData.id)
                        {
                            Globals.Mutex.WaitOne();
                            exh.contentItems.RemoveAt(j);
                            Globals.Mutex.ReleaseMutex();
                            return;
                        }
                    }

                    //No such ContentItem
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
                else
                {
                    //No such parent exhibit
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
            }
            else
            {
                //Parent timeline not specified
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }

        }

        public void Put(string collection, ContentItem contentItemData)
        {
            if (collection == null || contentItemData == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            if (contentItemData.parent != null)
            {
                Exhibit exh;
                if (FindExhibit(Globals.Root, contentItemData.parent, out exh))
                {

                    for (int j = 0; j < exh.contentItems.Count(); j++)
                    {
                        //Remove ContentItem
                        if (exh.contentItems[j].id == contentItemData.id)
                        {
                            Globals.Mutex.WaitOne();
                            exh.contentItems[j] = contentItemData;
                            Globals.Mutex.ReleaseMutex();
                            return;
                        }
                    }

                    //Add new ContentItem
                    // generating guid
                    contentItemData.id = Guid.NewGuid().ToString();
                    // generating UniqueID
                    // TODO: fine better solution to create actually uniqueid or remove this field totally
                    var random = new Random();
                    contentItemData.UniqueID = random.Next(10000, int.MaxValue);
                    Globals.Mutex.WaitOne();
                    exh.contentItems.Add(contentItemData);
                    Globals.Mutex.ReleaseMutex();
                }
                else
                {
                    //No such parent exhibit
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
            }
            else
            {
                //Parent timeline not specified
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }

        private bool FindExhibit(Timeline t1, string id, out Exhibit exh)
        {
            if (t1 == null || id == null)
            {
                exh = null;
                return false;
            }

            for (int i = 0; i < t1.exhibits.Count(); i++)
            {
                if (t1.exhibits[i].id == id)
                {
                    exh = t1.exhibits[i];
                    return true;
                }
            }

            foreach (var t3 in t1.timelines)
                if (FindExhibit(t3, id, out exh))
                    return true;

            exh = null;
            return false;
        }
    }
}
