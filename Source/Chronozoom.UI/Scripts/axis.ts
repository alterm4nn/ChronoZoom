/// <reference path='cz.settings.ts'/>
/// <reference path='common.ts'/>

module ChronoZoom {
	export module Axis {

	    export function initialize() {

	        (<any>$).widget("ui.axis",
            {
                width: null, // axis width
                height: null, // axis background and ticks height

                // constants to calculate span between ticks: delta can be 1, 2, 5; beta is value of power
                // span = this.delta * Math.pow(10, this.beta);
                beta: 0,
                delta: 1,

                regime: "", // "Ga", "Ma", "ka" for 'cosmos' mode, "BCE/CE" for 'calendar' mode, "Date" for 'date' mode
                level: 1, // divider for each regime
                ticks: null, // array of ticks values
                minorTicks: null, // array of minor ticks values
                labels: null, // array of labels shown above ticks        
                mousePosition: null, // current position of mouse (in px)

                log10: 1 / Math.log(10),

                firstYear: null, // coordinate of first year for current range in calendar or date mode
                startDate: null, // start date of range in 'date' mode
                endDate: null, // end date of range in 'date' mode

                markerPosition: -1, // current time (position of mouse)

                doesMarkerMovesOnHover: true, //reaction of mouse move over the axis

                numberOfThresholds: null,
                thresholds: null,

                thresholdVisibility: "no", // checks if threshold is visible: 'no', 'all', 'one'
                currentThreshold: -1, // index of current visible threshold or -1 if there is no visible threshold
                showThresholds: null, // value indicating should thresholds be rendered or not
                animation: false, // true when thresholds start showing or closing, false when animation is completed
                hideAllTimeout: undefined, // Timeout to hide bunch of visible thresholds
                highlighted_num: 0,

                _create: function () {
                    // background canvas
                    this.backgroundCanvas = $("<canvas></canvas>").appendTo(this.element).addClass("backgroundCanvas");
                    // ticks canvas
                    this.ticksCanvas = $("<canvas></canvas>").appendTo(this.element).addClass("ticksCanvas");
                    // current mouse position canvas
                    this.mouseMarkCanvas = $("<canvas></canvas>").appendTo(this.element).addClass("mouseMarkCanvas");
                    // canvas for dynamically thresholds
                    this.thresholdCanvas = $("<canvas></canvas>").appendTo(this.element).addClass("thresholdCanvas");

                    var canvas = this.backgroundCanvas[0];
                    canvas.width = this.element[0].clientWidth;
                    canvas.height = this.element[0].clientHeight;
                    canvas = this.ticksCanvas[0];
                    canvas.width = this.element[0].clientWidth;
                    canvas.height = this.element[0].clientHeight;
                    canvas = this.mouseMarkCanvas[0];
                    canvas.width = this.element[0].clientWidth;
                    canvas.height = this.element[0].clientHeight;
                    canvas = this.thresholdCanvas[0];
                    canvas.width = this.element[0].clientWidth;
                    canvas.height = this.element[0].clientHeight;

                    this.width = canvas.width;
                    this.height = canvas.height;

                    if (ChronoZoom.Settings.czVersion == "mobile") this.showThresholds = false
                    else
                        if (ChronoZoom.Settings.czVersion == "main") this.showThresholds = true;

                    this._loadThresholds();
                    if (this.thresholds != null) this._setThresholdsVisibility();

                    var self = this;
                    self.element.mouseup(function (e) {
                        switch (e.which) {
                            case 1: self._mouseUp(e);       //means that only left click will be interpreted
                                break;
                        }
                    });
                    self.element.mousemove(function (e) { self._mouseMove(e) });
                    self.element.mouseleave(function () { self._mouseLeave() });

                    this._drawBackground();
                    this.setRange(ChronoZoom.Settings.maxPermitedTimeRange.left, ChronoZoom.Settings.maxPermitedTimeRange.right);
                },
                /*
                sets whether the mouse move over the axis will move the marker
                */
                allowMarkerMovesOnHover: function (e) {
                    this.doesMarkerMovesOnHover = e;
                },
                _init: function () {
                },
                _destroy: function () {
                    this.backgroundCanvas.remove();
                    this.ticksCanvas.remove();
                    this.mouseMarkCanvas.remove();
                    this.thresholdCanvas.remove();
                    this.element.removeClass("axis");
                    return this;
                },
                // loads thresholds from service or dump file
                _loadThresholds: function () {
                    var url;
                    var axis = this;
                    switch (ChronoZoom.Settings.czDataSource) {
                        case 'db': url = "Chronozoom.svc/getthresholds";
                            break;
                        case 'relay': url = "ChronozoomRelay";
                            break;
                        case 'dump': url = "ResponseDumpThresholds.txt";
                            break;
                    }
                    $.ajax({
                        cache: false,
                        type: "GET",
                        async: true,
                        dataType: "json",
                        url: url,
                        success: function (result) {
                            axis._getThresholdsContent(result);
                        },
                        error: function (xhr) {
                            alert("Error connecting to service: " + xhr.responseText);
                        }
                    });
                },
                // parses thresholds content
                _getThresholdsContent: function (content) {
                    this.numberOfThresholds = content.d.length;
                    this.thresholds = [];
                    for (var i = 0; i < this.numberOfThresholds; i++) {
                        content.d[i].time = ChronoZoom.Common.getCoordinateFromDecimalYear(content.d[i].ThresholdYear);
                        this.thresholds[i] = {
                            'title': content.d[i].Title, 'description': (content.d[i].Description == null ? '' : content.d[i].Description),
                            'time': content.d[i].time, 'bookmark': content.d[i].BookmarkRelativePath,
                            'color': ChronoZoom.Settings.thresholdColors[i % ChronoZoom.Settings.thresholdColors.length], 'textColor': ChronoZoom.Settings.thresholdTextColors[i % ChronoZoom.Settings.thresholdTextColors.length],
                            'isVisible': false, 'showing': 'left', 'coordinate': 0
                        };
                    }
                },

                _mouseUp: function (e) {
                    if (this.showThresholds) {
                        if (this.doesMarkerMovesOnHover) {
                            // show active marker when mouse is over axis
                            var point = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                            var k = (this.options.range.right - this.options.range.left) / this.width;
                            var time = this.options.range.right - k * (this.width - point.x);
                            this.setTimeMarker(time);
                        }
                        var x = 0;
                        var number = 0;
                        var leftEps = 2;
                        var rightEps = 10;      //are not the same with leftEps, because this.thresholds[i].coordinate defines left corner of the threshold
                        var verticalEps = 0;
                        var downEps = 10;
                        var shift = ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.gapLabelTick;
                        var self = this;
                        var top = this.element[0].offsetTop + shift;
                        var To_Avoid_Overlap = false;
                        if (this.thresholds) {
                            // no thresholds are currently visible -> show all
                            var canvas = this.thresholdCanvas[0];
                            var ctx = canvas.getContext("2d");
                            ctx.font = (ChronoZoom.Settings.axisTextSize - 1) + " " + ChronoZoom.Settings.axisTextFont;
                            var visible = false;
                            if (this.thresholds != null) {
                                for (var i = 0; i < this.thresholds.length; i++) {
                                    // for each thresholds that can be visible
                                    if (this.thresholds[i].isVisible) {
                                        x = this.thresholds[i].coordinate;
                                        var point = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                                        if ((point.x >= x - leftEps) && (point.x <= x + rightEps) && (point.y >= ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - downEps) && (point.y <= ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth + verticalEps) && (To_Avoid_Overlap != true)) {
                                            // creating temporary div for threshold                
                                            var temp = 0;
                                            if (this.thresholdVisibility == "no") {
                                                temp = 1;
                                                if (!$("div").is('#threshold' + i)) {
                                                    self._onExpandThreshold(i);
                                                }
                                            }
                                            if ((this.thresholdVisibility == "one") && (temp == 0)) {
                                                self._onThresholdsClear(false);
                                                this.thresholdVisibility = "no";
                                                //if this elem doesn't exist
                                                if (!$("div").is('#threshold' + i)) {
                                                    self._onExpandThreshold(i);
                                                }
                                            }
                                            To_Avoid_Overlap = true;
                                            if (visible) {
                                                this.thresholdVisibility = "one";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                _mouseMove: function (e) {
                    if (this.doesMarkerMovesOnHover) {
                        // show active marker when mouse is over axis
                        var point = ChronoZoom.Common.getXBrowserMouseOrigin(this.element, e);
                        var k = (this.options.range.right - this.options.range.left) / this.width;
                        var time = this.options.range.right - k * (this.width - point.x);
                        this.setTimeMarker(time);
                    }
                    var To_Avoid_Overlap = false;
                    var leftEps = 2;
                    var rightEps = 10;      //are not the same with leftEps, because this.thresholds[i].coordinate defines left corner of the threshold
                    var verticalEps = 10;
                    var self = this;
                    if (this.thresholds != null) {
                        for (var i = 0; i < this.thresholds.length; i++) {
                            var x = this.thresholds[i].coordinate;
                            if ((point.x >= x - leftEps) && (point.x <= x + rightEps) && (point.y >= ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - verticalEps) && (point.y <= ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth + verticalEps) && (To_Avoid_Overlap != true)) {
                                this.highlighted_num = i;
                                To_Avoid_Overlap = true;
                                //to delete marker when hover on collapsed threshold
                                var canvas = this.mouseMarkCanvas[0];
                                var ctx = canvas.getContext("2d");
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                self._drawHighlightedCollapsedThreshold(i);
                            } else {
                                if ((point.x >= x - 10 * leftEps) && (point.x <= x + 2 * rightEps) && (point.y >= ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - 2 * verticalEps) && (point.y <= ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth + 2 * verticalEps))
                                    self._drawCollapsedThreshold(i);
                            }
                        }
                    }
                },

                // function to perform after mouse leaves axis
                _mouseLeave: function () {
                    var self = this;
                    if (this.thresholds != null) {
                        for (var i = 0; i < this.thresholds.length; i++) {
                            self._drawCollapsedThreshold(i);
                        }
                    }
                },
                // method to show a threshold after showing line
                _showThreshold: function (i) {
                    var self = this;
                    $('#threshold' + i).show('slide', { direction: this.thresholds[i].showing }, 'slow');
                    this.animation = false;
                },
                // is called after threshold is hidden to hide a line
                _hideThresholdCompleted: function (i) {
                    var self = this;
                    $('#line' + i).slideUp(ChronoZoom.Settings.thresholdsAnimationTime, function () {
                        self._hideLineCompleted(i);
                    });
                    $('#threshold' + i).remove();
                },
                // is called after line is hidden to clear everything
                _hideLineCompleted: function (i) {
                    $('#line' + i).remove();
                    this._onThresholdsClearCompleted();
                },
                _hideThresholdsCompleted: function (i, toExpand) {
                    var self = this;
                    $('#line' + i).slideUp(ChronoZoom.Settings.thresholdsAnimationTime, function () {
                        var num = parseFloat(this.id.substring(4));
                        self._hideLinesCompleted(num, toExpand);
                    });
                    $('#threshold' + i).remove();
                },
                _hideThresholdsCompletedSpecific: function (i, toExpand) {
                    var self = this;
                    $('#line' + i).slideUp(ChronoZoom.Settings.thresholdsAnimationTime, function () {
                        var num = parseFloat(this.id.substring(4));
                        self._hideLinesCompletedSpecific(num, toExpand);
                    });
                    $('#threshold' + i).remove();
                },
                _hideLinesCompleted: function (i, toExpand) {
                    $('#line' + i).remove();
                    if (!toExpand) this._onThresholdsClearCompleted();
                },
                _hideLinesCompletedSpecific: function (i, toExpand) {
                    $('#line' + i).remove();
                },

                // enables or disables showing thresholds
                enableThresholds: function (enable) {
                    if (!enable && this.showThresholds) {
                        this._onThresholdsClear(false);
                    }
                    this.showThresholds = enable;
                },

                // function called when user clicks on one of thresholds to expand it
                _onExpandThreshold: function (i) {
                    // remove shown threshold
                    var self = this;
                    var shift = this.element[0].offsetTop + ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.gapLabelTick;
                    var x = this.thresholds[i].coordinate;

                    this.currentThreshold = i;

                    // line to connect threshold with axis
                    $('<div id="line' + i + '">').appendTo(this.element).addClass("thresholdLine").css({
                        'width': ChronoZoom.Settings.thresholdWidth,
                        'left': this.element[0].offsetLeft + x,
                        'top': shift,
                        'background-color': this.thresholds[i].color,
                        'height': ChronoZoom.Settings.thresholdHeight
                    });

                    // creating temporary div for particular threshold
                    $('<div id="threshold' + i + '" style="color:' + this.thresholds[i].textColor + '">' +
                      '<div style="left: 5px; top: 5px; position: absolute">Threshold ' + (i + 1) + ':' + '</div>' +
                      '<div id="title" style="left: 15px; top: 17px; position: absolute; color: White;">' + this.thresholds[i].title + '</div>' +
                      '<div id="desc" style="left: 10px; right: 10px; position: absolute">' + this.thresholds[i].description + '</div>' +
                      '<div id="bookmark" style="right: 13px; bottom: 25px; position: absolute; color: White; cursor: pointer;">Jump To Threshold -> </div>' +
                      '<div id="bookmark2" style="right: 13px; bottom: 8px; position: absolute; color: White; cursor: pointer;">Close Threshold </div>' +
                      '</div>').appendTo(this.element).addClass("thresholdDiv").css({
                          'background-color': this.thresholds[i].color,
                          'top': shift + ChronoZoom.Settings.thresholdHeight,
                          'left': this.element[0].offsetLeft + x
                      });

                    $('#threshold' + i + ' #desc').css('top', $('#threshold' + i + ' #title').height() + 22);
                    $('#threshold' + i).css('height', $('#threshold' + i + ' #desc').height() + 96);

                    // thresholds should open from right to left if they are near right side of page
                    if ($('#threshold' + i).position().left + $('#threshold' + i).width() >= this.width - 450) {
                        this.thresholds[i].showing = 'right';
                        $('#threshold' + i).css('left', this.element[0].offsetLeft + x - $('#threshold' + i).width() + ChronoZoom.Settings.thresholdWidth);
                    } else {
                        this.thresholds[i].showing = 'left';
                    }

                    // event for clicking a 'Jump to threshold' bookmark
                    $('#threshold' + i + ' #bookmark')[0].addEventListener('mouseup', function () {
                        if (self.currentThreshold != -1) self._onThresholdMouseClick();
                    }, false);
                    // event for clicking a 'close' bookmark
                    $('#threshold' + i + ' #bookmark2')[0].addEventListener('mouseup', function () {
                        if (self.currentThreshold != -1) self._onThresholdsClear(false);
                    }, false);
                    // stop mouse at time of threshold if mouse is over expanded threshold or line to it
                    $('#threshold' + i)[0].addEventListener('mousemove', function () {
                        var e = window.event;
                        if (e) ChronoZoom.Common.preventbubble(e);
                        self.setTimeMarker(self.thresholds[self.currentThreshold].time);
                        if (self.currentThreshold != -1) self.setTimeMarker(self.thresholds[self.currentThreshold].time);
                    }, false);
                    $('#threshold' + i).show('slide', { direction: this.thresholds[i].showing }, 'slow');
                    self.thresholdVisibility = "one";
                    // only one threshold is visible now    
                },

                // method that is called for visible threshold to remove it, threshold visibility changaes on 'no' after the animation
                _onThresholdsClear: function (toExpand) {
                    // remove all visible thresholds and lines
                    var self = this;
                    if (this.thresholdVisibility == "one") {
                        for (var i = 0; i < this.thresholds.length; i++) {
                            if (this.thresholds[i].isVisible) {
                                if (this.animation) {
                                    // if animation is already in progress, remove everything
                                    $('#threshold' + i).remove();
                                    $('#line' + i).remove();
                                    this._onThresholdsClearCompleted();
                                }
                                else {
                                    // hide small thresholds and lines
                                    $('#threshold' + i).slideUp(ChronoZoom.Settings.thresholdsAnimationTime, function () {
                                        var num = parseFloat(this.id.substring(9));
                                        self._hideThresholdsCompletedSpecific(num, toExpand);
                                    });

                                }
                            }
                        }
                    }

                },

                _onThresholdsClearCompleted: function () {
                    // no threshold will be visible after removing current
                    this.currentThreshold = -1;
                    this.thresholdVisibility = "no";

                    // clear thresholds canvas
                    var canvas = this.thresholdCanvas[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                },

                // method that is called for visible threshold to jump to its bookmark
                _onThresholdMouseClick: function () {
                    // prevent event bubbling
                    var e = window.event;
                    //if (e) preventbubble(e);

                    // trigger an event to provide jumping to current threshold
                    var event = new (<any>$).Event("thresholdBookmarkChanged");
                    event.Bookmark = this.thresholds[this.currentThreshold].bookmark;
                    this.element.trigger(event);

                    // calling method to remove current threshold
                    this._onThresholdsClear(false);
                },

                // draws background lines
                _drawBackground: function () {
                    var canvas = this.backgroundCanvas[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    ctx.strokeStyle = ChronoZoom.Settings.axisStrokeColor;
                    ctx.lineWidth = ChronoZoom.Settings.strokeWidth;
                    var shift = ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth;
                    ctx.beginPath();
                    ctx.moveTo(0, shift);
                    ctx.lineTo(this.width, shift);
                    ctx.closePath();
                    ctx.stroke();
                },

                // render thresholds in collapsed view in calculated places
                // thresholds are rounded rectangles
                _drawCollapsedThresholds: function () {
                    var self = this;
                    if ((this.thresholds != null) && (this.showThresholds != false)) {
                        for (var i = 0; i < this.thresholds.length; i++) {
                            self._drawCollapsedThreshold(i);
                        }
                    }
                },
                // render threshold in collapsed view in calculated place
                // thresholds are rounded rectangles
                _drawCollapsedThreshold: function (i) {
                    var canvas = this.ticksCanvas[0];
                    var ctx = canvas.getContext("2d");

                    if ((this.thresholds != null) && (this.showThresholds != false)) {
                        if (this.thresholds[i].isVisible) {
                            var x = this.thresholds[i].coordinate;
                            ctx.fillStyle = this.thresholds[i].color;
                            ctx.strokeStyle = "black";
                            ctx.beginPath();
                            ctx.moveTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.lineTo(x + ChronoZoom.Settings.thresholdWidth, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.lineTo(x + ChronoZoom.Settings.thresholdWidth, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - (ChronoZoom.Settings.thresholdHeight - ChronoZoom.Settings.rectangleRadius));
                            ctx.quadraticCurveTo(x + ChronoZoom.Settings.thresholdWidth, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight, x + ChronoZoom.Settings.thresholdWidth - ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight);
                            ctx.lineTo(x + ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight);
                            ctx.quadraticCurveTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight, x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - (ChronoZoom.Settings.thresholdHeight - ChronoZoom.Settings.rectangleRadius));
                            ctx.lineTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.closePath();
                            ctx.lineWidth = 1;
                            ctx.fill();
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                    }
                },
                // render highlighted threshold in collapsed view in calculated place
                // thresholds are rounded rectangles
                _drawHighlightedCollapsedThreshold: function (i) {
                    var canvas = this.ticksCanvas[0];
                    var ctx = canvas.getContext("2d");

                    if ((this.thresholds != null) && (this.showThresholds != false)) {
                        if (this.thresholds[i].isVisible) {
                            var x = this.thresholds[i].coordinate;
                            ctx.fillStyle = this.thresholds[i].color;
                            ctx.strokeStyle = "white";
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.lineTo(x + ChronoZoom.Settings.thresholdWidth, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.lineTo(x + ChronoZoom.Settings.thresholdWidth, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - (ChronoZoom.Settings.thresholdHeight - ChronoZoom.Settings.rectangleRadius));
                            ctx.quadraticCurveTo(x + ChronoZoom.Settings.thresholdWidth, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight, x + ChronoZoom.Settings.thresholdWidth - ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight);
                            ctx.lineTo(x + ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight);
                            ctx.quadraticCurveTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.thresholdHeight, x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - (ChronoZoom.Settings.thresholdHeight - ChronoZoom.Settings.rectangleRadius));
                            ctx.lineTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                        }

                    }
                },

                // render threshold in not collapsed view in calculated places
                // thresholds are rounded rectangles,constants like 5 and 7 are defined "on eye"
                _drawNotCollapsedThresholds: function () {
                    var canvas = this.ticksCanvas[0];
                    var ctx = canvas.getContext("2d");
                    ctx.lineWidth = 2;
                    if (this.thresholds != null) {
                        for (var i = 0; i < this.thresholds.length; i++) {
                            if (this.thresholds[i].isVisible) {
                                if ($("div").is('#threshold' + i)) {
                                    var x = this.thresholds[i].coordinate;
                                    $('#line' + i).css('left', this.element[0].offsetLeft + x);
                                    if (this.thresholds[i].showing == 'right') {
                                        if (($('#threshold' + i).position().left >= 0) && (($('#threshold' + i).position().left + $('#threshold' + i).width() <= this.width + 5))) {
                                            $('#threshold' + i).css('left', this.element[0].offsetLeft + x - $('#threshold' + i).width() + ChronoZoom.Settings.thresholdWidth);
                                        } else {
                                            var self = this;
                                            $('#threshold' + i).remove();
                                            $('#line' + i).remove();
                                            self._hideThresholdsCompleted(i, false);
                                        }
                                    } else {
                                        if ($('#threshold' + i).position().left + $('#threshold' + i).width() <= this.width - 7) {
                                            $('#threshold' + i).css('left', this.element[0].offsetLeft + x);
                                        } else {
                                            var self = this;
                                            $('#threshold' + i).remove();
                                            $('#line' + i).remove();
                                            self._hideThresholdsCompleted(i, false);
                                        }
                                    }
                                }
                            } else {
                                if ($("div").is('#threshold' + i)) {
                                    var self = this;
                                    $('#threshold' + i).remove();
                                    $('#line' + i).remove();
                                    self._hideThresholdsCompleted(i, false);
                                }
                            }
                        }
                    }
                },

                // creates and renders ticks
                _drawTicks: function () {
                    var canvas = this.ticksCanvas[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // settings
                    ctx.strokeStyle = ChronoZoom.Settings.axisStrokeColor;
                    ctx.font = ChronoZoom.Settings.axisTextSize + " " + ChronoZoom.Settings.axisTextFont;
                    ctx.lineWidth = 1;
                    // write text under scale
                    var text = "";
                    if (this.regime == "Ga") text = "Billions of Years Ago";
                    else if (this.regime == "Ma") text = "Millions of Years Ago";
                    else if (this.regime == "ka") text = "Thousands of Years Ago";
                    else text = this.regime;
                    ctx.strokeText(text, ChronoZoom.Settings.horizontalTextMargin, ChronoZoom.Settings.verticalTextMargin);
                    if (this.options.mode == "cosmos" && this.options.range.right >= 0) {
                        ctx.strokeText("Today", this.width - ChronoZoom.Settings.horizontalTextMargin - ctx.measureText("Today").width, ChronoZoom.Settings.verticalTextMargin);
                    }
                    else {
                        ctx.strokeText(text, this.width - ChronoZoom.Settings.horizontalTextMargin - ctx.measureText(text).width, ChronoZoom.Settings.verticalTextMargin);
                    }

                    var currentMeasuredText = 0;
                    var measuredText1 = 0;
                    var measuredText2 = 0;
                    var x = 0;

                    // write current year and month
                    if (this.options.mode == "date") {
                        text = (this.beta <= -2 ? ChronoZoom.Settings.months[this.startDate.month] + ", " : "") + (this.startDate.year > 0 ? (this.startDate.year) + " CE" : -this.startDate.year + (this.startDate.year == 0 ? 1 : 0) + " BCE");
                        measuredText1 = ctx.measureText(text).width + 5;
                        ctx.strokeText(text, 5, ChronoZoom.Settings.verticalTextMargin * 2);
                        text = (this.beta <= -2 ? ChronoZoom.Settings.months[this.endDate.month] + ", " : "") + (this.endDate.year > 0 ? (this.endDate.year) + " CE" : -this.endDate.year + (this.endDate.year == 0 ? 1 : 0) + " BCE");
                        measuredText2 = ctx.measureText(text).width + 5;
                        ctx.strokeText(text, this.width - measuredText2, ChronoZoom.Settings.verticalTextMargin * 2);
                    }

                    var k = this.width / (this.options.range.right - this.options.range.left);
                    var present = -k * this.options.range.left;
                    // render ticks & labels, ticks are in virtual coordinates
                    for (var i = 0; i < this.ticks.length; i++) {
                        // render tick
                        x = k * (this.ticks[i] - this.options.range.left);
                        if (this.options.mode == "calendar") {
                            x += k * this.firstYear;
                        }
                        if (x <= present) {
                            ctx.beginPath();
                            ctx.lineWidth = ChronoZoom.Settings.strokeWidth;
                            ctx.moveTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.lineTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.tickLength);
                            ctx.closePath();
                            ctx.stroke();

                            // render label if it doesn't overlay background text
                            currentMeasuredText = ctx.measureText(this.labels[i]).width;
                            var toRender = true;
                            if (measuredText1 != 0 || measuredText2 != 0) {
                                if (measuredText1 != 0) {
                                    if (x - currentMeasuredText / 2 - 5 < measuredText1) toRender = toRender && false;
                                }
                                if (measuredText2 != 0) {
                                    if (x + currentMeasuredText / 2 + 5 > this.width - measuredText2) toRender = toRender && false;
                                }
                            }
                            if (toRender) {
                                ctx.lineWidth = 1;
                                ctx.strokeText(this.labels[i], x - currentMeasuredText / 2, ChronoZoom.Settings.verticalTextMargin * 2);
                            }
                        }
                    }
                    // render minor ticks if they are defined
                    if (this.minorTicks != null) {
                        for (var i = 0; i < this.minorTicks.length; i++) {
                            x = k * (this.minorTicks[i] - this.options.range.left);
                            if (this.options.mode == "calendar") {
                                x += k * this.firstYear;
                            }
                            ctx.beginPath();
                            ctx.lineWidth = ChronoZoom.Settings.strokeWidth;
                            ctx.moveTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth);
                            ctx.lineTo(x, ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth - ChronoZoom.Settings.smallTickLength);
                            ctx.closePath();
                            ctx.stroke();
                        }
                    }
                },

                // function to create ticks for current range
                _createTicks: function () {
                    var n = this._getTicks();
                    var ticks = n.ticks;
                    var labels = n.labels;

                    // check for possible labels overlay
                    var result = this._checkLabelsArrangement(ticks, labels);
                    var newTicks, newLabels, newResult;
                    var iterations = 0;
                    if (result == -1) {
                        // if labels overlay each other -> need to be decreased
                        while (iterations++ < ChronoZoom.Settings.maxTickArrangeIterations) {
                            this._decreaseTickCount();
                            // get new ticks after decreasing
                            n = this._getTicks();
                            newTicks = n.ticks;
                            newLabels = n.labels;
                            // check new labels for possible overlay
                            newResult = this._checkLabelsArrangement(newTicks, newLabels);
                            if (newResult == 1) {
                                // if new labels need to be increased, then return one step back and break
                                this._increaseTickCount();
                                break;
                            }
                            ticks = newTicks;
                            labels = newLabels;
                            if (newResult == 0) break; // break if everything is fine
                        }
                    }
                    if (result == 1) {
                        // if labels do not overlay each other and there is enough space to increase them -> need to be increased
                        while (iterations++ < ChronoZoom.Settings.maxTickArrangeIterations) {
                            this._increaseTickCount();
                            // get new ticks after increasing
                            n = this._getTicks();
                            newTicks = n.ticks;
                            newLabels = n.labels;
                            // check new labels for possible overlay
                            newResult = this._checkLabelsArrangement(newTicks, newLabels);
                            if (newResult == -1) {
                                // if new labels need to be decreased, then return one step back and break
                                this._decreaseTickCount();
                                break;
                            }
                            ticks = newTicks;
                            labels = newLabels;
                            if (newResult == 0) break; // break if everything is fine
                        }
                    }
                    return { ticks: ticks, labels: labels };
                },
                // gets ticks for current delta & beta constants
                _getTicks: function () {
                    var ticks = new Array();
                    var labels = new Array();

                    // in cosmos or calendar mode zoom is possible up to 4 decimal digits or up to 1 year span near present date (or zero)
                    if (this.options.mode == "cosmos" || this.options.mode == "calendar") {
                        var start = Math.max(this.options.range.left, ChronoZoom.Settings.maxPermitedTimeRange.left);
                        var finish = Math.min(this.options.range.right, ChronoZoom.Settings.maxPermitedTimeRange.right);
                        if (this.options.mode == "calendar") {
                            // shift range limits as in calendar mode we count from present year
                            start -= this.firstYear;
                            finish -= this.firstYear;
                        }
                        var d = finish - start;
                        var beta = this.beta;

                        if (this.options.mode == "cosmos") {
                            // prevent zooming deeper than 4 decimal digits
                            if (this.regime == "Ga" && beta < 5) beta = 5;
                            else if (this.regime == "Ma" && beta < 2) beta = 2;
                            else if (this.regime == "ka" && beta < -1) beta = -1;
                        }
                        else if (this.options.mode == "calendar") {
                            // prevent zooming deeper than 1 year span
                            if (beta < 0) beta = 0;
                        }
                        // span between two neighboring ticks
                        var temp = this.delta * Math.pow(10, beta);

                        // calculate count of ticks to create
                        var min = Math.floor(start / temp);
                        var max = Math.floor(finish / temp);
                        var count = max - min + 1;

                        // calculate rounded ticks values
                        // they are in virtual coordinates (years from present date)
                        var x0 = min * temp;
                        if (temp == 2) count++;

                        for (var i = 0; i < count + 1; i++) {
                            var v = this._round(x0 + i * temp, beta);
                            if (this.options.mode == "calendar") {
                                if (v < 0) v += 1;
                                if (Math.abs(v) < 1e-10 && temp > 1) // Move tick from 1BCE to 1CE
                                    v++;
                            }
                            if (v >= start && v <= finish && v != ticks[ticks.length - 1]) {
                                ticks.push(v);
                            }
                        }
                        // get labels for created ticks
                        labels = this._getLabels(ticks);
                    }
                        // in 'date' mode it is possible to zoom up to days; 'date' mode is possible only in CE date region
                    else if (this.options.mode == "date") {
                        // get extreme points of range
                        var right = Math.min(this.options.range.right, 0);
                        var left = Math.min(this.options.range.left, 0);

                        // span between two rendering neighboring days
                        var tempDays = 0;

                        // count number of months to render
                        var countMonths = 0;
                        var tempMonth = this.startDate.month;
                        var tempYear = this.startDate.year;
                        while (tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                            countMonths++;
                            tempMonth++;
                            if (tempMonth == 12) {
                                tempMonth = 0;
                                tempYear++;
                            }
                        }

                        // count number of days to render
                        var countDays = 0;
                        if (this.beta <= -2 && this.beta >= -4) { tempDays = 5; }
                        if (this.beta <= -5) { tempDays = 1; }

                        // calculate ticks values
                        // they are in virtual coordinates (years from present date)
                        var year = this.startDate.year;

                        // create month ticks
                        var month = this.startDate.month - 1;
                        for (var j = 0; j <= countMonths + 2; j++) {
                            month++;
                            if (month == 12) {
                                month = 0;
                                year++;
                            }
                            var tick = ChronoZoom.Common.getCoordinateFromDMY(year, month, 1);
                            if (tick >= left && tick <= right) {
                                if (tempDays != 1) {
                                    labels.push(ChronoZoom.Settings.months[month]);
                                    ticks.push(tick);
                                }
                            }
                            // create days ticks for this month
                            if (tempDays != 0) {
                                countDays = Math.floor((ChronoZoom.Settings.daysInMonth[month]) / tempDays);
                                if (tempDays == 5 && ChronoZoom.Settings.daysInMonth[month] >= 30 && this.beta == -2) countDays--;
                                for (var k = 1; k <= countDays; k++) {
                                    var day = k * tempDays;
                                    tick = ChronoZoom.Common.getCoordinateFromDMY(year, month, day);
                                    if (tick >= left && tick <= right) {
                                        labels.push(day);
                                        ticks.push(tick);
                                    }
                                }
                            }
                        }
                    }
                    return { ticks: ticks, labels: labels };
                },
                // function to create labels by given array of ticks in virtual coordinates
                _getLabels: function (ticks) {
                    var labels = new Array();
                    var text;

                    // maximum number of decimal digits
                    var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4);

                    // for each created tick
                    for (var i = 0; i < ticks.length; i++) {
                        if (this.options.mode == "cosmos") {
                            // divide tick coordinate by level of cosmos zoom
                            text = -ticks[i] / this.level;
                            if (n < 0) text = (new Number(text)).toFixed(-n);
                            if (i == 0 || i == ticks.length - 1) {
                                text += this.regime;
                            }
                        }
                        else {
                            // in calendar mode to solve year-zero problem consider zero year to be 1BCE
                            if (ticks[i] <= 0) text = -ticks[i] + 1;
                            else text = ticks[i];
                            if (i == 0 || i == ticks.length - 1 || text == "1") {
                                if (ticks[i] <= 0) {
                                    text += "BCE";
                                }
                                else {
                                    text += "CE";
                                }
                            }
                        }

                        labels.push(text);
                    }
                    return labels;
                },
                // function to check whether created labels overlay each other
                _checkLabelsArrangement: function (ticks, labels) {
                    var canvas = this.ticksCanvas[0];
                    var ctx = canvas.getContext("2d");
                    ctx.font = ChronoZoom.Settings.axisTextSize + " " + ChronoZoom.Settings.axisTextFont;

                    var i;
                    var measure1, measure2;
                    // for each label: if distance between labels is smaller than threshold for any of the labels - decrease
                    for (i = 0; i < ticks.length - 1; i++) {
                        measure1 = ctx.measureText(labels[i]).width;
                        measure2 = ctx.measureText(labels[i + 1]).width;
                        if ((this._getCoordinateFromTick(ticks[i]) + measure1 / 2 + ChronoZoom.Settings.spaceBetweenLabels) >
                this._getCoordinateFromTick(ticks[i + 1]) - measure2 / 2) {
                            return -1;
                        }
                    }
                    // by default if labels doesn't overlay - increase
                    var res = 1;
                    // for each label: if distance between labels is in defined range then break, everything is fine
                    for (i = 0; i < ticks.length - 1; i++) {
                        measure1 = ctx.measureText(labels[i]).width;
                        measure2 = ctx.measureText(labels[i + 1]).width;
                        if ((this._getCoordinateFromTick(ticks[i]) + measure1 / 2 + ChronoZoom.Settings.spaceBetweenLabels) >
                     this._getCoordinateFromTick(ticks[i + 1]) - measure2 / 2) {
                            res = 0;
                            break;
                        }
                    }
                    return res;
                },
                // returns screen coordinate (in pixels) of point given in virtual coordinates (years from present)
                _getCoordinateFromTick: function (x) {
                    return ((x - this.options.range.left) * this.width /
                (this.options.range.right - this.options.range.left));
                },
                // change constants to decrease count of ticks and changes mode if necessary
                _decreaseTickCount: function () {
                    if (this.delta == 1) {
                        this.delta = 2;
                    }
                    else if (this.delta == 2) {
                        this.delta = 5;
                    }
                    else if (this.delta == 5) {
                        this.delta = 1;
                        this.beta++;
                    }
                    this._setMode();
                },
                // change constants to increase count of ticks and changes mode if necessary
                _increaseTickCount: function () {
                    if (this.delta == 1) {
                        this.delta = 5;
                        this.beta--;
                    }
                    else if (this.delta == 2) {
                        this.delta = 1;
                    }
                    else if (this.delta == 5) {
                        this.delta = 2;
                    }
                    this._setMode();
                },
                // additional function for rounding decimal value x to n digits
                _round: function (x, n) {
                    var pow = 1;
                    var i;
                    if (n <= 0) {
                        n = Math.max(0, Math.min(-n, 15));
                        pow = 1;
                        for (i = 0; i > n; i--) {
                            pow /= 10;
                        }
                        return Math.round(x * pow) / pow;
                    }
                    else {
                        pow = 1;
                        for (i = 0; i < n; i++) {
                            pow *= 10;
                        }
                        var val = pow * Math.round(x / pow);
                        return val;
                    }
                },
                // get regime and level of axis depending on range.left
                _setMode: function () {
                    if (this.options.range.left <= -10000000000) {
                        // billions of years ago
                        this.regime = "Ga";
                        this.options.mode = "cosmos";
                        this.level = 1000000000;
                    }
                    else if (this.options.range.left <= -10000000) {
                        // millions of years ago
                        this.regime = "Ma";
                        this.options.mode = "cosmos";
                        this.level = 1000000;
                    }
                    else if (this.options.range.left <= -10000) {
                        // thousands of years ago
                        this.regime = "ka";
                        this.options.mode = "cosmos";
                        this.level = 1000;
                    }
                    else {
                        // BCE or CE years
                        if (this.beta < 0) {
                            // zoom is deep enough to render month and days of years if possible
                            this.regime = "Date";
                            this.options.mode = "date";
                            this.level = 1;
                        }
                        else {
                            // no months, only years
                            this.regime = "BCE/CE";
                            this.options.mode = "calendar";
                            this.level = 1;
                        }
                    }
                },

                // function to create minor ticks
                _createMinorTicks: function (ticks) {
                    var minors = new Array();
                    var start = Math.max(this.options.range.left, ChronoZoom.Settings.maxPermitedTimeRange.left);
                    var end = Math.min(this.options.range.right, ChronoZoom.Settings.maxPermitedTimeRange.right);
                    if (this.options.mode == "calendar") {
                        start -= this.firstYear;
                        end -= this.firstYear;
                    }

                    var n = 5;
                    var k = this.width / (this.options.range.right - this.options.range.left);
                    var nextStep = true;
                    var l = ticks.length > 1 ? ticks[1] - ticks[0] : 0;
                    var step = l / (n + 1);

                    if (this.options.mode == "cosmos" || this.options.mode == "calendar") {
                        if (k * step < ChronoZoom.Settings.spaceBetweenSmallTicks)
                            return null;
                        var tick = ticks[0] - step;
                        while (tick > start) {
                            minors.push(tick);
                            tick -= step;
                        }
                        for (var i = 0; i < ticks.length - 1; i++) {
                            var t = ticks[i];
                            // Count minor ticks from 1BCE, not from 1CE if step between large ticks greater than 1
                            if (step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10)
                                t = 0;
                            for (var k = 1; k <= n; k++) {
                                tick = t + step * k;
                                minors.push(tick);
                            }
                        }
                        tick = ticks[ticks.length - 1] + step;
                        while (tick < end) {
                            minors.push(tick);
                            tick += step;
                        }
                    }
                    else {
                        // in 'date' mode number of minor ticks depends on number of days in current month
                        if (this.beta >= -1) step = 5;
                        else if (this.beta <= -2 && this.beta >= -4) step = 1;
                        else if (this.beta <= -5) return null;

                        var tick = ticks[0];
                        var date = ChronoZoom.Common.getDMYFromCoordinate(tick);
                        date.day -= step;
                        tick = ChronoZoom.Common.getCoordinateFromDMY(date.year, date.month, date.day);
                        while (tick > start) {
                            minors.push(tick);
                            date.day -= step;
                            tick = ChronoZoom.Common.getCoordinateFromDMY(date.year, date.month, date.day);
                        }
                        for (var i = 0; i < ticks.length - 1; i++) {
                            var tick = ticks[i];
                            var date = ChronoZoom.Common.getDMYFromCoordinate(tick);
                            var n = Math.floor(ChronoZoom.Settings.daysInMonth[date.month] / step);
                            for (var j = 1; j <= n; j++) {
                                date.day += step;
                                if (date.day == step + 1 && step != 1) date.day--;
                                tick = ChronoZoom.Common.getCoordinateFromDMY(date.year, date.month, date.day);
                                if (minors.length == 0 || k * (ticks[i + 1] - tick) > ChronoZoom.Settings.spaceBetweenSmallTicks) minors.push(tick);
                            }
                        }
                        var tick = ticks[ticks.length - 1];
                        var date = ChronoZoom.Common.getDMYFromCoordinate(tick);
                        date.day += step;
                        tick = ChronoZoom.Common.getCoordinateFromDMY(date.year, date.month, date.day);
                        while (tick < end) {
                            minors.push(tick);
                            date.day += step;
                            tick = ChronoZoom.Common.getCoordinateFromDMY(date.year, date.month, date.day);
                        }
                    }

                    return minors;
                },

                // sets new axis range
                // l is left value, r is right, should be l < r <= 0
                // default range is [-14Ga, 0]
                setRange: function (l, r) {
                    if (l < r) {
                        this.options.range.left = l;
                        this.options.range.right = r;
                    }
                    else {
                        // default range
                        this.options.range.left = ChronoZoom.Settings.maxPermitedTimeRange.left;
                        this.options.range.right = ChronoZoom.Settings.maxPermitedTimeRange.right;
                    }

                    // set present date
                    var localPresent = ChronoZoom.Common.getPresent();
                    this.options.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

                    // remember value in virtual coordinates when 1CE starts
                    this.firstYear = ChronoZoom.Common.getCoordinateFromDMY(0, 0, 1);

                    // in calendar or date mode remember start and end dates
                    if (this.mode != 'cosmos') {
                        this.startDate = this.options.present;
                        this.endDate = this.options.present;
                        if (this.options.range.left < 0) {
                            this.startDate = ChronoZoom.Common.getDMYFromCoordinate(this.options.range.left);
                        }
                        if (this.options.range.right < 0) {
                            this.endDate = ChronoZoom.Common.getDMYFromCoordinate(this.options.range.right);
                        }
                    }

                    // set default constant for arranging ticks
                    this.delta = 1;
                    this.beta = Math.floor(Math.log(this.options.range.right - this.options.range.left) * this.log10);

                    // find mode of axis by range and present date
                    this._setMode();
                    if (this.thresholds != null) {
                        this._setThresholdsVisibility();
                    }

                    // get ticks & labels
                    var n = this._createTicks();
                    this.ticks = n.ticks;
                    this.labels = n.labels;
                    // get minor ticks
                    this.minorTicks = this._createMinorTicks(this.ticks);
                    // render ticks for new range
                    this._drawTicks();
                    this._drawCollapsedThresholds();
                    this._drawNotCollapsedThresholds();
                    this._renderMarker();
                },


                _setThresholdsVisibility: function () {
                    var k = this.width / (this.options.range.right - this.options.range.left);
                    var x = 0;
                    // make an array of thresholds to render at current range
                    for (var i = 0; i < this.numberOfThresholds; i++) {
                        if (this.thresholds[i].time >= this.options.range.left && this.thresholds[i].time <= this.options.range.right) {
                            this.thresholds[i].isVisible = true;
                            x = Math.floor(k * (this.thresholds[i].time - this.options.range.left));
                            if (i == this.numberOfThresholds - 1 && x > 0) this.thresholds[i].coordinate = x - ChronoZoom.Settings.thresholdWidth;
                            else this.thresholds[i].coordinate = x;
                        }
                        else {
                            this.thresholds[i].isVisible = false;
                        }
                    }
                    // fix coordinates to show thresholds (to avoid overlay) 
                    var n = this.thresholds.length - 1;
                    while (n > 0 && this.thresholds[n].coordinate - ChronoZoom.Settings.thresholdWidth <= this.thresholds[n - 1].coordinate && this.thresholds[n].isVisible) {
                        this.thresholds[n - 1].coordinate = this.thresholds[n].coordinate - ChronoZoom.Settings.thresholdWidth - 1;
                        n--;
                    }
                    for (var i = 0; i < n; i++) {
                        if (this.thresholds[i].coordinate + ChronoZoom.Settings.thresholdWidth >= this.thresholds[i + 1].coordinate && this.thresholds[i].isVisible) {
                            this.thresholds[i + 1].coordinate = this.thresholds[i].coordinate + ChronoZoom.Settings.thresholdWidth + 1;
                        }
                    }

                    if (this.thresholdVisibility == 'one') {
                        $('#threshold' + i).css('left', this.element[0].offsetLeft + this.thresholds[this.currentThreshold].coordinate);
                        $('#line' + i).css('left', this.element[0].offsetLeft + this.thresholds[this.currentThreshold].coordinate);
                    }
                },
                /*
                Renders a marker with value
                */
                _renderMarker: function () {

                    x = this.markerPosition;
                    var canvas = this.mouseMarkCanvas[0];
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);


                    if ((x >= ChronoZoom.Settings.maxPermitedTimeRange.left && x <= ChronoZoom.Settings.maxPermitedTimeRange.right)) {
                        var k = this.width / (this.options.range.right - this.options.range.left);
                        var x = k * (x - this.options.range.left);
                        this.mousePosition = x;
                        // render marker
                        ctx.strokeStyle = ChronoZoom.Settings.axisStrokeColor;
                        ctx.fillStyle = ChronoZoom.Settings.axisStrokeColor;
                        ctx.beginPath();
                        var shift = ChronoZoom.Settings.axisHeight - ChronoZoom.Settings.strokeWidth;
                        ctx.moveTo(x, shift);
                        ctx.lineTo(x + ChronoZoom.Settings.activeMarkSize / 2, shift - ChronoZoom.Settings.activeMarkSize);
                        ctx.lineTo(x - ChronoZoom.Settings.activeMarkSize / 2, shift - ChronoZoom.Settings.activeMarkSize);
                        ctx.lineTo(x, shift);
                        ctx.closePath();
                        ctx.fill();

                        // render value
                        var text;
                        ctx.font = (ChronoZoom.Settings.axisTextSize - 1) + " " + ChronoZoom.Settings.axisTextFont;
                        if (this.options.mode == "cosmos") {
                            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4) - 1;
                            if (n > 20) n = 20;
                            if (n < -20) n = -20;
                            if (n < 0) text = (new Number(-this.markerPosition / this.level)).toFixed(-n);
                            else text = (new Number(-this.markerPosition / this.level)).toFixed(n);
                        }
                        else if (this.options.mode == "calendar") {
                            text = parseFloat(new Number(this.markerPosition - this.firstYear).toFixed(2));
                            text += (text > 0 ? -0.5 : -1.5);
                            text = Math.round(text);
                            if (text < 0) text = -text;
                            else if (text == 0) text = 1;
                        }
                        else {
                            var date = ChronoZoom.Common.getDMYFromCoordinate(this.markerPosition);
                            text = (this.beta > -3 ? date.month + 1 + "." : "") + date.day;
                        }

                        var width = ctx.measureText(text).width;
                        // render background rect
                        ctx.fillStyle = "Black";
                        ctx.globalAlpha = 0.75;

                        ctx.beginPath();
                        ctx.moveTo(x - width + ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.verticalTextMargin);
                        ctx.lineTo(x - width + width * 2 - ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.verticalTextMargin);
                        ctx.quadraticCurveTo(x - width + width * 2, ChronoZoom.Settings.verticalTextMargin, x - width + width * 2, ChronoZoom.Settings.verticalTextMargin + ChronoZoom.Settings.rectangleRadius);
                        ctx.lineTo(x - width + width * 2, ChronoZoom.Settings.verticalTextMargin * 2 + ChronoZoom.Settings.gapLabelTick - ChronoZoom.Settings.rectangleRadius);
                        ctx.quadraticCurveTo(x - width + width * 2, ChronoZoom.Settings.verticalTextMargin * 2 + ChronoZoom.Settings.gapLabelTick, x - width + width * 2 - ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.verticalTextMargin * 2 + ChronoZoom.Settings.gapLabelTick);
                        ctx.lineTo(x - width + ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.verticalTextMargin * 2 + ChronoZoom.Settings.gapLabelTick);
                        ctx.quadraticCurveTo(x - width, ChronoZoom.Settings.verticalTextMargin * 2 + ChronoZoom.Settings.gapLabelTick, x - width, ChronoZoom.Settings.verticalTextMargin * 2 + ChronoZoom.Settings.gapLabelTick - ChronoZoom.Settings.rectangleRadius);
                        ctx.lineTo(x - width, ChronoZoom.Settings.verticalTextMargin + ChronoZoom.Settings.rectangleRadius);
                        ctx.quadraticCurveTo(x - width, ChronoZoom.Settings.verticalTextMargin, x - width + ChronoZoom.Settings.rectangleRadius, ChronoZoom.Settings.verticalTextMargin);
                        ctx.closePath();
                        ctx.fill();

                        ctx.globalAlpha = 1;
                        ctx.strokeText(text, x - width / 2, ChronoZoom.Settings.verticalTextMargin * 2);
                    }
                }
                ,
                // renders tick in specific position of a screen given in virtual coordinates
                // is used to draw current mouse position tick
                setTimeMarker: function (x) {
                    this.markerPosition = x;
                    this._renderMarker();
                },

                // returns current axis range
                getRange: function () {
                    return { left: this.options.range.left, right: this.options.range.right };
                },
                // returns current ticks
                Ticks: function () {
                    return this.ticks;
                },
                // returns current labels
                Labels: function () {
                    return this.labels;
                },
                // returns regime for current range
                Regime: function () {
                    return this.regime;
                },
                // returns regime for current range
                Mode: function () {
                    return this.options.mode;
                },
                // returns current time (position of mouse)
                MarkerPosition: function () {
                    return this.markerPosition;
                },

                // function that should be called when width of axis changes
                // causes axis redrawing
                updateWidth: function () {
                    var width = this.element[0].clientWidth;
                    var canvas = this.backgroundCanvas[0];
                    canvas.width = width;
                    canvas = this.ticksCanvas[0];
                    canvas.width = width;
                    canvas = this.mouseMarkCanvas[0];
                    canvas.width = width;
                    canvas = this.thresholdCanvas[0];
                    canvas.width = width;
                    this.width = width;

                    // get ticks & labels
                    var n = this._createTicks();
                    this.ticks = n.ticks;
                    this.labels = n.labels;

                    this._drawBackground();
                    this._drawTicks();
                    this._drawCollapsedThresholds();
                    this._drawNotCollapsedThresholds();
                },

                // axis options: 
                // range ([left, right] - years from present), 
                // present date - is set each time range changes
                // mode ('cosmos' for billions, millions, thousands of years ago; 
                //       'calendar' for ranges that contain BCE or CE dates; 
                //       'date' for ranges that include shown months or days
                options: {
                    range: { left: -1, right: 0 },
                    present: null, // {year: 1, month: 0, day: 1}
                    mode: null // "cosmos", "calendar", "date"
                }
            });
	    }
    }
}