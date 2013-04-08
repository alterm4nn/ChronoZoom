var CZ = (function (CZ, $) {
    var Authoring = CZ.Authoring = CZ.Authoring || {
    };
    var that = Authoring;
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
    var _selectedTimeline = {
    };
    var _selectedExhibit = {
    };
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
                return (tp.x < obj.x && tp.y < obj.y && tp.x + tp.width > obj.x + obj.width && tp.y + tp.height > obj.y + obj.height);
            default:
                return true;
        }
    }
    function checkTimelineIntersections(tp, tc, editmode) {
        var i = 0;
        var len = 0;
        var selfIntersection = false;
        if(!isIncluded(tp, tc)) {
            return false;
        }
        for(i = 0 , len = tp.children.length; i < len; ++i) {
            selfIntersection = editmode ? (tp.children[i] === _selectedTimeline) : (tp.children[i] === tc);
            if(!selfIntersection && isIntersecting(tc, tp.children[i])) {
                return false;
            }
        }
        if(editmode && _selectedTimeline.children && _selectedTimeline.children.length > 0) {
            for(i = 0 , len = _selectedTimeline.children.length; i < len; ++i) {
                if(!isIncluded(tc, _selectedTimeline.children[i])) {
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
            selfIntersection = editmode ? (tp.children[i] === _selectedExhibit) : (tp.children[i] === ec);
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
        if(checkTimelineIntersections(_hovered, _rectCur)) {
            var settings = $.extend({
            }, _hovered.settings);
            settings.strokeStyle = "red";
            $.extend(_rectPrev, _rectCur);
            removeChild(_hovered, "newTimelineRectangle");
            addRectangle(_hovered, _hovered.layerid, "newTimelineRectangle", _rectCur.x, _rectCur.y, _rectCur.width, _rectCur.height, settings);
        } else {
            $.extend(_rectCur, _rectPrev);
        }
    }
    function updateNewCircle() {
        _circleCur.r = (_hovered.width > _hovered.height) ? _hovered.height / 27.7 : _hovered.width / 10.0;
        _circleCur.x = _dragCur.x - _circleCur.r;
        _circleCur.y = _dragCur.y - _circleCur.r;
        _circleCur.width = _circleCur.height = 2 * _circleCur.r;
        if(checkExhibitIntersections(_hovered, _circleCur)) {
            $.extend(_circlePrev, _circleCur);
            removeChild(_hovered, "newExhibitCircle");
            addCircle(_hovered, "layerInfodots", "newExhibitCircle", _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, {
                strokeStyle: "red"
            });
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
        removeChild(parent, id);
        return addInfodot(parent, "layerInfodots", id, time, vyc, radv, cis, descr);
    }
    function createNewTimeline() {
        removeChild(_hovered, "newTimelineRectangle");
        return addTimeline(_hovered, _hovered.layerid, null, {
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
        removeChild(_hovered, "newExhibitCircle");
        return addInfodot(_hovered, "layerInfodots", null, _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, [
            {
                id: null,
                guid: null,
                title: "Content Item Title",
                description: "Content Item Description",
                uri: "",
                mediaType: "image",
                parent: _hovered.guid
            }
        ], {
            title: "Exhibit Title",
            date: _circleCur.x + _circleCur.r,
            guid: null
        });
    }
    function updateTimelineTitle(t) {
        var headerSize = timelineHeaderSize * t.height;
        var marginLeft = timelineHeaderMargin * t.height;
        var marginTop = (1 - timelineHeaderMargin) * t.height - headerSize;
        var baseline = t.y + marginTop + headerSize / 2.0;
        removeChild(t, t.id + "__header__");
        t.titleObject = addText(t, t.layerid, t.id + "__header__", t.x + marginLeft, t.y + marginTop, baseline, headerSize, t.title, {
            fontName: timelineHeaderFontName,
            fillStyle: timelineHeaderFontColor,
            textBaseline: "middle",
            opacity: 1
        });
    }
    $.extend(Authoring, {
        _isActive: false,
        _isDragging: false,
        mode: null,
        showCreateTimelineForm: null,
        showEditTimelineForm: null,
        showCreateExhibitForm: null,
        showEditExhibitForm: null,
        modeMouseHandlers: {
            createTimeline: {
                mousemove: function () {
                    if(that._isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },
                mouseup: function () {
                    if(_dragCur.x === _dragStart.x && _dragCur.y === _dragStart.y) {
                        return;
                    }
                    if(_hovered.type === "timeline") {
                        _selectedTimeline = createNewTimeline();
                        that.showCreateTimelineForm(_selectedTimeline);
                    }
                }
            },
            editTimeline: {
                mousemove: function () {
                    _hovered = _vcwidget.hovered || {
                    };
                    if(_hovered.type === "timeline") {
                        _hovered.settings.strokeStyle = "red";
                    }
                },
                mouseup: function () {
                    if(_hovered.type === "timeline") {
                        _selectedTimeline = _hovered;
                        that.showEditTimelineForm(_selectedTimeline);
                    } else if(_hovered.type === "infodot" || _hovered.type === "contentItem") {
                        _selectedTimeline = _hovered.parent;
                        that.showEditTimelineForm(_selectedTimeline);
                    }
                }
            },
            createExhibit: {
                mousemove: function () {
                    if(that._isDragging && _hovered.type === "timeline") {
                        updateNewCircle();
                    }
                },
                mouseup: function () {
                    if(_hovered.type === "timeline") {
                        updateNewCircle();
                        if(checkExhibitIntersections(_hovered, _circleCur)) {
                            _selectedExhibit = createNewExhibit();
                            that.showCreateExhibitForm(_selectedExhibit);
                        }
                    }
                }
            },
            editExhibit: {
                mousemove: function () {
                    _hovered = _vcwidget.hovered || {
                    };
                    if(_hovered.type === "infodot") {
                        _hovered.settings.strokeStyle = "red";
                    }
                },
                mouseup: function () {
                    if(_hovered.type === "infodot") {
                        _selectedExhibit = _hovered;
                        that.showEditExhibitForm(_selectedExhibit);
                    } else if(_hovered.type === "contentItem") {
                        _selectedExhibit = _hovered.parent.parent.parent;
                        that.showEditContentItemForm(_hovered, _selectedExhibit);
                    }
                }
            }
        },
        initialize: function (vc, formHandlers) {
            _vcwidget = vc.data("ui-virtualCanvas");
            _vcwidget.element.on("mousedown", function (event) {
                if(that._isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    that._isDragging = true;
                    _dragStart = posv;
                    _dragPrev = {
                    };
                    _dragCur = posv;
                    _hovered = _vcwidget.hovered || {
                    };
                }
            });
            _vcwidget.element.on("mouseup", function (event) {
                if(that._isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    that._isDragging = false;
                    _dragPrev = _dragCur;
                    _dragCur = posv;
                    controller.stopAnimation();
                    that.modeMouseHandlers[that.mode]["mouseup"]();
                }
            });
            _vcwidget.element.on("mousemove", function (event) {
                if(that._isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    _dragPrev = _dragCur;
                    _dragCur = posv;
                    that.modeMouseHandlers[that.mode]["mousemove"]();
                }
            });
            this.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {
            };
            this.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () {
            };
            this.showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () {
            };
            this.showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () {
            };
            this.showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () {
            };
        },
        updateTimeline: function (t, prop, form) {
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: Number(prop.end - prop.start),
                height: t.height,
                type: "rectangle"
            };
            if(checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
            }
            t.title = prop.title;
            updateTimelineTitle(t);
            CZ.Service.putTimeline(t).then(function (success) {
                t.id = "t" + success;
                t.guid = success;
                t.titleObject.id = "t" + success + "__header__";
                if(form) {
                    form.dialog("close");
                }
            }, function (error) {
                alert("Unable to save changes. Please try again later.");
                console.log(error);
            });
        },
        removeTimeline: function (t) {
            CZ.Service.deleteTimeline(t);
            removeChild(t.parent, t.id);
        },
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
            if(checkExhibitIntersections(e.parent, temp, true)) {
                e.x = temp.x;
                e.infodotDescription.date = temp.x + e.outerRad;
            }
            e.title = temp.title;
            e.infodotDescription.title = temp.title;
            e.contentItems = prop.contentItems;
            e = renewExhibit(e);
            CZ.Service.putExhibit(e).then(function (response) {
                var contentItems = e.contentItems;
                var len = contentItems.length;
                var i = 0;
                e.guid = response;
                for(i = 0; i < len; ++i) {
                    contentItems[i].parent = e.guid;
                }
                CZ.Service.putExhibitContent(e, oldContentItems).then(function () {
                    for(i = 0; i < len; ++i) {
                        contentItems[i].guid = arguments[i];
                    }
                }, function () {
                    console.log("Error connecting to service: update content item.\n");
                });
            }, function (error) {
                console.log("Error connecting to service: update exhibit.\n");
            });
        },
        removeExhibit: function (e) {
            CZ.Service.deleteExhibit(e);
            removeChild(e.parent, e.id);
        },
        updateContentItem: function (c, args) {
            var e = c.parent.parent.parent;
            for(var prop in args) {
                if(c.contentItem.hasOwnProperty(prop)) {
                    c.contentItem[prop] = args[prop];
                }
            }
            renewExhibit(e);
            CZ.Service.putContentItem(c).then(function (response) {
                c.guid = response;
            }, function (error) {
                console.log("Error connecting to service: update content item.\n" + error.responseText);
            });
        },
        removeContentItem: function (c) {
            var e = c.parent.parent.parent;
            CZ.Service.deleteContentItem(c);
            c.parent.parent.parent.contentItems.splice(c.contentItem.index, 1);
            delete c.contentItem;
            renewExhibit(e);
        },
        ValidateNumber: function (number) {
            return !isNaN(Number(number));
        },
        IsNotEmpty: function (obj) {
            return (obj !== '' && obj !== null);
        },
        ValidateContentItems: function (contentItems) {
            var isValid = true;
            if(contentItems == "[]") {
                return true;
            }
            var i = 0;
            while(contentItems[i] != null) {
                var CI = contentItems[i];
                isValid = isValid && CZ.Authoring.IsNotEmpty(CI.title) && CZ.Authoring.IsNotEmpty(CI.uri) && CZ.Authoring.IsNotEmpty(CI.mediaType);
                if(!isValid) {
                    return false;
                }
                i++;
            }
            return isValid;
        }
    });
    return CZ;
})(CZ || {
}, jQuery);
