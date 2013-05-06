var __extends = this.__extends || function (d, b) {
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
                this.initialize();
            }
            FormLogin.prototype.initialize = function () {
            };
            FormLogin.prototype.show = function () {
                _super.prototype.show.call(this);
            };
            FormLogin.prototype.close = function () {
                this.container.hide("slow", function (event) {
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("activeButton");
                this.container.find("#error-edit-timeline").hide();
            };
            return FormLogin;
        })(CZ.UI.FormBase);
        UI.FormLogin = FormLogin;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
