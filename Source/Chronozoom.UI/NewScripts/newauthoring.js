var CZ = (function (CZ, $, document) {
    var Authoring = CZ.Authoring = CZ.Authoring || {};

    // NOTE: This is a temporary "_" in the beginning of
    //       Authoring fields and methods, while the code is
    //       migrating from Authoring prototype to production.
    //       It's necessary because the same Authoring object
    //       extended using jQuery.extend() method.
    //       It will be easily removed using "Find & Replace".
    $.extend(Authoring, {
        _isActive: false,
        mode: null,
        _isDragging: false,
        _prevPosition: null,
        _draggedObject: null,
        _startPoint: null,
        showCreateTimelineForm: null,

        initialize: function (vc, formHandlers) {
            var that = this;
            var vcwidget = vc.data("ui-virtualCanvas");

            vcwidget.element.on("mousedown", function (event) {
                if (that._isActive) {
                    that._isDragging = true;
                    that._prevPosition = null;
                
                    if (vcwidget.hovered) {
                        that._draggedObject = vcwidget.hovered;
                    }
                }
            });

            vcwidget.element.on("mouseup", function (event) {
                var viewport = vcwidget.getViewport();
                var origin = getXBrowserMouseOrigin(vcwidget.element, event);
                var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                that._isDragging = false;
                if (that._isActive && that.mode === "createTimeline") {
                    that._createNewRectangle(posv);
                }
            });

            vcwidget.element.on("mousemove", function (event) {
                var viewport = vcwidget.getViewport();
                var origin = getXBrowserMouseOrigin(vcwidget.element, event);
                var posv = viewport.pointScreenToVirtual(origin.x, origin.y);

                if (that._isDragging) {
                    if (that._isActive && that.mode === "createTimeline") {
                        that._updateNewRectangle(posv);
                    }

                    if (vcwidget.hovered && vcwidget.hovered.onmousehover) {
                        vcwidget.hovered.onmousehover(posv, event);
                    }
                }
            });

            this.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {};
        },

        _updateNewRectangle: function (posv) {
            if (!this._startPoint) {
                this._startPoint = posv;
            }

            if (this._startPoint && this._draggedObject._prevPosition) {
                removeChild(this._draggedObject, "newTimelineRectangle");

                // prevent exceed of horizontal borders
                if (posv.x < this._draggedObject.x)
                    posv.x = this._draggedObject.x;
                if (posv.x > this._draggedObject.x + this._draggedObject.width)
                    posv.x = this._draggedObject.x + this._draggedObject.width;

                // prevent exceed of vertical borders
                if (posv.y < this._draggedObject.y)
                    posv.y = this._draggedObject.y;
                if (posv.y > this._draggedObject.y + this._draggedObject.height)
                    posv.y = this._draggedObject.y + this._draggedObject.height;

                var timelineX = Math.min(this._startPoint.x, posv.x);
                var timelineY = Math.min(this._startPoint.y, posv.y);
                var width = Math.abs(this._startPoint.x - posv.x);
                var height = Math.abs(this._startPoint.y - posv.y);

                // rectangle can go out of parent's boundaries while rapidly creating new timelines. It will throw an exception.
                try {
                    addRectangle(this._draggedObject, this._draggedObject.layerid,
                                 "newTimelineRectangle", timelineX, timelineY,
                                 width, height, this._draggedObject.settings);
                }
                catch (ex) {
                    console.log(ex);
                }
            }

            this._draggedObject._prevPosition = posv;
        },

        _createNewRectangle: function (posv) {
            removeChild(this._draggedObject, "newTimelineRectangle");

            if (!this._draggedObject && !this._draggedObject._prevPosition)
                return;

            if (!this._startPoint)
                return;

            // prevent exceed of horizontal borders
            if (posv.x < this._draggedObject.x)
                posv.x = this._draggedObject.x;
            if (posv.x > this._draggedObject.x + this._draggedObject.width)
                posv.x = this._draggedObject.x + this._draggedObject.width;

            // prevent exceed of vertical borders
            if (posv.y < this._draggedObject.y)
                posv.y = this._draggedObject.y;
            if (posv.y > this._draggedObject.y + this._draggedObject.height)
                posv.y = this._draggedObject.y + this._draggedObject.height;

            var timelineX = Math.min(this._startPoint.x, posv.x);
            var timelineY = Math.min(this._startPoint.y, posv.y);
            var width = Math.abs(this._startPoint.x - posv.x);
            var height = Math.abs(this._startPoint.y - posv.y);

            var intersection = this._checkIntersections(posv);

            timelineX = intersection.timelineX;
            timelineY = intersection.timelineY;
            width = intersection.width;
            height = intersection.height;

            if (width > 0 && height > 0) {
                addTimeline(this._draggedObject, this._draggedObject.layerid, "t_" + this._timelineCount, {
                    timeStart: timelineX,
                    timeEnd: timelineX + width,
                    header: "Timeline " + this._timelineCount,
                    top: timelineY,
                    height: height,
                    fillStyle: this._draggedObject.settings.fillStyle,
                    regime: this._draggedObject.regime,
                    gradientFillStyle: this._draggedObject.settings.gradientFillStyle,
                    lineWidth: this._draggedObject.settings.lineWidth,
                    strokeStyle: timelineStrokeStyle
                });

                this.showCreateTimelineForm();
                this._isActive = null;
            }

            this._draggedObject = null;
            this._startPoint = null;
        },

        _checkIntersections: function (posv) {
            var timelineX = Math.min(this._startPoint.x, posv.x);
            var timelineY = Math.min(this._startPoint.y, posv.y);
            var width = Math.abs(this._startPoint.x - posv.x);
            var height = Math.abs(this._startPoint.y - posv.y);

            var x1 = timelineX, x2 = x1 + width; // left and right X coords of rectangle
            var y1 = timelineY, y2 = y1 + height; // top and bottom Y coords of rectangle

            // skip header object, so first index is 1
            // TODO: check intersection with header obect too
            for (var i = 1; i < this._draggedObject.children.length; i++) {
                var c_x1 = this._draggedObject.children[i].x; // left X coord of child
                var c_x2 = this._draggedObject.children[i].x + this._draggedObject.children[i].width; // right X coord of child
                var c_y1 = this._draggedObject.children[i].y; // top Y coord of child
                var c_y2 = this._draggedObject.children[i].y + this._draggedObject.children[i].height; // bottom Y coord of child

                // horizontal borders of one timelines doesn't exceed horizontal border of another one
                if ((x1 >= c_x1 && x2 <= c_x2) || (c_x1 >= x1 && c_x2 <= x2)) {
                    if (y1 <= c_y2 && y1 > c_y1) { // moving from bottom to top
                        timelineY = c_y2;
                        height = y2 - timelineY;
                    }
                    else if (y2 >= c_y1 && y2 < c_y2) { // moving from top to bottom
                        height = c_y1 - timelineY;
                    }
                }
                    // new timeline intersect right border of another timeline
                else if ((x2 >= c_x1 && x2 < c_x2)) {
                    if (y1 <= c_y2 && y1 > c_y1) { // moving from bottom to top
                        timelineY = c_y2;
                        height = y2 - timelineY;
                    }
                    else if (y2 >= c_y1 && y2 < c_y2) { // moving from top to bottom
                        height = c_y1 - timelineY;
                    }
                }
                    // new timeline intersect left border of another timeline
                else if ((x1 >= c_x1 && x1 < c_x2)) {
                    if (y1 <= c_y2 && y1 > c_y1) { // moving from bottom to top
                        timelineY = c_y2;
                        height = y2 - timelineY;
                    }
                    else if (y2 >= c_y1 && y2 < c_y2) { // moving from top to bottom
                        height = c_y1 - timelineY;
                    }
                }

                if ((y1 >= c_y1 && y2 <= c_y2) || (c_y1 >= y1 && c_y2 <= y2)) {
                    if (x2 >= c_x1 && x2 < c_x2) {
                        width = c_x1 - timelineX;
                    }
                    else if (x1 > c_x1 && x1 <= c_x2) {
                        timelineX = c_x2;
                        width = x2 - timelineX;
                    }
                }
            }

            return {
                timelineX: timelineX,
                timelineY: timelineY,
                width: width,
                height: height
            };
        }
    });

    return CZ;
})(CZ || {}, jQuery, document);