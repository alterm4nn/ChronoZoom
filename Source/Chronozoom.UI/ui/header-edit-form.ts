/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormHeaderEditInfo extends CZ.UI.IFormBaseInfo {
            createTimeline: string;
            createExhibit: string;
            createTour: string;
            editTimeline: string;
            editExhibit: string;
        }

        export class FormHeaderEdit extends CZ.UI.FormBase {
            private createTimelineBtn: JQuery;
            private createExhibitBtn: JQuery;
            private createTourBtn: JQuery;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormHeaderEditInfo) {
                super(container, formInfo);

                this.createTimelineBtn = this.container.find(formInfo.createTimeline);
                this.createExhibitBtn = this.container.find(formInfo.createExhibit);
                this.createTourBtn = this.container.find(formInfo.createTour);

                this.initialize();
            }

            private initialize(): void {
                this.createTimelineBtn.off();
                this.createExhibitBtn.off();
                this.createTourBtn.off();

                this.createTimelineBtn.click(event => {
                    CZ.Authoring.UI.createTimeline();
                    this.close();
                });

                this.createExhibitBtn.click(event => {
                    CZ.Authoring.UI.createExhibit();
                    this.close();
                });

                this.createTourBtn.click(event => {
                    CZ.Authoring.UI.createTour();
                    this.close();
                });
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            }
        }
    }
}