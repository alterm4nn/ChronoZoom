var CZ;
(function (CZ) {
    (function (Layout) {
        var isLayoutAnimation = true;
        Layout.animatingElements = {
            length: 0
        };
        function Timeline(title, left, right, childTimelines, exhibits) {
            this.Title = title;
            this.left = left;
            this.right = right;
            this.ChildTimelines = childTimelines;
            this.Exhibits = exhibits;
        }
        function Infodot(x, contentItems) {
            this.x = x;
            this.ContentItems = contentItems;
        }
        function titleObject(name) {
            this.name = name;
        }
        function Prepare(timeline) {
            timeline.left = CZ.Dates.getCoordinateFromDecimalYear(timeline.start);
            timeline.right = CZ.Dates.getCoordinateFromDecimalYear(timeline.end);
            timeline.endDate = timeline.end;
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (exhibit) {
                    exhibit.x = CZ.Dates.getCoordinateFromDecimalYear(exhibit.time);
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeline) {
                    childTimeline.ParentTimeline = timeline;
                    Prepare(childTimeline);
                });
            }
            GenerateAspect(timeline);
            if(timeline.Height) {
                timeline.Height /= 100;
            } else if(!timeline.AspectRatio && !timeline.Height) {
                timeline.Height = 0.4;
            }
        }
        function GenerateAspect(timeline) {
            if(timeline.ID == CZ.Settings.cosmosTimelineID) {
                timeline.AspectRatio = 10;
            }
        }
        function LayoutTimeline(timeline, parentWidth, measureContext) {
            var headerPercent = CZ.Settings.timelineHeaderSize + 2 * CZ.Settings.timelineHeaderMargin;
            var timelineWidth = timeline.right - timeline.left;
            timeline.width = timelineWidth;
            if(timeline.AspectRatio && !timeline.height) {
                timeline.height = timelineWidth / timeline.AspectRatio;
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    if(tl.AspectRatio) {
                        tl.height = (tl.right - tl.left) / tl.AspectRatio;
                    } else if(timeline.height && tl.Height) {
                        tl.height = timeline.height * tl.Height;
                    }
                    LayoutTimeline(tl, timelineWidth, measureContext);
                });
            }
            if(!timeline.height) {
                var scaleCoef = undefined;
                if(timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (tl) {
                        if(tl.Height && !tl.AspectRatio) {
                            var localScale = tl.height / tl.Height;
                            if(!scaleCoef || scaleCoef < localScale) {
                                scaleCoef = localScale;
                            }
                        }
                    });
                }
                if(scaleCoef) {
                    if(timeline.timelines instanceof Array) {
                        timeline.timelines.forEach(function (tl) {
                            if(tl.Height && !tl.AspectRatio) {
                                var scaleParam = scaleCoef * tl.Height / tl.height;
                                if(scaleParam > 1) {
                                    tl.realY *= scaleParam;
                                    Scale(tl, scaleParam, measureContext);
                                }
                            }
                        });
                    }
                    timeline.height = scaleCoef;
                }
            }
            var exhibitSize = CalcInfodotSize(timeline);
            var tlRes = LayoutChildTimelinesOnly(timeline);
            var res = LayoutContent(timeline, exhibitSize);
            if(timeline.height) {
                var titleObject = GenerateTitleObject(timeline.height, timeline, measureContext);
                if(timeline.exhibits instanceof Array) {
                    if(timeline.exhibits.length > 0 && (tlRes.max - tlRes.min) < timeline.height) {
                        while((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && exhibitSize > timelineWidth / 20.0) {
                            exhibitSize /= 1.5;
                            res = LayoutContent(timeline, exhibitSize);
                        }
                    }
                }
                if((res.max - res.min) > (timeline.height - titleObject.bboxHeight)) {
                    var contentHeight = res.max - res.min;
                    var fullHeight = contentHeight / (1 - headerPercent);
                    var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                    timeline.height = fullHeight;
                } else {
                }
                timeline.titleRect = titleObject;
            } else {
                var min = res.min;
                var max = res.max;
                var minAspect = 1.0 / CZ.Settings.timelineMinAspect;
                var minHeight = timelineWidth / minAspect;
                var contentHeight = Math.max((1 - headerPercent) * minHeight, max - min);
                var fullHeight = contentHeight / (1 - headerPercent);
                var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                timeline.titleRect = titleObject;
                timeline.height = fullHeight;
            }
            timeline.heightEps = parentWidth * CZ.Settings.timelineContentMargin;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.realY = 0;
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.realY -= res.min;
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY -= res.min;
                });
            }
        }
        function PositionContent(contentArray, arrangedArray, intersectionFunc) {
            contentArray.forEach(function (el) {
                var usedY = new Array();
                arrangedArray.forEach(function (ael) {
                    if(intersectionFunc(el, ael)) {
                        usedY.push({
                            top: ael.realY + ael.realHeight,
                            bottom: ael.realY
                        });
                    }
                });
                var y = 0;
                if(usedY.length > 0) {
                    var segmentPoints = new Array();
                    usedY.forEach(function (segment) {
                        segmentPoints.push({
                            type: "bottom",
                            value: segment.bottom
                        });
                        segmentPoints.push({
                            type: "top",
                            value: segment.top
                        });
                    });
                    segmentPoints.sort(function (l, r) {
                        return l.value - r.value;
                    });
                    var freeSegments = new Array();
                    var count = 0;
                    for(i = 0; i < segmentPoints.length - 1; i++) {
                        if(segmentPoints[i].type == "top") {
                            count++;
                        } else {
                            count--;
                        }
                        if(count == 0 && segmentPoints[i + 1].type == "bottom") {
                            freeSegments.push({
                                bottom: segmentPoints[i].value,
                                top: segmentPoints[i + 1].value
                            });
                        }
                    }
                    var foundPlace = false;
                    for(var i = 0; i < freeSegments.length; i++) {
                        if((freeSegments[i].top - freeSegments[i].bottom) > el.realHeight) {
                            y = freeSegments[i].bottom;
                            foundPlace = true;
                            break;
                        }
                    }
                    ;
                    if(!foundPlace) {
                        y = segmentPoints[segmentPoints.length - 1].value;
                    }
                }
                el.realY = y;
                arrangedArray.push(el);
            });
        }
        function LayoutContent(timeline, exhibitSize) {
            var sequencedContent = new Array();
            var unsequencedContent = new Array();
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    if(tl.Sequence) {
                        sequencedContent.push(tl);
                    } else {
                        unsequencedContent.push(tl);
                    }
                });
            }
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.size = exhibitSize;
                    eb.left = eb.x - eb.size / 2.0;
                    eb.right = eb.x + eb.size / 2.0;
                    eb.realHeight = exhibitSize;
                    if(eb.left < timeline.left) {
                        eb.left = timeline.left;
                        eb.right = eb.left + eb.size;
                        eb.isDeposed = true;
                    } else if(eb.right > timeline.right) {
                        eb.right = timeline.right;
                        eb.left = timeline.right - eb.size;
                        eb.isDeposed = true;
                    }
                    if(eb.Sequence) {
                        sequencedContent.push(eb);
                    } else {
                        unsequencedContent.push(eb);
                    }
                });
            }
            sequencedContent.sort(function (l, r) {
                return l.Sequence - r.Sequence;
            });
            var arrangedElements = new Array();
            PositionContent(sequencedContent, arrangedElements, function (el, ael) {
                return el.left < ael.right;
            });
            PositionContent(unsequencedContent, arrangedElements, function (el, ael) {
                return !(el.left >= ael.right || ael.left >= el.right);
            });
            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;
            arrangedElements.forEach(function (element) {
                if(element.realY < min) {
                    min = element.realY;
                }
                if((element.realY + element.realHeight) > max) {
                    max = element.realY + element.realHeight;
                }
            });
            if(arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }
            return {
                max: max,
                min: min
            };
        }
        function LayoutChildTimelinesOnly(timeline) {
            var arrangedElements = new Array();
            if(timeline.timelines instanceof Array) {
                PositionContent(timeline.timelines, arrangedElements, function (el, ael) {
                    return !(el.left >= ael.right || ael.left >= el.right);
                });
            }
            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;
            arrangedElements.forEach(function (element) {
                if(element.realY < min) {
                    min = element.realY;
                }
                if((element.realY + element.realHeight) > max) {
                    max = element.realY + element.realHeight;
                }
            });
            if(arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }
            return {
                max: max,
                min: min
            };
        }
        function Scale(timeline, scale, mctx) {
            if(scale < 1) {
                throw "Only extending of content is allowed";
            }
            timeline.height *= scale;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.titleRect = GenerateTitleObject(timeline.height, timeline, mctx);
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY *= scale;
                    if(!tl.AspectRatio) {
                        Scale(tl, scale, mctx);
                    }
                });
            }
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.realY *= scale;
                });
            }
        }
        function Arrange(timeline) {
            timeline.y = timeline.realY + timeline.heightEps;
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.y = infodot.realY + infodot.size / 2.0 + timeline.y;
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY += timeline.y;
                    Arrange(tl);
                });
            }
        }
        function CalcInfodotSize(timeline) {
            return (timeline.right - timeline.left) / 20.0;
        }
        function GenerateTitleObject(tlHeight, timeline, measureContext) {
            var tlW = timeline.right - timeline.left;
            measureContext.font = "100pt " + CZ.Settings.timelineHeaderFontName;
            var size = measureContext.measureText(timeline.title);
            var height = CZ.Settings.timelineHeaderSize * tlHeight;
            var width = height * size.width / 100.0;
            var margin = Math.min(tlHeight, tlW) * CZ.Settings.timelineHeaderMargin;
            if(width + 2 * margin > tlW) {
                width = tlW - 2 * margin;
                height = width * 100.0 / size.width;
            }
            return {
                width: width - 1.25 * height,
                height: height,
                marginTop: tlHeight - height - margin,
                marginLeft: margin,
                bboxWidth: width + 2 * margin - 1.25 * height,
                bboxHeight: height + 2 * margin
            };
        }
        function Convert(parent, timeline) {
            var tlColor = GetTimelineColor(timeline);
            var t1 = CZ.VCContent.addTimeline(parent, "layerTimelines", 't' + timeline.id, {
                isBuffered: timeline.timelines instanceof Array,
                guid: timeline.id,
                timeStart: timeline.left,
                timeEnd: timeline.right,
                top: timeline.y,
                height: timeline.height,
                header: timeline.title,
                fillStyle: "rgba(0,0,0,0.25)",
                titleRect: timeline.titleRect,
                strokeStyle: tlColor,
                regime: timeline.Regime,
                endDate: timeline.endDate,
                opacity: 0
            });
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (childInfodot) {
                    var contentItems = [];
                    if(typeof childInfodot.contentItems !== 'undefined') {
                        contentItems = childInfodot.contentItems;
                        for(var i = 0; i < contentItems.length; ++i) {
                            contentItems[i].guid = contentItems[i].id;
                        }
                    }
                    var infodot1 = CZ.VCContent.addInfodot(t1, "layerInfodots", 'e' + childInfodot.id, (childInfodot.left + childInfodot.right) / 2.0, childInfodot.y, 0.8 * childInfodot.size / 2.0, contentItems, {
                        isBuffered: false,
                        guid: childInfodot.id,
                        title: childInfodot.title,
                        date: childInfodot.time,
                        opacity: 1
                    });
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeLine) {
                    Convert(t1, childTimeLine);
                });
            }
        }
        function GetTimelineColor(timeline) {
            if(timeline.Regime == "Cosmos") {
                return "rgba(152, 108, 157, 1.0)";
            } else if(timeline.Regime == "Earth") {
                return "rgba(81, 127, 149, 1.0)";
            } else if(timeline.Regime == "Life") {
                return "rgba(73, 150, 73, 1.0)";
            } else if(timeline.Regime == "Pre-history") {
                return "rgba(237, 145, 50, 1.0)";
            } else if(timeline.Regime == "Humanity") {
                return "rgba(212, 92, 70, 1.0)";
            } else {
                return "rgba(255, 255, 255, 0.5)";
            }
        }
        Layout.FindChildTimeline = function (timeline, id, recursive) {
            var result = undefined;
            if(timeline && timeline.timelines instanceof Array) {
                var n = timeline.timelines.length;
                for(var i = 0; i < n; i++) {
                    var childTimeline = timeline.timelines[i];
                    if(childTimeline.id == id) {
                        result = childTimeline;
                        break;
                    } else {
                        if(recursive == true) {
                            result = Layout.FindChildTimeline(childTimeline, id, recursive);
                            if(result != undefined) {
                                break;
                            }
                        }
                    }
                }
            }
            return result;
        };
        function GetVisibleFromTimeline(timeline, vcph) {
            if(timeline) {
                var vp = vcph.virtualCanvas("getViewport");
                var width = timeline.right - timeline.left;
                var scaleX = vp.visible.scale * width / vp.width;
                var scaleY = vp.visible.scale * timeline.height / vp.height;
                return new CZ.Viewport.VisibleRegion2d(timeline.left + (timeline.right - timeline.left) / 2.0, timeline.y + timeline.height / 2.0, Math.max(scaleX, scaleY));
            }
        }
        function LoadTimeline(root, rootTimeline) {
            root.beginEdit();
            Convert(root, rootTimeline);
            root.endEdit(true);
        }
        function Load(root, timeline) {
            if(timeline) {
                Prepare(timeline);
                var measureContext = (document.createElement("canvas")).getContext('2d');
                LayoutTimeline(timeline, 0, measureContext);
                Arrange(timeline);
                LoadTimeline(root, timeline);
            }
        }
        Layout.Load = Load;
        function generateLayout(tmd, tsg) {
            try  {
                if(!tmd.AspectRatio) {
                    tmd.height = tsg.height;
                }
                var root = new CZ.VCContent.CanvasRootElement(tsg.vc, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                Load(root, tmd);
                return root.children[0];
            } catch (msg) {
                console.log("exception in [nikita's layout]: " + msg);
            }
        }
        function convertRelativeToAbsoluteCoords(el, delta) {
            if(!delta) {
                return;
            }
            if(typeof el.y !== 'undefined') {
                el.y += delta;
                el.newY += delta;
            }
            if(typeof el.baseline !== 'undefined') {
                el.baseline += delta;
                el.newBaseline += delta;
            }
            el.children.forEach(function (child) {
                convertRelativeToAbsoluteCoords(child, delta);
            });
        }
        function shiftAbsoluteCoords(el, delta) {
            if(!delta) {
                return;
            }
            if(typeof el.newY !== 'undefined') {
                el.newY += delta;
            }
            if(typeof el.newBaseline !== 'undefined') {
                el.newBaseline += delta;
            }
            el.children.forEach(function (child) {
                shiftAbsoluteCoords(child, delta);
            });
        }
        function calculateForceOnChildren(tsg) {
            var eps = tsg.height / 10;
            var v = [];
            for(var i = 0, el; i < tsg.children.length; i++) {
                el = tsg.children[i];
                if(el.type && (el.type === "timeline" || el.type === "infodot")) {
                    el.force = 0;
                    v.push(el);
                }
            }
            v.sort(function (el, ael) {
                return el.newY - ael.newY;
            });
            for(var i = 0, el; i < v.length; i++) {
                el = v[i];
                if(el.type && el.type === "timeline") {
                    if(el.delta) {
                        var l = el.x;
                        var r = el.x + el.width;
                        var b = el.y + el.newHeight + eps;
                        for(var j = i + 1; j < v.length; j++) {
                            var ael = v[j];
                            if(ael.x > l && ael.x < r || ael.x + ael.width > l && ael.x + ael.width < r || ael.x + ael.width > l && ael.x + ael.width === 0 && r === 0) {
                                if(ael.y < b) {
                                    ael.force += el.delta;
                                    l = Math.min(l, ael.x);
                                    r = Math.max(r, ael.x + ael.width);
                                    b = ael.y + ael.newHeight + el.delta + eps;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        function animateElement(elem) {
            var duration = CZ.Settings.canvasElementAnimationTime;
            var args = [];
            if(elem.fadeIn == false && typeof elem.animation === 'undefined') {
                elem.height = elem.newHeight;
                elem.y = elem.newY;
                if(elem.baseline) {
                    elem.baseline = elem.newBaseline;
                }
            }
            if(elem.newY != elem.y && !elem.id.match("__header__")) {
                args.push({
                    property: "y",
                    startValue: elem.y,
                    targetValue: elem.newY
                });
            }
            if(elem.newHeight != elem.height && !elem.id.match("__header__")) {
                args.push({
                    property: "height",
                    startValue: elem.height,
                    targetValue: elem.newHeight
                });
            }
            if(elem.opacity != 1 && elem.fadeIn == false) {
                args.push({
                    property: "opacity",
                    startValue: elem.opacity,
                    targetValue: 1
                });
                duration = CZ.Settings.canvasElementFadeInTime;
            }
            if(isLayoutAnimation == false || args.length == 0) {
                duration = 0;
            }
            initializeAnimation(elem, duration, args);
            if(elem.fadeIn == true) {
                for(var i = 0; i < elem.children.length; i++) {
                    if(elem.children[i].fadeIn == true) {
                        animateElement(elem.children[i]);
                    }
                }
            } else {
                for(var i = 0; i < elem.children.length; i++) {
                    animateElement(elem.children[i]);
                }
            }
        }
        function initializeAnimation(elem, duration, args) {
            var startTime = (new Date()).getTime();
            elem.animation = {
                isAnimating: true,
                duration: duration,
                startTime: startTime,
                args: args
            };
            if(typeof Layout.animatingElements[elem.id] === 'undefined') {
                Layout.animatingElements[elem.id] = elem;
                Layout.animatingElements.length++;
            }
            elem.calculateNewFrame = function () {
                var curTime = (new Date()).getTime();
                var t;
                if(elem.animation.duration > 0) {
                    t = Math.min(1.0, (curTime - elem.animation.startTime) / elem.animation.duration);
                } else {
                    t = 1.0;
                }
                t = CZ.ViewportAnimation.animationEase(t);
                for(var i = 0; i < args.length; i++) {
                    if(typeof elem[args[i].property] !== 'undefined') {
                        elem[elem.animation.args[i].property] = elem.animation.args[i].startValue + t * (elem.animation.args[i].targetValue - elem.animation.args[i].startValue);
                    }
                }
                if(t == 1.0) {
                    elem.animation.isAnimating = false;
                    elem.animation.args = [];
                    delete Layout.animatingElements[elem.id];
                    Layout.animatingElements.length--;
                    if(elem.fadeIn == false) {
                        elem.fadeIn = true;
                    }
                    for(var i = 0; i < elem.children.length; i++) {
                        if(typeof elem.children[i].animation === 'undefined') {
                            animateElement(elem.children[i]);
                        }
                    }
                    return;
                }
            };
        }
        function numberWithCommas(n) {
            var parts = n.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
        function merge(src, dest) {
            if(src.id === dest.guid) {
                var srcChildTimelines = (src.timelines instanceof Array) ? src.timelines : [];
                var destChildTimelines = [];
                for(var i = 0; i < dest.children.length; i++) {
                    if(dest.children[i].type && dest.children[i].type === "timeline") {
                        destChildTimelines.push(dest.children[i]);
                    }
                }
                if(srcChildTimelines.length === destChildTimelines.length) {
                    dest.isBuffered = dest.isBuffered || (src.timelines instanceof Array);
                    var origTop = Number.MAX_VALUE;
                    var origBottom = Number.MIN_VALUE;
                    for(var i = 0; i < dest.children.length; i++) {
                        if(dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                            if(dest.children[i].newY < origTop) {
                                origTop = dest.children[i].newY;
                            }
                            if(dest.children[i].newY + dest.children[i].newHeight > origBottom) {
                                origBottom = dest.children[i].newY + dest.children[i].newHeight;
                            }
                        }
                    }
                    dest.delta = 0;
                    for(var i = 0; i < srcChildTimelines.length; i++) {
                        merge(srcChildTimelines[i], destChildTimelines[i]);
                    }
                    var haveChildTimelineExpanded = false;
                    for(var i = 0; i < destChildTimelines.length; i++) {
                        if(destChildTimelines[i].delta) {
                            haveChildTimelineExpanded = true;
                        }
                    }
                    if(haveChildTimelineExpanded) {
                        for(var i = 0; i < destChildTimelines.length; i++) {
                            if(destChildTimelines[i].delta) {
                                destChildTimelines[i].newHeight += destChildTimelines[i].delta;
                            }
                        }
                        calculateForceOnChildren(dest);
                        for(var i = 0; i < dest.children.length; i++) {
                            if(dest.children[i].force) {
                                shiftAbsoluteCoords(dest.children[i], dest.children[i].force);
                            }
                        }
                        var top = Number.MAX_VALUE;
                        var bottom = Number.MIN_VALUE;
                        var bottomElementName = "";
                        for(var i = 0; i < dest.children.length; i++) {
                            if(dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                                if(dest.children[i].newY < top) {
                                    top = dest.children[i].newY;
                                }
                                if(dest.children[i].newY + dest.children[i].newHeight > bottom) {
                                    bottom = dest.children[i].newY + dest.children[i].newHeight;
                                    bottomElementName = dest.children[i].title;
                                }
                            }
                        }
                        dest.delta = Math.max(0, (bottom - top) - (origBottom - origTop));
                        dest.titleObject.newY += dest.delta;
                        dest.titleObject.newBaseline += dest.delta;
                        dest.titleObject.opacity = 0;
                        dest.titleObject.fadeIn = false;
                        delete dest.titleObject.animation;
                        if(bottom > dest.titleObject.newY) {
                            var msg = bottomElementName + " EXCEEDS " + dest.title + ".\n" + "bottom: " + numberWithCommas(bottom) + "\n" + "   top: " + numberWithCommas(dest.titleObject.newY) + "\n";
                            console.log(msg);
                        }
                        for(var i = 1; i < dest.children.length; i++) {
                            var el = dest.children[i];
                            for(var j = 1; j < dest.children.length; j++) {
                                var ael = dest.children[j];
                                if(el.id !== ael.id) {
                                    if(!(ael.x <= el.x && ael.x + ael.width <= el.x || ael.x >= el.x + el.width && ael.x + ael.width >= el.x + el.width || ael.newY <= el.newY && ael.newY + ael.newHeight <= el.newY || ael.newY >= el.newY + el.newHeight && ael.newY + ael.newHeight >= el.newY + el.newHeight)) {
                                        var msg = el.title + " OVERLAPS " + ael.title + ".\n";
                                        console.log(msg);
                                    }
                                }
                            }
                        }
                    }
                } else if(srcChildTimelines.length > 0 && destChildTimelines.length === 0) {
                    var t = generateLayout(src, dest);
                    var margin = Math.min(t.width, t.newHeight) * CZ.Settings.timelineHeaderMargin;
                    dest.delta = Math.max(0, t.newHeight - dest.newHeight);
                    dest.children.splice(0);
                    for(var i = 0; i < t.children.length; i++) {
                        dest.children.push(t.children[i]);
                    }
                    dest.titleObject = dest.children[0];
                    dest.isBuffered = dest.isBuffered || (src.timelines instanceof Array);
                    for(var i = 0; i < dest.children.length; i++) {
                        convertRelativeToAbsoluteCoords(dest.children[i], dest.newY);
                    }
                } else {
                    dest.delta = 0;
                }
            } else {
                throw "error: Cannot merge timelines. Src and dest node ids differ.";
            }
        }
        function Merge(src, dest) {
            if(typeof CZ.Authoring !== 'undefined' && CZ.Authoring.isActive) {
                return;
            }
            if(src && dest) {
                if(dest.id === "__root__") {
                    src.AspectRatio = 10;
                    var t = generateLayout(src, dest);
                    convertRelativeToAbsoluteCoords(t, 0);
                    dest.children.push(t);
                    animateElement(dest);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                } else {
                    merge(src, dest);
                    dest.newHeight += dest.delta;
                    animateElement(dest);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            }
        }
        Layout.Merge = Merge;
    })(CZ.Layout || (CZ.Layout = {}));
    var Layout = CZ.Layout;
})(CZ || (CZ = {}));
