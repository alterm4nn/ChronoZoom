var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormManageEditors = (function (_super) {
            __extends(FormManageEditors, _super);
            function FormManageEditors(container, formInfo) {
                _super.call(this, container, formInfo);
                $('#tblAddEditors input[type="search"]').focus();
            }
            return FormManageEditors;
        })(UI.FormUpdateEntity);
        UI.FormManageEditors = FormManageEditors;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
