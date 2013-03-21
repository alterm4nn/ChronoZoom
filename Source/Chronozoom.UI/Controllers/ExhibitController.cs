using Chronozoom.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace UI.Controllers
{
    public class ExhibitController : ApiController
    {

        public void Delete(string collection, Exhibit exhibitData)
        {
            if (collection == null || exhibitData == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            if (exhibitData.parent != null)
            {
                Timeline foundTimeline;
                if (FindTimeline(Globals.Root, exhibitData.parent, out foundTimeline))
                {
                    for (int i = 0; i < foundTimeline.exhibits.Count(); i++)
                    {
                        //Remove
                        if (foundTimeline.exhibits[i].UniqueID == exhibitData.UniqueID)
                        {
                            foundTimeline.exhibits.RemoveAt(i);
                            return;
                        }
                    }
                    //No such exhibit
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
                else
                {
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }

        }

        public void Put(string collection, Exhibit exhibitData)
        {
            if(collection == null || exhibitData == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            
            if (exhibitData.parent != null)
            {
                Timeline foundTimeline;
                if (FindTimeline(Globals.Root, exhibitData.parent, out foundTimeline))
                {
                    for (int i = 0; i < foundTimeline.exhibits.Count(); i++)
                    {
                        //Update
                        if (foundTimeline.exhibits[i].UniqueID == exhibitData.UniqueID)
                        {
                            foundTimeline.exhibits[i] = exhibitData;
                            return;
                        }
                    }
                    //Create
                    foundTimeline.exhibits.Add(exhibitData);
                }
                else
                {
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
            }
            else
            {
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }


        private bool FindExhibit(Timeline t1, int exhibitUniqueID, out Exhibit exh)
        {
            if (t1 == null)
            {
                exh = null;
                return false;
            }

            for (int i = 0; i < t1.exhibits.Count; i++)
            {
                if (t1.exhibits[i].UniqueID == exhibitUniqueID)
                {
                    exh = t1.exhibits[i];
                    return true;
                }
            }

            foreach (var t3 in t1.timelines)
                if (FindExhibit(t3, exhibitUniqueID, out exh))
                    return true;

            exh = null;
            return false;
        }

        private bool FindTimeline(Timeline t1, string id, out Timeline t2)
        {
            if (t1 == null || id == null)
            {
                t2 = null;
                return false;
            }

            if (t1. == id)
            {
                t2 = t1;
                return true;
            }
            else
            {
                foreach (var t3 in t1.timelines)
                    if (FindTimeline(t3, id, out t2))
                        return true;

                t2 = null;
                return false;
            }
        }
    }
}