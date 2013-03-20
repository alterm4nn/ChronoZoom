var isLayoutAnimation = true; // temp variable for debugging
var animatingElements = {}; // hashmap of animating elements of virtual canvas

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
    GenerateProperty(timeline, "FromTimeUnit", "FromYear", "FromMonth", "FromDay", "left");
    GenerateProperty(timeline, "ToTimeUnit", "ToYear", "ToMonth", "ToDay", "right");

    if (timeline.Exhibits instanceof Array) {
        timeline.Exhibits.forEach(function (exhibit) {
            GenerateProperty(exhibit, "TimeUnit", "Year", "Month", "Day", "x");
        });
    }

    if (timeline.ChildTimelines instanceof Array) {
        timeline.ChildTimelines.forEach(function (childTimeline) {
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
    if (timeline.ID == cosmosTimelineID) {
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
    var headerPercent = timelineHeaderSize + 2 * timelineHeaderMargin;
    var timelineWidth = timeline.right - timeline.left;
    timeline.width = timelineWidth;

    //If child timeline has fixed aspect ratio, calculate its height according to it
    if (timeline.AspectRatio && !timeline.height) {
        timeline.height = timelineWidth / timeline.AspectRatio;
    }

    if (timeline.ChildTimelines instanceof Array) {
        timeline.ChildTimelines.forEach(function (tl) {
            //If child timeline has fixed aspect ratio, calculate its height according to it
            if (tl.AspectRatio) {
                tl.height = (tl.right - tl.left) / tl.AspectRatio;
            } else if (timeline.height && tl.Height) {
                //If Child timeline has height in percentage of parent, calculate it before layout pass
                tl.height = timeline.height * tl.Height;
            }
            //Calculate layout for each child timeline
            LayoutTimeline(tl, timelineWidth, measureContext);
        });
    }

    if (!timeline.height) {
        //Searching for timeline with the biggest ratio between its height percentage and real height
        var scaleCoef = undefined;
        if (timeline.ChildTimelines instanceof Array) {
            timeline.ChildTimelines.forEach(function (tl) {
                if (tl.Height && !tl.AspectRatio) {
                    var localScale = tl.height / tl.Height;
                    if (!scaleCoef || scaleCoef < localScale)
                        scaleCoef = localScale;
                }
            });
        }
        //Scaling timelines to make their percentages corresponding to each other
        if (scaleCoef) {
            if (timeline.ChildTimelines instanceof Array) {
                timeline.ChildTimelines.forEach(function (tl) {
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

        if (timeline.Exhibits instanceof Array) {
            if (timeline.Exhibits.length > 0 && (tlRes.max - tlRes.min) < timeline.height) {
                while ((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && exhibitSize > timelineWidth / 20.0) {
                    exhibitSize /= 1.5;
                    res = LayoutContent(timeline, exhibitSize);
                }
            }
        }

        if ((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && Log) {
            Log.push("Warning: Child timelines and exhibits doesn't fit into parent. Timeline name: " + timeline.Title);
            var contentHeight = res.max - res.min;
            var fullHeight = contentHeight / (1 - headerPercent);
            var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
            timeline.height = fullHeight;
        } else {
            //var scale = (timeline.height - titleObject.bboxHeight) / (res.max - res.min);
            //if (scale > 1) {
            //    timeline.ChildTimelines.forEach(function (tl) {
            //        tl.realY *= scale;
            //        if (!tl.AspectRatio)
            //            Scale(tl, scale, measureContext);
            //    });

            //    timeline.Exhibits.forEach(function (eb) {
            //        eb.realY *= scale;
            //    });
            //}
        }

        timeline.titleRect = titleObject;
    }
    else {
        var min = res.min;
        var max = res.max;

        var minAspect = 1.0 / timelineMinAspect;
        var minHeight = timelineWidth / minAspect;

        //Measure title
        var contentHeight = Math.max((1 - headerPercent) * minHeight, max - min);
        var fullHeight = contentHeight / (1 - headerPercent);
        var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
        timeline.titleRect = titleObject;
        timeline.height = fullHeight;
    }

    timeline.heightEps = parentWidth * timelineContentMargin;
    timeline.realHeight = timeline.height + 2 * timeline.heightEps;
    timeline.realY = 0;

    if (timeline.Exhibits instanceof Array) {
        timeline.Exhibits.forEach(function (infodot) {
            infodot.realY -= res.min;
        });
    }

    if (timeline.ChildTimelines instanceof Array) {
        timeline.ChildTimelines.forEach(function (tl) {
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

    function PositionContent(contentArray, arrangedArray, intersectionFunc) {
        if (timeline.ChildTimelines instanceof Array) {
            timeline.ChildTimelines.forEach(function (tl) {
                if (tl.Sequence)
                    sequencedContent.push(tl);
                else
                    unsequencedContent.push(tl);
            });
        }
    }

    if (timeline.Exhibits instanceof Array) {
        timeline.Exhibits.forEach(function (eb) {
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
    PositionContent(timeline.ChildTimelines, arrangedElements, function (el, ael) { return !(el.left >= ael.right || ael.left >= el.right); });

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

    if (timeline.ChildTimelines instanceof Array) {
        timeline.ChildTimelines.forEach(function (tl) {
            tl.realY *= scale;
            if (!tl.AspectRatio)
                Scale(tl, scale, mctx);
        });
    }

    if (timeline.Exhibits instanceof Array) {
        timeline.Exhibits.forEach(function (eb) {
            eb.realY *= scale;
        });
    }
}

function Arrange(timeline) {
    timeline.y = timeline.realY + timeline.heightEps;

    if (timeline.Exhibits instanceof Array) {
        timeline.Exhibits.forEach(function (infodot) {
            infodot.y = infodot.realY + infodot.size / 2.0 + timeline.y;
        });
    }

    if (timeline.ChildTimelines instanceof Array) {
        timeline.ChildTimelines.forEach(function (tl) {
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

    measureContext.font = "100pt " + timelineHeaderFontName;
    var size = measureContext.measureText(timeline.Title);
    var height = timelineHeaderSize * tlHeight;
    var width = height * size.width / 100.0;

    var margin = Math.min(tlHeight, tlW) * timelineHeaderMargin;

    if (width + 2 * margin > tlW) {
        width = tlW - 2 * margin;
        height = width * 100.0 / size.width;
    }


    return {
        width: width,
        height: height,
        marginTop: tlHeight - height - margin,
        marginLeft: margin,
        bboxWidth: width + 2 * margin,
        bboxHeight: height + 2 * margin
    };
}

function Convert(parent, timeline) {
    //Creating timeline
    var tlColor = GetTimelineColor(timeline);
    var t1 = addTimeline(parent, "layerTimelines", 't' + timeline.UniqueID,
    {
        timeStart: timeline.left,
        timeEnd: timeline.right,
        top: timeline.y,
        height: timeline.height,
        header: timeline.Title,
        fillStyle: "rgba(0,0,0,0.25)",
        titleRect: timeline.titleRect,
        strokeStyle: tlColor,
        regime: timeline.Regime,
        opacity: 0
    });

    //Creating Infodots
    if (timeline.Exhibits instanceof Array) {
        timeline.Exhibits.forEach(function (childInfodot) {
            var date; // building a date to be shown in a title of the content item to the left of the title text.

            var contentItems = new Array();
            if (childInfodot.ContentItems instanceof Array) {
                childInfodot.ContentItems.forEach(function (contentItemProt) {
                    var mediaType = contentItemProt.MediaType;
                    if (mediaType == "Picture")
                        mediaType = 'image';
                    else if (mediaType == "Video")
                        mediaType = 'video';

                    date = buildDate(contentItemProt);

                    contentItems.push({
                        id: 'c' + contentItemProt.UniqueID,
                        title: contentItemProt.Title,
                        mediaUrl: contentItemProt.Uri,
                        mediaType: mediaType,
                        description: contentItemProt.Caption,
                        date: date,
                        guid: contentItemProt.ID,
                        attribution: contentItemProt.Attribution,
                        mediaSource: contentItemProt.MediaSource,
                        order: contentItemProt.Order ? contentItemProt.Order : 0
                    });
                });
            }

            date = buildDate(childInfodot);
            var infodot1 = addInfodot(t1, "layerInfodots", 'e' + childInfodot.UniqueID,
                    (childInfodot.left + childInfodot.right) / 2.0, childInfodot.y, 0.8 * childInfodot.size / 2.0, contentItems,
                    {
                        title: childInfodot.Title,
                        date: date,
                        guid: childInfodot.ID,
                        opacity: 0
                    });
        });
    }

    //Filling child timelines
    if (timeline.ChildTimelines instanceof Array) {
        timeline.ChildTimelines.forEach(function (childTimeLine) {
            Convert(t1, childTimeLine);
        });
    }

}

function buildDate(obj) {
    var date;
    if (obj.Year) {
        date = obj.Year;
        if (obj.TimeUnit !== 'CE')
            date += ' ' + obj.TimeUnit;
    }
    else {
        date = obj.Date;
    }
    return date;
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

var FindChildTimeline = function (timeline, id, recursive) {
    var result = undefined;

    if (timeline && timeline.ChildTimelines instanceof Array) {
        var n = timeline.ChildTimelines.length;
        for (var i = 0; i < n; i++) {
            var childTimeline = timeline.ChildTimelines[i];
            if (childTimeline.ID == id) {
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
        return new VisibleRegion2d(timeline.left + (timeline.right - timeline.left) / 2.0, timeline.y + timeline.height / 2.0, Math.max(scaleX, scaleY));
    }
}

function LoadTimeline(root, rootTimeline) {
    root.beginEdit();
    Convert(root, rootTimeline);
    root.endEdit(true);
}

function Load(root, timeline) {
    if (timeline) {
        //Transform timeline start and end dates
        Prepare(timeline);
        //Measure child content for each timiline in tree
        var measureContext = document.createElement("canvas").getContext('2d');
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
// todo: remove dependency on virtual canvas (vc)
function generateLayout(tmd, tsg) {
    try {
        if (!tmd.AspectRatio) tmd.height = tsg.height;
        var root = new CanvasRootElement(tsg.vc, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
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
    var eps = tsg.height / 10;

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
                    if (ael.x > l && ael.x < r || ael.x + ael.width > l && ael.x + ael.width < r || ael.x + ael.width > l && ael.x + ael.width === 0 && r === 0) {
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


function animateElement(elem) {
    var duration = canvasElementAnimationTime;
    var args = [];

    if (elem.fadeIn == false && typeof elem.animation === 'undefined') {
        elem.height = elem.newHeight;
        elem.y = elem.newY;

        if (elem.baseline)
            elem.baseline = elem.newBaseline;
    }    

    if (elem.newHeight != elem.height || elem.newY != elem.y) {
        args.push({
            property: "y",
            startValue: elem.y,
            targetValue: elem.newY
        });
        args.push({
            property: "height",
            startValue: elem.height,
            targetValue: elem.newHeight
        });
    }

    if (elem.baseline)
        args.push({
            property: "baseline",
            startValue: elem.baseline,
            targetValue: elem.newBaseline
        });

    if (elem.opacity != 1 && elem.fadeIn == false) {
        args.push({
            property: "opacity",
            startValue: elem.opacity,
            targetValue: 1
        });
        duration = canvasElementFadeInTime;
    }

    if (isLayoutAnimation == false || args.length == 0)
        duration = 0;    
    
    initializeAnimation(elem, duration, args);

    // first animate resize/transition of buffered content. skip new content
    if (elem.fadeIn == true) {
        for (var i = 0; i < elem.children.length; i++)
            if (elem.children[i].fadeIn == true) 
                animateElement(elem.children[i]);
    }
    else // animate new content (fadeIn = false)
        for (var i = 0; i < elem.children.length; i++)
            animateElement(elem.children[i]);    
}

function initializeAnimation(elem, duration, args) {
    var startTime = (new Date()).getTime();

    animatingElements[elem.id] = elem; // update/push element in hashmap

    elem.animation = {
        isAnimating: true, // indicates if there is ongoing animation
        duration: duration, // duration of the animation
        startTime: startTime, // start time of the animation
        args: args // arguments of canvas element that should be animated
    };

    // calculates new animation frame of element
    elem.calculateNewFrame = function () {
        var curTime = (new Date()).getTime();
        var t;

        if (elem.animation.duration > 0)
            t = Math.min(1.0, (curTime - elem.animation.startTime) / elem.animation.duration); //projecting current time to the [0;1] interval of the animation parameter
        else
            t = 1.0;

        t = animationEase(t);

        for (var i = 0; i < args.length; i++) {
            if (typeof elem[args[i].property] !== 'undefined')
                elem[elem.animation.args[i].property] = elem.animation.args[i].startValue +
                    t * (elem.animation.args[i].targetValue - elem.animation.args[i].startValue);
        }

        if (t == 1.0) {
            elem.animation.isAnimating = false;
            elem.animation.args = [];
            delete animatingElements[elem.id]; // remove element from hashmap

            if (elem.fadeIn == false)
                elem.fadeIn = true;

            // animate newly added content of this element
            for (var i = 0; i < elem.children.length; i++)
                if (typeof elem.children[i].animation === 'undefined')
                    animateElement(elem.children[i]);

            return;
        }

        // require new frame with respect to target fps rate if animation is not over 
        setTimeout(function () {
            elem.vc.requestInvalidate();
        }, 1000.0 / targetFps);
    }
}

// utiltity function for debugging
function numberWithCommas(n) {
    var parts = n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

// src = metadata tree (responsedump.txt + isBuffered)
// dest = scenegraph tree (tree of CanvasTimelines) 
// returns void. 
// mutates scenegraph tree (dest) by appending missing data from metadata tree (src).

// dest timelines can be in 1 of 3 states
// 1. No Metadata.  (isBuffered == false)
// 2. All Metadata. (isBuffered == false)
// 3. All Content.  (isBuffered == true)
function merge(src, dest) {
    if ("t" + src.UniqueID === dest.id) {
        var srcChildTimelines = src.ChildTimelines;
        var destChildTimelines = [];
        for (var i = 0; i < dest.children.length; i++)
            if (dest.children[i].type && dest.children[i].type === "timeline")
                destChildTimelines.push(dest.children[i]);


        if (srcChildTimelines.length === destChildTimelines.length) { // dest contains all src children
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
            dest.delta = 0;
            for (var i = 0; i < srcChildTimelines.length; i++)
                merge(srcChildTimelines[i], destChildTimelines[i]);

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
                dest.titleObject.newY += dest.delta;
                dest.titleObject.newBaseline += dest.delta;

                // assert: child content cannot exceed parent
                if (bottom > dest.titleObject.newY) {
                    var msg = bottomElementName + " EXCEEDS " + dest.title + ".\n" + "bottom: " + numberWithCommas(bottom) + "\n" + "   top: " + numberWithCommas(dest.titleObject.newY) + "\n";
                    console.log(msg);
                }

                // assert: child content doesnot overlap
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

                animateElement(dest);
            }
        } else if (srcChildTimelines.length > 0 && destChildTimelines.length === 0) { // dest does not contain any src children
            var t = generateLayout(src, dest);
            var margin = Math.min(t.width, t.newHeight) * timelineHeaderMargin;
            dest.delta = Math.max(0, t.newHeight - dest.newHeight); // timelines can only grow, never shrink

            // replace dest.children (timelines, infodots, titleObject) with matching t.children
            dest.children.splice(0);
            for (var i = 0; i < t.children.length; i++)
                dest.children.push(t.children[i]);

            // dest now contains all src children
            for (var i = 0; i < dest.children.length; i++)
                convertRelativeToAbsoluteCoords(dest.children[i], dest.newY);
            
            animateElement(dest);
        } else {
            dest.delta = 0;
        }
    } else {
        throw "error: Cannot merge timelines. Src and dest node ids differ.";
    }
}

function Merge(src, dest) {
    if (src && dest) {
        if (dest.id === "__root__") {
            src.AspectRatio = 10;
            var t = generateLayout(src, dest);
            convertRelativeToAbsoluteCoords(t, 0);
            dest.children.push(t);
            animateElement(dest);
            vc.virtualCanvas("requestInvalidate");
        } else {
            merge(src, dest);
            dest.newHeight += dest.delta;
            animateElement(dest);
            vc.virtualCanvas("requestInvalidate");
        }
    }
}




//loading the data from the service
function loadData() {
    timings.wcfRequestStarted = new Date();

    var regimesUrl = serverUrlBase
                + "left=" + -400
                + "&right=" + 0
                + "&min_width=" + 13700000000
                + "&lca_id=" + 161;
    console.log(regimesUrl);

    $.ajax({ // get basic skeleton (regime timelines)
        cache: false,
        type: "GET",
        async: true,
        dataType: "json",
        url: regimesUrl,
        success: function (result) {
            ProcessContent(result);
            vc.virtualCanvas("updateViewport");
        },
        error: function (xhr) {
            timings.RequestCompleted = new Date();
            alert("Error connecting to service:\n" + regimesUrl);
        }
    });

    /*
    var toursUrl;
    switch (czDataSource) {
        case 'db': toursUrl = "Chronozoom.svc/getTours";
            break;
        case 'relay': toursUrl = "ChronozoomRelay";
            break;
        case 'dump': toursUrl = "Content/ResponseDumps/toursDump.txt";
            break;
    }

    $.ajax({ //tours fetching
        cache: false,
        type: "GET",
        async: true,
        dataType: "json",
        url: toursUrl,
        success: function (result) {
            parseTours(result);
            initializeToursContent();

            // check at shared tour
            if (tourNotParsed == true) {
                loadTourFromURL();
                tourNotParsed = false;
            }
        },
        error: function (xhr) {
            $("tours_index").attr("onmouseup", function () {
                alert("The tours failed to download. Please refresh the page later and try to activate tours again.");
            });
            initializeToursContent();
        }
    });
    */
}

function ProcessContent(content) {
    timings.wcfRequestCompleted = new Date();

    var root = vc.virtualCanvas("getLayerContent");
    root.beginEdit();
    Merge(content, root);
    root.endEdit(true);

    timings.layoutCompleted = new Date();
    if (startHash) { // restoring the window's hash as it was on the page loading
        visReg = navStringToVisible(startHash.substring(1), vc);
    }

    InitializeRegimes(content);
    if (!visReg && cosmosVisible) {
        window.location.hash = cosmosVisible;
        visReg = navStringToVisible(cosmosVisible, vc);
    }
    if (visReg) {
        controller.moveToVisible(visReg, true);
        updateAxis(vc, ax);
        var vp = vc.virtualCanvas("getViewport");
        updateNavigator(vp);

        if (startHash && window.location.hash !== startHash) {
            hashChangeFromOutside = false;
            window.location.hash = startHash; // synchronizing
        }
    }
    timings.canvasInited = new Date();
}