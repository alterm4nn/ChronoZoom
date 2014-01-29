/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/settings.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module Media {
        declare var WL: any;

        export module SkyDriveMediaPicker {
            var editContentItemForm: any;
            var contentItem: any;
            export var filePicker: any;
            export var filePickerIframe: JQuery;
            export var logoutButton: JQuery;
            export var isEnabled: boolean;
            export var helperText: JQuery;
            var mediaType: string;

            export function setup(context: any, formHost: any) {
                contentItem = context;
                editContentItemForm = formHost ? formHost : CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");

                logoutButton = $("<button></button>", {
                    text: "Logout",
                    class: "cz-skydrive-logout-button",
                    click: onLogout
                });
                
                helperText = $("<label></label>", {
                    text: "Selected items will be automatically shared",
                    class: "cz-skydrive-help-text",
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
                switch (response.data.files[0].type) {
                    case "photo":
                        mediaType = "skydrive-image";
                        break;
                    default:
                        mediaType = "skydrive-document";
                        break;
                }

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
                
                var uri = src;

                if (mediaType === "skydrive-image") {
                    var width = parseFloat(response.embed_html.match(/width="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    var height = parseFloat(response.embed_html.match(/height="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    uri += ' ' + width + ' ' + height;
                }

                var mediaInfo = <CZ.Media.MediaInfo> {
                    uri: uri,
                    mediaType: mediaType,
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
                if (window.confirm("Are you sure want to logout from Skydrive? All your unsaved changes will be lost.")) {
                    logoutButton.hide();
                helperText.hide();
                    filePicker.cancel();
                    WL.logout();
                    
                    // send response to login.live.com/oatuh20_logout.srf to logout from Skydrive
                    // More info: http://social.msdn.microsoft.com/Forums/live/en-US/4fd9a484-54d7-4c59-91c4-081f4deee2c7/how-to-sign-out-by-rest-api
                    window.location.assign("https://login.live.com/oauth20_logout.srf?client_id=" +
                        CZ.Settings.WLAPIClientID + "&redirect_uri=" + window.location.toString());
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

                helperText.appendTo("body");

                $(window).on("resize", onWindowResize);

                filePickerIframe.load(() => {
                    onWindowResize();
                    filePickerIframe.animate({
                        opacity: 1
                    });
                    logoutButton.animate({
                        opacity: 1
                    });
                    helperText.animate({
                        opacity: 1
                    });
                });
            }

            /**
             * Finalizes file picker.
             */
            function onFilePickerClose() {
                logoutButton.remove();
                helperText.remove();
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
                helperText.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin + 1,
                    left: iframeOffset.left + buttonLeftMargin + 90
                });
            }
        }
    }
}