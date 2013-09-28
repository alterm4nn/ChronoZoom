using Chronozoom.Entities;
using System;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Globalization;
using System.Linq;


namespace Chronozoom.UI
{
    public partial class ChronozoomSVC : IFeaturedAPI
    {
        public Collection<TimelineShortcut> GetUserFeatured(string guid)
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                Guid userGuid;
                if (!Guid.TryParse(guid, out userGuid))
                    return null;

                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFeatured - {0}", guid);
                if (Cache.Contains(cacheKey))
                {
                    return (Collection<TimelineShortcut>)Cache.Get(cacheKey);
                }

                var triple = storage.GetTriplet(String.Format("czusr:{0}", userGuid), "czpred:featured").FirstOrDefault();
                if (triple == null)
                    return null;

                var elements = new Collection<TimelineShortcut>();
                foreach (var t in triple.Objects)
                {
                    if (storage.GetPrefix(t.Object) == "cztimeline")
                    {
                        var g = new Guid(storage.GetValue(t.Object));
                        var timeline = storage.Timelines.Where(x => x.Id == g).Include(f => f.Collection).Include(u => u.Collection.User).FirstOrDefault();

                        //ToDo: get image url
                        if (timeline != null)
                            elements.Add(storage.GetTimelineShortcut(timeline));
                    }
                }

                Cache.Add(cacheKey, elements);

                return elements;
            });
        }

        public bool PutUserFeatured(string featuredGUID)
        {
            Guid g;
            if (!Guid.TryParse(featuredGUID, out g))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return false;
                }

                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFeatured - {0}", user.Id);
                if (Cache.Contains(cacheKey))
                {
                    Cache.Remove(cacheKey);
                }

                return storage.PutTriplet(String.Format("czusr:{0}", user.Id), "czpred:featured", String.Format("cztimeline:{0}", featuredGUID));
            });
        }

        public bool DeleteUserFeatured(string favoriteGUID)
        {
            Guid g;
            if (!Guid.TryParse(favoriteGUID, out g))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    return false;
                }

                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFeatured - {0}", user.Id);
                if (Cache.Contains(cacheKey))
                {
                    Cache.Remove(cacheKey);
                }

                return storage.DeleteTriplet(String.Format("czusr:{0}", user.Id), "czpred:featured", String.Format("cztimeline:{0}", favoriteGUID));
            });
        }
    }
}