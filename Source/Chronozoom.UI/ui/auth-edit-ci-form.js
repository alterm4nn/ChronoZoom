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
                this.saveButton = container.find(formInfo.saveButton);
                this.titleInput = container.find(formInfo.titleInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
                this.contentItem = formInfo.context.contentItem;
                this.exhibit = formInfo.context.exhibit;
                this.saveButton.off();
                this.initialize();
            }
            FormEditCI.prototype.initialize = function () {
                var _this = this;
                if((CZ.Authoring.mode === "editExhibit") || (CZ.Authoring.mode === "createExhibit")) {
                    this.titleTextblock.text("Edit Artifact");
                    this.saveButton.text("edit artifact");
                } else {
                    console.log("Unexpected authoring mode in CI form.");
                    this.close();
                }
                this.isCancel = true;
                if(CZ.Authoring.CImode == "editCI") {
                    var c = this.contentItem;
                    this.titleInput.val(c.contentItem.title);
                    this.descriptionInput.val(c.contentItem.description);
                    this.attributionInput.val(c.attribution);
                    this.mediaSourceInput.val(c.contentItem.mediaSource);
                    this.mediaInput.val(c.contentItem.uri);
                    var mediaType = c.contentItem.mediaType;
                    if(mediaType === "Picture") {
                        mediaType = "image";
                    }
                    var med_opt = ($)(this.mediaTypeInput[0]).find(".option");
                    var selected = med_opt.context[0].selected;
                    for(var i = 0; i < med_opt.context.length; i++) {
                        if(med_opt.context[i].text === mediaType) {
                            med_opt.context[i].selected = true;
                        }
                    }
                }
                this.saveButton.click(function (event) {
                    var med_opt = ($)(_this.mediaTypeInput[0]).find(".option");
                    var selected = med_opt.context[0].selected;
                    for(var i = 0; i < med_opt.context.length; i++) {
                        if(med_opt.context[i].selected) {
                            selected = med_opt.context[i];
                            break;
                        }
                    }
                    if(CZ.Authoring.CImode == "editCI") {
                        CZ.Authoring.updateContentItem(_this.contentItem, {
                            title: _this.titleInput.val(),
                            uri: _this.mediaInput.val(),
                            mediaType: selected.text,
                            description: _this.descriptionInput.val(),
                            attribution: _this.attributionInput.val(),
                            mediaSource: _this.mediaSourceInput.val()
                        });
                    }
                    if(CZ.Authoring.CImode == "createCI") {
                        _this.exhibit.contentItems.push({
                            title: _this.titleInput.val(),
                            uri: _this.mediaInput.val(),
                            mediaType: selected.text,
                            description: _this.descriptionInput.val(),
                            attribution: _this.attributionInput.val(),
                            mediaSource: _this.mediaSourceInput.val(),
                            guid: undefined,
                            parent: undefined
                        });
                        _this.close();
                    }
                    _this.close();
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
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
                this.container.find("#error-edit-CI").hide();
            };
            FormEditCI.prototype.back = function () {
                this.close(true);
                this.prevForm.show(true);
            };
            return FormEditCI;
        })(CZ.UI.FormBase);
        UI.FormEditCI = FormEditCI;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
