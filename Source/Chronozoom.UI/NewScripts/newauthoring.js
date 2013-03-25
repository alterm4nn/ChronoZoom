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
var CZ = (function (CZ, $, document) {
    var Authoring = CZ.Authoring = CZ.Authoring || {};

    var that = Authoring;
    var _vcwidget;
    var _dragStart = {};
    var _dragPrev = {};
    var _dragCur = {};
    var _hovered = {};
    var _rectPrev = { type: "rectangle" };
    var _rectCur = { type: "rectangle" };
    var _selectedTimeline = {};
    var _timelineCounter = 0;
    var _infodotCounter = 0;
    var _contentItemCounter = 0;

    /**
     * Tests a timeline on intersection with another virtual canvas object.
     * @param  {Object}  t   A timeline or rectangle to test.
     * @param  {Object}  obj Another timeline or an exhibit.
     * @return {Boolean}     True in case of intersection, False otherwise.
     */
    function isIntersecting(t, obj) {
        switch (obj.type) {
            case "timeline":
                var t1 = t;
                var t2 = obj;
                return (t1.x + t1.width > t2.x &&
                        t1.x < t2.x + t2.width &&
                        t1.y + t1.height > t2.y &&
                        t1.y < t2.y + t2.height);
            case "infodot":
                var e = obj;
                // NOTE: e.x and e.y is not a center!
                return (t.x + t.width > e.x &&
                        t.x < e.x + 2 * e.outerRad &&
                        t.y + t.height > e.y &&
                        t.y < e.y + 2 * e.outerRad);
            default:
                return false;
        }
    }

    /**
     * Tests a timeline on inclusion in another timeline.
     * @param  {Object}  tp An estimated parent timeline.
     * @param  {Object}  tc An estimated child timeline.
     * @return {Boolean}    True in case of inclusion, False otherwise.
     */
    function isIncluded(tp, obj) {
        console.log(obj.type);
        switch (obj.type) {
            case "timeline":
            case "rectangle":
                var tc = obj;
                return (tp.x < tc.x &&
                        tp.y < tc.y &&
                        tp.x + tp.width > tc.x + tc.width &&
                        tp.y + tp.height > tc.y + tc.height);
            case "infodot":
                var ec = obj;
                // NOTE: ec.x and ec.y is not a center!
                return (tp.x < ec.x &&
                        tp.y < ec.y &&
                        tp.x + tp.width > ec.x + 2 * ec.outerRad &&
                        tp.y + tp.height > ec.y + 2 * ec.outerRad);
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
    function checkIntersections(tp, tc, editmode) {
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
     * Updates rectangle of new timeline during creation.
     */
    function updateNewRectangle() {
        // Update rectangle's size and position.
        _rectCur.x = Math.min(_dragStart.x, _dragCur.x);
        _rectCur.y = Math.min(_dragStart.y, _dragCur.y);
        _rectCur.width = Math.abs(_dragStart.x - _dragCur.x);
        _rectCur.height = Math.abs(_dragStart.y - _dragCur.y);

        // Test on intersections and update timeline's rectangle if it passes the test.
        if (checkIntersections(_hovered, _rectCur)) {
            // Set border's color of timeline's rectangle.
            var settings = $.extend({}, _hovered.settings);
            settings.strokeStyle = "red";

            $.extend(_rectPrev, _rectCur);
            removeChild(_hovered, "newTimelineRectangle");
            addRectangle(_hovered, _hovered.layerid,
                         "newTimelineRectangle", _rectCur.x, _rectCur.y,
                         _rectCur.width, _rectCur.height, settings);
        } else {
            $.extend(_rectCur, _rectPrev);
        }
    }

    /**
     * Creates new timeline and adds it to virtual canvas.
     * @return {Object} Created timeline.
     */
    function createNewTimeline() {
        removeChild(_hovered, "newTimelineRectangle");
        return addTimeline(_hovered, _hovered.layerid, "temp_" + _timelineCounter++, {
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

    /**
     * Updates title of edited timeline. It creates new CanvasText
     * object for title for recalculation of title's size.
     * @param  {Object} t Edited timeline, whose title to update.
     */
    function updateTimelineTitle(t) {
        var headerSize = timelineHeaderSize * t.height;
        var marginLeft = timelineHeaderMargin * t.height;
        var marginTop = (1 - timelineHeaderMargin) * t.height - headerSize;
        var baseline = t.y + marginTop + headerSize / 2.0;

        removeChild(t, t.id + "__header__");
        t.titleObject = addText(
            t, t.layerid, t.id + "__header__",
            t.x + marginLeft, t.y + marginTop,
            baseline, headerSize, t.title,
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
        showCreateTimelineForm: null,
        showEditTimelineForm: null,

        modeMouseHandlers: {
            createTimeline: {
                mousemove: function () {
                    if (that._isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },

                mouseup: function () {
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
                        // TODO: Show red circle?
                        //updateNewCircle();
                    }
                },

                mouseup: function () {
                    if (_hovered.type === "timeline") {
                        console.log("createExhibit");

                        var radius;
                        if (_hovered.width > _hovered.height) radius = _hovered.width / 10.0;
                        else radius = _hovered.height / 10.0;

                        while (radius > (_hovered.height / 10)) radius /= 1.5;
                        while (radius > (_hovered.width / 10)) radius /= 1.5;
                        for (var i = 0; i < _hovered.children.length; i++) {
                            if (_hovered.children[i].type == "infodot") {
                                radius = _hovered.children[i].outerRad;
                                break;
                            }
                        }

                        var date = that.getInfodotDate(_dragStart.x);

                        addInfodot(_hovered, "layerInfodots", "infodot" + _infodotCounter++,
                            _dragStart.x, _dragStart.y, radius,
                            [{
                                id: 'contentItem' + _contentItemCounter++, title: 'Sample content item',
                                description: 'Content item created by dragging desktop image.',
                                mediaUrl: "",
                                mediaType: 'image'
                            }], {
                                title: "Sample infodot",
                                date: date
                            });

                        that.createInfodot({
                            regime: _hovered.regime,
                            threshold: _hovered.threshold,
                            year: -_dragStart.x,
                            contentItem: {
                                uri: "http://www.spartacus.schoolnet.co.uk/RUSkalinin.gif",
                                caption: 'Infodot created by dragging desktop image.',
                                title: 'Image'
                            }
                        });
                    }
                }
            },

            editExhibit: {
                mousemove: function () {
                    // body...
                },

                mouseup: function () {
                    // body...
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
                    //       Sometimes doesn't work. Consider a better approach.
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

            this.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () { };
            this.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () { };
        },

        /**
         * Updates timeline's properties.
         * Use it externally from forms' handlers.
         * @param  {Object} t    A timeline to update.
         * @param  {Object} prop An object with properties' values.
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
            if (checkIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
            }

            // Update title.
            t.title = prop.title;
            updateTimelineTitle(t);
        },

        /**
         * Removes a timeline from virtual canvas.
         * Use it externally from form's handlers.
         * @param  {Object} t A timeline to remove.
         */
        removeTimeline: function (t) {
            removeChild(t.parent, t.id);
        },

        createInfodot: function (infodot) {
            var k = 1000000000;

            var exhibit = {
                __type: "Exhibit:#Chronozoom.Entities",
                ContentItems: [],
                Day: 0,
                ID: "",
                Month: 0,
                References: [],
                Regime: infodot.regime,
                Sequence: null,
                Threshold: "1. Origins of the Universe",
                Title: "New exhibit",
                UniqueID: "_" + _timelineCounter++,
                TimeUnit: "Ga",
                Year: (infodot.year / k).toFixed(1)
            };

            var dateTime = {
                __type: "DateTimeOffset:#System",
                DateTime: "/Date(1316131200000)/",
                OffsetMinutes: 0
            };

            var contentItem = {
                __type: "ContentItem:#Chronozoom.Entities",
                Attribution: "New content item",
                Caption: infodot.contentItem.caption,
                Date: dateTime,
                HasBibliography: false,
                ID: "",
                MediaSource: "http://commons.wikimedia.org/wiki/File:A_False-Color_Topography_of_Vesta%27s_South_Pole.jpg",
                MediaType: "Picture",
                Order: 32767,
                Regime: infodot.regime,
                Threshold: "1. Origins of the Universe",
                TimeUnit: "Ga",
                Title: infodot.contentItem.title,
                UniqueID: "_" + _timelineCounter++,
                Uri: infodot.contentItem.uri,
                Year: null
            };

            exhibit.ContentItems.push(contentItem);
        },
        /* Returns the date string for the infodot header. 
        @param x        (double) negative number, x component of virtual coordinates*/
        getInfodotDate: function (x) {
                // calculate date of the infodot
            var date = Math.floor(-x) - 2012; // CE offset

            if (date / 1000000000 >= 0.1)
                date = (date / 1000000000).toFixed(1) + " Ga";
            else if (date / 10000000 >= 0.1)
                date = (date / 1000000).toFixed(1) + " Ma";
            else if (date > 0) // in case of BCE
                date = Math.abs(date) + " BCE";
            else
                date = date ? -date : 1;

            return date;
        }
    });

    return CZ;
})(CZ || {}, jQuery, document);
