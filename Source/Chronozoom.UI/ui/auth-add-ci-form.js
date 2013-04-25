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
                console.log("here");
                this.saveButton = container.find(formInfo.saveButton);
                this.titleInput = container.find(formInfo.titleInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.contentItem = formInfo.context;
                this.saveButton.off();
                this.initialize();
            }
            FormEditCI.prototype.initialize = function () {
                var _this = this;
                if((CZ.Authoring.mode === "editExhibit") || (CZ.Authoring.mode === "createExhibit")) {
                    this.titleTextblock.text("Create Artifact");
                    this.saveButton.text("create artifact");
                } else {
                    console.log("Unexpected authoring mode in CI form.");
                    this.close();
                }
                this.isCancel = true;
                this.titleInput.val(this.contentItem.title);
                this.descriptionInput.val(this.contentItem.description);
                this.attributionInput.val(this.contentItem.attribution);
                this.mediaSourceInput.val(this.contentItem.mediaSource);
                this.mediaInput.val(this.contentItem.mediaSource);
                this.saveButton.click(function (event) {
                    var selected = _this.mediaTypeInput[0];
                    for(var i = 1; i < _this.mediaTypeInput.length; i++) {
                        if(_this.mediaTypeInput[i].selected) {
                            selected = _this.mediaTypeInput[i];
                        }
                    }
                    CZ.Authoring.updateContentItem(_this.contentItem, {
                        title: _this.titleInput.val(),
                        uri: _this.mediaInput.val(),
                        mediaType: selected.text,
                        description: _this.descriptionInput.val(),
                        attribution: _this.attributionInput.val(),
                        mediaSource: _this.mediaSourceInput.val()
                    });
                    $(_this).dialog("close");
                });
            };
            FormAddCI.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activationSource.addClass("activeButton");
            };
            FormAddCI.prototype.close = function () {
                if(this.isCancel && CZ.Authoring.mode === "createTimeline") {
                    CZ.Authoring.removeTimeline(this.contentItem);
                }
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("activeButton");
                this.container.find("#error-edit-ci").hide();
            };
            return FormAddCI;
        })(CZ.UI.FormBase);
        UI.FormAddCI = FormAddCI;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
