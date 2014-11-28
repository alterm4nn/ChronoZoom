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
using System.Configuration;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC: IChronozoomSVC
    {


        public Collection<TimelineShortcut> GetUserTimelines(string superCollection, string Collection)
        {
            return ApiOperation<Collection<TimelineShortcut>>(delegate(User user, Storage storage)
            {
                if (user == null) return null;

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
            currentSuperCollection  = currentSuperCollection == null ? "" : currentSuperCollection.ToLower();
            currentCollection       = currentCollection      == null ? "" : currentCollection.ToLower();

            string defaultSuperCollection = (ConfigurationManager.AppSettings["DefaultSuperCollection"]).ToLower();

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
                                        TimelineUrl         = GetURLPath(c, defaultSuperCollection),
                                        CurrentCollection   =
                                        (
                                            (
                                                c.SuperCollection.Title == currentSuperCollection ||
                                                ((currentSuperCollection == "") && (c.SuperCollection.Title == defaultSuperCollection))
                                            )
                                            &&
                                            (
                                                c.Path == currentCollection ||
                                                ((currentCollection == "") && c.Default)
                                            )
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
                                (c => new TimelineShortcut
                                    {
                                        Title               = c.Title,
                                        Author              = c.User.DisplayName,
                                        ImageUrl            = c.Theme,
                                        TimelineUrl         = GetURLPath(c, defaultSuperCollection),
                                        CurrentCollection   =
                                        (
                                            (
                                                c.SuperCollection.Title == currentSuperCollection ||
                                                ((currentSuperCollection == "") && (c.SuperCollection.Title == defaultSuperCollection))
                                            )
                                            &&
                                            (
                                                c.Path == currentCollection ||
                                                ((currentCollection == "") && c.Default)
                                            )
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


        /// <summary>
        /// Documented under IChronozoomSVC
        /// </summary>
        public IEnumerable<Tile> GetRecentlyUpdatedExhibits(int quantity = 6)
        {
            string defaultSuperCollection = (ConfigurationManager.AppSettings["DefaultSuperCollection"]).ToLower();

            return ApiOperation(delegate(User user, Storage storage)
            {
                List<Tile>      tiles = new List<Tile>();
                List<Exhibit>   exhibits;

                exhibits =
                    storage.Exhibits
                    .Where
                    (e =>
                        e.Collection.PubliclySearchable &&
                        e.ContentItems.Any
                        (i =>
                            i.Order     == 0 &&
                            i.MediaType == "image"
                        )
                    )
                    .Include("Collection.SuperCollection")  //  } de facto includes
                    .Include("Collection.User")             //  } collection entity
                    .Include("ContentItems")
                    .OrderByDescending(e => e.UpdatedTime)
                    .Take(quantity)
                    .ToList();

                exhibits = exhibits.OrderBy(e => e.Title).ToList();

                foreach (Exhibit exhibit in exhibits)
                {
                    Timeline    exhibitsTimeline = storage.Timelines.Where(t => t.Exhibits.Any(e => e.Id == exhibit.Id)).First();
                    List<Guid> ancestorTimelines = TimelineExtensions.Ancestors(exhibitsTimeline);

                    ancestorTimelines.Reverse();
                    
                    tiles.Add(new Tile
                    {
                        CollectionName      = exhibit.Collection.Title,
                        CuratorName         = exhibit.Collection.User.DisplayName,
                        Link                = GetURLPath(exhibit.Collection, defaultSuperCollection) + "#"
                                              + "/t" + string.Join("/t", ancestorTimelines.ToArray())
                                              + "/e" + exhibit.Id,
                        Type                = "e",
                        Title               = exhibit.Title,
                        Year                = exhibit.Year,
                        CustomBackground    = exhibit.ContentItems.Where(i => i.Order == 0).First().Uri,
                        IsCosmosCollection  = (exhibit.Collection.SuperCollection.Title.ToLower() == "chronozoom" && exhibit.Collection.Path == "cosmos"),
                        IsCurrentCollection = false // we want to load the URL every link click
                    });
                }

                return tiles;
            });
        }


        /// <summary>
        /// Returns shortest URL path to a collection.
        /// For example, excluding the collection path from the URL if it is the default collection.
        /// If the collection is the default collection in the default supercollection then returns "/".
        /// </summary>
        private string GetURLPath(Collection collection, string defaultSuperCollection)
        {
            string superCollectionPath  = "/" + collection.SuperCollection.Title;
            string collectionPath       = "/" + collection.Path;

            if (collection.Default)
            {
                collectionPath = "";

                if (collection.SuperCollection.Title == defaultSuperCollection)
                {
                    superCollectionPath = "/";
                }
            }

            return (superCollectionPath + collectionPath).ToLower();
        }


    }
}