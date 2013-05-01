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
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), (formInfo.context).contentItems);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.exhibit = formInfo.context;
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
                    var self = _this;
                    CZ.Authoring.updateExhibit(_this.exhibit, {
                        title: _this.titleInput.val(),
                        date: _this.datePicker.getDate(),
                        contentItems: _this.exhibit.contentItems
                    }).then(function (success) {
                        self.isCancel = false;
                        self.close();
                    }, function (error) {
                        alert("Unable to save changes. Please try again later.");
                        console.log(error);
                    });
                });
                this.deleteButton.click(function (event) {
                    if(confirm("Are you sure want to delete the exhibit and all of its contentitems? Delete can't be undone!")) {
                        CZ.Authoring.removeExhibit(_this.exhibit);
                        _this.close();
                    }
                });
                this.createArtifactButton.click(function (event) {
                    _this.close(true);
                    CZ.Authoring.CImode = "createCI";
                    CZ.Authoring.showEditContentItemForm(null, _this.exhibit, _this, true);
                });
            };
            FormEditExhibit.prototype.getContentItemsData = function () {
                var contentItems = [];
                return contentItems;
            };
            FormEditExhibit.prototype.show = function (noAnimation) {
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditExhibit.prototype.close = function (noAnimation) {
                var _this = this;
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.datePicker.remove();
                    }
                });
                if(this.isCancel && CZ.Authoring.mode === "createExhibit") {
                    CZ.Authoring.removeExhibit(this.exhibit);
                }
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
                this.container.find("#error-edit-exhibit").hide();
            };
            return FormEditExhibit;
        })(CZ.UI.FormBase);
        UI.FormEditExhibit = FormEditExhibit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
