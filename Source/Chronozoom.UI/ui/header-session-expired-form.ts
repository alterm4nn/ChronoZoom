/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/service.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormHeaderSessionExpiredInfo extends CZ.UI.IFormBaseInfo {
            sessionTimeSpan: string;
            sessionButton: string;
        }

        export class FormHeaderSessionExpired extends CZ.UI.FormBase {
            private sessionTimeSpan: JQuery;
            private sessionButton: JQuery;
            private time = 60;
            private timer;

            constructor(container: JQuery, formInfo: IFormHeaderSessionExpiredInfo) {
                super(container, formInfo);
                this.sessionTimeSpan = container.find(formInfo.sessionTimeSpan);
                this.sessionButton = container.find(formInfo.sessionButton);

                this.initialize();
            }

            private initialize(): void {
                this.sessionButton.click(() =>
                {
                    CZ.Service.getProfile();
                    clearTimeout(this.timer);
                    this.time = 60;
                    this.close();
                    this.sessionTimeSpan.html(this.time.toString());
                    CZ.Authoring.resetSessionTimer();
                    return false;
                });
            }

            public onTimer(): void {
                if (this.time > 0) {
                    this.time--;
                    this.sessionTimeSpan.html(this.time.toString());
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.onTimer();
                    }, 1000);
                } else {
                    clearTimeout(this.timer);

                    this.close();
                    document.location.href = "/account/logout";
                }
            }
            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                    }
                });

                this.timer = setTimeout(() => {
                    this.onTimer();
                }, 1000);
                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            }
        }
    }
}