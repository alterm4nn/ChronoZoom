var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TimeSeriesForm = (function (_super) {
            __extends(TimeSeriesForm, _super);
            function TimeSeriesForm(container, formInfo) {
                        _super.call(this, container, formInfo);
            }
            return TimeSeriesForm;
        })(CZ.UI.FormBase);
        UI.TimeSeriesForm = TimeSeriesForm;        
        var LineChart = (function () {
            function LineChart(container) {
                this.canvas = document.createElement("canvas");
                $(this.canvas).appendTo($("#timeSeries"));
                this.canvas.width = container.width();
                this.canvas.height = container.height();
                this.context = this.canvas.getContext("2d");
            }
            LineChart.prototype.clear = function (screenLeft, screenRight) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.fillStyle = "gray";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.fillStyle = "white";
                this.context.fillRect(screenLeft, 0, screenRight - screenLeft, this.canvas.height);
            };
            LineChart.prototype.drawDataSet = function (dataSet, screenLeft, screenRight, plotLeft, plotRight) {
                var _this = this;
                var plotBottom = 0;
                var plotTop = 0;
                dataSet.series.forEach(function (seria) {
                    if(seria.appearanceSettings && seria.appearanceSettings.yMin && seria.appearanceSettings.yMin < plotBottom) {
                        plotBottom = seria.appearanceSettings.yMin;
                    }
                    if(seria.appearanceSettings && seria.appearanceSettings.yMax && seria.appearanceSettings.yMax > plotTop) {
                        plotTop = seria.appearanceSettings.yMax;
                    }
                });
                var dataToScreenX = function (x) {
                    return (x - plotLeft) / (plotRight - plotLeft) * (screenRight - screenLeft) + screenLeft;
                };
                var dataToScreenY = function (y) {
                    return (1 - (y - plotBottom) / (plotTop - plotBottom)) * _this.canvas.height;
                };
                var x = dataSet.time;
                var n = x.length;
                var ctx = this.context;
                dataSet.series.forEach(function (seria) {
                    ctx.strokeStyle = 'blue';
                    ctx.fillStyle = 'blue';
                    ctx.lineWidth = 2;
                    var y = seria.values;
                    ctx.beginPath();
                    for(var i = 0; i < n; i++) {
                        var xi = dataToScreenX(x[i]);
                        var yi = dataToScreenY(y[i]);
                        if(i == 0) {
                            ctx.moveTo(xi, yi);
                        } else {
                            ctx.lineTo(xi, yi);
                        }
                    }
                    ctx.stroke();
                });
            };
            return LineChart;
        })();
        UI.LineChart = LineChart;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
