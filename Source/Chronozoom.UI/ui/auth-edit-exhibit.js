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
                this.container = container;
                this.formInfo = formInfo;
                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, (formInfo.context).contentItems);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.contentItemsTemplate = formInfo.contentItemsTemplate;
                this.oldContentItems = $.map((formInfo.context).contentItems, function (obj) {
                    return $.extend(true, {
                    }, obj);
                });
                this.exhibit = formInfo.context;
                this.createArtifactButton.off();
                this.saveButton.off();
                this.deleteButton.off();
                this.initialize();
            }
            FormEditExhibit.prototype.initialize = function () {
                var _this = this;
                if(CZ.Authoring.mode === "createExhibit") {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("create exhibit");
                } else if(CZ.Authoring.mode === "editExhibit") {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("update exhibit");
                } else {
                    console.log("Unexpected authoring mode in exhibit form.");
                    this.close();
                }
                this.isCancel = true;
                this.titleInput.val(this.exhibit.title);
                this.datePicker.setDate(this.exhibit.infodotDescription.date);
                this.saveButton.click(function (event) {
                    if(CZ.Authoring.ValidateExhibitData(_this.datePicker.getDate(), _this.titleInput.val(), _this.exhibit.contentItems) && _this.exhibit.contentItems.length >= 1 && _this.exhibit.contentItems.length <= 10) {
                        var newContentItems = _this.exhibit.contentItems;
                        _this.exhibit.contentItems = _this.oldContentItems;
                        CZ.Authoring.updateExhibit(_this.exhibit, {
                            title: _this.titleInput.val(),
                            date: _this.datePicker.getDate(),
                            contentItems: newContentItems
                        }).then(function (success) {
                            _this.isCancel = false;
                            _this.close();
                        }, function (error) {
                            _this.exhibit.contentItems = newContentItems;
                            alert("Unable to save changes. Please try again later.");
                            console.log(error);
                        });
                    } else {
                        _this.container.find("#error-edit-exhibit").show().delay(7000).fadeOut();
                    }
                });
                this.deleteButton.click(function (event) {
                    if(confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                        CZ.Authoring.removeExhibit(_this.exhibit);
                        _this.isCancel = false;
                        _this.close();
                    }
                });
                this.createArtifactButton.click(function (event) {
                    if(_this.exhibit.contentItems.length < 10) {
                        _this.close(true, false);
                        var newContentItem = {
                            title: "",
                            uri: "",
                            mediaSource: "",
                            mediaType: "",
                            attribution: "",
                            description: ""
                        };
                        _this.exhibit.contentItems.push(newContentItem);
                        CZ.Authoring.CImode = "createCI";
                        CZ.Authoring.showEditContentItemForm(newContentItem, _this.exhibit, _this, true);
                    }
                });
                this.contentItemsListBox.onListItemClicked = function (item, idx) {
                    for(var i = 0; i < _this.exhibit.contentItems.length; i++) {
                        if(_this.exhibit.contentItems[i].title === item.data.title && _this.exhibit.contentItems[i].uri === item.data.uri) {
                            _this.close(true, false);
                            CZ.Authoring.CImode = "editCI";
                            CZ.Authoring.showEditContentItemForm(_this.exhibit.contentItems[i], _this.exhibit, _this, true);
                            break;
                        }
                    }
                };
                this.contentItemsListBox.onListItemRemoved = function (item, idx) {
                    for(var i = 0; i < _this.exhibit.contentItems.length; i++) {
                        if(_this.exhibit.contentItems[i].title === item.data.title && _this.exhibit.contentItems[i].uri === item.data.uri) {
                            _this.exhibit.contentItems.splice(i, 1);
                            break;
                        }
                    }
                };
            };
            FormEditExhibit.prototype.show = function (noAnimation) {
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
                this.isCancel = true;
            };
            FormEditExhibit.prototype.close = function (noAnimation, destroy) {
                if (typeof destroy === "undefined") { destroy = true; }
                var _this = this;
                this.container.find("#error-edit-exhibit").hide();
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        if(destroy) {
                            _this.datePicker.remove();
                            _this.contentItemsListBox.clear();
                        }
                    }
                });
                if(this.isCancel && destroy && CZ.Authoring.mode === "createExhibit") {
                    CZ.Authoring.removeExhibit(this.exhibit);
                }
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            };
            return FormEditExhibit;
        })(CZ.UI.FormBase);
        UI.FormEditExhibit = FormEditExhibit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
