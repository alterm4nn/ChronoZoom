var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormToursList = (function (_super) {
            __extends(FormToursList, _super);
            function FormToursList(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
                this.takeTour = formInfo.takeTour;
                this.editTour = formInfo.editTour;
                var tours = formInfo.tours.sort(function (a, b) {
                    return a.sequenceNum - b.sequenceNum;
                });
                this.toursListBox = new CZ.UI.TourListBox(container.find("#tours"), formInfo.tourTemplate, formInfo.tours, function (tour) {
                    _this.onTakeTour(tour);
                }, this.editTour ? function (tour) {
                    _this.onEditTour(tour);
                } : null);
                this.initialize();
            }
            FormToursList.prototype.initialize = function () {
            };
            FormToursList.prototype.show = function () {
                var self = this;
                $(window).resize(function (e) {
                    return self.onWindowResize(e);
                });
                this.onWindowResize(null);
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormToursList.prototype.close = function () {
                $(window).unbind("resize");
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: function () {
                    }
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
                this.container.find("#tours").empty();
                this.toursListBox.container.empty();
            };
            FormToursList.prototype.onTakeTour = function (tour) {
                this.close();
                this.takeTour(tour);
            };
            FormToursList.prototype.onEditTour = function (tour) {
                this.close();
                this.editTour(tour);
            };
            FormToursList.prototype.onWindowResize = function (e) {
                var height = $(window).height();
                this.container.height(height - 70);
                this.container.find("#tours").height(height - 200);
            };
            return FormToursList;
        })(CZ.UI.FormBase);
        UI.FormToursList = FormToursList;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
