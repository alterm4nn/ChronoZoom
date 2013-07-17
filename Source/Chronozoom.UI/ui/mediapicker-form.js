var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormMediaPicker = (function (_super) {
            __extends(FormMediaPicker, _super);
            function FormMediaPicker(container, formInfo) {
                        _super.call(this, container, formInfo);
            }
            FormMediaPicker.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormMediaPicker.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormMediaPicker;
        })(CZ.UI.FormBase);
        UI.FormMediaPicker = FormMediaPicker;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
