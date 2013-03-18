/// <reference path='cz.settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='bibliography.ts'/>
/// <reference path='urlnav.ts'/>

declare var Seadragon: any;

module ChronoZoom {
    export module VCContent {

        var elementclick = (<any>$).Event("elementclick");
        export function getVisibleForElement(element, scale, viewport) {
            var margin = 2 * (ChronoZoom.Settings.contentScaleMargin ? ChronoZoom.Settings.contentScaleMargin : 0);

	        var width = viewport.width - margin;
	        if (width < 0)
		        width = viewport.width;
	        var scaleX = scale * element.width / width;

	        var height = viewport.height - margin;
	        if (height < 0)
		        height = viewport.height;
	        var scaleY = scale * element.height / height;

	        var vs = { centerX: element.x + element.width / 2.0,
		        centerY: element.y + element.height / 2.0,
		        scale: Math.max(scaleX, scaleY)
	        };

	        return vs;
        }

        var zoomToElementHandler = function (sender, e, scale /* n [time units] / m [pixels] */) {
	        var vp = sender.vc.getViewport();
	        var visible = getVisibleForElement(sender, scale, vp);
	        elementclick.newvisible = visible;
	        elementclick.element = sender;
	        sender.vc.element.trigger(elementclick);
	        return true;
        };


        /*  Represents a base element that can be added to the VirtualCanvas.
        @remarks CanvasElement has extension in virtual space, that enables to check visibility of an object and render it.
        @param vc   (jquery to virtual canvas) note that vc.element[0] is the virtual canvas object
        @param layerid   (any type) id of the layer for this object
        @param id   (any type) id of the object
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @remarks
        If element.isRendered defined and true, the element was actually rendered on a canvas.
        If element.onIsRenderedChanged defined, it is called when isRendered changes.
        */
        function CanvasElement(vc, layerid, id, vx, vy, vw, vh) {
	        this.vc = vc;
	        this.id = id;
	        this.layerid = layerid;
	        this.x = vx;
	        this.y = vy;
	        this.width = vw;
	        this.height = vh;
	        this.children = [];

	        /* Checks whether this object is visible in the given visible box (in virtual space)
	        @param visibleBox_v   ({Left,Top,Right,Bottom}) Visible region in virtual space
	        @returns    True, if visible.
	        */
	        this.isVisible = function (visibleBox_v) {
		        var objRight = this.x + this.width;
		        var objBottom = this.y + this.height;
		        return Math.max(this.x, visibleBox_v.Left) <= Math.min(objRight, visibleBox_v.Right) &&
                            Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
	        };

	        /* Checks whether the given point (virtual) is inside the object
	        (should take into account the shape) */
	        this.isInside = function (point_v) {
		        return point_v.x >= this.x && point_v.x <= this.x + this.width &&
                       point_v.y >= this.y && point_v.y <= this.y + this.height;
	        };

	        /* Renders a CanvasElement.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @param opacity          (float in [0,1]) 0 means transparent, 1 means opaque.
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
	        this.render = function (ctx, visibleBox_v, viewport2d, size_p, opacity) {
	        };
        }


        /* Adds a rectangle as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the rectangle appearance
        */
        var addRectangle = function (element, layerid, id, vx, vy, vw, vh, settings) {
	        return addChild(element, new CanvasRectangle(element.vc, layerid, id, vx, vy, vw, vh, settings), false);
        };

        /* Adds a circle as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param vxc       (number) center x in virtual space
        @param vyc       (number) center y in virtual space
        @param vradius   (number) radius in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the circle appearance
        @remarks 
        The element is always rendered as a circle and ignores the aspect ratio of the viewport.
        For this, circle radius in pixels is computed from its virtual width.
        */
        var addCircle = function (element, layerid, id, vxc, vyc, vradius, settings, suppressCheck) {
	        return addChild(element, new CanvasCircle(element.vc, layerid, id, vxc, vyc, vradius, settings), suppressCheck);
        };

        /* Adds an image as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z    (number) z-index
        @param imgSrc (string) image URI
        @param onload (optional callback function) called when image is loaded
        @param parent (CanvasElement) Parent element, whose children is to be new element.
        */
        var addImage = function (element, layerid, id, vx, vy, vw, vh, imgSrc, onload?) {
	        if (vw <= 0 || vh <= 0) throw "Image size must be positive";
	        return addChild(element, new CanvasImage(element.vc, layerid, id, imgSrc, vx, vy, vw, vh, onload), false);
        };
        var addLodImage = function (element, layerid, id, vx, vy, vw, vh, imgSources, onload?) {
	        if (vw <= 0 || vh <= 0) throw "Image size must be positive";
	        return addChild(element, new CanvasLODImage(element.vc, layerid, id, imgSources, vx, vy, vw, vh, onload), false);
        };
        var addSeadragonImage = function (element, layerid, id, vx, vy, vw, vh, z, imgSrc, onload?) {
	        if (vw <= 0 || vh <= 0) throw "Image size must be positive";
	        return addChild(element, new SeadragonImage(element.vc, /*parent*/element, layerid, id, imgSrc, vx, vy, vw, vh, z, onload), false);
        };


        /* Adds a video as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param videoSource (string) video URI
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        var addVideo = function (element, layerid, id, videoSource, vx, vy, vw, vh, z) {
	        return addChild(element, new CanvasVideoItem(element.vc, layerid, id, videoSource, vx, vy, vw, vh, z), false);
        };

        /* Adds a pdf as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param pdfSource (string) pdf URI
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        var addPdf = function (element, layerid, id, pdfSource, vx, vy, vw, vh, z) {
	        return addChild(element, new CanvasPdfItem(element.vc, layerid, id, pdfSource, vx, vy, vw, vh, z), false);
        };

        /* Adds an audio as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param audioSource (string) audio URI
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param z (number) z-index
        */
        var addAudio = function (element, layerid, id, audioSource, vx, vy, vw, vh, z) {
	        return addChild(element, new CanvasAudioItem(element.vc, layerid, id, audioSource, vx, vy, vw, vh, z), false);
        };

        /*  Adds a text element as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param baseline (number) y coordinate of the baseline in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings     ({ fillStyle, fontName }) Parameters of the text appearance
        @param vw (number) optional width of the text; if undefined, it is automatically asigned to width of the given text line.
        @remarks
        Text width is adjusted using measureText() on first render call. 
        */
        function addText(element, layerid, id, vx, vy, baseline, vh, text, settings, vw?) {
	        return addChild(element, new CanvasText(element.vc, layerid, id, vx, vy, baseline, vh, text, settings, vw), false);
        };

        function addScrollText(element, layerid, id, vx, vy, vw, vh, text, z, settings) {
	        return addChild(element, new CanvasScrollTextItem(element.vc, layerid, id, vx, vy, vw, vh, text, z), false);
        };

        /*  Adds a multiline text element as a child of the given virtual canvas element.
        @param element   (CanvasElement) Parent element, whose children is to be new element.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vh   (number) height of a text
        @param lineWidth (number) width of a line to text output
        @param settings     ({ fillStyle, fontName }) Parameters of the text appearance
        @remarks
        Text width is adjusted using measureText() on first render call. 
        */
        function addMultiLineText(element, layerid, id, vx, vy, baseline, vh, text, lineWidth, settings) {
	        return addChild(element, new CanvasMultiLineTextItem(element.vc, layerid, id, vx, vy, baseline, vh, text, lineWidth), false);
        };



        function turnIsRenderedOff(element) {
	        element.isRendered = false;
	        if (element.onIsRenderedChanged)
		        element.onIsRenderedChanged();
	        var n = element.children.length;
	        for (; --n >= 0; ) {
		        if (element.children[n].isRendered)
			        turnIsRenderedOff(element.children[n]);
	        }
        }


        /* Renders a CanvasElement recursively 
        @param element          (CanvasElement) element to render
        @param contexts         (map<layerid,context2d>) Contexts for layers' canvases.
        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
        @param viewport2d       (Viewport2d) current viewport
        @param opacity          (float in [0,1]) 0 means transparent, 1 means opaque.
        */
        var render = function (element, contexts, visibleBox_v, viewport2d, opacity) {
	        if (!element.isVisible(visibleBox_v)) {
		        if (element.isRendered) turnIsRenderedOff(element);
		        return;
	        }

	        var sz = viewport2d.vectorVirtualToScreen(element.width, element.height);
	        if (sz.y <= ChronoZoom.Settings.renderThreshold || (element.width != 0 && sz.x <= ChronoZoom.Settings.renderThreshold)) { // (width != 0): to render text first time, since it measures its width on first render only
		        if (element.isRendered) turnIsRenderedOff(element);
		        return;
	        }

	        var ctx = contexts[element.layerid];
	        if (element.opacity != null) {
		        opacity *= element.opacity;
	        }

	        // Rendering an element 
	        if (element.isRendered == undefined || !element.isRendered) {
		        element.isRendered = true;
		        if (element.onIsRenderedChanged)
			        element.onIsRenderedChanged();
	        }
	        element.render(ctx, visibleBox_v, viewport2d, sz, opacity);

	        var children = element.children;
	        var n = children.length;
	        for (var i = 0; i < n; i++) {
		        render(children[i], contexts, visibleBox_v, viewport2d, opacity);
	        }
        };

        /* Adds a CanvasElement instance to the children array of this element.
        @param  element     (CanvasElement) new child of this element
        @returns    the added element
        @remarks    Bounding box of element must be included in bounding box of the this element. Otherwise, throws an exception.
        The method must be called within the BeginEdit/EndEdit of the root item.
        */
        var addChild = function (parent, element, suppresCheck) {
            var isWithin = parent.width == Infinity ||
                           (element.x >= parent.x && element.x + element.width <= parent.x + parent.width) &&
                           (element.y >= parent.y && element.y + element.height <= parent.y + parent.height);

	        if (!isWithin)
		        console.log("Child element does not belong to the parent element " + parent.id + " " + element.ID);

	        if (!suppresCheck && !isWithin) throw "Child element does not belong to the parent element";
	        parent.children.push(element);
	        element.parent = parent;
	        return element;
        };

        /* Looks up an element with given id in the children of this element and removes it with its children.
        @param id   (any) id of an element
        @returns    true, if element found and removed; otherwise, false.
        @remarks    The method must be called within the BeginEdit/EndEdit of the root item.
        If a child has onRemove() method, it is called right after removing of the child and clearing of all its children (recursively).
        */
        var removeChild = function (parent, id) {
	        var n = parent.children.length;
	        for (var i = 0; i < n; i++) {
		        var child = parent.children[i];
		        if (child.id == id) {
			        parent.children.splice(i, 1);
			        clear(child);
			        if (child.onRemove) child.onRemove();
			        child.parent = null;
			        return true;
		        }
	        }
	        return false;
        };

        /* Removes all children elements of this object (recursively).
        @remarks    The method must be called within the BeginEdit/EndEdit of the root item.
        For each descendant element that has onRemove() method, the method is called right after its removing and clearing of all its children (recursively).
        */
        function clear(element) {
	        var n = element.children.length;
	        for (var i = 0; i < n; i++) {
		        var child = element.children[i];
		        clear(child);
		        if (child.onRemove) child.onRemove();
		        child.parent = null;
	        }
	        element.children = [];
        };

        /* Finds and returns a child element with given id (no recursion)
        @param id   (any) id of a child element
        @returns    The children object (derived from CanvasContentItem) 
        @exception  if there is no child with the id
        */
        export function getChild(element, id) {
	        var n = element.children.length;
	        for (var i = 0; i < n; i++) {
		        if (element.children[i].id == id) return element.children[i];
	        }
	        throw "There is no child with id [" + id + "]";
        };



        /*****************************************************************************************/
        /* Root element                                                                          */

        /*  A root of an element tree of a VirtualCanvas.
        @param vc   (VirtualCanvas) A virtual canvas that own this element tree.
        @param layerid   (any type) id of the layer for this object
        @param id   (any type) id of the object
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        */
        export function CanvasRootElement(vc, layerid, id, vx, vy, vw, vh) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, vw, vh);

