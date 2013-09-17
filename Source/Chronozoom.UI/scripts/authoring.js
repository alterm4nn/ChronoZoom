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
        Authoring.showCreateRootTimelineForm = null;
        Authoring.showEditTimelineForm = null;
        Authoring.showCreateExhibitForm = null;
        Authoring.showEditExhibitForm = null;
        Authoring.showEditContentItemForm = null;
        Authoring.showEditTourForm = null;
        Authoring.showMessageWindow = null;
        Authoring.hideMessageWindow = null;
        Authoring.callback = null;
        Authoring.timer;
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
        function checkTimelineIntersections(tp, tc, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;
            if(!tp || tp.guid === null) {
                return true;
            }
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
            return true;
        }
        Authoring.checkExhibitIntersections = checkExhibitIntersections;
        function updateNewRectangle() {
            _rectCur.x = Math.min(_dragStart.x, _dragCur.x);
            _rectCur.y = Math.min(_dragStart.y, _dragCur.y);
            _rectCur.width = Math.abs(_dragStart.x - _dragCur.x);
            _rectCur.height = Math.abs(_dragStart.y - _dragCur.y);
            if(checkTimelineIntersections(_hovered, _rectCur, false)) {
                var settings = $.extend({
                }, _hovered.settings);
                settings.strokeStyle = "yellow";
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
                    strokeStyle: "yellow"
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
        function createNewExhibit() {
            CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
            return CZ.VCContent.addInfodot(_hovered, "layerInfodots", undefined, _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, [], {
                title: "Exhibit Title",
                date: _circleCur.x + _circleCur.r,
                guid: undefined
            });
        }
        function updateTimelineTitle(t) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            t.left = t.x;
            t.right = t.x + t.width;
            var titleBorderBox = CZ.Layout.GenerateTitleObject(t.height, t, ctx);
            CZ.VCContent.removeChild(t, t.id + "__header__");
            var baseline = t.y + titleBorderBox.marginTop + titleBorderBox.height / 2.0;
            t.titleObject = CZ.VCContent.addText(t, t.layerid, t.id + "__header__", t.x + titleBorderBox.marginLeft, t.y + titleBorderBox.marginTop, baseline, titleBorderBox.height, t.title, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle',
                opacity: 1
            }, titleBorderBox.width);
            if(CZ.Authoring.isEnabled && typeof t.editButton !== "undefined") {
                t.editButton.x = t.x + t.width - 1.15 * t.titleObject.height;
                t.editButton.y = t.titleObject.y;
                t.editButton.width = t.titleObject.height;
                t.editButton.height = t.titleObject.height;
            }
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
                        CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                        Authoring.selectedTimeline = createNewTimeline();
                        Authoring.showCreateTimelineForm(Authoring.selectedTimeline);
                    }
                }
            },
            editTour: {
            },
            "editTour-selectTarget": {
                mouseup: function () {
                    if(Authoring.callback != null && _hovered != undefined && _hovered != null && typeof _hovered.type != "undefined") {
                        Authoring.callback(_hovered);
                    }
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
        function updateTimeline(t, prop) {
            var deffered = new jQuery.Deferred();
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: prop.end === 9999 ? Number(CZ.Dates.getCoordinateFromDecimalYear(prop.end) - prop.start) : Number(prop.end - prop.start),
                height: t.height,
                type: "rectangle"
            };
            if(checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.endDate = prop.end;
                if(t.children.length < 3) {
                    t.height = Math.min.apply(Math, [
                        t.parent.height * CZ.Layout.timelineHeightRate, 
                        t.width * CZ.Settings.timelineMinAspect, 
                        t.height
                    ]);
                }
                t.title = prop.title;
                updateTimelineTitle(t);
                CZ.Service.putTimeline(t).then(function (success) {
                    t.id = "t" + success;
                    t.guid = success;
                    t.titleObject.id = "t" + success + "__header__";
                    if(!t.parent.guid) {
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
        function removeTimeline(t) {
            var deferred = $.Deferred();
            CZ.Service.deleteTimeline(t).then(function (updateCanvas) {
                CZ.Common.vc.virtualCanvas("requestInvalidate");
                deferred.resolve();
            });
            CZ.VCContent.removeChild(t.parent, t.id);
        }
        Authoring.removeTimeline = removeTimeline;
        function updateExhibit(oldExhibit, args) {
            var deferred = $.Deferred();
            if(oldExhibit && oldExhibit.contentItems && args) {
                var newExhibit = $.extend({
                }, oldExhibit, {
                    children: null
                });
                newExhibit = $.extend(true, {
                }, newExhibit);
                delete newExhibit.children;
                delete newExhibit.contentItems;
                $.extend(true, newExhibit, args);
                CZ.Service.putExhibit(newExhibit).then(function (response) {
                    newExhibit.guid = response.ExhibitId;
                    for(var i = 0; i < newExhibit.contentItems.length; i++) {
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
                    deferred.reject(error);
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
        function validateTimelineData(start, end, title) {
            var isValid = (start !== false) && (end !== false);
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.isIntervalPositive(start, end);
            return isValid;
        }
        Authoring.validateTimelineData = validateTimelineData;
        function validateExhibitData(date, title, contentItems) {
            var isValid = date !== false;
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.validateContentItems(contentItems, null);
            return isValid;
        }
        Authoring.validateExhibitData = validateExhibitData;
        function validateNumber(number) {
            return !isNaN(Number(number) && parseFloat(number)) && isNotEmpty(number) && (number !== false);
        }
        Authoring.validateNumber = validateNumber;
        function isNotEmpty(obj) {
            return (obj !== '' && obj !== null);
        }
        Authoring.isNotEmpty = isNotEmpty;
        function isIntervalPositive(start, end) {
            return (parseFloat(start) + 1 / 366 <= parseFloat(end));
        }
        Authoring.isIntervalPositive = isIntervalPositive;
        function validateContentItems(contentItems, mediaInput) {
            var isValid = true;
            if(contentItems.length == 0) {
                return false;
            }
            var i = 0;
            while(contentItems[i] != null) {
                var ci = contentItems[i];
                isValid = isValid && CZ.Authoring.isNotEmpty(ci.title) && CZ.Authoring.isNotEmpty(ci.uri) && CZ.Authoring.isNotEmpty(ci.mediaType);
                var mime = CZ.Service.getMimeTypeByUrl(ci.uri);
                console.log("mime:" + mime);
                if(ci.mediaType.toLowerCase() === "image") {
                    var imageReg = /\.(jpg|jpeg|png|gif)$/i;
                    if(!imageReg.test(ci.uri)) {
                        if(mime != "image/jpg" && mime != "image/jpeg" && mime != "image/gif" && mime != "image/png") {
                            if(mediaInput) {
                                mediaInput.showError("Sorry, only JPG/PNG/GIF images are supported.");
                            }
                            isValid = false;
                        }
                    }
                } else if(ci.mediaType.toLowerCase() === "video") {
                    var youtube = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|[\S\?\&]+&v=|\/user\/\S+))([^\/&#]{10,12})/;
                    var vimeo = /vimeo\.com\/([0-9]+)/i;
                    var vimeoEmbed = /player.vimeo.com\/video\/([0-9]+)/i;
                    if(youtube.test(ci.uri)) {
                        var youtubeVideoId = ci.uri.match(youtube)[1];
                        ci.uri = "http://www.youtube.com/embed/" + youtubeVideoId;
                    } else if(vimeo.test(ci.uri)) {
                        var vimeoVideoId = ci.uri.match(vimeo)[1];
                        ci.uri = "http://player.vimeo.com/video/" + vimeoVideoId;
                    } else if(vimeoEmbed.test(ci.uri)) {
                    } else {
                        if(mediaInput) {
                            mediaInput.showError("Sorry, only YouTube or Vimeo videos are supported.");
                        }
                        isValid = false;
                    }
                } else if(ci.mediaType.toLowerCase() === "pdf") {
                    var pdf = /\.(pdf)$|\.(pdf)\?/i;
                    if(!pdf.test(ci.uri)) {
                        if(mime != "application/pdf") {
                            if(mediaInput) {
                                mediaInput.showError("Sorry, only PDF extension is supported.");
                            }
                            isValid = false;
                        }
                    }
                } else if(ci.mediaType.toLowerCase() === "skydrive-document") {
                    var skydrive = /skydrive\.live\.com\/embed/;
                    if(!skydrive.test(ci.uri)) {
                        alert("This is not a Skydrive embed link.");
                        isValid = false;
                    }
                } else if(ci.mediaType.toLowerCase() === "skydrive-image") {
                    var splited = ci.uri.split(' ');
                    var skydrive = /skydrive\.live\.com\/embed/;
                    var width = /[0-9]/;
                    var height = /[0-9]/;
                    if(!skydrive.test(splited[0]) || !width.test(splited[1]) || !height.test(splited[2])) {
                        if(mediaInput) {
                            mediaInput.showError("This is not a Skydrive embed link.");
                        }
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
        Authoring.validateContentItems = validateContentItems;
        function showSessionForm() {
            CZ.HomePageViewModel.sessionForm.show();
        }
        Authoring.showSessionForm = showSessionForm;
        function resetSessionTimer() {
            if(CZ.Authoring.timer != null) {
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
