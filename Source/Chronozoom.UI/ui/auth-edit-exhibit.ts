/// <reference path='ci-listbox.ts' />
/// <reference path='../NewScripts/controls/formbase.ts' />
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
            contentItemsTemplate: JQuery;
            context: Object;
        }

        export class FormEditExhibit extends CZ.UI.FormBase {
            private container: JQuery;
            private formInfo: FormEditExhibitInfo;

            private titleTextblock: JQuery;
            private titleInput: JQuery;
            private datePicker: CZ.UI.DatePicker;
            private createArtifactButton: JQuery;
            private contentItemsListBox: CZ.UI.ContentItemListBox;
            private saveButton: JQuery;
            private deleteButton: JQuery;
            private contentItemsTemplate: JQuery;

            private oldContentItems: any;
            private exhibit: any;
            private isCancel: bool; // form is closed without saving changes

            constructor(container: JQuery, formInfo: FormEditExhibitInfo) {
                super(container, formInfo);
                this.container = container;
                this.formInfo = formInfo;

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, (<any>formInfo.context).contentItems);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.contentItemsTemplate = formInfo.contentItemsTemplate;
                this.oldContentItems = $.map((<any>formInfo.context).contentItems, function (obj) { return $.extend(true, {}, obj); });
                this.exhibit = formInfo.context;

                this.createArtifactButton.off();
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
                this.datePicker.setDate(this.exhibit.infodotDescription.date);

                this.saveButton.click(event => {
                    if (CZ.Authoring.ValidateExhibitData(this.datePicker.getDate(), this.titleInput.val(), this.exhibit.contentItems) &&
                        this.exhibit.contentItems.length >= 1 && this.exhibit.contentItems.length <= 10) { // num of content items in an exhibit [1, 10]

                        var newContentItems = this.exhibit.contentItems;
                        this.exhibit.contentItems = this.oldContentItems;
                        CZ.Authoring.updateExhibit(this.exhibit, {
                            title: this.titleInput.val(),
                            date: this.datePicker.getDate(),
                            contentItems: newContentItems
                        }).then(
                            success => {
                               this.isCancel = false;
                               this.close();
                           },
                           error => {
                               this.exhibit.contentItems = newContentItems;
                               alert("Unable to save changes. Please try again later.");
                               console.log(error);
                           }
                       );
                    } else {
                        this.container.find("#error-edit-exhibit").show().delay(7000).fadeOut();
                    }
                });

                // deleteButton is only visible when CZ.Authoring.mode === "editExhibit"
                this.deleteButton.click(event => {
                    if (confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                        CZ.Authoring.removeExhibit(this.exhibit);
                        this.isCancel = false;
                        this.close();
                    }
                });

                this.createArtifactButton.click(event => {
                    if (this.exhibit.contentItems.length < 10) {
                        this.close(true, false);
                        var newContentItem = {
                            title: "",
                            uri: "",
                            mediaSource: "",
                            mediaType: "",
                            attribution: "",
                            description: ""
                        };
                        this.exhibit.contentItems.push(newContentItem);
                        CZ.Authoring.CImode = "createCI";
                        CZ.Authoring.showEditContentItemForm(newContentItem, this.exhibit, this, true);
                    }
                });

                this.contentItemsListBox.onListItemClicked = (item, idx) => {
                    for (var i = 0; i < this.exhibit.contentItems.length; i++) {
                        if (this.exhibit.contentItems[i].title === item.data.title &&
                            this.exhibit.contentItems[i].uri === item.data.uri) {

                            this.close(true, false);
                            CZ.Authoring.CImode = "editCI";
                            CZ.Authoring.showEditContentItemForm(this.exhibit.contentItems[i], this.exhibit, this, true);
                            break;
                        }
                    }
                }

                this.contentItemsListBox.onListItemRemoved = (item, idx) => {
                    for (var i = 0; i < this.exhibit.contentItems.length; i++) {
                        if (this.exhibit.contentItems[i].title === item.data.title &&
                            this.exhibit.contentItems[i].uri === item.data.uri) {

                            this.exhibit.contentItems.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            public show(noAnimation?: bool): void {
                super.show(noAnimation ? undefined : {
                    effect: "slide", 
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
                this.isCancel = true;
            }

            public close(noAnimation?: bool, destroy?: bool = true) {
                this.container.find("#error-edit-exhibit").hide();

                super.close(noAnimation ? undefined : {
                    effect: "slide", 
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        if (destroy) {
                            this.datePicker.remove();
                            this.contentItemsListBox.clear();
                        }
                    }
                });

                if (this.isCancel && destroy && CZ.Authoring.mode === "createExhibit") {
                    CZ.Authoring.removeExhibit(this.exhibit);
                }

                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            }
        }
    }
}
