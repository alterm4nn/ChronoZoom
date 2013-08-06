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
            var mediaType;
            function setup(context) {
                contentItem = context;
                editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                SkyDriveMediaPicker.logoutButton = $("<button></button>", {
                    text: "Logout",
                    class: "cz-skydrive-logout-button",
                    click: onLogout
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
                switch(response.data.files[0].type) {
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
            function onContentReceive(response) {
                var src = response.embed_html.match(/src=\"(.*?)\"/i)[1];
                var uri = src;
                if(mediaType === "skydrive-image") {
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
            function onError(response) {
                var error = response.error;
                if(error.code === "user_canceled" || error.code === "request_canceled") {
                    onFilePickerClose();
                } else {
                    console.log(error.message);
                }
            }
            function onLogout() {
                var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                SkyDriveMediaPicker.logoutButton.hide();
                SkyDriveMediaPicker.filePicker.cancel();
                WL.logout();
                if(isFirefox) {
                    setTimeout(setup, 500, contentItem);
                } else {
                    var start = +new Date();
                    while(+new Date() - start < 500) {
                        ;
                    }
                    setup(contentItem);
                }
            }
            function watchFilePicker(callback) {
                SkyDriveMediaPicker.filePickerIframe = $("iframe[sutra=picker]");
                if(SkyDriveMediaPicker.filePickerIframe.length > 0) {
                    callback();
                } else {
                    setTimeout(watchFilePicker, 50, callback);
                }
            }
            function onFilePickerLoad() {
                SkyDriveMediaPicker.logoutButton.appendTo("body");
                $(window).on("resize", onWindowResize);
                SkyDriveMediaPicker.filePickerIframe.load(function () {
                    onWindowResize();
                    SkyDriveMediaPicker.filePickerIframe.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.logoutButton.animate({
                        opacity: 1
                    });
                });
            }
            function onFilePickerClose() {
                SkyDriveMediaPicker.logoutButton.remove();
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
            }
        })(Media.SkyDriveMediaPicker || (Media.SkyDriveMediaPicker = {}));
        var SkyDriveMediaPicker = Media.SkyDriveMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
