/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

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