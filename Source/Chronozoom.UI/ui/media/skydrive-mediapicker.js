var CZ;
(function (CZ) {
    (function (Media) {
        var SkyDriveMediaPicker = (function () {
            function SkyDriveMediaPicker(container, context) {
                this.container = container;
                this.contentItem = context;
                this.editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                this.loginButton = this.container.find("#skydrive-login-button");
                this.browseButton = this.container.find("#skydrive-browse-button");
                this.previewContainer = this.container.find("#skydrive-preview-container");
                this.initialize();
            }
            SkyDriveMediaPicker.setup = function setup(context) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["skydrive"];
                var mediaPicker = new SkyDriveMediaPicker(mediaPickerContainer, context);
                var formContainer = $(".cz-form-skydrive-mediapicker");
                if(formContainer.length === 0) {
                    formContainer = $("#mediapicker-form").clone().removeAttr("id").addClass("cz-form-skydrive-mediapicker").appendTo($("#content"));
                }
                var form = new CZ.UI.FormMediaPicker(formContainer, mediaPickerContainer, "Import from SkyDrive", {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });
                $(form).on("showcompleted", function (event) {
                });
                $(mediaPicker).on("resultclick", function (event) {
                });
                $(form).on("closecompleted", function (event) {
                });
                form.show();
            };
            SkyDriveMediaPicker.prototype.initialize = function () {
                this.loginButton.off();
                this.browseButton.off();
                $(this).off();
                this.loginButton.click(function (event) {
                });
                this.browseButton.click(function (event) {
                });
                $(this).on("resultclick", function (event, mediaInfo) {
                });
            };
            return SkyDriveMediaPicker;
        })();
        Media.SkyDriveMediaPicker = SkyDriveMediaPicker;        
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
