var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderEdit = (function (_super) {
            __extends(FormHeaderEdit, _super);
            function FormHeaderEdit(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.createTimelineBtn = this.container.find(formInfo.createTimeline);
                this.createExhibitBtn = this.container.find(formInfo.createExhibit);
                this.editTimelineBtn = this.container.find(formInfo.editTimeline);
                this.editExhibitBtn = this.container.find(formInfo.editExhibit);
                this.initialize();
            }
            FormHeaderEdit.prototype.initialize = function () {
                var _this = this;
                this.createTimelineBtn.off();
                this.createExhibitBtn.off();
                this.editTimelineBtn.off();
                this.editExhibitBtn.off();
                this.createTimelineBtn.click(function (event) {
                    CZ.Authoring.UI.createTimeline();
                    _this.close();
                });
                this.createExhibitBtn.click(function (event) {
                    CZ.Authoring.UI.createExhibit();
                    _this.close();
                });
                this.editTimelineBtn.click(function (event) {
                    CZ.Authoring.UI.editTimeline();
                    _this.close();
                });
                this.editExhibitBtn.click(function (event) {
                    CZ.Authoring.UI.editExhibit();
                    _this.close();
                });
            };
            FormHeaderEdit.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activationSource.addClass("active");
            };
            FormHeaderEdit.prototype.close = function () {
                _super.prototype.close.call(this);
                this.activationSource.removeClass("active");
            };
            return FormHeaderEdit;
        })(CZ.UI.FormBase);
        UI.FormHeaderEdit = FormHeaderEdit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
