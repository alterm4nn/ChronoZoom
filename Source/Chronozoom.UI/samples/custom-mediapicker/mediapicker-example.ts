/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

class MediaPickerExample {
    // NOTE: This method is required!
    //       The method is called when media type link is clicked in MediaList.
    public static setup(context: any) {
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

        form.closeButton.click(event => {
            alert("Global object value: " + context.file);
        });

        form.show();
    }

    // Functional part of MediaPicker.
    private container: JQuery;
    private context: any;
    private fileInput: JQuery;
    private fileNameTextblock: JQuery;

    constructor(container: JQuery, context: any) {
        this.container = container;
        this.context = context;
        this.fileInput = this.container.find("#upload-file");
        this.fileNameTextblock = this.container.find("#filename");

        this.fileNameTextblock.empty();

        this.fileInput.off();

        this.fileInput.change(event => {
            var files = (<any>this.fileInput[0]).files;
            if (files.length === 0) {
                return;
            }

            var file = files[0];
            this.fileNameTextblock.text(file.name);
            this.context.file = file.name;
        });
    }
}