var CZ;
(function (CZ) {
    (function (Service) {
        var Map;
        (function (Map) {
            function bookmark(ts) {
                return {
                    id: ts.bookmarkId,
                    name: ts.Title,
                    url: ts.NavigationUrl,
                    lapseTime: ts.LapseTime,
                    description: ts.Description,
                    sequenceId: ts.Sequence
                };
            }
            function tour(t) {
                var bookmarks = new Array(t.Stops.length);
                for(var i = 0, n = t.Stops.length; i < n; i++) {
                    bookmarks[i] = bookmark(t.Stops[i]);
                }
                return {
                    id: t.Id,
                    name: t.Title,
                    audio: "",
                    category: t.Category,
                    sequence: t.Sequence,
                    bookmarks: bookmarks
                };
            }
            Map.tour = tour;
            function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    start: t.x,
                    end: typeof t.endDate !== 'undefined' ? t.endDate : (t.x + t.width),
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
            function contentItem(ci) {
                return {
                    id: ci.guid,
                    ParentExhibitId: ci.contentItem ? ci.contentItem.ParentExhibitId : ci.ParentExhibitId,
                    title: ci.contentItem ? ci.contentItem.title : ci.title,
                    description: ci.contentItem ? ci.contentItem.description : ci.description,
                    uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType,
                    attribution: ci.contentItem ? ci.contentItem.attribution : ci.attribution,
                    mediaSource: ci.contentItem ? ci.contentItem.mediaSource : ci.mediaSource
                };
            }
            Map.contentItem = contentItem;
        })(Map || (Map = {}));
        var _serviceUrl = CZ.Settings.serverUrlHost + "/api/";
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
                if(item) {
                    _url += _url.match(/\/$/) ? item : "/" + item;
                }
            };
            this.addParameter = function (name, value) {
                if(value !== undefined && value !== null) {
                    _url += _hasParameters ? "&" : "?";
                    _url += name + "=" + value;
                    _hasParameters = true;
                }
            };
            this.addParameters = function (params) {
                for(var p in params) {
                    if(params.hasOwnProperty(p)) {
                        this.addParameter(p, params[p]);
                    }
                }
            };
        }
        Service.Request = Request;
        ;
        Service.collectionName = "";
        Service.superCollectionName = "";
        function getTimelines(r) {
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", Service.superCollectionName);
            request.addParameter("collection", Service.collectionName);
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
        function getCollections() {
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath("collections");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCollections = getCollections;
        function getStructure(r) {
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
        function putCollection(c) {
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(c.name);
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
                data: JSON.stringify(Map.exhibit(e))
            });
        }
        Service.putExhibit = putExhibit;
        function deleteExhibit(e) {
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
        function postTour(t) {
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tour");
            console.log("[POST] " + request.url);
            return $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.tour(t))
            });
        }
        Service.postTour = postTour;
        function putTour(t) {
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tour");
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
        Service.putTour = putTour;
        function deleteTour(tourId) {
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
                data: JSON.stringify({
                    id: tourId
                })
            });
        }
        Service.deleteTour = deleteTour;
        function getTours() {
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tours");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTours = getTours;
        function getServiceInformation() {
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
        getContentPath;
        function putExhibitContent(e, oldContentItems) {
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
        function getProfile() {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getProfile = getProfile;
    })(CZ.Service || (CZ.Service = {}));
    var Service = CZ.Service;
})(CZ || (CZ = {}));
