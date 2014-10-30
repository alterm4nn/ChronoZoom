using Chronozoom.Entities;
using System;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Web;
using System.Data.Entity.Validation;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC: IChronozoomSVC
    {
        public Collection<TimelineShortcut> GetUserTimelines(string superCollection, string Collection)
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                if (user == null) return null;

//#if RELEASE
//              if (user == null)
//              {
//                  return null;
//              }
//#endif

                Timeline roottimeline = GetTimelines(superCollection, Collection, null, null, null, null, null, null);

                var elements = new Collection<TimelineShortcut>();

                var timeline = storage.Timelines.Where(x => x.Id == roottimeline.Id)
                            .Include("Collection")
                            .Include("Collection.SuperCollection")
                            .Include("Collection.User")
                            .Include("Exhibits")
                            .Include("Exhibits.ContentItems")
                            .FirstOrDefault();

                if (timeline != null) elements.Add(storage.GetTimelineShortcut(timeline));

                if (roottimeline.ChildTimelines != null)
                {
                    foreach (var t in roottimeline.ChildTimelines)
                    {
                        timeline = storage.Timelines.Where(x => x.Id == t.Id)
                            .Include("Collection")
                            .Include("Collection.SuperCollection")
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

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public List<TimelineShortcut> GetEditableCollections(string currentSuperCollection = "", string currentCollection = "", bool includeMine = false)
        {
            Trace.TraceInformation("GetEditableCollections");
            return ApiOperation<List<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                List<TimelineShortcut> editable;

                // get data
                if (includeMine)
                {
                    // Collections where others can edit and user is in edit list, or user is collection owner.
                    editable =  storage.Collections
                                .Where(c => c.User.Id == user.Id || (c.Members.Any(m => m.User.Id == user.Id) && c.MembersAllowed))
                                .Include("SuperCollection")
                                .Include("User")
                                .OrderByDescending(c => c.User.Id == user.Id)
                                .ThenBy(c => c.User.DisplayName).ThenBy(c => c.Title)
                                .ToList()
                                .Select
                                (c => new TimelineShortcut
                                    {
                                        Title               = c.Title,
                                        Author              = c.User.DisplayName,
                                        ImageUrl            = c.Theme,
                                        TimelineUrl         = ('/' + c.SuperCollection.Title + '/' + c.Path).ToLower(),
                                        CurrentCollection   =
                                        (
                                            c.SuperCollection.Title == currentSuperCollection &&
                                            c.Path                  == currentCollection
                                        )
                                    }
                                )
                                .ToList();
                }
                else
                {
                    // Collections where others can edit and user is in edit list, but user is not collection owner.
                    editable =  storage.Collections
                                .Where(c => c.Members.Any(m => m.User.Id == user.Id) && c.MembersAllowed && c.User.Id != user.Id)
                                .Include("SuperCollection")
                                .Include("User")
                                .OrderBy(c => c.User.DisplayName).ThenBy(c => c.Title)
                                .ToList()
                                .Select
                                ( c => new TimelineShortcut
                                    {
                                        Title               = c.Title,
                                        Author              = c.User.DisplayName,
                                        ImageUrl            = c.Theme,
                                        TimelineUrl         = ('/' + c.SuperCollection.Title + '/' + c.Path).ToLower(),
                                        CurrentCollection   =
                                        (
                                            c.SuperCollection.Title == currentSuperCollection &&
                                            c.Path                  == currentCollection
                                        )
                                    }
                                )
                                .ToList();
                }

                // extract background image (packed in theme as embedded json)
                for (int loop = 1; loop <= editable.Count(); loop++)
                {
                    if (editable[loop - 1].ImageUrl == null)
                    {
                        editable[loop - 1].ImageUrl = "/images/background.jpg"; // OK here since is UI project but consider web.config
                    }
                    else
                    {
                        editable[loop - 1].ImageUrl = JsonConvert.DeserializeObject<Theme>(editable[loop - 1].ImageUrl).backgroundUrl;
                    }
                }

                // return final result
                return editable;
            });
        }

        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public Collection<TimelineShortcut> GetEditableTimelines(bool includeMine = false)
        {
            Trace.TraceInformation("GetEditableTimelines");
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                Collection<TimelineShortcut> rv = new Collection<TimelineShortcut>();

                List<Collection> collections;
                if (includeMine)
                {
                    // Collections where others can edit and user is in edit list, or user is collection owner.
                    collections = storage.Collections
                                    .Where(c => c.User.Id == user.Id || (c.Members.Any(m => m.User.Id == user.Id) && c.MembersAllowed))
                                    .Include("SuperCollection")
                                    .OrderByDescending(c => c.User.Id == user.Id)
                                    .ThenBy(c => c.User.DisplayName).ThenBy(c => c.Title)
                                    .ToList();
                }
                else
                {
                    // Collections where others can edit and user is in edit list, but user is not collection owner.
                    collections = storage.Collections
                                    .Where(c => c.Members.Any(m => m.User.Id == user.Id) && c.MembersAllowed && c.User.Id != user.Id)
                                    .Include("SuperCollection")
                                    .OrderBy(c => c.User.DisplayName).ThenBy(c => c.Title)
                                    .ToList();
                }

                foreach (Collection collection in collections)
                {
                    Collection<TimelineShortcut> collectionTimelines = GetUserTimelines(collection.SuperCollection.Title, collection.Path);
                    foreach (TimelineShortcut collectionTimeline in collectionTimelines)
                    {
                        rv.Add(collectionTimeline);
                    }
                }

                return rv;
            });
        }
    }
}