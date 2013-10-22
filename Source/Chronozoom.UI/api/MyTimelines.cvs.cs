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
        public Collection<TimelineShortcut> GetUserMyTimelines()
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
#if RELEASE
                if (user == null)
                {
                    return null;
                }
#endif

                Timeline roottimeline = GetTimelines(null, null, null, null, null, null, null, null);


                Guid userId = user == null || user.Id == null ? Guid.Empty : user.Id;
               /* var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFavorites - {0}", userId);
                if (Cache.Contains(cacheKey))
                {
                    return (Collection<TimelineShortcut>)Cache.Get(cacheKey);
                }

                var triple = storage.GetTriplet(String.Format("czusr:{0}", user != null ? user.Id : Guid.Empty), "czpred:favorite").FirstOrDefault();
                if (triple == null)
                    return null;*/

                var elements = new Collection<TimelineShortcut>();

                var timeline = storage.Timelines.Where(x => x.Id == roottimeline.Id)
                           .Include("Collection")
                           .Include("Collection.User")
                           .Include("Exhibits")
                           .Include("Exhibits.ContentItems")
                           .FirstOrDefault();

                if (timeline != null)
                    elements.Add(storage.GetTimelineShortcut(timeline));

                foreach (var t in roottimeline.ChildTimelines)
                {
                      var timeline1 = storage.Timelines.Where(x => x.Id == t.Id)
                            .Include("Collection")
                            .Include("Collection.User")
                            .Include("Exhibits")
                            .Include("Exhibits.ContentItems")
                            .FirstOrDefault();

                        if (timeline1 != null)
                            elements.Add(storage.GetTimelineShortcut(timeline1));
                }

        //        Cache.Add(cacheKey, elements);

                return elements;
            });
        }

      
    }
}