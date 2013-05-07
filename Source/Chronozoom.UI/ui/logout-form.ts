/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>

/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export class FormLogoutProfile extends CZ.UI.FormBase {
            constructor(container: JQuery, formInfo: CZ.UI.IFormBaseInfo) {
                super(container, formInfo);
            }

            public show(): void {
                super.show();

                this.activationSource.addClass("active");
            }

            public close() {
                super.close();

                this.activationSource.removeClass("active");
            }
        }
    }
}