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
        var FormLogoutProfile = (function (_super) {
            __extends(FormLogoutProfile, _super);
            function FormLogoutProfile(container, formInfo) {
                _super.call(this, container, formInfo);
            }
            FormLogoutProfile.prototype.show = function () {
                _super.prototype.show.call(this);

                this.activationSource.addClass("active");
            };

            FormLogoutProfile.prototype.close = function () {
                _super.prototype.close.call(this);

                this.activationSource.removeClass("active");
            };
            return FormLogoutProfile;
        })(CZ.UI.FormBase);
        UI.FormLogoutProfile = FormLogoutProfile;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
