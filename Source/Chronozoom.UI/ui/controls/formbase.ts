/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export interface IFormBaseInfo {
            activationSource: JQuery;
            prevForm?: FormBase;
            navButton: string;
            closeButton: string;
            titleTextblock: string;
        }
        
        export class FormBase {
            public isFormVisible: bool;
            public activationSource: JQuery;
            public navButton: JQuery;
            public closeButton: JQuery;
            public titleTextblock: JQuery;

            public container: JQuery;
            public prevForm: FormBase;

            constructor(container: JQuery, formInfo: IFormBaseInfo) {
                if (!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.isFormVisible = false;
                this.container = container;
                this.prevForm = formInfo.prevForm;
                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);

                this.container.data("form", this);

                if (this.prevForm) {
                    this.navButton.show();
                } else {
                    this.navButton.hide();
                }

                this.navButton.off();
                this.closeButton.off();

                this.navButton.click(event => {
                    this.back();
                });

                this.closeButton.click(event => {
                    this.close();
                });
            }

            public show(...args: any[]): void {
                this.isFormVisible = true;
                this.container.show.apply(this.container, args);
            }

            public close(...args: any[]): void {
                this.isFormVisible = false;
                this.container.data("form", undefined);
                this.container.hide.apply(this.container, args);
            }

            public back(): void {
                this.close();
                this.prevForm.show();
            }
        }


        export interface IFormUpdateEntityInfo extends IFormBaseInfo {
            saveButton: string;
        }

        export class FormUpdateEntity extends FormBase {
            public saveButton: JQuery;

            constructor(container: JQuery, formInfo: IFormUpdateEntityInfo) {
                super(container, formInfo);

                this.saveButton = this.container.find(formInfo.saveButton);
                
                this.container.keypress(event => {
                    // trigger click on save button if ENTER was pressed
                    if (event.keyCode === 13) {
                        this.saveButton.trigger("click");
                    }
                });
            }
        }
    }
}