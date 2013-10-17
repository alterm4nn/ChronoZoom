/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/tour-listbox.ts'/>
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
        var FormToursList = (function (_super) {
            __extends(FormToursList, _super);
            // We only need to add additional initialization in constructor.
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
                $(window).resize(this.onWindowResize);
                this.onWindowResize(null);

                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormToursList.prototype.close = function () {
                var _this = this;
                $(window).unbind("resize", this.onWindowResize);

                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: function () {
                        _this.container.find("cz-form-errormsg").hide();
                        _this.container.find("#tours").empty();
                        _this.toursListBox.container.empty();
                    }
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");
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
