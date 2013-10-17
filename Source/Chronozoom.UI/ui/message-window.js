/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var MessageWindow = (function (_super) {
            __extends(MessageWindow, _super);
            function MessageWindow(container, message, title) {
                _super.call(this, container, {
                    activationSource: null,
                    prevForm: null,
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });

                this.tourTitleInput = this.container.find(".cz-form-label");
                this.titleTextblock.text(title || "ChronoZoom");
                this.tourTitleInput.text(message);
                this.setHeight();
            }
            MessageWindow.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: function () {
                        $(document).on("keyup", _this, _this.onDocumentKeyPress);
                    }
                });
            };

            MessageWindow.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: function () {
                        $(document).off("keyup", _this.onDocumentKeyPress);
                    }
                });
            };

            MessageWindow.prototype.onDocumentKeyPress = function (e) {
                var self = e.data;
                if (e.which == 27 && self.isFormVisible) {
                    self.closeButton.click();
                }
            };

            MessageWindow.prototype.setHeight = function () {
                this.container.show();
                var messageHeight = this.tourTitleInput.outerHeight(true);
                this.contentContainer.height(messageHeight);
                this.container.hide();
            };
            return MessageWindow;
        })(CZ.UI.FormBase);
        UI.MessageWindow = MessageWindow;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
