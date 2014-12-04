/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='service.ts'/>
/// <reference path='dates.ts' />
/**
* The CZ submodule for Authoring Tool functionality.
* Use initialize() method to bind UI with Authoring Tool.
*/
var CZ;
(function (CZ) {
    (function (Authoring) {
        // Virtual canvas widget.
        var _vcwidget;

        // Mouse position.
        var _dragStart = {};
        var _dragPrev = {};
        var _dragCur = {};

        // Current hovered object in virtual canvas.
        var _hovered = {};

        // New timeline rectangle.
        var _rectPrev = { type: "rectangle" };
        var _rectCur = { type: "rectangle" };

        // New exhibit circle.
        var _circlePrev = { type: "circle" };
        var _circleCur = { type: "circle" };

        // Selected objects for editing.
        Authoring.selectedTimeline = {};
        Authoring.selectedExhibit = {};
        Authoring.selectedContentItem = {};

        // Authoring Tool state.
        Authoring.isActive = false;
        Authoring.isEnabled = false;
        Authoring.isDragging = false;

        //TODO: use enum for authoring modes when new authoring forms will be completly integrated
        Authoring.mode = null;
        Authoring.contentItemMode = null;

        // Forms' handlers.
        Authoring.showCreateTimelineForm = null;
        Authoring.showCreateRootTimelineForm = null;
        Authoring.showEditTimelineForm = null;
        Authoring.showCreateExhibitForm = null;
        Authoring.showEditExhibitForm = null;
        Authoring.showEditContentItemForm = null;
        Authoring.showEditTourForm = null;
        Authoring.showMessageWindow = null;
        Authoring.hideMessageWindow = null;

        // Generic callback function set by the form when waits user's input (e.g. mouse click) to continue.
        Authoring.callback = null;

        Authoring.timer;

        /**
        * Tests a timeline/exhibit on intersection with another virtual canvas object.
        * @param  {Object}  te   A timeline/exhibit to test.
        * @param  {Object}  obj  Virtual canvas object.
        * @return {Boolean}      True in case of intersection, False otherwise.
        */
        function isIntersecting(te, obj) {
            switch (obj.type) {
                case "timeline":
                case "infodot":
                    return (te.x + te.width > obj.x && te.x < obj.x + obj.width && te.y + te.height > obj.y && te.y < obj.y + obj.height);
                default:
                    return false;
            }
        }

        /**
        * Tests a virtual canvas object on inclusion in a timeline.
        * @param  {Object}  tp  An estimated parent timeline.
        * @param  {Object}  obj An estimated child virtual canvas object.
        * @return {Boolean}     True in case of inclusion, False otherwise.
        */
        function isIncluded(tp, obj) {
            switch (obj.type) {
                case "infodot":
                    return (tp.x <= obj.infodotDescription.date && tp.x + tp.width >= obj.infodotDescription.date && tp.y + tp.height >= obj.y + obj.height);
                    break;
                case "timeline":
                case "rectangle":
                case "circle":
                    return (tp.x <= obj.x + CZ.Settings.allowedMathImprecision && tp.x + tp.width >= obj.x + obj.width - CZ.Settings.allowedMathImprecision && tp.y + tp.height >= obj.y + obj.height - CZ.Settings.allowedMathImprecision);
                default:
                    return true;
            }
        }

        /**
        * The main function to test a timeline on intersections.
        * First of all it tests on inclusion in parent timeline.
        * Then it tests a timeline on intersection with each parent's child.
        * Also tests on inclusion all timeline's children if it has some.
        * @param  {Object} tp       An estimated parent timeline.
        * @param  {Object} tc       An estimated child timeline. This one will be tested.
        * @param  {Boolean} editmode If true, it doesn't take into account edited timeline.
        * @return {Boolean}          True if test is passed, False otherwise.
        */
        function checkTimelineIntersections(tp, tc, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;

            // If creating root timeline, skip intersection validations
            if (!tp || tp.guid === null) {
                return true;
            }

            // Test on inclusion in parent.
            if (!isIncluded(tp, tc) && tp.id !== "__root__") {
                return false;
            }

            for (i = 0, len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === Authoring.selectedTimeline) : (tp.children[i] === tc);
                if (!selfIntersection && isIntersecting(tc, tp.children[i])) {
                    return false;
                }
            }

            // Test on children's inclusion (only possible in editmode).
            if (editmode && Authoring.selectedTimeline.children && Authoring.selectedTimeline.children.length > 0) {
                for (i = 0, len = Authoring.selectedTimeline.children.length; i < len; ++i) {
                    if (!isIncluded(tc, Authoring.selectedTimeline.children[i])) {
                        return false;
                    }
                }
            }

            return true;
        }

        /**
        * The main function to test an exhibit on intersections.
        * First of all it tests on inclusion in parent timeline.
        * Then it tests a timeline on intersection with each parent's child.
        * @param  {Object} tp       An estimated parent timeline.
        * @param  {Object} ec       An estimated child exhibit. This one will be tested.
        * @param  {Boolean} editmode If true, it doesn't take into account edited exhibit.
        * @return {Boolean}          True if test is passed, False otherwise.
        */
        function checkExhibitIntersections(tp, ec, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;

            // Test on inclusion in parent.
            if (!isIncluded(tp, ec)) {
                return false;
            }

            return true;
        }
        Authoring.checkExhibitIntersections = checkExhibitIntersections;

        /**
        * Updates rectangle of new timeline during creation.
        */
        function updateNewRectangle() {
            // Update rectangle's size and position.
            _rectCur.x = Math.min(_dragStart.x, _dragCur.x);
            _rectCur.y = Math.min(_dragStart.y, _dragCur.y);
            _rectCur.width = Math.abs(_dragStart.x - _dragCur.x);
            _rectCur.height = Math.abs(_dragStart.y - _dragCur.y);

            // Test on intersections and update timeline's rectangle if it passes the test.
            if (checkTimelineIntersections(_hovered, _rectCur, false)) {
                // Set border's color of timeline's rectangle.
                var settings = $.extend({}, _hovered.settings);
                settings.strokeStyle = "yellow";

                $.extend(_rectPrev, _rectCur);

                CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                CZ.VCContent.addRectangle(_hovered, _hovered.layerid, "newTimelineRectangle", _rectCur.x, _rectCur.y, _rectCur.width, _rectCur.height, settings);
            } else {
                $.extend(_rectCur, _rectPrev);
            }
        }

        /**
        * Updates circle of new exhibit during creation.
        */
        function updateNewCircle() {
            // Update circle's position and radius.
            // NOTE: These values are heuristic.
            _circleCur.r = (_hovered.width > _hovered.height) ? _hovered.height / 27.7 : _hovered.width / 10.0;

            _circleCur.x = _dragCur.x - _circleCur.r;
            _circleCur.y = _dragCur.y - _circleCur.r;
            _circleCur.width = _circleCur.height = 2 * _circleCur.r;

            // Test on intersections and update exhibits's circle if it passes the test.
            if (checkExhibitIntersections(_hovered, _circleCur, false)) {
                $.extend(_circlePrev, _circleCur);

                CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
                CZ.VCContent.addCircle(_hovered, "layerInfodots", "newExhibitCircle", _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, {
                    strokeStyle: "yellow"
                }, false);
            } else {
                $.extend(_circleCur, _circlePrev);
            }
        }

        /**
        * Removes and then adds exhibit and all of its nested content from canvas. Used to simplify
        * update of exhibit's info.
        * Use it in when you need to update exhibit's or some of its content item's info.
        * @param  {Object} e    An exhibit to renew.
        */
        function renewExhibit(e) {
            var vyc = e.y + e.height / 2;
            var time = e.x + e.width / 2;
            var id = e.id;
            var cis = e.contentItems;
            var descr = e.infodotDescription;
            descr.opacity = 1;
            descr.title = e.title;
            descr.guid = e.guid;
            var parent = e.parent;
            var radv = e.outerRad;

            // remove and then adding infodot to position content items properly
            CZ.VCContent.removeChild(parent, id);
            return CZ.VCContent.addInfodot(parent, "layerInfodots", id, time, vyc, radv, cis, descr);
        }
        Authoring.renewExhibit = renewExhibit;

        /**
        * Creates new timeline and adds it to virtual canvas.
        * @return {Object} Created timeline.
        */
        function createNewTimeline() {
            return CZ.VCContent.addTimeline(_hovered, _hovered.layerid, undefined, {
                timeStart: _rectCur.x,
                timeEnd: _rectCur.x + _rectCur.width,
                header: "Timeline Title",
                top: _rectCur.y,
                height: _rectCur.height,
                fillStyle: _hovered.settings.fillStyle,
                regime: _hovered.regime,
                gradientFillStyle: _hovered.settings.gradientFillStyle,
                lineWidth: _hovered.settings.lineWidth,
                strokeStyle: _hovered.settings.gradientFillStyle
            });
        }
        Authoring.createNewTimeline = createNewTimeline;

        /**
        * Creates new exhibit and adds it to virtual canvas.
        * @return {Object} Created exhibit.
        */
        function createNewExhibit() {
            CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
            return CZ.VCContent.addInfodot(_hovered, "layerInfodots", undefined, _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, [], {
                title: "Exhibit Title",
                date: _circleCur.x + _circleCur.r,
                guid: undefined
            });
        }

        /**
        * Updates title of edited timeline. It creates new CanvasText
        * object for title for recalculation of title's size.
        * @param  {Object} t Edited timeline, whose title to update.
        */
        function updateTimelineTitle(t) {
            // computing titleBorderBox - margins, width, height of canvas text based on algorithm in layout.ts
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            t.left = t.x;
            t.right = t.x + t.width;
            var titleBorderBox = CZ.Layout.GenerateTitleObject(t.height, t, ctx);

            // remove old timeline header
            CZ.VCContent.removeChild(t, t.id + "__header__");

            // add new timeline's header
            var baseline = t.y + titleBorderBox.marginTop + titleBorderBox.height / 2.0;
            t.titleObject = CZ.VCContent.addText(t, t.layerid, t.id + "__header__", t.x + titleBorderBox.marginLeft, t.y + titleBorderBox.marginTop, baseline, titleBorderBox.height, t.title, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle',
                opacity: 1
            }, titleBorderBox.width);
        }

        /**
        * Represents a collection of mouse events' handlers for each mode.
        * Example of using: CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
        *                   (calls mouseup event handler for current mode)
        */
        Authoring.modeMouseHandlers = {
            createTimeline: {
                mousemove: function () {
                    if (CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },
                mouseup: function () {
                    if (_dragCur.x === _dragStart.x && _dragCur.y === _dragStart.y) {
                        return;
                    }

                    if (_hovered.type === "timeline") {
                        CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                        Authoring.selectedTimeline = createNewTimeline();
                        Authoring.showCreateTimelineForm(Authoring.selectedTimeline);
                    }
                }
            },
            editTour: {},
            "editTour-selectTarget": {
                mouseup: function () {
                    if (Authoring.callback != null && _hovered != undefined && _hovered != null && typeof _hovered.type != "undefined")
                        Authoring.callback(_hovered);
                },
                mousemove: function () {
                }
            },
            editTimeline: {
                mouseup: function () {
                    Authoring.showEditTimelineForm(Authoring.selectedTimeline);
                }
            },
            createExhibit: {
                mousemove: function () {
                    if (CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewCircle();
                    }
                },
                mouseup: function () {
                    if (_hovered.type === "timeline") {
                        updateNewCircle();

                        Authoring.selectedExhibit = createNewExhibit();
                        Authoring.showCreateExhibitForm(Authoring.selectedExhibit);
                    }
                }
            },
            editExhibit: {
                mouseup: function () {
                    Authoring.showEditExhibitForm(Authoring.selectedExhibit);
                }
            },
            editContentItem: {
                mouseup: function () {
                    Authoring.showEditContentItemForm(Authoring.selectedContentItem, Authoring.selectedExhibit);
                }
            }
        };

        /**
        * The main function for binding UI and Authoring Tool.
        * It assigns additional handlers for virtual canvas mouse
        * events and forms' handlers.
        * @param  {Object} vc           jQuery instance of virtual canvas.
        * @param  {Object} formHandlers An object with the same "show..." methods as Authoring object.
        */
        function initialize(vc, formHandlers) {
            _vcwidget = vc.data("ui-virtualCanvas");

            _vcwidget.element.on("mousedown", function (event) {
                if (CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    CZ.Authoring.isDragging = true;
                    _dragStart = posv;
                    _dragPrev = {};
                    _dragCur = posv;
                    _hovered = _vcwidget.hovered || {};
                }
            });

            _vcwidget.element.on("mouseup", function (event) {
                if (CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    CZ.Authoring.isDragging = false;
                    _dragPrev = _dragCur;
                    _dragCur = posv;

                    // NOTE: Using global variable to disable animation on click!
                    CZ.Common.controller.stopAnimation();

                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
                }
            });

            _vcwidget.element.on("mousemove", function (event) {
                if (CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    _dragPrev = _dragCur;
                    _dragCur = posv;

                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mousemove"]();
                }
            });

            // Assign forms' handlers.
            Authoring.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {
            };
            Authoring.showCreateRootTimelineForm = formHandlers && formHandlers.showCreateRootTimelineForm || function () {
            };
            Authoring.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () {
            };
            Authoring.showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () {
            };
            Authoring.showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () {
            };
            Authoring.showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () {
            };
            Authoring.showEditTourForm = formHandlers && formHandlers.showEditTourForm || function () {
            };
            Authoring.showMessageWindow = formHandlers && formHandlers.showMessageWindow || function (mess, title) {
            };
            Authoring.hideMessageWindow = formHandlers && formHandlers.hideMessageWindow || function () {
            };
        }
        Authoring.initialize = initialize;

        /**
        * Updates timeline's properties.
        * Use it externally from forms' handlers.
        * @param  {Object} t    A timeline to update.
        * @param  {Object} prop An object with properties' values.
        * @param  {Widget} form A dialog form for editing timeline.
        */
        function updateTimeline(t, prop) {
            var deffered = jQuery.Deferred();

            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: prop.end === 9999 ? Number(CZ.Dates.getCoordinateFromDecimalYear(prop.end) - prop.start) : Number(prop.end - prop.start),
                height: t.height,
                type: "rectangle"
            };

            if (checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.endDate = prop.end;

                // Decrease height if possible to make better aspect ratio.
                // Source: layout.js, LayoutTimeline method.
                // NOTE: it won't cause intersection errors since height decreases
                //       and the timeline has no any children (except CanvasImage
                //       and CanvasText for edit button and title).
                if (t.children.length < 3) {
                    t.height = Math.min.apply(Math, [
                        t.parent.height * CZ.Layout.timelineHeightRate,
                        t.width * CZ.Settings.timelineMinAspect,
                        t.height
                    ]);
                }

                // Update title.
                t.title = prop.title;
                updateTimelineTitle(t);

                // Update background URL and aspect ratio.
                t.backgroundUrl = prop.backgroundUrl;
                t.aspectRatio = prop.aspectRatio;

                CZ.Service.putTimeline(t).then(function (success) {
                    // update ids if existing elements with returned from server
                    t.id = "t" + success;
                    t.guid = success;
                    t.titleObject.id = "t" + success + "__header__";

                    if (!t.parent.guid) {
                        // Root timeline, refresh page
                        document.location.reload(true);
                    } else {
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                    deffered.resolve(t);
                }, function (error) {
                    deffered.reject(error);
                });
            } else {
                deffered.reject('Timeline intersects with parent timeline or other siblings');
            }

            return deffered.promise();
        }
        Authoring.updateTimeline = updateTimeline;
        ;

        /**
        * Removes a timeline from virtual canvas.
        * Use it externally from form's handlers.
        * @param  {Object} t A timeline to remove.
        */
        function removeTimeline(t) {
            var deferred = $.Deferred();

            CZ.Service.deleteTimeline(t).then(function (updateCanvas) {
                CZ.Common.vc.virtualCanvas("requestInvalidate");
                deferred.resolve();
            });
            var isRoot = !t.parent.guid;
            CZ.VCContent.removeChild(t.parent, t.id);

            if (isRoot) {
                // Root timeline, refresh page
                document.location.reload(true);
            }
        }
        Authoring.removeTimeline = removeTimeline;

        /**
        * Updates exhibit's properties.
        * Use it externally from forms' handlers.
        * @param  {Object} e    An exhibit to update.
        * @param  {Object} args An object with properties' values.
        */
        function updateExhibit(oldExhibit, args) {
            var deferred = $.Deferred();

            if (oldExhibit && oldExhibit.contentItems && args) {
                var newExhibit = $.extend({}, oldExhibit, { children: null });
                newExhibit = $.extend(true, {}, newExhibit); // deep copy exhibit
                delete newExhibit.children;
                delete newExhibit.contentItems;
                $.extend(true, newExhibit, args); // overwrite and append properties

                // pass cloned objects to CZ.Service calls to avoid any side effects
                CZ.Service.putExhibit(newExhibit).then(function (response) {
                    newExhibit.guid = response.ExhibitId;
                    for (var i = 0; i < newExhibit.contentItems.length; i++) {
                        newExhibit.contentItems[i].ParentExhibitId = newExhibit.guid;
                    }

                    $(response.ContentItemId).each(function (contentItemIdIndex, contentItemId) {
                        newExhibit.contentItems[contentItemIdIndex].id = contentItemId;
                        newExhibit.contentItems[contentItemIdIndex].guid = contentItemId;
                    });

                    newExhibit = renewExhibit(newExhibit);
                    newExhibit.id = "e" + response.ExhibitId;

                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve(newExhibit);
                }, function (error) {
                    console.log("Error connecting to service: update exhibit.\n" + error.responseText);
                    deferred.reject(error);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.updateExhibit = updateExhibit;

        /**
        * Removes an exhibit from virtual canvas.
        * Use it externally from form's handlers.
        * @param  {Object} e An exhibit to remove.
        */
        function removeExhibit(e) {
            var deferred = $.Deferred();

            if (e && e.id && e.parent) {
                var clone = $.extend({}, e, { children: null });
                clone = $.extend(true, {}, clone);

                CZ.Service.deleteExhibit(clone).then(function (response) {
                    CZ.VCContent.removeChild(e.parent, e.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: remove exhibit.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.removeExhibit = removeExhibit;

        /**
        * Updates content item's properties in selected exhibit.
        * Use it externally from forms' handlers.
        * @param  {CanvasInfodot} e A selected exhibit.
        * @param  {ContentItemMetadata} c A content item in selected exhibit.
        * @param  {Object} args An object with updated property values.
        */
        function updateContentItem(e, c, args) {
            var deferred = $.Deferred();

            if (e && e.contentItems && e.contentItems.length && c && args) {
                var clone = $.extend(true, {}, c, args);

                CZ.Service.putContentItem(clone).then(function (response) {
                    $.extend(c, clone);
                    c.id = c.guid = response;
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: update content item.\n" + error.responseText);
                    deferred.reject(error);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.updateContentItem = updateContentItem;

        /**
        * Removes content item from selected exhibit.
        * Use it externally from form's handlers.
        * @param  {CanvasInfodot} e A selected exhibit.
        * @param  {ContentItemMetadata} c A content item in selected exhibit.
        */
        function removeContentItem(e, c) {
            var deferred = $.Deferred();

            if (e && e.contentItems && e.contentItems.length && c && c.index) {
                var clone = $.extend(true, {}, c);

                CZ.Service.deleteContentItem(clone).then(function (response) {
                    e.contentItems.splice(c.index, 1);
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: remove content item.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }
        Authoring.removeContentItem = removeContentItem;

        /**
        * Validates possible input errors for timelines.
        */
        function validateTimelineData(start, end, title) {
            var isValid = (start !== false) && (end !== false);
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.isIntervalPositive(start, end);
            return isValid;
        }
        Authoring.validateTimelineData = validateTimelineData;

        /**
        * Validates possible input errors for exhibits.
        */
        function validateExhibitData(date, title, contentItems) {
            var isValid = date !== false;
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.validateContentItems(contentItems, null);
            return isValid;
        }
        Authoring.validateExhibitData = validateExhibitData;

        /**
        * Validates,if number is valid.
        */
        function validateNumber(number) {
            return !isNaN(Number(number) && parseFloat(number)) && isNotEmpty(number) && (number !== false);
        }
        Authoring.validateNumber = validateNumber;

        /**
        * Validates,if field is empty.
        */
        function isNotEmpty(obj) {
            return (obj !== '' && obj !== null);
        }
        Authoring.isNotEmpty = isNotEmpty;

        /**
        * Validates,if url is adequate
        */
        function isValidURL(url) {
            var objRE = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return objRE.test(url);
        }
        Authoring.isValidURL = isValidURL;

        /**
        * Validates,if timeline size is not negative or null
        */
        function isIntervalPositive(start, end) {
            return (parseFloat(start) + 1 / 366 <= parseFloat(end));
        }
        Authoring.isIntervalPositive = isIntervalPositive;

        /**
        * Validates,if content item data is correct.
        */
        function validateContentItems(contentItems, mediaInput) {
            var isValid = true;
            if (contentItems.length == 0) {
                return false;
            }
            var i = 0;
            while (contentItems[i] != null) {
                var ci = contentItems[i];
                isValid = isValid && CZ.Authoring.isNotEmpty(ci.title) && CZ.Authoring.isNotEmpty(ci.uri) && CZ.Authoring.isNotEmpty(ci.mediaType);

                var mime;
                if (ci.mediaType.toLowerCase() !== "video") {
                    mime = CZ.Service.getMimeTypeByUrl(ci.uri);
                }

                if (ci.mediaType.toLowerCase() === "image") {
                    var imageReg = /\.(jpg|jpeg|png|gif)$/i;
                    if (!imageReg.test(ci.uri)) {
                        if (mime != "image/jpg" && mime != "image/jpeg" && mime != "image/gif" && mime != "image/png") {
                            if (mediaInput) {
                                mediaInput.showError("Sorry, only JPG/PNG/GIF images are supported.");
                            }

                            isValid = false;
                        }
                    }
                } else if (ci.mediaType.toLowerCase() === "video") {
                    // Youtube
                    var youtube = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|[\S\?\&]+&v=|\/user\/\S+))([^\/&#]{10,12})/;

                    // Vimeo
                    var vimeo = /vimeo\.com\/([0-9]+)/i;
                    var vimeoEmbed = /player.vimeo.com\/video\/([0-9]+)/i;

                    if (youtube.test(ci.uri)) {
                        var youtubeVideoId  = ci.uri.match(youtube)[1];
                        var youtubeAutoPlay = ci.uri.indexOf('autoplay=1') > 0 ? '?autoplay=1' : '';
                        ci.uri = "http://www.youtube.com/embed/" + youtubeVideoId + youtubeAutoPlay;
                    } else if (vimeo.test(ci.uri)) {
                        var vimeoVideoId = ci.uri.match(vimeo)[1];
                        ci.uri = "http://player.vimeo.com/video/" + vimeoVideoId;
                    } else if (vimeoEmbed.test(ci.uri)) {
                        //Embedded link provided
                    } else {
                        if (mediaInput) {
                            mediaInput.showError("Sorry, only YouTube or Vimeo videos are supported.");
                        }

                        isValid = false;
                    }
                } else if (ci.mediaType.toLowerCase() === "pdf") {
                    //Google PDF viewer
                    //Example: http://docs.google.com/viewer?url=http%3A%2F%2Fwww.selab.isti.cnr.it%2Fws-mate%2Fexample.pdf&embedded=true
                    var pdf = /\.(pdf)$|\.(pdf)\?/i;

                    if (!pdf.test(ci.uri)) {
                        if (mime != "application/pdf") {
                            if (mediaInput) {
                                mediaInput.showError("Sorry, only PDF extension is supported.");
                            }

                            isValid = false;
                        }
                    }
                }
                else if (ci.mediaType.toLowerCase() === "skydrive-document")
                {
                    var onedriveDownload = /(onedrive|skydrive)\.live\.com\/download/;
                    var onedriveEmbed    = /(onedrive|skydrive)\.live\.com\/embed/;

                    if (!onedriveDownload.test(ci.uri) && !onedriveEmbed.test(ci.uri))
                    {
                        alert("This is not a valid OneDrive link.");
                        isValid = false;
                    }
                }
                else if (ci.mediaType.toLowerCase() === "skydrive-image")
                {
                    // OneDrive embed image uri pattern is - {url} {width} {height}
                    var split = ci.uri.split(' ');

                    if (split.length > 1)
                    {
                        // OneDrive embed link
                        var onedrive = /(onedrive|skydrive)\.live\.com\/embed/;
                        var width    = /[0-9]/;
                        var height   = /[0-9]/;

                        if (!onedrive.test(split[0]) || !width.test(split[1]) || !height.test(split[2]))
                        {
                            if (mediaInput) mediaInput.showError("This is not a valid OneDrive embed link.");
                            isValid = false;
                        }
                    }
                    else
                    {
                        // OneDrive download link
                        var onedrive = /(onedrive|skydrive)\.live\.com\/download/;
                        if (!onedrive.test(ci.uri))
                        {
                            alert("This is not a valid OneDrive download link.");
                            isValid = false;
                        }
                    }
                }

                if (!isValid)
                    return false;
                i++;
            }
            return isValid;
        }
        Authoring.validateContentItems = validateContentItems;

        /**
        * Returns list of erroneous content items
        */
        function erroneousContentItemsList(errorMassage) {
            var pos;
            var errCI = [];
            if (errorMassage.indexOf("ErroneousContentItemIndex") + 1) {
                pos = errorMassage.indexOf("ErroneousContentItemIndex") + 27;
                while (errorMassage[pos] != ']') {
                    if ((errorMassage[pos] == ",") || (errorMassage[pos] == "[")) {
                        var str1 = "";
                        pos++;
                        while ((errorMassage[pos] != ",") && (errorMassage[pos] != "]")) {
                            str1 += errorMassage[pos];
                            pos++;
                        }
                        errCI.push(parseInt(str1));
                    }
                }
            }
            return errCI;
        }
        Authoring.erroneousContentItemsList = erroneousContentItemsList;

        /**
        * Opens "session ends" form
        */
        function showSessionForm() {
            CZ.HomePageViewModel.sessionForm.show();
        }
        Authoring.showSessionForm = showSessionForm;

        /**
        * Resets timer to default
        */
        function resetSessionTimer() {
            if (CZ.Authoring.timer != null) {
                clearTimeout(CZ.Authoring.timer);
                CZ.Authoring.timer = setTimeout(function () {
                    showSessionForm();
                }, (CZ.Settings.sessionTime - 60) * 1000);
            }
        }
        Authoring.resetSessionTimer = resetSessionTimer;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
