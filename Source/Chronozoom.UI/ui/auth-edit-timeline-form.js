/// <reference path='../ui/controls/formbase.ts'/>
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
        var FormEditTimeline = (function (_super) {
            __extends(FormEditTimeline, _super);
            // We only need to add additional initialization in constructor.
            function FormEditTimeline(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);

                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.startDate = new CZ.UI.DatePicker(container.find(formInfo.startDate));
                this.endDate = new CZ.UI.DatePicker(container.find(formInfo.endDate));
                this.mediaListContainer = container.find(formInfo.mediaListContainer);
                this.backgroundUrl = container.find(formInfo.backgroundUrl);
                this.titleInput = container.find(formInfo.titleInput);
                this.errorMessage = container.find(formInfo.errorMessage);

                this.timeline = formInfo.context;

                this.saveButton.off();
                this.deleteButton.off();

                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });

                this.initialize();
            }
            FormEditTimeline.prototype.initialize = function () {
                var _this = this;

                this.mediaInput = {};
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.mediaInput, this);
                this.mediaList.container.find("[title='skydrive']").hide(); // Background Images doesn't support iframes.

                this.saveButton.prop('disabled', false);
                if (CZ.Authoring.mode === "createTimeline") {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Timeline");
                    this.saveButton.text("Create Timeline");
                } else if (CZ.Authoring.mode === "editTimeline") {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Timeline");
                    this.saveButton.text("Update Timeline");
                } else if (CZ.Authoring.mode === "createRootTimeline") {
                    this.deleteButton.hide();
                    this.closeButton.hide();
                    this.titleTextblock.text("Create Root Timeline");
                    this.saveButton.text("Create Timeline");
                } else {
                    console.log("Unexpected authoring mode in timeline form.");
                    this.close();
                }

                this.isCancel = true;
                this.endDate.addEditMode_Infinite();

                this.titleInput.val(this.timeline.title);
                this.startDate.setDate(this.timeline.x, true);
                this.backgroundUrl.val(this.timeline.backgroundUrl || "");

                if (this.timeline.endDate === 9999) {
                    this.endDate.setDate(this.timeline.endDate, true);
                } else {
                    this.endDate.setDate(this.timeline.x + this.timeline.width, true);
                }

                $(_this.startDate.circaSelector).find('input').prop('checked', this.timeline.FromIsCirca);
                $(_this.endDate.circaSelector  ).find('input').prop('checked', this.timeline.ToIsCirca);

                this.saveButton.click(function () {
                    _this.errorMessage.empty();
                    var isDataValid = false;
                    var backgroundImage;
                    var backgroundUrl = _this.backgroundUrl.val().trim();
                    isDataValid = CZ.Authoring.validateTimelineData(_this.startDate.getDate(), _this.endDate.getDate(), _this.titleInput.val());

                    // Other cases are covered by datepicker
                    if (!CZ.Authoring.isNotEmpty(_this.titleInput.val())) {
                        _this.titleInput.showError("Title cannot be empty");
                    }

                    if (!CZ.Authoring.isIntervalPositive(_this.startDate.getDate(), _this.endDate.getDate())) {
                        _this.errorMessage.text('Time interval cannot be less than one day');
                    }

                    function onDataValid () {
                        _this.errorMessage.empty();
                        var self = _this;
                        var aspectRatio = backgroundImage ? backgroundImage.width / backgroundImage.height : null;
                        var isAspectRatioChanged = aspectRatio !== _this.timeline.aspectRatio;

                        _this.timeline.FromIsCirca  = $(_this.startDate.circaSelector).find('input').is(':checked');
                        _this.timeline.ToIsCirca    = $(_this.endDate.circaSelector  ).find('input').is(':checked');

                        _this.saveButton.prop('disabled', true);
                        CZ.Authoring.updateTimeline(_this.timeline, {
                            title: _this.titleInput.val(),
                            start: _this.startDate.getDate(),
                            end: _this.endDate.getDate(),
                            backgroundUrl: backgroundUrl,
                            aspectRatio: aspectRatio
                        }).then(function () {
                            self.isCancel = false;
                            self.close();

                            // If aspect ratio has changed, then we need to redraw layout.
                            if (isAspectRatioChanged) {
                                CZ.VCContent.clear(CZ.Common.vc.virtualCanvas("getLayerContent"));
                                CZ.Common.reloadData().done(function () {
                                    self.timeline = CZ.Common.vc.virtualCanvas("findElement", self.timeline.id);
                                    self.timeline.animation = null;

                                    //Move to new created timeline
                                    self.timeline.onmouseclick();
                                });
                            }

                            //Move to new created timeline
                            self.timeline.onmouseclick();
                        }, function (error) {
                            if (error !== undefined && error !== null) {
                                self.errorMessage.text(error).show().delay(7000).fadeOut();
                            } else {
                                self.errorMessage.text("Sorry, internal server error :(").show().delay(7000).fadeOut();
                            }
                            console.log(error);
                        }).always(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    }

                    function onDataInvalid () {
                        var self = _this;
                        self.errorMessage.empty();
                        self.errorMessage.text("Please, set a correct URL for background image.").show().delay(7000).fadeOut();
                        self.backgroundUrl.val("");
                    }

                    if (!isDataValid) {
                        return;
                    } else if (backgroundUrl !== "") {
                        backgroundImage = new Image();
                        backgroundImage.addEventListener("load", onDataValid, false);
                        backgroundImage.addEventListener("error", onDataInvalid, false);
                        backgroundImage.src = backgroundUrl;
                    } else {
                        onDataValid();
                    }
                });

                this.deleteButton.click(function (event) {
                    if (confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                        var isDataValid = true;
                        CZ.Authoring.removeTimeline(_this.timeline);
                        _this.close();
                    }
                });
            };

            FormEditTimeline.prototype.updateMediaInfo = function () {
                this.backgroundUrl.val(this.mediaInput.uri || "");
            };

            FormEditTimeline.prototype.show = function () {
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
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

                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.endDate.remove();
                        _this.startDate.remove();
                        _this.titleInput.hideError();
                        _this.mediaList.remove();
                    }
                });

                if (this.isCancel && CZ.Authoring.mode === "createTimeline") {
                    CZ.VCContent.removeChild(this.timeline.parent, this.timeline.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("active");

                CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
            };
            return FormEditTimeline;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditTimeline = FormEditTimeline;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
