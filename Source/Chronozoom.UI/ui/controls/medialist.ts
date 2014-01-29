/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export class MediaList {
            private mediaPickers: any;
            private container: JQuery;
            private context: any;
            private form: any;

            constructor(container: JQuery, mediaPickers: any, context: any, form: any) {
                this.container = container;
                this.mediaPickers = mediaPickers;
                this.context = context;
                this.form = form;

                this.container.addClass("cz-medialist");
                this.fillListOfLinks();
            }

            private fillListOfLinks(): void {
                // Sort mediaPickers keys by 'order' property.
                var sortedMediaPickersKeys = Object.keys(this.mediaPickers).sort((key1, key2) => {
                    return this.mediaPickers[key1].order - this.mediaPickers[key2].order;
                });

                // Construct list of links dynamically.
                sortedMediaPickersKeys.forEach(key => {
                    if (this.mediaPickers.hasOwnProperty(key)) {
                        var mp = <CZ.Media.MediaPickerInfo> this.mediaPickers[key];
                        var link = this.createMediaPickerLink(mp);
                        this.container.append(link);
                    }
                });
            }

            private createMediaPickerLink(mp: CZ.Media.MediaPickerInfo): JQuery {
                var container = $("<div></div>", {
                    class: "cz-medialist-item",
                    title: mp.title,
                    "media-picker": mp.title
                });

                var icon = $("<img></img>", {
                    class: "cz-medialist-item-icon",
                    src: mp.iconUrl
                });

                container.click(event => {
                    mp.setup(this.context, this.form);
                });

                container.append(icon);
                return container;
            }

            public remove(): void {
                this.container.empty();
                this.container.removeClass("cz-medialist");
            }
        }
    }
}