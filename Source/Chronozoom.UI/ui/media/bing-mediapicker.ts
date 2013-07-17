/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module Media {
        export class BingMediaPicker {
            public static setup(context: any) {
                var container = CZ.Media.mediaPickersViews["bing"];
                var picker = new BingMediaPicker(container, context);
                var formContainer = $(".cz-form-bing-mediapicker");

                // Create container for Media Picker's form if it doesn't exist.
                if (formContainer.length === 0) {
                    formContainer = $("#mediapicker-form")
                        .clone()
                        .removeAttr("id")
                        .addClass("cz-form-bing-mediapicker")
                        .appendTo($("#content"));
                }

                // Create form for Media Picker and append Media Picker to it.
                var form = new CZ.UI.FormMediaPicker(formContainer, {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });

                form.titleTextblock.text("Import from Bing");
                form.contentContainer.append(container);
                form.show();
            }

            private container: JQuery;
            private contentItem: any;

            private searchTextbox: JQuery;
            private mediaTypeRadioButtons: JQuery;

            constructor(container: JQuery, context: any) {
                this.container = container;
                this.contentItem = context;

                this.searchTextbox = this.container.find(".cz-form-search-input");
                this.mediaTypeRadioButtons = this.container.find(":radio");
            }

            private getMediaType(): string {
                return this.mediaTypeRadioButtons.find(":checked").val();
            }
        }
    }
}