using Chronozoom.Entities;
using System;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Collections.Generic;
using System.Configuration;
using Newtonsoft.Json;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC
    {
        public IEnumerable<Tile> GetUserFavorites(string currentSuperCollection = "", string currentCollection = "")
        {
            currentCollection               = currentCollection      == null ? "" : currentCollection.ToLower();
            currentSuperCollection          = currentSuperCollection == null ? "" : currentSuperCollection.ToLower();
            string defaultSuperCollection   = (ConfigurationManager.AppSettings["DefaultSuperCollection"]).ToLower();
            
            List<Tile> tiles                = new List<Tile>();

            return ApiOperation(delegate(User user, Storage storage)
            {
#if RELEASE
                if (user == null) return tiles;
#endif
                Guid userId     = (user == null || user.Id == null) ? Guid.Empty : user.Id;
                var cacheKey    = string.Format(CultureInfo.InvariantCulture, "UserFavorites - {0}", userId);
                if (Cache.Contains(cacheKey))
                {
                    return (List<Tile>) Cache.Get(cacheKey);
                }

                var triple = storage.GetTriplet(String.Format("czusr:{0}", user != null ? user.Id : Guid.Empty), "czpred:favorite").FirstOrDefault();
                if (triple == null) return tiles;

                foreach (var t in triple.Objects)
                {
                    var objName = TripleName.Parse(t.Object);
                    if (objName.Prefix == "cztimeline")
                    {
                        Timeline timeline = storage.Timelines
                            .Where(item => item.Id == new Guid(objName.Name))
                            .Include("Collection.User")
                            .Include("Collection.SuperCollection")
                            .FirstOrDefault();

                        if (timeline != null)
                        {
                            List<Guid> ancestorTimelines = TimelineExtensions.Ancestors(timeline);

                            ancestorTimelines.Reverse();

                            tiles.Add(new Tile
                            {
                                CollectionName      = timeline.Collection.Title,
                                CuratorName         = timeline.Collection.User.DisplayName,
                                Link                = GetURLPath(timeline.Collection, defaultSuperCollection) + "#"
                                                      + "/t" + string.Join("/t", ancestorTimelines.ToArray()),
                                Type                = "t",
                                Title               = timeline.Title,
                                CustomBackground    = GetTileBackgroundImage(timeline.Collection.Theme),
                                IsCosmosCollection  = (timeline.Collection.SuperCollection.Title.ToLower() == "chronozoom" && timeline.Collection.Path == "cosmos"),
                                IsCurrentCollection =
                                (
                                    (
                                        timeline.Collection.SuperCollection.Title == currentSuperCollection ||
                                        ((currentSuperCollection == "") && (timeline.Collection.SuperCollection.Title == defaultSuperCollection))
                                    )
                                    &&
                                    (
                                        timeline.Collection.Path == currentCollection ||
                                        ((currentCollection == "") && timeline.Collection.Default)
                                    )
                                )
                            });
                        }
                    }
                }

                tiles = tiles.OrderBy(t => t.CollectionName).ThenBy(t => t.Title).ToList();

                Cache.Add(cacheKey, tiles);

                return tiles;
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

        private string GetTileBackgroundImage(string theme)
        {
            if (theme == null)
            {
                return "";
            }
            else
            {
                return JsonConvert.DeserializeObject<Theme>(theme).backgroundUrl;
            }
        }
    }
}