/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='dates.ts'/>
/// <reference path='viewport-controller.ts'/>
var CZ;
(function (CZ) {
    function Timescale(container) {
        if (!container) {
            throw "Container parameter is undefined!";
        }
        if (container.tagName !== undefined && container.tagName.toLowerCase() === "div") {
            container = $(container);
        } else if (typeof (container) === "string") {
            container = $("#" + container);
            if (container.length === 0 || !container.is("div")) {
                throw "There is no DIV element with such ID.";
            }
        } else if (!(container instanceof jQuery && container.is("div"))) {
            throw "Container parameter is invalid! It should be DIV, or ID of DIV, or jQuery instance of DIV.";
        }

        var mouse_clicked = false;
        var mouse_hovered = false;

        container.mouseup(function (e) {
            mouse_clicked = false;
        });
        container.mousedown(function (e) {
            mouse_clicked = true;
        });
        container.mousemove(function (e) {
            mouse_hovered = true;
            mouseMove(e);
        });
        container.mouseleave(function (e) {
            mouse_hovered = false;
            mouse_clicked = false;
        });

        /**
        * Private variables of timescale.
        */
        var that = this;
        var _container = container;
        var _range = { min: 0, max: 1 };
        var _ticks = [];
        var _ticksInfo = [];
        var _mode = "cosmos";
        var _position = "top";
        var _deltaRange;
        var _size;
        var _width;
        var _height;
        var _canvasHeight;
        var _markerPosition;

        var _tickSources = {
            "cosmos": new CZ.CosmosTickSource(),
            "calendar": new CZ.CalendarTickSource(),
            "date": new CZ.DateTickSource()
        };

        var isHorizontal = (_position === "bottom" || _position === "top");
        var canvas = $("<canvas></canvas>");
        var labelsDiv = $("<div></div>");

        var marker = $("<div id='timescale_marker' class='cz-timescale-marker'></div>");
        var markerText = $("<div id='marker-text'></div>");
        var markertriangle = $("<div id='marker-triangle'></div>");

        var canvasSize = CZ.Settings.tickLength + CZ.Settings.timescaleThickness;
        var text_size;
        var fontSize;
        var strokeStyle;
        var ctx;

        init();

        /*
        * Properties of timescale.
        */
        Object.defineProperties(this, {
            position: {
                configurable: false,
                get: function () {
                    return _position;
                },
                set: function (value) {
                    _position = value;
                    isHorizontal = (_position === "bottom" || _position === "top");
                }
            },
            mode: {
                configurable: false,
                get: function () {
                    return _mode;
                },
                set: function (value) {
                    _tickSources[_mode].hideDivs();
                    _mode = value;
                }
            },
            container: {
                configurable: false,
                get: function () {
                    return _container;
                }
            },
            range: {
                configurable: false,
                get: function () {
                    return _range;
                }
            },
            ticks: {
                configurable: false,
                get: function () {
                    return _ticks;
                }
            },
            ticksInfo: {
                configurable: false,
                get: function () {
                    return _ticksInfo;
                }
            },
            tickSource: {
                configurable: false,
                get: function () {
                    return _tickSources[_mode];
                }
            },
            markerPosition: {
                configurable: false,
                get: function () {
                    return _markerPosition;
                }
            }
        });

        /**
        * Initializes timescale.
        */
        function init() {
            _container.addClass("cz-timescale");
            _container.addClass("unselectable");
            marker.addClass("cz-timescale-marker");
            markertriangle.addClass("cz-timescale-marker-triangle");
            labelsDiv.addClass("cz-timescale-labels-container");

            marker[0].appendChild(markerText[0]);
            marker[0].appendChild(markertriangle[0]);
            _container[0].appendChild(labelsDiv[0]);
            _container[0].appendChild(canvas[0]);
            _container[0].appendChild(marker[0]);
            (canvas[0]).height = canvasSize;

            text_size = -1;
            strokeStyle = _container ? _container.css("color") : "Black";
            ctx = (canvas[0]).getContext("2d");
            fontSize = 45;
            if (_container.currentStyle) {
                fontSize = _container.currentStyle["font-size"];
                ctx.font = fontSize + _container.currentStyle["font-family"];
            } else if (document.defaultView && (document.defaultView).getComputedStyle) {
                fontSize = (document.defaultView).getComputedStyle(_container[0], null).getPropertyValue("font-size");
                ctx.font = fontSize + (document.defaultView).getComputedStyle(_container[0], null).getPropertyValue("font-family");
            } else if (_container.style) {
                fontSize = _container.style["font-size"];
                ctx.font = fontSize + _container.style["font-family"];
            }
        }

        /**
        * Updates timescale size or its embedded elements' sizes.
        */
        function updateSize() {
            // Updates container's children sizes if container's size is changed.
            var prevSize = _size;

            _width = _container.outerWidth(true);
            _height = _container.outerHeight(true);
            if (isHorizontal) {
                _size = _width;
                if (_size != prevSize) {
                    (canvas[0]).width = _size;
                    labelsDiv.css("width", _size);
                }
            } else {
                _size = _height;
                if (_size != prevSize) {
                    (canvas[0]).height = _size;
                    labelsDiv.css("height", _size);
                }
            }
            _deltaRange = (_size - 1) / (_range.max - _range.min);
            _canvasHeight = (canvas[0]).height;

            if (isHorizontal) {
                // NOTE: No need to calculate max text size of all labels.
                text_size = (_ticksInfo[0] && _ticksInfo[0].height !== text_size) ? _ticksInfo[0].height : 0;
                if (text_size !== 0) {
                    labelsDiv.css("height", text_size);
                    (canvas[0]).height = canvasSize;
                    //_height = text_size + canvasSize;
                    //_container.css("height", _height);
                }
            } else {
                // NOTE: No need to calculate max text size of all labels.
                text_size = (_ticksInfo[0] && _ticksInfo[0].width !== text_size) ? _ticksInfo[0].width : 0;

                if (text_size !== 0) {
                    labelsDiv.css("width", text_size);
                    (canvas[0]).width = canvasSize;
                    var textOffset = 0;
                    _width = text_size + canvasSize + textOffset;
                    _container.css("width", _width);
                }
            }
        }

        /**
        * Sets mode of timescale according to zoom level.
        * In different zoom levels it allows to use different
        * ticksources.
        */
        function setMode() {
            var beta;

            if (_range.min <= -10000) {
                that.mode = "cosmos";
            } else {
                beta = Math.floor(Math.log(_range.max - _range.min) * (1 / Math.log(10)));

                if (beta < 0) {
                    that.mode = "date";
                } else {
                    that.mode = "calendar";
                }
            }
        }

        /**
        * Calculates and caches positions of ticks and labels' size.
        */
        function getTicksInfo() {
            var len = _ticks.length;
            var size;
            var width;
            var height;
            var h = isHorizontal ? _canvasHeight : 0;
            var tick;

            _ticksInfo = new Array(len);

            for (var i = 0; i < len; i++) {
                tick = _ticks[i];

                if (tick.label) {
                    size = tick.label._size;
                    width = size.width;
                    height = size.height;
                    if (!width) {
                        width = ctx.measureText(tick.position).width * 1.5;
                    }
                    if (!height) {
                        height = (isHorizontal ? h : parseFloat(fontSize)) + 8;
                    }
                    _ticksInfo[i] = {
                        position: that.getCoordinateFromTick(tick.position),
                        width: width,
                        height: height,
                        hasLabel: true
                    };
                } else {
                    _ticksInfo[i] = {
                        position: that.getCoordinateFromTick(tick.position),
                        width: 0,
                        height: 0,
                        hasLabel: false
                    };
                }
            }
        }

        /**
        * Adds new labels to container and apply styles to them.
        */
        function addNewLabels() {
            var label;
            var labelDiv;

            for (var i = 0, len = _ticks.length; i < len; i++) {
                label = _ticks[i].label;
                if (label && !label.hasClass('cz-timescale-label')) {
                    labelDiv = label[0];
                    labelsDiv[0].appendChild(labelDiv);
                    label.addClass('cz-timescale-label');
                    label._size = {
                        width: labelDiv.offsetWidth,
                        height: labelDiv.offsetHeight
                    };
                }
            }
        }

        /**
        * Checks whether labels are overlayed or not.
        * @return {[type]}       [description]
        */
        function checkLabelsArrangement() {
            var delta;
            var deltaSize;
            var len = _ticks.length - 1;

            if (len == -1) {
                return false;
            }

            for (var i1 = 0, i2 = 1; i2 < len; i1 = i2, i2++) {
                while (i2 < len + 1 && !_ticksInfo[i2].hasLabel) {
                    i2++;
                }
                if (i2 > len) {
                    break;
                }
                if (_ticksInfo[i1].hasLabel) {
                    delta = Math.abs(_ticksInfo[i2].position - _ticksInfo[i1].position);
                    if (delta < CZ.Settings.minTickSpace)
                        return true;
                    if (isHorizontal) {
                        deltaSize = (_ticksInfo[i1].width + _ticksInfo[i2].width) / 2;
                        if (i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].width / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].width / 2;
                        } else if (i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].width / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].width / 2;
                        }
                    } else {
                        deltaSize = (_ticksInfo[i1].height + _ticksInfo[i2].height) / 2;
                        if (i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].height / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].height / 2;
                        } else if (i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].height / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].height / 2;
                        }
                    }
                    if (delta - deltaSize < CZ.Settings.minLabelSpace) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
        * Updates collection of major ticks.
        * Iteratively insert new ticks and stops when ticks are overlayed.
        * Or decrease number of ticks until ticks are not overlayed.
        */
        function updateMajorTicks() {
            var i;

            // Get ticks from current ticksource.
            _ticks = _tickSources[_mode].getTicks(_range);

            // Adjust number of labels and ticks in timescale.
            addNewLabels();
            getTicksInfo();

            if (checkLabelsArrangement()) {
                for (i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].decreaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if (!checkLabelsArrangement()) {
                        break;
                    }
                }
            } else {
                for (i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].increaseTickCount();
                    addNewLabels();
                    getTicksInfo();

                    if (checkLabelsArrangement()) {
                        _ticks = _tickSources[_mode].decreaseTickCount();
                        getTicksInfo();
                        addNewLabels();
                        break;
                    }
                }
            }
        }

        /**
        * Render base line of timescale.
        */
        function renderBaseLine() {
            if (isHorizontal) {
                if (_position == "bottom") {
                    ctx.fillRect(0, 0, _size, CZ.Settings.timescaleThickness);
                } else {
                    ctx.fillRect(0, CZ.Settings.tickLength, _size, CZ.Settings.timescaleThickness);
                }
            } else {
                if (_position == "right") {
                    ctx.fillRect(0, 0, CZ.Settings.timescaleThickness, _size);
                } else {
                    ctx.fillRect(CZ.Settings.tickLength, 0, CZ.Settings.timescaleThickness, _size);
                }
            }
        }

        /**
        * Renders ticks and labels. If range is a single point then renders
        * only label in the middle of timescale.
        */
        function renderMajorTicks() {
            var x;
            var shift;

            ctx.beginPath();

            for (var i = 0, len = _ticks.length; i < len; i++) {
                x = _ticksInfo[i].position;
                if (isHorizontal) {
                    shift = _ticksInfo[i].width / 2;
                    if (i === 0 && x < shift) {
                        shift = 0;
                    } else if (i == len - 1 && x + shift > _size) {
                        shift *= 2;
                    }

                    ctx.moveTo(x, 1);
                    ctx.lineTo(x, 1 + CZ.Settings.tickLength);

                    if (_ticks[i].label) {
                        _ticks[i].label.css("left", x - shift);
                    }
                } else {
                    x = (_size - 1) - x;
                    shift = _ticksInfo[i].height / 2;
                    if (i === 0 && x + shift > _size) {
                        shift *= 2;
                    } else if (i == len - 1 && x < shift) {
                        shift = 0;
                    }

                    ctx.moveTo(1, x);
                    ctx.lineTo(1 + CZ.Settings.tickLength, x);

                    if (_ticks[i].label) {
                        _ticks[i].label.css("top", x - shift);
                        if (_position == "left") {
                            _ticks[i].label.css("left", text_size - (this.rotateLabels ? _ticksInfo[i].height : _ticksInfo[i].width));
                        }
                    }
                }
            }

            ctx.stroke();
            ctx.closePath();
        }

        /**
        * Gets and renders small ticks between major ticks.
        */
        function renderSmallTicks() {
            var minDelta;
            var i;
            var len;
            var smallTicks = _tickSources[_mode].getSmallTicks(_ticks);
            var x;
            ctx.beginPath();

            if (smallTicks && smallTicks.length > 0) {
                // check for enough space
                minDelta = Math.abs(that.getCoordinateFromTick(smallTicks[1]) - that.getCoordinateFromTick(smallTicks[0]));
                len = smallTicks.length;

                for (i = 1; i < len - 1; i++) {
                    minDelta = Math.min(minDelta, Math.abs(that.getCoordinateFromTick(smallTicks[i + 1]) - that.getCoordinateFromTick(smallTicks[i])));
                }

                if (minDelta >= CZ.Settings.minSmallTickSpace) {
                    switch (_position) {
                        case "bottom":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, 1);
                                ctx.lineTo(x, 1 + CZ.Settings.smallTickLength);
                            }
                            break;
                        case "top":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, CZ.Settings.tickLength - CZ.Settings.smallTickLength);
                                ctx.lineTo(x, 1 + CZ.Settings.tickLength);
                            }
                            break;
                        case "left":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(CZ.Settings.tickLength - CZ.Settings.smallTickLength, _size - x - 1);
                                ctx.lineTo(CZ.Settings.tickLength, _size - x - 1);
                            }
                            break;
                        case "right":
                            for (i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(1, _size - x - 1);
                                ctx.lineTo(1 + CZ.Settings.smallTickLength, _size - x - 1);
                            }
                            break;
                    }
                }
            }

            ctx.stroke();
            ctx.closePath();
        }

        function mouseMove(e) {
            var point = CZ.Common.getXBrowserMouseOrigin(container, e);
            var k = (_range.max - _range.min) / _width;
            var time = _range.max - k * (_width - point.x);
            that.setTimeMarker(time);
        }

        /**
        * Renders marker.
        */
        this.setTimeMarker = function (time, vcGesture) {
            if (typeof vcGesture === "undefined") { vcGesture = false; }
            if ((!mouse_clicked) && (((!vcGesture) || ((vcGesture) && (!mouse_hovered))))) {
                if (time > CZ.Settings.maxPermitedTimeRange.right)
                    time = CZ.Settings.maxPermitedTimeRange.right;
                if (time < CZ.Settings.maxPermitedTimeRange.left)
                    time = CZ.Settings.maxPermitedTimeRange.left;
                var k = (_range.max - _range.min) / _width;
                var point = (time - _range.max) / k + _width;
                var text = _tickSources[_mode].getMarkerLabel(_range, time);
                _markerPosition = point;
                markerText.text(text);
                marker.css("left", point - marker.width() / 2);
            }
        };

        /**
        * Main function for timescale rendering.
        * Updates timescale's visual state.
        */
        function render() {
            // Set mode of timescale. Enabled mode depends on zoom level.
            setMode();

            // Update major ticks collection.
            updateMajorTicks();

            // Update size of timescale and its embedded elements.
            updateSize();

            // Setup canvas' context before rendering.
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;
            ctx.lineWidth = CZ.Settings.timescaleThickness;
            if (isHorizontal) {
                ctx.clearRect(0, 0, _size, canvasSize);
            } else {
                ctx.clearRect(0, 0, canvasSize, _size);
            }

            // Render timescale.
            // NOTE: http://jsperf.com/fill-vs-fillrect-vs-stroke
            renderBaseLine();
            renderMajorTicks();
            renderSmallTicks();
        }

        /**
        * Get screen coordinates of tick.
        * @param  {number} x [description]
        * @return {[type]}   [description]
        */
        this.getCoordinateFromTick = function (x) {
            var delta = _deltaRange;
            var k = _size / (_range.max - _range.min);
            var log10 = 1 / Math.log(10);
            var x1 = k * (x - _range.min);
            var beta;
            var firstYear;

            if (_range.min >= -10000) {
                beta = Math.log(_range.max - _range.min) * log10;
                firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
                if (beta >= 0) {
                    x1 += k * firstYear;
                }
                /*if (beta < 0) {
                x1 -= k * firstYear;
                }*/
            }

            if (isFinite(delta)) {
                return x1;
            } else {
                return _size / 2;
            }
        };

        /**
        * Rerender timescale with new ticks.
        * @param  {object} range { min, max } values of new range.
        */
        this.update = function (range) {
            _range = range;
            render();
        };

        /**
        * Clears container DIV.
        */
        this.destroy = function () {
            _container[0].innerHTML = "";
            _container.removeClass("cz-timescale");
            _container.removeClass("unselectable");
        };

        /**
        * Destroys timescale and removes it from parend node.
        */
        this.remove = function () {
            var parent = _container[0].parentElement;
            if (parent) {
                parent.removeChild(_container[0]);
            }
            this.destroy();
        };
    }
    CZ.Timescale = Timescale;
    ;

    //this is the class for creating ticks
    function TickSource() {
        this.delta, this.beta;
        this.range = { min: -1, max: 0 };
        this.log10 = 1 / Math.log(10);
        this.startDate = null, this.endDate = null, this.firstYear = null;
        this.regime = "";
        this.level = 1;
        this.present;

        var divPool = [];
        var isUsedPool = [];
        var inners = [];
        var styles = [];
        var len = 0;

        this.start;
        this.finish;
        this.width = 900;

        // gets first available div (not used) or creates new one
        this.getDiv = function (x) {
            var inner = this.getLabel(x);
            var i = inners.indexOf(inner);
            if (i != -1) {
                isUsedPool[i] = true;
                styles[i].display = "block";
                return divPool[i];
            } else {
                var i = isUsedPool.indexOf(false);
                if (i != -1) {
                    isUsedPool[i] = true;
                    styles[i].display = "block";
                    inners[i] = inner;
                    var div = divPool[i][0];
                    div.innerHTML = inner;
                    divPool[i]._size = { width: div.offsetWidth, height: div.offsetHeight };
                    return divPool[i];
                } else {
                    var div = $("<div>" + inner + "</div>");
                    isUsedPool[len] = true;
                    divPool[len] = div;
                    inners[len] = inner;
                    styles[len] = div[0].style;
                    div._size = undefined;
                    len++;
                    return div;
                }
            }
        };

        // make all not used divs invisible (final step)
        this.refreshDivs = function () {
            for (var i = 0; i < len; i++) {
                if (isUsedPool[i])
                    isUsedPool[i] = false;
else
                    styles[i].display = "none";
            }
        };

        this.hideDivs = function () {
            for (var i = 0; i < len; i++) {
                styles[i].display = "none";
            }
        };

        this.getTicks = function (range) {
            this.getRegime(range.min, range.max);
            return this.createTicks(range);
        };

        /*    this.getMinTicks = function () {
        this.getRegime(this.range.min, this.range.max);
        return this.createTicks(this.range);
        };*/
        this.getLabel = function (x) {
            return x;
        };

        this.getRegime = function (l, r) {
        };

        this.createTicks = function (range) {
        };

        this.getSmallTicks = function (ticks) {
            if (ticks.length !== 0) {
                return this.createSmallTicks(ticks);
            }
        };

        this.createSmallTicks = function (ticks) {
        };

        this.decreaseTickCount = function () {
            if (this.delta == 1) {
                this.delta = 2;
            } else if (this.delta == 2) {
                this.delta = 5;
            } else if (this.delta == 5) {
                this.delta = 1;
                this.beta++;
            }
            return this.createTicks(this.range);
        };

        this.increaseTickCount = function () {
            if (this.delta == 1) {
                this.delta = 5;
                this.beta--;
            } else if (this.delta == 2) {
                this.delta = 1;
            } else if (this.delta == 5) {
                this.delta = 2;
            }
            return this.createTicks(this.range);
        };

        this.round = function (x, n) {
            var pow = 1;
            var i;
            if (n <= 0) {
                n = Math.max(0, Math.min(-n, 15));
                pow = 1;
                for (i = 0; i > n; i--) {
                    pow /= 10;
                }
                return Math.round(x * pow) / pow;
            } else {
                pow = 1;
                for (i = 0; i < n; i++) {
                    pow *= 10;
                }
                var val = pow * Math.round(x / pow);
                return val;
            }
        };

        //returns text for marker label
        this.getMarkerLabel = function (range, time) {
            return time;
        };
    }
    CZ.TickSource = TickSource;
    ;

    function CosmosTickSource() {
        this.base = CZ.TickSource;
        this.base();
        var that = this;

        this.getLabel = function (x) {
            var text;

            // maximum number of decimal digits
            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4);

            // divide tick coordinate by level of cosmos zoom
            text = Math.abs(x) / this.level;

            if (n < 0) {
                text = (new Number(text)).toFixed(-n);
            }

            text += " " + (x < 0 ? this.regime : String(this.regime).charAt(0));
            return text;
        };

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                // default range
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            if (this.range.min < CZ.Settings.maxPermitedTimeRange.left)
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            if (this.range.max > CZ.Settings.maxPermitedTimeRange.right)
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;

            // set present date
            var localPresent = CZ.Dates.getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);

            if (this.range.min <= -10000000000) {
                // billions of years ago
                this.regime = "Ga";
                this.level = 1000000000;
                if (this.beta < 7) {
                    this.regime = "Ma";
                    this.level = 1000000;
                }
            } else if (this.range.min <= -10000000) {
                // millions of years ago
                this.regime = "Ma";
                this.level = 1000000;
            } else if (this.range.min <= -10000) {
                // thousands of years ago
                this.regime = "ka";
                this.level = 1000;
            }
        };

        this.createTicks = function (range) {
            var ticks = new Array();

            if (this.regime == "Ga" && this.beta < 7)
                this.beta = 7;
else if (this.regime == "Ma" && this.beta < 2)
                this.beta = 2;
else if (this.regime == "ka" && this.beta < -1)
                this.beta = -1;

            var dx = this.delta * Math.pow(10, this.beta);

            // calculate count of ticks to create
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;

            // calculate rounded ticks values
            // they are in virtual coordinates (years from present date)
            var num = 0;
            var x0 = min * dx;
            if (dx == 2)
                count++;
            for (var i = 0; i < count + 1; i++) {
                var tick_position = this.round(x0 + i * dx, this.beta);
                if (tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = { position: tick_position, label: this.getDiv(tick_position) };
                    num++;
                }
            }

            this.refreshDivs();
            return ticks;
        };

        this.createSmallTicks = function (ticks) {
            // function to create minor ticks
            var minors = new Array();

            //       var start = Math.max(this.range.left, maxPermitedTimeRange.left);
            //       var end = Math.min(this.range.right, maxPermitedTimeRange.right);
            //the amount of small ticks
            var n = 4;
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);

            if (k * step < CZ.Settings.minSmallTickSpace)
                return null;
            var tick = ticks[0].position - step;

            while (tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                for (var k = 1; k <= n; k++) {
                    tick = t + step * k;
                    minors.push(tick);
                }
            }

            // create little ticks after last big tick
            tick = ticks[ticks.length - 1].position + step;
            while (tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };

        this.getMarkerLabel = function (range, time) {
            var labelText;
            this.getRegime(range.min, range.max);
            var numOfDigits = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4) - 1;
            labelText = (Math.abs(time / this.level)).toFixed(Math.abs(numOfDigits));

            var localPresent = CZ.Dates.getPresent();
            var presentDate = CZ.Dates.getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);

            if (time == presentDate) {
                if (this.regime !== "ka")
                    labelText = 0;
else
                    labelText = 2;
            }
            labelText += " " + (time < 0 ? this.regime : String(this.regime).charAt(0));
            return labelText;
        };

        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.max(scaleX, scaleY)
            };
            return vs;
        };
    }
    CZ.CosmosTickSource = CosmosTickSource;
    ;
    CZ.CosmosTickSource.prototype = new CZ.TickSource();

    function CalendarTickSource() {
        this.base = CZ.TickSource;
        this.base();

        this.getLabel = function (x) {
            var text;
            var DMY = CZ.Dates.getYMDFromCoordinate(x);
            var year = DMY.year;
            if (year <= 0)
                text = -year + " BCE";
else
                text = year + " CE";
            return text;
        };

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                // default range
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }

            if (this.range.min < CZ.Settings.maxPermitedTimeRange.left)
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            if (this.range.max > CZ.Settings.maxPermitedTimeRange.right)
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;

            // set present date
            var localPresent = CZ.Dates.getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
            this.range.max -= this.firstYear;
            this.range.min -= this.firstYear;

            this.startDate = this.present;
            this.endDate = this.present;
            if (this.range.min < 0) {
                this.startDate = CZ.Dates.getYMDFromCoordinate(this.range.min);
            }
            if (this.range.max < 0) {
                this.endDate = CZ.Dates.getYMDFromCoordinate(this.range.max);
            }

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);

            this.regime = "BCE/CE";
            this.level = 1;
        };

        this.createTicks = function (range) {
            var ticks = new Array();

            if (this.beta < 0)
                this.beta = 0;

            var dx = this.delta * Math.pow(10, this.beta);

            // calculate count of ticks to create
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;

            // calculate rounded ticks values
            // they are in virtual coordinates (years from present date)
            var num = 0;
            var x0 = min * dx;
            if (dx == 2)
                count++;
            for (var i = 0; i < count + 1; i++) {
                var tick_position = CZ.Dates.getCoordinateFromYMD(x0 + i * dx, 0, 1);
                if (tick_position === 0 && dx > 1)
                    tick_position += 1;
                if (tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = { position: tick_position, label: this.getDiv(tick_position) };
                    num++;
                }
            }
            this.refreshDivs();
            return ticks;
        };

        this.createSmallTicks = function (ticks) {
            // function to create minor ticks
            var minors = new Array();

            //the amount of small ticks
            var n = 4;

            var beta1 = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if (beta1 <= 0.3)
                n = 3;

            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);

            if (k * step < CZ.Settings.minSmallTickSpace)
                return null;
            var tick = ticks[0].position - step;

            while (tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;

                if (step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10)
                    t = 0;
                for (var k = 1; k <= n; k++) {
                    tick = t + step * k;

                    //if (tick < 0) tick += 1;
                    minors.push(tick);
                }
            }

            // create little ticks after last big tick
            tick = ticks[ticks.length - 1].position + step;
            while (tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };

        this.getMarkerLabel = function (range, time) {
            var labelText = "";

            this.getRegime(range.min, range.max);
            var currentDate = parseFloat(new Number(time - this.firstYear).toFixed(2));
            currentDate += currentDate > 0 ? -0.5 : -1.5;
            currentDate = Math.round(currentDate);
            if (currentDate < 0) {
                currentDate = -currentDate;
            } else if (currentDate == 0) {
                currentDate = 1;
            }

            labelText = currentDate.toString();

            if (time < this.firstYear + 1) {
                labelText += " " + "BCE";
            } else {
                labelText += " " + "CE";
            }

            return labelText;
        };

        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: scaleX
            };
            return vs;
        };
    }
    CZ.CalendarTickSource = CalendarTickSource;
    ;
    CZ.CalendarTickSource.prototype = new CZ.TickSource();

    function DateTickSource() {
        this.base = CZ.TickSource;
        this.base();

        var year, month, day;

        // span between two rendering neighboring days
        var tempDays = 0;

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                // default range
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }

            if (this.range.min < CZ.Settings.maxPermitedTimeRange.left)
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            if (this.range.max > CZ.Settings.maxPermitedTimeRange.right)
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;

            // set present date
            var localPresent = CZ.Dates.getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);

            this.startDate = CZ.Dates.getYMDFromCoordinate(this.range.min);
            this.endDate = CZ.Dates.getYMDFromCoordinate(this.range.max);

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.log(this.range.max - this.range.min) * this.log10;

            if (this.beta >= -0.2)
                this.regime = "Quarters_Month";
            if (this.beta <= -0.2 && this.beta >= -0.8)
                this.regime = "Month_Weeks";
            if (this.beta <= -0.8 && this.beta >= -1.4)
                this.regime = "Weeks_Days";
            if (this.beta <= -1.4)
                this.regime = "Days_Quarters";

            this.level = 1;
        };

        this.getLabel = function (x) {
            var text = CZ.Dates.months[month];
            var year_temp = year;
            if (year == 0)
                year_temp--;
            if (text == "January")
                text += " " + year_temp;
            if (tempDays == 1)
                text = day + " " + CZ.Dates.months[month];
            if ((this.regime == "Weeks_Days") && (day == 3))
                text += ", " + year_temp;
            if ((this.regime == "Days_Quarters") && (day == 1))
                text += ", " + year_temp;
            return text;
        };

        this.getMinTicks = function () {
            this.getRegime(this.range.min, this.range.max);
            return this.createTicks(this.range);
        };

        this.createTicks = function (range) {
            tempDays = 0;
            var ticks = new Array();
            var num = 0;

            // count number of months to render
            var countMonths = 0;

            // count number of days to render
            var countDays = 0;

            //current year and month to start counting
            var tempYear = this.startDate.year;
            var tempMonth = this.startDate.month;
            while (tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                countMonths++;
                tempMonth++;
                if (tempMonth >= 12) {
                    tempMonth = 0;
                    tempYear++;
                }
            }

            // calculate ticks values
            // they are in virtual coordinates (years from present date)
            year = this.startDate.year;

            // create month ticks
            month = this.startDate.month - 1;
            var month_step = 1;
            var date_step = 1;
            for (var j = 0; j <= countMonths + 2; j += month_step) {
                month += month_step;
                if (month >= 12) {
                    month = 0;
                    year++;
                }

                if ((this.regime == "Quarters_Month") || (this.regime == "Month_Weeks")) {
                    var tick = CZ.Dates.getCoordinateFromYMD(year, month, 1);
                    if (tick >= this.range.min && tick <= this.range.max) {
                        if (tempDays != 1) {
                            if ((month % 3 == 0) || (this.regime == "Month_Weeks")) {
                                ticks[num] = { position: tick, label: this.getDiv(tick) };
                                num++;
                            }
                        }
                    }
                }

                if ((this.regime == "Weeks_Days") || (this.regime == "Days_Quarters")) {
                    countDays = Math.floor(CZ.Dates.daysInMonth[month]);
                    if ((month === 1) && (CZ.Dates.isLeapYear(year)))
                        countDays++;
                    tempDays = 1;
                    for (var k = 1; k <= countDays; k += date_step) {
                        day = k;
                        tick = CZ.Dates.getCoordinateFromYMD(year, month, day);
                        if (tick >= this.range.min && tick <= this.range.max) {
                            if (this.regime == "Weeks_Days") {
                                if ((k == 3) || (k == 10) || (k == 17) || (k == 24) || (k == 28)) {
                                    ticks[num] = { position: tick, label: this.getDiv(tick) };
                                    num++;
                                }
                            } else {
                                ticks[num] = { position: tick, label: this.getDiv(tick) };
                                num++;
                            }
                        }
                    }
                }
            }
            this.refreshDivs();
            return ticks;
        };

        this.createSmallTicks = function (ticks) {
            // function to create minor ticks
            var minors = new Array();

            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;

            var step;

            var n;
            var tick = ticks[0].position;
            var date = CZ.Dates.getYMDFromCoordinate(tick);

            if (this.regime == "Quarters_Month")
                n = 2;
else if (this.regime == "Month_Weeks")
                n = CZ.Dates.daysInMonth[date.month];
else if (this.regime == "Weeks_Days")
                n = 7;
else if (this.regime == "Days_Quarters")
                n = 4;

            if (this.regime == "Quarters_Month")
                step = Math.floor(2 * CZ.Dates.daysInMonth[date.month] / n);
else if (this.regime == "Month_Weeks")
                step = 1;
else if (this.regime == "Weeks_Days")
                step = 1;
else if (this.regime == "Days_Quarters")
                step = 0.25;

            if (k * step < CZ.Settings.minSmallTickSpace)
                return null;

            date.day -= step;
            tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);

            if (this.regime != "Month_Weeks") {
                while (tick > this.range.min) {
                    minors.push(tick);
                    date.day -= step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                }
            } else {
                var j = CZ.Dates.daysInMonth[date.month];
                while (tick > this.range.min) {
                    if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 27)) {
                        minors.push(tick);
                    }
                    date.day -= step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    j--;
                }
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var tick = ticks[i].position;
                var date = CZ.Dates.getYMDFromCoordinate(tick);
                var j_step = 1;
                for (var j = 1; j <= n; j += j_step) {
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    if (this.regime != "Month_Weeks") {
                        if (minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace)
                            minors.push(tick);
                    } else {
                        if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                            if (minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace)
                                minors.push(tick);
                        }
                    }
                }
            }
            var tick = ticks[ticks.length - 1].position;
            var date = CZ.Dates.getYMDFromCoordinate(tick);
            date.day += step;
            tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);

            if (this.regime != "Month_Weeks") {
                while (tick < this.range.max) {
                    minors.push(tick);
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                }
            } else {
                var j = 0;
                while (tick < this.range.max) {
                    if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                        minors.push(tick);
                    }
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    j++;
                }
            }
            return minors;
        };

        this.getMarkerLabel = function (range, time) {
            this.getRegime(range.min, range.max);
            var date = CZ.Dates.getYMDFromCoordinate(time, true);
            var labelText = date.year + "." + (date.month + 1) + "." + date.day;
            return labelText;
        };

        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.min(scaleX, scaleY)
            };
            return vs;
        };
    }
    CZ.DateTickSource = DateTickSource;
    ;
    CZ.DateTickSource.prototype = new CZ.TickSource();
})(CZ || (CZ = {}));
