/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module Media {
        declare var WL: any;

        export module SkyDriveMediaPicker {
            var editContentItemForm: CZ.UI.FormEditCI;
            var contentItem: any;
            export var filePicker: any;
            export var filePickerIframe: JQuery;
            export var logoutButton: JQuery;
            export var isEnabled: bool;

            export function setup(context: any) {
                contentItem = context;
                editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");

                logoutButton = $("<button></button>", {
                    text: "Logout",
                    class: "cz-skydrive-logout-button",
                    click: onLogout
                });

                filePicker = showFilePicker().then(onFilePick, onError);
            }

            /**
             * Shows file picker's dialog.
             * @return {Promise} File picker's promise.
             */
            function showFilePicker() {
                watchFilePicker(onFilePickerLoad);
                return WL.fileDialog({
                    mode: "open",
                    select: "single"
                });
            }

            /**
             * Gets embedded HTML code of picked file and removes logout button.
             * @param  {Object} response SkyDrive's response.
             */
            function onFilePick(response) {
                onFilePickerClose();
                getEmbed(response).then(onContentReceive, onError);
            }

            /**
             * Gets embedded HTML code of picked file.
             * @param  {Object}  response SkyDrive's response.
             * @return {Promise}          Request's promise.
             */
            function getEmbed(response) {
                return WL.api({
                    path: response.data.files[0].id + "/embed",
                    method: "GET"
                });
            }

            /**
             * Extracts URL of file from response and updates content item.
             * @param  {Object} response SkyDrive's response.
             */
            function onContentReceive(response) {
                var src = response.embed_html.match(/src=\"(.*?)\"/i)[1];
                var mediaInfo = <CZ.Media.MediaInfo> {
                    uri: src,
                    mediaType: "skydrive",
                    mediaSource: src,
                    attribution: src
                };

                $.extend(contentItem, mediaInfo);
                editContentItemForm.updateMediaInfo();
            }

            /**
             * Shows error of SkyDrive in console.
             * If a user cancelled file picker or clicked on logout button then remove logout button.
             */
            function onError(response) {
                var error = response.error;
                if (error.code === "user_canceled" || error.code === "request_canceled") {
                    onFilePickerClose();
                } else {
                    console.log(error.message);
                }
            }

            /**
             * Logout and closes file picker and opens login dialog.
             */
            function onLogout() {
                var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                logoutButton.hide();
                filePicker.cancel();
                WL.logout();

                // Immediate call causes login with previous user without Sign In popup.
                // NOTE: Async call causes popup to be blocked in Chrome and IE.
                //       More info: http://stackoverflow.com/a/7060302/1211780
                if (isFirefox) {
                    setTimeout(setup, 500, contentItem);
                } else {
                    // Sync imitation of setTimeout 500ms.
                    var start = + new Date();
                    while (+ new Date() - start < 500);
                    setup(contentItem);
                }
            }

            /**
             * Waits file picker to appear in DOM and fires a callback.
             * @param  {function} callback A callback to fire after file picker appears in DOM.
             */
            function watchFilePicker(callback: () => void): void {
                filePickerIframe = $("iframe[sutra=picker]");
                if (filePickerIframe.length > 0) {
                    callback();
                } else {
                    setTimeout(watchFilePicker, 50, callback);
                }
            }

            /**
             * Initializes and shows file picker with fade-in animation on load.
             */
            function onFilePickerLoad(): void {
                // Append logout button to file picker.
                logoutButton.appendTo("body");

                $(window).on("resize", onWindowResize);

                filePickerIframe.load(() => {
                    onWindowResize();
                    filePickerIframe.animate({
                        opacity: 1
                    });
                    logoutButton.animate({
                        opacity: 1
                    });
                });
            }

            /**
             * Finalizes file picker.
             */
            function onFilePickerClose() {
                logoutButton.remove();
                $(window).off("resize", onWindowResize);                
            }

            /**
             * Adjusts position of logout button according to file picker's position.
             */
            function onWindowResize() {
                // Source: CSS from SkyDrive.
                var skyDriveFooterHeight = 56;
                var iframeOffset = filePickerIframe.offset();
                var iframeHeight = filePickerIframe.outerHeight(true);
                var buttonLeftMargin = parseInt(logoutButton.css("margin-left"), 10);
                var buttonTopMargin = parseInt(logoutButton.css("margin-top"), 10);

                logoutButton.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin,
                    left: iframeOffset.left + buttonLeftMargin
                });
            }
        }
    }
}