var __extends = this.__extends || function (d, b) {
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
            titleTextblock: ".cz-form-title"
        });
                var tourTitleInput = this.container.find(".cz-form-label");
                tourTitleInput.text(message);
                this.titleTextblock.text(title || "ChronoZoom");
            }
            MessageWindow.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                $(document).bind("keypress", this, this.onDocumentKeyPress);
            };
            MessageWindow.prototype.close = function () {
                $(document).unbind("keypress", this.onDocumentKeyPress);
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 100,
                    complete: function () {
                    }
                });
            };
            MessageWindow.prototype.onDocumentKeyPress = function (e) {
                var self = e.data;
                if(e.which == 27 && self.isFormVisible) {
                    self.close();
                }
            };
            return MessageWindow;
        })(CZ.UI.FormBase);
        UI.MessageWindow = MessageWindow;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
