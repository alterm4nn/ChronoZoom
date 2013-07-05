var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourPlayer = (function () {
            function TourPlayer(container, playerInfo) {
                this.container = container;
                this.tour = playerInfo.context;
                this.playPauseButton = this.container.find(playerInfo.playPauseButton);
                this.nextButton = this.container.find(playerInfo.nextButton);
                this.prevButton = this.container.find(playerInfo.prevButton);
                this.playPauseButton.off();
                this.nextButton.off();
                this.prevButton.off();
                this.initialize();
            }
            TourPlayer.prototype.initialize = function () {
                var _this = this;
                this.playPauseButton.click(function (event) {
                    var state = _this.playPauseButton.attr("state");
                    var stateHandlers = {
                        play: function () {
                            _this.playPauseButton.attr("state", "pause");
                            _this.play();
                        },
                        pause: function () {
                            _this.playPauseButton.attr("state", "play");
                            _this.pause();
                        }
                    };
                    stateHandlers[state]();
                });
                this.nextButton.click(function (event) {
                    _this.next();
                });
                this.prevButton.click(function (event) {
                    _this.prev();
                });
            };
            TourPlayer.prototype.play = function () {
            };
            TourPlayer.prototype.pause = function () {
            };
            TourPlayer.prototype.next = function () {
            };
            TourPlayer.prototype.prev = function () {
            };
            TourPlayer.prototype.exit = function () {
            };
            return TourPlayer;
        })();
        UI.TourPlayer = TourPlayer;        
        var FormTourCaption = (function (_super) {
            __extends(FormTourCaption, _super);
            function FormTourCaption(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.captionTextarea = this.container.find(formInfo.captionTextarea);
                this.tourPlayerContainer = this.container.find(formInfo.tourPlayerContainer);
                this.bookmarksCount = this.container.find(formInfo.bookmarksCount);
                this.narrationToggle = this.container.find(formInfo.narrationToggle);
                this.tour = formInfo.context;
                this.tourPlayer = new CZ.UI.TourPlayer(this.tourPlayerContainer, {
                    playPauseButton: "div:nth-child(2)",
                    nextButton: "div:nth-child(3)",
                    prevButton: "div:nth-child(1)",
                    context: this.tour
                });
                this.narrationToggle.off();
                this.initialize();
            }
            FormTourCaption.prototype.initialize = function () {
                this.narrationToggle.click(function (event) {
                    CZ.Tours.isNarrationOn = !CZ.Tours.isNarrationOn;
                });
            };
            FormTourCaption.prototype.hideBookmark = function () {
                this.captionTextarea.animate({
                    opacity: 0
                });
            };
            FormTourCaption.prototype.showBookmark = function () {
                this.captionTextarea.animate({
                    opacity: 1
                });
            };
            FormTourCaption.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormTourCaption.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormTourCaption;
        })(CZ.UI.FormBase);
        UI.FormTourCaption = FormTourCaption;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
