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
                        if (foundTimeline.exhibits[i].id == exhibitData.id)
                        {
                            Globals.Mutex.WaitOne();
                            foundTimeline.exhibits.RemoveAt(i);
                            Globals.Mutex.ReleaseMutex();
                            return;
                        }
                    }
                    //No such exhibit
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
                else
                {
                    //No such parent timeline
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
            }
            else
            {
                //Parent timeline not specified
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
                        if (foundTimeline.exhibits[i].id == exhibitData.id)
                        {
                            Globals.Mutex.WaitOne();
                            foundTimeline.exhibits[i] = exhibitData;
                            Globals.Mutex.ReleaseMutex();
                            return;
                        }
                    }
                    //Create
                    // generating guid
                    exhibitData.id = Guid.NewGuid().ToString();
                    // generating UniqueID
                    // TODO: fine better solution to create actually uniqueid or remove this field totally
                    var random = new Random();
                    exhibitData.UniqueID = random.Next(10000, int.MaxValue);
                    Globals.Mutex.WaitOne();
                    foundTimeline.exhibits.Add(exhibitData);
                    Globals.Mutex.ReleaseMutex();
                }
                else
                {
                    //No such parent timeline
                    throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
                }
            }
            else
            {
                //Parent timeline not specified
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }

        private bool FindTimeline(Timeline t1, string id, out Timeline t2)
        {
            if (t1 == null || id == null)
            {
                t2 = null;
                return false;
            }

            if (t1.id == id)
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
