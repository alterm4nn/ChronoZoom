var CZ;
(function (CZ) {
    (function (Authoring) {
        var _vcwidget;
        var _dragStart = {
        };
        var _dragPrev = {
        };
        var _dragCur = {
        };
        var _hovered = {
        };
        var _rectPrev = {
            type: "rectangle"
        };
        var _rectCur = {
            type: "rectangle"
        };
        var _circlePrev = {
            type: "circle"
        };
        var _circleCur = {
            type: "circle"
        };
        Authoring.selectedTimeline = {
        };
        Authoring.selectedExhibit = {
        };
        Authoring.selectedContentItem = {
        };
        Authoring.isActive = false;
        Authoring.isEnabled = false;
        Authoring.isDragging = false;
        Authoring.mode = null;
        Authoring.contentItemMode = null;
        Authoring.showCreateTimelineForm = null;
        Authoring.showEditTimelineForm = null;
        Authoring.showCreateExhibitForm = null;
        Authoring.showEditExhibitForm = null;
        Authoring.showEditContentItemForm = null;
        function isIntersecting(te, obj) {
            switch(obj.type) {
                case "timeline":
                case "infodot":
                    return (te.x + te.width > obj.x && te.x < obj.x + obj.width && te.y + te.height > obj.y && te.y < obj.y + obj.height);
                default:
                    return false;
            }
        }
        function isIncluded(tp, obj) {
            switch(obj.type) {
                case "timeline":
                case "rectangle":
                case "infodot":
                case "circle":
                    return (tp.x <= obj.x && tp.y <= obj.y && tp.x + tp.width >= obj.x + obj.width && tp.y + tp.height >= obj.y + obj.height);
                default:
                    return true;
            }
        }
        function checkTimelineIntersections(tp, tc, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;
            if(!isIncluded(tp, tc) && tp.id !== "__root__") {
                return false;
            }
            for(i = 0 , len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === Authoring.selectedTimeline) : (tp.children[i] === tc);
                if(!selfIntersection && isIntersecting(tc, tp.children[i])) {
                    return false;
                }
            }
            if(editmode && Authoring.selectedTimeline.children && Authoring.selectedTimeline.children.length > 0) {
                for(i = 0 , len = Authoring.selectedTimeline.children.length; i < len; ++i) {
                    if(!isIncluded(tc, Authoring.selectedTimeline.children[i])) {
                        return false;
                    }
                }
            }
            return true;
        }
        function checkExhibitIntersections(tp, ec, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;
            if(!isIncluded(tp, ec)) {
                return false;
            }
            for(i = 0 , len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === Authoring.selectedExhibit) : (tp.children[i] === ec);
                if(!selfIntersection && isIntersecting(ec, tp.children[i])) {
                    return false;
                }
            }
            return true;
        }
        function updateNewRectangle() {
            _rectCur.x = Math.min(_dragStart.x, _dragCur.x);
            _rectCur.y = Math.min(_dragStart.y, _dragCur.y);
            _rectCur.width = Math.abs(_dragStart.x - _dragCur.x);
            _rectCur.height = Math.abs(_dragStart.y - _dragCur.y);
            if(checkTimelineIntersections(_hovered, _rectCur, false)) {
                var settings = $.extend({
                }, _hovered.settings);
                settings.strokeStyle = "red";
                $.extend(_rectPrev, _rectCur);
                CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                CZ.VCContent.addRectangle(_hovered, _hovered.layerid, "newTimelineRectangle", _rectCur.x, _rectCur.y, _rectCur.width, _rectCur.height, settings);
            } else {
                $.extend(_rectCur, _rectPrev);
            }
        }
        function updateNewCircle() {
            _circleCur.r = (_hovered.width > _hovered.height) ? _hovered.height / 27.7 : _hovered.width / 10.0;
            _circleCur.x = _dragCur.x - _circleCur.r;
            _circleCur.y = _dragCur.y - _circleCur.r;
            _circleCur.width = _circleCur.height = 2 * _circleCur.r;
            if(checkExhibitIntersections(_hovered, _circleCur, false)) {
                $.extend(_circlePrev, _circleCur);
                CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
                CZ.VCContent.addCircle(_hovered, "layerInfodots", "newExhibitCircle", _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, {
                    strokeStyle: "red"
                }, false);
            } else {
                $.extend(_circleCur, _circlePrev);
            }
        }
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
            CZ.VCContent.removeChild(parent, id);
            return CZ.VCContent.addInfodot(parent, "layerInfodots", id, time, vyc, radv, cis, descr);
        }
        Authoring.renewExhibit = renewExhibit;
        function createNewTimeline() {
            CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
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
        function createNewExhibit() {
            CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
            return CZ.VCContent.addInfodot(_hovered, "layerInfodots", undefined, _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, [], {
                title: "Exhibit Title",
                date: _circleCur.x + _circleCur.r,
                guid: undefined
            });
        }
        function updateTimelineTitle(t) {
            var headerSize = CZ.Settings.timelineHeaderSize * t.height;
            var marginLeft = CZ.Settings.timelineHeaderMargin * t.height;
            var marginTop = (1 - CZ.Settings.timelineHeaderMargin) * t.height - headerSize;
            var baseline = t.y + marginTop + headerSize / 2.0;
            CZ.VCContent.removeChild(t, t.id + "__header__");
            if(CZ.Authoring.isEnabled && typeof t.editButton !== "undefined") {
                t.editButton.x = t.x + t.width - 1.15 * t.titleObject.height;
                t.editButton.y = t.titleObject.y;
                t.editButton.width = t.titleObject.height;
                t.editButton.height = t.titleObject.height;
            }
            t.titleObject = CZ.VCContent.addText(t, t.layerid, t.id + "__header__", t.x + marginLeft, t.y + marginTop, baseline, headerSize, t.title, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: "middle",
                opacity: 1
            });
        }
        Authoring.modeMouseHandlers = {
            createTimeline: {
                mousemove: function () {
                    if(CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },
                mouseup: function () {
                    if(_dragCur.x === _dragStart.x && _dragCur.y === _dragStart.y) {
                        return;
                    }
                    if(_hovered.type === "timeline") {
                        updateNewRectangle();
                        Authoring.selectedTimeline = createNewTimeline();
                        Authoring.showCreateTimelineForm(Authoring.selectedTimeline);
                    }
                }
            },
            editTimeline: {
                mouseup: function () {
                    Authoring.showEditTimelineForm(Authoring.selectedTimeline);
                }
            },
            createExhibit: {
                mousemove: function () {
                    if(CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewCircle();
                    }
                },
                mouseup: function () {
                    if(_hovered.type === "timeline") {
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
        function initialize(vc, formHandlers) {
            _vcwidget = vc.data("ui-virtualCanvas");
            _vcwidget.element.on("mousedown", function (event) {
                if(CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    CZ.Authoring.isDragging = true;
                    _dragStart = posv;
                    _dragPrev = {
                    };
                    _dragCur = posv;
                    _hovered = _vcwidget.hovered || {
                    };
                }
            });
            _vcwidget.element.on("mouseup", function (event) {
                if(CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    CZ.Authoring.isDragging = false;
                    _dragPrev = _dragCur;
                    _dragCur = posv;
                    CZ.Common.controller.stopAnimation();
                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
                }
            });
            _vcwidget.element.on("mousemove", function (event) {
                if(CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    _dragPrev = _dragCur;
                    _dragCur = posv;
                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mousemove"]();
                }
            });
            Authoring.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {
            };
            Authoring.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () {
            };
            Authoring.showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () {
            };
            Authoring.showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () {
            };
            Authoring.showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () {
            };
        }
        Authoring.initialize = initialize;
        function updateTimeline(t, prop) {
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: Number(CZ.Dates.getCoordinateFromDecimalYear(prop.end) - prop.start),
                height: t.height,
                type: "rectangle"
            };
            if(checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.endDate = prop.end;
            }
            t.title = prop.title;
            updateTimelineTitle(t);
            return CZ.Service.putTimeline(t).then(function (success) {
                t.id = "t" + success;
                t.guid = success;
                t.titleObject.id = "t" + success + "__header__";
            }, function (error) {
            });
        }
        Authoring.updateTimeline = updateTimeline;
        function removeTimeline(t) {
            CZ.Service.deleteTimeline(t);
            CZ.VCContent.removeChild(t.parent, t.id);
        }
        Authoring.removeTimeline = removeTimeline;
        function updateExhibit(e, args) {
            var deferred = $.Deferred();
            if(e && e.contentItems && args) {
                var clone = $.extend({
                }, e, {
                    children: null
                });
                clone = $.extend(true, {
                }, clone);
                delete clone.children;
                delete clone.contentItems;
                $.extend(true, clone, args);
                var oldContentItems = $.extend(true, [], e.contentItems);
                CZ.Service.putExhibit(clone).then(function (response) {
                    var old_id = e.id;
                    e.id = clone.id = "e" + response.ExhibitId;
                    var new_id = e.id;
                    e.guid = clone.guid = response.ExhibitId;
                    for(var i = 0; i < e.contentItems.length; i++) {
                        e.contentItems[i].ParentExhibitId = e.guid;
                    }
                    for(var i = 0; i < clone.contentItems.length; i++) {
                        clone.contentItems[i].ParentExhibitId = clone.guid;
                    }
                    CZ.Service.putExhibitContent(clone, oldContentItems).then(function (response) {
                        $.extend(e, clone);
                        e.id = old_id;
                        e = renewExhibit(e);
                        e.id = new_id;
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                        deferred.resolve();
                    }, function (error) {
                        console.log("Error connecting to service: update exhibit (put exhibit content).\n" + error.responseText);
                        deferred.reject();
                    });
                }, function (error) {
                    console.log("Error connecting to service: update exhibit.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        }
        Authoring.updateExhibit = updateExhibit;
        function removeExhibit(e) {
            var deferred = $.Deferred();
            if(e && e.id && e.parent) {
                var clone = $.extend({
                }, e, {
                    children: null
                });
                clone = $.extend(true, {
                }, clone);
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
        function updateContentItem(e, c, args) {
            var deferred = $.Deferred();
            if(e && e.contentItems && e.contentItems.length && c && args) {
                var clone = $.extend(true, {
                }, c, args);
                CZ.Service.putContentItem(clone).then(function (response) {
                    $.extend(c, clone);
                    c.id = c.guid = response;
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: update content item.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        }
        Authoring.updateContentItem = updateContentItem;
        function removeContentItem(e, c) {
            var deferred = $.Deferred();
            if(e && e.contentItems && e.contentItems.length && c && c.index) {
                var clone = $.extend(true, {
                }, c);
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
        function ValidateTimelineData(start, end, title) {
            var isValid = CZ.Authoring.ValidateNumber(start) && CZ.Authoring.ValidateNumber(end);
            isValid = isValid && CZ.Authoring.IsNotEmpty(title) && CZ.Authoring.IsNotEmpty(start) && CZ.Authoring.IsNotEmpty(end);
            console.log(start, end);
            isValid = isValid && CZ.Authoring.isNonegHeight(start, end);
            return isValid;
        }
        Authoring.ValidateTimelineData = ValidateTimelineData;
        function ValidateExhibitData(date, title, contentItems) {
            var isValid = CZ.Authoring.ValidateNumber(date);
            isValid = isValid && CZ.Authoring.IsNotEmpty(title) && CZ.Authoring.IsNotEmpty(date);
            isValid = isValid && CZ.Authoring.ValidateContentItems(contentItems);
            return isValid;
        }
        Authoring.ValidateExhibitData = ValidateExhibitData;
        function ValidateNumber(number) {
            return !isNaN(Number(number) && parseFloat(number));
        }
        Authoring.ValidateNumber = ValidateNumber;
        function IsNotEmpty(obj) {
            return (obj !== '' && obj !== null);
        }
        Authoring.IsNotEmpty = IsNotEmpty;
        function isNonegHeight(start, end) {
            return (start < end);
        }
        Authoring.isNonegHeight = isNonegHeight;
        function ValidateContentItems(contentItems) {
            var isValid = true;
            if(contentItems.length == 0) {
                return false;
            }
            var i = 0;
            while(contentItems[i] != null) {
                var ci = contentItems[i];
                isValid = isValid && CZ.Authoring.IsNotEmpty(ci.title) && CZ.Authoring.IsNotEmpty(ci.uri) && CZ.Authoring.IsNotEmpty(ci.mediaType);
                if(ci.mediaType.toLowerCase() === "image") {
                    var imageReg = /\.(jpg|jpeg|png)$/i;
                    if(!imageReg.test(ci.uri)) {
                        alert("Sorry, only JPG/PNG images are supported");
                        isValid = false;
                    }
                } else if(ci.mediaType.toLowerCase() === "video") {
                    var youtube = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+))([^\/&]{10,12})/;
                    var vimeo = /vimeo\.com\/([0-9]+)/i;
                    var vimeoEmbed = /player.vimeo.com\/video\/([0-9]+)/i;
                    if(youtube.test(ci.uri)) {
                        var youtubeVideoId = ci.uri.match(youtube)[1];
                        ci.uri = "http://www.youtube.com/embed/" + youtubeVideoId;
                    } else if(vimeo.test(ci.uri)) {
                        var vimeoVideoId = ci.uri.match(vimeo);
                        ci.uri = "http://player.vimeo.com/video/" + vimeoVideoId[1];
                    } else if(vimeoEmbed.test(ci.uri)) {
                    } else {
                        alert("Sorry, only YouTube or Vimeo videos are supported");
                        isValid = false;
                    }
                } else if(ci.mediaType.toLowerCase() === "pdf") {
                    var pdf = /\.(pdf)$/i;
                    if(pdf.test(ci.uri)) {
                        ci.uri = "http://docs.google.com/viewer?url=" + encodeURI(ci.uri) + "&embedded=true";
                    } else {
                        alert("Sorry, only PDF extension is supported");
                        isValid = false;
                    }
                }
                if(!isValid) {
                    return false;
                }
                i++;
            }
            return isValid;
        }
        Authoring.ValidateContentItems = ValidateContentItems;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
