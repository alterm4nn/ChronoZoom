var CZ = (function (CZ, $, document) {
    var Authoring = CZ.Authoring = CZ.Authoring || {};

    // TODO: vc variable is global!

    $.extend(Authoring, {
        isTimelineChangeNameWindowVisible: false,
        isDragging: false,
        isActive: false,
        state: null,
        draggedObject: null,
        startPoint: null,
        prevPosition: null,
        direction: null,
        hoveredTimeline: null,
        hoveredInfodot: null,
        infodotCount: 1, // number of added infodots
        contentItemCount: 1, // number of added content items
        timelineCount: 1, // number of added timelines

        onTimelineChangeNameClicked: function (id) {
            var timelineId = id.split("__header__")[0];

            var header = vc.virtualCanvas("findElement", id); // header of timeline to be changed
            var timeline = vc.virtualCanvas("findElement", timelineId); // timeline that header to be changed

            document.getElementById("ChangeNameTextBox").value = header.text;

            document.getElementById("ChangeNameTextBox").oninput = function () {
                header.text = this.value;
                timeline.title = this.value;
                header.vc.requestInvalidate();
            };

            if (!this.isTimelineChangeNameWindowVisible) {
                $("#timelineChangeName").show('slide', {}, 'slow',
                    function () {
                        $("#ChangeNameTextBox").focus();
                    });
                this.toggleTitleEditor();
            }
        },

        changeInfodotTitle: function (id, infodotDescription) {
            var infodotID = id.split("__title")[0];

            var header = vc.virtualCanvas("findElement", id); // header of infodot to be changed
            var infodot = vc.virtualCanvas("findElement", infodotID); // infodot that header to be changed

            document.getElementById("ChangeNameTextBox").value = infodotDescription.title;

            document.getElementById("ChangeNameTextBox").oninput = function () {
                header.text = this.value + '\n(' + infodotDescription.date + ')';
                header.initialized = false;
                infodotDescription.title = this.value;
                header.vc.requestInvalidate();
            };

            if (!this.isTimelineChangeNameWindowVisible) {
                $("#timelineChangeName").show('slide', {}, 'slow',
                    function () {
                        $("#ChangeNameTextBox").focus();
                    });
                this.toggleTitleEditor();
            }
        },

        toggleTitleEditor: function () {
            this.isTimelineChangeNameWindowVisible = !this.isTimelineChangeNameWindowVisible;
        },

        hideTitleEditor: function () {
            this.toggleTitleEditor();
            $("#timelineChangeName").hide('slide', {}, 'slow');
        },

        InitializeTimelineChangeName: function () {
            $("#ChangeNameTextBox")
                    .focus(function () {
                        if ($(this).hasClass('emptyTextBox')) {
                            $(this).removeClass('emptyTextBox');
                        }
                    });
            $("#timelineChangeName").hide();
            $("#authoringToolsPanel").hide();
        },

        createInfodot: function (infodot) {
            var k = 1000000000;

            var exhibit = {
                __type: "Exhibit:#Chronozoom.Entities",
                ContentItems: [],
                Day: 0,
                ID: "",
                Month: 0,
                References: [],
                Regime: infodot.regime,
                Sequence: null,
                Threshold: "1. Origins of the Universe",
                Title: "New exhibit",
                UniqueID: "_" + this.timelineCount++,
                TimeUnit: "Ga",
                Year: (infodot.year / k).toFixed(1)
            };

            var dateTime = {
                __type: "DateTimeOffset:#System",
                DateTime: "/Date(1316131200000)/",
                OffsetMinutes: 0
            };

            var contentItem = {
                __type: "ContentItem:#Chronozoom.Entities",
                Attribution: "New content item",
                Caption: infodot.contentItem.caption,
                Date: dateTime,
                HasBibliography: false,
                ID: "",
                MediaSource: "http://commons.wikimedia.org/wiki/File:A_False-Color_Topography_of_Vesta%27s_South_Pole.jpg",
                MediaType: "Picture",
                Order: 32767,
                Regime: infodot.regime,
                Threshold: "1. Origins of the Universe",
                TimeUnit: "Ga",
                Title: infodot.contentItem.title,
                UniqueID: "_" + this.timelineCount++,
                Uri: infodot.contentItem.uri,
                Year: null
            };

            exhibit.ContentItems.push(contentItem);
        },

        AtOnClicked: function () {
            this.isActive = !this.isActive;

            if (this.isActive)
                $("#authoringToolsPanel").slideDown();
            else
                $("#authoringToolsPanel").slideUp();
        },

        editModeChanged: function (newMode) {
            if (this.state == newMode)
                this.state = null;
            else
                this.state = newMode;
        },

        updateNewRectangle: function (pv) {
            if (this.startPoint === null || this.startPoint === false)
                this.startPoint = {
                    x: pv.x,
                    y: pv.y
                };

            if (this.startPoint !== null && this.startPoint !== false && this.draggedObject.prevPosition !== null) {
                removeChild(this.draggedObject, "newTimelineRectangle");

                // prevent exceed of horizontal borders
                if (pv.x < this.draggedObject.x)
                    pv.x = this.draggedObject.x;
                if (pv.x > this.draggedObject.x + this.draggedObject.width)
                    pv.x = this.draggedObject.x + this.draggedObject.width;

                // prevent exceed of vertical borders
                if (pv.y < this.draggedObject.y)
                    pv.y = this.draggedObject.y;
                if (pv.y > this.draggedObject.y + this.draggedObject.height)
                    pv.y = this.draggedObject.y + this.draggedObject.height;

                var timelineX = Math.min(this.startPoint.x, pv.x);
                var timelineY = Math.min(this.startPoint.y, pv.y);
                var width = Math.abs(this.startPoint.x - pv.x);
                var height = Math.abs(this.startPoint.y - pv.y);

                // rectangle can go out of parent's boundaries while rapidly creating new timelines. It will throw an exception.
                try {
                    addRectangle(this.draggedObject, this.draggedObject.layerid, "newTimelineRectangle", timelineX, timelineY,
                        width, height, this.draggedObject.settings);
                }
                catch (ex) {
                    console.log(ex);
                }
            }

            this.draggedObject.prevPosition = {
                x: pv.x,
                y: pv.y
            };
        },

        createNewRectangle: function (pv) {
            removeChild(this.draggedObject, "newTimelineRectangle");

            if (!this.draggedObject && !this.draggedObject.prevPosition)
                return;

            if (!this.startPoint)
                return;

            // prevent exceed of horizontal borders
            if (pv.x < this.draggedObject.x)
                pv.x = this.draggedObject.x;
            if (pv.x > this.draggedObject.x + this.draggedObject.width)
                pv.x = this.draggedObject.x + this.draggedObject.width;

            // prevent exceed of vertical borders
            if (pv.y < this.draggedObject.y)
                pv.y = this.draggedObject.y;
            if (pv.y > this.draggedObject.y + this.draggedObject.height)
                pv.y = this.draggedObject.y + this.draggedObject.height;

            var timelineX = Math.min(this.startPoint.x, pv.x);
            var timelineY = Math.min(this.startPoint.y, pv.y);
            var width = Math.abs(this.startPoint.x - pv.x);
            var height = Math.abs(this.startPoint.y - pv.y);

            var intersection = this.checkIntersections(pv);

            timelineX = intersection.timelineX;
            timelineY = intersection.timelineY;
            width = intersection.width;
            height = intersection.height;

            if (width > 0 && height > 0) {
                addTimeline(this.draggedObject, this.draggedObject.layerid, "t_" + this.timelineCount, {
                    timeStart: timelineX,
                    timeEnd: timelineX + width,
                    header: "Timeline " + this.timelineCount,
                    top: timelineY,
                    height: height,
                    fillStyle: this.draggedObject.settings.fillStyle,
                    regime: this.draggedObject.regime,
                    gradientFillStyle: this.draggedObject.settings.gradientFillStyle,
                    lineWidth: this.draggedObject.settings.lineWidth,
                    strokeStyle: timelineStrokeStyle
                });

                var k = 1000000000;

                var timeline = {
                    __type: "Timeline:#Chronozoom.Entities",
                    ChildTimelines: [],
                    Exhibits: [],
                    FromDay: 0,
                    FromMonth: 0,
                    FromTimeUnit: "Ga",
                    FromYear: -timelineX / k,
                    Height: 40.000,
                    ID: "",
                    Regime: this.draggedObject.regime,
                    Sequence: null,
                    Threshold: "1. Origins of the Universe",
                    Title: "Timeline " + this.timelineCount,
                    ToDay: 0,
                    ToMonth: 0,
                    ToTimeUnit: "Ga",
                    ToYear: -(timelineX + width) / k,
                    UniqueID: "_" + this.timelineCount++
                };
            }

            this.draggedObject = null;
            this.startPoint = null;
        },

        updateTimelineDate: function (pv) {
            if (this.draggedObject.type != "timeline")
                return;

            if (!this.direction) {
                if (this.draggedObject.x <= pv.x && pv.x <= this.draggedObject.x + this.draggedObject.width / 5)
                    this.direction = "left";
                else if (this.draggedObject.x + 4 * this.draggedObject.width / 5 <= pv.x && pv.x <= this.draggedObject.x + this.draggedObject.width)
                    this.direction = "right";
                else {
                    if (Math.abs(pv.y - this.draggedObject.y) <= this.draggedObject.height / 2)
                        this.direction = "top";
                    else
                        this.direction = "down";
                }
            }

            var dx = 0;
            var dy = 0;

            if (this.prevPosition) {
                dx = this.prevPosition.x - pv.x;
                dy = this.prevPosition.y - pv.y;
            }

            this.prevPosition = {
                x: pv.x,
                y: pv.y
            };

            dx = this.checkHorizontalIntersection(this.direction, dx);
            dy = this.checkVerticalIntersection(this.direction, dy);

            switch (this.direction) {
                case "left":
                    this.draggedObject.x -= dx;
                    this.draggedObject.width += dx;
                    this.draggedObject.titleObject.x -= dx;
                    break;
                case "right":
                    dx = -dx;
                    this.draggedObject.width += dx;
                    break;
                case "top":
                    this.draggedObject.y -= dy;
                    this.draggedObject.height += dy;
                    break;
                case "down":
                    this.draggedObject.height -= dy;
                    this.draggedObject.titleObject.y -= dy;
                    this.draggedObject.titleObject.baseline -= dy;
                    break;
            }
        },

        /* Checks for intersections between new timeline and some child of parent timeline. */
        checkIntersections: function (pv) {
            var timelineX = Math.min(this.startPoint.x, pv.x);
            var timelineY = Math.min(this.startPoint.y, pv.y);
            var width = Math.abs(this.startPoint.x - pv.x);
            var height = Math.abs(this.startPoint.y - pv.y);

            var x1 = timelineX, x2 = x1 + width; // left and right X coords of rectangle
            var y1 = timelineY, y2 = y1 + height; // top and bottom Y coords of rectangle

            // skip header object, so first index is 1
            // TODO: check intersection with header obect too
            for (var i = 1; i < this.draggedObject.children.length; i++) {
                var c_x1 = this.draggedObject.children[i].x; // left X coord of child
                var c_x2 = this.draggedObject.children[i].x + this.draggedObject.children[i].width; // right X coord of child
                var c_y1 = this.draggedObject.children[i].y; // top Y coord of child
                var c_y2 = this.draggedObject.children[i].y + this.draggedObject.children[i].height; // bottom Y coord of child

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
        },

        /* Checks for horizontal intersection */
        checkHorizontalIntersection: function (direction, dx) {
            var x1 = this.draggedObject.x; // left border of edited timeline
            var x2 = this.draggedObject.width + x1; // right border of edited timeline

            var y1 = this.draggedObject.y;
            var y2 = y1 + this.draggedObject.height;

            if (this.direction == "left")
                x1 -= dx;
            else if (this.direction == "right")
                x2 -= dx;

            if (x1 < this.draggedObject.parent.x) {
                dx = this.draggedObject.x - this.draggedObject.parent.x;
                x1 = this.draggedObject.parent.x;
            }
            else if (x2 > this.draggedObject.parent.x + this.draggedObject.parent.width) {
                dx = this.draggedObject.x + this.draggedObject.width - this.draggedObject.parent.width - this.draggedObject.parent.x;
                x2 = this.draggedObject.parent.x + this.draggedObject.parent.width;
            }

            var candidates = this.draggedObject.parent.children;

            // check for intersections with other timelines of that parent
            for (var i = 1; i < candidates.length; i++) {
                if (candidates[i].id == this.draggedObject.id)
                    continue;

                var c_x1 = candidates[i].x;
                var c_x2 = c_x1 + candidates[i].width;

                var c_y1 = candidates[i].y;
                var c_y2 = c_y1 + candidates[i].height;

                if ((((x1 < c_x1 || x1 < c_x2) && x2 > c_x2) ||
                    ((x2 > c_x1 || x2 > c_x2) && x1 < c_x1)) &&
                    !(y1 > c_y2 || y2 < c_y1)) {
                        dx = 0;
                }
            }

            candidates = this.draggedObject.children;

            // check for intersections with child elements
            for (var i = 1; i < candidates.length; i++) {
                var c_x1 = candidates[i].x;
                var c_x2 = c_x1 + candidates[i].width;

                if (x1 > c_x1 || x2 < c_x2) {
                    dx = 0;
                }
            }

            return dx;
        },

        /* Checks for vertical intersection */
        checkVerticalIntersection: function (direction, dy) {
            var y1 = this.draggedObject.y; // top border of edited timeline
            var y2 = this.draggedObject.height + y1; // bottom border of edited timeline

            var x1 = this.draggedObject.x;
            var x2 = x1 + this.draggedObject.width;

            if (this.direction == "top")
                y1 -= dy;
            else if (this.direction == "down")
                y2 -= dy;

            if (y1 < this.draggedObject.parent.y) {
                dy = this.draggedObject.y - this.draggedObject.parent.y;
                y1 = this.draggedObject.parent.y;
            }
            else if (y2 > this.draggedObject.parent.y + this.draggedObject.parent.height) {
                dy = this.draggedObject.y + this.draggedObject.height - this.draggedObject.parent.height - this.draggedObject.parent.y;
                y2 = this.draggedObject.parent.y + this.draggedObject.parent.height;
            }

            var candidates = this.draggedObject.parent.children;

            // check for intersections with other timelines of that parent
            for (var i = 1; i < candidates.length; i++) {
                if (candidates[i].id == this.draggedObject.id)
                    continue;

                var c_x1 = candidates[i].x;
                var c_x2 = c_x1 + candidates[i].width;

                var c_y1 = candidates[i].y;
                var c_y2 = c_y1 + candidates[i].height;

                if ((((y1 < c_y1 || y1 < c_y2) && y2 > c_y2) ||
                    ((y2 > c_y1 || y2 > c_y2) && y1 < c_y1)) &&
                    !(x1 >= c_x2 || x2 <= c_x1)) {
                        dy = 0;
                }
            }

            candidates = this.draggedObject.children;

            // check for intersections with child elements
            for (var i = 1; i < candidates.length; i++) {
                var c_y1 = candidates[i].y;
                var c_y2 = c_y1 + candidates[i].height;

                if (y1 > c_y1 || y2 < c_y2) {
                    dy = 0;
                }
            }

            if (y2 / y1 <= 1.1)
                dy = 0;

            return dy;
        },

        /* Returns the date string for the infodot header. 
        @param x        (double) negative number, x component of virtual coordinates*/
        getInfodotDate: function (x) {
            // calculate date of the infodot
            var date = Math.floor(-x) - 2012; // CE offset

            if (date / 1000000000 >= 0.1)
                date = (date / 1000000000).toFixed(1) + " Ga";
            else if (date / 10000000 >= 0.1)
                date = (date / 1000000).toFixed(1) + " Ma";
            else if (date > 0) // in case of BCE
                date = Math.abs(date) + " BCE";
            else
                date = date ? -date : 1;

            return date;
        }
    });

    Object.defineProperties(Authoring, {
        // Properties here...
    });

    return CZ;
})(CZ || {}, jQuery, document);