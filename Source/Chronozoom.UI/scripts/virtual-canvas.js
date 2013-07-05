var CZ;
(function (CZ) {
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
                    this.requestNewFrame = false;
                    self.cursorPositionChangedEvent = new ($).Event("cursorPositionChanged");
                    self.breadCrumbsChangedEvent = $.Event("breadCrumbsChanged");
                    self.innerZoomConstraintChangedEvent = $.Event("innerZoomConstraintChanged");
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
                        $(this).addClass("virtualCanvasLayerDiv unselectable").zIndex(index * 3);
                        var layerCanvasJq = $("<canvas></canvas>").appendTo($(this)).addClass("virtualCanvasLayerCanvas").zIndex(index * 3 + 1);
                        self._layers.push($(this));
                    });
                    this._layersContent = new CZ.VCContent.CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                    this.options.visible = new CZ.Viewport.VisibleRegion2d(0, 0, 1);
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
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    this.lastClickPosition = {
                        x: origin.x,
                        y: origin.y
                    };
                    $("iframe").css("pointer-events", "none");
                    $('#iframe_layer').css("display", "block").css("z-index", "99999");
                },
                _mouseUp: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
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
                    CZ.Common.stopAnimationTooltip();
                    this.lastEvent = null;
                },
                _mouseClick: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
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
                getHoveredTimeline: function () {
                    return this.currentlyHoveredTimeline;
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
                        val = e.outerRad * CZ.Settings.infoDotZoomConstraint / recentVp.width;
                    } else {
                        val = undefined;
                    }
                    this.RaiseInnerZoomConstraintChanged(val);
                },
                RaiseInnerZoomConstraintChanged: function (e) {
                    this.innerZoomConstraintChangedEvent.zoomValue = e;
                    this.element.trigger(this.innerZoomConstraintChangedEvent);
                },
                RaiseCursorChanged: function () {
                    this.cursorPositionChangedEvent.Time = this.cursorPosition;
                    this.element.trigger(this.cursorPositionChangedEvent);
                },
                updateTooltipPosition: function (posv) {
                    var scrPoint = this.viewport.pointVirtualToScreen(posv.x, posv.y);
                    var heigthOffset = 17;
                    var length, height;
                    var obj = null;
                    if(CZ.Common.tooltipMode == 'infodot') {
                        obj = this.currentlyHoveredInfodot;
                    } else if(CZ.Common.tooltipMode == 'timeline') {
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
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
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
                                if(!this.currentlyHoveredInfodot || (this.currentlyHoveredInfodot && this.currentlyHoveredInfodot.parent && this.currentlyHoveredInfodot.parent != this.hovered)) {
                                    this.hovered.onmouseunhover(posv, e);
                                }
                            }
                            if(this.currentlyHoveredContentItem) {
                                this.hovered = this.currentlyHoveredContentItem;
                            } else {
                                this.hovered = mouseInStack[n];
                            }
                            break;
                        }
                    }
                    if((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true) || (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && CZ.Common.tooltipMode != "infodot")) {
                        var obj = null;
                        if(CZ.Common.tooltipMode == 'infodot') {
                            obj = this.currentlyHoveredInfodot;
                        } else if(CZ.Common.tooltipMode == 'timeline') {
                            obj = this.currentlyHoveredTimeline;
                        }
                        if(obj != null) {
                            if(obj.tooltipIsShown == false) {
                                obj.tooltipIsShown = true;
                                CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
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
                        $(this).removeClass("virtualCanvasLayerDiv").removeClass("unselectable");
                        $(this).remove(".virtualCanvasLayerCanvas");
                    });
                    this.element.unbind('.' + this.widgetName);
                    this._layers = undefined;
                    this._layersContent = undefined;
                    return this;
                },
                visibleToViewBox: function (visible) {
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
                    var viewbox_v = this.visibleToViewBox(newVisible);
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
                    this.canvasWidth = CZ.Common.vc.width();
                    this.canvasHeight = CZ.Common.vc.height();
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
                        this.viewport = new CZ.Viewport.Viewport2d(o.aspectRatio, size.width, size.height, o.visible);
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
                    var viewbox_v = this.visibleToViewBox(this.options.visible);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                breadCrumbsChanged: function () {
                    this.breadCrumbsChangedEvent.breadCrumbs = this.breadCrumbs;
                    this.element.trigger(this.breadCrumbsChangedEvent);
                },
                requestInvalidate: function () {
                    this.requestNewFrame = false;
                    if(CZ.Layout.animatingElements.length != 0) {
                        CZ.Layout.syncViewport();
                        for(var i = 0; i < CZ.Layout.animatingElements.length; i++) {
                            var el = CZ.Layout.animatingElements[i];
                            if(!el) {
                                CZ.Layout.animatingElements.splice(i, 1);
                            } else if(el.animation && el.animation.isAnimating) {
                                el.calculateNewFrame();
                                this.requestNewFrame = true;
                            }
                        }
                    }
                    if(this.isInAnimation) {
                        return;
                    }
                    this.isInAnimation = true;
                    var self = this;
                    setTimeout(function () {
                        self.isInAnimation = false;
                        self.invalidate();
                        if(self.requestNewFrame) {
                            self.requestInvalidate();
                        }
                    }, 1000.0 / CZ.Settings.targetFps);
                },
                _findLca: function (tl, wnd) {
                    for(var i = 0; i < tl.children.length; i++) {
                        if(tl.children[i].type === 'timeline' && tl.children[i].contains(wnd)) {
                            return this._findLca(tl.children[i], wnd);
                        }
                    }
                    return tl;
                },
                findLca: function (wnd) {
                    var cosmosTimeline = this._layersContent.children[0];
                    var eps = 1;
                    var cosmosLeft = cosmosTimeline.x + eps;
                    var cosmosRight = cosmosTimeline.x + cosmosTimeline.width - eps;
                    var cosmosTop = cosmosTimeline.y + eps;
                    var cosmosBottom = cosmosTimeline.y + cosmosTimeline.height - eps;
                    wnd.left = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x));
                    wnd.right = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x + wnd.width));
                    wnd.top = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y));
                    wnd.bottom = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y + wnd.height));
                    wnd.x = wnd.left;
                    wnd.y = wnd.top;
                    wnd.width = Math.max(0, wnd.right - wnd.left);
                    wnd.height = Math.max(0, wnd.bottom - wnd.top);
                    return this._findLca(cosmosTimeline, wnd);
                },
                _inBuffer: function (tl, wnd, scale) {
                    if(tl.intersects(wnd) && tl.isVisibleOnScreen(scale)) {
                        if(!tl.isBuffered) {
                            return false;
                        } else {
                            var b = true;
                            for(var i = 0; i < tl.children.length; i++) {
                                if(tl.children[i].type === 'timeline') {
                                    b = b && this._inBuffer(tl.children[i], wnd, scale);
                                }
                            }
                            return b;
                        }
                    }
                    return true;
                },
                inBuffer: function (wnd, scale) {
                    var cosmosTimeline = this._layersContent.children[0];
                    var cosmosLeft = cosmosTimeline.x;
                    var cosmosRight = cosmosTimeline.x + cosmosTimeline.width;
                    var cosmosTop = cosmosTimeline.y;
                    var cosmosBottom = cosmosTimeline.y + cosmosTimeline.height;
                    wnd.left = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x));
                    wnd.right = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x + wnd.width));
                    wnd.top = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y));
                    wnd.bottom = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y + wnd.height));
                    wnd.x = wnd.left;
                    wnd.y = wnd.top;
                    wnd.width = Math.max(0, wnd.right - wnd.left);
                    wnd.height = Math.max(0, wnd.bottom - wnd.top);
                    return this._inBuffer(cosmosTimeline, wnd, scale);
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
    })(CZ.VirtualCanvas || (CZ.VirtualCanvas = {}));
    var VirtualCanvas = CZ.VirtualCanvas;
})(CZ || (CZ = {}));
