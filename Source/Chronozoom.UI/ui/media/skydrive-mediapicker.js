/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/settings.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Media) {
        (function (SkyDriveMediaPicker) {
            var editContentItemForm;
            var contentItem;
            SkyDriveMediaPicker.filePicker;
            SkyDriveMediaPicker.filePickerIframe;
            SkyDriveMediaPicker.logoutButton;
            SkyDriveMediaPicker.isEnabled;
            SkyDriveMediaPicker.helperText;
            var mediaType;

            function setup(context) {
                contentItem = context;
                editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");

                SkyDriveMediaPicker.logoutButton = $("<button></button>", {
                    text: "Logout",
                    class: "cz-skydrive-logout-button",
                    click: onLogout
                });

                SkyDriveMediaPicker.helperText = $("<label></label>", {
                    text: "Selected items will be automatically shared",
                    class: "cz-skydrive-help-text"
                });

                SkyDriveMediaPicker.filePicker = showFilePicker().then(onFilePick, onError);
            }
            SkyDriveMediaPicker.setup = setup;

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

                var mediaInfo = {
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
                    SkyDriveMediaPicker.logoutButton.hide();
                    SkyDriveMediaPicker.helperText.hide();
                    SkyDriveMediaPicker.filePicker.cancel();
                    WL.logout();

                    // send response to login.live.com/oatuh20_logout.srf to logout from Skydrive
                    // More info: http://social.msdn.microsoft.com/Forums/live/en-US/4fd9a484-54d7-4c59-91c4-081f4deee2c7/how-to-sign-out-by-rest-api
                    window.location.assign("https://login.live.com/oauth20_logout.srf?client_id=" + CZ.Settings.WLAPIClientID + "&redirect_uri=" + window.location.toString());
                }
            }

            /**
            * Waits file picker to appear in DOM and fires a callback.
            * @param  {function} callback A callback to fire after file picker appears in DOM.
            */
            function watchFilePicker(callback) {
                SkyDriveMediaPicker.filePickerIframe = $("iframe[sutra=picker]");
                if (SkyDriveMediaPicker.filePickerIframe.length > 0) {
                    callback();
                } else {
                    setTimeout(watchFilePicker, 50, callback);
                }
            }

            /**
            * Initializes and shows file picker with fade-in animation on load.
            */
            function onFilePickerLoad() {
                // Append logout button to file picker.
                SkyDriveMediaPicker.logoutButton.appendTo("body");

                SkyDriveMediaPicker.helperText.appendTo("body");

                $(window).on("resize", onWindowResize);

                SkyDriveMediaPicker.filePickerIframe.load(function () {
                    onWindowResize();
                    SkyDriveMediaPicker.filePickerIframe.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.logoutButton.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.helperText.animate({
                        opacity: 1
                    });
                });
            }

            /**
            * Finalizes file picker.
            */
            function onFilePickerClose() {
                SkyDriveMediaPicker.logoutButton.remove();
                SkyDriveMediaPicker.helperText.remove();
                $(window).off("resize", onWindowResize);
            }

            /**
            * Adjusts position of logout button according to file picker's position.
            */
            function onWindowResize() {
                // Source: CSS from SkyDrive.
                var skyDriveFooterHeight = 56;
                var iframeOffset = SkyDriveMediaPicker.filePickerIframe.offset();
                var iframeHeight = SkyDriveMediaPicker.filePickerIframe.outerHeight(true);
                var buttonLeftMargin = parseInt(SkyDriveMediaPicker.logoutButton.css("margin-left"), 10);
                var buttonTopMargin = parseInt(SkyDriveMediaPicker.logoutButton.css("margin-top"), 10);

                SkyDriveMediaPicker.logoutButton.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin,
                    left: iframeOffset.left + buttonLeftMargin
                });
                SkyDriveMediaPicker.helperText.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin + 1,
                    left: iframeOffset.left + buttonLeftMargin + 90
                });
            }
        })(Media.SkyDriveMediaPicker || (Media.SkyDriveMediaPicker = {}));
        var SkyDriveMediaPicker = Media.SkyDriveMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
