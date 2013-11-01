using Chronozoom.Entities;
using System;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Globalization;
using System.Linq;


namespace Chronozoom.UI
{
    public partial class ChronozoomSVC
    {
        public Collection<TimelineShortcut> GetUserTimelines(string superCollection, string Collection)
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
#if RELEASE
                if (user == null)
                {
                    return null;
                }
#endif

                Timeline roottimeline = GetTimelines(superCollection, Collection, null, null, null, null, null, null);

                var elements = new Collection<TimelineShortcut>();

                var timeline = storage.Timelines.Where(x => x.Id == roottimeline.Id)
                           .Include("Collection")
                           .Include("Collection.User")
                           .Include("Exhibits")
                           .Include("Exhibits.ContentItems")
                           .FirstOrDefault();

                if (timeline != null)
                    elements.Add(storage.GetTimelineShortcut(timeline));
                if (roottimeline.ChildTimelines != null)
                {
                    foreach (var t in roottimeline.ChildTimelines)
                    {
                        timeline = storage.Timelines.Where(x => x.Id == t.Id)
                             .Include("Collection")
                             .Include("Collection.User")
                             .Include("Exhibits")
                             .Include("Exhibits.ContentItems")
                             .FirstOrDefault();

                        if (timeline != null)
                            elements.Add(storage.GetTimelineShortcut(timeline));
                    }
                }

                return elements;
            });
        }

      
    }
}