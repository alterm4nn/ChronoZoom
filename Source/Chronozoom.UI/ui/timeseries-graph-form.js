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
                this.xLeft = 0;
                this.xRight = this.canvas.width;
            }
            LineChart.prototype.updateLayout = function (left, right) {
            };
            LineChart.prototype.updateRange = function (xLeft, xRight) {
                this.xLeft = xLeft;
                this.xRight = xRight;
                this.render();
            };
            LineChart.prototype.render = function () {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.fillStyle = "gray";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.fillStyle = "white";
                this.context.fillRect(this.xLeft, 0, this.xRight - this.xLeft, this.canvas.height);
            };
            return LineChart;
        })();
        UI.LineChart = LineChart;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
