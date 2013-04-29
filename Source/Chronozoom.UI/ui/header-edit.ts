/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>

/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface FormHeaderEditInfo extends CZ.UI.FormBaseInfo {
            createTimeline: string;
            createExhibit: string;
            editTimeline: string;
            editExhibit: string;
        }

        export class FormHeaderEdit extends CZ.UI.FormBase {
            private createTimelineBtn: JQuery;
            private createExhibitBtn: JQuery;
            private editTimelineBtn: JQuery;
            private editExhibitBtn: JQuery;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: FormHeaderEditInfo) {
                super(container, formInfo);

                this.createTimelineBtn = this.container.find(formInfo.createTimeline);
                this.createExhibitBtn = this.container.find(formInfo.createExhibit);
                this.editTimelineBtn = this.container.find(formInfo.editTimeline);
                this.editExhibitBtn = this.container.find(formInfo.editExhibit);

                this.initialize();
            }

            private initialize(): void {
                this.createTimelineBtn.off();
                this.createExhibitBtn.off();
                this.editTimelineBtn.off();
                this.editExhibitBtn.off();

                this.createTimelineBtn.click(event => {
                    CZ.Authoring.UI.createTimeline();
                    this.close();
                });

                this.createExhibitBtn.click(event => {
                    CZ.Authoring.UI.createExhibit();
                    this.close();
                });

                this.editTimelineBtn.click(event => {
                    CZ.Authoring.UI.editTimeline();
                    this.close();
                });

                this.editExhibitBtn.click(event => {
                    CZ.Authoring.UI.editExhibit();
                    this.close();
                });
            }

            public show(): void {
                super.show();

                // Just an example how to highligh pressed "Show Form" button.
                // Ideally, it would be better to not place UI selectors in form code,
                // but pass them through parameters.
                this.activationSource.addClass("active");
            }

            public close() {
                super.close();

                this.activationSource.removeClass("active");
            }
        }
    }
}