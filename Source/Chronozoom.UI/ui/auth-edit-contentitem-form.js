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
                this.prevForm = formInfo.prevForm;
                this.exhibit = formInfo.context.exhibit;
                this.contentItem = formInfo.context.contentItem;
                this.mode = CZ.Authoring.mode;
                this.isCancel = true;
                this.initUI();
            }
            FormEditCI.prototype.initUI = function () {
                var _this = this;
                if(CZ.Authoring.contentItemMode === "createContentItem") {
                    this.titleTextblock.text("Create New");
                    this.saveButton.text("create artifiact");
                    this.titleInput.val(this.contentItem.title || "");
                    this.mediaInput.val(this.contentItem.uri || "");
                    this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                    this.mediaTypeInput.val(this.contentItem.mediaType || "");
                    this.attributionInput.val(this.contentItem.attribution || "");
                    this.descriptionInput.val(this.contentItem.description || "");
                    this.closeButton.hide();
                    this.saveButton.show();
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                } else if(CZ.Authoring.contentItemMode === "editContentItem") {
                    this.titleTextblock.text("Edit");
                    this.saveButton.text("update artifact");
                    this.titleInput.val(this.contentItem.title || "");
                    this.mediaInput.val(this.contentItem.uri || "");
                    this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                    this.mediaTypeInput.val(this.contentItem.mediaType || "");
                    this.attributionInput.val(this.contentItem.attribution || "");
                    this.descriptionInput.val(this.contentItem.description || "");
                    this.closeButton.show();
                    this.saveButton.show();
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }
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
                    index: this.contentItem.index
                };
                if(CZ.Authoring.validateContentItems([
                    newContentItem
                ])) {
                    if(CZ.Authoring.contentItemMode === "createContentItem") {
                        if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            (this.prevForm).contentItemsListBox.add(newContentItem);
                            $.extend(this.exhibit.contentItems[this.contentItem.index], newContentItem);
                            (this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.back();
                        }
                    } else if(CZ.Authoring.contentItemMode === "editContentItem") {
                        if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            var clickedListItem = (this.prevForm).clickedListItem;
                            clickedListItem.titleTextblock.text(newContentItem.title);
                            clickedListItem.descrTextblock.text(newContentItem.description);
                            $.extend(this.exhibit.contentItems[this.contentItem.index], newContentItem);
                            (this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.back();
                        } else {
                            CZ.Authoring.updateContentItem(this.exhibit, this.contentItem, newContentItem).then(function (response) {
                                _this.isCancel = false;
                                _this.close();
                            }, function (error) {
                                alert("Unable to save changes. Please try again later.");
                            });
                        }
                    }
                } else {
                    this.errorMessage.show().delay(7000).fadeOut();
                }
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
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
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
