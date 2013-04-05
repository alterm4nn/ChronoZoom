var CZ;
(function (CZ) {
    (function (VirtualCanvas) {
        /*  Defines a Virtual Canvas widget (based on jQuery ui).
        @remarks The widget renders different objects defined in a virtual space within a <div> element.
        The widget allows to update current visible region, i.e. perform panning and zooming.
        
        Technically, the widget uses a <canvas> element to render most types of objects; some of elements
        can be positioned using CSS on a top of the canvas.
        The widget is split into layers, each layer corresponds to a <div> within a root <div> element.
        Next <div> is rendered on the top of previous one.
        function initialize() {
            ($).widget("ui.virtualCanvas", {
        (saved to avoid building jqueries every time we need it).
        */
        [],
        _create: /* Constructs a widget
        */
        function () {
            var self = this;
            self.element.addClass("virtualCanvas");
            var size = self._getClientSize();
            this.lastEvent = null// last mouse event
            ;
            this.canvasWidth = null// width of canvas
            ;
            this.canvasHeight = null// height of canvas
            ;
            this.requestNewFrame = false// indicates whether new frame is required or not
            ;
            self.cursorPositionChangedEvent = new jQuery.Event("cursorPositionChanged");
            self.breadCrumbsChengedEvent = jQuery.Event("breadCrumbsChanged");
            self.innerZoomConstraintChengedEvent = jQuery.Event("innerZoomConstraintChenged");
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
                // for each internal (div)
                // make a layer from (div)
                $(this).addClass("virtualCanvasLayerDiv").zIndex(index * 3);
                // creating canvas element
                var layerCanvasJq = $("<canvas></canvas>").appendTo($(this)).addClass("virtualCanvasLayerCanvas").zIndex(index * 3 + 1);
                self._layers.push($(this))// save jquery for this layer for further use
                ;
            });
            // creating layers' content root element
            this._layersContent = new CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
            // default visible region
            this.options.visible = new VisibleRegion2d(0, 0, 1)// ...in virtual coordinates: centerX, centerY, scale.
            ;
            this.updateViewport();
            // start up the mouse handling
            self.element.bind('mousemove.' + this.widgetName, function (e) {
                self.mouseMove(e);
            });
            self.element.bind('mousedown.' + this.widgetName, function (e) {
                switch(e.which) {
                    case 1:
                        self._mouseDown(e)//means that only left click will be interpreted
                _layersContent: undefined,
                _layers: [],
                _create: function () {
                _layersContent: /* Root element of the widget content.
                Element of type CanvasItemsRoot.
                */
                undefined,
                _layers: /* Array of jqueries to layer div elements
                (saved to avoid building jqueries every time we need it).
                */
                [],
                _create: /* Constructs a widget
                */
                function () {
                    var self = this;
                    self.element.addClass("virtualCanvas");
                    var size = self._getClientSize();
                    this.lastEvent = null;
                    this.canvasWidth = null;
                    this.canvasHeight = null;
                    this.requestNewFrame = false;
                    this.lastEvent = null// last mouse event
                    ;
                    this.canvasWidth = null// width of canvas
                    ;
                    this.canvasHeight = null// height of canvas
                    ;
                    this.requestNewFrame = false// indicates whether new frame is required or not
                    ;
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
                        // for each internal (div)
                        // make a layer from (div)
                        $(this).addClass("virtualCanvasLayerDiv").zIndex(index * 3);
                        // creating canvas element
                        var layerCanvasJq = $("<canvas></canvas>").appendTo($(this)).addClass("virtualCanvasLayerCanvas").zIndex(index * 3 + 1);
                        self._layers.push($(this));
                        self._layers.push($(this))// save jquery for this layer for further use
                    });
                    // creating layers' content root element
                    this._layersContent = new CZ.VCContent.CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
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
        destroy: /* Destroys a widget
        */
        function () {
            this._destroy();
        },
        _mouseDown: /* Handles mouse down event within the widget
        */
        function (e) {
            var origin = getXBrowserMouseOrigin(this.element, e);
            this.lastClickPosition = {
                x: // saving a position where the mouse was clicked last time
                origin.x,
                y: origin.y
            };
            //Bug (176751): Infodots/video. Mouseup event handling.
            //Chrome/Firefox solution
            $("iframe").css("pointer-events", "none");
            //IE solution
            $('#iframe_layer').css("display", "block").css("z-index", "99999");
        },
        _mouseUp: /* Handles mouse up event within the widget
        */
        function (e) {
            var viewport = this.getViewport();
            var origin = getXBrowserMouseOrigin(this.element, e);
            var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
            if(this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y) {
                this._mouseClick(e);
            }
            //Bug (176751): Infodots/video. Mouseup event handling.
            //Chrome/Firefox solution
            $("iframe").css("pointer-events", "auto");
            //IE solution
            $('#iframe_layer').css("display", "none");
        },
        _mouseLeave: /*
        Handles mouseleave event within the widget
        */
        function (e) {
            // check if any content item or infodot or timeline are highlighted
            if(this.currentlyHoveredContentItem != null && this.currentlyHoveredContentItem.onmouseleave != null) {
                this.currentlyHoveredContentItem.onmouseleave(e);
            }
            if(this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.onmouseleave != null) {
                this.currentlyHoveredInfodot.onmouseleave(e);
            }
            if(this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.onmouseunhover != null) {
                this.currentlyHoveredTimeline.onmouseunhover(null, e);
            }
            // hide tooltip now
            stopAnimationTooltip();
            // remove last mouse position from canvas to prevent unexpected highlight of canvas elements
            this.lastEvent = null;
        },
        _mouseClick: /* Mouse click happens when mouse up happens at the same point as previous mouse down.
        Returns true, if the event was handled.
        */
        function (e) {
            var viewport = this.getViewport();
            var origin = getXBrowserMouseOrigin(this.element, e);
            var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
            // the function handle mouse click an a content item
            var _mouseClickNode = function (contentItem, pv) {
                var inside = contentItem.isInside(pv);
                if(!inside) {
                    return false;
                }
                // First we ask the children to handle the click
                for(var i = 0; i < contentItem.children.length; i++) {
                    var child = contentItem.children[i];
                    if(_mouseClickNode(child, posv)) {
                        return true;
                    this.options.visible = new CZ.Viewport.VisibleRegion2d(0, 0, 1);
                    // default visible region
                    this.options.visible = new CZ.Viewport.VisibleRegion2d(0, 0, 1)// ...in virtual coordinates: centerX, centerY, scale.
                    ;
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
                    this.RaiseInnerZoomConstraintChenged(val);
                },
                RaiseInnerZoomConstraintChenged: function (e) {
                    this.innerZoomConstraintChengedEvent.zoomValue = e;
                    this.element.trigger(this.innerZoomConstraintChengedEvent);
                },
                RaiseCursorChanged: function () {
                    this.cursorPositionChangedEvent.Time = self.cursorPosition;
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
                    // start up the mouse handling
                    self.element.bind('mousemove.' + this.widgetName, function (e) {
                        self.mouseMove(e);
                    });
                    self.element.bind('mousedown.' + this.widgetName, function (e) {
                        switch(e.which) {
                            case 1:
                                self._mouseDown(e)//means that only left click will be interpreted
                                ;
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
                destroy: /* Destroys a widget
                */
                function () {
                    this._destroy();
                },
                _mouseDown: /* Handles mouse down event within the widget
                */
                function (e) {
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    this.lastClickPosition = {
                        x: // saving a position where the mouse was clicked last time
                        origin.x,
                        y: origin.y
                    };
                    //Bug (176751): Infodots/video. Mouseup event handling.
                    //Chrome/Firefox solution
                    $("iframe").css("pointer-events", "none");
                    //IE solution
                    $('#iframe_layer').css("display", "block").css("z-index", "99999");
                },
                _mouseUp: /* Handles mouse up event within the widget
                */
                function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    if(this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y) {
                        this._mouseClick(e);
                    }
                    //Bug (176751): Infodots/video. Mouseup event handling.
                    //Chrome/Firefox solution
                    $("iframe").css("pointer-events", "auto");
                    //IE solution
                    $('#iframe_layer').css("display", "none");
                },
                _mouseLeave: /*
                Handles mouseleave event within the widget
                */
                function (e) {
                    // check if any content item or infodot or timeline are highlighted
                    if(this.currentlyHoveredContentItem != null && this.currentlyHoveredContentItem.onmouseleave != null) {
                        this.currentlyHoveredContentItem.onmouseleave(e);
                    }
                    if(this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.onmouseleave != null) {
                        this.currentlyHoveredInfodot.onmouseleave(e);
                    }
                    if(this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.onmouseunhover != null) {
                        this.currentlyHoveredTimeline.onmouseunhover(null, e);
                    }
                    // hide tooltip now
                    CZ.Common.stopAnimationTooltip();
                    // remove last mouse position from canvas to prevent unexpected highlight of canvas elements
                    this.lastEvent = null;
                },
                _mouseClick: /* Mouse click happens when mouse up happens at the same point as previous mouse down.
                Returns true, if the event was handled.
                */
                function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    // the function handle mouse click an a content item
                    var _mouseClickNode = function (contentItem, pv) {
                        var inside = contentItem.isInside(pv);
                        if(!inside) {
                            return false;
                        }
                        // First we ask the children to handle the click
                        for(var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if(_mouseClickNode(child, posv)) {
                                return true;
                            }
                        }
                        // No one has handled the click. We try to handle it here.
                        if(contentItem.reactsOnMouse && contentItem.onmouseclick) {
                            return contentItem.onmouseclick(pv, e);// invoke content item's handler
                            
                        }
                        return false;// we didn't handle the event
                        
                    };
                    // Start handling the event from root element
                    _mouseClickNode(this._layersContent, posv);
                },
                getHoveredTimeline: /*
                getter of currentlyHoveredTimeline
                */
                function () {
                    return this.currentlyHoveredTimeline;
                },
                getHoveredInfodot: /*
                getter of currentlyHoveredInfodot
                */
                function () {
                    return this.currentlyHoveredInfodot;
                },
                getCursorPosition: /*
                Returns the time value that corresponds to the current cursor position
                */
                function () {
                    return this.cursorPosition;
                },
                _setConstraintsByInfodotHover: /*
                Sets the constraines applied by the infordot exploration
                param e     (CanvasInfodot) an infodot that is used to calculate constraints
                */
                function (e) {
                    var val;
                    if(e) {
                        var recentVp = this.getViewport();
                        val = e.outerRad * CZ.Settings.infoDotZoomConstraint / recentVp.width;
                    } else {
                        val = undefined;
                    }
                    this.RaiseInnerZoomConstraintChenged(val);
                },
                RaiseInnerZoomConstraintChenged: /*
                Fires the event with a new inner zoom constrainted value
                */
                function (e) {
                    this.innerZoomConstraintChengedEvent.zoomValue = e;
                    this.element.trigger(this.innerZoomConstraintChengedEvent);
                },
                RaiseCursorChanged: /*
                Fires the event of cursor position changed
                */
                function () {
                    this.cursorPositionChangedEvent.Time = self.cursorPosition;
                    this.element.trigger(this.cursorPositionChangedEvent);
                },
                updateTooltipPosition: /*
                Updates tooltip position
                */
                function (posv) {
                    var scrPoint = this.viewport.pointVirtualToScreen(posv.x, posv.y);// (x,y) mouse coordinates on canvas
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
                    length = parseInt(scrPoint.x) + obj.panelWidth// position of right edge of tooltip's panel
                    ;
                    height = parseInt(scrPoint.y) + obj.panelHeight + heigthOffset// position of bottom edge of tooltip's panel
                    ;
                    // tooltip goes beyond right edge of canvas
                    if(length > this.canvasWidth) {
                        scrPoint.x = this.canvasWidth - obj.panelWidth;
                    }
                    // tooltip goes beyond bottom edge of canvas
                    if(height > this.canvasHeight) {
                        scrPoint.y = this.canvasHeight - obj.panelHeight - heigthOffset + 1;
                    }
                    // Update tooltip position.
                    $('.bubbleInfo').css({
                        position: "absolute",
                        top: scrPoint.y,
                        left: scrPoint.x
                    });
                },
                mouseMove: /* Handles mouse move event within the widget
                */
                function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    // triggers an event that handles current mouse position
                    if(!this.currentlyHoveredInfodot) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }
                    if(!this.currentlyHoveredTimeline) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }
                    var mouseInStack = [];
                    // we should chech whether mouse is inside or outside of the contentItem
                    var inside = contentItem.isInside(pv);
                    forceOutside = !inside// for further handle of event in children of this content item
                    ;
                    // We should invoke mousemove, mouseenter, mouseleave handlers
                    if(contentItem.reactsOnMouse) {
                        if(inside) {
                            if(contentItem.isMouseIn) {
                                if(contentItem.onmousemove) {
                                    contentItem.onmousemove(pv, e);
                    var _mouseMoveNode = function (contentItem, forceOutside, pv) {
                    // the function handle mouse move event
                    var _mouseMoveNode = function (contentItem/*an element to handle mouse move*/ , forceOutside/*if true, we know that pv is outside of the contentItem*/ , pv/*clicked point in virtual coordinates*/ ) {
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
                            // we know that pv is outside of the contentItem
                            // and if previously mouse was inside content item, we should handle mouse leave:
                            if(contentItem.reactsOnMouse && contentItem.isMouseIn && contentItem.onmouseleave) {
                                contentItem.onmouseleave(pv, e);
                                contentItem.isMouseIn = false;
                            }
                        } else {
                            // we should chech whether mouse is inside or outside of the contentItem
                            var inside = contentItem.isInside(pv);
                            forceOutside = !inside// for further handle of event in children of this content item
                            ;
                            // We should invoke mousemove, mouseenter, mouseleave handlers
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
                                    // mouse is outside of the area
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
                                    mouseInStack.push(contentItem);
                            contentItem.isMouseIn = inside;
                            contentItem.isMouseIn = inside// save that mouse was inside this contentItem
                            ;
                        }
                        // Every child handles the event
                        for(var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if(!forceOutside || child.isMouseIn) {
                                // if mouse is outside of this element (hence of its children), at most we just should
                                _mouseMoveNode(child, forceOutside, pv);
                            }
                            }// call mouseleave or do nothing within that branch of the tree.
                            
                        }
                    };
                    // Start handling the event from root element
                    _mouseMoveNode(this._layersContent, false, posv);
                    // Notifying the deepest timeline which has mouse hover
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
                                // dont unhover timeline if its child infodot is hovered
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
                    // update tooltip for currently tooltiped infodot|t if tooltip is enabled for this infodot|timeline
                    if((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true) || (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && CZ.Common.tooltipMode != "infodot")) {
                        var obj = null;
                        if(CZ.Common.tooltipMode == 'infodot') {
                            obj = this.currentlyHoveredInfodot;
                        } else if(CZ.Common.tooltipMode == 'timeline') {
                            obj = this.currentlyHoveredTimeline;
                        }
                        if(obj != null) {
                            // show tooltip if it is not shown yet
                            if(obj.tooltipIsShown == false) {
                                obj.tooltipIsShown = true;
                                CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                            }
                        }
                        // update position of tooltip
                        this.updateTooltipPosition(posv);
                    }
                    // last mouse move event
                    this.lastEvent = e;
                },
                getLastEvent: // Returns last mouse move event
                function () {
                    return this.lastEvent;
                },
                getLayerContent: // Returns root of the element tree.
                function () {
                    return this._layersContent;
                },
                findElement: // Recursively finds and returns an element with given id.
                // If not found, returns null.
                function (id) {
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
                _destroy: // Destroys the widget.
                function () {
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
                _visibleToViewBox: /* Produces {Left,Right,Top,Bottom} object which corresponds to visible region in virtual space, using current viewport.
                */
                function (visible) {
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
                setVisible: /* Updates and renders a visible region in virtual space that corresponds to a physical window.
                @param newVisible   (VisibleRegion2d) New visible region.
                @remarks Rebuilds the current viewport.
                */
                function (newVisible, isInAnimation) {
                    delete this.viewport// invalidating old viewport
                    ;
                    this.options.visible = newVisible// setting new visible region
                    this.isInAnimation = isInAnimation && isInAnimation.isActive;
                    // rendering canvas (we should update the image because of new visible region)
                    var viewbox_v = this._visibleToViewBox(newVisible);// visible region in appropriate format
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
                updateViewport: /* Update viewport's physical width and height in correspondence with the <div> element.
                @remarks The method should be called when the <div> element, which hosts the virtual canvas, resizes.
                It sets width and height attributes of layers' <div> and <canvas> to width and height of the widget's <div>, and
                then updates visible region and renders the content.
                */
                function () {
                    // updating width and height of layers' <canvas>-es in accordance with actual size of widget's <div>.
                    var size = this._getClientSize();
                    var n = this._layers.length;
                    for(var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        var layer = this._layers[i];// jq to <div> element
                        
                        layer.width(size.width).height(size.height);
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        if(canvas) {
                            canvas.width = size.width;
                            canvas.height = size.height;
                        }
                    }
                    // update canvas width and height
                    this.canvasWidth = CZ.Common.vc.width();
                    this.canvasHeight = CZ.Common.vc.height();
                    this.setVisible(this.options.visible);
                },
                _getClientSize: function () {
                _getClientSize: /* Produces {width, height} object from actual width and height of widget's <div> (in pixels).
                */
                function () {
                    return {
                        width: this.element[0].clientWidth,
                        height: this.element[0].clientHeight
                    };
                },
                getViewport: function () {
                getViewport: /* Gets current viewport.
                @remarks The widget caches viewport as this.viewport property and rebuilds it only when it is invalidated, i.e. this.viewport=undefined.
                Viewport is currently invalidated by setVisible and updateViewport methods.
                */
                function () {
                    if(!this.viewport) {
                        var size = this._getClientSize();
                        var o = this.options;
                        this.viewport = new CZ.Common.Viewport2d(o.aspectRatio, size.width, size.height, o.visible);
                    }
                    return this.viewport;
                },
            }
            // update tooltip for currently tooltiped infodot|t if tooltip is enabled for this infodot|timeline
            if((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true) || (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && tooltipMode != "infodot")) {
                var obj = null;
                if(tooltipMode == 'infodot') {
                    obj = this.currentlyHoveredInfodot;
                } else if(tooltipMode == 'timeline') {
                    obj = this.currentlyHoveredTimeline;
                }
                if(obj != null) {
                    // show tooltip if it is not shown yet
                    if(obj.tooltipIsShown == false) {
                        obj.tooltipIsShown = true;
                        animationTooltipRunning = $('.bubbleInfo').fadeIn();
                _renderCanvas: function (elementsRoot, visibleBox_v, viewport) {
                _renderCanvas: /* Renders elements tree on all layers' canvases.
                @param elementsRoot     (CanvasItemsRoot) Root of widget's elements tree
                @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in virtual space
                @param viewport         (Viewport2d) current viewport
                @todo                   Possible optimization is to render only actually updated layers.
                */
                function (elementsRoot, visibleBox_v, viewport) {
                    var n = this._layers.length;
                    if(n == 0) {
                        return;
                    }
                    // first we get 2d contexts for each layers' canvas:
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
                    // rendering the tree recursively
                    elementsRoot.render(contexts, visibleBox_v, viewport);
                },
                    var child = el.children[i];
                    var res = rfind(child, id);
                    if(res) {
                        return res;
                invalidate: function () {
                invalidate: /* Renders the virtual canvas content.
                */
                function () {
                    var viewbox_v = this._visibleToViewBox(this.options.visible);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                breadCrumbsChanged: function () {
                breadCrumbsChanged: /*
                Fires the trigger that currently observed (the visible region is inside this timeline) timeline is changed
                */
                function () {
                    this.breadCrumbsChengedEvent.breadCrumbs = this.breadCrumbs;
                    this.element.trigger(this.breadCrumbsChengedEvent);
                },
                requestInvalidate: function () {
                requestInvalidate: /* If virtual canvas is during animation now, the method does nothing;
                otherwise, it sets the timeout to invalidate the image.
                */
                function () {
                    this.requestNewFrame = false;
                    // update parameters of animating elements and require new frame if needed
                    if(CZ.Layout.animatingElements.length != 0) {
                        for(id in CZ.Layout.animatingElements) {
                            if(CZ.Layout.animatingElements[id].animation && CZ.Layout.animatingElements[id].animation.isAnimating) {
                                CZ.Layout.animatingElements[id].calculateNewFrame();
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
                self.isInAnimation = false;
                self.invalidate();
                if(self.requestNewFrame) {
                    self.requestInvalidate();
                }
            }, 1000.0 / targetFps)// 1/targetFps sec (targetFps is defined in a settings.js)
            ;
        },
        _findLca: /*
        Finds the LCA(Lowest Common Ancestor) timeline which contains wnd
        */
        function (tl, wnd) {
            for(var i = 0; i < tl.children.length; i++) {
                if(tl.children[i].type === 'timeline' && tl.children[i].contains(wnd)) {
                    return this._findLca(tl.children[i], wnd);
                }
            }
            return tl;
        },
        findLca: function (wnd) {
            var cosmosTimeline = this._layersContent.children[0];
            var eps = 1;// TODO: analyticaly calculate the proper eps
            
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
        _inBuffer: /*
        Checks if we have all the data to render wnd at scale
        */
        function (tl, wnd, scale) {
            if(tl.intersects(wnd) && tl.isVisibleOnScreen(scale)) {
                if(!tl.isBuffered) {
                    return false;
                } else {
                    /*
                    for (var i = 0; i < tl.children.length; i++) {
                    if (tl.children[i].type === 'infodot')
                    if (!tl.children[i].isBuffered)
                    return false;
                    }, 1000.0 / CZ.Settings.targetFps);
                    }, 1000.0 / CZ.Settings.targetFps)// 1/targetFps sec (targetFps is defined in a settings.js)
                    ;
                },
                _findLca: function (tl, wnd) {
                _findLca: /*
                Finds the LCA(Lowest Common Ancestor) timeline which contains wnd
                */
                function (tl, wnd) {
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
                    var eps = 1;// TODO: analyticaly calculate the proper eps
                    
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
                _inBuffer: /*
                Checks if we have all the data to render wnd at scale
                */
                function (tl, wnd, scale) {
                    if(tl.intersects(wnd) && tl.isVisibleOnScreen(scale)) {
                        if(!tl.isBuffered) {
                            return false;
                        } else {
                            /*
                            for (var i = 0; i < tl.children.length; i++) {
                            if (tl.children[i].type === 'infodot')
                            if (!tl.children[i].isBuffered)
                            return false;
                            }
                            */
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
                    visible: /* (number)    how many h-units are in a single time unit */
                    {
                        centerX: 0,
                        centerY: 0,
                        scale: 1
                    }
                }
            });
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
            visible: /* (number)    how many h-units are in a single time unit */
            {
                centerX: 0,
                centerY: 0,
                scale: 1
            }
            /* (VisibleRegion2d) describes the visible region */
                    }
        VirtualCanvas.initialize = initialize;
    })(CZ.VirtualCanvas || (CZ.VirtualCanvas = {}));
    var VirtualCanvas = CZ.VirtualCanvas;
})(CZ || (CZ = {}));
