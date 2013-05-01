/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>
/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface FormEditCIInfo extends CZ.UI.FormBaseInfo {
            saveButton: string;
            titleInput: string;
            mediaSourceInput: string;
            mediaInput: string;
            descriptionInput: string;
            attributionInput: string;
            mediaTypeInput: string;
            context: {
                exhibit: Object;
                contentItem: Object;
            };
        }

        export class FormEditCI extends CZ.UI.FormBase {
            private titleTextblock: JQuery;
            private titleInput: JQuery;
            private mediaInput: JQuery;
            private mediaSourceInput: JQuery;
            private mediaTypeInput: JQuery;
            private attributionInput: JQuery;
            private descriptionInput: JQuery;
            private saveButton: JQuery;            
            private prevForm: FormBase;
            private contentItem: any;
            private exhibit: any;
            private isCancel: bool;

            constructor(container: JQuery, formInfo: FormEditCIInfo) {
                super(container, formInfo);

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.saveButton = container.find(formInfo.saveButton);

                this.prevForm = formInfo.prevForm;
                this.contentItem = formInfo.context.contentItem;
                this.exhibit = formInfo.context.exhibit;
                
                this.saveButton.off();
                this.initialize();
            }
             
            private initialize(): void {
                if (!this.exhibit || !this.contentItem) {
                    alert("Invalid binding. No contentItem to bind against.");
                    this.close();
                }

                if (CZ.Authoring.mode === "createExhibit" || CZ.Authoring.mode === "editExhibit" || CZ.Authoring.mode === "editContentItem") {
                    if (CZ.Authoring.CImode == "createCI") {
                        this.titleTextblock.text("Create New");
                        this.saveButton.text("create artifiact");
                        this.closeButton.hide();
                    } else if (CZ.Authoring.CImode == "editCI") {
                        this.titleTextblock.text("Edit");
                        this.saveButton.text("update artifact");
                        if (this.prevForm) {
                            this.closeButton.hide();
                        }
                    } else {
                        console.log("Unexpected authoring mode in content item form.");
                        this.close();
                    }
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }

                this.isCancel = true;

                this.titleInput.val(this.contentItem.title || "");
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "")
                this.descriptionInput.val(this.contentItem.description || "");

                this.saveButton.click(event => {
                    var newContentItem = {
                        title: this.titleInput.val() || null,
                        uri: this.mediaInput.val() || null,
                        mediaSource: this.mediaSourceInput.val() || null,
                        mediaType: this.mediaTypeInput.val() || null,
                        attribution: this.attributionInput.val() || null,
                        description: this.descriptionInput.val() || null
                    };

                    if (CZ.Authoring.ValidateContentItems([newContentItem])) {
                        this.isCancel = false;
                        this.contentItem.title = newContentItem.title;
                        this.contentItem.uri = newContentItem.uri;
                        this.contentItem.mediaSource = newContentItem.mediaSource;
                        this.contentItem.mediaType = newContentItem.mediaType;
                        this.contentItem.attribution = newContentItem.attribution;
                        this.contentItem.description = newContentItem.description;
                        if (CZ.Authoring.CImode == "createCI") {
                            (<any>this.prevForm).contentItemsListBox.add(newContentItem);
                        } else if (CZ.Authoring.CImode == "editCI") {
                            var listBoxItems = (<any>this.prevForm).contentItemsListBox.items;
                            for (var i = 0; i < listBoxItems.length; i++) {
                                var item = listBoxItems[i];
                                if (this.contentItem.title === item.data.title &&
                                    this.contentItem.uri === item.data.uri) {

                                    $(item.container).find(".cz-ci-listitem-title").text(newContentItem.title);
                                    $(item.container).find(".cz-ci-listitem-descr").text(newContentItem.description);
                                    break;
                                }
                            }
                        }
                        this.back();
                    } else {
                        this.container.find("#error-edit-ci").show().delay(7000).fadeOut();
                    }
                });
            }

            public show(noAnimation?: bool): void {
                super.show(noAnimation ? undefined : {
                    effect: "slide", 
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close(noAnimation?: bool) {
                this.container.find("#error-edit-ci").hide();

                super.close(noAnimation ? undefined : {
                    effect: "slide", 
                    direction: "left",
                    duration: 500
                });

                if (this.isCancel && CZ.Authoring.CImode == "createCI") {
                    this.exhibit.contentItems.pop();
                }

                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            }

            public back() {
                this.close(true);
                if (this.prevForm) {
                    this.prevForm.show(true);
                }
            }
        }
    }
}