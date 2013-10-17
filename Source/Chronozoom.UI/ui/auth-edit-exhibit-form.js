/// <reference path='contentitem-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts' />
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
                var _this = this;
                _super.call(this, container, formInfo);

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, (formInfo.context).contentItems);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);

                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });

                this.contentItemsTemplate = formInfo.contentItemsTemplate;

                this.exhibit = formInfo.context;
                this.exhibitCopy = $.extend({}, formInfo.context, { children: null });
                this.exhibitCopy = $.extend(true, {}, this.exhibitCopy);
                delete this.exhibitCopy.children;

                this.mode = CZ.Authoring.mode;
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }
            FormEditExhibit.prototype.initUI = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);

                this.titleInput.change(function () {
                    _this.isModified = true;
                });
                this.datePicker.datePicker.change(function () {
                    _this.isModified = true;
                });

                if (this.mode === "createExhibit") {
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("create exhibit");

                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);
                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.hide();

                    // this.closeButton.click() is handled by base
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
                    this.contentItemsListBox.itemMove(function (item, indexStart, indexStop) {
                        return _this.onContentItemMove(item, indexStart, indexStop);
                    });
                } else if (this.mode === "editExhibit") {
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("update exhibit");

                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);

                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.show();

                    // this.closeButton.click() is handled by base
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
                    this.contentItemsListBox.itemMove(function (item, indexStart, indexStop) {
                        return _this.onContentItemMove(item, indexStart, indexStop);
                    });
                } else {
                    console.log("Unexpected authoring mode in exhibit form.");
                }
            };

            FormEditExhibit.prototype.onCreateArtifact = function () {
                this.isModified = true;
                if (this.exhibit.contentItems.length < CZ.Settings.infodotMaxContentItemsCount) {
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = { date: this.datePicker.getDate() };
                    var newContentItem = {
                        title: "",
                        uri: "",
                        mediaSource: "",
                        mediaType: "",
                        attribution: "",
                        description: "",
                        order: this.exhibit.contentItems.length
                    };
                    this.exhibit.contentItems.push(newContentItem);
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "createContentItem";
                    CZ.Authoring.showEditContentItemForm(newContentItem, this.exhibit, this, true);
                } else {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage.text("Sorry, only 10 artifacts are allowed in one exhibit").show().delay(7000).fadeOut(function () {
                        return self.errorMessage.text(origMsg);
                    });
                }
            };

            FormEditExhibit.prototype.onSave = function () {
                var _this = this;
                var exhibit_x = this.datePicker.getDate() - this.exhibit.width / 2;
                var exhibit_y = this.exhibit.y;

                if (exhibit_x + this.exhibit.width >= this.exhibit.parent.x + this.exhibit.parent.width) {
                    exhibit_x = this.exhibit.parent.x + this.exhibit.parent.width - this.exhibit.width;
                }
                if (exhibit_x <= this.exhibit.parent.x) {
                    exhibit_x = this.exhibit.parent.x;
                }

                if (exhibit_y + this.exhibit.height >= this.exhibit.parent.y + this.exhibit.parent.height) {
                    exhibit_y = this.exhibit.parent.y + this.exhibit.parent.height - this.exhibit.height;
                }
                if (exhibit_y <= this.exhibit.parent.y) {
                    exhibit_y = this.exhibit.parent.y;
                }

                var newExhibit = {
                    title: this.titleInput.val() || "",
                    x: exhibit_x,
                    y: exhibit_y,
                    height: this.exhibit.height,
                    width: this.exhibit.width,
                    infodotDescription: { date: CZ.Dates.getDecimalYearFromCoordinate(this.datePicker.getDate()) },
                    contentItems: this.exhibit.contentItems || [],
                    type: "infodot"
                };

                if (!CZ.Authoring.isNotEmpty(this.titleInput.val())) {
                    this.titleInput.showError("Title can't be empty");
                }

                if (CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true)) {
                    this.errorMessage.text("Exhibit intersects other elemenets");
                }

                if (CZ.Authoring.validateExhibitData(this.datePicker.getDate(), this.titleInput.val(), this.exhibit.contentItems) && CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true) && this.exhibit.contentItems.length >= 1 && this.exhibit.contentItems.length <= CZ.Settings.infodotMaxContentItemsCount) {
                    this.saveButton.prop('disabled', true);
                    CZ.Authoring.updateExhibit(this.exhibitCopy, newExhibit).then(function (success) {
                        _this.isCancel = false;
                        _this.isModified = false;
                        _this.close();

                        _this.exhibit.id = arguments[0].id;

                        _this.exhibit.onmouseclick();
                    }, function (error) {
                        var errorMessage = JSON.parse(error.responseText).errorMessage;

                        if (errorMessage !== "") {
                            _this.errorMessage.text(errorMessage);
                        } else {
                            _this.errorMessage.text("Sorry, internal server error :(");
                        }

                        _this.errorMessage.show().delay(7000).fadeOut();
                    }).always(function () {
                        _this.saveButton.prop('disabled', false);
                    });
                } else if (this.exhibit.contentItems.length === 0) {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage.text("Cannot create exhibit without artifacts.").show().delay(7000).fadeOut(function () {
                        return self.errorMessage.text(origMsg);
                    });
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            };

            FormEditExhibit.prototype.onDelete = function () {
                if (confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                    CZ.Authoring.removeExhibit(this.exhibit);
                    this.isCancel = false;
                    this.isModified = false;
                    this.close();
                }
            };

            FormEditExhibit.prototype.onContentItemDblClick = function (item, _) {
                var idx;
                if (typeof item.data.order !== 'undefined' && item.data.order !== null && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if (typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) {
                        return ci.guid;
                    }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }

                if (idx >= 0) {
                    this.clickedListItem = item;
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = { date: this.datePicker.getDate() };
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "editContentItem";
                    CZ.Authoring.showEditContentItemForm(this.exhibit.contentItems[idx], this.exhibit, this, true);
                }
            };

            FormEditExhibit.prototype.onContentItemRemoved = function (item, _) {
                var idx;
                this.isModified = true;
                if (typeof item.data.order !== 'undefined' && item.data.order !== null && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if (typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) {
                        return ci.guid;
                    }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }

                if (idx >= 0) {
                    this.exhibit.contentItems.splice(idx, 1);
                    for (var i = 0; i < this.exhibit.contentItems.length; i++)
                        this.exhibit.contentItems[i].order = i;
                    this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            };

            FormEditExhibit.prototype.onContentItemMove = function (item, indexStart, indexStop) {
                this.isModified = true;
                var ci = this.exhibit.contentItems.splice(indexStart, 1)[0];
                this.exhibit.contentItems.splice(indexStop, 0, ci);
                for (var i = 0; i < this.exhibit.contentItems.length; i++)
                    this.exhibit.contentItems[i].order = i;
                this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                CZ.Common.vc.virtualCanvas("requestInvalidate");
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
                if (this.isModified) {
                    if (window.confirm("There is unsaved data. Do you want to close without saving?")) {
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
                        _this.datePicker.remove();
                        _this.contentItemsListBox.clear();
                        _this.titleInput.hideError();
                    }
                });
                if (this.isCancel) {
                    if (this.mode === "createExhibit") {
                        CZ.VCContent.removeChild(this.exhibit.parent, this.exhibit.id);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    } else if (this.mode === "editExhibit") {
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
