var CZ = (function (CZ, $, document) {
    CZ.Timescale = function (container) {
        if(!container) {
            throw "Container parameter is undefined!";
        }
        if(container.tagName !== undefined && container.tagName.toLowerCase() === "div") {
            container = $(container);
        } else if(typeof (container) === "string") {
            container = $("#" + container);
            if(container.length === 0 || !container.is("div")) {
                throw "There is no DIV element with such ID.";
            }
        } else if(!(container instanceof jQuery && container.is("div"))) {
            throw "Container parameter is invalid! It should be DIV, or ID of DIV, or jQuery instance of DIV.";
        }
        container.mousemove(function (e) {
            mouseMove(e);
        });
        var that = this;
        var _container = container;
        var _range = {
            min: 0,
            max: 1
        };
        var _ticks = [];
        var _ticksInfo = [];
        var _mode = "cosmos";
        var _position = "top";
        var _deltaRange;
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
        var canvasSize = CZ.Settings.tickLength + CZ.Settings.timescaleThickness;
        var text_size;
        var fontSize;
        var strokeStyle;
        var ctx;
        init();
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
            }
        });
        function init() {
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
            text_size = -1;
            strokeStyle = _container ? _container.css("color") : "Black";
            ctx = canvas[0].getContext("2d");
            fontSize = 45;
            if(_container.currentStyle) {
                fontSize = _container.currentStyle["font-size"];
                ctx.font = fontSize + _container.currentStyle["font-family"];
            } else if(document.defaultView && document.defaultView.getComputedStyle) {
                fontSize = document.defaultView.getComputedStyle(_container[0], null).getPropertyValue("font-size");
                ctx.font = fontSize + document.defaultView.getComputedStyle(_container[0], null).getPropertyValue("font-family");
            } else if(_container.style) {
                fontSize = _container.style["font-size"];
                ctx.font = fontSize + _container.style["font-family"];
            }
        }
        function updateSize() {
            var prevSize = _size;
            _width = _container.outerWidth(true);
            _height = _container.outerHeight(true);
            if(isHorizontal) {
                _size = _width;
                if(_size != prevSize) {
                    canvas[0].width = _size;
                    labelsDiv.css("width", _size);
                }
            } else {
                _size = _height;
                if(_size != prevSize) {
                    canvas[0].height = _size;
                    labelsDiv.css("height", _size);
                }
            }
            _deltaRange = (_size - 1) / (_range.max - _range.min);
            _canvasHeight = canvas[0].height;
            if(isHorizontal) {
                text_size = (_ticksInfo[0] && _ticksInfo[0].height !== text_size) ? _ticksInfo[0].height : 0;
                if(text_size !== 0) {
                    labelsDiv.css("height", text_size);
                    canvas[0].height = canvasSize;
                }
            } else {
                text_size = (_ticksInfo[0] && _ticksInfo[0].width !== text_size) ? _ticksInfo[0].width : 0;
                if(text_size !== old_text_size && text_size !== 0) {
                    labelsDiv.css("width", text_size);
                    canvas[0].width = canvasSize;
                    _width = text_size + canvasSize + textOffset;
                    _container.css("width", _width);
                }
            }
        }
        function setMode() {
            var beta;
            if(_range.min <= -10000) {
                that.mode = "cosmos";
            } else {
                beta = Math.floor(Math.log(_range.max - _range.min) * (1 / Math.log(10)));
                if(beta < 0) {
                    that.mode = "date";
                } else {
                    that.mode = "calendar";
                }
            }
        }
        function getTicksInfo() {
            var len = _ticks.length;
            var size;
            var width;
            var height;
            var h = isHorizontal ? _canvasHeight : 0;
            var tick;
            _ticksInfo = new Array(len);
            for(var i = 0; i < len; i++) {
                tick = _ticks[i];
                if(tick.label) {
                    size = tick.label._size;
                    width = size.width;
                    height = size.height;
                    if(!width) {
                        width = ctx.measureText(tick.position).width * 1.5;
                    }
                    if(!height) {
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
        function addNewLabels() {
            var label;
            var labelDiv;
            for(var i = 0, len = _ticks.length; i < len; i++) {
                label = _ticks[i].label;
                if(label && !label.hasClass('cz-timescale-label')) {
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
        function checkLabelsArrangement() {
            var delta;
            var deltaSize;
            var len = _ticks.length - 1;
            if(len == -1) {
                return false;
            }
            for(var i1 = 0, i2 = 1; i2 < len; i1 = i2 , i2++) {
                while(i2 < len + 1 && !_ticksInfo[i2].hasLabel) {
                    i2++;
                }
                if(i2 > len) {
                    break;
                }
                if(_ticksInfo[i1].hasLabel) {
                    delta = Math.abs(_ticksInfo[i2].position - _ticksInfo[i1].position);
                    if(delta < CZ.Settings.minTickSpace) {
                        return true;
                    }
                    if(isHorizontal) {
                        deltaSize = (_ticksInfo[i1].width + _ticksInfo[i2].width) / 2;
                        if(i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].width / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].width / 2;
                        } else if(i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].width / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].width / 2;
                        }
                    } else {
                        deltaSize = (_ticksInfo[i1].height + _ticksInfo[i2].height) / 2;
                        if(i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].height / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].height / 2;
                        } else if(i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].height / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].height / 2;
                        }
                    }
                    if(delta - deltaSize < CZ.Settings.minLabelSpace) {
                        return true;
                    }
                }
            }
            return false;
        }
        function updateMajorTicks() {
            var i;
            _ticks = _tickSources[_mode].getTicks(_range);
            addNewLabels();
            getTicksInfo();
            if(checkLabelsArrangement()) {
                for(i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].decreaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if(!checkLabelsArrangement()) {
                        break;
                    }
                }
            } else {
                for(i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].increaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if(checkLabelsArrangement(_ticks)) {
                        _ticks = _tickSources[_mode].decreaseTickCount();
                        getTicksInfo();
                        addNewLabels();
                        break;
                    }
                }
            }
        }
        function renderBaseLine() {
            if(isHorizontal) {
                if(_position == "bottom") {
                    ctx.fillRect(0, 0, _size, CZ.Settings.timescaleThickness);
                } else {
                    ctx.fillRect(0, CZ.Settings.tickLength, _size, CZ.Settings.timescaleThickness);
                }
            } else {
                if(_position == "right") {
                    ctx.fillRect(0, 0, CZ.Settings.timescaleThickness, _size);
                } else {
                    ctx.fillRect(CZ.Settings.tickLength, 0, CZ.Settings.timescaleThickness, _size);
                }
            }
        }
        function renderMajorTicks() {
            var x;
            var shift;
            ctx.beginPath();
            for(var i = 0, len = _ticks.length; i < len; i++) {
                x = _ticksInfo[i].position;
                if(isHorizontal) {
                    shift = _ticksInfo[i].width / 2;
                    if(i === 0 && x < shift) {
                        shift = 0;
                    } else if(i == len - 1 && x + shift > _size) {
                        shift *= 2;
                    }
                    ctx.moveTo(x, 1);
                    ctx.lineTo(x, 1 + CZ.Settings.tickLength);
                    if(_ticks[i].label) {
                        _ticks[i].label.css("left", x - shift);
                    }
                } else {
                    x = (_size - 1) - x;
                    shift = _ticksInfo[i].height / 2;
                    if(i === 0 && x + shift > _size) {
                        shift *= 2;
                    } else if(i == len - 1 && x < shift) {
                        shift = 0;
                    }
                    ctx.moveTo(1, x);
                    ctx.lineTo(1 + CZ.Settings.tickLength, x);
                    if(_ticks[i].label) {
                        _ticks[i].label.css("top", x - shift);
                        if(_position == "left") {
                            _ticks[i].label.css("left", text_size - (this.rotateLabels ? _ticksInfo[i].height : _ticksInfo[i].width));
                        }
                    }
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
        function renderSmallTicks() {
            var minDelta;
            var i;
            var len;
            var smallTicks = _tickSources[_mode].getSmallTicks(_ticks);
            ctx.beginPath();
            if(smallTicks && smallTicks.length > 0) {
                minDelta = Math.abs(that.getCoordinateFromTick(smallTicks[1]) - that.getCoordinateFromTick(smallTicks[0]));
                len = smallTicks.length;
                for(i = 1; i < len - 1; i++) {
                    minDelta = Math.min(minDelta, Math.abs(that.getCoordinateFromTick(smallTicks[i + 1]) - that.getCoordinateFromTick(smallTicks[i])));
                }
                if(minDelta >= CZ.Settings.minSmallTickSpace) {
                    switch(_position) {
                        case "bottom":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, 1);
                                ctx.lineTo(x, 1 + CZ.Settings.smallTickLength);
                            }
                            break;
                        case "top":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, CZ.Settings.tickLength - CZ.Settings.smallTickLength);
                                ctx.lineTo(x, 1 + CZ.Settings.tickLength);
                            }
                            break;
                        case "left":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(CZ.Settings.tickLength - CZ.Settings.smallTickLength, _size - x - 1);
                                ctx.lineTo(CZ.Settings.tickLength, _size - x - 1);
                            }
                            break;
                        case "right":
                            for(i = 0; i < len; i++) {
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
        this.markerPosition = -1;
        this.setTimeMarker = function (time) {
            if(time > maxPermitedTimeRange.right) {
                time = maxPermitedTimeRange.right;
            }
            if(time < maxPermitedTimeRange.left) {
                time = maxPermitedTimeRange.left;
            }
            var k = (_range.max - _range.min) / _width;
            var point = (time - _range.max) / k + _width;
            this.markerPosition = point;
            $('#timescale_marker').css("left", point - 80);
            var text = _tickSources[_mode].getMarkerLabel(_range, time);
            document.getElementById('marker-text').innerHTML = text;
        };
        this.setTimeBorders = function () {
            var k = (_range.max - _range.min) / _width;
            var left_time = _range.min;
            var right_time = _range.max;
            if(right_time > maxPermitedTimeRange.right) {
                right_time = maxPermitedTimeRange.right;
                var right_pos = (right_time - _range.max) / k + _width;
            } else {
                var right_pos = (right_time - _range.max) / k + _width - 73;
            }
            if(left_time < maxPermitedTimeRange.left) {
                left_time = maxPermitedTimeRange.left;
                var left_pos = (left_time - _range.max) / k + _width;
            } else {
                var left_pos = (left_time - _range.max) / k + _width;
            }
            var left_text = _tickSources[_mode].getMarkerLabel(_range, left_time);
            var right_text = _tickSources[_mode].getMarkerLabel(_range, right_time);
            document.getElementById('timescale_left_border').innerHTML = left_text;
            document.getElementById('timescale_right_border').innerHTML = right_text;
        };
        this.MarkerPosition = function () {
            return this.markerPosition;
        };
        function render() {
            setMode();
            updateMajorTicks();
            updateSize();
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;
            ctx.lineWidth = CZ.Settings.timescaleThickness;
            if(isHorizontal) {
                ctx.clearRect(0, 0, _size, canvasSize);
            } else {
                ctx.clearRect(0, 0, canvasSize, _size);
            }
            renderBaseLine();
            renderMajorTicks();
            renderSmallTicks();
        }
        this.getCoordinateFromTick = function (x) {
            var delta = _deltaRange;
            var k = _size / (_range.max - _range.min);
            var log10 = 1 / Math.log(10);
            var x1 = k * (x - _range.min);
            var beta;
            var firstYear;
            if(_range.min >= -10000) {
                beta = Math.log(_range.max - _range.min) * log10;
                firstYear = getCoordinateFromDMY(0, 0, 1);
                if(beta >= 0) {
                    x1 += k * firstYear;
                }
            }
            if(isFinite(delta)) {
                return x1;
            } else {
                return _size / 2;
            }
        };
        this.update = function (range) {
            _range = range;
            render();
            this.setTimeBorders();
        };
        this.destroy = function () {
            _container[0].innerHTML = "";
            _container.removeClass("cz-timescale");
            _container.removeClass("unselectable");
        };
        this.remove = function () {
            var parent = _container[0].parentElement;
            if(parent) {
                parent.removeChild(_container[0]);
            }
            this.destroy();
        };
    };
    CZ.TickSource = function () {
        this.delta , this.beta;
        this.range = {
            min: -1,
            max: 0
        };
        this.log10 = 1 / Math.log(10);
        this.startDate = null , this.endDate = null , this.firstYear = null;
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
        this.getDiv = function (x) {
            var inner = this.getLabel(x);
            var i = inners.indexOf(inner);
            if(i != -1) {
                isUsedPool[i] = true;
                styles[i].display = "block";
                return divPool[i];
            } else {
                var i = isUsedPool.indexOf(false);
                if(i != -1) {
                    isUsedPool[i] = true;
                    styles[i].display = "block";
                    inners[i] = inner;
                    var div = divPool[i][0];
                    div.innerHTML = inner;
                    divPool[i]._size = {
                        width: div.offsetWidth,
                        height: div.offsetHeight
                    };
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
        this.refreshDivs = function () {
            for(var i = 0; i < len; i++) {
                if(isUsedPool[i]) {
                    isUsedPool[i] = false;
                } else {
                    styles[i].display = "none";
                }
            }
        };
        this.hideDivs = function () {
            for(var i = 0; i < len; i++) {
                styles[i].display = "none";
            }
        };
        this.getTicks = function (range) {
            this.getRegime(range.min, range.max);
            return this.createTicks(range);
        };
        this.getLabel = function (x) {
            return x;
        };
        this.getRegime = function (l, r) {
        };
        this.createTicks = function (range) {
        };
        this.getSmallTicks = function (ticks) {
            return this.createSmallTicks(ticks);
        };
        this.createSmallTicks = function (ticks) {
        };
        this.decreaseTickCount = function () {
            if(this.delta == 1) {
                this.delta = 2;
            } else if(this.delta == 2) {
                this.delta = 5;
            } else if(this.delta == 5) {
                this.delta = 1;
                this.beta++;
            }
            return this.createTicks(this.range);
        };
        this.increaseTickCount = function () {
            if(this.delta == 1) {
                this.delta = 5;
                this.beta--;
            } else if(this.delta == 2) {
                this.delta = 1;
            } else if(this.delta == 5) {
                this.delta = 2;
            }
            return this.createTicks(this.range);
        };
        this.round = function (x, n) {
            var pow = 1;
            var i;
            if(n <= 0) {
                n = Math.max(0, Math.min(-n, 15));
                pow = 1;
                for(i = 0; i > n; i--) {
                    pow /= 10;
                }
                return Math.round(x * pow) / pow;
            } else {
                pow = 1;
                for(i = 0; i < n; i++) {
                    pow *= 10;
                }
                var val = pow * Math.round(x / pow);
                return val;
            }
        };
        this.getMarkerLabel = function (range, time) {
            return time;
        };
    };
    CZ.CosmosTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();
        var that = this;
        this.getLabel = function (x) {
            var text;
            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4);
            text = -x / this.level;
            if(n < 0) {
                text = (new Number(text)).toFixed(-n);
            }
            text += " " + this.regime;
            return text;
        };
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }
            if(this.range.min < maxPermitedTimeRange.left) {
                this.range.min = maxPermitedTimeRange.left;
            }
            if(this.range.max > maxPermitedTimeRange.right) {
                this.range.max = maxPermitedTimeRange.right;
            }
            var localPresent = getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.firstYear = getCoordinateFromDMY(0, 0, 1);
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if(this.range.min <= -10000000000) {
                this.regime = "Ga";
                this.level = 1000000000;
                if(this.beta < 7) {
                    this.regime = "Ma";
                    this.level = 1000000;
                }
            } else if(this.range.min <= -10000000) {
                this.regime = "Ma";
                this.level = 1000000;
            } else if(this.range.min <= -10000) {
                this.regime = "ka";
                this.level = 1000;
            }
        };
        this.createTicks = function (range) {
            var ticks = new Array();
            if(this.regime == "Ga" && this.beta < 7) {
                this.beta = 7;
            } else if(this.regime == "Ma" && this.beta < 2) {
                this.beta = 2;
            } else if(this.regime == "ka" && this.beta < -1) {
                this.beta = -1;
            }
            var dx = this.delta * Math.pow(10, this.beta);
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;
            var num = 0;
            var x0 = min * dx;
            if(dx == 2) {
                count++;
            }
            for(var i = 0; i < count + 1; i++) {
                var tick_position = this.round(x0 + i * dx, this.beta);
                if(tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = {
                        position: tick_position,
                        label: this.getDiv(tick_position)
                    };
                    num++;
                }
            }
            this.refreshDivs();
            return ticks;
        };
        this.createSmallTicks = function (ticks) {
            var minors = new Array();
            var n = 4;
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);
            if(k * step < CZ.Settings.minSmallTickSpace) {
                return null;
            }
            var tick = ticks[0].position - step;
            while(tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }
            for(var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                for(var k = 1; k <= n; k++) {
                    tick = t + step * k;
                    minors.push(tick);
                }
            }
            tick = ticks[ticks.length - 1].position + step;
            while(tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };
        this.getMarkerLabel = function (range, time) {
            var text;
            this.getRegime(range.min, range.max);
            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4) - 1;
            if(n > 20) {
                n = 20;
            }
            if(n < -20) {
                n = -20;
            }
            if(n < 0) {
                text = (new Number(-time / this.level)).toFixed(-n);
            } else {
                text = (new Number(-time / this.level)).toFixed(n);
            }
            text += " " + this.regime;
            return text;
        };
    };
    CZ.CosmosTickSource.prototype = new CZ.TickSource();
    CZ.CalendarTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();
        this.getLabel = function (x) {
            var text;
            if(x <= 0) {
                text = -x + 1 + " BCE";
            } else {
                text = x + " AD";
            }
            return text;
        };
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }
            if(this.range.min < maxPermitedTimeRange.left) {
                this.range.min = maxPermitedTimeRange.left;
            }
            if(this.range.max > maxPermitedTimeRange.right) {
                this.range.max = maxPermitedTimeRange.right;
            }
            var localPresent = getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.firstYear = getCoordinateFromDMY(0, 0, 1);
            this.range.max -= this.firstYear;
            this.range.min -= this.firstYear;
            this.startDate = this.present;
            this.endDate = this.present;
            if(this.range.min < 0) {
                this.startDate = getDMYFromCoordinate(this.range.min);
            }
            if(this.range.max < 0) {
                this.endDate = getDMYFromCoordinate(this.range.max);
            }
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            this.regime = "BCE/CE";
            this.level = 1;
        };
        this.createTicks = function (range) {
            var ticks = new Array();
            if(this.beta < 0) {
                this.beta = 0;
            }
            var dx = this.delta * Math.pow(10, this.beta);
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;
            var num = 0;
            var x0 = min * dx;
            if(dx == 2) {
                count++;
            }
            for(var i = 0; i < count + 1; i++) {
                var tick_position = this.round(x0 + i * dx, this.beta);
                if(tick_position < 1e-10 && dx > 1) {
                    tick_position += 1;
                }
                if(tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = {
                        position: tick_position,
                        label: this.getDiv(tick_position)
                    };
                    num++;
                }
            }
            this.refreshDivs();
            return ticks;
        };
        this.createSmallTicks = function (ticks) {
            var minors = new Array();
            var n = 4;
            var beta1 = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if(beta1 <= 0.3) {
                n = 3;
            }
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);
            if(k * step < CZ.Settings.minSmallTickSpace) {
                return null;
            }
            var tick = ticks[0].position - step;
            while(tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }
            for(var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                if(step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10) {
                    t = 0;
                }
                for(var k = 1; k <= n; k++) {
                    tick = t + step * k;
                    minors.push(tick);
                }
            }
            tick = ticks[ticks.length - 1].position + step;
            while(tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };
        this.getMarkerLabel = function (range, time) {
            this.getRegime(range.min, range.max);
            var text = parseFloat(new Number(time - this.firstYear).toFixed(2));
            text += (text > 0 ? -0.5 : -1.5);
            text = Math.round(text);
            if(text < 0) {
                text = -text;
            } else if(text == 0) {
                text = 1;
            }
            if(time < this.firstYear + 1) {
                text += " " + "BCE";
            } else {
                text += " " + "AD";
            }
            return text;
        };
    };
    CZ.CalendarTickSource.prototype = new CZ.TickSource();
    CZ.DateTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();
        var year, month, day;
        var tempDays = 0;
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }
            if(this.range.min < maxPermitedTimeRange.left) {
                this.range.min = maxPermitedTimeRange.left;
            }
            if(this.range.max > maxPermitedTimeRange.right) {
                this.range.max = maxPermitedTimeRange.right;
            }
            var localPresent = getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.firstYear = getCoordinateFromDMY(0, 0, 1);
            this.startDate = this.present;
            this.endDate = this.present;
            this.startDate = getDMYFromCoordinate(this.range.min);
            this.endDate = getDMYFromCoordinate(this.range.max);
            this.delta = 1;
            this.beta = Math.log(this.range.max - this.range.min) * this.log10;
            if(this.beta >= -0.2) {
                this.regime = "Quarters_Month";
            }
            if(this.beta <= -0.2 && this.beta >= -0.8) {
                this.regime = "Month_Weeks";
            }
            if(this.beta <= -0.8 && this.beta >= -1.4) {
                this.regime = "Weeks_Days";
            }
            if(this.beta <= -1.4) {
                this.regime = "Days_Quarters";
            }
            this.level = 1;
        };
        this.getLabel = function (x) {
            var text = months[month];
            var year_temp = year;
            if(year == 0) {
                year_temp--;
            }
            if(text == "January") {
                text += " " + year_temp;
            }
            if(tempDays == 1) {
                text = day + " " + months[month];
            }
            if((this.regime == "Weeks_Days") && (day == 3)) {
                text += ", " + year_temp;
            }
            if((this.regime == "Days_Quarters") && (day == 1)) {
                text += ", " + year_temp;
            }
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
            var countMonths = 0;
            var countDays = 0;
            var tempYear = this.startDate.year;
            var tempMonth = this.startDate.month;
            while(tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                countMonths++;
                tempMonth++;
                if(tempMonth == 12) {
                    tempMonth = 0;
                    tempYear++;
                }
            }
            year = this.startDate.year;
            month = this.startDate.month - 1;
            var month_step = 1;
            var date_step = 1;
            for(var j = 0; j <= countMonths + 2; j += month_step) {
                month += month_step;
                if(month >= 12) {
                    month = 0;
                    year++;
                }
                if((this.regime == "Quarters_Month") || (this.regime == "Month_Weeks")) {
                    var tick = getCoordinateFromDMY(year, month, 1);
                    if(tick >= this.range.min && tick <= this.range.max) {
                        if(tempDays != 1) {
                            if((month % 3 == 0) || (this.regime == "Month_Weeks")) {
                                ticks[num] = {
                                    position: tick,
                                    label: this.getDiv(tick)
                                };
                                num++;
                            }
                        }
                    }
                }
                if((this.regime == "Weeks_Days") || (this.regime == "Days_Quarters")) {
                    countDays = Math.floor(daysInMonth[month]);
                    tempDays = 1;
                    for(var k = 1; k <= countDays; k += date_step) {
                        day = k;
                        tick = getCoordinateFromDMY(year, month, day);
                        if(tick >= this.range.min && tick <= this.range.max) {
                            if(this.regime == "Weeks_Days") {
                                if((k == 3) || (k == 10) || (k == 17) || (k == 24) || (k == 28)) {
                                    ticks[num] = {
                                        position: tick,
                                        label: this.getDiv(tick)
                                    };
                                    num++;
                                }
                            } else {
                                ticks[num] = {
                                    position: tick,
                                    label: this.getDiv(tick)
                                };
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
            var minors = new Array();
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var step;
            var n;
            var tick = ticks[0].position;
            var date = getDMYFromCoordinate(tick);
            if(this.regime == "Quarters_Month") {
                n = 2;
            } else if(this.regime == "Month_Weeks") {
                n = daysInMonth[date.month];
            } else if(this.regime == "Weeks_Days") {
                n = 7;
            } else if(this.regime == "Days_Quarters") {
                n = 4;
            }
            if(this.regime == "Quarters_Month") {
                step = Math.floor(2 * daysInMonth[date.month] / n);
            } else if(this.regime == "Month_Weeks") {
                step = 1;
            } else if(this.regime == "Weeks_Days") {
                step = 1;
            } else if(this.regime == "Days_Quarters") {
                step = 0.25;
            }
            if(k * step < CZ.Settings.minSmallTickSpace) {
                return null;
            }
            date.day -= step;
            tick = getCoordinateFromDMY(date.year, date.month, date.day);
            if(this.regime != "Month_Weeks") {
                while(tick > this.range.min) {
                    minors.push(tick);
                    date.day -= step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                }
            } else {
                var j = daysInMonth[date.month];
                while(tick > this.range.min) {
                    if((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 27)) {
                        minors.push(tick);
                    }
                    date.day -= step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    j--;
                }
            }
            for(var i = 0; i < ticks.length - 1; i++) {
                var tick = ticks[i].position;
                var date = getDMYFromCoordinate(tick);
                var j_step = 1;
                for(var j = 1; j <= n; j += j_step) {
                    date.day += step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    if(this.regime != "Month_Weeks") {
                        if(minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace) {
                            minors.push(tick);
                        }
                    } else {
                        if((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                            if(minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace) {
                                minors.push(tick);
                            }
                        }
                    }
                }
            }
            var tick = ticks[ticks.length - 1].position;
            var date = getDMYFromCoordinate(tick);
            date.day += step;
            tick = getCoordinateFromDMY(date.year, date.month, date.day);
            if(this.regime != "Month_Weeks") {
                while(tick < this.range.max) {
                    minors.push(tick);
                    date.day += step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                }
            } else {
                var j = 0;
                while(tick < this.range.max) {
                    if((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                        minors.push(tick);
                    }
                    date.day += step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    j++;
                }
            }
            return minors;
        };
        this.getMarkerLabel = function (range, time) {
            this.getRegime(range.min, range.max);
            var date = getDMYFromCoordinate(time);
            var text = (this.beta > -3 ? date.month + 1 + "." : "") + date.day;
            return text;
        };
    };
    CZ.DateTickSource.prototype = new CZ.TickSource();
    CZ.ClockTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }
            var localPresent = getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.firstYear = getCoordinateFromDMY(0, 0, 1);
            this.startDate = this.present;
            this.endDate = this.present;
            if(this.range.min < 0) {
                this.startDate = getDMYFromCoordinate(this.range.min);
            }
            if(this.range.max < 0) {
                this.endDate = getDMYFromCoordinate(this.range.max);
            }
            this.delta = 1;
            this.beta = Math.log(this.range.max - this.range.min) * this.log10;
            if(this.beta >= -2.2) {
                this.regime = "QuarterDays_Hours";
            }
            if(this.beta <= -2.2 && this.beta >= -2.7) {
                this.regime = "Hours_10mins";
            }
            if(this.beta <= -2.7 && this.beta >= -3.4) {
                this.regime = "10mins_mins";
            }
            if(this.beta <= -3.8 && this.beta >= -4.4) {
                this.regime = "10mins_mins";
            }
            this.level = 1;
        };
        this.getLabel = function (x) {
        };
        this.createTicks = function (range) {
            tempDays = 0;
            var ticks = new Array();
            var num = 0;
            var countMonths = 0;
            var countDays = 0;
            var tempYear = this.startDate.year;
            var tempMonth = this.startDate.month;
            while(tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                countMonths++;
                tempMonth++;
                if(tempMonth == 12) {
                    tempMonth = 0;
                    tempYear++;
                }
            }
            year = this.startDate.year;
            month = this.startDate.month - 1;
            var month_step = 1;
            var date_step = 1;
            for(var j = 0; j <= countMonths + 2; j += month_step) {
                month += month_step;
                if(month >= 12) {
                    month = 0;
                    year++;
                }
                if((this.regime == "Quarters_Month") || (this.regime == "Month_Weeks")) {
                    var tick = getCoordinateFromDMY(year, month, 1);
                    if(tick >= this.range.min && tick <= this.range.max) {
                        if(tempDays != 1) {
                            if((month % 3 == 0) || (this.regime == "Month_Weeks")) {
                                ticks[num] = {
                                    position: tick,
                                    label: this.getDiv(tick)
                                };
                                num++;
                            }
                        }
                    }
                }
                if((this.regime == "Weeks_Days") || (this.regime == "Days_Quarters")) {
                    countDays = Math.floor(daysInMonth[month]);
                    tempDays = 1;
                    for(var k = 1; k <= countDays; k += date_step) {
                        day = k;
                        tick = getCoordinateFromDMY(year, month, day);
                        if(tick >= this.range.min && tick <= this.range.max) {
                            if(this.regime == "Weeks_Days") {
                                if((k == 3) || (k == 10) || (k == 17) || (k == 24) || (k == 28)) {
                                    ticks[num] = {
                                        position: tick,
                                        label: this.getDiv(tick)
                                    };
                                    num++;
                                }
                            } else {
                                ticks[num] = {
                                    position: tick,
                                    label: this.getDiv(tick)
                                };
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
        };
    };
    CZ.ClockTickSource.prototype = new CZ.TickSource();
    return CZ;
})(CZ || {
}, jQuery, document);
