// NOTE: This is a temporary "_" in the beginning of Authoring
//       object's properties and methods, while the code is
//       migrating from Authoring prototype to production.
//       
//       Some of prototype's features are not approved, but
//       it's convenient to use the prototype for reference.
//        
//       It's necessary to use "_" because the same Authoring
//       object extended using jQuery.extend() method.
//       It will be easily removed using "Find & Replace".

/**
 * The CZ submodule for Authoring Tool functionality.
 * Use initialize() method to bind UI with Authoring Tool.
 */
var CZ = (function (CZ, $) {
    var Authoring = CZ.Authoring = CZ.Authoring || {};

    var that = Authoring;

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
    var _selectedTimeline = {};
    var _selectedExhibit = {};

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
                return (tp.x < obj.x &&
                        tp.y < obj.y &&
                        tp.x + tp.width > obj.x + obj.width &&
                        tp.y + tp.height > obj.y + obj.height);
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
            selfIntersection = editmode ? (tp.children[i] === _selectedTimeline) : (tp.children[i] === tc);
            if (!selfIntersection && isIntersecting(tc, tp.children[i])) {
                return false;
            }
        }

        // Test on children's inclusion (only possible in editmode).
        if (editmode && _selectedTimeline.children && _selectedTimeline.children.length > 0) {
            for (i = 0, len = _selectedTimeline.children.length; i < len; ++i) {
                if (!isIncluded(tc, _selectedTimeline.children[i])) {
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
            selfIntersection = editmode ? (tp.children[i] === _selectedExhibit) : (tp.children[i] === ec);
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
        if (checkTimelineIntersections(_hovered, _rectCur)) {
            // Set border's color of timeline's rectangle.
            var settings = $.extend({}, _hovered.settings);
            settings.strokeStyle = "red";

            $.extend(_rectPrev, _rectCur);

            removeChild(_hovered, "newTimelineRectangle");
            addRectangle(
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
        if (checkExhibitIntersections(_hovered, _circleCur)) {
            $.extend(_circlePrev, _circleCur);
            
            removeChild(_hovered, "newExhibitCircle");
            addCircle(
                _hovered,
                "layerInfodots",
                "newExhibitCircle",
                _circleCur.x + _circleCur.r,
                _circleCur.y + _circleCur.r,
                _circleCur.r,
                {
                    strokeStyle: "red"
                }
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
        removeChild(parent, id);
        return addInfodot(parent, "layerInfodots", id, time, vyc, radv, cis, descr);            
    }

    /**
     * Creates new timeline and adds it to virtual canvas.
     * @return {Object} Created timeline.
     */
    function createNewTimeline() {
        removeChild(_hovered, "newTimelineRectangle");
        return addTimeline(
            _hovered,
            _hovered.layerid,
            null,
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
        removeChild(_hovered, "newExhibitCircle");
        return addInfodot(
            _hovered,
            "layerInfodots",
            null,
            _circleCur.x + _circleCur.r,
            _circleCur.y + _circleCur.r,
            _circleCur.r,
            [{
                id: null,
                guid: null,
                title: "Content Item Title",
                description: "Content Item Description",
                uri: "",
                mediaType: "image",
                parent: _hovered.guid
            }],
            {
                title: "Exhibit Title",
                date: _circleCur.x + _circleCur.r,
                guid: null
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
        var headerSize = timelineHeaderSize * t.height;
        var marginLeft = timelineHeaderMargin * t.height;
        var marginTop = (1 - timelineHeaderMargin) * t.height - headerSize;
        var baseline = t.y + marginTop + headerSize / 2.0;

        removeChild(t, t.id + "__header__");
        t.titleObject = addText(
            t,
            t.layerid,
            t.id + "__header__",
            t.x + marginLeft,
            t.y + marginTop,
            baseline,
            headerSize,
            t.title,
            {
                fontName: timelineHeaderFontName,
                fillStyle: timelineHeaderFontColor,
                textBaseline: "middle",
                opacity: 1
            }
        );
    }

    $.extend(Authoring, {
        _isActive: false,
        _isDragging: false,
        mode: null,

        // Forms' handlers.
        showCreateTimelineForm: null,
        showEditTimelineForm: null,
        showCreateExhibitForm: null,
        showEditExhibitForm: null,

        /**
         * Represents a collection of mouse events' handlers for each mode.
         * Example of using: that.modeMouseHandlers[that.mode]["mouseup"]();
         *                   (calls mouseup event handler for current mode)
         */
        modeMouseHandlers: {
            createTimeline: {
                mousemove: function () {
                    if (that._isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },

                mouseup: function () {
                    if (_dragCur.x === _dragStart.x && _dragCur.y === _dragStart.y) {
                        return;
                    }

                    if (_hovered.type === "timeline") {
                        _selectedTimeline = createNewTimeline();
                        that.showCreateTimelineForm(_selectedTimeline);
                    }
                }
            },

            editTimeline: {
                mousemove: function () {
                    _hovered = _vcwidget.hovered || {};
                    if (_hovered.type === "timeline") {
                        _hovered.settings.strokeStyle = "red";
                    }
                },

                mouseup: function () {
                    if (_hovered.type === "timeline") {
                        _selectedTimeline = _hovered;
                        that.showEditTimelineForm(_selectedTimeline);
                    } else if (_hovered.type === "infodot" || _hovered.type === "contentItem") {
                        _selectedTimeline = _hovered.parent;
                        that.showEditTimelineForm(_selectedTimeline);
                    }
                }
            },

            createExhibit: {
                mousemove: function () {
                    if (that._isDragging && _hovered.type === "timeline") {
                        updateNewCircle();
                    }
                },

                mouseup: function () {
                    if (_hovered.type === "timeline") {
                        updateNewCircle();

                        if (checkExhibitIntersections(_hovered, _circleCur)) {
                            _selectedExhibit = createNewExhibit();
                            that.showCreateExhibitForm(_selectedExhibit);
                        }
                    }
                }
            },

            editExhibit: {
                mousemove: function () {
                    _hovered = _vcwidget.hovered || {};
                    if (_hovered.type === "infodot") {
                        _hovered.settings.strokeStyle = "red";
                    }
                },

                mouseup: function () {
                    if (_hovered.type === "infodot") {
                        _selectedExhibit = _hovered;
                        that.showEditExhibitForm(_selectedExhibit);                        
                    } else if (_hovered.type === "contentItem") {
                        _selectedExhibit = _hovered.parent.parent.parent;
                        that.showEditContentItemForm(_hovered, _selectedExhibit);
                    }
                }
            }
        },

        /**
         * The main function for binding UI and Authoring Tool.
         * It assigns additional handlers for virtual canvas mouse
         * events and forms' handlers.
         * @param  {Object} vc           jQuery instance of virtual canvas.
         * @param  {Object} formHandlers An object with the same "show..." methods as Authoring object.
         */
        initialize: function (vc, formHandlers) {
            _vcwidget = vc.data("ui-virtualCanvas");

            _vcwidget.element.on("mousedown", function (event) {
                if (that._isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    that._isDragging = true;
                    _dragStart = posv;
                    _dragPrev = {};
                    _dragCur = posv;
                    _hovered = _vcwidget.hovered || {};
                }
            });

            _vcwidget.element.on("mouseup", function (event) {
                if (that._isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    that._isDragging = false;
                    _dragPrev = _dragCur;
                    _dragCur = posv;

                    // NOTE: Using global variable to disable animation on click!
                    controller.stopAnimation();

                    that.modeMouseHandlers[that.mode]["mouseup"]();
                }
            });

            _vcwidget.element.on("mousemove", function (event) {
                if (that._isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    _dragPrev = _dragCur;
                    _dragCur = posv;

                    that.modeMouseHandlers[that.mode]["mousemove"]();
                }
            });

            // Assign forms' handlers.
            this.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {};
            this.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () {};
            this.showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () {};
            this.showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () {};
            this.showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () {};
        },

        /**
         * Updates timeline's properties.
         * Use it externally from forms' handlers.
         * @param  {Object} t    A timeline to update.
         * @param  {Object} prop An object with properties' values.
         * @param  {Widget} form A dialog form for editing timeline.
         */
        updateTimeline: function (t, prop) {
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: Number(prop.end - prop.start),
                height: t.height,
                type: "rectangle"
            };

            // TODO: Show error message in case of failed test!
            if (checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
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
                });
        },

        /**
         * Removes a timeline from virtual canvas.
         * Use it externally from form's handlers.
         * @param  {Object} t A timeline to remove.
         */
        removeTimeline: function (t) {
            CZ.Service.deleteTimeline(t);
            removeChild(t.parent, t.id);
        },

        /**
         * Updates exhibit's properties.
         * Use it externally from forms' handlers.
         * @param  {Object} e    An exhibit to update.
         * @param  {Object} prop An object with properties' values.
         */
        updateExhibit: function (e, prop) {
            var temp = {
                title: prop.title,
                x: Number(prop.date) - e.outerRad,
                y: e.y,
                width: e.width,
                height: e.height,
                type: "circle"
            };
            var oldContentItems = e.contentItems;

            if (checkExhibitIntersections(e.parent, temp, true)) {
                e.x = temp.x;
                e.infodotDescription.date = temp.x + e.outerRad;
            }

            e.title = temp.title;
            e.infodotDescription.title = temp.title;
            e.contentItems = prop.contentItems;

            e = renewExhibit(e);
            
            CZ.Service.putExhibit(e).then(
                function (response) {
                    var contentItems = e.contentItems;
                    var len = contentItems.length;
                    var i = 0;
                    e.guid = response;
                    
                    // Set parent's guid for all content items.
                    for (i = 0; i < len; ++i) {
                        contentItems[i].parent = e.guid;
                    }

                    // Send PUT/DELETE requests for all content items and
                    // set guids for them.
                    CZ.Service.putExhibitContent(e, oldContentItems).then(
                        function () {
                            for (i = 0; i < len; ++i) {
                                contentItems[i].guid = arguments[i];
                            }
                        },
                        function () {
                            console.log("Error connecting to service: update content item.\n");
                        }
                    );
                },
                function (error) {
                    console.log("Error connecting to service: update exhibit.\n");
                }
            );
        },

        /**
         * Removes an exhibit from virtual canvas.
         * Use it externally from form's handlers.
         * @param  {Object} e An exhibit to remove.
         */
        removeExhibit: function (e) {
            CZ.Service.deleteExhibit(e);
            removeChild(e.parent, e.id);
        },

        /**
         * Updates content item's properties in selected exhibit.
         * Use it externally from forms' handlers.
         * @param  {Object} c    A content item in selected exhibit.
         * @param  {Object} args An object with properties' values.
         */
        updateContentItem: function (c, args) {
            var e = c.parent.parent.parent;

            for (var prop in args) {
                if (c.contentItem.hasOwnProperty(prop)) {
                    c.contentItem[prop] = args[prop];
                }
            }
            
            renewExhibit(e);

            CZ.Service.putContentItem(c).then(
                function (response) {
                    c.guid = response;
                },
                function (error) {
                    console.log("Error connecting to service: update content item.\n" + error.responseText);
                }
            );
        },

        /**
         * Removes content item from selected exhibit.
         * Use it externally from form's handlers.
         * @param  {Object} c A content item in selected exhibit.
         */
        removeContentItem: function (c) {
            var e = c.parent.parent.parent;

            CZ.Service.deleteContentItem(c);
            c.parent.parent.parent.contentItems.splice(c.contentItem.index, 1);
            delete c.contentItem;
            renewExhibit(e);
        }
    });

    return CZ;
})(CZ || {}, jQuery);
