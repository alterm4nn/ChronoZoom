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
            var tempSource;

            function setup(context, formHost) {
                contentItem = context;
                editContentItemForm = formHost ? formHost : CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");

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

            function showFilePicker() {
                watchFilePicker(onFilePickerLoad);
                return WL.fileDialog({
                    mode: "open",
                    select: "single"
                });
            }

            function onFilePick(response) {
                onFilePickerClose();
                getEmbed(response).then(onContentReceive, onError);
            }

            function getEmbed(response) {
                switch (response.data.files[0].type) {
                    case "photo":
                        mediaType = "onedrive-image";
                        break;
                    default:
                        mediaType = "onedrive-document";
                        break;
                }

                tempSource = response.data.files[0].source;
                return WL.api({
                    path: response.data.files[0].id + "/embed",
                    method: "GET"
                });
            }

            function onContentReceive(response) {
                var src = response.embed_html.match(/src=\"(.*?)\"/i)[1];

                var uri = src;

                if (mediaType === "onedrive-image") {
                    var width = parseFloat(response.embed_html.match(/width="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    var height = parseFloat(response.embed_html.match(/height="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    uri += ' ' + width + ' ' + height;
                }

                var mediaInfo = {
                    uri: uri,
                    mediaType: mediaType,
                    mediaSource: src,
                    attribution: src,
                    tempSource: tempSource
                };

                $.extend(contentItem, mediaInfo);
                editContentItemForm.updateMediaInfo();
            }

            function onError(response) {
                var error = response.error;
                if (error.code === "user_canceled" || error.code === "request_canceled") {
                    onFilePickerClose();
                } else {
                    console.log(error.message);
                }
            }

            function onLogout() {
                if (window.confirm("Are you sure want to logout from OneDrive? All your unsaved changes will be lost.")) {
                    SkyDriveMediaPicker.logoutButton.hide();
                    SkyDriveMediaPicker.helperText.hide();
                    SkyDriveMediaPicker.filePicker.cancel();
                    WL.logout();

                    window.location.assign("https://login.live.com/oauth20_logout.srf?client_id=" + CZ.Settings.WLAPIClientID + "&redirect_uri=" + window.location.toString());
                }
            }

            function watchFilePicker(callback) {
                SkyDriveMediaPicker.filePickerIframe = $("iframe[sutra=picker]");
                if (SkyDriveMediaPicker.filePickerIframe.length > 0) {
                    callback();
                } else {
                    setTimeout(watchFilePicker, 50, callback);
                }
            }

            function onFilePickerLoad() {
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

            function onFilePickerClose() {
                SkyDriveMediaPicker.logoutButton.remove();
                SkyDriveMediaPicker.helperText.remove();
                $(window).off("resize", onWindowResize);
            }

            function onWindowResize() {
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
