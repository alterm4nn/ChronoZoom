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
                this.saveButton = container.find(formInfo.saveButton);
                this.prevForm = formInfo.prevForm;
                this.contentItem = formInfo.context.contentItem;
                this.exhibit = formInfo.context.exhibit;
                this.saveButton.off();
                this.initialize();
            }
            FormEditCI.prototype.initialize = function () {
                var _this = this;
                if(!this.exhibit || !this.contentItem) {
                    alert("Invalid binding. No contentItem to bind against.");
                    this.close();
                }
                if(CZ.Authoring.mode === "createExhibit" || CZ.Authoring.mode === "editExhibit" || CZ.Authoring.mode === "editContentItem") {
                    if(CZ.Authoring.contentItemMode == "createContentItem") {
                        this.titleTextblock.text("Create New");
                        this.saveButton.text("create artifiact");
                        this.closeButton.hide();
                    } else if(CZ.Authoring.contentItemMode == "editContentItem") {
                        this.titleTextblock.text("Edit");
                        this.saveButton.text("update artifact");
                        if(this.prevForm) {
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
                this.attributionInput.val(this.contentItem.attribution || "");
                this.descriptionInput.val(this.contentItem.description || "");
                this.saveButton.click(function (event) {
                    var newContentItem = {
                        title: _this.titleInput.val() || null,
                        uri: _this.mediaInput.val() || null,
                        mediaSource: _this.mediaSourceInput.val() || null,
                        mediaType: _this.mediaTypeInput.val() || null,
                        attribution: _this.attributionInput.val() || null,
                        description: _this.descriptionInput.val() || null
                    };
                    if(CZ.Authoring.ValidateContentItems([
                        newContentItem
                    ])) {
                        _this.isCancel = false;
                        _this.contentItem.title = newContentItem.title;
                        _this.contentItem.uri = newContentItem.uri;
                        _this.contentItem.mediaSource = newContentItem.mediaSource;
                        _this.contentItem.mediaType = newContentItem.mediaType;
                        _this.contentItem.attribution = newContentItem.attribution;
                        _this.contentItem.description = newContentItem.description;
                        if(_this.prevForm) {
                            if(CZ.Authoring.contentItemMode == "createContentItem") {
                                (_this.prevForm).contentItemsListBox.add(newContentItem);
                            } else if(CZ.Authoring.contentItemMode == "editContentItem") {
                                var listBoxItems = (_this.prevForm).contentItemsListBox.items;
                                for(var i = 0; i < listBoxItems.length; i++) {
                                    var item = listBoxItems[i];
                                    if(_this.contentItem.title === item.data.title && _this.contentItem.uri === item.data.uri) {
                                        $(item.container).find(".cz-contentitem-listitem-title").text(newContentItem.title);
                                        $(item.container).find(".cz-contentitem-listitem-descr").text(newContentItem.description);
                                        break;
                                    }
                                }
                            }
                        }
                        CZ.Authoring.renewExhibit(_this.exhibit);
                        _this.back();
                    } else {
                        _this.container.find("#error-edit-contentitem").show().delay(7000).fadeOut();
                    }
                });
            };
            FormEditCI.prototype.show = function (noAnimation) {
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditCI.prototype.close = function (noAnimation) {
                this.container.find("#error-edit-contentitem").hide();
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                if(this.isCancel && CZ.Authoring.contentItemMode == "createContentItem") {
                    this.exhibit.contentItems.pop();
                }
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            };
            FormEditCI.prototype.back = function () {
                this.close(true);
                if(this.prevForm) {
                    this.prevForm.show(true);
                }
            };
            return FormEditCI;
        })(CZ.UI.FormBase);
        UI.FormEditCI = FormEditCI;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
