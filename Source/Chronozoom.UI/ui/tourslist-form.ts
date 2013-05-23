/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export interface IFormToursListInfo extends CZ.UI.IFormBaseInfo {
        }

        export class FormToursList extends CZ.UI.FormBase {

            private isCancel: bool;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormToursListInfo) {
                super(container, formInfo);

                this.initialize();
            }

            private initialize(): void {
          
            }

            public show(): void {
                var self = this;
                $(window).resize(e => self.onWindowResize(e));
                this.onWindowResize(null);

                super.show({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                $(window).unbind("resize");

                super.close({
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: () => {
                        //this.endDate.remove();
                        //this.startDate.remove();
                    }
                });

                //if (this.isCancel && CZ.Authoring.mode === "createTimeline") {
                //    CZ.Authoring.removeTimeline(this.timeline);
                //}

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
            }

            private onWindowResize(e: JQueryEventObject)
            {                
                var height = $(window).height();
                this.container.height(height - 70);
                this.container.find("#tours").height(height - 200);
            }
        }
    }
}