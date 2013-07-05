﻿/// <reference path='settings.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='common.ts'/>
/// <reference path='viewport.ts'/>
/// <reference path='viewport-animation.ts'/>

module CZ {
    export module Layout {
        // array containing the elements of an ongoing merge animation
        // can contain multiple objects with same id
        // e.g. during content item zoom level changes, exhibits can contain
        // the same content item at different zoom levels, all having the same id
        export var animatingElements = [];

        export var visibleForce = 0; // vertical offset for viewport after merge animation
        export var animationStartTime; // start time of merge animation
        export var viewportSyncRequired: bool = false; // indicates if viewport need to be synced during merge animation
        export var startViewport; // viewport (bounding box of the screen, virtual coordinates) before merge animation
        export var startVisible; // visible (center point of the screen, virtual coordinates) region before merge animation

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

            // save timeline end date in case if it is '9999'
            timeline.endDate = timeline.end;

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (exhibit) {
                    exhibit.x = CZ.Dates.getCoordinateFromDecimalYear(exhibit.time);

                    exhibit.contentItems.forEach(function (contentItem) {
                        // For content items that contain an extension, activate it.
                        CZ.Extensions.activateExtension(contentItem.mediaType);
                    });
                });
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeline) {
                    childTimeline.ParentTimeline = timeline;
                    Prepare(childTimeline);
                });
            }

            GenerateAspect(timeline);
            if (timeline.Height)
                timeline.Height /= 100;
            else if (!timeline.AspectRatio && !timeline.Height)
                timeline.Height = 0.4;
        }

        function GenerateAspect(timeline) {
            if (timeline.ID == CZ.Settings.cosmosTimelineID) {
                timeline.AspectRatio = 10;
            }
            /*
            else if (timeline.ID == earthTimelineID) {
                timeline.AspectRatio = 1.0;
            } else if (timeline.ID == lifeTimelineID) {
                timeline.AspectRatio = 47.0 / 22.0;
            } else if (timeline.ID == prehistoryTimelineID) {
                timeline.AspectRatio = 37.0 / 11.0;
            } else if (timeline.ID == humanityTimelineID) {
                timeline.AspectRatio = 55.0 / 4.0;
            }
            */
        }

        function LayoutTimeline(timeline, parentWidth, measureContext) {
            var headerPercent = CZ.Settings.timelineHeaderSize + 2 * CZ.Settings.timelineHeaderMargin;
            var timelineWidth = timeline.right - timeline.left;
            timeline.width = timelineWidth;

            //If child timeline has fixed aspect ratio, calculate its height according to it
            if (timeline.AspectRatio && !timeline.height) {
                timeline.height = timelineWidth / timeline.AspectRatio;
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    //If child timeline has fixed aspect ratio, calculate its height according to it
                    if (tl.AspectRatio) {
                        tl.height = (tl.right - tl.left) / tl.AspectRatio;
                    } else if (timeline.height && tl.Height) {
                        //If Child timeline has height in percentage of parent, calculate it before layout pass
                        tl.height = Math.min(timeline.height * tl.Height, (tl.right - tl.left) * CZ.Settings.timelineMinAspect);
                    }
                    //Calculate layout for each child timeline
                    LayoutTimeline(tl, timelineWidth, measureContext);
                });
            }

            if (!timeline.height) {
                //Searching for timeline with the biggest ratio between its height percentage and real height
                var scaleCoef = undefined;
                if (timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (tl) {
                        if (tl.Height && !tl.AspectRatio) {
                            var localScale = tl.height / tl.Height;
                            if (!scaleCoef || scaleCoef < localScale)
                                scaleCoef = localScale;
                        }
                    });
                }
                //Scaling timelines to make their percentages corresponding to each other
                if (scaleCoef) {
                    if (timeline.timelines instanceof Array) {
                        timeline.timelines.forEach(function (tl) {
                            if (tl.Height && !tl.AspectRatio) {
                                var scaleParam = scaleCoef * tl.Height / tl.height;
                                if (scaleParam > 1) {
                                    tl.realY *= scaleParam;
                                    Scale(tl, scaleParam, measureContext);
                                }
                            }
                        });
                    }
                    //Set final timelineHeight
                    timeline.height = scaleCoef;
                }
            }

            //Now positioning child content and title
            var exhibitSize = CalcInfodotSize(timeline);
            //Layout only timelines to check that they fit into parent timeline
            var tlRes = LayoutChildTimelinesOnly(timeline);
            //First layout iteration of full content (taking Sequence in account)
            var res = LayoutContent(timeline, exhibitSize);
            if (timeline.height) {
                var titleObject = GenerateTitleObject(timeline.height, timeline, measureContext);

                if (timeline.exhibits instanceof Array) {
                    if (timeline.exhibits.length > 0 && (tlRes.max - tlRes.min) < timeline.height) {
                        while ((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && exhibitSize > timelineWidth / 20.0) {
                            exhibitSize /= 1.5;
                            res = LayoutContent(timeline, exhibitSize);
                        }
                    }
                }

                if ((res.max - res.min) > (timeline.height - titleObject.bboxHeight)) {
                    //console.log("Warning: Child timelines and exhibits doesn't fit into parent. Timeline name: " + timeline.title);
                    var contentHeight = res.max - res.min;
                    var fullHeight = contentHeight / (1 - headerPercent);
                    var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                    timeline.height = fullHeight;
                } else {
                    //var scale = (timeline.height - titleObject.bboxHeight) / (res.max - res.min);
                    //if (scale > 1) {
                    //    timeline.timelines.forEach(function (tl) {
                    //        tl.realY *= scale;
                    //        if (!tl.AspectRatio)
                    //            Scale(tl, scale, measureContext);
                    //    });

                    //    timeline.exhibits.forEach(function (eb) {
                    //        eb.realY *= scale;
                    //    });
                    //}
                }

                timeline.titleRect = titleObject;
            }
            else {
                var min = res.min;
                var max = res.max;

                var minAspect = 1.0 / CZ.Settings.timelineMinAspect;
                var minHeight = timelineWidth / minAspect;

                //Measure title
                var contentHeight = Math.max((1 - headerPercent) * minHeight, max - min);
                var fullHeight = contentHeight / (1 - headerPercent);
                var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                timeline.titleRect = titleObject;
                timeline.height = fullHeight;
            }

            timeline.heightEps = parentWidth * CZ.Settings.timelineContentMargin;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.realY = 0;

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.realY -= res.min;
                });
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY -= res.min;
                });
            }
        }

        function PositionContent(contentArray, arrangedArray, intersectionFunc) {
            contentArray.forEach(function (el) {
                var usedY = new Array();

                arrangedArray.forEach(function (ael) {
                    if (intersectionFunc(el, ael)) {
                        usedY.push({ top: ael.realY + ael.realHeight, bottom: ael.realY });
                    }
                });

                var y = 0;

                if (usedY.length > 0) {
                    //Find free segments
                    var segmentPoints = new Array();
                    usedY.forEach(function (segment) {
                        segmentPoints.push({ type: "bottom", value: segment.bottom });
                        segmentPoints.push({ type: "top", value: segment.top });
                    });

                    segmentPoints.sort(function (l, r) { return l.value - r.value; });

                    var freeSegments = new Array();
                    var count = 0;
                    for (i = 0; i < segmentPoints.length - 1; i++) {
                        if (segmentPoints[i].type == "top")
                            count++;
                        else
                            count--;

                        if (count == 0 && segmentPoints[i + 1].type == "bottom")
                            freeSegments.push({ bottom: segmentPoints[i].value, top: segmentPoints[i + 1].value });
                    }

                    //Find suitable free segment
                    var foundPlace = false;
                    for (var i = 0; i < freeSegments.length; i++) {
                        if ((freeSegments[i].top - freeSegments[i].bottom) > el.realHeight) {
                            y = freeSegments[i].bottom;
                            foundPlace = true;
                            break;
                        }
                    };

                    if (!foundPlace) {
                        y = segmentPoints[segmentPoints.length - 1].value;
                    }
                }

                el.realY = y;
                arrangedArray.push(el);
            });
        }

        function LayoutContent(timeline, exhibitSize) {
            //Prepare arrays for ordered and unordered content
            var sequencedContent = new Array();
            var unsequencedContent = new Array();

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    if (tl.Sequence)
                        sequencedContent.push(tl);
                    else
                        unsequencedContent.push(tl);
                });
            }

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.size = exhibitSize;
                    eb.left = eb.x - eb.size / 2.0;
                    eb.right = eb.x + eb.size / 2.0;
                    eb.realHeight = exhibitSize;

                    if (eb.left < timeline.left) {
                        eb.left = timeline.left;
                        eb.right = eb.left + eb.size;
                        eb.isDeposed = true;
                    } else if (eb.right > timeline.right) {
                        eb.right = timeline.right;
                        eb.left = timeline.right - eb.size;
                        eb.isDeposed = true;
                    }

                    if (eb.Sequence)
                        sequencedContent.push(eb);
                    else
                        unsequencedContent.push(eb);
                });
            }

            sequencedContent.sort(function (l, r) {
                return l.Sequence - r.Sequence;
            });

            //Prepare measure arrays
            var arrangedElements = new Array();

            PositionContent(sequencedContent, arrangedElements, function (el, ael) { return el.left < ael.right; });
            PositionContent(unsequencedContent, arrangedElements, function (el, ael) { return !(el.left >= ael.right || ael.left >= el.right); });

            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;

            arrangedElements.forEach(function (element) {
                if (element.realY < min)
                    min = element.realY;
                if ((element.realY + element.realHeight) > max)
                    max = element.realY + element.realHeight;
            });

            if (arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }

            return { max: max, min: min };
        }

        function LayoutChildTimelinesOnly(timeline) {
            var arrangedElements = new Array();
            if (timeline.timelines instanceof Array) {
                PositionContent(timeline.timelines, arrangedElements, function (el, ael) { return !(el.left >= ael.right || ael.left >= el.right); });
            }

            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;

            arrangedElements.forEach(function (element) {
                if (element.realY < min)
                    min = element.realY;
                if ((element.realY + element.realHeight) > max)
                    max = element.realY + element.realHeight;
            });

            if (arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }

            return { max: max, min: min };
        }

        function Scale(timeline, scale, mctx) {
            if (scale < 1)
                throw "Only extending of content is allowed";

            timeline.height *= scale;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.titleRect = GenerateTitleObject(timeline.height, timeline, mctx);

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY *= scale;
                    if (!tl.AspectRatio)
                        Scale(tl, scale, mctx);
                });
            }

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.realY *= scale;
                });
            }
        }

        function Arrange(timeline) {
            timeline.y = timeline.realY + timeline.heightEps;

            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.y = infodot.realY + infodot.size / 2.0 + timeline.y;
                });
            }

            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY += timeline.y;
                    Arrange(tl);
                });
            }
        }

        function CalcInfodotSize(timeline) {
            return (timeline.right - timeline.left) / 20.0;
        }

        export function GenerateTitleObject(tlHeight, timeline, measureContext) {
            var tlW = timeline.right - timeline.left;

            measureContext.font = "100pt " + CZ.Settings.timelineHeaderFontName;
            var size = measureContext.measureText(timeline.title);
            var height = CZ.Settings.timelineHeaderSize * tlHeight;
            var width = height * size.width / 100.0;

            var margin = Math.min(tlHeight, tlW) * CZ.Settings.timelineHeaderMargin;

            if (width + 2 * margin > tlW) {
                width = tlW - 2 * margin;
                height = width * 100.0 / size.width;
            }


            return {
                width: width - 1.25 * height, // decrease text width for saving place for edit icon
                height: height,
                marginTop: tlHeight - height - margin,
                marginLeft: margin,
                bboxWidth: width + 2 * margin - 1.25 * height, // decrease bbox width for saving place for edit icon
                bboxHeight: height + 2 * margin
            };
        }

        function Convert(parent, timeline) {
            //Creating timeline
            var tlColor = GetTimelineColor(timeline);
            var t1 = CZ.VCContent.addTimeline(parent, "layerTimelines", 't' + timeline.id,
            {
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

            //Creating Infodots
            if (timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (childInfodot) {
                    var contentItems = [];
                    if (typeof childInfodot.contentItems !== 'undefined') {
                        contentItems = childInfodot.contentItems;
                        // NOTE: Consider to remove id completely.
                        for (var i = 0; i < contentItems.length; ++i) {
                            contentItems[i].guid = contentItems[i].id;
                        }
                    }

                    var infodot1 = CZ.VCContent.addInfodot(t1, "layerInfodots", 'e' + childInfodot.id,
                            (childInfodot.left + childInfodot.right) / 2.0, childInfodot.y, 0.8 * childInfodot.size / 2.0, contentItems,
                            {
                                isBuffered: false,
                                guid: childInfodot.id,
                                title: childInfodot.title,
                                date: childInfodot.time,
                                opacity: 1
                            });
                });
            }

            //Filling child timelines
            if (timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeLine) {
                    Convert(t1, childTimeLine);
                });
            }
        }

        function GetTimelineColor(timeline) {
            if (timeline.Regime == "Cosmos") {
                return "rgba(152, 108, 157, 1.0)";
            }
            else if (timeline.Regime == "Earth") {
                return "rgba(81, 127, 149, 1.0)";
            }
            else if (timeline.Regime == "Life") {
                return "rgba(73, 150, 73, 1.0)";
            }
            else if (timeline.Regime == "Pre-history") {
                return "rgba(237, 145, 50, 1.0)";
            }
            else if (timeline.Regime == "Humanity") {
                return "rgba(212, 92, 70, 1.0)";
            } else {
                return "rgba(255, 255, 255, 0.5)";
            }
        }

        export var FindChildTimeline = function (timeline, id, recursive) {
            var result = undefined;

            if (timeline && timeline.timelines instanceof Array) {
                var n = timeline.timelines.length;
                for (var i = 0; i < n; i++) {
                    var childTimeline = timeline.timelines[i];
                    if (childTimeline.id == id) {
                        // timeline was found
                        result = childTimeline;
                        break;
                    }
                    else {
                        // if recursive mode is on, then search timeline through children of current child timeline
                        if (recursive == true) {
                            result = FindChildTimeline(childTimeline, id, recursive);
                            if (result != undefined)
                                // timeline was found
                                break;
                        }
                    }
                }
            }

            return result;
        }


        function GetVisibleFromTimeline(timeline, vcph) {
            if (timeline) {
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

        export function Load(root, timeline) {
            if (timeline) {
                //Transform timeline start and end dates
                Prepare(timeline);
                //Measure child content for each timiline in tree
                var measureContext = (<any>document.createElement("canvas")).getContext('2d');
                LayoutTimeline(timeline, 0, measureContext);
                //Calculating final placement of the data
                Arrange(timeline);
                //Load timline to Virtual Canvas
                LoadTimeline(root, timeline);
            }
        }

        /*
        ---------------------------------------------------------------------------
                                DYNAMIC LAYOUT 
        ---------------------------------------------------------------------------
        */

        // takes a metadata timeline (FromTimeUnit, FromYear, FromMonth, FromDay, ToTimeUnit, ToYear, ToMonth, ToDay)
        // and returns a corresponding scenegraph (x, y, width, height)
        function generateLayout(tmd, tsg) {
            try {
                if (!tmd.AspectRatio) tmd.height = tsg.height;
                var root = new CZ.VCContent.CanvasRootElement(tsg.vc, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                Load(root, tmd);
                return root.children[0];
            } catch (msg) {
                console.log("exception in [nikita's layout]: " + msg);
            }
        }

        // converts a scenegraph element in absolute coords to relative coords
        function convertRelativeToAbsoluteCoords(el, delta) {
            if (!delta) return;
            if (typeof el.y !== 'undefined') {
                el.y += delta;
                el.newY += delta;
            }
            if (typeof el.baseline !== 'undefined') {
                el.baseline += delta;
                el.newBaseline += delta;
            }
            el.children.forEach(function (child) {
                convertRelativeToAbsoluteCoords(child, delta);
            });
        }

        // shifts a scenegraph element in absolute coords by delta
        function shiftAbsoluteCoords(el, delta) {
            if (!delta) return;
            if (typeof el.newY !== 'undefined') el.newY += delta;
            if (typeof el.newBaseline !== 'undefined') el.newBaseline += delta;
            el.children.forEach(function (child) {
                shiftAbsoluteCoords(child, delta);
            });
        }

        // calculates the net force excerted on each child timeline and infodot
        // after expansion of child timelines to fit the newly added content
        function calculateForceOnChildren(tsg) {
            var eps = tsg.width / 20.0;

            var v = [];
            for (var i = 0, el; i < tsg.children.length; i++) {
                el = tsg.children[i];
                if (el.type && (el.type === "timeline" || el.type === "infodot")) {
                    el.force = 0;
                    v.push(el);
                }
            }

            v.sort(function (el, ael) { return el.newY - ael.newY }); // inc order of y

            for (var i = 0, el; i < v.length; i++) {
                el = v[i];
                if (el.type && el.type === "timeline") {
                    if (el.delta) {
                        var l = el.x;
                        var r = el.x + el.width;
                        var b = el.y + el.newHeight + eps;
                        for (var j = i + 1; j < v.length; j++) {
                            var ael = v[j];
                            if (!(ael.x <= l && ael.x + ael.width <= l || ael.x >= r && ael.x + ael.width >= r)) {
                                // ael intersects (l, r)
                                if (ael.y < b) {
                                    // ael overlaps with el
                                    ael.force += el.delta;

                                    l = Math.min(l, ael.x);
                                    r = Math.max(r, ael.x + ael.width)
                                    b = ael.y + ael.newHeight + el.delta + eps;
                                } else {
                                    // ael does not overlap with el
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }


        function animateElement(elem, noAnimation, callback) {
            var duration = CZ.Settings.canvasElementAnimationTime;
            var args = [];

            if (elem.fadeIn == false && typeof elem.animation === 'undefined') {
                elem.height = elem.newHeight;
                elem.y = elem.newY;

                if (elem.baseline)
                    elem.baseline = elem.newBaseline;
            }

            if (elem.newY != elem.y) {
                args.push({
                    property: "y",
                    startValue: elem.y,
                    targetValue: elem.newY
                });
            }

            if (elem.newHeight != elem.height) {
                args.push({
                    property: "height",
                    startValue: elem.height,
                    targetValue: elem.newHeight
                });
            }

            // calculating viewport offset: sum vertical offsets of every element that is above (in virtual coordinates)
            // initial viewport and horizontally intersects with initial viewport (vertical coordinates are ignored)
            if (!(elem.x + elem.width < startViewport.Left || elem.x > startViewport.Right) && elem.y + elem.height < startViewport.Top) {
                visibleForce += elem.newHeight - elem.height;
            }

            if (elem.opacity != 1 && elem.fadeIn == false) {
                args.push({
                    property: "opacity",
                    startValue: elem.opacity,
                    targetValue: 1
                });
                duration = CZ.Settings.canvasElementFadeInTime;
            }

            if (noAnimation || args.length == 0) {
                duration = 0;
            }

            initializeAnimation(elem, duration, args, callback);

            // first animate resize/transition of buffered content. skip new content
            if (elem.fadeIn == true) {
                for (var i = 0; i < elem.children.length; i++) {
                    if (elem.children[i].fadeIn == true) {
                        animateElement(elem.children[i], noAnimation, callback);
                    }
                }
            } else { // animate new content (fadeIn = false)
                for (var i = 0; i < elem.children.length; i++) {
                    animateElement(elem.children[i], noAnimation, callback);
                }
            }
        }

        function initializeAnimation(elem, duration, args, callback) {
            var startTime = (new Date()).getTime();

            elem.animation = {
                isAnimating: true, // indicates if there is ongoing animation
                duration: duration, // duration of the animation
                startTime: startTime, // start time of the animation
                args: args // arguments of canvas element that should be animated
            };

            // add elem to array of animating elements
            animatingElements.push(elem);

            // calculates new animation frame of element
            elem.calculateNewFrame = function () {
                var curTime = (new Date()).getTime();
                var t;

                if (elem.animation.duration > 0) {
                    t = Math.min(1.0, (curTime - elem.animation.startTime) / elem.animation.duration); //projecting current time to the [0;1] interval of the animation parameter
                }
                else {
                    t = 1.0;
                }

                t = CZ.ViewportAnimation.animationEase(t);

                for (var i = 0; i < args.length; i++) {
                    if (typeof elem[args[i].property] !== 'undefined')
                        elem[elem.animation.args[i].property] = elem.animation.args[i].startValue +
                            t * (elem.animation.args[i].targetValue - elem.animation.args[i].startValue);
                }

                if (t == 1.0) {
                    elem.animation.isAnimating = false;
                    elem.animation.args = [];

                    animatingElements.splice(animatingElements.indexOf(elem), 1);

                    if (elem.fadeIn == false)
                        elem.fadeIn = true;

                    // animate newly added content of this element
                    for (var i = 0; i < elem.children.length; i++)
                        if (typeof elem.children[i].animation === 'undefined')
                            animateElement(elem.children[i], duration === 0, callback);

                    // merge animations are over
                    if (animatingElements.length === 0) {
                        if (callback && typeof(callback) === "function") {
                            callback();
                        }
                    }

                    return;
                }
            }
        }

        // utiltity function for debugging
        function numberWithCommas(n) {
            var parts = n.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }

        function extendLcaPathToRoot(tl, lca) {
            if (tl.guid == lca.id) {
                return lca;
            } else {
                for (var i = 0; i < tl.children.length; i++) {
                    if (tl.children[i].type === 'timeline') {
                        var child = extendLcaPathToRoot(tl.children[i], lca);

                        if (child) {
                            var t = {
                                id: tl.guid,
                                title: tl.title,
                                timelines: []
                            };

                            for (var i = 0; i < tl.children.length; i++) {
                                if (tl.children[i].type === 'timeline') {
                                    if (tl.children[i].guid === child.id) {
                                        t.timelines.push(child)
                                    } else {
                                        var c = {
                                            id: tl.children[i].guid,
                                            title: tl.children[i].title,
                                            timelines: null
                                        };
                                        t.timelines.push(c);
                                    }
                                }
                            }

                            return t;
                        }
                    }
                }
            }
        }

        // src = metadata object tree
        // dest = scenegraph object tree
        // mutates the scenegraph tree (dest) by appending missing data from metadata tree (src).
        function mergeTimelines(src, dest) {
            if (src.id === dest.guid) {
                var srcChildTimelines = (src.timelines instanceof Array) ? src.timelines : [];
                var destChildTimelines = [];
                var destChildTimelinesMap = {}; // src and dest child timelines need not be in the same order
                for (var i = 0; i < dest.children.length; i++) {
                    if (dest.children[i].type && dest.children[i].type === "timeline") {
                        destChildTimelines.push(dest.children[i]);
                        destChildTimelinesMap[dest.children[i].guid] = dest.children[i];
                    }
                }

                if (dest.isBuffered) { // dest contains all its child timelines
                    // cal bbox (top, bottom) for child timelines and infodots
                    var origTop = Number.MAX_VALUE;
                    var origBottom = Number.MIN_VALUE;
                    for (var i = 0; i < dest.children.length; i++) {
                        if (dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                            if (dest.children[i].newY < origTop)
                                origTop = dest.children[i].newY;
                            if (dest.children[i].newY + dest.children[i].newHeight > origBottom)
                                origBottom = dest.children[i].newY + dest.children[i].newHeight;
                        }
                    }

                    // merge child timelines
                    for (var i = 0; i < destChildTimelines.length; i++)
                        destChildTimelines[i].delta = 0;    

                    for (var i = 0; i < srcChildTimelines.length; i++) {
                        var srcTimeline = srcChildTimelines[i];
                        var destTimeline = destChildTimelinesMap[srcChildTimelines[i].id];
                        if (srcTimeline && destTimeline) {
                            mergeTimelines(srcTimeline, destTimeline);
                        } else {
                            throw "error: Cannot find matching destination timeline for source timeline.";
                        }
                    }

                    // check if child timelines have expanded
                    var haveChildTimelineExpanded = false;
                    for (var i = 0; i < destChildTimelines.length; i++)
                        if (destChildTimelines[i].delta)
                            haveChildTimelineExpanded = true;

                    if (haveChildTimelineExpanded) {
                        // expand child timelines with delta
                        for (var i = 0; i < destChildTimelines.length; i++)
                            if (destChildTimelines[i].delta)
                                destChildTimelines[i].newHeight += destChildTimelines[i].delta;

                        // shift all timelines and infodots above and below a expanding timeline
                        calculateForceOnChildren(dest);
                        for (var i = 0; i < dest.children.length; i++)
                            if (dest.children[i].force)
                                shiftAbsoluteCoords(dest.children[i], dest.children[i].force);

                        // cal bbox (top, bottom) for child timelines and infodots after expansion
                        var top = Number.MAX_VALUE;
                        var bottom = Number.MIN_VALUE;
                        var bottomElementName = "";
                        for (var i = 0; i < dest.children.length; i++) {
                            if (dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                                if (dest.children[i].newY < top)
                                    top = dest.children[i].newY;
                                if (dest.children[i].newY + dest.children[i].newHeight > bottom) {
                                    bottom = dest.children[i].newY + dest.children[i].newHeight;
                                    bottomElementName = dest.children[i].title;
                                }
                            }
                        }

                        // update title pos after expansion
                        dest.delta = Math.max(0, (bottom - top) - (origBottom - origTop));
                        // hide animating text
                        // TODO: find the better way to fix text shacking bug if possible
                        dest.titleObject.newY += dest.delta;
                        dest.titleObject.newBaseline += dest.delta;
                        dest.titleObject.opacity = 0;
                        dest.titleObject.fadeIn = false;
                        delete dest.titleObject.animation;

                        /*
                        // assert: children don't exceed parent
                        if (bottom > dest.titleObject.newY) {
                            var msg = bottomElementName + " EXCEEDS " + dest.title + ".\n" + "bottom: " + numberWithCommas(bottom) + "\n" + "   top: " + numberWithCommas(dest.titleObject.newY) + "\n";
                            console.log(msg);
                        }
                        */
                        
                        /*
                        // assert: children don't overlap
                        for (var i = 1; i < dest.children.length; i++) {
                            var el = dest.children[i];
                            for (var j = 1; j < dest.children.length; j++) {
                                var ael = dest.children[j];
                                if (el.id !== ael.id) {
                                    if (!(ael.x <= el.x && ael.x + ael.width <= el.x ||
                                        ael.x >= el.x + el.width && ael.x + ael.width >= el.x + el.width ||
                                        ael.newY <= el.newY && ael.newY + ael.newHeight <= el.newY ||
                                        ael.newY >= el.newY + el.newHeight && ael.newY + ael.newHeight >= el.newY + el.newHeight)) {

                                        var msg = el.title + " OVERLAPS " + ael.title + ".\n";
                                        console.log(msg);
                                    }
                                }
                            }
                        }
                        */
                    }

                } else { // dest does not contain all its child timelines
                    if (!src.timelines) return;
                    var t = generateLayout(src, dest);
                    var margin = Math.min(t.width, t.newHeight) * CZ.Settings.timelineHeaderMargin;
                    dest.delta = Math.max(0, t.newHeight - dest.newHeight); // timelines can only grow, never shrink

                    // replace dest.children (timelines, infodots, titleObject) with matching t.children
                    dest.children.splice(0);
                    for (var i = 0; i < t.children.length; i++) {
                        dest.children.push(t.children[i]);
                        t.children[i].parent = dest;
                    }
                    dest.titleObject = dest.children[0];
                    dest.isBuffered = t.isBuffered;

                    // dest now contains all src children
                    for (var i = 0; i < dest.children.length; i++)
                        convertRelativeToAbsoluteCoords(dest.children[i], dest.newY);
                }
            } else {
                throw "error: Cannot merge timelines. Src and dest node ids differ.";
            }
        }

        export function merge(src, dest, noAnimation? = false, callback? = () => { }) {
            if (src && dest) {
                try {
                    viewportSyncRequired = true;
                    // resetting viewport offset
                    visibleForce = 0;
                    // saving initial viewport
                    startVisible = CZ.Common.vc.virtualCanvas("getViewport").visible;
                    startViewport = CZ.Common.vc.virtualCanvas("visibleToViewBox", startVisible);

                    if (dest.id === "__root__") {
                        src.AspectRatio = 10;
                        var t = generateLayout(src, dest);
                        convertRelativeToAbsoluteCoords(t, 0);
                        dest.children.push(t);
                        animateElement(dest, noAnimation, callback);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    } else {
                        // skip dynamic layout during active authoring session
                        if (CZ.Authoring && CZ.Authoring.isEnabled)
                            return;

                        // skip dynamic layout during elliptical zoom animation
                        if (CZ.Common.controller.activeAnimation && CZ.Common.controller.activeAnimation.type === "EllipticalZoom")
                            return;

                        var root = CZ.Common.vc.virtualCanvas("getLayerContent");
                        src = extendLcaPathToRoot(root.children[0], src);
                        dest = root.children[0];
                        dest.delta = 0;
                        mergeTimelines(src, dest);
                        dest.newHeight += dest.delta;
                        animateElement(dest, noAnimation, callback);

                        // "global" merge animation start
                        animationStartTime = (new Date()).getTime();
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        /*
        * synchronizes viewport and canvas visible area that was viewed by user before merge animation start
        */
        export function syncViewport() {
            // TODO: stop viewport synchronization in case if animation was interrupted by user
            if (viewportSyncRequired === false) {
                return;
            }

            var newVisible = new CZ.Viewport.VisibleRegion2d(startVisible.centerX,
                startVisible.centerY,
                startVisible.scale);
            // calculate animation time: 0 <= t <= 1
            var t = Math.min(1, ((new Date()).getTime() - animationStartTime) / CZ.Settings.canvasElementAnimationTime);

            newVisible.centerY = startVisible.centerY + t * visibleForce;
            CZ.Common.controller.moveToVisible(newVisible, true);
        }
    }
}