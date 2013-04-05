/// <reference path='cz.settings.ts'/>
/// <reference path='common.ts'/>

module CZ {
    export module Timescale {

        var that = this;
        var _container = container;
        var _range = { min: 0, max: 1 };
        var _ticks = [];
        var _ticksInfo = [];
        var _mode = "cosmos";
        var _position = "top";
        var _deltaRange;
        // TODO: Consider to remove or replace.
        var _size;
        var _canvasHeight;

        var _tickSources = {
            "cosmos": new CZ.CosmosTickSource(),
            "calendar": new CZ.CalendarTickSource(),
            "date": new CZ.DateTickSource()
        };

        var that = this;
        var isHorizontal = (_position === "bottom" || _position === "top");
        var canvas = $("<canvas></canvas>");
        var labelsDiv = $("<div></div>");

        var marker = $("<div id='timescale_marker' class='cz-timescale-marker'></div>");
        var markerText = $("<p id='marker-text'></p>");
        var leftDatePanel = $("<div class='cz-timescale-panel cz-timescale-left'></div>");
        var leftDate = $("<p id='timescale_left_border'></p>");
        var rightDatePanel = $("<div clas='cz-timescale-panel cz-timescale-left'></div>");
        var rightDate = $("<p id='timescale_right_border'></p>");

        // TODO: Consider to rename.
        var canvasSize = CZ.Settings.tickLength + CZ.Settings.timescaleThickness;
        // TODO: Consider to rename.
        var text_size;
        var fontSize;
        var strokeStyle;
        var ctx;

        export function Initialize(container) {
            //CZ.Timescale = function (container) {
            /**
             * Input parameter must be jQuery object, DIV element or ID. Convert it to jQuery object.
             */
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


            //    var self = this;
            container.mousemove(function (e) { mouseMove(e) });
            _container = container;


            init();

            /*
             * Properties of timescale.
             */
            Object.defineProperties(this, {
                // TODO: Consider to update orientation of timescale.
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
            });
        }
 

        /**
         * Initializes timescale.
         */
        function init() {
            // TODO: #50, change timescale position.
            _container.addClass("cz-timescale");
            _container.addClass("unselectable");
            rightDatePanel.addClass("cz-timescale-right");
            rightDatePanel.addClass("cz-timescale-panel");
            leftDatePanel.addClass("cz-timescale-left");
            leftDatePanel.addClass("cz-timescale-panel");
            marker.addClass("cz-timescale-marker");

            marker[0].appendChild(markerText[0]);
            leftDatePanel[0].appendChild(leftDate[0]);
            rightDatePanel[0].appendChild(rightDate[0]);
            _container[0].appendChild(labelsDiv[0]);
            _container[0].appendChild(canvas[0]);
            _container[0].appendChild(marker[0]);
            _container[0].appendChild(leftDatePanel[0]);
            _container[0].appendChild(rightDatePanel[0]);
            canvas[0].height = canvasSize;

            // TODO: #99-121, refine it.
            text_size = -1;
            strokeStyle = _container ? _container.css("color") : "Black";
            ctx = canvas[0].getContext("2d");
            fontSize = 45;
            if (_container.currentStyle) {
                fontSize = _container.currentStyle["font-size"];
                ctx.font = fontSize + _container.currentStyle["font-family"];
            }
            else if (document.defaultView && document.defaultView.getComputedStyle) {
                fontSize = document.defaultView.getComputedStyle(_container[0], null).getPropertyValue("font-size");
                ctx.font = fontSize + document.defaultView.getComputedStyle(_container[0], null).getPropertyValue("font-family");
            }
            else if (_container.style) {
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
                    canvas[0].width = _size;
                    labelsDiv.css("width", _size);
                }
            }
            else {
                _size = _height;
                if (_size != prevSize) {
                    canvas[0].height = _size;
                    labelsDiv.css("height", _size);
                }
            }
            _deltaRange = (_size - 1) / (_range.max - _range.min);
            _canvasHeight = canvas[0].height;

