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
                this.graph = new Dygraph(document.getElementById("dygraph"), "Date,Temperature\n" + "2008-05-07,75\n" + "2008-05-08,70\n" + "2008-05-09,80\n", {
                    drawXAxis: false
                });
            }
            return TimeSeriesForm;
        })(CZ.UI.FormBase);
        UI.TimeSeriesForm = TimeSeriesForm;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
