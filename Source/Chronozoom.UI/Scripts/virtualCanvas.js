var ChronoZoom;
(function (ChronoZoom) {
    (function (VirtualCanvas) {
        function initialize() {
            ($).widget("ui.virtualCanvas", {
                _layersContent: undefined,
                _layers: [],
                _create: function () {
                    var self = this;
                    self.element.addClass("virtualCanvas");
                    var size = self._getClientSize();
                    this.lastEvent = null;
                    this.canvasWidth = null;
                    this.canvasHeight = null;
                    self.cursorPositionChangedEvent = new ($).Event("cursorPositionChanged");
                    self.breadCrumbsChengedEvent = $.Event("breadCrumbsChanged");
                    self.innerZoomConstraintChengedEvent = $.Event("innerZoomConstraintChenged");
                    self.currentlyHoveredInfodot = undefined;
                    self.breadCrumbs = [];
                    self.recentBreadCrumb = {
                        vcElement: {
                            title: "initObject"
                        }
                    };
                    self.cursorPosition = 0.0;
                    var layerDivs = self.element.children("div");
                    layerDivs.each(function (index) {
                        $(this).addClass("virtualCanvasLayerDiv").zIndex(index * 3);
                        var layerCanvasJq = $("<canvas></canvas>").appendTo($(this)).addClass("virtualCanvasLayerCanvas").zIndex(index * 3 + 1);
                        self._layers.push($(this));
                    });
                    this._layersContent = new ChronoZoom.VCContent.CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                    this.options.visible = new ChronoZoom.Viewport.VisibleRegion2d(0, 0, 1);
                    this.updateViewport();
                    self.element.bind('mousemove.' + this.widgetName, function (e) {
                        self.mouseMove(e);
                    });
                    self.element.bind('mousedown.' + this.widgetName, function (e) {
                        switch(e.which) {
                            case 1:
                                self._mouseDown(e);
                                break;
                        }
                    });
                    self.element.bind('mouseup.' + this.widgetName, function (e) {
                        switch(e.which) {
                            case 1:
                                self._mouseUp(e);
                        }
                    });
                    self.element.bind('mouseleave.' + this.widgetName, function (e) {
                        self._mouseLeave(e);
                    });
                },
                destroy: function () {
                    this._destroy();
                },
                _mouseDown: function (e) {
                    var origin = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                    this.lastClickPosition = {
                        x: origin.x,
                        y: origin.y
                    };
                    $("iframe").css("pointer-events", "none");
                    $('#iframe_layer').css("display", "block").css("z-index", "99999");
                },
                _mouseUp: function (e) {
                    var origin = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                    if(this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y) {
                        this._mouseClick(e);
                    }
                    $("iframe").css("pointer-events", "auto");
                    $('#iframe_layer').css("display", "none");
                },
                _mouseLeave: function (e) {
                    if(this.currentlyHoveredContentItem != null && this.currentlyHoveredContentItem.onmouseleave != null) {
                        this.currentlyHoveredContentItem.onmouseleave(e);
                    }
                    if(this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.onmouseleave != null) {
                        this.currentlyHoveredInfodot.onmouseleave(e);
                    }
                    if(this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.onmouseunhover != null) {
                        this.currentlyHoveredTimeline.onmouseunhover(null, e);
                    }
                    ChronoZoom.Common.stopAnimationTooltip();
                    this.lastEvent = null;
                },
                _mouseClick: function (e) {
                    var viewport = this.getViewport();
                    var origin = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    var _mouseClickNode = function (contentItem, pv) {
                        var inside = contentItem.isInside(pv);
                        if(!inside) {
                            return false;
                        }
                        for(var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if(_mouseClickNode(child, posv)) {
                                return true;
                            }
                        }
                        if(contentItem.reactsOnMouse && contentItem.onmouseclick) {
                            return contentItem.onmouseclick(pv, e);
                        }
                        return false;
                    };
                    _mouseClickNode(this._layersContent, posv);
                },
                getHoveredInfodot: function () {
                    return this.currentlyHoveredInfodot;
                },
                getCursorPosition: function () {
                    return this.cursorPosition;
                },
                _setConstraintsByInfodotHover: function (e) {
                    var val;
                    if(e) {
                        var recentVp = this.getViewport();
                        val = e.outerRad * ChronoZoom.Settings.infoDotZoomConstraint / recentVp.width;
                    } else {
                        val = undefined;
                    }
                    this.RaiseInnerZoomConstraintChenged(val);
                },
                RaiseInnerZoomConstraintChenged: function (e) {
                    this.innerZoomConstraintChengedEvent.zoomValue = e;
                    this.element.trigger(this.innerZoomConstraintChengedEvent);
                },
                RaiseCursorChanged: function () {
                    this.element.trigger(this.cursorPositionChangedEvent);
                },
                updateTooltipPosition: function (posv) {
                    var scrPoint = this.viewport.pointVirtualToScreen(posv.x, posv.y);
                    var heigthOffset = 17;
                    var length, height;
                    var obj = null;
                    if(ChronoZoom.Common.tooltipMode == 'infodot') {
                        obj = this.currentlyHoveredInfodot;
                    } else if(ChronoZoom.Common.tooltipMode == 'timeline') {
                        obj = this.currentlyHoveredTimeline;
                    }
                    if(obj == null) {
                        return;
                    }
                    length = parseInt(scrPoint.x) + obj.panelWidth;
                    height = parseInt(scrPoint.y) + obj.panelHeight + heigthOffset;
                    if(length > this.canvasWidth) {
                        scrPoint.x = this.canvasWidth - obj.panelWidth;
                    }
                    if(height > this.canvasHeight) {
                        scrPoint.y = this.canvasHeight - obj.panelHeight - heigthOffset + 1;
                    }
                    $('.bubbleInfo').css({
                        position: "absolute",
                        top: scrPoint.y,
                        left: scrPoint.x
                    });
                },
                mouseMove: function (e) {
                    var viewport = this.getViewport();
                    var origin = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    if(!this.currentlyHoveredInfodot) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }
                    if(!this.currentlyHoveredTimeline) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }
                    var mouseInStack = [];
                    var _mouseMoveNode = function (contentItem, forceOutside, pv) {
                        if(forceOutside) {
                            if(contentItem.reactsOnMouse && contentItem.isMouseIn && contentItem.onmouseleave) {
                                contentItem.onmouseleave(pv, e);
                                contentItem.isMouseIn = false;
                            }
                        } else {
                            var inside = contentItem.isInside(pv);
                            forceOutside = !inside;
                            if(contentItem.reactsOnMouse) {
                                if(inside) {
                                    if(contentItem.isMouseIn) {
                                        if(contentItem.onmousemove) {
                                            contentItem.onmousemove(pv, e);
                                        }
                                        if(contentItem.onmousehover) {
                                            mouseInStack.push(contentItem);
                                        }
                                    } else {
                                        contentItem.isMouseIn = true;
                                        if(contentItem.onmouseenter) {
                                            contentItem.onmouseenter(pv, e);
                                        }
                                    }
                                } else {
                                    if(contentItem.isMouseIn) {
                                        contentItem.isMouseIn = false;
                                        if(contentItem.onmouseleave) {
                                            contentItem.onmouseleave(pv, e);
                                        }
                                    } else {
                                        if(contentItem.onmousemove) {
                                            contentItem.onmousemove(pv, e);
                                        }
                                    }
                                }
                            }
                            contentItem.isMouseIn = inside;
                        }
                        for(var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if(!forceOutside || child.isMouseIn) {
                                _mouseMoveNode(child, forceOutside, pv);
                            }
                        }
                    };
                    _mouseMoveNode(this._layersContent, false, posv);
                    if(mouseInStack.length == 0) {
                        if(this.hovered && this.hovered.onmouseunhover) {
                            this.hovered.onmouseunhover(posv, e);
                            this.hovered = null;
                        }
                    }
                    for(var n = mouseInStack.length; --n >= 0; ) {
                        if(mouseInStack[n].onmousehover) {
                            mouseInStack[n].onmousehover(posv, e);
                            if(this.hovered && this.hovered != mouseInStack[n] && this.hovered.onmouseunhover) {
                                this.hovered.onmouseunhover(posv, e);
                            }
                            this.hovered = mouseInStack[n];
                            break;
                        }
                    }
                    if((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true) || (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && ChronoZoom.Common.tooltipMode != "infodot")) {
                        var obj = null;
                        if(ChronoZoom.Common.tooltipMode == 'infodot') {
                            obj = this.currentlyHoveredInfodot;
                        } else if(ChronoZoom.Common.tooltipMode == 'timeline') {
                            obj = this.currentlyHoveredTimeline;
                        }
                        if(obj != null) {
                            if(obj.tooltipIsShown == false) {
                                obj.tooltipIsShown = true;
                                ChronoZoom.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                            }
                        }
                        this.updateTooltipPosition(posv);
                    }
                    this.lastEvent = e;
                },
                getLastEvent: function () {
                    return this.lastEvent;
                },
                getLayerContent: function () {
                    return this._layersContent;
                },
                findElement: function (id) {
                    var rfind = function (el, id) {
                        if(el.id === id) {
                            return el;
                        }
                        if(!el.children) {
                            return null;
                        }
                        var n = el.children.length;
                        for(var i = 0; i < n; i++) {
                            var child = el.children[i];
                            if(child.id === id) {
                                return child;
                            }
                        }
                        for(var i = 0; i < n; i++) {
                            var child = el.children[i];
                            var res = rfind(child, id);
                            if(res) {
                                return res;
                            }
                        }
                        return null;
                    };
                    return rfind(this._layersContent, id);
                },
                _destroy: function () {
                    this.element.removeClass("virtualCanvas");
                    this.element.children(".virtualCanvasLayerDiv").each(function (index) {
                        $(this).removeClass("virtualCanvasLayerDiv");
                        $(this).remove(".virtualCanvasLayerCanvas");
                    });
                    this.element.unbind('.' + this.widgetName);
                    this._layers = undefined;
                    this._layersContent = undefined;
                    return this;
                },
                _visibleToViewBox: function (visible) {
                    var view = this.getViewport();
                    var w = view.widthScreenToVirtual(view.width);
                    var h = view.heightScreenToVirtual(view.height);
                    var x = visible.centerX - w / 2;
                    var y = visible.centerY - h / 2;
                    return {
                        Left: x,
                        Right: x + w,
                        Top: y,
                        Bottom: y + h
                    };
                },
                setVisible: function (newVisible, isInAnimation) {
                    delete this.viewport;
                    this.options.visible = newVisible;
                    this.isInAnimation = isInAnimation && isInAnimation.isActive;
                    var viewbox_v = this._visibleToViewBox(newVisible);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                updateViewport: function () {
                    var size = this._getClientSize();
                    var n = this._layers.length;
                    for(var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        layer.width(size.width).height(size.height);
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        if(canvas) {
                            canvas.width = size.width;
                            canvas.height = size.height;
                        }
                    }
                    this.canvasWidth = ChronoZoom.Common.vc.width();
                    this.canvasHeight = ChronoZoom.Common.vc.height();
                    this.setVisible(this.options.visible);
                },
                _getClientSize: function () {
                    return {
                        width: this.element[0].clientWidth,
                        height: this.element[0].clientHeight
                    };
                },
                getViewport: function () {
                    if(!this.viewport) {
                        var size = this._getClientSize();
                        var o = this.options;
                        this.viewport = new ChronoZoom.Viewport.Viewport2d(o.aspectRatio, size.width, size.height, o.visible);
                    }
                    return this.viewport;
                },
                _renderCanvas: function (elementsRoot, visibleBox_v, viewport) {
                    var n = this._layers.length;
                    if(n == 0) {
                        return;
                    }
                    var contexts = {
                    };
                    for(var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, viewport.width, viewport.height);
                        var layerid = layer[0].id;
                        contexts[layerid] = ctx;
                    }
                    elementsRoot.render(contexts, visibleBox_v, viewport);
                },
                invalidate: function () {
                    var viewbox_v = this._visibleToViewBox(this.options.visible);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                breadCrumbsChanged: function () {
                    this.breadCrumbsChengedEvent.breadCrumbs = this.breadCrumbs;
                    this.element.trigger(this.breadCrumbsChengedEvent);
                },
                requestInvalidate: function () {
                    if(this.isInAnimation) {
                        return;
                    }
                    this.isInAnimation = true;
                    var self = this;
                    setTimeout(function () {
                        self.isInAnimation = false;
                        self.invalidate();
                    }, 1000.0 / ChronoZoom.Settings.targetFps);
                },
                options: {
                    aspectRatio: 1,
                    visible: {
                        centerX: 0,
                        centerY: 0,
                        scale: 1
                    }
                }
            });
        }
        VirtualCanvas.initialize = initialize;
    })(ChronoZoom.VirtualCanvas || (ChronoZoom.VirtualCanvas = {}));
    var VirtualCanvas = ChronoZoom.VirtualCanvas;
})(ChronoZoom || (ChronoZoom = {}));
