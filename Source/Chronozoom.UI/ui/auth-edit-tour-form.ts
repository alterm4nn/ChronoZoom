/// <reference path='../ui/tourstop-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormEditTourInfo extends CZ.UI.IFormBaseInfo {
            saveButton: string;
            deleteButton: string;
            addStopButton: string;
            titleInput: string;
            tourStopsListBox: string;
            tourStopsTemplate: JQuery;
            context: Object;
        }

        export class TourStop
        {
            private targetElement: Object;

        }

        export class FormEditTour extends CZ.UI.FormBase {
            private saveButton: JQuery;
            private deleteButton: JQuery;
            private addStopButton: JQuery;
            private titleInput: JQuery;
            private stops: TourStop[];
            private tour: Object;

            public tourStopsListBox: TourStopListBox;


            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormEditTourInfo) {
                super(container, formInfo);


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

            private initialize(): void {

                if (this.tour == null) // creating new tour
                {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Tour");
                    this.saveButton.text("create tour");
                }
                else // editing an existing tour
                {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Tour");
                    this.saveButton.text("update tour");
                }

                var self = this;
                this.addStopButton.click(event =>
                {
                    CZ.Authoring.isActive = true; // for now we do not watch for mouse moves
                    CZ.Authoring.mode = "editTour-selectTarget";
                    CZ.Authoring.callback = arg => self.onTargetElementSelected(arg);
                    self.hide();
                });

                //this.isCancel = true;
                //this.endDate.addEditMode_Infinite();

                //this.titleInput.val(this.timeline.title);
                //this.startDate.setDate(this.timeline.x);

                //if (this.timeline.endDate === 9999) {
                //    this.endDate.setDate(this.timeline.endDate);
                //}
                //else {
                //    this.endDate.setDate(this.timeline.x + this.timeline.width);
                //}

                //this.saveButton.click(event => {
                //    var isValid = CZ.Authoring.ValidateTimelineData(this.startDate.getDate(), this.endDate.getDate(), this.titleInput.val());
                //    if (!isValid) {
                //        this.container.find("#error-edit-timeline").show().delay(7000).fadeOut();
                //    }
                //    if (isValid) {
                //        var self = this;
                //        CZ.Authoring.updateTimeline(this.timeline, {
                //            title: this.titleInput.val(),
                //            start: this.startDate.getDate(),
                //            end: this.endDate.getDate(),
                //        }).then(
                //            function (success) {
                //                self.isCancel = false;
                //                self.close();
                //            },
                //            function (error) {
                //                alert("Unable to save changes. Please try again later.");
                //                console.log(error);
                //            });
                //    }
                //});

                //this.deleteButton.click(event => {
                //    if (confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                //        CZ.Authoring.removeTimeline(this.timeline);
                //        this.close();
                //    }
                //});
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }


            public hide(noAnimation?: bool = false) {
                super.close(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            }


            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        //this.endDate.remove();
                        //this.startDate.remove();
                    }
                });

                //if (this.isCancel && CZ.Authoring.mode === "createTimeline") {
                //    CZ.Authoring.removeTimeline(this.timeline);
                //}

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
            }

            private onTargetElementSelected(targetElement: any)
            {
                alert(targetElement.type);

                var stop: any = {};
                stop.title = targetElement.title;
                stop.description = targetElement.type;
                this.tourStopsListBox.add(stop);
                this.show();
            }
        }
    }
}