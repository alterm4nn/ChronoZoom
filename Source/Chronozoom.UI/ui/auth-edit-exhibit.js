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
                this.contentItemsListBox = container.find(formInfo.contentItemsListBox);
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
                this.datePicker.setDate(this.exhibit.x);
                this.saveButton.click(function (event) {
                    var contentItems = _this.getContentItemsData();
                    var isValid = CZ.Authoring.ValidateExhibitData(_this.datePicker.getDate(), _this.titleInput.val(), contentItems);
                    if(!isValid) {
                        _this.container.find("#error-edit-exhibit").show();
                    }
                    if(isValid) {
                        var self = _this;
                        CZ.Authoring.updateExhibit(_this.exhibit, {
                            title: _this.titleInput.val(),
                            date: _this.datePicker.getDate(),
                            contentItems: contentItems
                        }).then(function (success) {
                            self.isCancel = false;
                            self.close();
                        }, function (error) {
                            alert("Unable to save changes. Please try again later.");
                            console.log(error);
                        });
                    }
                });
                this.deleteButton.click(function (event) {
                    if(confirm("Are you sure want to delete the exhibit and all of its contentitems? Delete can't be undone!")) {
                        CZ.Authoring.removeExhibit(_this.exhibit);
                        _this.close();
                    }
                });
            };
            FormEditExhibit.prototype.getContentItemsData = function () {
                var contentItems = [];
                $(".cz-authoring-ci-container").each(function () {
                    var CItitleInput = $(this).find(".cz-authoring-ci-title");
                    var mediaInput = $(this).find(".cz-authoring-ci-uri");
                    var mediaTypeInput = ($)(this).find(".cz-authoring-ci-media-type option");
                    var descriptionInput = $(this).find(".cz-authoring-ci-description");
                    var guid = $(this).attr("cz-authoring-ci-guid") || undefined;
                    var attributionInput = $(this).find(".cz-authoring-ci-attribution");
                    var mediaSourceInput = $(this).find(".cz-authoring-ci-media-source");
                    var selected = ($)(mediaTypeInput)[0];
                    for(var i = 0; i < mediaTypeInput.length; i++) {
                        if(mediaTypeInput[i].selected) {
                            selected = mediaTypeInput[i];
                            break;
                        }
                    }
                    contentItems.push({
                        title: CItitleInput.val(),
                        description: descriptionInput.val(),
                        uri: mediaInput.val(),
                        mediaType: selected.text,
                        attribution: attributionInput.val(),
                        mediaSource: mediaSourceInput.val(),
                        guid: guid,
                        parent: undefined
                    });
                });
                return contentItems;
            };
            FormEditExhibit.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activationSource.addClass("activeButton");
            };
            FormEditExhibit.prototype.close = function () {
                var _this = this;
                if(this.isCancel && CZ.Authoring.mode === "createExhibit") {
                    CZ.Authoring.removeExhibit(this.exhibit);
                }
                this.container.hide("slow", function (event) {
                    _this.datePicker.remove();
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("activeButton");
                this.container.find("#error-edit-exhibit").hide();
            };
            return FormEditExhibit;
        })(CZ.UI.FormBase);
        UI.FormEditExhibit = FormEditExhibit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
