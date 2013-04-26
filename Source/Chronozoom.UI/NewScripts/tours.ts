﻿/// <reference path='typings/jqueryui/jqueryui.d.ts'/>

/// <reference path='urlnav.ts'/>
/// <reference path='common.ts'/>

module CZ {
    export module Tours {

        export var isTourWindowVisible = false;
        private isBookmarksWindowVisible = false;
        private isBookmarksWindowExpanded = true;
        private isBookmarksTextShown = true;
        private isNarrationOn = true;

        export var tours; // list of loaded tours
        export var tour; //an active tour. Undefined if no tour is active
        export var tourBookmarkTransitionCompleted; // a callbacks that is to be set by tour and to be called by animation framework
        export var tourBookmarkTransitionInterrupted;

        export var pauseTourAtAnyAnimation = false;

        private bookmarkAnimation; // current animation of bookmark' description text sliding

        var isToursDebugEnabled = false; // enables rebug output

        /* TourBookmark represents a place in the virtual space with associated audio.
        @param url  (string) Url that contains a state of the virtual canvas
        @param caption (string) text describing the bookmark
        @param lapseTime (number) a position in the audiotreck of the bookmark in seconds
        */
        class TourBookmark {

            public duration = undefined;
            public number = 0;
            public elapsed = 0; // number of seconds that were already played (if interrupted).

            constructor(public url, public caption, public lapseTime, public text) { }
        }

        /*
        @returns VisibleRegion2d for the bookmark
        */
        export function getBookmarkVisible(bookmark) {
            return CZ.UrlNav.navStringToVisible(bookmark.url, CZ.Common.vc);
        }

        export interface Place {
            type: string;
            bookmark: number;
            startTime: number;
            animationId: number;
        }

        export class Tour {
            public tour_BookmarkStarted = [];
            public tour_BookmarkFinished = [];
            public tour_TourStarted = [];
            public tour_TourFinished = [];

            public state = 'pause'; // possible states: play, pause, finished
            public currentPlace: Place = { type: 'goto', bookmark: 0, startTime: null, animationId: null };
            public isTourPlayRequested = false; //indicated whether the play should start after the data is loaded

            private isAudioLoaded = false; //is set automaticly after the audio track is loaded
            private isAudioEnabled = false; //to be changed by toggleAudio function
            private audioElement; // audio element of this tour

            private timerOnBookmarkIsOver;  // timer id which is set for bookmark complete event (stored to be able to cancel it if paused)

            public toggleAudio;

            private ReinitializeAudio;
            private play;
            private pause;
            private next;
            private prev;
            private RaiseTourStarted;
            private RaiseTourFinished;
            private RaiseBookmarkStarted;
            private RaiseBookmarkFinished;
            private onGoToSuccess;
            private onGoToFailure;
            private onBookmarkIsOver;
            private goToTheNextBookmark;
            private startBookmarkAudio;
            private setTimer;

