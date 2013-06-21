/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>

module CZ {
    export module UI {
        export class MessageWindow extends CZ.UI.FormBase {
            constructor(container: JQuery, message: string, title?: string) {
                super(container, {
                    activationSource: null,
                    prevForm: null,
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title"
                });

                var tourTitleInput = this.container.find(".cz-form-label");
                tourTitleInput.text(message);
                this.titleTextblock.text(title || "ChronoZoom");
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                $(document).bind("keypress", this, this.onDocumentKeyPress);
            }

            public close() {
                $(document).unbind("keypress", this.onDocumentKeyPress);
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 100,
                    complete: () => {
                    }
                });
            }

            private onDocumentKeyPress(e)
            {
                var self = e.data;
                if (e.which == 27 /*esc*/ && self.isFormVisible) {
                    self.close();
                }
            }
        }
    }
}