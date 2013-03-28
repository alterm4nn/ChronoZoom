using Chronozoom.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace UI.Controllers
{
    public class TimelineController : ApiController
    {
        public void Delete(string collection, Timeline timelineData)
        {
            if (collection == null || timelineData == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            if (timelineData.parent != null)
            {
                Timeline foundTimeline;
                if (FindTimeline(Globals.Root, timelineData.parent, out foundTimeline))
                {
                    for (int i = 0; i < foundTimeline.timelines.Count(); i++)
                    {
                        //Update
                        if (foundTimeline.timelines[i].id == timelineData.id)
                        {
                            Globals.Mutex.WaitOne();
                            foundTimeline.timelines.RemoveAt(i);
                            Globals.Mutex.ReleaseMutex();
                            return;
                        }
                    }
                    //No such parent timeline
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
                //One more root timeline, in this prototype there is no way to do it
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);
            }
        }

        public void Put(string collection, Timeline timelineData)
        {
            if (collection == null || timelineData == null)
                throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            if (timelineData.parent != null)
            {
                Timeline foundTimeline;
                if (FindTimeline(Globals.Root, timelineData.parent, out foundTimeline))
                {
                    for (int i = 0; i < foundTimeline.timelines.Count(); i++)
                    {
                        //Update
                        if (foundTimeline.timelines[i].id == timelineData.id)
                        {
                            Globals.Mutex.WaitOne();
                            foundTimeline.timelines[i] = timelineData;
                            Globals.Mutex.ReleaseMutex();
                            return;
                        }
                    }
                    //Create
                    Globals.Mutex.WaitOne();
                    foundTimeline.timelines.Add(timelineData);
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
                //One more root timeline, in this prototype there is no way to do it
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