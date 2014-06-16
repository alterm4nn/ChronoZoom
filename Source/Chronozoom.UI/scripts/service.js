﻿var CZ;
(function (CZ) {
    (function (Service) {
        var Map;
        (function (Map) {
            function bookmark(ts) {
                return {
                    name: ts.Title,
                    url: ts.NavigationUrl,
                    lapseTime: ts.LapseTime,
                    description: ts.Description
                };
            }

            function tour(t) {
                var bookmarks = new Array(t.Stops.length);
                for (var i = 0, n = t.Stops.length; i < n; i++) {
                    bookmarks[i] = bookmark(t.Stops[i]);
                }

                var tourRequest = {
                    id: t.Id,
                    name: t.Title,
                    description: t.Description,
                    audio: "",
                    category: t.Category,
                    sequence: t.Sequence,
                    bookmarks: bookmarks
                };

                return tourRequest;
            }
            Map.tour = tour;

            function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    start: CZ.Dates.getDecimalYearFromCoordinate(t.x),
                    end: typeof t.endDate !== 'undefined' ? t.endDate : CZ.Dates.getDecimalYearFromCoordinate(t.x + t.width),
                    title: t.title,
                    Regime: t.regime
                };
            }
            Map.timeline = timeline;

            function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: undefined
                };
            }
            Map.exhibit = exhibit;

            function exhibitWithContentItems(e) {
                var mappedContentItems = [];
                $(e.contentItems).each(function (contentItemIndex, contentItem) {
                    mappedContentItems.push(Map.contentItem(contentItem));
                });

                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: mappedContentItems
                };
            }
            Map.exhibitWithContentItems = exhibitWithContentItems;

            function contentItem(ci) {
                return {
                    id: ci.guid,
                    ParentExhibitId: ci.contentItem ? ci.contentItem.ParentExhibitId : ci.ParentExhibitId,
                    title: ci.contentItem ? ci.contentItem.title : ci.title,
                    description: ci.contentItem ? ci.contentItem.description : ci.description,
                    uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType,
                    attribution: ci.contentItem ? ci.contentItem.attribution : ci.attribution,
                    mediaSource: ci.contentItem ? ci.contentItem.mediaSource : ci.mediaSource,
                    order: ci.contentItem ? ci.contentItem.order : ci.order
                };
            }
            Map.contentItem = contentItem;
        })(Map || (Map = {}));

        var _serviceUrl = CZ.Settings.serverUrlHost + "/api/";

        var _isLocalHost = constants.environment === "Localhost";
        var _dumpTweetsUrl = "/dumps/home/tweets.json";
        var _dumpTimelinesUrl = "/dumps/home/timelines.json";
        var _testLogin = false;

        function Request(urlBase) {
            var _url = urlBase;
            var _hasParameters = false;

            Object.defineProperty(this, "url", {
                configurable: false,
                get: function () {
                    return _url;
                }
            });

            this.addToPath = function (item) {
                if (item) {
                    _url += _url.match(/\/$/) ? item : "/" + item;
                }
            };

            this.addParameter = function (name, value) {
                if (value !== undefined && value !== null) {
                    _url += _hasParameters ? "&" : "?";
                    _url += name + "=" + value;
                    _hasParameters = true;
                }
            };

            this.addParameters = function (params) {
                for (var p in params) {
                    if (params.hasOwnProperty(p)) {
                        this.addParameter(p, params[p]);
                    }
                }
            };
        }
        Service.Request = Request;
        ;

        Service.superCollectionName = "";
        Service.collectionName = "";
        Service.canEdit = false;

        function getTimelines(r, sc, c) {
            if (typeof sc === "undefined") { sc = Service.superCollectionName; }
            if (typeof c === "undefined") { c = Service.collectionName; }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", sc);
            request.addParameter("collection", c);
            request.addParameters(r);

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTimelines = getTimelines;

        function getCollections(superCollectionName) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath("collections");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCollections = getCollections;

        function getCollection() {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("data");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCollection = getCollection;

        function getExhibitLastUpdate(exhibitId) {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath("exhibit");
            request.addToPath(exhibitId);
            request.addToPath("lastupdate");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getExhibitLastUpdate = getExhibitLastUpdate;

        function findUsers(partialName) {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath("find");
            request.addToPath("users?partial=" + partialName);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.findUsers = findUsers;

        function getCanEdit() {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("canedit");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCanEdit = getCanEdit;

        function getMembers() {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("members");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getMembers = getMembers;

        function putMembers(superCollectionName, collectionName, userIds) {
            CZ.Authoring.resetSessionTimer();

            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
            request.addToPath("members");

            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(userIds)
            });
        }
        Service.putMembers = putMembers;

        function getStructure(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("structure");
            request.addParameters(r);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getStructure = getStructure;

        function postData(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("data");

            return $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(r)
            });
        }
        Service.postData = postData;

        function putCollection(superCollectionName, collectionName, c) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);

            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.putCollection = putCollection;

        function deleteCollection(c) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(c.name);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.deleteCollection = deleteCollection;

        function putTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("timeline");

            console.log("[PUT] " + request.url);

            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.putTimeline = putTimeline;

        function deleteTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("timeline");

            console.log("[DELETE] " + request.url);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.deleteTimeline = deleteTimeline;

        function putExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("exhibit");

            console.log("[PUT] " + request.url);

            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.exhibitWithContentItems(e))
            });
        }
        Service.putExhibit = putExhibit;

        function deleteExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("exhibit");

            console.log("[DELETE] " + request.url);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.exhibit(e))
            });
        }
        Service.deleteExhibit = deleteExhibit;

        function putContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");

            console.log("[PUT] " + request.url);

            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.putContentItem = putContentItem;

        function deleteContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");

            console.log("[DELETE] " + request.url);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.deleteContentItem = deleteContentItem;

        function putTour2(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tour2");

            console.log("[PUT] " + request.url);

            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.tour(t))
            });
        }
        Service.putTour2 = putTour2;

        function deleteTour(tourId) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tour");

            console.log("[DELETE] " + request.url);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify({ id: tourId })
            });
        }
        Service.deleteTour = deleteTour;

        function getTours() {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tours");

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTours = getTours;

        function getSearch(query) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("Search");

            var data = {
                searchTerm: query,
                supercollection: CZ.Service.superCollectionName,
                collection: CZ.Service.collectionName
            };

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data
            });
        }
        Service.getSearch = getSearch;

        function getBingImages(query, top, skip) {
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getImages");

            var data = {
                query: query,
                top: top,
                skip: skip
            };

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingImages = getBingImages;

        function getBingVideos(query, top, skip) {
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getVideos");

            var data = {
                query: query,
                top: top,
                skip: skip
            };

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingVideos = getBingVideos;

        function getBingDocuments(query, doctype, top, skip) {
            if (typeof doctype === "undefined") { doctype = undefined; }
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getDocuments");

            var data = {
                query: query,
                doctype: doctype,
                top: top,
                skip: skip
            };

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingDocuments = getBingDocuments;

        function getRecentTweets() {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("twitter/getRecentTweets");

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: _isLocalHost ? _dumpTweetsUrl : request.url,
                success: function (response) {
                }
            });
        }
        Service.getRecentTweets = getRecentTweets;

        function getServiceInformation() {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("info");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getServiceInformation = getServiceInformation;

        function getContentPath(reference) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath(reference);
            request.addToPath("contentpath");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getContentPath = getContentPath;

        function putExhibitContent(e, oldContentItems) {
            CZ.Authoring.resetSessionTimer();
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });

            var promises = e.contentItems.map(function (ci) {
                return putContentItem(ci).then(function (response) {
                    ci.id = ci.guid = response;
                });
            }).concat(oldContentItems.filter(function (ci) {
                return (ci.guid && newGuids.indexOf(ci.guid) === -1);
            }).map(function (ci) {
                return deleteContentItem(ci);
            }));

            return $.when.apply($, promises);
        }
        Service.putExhibitContent = putExhibitContent;

        function putProfile(displayName, email) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            var user = {
                "DisplayName": displayName,
                "Email": email
            };
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(user)
            });
        }
        Service.putProfile = putProfile;

        function deleteProfile(displayName) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            var user = {
                "DisplayName": displayName
            };
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(user)
            });
        }
        Service.deleteProfile = deleteProfile;

        function getProfile(displayName) {
            if (typeof displayName === "undefined") { displayName = _testLogin ? "anonymous" : ""; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            if (displayName != "") {
                request.addParameter("name", displayName);
            }
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            }).done(function (profile) {
                if (!profile.id)
                    return null;

                return profile;
            });
        }
        Service.getProfile = getProfile;

        function getMimeTypeByUrl(url) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("mimetypebyurl");
            if (url == "")
                return result;
            request.addParameter("url", url);
            $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url,
                async: false
            }).done(function (mime) {
                if (mime)
                    result = mime;
            });
            return result;
        }
        Service.getMimeTypeByUrl = getMimeTypeByUrl;

        function getUserTimelines(sc, c) {
            if (typeof sc === "undefined") { sc = Service.superCollectionName; }
            if (typeof c === "undefined") { c = Service.collectionName; }
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("usertimelines");
            request.addParameter("superCollection", sc);
            request.addParameter("Collection", c);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: _isLocalHost ? _dumpTimelinesUrl : request.url
            });
        }
        Service.getUserTimelines = getUserTimelines;

        function getUserFavorites() {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: _isLocalHost ? _dumpTimelinesUrl : request.url
            });
        }
        Service.getUserFavorites = getUserFavorites;
        function deleteUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            if (guid == "")
                return null;
            request.addToPath(guid);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.deleteUserFavorite = deleteUserFavorite;

        function putUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            if (guid == "")
                return null;
            request.addToPath(guid);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.putUserFavorite = putUserFavorite;

        function getUserFeatured(guid) {
            if (typeof guid === "undefined") { guid = "default"; }
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfeatured");
            request.addToPath(guid);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: _isLocalHost ? _dumpTimelinesUrl : request.url
            });
        }
        Service.getUserFeatured = getUserFeatured;

        function deleteUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfeatured");
            if (guid == "")
                return null;
            request.addToPath(guid);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.deleteUserFeatured = deleteUserFeatured;

        function putUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfeatured");
            if (guid == "")
                return null;
            request.addToPath(guid);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.putUserFeatured = putUserFeatured;

        function putTriplet(subject, predicate, object) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify({
                    Subject: subject,
                    Predicate: predicate,
                    Object: object
                })
            });
        }
        Service.putTriplet = putTriplet;

        function getTriplets(subject, predicate, object) {
            if (typeof predicate === "undefined") { predicate = null; }
            if (typeof object === "undefined") { object = null; }
            if (subject == null && predicate == null && object == null)
                throw "Arguments error: all three criteria cannot be null at the same time";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            if (subject != null)
                request.addParameter("subject", encodeURIComponent(subject));
            if (predicate != null)
                request.addParameter("predicate", encodeURIComponent(predicate));
            if (object != null)
                request.addParameter("object", encodeURIComponent(object));
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getTriplets = getTriplets;

        function deleteTriplet(subject, predicate, object) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify({
                    Subject: subject,
                    Predicate: predicate,
                    Object: object
                })
            });
        }
        Service.deleteTriplet = deleteTriplet;

        function getPrefixes() {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("triples");
            request.addToPath("prefixes");
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getPrefixes = getPrefixes;
    })(CZ.Service || (CZ.Service = {}));
    var Service = CZ.Service;
})(CZ || (CZ = {}));
