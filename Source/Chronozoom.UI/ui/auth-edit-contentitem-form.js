var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditCI = (function (_super) {
            __extends(FormEditCI, _super);
            function FormEditCI(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
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
                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });
                this.mediaInput.focus(function () {
                    _this.mediaInput.hideError();
                });
                this.mediaSourceInput.focus(function () {
                    _this.mediaSourceInput.hideError();
                });
                this.prevForm = formInfo.prevForm;
                this.exhibit = formInfo.context.exhibit;
                this.contentItem = formInfo.context.contentItem;
                this.mode = CZ.Authoring.mode;
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }
            FormEditCI.prototype.initUI = function () {
                var _this = this;
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem);
                var that = this;
                this.saveButton.prop('disabled', false);
                this.titleInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaSourceInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaTypeInput.change(function () {
                    _this.isModified = true;
                });
                this.attributionInput.change(function () {
                    _this.isModified = true;
                });
                this.descriptionInput.change(function () {
                    _this.isModified = true;
                });
                this.descriptionInput.on('keyup', function (e) {
                    if(e.which == 13) {
                        that.saveButton.click(function () {
                            return that.onSave();
                        });
                    }
                });
                this.descriptionInput.on('keydown', function (e) {
                    if(e.which == 13) {
                        that.saveButton.off();
                    }
                });
                if(CZ.Media.SkyDriveMediaPicker.isEnabled && this.mediaTypeInput.find("option[value='skydrive-image']").length === 0) {
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
                this.attributionInput.val(this.contentItem.attribution || "");
                this.descriptionInput.val(this.contentItem.description || "");
                this.saveButton.off();
                this.saveButton.click(function () {
                    return _this.onSave();
                });
                if(CZ.Authoring.contentItemMode === "createContentItem") {
                    this.titleTextblock.text("Create New");
                    this.saveButton.text("create artifiact");
                    this.closeButton.hide();
                } else if(CZ.Authoring.contentItemMode === "editContentItem") {
                    this.titleTextblock.text("Edit");
                    this.saveButton.text("update artifact");
                    if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                        this.closeButton.hide();
                    } else {
                        this.closeButton.show();
                    }
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }
                this.saveButton.show();
            };
            FormEditCI.prototype.onSave = function () {
                var _this = this;
                var newContentItem = {
                    title: this.titleInput.val() || "",
                    uri: this.mediaInput.val() || "",
                    mediaSource: this.mediaSourceInput.val() || "",
                    mediaType: this.mediaTypeInput.val() || "",
                    attribution: this.attributionInput.val() || "",
                    description: this.descriptionInput.val() || "",
                    order: this.contentItem.order
                };
                if(!CZ.Authoring.isNotEmpty(newContentItem.title)) {
                    this.titleInput.showError("Title can't be empty");
                }
                if(!CZ.Authoring.isNotEmpty(newContentItem.uri)) {
                    this.mediaInput.showError("URL can't be empty");
                }
                if(CZ.Authoring.validateContentItems([
                    newContentItem
                ], this.mediaInput)) {
                    if(CZ.Authoring.contentItemMode === "createContentItem") {
                        if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            (this.prevForm).contentItemsListBox.add(newContentItem);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        }
                    } else if(CZ.Authoring.contentItemMode === "editContentItem") {
                        if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            var clickedListItem = (this.prevForm).clickedListItem;
                            clickedListItem.iconImg.attr("src", newContentItem.uri);
                            clickedListItem.titleTextblock.text(newContentItem.title);
                            clickedListItem.descrTextblock.text(newContentItem.description);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            (this.prevForm).isModified = true;
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        } else {
                            this.saveButton.prop('disabled', true);
                            CZ.Authoring.updateContentItem(this.exhibit, this.contentItem, newContentItem).then(function (response) {
                                _this.isCancel = false;
                                _this.isModified = false;
                                _this.close();
                            }, function (error) {
                                var errorMessage = error.statusText;
                                if(errorMessage.match(/Media Source/)) {
                                    _this.errorMessage.text("One or more fields filled wrong");
                                    _this.mediaSourceInput.showError("Media Source URL is not a valid URL");
                                } else {
                                    _this.errorMessage.text("Sorry, internal server error :(");
                                }
                                _this.errorMessage.show().delay(7000).fadeOut();
                            }).always(function () {
                                _this.saveButton.prop('disabled', false);
                            });
                        }
                    }
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            };
            FormEditCI.prototype.updateMediaInfo = function () {
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "");
            };
            FormEditCI.prototype.show = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            };
            FormEditCI.prototype.close = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                var _this = this;
                if(this.isModified) {
                    if(window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    } else {
                        return;
                    }
                }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.mediaList.remove();
                        _this.mediaInput.hideError();
                        _this.titleInput.hideError();
                        _this.mediaSourceInput.hideError();
                    }
                });
                if(this.isCancel) {
                    if(CZ.Authoring.contentItemMode === "createContentItem") {
                        this.exhibit.contentItems.pop();
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            };
            return FormEditCI;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCI = FormEditCI;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
