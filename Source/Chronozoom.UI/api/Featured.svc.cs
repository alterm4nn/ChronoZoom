using Chronozoom.Entities;
using System;
using System.Collections.ObjectModel;
using System.Configuration;
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

                // If GUID is not given then get supervisor's GUID. Otherwise parse the given GUID.
                if (guid.Equals("default"))
                {
                    string aps = ConfigurationManager.AppSettings["FeaturedTimelinesSupervisorGuid"];
                    userGuid = String.IsNullOrEmpty(aps) ? Guid.Empty : Guid.Parse(aps);
                }
                else if (!Guid.TryParse(guid, out userGuid))
                {
                    return null;
                }

                var cacheKey = string.Format(CultureInfo.InvariantCulture, "UserFeatured - {0}", userGuid);
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

                return storage.PutTriplet(
                    TripleName.Parse(String.Format("czusr:{0}", user.Id)), 
                    TripleName.Parse("czpred:featured"), 
                    TripleName.Parse(String.Format("cztimeline:{0}", featuredGUID)));
            });
        }

        public bool DeleteUserFeatured(string featuredGUID)
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

                return storage.DeleteTriplet(
                    TripleName.Parse(String.Format("czusr:{0}", user.Id)), 
                    TripleName.Parse("czpred:featured"), 
                    TripleName.Parse(String.Format("cztimeline:{0}", featuredGUID)));
            });
        }
    }
}