            // Updates container's size according to text size in labels.
            if (isHorizontal) {
                // NOTE: No need to calculate max text size of all labels.
                text_size = (_ticksInfo[0] && _ticksInfo[0].height !== text_size) ? _ticksInfo[0].height : 0;
                if (text_size !== 0) {
                    labelsDiv.css("height", text_size);
                    canvas[0].height = canvasSize;
                    //_height = text_size + canvasSize;
                    //_container.css("height", _height);
                }
            }
            else {
                // NOTE: No need to calculate max text size of all labels.
                text_size = (_ticksInfo[0] && _ticksInfo[0].width !== text_size) ? _ticksInfo[0].width : 0;
                if (text_size !== old_text_size && text_size !== 0) {
                    labelsDiv.css("width", text_size);
                    canvas[0].width = canvasSize;
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
            }
            else {
                beta = Math.floor(Math.log(_range.max - _range.min) * (1 / Math.log(10)));

                // BCE or CE years
                if (beta < 0) {
                    that.mode = "date";
                }
                else {
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
                }
                else {
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
                    if (delta < CZ.Settings.minTickSpace) return true;
                    if (isHorizontal) {
                        deltaSize = (_ticksInfo[i1].width + _ticksInfo[i2].width) / 2;
                        if (i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].width / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].width / 2;
                        } else if (i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].width / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].width / 2;
                        }
                    }
                    else {
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
                // If labels overlay each other then decrease number of ticks.
                for (i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].decreaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if (!checkLabelsArrangement()) {
                        break;
                    }
                }
            } else {
                // If labels don't overlay each other then increase number of ticks.
                for (i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].increaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    // There is no more space to insert new ticks. Decrease number of ticks.
                    if (checkLabelsArrangement(_ticks)) {
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
            }
            else {
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
                }
                else {
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
            var point = getXBrowserMouseOrigin(container, e);
            var k = (_range.max - _range.min) / _width;
            var time = _range.max - k * (_width - point.x);
            that.setTimeMarker(time);
            that.setTimeBorders();
        }

        var markerPosition = -1
        /**
         * Renders marker.
        */
        function setTimeMarker(time) {
            if (time > maxPermitedTimeRange.right) time = maxPermitedTimeRange.right;
            if (time < maxPermitedTimeRange.left) time = maxPermitedTimeRange.left;
            var k = (_range.max - _range.min) / _width;
            var point = (time - _range.max) / k + _width;
            markerPosition = point;
            $('#timescale_marker').css("left", point - 80);
            var text = _tickSources[_mode].getMarkerLabel(_range, time);
            document.getElementById('marker-text').innerHTML = text;
        }

        function setTimeBorders() {
            var k = (_range.max - _range.min) / _width;

            var left_time = _range.min;
            var right_time = _range.max;

            if (right_time > maxPermitedTimeRange.right) {
                right_time = maxPermitedTimeRange.right;
                var right_pos = (right_time - _range.max) / k + _width;
            } else {
                var right_pos = (right_time - _range.max) / k + _width - 73;
            }
            if (left_time < maxPermitedTimeRange.left) {
                left_time = maxPermitedTimeRange.left;
                var left_pos = (left_time - _range.max) / k + _width;
            } else {
                var left_pos = (left_time - _range.max) / k + _width;
            }

            //$('#timescale_left_border').css("left", left_pos);
            //$('#timescale_right_border').css("left", right_pos);

            var left_text = _tickSources[_mode].getMarkerLabel(_range, left_time);
            var right_text = _tickSources[_mode].getMarkerLabel(_range, right_time);
            document.getElementById('timescale_left_border').innerHTML = left_text;
            document.getElementById('timescale_right_border').innerHTML = right_text;
        }

        export function MarkerPosition() {
            return markerPosition;
        }



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
        export function getCoordinateFromTick(x) {
            var delta = _deltaRange;
            var k = _size / (_range.max - _range.min);
            var log10 = 1 / Math.log(10);
            var x1 = k * (x - _range.min);
            var beta;
            var firstYear;

            if (_range.min >= -10000) {
                beta = Math.log(_range.max - _range.min) * log10;//Math.floor(Math.log(_range.max - _range.min) * log10);
                firstYear = getCoordinateFromDMY(0, 0, 1);
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
        }

        /**
         * Rerender timescale with new ticks.
         * @param  {object} range { min, max } values of new range.
         */
        function update(range) {
            _range = range;
            render();
            CZ.Timescale.setTimeBorders();
        }

        /**
         * Clears container DIV.
         */
        function destroy() {
            _container[0].innerHTML = "";
            _container.removeClass("cz-timescale");
            _container.removeClass("unselectable");
        }

        /**
         * Destroys timescale and removes it from parend node.
         */
        export function remove () {
            var parent = _container[0].parentElement;
            if (parent) {
                parent.removeChild(_container[0]);
            }
            destroy();
        }
    }


    //this is the class for creating ticks 
    export module TickSource {

        var delta, beta;
        var range = { min: -1, max: 0 }
        var log10 = 1 / Math.log(10);
        var startDate = null, // start date of range in 'date' mode
        var endDate = null, // end date of range in 'date' mode

        var firstYear = null;
        var regime = ""; // "Ga", "Ma", "ka" for 'cosmos' mode, "BCE/CE" for 'calendar' mode, "Date" for 'date' mode
        var level = 1; // divider for each regime
        var present;

        var divPool = [];
        var isUsedPool = [];
        var inners = [];
        var styles = [];
        var len = 0;

        var start;
        var finish;
        var width = 900;

        // gets first available div (not used) or creates new one
        function getDiv(x) {
            var inner = CZ.TickSource.getLabel(x);
            var i = inners.indexOf(inner);
            if (i != -1) {
                isUsedPool[i] = true;
                styles[i].display = "block";
                return divPool[i];
            }
            else {
                var i = isUsedPool.indexOf(false);
                if (i != -1) {
                    isUsedPool[i] = true;
                    styles[i].display = "block";
                    inners[i] = inner;
                    var div = divPool[i][0];
                    div.innerHTML = inner;
                    divPool[i]._size = { width: div.offsetWidth, height: div.offsetHeight };
                    return divPool[i];
                }
                else {
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
        }

        // make all not used divs invisible (final step)
        export function refreshDivs() {
            for (var i = 0; i < len; i++) {
                if (isUsedPool[i]) isUsedPool[i] = false;
                else styles[i].display = "none";
            }
        }

        function hideDivs() {
            for (var i = 0; i < len; i++) {
                styles[i].display = "none";
            }
        }

        export function getTicks(range) {
            getRegime(range.min, range.max);
            return createTicks(range);
        }

        function getLabel(x) {
            return x;
        }

        function getRegime(l, r) {
        };

        function createTicks(range) {
        };

        export function getSmallTicks(ticks) {
            return createSmallTicks(ticks);
        };

        function createSmallTicks(ticks) {
        };

        function decreaseTickCount() {
            if (delta == 1) {
                delta = 2;
            }
            else if (delta == 2) {
                delta = 5;
            }
            else if (delta == 5) {
                delta = 1;
                beta++;
            }
            return createTicks(range);
        };

        function increaseTickCount() {
            if (delta == 1) {
                delta = 5;
                beta--;
            }
            else if (delta == 2) {
                delta = 1;
            }
            else if (delta == 5) {
                delta = 2;
            }
            return createTicks(range);
        };

        function round(x, n) {
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
        };

        //returns text for marker label
        function getMarkerLabel(range, time) {
            return time;
        };

        export module CosmosTickSource {
            //var that = this;
            function getLabel(x) {
                var text;
                // maximum number of decimal digits
                var n = Math.max(Math.floor(Math.log(CZ.TickSource.delta * Math.pow(10, CZ.TickSource.beta) / CZ.TickSource.level) * CZ.TickSource.log10), -4);
                // divide tick coordinate by level of cosmos zoom
                text = -x / CZ.TickSource.level;
                if (n < 0) text = (new Number(text)).toFixed(-n);
                text += " " + CZ.TickSource.regime;
                return text;
            }

            function getRegime(l, r) {
                if (l < r) {
                    CZ.TickSource.range.min = l;
                    CZ.TickSource.range.max = r;
                }
                else {
                    // default range
                    CZ.TickSource.range.min = maxPermitedTimeRange.left;
                    CZ.TickSource.range.max = maxPermitedTimeRange.right;
                }
                if (CZ.TickSource.range.min < maxPermitedTimeRange.left) CZ.TickSource.range.min = maxPermitedTimeRange.left;
                if (CZ.TickSource.range.max > maxPermitedTimeRange.right) CZ.TickSource.range.max = maxPermitedTimeRange.right;

                // set present date
                var localPresent = getPresent();
                CZ.TickSource.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

                // remember value in virtual coordinates when 1CE starts
                CZ.TickSource.firstYear = getCoordinateFromDMY(0, 0, 1);

                // set default constant for arranging ticks
                CZ.TickSource.delta = 1;
                CZ.TickSource.beta = Math.floor(Math.log(CZ.TickSource.range.max - CZ.TickSource.range.min) * CZ.TickSource.log10);

                if (CZ.TickSource.range.min <= -10000000000) {
                    // billions of years ago
                    CZ.TickSource.regime = "Ga";
                    CZ.TickSource.level = 1000000000;
                    if (CZ.TickSource.beta < 7) {
                        CZ.TickSource.regime = "Ma";
                        CZ.TickSource.level = 1000000;
                    }
                }
                else if (CZ.TickSource.range.min <= -10000000) {
                    // millions of years ago
                    CZ.TickSource.regime = "Ma";
                    CZ.TickSource.level = 1000000;
                }
                else if (CZ.TickSource.range.min <= -10000) {
                    // thousands of years ago
                    CZ.TickSource.regime = "ka";
                    CZ.TickSource.level = 1000;
                }

            }

            function createTicks(range) {
                var ticks = new Array();

                // prevent zooming deeper than 4 decimal digits
                if (CZ.TickSource.regime == "Ga" && CZ.TickSource.beta < 7) CZ.TickSource.beta = 7;
                else if (CZ.TickSource.regime == "Ma" && CZ.TickSource.beta < 2) CZ.TickSource.beta = 2;
                else if (CZ.TickSource.regime == "ka" && CZ.TickSource.beta < -1) CZ.TickSource.beta = -1;

                var dx = CZ.TickSource.delta * Math.pow(10, CZ.TickSource.beta);
                // calculate count of ticks to create
                var min = Math.floor(CZ.TickSource.range.min / dx);
                var max = Math.floor(CZ.TickSource.range.max / dx);
                var count = max - min + 1;
                // calculate rounded ticks values
                // they are in virtual coordinates (years from present date)
                var num = 0;
                var x0 = min * dx;    //coord of first tick
                if (dx == 2) count++;
                for (var i = 0; i < count + 1; i++) {
                    var tick_position = CZ.TickSource.round(x0 + i * dx, CZ.TickSource.beta);
                    if (tick_position >= CZ.TickSource.range.min && tick_position <= CZ.TickSource.range.max && tick_position != ticks[ticks.length - 1]) {
                        ticks[num] = { position: tick_position, label: CZ.TickSource.CosmosTickSource.getDiv(tick_position) };
                        num++;
                    }
                }

                CZ.TickSource.refreshDivs();
                return ticks;
            }

            function createSmallTicks(ticks) {
                // function to create minor ticks
                var minors = new Array();
                //the amount of small ticks
                var n = 4;
                var k = CZ.TickSource.width / (CZ.TickSource.range.max - CZ.TickSource.range.min);
                var nextStep = true;
                var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
                var step = l / (n + 1);

                if (k * step < CZ.Settings.minSmallTickSpace) return null;
                var tick = ticks[0].position - step;

                // create little ticks before first big tick
                while (tick > CZ.TickSource.range.min) {
                    minors.push(tick);
                    tick -= step;
                }

                for (var i = 0; i < ticks.length - 1; i++) {
                    var t = ticks[i].position;
                    /*    // Count minor ticks from 1BCE, not from 1CE if step between large ticks greater than 1
                        if (step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10)
                            t = 0;*/
                    for (var k = 1; k <= n; k++) {
                        tick = t + step * k;
                        minors.push(tick);
                    }
                }

                // create little ticks after last big tick
                tick = ticks[ticks.length - 1].position + step;
                while (tick < CZ.TickSource.range.max) {
                    minors.push(tick);
                    tick += step;
                }
                return minors;
            }

            function getMarkerLabel(range, time) {
                var text;
                getRegime(range.min, range.max);
                var n = Math.max(Math.floor(Math.log(CZ.TickSource.delta * Math.pow(10, CZ.TickSource.beta) / CZ.TickSource.level) * CZ.TickSource.log10), -4) - 1;
                if (n > 20) n = 20;
                if (n < -20) n = -20;
                if (n < 0) text = (new Number(-time / CZ.TickSource.level)).toFixed(-n);
                else text = (new Number(-time / CZ.TickSource.level)).toFixed(n);
                text += " " + CZ.TickSource.regime;
                return text;
            };

        }
        export module CalendarTickSource {
           // var that = this;
            function getLabel(x) {
                var text;
                if (x <= 0) text = -x + 1 + " BCE";//text = x - 1;
                else text = x + " AD";
                return text;
            }

            function getRegime(l, r) {
                if (l < r) {
                    CZ.TickSource.range.min = l;
                    CZ.TickSource.range.max = r;
                }
                else {
                    // default range
                    CZ.TickSource.range.min = maxPermitedTimeRange.left;
                    CZ.TickSource.range.max = maxPermitedTimeRange.right;
                }

                if (CZ.TickSource.range.min < maxPermitedTimeRange.left) CZ.TickSource.range.min = maxPermitedTimeRange.left;
                if (CZ.TickSource.range.max > maxPermitedTimeRange.right) CZ.TickSource.range.max = maxPermitedTimeRange.right;


                // set present date
                var localPresent = getPresent();
                CZ.TickSource.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

                // remember value in virtual coordinates when 1CE starts
                CZ.TickSource.firstYear = getCoordinateFromDMY(0, 0, 1);

                CZ.TickSource.range.max -= CZ.TickSource.firstYear;
                CZ.TickSource.range.min -= CZ.TickSource.firstYear;

                CZ.TickSource.startDate = CZ.TickSource.present;
                CZ.TickSource.endDate = CZ.TickSource.present;
                if (CZ.TickSource.range.min < 0) {
                    CZ.TickSource.startDate = getDMYFromCoordinate(CZ.TickSource.range.min);
                }
                if (CZ.TickSource.range.max < 0) {
                    CZ.TickSource.endDate = getDMYFromCoordinate(CZ.TickSource.range.max);
                }

                // set default constant for arranging ticks
                CZ.TickSource.delta = 1;
                CZ.TickSource.beta = Math.floor(Math.log(CZ.TickSource.range.max - CZ.TickSource.range.min) * CZ.TickSource.log10);


                CZ.TickSource.regime = "BCE/CE";
                CZ.TickSource.level = 1;
            }

            function createTicks(range) {
                var ticks = new Array();
                // shift range limits as in calendar mode we count from present year

                // prevent zooming deeper than 1 year span
                if (CZ.TickSource.beta < 0) CZ.TickSource.beta = 0;

                var dx = CZ.TickSource.delta * Math.pow(10, CZ.TickSource.beta);
                // calculate count of ticks to create
                var min = Math.floor(CZ.TickSource.range.min / dx);
                var max = Math.floor(CZ.TickSource.range.max / dx);
                var count = max - min + 1;
                // calculate rounded ticks values
                // they are in virtual coordinates (years from present date)
                var num = 0;
                var x0 = min * dx;
                if (dx == 2) count++;
                for (var i = 0; i < count + 1; i++) {
                    var tick_position = CZ.TickSource.round(x0 + i * dx, CZ.TickSource.beta);
                    //if (tick_position <=0 ) tick_position += 1;
                    if (tick_position < 1e-10 && dx > 1) tick_position += 1;// Move tick from 1BCE to 1CE
                    if (tick_position >= CZ.TickSource.range.min && tick_position <= CZ.TickSource.range.max && tick_position != ticks[ticks.length - 1]) {
                        ticks[num] = { position: tick_position, label: CZ.TickSource.getDiv(tick_position) };
                        num++;
                    }
                }
                CZ.TickSource.refreshDivs();
                return ticks;
            }

            function createSmallTicks(ticks) {
                // function to create minor ticks
                var minors = new Array();
                //       var start = Math.max(this.range.left, maxPermitedTimeRange.left);
                //       var end = Math.min(this.range.right, maxPermitedTimeRange.right);
                //the amount of small ticks
                var n = 4;

                var beta1 = Math.floor(Math.log(CZ.TickSource.range.max - CZ.TickSource.range.min) * CZ.TickSource.log10);
                if (beta1 <= 0.3) n = 3;

                var k = CZ.TickSource.width / (CZ.TickSource.range.max - CZ.TickSource.range.min);
                var nextStep = true;
                var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
                var step = l / (n + 1);

                if (k * step < CZ.Settings.minSmallTickSpace) return null;
                var tick = ticks[0].position - step;

                // create little ticks before first big tick
                while (tick > CZ.TickSource.range.min) {
                    minors.push(tick);
                    tick -= step;
                }

                for (var i = 0; i < ticks.length - 1; i++) {
                    var t = ticks[i].position;
                    // Count minor ticks from 1BCE, not from 1CE if step between large ticks greater than 1
                    if (step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10) t = 0;
                    for (var k = 1; k <= n; k++) {
                        tick = t + step * k;
                        //if (tick < 0) tick += 1;
                        minors.push(tick);
                    }
                }

                // create little ticks after last big tick
                tick = ticks[ticks.length - 1].position + step;
                while (tick < CZ.TickSource.range.max) {
                    minors.push(tick);
                    tick += step;
                }
                return minors;
            }

            function getMarkerLabel(range, time) {
                CZ.TickSource.CalendarTickSource.getRegime(range.min, range.max);
                var text = parseFloat(new Number(time - CZ.TickSource.firstYear).toFixed(2));
                text += (text > 0 ? -0.5 : -1.5);
                text = Math.round(text);
                if (text < 0) text = -text;
                else if (text == 0) text = 1;
                if (time < CZ.TickSource.firstYear + 1) text += " " + "BCE";
                else text += " " + "AD";
                return text;
            }
        }
        export module DateTickSource {
          //  var that = this;
            var year, month, day;
        // span between two rendering neighboring days
            var tempDays = 0;

            function getRegime(l, r) {
                if (l < r) {
                    CZ.TickSource.range.min = l;
                    CZ.TickSource.range.max = r;
                }
                else {
                    // default range
                    CZ.TickSource.range.min = maxPermitedTimeRange.left;
                    CZ.TickSource.range.max = maxPermitedTimeRange.right;
                }

                if (CZ.TickSource.range.min < maxPermitedTimeRange.left) CZ.TickSource.range.min = maxPermitedTimeRange.left;
                if (CZ.TickSource.range.max > maxPermitedTimeRange.right) CZ.TickSource.range.max = maxPermitedTimeRange.right;


                // set present date
                var localPresent = getPresent();
                CZ.TickSource.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

                // remember value in virtual coordinates when 1CE starts
                CZ.TickSource.firstYear = getCoordinateFromDMY(0, 0, 1);

                CZ.TickSource.startDate = CZ.TickSource.present;
                CZ.TickSource.endDate = CZ.TickSource.present;

                CZ.TickSource.startDate = getDMYFromCoordinate(CZ.TickSource.range.min);
                CZ.TickSource.endDate = getDMYFromCoordinate(CZ.TickSource.range.max);

                // set default constant for arranging ticks
                CZ.TickSource.delta = 1;
                //  this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
                CZ.TickSource.beta = Math.log(CZ.TickSource.range.max - CZ.TickSource.range.min) * CZ.TickSource.log10;

                if (CZ.TickSource.beta >= -0.2) CZ.TickSource.regime = "Quarters_Month";
                if (CZ.TickSource.beta <= -0.2 && CZ.TickSource.beta >= -0.8) CZ.TickSource.regime = "Month_Weeks";
                if (CZ.TickSource.beta <= -0.8 && CZ.TickSource.beta >= -1.4) CZ.TickSource.regime = "Weeks_Days";
                if (CZ.TickSource.beta <= -1.4) CZ.TickSource.regime = "Days_Quarters";

                CZ.TickSource.level = 1;
            }

            function getLabel(x) {
                var text = months[month];
                var year_temp = year;
                if (year == 0) year_temp--;
                if (text == "January") text += " " + year_temp;
                if (tempDays == 1) text = day + " " + months[month];
                if ((CZ.TickSource.regime == "Weeks_Days") && (day == 3)) text += ", " + year_temp;
                if ((CZ.TickSource.regime == "Days_Quarters") && (day == 1)) text += ", " + year_temp;
                return text;
            }

            function getMinTicks() {
                CZ.TickSource.DateTickSource.getRegime(CZ.TickSource.range.min, CZ.TickSource.range.max);
                return CZ.TickSource.createTicks(CZ.TickSource.range);
            }

            function createTicks(range) {
                tempDays = 0;
                var ticks = new Array();
                var num = 0;
                // count number of months to render
                var countMonths = 0;
                // count number of days to render
                var countDays = 0;
                //current year and month to start counting 
                var tempYear = CZ.TickSource.startDate.year;
                var tempMonth = CZ.TickSource.startDate.month;
                while (tempYear < CZ.TickSource.endDate.year || (tempYear == CZ.TickSource.endDate.year && tempMonth <= CZ.TickSource.endDate.month)) {
                    countMonths++;
                    tempMonth++;
                    if (tempMonth == 12) {
                        tempMonth = 0;
                        tempYear++;
                    }
                }

                // calculate ticks values
                // they are in virtual coordinates (years from present date)
                year = CZ.TickSource.startDate.year;
                // create month ticks
                month = CZ.TickSource.startDate.month - 1;
                var month_step = 1; //step to render month
                var date_step = 1; //step to render days
                for (var j = 0; j <= countMonths + 2; j += month_step) {
                    month += month_step;
                    if (month >= 12) {
                        month = 0;
                        year++;
                    }

                    //if (year == 0) year--;

                    if ((CZ.TickSource.regime == "Quarters_Month") || (CZ.TickSource.regime == "Month_Weeks")) {
                        //if (year == 0) year--;
                        var tick = getCoordinateFromDMY(year, month, 1);
                        if (tick >= CZ.TickSource.range.min && tick <= CZ.TickSource.range.max) {
                            if (tempDays != 1) {
                                if ((month % 3 == 0) || (CZ.TickSource.regime == "Month_Weeks")) {
                                    //  if (year < this.firstYear) year++;
                                    ticks[num] = { position: tick, label: CZ.TickSource.getDiv(tick) };
                                    num++;
                                }
                            }
                        }
                    }
                    // create days ticks for this month
                    if ((CZ.TickSource.regime == "Weeks_Days") || (CZ.TickSource.regime == "Days_Quarters")) {
                        countDays = Math.floor(daysInMonth[month]);
                        tempDays = 1;
                        for (var k = 1; k <= countDays; k += date_step) {
                            day = k;
                            tick = getCoordinateFromDMY(year, month, day);
                            if (tick >= CZ.TickSource.range.min && tick <= CZ.TickSource.range.max) {
                                if (CZ.TickSource.regime == "Weeks_Days") {
                                    if ((k == 3) || (k == 10) || (k == 17) || (k == 24) || (k == 28)) {
                                        ticks[num] = { position: tick, label: CZ.TickSource.getDiv(tick) };
                                        num++;
                                    }
                                } else {
                                    ticks[num] = { position: tick, label: CZ.TickSource.getDiv(tick) };
                                    num++;
                                }
                            }
                        }
                    }
                }
                CZ.TickSource.refreshDivs();
                return ticks;
            }

            function createSmallTicks(ticks) {

                // function to create minor ticks
                var minors = new Array();
                //       var start = Math.max(this.range.left, maxPermitedTimeRange.left);
                //       var end = Math.min(this.range.right, maxPermitedTimeRange.right);
                //the amount of small ticks

                var k = CZ.TickSource.width / (CZ.TickSource.range.max - CZ.TickSource.range.min);
                var nextStep = true;

                var step;

                var n;//Math.floor(daysInMonth[date.month] / step);
                var tick = ticks[0].position;
                var date = getDMYFromCoordinate(tick);

                if (CZ.TickSource.regime == "Quarters_Month") n = 2;
                else if (CZ.TickSource.regime == "Month_Weeks") n = daysInMonth[date.month];//step = 5 / daysInMonth[date.month];
                else if (CZ.TickSource.regime == "Weeks_Days") n = 7;//step = 5 / 7;
                else if (CZ.TickSource.regime == "Days_Quarters") n = 4; //step = 5 / 4;

                if (CZ.TickSource.regime == "Quarters_Month") step = Math.floor(2 * daysInMonth[date.month] / n);
                else if (CZ.TickSource.regime == "Month_Weeks") step = 1;
                else if (CZ.TickSource.regime == "Weeks_Days") step = 1;
                else if (CZ.TickSource.regime == "Days_Quarters") step = 0.25;

                if (k * step < CZ.Settings.minSmallTickSpace) return null;

                date.day -= step;
                tick = getCoordinateFromDMY(date.year, date.month, date.day);


                if (CZ.TickSource.regime != "Month_Weeks") {
                    while (tick > CZ.TickSource.range.min) {
                        minors.push(tick);
                        date.day -= step;
                        tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    }
                } else {
                    var j = daysInMonth[date.month];
                    while (tick > CZ.TickSource.range.min) {
                        if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 27)) {
                            minors.push(tick);
                        }
                        date.day -= step;
                        tick = getCoordinateFromDMY(date.year, date.month, date.day);
                        j--;
                    }
                }

                for (var i = 0; i < ticks.length - 1; i++) {
                    var tick = ticks[i].position;
                    var date = getDMYFromCoordinate(tick);
                    var j_step = 1;
                    for (var j = 1; j <= n; j += j_step) {
                        //date.day += j_step * step;
                        date.day += step;
                        //if (date.day == step + 1 && step != 1) date.day--;
                        tick = getCoordinateFromDMY(date.year, date.month, date.day);
                        if (CZ.TickSource.regime != "Month_Weeks") {
                            if (minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace) minors.push(tick);
                        } else {
                            if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                                if (minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace) minors.push(tick);
                            }
                        }
                    }
                }
                var tick = ticks[ticks.length - 1].position;
                var date = getDMYFromCoordinate(tick);
                date.day += step;
                tick = getCoordinateFromDMY(date.year, date.month, date.day);

                if (CZ.TickSource.regime != "Month_Weeks") {
                    while (tick < CZ.TickSource.range.max) {
                        minors.push(tick);
                        date.day += step;
                        tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    }
                } else {
                    var j = 0;
                    while (tick < CZ.TickSource.range.max) {
                        if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                            minors.push(tick);
                        }
                        date.day += step;
                        tick = CZ.Common.getCoordinateFromDMY(date.year, date.month, date.day);
                        j++;
                    }
                }

                return minors;
            }

            function getMarkerLabel(range, time) {
                CZ.TickSource.getRegime(range.min, range.max);
                var date = CZ.Common.getDMYFromCoordinate(time);
                var text = (CZ.TickSource.beta > -3 ? date.month + 1 + "." : "") + date.day;
                return text;
            }
        }
    }

   
}