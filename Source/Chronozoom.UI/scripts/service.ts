/// <reference path='settings.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>

module CZ {
    export module Service {

        module Map {
            function bookmark(ts: CZ.UI.TourStop): any {
                return {
                    name: ts.Title,
                    url: ts.NavigationUrl,
                    lapseTime: ts.LapseTime,
                    description: ts.Description,
                };
            }

            export function tour(t: CZ.UI.Tour): any {
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

            export function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    start: CZ.Dates.getDecimalYearFromCoordinate(t.x),
                    end: typeof t.endDate !== 'undefined' ? t.endDate : CZ.Dates.getDecimalYearFromCoordinate(t.x + t.width),
                    title: t.title,
                    Regime: t.regime
                };
            }

            export function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: undefined
                };
            }

            export function exhibitWithContentItems(e) {
                var mappedContentItems = [];
                $(e.contentItems).each(function (contentItemIndex, contentItem) {
                    mappedContentItems.push(Map.contentItem(contentItem))
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

            export function contentItem(ci) {
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
        }

        var _serviceUrl = CZ.Settings.serverUrlHost + "/api/";

        export function Request(urlBase) {
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
        };


        // NOTE: Clear collections to let the server decide what to load.
        export var collectionName = "";
        export var superCollectionName = "";

        /**
        * Chronozoom.svc Requests.
        */

        // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
        export function getTimelines(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", superCollectionName);
            request.addParameter("collection", collectionName);
            request.addParameters(r);

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        /**
            * Information Retrieval.
            */

        // .../{superCollectionName}/collections
        // NOTE: Not implemented in current API.
        export function getCollections(superCollectionName: string) {
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

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
        export function getStructure(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
            request.addToPath("structure");
            request.addParameters(r);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
        export function postData(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        /**
        * Information Modification.
        */

        // .../{supercollection}/{collection}
        export function putCollection(superCollectionName: string, collectionName: string, c) {
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

        // .../{supercollection}/{collection}
        export function deleteCollection(c) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(c.name);

            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }

        // .../{supercollection}/{collection}/timeline
        export function putTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/timeline
        export function deleteTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/exhibit
        export function putExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/exhibit
        export function deleteExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/contentitem
        export function putContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/contentitem
        export function deleteContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/tour
        // Creates or updates a tour
        export function putTour2(t: CZ.UI.Tour) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/tour
        // Deletes a tour
        export function deleteTour(tourId: string) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
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

        // .../{supercollection}/{collection}/tours
        export function getTours() {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
            request.addToPath("tours");

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        // .../search
        export function getSearch(query) {
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

        // .../bing/getImages
        export function getBingImages(query, top = CZ.Settings.defaultBingSearchTop, skip = CZ.Settings.defaultBingSearchSkip) {
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

        // .../bing/getVideos
        export function getBingVideos(query, top = CZ.Settings.defaultBingSearchTop, skip = CZ.Settings.defaultBingSearchSkip) {
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

        // .../bing/getDocuments
        // set doctype to undefined if you want it to be omited
        export function getBingDocuments(query, doctype = undefined, top = CZ.Settings.defaultBingSearchTop, skip = CZ.Settings.defaultBingSearchSkip) {
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

        // .../twitter/getRecentTweets
        export function getRecentTweets() {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("twitter/getRecentTweets");

            console.log("[GET] " + request.url);

            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                success: function (response) {
                }
            });
        }

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        export function getServiceInformation() {
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

        // .../{supercollection}/{collection}/{reference}/contentpath
        export function getContentPath(reference: string) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
            request.addToPath(reference);
            request.addToPath("contentpath");

            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }

        /**
        * Auxiliary Methods.
        */

        export function putExhibitContent(e, oldContentItems): JQueryPromise {
            CZ.Authoring.resetSessionTimer();
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });

            // Send PUT request for all exhibit's content items.
            var promises = e.contentItems.map(
                function (ci) {
                    return putContentItem(ci).then(response => {
                        ci.id = ci.guid = response;
                    });
                }
            ).concat(
                // Filter deleted content items and send DELETE request for them.
                oldContentItems.filter(
                    function (ci) {
                        return (ci.guid && newGuids.indexOf(ci.guid) === -1);
                    }
                ).map(
                    function (ci) {
                        return deleteContentItem(ci);
                    }
                )
             );

            return $.when.apply($, promises);
        }
        /**
        * Update user profile.
        * @param  {Object} username .
        * @param  {Object} email .
        */
        export function putProfile(displayName, email) {
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

        /**
        * Delete user profile.
        * @param  {Object} username .
        */
        export function deleteProfile(displayName) {
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

        export function getProfile(displayName = "") {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            if (displayName != "")
                request.addParameter("name", displayName);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            }).done(profile => {
                if (!profile.id)
                    return null;

                return profile;
            });
        }

        export function getMimeTypeByUrl(url): string {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("getmimetypebyurl");
            if (url == "") return result;
            request.addParameter("url", url);
            $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url,
                async: false
            }).done(mime => {
                if(mime)
                    result = mime;
            });
            return result;
        }

        export function getUserFavorites(){
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("getuserfavorites");
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        export function deleteUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("deleteuserfavorite");
            if (guid == "") return null;
            request.addParameter("guid", guid);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }

        export function putUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("putuserfavorite");
            if (guid == "") return null;
            request.addParameter("guid", guid);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }

        export function getUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("getuserfeatured");
            request.addParameter("guid", guid);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }

        export function deleteUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("deleteuserfeatured");
            if (guid == "") return null;
            request.addParameter("guid", guid);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }

        export function putUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("putuserfeatured");
            if (guid == "") return null;
            request.addParameter("guid", guid);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
    }
}