	        /* Overrides base function. Root element is visible when it has at least one child. */
	        this.isVisible = function (visibleBox_v) {
		        return this.children.length != 0;
	        };

	        /* Begins editing of the element tree.
	        @returns This element.
	        @remarks Call BeginEdit prior to modify an element tree. The EndEdit method must be called, when editing is to be completed.
	        The VirtualCanvas is invalidated on EndEdit only.
	        */
	        this.beginEdit = function () {
		        return this;
	        };

	        /* Ends editing of the element tree.
	        @param dontRender   (number) if zero (default value), invalidates and renders the virtual canvas content.
	        @returns This element.
	        @remarks Call BeginEdit prior to modify an element tree. The EndEdit method must be called, when editing is to be completed.
	        The VirtualCanvas is invalidated on EndEdit only, if dontRender is false.
	        */
	        this.endEdit = function (dontRender) {
		        if (!dontRender)
			        this.vc.invalidate();
	        };

	        /* Checks whether the given point (virtual) is inside the object
	        (should take into account the shape) */
	        this.isInside = function (point_v) {
		        return true;
	        };

	        /* Renders a CanvasElement recursively 
	        @param contexts         (map<layerid,context2d>) Contexts for layers' canvases.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        */
	        this.render = function (contexts, visibleBox_v, viewport2d) {
		        this.vc.breadCrumbs = [];
		        if (!this.isVisible(visibleBox_v)) return;
		        var n = this.children.length;
		        for (var i = 0; i < n; i++) {
			        render(this.children[i], contexts, visibleBox_v, viewport2d, 1.0);
		        }

		        if (this.vc.breadCrumbs.length > 0 && (this.vc.recentBreadCrumb == undefined || this.vc.breadCrumbs[vc.breadCrumbs.length - 1].vcElement.title != this.vc.recentBreadCrumb.vcElement.title)) { //the deepest bread crumb is chenged
			        this.vc.recentBreadCrumb = this.vc.breadCrumbs[vc.breadCrumbs.length - 1];
			        this.vc.breadCrumbsChanged();
		        }
		        else {
			        if (this.vc.breadCrumbs.length == 0 && this.vc.recentBreadCrumb != undefined) { //in case of no bread crumbs at all
				        this.vc.recentBreadCrumb = undefined;
				        this.vc.breadCrumbsChanged();
			        }
		        }
	        };
        }
        CanvasRootElement.prototype = CanvasElement;


        /*****************************************************************************************/
        /* Dynamic Level of Details element                                                      */

        /* Gets the zoom level for the given size of an element (in pixels).
        @param size_p           ({x,y}) size of bounding box of this element in pixels
        @returns (number)   zoom level which minimum natural number or zero zl so that max(size_p.x,size_p.y) <= 2^zl
        */
        function getZoomLevel(size_p) {
	        var sz = Math.max(size_p.x, size_p.y);
	        if (sz <= 1) return 0;
	        var zl = (sz & 1) ? 1 : 0;
	        for (var i = 1; i < 32; i++) {
		        sz = sz >>> 1;
		        if (sz & 1) {
			        if (zl > 0) zl = i + 1;
			        else zl = i;
		        }
	        }
	        return zl;
        }

