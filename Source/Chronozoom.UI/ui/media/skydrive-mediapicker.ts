/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module Media {
        export class SkyDriveMediaPicker {
            public static setup(context: any) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["skydrive"];
                var mediaPicker = new SkyDriveMediaPicker(mediaPickerContainer, context);
                var formContainer = $(".cz-form-skydrive-mediapicker");

                // Create container for Media Picker's form if it doesn't exist.
                if (formContainer.length === 0) {
                    formContainer = $("#mediapicker-form")
                        .clone()
                        .removeAttr("id")
                        .addClass("cz-form-skydrive-mediapicker")
                        .appendTo($("#content"));
                }

                // Create form for Media Picker and append Media Picker to it.
                var form = new CZ.UI.FormMediaPicker(
                    formContainer,
                    mediaPickerContainer, 
                    "Import from SkyDrive",
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        contentContainer: ".cz-form-content"
                    }
                );

                $(form).on("showcompleted", event => {
                });

                $(mediaPicker).on("resultclick", event => {
                });

                $(form).on("closecompleted", event => {
                });

                form.show();
            }

            private editContentItemForm: CZ.UI.FormEditCI;
            private container: JQuery;
            private contentItem: any;

            private loginButton: JQuery;
            private browseButton: JQuery;
            private previewContainer: JQuery;

            public isEnabled: bool;

            constructor(container: JQuery, context: any) {
                this.container = container;
                this.contentItem = context;

                this.editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                this.loginButton = this.container.find("#skydrive-login-button");
                this.browseButton = this.container.find("#skydrive-browse-button");
                this.previewContainer = this.container.find("#skydrive-preview-container");

                this.initialize();
            }

            private initialize(): void {
                this.loginButton.off();
                this.browseButton.off();
                $(this).off();

                this.loginButton.click(event => {
                });

                this.browseButton.click(event => {
                });

                $(this).on("resultclick", (event, mediaInfo) => {
                });
            }
        }
    }
}