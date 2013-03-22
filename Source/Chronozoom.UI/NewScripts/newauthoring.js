var CZ = (function (CZ, $, document) {
    var Authoring = CZ.Authoring = CZ.Authoring || {};

    var dragStart = {};
    var dragPrev = {};
    var dragCur = {};
    var hovered = {};
    var rectPrev = {};
    var rectCur = {};
    var selectedTimeline = {};

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

    function isIncluded(tp, tc) {
        return (tp.x < tc.x &&
                tp.y < tc.y &&
                tp.x + tp.width > tc.x + tc.width &&
                tp.y + tp.height > tc.y + tc.height);
    }

    function checkIntersections(tp, tc, editmode) {
        if (!isIncluded(tp, tc)) {
            return false;
        }

        for (var i = 0, len = tp.children.length; i < len; ++i) {
            if (tp.children[i] !== tc && isIntersecting(tc, tp.children[i])) {
                return editmode ? tp.children[i] === selectedTimeline : false;
            }
        }

        return true;
    }

    function updateNewRectangle() {
        rectCur.x = Math.min(dragStart.x, dragCur.x);
        rectCur.y = Math.min(dragStart.y, dragCur.y);
        rectCur.width = Math.abs(dragStart.x - dragCur.x);
        rectCur.height = Math.abs(dragStart.y - dragCur.y);

        if (checkIntersections(hovered, rectCur)) {
            $.extend(rectPrev, rectCur);
            removeChild(hovered, "newTimelineRectangle");
            addRectangle(hovered, hovered.layerid,
                         "newTimelineRectangle", rectCur.x, rectCur.y,
                         rectCur.width, rectCur.height, hovered.settings);
        } else {
            $.extend(rectCur, rectPrev);
        }
    }

    function createNewTimeline() {
        removeChild(hovered, "newTimelineRectangle");
        return addTimeline(hovered, hovered.layerid, "t" + "0", {
            timeStart: rectCur.x,
            timeEnd: rectCur.x + rectCur.width,
            header: "Timeline Title",
            top: rectCur.y,
            height: rectCur.height,
            fillStyle: hovered.settings.fillStyle,
            regime: hovered.regime,
            gradientFillStyle: hovered.settings.gradientFillStyle,
            lineWidth: hovered.settings.lineWidth,
            strokeStyle: hovered.settings.gradientFillStyle
        });
    }

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

        initialize: function (vc, formHandlers) {
            var that = this;
            var vcwidget = vc.data("ui-virtualCanvas");

            vcwidget.element.on("mousedown", function (event) {
                if (that._isActive) {
                    var viewport = vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    that._isDragging = true;
                    dragStart = posv;
                    dragPrev = {};
                    dragCur = posv;
                    hovered = null;
                
                    if (vcwidget.hovered) {
                        hovered = vcwidget.hovered;
                    }
                }
            });

            vcwidget.element.on("mouseup", function (event) {
                if (that._isActive) {
                    var viewport = vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    that._isDragging = false;
                    dragPrev = dragCur;
                    dragCur = posv;

                    if (that.mode === "createTimeline" && hovered) {
                        selectedTimeline = createNewTimeline();
                        that.showCreateTimelineForm(selectedTimeline);
                    }
                }
            });

            vcwidget.element.on("mousemove", function (event) {
                if (that._isActive && that._isDragging) {
                    var viewport = vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                    dragPrev = dragCur;
                    dragCur = posv;

                    if (that.mode === "createTimeline" && hovered) {
                        updateNewRectangle();
                    }
                }
            });

            this.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {};
        },

        updateTimeline: function (t, prop) {
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: Number(prop.end - prop.start),
                height: t.height
            };

            if (checkIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.title = prop.title;
                updateTimelineTitle(t);
            }
        },

        removeTimeline: function (t) {
            removeChild(t.parent, t.id);
        }
    });

    return CZ;
})(CZ || {}, jQuery, document);