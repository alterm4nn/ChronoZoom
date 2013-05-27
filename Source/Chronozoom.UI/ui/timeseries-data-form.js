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
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
