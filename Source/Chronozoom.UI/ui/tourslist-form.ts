/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/tour-listbox.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export interface IFormToursListInfo extends CZ.UI.IFormBaseInfo {
            tourTemplate: JQuery;
            tours: any;
            takeTour: (tour: any) => void;
            editTour: (tour: any) => void;
        }

        export class FormToursList extends CZ.UI.FormBase {

            private toursListBox: TourListBox;
            private isCancel: bool;
            private takeTour: (tour: any) => void;
            private editTour: (tour: any) => void;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormToursListInfo) {
                super(container, formInfo);

                this.takeTour = formInfo.takeTour;
                this.editTour = formInfo.editTour;
                var tours = formInfo.tours.sort((a, b) => a.sequenceNum - b.sequenceNum);
                this.toursListBox = new CZ.UI.TourListBox(container.find("#tours"), formInfo.tourTemplate, formInfo.tours,
                    tour => {
                        this.onTakeTour(tour);
                    },
                    this.editTour ? tour => { this.onEditTour(tour); } : null);

                this.initialize();
            }

            private initialize(): void {

            }

            public show(): void {
                var self = this;
                $(window).resize(e => self.onWindowResize(e));
                this.onWindowResize(null);

                super.show({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                $(window).unbind("resize");

                super.close({
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: () => {
                    }
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
                this.container.find("#tours").empty();
                this.toursListBox.container.empty();
            }

            private onTakeTour(tour) {
                this.close();
                this.takeTour(tour);
            }

            private onEditTour(tour) {
                this.close();
                this.editTour(tour);
            }

            private onWindowResize(e: JQueryEventObject) {
                var height = $(window).height();
                this.container.height(height - 70);
                this.container.find("#tours").height(height - 200);
            }
        }
    }
}