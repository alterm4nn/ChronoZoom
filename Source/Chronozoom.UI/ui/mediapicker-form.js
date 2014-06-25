/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormMediaPicker = (function (_super) {
            __extends(FormMediaPicker, _super);
            function FormMediaPicker(container, mediaPickerContainer, title, formInfo) {
                _super.call(this, container, formInfo);

                this.titleTextblock.text(title);
                this.contentContainer.append(mediaPickerContainer);
                $(this).off();
            }
            FormMediaPicker.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        $(_this).trigger("showcompleted");
                    }
                });

                this.activationSource.addClass("active");
            };

            FormMediaPicker.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        $(_this).trigger("closecompleted");
                    }
                });

                this.activationSource.removeClass("active");
            };
            return FormMediaPicker;
        })(CZ.UI.FormBase);
        UI.FormMediaPicker = FormMediaPicker;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