            /* Tour represents a sequence of bookmarks.
            @param title        (string)    Title of the tour.
            @param bookmarks    (non empty array of TourBookmark) A sequence of bookmarks
            @param zoomTo       (func (VisibleRegion2d, onSuccess, onFailure, bookmark) : number) Allows the tour to zoom into required places, returns a unique animation id, which is then passed to callbacks.
            @param vc           (jquery)    VirtualCanvas
            @param category (String) category of the tour
            @param sequenceNum (number) an ordering number
            @callback tour_BookmarkStarted      Array of (func(tour, bookmark)) The function is called when new bookmark starts playing
            @callback tour_BookmarkFinished     Array of (func(tour, bookmark)) The function is called when new bookmark is finished
            @callback tour_TourFinished     Array of (func(tour)) The function is called when the tour is finished
            @callback tour_TourStarted      Array of (func(tour)) The function is called when the tour is finished
            */
            constructor(public title, public bookmarks, public zoomTo, public vc, public category, public audio, public sequenceNum) {

                if (!bookmarks || bookmarks.length == 0) {
                    throw "Tour has no bookmarks";
                }

                var self = this;

                //ordering the bookmarks by the lapsetime
                bookmarks.sort(function (b1, b2) {
                    return b1.lapseTime - b2.lapseTime;
                });

                for (var i = 1; i < bookmarks.length; i++) {  //calculating bookmarks durations        
                    bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
                    bookmarks[i - 1].number = i;
                }
                bookmarks[bookmarks.length - 1].duration = 10; //this will be overrided when the audio will be downloaded
                bookmarks[bookmarks.length - 1].number = bookmarks.length;

                /*
                Enables or disables an audio playback of the tour.
                @param isOn (Boolean) whether the audio is enabled
                */
                self.toggleAudio = function toggleAudio(isOn) {
                    if (isOn)
                        self.isAudioEnabled = true;
                    else
                        self.isAudioEnabled = false;
                }

                self.ReinitializeAudio = function ReinitializeAudio() {
                    // stop audio playback and clear audio element
                    if (self.audioElement) {
                        self.audioElement.pause();
                    }

                    self.audioElement = undefined;

                    self.isAudioLoaded = false;

                    // reinitialize audio element
                    self.audioElement = document.createElement('audio');

                    self.audioElement.addEventListener("loadedmetadata", function () {
                        if (self.audioElement.duration != Infinity)
                            self.bookmarks[self.bookmarks.length - 1].duration = self.audioElement.duration - self.bookmarks[self.bookmarks.length - 1].lapseTime; //overriding the last bookmark duration
                        if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)"));
                    });
                    self.audioElement.addEventListener("canplaythrough", function () {
                        // audio track is fully loaded
                        self.isAudioLoaded = true;

                        if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4"));
                    });
                    self.audioElement.addEventListener("progress", function () {
                        if (self.audioElement && self.audioElement.buffered.length > 0)
                            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (self.audio.buffered.end(self.audio.buffered.length - 1) / self.audio.duration)));
                    });

                    self.audioElement.controls = false;
                    self.audioElement.autoplay = false;
                    self.audioElement.loop = false;
                    self.audioElement.volume = 1;

                    self.audioElement.preload = "none";

                    // add audio sources of different audio file extensions for audio element
                    var blobPrefix = self.audio.substring(0, self.audio.length - 3);
                    for (var i = 0; i < CZ.Settings.toursAudioFormats.length; i++) {
                        var audioSource = document.createElement("Source");
                        audioSource.setAttribute("src", blobPrefix + CZ.Settings.toursAudioFormats[i].ext);
                        self.audioElement.appendChild(audioSource);
                    }

                    self.audioElement.load();
                    if (isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued"));
                }

                /*
                Raises that bookmark playback is over. Called only if state is "play" and currentPlace is bookmark
                @param goBack (boolen) specifies the direction to move (prev - true, next - false)
                */
                self.onBookmarkIsOver = function onBookmarkIsOver(goBack) {

                    self.bookmarks[self.currentPlace.bookmark].elapsed = 0; // reset bookmark's playback progress

                    // Going to the next bookmark if we are not at the end
                    if ((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
                        // reset tour state
                        self.state = 'pause';
                        self.currentPlace = <Place>{ type: 'goto', bookmark: 0 };
                        self.RaiseTourFinished();
                    }
                    else {
                        self.goToTheNextBookmark(goBack);
                    }
                };

                /*
                Moves the tour to the next or to the prev bookmark activating elliptical zoom
                @param goBack(boolen) specifies the direction to move(prev - true, next - false)
                */
                self.goToTheNextBookmark = function goToTheNextBookmark(goBack) {
                    var newBookmark = self.currentPlace.bookmark;
                    var oldBookmark = newBookmark;

                    // calculate index of new bookmark in array of bookmarks
                    if (goBack) {
                        newBookmark = Math.max(0, newBookmark - 1);
                    }
                    else {
                        newBookmark = Math.min(self.bookmarks.length - 1, newBookmark + 1);
                    }

                    // raise bookmark finished callback functions
                    self.RaiseBookmarkFinished(oldBookmark);

                    // change current position in tour and start EllipticalZoom animation
                    self.currentPlace = <Place>{ type: 'goto', bookmark: newBookmark };

                    var bookmark = self.bookmarks[self.currentPlace.bookmark]; // next bookmark

                    // activate bookmark & audio naration if required
                    if (newBookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);

                        // start audio narration
                        if (self.isAudioEnabled && self.state === 'play' && self.isAudioLoaded == true)
                            self.startBookmarkAudio(bookmark);

                    }

                    // initialize bookmark's timer
                    if (self.state != 'pause' && self.isAudioLoaded == true)
                        self.setTimer(bookmark);

                    if (isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark));

