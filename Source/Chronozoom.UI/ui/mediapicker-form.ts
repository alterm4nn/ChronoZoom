/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export class FormMediaPicker extends CZ.UI.FormBase {
            constructor(container: JQuery, formInfo: IFormBaseInfo) {
                super(container, formInfo);
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                });

                this.activationSource.removeClass("active");
            }
        }
    }
}