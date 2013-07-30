/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>

module CZ {
    export module UI {
        export class MessageWindow extends CZ.UI.FormBase {
            private tourTitleInput;

            constructor(container: JQuery, message: string, title?: string) {
                super(container, {
                    activationSource: null,
                    prevForm: null,
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });

                this.tourTitleInput = this.container.find(".cz-form-label");
                this.titleTextblock.text(title || "ChronoZoom");
                this.tourTitleInput.text(message);
                this.setHeight();
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: () => {
                        $(document).on("keyup", this, this.onDocumentKeyPress);                        
                    }
                });
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: () => {
                        $(document).off("keyup", this.onDocumentKeyPress);                        
                    }
                });
            }

            private onDocumentKeyPress(e)
            {
                var self = e.data;
                if (e.which == 27 /*esc*/ && self.isFormVisible) {
                    self.closeButton.click();
                }
            }

            private setHeight() {
                this.container.show();
                var messageHeight = this.tourTitleInput.outerHeight(true);
                this.contentContainer.height(messageHeight);
                this.container.hide();
            }
        }
    }
}