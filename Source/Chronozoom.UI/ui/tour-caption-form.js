/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/tours.ts'/>
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
        var TourPlayer = (function () {
            function TourPlayer(container, playerInfo) {
                this.container = container;
                this.tour = playerInfo.context;

                this.playPauseButton = this.container.find(playerInfo.playPauseButton);
                this.nextButton = this.container.find(playerInfo.nextButton);
                this.prevButton = this.container.find(playerInfo.prevButton);
                this.volButton = this.container.find(playerInfo.volButton);

                this.playPauseButton.off();
                this.nextButton.off();
                this.prevButton.off();
                this.volButton.off();

                this.initialize();
            }
            TourPlayer.prototype.initialize = function () {
                var _this = this;
                this.playPauseButton.attr("state", "pause");
                this.volButton.attr("state", "on");

                this.playPauseButton.click(function (event) {
                    var state = _this.playPauseButton.attr("state");

                    var stateHandlers = {
                        play: function () {
                            _this.play();
                        },
                        pause: function () {
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

                this.volButton.click(function (event) {
                    var state = _this.volButton.attr("state");

                    var stateHandlers = {
                        on: function () {
                            _this.volumeOff();
                        },
                        off: function () {
                            _this.volumeOn();
                        }
                    };

                    stateHandlers[state]();
                });
            };

            TourPlayer.prototype.play = function () {
                this.playPauseButton.attr("state", "pause");
                CZ.Tours.tourResume();
            };

            TourPlayer.prototype.pause = function () {
                this.playPauseButton.attr("state", "play");
                CZ.Tours.tourPause();
            };

            TourPlayer.prototype.next = function () {
                CZ.Tours.tourNext();
            };

            TourPlayer.prototype.prev = function () {
                CZ.Tours.tourPrev();
            };

            TourPlayer.prototype.exit = function () {
                CZ.Tours.tourAbort();
            };

            TourPlayer.prototype.volumeOn = function () {
                this.volButton.attr("state", "on");
                CZ.Tours.isNarrationOn = true;
                this.tour.audioElement.volume = 1;
            };

            TourPlayer.prototype.volumeOff = function () {
                this.volButton.attr("state", "off");
                CZ.Tours.isNarrationOn = false;
                this.tour.audioElement.volume = 0;
            };
            return TourPlayer;
        })();
        UI.TourPlayer = TourPlayer;

        var FormTourCaption = (function (_super) {
            __extends(FormTourCaption, _super);
            function FormTourCaption(container, formInfo) {
                _super.call(this, container, formInfo);

                this.minButton = this.container.find(formInfo.minButton);
                this.captionTextarea = this.container.find(formInfo.captionTextarea);
                this.tourPlayerContainer = this.container.find(formInfo.tourPlayerContainer);
                this.bookmarksCount = this.container.find(formInfo.bookmarksCount);
                this.tour = formInfo.context;
                this.tourPlayer = new CZ.UI.TourPlayer(this.tourPlayerContainer, {
                    playPauseButton: "div:nth-child(2)",
                    nextButton: "div:nth-child(3)",
                    prevButton: "div:nth-child(1)",
                    volButton: "div:nth-child(4)",
                    context: this.tour
                });

                this.minButton.off();

                this.initialize();
            }
            FormTourCaption.prototype.initialize = function () {
                var _this = this;
                this.titleTextblock.text(this.tour.title);
                this.bookmarksCount.text("Slide 1 of " + this.tour.bookmarks.length);
                this.captionTextarea.css("opacity", 0);
                this.isMinimized = false;

                this.minButton.click(function (event) {
                    _this.minimize();
                });
            };

            FormTourCaption.prototype.hideBookmark = function () {
                this.captionTextarea.css("opacity", 0);
            };

            FormTourCaption.prototype.showBookmark = function (bookmark) {
                this.captionTextarea.text(bookmark.text);
                this.bookmarksCount.text("Slide " + bookmark.number + " of " + this.tour.bookmarks.length);
                this.captionTextarea.stop();
                this.captionTextarea.animate({
                    opacity: 1
                });
            };

            FormTourCaption.prototype.showTourEndMessage = function () {
                this.captionTextarea.text(CZ.Tours.TourEndMessage);
                this.bookmarksCount.text("Start a tour");
            };

            FormTourCaption.prototype.setPlayPauseButtonState = function (state) {
                this.tourPlayer.playPauseButton.attr("state", state);
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
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.tourPlayer.exit();

                        // Enable hashchange event.
                        CZ.Common.hashHandle = true;
                    }
                });

                this.activationSource.removeClass("active");
            };

            FormTourCaption.prototype.minimize = function () {
                if (this.isMinimized) {
                    this.contentContainer.show({
                        effect: "slide",
                        direction: "up",
                        duration: 500
                    });
                } else {
                    this.contentContainer.hide({
                        effect: "slide",
                        direction: "up",
                        duration: 500
                    });
                }

                this.isMinimized = !this.isMinimized;
            };
            return FormTourCaption;
        })(CZ.UI.FormBase);
        UI.FormTourCaption = FormTourCaption;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
