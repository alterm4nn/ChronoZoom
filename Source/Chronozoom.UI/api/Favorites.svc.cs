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
        public Collection<TimelineShortcut> GetUserFavorites()
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
#if RELEASE
                if (user == null)
                {
                    return null;
                }
#endif

                Guid userId = user == null || user.Id == null ? Guid.Empty : user.Id;
                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFavorites - {0}", userId);
                if (Cache.Contains(cacheKey))
                {
                    return (Collection<TimelineShortcut>)Cache.Get(cacheKey);
                }

                var triple = storage.GetTriplet(String.Format("czusr:{0}", user != null ? user.Id : Guid.Empty), "czpred:favorite").FirstOrDefault();
                if (triple == null)
                    return null;

                var elements = new Collection<TimelineShortcut>();
                foreach (var t in triple.Objects)
                {
                    var objName = TripleName.Parse(t.Object);
                    if (objName.Prefix == "cztimeline")
                    {
                        var g = new Guid(objName.Name);
                        var timeline = storage.Timelines.Where(x => x.Id == g)
                            .Include("Collection")
                            .Include("Collection.User")
                            .Include("Exhibits")
                            .Include("Exhibits.ContentItems")
                            .FirstOrDefault();

                        if (timeline != null)
                            elements.Add(storage.GetTimelineShortcut(timeline));
                    }
                }

                Cache.Add(cacheKey, elements);

                return elements;
            });
        }

        public bool PutUserFavorite(string favoriteGUID)
        {
            Guid g;
            if (!Guid.TryParse(favoriteGUID, out g))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
#if RELEASE
                if (user == null)
                {
                    return false;
                }
#endif

                Guid userId = user == null || user.Id == null ? Guid.Empty : user.Id;
                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFavorites - {0}", userId);
                if (Cache.Contains(cacheKey))
                {
                    Cache.Remove(cacheKey);
                }

                return storage.PutTriplet(
                    TripleName.Parse(String.Format("czusr:{0}", user != null ? user.Id : Guid.Empty)), 
                    TripleName.Parse("czpred:favorite"), 
                    TripleName.Parse(String.Format("cztimeline:{0}", favoriteGUID)));
            });
        }

        public bool DeleteUserFavorite(string favoriteGUID)
        {
            Guid g;
            if (!Guid.TryParse(favoriteGUID, out g))
                return false;

            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
#if RELEASE
                if (user == null)
                {
                    return false;
                }
#endif

                Guid userId = user == null || user.Id == null ? Guid.Empty : user.Id;
                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFavorites - {0}", userId);
                if (Cache.Contains(cacheKey))
                {
                    Cache.Remove(cacheKey);
                }

                return storage.DeleteTriplet(
                    TripleName.Parse(String.Format("czusr:{0}", user != null ? user.Id : Guid.Empty)),
                    TripleName.Parse("czpred:favorite"),
                    TripleName.Parse(String.Format("cztimeline:{0}", favoriteGUID)));
            });
        }
    }
}