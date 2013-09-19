/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>

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
            mediaListContainer: string;
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
            private mediaListContainer: JQuery;

            private prevForm: FormBase;
            private mediaList: CZ.UI.MediaList;

            private exhibit: any; // CanvasInfodot
            private contentItem: any; // ContentItem Metadata

            private mode; // create | edit
            private isCancel: bool; // is form closed without saving changes
            private isModified: bool;

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
                this.mediaListContainer = container.find(formInfo.mediaListContainer);

                this.titleInput.focus(() => {
                    this.titleInput.hideError();
                });

                this.mediaInput.focus(() => {
                    this.mediaInput.hideError();
                });

                this.mediaSourceInput.focus(() => {
                    this.mediaSourceInput.hideError();
                });

                this.prevForm = formInfo.prevForm;

                this.exhibit = formInfo.context.exhibit;
                this.contentItem = formInfo.context.contentItem;

                this.mode = CZ.Authoring.mode; // deep copy mode. it never changes throughout the lifecycle of the form.
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }

            private initUI() {
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem);
                var that = this;
                this.saveButton.prop('disabled', false);

                this.titleInput.change(() => { this.isModified = true; });
                this.mediaInput.change(() => { this.isModified = true; });
                this.mediaSourceInput.change(() => { this.isModified = true; });
                this.mediaTypeInput.change(() => { this.isModified = true; });
                this.attributionInput.change(() => { this.isModified = true; });
                this.descriptionInput.change(() => { this.isModified = true; });


                this.descriptionInput.on('keyup', function (e) { if (e.which == 13) { that.saveButton.click(() => that.onSave()); } });
                this.descriptionInput.on('keydown', function (e) { if (e.which == 13) { that.saveButton.off(); } });

                if (CZ.Media.SkyDriveMediaPicker.isEnabled && this.mediaTypeInput.find("option[value='skydrive-image']").length === 0) {
                    $("<option></option>", {
                        value: "skydrive-image",
                        text: " Skydrive Image "
                    }).appendTo(this.mediaTypeInput);
                    $("<option></option>", {
                        value: "skydrive-document",
                        text: " Skydrive Document "
                    }).appendTo(this.mediaTypeInput);
                }

                this.titleInput.val(this.contentItem.title || "");
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "")
                this.descriptionInput.val(this.contentItem.description || "");
                this.saveButton.off();
                this.saveButton.click(() => this.onSave());

                if (CZ.Authoring.contentItemMode === "createContentItem") {
                    this.titleTextblock.text("Create New");
                    this.saveButton.text("create artifiact");

                    this.closeButton.hide();
                } else if (CZ.Authoring.contentItemMode === "editContentItem") {
                    this.titleTextblock.text("Edit");
                    this.saveButton.text("update artifact");

                    if (this.prevForm && this.prevForm instanceof FormEditExhibit)
                        this.closeButton.hide();
                    else
                        this.closeButton.show();
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }

                this.saveButton.show();
            }

            private onSave() {
                var newContentItem = {
                    title: this.titleInput.val() || "",
                    uri: this.mediaInput.val() || "",
                    mediaSource: this.mediaSourceInput.val() || "",
                    mediaType: this.mediaTypeInput.val() || "",
                    attribution: this.attributionInput.val() || "",
                    description: this.descriptionInput.val() || "",
                    order: this.contentItem.order
                };

                if (!CZ.Authoring.isNotEmpty(newContentItem.title)) {
                    this.titleInput.showError("Title can't be empty");
                }

                if (!CZ.Authoring.isNotEmpty(newContentItem.uri)) {
                    this.mediaInput.showError("URL can't be empty");
                }

                if (CZ.Authoring.validateContentItems([newContentItem], this.mediaInput)) {
                    if (CZ.Authoring.contentItemMode === "createContentItem") {
                        if (this.prevForm && this.prevForm instanceof FormEditExhibit) {
                            this.isCancel = false;
                            (<FormEditExhibit>this.prevForm).contentItemsListBox.add(newContentItem);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (<FormEditExhibit>this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
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
                            (<FormEditExhibit>this.prevForm).isModified = true;
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        } else {
                            this.saveButton.prop('disabled', true);
                            CZ.Authoring.updateContentItem(this.exhibit, this.contentItem, newContentItem).then(
                                response => {
                                    this.isCancel = false;
                                    this.isModified = false;
                                    this.close();
                                },
                                error => {
                                    var errorMessage = error.statusText;

                                    if (errorMessage.match(/Media Source/)) {
                                        this.errorMessage.text("One or more fields filled wrong");
                                        this.mediaSourceInput.showError("Media Source URL is not a valid URL");
                                    }
                                    else {
                                        this.errorMessage.text("Sorry, internal server error :(");
                                    }

                                    this.errorMessage.show().delay(7000).fadeOut();
                                }
                            ).always(() => {
                                this.saveButton.prop('disabled', false);
                            });
                        }
                    }
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            }

            public updateMediaInfo() {
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "");
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
                if (this.isModified) {
                    if (window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    }
                    else {
                        return;
                    }
                }

                super.close(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        this.mediaList.remove();
                        this.mediaInput.hideError();
                        this.titleInput.hideError();
                        this.mediaSourceInput.hideError();
                    }
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