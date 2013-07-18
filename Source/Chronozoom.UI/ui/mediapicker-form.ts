/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export class FormMediaPicker extends CZ.UI.FormBase {
            constructor(container: JQuery, mediaPickerContainer: JQuery, title: string, formInfo: IFormBaseInfo) {
                super(container, formInfo);

                this.titleTextblock.text(title);
                this.contentContainer.append(mediaPickerContainer);
                $(this).off();
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        $(this).trigger("showcompleted");
                    }
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        $(this).trigger("closecompleted");
                    }
                });

                this.activationSource.removeClass("active");
            }
        }
    }
}