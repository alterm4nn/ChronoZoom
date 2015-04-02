/// <reference path='settings.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>
var CZ;
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
                    audio: t.Audio,
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
                    FromIsCirca: t.FromIsCirca,
                    end: typeof t.endDate !== 'undefined' ? t.endDate : CZ.Dates.getDecimalYearFromCoordinate(t.x + t.width),
                    ToIsCirca: typeof t.endDate !== 'undefined' ? t.ToIsCirca: false,
                    title: t.title,
                    Regime: t.regime,
                    backgroundUrl: t.backgroundUrl,
                    aspectRatio: t.aspectRatio
                };
            }
            Map.timeline = timeline;

            function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    IsCirca: e.infodotDescription.isCirca,
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
                    IsCirca: e.infodotDescription.isCirca,
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

        // Testing options.
        var _isLocalHost = constants.environment === "Localhost";
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

        // NOTE: Clear collections to let the server decide what to load.
        Service.superCollectionName = "";
        Service.collectionName = "";
        Service.canEdit = false;

        // .../export/timeline/{topmostTimelineId}
        function exportTimelines(topmostTimelineId)
        {
            if (typeof topmostTimelineId === 'undefined')
            {
                throw 'exportTimelines(topmostTimelineId) requires a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(topmostTimelineId) == false)
            {
                if (topmostTimelineId != "00000000-0000-0000-0000-000000000000")
                throw 'exportTimelines(topmostTimelineId) has an invalid parameter. The provided parameter must be a GUID.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('export');
            request.addToPath('timeline');
            request.addToPath(topmostTimelineId);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                url:        request.url,
                dataType:   'json'
            });
        }
        Service.exportTimelines = exportTimelines;

        // .../import/timeline/{intoTimelineId}
        function importTimelines(intoTimelineId, newTimelineTree)
        {
            if (typeof intoTimelineId === 'undefined' || typeof newTimelineTree === 'undefined')
            {
                throw 'importTimelines(intoTimelineId, newTimelineTree) is missing a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(intoTimelineId) == false)
            {
                if (intoTimelineId != "00000000-0000-0000-0000-000000000000")
                throw 'importTimelines(intoTimelineId, newTimelineTree) has an invalid intoTimelineId parameter. This must be a GUID.';
            }
            if (typeof newTimelineTree !== 'string')
            {
                throw 'importTimelines(intoTimelineId, newTimelineTree) has an invalid newTimelineTree parameter. This must be a JSON.stringify string.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('import');
            request.addToPath('timeline');
            request.addToPath(intoTimelineId);
            return $.ajax
            ({
                type:           'PUT',
                cache:          false,
                url:            request.url,
                contentType:    'application/json',
                dataType:       'json',
                data:           newTimelineTree     // should already be JSON.stringified
            });
        }
        Service.importTimelines = importTimelines;

        // .../export/exhibit/{exhibitId}
        function exportExhibit(exhibitId) {
            if (typeof exhibitId === 'undefined') {
                throw 'exportExhibit(exhibitId) requires a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(exhibitId) == false) {
                if (exhibitId != "00000000-0000-0000-0000-000000000000")
                    throw 'exportExhibit(exhibitId) has an invalid parameter. The provided parameter must be a GUID.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('export');
            request.addToPath('exhibit');
            request.addToPath(exhibitId);
            return $.ajax
            ({
                type: 'GET',
                cache: false,
                url: request.url,
                dataType: 'json'
            });
        }
        Service.exportExhibit = exportExhibit;

        // .../import/exhibit/{intoTimelineId}
        function importExhibit(intoTimelineId, newExhibit) {
            if (typeof intoTimelineId === 'undefined' || typeof newExhibit === 'undefined') {
                throw 'importExhibit(intoTimelineId, newExhibit) is missing a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(intoTimelineId) == false) {
                if (intoTimelineId != "00000000-0000-0000-0000-000000000000")
                    throw 'importExhibit(intoTimelineId, newExhibit) has an invalid intoTimelineId parameter. This must be a GUID.';
            }
            if (typeof newExhibit !== 'string') {
                throw 'importExhibit(intoTimelineId, newExhibit) has an invalid newTimelineTree parameter. This must be a JSON.stringify string.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('import');
            request.addToPath('exhibit');
            request.addToPath(intoTimelineId);
            return $.ajax
            ({
                type: 'PUT',
                cache: false,
                url: request.url,
                contentType: 'application/json',
                dataType: 'json',
                data: newExhibit     // should already be JSON.stringified
            });
        }
        Service.importExhibit = importExhibit;

        // .../import/collection
        function importCollection(collectionTree)
        {
            if (typeof collectionTree !== 'string')
            {
                throw 'importCollection(collectionTree) missing the collectionTree parameter.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath('import');
            request.addToPath('collection');
            return $.ajax
            ({
                type:           'PUT',
                cache:          false,
                url:            request.url,
                contentType:    'application/json',
                dataType:       'json',
                data:           collectionTree      // should already be JSON.stringified
            });
        }
        Service.importCollection = importCollection;

        // .../getroot?supercollection=&collection=
        function getRootTimelineId(sc, c)
        {
            if (typeof sc === "undefined") sc = Service.superCollectionName;
            if (typeof  c === "undefined") c  = Service.collectionName;
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("getroot");
            request.addParameter("supercollection", sc);
            request.addParameter("collection", c);
            return $.ajax
            ({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getRootTimelineId = getRootTimelineId;

        // .../gettimelines?supercollection=&collection=&start=&end=&minspan=&lca=
        function getTimelines(r, sc, c) {
            if (typeof sc === "undefined") sc = Service.superCollectionName;
            if (typeof  c === "undefined")  c = Service.collectionName;
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", sc);
            request.addParameter("collection", c);
            request.addParameters(r);
            return $.ajax
            ({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTimelines = getTimelines;

        /**
        * Information Retrieval.
        */

        // .../supercollections
        function getSuperCollections()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("supercollections");
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getSuperCollections = getSuperCollections;

        // .../{superCollectionName}/collections
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

        // .../{supercollection}/data
        // .../{supercollection}/{collection}/data
        function getCollection()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("data");
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getCollection = getCollection;

        // .../isuniquecollectionname?new={proposedCollectionName}
        // .../{supercollection}/isuniquecollectionname?new={proposedCollectionName}
        // .../{supercollection}/{existingCollectionPath}/isuniquecollectionname?new={proposedCollectionName}
        function isUniqueCollectionName(proposedCollectionName)
        {
            if (typeof proposedCollectionName === 'undefined') return false;

            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            if (typeof Service.superCollectionName  !== 'undefined') request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName       !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath('isuniquecollectionname');
            request.addParameter('new', encodeURIComponent(proposedCollectionName));
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.isUniqueCollectionName = isUniqueCollectionName;

        // .../exhibit/{exhibitId}/lastupdate
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

        // .../find/users?partial={partialName}
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

        // .../{supercollection}/{collection}/canedit or
        // .../{supercollection}/canedit for default collection beneath supercollection
        function getCanEdit()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("canedit");
            return $.ajax
            ({
                type:       "GET",
                cache:      false,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getCanEdit = getCanEdit;

        // .../{supercollection}/members
        // .../{supercollection}/{collection}/members
        function getMembers()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("members");
            return $.ajax
            ({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getMembers = getMembers;

        // .../{supercollection}/members
        // .../{supercollection}/{collection}/members
        function putMembers(superCollectionName, collectionName, userIds)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(collectionName);
            request.addToPath("members");
            return $.ajax
            ({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(userIds)
            });
        }
        Service.putMembers = putMembers;

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
        // NOTE: Not implemented in current API.
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

        // .../{supercollection}/{collection}/data
        // NOTE: Not implemented in current API.
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

        // .../{superCollectionPath}/{newCollectionPath}
        function postCollection(newCollectionPath, newCollectionData)
        {
            if (typeof newCollectionPath === 'undefined') return false;
            if (typeof newCollectionData === 'undefined') return false;

            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(newCollectionPath);

            return $.ajax
            ({
                type:           'POST',
                cache:          false,
                contentType:    'application/json',
                dataType:       'json',
                url:            request.url,
                data:           JSON.stringify(newCollectionData)
            });
        }
        Service.postCollection = postCollection;

        // .../{supercollection}/
        // .../{supercollection}/{collection}
        function putCollection(superCollectionName, collectionName, c)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(collectionName);

            return $.ajax
            ({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.putCollection = putCollection;

        // .../{supercollection}/{collection}
        function deleteCollection()
        {
            if (typeof Service.collectionName === 'undefined') return false;

            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            return $.ajax
            ({
                type:           "DELETE",
                cache:          false,
                contentType:    "application/json",
                url: request.url
            });
        }
        Service.deleteCollection = deleteCollection

        // .../{supercollection}/{collection}/timeline or
        // .../{supercollection}/timeline for default collection
        function putTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("timeline");
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

        // .../{supercollection}/timeline
        // .../{supercollection}/{collection}/timeline
        function deleteTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.deleteTimeline = deleteTimeline;

        // .../{supercollection}/exhibit
        // .../{supercollection}/{collection}/exhibit
        function putExhibit(e)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
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

        // .../{supercollection}/exhibit
        // .../{supercollection}/{collection}/exhibit
        function deleteExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.exhibit(e))
            });
        }
        Service.deleteExhibit = deleteExhibit;

        // .../{supercollection}/contentitem
        // .../{supercollection}/{collection}/contentitem
        function putContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
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

        // .../{supercollection}/{collection}/contentitem
        function deleteContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.deleteContentItem = deleteContentItem;

        // .../{supercollection}/tour
        // .../{supercollection}/{collection}/tour
        function putTour2(t)
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("tour2");
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

        // .../{supercollection}/tour
        // .../{supercollection}/{collection}/tour
        function deleteTour(tourId) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("tour");
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

        // .../{supercollection}/{collection}/tour or
        // .../{supercollection}/tour for default collection
        function getTour(tourGUID)
        {
            if (typeof tourGUID === 'undefined')
            {
                throw 'getTour(tourGUID) requires a parameter.';
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tourGUID) == false)
            {
                throw 'getTour(tourGUID) has an invalid parameter. The provided parameter must be a GUID.';
            }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName); // || 'chronozoom');
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath('tour');
            request.addParameter('guid', tourGUID);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                url:        request.url,
                dataType:   'json'
            });
        }
        Service.getTour = getTour;

        // .../{supercollection}/{collection}/tours or
        // .../{supercollection}/tours for default collection
        function getTours()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            if (typeof Service.collectionName !== 'undefined') request.addToPath(Service.collectionName);
            request.addToPath("tours");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTours = getTours;

        // .../search/scope/options
        function getSearchScopeOptions()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("search");
            request.addToPath("scope");
            request.addToPath("options");
            return $.ajax
            ({
                type:       "GET",
                cache:      true,
                dataType:   "json",
                url:        request.url
            });
        }
        Service.getSearchScopeOptions = getSearchScopeOptions;

        // .../search?superCollection={superCollection}&collection={collection}&searchTerm={searchTerm}&searchScope={searchScope}
        function getSearch(query, scope)
        {
            if (scope !== parseInt(scope))  scope = 1;
            if (scope < 1)                  scope = 1;

            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("Search");

            var data =
            {
                supercollection:    CZ.Service.superCollectionName,
                collection:         CZ.Service.collectionName,
                searchTerm:         query,
                searchScope:        scope
            };
            return $.ajax
            ({
                type:           "GET",
                cache:          false,
                contentType:    "application/json",
                dataType:       "json",
                url:            request.url,
                data:           data
            });
        }
        Service.getSearch = getSearch;

        // .../bing/getImages
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

        // .../bing/getVideos
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

        // .../bing/getDocuments
        // set doctype to undefined if you want it to be omited
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

        // .../{supercollection}/{collection}/structure?start=&end=&minspan=&lca=
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

        // .../{supercollection}/{collection}/{reference}/contentpath
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

        /**
        * Auxiliary Methods.
        */
        function putExhibitContent(e, oldContentItems) {
            CZ.Authoring.resetSessionTimer();
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });

            // Send PUT request for all exhibit's content items.
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

        /**
        * Update user profile.
        * @param  {Object} username .
        * @param  {Object} email .
        */
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

        /**
        * Delete user profile.
        * @param  {Object} username .
        */
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

        function getEditableTimelines(includeMine)
        {
            if (typeof includeMine !== 'boolean') { includeMine = false; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath('editabletimelines');
            request.addParameter('includeMine', includeMine);
            return $.ajax({
                type: 'GET',
                cache: false,
                dataType: 'json',
                url: request.url
            });
        }
        Service.getEditableTimelines = getEditableTimelines;

        function getEditableCollections(includeMine)
        {
            if (typeof includeMine !== 'boolean') { includeMine = false; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath('editablecollections');
            request.addParameter('includeMine',             includeMine);
            request.addParameter('currentSuperCollection',  Service.superCollectionName);
            request.addParameter('currentCollection',       Service.collectionName);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                dataType:   'json',
                url:        request.url
            });
        }
        Service.getEditableCollections = getEditableCollections;

        function getRecentlyUpdatedExhibits(quantity)
        {
            if (!$.isNumeric(quantity)) quantity = 6;
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath('recentlyupdatedexhibits');
            request.addParameter('quantity', quantity);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                dataType:   'json',
                url:        request.url
            });
        }
        Service.getRecentlyUpdatedExhibits = getRecentlyUpdatedExhibits;

        function getUserFavorites()
        {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            request.addParameter('currentSuperCollection',  Service.superCollectionName);
            request.addParameter('currentCollection',       Service.collectionName);
            return $.ajax
            ({
                type:       'GET',
                cache:      false,
                dataType:   'json',
                url:        request.url
            });
        }
        Service.getUserFavorites = getUserFavorites;

        function deleteUserFavorite(guid)
        {
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

        //Triples
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
