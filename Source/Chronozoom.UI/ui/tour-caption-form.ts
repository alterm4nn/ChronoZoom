/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/tours.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormTourCaptionInfo extends CZ.UI.IFormBaseInfo {
            captionTextarea: string;
            tourPlayerContainer: string;
            bookmarksCount: string;
            narrationToggle: string;
            context: CZ.Tours.Tour;
        }

        export interface ITourPlayerInfo {
            playPauseButton: string;
            nextButton: string;
            prevButton: string;
            context: CZ.Tours.Tour;
        }

        export class TourPlayer {
            private container: JQuery;
            private playPauseButton: JQuery;
            private nextButton: JQuery;
            private prevButton: JQuery;
            private tour: CZ.Tours.Tour;

            private isAudioLoaded: bool;

            constructor(container: JQuery, playerInfo: ITourPlayerInfo) {
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

            private initialize(): void {
                this.playPauseButton.click(event => {
                    var state = this.playPauseButton.attr("state");

                    var stateHandlers = {
                        play: () => {
                            this.playPauseButton.attr("state", "pause");
                            this.play();
                        },
                        pause: () => {
                            this.playPauseButton.attr("state", "play");
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
            }

            public play(): void {
            }

            public pause(): void {
            }

            public next(): void {
            }

            public prev(): void {
            }

            public exit(): void {
            }
        }

        export class FormTourCaption extends CZ.UI.FormBase {
            private captionTextarea: JQuery;
            private tourPlayerContainer: JQuery;
            private bookmarksCount: JQuery;
            private narrationToggle: JQuery;
            private tourPlayer: CZ.UI.TourPlayer;
            private tour: CZ.Tours.Tour;

            constructor(container: JQuery, formInfo: IFormTourCaptionInfo) {
                super(container, formInfo);

                this.captionTextarea = this.container.find(formInfo.captionTextarea);
                this.tourPlayerContainer = this.container.find(formInfo.tourPlayerContainer);
                this.bookmarksCount = this.container.find(formInfo.bookmarksCount);
                this.narrationToggle = this.container.find(formInfo.narrationToggle);
                this.tour = formInfo.context;
                this.tourPlayer = new CZ.UI.TourPlayer(
                    this.tourPlayerContainer,
                    {
                        playPauseButton: "div:nth-child(2)",
                        nextButton: "div:nth-child(3)",
                        prevButton: "div:nth-child(1)",
                        context: this.tour
                    }
                );

                this.narrationToggle.off();

                this.initialize();
            }

            private initialize(): void {
                this.narrationToggle.click(event => {
                    CZ.Tours.isNarrationOn = !CZ.Tours.isNarrationOn;
                });
            }

            private hideBookmark(): void {
                this.captionTextarea.animate({
                    opacity: 0
                });
            }

            private showBookmark(): void {
                this.captionTextarea.animate({
                    opacity: 1
                });
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
                });

                this.activationSource.removeClass("active");
            }
        }
    }
}