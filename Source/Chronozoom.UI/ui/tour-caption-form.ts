/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/tours.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormTourCaptionInfo extends CZ.UI.IFormBaseInfo {
            minButton: string;
            captionTextarea: string;
            tourPlayerContainer: string;
            bookmarksCount: string;
            context: CZ.Tours.Tour;
        }

        export interface ITourPlayerInfo {
            playPauseButton: string;
            nextButton: string;
            prevButton: string;
            volButton: string;
            context: CZ.Tours.Tour;
        }

        export class TourPlayer {
            private container: JQuery;
            private nextButton: JQuery;
            private prevButton: JQuery;
            private volButton: JQuery;
            private tour: CZ.Tours.Tour;
            public playPauseButton: JQuery;

            constructor(container: JQuery, playerInfo: ITourPlayerInfo) {
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

            private initialize(): void {
                this.playPauseButton.attr("state", "pause");
                this.volButton.attr("state", "on");

                this.playPauseButton.click(event => {
                    var state = this.playPauseButton.attr("state");

                    var stateHandlers = {
                        play: () => {
                            this.play();
                        },
                        pause: () => {
                            this.pause();
                        }
                    };

                    stateHandlers[state]();
                });

                this.nextButton.click(event => {
                    this.next();
                });

                this.prevButton.click(event => {
                    this.prev();
                });

                this.volButton.click(event => {
                    var state = this.volButton.attr("state");

                    var stateHandlers = {
                        on: () => {
                            this.volumeOff();
                        },
                        off: () => {
                            this.volumeOn();
                        }
                    };

                    stateHandlers[state]();
                });
            }

            public play(): void {
                this.playPauseButton.attr("state", "pause");
                CZ.Tours.tourResume();
            }

            public pause(): void {
                this.playPauseButton.attr("state", "play");
                CZ.Tours.tourPause();
            }

            public next(): void {
                CZ.Tours.tourNext();
            }

            public prev(): void {
                CZ.Tours.tourPrev();
            }

            public exit(): void {
                CZ.Tours.tourAbort();
            }

            private volumeOn(): void {
                this.volButton.attr("state", "on")
                CZ.Tours.isNarrationOn = true;
                this.tour.audioElement.volume = 1;
            }

            private volumeOff(): void {
                this.volButton.attr("state", "off")
                CZ.Tours.isNarrationOn = false;
                this.tour.audioElement.volume = 0;
            }
        }

        export class FormTourCaption extends CZ.UI.FormBase {
            private minButton: JQuery;
            private captionTextarea: JQuery;
            private tourPlayerContainer: JQuery;
            private bookmarksCount: JQuery;
            private tourPlayer: CZ.UI.TourPlayer;
            private tour: CZ.Tours.Tour;
            private isMinimized: bool;

            constructor(container: JQuery, formInfo: IFormTourCaptionInfo) {
                super(container, formInfo);

                this.minButton = this.container.find(formInfo.minButton);
                this.captionTextarea = this.container.find(formInfo.captionTextarea);
                this.tourPlayerContainer = this.container.find(formInfo.tourPlayerContainer);
                this.bookmarksCount = this.container.find(formInfo.bookmarksCount);
                this.tour = formInfo.context;
                this.tourPlayer = new CZ.UI.TourPlayer(
                    this.tourPlayerContainer,
                    {
                        playPauseButton: "div:nth-child(2)",
                        nextButton: "div:nth-child(3)",
                        prevButton: "div:nth-child(1)",
                        volButton: "div:nth-child(4)",
                        context: this.tour
                    }
                );

                this.minButton.off();

                this.initialize();
            }

            private initialize(): void {
                this.titleTextblock.text(this.tour.title);
                this.bookmarksCount.text("Slide 1 of " + this.tour.bookmarks.length);
                this.captionTextarea.css("opacity", 0);
                this.isMinimized = false;

                this.minButton.click(event => {
                    this.minimize();
                });
            }

            public hideBookmark(): void {
                this.captionTextarea.css("opacity", 0);
            }

            public showBookmark(bookmark: CZ.Tours.TourBookmark): void {
                this.captionTextarea.text(bookmark.text);
                this.bookmarksCount.text("Slide " + bookmark.number + " of " + this.tour.bookmarks.length);
                this.captionTextarea.stop();
                this.captionTextarea.animate({
                    opacity: 1
                });
            }

            public showTourEndMessage(): void {
                this.captionTextarea.text(CZ.Tours.TourEndMessage);
                this.bookmarksCount.text("Start a tour");
            }

            public setPlayPauseButtonState(state: string) {
                this.tourPlayer.playPauseButton.attr("state", state);
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        this.tourPlayer.exit();
                        // Enable hashchange event.
                        CZ.Common.hashHandle = true;
                    }
                });

                this.activationSource.removeClass("active");
            }

            public minimize() {
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
            }
        }
    }
}