                    // start new EllipticalZoom animation if needed
                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);
                }

                /*
                Resumes/starts audio narration for bookmark.
                @param bookmark         (bookmark) bookmark which audio narration part should be played.
                */
                self.startBookmarkAudio = function startBookmarkAudio(bookmark) {
                    if (isToursDebugEnabled && window.console && console.log("playing source: " + self.audio.currentSrc));

                    self.audioElement.pause();

                    // set audio track's time to time when this bookmark was paused (beginning of bookmark if it wasn't paused)
                    try {
                        self.audioElement.currentTime = bookmark.lapseTime + bookmark.elapsed;
                        if (isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed)));
                    }
                    catch (ex) {
                        if (window.console && console.error("currentTime assignment: " + ex));
                    }

                    if (isToursDebugEnabled && window.console && console.log("audio element is forced to play"));

                    self.audioElement.play();
                }

                /*
                Sets up the transition to the next bookmark timer. Resets the currently active one.
                */
                self.setTimer = function setTimer(bookmark) {
                    // clear active timer
                    if (self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                    }

                    // calculate time to the end of active bookmark
                    var duration = bookmark.duration;
                    if (bookmark.elapsed != 0) {
                        duration = Math.max(duration - bookmark.elapsed, 0);
                    }

                    // save start time
                    self.currentPlace.startTime = new Date().getTime();

                    if (isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds"));

                    // activate new timer
                    self.timerOnBookmarkIsOver = setTimeout(self.onBookmarkIsOver, duration * 1000 /* ms */);
                }

                // Zoom animation callbacks:
                self.onGoToSuccess = function onGoToSuccess(animationId) { // we've finished zooming into the bookmark
                    // the function is called only when state is play and currentPlace is goto, otherwise we are paused        
                    if (!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId) // callback is obsolete
                        return;

                    var curURL = CZ.UrlNav.getURL();
                    if (typeof curURL.hash.params == 'undefined')
                        curURL.hash.params = [];
                    curURL.hash.params["tour"] = tour.sequenceNum;
                    //curURL.hash.params["bookmark"] = self.currentPlace.bookmark+1;
                    
                    //This flag is used to overcome hashchange event handler
                    CZ.Common.hashHandle = false;
                    CZ.UrlNav.setURL(curURL);

                    if (isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark));

                    self.currentPlace = <Place>{ type: 'bookmark', bookmark: self.currentPlace.bookmark };

                    //start the audio after the transition to the first bookmark if not paused
                    if (self.currentPlace.bookmark == 0) {
                        // raise bookmark started callback functions
                        var bookmark = self.bookmarks[self.currentPlace.bookmark];
                        self.RaiseBookmarkStarted(bookmark);

                        if (self.state != 'pause') {
                            if (self.isAudioLoaded != true) { // stop tour if audio is not ready yet
                                tourPause();
                            } else { // audio is ready
                                self.setTimer(bookmark);
                                if (self.isAudioEnabled) {
                                    self.startBookmarkAudio(bookmark);
                                }
                            }
                        }
                    }

                };

                self.onGoToFailure = function onGoToFailure(animationId) { // we've been interrupted during zoom to the bookmark
                    // the function is called only when state is play and currentPlace is goto, otherwise we are paused
                    if (!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId) // callback is obsolete
                        return;

                    // pause tour
                    self.pause();

                    if (isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition"));
                };

                self.play = function play() {
                    if (self.state !== 'pause') {
                        return;
                    }

                    // first we go to the bookmark and then continue play it
                    if (isToursDebugEnabled && window.console && console.log("tour playback activated"));
                    self.state = 'play';

                    var visible = self.vc.virtualCanvas("getViewport").visible;

                    if (self.currentPlace != null && self.currentPlace.bookmark != null && CZ.Common.compareVisibles(visible, getBookmarkVisible(self.bookmarks[self.currentPlace.bookmark]))) {
                        // current visible is equal to visible of bookmark
                        self.currentPlace = <Place>{ type: 'bookmark', bookmark: self.currentPlace.bookmark };
                    } else {
                        // current visible is not equal to visible of bookmark, animation is required
                        self.currentPlace = <Place>{ type: 'goto', bookmark: self.currentPlace.bookmark };
                    }

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    // indicates if animation to first bookmark is required
                    var isInTransitionToFirstBookmark = (self.currentPlace.bookmark == 0 && self.currentPlace.type == 'goto');

                    // transition to bookmark is over OR not in process of transition to first bookmark => start bookmark
                    if (self.currentPlace.type == 'bookmark' || self.currentPlace.bookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);

                        // start bookmark' timer & audio narration if audio is ready
                        if (self.isAudioLoaded == true) {
                            self.setTimer(bookmark);
                            if (self.isAudioEnabled) {
                                self.startBookmarkAudio(bookmark);
                            }
                        }
                    }

                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);

                    // raise tourStarted callback functions
                    if (self.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
                        self.RaiseTourStarted();
                    }

                    var curURL = CZ.UrlNav.getURL();
                    if (typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = new Array();
                    }

                    if (typeof curURL.hash.params["tour"] == 'undefined') {
                        curURL.hash.params["tour"] = tour.sequenceNum;

                        //This flag is used to overcome hashchange event handler
                        CZ.Common.hashHandle = false;
                        CZ.UrlNav.setURL(curURL);
                    }
                };

                self.pause = function pause() {
                    if (self.state !== 'play') return;

                    if (isToursDebugEnabled && window.console && console.log("tour playback paused"));
                    if (self.isAudioEnabled && self.isTourPlayRequested)
                        self.isTourPlayRequested = false;

                    // clear active bookmark timer
                    if (self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.state = 'pause';
                    if (self.isAudioEnabled) {
                        self.audioElement.pause();
                        if (isToursDebugEnabled && window.console && console.log("audio element is forced to pause"));
                    }

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];
                    // save the time when bookmark was paused
                    if (self.currentPlace.startTime)
                        bookmark.elapsed += (new Date().getTime() - self.currentPlace.startTime) / 1000; // sec
                };

                self.next = function next() { // goes to the next bookmark
                    // ignore if last bookmark
                    if (self.currentPlace.bookmark != self.bookmarks.length - 1) {
                        if (self.state === 'play') {
                            // clear active bookmark timer
                            if (self.timerOnBookmarkIsOver) clearTimeout(self.timerOnBookmarkIsOver);
                            self.timerOnBookmarkIsOver = undefined;
                        }

                        self.onBookmarkIsOver(false); // goes to the next bookmark            
                    }
                };

                self.prev = function prev() { // goes to the previous bookmark
                    // ignore if first bookmark
                    if (self.currentPlace.bookmark == 0) {
                        //self.currentPlace = { type: 'goto', bookmark: 0, animationId: self.currentPlace.animationId };
                        return;
                    }
                    if (self.state === 'play') {
                        // clear active bookmark timer
                        if (self.timerOnBookmarkIsOver) clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.onBookmarkIsOver(true); // goes to the prev bookmark
                };

                // calls every bookmarkStarted callback function
                self.RaiseBookmarkStarted = function RaiseBookmarkStarted(bookmark) {
                    if (self.tour_BookmarkStarted.length > 0) {
                        for (var i = 0; i < self.tour_BookmarkStarted.length; i++)
                            self.tour_BookmarkStarted[i](self, bookmark);
                    }
                }

                // calls every bookmarkFinished callback function
                self.RaiseBookmarkFinished = function RaiseBookmarkFinished(bookmark) {
                    if (self.tour_BookmarkFinished.length > 0) {
                        for (var i = 0; i < self.tour_BookmarkFinished.length; i++)
                            self.tour_BookmarkFinished[i](self, bookmark);
                    }
                }

                // calls every tourStarted callback function
                self.RaiseTourStarted = function RaiseTourStarted() {
                    if (self.tour_TourStarted.length > 0) {
                        for (var i = 0; i < self.tour_TourStarted.length; i++)
                            self.tour_TourStarted[i](self);
                    }
                }

                // calls every tourFinished callback function
                self.RaiseTourFinished = function RaiseTourFinished() {
                    if (self.tour_TourFinished.length > 0) {
                        for (var i = 0; i < self.tour_TourFinished.length; i++)
                            self.tour_TourFinished[i](self);
                    }
                }
            }
        }

        /*
        Activates tour contol UI.
        @param    tour (Tour). A tour to play.
        @param    isAudioEnabled (Boolean) Whether to play audio during the tour or not
        */
        export function activateTour(newTour, isAudioEnabled) {
            if (newTour != undefined) {
                var tourControlDiv = document.getElementById("tour_control");
                tourControlDiv.style.display = "block";
                tour = newTour;

                // add new tourFinished callback function
                tour.tour_TourFinished.push(function (tour) {
                    hideBookmark(tour);
                    tourPause();
                    hideBookmarks();
                });

                tour.toggleAudio(isAudioEnabled);

                // reset pause time for every bookmark
                for (var i = 0; i < tour.bookmarks.length; i++)
                    tour.bookmarks[i].elapsed = 0;

                // reset active tour' bookmark
                tour.currentPlace.bookmark = 0;

                // don't need to load audio if audio narration is off
                if (isAudioEnabled == true) {
                    tour.ReinitializeAudio();
                    tour.isAudioLoaded = true;
                }
                // start a tour
                tourResume();
            }
        }

        /*
        Diactivates a tour. Removes all tour controlls.
        */
        function removeActiveTour() {
            // stop active tour
            if (tour) {
                tourPause();
                tour.isTourPlayRequested = false;
            }

            // hide tour' UI
            var tourControlDiv = document.getElementById("tour_control");
            tourControlDiv.style.display = "none";
            if (tour) {
                hideBookmarks();
                $("#bookmarks .header").text("");

                // remove audio track
                if (tour.audioElement)
                    tour.audioElement = undefined;
            }

            // reset active tour
            tour = undefined;
        }

        /*
        Handling of prev button click in UI
        */
        export function tourPrev() {
            if (tour != undefined) {
                tour.prev();
            }
        }

        /*
        Handling of next button click in UI
        */
        export function tourNext() {
            if (tour != undefined) {
                tour.next();
            }
        }

        /*
        switch the tour in the paused state
        */
        export function tourPause() {
            if (tour != undefined) {
                $("#tour_playpause").attr("src", "/Images/tour_play_off.jpg");

                // pause tour
                tour.pause();
                // stop active animation
                CZ.Common.controller.stopAnimation();
                // remove animation callbacks
                tour.tourBookmarkTransitionInterrupted = undefined;
                tour.tourBookmarkTransitionCompleted = undefined;
            }
        }

        /*
        switch the tour in the running state
        */
        function tourResume() {
            $("#tour_playpause").attr("src", "/Images/tour_pause_off.jpg");
            tour.play();
        }

        /*
        Handling of play/pause button click in UI
        */
        export function tourPlayPause() {
            if (tour != undefined) {
                if (tour.state == "pause") {
                    tourResume();
                }
                else if (tour.state == "play") {
                    tourPause();
                }

                //        var curURL = getURL();
                //        if (typeof curURL.hash.params == 'undefined')
                //            curURL.hash.params = new Array();
                //        curURL.hash.params["tour"] = tour.sequenceNum;
                //        curURL.hash.params["bookmark"] = tour.currentPlace.bookmark + 1;
                //        setURL(curURL);

            }
        }

        /*
        Handling of close button click in UI.
        */
        export function tourAbort() {
            // close tour and hide all tour' UI elements
            removeActiveTour();
            $("#bookmarks").hide();
            isBookmarksWindowVisible = false;

            var curURL = CZ.UrlNav.getURL();
            delete curURL.hash.params["tour"];
            delete curURL.hash.params["bookmark"];
            CZ.UrlNav.setURL(curURL);
        }

        export function initializeToursUI() {
            $("#tours").hide();

            // Bookmarks window
            hideBookmarks();
        }

        export function initializeToursContent() {
            var toursUI = $('#tours-content');
            tours.sort(function (u, v) { return u.sequenceNum - v.sequenceNum });
            var category = null;
            var categoryContent;

            // add every tour in a categoried list in tours panel
            for (var i = 0; i < tours.length; i++) {
                var tour = tours[i];

                // add new bookmarkStarted callback function
                tour.tour_BookmarkStarted.push(function (t, bookmark) {
                    showBookmark(t, bookmark);
                });

                // add new bookmarkFinished callback function
                tour.tour_BookmarkFinished.push(function (t, bookmark) {
                    hideBookmark(t);
                });

                // add new category to tours menu
                if (tour.category !== category) {
                    var cat = $("<div></div>", {
                        class: "category",
                        text: tour.category
                    }).appendTo(toursUI);

                    // add category' UI
                    var img = $("<img></img>", {
                        class: "collapseButton",
                        src: "/Images/collapse-down.png"
                    }).appendTo(cat);

                    if (i == 0) {
                        cat.removeClass('category').addClass('categorySelected');
                        (<HTMLImageElement>img[0]).src = "/Images/collapse-up.png";
                    }

                    categoryContent = $('<div></div>', {
                        class: "itemContainer"
                    }).appendTo(toursUI);

                    category = tour.category;
                }

                // add tour element into category
                $("<div></div>", {
                    class: "item",
                    tour: i,
                    text: tour.title,
                    click: function () {
                        // close active tour                            
                        removeActiveTour();

                        // hide tour UI
                        $("#tours").hide('slide', {}, 'slow');
                        CZ.Common.toggleOffImage('tours_index');
                        isTourWindowVisible = false;

                        // activate selected tour  
                        var mytour = tours[this.getAttribute("tour")];
                        activateTour(mytour, isNarrationOn);

                        // deselect previously active tour in tours panel
                        $(".touritem-selected").removeClass("touritem-selected", "slow");
                        // mark this tour as selected in tours panel
                        $(this).addClass("touritem-selected", "slow");
                    }
                }).appendTo(categoryContent);
            }

            // create jquery widget for category' content sliding
            (<any>$)("#tours-content").accordion({
                collapsible: true,
                heightStyle: "content",
                beforeActivate: function (event, ui) {
                    if (ui.newHeader) {
                        ui.newHeader.removeClass('category');
                        ui.newHeader.addClass('categorySelected');

                        var img = (<HTMLImageElement>$(".collapseButton", ui.newHeader)[0]);
                        if (img) img.src = "/Images/collapse-up.png";
                    }
                    if (ui.oldHeader) {
                        ui.oldHeader.removeClass('categorySelected');
                        ui.oldHeader.addClass('category');

                        var img = (<HTMLImageElement>$(".collapseButton", ui.oldHeader)[0]);
                        if (img) img.src = "/Images/collapse-down.png";
                    }
                }
            });

            // TODO: Temp fix of accordion style. Delete this and jquery-ui.css when the new UI will be implemented.
            $("#tours-content").removeClass("ui-accordion ui-widget ui-helper-reset ui-accordion-icons");
            $("#tours-content .categorySelected > span").removeClass("ui-accordion-header-icon ui-icon ui-icon-triangle-1-s");
            $("#tours-content .itemContainer").removeClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active");
            $("#tours-content .categorySelected")
                .removeClass("ui-accordion-header-active ui-state-active ui-state-hover ui-corner-top ui-accordion-header ui-helper-reset ui-state-default ui-accordion-icons ui-state-focus ui-corner-all")
                .on("blur change click dblclick error focus focusin focusout hover keydown keypress keyup load mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup resize scroll select submit",
                    function () { $(this).removeClass("ui-accordion-header-active ui-state-active ui-state-hover ui-corner-top ui-accordion-header ui-helper-reset ui-state-default ui-accordion-icons ui-state-focus ui-corner-all"); });
        }

        /*
        Hides bookmark description text.
        */
        function hideBookmark(tour) {
            if (isBookmarksWindowExpanded && isBookmarksTextShown) {
                // end active sliding animation
                if (bookmarkAnimation)
                    bookmarkAnimation.stop(true, true);

                // start new animation
                bookmarkAnimation = $("#bookmarks .slideText").hide("drop", {}, 'slow', function () {
                    bookmarkAnimation = undefined;
                });

                $("#bookmarks .slideHeader").text("");
                isBookmarksTextShown = false;
            }
        }

        /*
        Shows bookmark description text.
        */
        function showBookmark(tour, bookmark) {
            if (!isBookmarksWindowVisible) {
                isBookmarksWindowVisible = true;
                // todo: check whether the bookmarks are expanded
                $("#bookmarks .slideText").text(bookmark.text);
                $("#bookmarks").show('slide', {}, 'slow');
            }

            $("#bookmarks .header").text(tour.title);
            $("#bookmarks .slideHeader").text(bookmark.caption);
            $("#bookmarks .slideFooter").text(bookmark.number + '/' + tour.bookmarks.length);

            if (isBookmarksWindowExpanded) {
                $("#bookmarks .slideText").text(bookmark.text);
                if (!isBookmarksTextShown) {

                    // stop active sliding animation
                    if (bookmarkAnimation)
                        bookmarkAnimation.stop(true, true);

                    // start new animation
                    bookmarkAnimation = $("#bookmarks .slideText").show("drop", {}, 'slow', function () {
                        bookmarkAnimation = undefined;
                    });
                    isBookmarksTextShown = true;
                }
            } else {
                $("#bookmarks .slideText").text(bookmark.text);
            }
        }

        /*
        Closes bookmark description window.
        */
        function hideBookmarks() {
            $("#bookmarks").hide();
            isBookmarksWindowVisible = false;
        }

        /*
        Tours button handler.
        */
        export function onTourClicked() {
            if (CZ.Search.isSearchWindowVisible)
                CZ.Search.onSearchClicked();

            if (isTourWindowVisible) {
                CZ.Common.toggleOffImage('tours_index');
                $("#tours").hide('slide', {}, 'slow');
            } else {
                CZ.Common.toggleOnImage('tours_index');
                $("#tours").show('slide', {}, 'slow');
            }
            isTourWindowVisible = !isTourWindowVisible;
        }

        /* Highlights the tour button in the top menu */
        export function tourButtonHighlight(isOn) {
            if (isOn) {
                CZ.Common.toggleOnImage('tours_index');
            }
            else {
                if (!isTourWindowVisible)
                    CZ.Common.toggleOffImage('tours_index');
            }
        }

        /*
        Collapses bookmark description window. 
        */
        function collapseBookmarks() {
            if (!isBookmarksWindowExpanded) return;
            isBookmarksWindowExpanded = false;
            $("#bookmarks .header").hide('slide', {}, 'fast');
            $("#bookmarks .slideHeader").hide('slide', {}, 'fast');
            $("#bookmarks .slideText").hide('slide', {}, 'fast');
            $("#bookmarks .slideFooter").hide('slide', {}, 'fast');
            $("#bookmarks").effect('size', { to: { width: 30 } }, 'fast');
            $("#bookmarksCollapse").attr("src", "/Images/expand-right.png");
        }

        /*
        Expands bookmark description window. 
        */
        function expandBookmarks() {
            if (isBookmarksWindowExpanded) return;
            isBookmarksWindowExpanded = true;
            //$("#bookmarks").switchClass('bookmarksWindow', 'bookmarksWindowCollapsed', 'slow',
            $("#bookmarks").effect('size', { to: { width: '200px', height: 'auto' } }, 'slow',
                        function () {
                            $("#bookmarks").css('height', 'auto');
                            $("#bookmarks .header").show('slide', {}, 'fast');
                            $("#bookmarks .slideHeader").show('slide', {}, 'fast');
                            $("#bookmarks .slideText").show('slide', {}, 'fast');
                            $("#bookmarks .slideFooter").show('slide', {}, 'fast');
                        });
            $("#bookmarksCollapse").attr("src", "/Images/collapse-left.png");

        }

        /*
        Collapses/expands bookmark description window.
        */
        export function onBookmarksCollapse() {
            if (!isBookmarksWindowExpanded) {
                expandBookmarks();
            } else {
                collapseBookmarks();
            }
        }

        /*
        Handles click in tour narration window.
        */
        export function onNarrationClick() {
            if (isNarrationOn) {
                $("#tours-narration-on").removeClass("narration-selected", "slow");
                $("#tours-narration-off").addClass("narration-selected", "slow");
            } else {
                $("#tours-narration-on").addClass("narration-selected", "slow");
                $("#tours-narration-off").removeClass("narration-selected", "slow");
            }
            isNarrationOn = !isNarrationOn;
        }

        /*
        Called after successful response from tours request.
        @param content      (array) an array of tours that were returned by request 
        */
        export function parseTours(content) {
            tours = new Array();

            // build array of tours that could be played
            for (var i = 0; i < content.d.length; i++) {
                var areBookmarksValid = true; // indicates whether all bookmarks are correct or not
                var tourString = content.d[i];

                // skip tours with invalid parameters
                if ((typeof tourString.bookmarks == 'undefined') ||
                            (typeof tourString.audio == 'undefined') ||
                            (tourString.audio == undefined) ||
                            (tourString.audio == null) ||
                            (typeof tourString.category == 'undefined') ||
                            (typeof tourString.name == 'undefined') ||
                            (typeof tourString.sequence== 'undefined'))
                    continue;

                // build array of bookmarks of current tour
                var tourBookmarks = new Array();

                for (var j = 0; j < tourString.bookmarks.length; j++) {
                    var bmString = tourString.bookmarks[j];

                    // break if at least one bookmarks has invalid parameters
                    if ((typeof bmString.description == 'undefined') ||
                            (typeof bmString.lapseTime == 'undefined') ||
                            (typeof bmString.name == 'undefined')) {
                        areBookmarksValid = false;
                        break;
                    }

                    // Create tour URL
                    var resultId : string;
                    switch (bmString.referenceType) {
                        case 0: resultId = 't' + bmString.referenceId; break; // timeline
                        case 1: resultId = 'e' + bmString.referenceId; break; // exhibit
                        case 2: resultId = bmString.referenceId; break; // content item
                    }
                    var bookmarkElement = CZ.Common.vc.virtualCanvas("findElement", resultId);
                    var navStringBookmarkElement = CZ.UrlNav.vcelementToNavString(bookmarkElement);

                    tourBookmarks.push(new TourBookmark(navStringBookmarkElement, bmString.name, bmString.lapseTime, bmString.description));
                }

                // skip tour with broken bookmarks
                if (!areBookmarksValid)
                    continue;

                // tour is correct and can be played
                tours.push(new Tour(tourString.name, tourBookmarks, bookmarkTransition, CZ.Common.vc, tourString.category, tourString.audio, tourString.sequence));
            }
        }

        /*
        Bookmark' transition handler function to be passed to tours.
        */
        function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
            tourBookmarkTransitionCompleted = onCompleted; // reinitialize animation completed handler for bookmark' transition
            tourBookmarkTransitionInterrupted = onInterrupted; // reinitialize animation interrupted handler for bookmark' transition

            pauseTourAtAnyAnimation = false;

            // id of this bookmark' transition animation
            var animId = CZ.Common.setVisible(visible);

            if (animId && bookmark) {
                CZ.Common.setNavigationStringTo = { bookmark: bookmark, id: animId };
            }
            return animId;
        }

        export function loadTourFromURL() {
            var curURL = CZ.UrlNav.getURL();
            if ((typeof curURL.hash.params !== 'undefined') && (curURL.hash.params["tour"] > tours.length))
                return;

            if (typeof curURL.hash.params !== 'undefined' && typeof curURL.hash.params["tour"] !== 'undefined') {
                if (tours == null)
                    initializeToursContent();

                if (isTourWindowVisible) {
                    onTourClicked();
                }

                //var mytour = tours[curURL.hash.params["tour"] - 1];
                tour = tours[curURL.hash.params["tour"] - 1];

                $(".touritem-selected").removeClass("touritem-selected", "slow");

                activateTour(tour, true);

                if (tour.audio) {
                    // pause unwanted audio playback
                    tour.audio.pause();
                    // prohibit unwated audio playback after loading of audio
                    tour.audio.preload = "none";
                }
                tourPause();

                //        var tourControlDiv = document.getElementById("tour_control");
                //        tourControlDiv.style.display = "block";
                //        tour.tour_TourFinished.push(function (tour) {
                //            hideBookmark(tour);
                //            tourPause();
                //            hideBookmarks();
                //        });
                //tour.toggleAudio(true);
                //tour.currentPlace = { type: 'goto', bookmark: 0 };


                //showBookmark(tour, 0);
                //$("#tour_playpause").attr("src", "Images/tour_play_off.jpg");
            }
        }
    }
}