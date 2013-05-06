/// <reference path='cz.settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='czservice.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='cz.dates.ts' />

/**
 * The CZ submodule for Authoring Tool functionality.
 * Use initialize() method to bind UI with Authoring Tool.
 */
module CZ {
    export module Authoring {
        // Virtual canvas widget.
        var _vcwidget: any;

        // Mouse position.
        var _dragStart: any = {};
        var _dragPrev: any = {};
        var _dragCur: any = {};

        // Current hovered object in virtual canvas.
        var _hovered: any = {};

        // New timeline rectangle.
        var _rectPrev: any = { type: "rectangle" };
        var _rectCur: any = { type: "rectangle" };

        // New exhibit circle.
        var _circlePrev: any = { type: "circle" };
        var _circleCur: any = { type: "circle" };

        // Selected objects for editing.
        export var selectedTimeline: any = {};
        export var selectedExhibit: any = {};
        export var selectedContentItem: any = {};


        // Authoring Tool state.
        export var isActive: bool = false;
        export var isEnabled: bool = false;
        export var isDragging: bool = false;

        //TODO: use enum for authoring modes when new authoring forms will be completly integrated
        export var mode: any = null;
        export var contentItemMode: any = null;

        // Forms' handlers.
        export var showCreateTimelineForm: (...args: any[]) => any = null;
        export var showEditTimelineForm: (...args: any[]) => any = null;
        export var showCreateExhibitForm: (...args: any[]) => any = null;
        export var showEditExhibitForm: (...args: any[]) => any = null;
        export var showEditContentItemForm: (...args: any[]) => any = null;

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
                    return (te.x + te.width > obj.x &&
                            te.x < obj.x + obj.width &&
                            te.y + te.height > obj.y &&
                            te.y < obj.y + obj.height);
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
                case "timeline":
                case "rectangle":
                case "infodot":
                case "circle":
                    return (tp.x <= obj.x &&
                            tp.y <= obj.y &&
                            tp.x + tp.width >= obj.x + obj.width &&
                            tp.y + tp.height >= obj.y + obj.height);
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

            // Test on inclusion in parent.
            if (!isIncluded(tp, tc)) {
                return false;
            }

            // Test on intersections with parent's children.
            for (i = 0, len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === selectedTimeline) : (tp.children[i] === tc);
                if (!selfIntersection && isIntersecting(tc, tp.children[i])) {
                    return false;
                }
            }

            // Test on children's inclusion (only possible in editmode).
            if (editmode && selectedTimeline.children && selectedTimeline.children.length > 0) {
                for (i = 0, len = selectedTimeline.children.length; i < len; ++i) {
                    if (!isIncluded(tc, selectedTimeline.children[i])) {
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

            // Test on intersections with parent's children.
            for (i = 0, len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === selectedExhibit) : (tp.children[i] === ec);
                if (!selfIntersection && isIntersecting(ec, tp.children[i])) {
                    return false;
                }
            }

            return true;
        }

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
                var settings: any = $.extend({}, _hovered.settings);
                settings.strokeStyle = "red";

                $.extend(_rectPrev, _rectCur);

                CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                CZ.VCContent.addRectangle(
                    _hovered,
                    _hovered.layerid,
                    "newTimelineRectangle",
                    _rectCur.x,
                    _rectCur.y,
                    _rectCur.width,
                    _rectCur.height,
                    settings
                );
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
            _circleCur.r = (_hovered.width > _hovered.height) ?
                            _hovered.height / 27.7 :
                            _hovered.width / 10.0;

            _circleCur.x = _dragCur.x - _circleCur.r;
            _circleCur.y = _dragCur.y - _circleCur.r;
            _circleCur.width = _circleCur.height = 2 * _circleCur.r;

            // Test on intersections and update exhibits's circle if it passes the test.
            if (checkExhibitIntersections(_hovered, _circleCur, false)) {
                $.extend(_circlePrev, _circleCur);

                CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
                CZ.VCContent.addCircle(
                    _hovered,
                    "layerInfodots",
                    "newExhibitCircle",
                    _circleCur.x + _circleCur.r,
                    _circleCur.y + _circleCur.r,
                    _circleCur.r,
                    {
                        strokeStyle: "red"
                    },
                    false
                );
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
        export function renewExhibit(e) {
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

        /**
         * Creates new timeline and adds it to virtual canvas.
         * @return {Object} Created timeline.
         */
        function createNewTimeline() {
            CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
            return CZ.VCContent.addTimeline(
                _hovered,
                _hovered.layerid,
                undefined,
                {
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
                }
            );
        }

        /**
         * Creates new exhibit and adds it to virtual canvas.
         * @return {Object} Created exhibit.
         */
        function createNewExhibit() {
            CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
            return CZ.VCContent.addInfodot(
                _hovered,
                "layerInfodots",
                undefined,
                _circleCur.x + _circleCur.r,
                _circleCur.y + _circleCur.r,
                _circleCur.r,
                [],
                {
                    title: "Exhibit Title",
                    date: _circleCur.x + _circleCur.r,
                    guid: undefined
                }
            );
        }

        /**
         * Updates title of edited timeline. It creates new CanvasText
         * object for title for recalculation of title's size.
         * @param  {Object} t Edited timeline, whose title to update.
         */
        function updateTimelineTitle(t) {
            // NOTE: This code from CanvasTimeline's constructor.
            var headerSize = CZ.Settings.timelineHeaderSize * t.height;
            var marginLeft = CZ.Settings.timelineHeaderMargin * t.height;
            var marginTop = (1 - CZ.Settings.timelineHeaderMargin) * t.height - headerSize;
            var baseline = t.y + marginTop + headerSize / 2.0;

            CZ.VCContent.removeChild(t, t.id + "__header__");

            //remove edit button to reinitialize it
            if (CZ.Authoring.isEnabled && typeof t.editButton !== "undefined") {
                t.editButton.x = t.x + t.width - 1.15 * t.titleObject.height;
                t.editButton.y = t.titleObject.y;
                t.editButton.width = t.titleObject.height;
                t.editButton.height = t.titleObject.height;
            }

            t.titleObject = CZ.VCContent.addText(
                t,
                t.layerid,
                t.id + "__header__",
                t.x + marginLeft,
                t.y + marginTop,
                baseline,
                headerSize,
                t.title,
                {
                    fontName: CZ.Settings.timelineHeaderFontName,
                    fillStyle: CZ.Settings.timelineHeaderFontColor,
                    textBaseline: "middle",
                    opacity: 1
                }
            );
        }

        /**
         * Represents a collection of mouse events' handlers for each mode.
         * Example of using: CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
         *                   (calls mouseup event handler for current mode)
         */
        export var modeMouseHandlers = {
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
                        updateNewRectangle();

                        selectedTimeline = createNewTimeline();
                        showCreateTimelineForm(selectedTimeline);
                    }
                }
            },

            editTimeline: {
                mouseup: function () {
                    showEditTimelineForm(selectedTimeline);
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

                        selectedExhibit = createNewExhibit();
                        showCreateExhibitForm(selectedExhibit);
                    }
                }
            },

