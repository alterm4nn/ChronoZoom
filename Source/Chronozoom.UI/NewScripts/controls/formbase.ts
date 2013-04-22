/// <reference path='../typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        
        export class FormBase {
            private navButton: JQuery;
            private closeButton: JQuery;
            private titleTextblock: JQuery;

            public container: JQuery;
            public activationSource: JQuery;
            public navPath: FormBase [];

            constructor(container: JQuery, activationSource: JQuery) {
                if (!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }

                this.container = container;
                this.activationSource = activationSource;
                this.navPath = [];

                this.initialize();
            }

            private initialize(): void {
                this.navButton = this.container.find(".cz-form-nav");
                this.closeButton = this.container.find(".cz-form-close-btn > .cz-form-btn");
                this.titleTextblock = this.container.find(".cz-form-title");

                this.closeButton.click(event => {
                    this.close();
                });
            }

            public show(): void {
                this.container.show("slow");
            }

            public close(): void {
                this.container.hide("slow");
            }
        }
    }
}