        /* A base class for elements those support different content for different zoom levels.
        @remarks
        Property "removeWhenInvisible" is optional. If set, the content is completely removed every time when isRendered changes from true to false.
        */
        function CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, vw, vh);
	        this.zoomLevel = 0;
	        this.prevContent = null;
	        this.newContent = null;
	        this.asyncContent = null;
	        this.lastRenderTime = 0;

	        var self = this;

	        /* Returns new content elements tree for the given zoom level, if it should change, or null.
	        @returns { zoomLevel: number, content: CanvasElement}, or null.
	        */
	        this.changeZoomLevel = function (currentZoomLevel, newZoomLevel) {
		        return null;
	        }

	        var startTransition = function (newContent) {
		        self.lastRenderTime = new Date();

		        self.prevContent = self.content;
		        self.content = newContent.content;
		        addChild(self, self.content, false);

		        if (self.prevContent) {
			        if (!self.prevContent.opacity)
				        self.prevContent.opacity = 1.0;
			        self.content.opacity = 0.0;
		        }
		        self.zoomLevel = newContent.zoomLevel;
	        };

	        var onAsyncContentLoaded = function () {
		        if (self.asyncContent) {
			        startTransition(self.asyncContent);
			        self.asyncContent = null;
			        delete this.onLoad;
			        self.vc.requestInvalidate();
		        }
	        };

	        /* Renders a rectangle.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) { // todo: consider parent's opacity, too
		        if (this.asyncContent) return; // no animation until async content is loaded for previous zoom level
		        if (!this.prevContent) { // there is not "previous content" now
			        var newZoomLevel = getZoomLevel(size_p);
			        if (this.zoomLevel != newZoomLevel) { // zoom level has changed
				        var newContent = this.changeZoomLevel(this.zoomLevel, newZoomLevel);
				        if (newContent) { // we've got new content 
					        if (newContent.content.isLoading) { // async content
						        this.asyncContent = newContent;
						        newContent.content.onLoad = onAsyncContentLoaded;
					        }
					        else { // sync content
						        startTransition(newContent);
					        }
				        }
			        }
		        }
		        if (this.prevContent) {
			        var renderTime = new Date();
			        var renderTimeDiff = renderTime - self.lastRenderTime;
			        self.lastRenderTime = renderTime;

			        // Override the default contentAppearanceAnimationStep,
			        // instead of being a constant it now depends on the time,
			        // such that each transition animation takes about 1.6 sec.
			        var contentAppearanceAnimationStep = renderTimeDiff / 1600;

			        var doInvalidate = false;
			        var lopacity = this.prevContent.opacity;
			        lopacity = Math.max(0.0, lopacity - contentAppearanceAnimationStep);
			        if (lopacity != this.prevContent.opacity) doInvalidate = true;
			        if (lopacity == 0) { // prevContent can be removed
				        removeChild(this, this.prevContent.id);
				        this.prevContent = null;
			        } else {
				        this.prevContent.opacity = lopacity;
			        }

			        lopacity = this.content.opacity;
			        lopacity = Math.min(1.0, lopacity + contentAppearanceAnimationStep);
			        if (!doInvalidate && lopacity != this.content.opacity) doInvalidate = true;
			        this.content.opacity = lopacity;

			        if (doInvalidate) this.vc.requestInvalidate();
		        }
	        }

	        this.onIsRenderedChanged = function () {
		        if (typeof this.removeWhenInvisible === 'undefined' || !this.removeWhenInvisible) return;
		        if (!this.isRendered) {
			        if (this.asyncContent) { // we're waiting for async operation
				        this.asyncContent = null;
			        }
			        if (this.prevContent) {
				        removeChild(this, this.prevContent.id);
				        this.prevContent = null;
			        }
			        if (this.newContent) {
				        removeChild(this, this.newContent.id);
				        this.newContent.content.onLoad = null;
				        this.newContent = null;
			        }
			        if (this.content) {
				        removeChild(this, this.content.id);
				        this.content = null;
			        }

			        /* Set hasContentItems to false for parent infodot.
			        if (this.parent.hasContentItems != null || this.parent.hasContentItems)
			        this.parent.hasContentItems = false; */

			        this.zoomLevel = 0;
		        }
	        }
        }
        CanvasDynamicLOD.prototype = CanvasElement;


        /*****************************************************************************************/
        /* Primitive elements                                                                    */
        /*  An element which doesn't have visual representation, but can contain other elements.
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        */
        function ContainerElement(vc, layerid, id, vx, vy, vw, vh) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, vw, vh);

	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
	        };
        }
        ContainerElement.prototype = CanvasElement;

        /*  A rectangle element that can be added to a VirtualCanvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle,outline:boolean}) Parameters of the rectangle appearance
        */
        function CanvasRectangle(vc, layerid, id, vx, vy, vw, vh, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.settings = settings;


            /* Renders a rectangle.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var p2 = viewport2d.pointVirtualToScreen(this.x + this.width, this.y + this.height);
                var left = Math.max(0, p.x);
                var top = Math.max(0, p.y);
                var right = Math.min(viewport2d.width, p2.x);
                var bottom = Math.min(viewport2d.height, p2.y);
                if (left < right && top < bottom) {

                    if (this.settings.fillStyle) {
                        var opacity1 = this.settings.gradientOpacity ? opacity * (1 - this.settings.gradientOpacity) : opacity;
                        ctx.globalAlpha = opacity1;
                        ctx.fillStyle = this.settings.fillStyle;
                        ctx.fillRect(left, top, right - left, bottom - top);

                        if (this.settings.gradientOpacity && this.settings.gradientFillStyle) {
                            var lineargradient = ctx.createLinearGradient(left, bottom, right, top);
                            var transparent = "rgba(0, 0, 0, 0)";
                            lineargradient.addColorStop(0, this.settings.gradientFillStyle);
                            lineargradient.addColorStop(1, transparent);

                            ctx.globalAlpha = opacity * this.settings.gradientOpacity;
                            ctx.fillStyle = lineargradient;
                            ctx.fillRect(left, top, right - left, bottom - top);
                        }
                    }

                    ctx.globalAlpha = opacity;
                    if (this.settings.strokeStyle) {
                        ctx.strokeStyle = this.settings.strokeStyle;
                        if (this.settings.lineWidth) {
                            if (this.settings.isLineWidthVirtual) { // in virtual coordinates
                                ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                            } else {
                                ctx.lineWidth = this.settings.lineWidth; // in pixels
                            }
                        }
                        else ctx.lineWidth = 1;
                        var lineWidth2 = ctx.lineWidth / 2.0;
                        if (this.settings.outline) {
                            p.x += lineWidth2;
                            p.y += lineWidth2;
                            top += lineWidth2;
                            bottom -= lineWidth2;
                            left += lineWidth2;
                            right -= lineWidth2;
                            p2.x -= lineWidth2;
                            p2.y -= lineWidth2;
                        }

                        if (p.x > 0) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, top - lineWidth2);
                            ctx.lineTo(p.x, bottom + lineWidth2);
                            ctx.stroke();
                        }
                        if (p.y > 0) {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p.y);
                            ctx.lineTo(right + lineWidth2, p.y);
                            ctx.stroke();
                        }
                        if (p2.x < viewport2d.width) {
                            ctx.beginPath();
                            ctx.moveTo(p2.x, top - lineWidth2);
                            ctx.lineTo(p2.x, bottom + lineWidth2);
                            ctx.stroke();
                        }
                        if (p2.y < viewport2d.height) {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p2.y);
                            ctx.lineTo(right + lineWidth2, p2.y);
                            ctx.stroke();
                        }
                    }
                }
            };
        }
        CanvasRectangle.prototype = CanvasElement;

        /*  A Timeline element that can be added to a VirtualCanvas (Rect + caption + bread crumbs tracing).
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the rectangle appearance
        */
        function CanvasTimeline(vc, layerid, id, vx, vy, vw, vh, settings, timelineinfo) {
	        this.base = CanvasRectangle;
	        this.base(vc, layerid, id, vx, vy, vw, vh);
	        this.settings = settings;
	        this.parent = undefined;
	        this.currentlyObservedTimelineEvent = vc.currentlyObservedTimelineEvent;
	        this.settings.outline = true;
	        this.type = 'timeline';

	        var width = timelineinfo.timeEnd - timelineinfo.timeStart;

	        var headerSize = timelineinfo.titleRect ? timelineinfo.titleRect.height : ChronoZoom.Settings.timelineHeaderSize * timelineinfo.height;
	        var marginLeft = timelineinfo.titleRect ? timelineinfo.titleRect.marginLeft : ChronoZoom.Settings.timelineHeaderMargin * timelineinfo.height; // size of left and top margins (e.g. if timeline is for 100 years, relative margin timelineHeaderMargin=0.05, then absolute margin is 5 years).
	        var marginTop = timelineinfo.titleRect ? timelineinfo.titleRect.marginTop : (1 - ChronoZoom.Settings.timelineHeaderMargin) * timelineinfo.height - headerSize;
	        var baseline = timelineinfo.top + marginTop + headerSize / 2.0;

	        this.titleObject = addText(this, layerid, id + "__header__", timelineinfo.timeStart + marginLeft, timelineinfo.top + marginTop, baseline, headerSize,
                timelineinfo.header, { fontName: ChronoZoom.Settings.timelineHeaderFontName, fillStyle: ChronoZoom.Settings.timelineHeaderFontColor, textBaseline: 'middle' });

	        this.title = this.titleObject.text;
	        this.regime = timelineinfo.regime;
	        this.settings.gradientOpacity = 0;
	        this.settings.gradientFillStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : ChronoZoom.Settings.timelineBorderColor;

	        this.reactsOnMouse = true;

	        this.tooltipEnabled = true; //enable tooltips to timelines
	        this.tooltipIsShown = false; // indicates whether tooltip is shown or not

	        this.onmouseclick = function (e) { return zoomToElementHandler(this, e, 1.0); };
	        this.onmousehover = function (pv, e) {
		        //previous timeline also hovered and mouse leave don't appear, hide it
		        //if infodot is null or undefined, we should stop animation
		        //if it's ok, infodot's tooltip don't wink
	            if (this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id != id) {
                    try {
	                    this.vc.currentlyHoveredInfodot.id;
	                }
	                catch (ex) {
	                    ChronoZoom.Common.stopAnimationTooltip();
	                    this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
	                }
	            }

	            //make currentTimeline to this
	            this.vc.currentlyHoveredTimeline = this;

	            this.settings.strokeStyle = ChronoZoom.Settings.timelineHoveredBoxBorderColor;
	            this.settings.lineWidth = ChronoZoom.Settings.timelineHoveredLineWidth;
	            this.titleObject.settings.fillStyle = ChronoZoom.Settings.timelineHoveredHeaderFontColor;
	            this.settings.hoverAnimationDelta = 3 / 60.0;
	            this.vc.requestInvalidate();

	            //if title is not in visible region, try to eval its screenFontSize using 
	            //formula based on height of its parent timeline
	            if (this.titleObject.initialized == false) {
	                var vp = this.vc.getViewport();
	                this.titleObject.screenFontSize = ChronoZoom.Settings.timelineHeaderSize * vp.heightVirtualToScreen(this.height);
	            }

		        //if timeline title is small, show tooltip
	            if (this.titleObject.screenFontSize <= ChronoZoom.Settings.timelineTooltipMaxHeaderSize)
	                this.tooltipEnabled = true;
	            else
	                this.tooltipEnabled = false;

	            if (ChronoZoom.Common.tooltipMode != "infodot") {

	                ChronoZoom.Common.tooltipMode = "timeline";

	                if (this.tooltipEnabled == false) {
	                    ChronoZoom.Common.stopAnimationTooltip();
	                    this.tooltipIsShown = false;
	                    return;
	                }

	                // show tooltip if it is enabled and is not shown yet
	                if (this.tooltipIsShown == false) {
	                    switch (this.regime) {
	                        case "Cosmos": $(".bubbleInfo").attr("id", "cosmosRegimeBox");
	                            break;

	                        case "Earth": $(".bubbleInfo").attr("id", "earthRegimeBox");
	                            break;

	                        case "Life": $(".bubbleInfo").attr("id", "lifeRegimeBox");
	                            break;

	                        case "Pre-history": $(".bubbleInfo").attr("id", "prehistoryRegimeBox");
	                            break;

	                        case "Humanity": $(".bubbleInfo").attr("id", "humanityRegimeBox");
	                            break;
	                    }

	                    $(".bubbleInfo span").text(this.title);
	                    this.panelWidth = $('.bubbleInfo').outerWidth(); // complete width of tooltip panel
	                    this.panelHeight = $('.bubbleInfo').outerHeight(); // complete height of tooltip panel  

	                    this.tooltipIsShown = true;
	                    ChronoZoom.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
	                }
	            }
	        };
            this.onmouseunhover = function (pv, e) {
                if (this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id == id) {
                    this.vc.currentlyHoveredTimeline = null;

                    if ((this.tooltipIsShown == true) && (ChronoZoom.Common.tooltipMode=="timeline")) {
		                ChronoZoom.Common.tooltipMode = "default";
		                ChronoZoom.Common.stopAnimationTooltip();
			            $(".bubbleInfo").attr("id", "defaultBox");
			            this.tooltipIsShown = false;    
			        }
                }    

                this.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : ChronoZoom.Settings.timelineBorderColor;
		        this.settings.lineWidth = ChronoZoom.Settings.timelineLineWidth;
		        this.titleObject.settings.fillStyle = ChronoZoom.Settings.timelineHeaderFontColor;
		        this.settings.hoverAnimationDelta = -3 / 60.0;
		        this.vc.requestInvalidate();
	        };

	        //saving render call before overriding it
	        this.base_render = this.render;

	        /* Renders a timeline.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {

		        this.titleObject.initialized = false; //disable CanvasText initialized (rendered) option by default

		        if (this.settings.hoverAnimationDelta) {
			        this.settings.gradientOpacity = Math.min(1, Math.max(0, this.settings.gradientOpacity + this.settings.hoverAnimationDelta));
		        }

		        //rendering itself
		        this.base_render(ctx, visibleBox, viewport2d, size_p, opacity);

		        if (this.settings.hoverAnimationDelta) {
			        if (this.settings.gradientOpacity == 0 || this.settings.gradientOpacity == 1)
				        this.settings.hoverAnimationDelta = undefined;
			        else
				        this.vc.requestInvalidate();
		        }

		        var p = viewport2d.pointVirtualToScreen(this.x, this.y);
		        var p2 = { x: p.x + size_p.x, y: p.y + size_p.y };

		        // is center of canvas inside timeline
		        var isCenterInside = viewport2d.visible.centerX - ChronoZoom.Settings.timelineCenterOffsetAcceptableImplicity <= this.x + this.width &&
                                     viewport2d.visible.centerX + ChronoZoom.Settings.timelineCenterOffsetAcceptableImplicity >= this.x &&
                                     viewport2d.visible.centerY - ChronoZoom.Settings.timelineCenterOffsetAcceptableImplicity <= this.y + this.height &&
                                     viewport2d.visible.centerY + ChronoZoom.Settings.timelineCenterOffsetAcceptableImplicity >= this.y;

		        // is timeline inside "breadcrumb offset box"
		        var isVisibleInTheRectangle = ((p.x < ChronoZoom.Settings.timelineBreadCrumbBorderOffset && p2.x > viewport2d.width - ChronoZoom.Settings.timelineBreadCrumbBorderOffset) ||
                                (p.y < ChronoZoom.Settings.timelineBreadCrumbBorderOffset && p2.y > viewport2d.height - ChronoZoom.Settings.timelineBreadCrumbBorderOffset));

		        if (isVisibleInTheRectangle && isCenterInside) {
			        var length = vc.breadCrumbs.length;
			        if (length > 1)
				        if (vc.breadCrumbs[length - 1].vcElement.parent.id == this.parent.id)
					        return;
			        vc.breadCrumbs.push(
                    {
            	        vcElement: this
                    });
		        }
	        }
        }
        CanvasTimeline.prototype = CanvasRectangle;

        /*  A circle element that can be added to a VirtualCanvas.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param vxc       (number) center x in virtual space
        @param vyc       (number) center y in virtual space
        @param vradius   (number) radius in virtual space
        @param settings  ({strokeStyle,lineWidth,fillStyle}) Parameters of the circle appearance
        @remarks 
        The element is always rendered as a circle and ignores the aspect ratio of the viewport.
        For this, circle radius in pixels is computed from its virtual width.
        */
        function CanvasCircle(vc, layerid, id, vxc, vyc, vradius, settings) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vxc - vradius, vyc - vradius, 2.0 * vradius, 2.0 * vradius);
	        this.settings = settings;
	        this.isObservedNow = false; //whether the circle is the largest circle under exploration,
	        //that takes large enough rendering space according to infoDotAxisFreezeThreshold var in settings.js

	        /* Renders a circle.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        var rad = this.width / 2.0;
		        var xc = this.x + rad;
		        var yc = this.y + rad;
		        var p = viewport2d.pointVirtualToScreen(xc, yc);
		        var radp = viewport2d.widthVirtualToScreen(rad);

		        ctx.globalAlpha = opacity;
		        ctx.beginPath();
		        ctx.arc(p.x, p.y, radp, 0, Math.PI * 2, true);

		        if (this.settings.strokeStyle) {
			        ctx.strokeStyle = this.settings.strokeStyle;
			        if (this.settings.lineWidth) {
				        if (this.settings.isLineWidthVirtual) { // in virtual coordinates
					        ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
				        } else {
					        ctx.lineWidth = this.settings.lineWidth; // in pixels
				        }
			        }
			        else ctx.lineWidth = 1;
			        ctx.stroke();
		        }
		        if (this.settings.fillStyle) {
			        ctx.fillStyle = this.settings.fillStyle;
			        ctx.fill();
		        }
	        };

	        /* Checks whether the given point (virtual) is inside the object
	        (should take into account the shape) */
	        this.isInside = function (point_v) {
		        var len2 = ChronoZoom.Common.sqr(point_v.x - vxc) + ChronoZoom.Common.sqr(point_v.y - vyc);
		        return len2 <= vradius * vradius;
	        };
        }
        CanvasCircle.prototype = CanvasElement;


        /*A popup window element
        */
        function addPopupWindow(url, id, width, height, scrollbars, resizable) {
	        var w = width;
	        var h = height;
	        var s = scrollbars;
	        var r = resizable;
	        var features = 'width=' + w + ',height=' + h + ',scrollbars=' + s + ',resizable=' + r;
	        window.open(url, id, features);
        }

        /*
        Draws text by scaling canvas to match fontsize rather than change fontsize.
        This behaviour minimizes text shaking in chrome.
        */
        function drawText(text, ctx, x, y, fontSize, fontName) {
            var br = (<any>$).browser;
            var isIe9 = br.msie && parseInt(br.version, 10) >= 9;

            if (isIe9) {
                ctx.font = fontSize + "pt " + fontName;
                ctx.fillText(text, x, y);
            } else {
                var baseFontSize = 12;
                var targetFontSize = fontSize;
                var s = targetFontSize / baseFontSize;

                ctx.scale(s, s);
                ctx.font = baseFontSize + "pt " + fontName;
                ctx.fillText(text, x / s, y / s);
                ctx.scale(1 / s, 1 / s);
            }
        }

        /*  A text element on a virtual canvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param baseline (number) y coordinate of the baseline in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param settings     ({ fillStyle, fontName, textAlign, textBaseLine, wrapText, numberOfLines, adjustWidth }) Parameters of the text appearance
        @param vw (number) optional width of the text; if undefined, it is automatically asigned to width of the given text line.
        @remarks
        Text width is adjusted using measureText() on first render call. 
        If textAlign is center, then width must be provided.
        */
        function CanvasText(vc, layerid, id, vx, vy, baseline, vh, text, settings, wv) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, wv ? wv : 0, vh);  // proper text width will be computed on first render
	        this.text = text;
	        this.baseline = baseline;
	        this.settings = settings;

	        if (typeof this.settings.textBaseline != 'undefined' &&
                this.settings.textBaseline === 'middle') {
		        this.baseline = this.y + this.height / 2;
	        }

	        this.initialized = false;
	        this.screenFontSize = 0; //not initialized

	        /* Renders text.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        var p = viewport2d.pointVirtualToScreen(this.x, this.y);
		        var bp = viewport2d.pointVirtualToScreen(this.x, this.baseline).y;

		        ctx.globalAlpha = opacity;
		        ctx.fillStyle = this.settings.fillStyle;
		        var fontSize = size_p.y;
		        var k = 1.5;

		        if (this.screenFontSize != fontSize)
			        this.screenFontSize = fontSize;

		        // initialization
		        if (!this.initialized) {
			        if (this.settings.wrapText) {
				        var numberOfLines = this.settings.numberOfLines ? this.settings.numberOfLines : 1;
				        this.settings.numberOfLines = numberOfLines;
				        fontSize = size_p.y / numberOfLines / k;

				        while (true) { // adjusting font size
					        ctx.font = fontSize + "pt " + this.settings.fontName; // assign it here to measure text in next lines

					        // Splitting the text into lines 
					        var mlines = this.text.split('\n');
					        var textHeight = 0;
					        var lines = [];

					        for (var il = 0; il < mlines.length; il++) {
						        var words = mlines[il].split(' ');
						        var lineWidth = 0;
						        var currentLine = '';
						        var wsize;
						        var space = ctx.measureText(' ').width;
						        for (var iw = 0; iw < words.length; iw++) {
							        wsize = ctx.measureText(words[iw]);
							        var newWidth = lineWidth == 0 ? lineWidth + wsize.width : lineWidth + wsize.width + space;
							        if (newWidth > size_p.x && lineWidth > 0) { // goes out of the limit width
								        lines.push(currentLine);
								        lineWidth = 0;
								        textHeight += fontSize * k;
								        iw--;
								        currentLine = '';
							        } else {
								        // we're still within the limit
								        if (currentLine === '') currentLine = words[iw];
								        else currentLine += ' ' + words[iw];
								        lineWidth = newWidth;
							        }
						        }
						        lines.push(currentLine);
						        textHeight += fontSize * k;
					        }

					        if (textHeight > size_p.y) { // we're out of vertical limit
						        fontSize /= 1.5;
					        } else {
						        this.text = lines;
						        var fontSizeVirtual = viewport2d.heightScreenToVirtual(fontSize);
						        this.settings.fontSizeVirtual = fontSizeVirtual;
						        break; // done.
					        }
				        }

				        this.screenFontSize = fontSize; // try to save fontSize

			        } else { // no wrap
				        ctx.font = fontSize + "pt " + this.settings.fontName; // assign it here to measure text in next lines

				        this.screenFontSize = fontSize; // try to save fontSize

				        if (this.width == 0) { // first render call
					        var size = ctx.measureText(this.text);
					        size_p.x = size.width;
					        this.width = viewport2d.widthScreenToVirtual(size.width);
				        } else { // we have width for the text so we adjust font size to fit the text
					        var size = ctx.measureText(this.text);
					        if (size.width > size_p.x) {
						        this.height = this.width * size_p.y / size.width;
						        if (this.settings.textBaseline === 'middle') {
							        this.y = this.baseline - this.height / 2;
						        }
						        fontSize = viewport2d.heightVirtualToScreen(this.height);

						        this.screenFontSize = fontSize; // try to save fontSize
					        }
					        else if (typeof this.settings.adjustWidth && this.settings.adjustWidth) { // we have to adjust the width of the element to be equal to real text width
						        var nwidth = viewport2d.widthScreenToVirtual(size.width);

						        if (this.settings.textAlign === 'center') {
							        this.x = this.x + (this.width - nwidth) / 2;
						        } else if (this.settings.textAlign === 'right') {
							        this.x = this.x + this.width - nwidth;
						        }
						        this.width = nwidth;

						        p = viewport2d.pointVirtualToScreen(this.x, this.y);
						        size_p.x = viewport2d.widthVirtualToScreen(this.width);
					        }
				        }
			        }
			        this.initialized = true;
		        } // eof initialization

		        // Rendering text
		        if (this.settings.textAlign) {
			        ctx.textAlign = this.settings.textAlign;
			        if (this.settings.textAlign === 'center')
				        p.x = p.x + size_p.x / 2.0;
			        else if (this.settings.textAlign === 'right')
				        p.x = p.x + size_p.x;
		        }

		        if (!this.settings.wrapText) {
		            if (this.settings.textBaseline)
		                ctx.textBaseline = this.settings.textBaseline;

		            drawText(this.text, ctx, p.x, bp, fontSize, this.settings.fontName);
		        } else { // multiline text
		            fontSize = viewport2d.heightVirtualToScreen(this.settings.fontSizeVirtual);
		            this.screenFontSize = fontSize; // try to save fontSize
		            ctx.textBaseline = 'middle';

		            var bp = p.y + fontSize * k / 2;
		            for (var i = 0; i < this.text.length; i++) {
		                drawText(this.text[i], ctx, p.x, bp, fontSize, this.settings.fontName);
		                bp += fontSize * k;
		            }
		        }
	        };

	        this.isVisible = function (visibleBox_v) {
		        var objBottom = this.y + this.height;
		        if (this.width > 0) {
			        var objRight = this.x + this.width;
			        return Math.max(this.x, visibleBox_v.Left) <= Math.min(objRight, visibleBox_v.Right) &&
                            Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
		        } // else we yet do not know the width, so consider the text as visible if
		        return Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
	        };
        }
        CanvasText.prototype = CanvasElement;


        /*  A multiline text element on a virtual canvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vh   (number) height of a text
        @param lineWidth (number) width of a line to text output
        @param settings     ({ fillStyle, fontName }) Parameters of the text appearance
        @remarks
        Text width is adjusted using measureText() on first render call. 
        */
        function CanvasMultiLineTextItem(vc, layerid, id, vx, vy, vh, text, lineWidth, settings) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, vh * 10, vh);  // todo: measure properly text width
	        this.settings = settings;
	        this.text = text;

	        this.render = function (ctx, visibleBox, viewport2d, size_p) {
		        function textOutput(context, text, x, y, lineHeight, fitWidth) {
			        fitWidth = fitWidth || 0;

			        if (fitWidth <= 0) {
				        context.fillText(text, x, y);
				        return;
			        }
			        var words = text.split(' ');
			        var currentLine = 0;
			        var idx = 1;
			        while (words.length > 0 && idx <= words.length) {
				        var str = words.slice(0, idx).join(' ');
				        var w = context.measureText(str).width;
				        if (w > fitWidth) {
					        if (idx == 1) {
						        idx = 2;
					        }
					        context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
					        currentLine++;
					        words = words.splice(idx - 1);
					        idx = 1;
				        }
				        else
				        { idx++; }
			        }
			        if (idx > 0)
				        context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
		        };


		        var p = viewport2d.pointVirtualToScreen(this.x, this.y);
		        ctx.fillStyle = settings.fillStyle;
		        ctx.font = size_p.y + "pt " + settings.fontName;
		        ctx.textBaseline = 'top';
		        var height = viewport2d.heightVirtualToScreen(this.height);
		        textOutput(ctx, this.text, p.x, p.y, height, lineWidth * height);
		        // ctx.fillText(this.text, p.x, p.y);
	        };
        }
        CanvasMultiLineTextItem.prototype = CanvasElement;


        /*  Represents an image on a virtual canvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param onload (optional callback function) called when image is loaded
        @remarks 
        optional property onLoad() is called if defined when the image is loaded and the element is completely initialized.
        */
        function CanvasImage(vc, layerid, id, imageSource, vx, vy, vw, vh, onload?) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, vw, vh);
	        this.onload = onload;

	        this.isLoading = true; // I am async
	        var img = new Image(); // todo: be aware and do not get circular reference here! 
	        this.img = img;
	        this.img.isLoaded = false;

	        var self = this;
	        var onCanvasImageLoad = function (s) { // in FireFox "s" doesn't contain any reference to the image, so we use closure here
		        img['isLoading'] = false;
		        if (!img['isRemoved']) {
			        // adjusting aspect ratio
			        if (img.naturalHeight) {
				        var ar0 = self.width / self.height;
				        var ar1 = img.naturalWidth / img.naturalHeight;
				        if (ar0 > ar1) {
					        // vh ~ img.height, vw is to be adjusted
					        var imgWidth = ar1 * self.height;
					        var offset = (self.width - imgWidth) / 2.0;
					        self.x += offset;
					        self.width = imgWidth;
				        } else if (ar0 < ar1) {
					        // vw ~ img.width, vh is to be adjusted
					        var imgHeight = self.width / ar1;
					        var offset = (self.height - imgHeight) / 2.0;
					        self.y += offset;
					        self.height = imgHeight;
				        }
			        }

			        img['isLoaded'] = true;
			        if (self.onLoad) self.onLoad();
			        self.vc.requestInvalidate();
		        } else {
			        delete img['isRemoved'];
			        delete img['isLoaded'];
		        }
	        };
	        var onCanvasImageLoadError = function (e) {
		        if (!img['isFallback']) {
			        img['isFallback'] = true;
			        img.src = ChronoZoom.Settings.fallbackImageUri;
		        } else {
			        throw "Cannot load an image!";
		        }
	        };

	        this.img.addEventListener("load", onCanvasImageLoad, false);
	        if (onload) this.img.addEventListener("load", onload, false);
	        this.img.addEventListener("error", onCanvasImageLoadError, false);
	        this.img.src = imageSource; // todo: stop image loading if it is not needed anymore (see http://stackoverflow.com/questions/1339901/stop-loading-of-images-with-javascript-lazyload)

	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        if (!this.img.isLoaded) return;
		        var p = viewport2d.pointVirtualToScreen(this.x, this.y);
		        ctx.globalAlpha = opacity;
		        ctx.drawImage(this.img, p.x, p.y, size_p.x, size_p.y);
	        };
	        this.onRemove = function () {
		        this.img.removeEventListener("load", onCanvasImageLoad, false);
		        this.img.removeEventListener("error", onCanvasImageLoadError, false);
		        if (this.onload) this.img.removeEventListener("load", this.onload, false);
		        this.img.isRemoved = true;
		        delete this.img;
	        };
        }
        CanvasImage.prototype = CanvasElement;


        /*  Represents an image on a virtual canvas with support of dynamic level of detail.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param imageSources   [{ zoomLevel, imageSource }] Ordered array of image sources for different zoom levels
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param onload (optional callback function) called when image is loaded
        */
        function CanvasLODImage(vc, layerid, id, imageSources, vx, vy, vw, vh, onload) {
	        this.base = CanvasDynamicLOD;
	        this.base(vc, layerid, id, vx, vy, vw, vh);
	        this.imageSources = imageSources;

	        this.changeZoomLevel = function (currentZoomLevel, newZoomLevel) {
		        var n = this.imageSources.length;
		        if (n == 0) return null;
		        for (; --n >= 0; ) {
			        if (this.imageSources[n].zoomLevel <= newZoomLevel) {
				        if (this.imageSources[n].zoomLevel === currentZoomLevel) return null; // we found the same level as we already have
				        return {
					        zoomLevel: this.imageSources[n].zoomLevel,
					        content: new CanvasImage(vc, layerid, id + "@" + this.imageSources[n].zoomLevel, this.imageSources[n].imageSource, vx, vy, vw, vh, onload)
				        };
			        }
		        }
		        return null;
	        }
        }
        CanvasLODImage.prototype = CanvasDynamicLOD;






        /* A canvas element which can host any of HTML elements.
        @param vc        (jquery to virtual canvas) note that vc.element[0] is the virtual canvas object
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param vx        (number)   x of left top corner in virtual space
        @param vy        (number)   y of left top corner in virtual space
        @param vw        (number)   width of in virtual space
        @param vh        (number)   height of in virtual space
        @param z         (number) z-index
        */
        function CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z) {
	        this.base = CanvasElement;
	        this.base(vc, layerid, id, vx, vy, vw, vh);

	        /* Initializes content of the CanvasDomItem.
	        @param content          HTML element to add to virtual canvas
	        @remarks The method assigns this.content property and sets up the styles of the content. */
	        this.initializeContent = function (content) {
		        this.content = content; // todo: ref to DOM potentially causes memory leak.
		        if (content) {
			        content.style.position = 'absolute';
			        content.style.overflow = 'hidden';
			        content.style.zIndex = z;
		        }
	        }

	        /* This function is called when isRendered changes, i.e. when we stop or start render this element. */
	        this.onIsRenderedChanged = function () {
		        if (!this.content) return;

		        if (this.isRendered) { /* If we start render it, we add the content element to the tree to make it visible */
			        if (!this.content.isAdded) {
				        this.vc.element[0].appendChild(this.content);
				        this.content.isAdded = true;
			        }
			        this.content.style.display = 'block';
		        }
		        else {
			        /* If we stop render it, we make it invisible */
			        this.content.style.display = 'none';
		        }
	        };
	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        if (!this.content) return;
		        var p = viewport2d.pointVirtualToScreen(this.x, this.y);
		        // p.x = p.x + 8; p.y = p.y + 8; // todo: properly position relative to VC and remove this offset

		        //Define screen rectangle
		        var screenTop = 0;
		        var screenBottom = viewport2d.height;
		        var screenLeft = 0;
		        var screenRight = viewport2d.width;

		        //Define clip rectangle. By defautlt, video is not clipped. If video element crawls from screen rect, clip it
		        var clipRectTop = 0, clipRectLeft = 0, clipRectBottom = size_p.y, clipRectRight = size_p.x;

		        //Vertical intersection ([a1,a2] are screen top and bottom, [b1,b2] are iframe top and bottom)
		        var a1 = screenTop; var a2 = screenBottom;
		        var b1 = p.y; var b2 = p.y + size_p.y;
		        var c1 = Math.max(a1, b1); var c2 = Math.min(a2, b2); //[c1,c2] is intersection        
		        if (c1 <= c2) { //clip, if [c1,c2] is not empty (if c1<=c2)
			        clipRectTop = c1 - p.y;
			        clipRectBottom = c2 - p.y;
		        }

		        //Horizontal intersection ([a1,a2] are screen left and right, [b1,b2] are iframe left and right)
		        a1 = screenLeft; a2 = screenRight;
		        b1 = p.x; b2 = p.x + size_p.x;
		        c1 = Math.max(a1, b1); c2 = Math.min(a2, b2); //[c1,c2] is intersection        
		        if (c1 <= c2) { //clip, if [c1,c2] is not empty (if c1<=c2)
			        clipRectLeft = c1 - p.x;
			        clipRectRight = c2 - p.x;
		        }

		        //Finally, reset iframe style.
		        this.content.style.left = p.x + 'px';
		        this.content.style.top = p.y + 'px';
		        this.content.style.width = size_p.x + 'px';
		        this.content.style.height = size_p.y + 'px';
		        this.content.style.clip = 'rect(' + clipRectTop + 'px,' + clipRectRight + 'px,' + clipRectBottom + 'px,' + clipRectLeft + 'px)';
		        this.content.style.opacity = opacity;
		        this.content.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
	        };

	        /* The functions is called when the canvas element is removed from the elements tree */
	        this.onRemove = function () {
		        if (!this.content) return;
		        try {
			        if (this.content.isAdded) {
				        if (this.content.src) this.content.src = ""; // Stop loading content
				        this.vc.element[0].removeChild(this.content);
				        this.content.isAdded = false;
			        }
		        } catch (ex) {
			        alert(ex.Description);
		        }
	        };
        }
        CanvasDomItem.prototype = CanvasElement;


        /*Represents Text block with scroll*/
        /*  Represents an image on a virtual canvas.
        @param videoSrc     video source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        @param settings     Parameters of the appearance
        */
        function CanvasScrollTextItem(vc, layerid, id, vx, vy, vw, vh, text, z) {
	        this.base = CanvasDomItem;
	        this.base(vc, layerid, id, vx, vy, vw, vh, z);

	        //Creating content element
	        //Our text will be drawn on div

	        //To enable overflow:auto effect in IE, we have to use position:relative
	        //But in vccontent we use position:absolute
	        //So, we create "wrapping" div elemWrap, with position:absolute
	        //Inside elemWrap, create child div with position:relative
	        var elem = $("<div id='citext_" + id + "' class='contentItemDescription'></div")
                        .appendTo(vc);
	        elem[0].addEventListener("mousemove", ChronoZoom.Common.preventbubble, false);
            //elem[0].addEventListener("mouseup", ChronoZoom.Common.preventbubble, false);
	        elem[0].addEventListener("mousedown", ChronoZoom.Common.preventbubble, false);
	        elem[0].addEventListener("DOMMouseScroll", ChronoZoom.Common.preventbubble, false);
	        elem[0].addEventListener("mousewheel", ChronoZoom.Common.preventbubble, false);
	        var textElem = $("<div style='position:relative' class='text'></div>")
                        .html(text)
                        .appendTo(elem);

	        //Initialize content
	        this.initializeContent(elem[0]);

	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        //Scale new font size
	            var fontSize = size_p.y / ChronoZoom.Settings.contentItemDescriptionNumberOfLines;
		        elem.css('font-size', fontSize + "px");

		        CanvasScrollTextItem.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);
	        }

	        this.onRemove = function () {
		        CanvasScrollTextItem.prototype.onRemove.call(this);
		        elem[0].removeEventListener("mousemove", ChronoZoom.Common.preventbubble, false);
		        elem[0].removeEventListener("mouseup", ChronoZoom.Common.preventbubble, false);
		        elem[0].removeEventListener("mousedown", ChronoZoom.Common.preventbubble, false);
		        elem[0].removeEventListener("DOMMouseScroll", ChronoZoom.Common.preventbubble, false);
		        elem[0].removeEventListener("mousewheel", ChronoZoom.Common.preventbubble, false);
		        elem = undefined;
	        }
        }
        CanvasScrollTextItem.prototype = CanvasDomItem;




        /*Represents PDF element
        @param pdfSrc     pdf source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        */
        function CanvasPdfItem(vc, layerid, id, pdfSrc, vx, vy, vw, vh, z) {
	        this.base = CanvasDomItem;
	        this.base(vc, layerid, id, vx, vy, vw, vh, z);

	        var elem = document.createElement('iframe');
	        elem.setAttribute("id", id);
	        if (pdfSrc.indexOf('?') == -1)
		        pdfSrc += '?wmode=opaque';
	        else
		        pdfSrc += '&wmode=opaque';
	        elem.setAttribute("src", pdfSrc);
	        elem.setAttribute("visible", 'true');
	        elem.setAttribute("controls", 'true');

	        this.initializeContent(elem);
        }
        CanvasPdfItem.prototype = CanvasDomItem;


        /*Represents video element
        @param videoSrc     video source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        */
        function CanvasVideoItem(vc, layerid, id, videoSrc, vx, vy, vw, vh, z) {
	        this.base = CanvasDomItem;
	        this.base(vc, layerid, id, vx, vy, vw, vh, z);

	        var elem = document.createElement('iframe');
	        elem.setAttribute("id", id);
	        if (videoSrc.indexOf('?') == -1)
		        videoSrc += '?wmode=opaque';
	        else
		        videoSrc += '&wmode=opaque';
	        elem.setAttribute("src", videoSrc);
	        elem.setAttribute("visible", 'true');
	        elem.setAttribute("controls", 'true');

	        this.initializeContent(elem);
        }
        CanvasVideoItem.prototype = CanvasDomItem;

        /*Represents Audio element*/
        /*  Represents an image on a virtual canvas.
        @param audioSrc     audio source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        @param settings     Parameters of the appearance
        */
        function CanvasAudioItem(vc, layerid, id, audioSrc, vx, vy, vw, vh, z) {
	        this.base = CanvasDomItem;
	        this.base(vc, layerid, id, vx, vy, vw, vh, z);

	        var elem = document.createElement('audio');
	        elem.setAttribute("id", id);
	        elem.setAttribute("src", audioSrc);
	        elem.setAttribute("visible", 'true');
	        elem.setAttribute("controls", 'true');
	        this.initializeContent(elem);
        }
        CanvasAudioItem.prototype = CanvasDomItem;

        /*Represents a Seadragon based image
        @param imageSource  image source
        @param vx           x of left top corner in virtual space
        @param vy           y of left top corner in virtual space
        @param vw           width of in virtual space
        @param vh           height of in virtual space
        @param z            z-index
        @param onload       (optional callback function) called when image is loaded
        @oaram parent       parent element, whose child is to be seadragon image.
        */
        function SeadragonImage(vc, parent, layerid, id, imageSource, vx, vy, vw, vh, z, onload) {
            var self = this;
	        this.base = CanvasDomItem;
	        this.base(vc, layerid, id, vx, vy, vw, vh, z);
	        this.onload = onload;
	        this.nAttempts = 0;
	        this.timeoutHandles = [];

	        var container = document.createElement('div');
	        container.setAttribute("id", id);
	        container.setAttribute("style", "color: white"); // color to use for displaying messages
	        this.initializeContent(container);

	        this.viewer = new Seadragon.Viewer(container);
	        this.viewer.elmt.addEventListener("mousemove", ChronoZoom.Common.preventbubble, false);
	        this.viewer.elmt.addEventListener("mousedown", ChronoZoom.Common.preventbubble, false);
	        this.viewer.elmt.addEventListener("DOMMouseScroll", ChronoZoom.Common.preventbubble, false);
	        this.viewer.elmt.addEventListener("mousewheel", ChronoZoom.Common.preventbubble, false);

	        this.viewer.addEventListener("open", function (e) {
		        if (self.onload) self.onload();
		        self.vc.requestInvalidate();
	        });

            this.viewer.addEventListener("resize", function (e) {
                self.viewer.setDashboardEnabled(e.elmt.clientWidth > 250);
            });

            this.onSuccess = function (resp) {
                if (resp.error) {
                    // the URL is malformed or the service is down
                    self.showFallbackImage();
                    return;
                }

                var content = resp.content;
                if (content.ready) {
                    for (var i = 0; i < self.timeoutHandles.length; i++)
                        clearTimeout(self.timeoutHandles[i]);

                    self.viewer.openDzi(content.dzi);
                } else if (content.failed) {
                    self.showFallbackImage();
                } else { // conversion to dzi (deepzoom image format) is in progress
                    if (self.nAttempts < ChronoZoom.Settings.seadragonMaxConnectionAttempts) {
                        self.viewer.showMessage("Loading " + Math.round(100 * content.progress) + "% done.");
                        self.timeoutHandles.push(setTimeout(self.requestDZI, ChronoZoom.Settings.seadragonRetryInterval)); // retry
                    } else {
                        self.showFallbackImage();
                    }
                }
            }

	        this.onError = function () {
                // ajax query failed
	            if (self.nAttempts < ChronoZoom.Settings.seadragonMaxConnectionAttempts) {
		            self.timeoutHandles.push(setTimeout(self.requestDZI, ChronoZoom.Settings.seadragonRetryInterval)); // retry
                } else {
			        self.showFallbackImage();
		        }
	        }

	        this.requestDZI = function () {
	            self.nAttempts++;
	            $.ajax({
	                url: ChronoZoom.Settings.seadragonServiceURL + encodeURIComponent(imageSource),
	                dataType: "jsonp",
	                success: self.onSuccess,
	                error: self.onError
	            });
	        }

	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        if (self.viewer.isFullPage())
			        return;

		        SeadragonImage.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);
		        if (self.viewer.viewport) {
			        self.viewer.viewport.resize({ x: size_p.x, y: size_p.y });
			        self.viewer.viewport.update();
		        }
	        }

	        this.onRemove = function () {
		        self.viewer.close(); // closes any open content
		        SeadragonImage.prototype.onRemove.call(this);
	        }

	        this.showFallbackImage = function () {
		        for (var i = 0; i < self.timeoutHandles.length; i++)
			        clearTimeout(self.timeoutHandles[i]);

		        self.onRemove(); // removes the dom element
		        removeChild(parent, self.id); // removes the cur seadragon object from the scene graph
		        addImage(parent, layerid, id, vx, vy, vw, vh, imageSource);
	        }

	        // run
	        self.requestDZI();
        }
        SeadragonImage.prototype = CanvasDomItem;


        /*******************************************************************************************************/
        /* Timelines                                                                                           */
        /*******************************************************************************************************/
        /* Adds a timeline composite element into a virtual canvas.
        @param element   (CanvasElement) Parent element, whose children is to be new timeline.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param timelineinfo  ({ timeStart (minus number of years BP), timeEnd (minus number of years BP), top (number), height (number),
        header (string), fillStyle (color) })
        @returns         root of the timeline tree
        */
        export function addTimeline(element, layerid, id, timelineinfo) {
	        var width = timelineinfo.timeEnd - timelineinfo.timeStart;
	        var timeline = addChild(element, new CanvasTimeline(element.vc, layerid, id,
                                    timelineinfo.timeStart, timelineinfo.top,
                                    width, timelineinfo.height,
                                    { strokeStyle: timelineinfo.strokeStyle ? timelineinfo.strokeStyle : ChronoZoom.Settings.timelineStrokeStyle, lineWidth: ChronoZoom.Settings.timelineLineWidth, fillStyle: timelineinfo.fillStyle }, timelineinfo), true);
	        return timeline;
        }

        /*******************************************************************************************************/
        /* Infodots & content items                                                                            */
        /*******************************************************************************************************/
        /*  Represents an image on a virtual canvas with support of dynamic level of detail.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param contentItem ({ id, date (string), title (string), description (string), mediaUrl (string), mediaType (string) }) describes content of this content item
        @remarks Supported media types (contentItem.mediaType) are:
        - image
        - video
        - audio
        - pdf
        */
        function ContentItem(vc, layerid, id, vx, vy, vw, vh, contentItem) {
	        this.base = CanvasDynamicLOD;
	        this.base(vc, layerid, id, vx, vy, vw, vh);
	        this.type = 'contentItem';

	        // Building content of the item
	        var titleHeight = vh * ChronoZoom.Settings.contentItemTopTitleHeight * 0.8;
	        var mediaHeight = vh * ChronoZoom.Settings.contentItemMediaHeight;
	        var descrHeight = ChronoZoom.Settings.contentItemFontHeight * vh;

	        var contentWidth = vw * ChronoZoom.Settings.contentItemContentWidth;
	        var leftOffset = (vw - contentWidth) / 2.0;
	        var verticalMargin = vh * ChronoZoom.Settings.contentItemVerticalMargin;

	        var mediaTop = vy + verticalMargin;  //vy + titleHeight + 2 * verticalMargin;
	        var sourceVertMargin = verticalMargin * 0.4;
	        var sourceTop = mediaTop + mediaHeight + sourceVertMargin;
	        var sourceRight = vx + vw - leftOffset;
	        var sourceHeight = vh * ChronoZoom.Settings.contentItemSourceHeight * 0.8;
	        var titleTop = sourceTop + verticalMargin + sourceHeight;

	        // Bounding rectangle
	        var rect = addRectangle(this, layerid, id + "__rect__", vx, vy, vw, vh,
                                    { strokeStyle: ChronoZoom.Settings.contentItemBoundingBoxBorderColor, lineWidth: ChronoZoom.Settings.contentItemBoundingBoxBorderWidth * vw, fillStyle: ChronoZoom.Settings.contentItemBoundingBoxFillColor,
                            	        isLineWidthVirtual: true
                                    });
	        this.reactsOnMouse = true;

	        this.onmouseenter = function (e) {
	            rect.settings.strokeStyle = ChronoZoom.Settings.contentItemBoundingHoveredBoxBorderColor;
		        this.vc.currentlyHoveredContentItem = this;
		        this.vc.requestInvalidate();
	        };

	        this.onmouseleave = function (e) {
	            rect.settings.strokeStyle = ChronoZoom.Settings.contentItemBoundingBoxBorderColor;
		        this.vc.currentlyHoveredContentItem = null;
		        this.isMouseIn = false;
		        this.vc.requestInvalidate();
	        };
	        this.onmouseclick = function (e) {
		        return zoomToElementHandler(this, e, 1.0)
	        };

	        this.changeZoomLevel = function (curZl, newZl) {
	            if (newZl >= ChronoZoom.Settings.contentItemShowContentZoomLevel) { // building content for an infodot
	                if (curZl >= ChronoZoom.Settings.contentItemShowContentZoomLevel) return null;

			        var container = new ContainerElement(vc, layerid, id + "__content", vx, vy, vw, vh);

			        // Media
			        var mediaID = id + "__media__";
			        var imageElem = null;
			        if (contentItem.mediaType === 'image') {
			            imageElem = addSeadragonImage(container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, ChronoZoom.Settings.mediaContentElementZIndex, contentItem.mediaUrl);
			        }
			        else if (contentItem.mediaType === 'video') {
			            addVideo(container, layerid, mediaID, contentItem.mediaUrl, vx + leftOffset, mediaTop, contentWidth, mediaHeight, ChronoZoom.Settings.mediaContentElementZIndex);
			        }
			        else if (contentItem.mediaType === 'audio') {
			            mediaTop += ChronoZoom.Settings.contentItemAudioTopMargin * vh;
			            mediaHeight = vh * ChronoZoom.Settings.contentItemAudioHeight;
			            addAudio(container, layerid, mediaID, contentItem.mediaUrl, vx + leftOffset, mediaTop, contentWidth, mediaHeight, ChronoZoom.Settings.mediaContentElementZIndex);
			        }
			        else if (contentItem.mediaType === 'pdf') {
			            addPdf(container, layerid, mediaID, contentItem.mediaUrl, vx + leftOffset, mediaTop, contentWidth, mediaHeight, ChronoZoom.Settings.mediaContentElementZIndex);
			        }

			        // Title
			        var titleText = contentItem.title;
			        addText(container, layerid, id + "__title__", vx + leftOffset, titleTop, titleTop + titleHeight / 2.0,
                            0.9 * titleHeight, titleText,
                            { fontName: ChronoZoom.Settings.contentItemHeaderFontName, fillStyle: ChronoZoom.Settings.contentItemHeaderFontColor, textBaseline: 'middle', textAlign: 'center',
                    	        wrapText: true, numberOfLines: 1
                            },
                            contentWidth);

			        // Source
			        var sourceText = contentItem.attribution;
			        if (sourceText) {
				        var addSourceText = function (sx, sw, sy) {
					        var sourceItem = addText(container, layerid, id + "__source__", sx, sy, sy + sourceHeight / 2.0,
                            0.9 * sourceHeight, sourceText,
                            { fontName: ChronoZoom.Settings.contentItemHeaderFontName, fillStyle: ChronoZoom.Settings.contentItemSourceFontColor, textBaseline: 'middle', textAlign: 'right',
                    	        adjustWidth: true
                            }, sw);

					        if (contentItem.mediaSource) { // we've got a URL here
						        sourceItem.reactsOnMouse = true;
						        sourceItem.onmouseclick = function (e) {
							        vc.element.css('cursor', 'default');
							        window.open(contentItem.mediaSource);
							        return true;
						        };
						        sourceItem.onmouseenter = function (pv, e) {
						            this.settings.fillStyle = ChronoZoom.Settings.contentItemSourceHoveredFontColor;
							        this.vc.requestInvalidate();
							        this.vc.element.css('cursor', 'pointer');
						        };
						        sourceItem.onmouseleave = function (pv, e) {
						            this.settings.fillStyle = ChronoZoom.Settings.contentItemSourceFontColor;
							        this.vc.requestInvalidate();
							        this.vc.element.css('cursor', 'default');
						        };
					        }
				        }


				        if (imageElem) {
					        imageElem.onLoad = function () {
						        var sx = this.x;
						        var sw = this.width;
						        var sy = this.y + this.height + sourceVertMargin;
						        addSourceText(sx, sw, sy);
						        this.onLoad = null;
					        }
				        } else {
					        addSourceText(vx + leftOffset, contentWidth, sourceTop);
				        }
			        }


			        // Description
			        var descrTop = titleTop + titleHeight + verticalMargin;
			        addScrollText(container, layerid, id + "__description__", vx + leftOffset, descrTop,
                                    contentWidth,
                                    descrHeight,
                                    contentItem.description, 30,
                                    {});

			        return { zoomLevel: ChronoZoom.Settings.contentItemShowContentZoomLevel,
				        content: container
			        };
		        } else { // building thumbnails
			        var zl = newZl;
			        if (zl >= ChronoZoom.Settings.contentItemThumbnailMaxLevel) {
			            if (curZl >= ChronoZoom.Settings.contentItemThumbnailMaxLevel && curZl < ChronoZoom.Settings.contentItemShowContentZoomLevel)
					        return null; // we already show this level
			            zl = ChronoZoom.Settings.contentItemThumbnailMaxLevel;
			        }
			        else if (zl <= ChronoZoom.Settings.contentItemThumbnailMinLevel) {
			            if (curZl <= ChronoZoom.Settings.contentItemThumbnailMinLevel && curZl > 0) return null;
			            zl = ChronoZoom.Settings.contentItemThumbnailMinLevel;
			        }
			        var sz = 1 << zl;
			        var thumbnailUri = ChronoZoom.Settings.contentItemThumbnailBaseUri + 'x' + sz + '/' + contentItem.guid + '.png';
			        return { zoomLevel: newZl,
				        content: new CanvasImage(vc, layerid, id + "@" + 1, thumbnailUri, vx, vy, vw, vh)
			        };
		        }
	        };
        }
        ContentItem.prototype = CanvasDynamicLOD;


        /*  An Infodot element that can be added to a VirtualCanvas.
        @param layerid   (any type) id of the layer for this element
        @param id   (any type) id of an element
        @param vx   (number) x of left top corner in virtual space
        @param vy   (number) y of left top corner in virtual space
        @param vw   (number) width of a bounding box in virtual space
        @param vh   (number) height of a bounding box in virtual space
        @param infodotDescription  ({title}) 
        */

        function CanvasInfodot(vc, layerid, id, time, vyc, radv, contentItems, infodotDescription) {
	        this.base = CanvasCircle;
	        this.base(vc, layerid, id, time, vyc, radv,
                { strokeStyle: ChronoZoom.Settings.infoDotBorderColor, lineWidth: ChronoZoom.Settings.infoDotBorderWidth * radv, fillStyle: ChronoZoom.Settings.infoDotFillColor, isLineWidthVirtual: true });
	        this.contentItems = contentItems;
	        this.hasContentItems = false;

	        contentItems.sort(function (a, b) {
		        return a.order - b.order;
	        });

	        var innerRad = radv - ChronoZoom.Settings.infoDotHoveredBorderWidth * radv;
	        this.outerRad = radv;

	        this.type = 'infodot';
	        this.reactsOnMouse = true;

	        this.tooltipEnabled = true; // indicates whether tooltip is enabled for this infodot at this moment or not
	        this.tooltipIsShown = false; // indicates whether tooltip is shown or not

	        this.onmouseenter = function (e) {
	            this.settings.strokeStyle = ChronoZoom.Settings.infoDotHoveredBorderColor;
	            this.settings.lineWidth = ChronoZoom.Settings.infoDotHoveredBorderWidth * radv;
	            this.vc.requestInvalidate();

	            // clear tooltipIsShown flag for currently hovered timeline
                // it can be null because of mouse events sequence: mouseenter for infodot -> mousehover for timeline -> mouseunhover for timeline 
	            if (this.vc.currentlyHoveredTimeline != null) {
	                // stop active tooltip fadein animation and hide tooltip
	                ChronoZoom.Common.stopAnimationTooltip();
	                this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
	            }

	            $(".bubbleInfo span").text(infodotDescription.title);
	            this.panelWidth = $('.bubbleInfo').outerWidth(); // complete width of tooltip panel
	            this.panelHeight = $('.bubbleInfo').outerHeight(); // complete height of tooltip panel        

	            ChronoZoom.Common.tooltipMode = "infodot"; //set tooltip mode to infodot

	            // start tooltip fadein animation for this infodot
	            if ((this.tooltipEnabled == true) && (this.tooltipIsShown == false)) {
	                this.tooltipIsShown = true;
	                $(".bubbleInfo").attr("id", "defaultBox");
	                ChronoZoom.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
	            }

	            this.vc.cursorPosition = time;
	            this.vc.currentlyHoveredInfodot = this;
	            this.vc._setConstraintsByInfodotHover(this);
	            this.vc.RaiseCursorChanged();
	        };

	        this.onmouseleave = function (e) {
	            this.isMouseIn = false

	            this.settings.strokeStyle = ChronoZoom.Settings.infoDotBorderColor;
	            this.settings.lineWidth = ChronoZoom.Settings.infoDotBorderWidth * radv;
	            this.vc.requestInvalidate();


	            // stop active fadein animation and hide tooltip
	            if (this.tooltipIsShown == true) 
	                ChronoZoom.Common.stopAnimationTooltip();

	            this.tooltipIsShown = false;
	            ChronoZoom.Common.tooltipMode = "default";

	            this.vc.currentlyHoveredInfodot = undefined;
	            this.vc._setConstraintsByInfodotHover(undefined);
	            this.vc.RaiseCursorChanged();
	        };

	        this.onmouseclick = function (e) {
		        return zoomToElementHandler(this, e, 1.0);
	        };

            //Bibliography flag accroding to BUG 215750
	        var bibliographyFlag = true;

	        // Building dynamic LOD content
	        var infodot = this;
	        var root = new CanvasDynamicLOD(vc, layerid, id + "_dlod", time - innerRad, vyc - innerRad, 2 * innerRad, 2 * innerRad);
	        root.removeWhenInvisible = true;
	        addChild(this, root, false);

	        root.firstLoad = true;
	        root.changeZoomLevel = function (curZl, newZl) {



		        // Showing only thumbnails for every content item of the infodot
	            if (newZl >= ChronoZoom.Settings.infodotShowContentThumbZoomLevel && newZl < ChronoZoom.Settings.infodotShowContentZoomLevel) {
	                var URL = ChronoZoom.UrlNav.getURL();
	                if (typeof URL.hash.params != 'undefined' && typeof URL.hash.params['b'] != 'undefined')
	                    bibliographyFlag = false;

	                if (curZl >= ChronoZoom.Settings.infodotShowContentThumbZoomLevel && curZl < ChronoZoom.Settings.infodotShowContentZoomLevel)
				        return null;

			        // Tooltip is enabled now.
			        infodot.tooltipEnabled = true;

			        var contentItem = null;

			        if (infodot.contentItems.length > 0) {
				        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.y, 2 * innerRad, 2 * innerRad);
				        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
				        if (items)
					        for (var i = 0; i < items.length; i++)
						        addChild(contentItem, items[i], false);
			        }

			        if (contentItem) {
				        infodot.hasContentItems = true;
				        return {
					        zoomLevel: newZl,
					        content: contentItem
				        };
			        }
			        else
				        return null;
		        }
		        // Showing all content items, bibliography link and title of the infodot
	            else if (newZl >= ChronoZoom.Settings.infodotShowContentZoomLevel) {



	                if (curZl >= ChronoZoom.Settings.infodotShowContentZoomLevel)
				        return null;

			        // Tooltip is disabled now.
			        infodot.tooltipEnabled = false;

			        // stop active fadein animation and hide tooltip
			        if (infodot.tooltipIsShown == true) {
			            ChronoZoom.Common.stopAnimationTooltip();
				        infodot.tooltipIsShown = false;
			        }

			        var contentItem = null;

			        if (infodot.contentItems.length > 0) {
				        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.y, 2 * innerRad, 2 * innerRad);
				        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
				        if (items)
					        for (var i = 0; i < items.length; i++)
						        addChild(contentItem, items[i], false);
			        }
			        if (contentItem == null)
				        return null;

			        var titleWidth = ChronoZoom.Settings.infodotTitleWidth * radv * 2;
			        var titleHeight = ChronoZoom.Settings.infodotTitleHeight * radv * 2;
			        var centralSquareSize = (270 / 2 + 5) / 450 * 2 * radv;
			        var titleTop = vyc - centralSquareSize - titleHeight;
			        var title = '';

			        if (infodotDescription && infodotDescription.title && infodotDescription.date) {
				        title = infodotDescription.title + '\n(' + infodotDescription.date + ')';
			        }

			        addText(contentItem, layerid, id + "__title", time - titleWidth / 2, titleTop, titleTop, titleHeight,
                        title,
                        { fontName: ChronoZoom.Settings.contentItemHeaderFontName, fillStyle: ChronoZoom.Settings.contentItemHeaderFontColor, textBaseline: 'middle', textAlign: 'center',
                	        wrapText: true, numberOfLines: 2
                        }, titleWidth);

			        var biblBottom = vyc + centralSquareSize + 63.0 / 450 * 2 * radv;
			        var biblHeight = ChronoZoom.Settings.infodotBibliographyHeight * radv * 2;
			        var biblWidth = titleWidth / 3;
			        var bibl = addText(contentItem, layerid, id + "__bibliography", time - biblWidth / 2, biblBottom - biblHeight, biblBottom - biblHeight / 2, biblHeight,
                        "Bibliography",
                        { fontName: ChronoZoom.Settings.contentItemHeaderFontName, fillStyle: ChronoZoom.Settings.timelineBorderColor, textBaseline: 'middle', textAlign: 'center' }, biblWidth);
			        bibl.reactsOnMouse = true;
			        bibl.onmouseclick = function (e) {
				        this.vc.element.css('cursor', 'default');
				        ChronoZoom.Bibliography.showBibliography({ infodot: infodotDescription, contentItems: infodot.contentItems }, contentItem, id + "__bibliography");
				        return true;
			        };
			        bibl.onmouseenter = function (pv, e) {
			            this.settings.fillStyle = ChronoZoom.Settings.infoDotHoveredBorderColor;
				        this.vc.requestInvalidate();
				        this.vc.element.css('cursor', 'pointer');
			        };
			        bibl.onmouseleave = function (pv, e) {
			            this.settings.fillStyle = ChronoZoom.Settings.infoDotBorderColor;
				        this.vc.requestInvalidate();
				        this.vc.element.css('cursor', 'default');
			        };

		            //Parse url for parameter b (bibliography).
			        var bid = window.location.hash.match("b=([a-z0-9_]+)");
			        if (bid && bibliographyFlag) {
			            //bid[0] - source string
			            //bid[1] - found match
			            ChronoZoom.Bibliography.showBibliography({ infodot: infodotDescription, contentItems: infodot.contentItems }, contentItem, bid[1]);
			        }

			        if (contentItem) {
				        infodot.hasContentItems = true;
				        return {
					        zoomLevel: newZl,
					        content: contentItem
				        };
			        }
		        }
		        // Showing thumbnails
		        else {
			        // Tooltip is enabled now.
			        infodot.tooltipEnabled = true;

			        infodot.hasContentItems = false;
			        if (infodot.contentItems.length == 0)
				        return null;

			        var zl = newZl;

			        if (zl <= ChronoZoom.Settings.contentItemThumbnailMinLevel) {
			            if (curZl <= ChronoZoom.Settings.contentItemThumbnailMinLevel && curZl > 0) return null;
			        }
			        if (zl >= ChronoZoom.Settings.contentItemThumbnailMaxLevel) {
			            if (curZl >= ChronoZoom.Settings.contentItemThumbnailMaxLevel && curZl < ChronoZoom.Settings.infodotShowContentZoomLevel) return null; // we are already showing the largest thumbnail available
			            zl = ChronoZoom.Settings.contentItemThumbnailMaxLevel;
			        }
			        if (zl < ChronoZoom.Settings.contentItemThumbnailMinLevel) {
				        return { zoomLevel: zl,
					        content: new ContainerElement(vc, layerid, id + "__empty", time, vyc, 0, 0)
				        };
			        }
			        var contentItem = infodot.contentItems[0];
			        var sz = 1 << zl;
			        var thumbnailUri = ChronoZoom.Settings.contentItemThumbnailBaseUri + 'x' + sz + '/' + contentItem.guid + '.png';
			        var l = innerRad * 260 / 225;
			        return {
				        zoomLevel: zl,
				        content: new CanvasImage(vc, layerid, id + "@" + zl, thumbnailUri, time - l / 2.0, vyc - l / 2.0, l, l)
			        };
		        }

	        };


	        // Applying Jessica's proportions
	        var _rad = 450.0 / 2.0;
	        var k = 1.0 / _rad;
	        var _wc = (252.0 + 0) * k;
	        var _hc = (262.0 + 0) * k;
	        var strokeWidth = 3 * k * radv;
	        var strokeLength = 24.0 * k * radv;
	        var xlt0 = -_wc / 2 * radv + time;
	        var ylt0 = -_hc / 2 * radv + vyc;
	        var xlt1 = _wc / 2 * radv + time;
	        var ylt1 = _hc / 2 * radv + vyc;

	        /* Renders an infodot.
	        @param ctx              (context2d) Canvas context2d to render on.
	        @param visibleBox_v     ({Left,Right,Top,Bottom}) describes visible region in the virtual space
	        @param viewport2d       (Viewport2d) current viewport
	        @param size_p           ({x,y}) size of bounding box of this element in pixels
	        @remarks The method is implemented for each particular VirtualCanvas element.
	        */
	        this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
		        CanvasInfodot.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity); // rendering the circle

		        var sw = viewport2d.widthVirtualToScreen(strokeWidth);
		        if (sw < 0.5) return;

		        var rad = this.width / 2.0;
		        var xc = this.x + rad;
		        var yc = this.y + rad;
		        var radp = size_p.x / 2.0;

		        var sl = viewport2d.widthVirtualToScreen(strokeLength);
		        var pl0 = viewport2d.pointVirtualToScreen(xlt0, ylt0);
		        var pl1 = viewport2d.pointVirtualToScreen(xlt1, ylt1);

		        ctx.lineWidth = sw;
		        ctx.strokeStyle = ChronoZoom.Settings.contentItemBoundingBoxFillColor;

		        // Rendering additional graphics for the infodot
		        ctx.beginPath();
		        ctx.moveTo(pl0.x, pl0.y);
		        ctx.lineTo(pl0.x - sl, pl0.y - sl);
		        ctx.stroke();
		        ctx.beginPath();
		        ctx.moveTo(pl1.x, pl1.y);
		        ctx.lineTo(pl1.x + sl, pl1.y + sl);
		        ctx.stroke();
		        ctx.beginPath();
		        ctx.moveTo(pl0.x, pl1.y);
		        ctx.lineTo(pl0.x - sl, pl1.y + sl);
		        ctx.stroke();
		        ctx.beginPath();
		        ctx.moveTo(pl1.x, pl0.y);
		        ctx.lineTo(pl1.x + sl, pl0.y - sl);
		        ctx.stroke();
	        }
        }
        CanvasInfodot.prototype = CanvasCircle;

        /* 
        @param infodot {CanvasElement}  Parent of the content item
        @param cid  {string}            id of the content item
        Returns {x,y,width,height,parent} of a content item even if it is not presented yet in the infodot children collection.
        */
        export function getContentItem(infodot, cid) {
	        if (infodot.type !== 'infodot' || infodot.contentItems.length === 0) return null;
	        var radv = infodot.width / 2;
	        var innerRad = radv - ChronoZoom.Settings.infoDotHoveredBorderWidth * radv;
	        var citems = buildVcContentItems(infodot.contentItems, infodot.x + infodot.width / 2, infodot.y + infodot.height / 2, innerRad, infodot.vc, infodot.layerid);
	        if (!citems) return null;
	        for (var i = 0; i < citems.length; i++) {
		        if (citems[i].id == cid)
			        return { x: citems[i].x, y: citems[i].y, width: citems[i].width, height: citems[i].height, parent: infodot };
	        }
	        return null;
        }

        /* Adds an infodot composite element into a virtual canvas.
        @param vc        (VirtualCanvas) VirtualCanvas hosting this element
        @param element   (CanvasElement) Parent element, whose children is to be new timeline.
        @param layerid   (any type) id of the layer for this element
        @param id        (any type) id of an element
        @param contentItems (array of { id, date (string), title (string), description (string), mediaUrl (string), mediaType (string) }) content items of the infodot, first is central.
        @returns         root of the content item tree
        */
        export function addInfodot(element, layerid, id, time, vyc, radv, contentItems, infodotDescription) {
	        var infodot = new CanvasInfodot(element.vc, layerid, id, time, vyc, radv, contentItems, infodotDescription);
	        return addChild(element, infodot, true);
        }

        function buildVcContentItems(contentItems, xc, yc, rad, vc, layerid) {
	        var n = contentItems.length;
	        if (n <= 0) return null;
	        n--; // 0th is a central item.

	        var vcitems = [];

	        var _rad = 450.0 / 2.0; //489.0 / 2.0;
	        var k = 1.0 / _rad;
	        var _wc = 260.0 * k;
	        var _hc = 270.0 * k;

	        var _xlc = -_wc / 2 - 38.0 * k;
	        var _xrc = -_xlc;
	        var _lw = 60.0 * k;
	        var _lh = _lw;
	        var lw = _lw * rad;
	        var lh = _lh * rad;

	        var _ytc = -_hc / 2 - 9.0 * k - _lh / 2;
	        var _ybc = -_ytc;

	        // 0th is a central content item
	        vcitems.push(
                new ContentItem(vc, layerid, contentItems[0].id,
                     -_wc / 2 * rad + xc, -_hc / 2 * rad + yc, _wc * rad, _hc * rad,
                     contentItems[0]));

	        var m1 = Math.floor(n / 3);
	        var m2 = n % 3; // n = m1 * n + m2
	        var nL = m1 + (m2 > 0 ? 1 : 0);
	        var nR = m1 + (m2 > 1 ? 1 : 0);
	        //var nT = m1 + (m2 > 2 ? 1 : 0);
	        var nB = m1 + (m2 > 2 ? 1 : 0);

	        var i = 1; // 0th is a central item.
	        // Left field
	        var arrange = arrangeContentItemsInField(nL, _lh);
	        var xl = xc + rad * (_xlc - _lw / 2);
	        for (var j = 0; j < nL; j++, i++) {
		        var ci = contentItems[i];
		        vcitems.push(new ContentItem(vc, layerid, ci.id, xl, yc + rad * arrange[j], lw, lh, ci));
	        }
	        // Bottom field
	        arrange = arrangeContentItemsInField(nB, _lw);
	        var yb = yc + rad * (_ybc - _lh / 2);
	        for (var j = 0; j < nB; j++, i++) {
		        var ci = contentItems[i];
		        vcitems.push(new ContentItem(vc, layerid, ci.id, xc + rad * arrange[j], yb, lw, lh, ci));
	        }
	        // Right field
	        arrange = arrangeContentItemsInField(nR, _lh);
	        var xr = xc + rad * (_xrc - _lw / 2);
	        for (var j = nR; --j >= 0; i++) {
		        var ci = contentItems[i];
		        vcitems.push(new ContentItem(vc, layerid, ci.id, xr, yc + rad * arrange[j], lw, lh, ci));
	        }
	        return vcitems;

	        // Top field (removed in the last Jessica's design, 01/18/2012)
	        //    arrange = arrangeContentItemsInField(nT, _lw);
	        //    var yt = yc + rad * (_ytc - _lh / 2);
	        //    for (var j = 0; j < nT; j++, i++) {
	        //        var ci = contentItems[i];
	        //        vcitems.push(new ContentItem(vc, layerid, ci.id, xc + rad * arrange[j], yt, lw, lh, ci));
	        //    }
        }

        /* Arranges given number of content items in a single part of an infodot, along a single coordinate axis (either x or y).
        @param n    (number) Number of content items to arrange
        @param dx   (number) Size of content item along the axis on which we arrange content items.
        @returns null, if n is 0; array of lefts (tops) for each coordinate item. */
        function arrangeContentItemsInField(n, dx) {
	        if (n == 0) return null;
	        var margin = 0.05 * dx;
	        var x1, x2, x3, x4;
	        if (n % 2 == 0) { // n = 2 or 4
		        // 3 1 2 4
		        x1 = -margin / 2 - dx;
		        x2 = margin / 2;
		        if (n == 4) {
			        x3 = x1 - dx - margin;
			        x4 = x2 + margin + dx;
			        return [x3, x1, x2, x4]
		        }
		        return [x1, x2];
	        }
	        else { // n = 1 or 3
		        // 3 1 2
		        x1 = -dx / 2;
		        if (n > 1) {
			        x2 = dx / 2 + margin;
			        x3 = x1 - dx - margin;
			        return [x3, x1, x2];
		        }
		        return [x1];
	        }
        }
    }
}