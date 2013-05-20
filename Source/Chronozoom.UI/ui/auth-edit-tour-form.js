var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStop = (function () {
            function TourStop() { }
            return TourStop;
        })();
        UI.TourStop = TourStop;        
        var FormEditTour = (function (_super) {
            __extends(FormEditTour, _super);
            function FormEditTour(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.addStopButton = container.find(formInfo.addStopButton);
                this.titleInput = container.find(formInfo.titleInput);
                this.stops = [];
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, this.stops);
                this.saveButton.off();
                this.deleteButton.off();
                this.tour = formInfo.context;
                this.initialize();
            }
            FormEditTour.prototype.initialize = function () {
                if(this.tour == null) {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Tour");
                    this.saveButton.text("create tour");
                } else {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Tour");
                    this.saveButton.text("update tour");
                }
                var self = this;
                this.addStopButton.click(function (event) {
                    CZ.Authoring.isActive = true;
                    CZ.Authoring.mode = "editTour-selectTarget";
                    CZ.Authoring.callback = function (arg) {
                        return self.onTargetElementSelected(arg);
                    };
                    self.hide();
                });
            };
            FormEditTour.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditTour.prototype.hide = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            FormEditTour.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
            };
            FormEditTour.prototype.onTargetElementSelected = function (targetElement) {
                alert(targetElement.type);
                var stop = {
                };
                stop.title = targetElement.title;
                stop.description = targetElement.type;
                this.tourStopsListBox.add(stop);
                this.show();
            };
            return FormEditTour;
        })(CZ.UI.FormBase);
        UI.FormEditTour = FormEditTour;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
