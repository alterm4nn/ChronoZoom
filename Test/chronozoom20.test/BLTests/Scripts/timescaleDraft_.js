D3 = {
    maxTickArrangeIterations: 3, // max number of iterations in loop of ticks creating
    tickLength: 10, // length of ordinary tick 
    minLabelSpace: 60, // minimum space (in px) between 2 labels on axis
    minTickSpace: 10, // minimum space (in px) between 2 ticks on axis
    minLogOrder: 4, // minimum order when labels on logarithmic scale are written with supscript
    minNumOrder: 5 // minimum order when labels on numeric scale are written with supscript
};

var CZ = (function (CZ, $) {

    CZ.Timescale = function (div, source) {
        if (div && div.hasClass("d3-axis"))
            return;

        var that = this;

        // link to div element - container of axis
        var _host = div;

        // orientation: horizontal or vertical
        var _mode = "";
        if (div) _mode = div.attr("data-d3-placement");
        if (_mode != "top" && _mode != "bottom" && _mode != "left" && _mode != "right")
            _mode == "bottom";
        var isHorizontal = (_mode == "top" || _mode == "bottom");
        this.rotateLabels = false;

        // _range of axis in plot coordinates
        var _range = { min: 0, max: 1 };

        // provider to calculate ticks and labels

        var _tickSources = {
            "cosmos": new CZ.CosmosTickSource(),
            "calendar": new CZ.CalendarTickSource(),
            "date": new CZ.DateTickSource()
        };

        var _tickSource = _tickSources["cosmos"];
        var _ticks = [];

        var textOffset = 3;

        // canvas to render ticks
        var canvas = $("<canvas id='canvas' style='position:relative; float:left'></canvas>");
        // div to place labels
        var labelsDiv = $("<div id='labelsDiv' style='position:relative; float:left'></div>");

        if (div) {
            if (_mode == "bottom" || _mode == "right") {
                div[0].appendChild(canvas[0]);
                div[0].appendChild(labelsDiv[0]);
            }
            else {
                div[0].appendChild(labelsDiv[0]);
                div[0].appendChild(canvas[0]);
            }

            var canvasSize = D3.tickLength + 1;
            if (isHorizontal) canvas[0].height = canvasSize;
            else {
                canvas[0].width = canvasSize;
                if (_mode == "right") labelsDiv.css("left", textOffset);
                else canvas.css("left", textOffset);
            }
        }

        var _width, _height;
        var _size;
        var _deltaRange;
        var _canvasHeight;

        // checks if size of host element changed and refreshes size of canvas and labels' div
        this.updateSize = function () {
            var prevSize = _size;
            if (div) {
                _width = div.outerWidth(true);
                _height = div.outerHeight(true);
            }
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
        };

        var text_size = -1;
        var smallTickLength = D3.tickLength / 3;

        var strokeStyle = _host ? _host.css("color") : "Black";
        var ctx = canvas.get(0).getContext("2d");
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = strokeStyle;
        ctx.lineWidth = 1;
        var fontSize = 12;
        if (_host) {
            if (_host.currentStyle) {
                fontSize = _host.currentStyle["font-size"];
                ctx.font = fontSize + _host.currentStyle["font-family"];
            }
            else if (document.defaultView && document.defaultView.getComputedStyle) {
                fontSize = document.defaultView.getComputedStyle(_host[0], null).getPropertyValue("font-size");
                ctx.font = fontSize + document.defaultView.getComputedStyle(_host[0], null).getPropertyValue("font-family");
            }
            else if (_host.style) {
                fontSize = _host.style["font-size"];
                ctx.font = fontSize + _host.style["font-family"];
            }
        }

        Object.defineProperty(this, "host", { get: function () { return _host; }, configurable: false });
        Object.defineProperty(this, "mode", { get: function () { return _mode; }, configurable: false });
        Object.defineProperty(this, "tickSource", { get: function () { return _tickSource; }, configurable: false });
        Object.defineProperty(this, "range", { get: function () { return _range; }, configurable: false });
        Object.defineProperty(this, "ticks", { get: function () { return _ticks; }, configurable: false });

        Object.defineProperty(this, "DesiredSize", { get: function () { return { width: _width, height: _height }; }, configurable: false });
        Object.defineProperty(this, "axisSize", { get: function () { return _size; }, configurable: false });
        Object.defineProperty(this, "deltaRange", { get: function () { return _deltaRange; }, configurable: false });

        this.sizeChanged = true;

        // transform data <-> plot: is applied before converting into screen coordinates
        var _dataTransform = undefined;
        Object.defineProperty(this, "dataTransform", {
            get: function () { return _dataTransform; },
            set: function (value) {
                _dataTransform = value;
                render();
            },
            configurable: false
        });

        var ticksInfo = [];

        // calculate and cashe positions of ticks and labels' size
        var getPositions = function (ticks) {
            var len = ticks.length;
            ticksInfo = new Array(len);
            var size, width, height;
            var h = isHorizontal ? _canvasHeight : 0;
            for (var i = 0; i < len; i++) {
                var tick = ticks[i];
                if (tick.label) {
                    size = tick.label._size;
                    width = size.width;
                    height = size.height;
                    if (width == 0)
                        width = ctx.measureText(tick.position).width * 1.5;
                    if (height == 0)
                        height = (isHorizontal ? h : parseFloat(fontSize)) + 8;
                    ticksInfo[i] = { position: that.getCoordinateFromTick(tick.position), width: width, height: height, hasLabel: true };
                }
                else
                    ticksInfo[i] = { position: that.getCoordinateFromTick(tick.position), width: 0, height: 0, hasLabel: false };
            }
        };

        // private function to check whether ticks overlay each other
        var checkLabelsArrangement = function (ticks) {

            var delta, deltaSize;
            var len = ticks.length - 1;

            addNewLabels(ticks);
            getPositions(ticks);

            if (len == -1) return 1;

            var i1 = 0;
            var i2 = 0;
            while (i2 < len) {
                i1 = i2;
                i2++;
                while (i2 < len + 1 && !ticksInfo[i2].hasLabel) i2++;
                if (i2 > len) break;
                if (ticksInfo[i1].hasLabel) {
                    delta = Math.abs(ticksInfo[i2].position - ticksInfo[i1].position);
                    if (delta < D3.minTickSpace) return -1;
                    if (isHorizontal) {
                        deltaSize = (ticksInfo[i1].width + ticksInfo[i2].width) / 2;
                        if (i1 == 0 && ticksInfo[i1].position - ticksInfo[i1].width / 2 < 0) deltaSize -= ticksInfo[i1].width / 2;
                        else if (i2 == len - 1 && ticksInfo[i2].position - ticksInfo[i2].width / 2 > _size) deltaSize -= ticksInfo[i2].width / 2;
                    }
                    else {
                        deltaSize = (ticksInfo[i1].height + ticksInfo[i2].height) / 2;
                        if (i1 == 0 && ticksInfo[i1].position - ticksInfo[i1].height / 2 < 0) deltaSize -= ticksInfo[i1].height / 2;
                        else if (i2 == len - 1 && ticksInfo[i2].position - ticksInfo[i2].height / 2 > _size) deltaSize -= ticksInfo[i2].height / 2;
                    }
                    if (delta - deltaSize < D3.minLabelSpace) return -1;
                }
            }
            var res = 1;
            i1 = i2 = 0;
            while (i2 < len) {
                i1 = i2;
                i2++;
                while (i2 < len + 1 && !ticksInfo[i2].hasLabel) i2++;
                if (i2 > len) break;
                if (ticksInfo[i1].hasLabel) {
                    delta = Math.abs(ticksInfo[i2].position - ticksInfo[i1].position);
                    if (isHorizontal) {
                        deltaSize = (ticksInfo[i1].width + ticksInfo[i2].width) / 2;
                        if (i1 == 0 && ticksInfo[i1].position - ticksInfo[i1].width / 2 < 0) deltaSize -= ticksInfo[i1].width / 2;
                        else if (i2 == len - 1 && ticksInfo[i2].position - ticksInfo[i2].width / 2 > _size) deltaSize -= ticksInfo[i2].width / 2;
                    }
                    else {
                        deltaSize = (ticksInfo[i1].height + ticksInfo[i2].height) / 2;
                        if (i1 == 0 && ticksInfo[i1].position - ticksInfo[i1].height / 2 < 0) deltaSize -= ticksInfo[i1].height / 2;
                        else if (i2 == len - 1 && ticksInfo[i2].position - ticksInfo[i2].height / 2 > _size) deltaSize -= ticksInfo[i2].height / 2;
                    }
                    if (delta - deltaSize < D3.minLabelSpace) {
                        res = 0;
                        break;
                    }
                }
            }
            return res;
        };

        // returns x coordinate in pixels by given coordinate in plot
        if (!this.getCoordinateFromTick) {
            this.getCoordinateFromTick = function (x) {
                return x;
            };
        }


        var setMode = function () {
            if (_range.min <= -10000) {
                _tickSource.hideDivs();
                _tickSource = _tickSources["cosmos"];
            }
            else {
                var beta = Math.floor(Math.log(_range.max - _range.min) * (1 / Math.log(10)));
                var beta1 = Math.log(_range.max - _range.min) * (1 / Math.log(10));
                // BCE or CE years
                if (beta1 <= 0.2) {
                 //   console.log("opop");
                    _tickSource.hideDivs();
                    _tickSource = _tickSources["date"];
                }
                else {
                    _tickSource.hideDivs();
                    _tickSource = _tickSources["calendar"];
                }

           }
        };

        // function to render ticks and labels
        var render = function () {

            // refreshing size of axis if changed
            setMode();
            that.updateSize();

            if (_dataTransform) {
                var min = _dataTransform.plotToData(_range.min);
                var max = _dataTransform.plotToData(_range.max);
                _ticks = _tickSource.getTicks({ min: Math.min(min, max), max: Math.max(min, max) });
            }
            else _ticks = _tickSource.getTicks(_range);

            // check for possible labels overlay
            var result = checkLabelsArrangement(_ticks);
            var newTicks, newResult;
            var iterations = 0;

            if (result == -1) {
                // if labels overlay each other -> need to be decreased
                while (iterations++ < D3.maxTickArrangeIterations) {
                    newTicks = _tickSource.decreaseTickCount();
                    newResult = checkLabelsArrangement(newTicks);
                    _ticks = newTicks;
                    if (newResult != -1)
                        break;
                }
            }
            if (result == 1) {
                // if labels do not overlay each other and there is enough space to increase them -> need to be increased
                while (iterations++ < D3.maxTickArrangeIterations) {
                    newTicks = _tickSource.increaseTickCount();
                    newResult = checkLabelsArrangement(newTicks);
                    if (newResult == -1) {
                        _ticks = _tickSource.decreaseTickCount();
                        getPositions(_ticks);
                        addNewLabels(_ticks);
                        break;
                    }
                    _ticks = newTicks;
                    if (newResult == 0)
                        break;
                }
            }

            var minTicks = false;
            if (_tickSource.getMinTicks) {
                if (newResult == -1 && iterations > D3.maxTickArrangeIterations || _ticks.length < 2) {
                    newTicks = _tickSource.getMinTicks();
                    if (newTicks.length > 0) {
                        _ticks = newTicks;
                    }
                }
            }
            if (_ticks.length == 2) {
                addNewLabels(_ticks);
                getPositions(_ticks);
                if (_ticks.length == 2) {
                    var delta = ticksInfo[1].position - ticksInfo[0].position;
                    var deltaSize;
                    if (isHorizontal) deltaSize = (ticksInfo[0].width + ticksInfo[1].width) / 2;
                    else deltaSize = (ticksInfo[0].height + ticksInfo[1].height) / 2;
                    if (delta - deltaSize < D3.minLabelSpace)
                        minTicks = true;
                }
            }

            var len = _ticks.length;
            var old_text_size = text_size;
            text_size = 0;
            this.sizeChanged = false;
            // calculate max size of labels (width or height) to set proper size of host
            if (isHorizontal) {
                for (var i = 0; i < len; i++) {
                    text_size = Math.max(text_size, ticksInfo[i].height);
                }
                if (text_size != old_text_size && text_size != 0) {
                    labelsDiv.css("height", text_size);
                    canvas[0].height = canvasSize;
                    _height = text_size + canvasSize;
                    _host.css("height", _height);
                    this.sizeChanged = true;
                }
            }
            else {
                for (var i = 0; i < len; i++) {
                    text_size = Math.max(text_size, ticksInfo[i].width);
                }
                if (text_size != old_text_size && text_size != 0) {
                    labelsDiv.css("width", text_size);
                    canvas[0].width = canvasSize;
                    _width = text_size + canvasSize + textOffset;
                    _host.css("width", _width);
                    this.sizeChanged = true;
                }
            }

            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            // clear canvas context and render base line
            if (isHorizontal) {
                ctx.clearRect(0, 0, _size, canvasSize);
                if (_mode == "bottom") ctx.fillRect(0, 0, _size, 1);
                else ctx.fillRect(0, D3.tickLength, _size, 1);
            }
            else {
                ctx.clearRect(0, 0, canvasSize, _size);
                if (_mode == "right") ctx.fillRect(0, 0, 1, _size);
                else ctx.fillRect(D3.tickLength, 0, 1, _size);
            }

            // render ticks and labels (if necessary)
            // if range is single point - render only label in the middle of axis
            var x, shift;
            for (var i = 0; i < len; i++) {
                x = ticksInfo[i].position;
                if (isHorizontal) {
                    shift = ticksInfo[i].width / 2;
                    if (minTicks) {
                        if (i == 0) shift *= 2;
                        else if (i == len - 1) shift = 0;
                    }
                    else {
                        if (i == 0 && x < shift) shift = 0;
                        else if (i == len - 1 && x + shift > _size) shift *= 2;
                    }

                    if (!_ticks[i].invisible) ctx.fillRect(x, 1, 1, D3.tickLength);
                    if (_ticks[i].label) _ticks[i].label.css("left", x - shift);
                }
                else {
                    x = (_size - 1) - x;
                    shift = ticksInfo[i].height / 2;
                    if (minTicks) {
                        if (i == 0) shift = 0;
                        else if (i == len - 1) shift *= 2;
                    }
                    else {
                        if (i == 0 && x + shift > _size) shift *= 2;
                        else if (i == len - 1 && x < shift) shift = 0;
                    }

                    if (!_ticks[i].invisible) ctx.fillRect(1, x, D3.tickLength, 1);
                    if (_ticks[i].label) {
                        _ticks[i].label.css("top", x - shift);
                        if (_mode == "left")
                            _ticks[i].label.css("left", text_size - (this.rotateLabels ? ticksInfo[i].height : ticksInfo[i].width));
                    }
                }
            }
            // get and draw minor ticks
            var smallTicks = _tickSource.getSmallTicks(_ticks);
            if ((smallTicks != null) && (smallTicks.length > 0)) {
                // check for enough space
                var l = Math.abs(that.getCoordinateFromTick(smallTicks[1]) - that.getCoordinateFromTick(smallTicks[0]));
                for (var k = 1; k < smallTicks.length - 1; k++) {
                    l = Math.min(l, Math.abs(that.getCoordinateFromTick(smallTicks[k + 1]) - that.getCoordinateFromTick(smallTicks[k])));
                }

                if (l >= D3.minTickSpace) {
                    for (var i = 0, len = smallTicks.length; i < len; i++) {
                        x = that.getCoordinateFromTick(smallTicks[i]);
                        if (_mode == "bottom") ctx.fillRect(x, 1, 1, smallTickLength);
                        else if (_mode == "top") ctx.fillRect(x, D3.tickLength - smallTickLength, 1, smallTickLength);
                        else if (_mode == "left") ctx.fillRect(D3.tickLength - smallTickLength, (_size - 1) - x, smallTickLength, 1);
                        else if (_mode == "right") ctx.fillRect(1, (_size - 1) - x, smallTickLength, 1);
                    }
                }
            }
        };

        // append all new label divs to host and add class for them
        var addNewLabels = function (ticks) {
            var label;
            for (var i = 0, len = ticks.length; i < len; i++) {
                label = ticks[i].label;
                if (label && !label.hasClass('d3-axis-label')) {
                    var labelDiv = label[0];
                    labelsDiv[0].appendChild(labelDiv);
                    label.addClass('d3-axis-label');
                    label._size = { width: labelDiv.offsetWidth, height: labelDiv.offsetHeight };
                }
            }
        };

        // function to set new _range
        this.update = function (newRange) {
            _range = newRange;
            render();
        };

        // clears host element
        this.destroy = function () {
            _host[0].innerHTML = "";
            _host.removeClass("d3-axis");
            _host.removeClass("unselectable");
        };

        // destroys axis and removes it from parent
        this.remove = function () {
            var parent1 = _host[0].parentElement;
            if (parent1) {
                parent1.removeChild(_host[0]);
                var parent2 = parent1.parentElement;
                if (parent2 && (parent2.className == "d3-plot-master" || parent2.classList && parent2.classList.contains("d3-plot-master"))) {
                    parent2.plot.removeDiv(parent1);
                }
            }
            this.destroy();
        };

        if (div) {
            render();
            div.addClass("d3-axis");
            div.addClass("unselectable");
        }

        this.getCoordinateFromTick = function (x) {
            var delta = this.deltaRange;
            var k = this.axisSize / (this.range.max - this.range.min);

            var x1 = k * (x - this.range.min);
            if (this.range.min >= -10000) {
                var log10 = 1 / Math.log(10);
                var beta = Math.floor(Math.log(this.range.max - this.range.min) * log10);
                var firstYear = getCoordinateFromDMY(0, 0, 1);
                if (beta >= 0) x1 += k * firstYear;
            }

            if (isFinite(delta)) {
                var coord = x1;
                var transform = this.dataTransform;
                if (transform) {
                    coord = transform.dataToPlot(x1);
                }
                return coord;
            }
            else return this.axisSize / 2;

            /*   var delta = this.deltaRange;
               if (isFinite(delta)) {
                   var coord = x;
                   var transform = this.dataTransform;
                   if (transform) {
                       coord = transform.dataToPlot(x);
                   }
                   return (coord - this.range.min) * delta;
               }
               else return this.axisSize / 2;*/
        };
    };

    // returns screen coordinate (in pixels) of point given in virtual coordinates (years from present)

    //this is the class for creating ticks 
    CZ.TickSource = function () {

        this.delta, this.beta;
        this.range = { min: -1, max: 0 }
        this.log10 = 1 / Math.log(10);
        this.startDate = null, // start date of range in 'date' mode
        this.endDate = null, // end date of range in 'date' mode

        this.firstYear = null;
        this.regime = ""; // "Ga", "Ma", "ka" for 'cosmos' mode, "BCE/CE" for 'calendar' mode, "Date" for 'date' mode
        this.level = 1; // divider for each regime
        this.present;

        var divPool = [];
        var isUsedPool = [];
        var inners = [];
        var styles = [];
        var len = 0;

        this.start;
        this.finish;

        // gets first available div (not used) or creates new one
        this.getDiv = function (x) {
            var inner = this.getLabel(x);
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
        };


        // make all not used divs invisible (final step)
        this.refreshDivs = function () {
            for (var i = 0; i < len; i++) {
                if (isUsedPool[i]) isUsedPool[i] = false;
                else styles[i].display = "none";
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
            return this.createTicks(this.range);
        };

        this.increaseTickCount = function () {
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
    }

    CZ.CosmosTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();
        var that = this;

        this.getLabel = function (x) {
            var text;
            // maximum number of decimal digits
            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4);
            // divide tick coordinate by level of cosmos zoom
            text = x / this.level;
            if (n < 0) text = (new Number(text)).toFixed(-n);
            text += this.regime;
            return text;
        };

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            }
            else {
                // default range
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }

            // set present date
            var localPresent = getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = getCoordinateFromDMY(0, 0, 1);

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
            }
            else if (this.range.min <= -10000000) {
                // millions of years ago
                this.regime = "Ma";
                this.level = 1000000;
            }
            else if (this.range.min <= -10000) {
                // thousands of years ago
                this.regime = "ka";
                this.level = 1000;
            }

        };

        this.createTicks = function (range) {
            var ticks = new Array();
      
            // prevent zooming deeper than 4 decimal digits
            if (this.regime == "Ga" && this.beta < 7) this.beta = 7;
            else if (this.regime == "Ma" && this.beta < 2) this.beta = 2;
            else if (this.regime == "ka" && this.beta < -1) this.beta = -1;


            var dx = this.delta * Math.pow(10, this.beta);
            // calculate count of ticks to create
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;
            // calculate rounded ticks values
            // they are in virtual coordinates (years from present date)
            var num = 0;
            var x0 = min * dx;    //coord of first tick
            if (dx == 2) count++;
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
            var width = 900;//????
            var k = width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);

            if (k * step < spaceBetweenSmallTicks) return null;
            var tick = ticks[0].position - step;

            // create little ticks before first big tick
            while (tick > this.range.min) {
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
            while (tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };
    };
    CZ.CosmosTickSource.prototype = new CZ.TickSource;

    CZ.CalendarTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();

        this.getTicks = function (range) {
            this.getRegime(range.min, range.max);
            return this.createTicks(range);
        };


        this.getLabel = function (x) {
            var text;
            if (x <= 0) text = -x + 1 + "BCE";//text = x - 1;
            else text = x + "CE";
            return text;
        };

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            }
            else {
                // default range
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }

            // set present date
            var localPresent = getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = getCoordinateFromDMY(0, 0, 1);

            this.range.max -= this.firstYear;
            this.range.min -= this.firstYear;

            this.startDate = this.present;
            this.endDate = this.present;
            if (this.range.min < 0) {
                this.startDate = getDMYFromCoordinate(this.range.min);
            }
            if (this.range.max < 0) {
                this.endDate = getDMYFromCoordinate(this.range.max);
            }

            // set default constant for arranging ticks
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);


            this.regime = "BCE/CE";
            this.level = 1;
        };

        this.createTicks = function (range) {
            var ticks = new Array();
            // shift range limits as in calendar mode we count from present year
   
            // prevent zooming deeper than 1 year span
            if (this.beta < 0) this.beta = 0;


            var dx = this.delta * Math.pow(10, this.beta);
            // calculate count of ticks to create
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;
            // calculate rounded ticks values
            // they are in virtual coordinates (years from present date)
            var num = 0;
            var x0 = min * dx;
            if (dx == 2) count++;
            for (var i = 0; i < count + 1; i++) {
                var tick_position = this.round(x0 + i * dx, this.beta);
                if (tick_position < 0) tick_position += 1;
                if (Math.abs(tick_position) < 1e-10 && dx > 1) // Move tick from 1BCE to 1CE
                    tick_position++;
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

            var beta1 = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if (beta1 <= 0.3) n = 3;   

            var width = 900;//????
            var k = width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);

            if (k * step < spaceBetweenSmallTicks) return null;
            var tick = ticks[0].position - step;

            // create little ticks before first big tick
            while (tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }

            for (var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                // Count minor ticks from 1BCE, not from 1CE if step between large ticks greater than 1
                if (step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10) t = 0;
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
    };
    CZ.CalendarTickSource.prototype = new CZ.TickSource;

    CZ.DateTickSource = function (params) {
        this.base = CZ.TickSource;
        this.base();

        var year, month, day;
        // span between two rendering neighboring days
        var tempDays = 0;

        this.getRegime = function (l, r) {
            if (l < r) {
                this.range.min = l;
                this.range.max = r;
            }
            else {
                // default range
                this.range.min = maxPermitedTimeRange.left;
                this.range.max = maxPermitedTimeRange.right;
            }

            // set present date
            var localPresent = getPresent();
            this.present = { year: localPresent.getUTCFullYear(), month: localPresent.getUTCMonth(), day: localPresent.getUTCDate() };

            // remember value in virtual coordinates when 1CE starts
            this.firstYear = getCoordinateFromDMY(0, 0, 1);

            this.startDate = this.present;
            this.endDate = this.present;
            if (this.range.min < 0) {
                this.startDate = getDMYFromCoordinate(this.range.min);
            }
            if (this.range.max < 0) {
                this.endDate = getDMYFromCoordinate(this.range.max);
            }

            // set default constant for arranging ticks
            this.delta = 1;
          //  this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            this.beta = Math.log(this.range.max - this.range.min) * this.log10;

            if (this.beta >= -0.2) this.regime = "Quarters_Month";
            if (this.beta <= -0.2 && this.beta >= -0.8) this.regime = "Month_Weeks";
            if (this.beta <= -0.8 && this.beta >= -1.4) this.regime = "Weeks_Days";
            if (this.beta <= -1.4) this.regime = "Days_Quarters";

            this.level = 1;
        };

        this.getLabel = function (x) {
            var text = months[month];
            if (text == "January") text += " " + year;
            if (tempDays == 1) text = day + " " + months[month];
            if ((this.regime == "Weeks_Days") && (day == 3)) text += ", " + year;
            if ((this.regime == "Days_Quarters") && (day == 1)) text += ", " + year;
            return text;
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
           // console.log(this.regime);
            while (tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                countMonths++;
                tempMonth++;
                if (tempMonth == 12) {
                    tempMonth = 0;
                    tempYear++;
                }
            }

            // calculate ticks values
            // they are in virtual coordinates (years from present date)
            year = this.startDate.year;
           // console.log(this.regime);
            // create month ticks
            month = this.startDate.month - 1;
            var month_step = 1; //step to render month
            var date_step = 1; //step to render days
            for (var j = 0; j <= countMonths + 2; j += month_step) {
                month += month_step;
                if (month >= 12) {
                    month = 0;
                    year++;
                }

                if ((this.regime == "Quarters_Month") || (this.regime == "Month_Weeks")) {
                    var tick = getCoordinateFromDMY(year, month, 1);
                    if (tick >= this.range.min && tick <= this.range.max) {
                        if (tempDays != 1) {
                            if ((month % 3 == 0) || (this.regime == "Month_Weeks")) {
                                ticks[num] = { position: tick, label: this.getDiv(tick) };
                                num++;
                            }
                        }
                    }
                }
                 // create days ticks for this month
                if ((this.regime == "Weeks_Days") || (this.regime == "Days_Quarters")) {
                    countDays = Math.floor(daysInMonth[month]);
                    tempDays = 1;
                    for (var k = 1; k <= countDays; k += date_step) {
                        day = k;
                        tick = getCoordinateFromDMY(year, month, day);
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

       //     this.getRegime(this.range.min, this.range.max);

            // function to create minor ticks
            var minors = new Array();
            //       var start = Math.max(this.range.left, maxPermitedTimeRange.left);
            //       var end = Math.min(this.range.right, maxPermitedTimeRange.right);
            //the amount of small ticks

            var width = 900;//????
            var k = width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            // in 'date' mode number of minor ticks depends on number of days in current month

            var step;

            var n;//Math.floor(daysInMonth[date.month] / step);
            var tick = ticks[0].position;
            var date = getDMYFromCoordinate(tick);

            if (this.regime == "Quarters_Month") n = 2;
            else if (this.regime == "Month_Weeks") n = daysInMonth[date.month];//step = 5 / daysInMonth[date.month];
            else if (this.regime == "Weeks_Days") n = 7;//step = 5 / 7;
            else if (this.regime == "Days_Quarters") n = 4; //step = 5 / 4;

            if (this.regime == "Quarters_Month") step = Math.floor(2 * daysInMonth[date.month] / n);
            else if (this.regime == "Month_Weeks") step = 1;
            else if (this.regime == "Weeks_Days") step = 1;
            else if (this.regime == "Days_Quarters") step = 0.25;

            if (k * step < spaceBetweenSmallTicks) return null;

               date.day -= step;
            tick = getCoordinateFromDMY(date.year, date.month, date.day);


            if (this.regime != "Month_Weeks") {
                while (tick > this.range.min) {
                    minors.push(tick);
                    date.day -= step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                }
            } else {
                var j = daysInMonth[date.month];
                while (tick > this.range.min) {
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
                    date.day +=  step;
                    //if (date.day == step + 1 && step != 1) date.day--;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    if (this.regime != "Month_Weeks") {
                        if (minors.length == 0 || k * (ticks[i + 1].position - tick) > spaceBetweenSmallTicks) minors.push(tick);
                    } else {
                        if ((j == 2) || (j == 9) ||(j == 16) ||(j == 23) ||(j == 28)) {
                            if (minors.length == 0 || k * (ticks[i + 1].position - tick) > spaceBetweenSmallTicks) minors.push(tick);
                        } 
                    }
                }
            }
            var tick = ticks[ticks.length - 1].position;
            var date = getDMYFromCoordinate(tick);
            date.day += step;
            tick = getCoordinateFromDMY(date.year, date.month, date.day);

            if (this.regime != "Month_Weeks") {
                while (tick < this.range.max) {
                    minors.push(tick);
                    date.day += step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                }
            } else {
                var j = 0;
                while (tick < this.range.max) {
                    if ((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                        minors.push(tick);
                    }
                    date.day += step;
                    tick = getCoordinateFromDMY(date.year, date.month, date.day);
                    j++;
                }
            }

            return minors;
        };
    };
    CZ.DateTickSource.prototype = new CZ.TickSource;

    return CZ;
})(CZ || {}, jQuery);