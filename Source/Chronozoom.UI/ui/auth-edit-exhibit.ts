/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>

/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface FormEditExhibitInfo extends CZ.UI.FormBaseInfo {
            titleTextblock: string;
            titleInput: string;
            datePicker: string;
            createArtifactButton: string;
            contentItemsListBox: string;
            saveButton: string;
            deleteButton: string;
            context: Object;
        }

        export class FormEditExhibit extends CZ.UI.FormBase {
            private titleTextblock: JQuery;
            private titleInput: JQuery;
            private datePicker: CZ.UI.DatePicker;
            private createArtifactButton: JQuery;
            private contentItemsListBox: JQuery;
            private saveButton: JQuery;
            private deleteButton: JQuery;

            private exhibit: any;
            private isCancel: bool;

            constructor(container: JQuery, formInfo: FormEditExhibitInfo) {
                super(container, formInfo);
                
                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = container.find(formInfo.contentItemsListBox);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.exhibit = formInfo.context;

                this.saveButton.off();
                this.deleteButton.off();

                this.initialize();
            }

            private initialize(): void {
                if (CZ.Authoring.mode === "createExhibit") {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("create exhibit");
                }
                else if (CZ.Authoring.mode === "editExhibit") {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("update exhibit");
                }
                else {
                    console.log("Unexpected authoring mode in exhibit form.");
                    this.close();
                }

                this.isCancel = true;

                this.titleInput.val(this.exhibit.title);
                this.datePicker.setDate(this.exhibit.x);

                this.saveButton.click(event => {
                    var contentItems = this.getContentItemsData();
                    var isValid = CZ.Authoring.ValidateExhibitData(this.datePicker.getDate(), this.titleInput.val(), contentItems);
                    if (!isValid) {
                        this.container.find("#error-edit-exhibit").show();
                    }
                    if (isValid) {
                        var self = this;
                        CZ.Authoring.updateExhibit(this.exhibit, {
                            title: this.titleInput.val(),
                            date: this.datePicker.getDate(),
                            contentItems: contentItems
                        }).then(
                            function (success) {
                                self.isCancel = false;
                                self.close();
                            },
                            function (error) {
                                alert("Unable to save changes. Please try again later.");
                                console.log(error);
                            });
                    }
                });

                this.deleteButton.click(event => {
                    if (confirm("Are you sure want to delete the exhibit and all of its contentitems? Delete can't be undone!")) {
                        CZ.Authoring.removeExhibit(this.exhibit);
                        this.close();
                    }
                });
            }

            // todo: update to match new ui
            private getContentItemsData(): any[] {
                var contentItems = [];

                $(".cz-authoring-ci-container").each(function () {
                    var CItitleInput = $(this).find(".cz-authoring-ci-title");
                    var mediaInput = $(this).find(".cz-authoring-ci-uri");
                    var mediaTypeInput = (<any>$)(this).find(".cz-authoring-ci-media-type option");
                    var descriptionInput = $(this).find(".cz-authoring-ci-description");
                    var guid = $(this).attr("cz-authoring-ci-guid") || undefined;
                    var attributionInput = $(this).find(".cz-authoring-ci-attribution");
                    var mediaSourceInput = $(this).find(".cz-authoring-ci-media-source");

                    var selected = (<any>$)(mediaTypeInput)[0];

                    for (var i = 0; i < mediaTypeInput.length; i++)
                        if (mediaTypeInput[i].selected) {
                            selected = mediaTypeInput[i];
                            break;
                        }

                    contentItems.push({
                        title: CItitleInput.val(),
                        description: descriptionInput.val(),
                        uri: mediaInput.val(),
                        mediaType: selected.text,
                        attribution: attributionInput.val(),
                        mediaSource: mediaSourceInput.val(),
                        guid: guid,
                        parent: undefined
                    });
                });

                return contentItems;
            }

            public show(): void {
                super.show();

                // Just an example how to highligh pressed "Show Form" button.
                // Ideally, it would be better to not place UI selectors in form code,
                // but pass them through parameters.
                this.activationSource.addClass("activeButton");
            }

            public close() {
                if (this.isCancel && CZ.Authoring.mode === "createExhibit") {
                    CZ.Authoring.removeExhibit(this.exhibit);
                }

                this.container.hide("slow", event => {
                    this.datePicker.remove();
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("activeButton");
                this.container.find("#error-edit-exhibit").hide();
            }
        }
    }
}