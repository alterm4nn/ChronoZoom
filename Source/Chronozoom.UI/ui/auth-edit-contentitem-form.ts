/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormEditCIInfo extends CZ.UI.IFormUpdateEntityInfo {
            titleInput: string;
            mediaInput: string;
            mediaSourceInput: string;
            mediaTypeInput: string;
            attributionInput: string;
            descriptionInput: string;
            errorMessage: string;
            context: {
                exhibit: Object;
                contentItem: Object;
            };
        }

        export class FormEditCI extends CZ.UI.FormUpdateEntity {
            private titleTextblock: JQuery;
            private titleInput: JQuery;
            private mediaInput: JQuery;
            private mediaSourceInput: JQuery;
            private mediaTypeInput: JQuery;
            private attributionInput: JQuery;
            private descriptionInput: JQuery;
            private errorMessage: JQuery;
            private saveButton: JQuery;

            private prevForm: FormBase;

            private exhibit: any; // CanvasInfodot
            private contentItem: any; // ContentItem Metadata

            private mode; // create | edit
            private isCancel: bool; // is form closed without saving changes

            constructor(container: JQuery, formInfo: IFormEditCIInfo) {
                super(container, formInfo);

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);

                this.prevForm = formInfo.prevForm;

                this.exhibit = formInfo.context.exhibit;
                this.contentItem = formInfo.context.contentItem;

                this.mode = CZ.Authoring.mode; // deep copy mode. it never changes throughout the lifecycle of the form.
                this.isCancel = true;

                this.initUI();
            }

            private initUI() {
                if (CZ.Authoring.contentItemMode === "createContentItem") {
                    this.titleTextblock.text("Create New");
                    this.saveButton.text("create artifiact");

                    this.titleInput.val(this.contentItem.title || "");
                    this.mediaInput.val(this.contentItem.uri || "");
                    this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                    this.mediaTypeInput.val(this.contentItem.mediaType || "");
                    this.attributionInput.val(this.contentItem.attribution || "")
                    this.descriptionInput.val(this.contentItem.description || "");

                    this.closeButton.hide();
                    this.saveButton.show();

                    this.saveButton.off();
                    this.saveButton.click(() => this.onSave());

                } else if (CZ.Authoring.contentItemMode === "editContentItem") {
                    this.titleTextblock.text("Edit");
                    this.saveButton.text("update artifact");

                    this.titleInput.val(this.contentItem.title || "");
                    this.mediaInput.val(this.contentItem.uri || "");
                    this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                    this.mediaTypeInput.val(this.contentItem.mediaType || "");
                    this.attributionInput.val(this.contentItem.attribution || "")
                    this.descriptionInput.val(this.contentItem.description || "");

                    this.closeButton.show();
                    this.saveButton.show();

                    // this.closeButton.click() is handled by base
                    this.saveButton.off();
                    this.saveButton.click(() => this.onSave());
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }
            }

            private onSave() {
                var newContentItem = {
                    title: this.titleInput.val() || "",
                    uri: decodeURIComponent(this.mediaInput.val()) || "",
                    mediaSource: this.mediaSourceInput.val() || "",
                    mediaType: this.mediaTypeInput.val() || "",
                    attribution: this.attributionInput.val() || "",
                    description: this.descriptionInput.val() || "",
                    order: this.contentItem.order
                };
                if (CZ.Authoring.validateContentItems([newContentItem])) {
                    if (CZ.Authoring.contentItemMode === "createContentItem") {
                        if (this.prevForm && this.prevForm instanceof FormEditExhibit) {
                            this.isCancel = false;
                            (<FormEditExhibit>this.prevForm).contentItemsListBox.add(newContentItem);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (<FormEditExhibit>this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.back();
                        }
                    } else if (CZ.Authoring.contentItemMode === "editContentItem") {
                        if (this.prevForm && this.prevForm instanceof FormEditExhibit) {
                            this.isCancel = false;
                            var clickedListItem = (<FormEditExhibit>this.prevForm).clickedListItem;
                            clickedListItem.iconImg.attr("src", newContentItem.uri);
                            clickedListItem.titleTextblock.text(newContentItem.title);
                            clickedListItem.descrTextblock.text(newContentItem.description);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (<FormEditExhibit>this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.back();
                        } else {
                            CZ.Authoring.updateContentItem(this.exhibit, this.contentItem, newContentItem).then(
                                response => {
                                    this.isCancel = false;
                                    this.close();
                                },
                                error => {
                                    alert("Unable to save changes. Please try again later.");
                                }
                            );
                        }
                    }
                } else {
                    this.errorMessage.show().delay(7000).fadeOut();
                }
            }

            public show(noAnimation?: bool = false) {
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                super.show(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            }

            public close(noAnimation?: bool = false) {
                super.close(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                if (this.isCancel) {
                    if (CZ.Authoring.contentItemMode === "createContentItem") {
                        this.exhibit.contentItems.pop();
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            }

        }
    }
}