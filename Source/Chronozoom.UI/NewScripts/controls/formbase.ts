/// <reference path='../typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export interface FormBaseInfo {
            activationSource: JQuery;
            navButton: string;
            closeButton: string;
            titleTextblock: string;
        }
        
        export class FormBase {
            public activationSource: JQuery;
            public navButton: JQuery;
            public closeButton: JQuery;
            public titleTextblock: JQuery;

            public container: JQuery;
            public navPath: FormBase [];

            constructor(container: JQuery, formInfo: FormBaseInfo) {
                if (!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }

                this.container = container;
                this.navPath = [];

                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);

                this.navButton.off();
                this.closeButton.off();

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