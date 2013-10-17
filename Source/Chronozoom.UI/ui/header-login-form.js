/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
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
        var FormLogin = (function (_super) {
            __extends(FormLogin, _super);
            function FormLogin(container, formInfo) {
                _super.call(this, container, formInfo);
            }
            FormLogin.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };

            FormLogin.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormLogin;
        })(CZ.UI.FormBase);
        UI.FormLogin = FormLogin;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
