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
        var FormHeaderEdit = (function (_super) {
            __extends(FormHeaderEdit, _super);
            // We only need to add additional initialization in constructor.
            function FormHeaderEdit(container, formInfo) {
                _super.call(this, container, formInfo);

                this.createTimelineBtn = this.container.find(formInfo.createTimeline);
                this.createExhibitBtn = this.container.find(formInfo.createExhibit);
                this.createTourBtn = this.container.find(formInfo.createTour);

                this.initialize();
            }
            FormHeaderEdit.prototype.initialize = function () {
                var _this = this;
                this.createTimelineBtn.off();
                this.createExhibitBtn.off();
                this.createTourBtn.off();

                this.createTimelineBtn.click(function (event) {
                    CZ.Authoring.UI.createTimeline();
                    _this.close();
                });

                this.createExhibitBtn.click(function (event) {
                    CZ.Authoring.UI.createExhibit();
                    _this.close();
                });

                this.createTourBtn.click(function (event) {
                    CZ.Authoring.UI.createTour();
                    _this.close();
                });
            };

            FormHeaderEdit.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };

            FormHeaderEdit.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderEdit;
        })(CZ.UI.FormBase);
        UI.FormHeaderEdit = FormHeaderEdit;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
