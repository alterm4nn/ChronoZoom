var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditTimeline = (function (_super) {
            __extends(FormEditTimeline, _super);
            function FormEditTimeline(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.startDate = new CZ.UI.DatePicker(container.find(formInfo.startDate));
                this.endDate = new CZ.UI.DatePicker(container.find(formInfo.endDate));
                this.titleInput = container.find(formInfo.titleInput);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.timeline = formInfo.context;
                this.saveButton.off();
                this.deleteButton.off();
                this.initialize();
            }
            FormEditTimeline.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);
                if(CZ.Authoring.mode === "createTimeline") {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Timeline");
                    this.saveButton.text("create timeline");
                } else if(CZ.Authoring.mode === "editTimeline") {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Timeline");
                    this.saveButton.text("update timeline");
                } else {
                    console.log("Unexpected authoring mode in timeline form.");
                    this.close();
                }
                this.isCancel = true;
                this.endDate.addEditMode_Infinite();
                this.titleInput.val(this.timeline.title);
                this.startDate.setDate(this.timeline.x, true);
                if(this.timeline.endDate === 9999) {
                    this.endDate.setDate(this.timeline.endDate, true);
                } else {
                    this.endDate.setDate(this.timeline.x + this.timeline.width, true);
                }
                this.saveButton.click(function (event) {
                    _this.startDate.setDate("d");
                    var result = _this.startDate.getDate();
                    _this.errorMessage.empty();
                    var isDataValid = false;
                    isDataValid = CZ.Authoring.validateTimelineData(_this.startDate.getDate(), _this.endDate.getDate(), _this.titleInput.val());
                    if(!CZ.Authoring.isNotEmpty(_this.titleInput.val())) {
                        _this.errorMessage.text('Title is empty');
                    } else if(!CZ.Authoring.isIntervalPositive(_this.startDate.getDate(), _this.endDate.getDate())) {
                        _this.errorMessage.text('Time interval should no less than one day');
                    }
                    if(!isDataValid) {
                        return;
                    } else {
                        _this.errorMessage.empty();
                        var self = _this;
                        _this.saveButton.prop('disabled', true);
                        CZ.Authoring.updateTimeline(_this.timeline, {
                            title: _this.titleInput.val(),
                            start: _this.startDate.getDate(),
                            end: _this.endDate.getDate()
                        }).then(function (success) {
                            self.isCancel = false;
                            self.close();
                            self.timeline.onmouseclick();
                        }, function (error) {
                            if(error !== undefined && error !== null) {
                                self.errorMessage.text(error);
                            } else {
                                alert("Unable to save changes. Please try again later.");
                            }
                            console.log(error);
                        }).always(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    }
                });
                this.deleteButton.click(function (event) {
                    if(confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                        CZ.Authoring.removeTimeline(_this.timeline);
                        _this.close();
                    }
                });
            };
            FormEditTimeline.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditTimeline.prototype.close = function () {
                var _this = this;
                this.errorMessage.empty();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.endDate.remove();
                        _this.startDate.remove();
                    }
                });
                if(this.isCancel && CZ.Authoring.mode === "createTimeline") {
                    CZ.VCContent.removeChild(this.timeline.parent, this.timeline.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            };
            return FormEditTimeline;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditTimeline = FormEditTimeline;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