            editExhibit: {
                mouseup: function () {
                    showEditExhibitForm(selectedExhibit);
                }
            },

            editContentItem: {
                mouseup: function () {
                    showEditContentItemForm(selectedContentItem, selectedExhibit);
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
        export function initialize(vc, formHandlers) {
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
            showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () { };
            showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () { };
            showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () { };
            showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () { };
            showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () { };
        }

        /**
         * Updates timeline's properties.
         * Use it externally from forms' handlers.
         * @param  {Object} t    A timeline to update.
         * @param  {Object} prop An object with properties' values.
         * @param  {Widget} form A dialog form for editing timeline.
         */
        export function updateTimeline(t, prop) {
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: Number(CZ.Dates.getCoordinateFromDecimalYear(prop.end) - prop.start),
                height: t.height,
                type: "rectangle"
            };

            // TODO: Show error message in case of failed test!
            if (checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.endDate = prop.end;
            }

            // Update title.
            t.title = prop.title;
            updateTimelineTitle(t);

            return CZ.Service.putTimeline(t).then(
                function (success) {
                    // update ids if existing elements with returned from server
                    t.id = "t" + success;
                    t.guid = success;
                    t.titleObject.id = "t" + success + "__header__";
                },
                function (error) {
                }
            );
        }

        /**
         * Removes a timeline from virtual canvas.
         * Use it externally from form's handlers.
         * @param  {Object} t A timeline to remove.
         */
        export function removeTimeline(t) {
            CZ.Service.deleteTimeline(t);
            CZ.VCContent.removeChild(t.parent, t.id);
        }

        /**
         * Updates exhibit's properties.
         * Use it externally from forms' handlers.
         * @param  {Object} e    An exhibit to update.
         * @param  {Object} args An object with properties' values.
         */
        export function updateExhibit(e, args) {
            var deferred = $.Deferred();

            if (e && e.contentItems && args) {
                var clone: any = $.extend({}, e, { children: null }); // shallow copy of exhibit (without children)
                clone = $.extend(true, {}, clone); // deep copy exhibit
                delete clone.children;
                delete clone.contentItems;
                $.extend(true, clone, args); // overwrite and append properties

                var oldContentItems = $.extend(true, [], e.contentItems);

                // pass cloned objects to CZ.Service calls to avoid any side effects
                CZ.Service.putExhibit(clone).then(
                    response => {
                        var old_id = e.id;
                        e.id = clone.id = "e" + response.ExhibitId;
                        var new_id = e.id;
                        e.guid = clone.guid = response.ExhibitId;
                        for (var i = 0; i < e.contentItems.length; i++) {
                            e.contentItems[i].ParentExhibitId = e.guid;
                        }
                        for (var i = 0; i < clone.contentItems.length; i++) {
                            clone.contentItems[i].ParentExhibitId = clone.guid;
                        }
                        CZ.Service.putExhibitContent(clone, oldContentItems).then(
                            response => {
                                $.extend(e, clone);
                                e.id = old_id;
                                e = renewExhibit(e);
                                e.id = new_id;
                                CZ.Common.vc.virtualCanvas("requestInvalidate");
                                deferred.resolve();
                            },
                            error => {
                                console.log("Error connecting to service: update exhibit (put exhibit content).\n" + error.responseText);
                                deferred.reject();
                            }
                        );
                    },
                    error => {
                        console.log("Error connecting to service: update exhibit.\n" + error.responseText);
                        deferred.reject();
                    }
                );

            } else {
                deferred.reject();
            }

            return deferred.promise();
        }

        /**
         * Removes an exhibit from virtual canvas.
         * Use it externally from form's handlers.
         * @param  {Object} e An exhibit to remove.
         */
        export function removeExhibit(e) {
            var deferred = $.Deferred();

            if (e && e.id && e.parent) {
                var clone: any = $.extend({}, e, { children: null });
                clone = $.extend(true, {}, clone);

                CZ.Service.deleteExhibit(clone).then(
                    response => {
                        CZ.VCContent.removeChild(e.parent, e.id);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                        deferred.resolve();
                    },
                    error => {
                        console.log("Error connecting to service: remove exhibit.\n" + error.responseText);
                        deferred.reject();
                    }
                );
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }

        /**
         * Updates content item's properties in selected exhibit.
         * Use it externally from forms' handlers.
         * @param  {CanvasInfodot} e A selected exhibit.
         * @param  {ContentItemMetadata} c A content item in selected exhibit.
         * @param  {Object} args An object with updated property values.
         */
        export function updateContentItem(e, c, args) {
            var deferred = $.Deferred();

            if (e && e.contentItems && e.contentItems.length && c && args) {
                var clone: any = $.extend(true, {}, c, args);

                CZ.Service.putContentItem(clone).then(
                    response => {
                        $.extend(c, clone);
                        c.id = c.guid = response;
                        e = renewExhibit(e);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                        deferred.resolve();
                    },
                    error => {
                        console.log("Error connecting to service: update content item.\n" + error.responseText);
                        deferred.reject();
                    }
                );
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }

        /**
         * Removes content item from selected exhibit.
         * Use it externally from form's handlers.
         * @param  {CanvasInfodot} e A selected exhibit.
         * @param  {ContentItemMetadata} c A content item in selected exhibit.
         */
        export function removeContentItem(e, c) {
            var deferred = $.Deferred();

            if (e && e.contentItems && e.contentItems.length && c && c.index) {
                var clone = $.extend(true, {}, c);

                CZ.Service.deleteContentItem(clone).then(
                    response => {
                        e.contentItems.splice(c.index, 1);
                        e = renewExhibit(e);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                        deferred.resolve();
                    },
                    error => {
                        console.log("Error connecting to service: remove content item.\n" + error.responseText);
                        deferred.reject();
                    }
                );
            } else {
                deferred.reject();
            }

            return deferred.promise();
        }

        /**
         * Validates possible input errors for timelines.
        */
        export function ValidateTimelineData(start, end, title) {
            var isValid = CZ.Authoring.ValidateNumber(start) && CZ.Authoring.ValidateNumber(end);
            isValid = isValid && CZ.Authoring.IsNotEmpty(title) && CZ.Authoring.IsNotEmpty(start) && CZ.Authoring.IsNotEmpty(end);
            console.log(start, end);
            isValid = isValid && CZ.Authoring.isNonegHeight(start, end);
            return isValid;
        }

        /**
         * Validates possible input errors for exhibits.
        */
        export function ValidateExhibitData(date, title, contentItems) {
            var isValid = CZ.Authoring.ValidateNumber(date);
            isValid = isValid && CZ.Authoring.IsNotEmpty(title) && CZ.Authoring.IsNotEmpty(date);
            isValid = isValid && CZ.Authoring.ValidateContentItems(contentItems);
            return isValid;
        }

        /**
         * Validates,if number is valid.
        */
        export function ValidateNumber(number) {
            return !isNaN(Number(number) && parseFloat(number));
        }

        /**
         * Validates,if field is empty.
        */
        export function IsNotEmpty(obj) {
            return (obj !== '' && obj !== null);
        }
        /**
         * Validates,if timeline size is not negative
        */
        export function isNonegHeight(start, end) {
            return (start < end);
        }

        /**
         * Validates,if content item data is correct.
        */
        export function ValidateContentItems(contentItems) {
            var isValid = true;
            if (contentItems.length == 0) { return false; }
            var i = 0;
            while (contentItems[i] != null) {
                var ci = contentItems[i];
                isValid = isValid && CZ.Authoring.IsNotEmpty(ci.title) && CZ.Authoring.IsNotEmpty(ci.uri) && CZ.Authoring.IsNotEmpty(ci.mediaType);
                if (!isValid) return false;
                i++;
            }
            return isValid;
        }
    }
}
