var CZ;
(function (CZ) {
    (function (Media) {
        var BingMediaPicker = (function () {
            function BingMediaPicker(container, context) {
                this.container = container;
                this.contentItem = context;
                this.searchTextbox = this.container.find(".cz-form-search-input");
                this.mediaTypeRadioButtons = this.container.find(":radio");
            }
            BingMediaPicker.setup = function setup(context) {
                var container = CZ.Media.mediaPickersViews["bing"];
                var picker = new BingMediaPicker(container, context);
                var formContainer = $(".cz-form-bing-mediapicker");
                if(formContainer.length === 0) {
                    formContainer = $("#mediapicker-form").clone().removeAttr("id").addClass("cz-form-bing-mediapicker").appendTo($("#content"));
                }
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
            };
            BingMediaPicker.prototype.getMediaType = function () {
                return this.mediaTypeRadioButtons.find(":checked").val();
            };
            return BingMediaPicker;
        })();
        Media.BingMediaPicker = BingMediaPicker;        
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
