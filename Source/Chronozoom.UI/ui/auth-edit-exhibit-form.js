var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditExhibit = (function (_super) {
            __extends(FormEditExhibit, _super);
            function FormEditExhibit(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, (formInfo.context).contentItems);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.contentItemsTemplate = formInfo.contentItemsTemplate;
                this.exhibit = formInfo.context;
                this.exhibitCopy = $.extend({
                }, formInfo.context, {
                    children: null
                });
                this.exhibitCopy = $.extend(true, {
                }, this.exhibitCopy);
                delete this.exhibitCopy.children;
                this.mode = CZ.Authoring.mode;
                this.isCancel = true;
                this.initUI();
            }
            FormEditExhibit.prototype.initUI = function () {
                var _this = this;
                if(this.mode === "createExhibit") {
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("create exhibit");
                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(this.exhibit.infodotDescription.date || "");
                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.hide();
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(function () {
                        return _this.onCreateArtifact();
                    });
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                    this.contentItemsListBox.itemDblClick(function (item, index) {
                        return _this.onContentItemDblClick(item, index);
                    });
                    this.contentItemsListBox.itemRemove(function (item, index) {
                        return _this.onContentItemRemoved(item, index);
                    });
                } else if(this.mode === "editExhibit") {
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("update exhibit");
                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(this.exhibit.infodotDescription.date || "");
                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.show();
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(function () {
                        return _this.onCreateArtifact();
                    });
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                    this.deleteButton.off();
                    this.deleteButton.click(function () {
                        return _this.onDelete();
                    });
                    this.contentItemsListBox.itemDblClick(function (item, index) {
                        return _this.onContentItemDblClick(item, index);
                    });
                    this.contentItemsListBox.itemRemove(function (item, index) {
                        return _this.onContentItemRemoved(item, index);
                    });
                } else {
                    console.log("Unexpected authoring mode in exhibit form.");
                }
            };
            FormEditExhibit.prototype.onCreateArtifact = function () {
                if(this.exhibit.contentItems.length < CZ.Settings.infodotMaxContentItemsCount) {
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = {
                        date: this.datePicker.getDate()
                    };
                    var newContentItem = {
                        title: "",
                        uri: "",
                        mediaSource: "",
                        mediaType: "",
                        attribution: "",
                        description: "",
                        index: this.exhibit.contentItems.length
                    };
                    this.exhibit.contentItems.push(newContentItem);
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "createContentItem";
                    CZ.Authoring.showEditContentItemForm(newContentItem, this.exhibit, this, true);
                }
            };
            FormEditExhibit.prototype.onSave = function () {
                var _this = this;
                var newExhibit = {
                    title: this.titleInput.val() || "",
                    x: this.datePicker.getDate() - this.exhibit.width / 2,
                    y: this.exhibit.y,
                    height: this.exhibit.height,
                    width: this.exhibit.width,
                    infodotDescription: {
                        date: this.datePicker.getDate()
                    },
                    contentItems: this.exhibit.contentItems || [],
                    type: "infodot"
                };
                if(CZ.Authoring.validateExhibitData(this.datePicker.getDate(), this.titleInput.val(), this.exhibit.contentItems) && CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true) && this.exhibit.contentItems.length >= 1 && this.exhibit.contentItems.length <= CZ.Settings.infodotMaxContentItemsCount) {
                    CZ.Authoring.updateExhibit(this.exhibitCopy, newExhibit).then(function (success) {
                        _this.isCancel = false;
                        _this.close();
                    }, function (error) {
                        alert("Unable to save changes. Please try again later.");
                    });
                } else {
                    this.errorMessage.show().delay(7000).fadeOut();
                }
            };
            FormEditExhibit.prototype.onDelete = function () {
                if(confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                    CZ.Authoring.removeExhibit(this.exhibit);
                    this.isCancel = false;
                    this.close();
                }
            };
            FormEditExhibit.prototype.onContentItemDblClick = function (item, _) {
                if(item.data.index >= 0) {
                    this.clickedListItem = item;
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = {
                        date: this.datePicker.getDate()
                    };
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "editContentItem";
                    CZ.Authoring.showEditContentItemForm(this.exhibit.contentItems[item.data.index], this.exhibit, this, true);
                }
            };
            FormEditExhibit.prototype.onContentItemRemoved = function (item, _) {
                if(item.data.index >= 0) {
                    this.exhibit.contentItems.splice(item.data.index, 1);
                    this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            };
            FormEditExhibit.prototype.show = function (noAnimation) {
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
            FormEditExhibit.prototype.hide = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            FormEditExhibit.prototype.close = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                var _this = this;
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.datePicker.remove();
                        _this.contentItemsListBox.clear();
                    }
                });
                if(this.isCancel) {
                    if(this.mode === "createExhibit") {
                        CZ.VCContent.removeChild(this.exhibit.parent, this.exhibit.id);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    } else if(this.mode === "editExhibit") {
                        delete this.exhibit.contentItems;
                        $.extend(this.exhibit, this.exhibitCopy);
                        this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            };
            return FormEditExhibit;
        })(UI.FormUpdateEntity);
        UI.FormEditExhibit = FormEditExhibit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
