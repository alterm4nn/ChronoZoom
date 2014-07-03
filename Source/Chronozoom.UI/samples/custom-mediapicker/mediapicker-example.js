/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var MediaPickerExample = (function () {
    function MediaPickerExample(container, context) {
        var _this = this;
        this.container = container;
        this.context = context;
        this.fileInput = this.container.find("#upload-file");
        this.fileNameTextblock = this.container.find("#filename");

        this.fileNameTextblock.empty();

        this.fileInput.off();

        this.fileInput.change(function (event) {
            var files = _this.fileInput[0].files;
            if (files.length === 0) {
                return;
            }

            var file = files[0];
            _this.fileNameTextblock.text(file.name);
            _this.context.file = file.name;
        });
    }
    // NOTE: This method is required!
    //       The method is called when media type link is clicked in MediaList.
    MediaPickerExample.setup = function (context) {
        var container = CZ.Media.mediaPickersViews["example"];
        var picker = new MediaPickerExample(container, context);
        var form = new CZ.UI.FormBase($(".example-form"), {
            activationSource: undefined,
            navButton: ".cz-form-nav",
            closeButton: ".cz-form-close-btn > .cz-form-btn",
            titleTextblock: ".cz-form-title",
            contentContainer: ".cz-form-content"
        });

        form.contentContainer.append(container);

        form.closeButton.click(function (event) {
            alert("Global object value: " + context.file);
        });

        form.show();
    };
    return MediaPickerExample;
})();
