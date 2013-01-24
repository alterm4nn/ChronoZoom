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

    timeline.Exhibits.forEach(function (exhibit) {
        GenerateProperty(exhibit, "TimeUnit", "Year", "Month", "Day", "x");
    });

    timeline.ChildTimelines.forEach(function (childTimeline) {
        childTimeline.ParentTimeline = timeline;
        Prepare(childTimeline);
    });

    GenerateAspect(timeline);
    if (timeline.Height)
        timeline.Height /= 100;
    else if (!timeline.AspectRatio && !timeline.Height)
        timeline.Height = 0.4;
}

function GenerateAspect(timeline) {
    if (timeline.ID == cosmosTimelineID) {
        timeline.AspectRatio = 10; //64.0 / 33.0;
    } 
    
//    else if (timeline.ID == earthTimelineID) {
//        timeline.AspectRatio = 1.0;
//    } else if (timeline.ID == lifeTimelineID) {
//        timeline.AspectRatio = 47.0 / 22.0;
//    } else if (timeline.ID == prehistoryTimelineID) {
//        timeline.AspectRatio = 37.0 / 11.0;
//    } else if (timeline.ID == humanityTimelineID) {
//        timeline.AspectRatio = 55.0 / 4.0;
//    }
}

function LayoutTimeline(timeline, parentWidth, measureContext) {
    var headerPercent = timelineHeaderSize + 2 * timelineHeaderMargin;
    var timelineWidth = timeline.right - timeline.left;
    timeline.width = timelineWidth;

    //If child timeline has fixed aspect ratio, calculate its height according to it
    if (timeline.AspectRatio && !timeline.height) {
        timeline.height = timelineWidth / timeline.AspectRatio;
    }

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

    if (!timeline.height) {
        //Searching for timeline with the biggest ratio between its height percentage and real height
        var scaleCoef = undefined;
        timeline.ChildTimelines.forEach(function (tl) {
            if (tl.Height && !tl.AspectRatio) {
                var localScale = tl.height / tl.Height;
                if (!scaleCoef || scaleCoef < localScale)
                    scaleCoef = localScale;
            }
        });
        //Scaling timelines to make their percentages corresponding to each other
        if (scaleCoef) {
            timeline.ChildTimelines.forEach(function (tl) {
                if (tl.Height && !tl.AspectRatio) {
                    var scaleParam = scaleCoef * tl.Height / tl.height;
                    if (scaleParam > 1) {
                        tl.realY *= scaleParam;
                        Scale(tl, scaleParam, measureContext);
                    }
                }
            });
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

        if (timeline.Exhibits.length > 0 && (tlRes.max - tlRes.min) < timeline.height) {
            while ((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && exhibitSize > timelineWidth / 20.0) {
                exhibitSize /= 1.5;
                res = LayoutContent(timeline, exhibitSize);
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

    timeline.Exhibits.forEach(function (infodot) {
        infodot.realY -= res.min;
    });

    timeline.ChildTimelines.forEach(function (tl) {
        tl.realY -= res.min;
    });
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

    timeline.ChildTimelines.forEach(function (tl) {
        if (tl.Sequence)
            sequencedContent.push(tl);
        else
            unsequencedContent.push(tl);
    });

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

    timeline.ChildTimelines.forEach(function (tl) {
        tl.realY *= scale;
        if (!tl.AspectRatio)
            Scale(tl, scale, mctx);
    });

    timeline.Exhibits.forEach(function (eb) {
        eb.realY *= scale;
    });
}

function Arrange(timeline) {
    timeline.y = timeline.realY + timeline.heightEps;

    timeline.Exhibits.forEach(function (infodot) {
        infodot.y = infodot.realY + infodot.size / 2.0 + timeline.y;
    });

    timeline.ChildTimelines.forEach(function (tl) {
        tl.realY += timeline.y;
        Arrange(tl);
    });
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
        regime: timeline.Regime
    });

    //Creating Infodots
    timeline.Exhibits.forEach(function (childInfodot) {
        var date; // building a date to be shown in a title of the content item to the left of the title text.

        var contentItems = new Array();
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

        date = buildDate(childInfodot);
        var infodot1 = addInfodot(t1, "layerInfodots", 'e' + childInfodot.UniqueID,
                (childInfodot.left + childInfodot.right) / 2.0, childInfodot.y, 0.8 * childInfodot.size / 2.0, contentItems,
                { title: childInfodot.Title, date: date, guid: childInfodot.ID });
    });

    //Filling child timelines
    timeline.ChildTimelines.forEach(function (childTimeLine) {
        Convert(t1, childTimeLine);
    });

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

function GetParentLayer(timeline, parentID) {
    if (timeline.ID == parentID)
        return 0;

    if (!timeline.ParentTimeline)
        return -1;

    var index = 0;
    var parent = timeline;
    while (parent.ParentTimeline && parent.ID != parentID) {
        parent = parent.ParentTimeline;
        index++;
    }

    if (parent.ID != parentID)
        return -1;
    else
        return index;
}

function SelectColor(index, baseColor, nestedColor1, nestedColor2) {
    if (index == -1)
        return "rgba(255, 255, 255, 0.5)";
    else if (index == 0)
        return baseColor;
    else if (index % 2 != 0)
        return nestedColor1;
    else
        return nestedColor2;
}

function GetTimelineColor(timeline) {
    if (timeline.Regime == "Cosmos") {
        return SelectColor(GetParentLayer(timeline, cosmosTimelineID), "rgba(152, 108, 157, 1.0)", "rgba(94, 78, 129, 1.0)", "rgba(149, 136, 193, 1.0)");
    }
    else if (timeline.Regime == "Earth") {
        return SelectColor(GetParentLayer(timeline, earthTimelineID), "rgba(81, 127, 149, 1.0)", "rgba(11, 110, 131, 1.0)", "rgba(117, 163, 174, 1.0)");
    }
    else if (timeline.Regime == "Life") {
        return SelectColor(GetParentLayer(timeline, lifeTimelineID), "rgba(73, 150, 73, 1.0)", "rgba(13, 106, 49, 1.0)", "rgba(139, 167, 97, 1.0)");
    }
    else if (timeline.Regime == "Pre-history") {
        return SelectColor(GetParentLayer(timeline, prehistoryTimelineID), "rgba(237, 145, 50, 1.0)", "rgba(193, 90, 47, 1.0)", "rgba(223, 161, 68, 1.0)");
    }
    else if (timeline.Regime == "Humanity") {
        return SelectColor(GetParentLayer(timeline, humanityTimelineID), "rgba(212, 92, 70, 1.0)", "rgba(140, 72, 69, 1.0)", "rgba(207, 124, 111, 1.0)");
    }
    else return "rgba(255, 255, 255, 0.5)";
}

function Load(vcph, timelines) {
    if (timelines.length > 0) {
        for (i = timelines.length - 1; i >= 0; i--) {
            Prepare(timelines[i]);
        }

        timelines.sort(function (l, r) {
            return l.left - r.left;
        });

        for (i = 0; i < timelines.length - 1; i++) {
            timelines[i].ChildTimelines.push(timelines[i + 1]);
        }

        var measureContext = document.createElement("canvas").getContext('2d');
        //Measure child content for each timiline in tree
        LayoutTimeline(timelines[0], 0, measureContext);
        //Calculating final placement of the data
        Arrange(timelines[0]);
        //Load timline to Virtual Canvas
        LoadTimeline(vcph, timelines[0]);
    }
}

var FindChildTimeline = function (timeline, id, recursive) {
    var result = undefined;

    if (timeline) {
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

function LoadTimeline(vcph, rootTimeline) {
    var root = vcph.virtualCanvas("getLayerContent");
    root.beginEdit();
    Convert(root, rootTimeline);
    root.endEdit(true);
}

function SetOutput(vcph, timeline) {
    vcph.virtualCanvas("setVisible", GetVisibleFromTimeline(timeline, vcph));
}
