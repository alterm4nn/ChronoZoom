var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormLogoutProfile = (function (_super) {
            __extends(FormLogoutProfile, _super);
            function FormLogoutProfile(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.initialize();
            }
            FormLogoutProfile.prototype.initialize = function () {
            };
            FormLogoutProfile.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activationSource.addClass("activeButton");
            };
            FormLogoutProfile.prototype.close = function () {
                if(this.isCancel && CZ.Authoring.mode === "profile") {
                }
                this.container.hide("slow", function (event) {
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("activeButton");
            };
            return FormLogoutProfile;
        })(CZ.UI.FormBase);
        UI.FormLogoutProfile = FormLogoutProfile;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
