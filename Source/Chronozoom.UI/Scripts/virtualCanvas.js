/*  Defines a Virtual Canvas widget (based on jQuery ui).
@remarks The widget renders different objects defined in a virtual space within a <div> element.
The widget allows to update current visible region, i.e. perform panning and zooming.

Technically, the widget uses a <canvas> element to render most types of objects; some of elements
can be positioned using CSS on a top of the canvas.
The widget is split into layers, each layer corresponds to a <div> within a root <div> element.
Next <div> is rendered on the top of previous one.
*/
(function ($, undefined) {

    //    $("iframe").live("mouseup",function () {
    //        //        var origin = getXBrowserMouseOrigin(this.element, e);
    //        //        if (this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y)
    //        //            this._mouseClick(e);
    //        alert("mouseup");
    //    });


    $.widget("ui.virtualCanvas",
    {
        /* Root element of the widget content.
        Element of type CanvasItemsRoot. 
        */
        _layersContent: undefined,

        /* Array of jqueries to layer div elements 
        (saved to avoid building jqueries every time we need it).
        */
        _layers: [],


        /* Constructs a widget 
        */
        _create: function () {
            var self = this;
            self.element.addClass("virtualCanvas");
            var size = self._getClientSize();

            this.lastEvent = null; // last mouse event

            this.canvasWidth = null; // width of canvas
            this.canvasHeight = null; // height of canvas

            self.cursorPositionChangedEvent = new jQuery.Event("cursorPositionChanged");
            self.breadCrumbsChengedEvent = jQuery.Event("breadCrumbsChanged");
            self.innerZoomConstraintChengedEvent = jQuery.Event("innerZoomConstraintChenged");
            self.currentlyHoveredInfodot = undefined;
            self.breadCrumbs = [];
            self.recentBreadCrumb = { vcElement: { title: "initObject"} };

            self.cursorPosition = 0.0;

            var layerDivs = self.element.children("div");
            layerDivs.each(function (index) { // for each internal (div)
                // make a layer from (div)
                $(this).addClass("virtualCanvasLayerDiv").zIndex(index * 3);

                // creating canvas element
                var layerCanvasJq = $("<canvas></canvas>")
                                    .appendTo($(this))
                                    .addClass("virtualCanvasLayerCanvas")
                                    .zIndex(index * 3 + 1);
                self._layers.push($(this)); // save jquery for this layer for further use
            });

            // creating layers' content root element
            this._layersContent = new CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);

            // default visible region 
            this.options.visible = new VisibleRegion2d(0, 0, 1); // ...in virtual coordinates: centerX, centerY, scale.
            this.updateViewport();

            // start up the mouse handling
            self.element.bind('mousemove.' + this.widgetName, function (e) { self.mouseMove(e) });
            self.element.bind('mousedown.' + this.widgetName, function (e) {
                switch (e.which) {
                    case 1: self._mouseDown(e);         //means that only left click will be interpreted
                        break;
                }

            });
            self.element.bind('mouseup.' + this.widgetName, function (e) {
                switch (e.which) {
                    case 1: self._mouseUp(e);
                }
            });
            self.element.bind('mouseleave.' + this.widgetName, function (e) { self._mouseLeave(e) });
        },

        /* Destroys a widget 
        */
        destroy: function () {
            this._destroy();
        },

        /* Handles mouse down event within the widget
        */
        _mouseDown: function (e) {
            var origin = getXBrowserMouseOrigin(this.element, e);
            this.lastClickPosition = { // saving a position where the mouse was clicked last time
                x: origin.x,
                y: origin.y
            };

            //Bug (176751): Infodots/video. Mouseup event handling.
            //Chrome/Firefox solution
            $("iframe").css("pointer-events", "none");

            //IE solution
            $('#iframe_layer').css("display", "block").css("z-index", "99999");
        },

        /* Handles mouse up event within the widget
        */
        _mouseUp: function (e) {
            var origin = getXBrowserMouseOrigin(this.element, e);
            if (this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y)
                this._mouseClick(e);

            //Bug (176751): Infodots/video. Mouseup event handling.
            //Chrome/Firefox solution
            $("iframe").css("pointer-events", "auto");

            //IE solution
            $('#iframe_layer').css("display", "none");
        },

        /* 
        Handles mouseleave event within the widget
        */
        _mouseLeave: function (e) {
            // check if any content item or infodot or timeline are highlighted
            if (this.currentlyHoveredContentItem != null && this.currentlyHoveredContentItem.onmouseleave != null)
                this.currentlyHoveredContentItem.onmouseleave(e);
            if (this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.onmouseleave != null)
                this.currentlyHoveredInfodot.onmouseleave(e);
            if (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.onmouseunhover != null)
                this.currentlyHoveredTimeline.onmouseunhover(null, e);

            // hide tooltip now
            stopAnimationTooltip();
            // remove last mouse position from canvas to prevent unexpected highlight of canvas elements
            this.lastEvent = null;
        },

        /* Mouse click happens when mouse up happens at the same point as previous mouse down.
        Returns true, if the event was handled.
        */
        _mouseClick: function (e) {
            var viewport = this.getViewport();
            var origin = getXBrowserMouseOrigin(this.element, e);
            var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

            // the function handle mouse click an a content item
            var _mouseClickNode = function (contentItem, pv) {
                var inside = contentItem.isInside(pv);
                if (!inside) return false;

                // First we ask the children to handle the click
                for (var i = 0; i < contentItem.children.length; i++) {
                    var child = contentItem.children[i];
                    if (_mouseClickNode(child, posv)) return true;
                }
                // No one has handled the click. We try to handle it here.
                if (contentItem.reactsOnMouse && contentItem.onmouseclick) {
                    return contentItem.onmouseclick(pv, e); // invoke content item's handler
                }
                return false; // we didn't handle the event
            };

            // Start handling the event from root element
            _mouseClickNode(this._layersContent, posv);
        },
        /*
        getter of currentlyHoveredInfodot
        */
        getHoveredInfodot: function () {
            return this.currentlyHoveredInfodot;
        },
        /*
        Returns the time value that corresponds to the current cursor position
        */
        getCursorPosition: function () {
            return this.cursorPosition;
        },
        /*
        Sets the constraines applied by the infordot exploration
        param e     (CanvasInfodot) an infodot that is used to calculate constraints
        */
        _setConstraintsByInfodotHover: function (e) {
            var val;
            if (e) {
                var recentVp = this.getViewport();
                val = e.outerRad * infoDotZoomConstraint / recentVp.width;
            }
            else
                val = undefined;
            this.RaiseInnerZoomConstraintChenged(val);
        },
        /*
        Fires the event with a new inner zoom constrainted value        
        */
        RaiseInnerZoomConstraintChenged: function (e) {
            this.innerZoomConstraintChengedEvent.zoomValue = e;
            this.element.trigger(this.innerZoomConstraintChengedEvent);
        }
        ,
        /*
        Fires the event of cursor position changed
        */
        RaiseCursorChanged: function () {
            this.cursorPositionChangedEvent.Time = self.cursorPosition;
            this.element.trigger(this.cursorPositionChangedEvent);
        },

        /*
        Updates tooltip position
        */
        updateTooltipPosition: function (posv) {
            var scrPoint = this.viewport.pointVirtualToScreen(posv.x, posv.y); // (x,y) mouse coordinates on canvas

            var heigthOffset = 17;

            var length, height;

            var obj = null;

            if (tooltipMode == 'infodot') obj = this.currentlyHoveredInfodot;
            else
                if (tooltipMode == 'timeline') obj = this.currentlyHoveredTimeline;

            if (obj == null) return;

            length = parseInt(scrPoint.x) + obj.panelWidth; // position of right edge of tooltip's panel
            height = parseInt(scrPoint.y) + obj.panelHeight + heigthOffset; // position of bottom edge of tooltip's panel

            // tooltip goes beyond right edge of canvas
            if (length > this.canvasWidth)
                scrPoint.x = this.canvasWidth - obj.panelWidth;
            // tooltip goes beyond bottom edge of canvas
            if (height > this.canvasHeight)
                scrPoint.y = this.canvasHeight - obj.panelHeight - heigthOffset + 1;

            // Update tooltip position.
            $('.bubbleInfo').css({
                position: "absolute",
                top: scrPoint.y,
                left: scrPoint.x
            });
        },

        /* Handles mouse move event within the widget
        */
        mouseMove: function (e) {
            var viewport = this.getViewport();
            var origin = getXBrowserMouseOrigin(this.element, e);
            var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

            // triggers an event that handles current mouse position
            if (!this.currentlyHoveredInfodot) {
                this.cursorPosition = posv.x;
                this.RaiseCursorChanged();
            }

            if (!this.currentlyHoveredTimeline) {
                this.cursorPosition = posv.x;
                this.RaiseCursorChanged();
            }

            var mouseInStack = [];

            // the function handle mouse move event
            var _mouseMoveNode = function (contentItem/*an element to handle mouse move*/, forceOutside/*if true, we know that pv is outside of the contentItem*/, pv/*clicked point in virtual coordinates*/) {
                if (forceOutside) { // we know that pv is outside of the contentItem
                    // and if previously mouse was inside content item, we should handle mouse leave:
                    if (contentItem.reactsOnMouse && contentItem.isMouseIn && contentItem.onmouseleave) {
                        contentItem.onmouseleave(pv, e);
                        contentItem.isMouseIn = false;
                    }
                }
                else { // we should chech whether mouse is inside or outside of the contentItem
                    var inside = contentItem.isInside(pv);
                    forceOutside = !inside; // for further handle of event in children of this content item
                    // We should invoke mousemove, mouseenter, mouseleave handlers
                    if (contentItem.reactsOnMouse) {
                        if (inside) {
                            if (contentItem.isMouseIn) {
                                if (contentItem.onmousemove) contentItem.onmousemove(pv, e);
                                if (contentItem.onmousehover)
                                    mouseInStack.push(contentItem);
                            } else {
                                contentItem.isMouseIn = true;
                                if (contentItem.onmouseenter) contentItem.onmouseenter(pv, e);
                            }
                        } else { // mouse is outside of the area
                            if (contentItem.isMouseIn) {
                                contentItem.isMouseIn = false;
                                if (contentItem.onmouseleave) contentItem.onmouseleave(pv, e);
                            } else {
                                if (contentItem.onmousemove) contentItem.onmousemove(pv, e);
                            }
                        }
                    }
                    contentItem.isMouseIn = inside; // save that mouse was inside this contentItem
                }
                // Every child handles the event
                for (var i = 0; i < contentItem.children.length; i++) {
                    var child = contentItem.children[i];
                    if (!forceOutside || child.isMouseIn) // if mouse is outside of this element (hence of its children), at most we just should                                                           
                        _mouseMoveNode(child, forceOutside, pv); // call mouseleave or do nothing within that branch of the tree.
                }
            };

            // Start handling the event from root element
            _mouseMoveNode(this._layersContent, false, posv);

            // Notifying the deepest timeline which has mouse hover
            if (mouseInStack.length == 0) {
                if (this.hovered && this.hovered.onmouseunhover) {
                    this.hovered.onmouseunhover(posv, e);
                    this.hovered = null;
                }
            }
            for (var n = mouseInStack.length; --n >= 0; ) {
                if (mouseInStack[n].onmousehover) {
                    mouseInStack[n].onmousehover(posv, e);
                    if (this.hovered && this.hovered != mouseInStack[n] && this.hovered.onmouseunhover)
                        this.hovered.onmouseunhover(posv, e);
                    this.hovered = mouseInStack[n];
                    break;
                }
            }

            // update tooltip for currently tooltiped infodot|t if tooltip is enabled for this infodot|timeline
            if ((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true)
			|| (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && tooltipMode != "infodot")) {

                var obj = null;

                if (tooltipMode == 'infodot') obj = this.currentlyHoveredInfodot;
                else if (tooltipMode == 'timeline') obj = this.currentlyHoveredTimeline;

                if (obj != null) {
                    // show tooltip if it is not shown yet
                    if (obj.tooltipIsShown == false) {
                        obj.tooltipIsShown = true;
                        animationTooltipRunning = $('.bubbleInfo').fadeIn();
                    }
                }
                // update position of tooltip
                this.updateTooltipPosition(posv);
            }

            // last mouse move event
            this.lastEvent = e;
        },
        // Returns last mouse move event
        getLastEvent: function () {
            return this.lastEvent;
        },
        // Returns root of the element tree.
        getLayerContent: function () {
            return this._layersContent;
        },

        // Recursively finds and returns an element with given id.
        // If not found, returns null.
        findElement: function (id) {
            var rfind = function (el, id) {
                if (el.id === id) return el;
                if (!el.children) return null;
                var n = el.children.length;
                for (var i = 0; i < n; i++) {
                    var child = el.children[i];
                    if (child.id === id) return child;
                }
                for (var i = 0; i < n; i++) {
                    var child = el.children[i];
                    var res = rfind(child, id);
                    if (res) return res;
                }
                return null;
            }

            return rfind(this._layersContent, id);
        },

        // Destroys the widget.
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

        /* Produces {Left,Right,Top,Bottom} object which corresponds to visible region in virtual space, using current viewport.
        */
        _visibleToViewBox: function (visible) {
            var view = this.getViewport();
            var w = view.widthScreenToVirtual(view.width);
            var h = view.heightScreenToVirtual(view.height);
            var x = visible.centerX - w / 2;
            var y = visible.centerY - h / 2;
            return { Left: x, Right: x + w, Top: y, Bottom: y + h };
        },

        /* Updates and renders a visible region in virtual space that corresponds to a physical window.
        @param newVisible   (VisibleRegion2d) New visible region.
        @remarks Rebuilds the current viewport.
        */
        setVisible: function (newVisible, isInAnimation) {
            delete this.viewport; // invalidating old viewport
            this.options.visible = newVisible; // setting new visible region
            this.isInAnimation = isInAnimation && isInAnimation.isActive;

            // rendering canvas (we should update the image because of new visible region)
            var viewbox_v = this._visibleToViewBox(newVisible); // visible region in appropriate format
            var viewport = this.getViewport();
            this._renderCanvas(this._layersContent, viewbox_v, viewport);
        },

        /* Update viewport's physical width and height in correspondence with the <div> element.        
        @remarks The method should be called when the <div> element, which hosts the virtual canvas, resizes.
        It sets width and height attributes of layers' <div> and <canvas> to width and height of the widget's <div>, and
        then updates visible region and renders the content.
        */
        updateViewport: function () {
            // updating width and height of layers' <canvas>-es in accordance with actual size of widget's <div>.
            var size = this._getClientSize();
            var n = this._layers.length;
            for (var i = 0; i < n; i++) {
                var layer = this._layers[i]; // jq to <div> element
                layer.width(size.width)
                     .height(size.height);
                var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                if (canvas) {
                    canvas.width = size.width;
                    canvas.height = size.height;
                }
            }

            // update canvas width and height
            this.canvasWidth = $("#vc").width();
            this.canvasHeight = $("#vc").height();

            this.setVisible(this.options.visible);
        },

        /* Produces {width, height} object from actual width and height of widget's <div> (in pixels).
        */
        _getClientSize: function () {
            return { width: this.element[0].clientWidth,
                height: this.element[0].clientHeight
            };
        },

        /* Gets current viewport.
        @remarks The widget caches viewport as this.viewport property and rebuilds it only when it is invalidated, i.e. this.viewport=undefined.
        Viewport is currently invalidated by setVisible and updateViewport methods.
        */
        getViewport: function () {
            if (!this.viewport) {
                var size = this._getClientSize();
                var o = this.options;
                this.viewport = new Viewport2d(o.aspectRatio, size.width, size.height, o.visible);
            }
            return this.viewport;
        },

        /* Renders elements tree on all layers' canvases.
        @param elementsRoot     (CanvasItemsRoot) Root of widget's elements tree
        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in virtual space
        @param viewport         (Viewport2d) current viewport
        @todo                   Possible optimization is to render only actually updated layers.
        */
        _renderCanvas: function (elementsRoot, visibleBox_v, viewport) {
            var n = this._layers.length;
            if (n == 0) return;
            // first we get 2d contexts for each layers' canvas:
            var contexts = {};
            for (var i = 0; i < n; i++) {
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

        /* Renders the virtual canvas content.
        */
        invalidate: function () {
            var viewbox_v = this._visibleToViewBox(this.options.visible);
            var viewport = this.getViewport();

            this._renderCanvas(this._layersContent, viewbox_v, viewport);
        },
        /*
        Fires the trigger that currently observed (the visible region is inside this timeline) timeline is changed
        */
        breadCrumbsChanged: function () {
            this.breadCrumbsChengedEvent.breadCrumbs = this.breadCrumbs;
            this.element.trigger(this.breadCrumbsChengedEvent);
        }
        ,
        /* If virtual canvas is during animation now, the method does nothing;
        otherwise, it sets the timeout to invalidate the image.
        */
        requestInvalidate: function () {
            if (this.isInAnimation) return;

            this.isInAnimation = true;
            var self = this;
            setTimeout(function () {
                self.isInAnimation = false;
                self.invalidate();
            }, 1000.0 / targetFps); // 1/targetFps sec (targetFps is defined in a settings.js)
        },

        options: {
            aspectRatio: 1, /* (number)    how many h-units are in a single time unit */
            visible: { centerX: 0, centerY: 0, scale: 1} /* (VisibleRegion2d) describes the visible region */
        }
    });

} (jQuery));

// todo: temporarily fixes bug in jQuery (http://stackoverflow.com/questions/7825448/webkit-issues-with-event-layerx-and-event-layery)
// it is fixed in jQuery 1.7
(function ($) {
	// remove layerX and layerY
	var all = $.event.props,
        len = all.length,
        res = [];
	while (len--) {
		var el = all[len];
		if (el != 'layerX' && el != 'layerY') res.push(el);
	}
	$.event.props = res;
} (jQuery));
