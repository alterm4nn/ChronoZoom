/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>

/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface FormEditTimelineInfo extends CZ.UI.FormBaseInfo {
            startDate: string;
            endDate: string;
            saveButton: string;
            deleteButton: string;
            titleInput: string;
            context: Object;
        }

        export class FormEditTimeline extends CZ.UI.FormBase {
            private saveButton: JQuery;
            private deleteButton: JQuery;
            private startDate: CZ.UI.DatePicker;
            private endDate: CZ.UI.DatePicker;
            private titleInput: JQuery;

            private timeline: any;
            private isCancel: bool;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: FormEditTimelineInfo) {
                super(container, formInfo);

                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.startDate = new CZ.UI.DatePicker(container.find(formInfo.startDate));
                this.endDate = new CZ.UI.DatePicker(container.find(formInfo.endDate));
                this.titleInput = container.find(formInfo.titleInput);

                this.timeline = formInfo.context;

                this.saveButton.off();
                this.deleteButton.off();

                this.initialize();
            }

            private initialize(): void {
                if (CZ.Authoring.mode === "createTimeline") {
                    this.deleteButton.css("display", "none");
                    this.titleTextblock.text("Create Timeline");
                    this.saveButton.text("create timeline");
                }
                else if (CZ.Authoring.mode === "editTimeline") {
                    this.deleteButton.css("display", "inline-block");
                    this.titleTextblock.text("Edit Timeline");
                    this.saveButton.text("update timeline");
                }
                else {
                    console.log("Unexpected authoring mode in timeline form.");
                    this.close();
                }

                this.isCancel = true;
                this.endDate.addEditMode_Infinite();

                this.titleInput.val(this.timeline.title);
                this.startDate.setDate(this.timeline.x);
                this.endDate.setDate(this.timeline.x + this.timeline.width);

                this.saveButton.click(event => {
                    var isValid = CZ.Authoring.ValidateTimelineData(this.startDate.getDate(), this.endDate.getDate(), this.titleInput.val());
                    if (!isValid) {
                        this.container.find("#error-edit-timeline").css("display", "block");
                    }
                    if (isValid) {
                        var self = this;
                        CZ.Authoring.updateTimeline(this.timeline, {
                            title: this.titleInput.val(),
                            start: this.startDate.getDate(),
                            end: this.endDate.getDate(),
                        }).then(
                            function (success) {
                                self.isCancel = false;
                                self.close();
                            },
                            function (error) {
                                alert("Unable to save changes. Please try again later.");
                                console.log(error);
                            });
                    }
                });

                this.deleteButton.click(event => {
                    if (confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                        CZ.Authoring.removeTimeline(this.timeline);
                        this.close();
                    }
                });
            }

            public show(): void {
                super.show();

                // Just an example how to highligh pressed "Show Form" button.
                // Ideally, it would be better to not place UI selectors in form code,
                // but pass them through parameters.
                this.activationSource.addClass("activeButton");
            }

            public close() {
                if (this.isCancel && CZ.Authoring.mode === "createTimeline") {
                    CZ.Authoring.removeTimeline(this.timeline);
                }

                this.container.hide("slow", event => {
                    this.endDate.remove();
                    this.startDate.remove();
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("activeButton");
            }
        }
    }
}