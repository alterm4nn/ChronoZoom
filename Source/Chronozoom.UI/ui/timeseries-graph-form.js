var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TimeSeriesForm = (function (_super) {
    __extends(TimeSeriesForm, _super);
    function TimeSeriesForm(container, formInfo) {
        _super.call(this, container, formInfo);
        this.testButton = container.find(formInfo.testButton);
        this.testButton.click(function (event) {
            alert("It Works!");
        });
    }
    TimeSeriesForm.prototype.show = function () {
        _super.prototype.show.call(this);
        this.activationSource.addClass("activeButton");
    };
    TimeSeriesForm.prototype.close = function () {
        _super.prototype.close.call(this);
        this.activationSource.removeClass("activeButton");
    };
    return TimeSeriesForm;
})(CZ.UI.FormBase);
