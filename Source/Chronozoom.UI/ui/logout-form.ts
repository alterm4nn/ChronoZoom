/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>

/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export class FormLogoutProfile extends CZ.UI.FormBase {
            private saveButton: JQuery;
            private startDate: CZ.UI.DatePicker;
            private endDate: CZ.UI.DatePicker;
            private titleInput: JQuery;

            private isCancel: bool;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: CZ.UI.FormBaseInfo) {
                super(container, formInfo);
                this.initialize();
            }


            private initialize(): void {

            }

            public show(): void {
                super.show();

                // Just an example how to highligh pressed "Show Form" button.
                // Ideally, it would be better to not place UI selectors in form code,
                // but pass them through parameters.
                this.activationSource.addClass("activeButton");
            }

            public close() {
                if (this.isCancel && CZ.Authoring.mode === "profile") {
                    //CZ.Authoring.removeTimeline(this.timeline);
                }

                this.container.hide("slow", event => {
                    //this.endDate.remove();
                    //this.startDate.remove();
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("activeButton");
            }
        }
    }
}