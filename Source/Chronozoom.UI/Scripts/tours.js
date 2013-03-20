/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='urlnav.ts'/>
/// <reference path='common.ts'/>
var ChronoZoom;
(function (ChronoZoom) {
    (function (Tours) {
        Tours.isTourWindowVisible = false;
        Tours.isBookmarksWindowVisible = false;
        Tours.isBookmarksWindowExpanded = true;
        Tours.isBookmarksTextShown = true;
        Tours.isNarrationOn = true;
        Tours.tours;// list of loaded tours
        
        Tours.tour;//an active tour. Undefined if no tour is active
        
        Tours.tourBookmarkTransitionCompleted;// a callbacks that is to be set by tour and to be called by animation framework
        
        Tours.tourBookmarkTransitionInterrupted;
        Tours.pauseTourAtAnyAnimation = false;
        Tours.bookmarkAnimation;// current animation of bookmark' description text sliding
        
        var isToursDebugEnabled = false;// enables rebug output
        
        /* TourBookmark represents a place in the virtual space with associated audio.
        @param url  (string) Url that contains a state of the virtual canvas
        @param caption (string) text describing the bookmark
        @param lapseTime (number) a position in the audiotreck of the bookmark in seconds
        */
        var TourBookmark = (function () {
            // number of seconds that were already played (if interrupted).
            function TourBookmark(url, caption, lapseTime, text) {
                this.url = url;
                this.caption = caption;
                this.lapseTime = lapseTime;
                this.text = text;
                this.duration = undefined;
                this.number = 0;
                this.elapsed = 0;
            }
            return TourBookmark;
        })();        
        /*
        @returns VisibleRegion2d for the bookmark
        */
        function getBookmarkVisible(bookmark) {
            return ChronoZoom.UrlNav.navStringToVisible(bookmark.url, ChronoZoom.Common.vc);
        }
        Tours.getBookmarkVisible = getBookmarkVisible;
        var Tour = (function () {
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
            function Tour(title, bookmarks, zoomTo, vc, category, audioBlobUrl, sequenceNum) {
                this.title = title;
                this.bookmarks = bookmarks;
                this.zoomTo = zoomTo;
                this.vc = vc;
                this.category = category;
                this.audioBlobUrl = audioBlobUrl;
                this.sequenceNum = sequenceNum;
                this.tour_BookmarkStarted = [];
                this.tour_BookmarkFinished = [];
                this.tour_TourStarted = [];
                this.tour_TourFinished = [];
                this.state = 'pause';
                // possible states: play, pause, finished
                this.currentPlace = {
                    type: 'goto',
                    bookmark: 0,
                    startTime: null,
                    animationId: null
                };
                this.isTourPlayRequested = false;
                //indicated whether the play should start after the data is loaded
                this.isAudioLoaded = false;
                //is set automaticly after the audio track is loaded
                this.isAudioEnabled = false;
                if(!bookmarks || bookmarks.length == 0) {
                    throw "Tour has no bookmarks";
                }
                //ordering the bookmarks by the lapsetime
                bookmarks.sort(function (b1, b2) {
                    return b1.lapseTime - b2.lapseTime;
                });
                for(var i = 1; i < bookmarks.length; i++) {
                    //calculating bookmarks durations
                    bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
                    bookmarks[i - 1].number = i;
                }
                bookmarks[bookmarks.length - 1].duration = 10//this will be overrided when the audio will be downloaded
                ;
                bookmarks[bookmarks.length - 1].number = bookmarks.length;
                /*
                Enables or disables an audio playback of the tour.
                @param isOn (Boolean) whether the audio is enabled
                */
                function toggleAudio(isOn) {
                    if(isOn) {
                        this.isAudioEnabled = true;
                    } else {
                        this.isAudioEnabled = false;
                    }
                }
function ReinitializeAudio() {
                    // stop audio playback and clear audio element
                    if(this.audio) {
                        this.audio.pause();
                    }
                    this.audio = undefined;
                    this.isAudioLoaded = false;
                    // reinitialize audio element
                    this.audio = document.createElement('audio');
                    this.audio.addEventListener("loadedmetadata", function () {
                        if(this.audio.duration != Infinity) {
                            this.bookmarks[this.bookmarks.length - 1].duration = this.audio.duration - this.bookmarks[this.bookmarks.length - 1].lapseTime;
                        }//overriding the last bookmark duration
                        
                        if(isToursDebugEnabled && window.console && console.log("Tour " + this.title + " metadata loaded (readystate 1)")) {
                            ;
                        }
                    });
                    this.audio.addEventListener("canplaythrough", function () {
                        // audio track is fully loaded
                        this.isAudioLoaded = true;
                        if(isToursDebugEnabled && window.console && console.log("Tour " + this.title + " readystate 4")) {
                            ;
                        }
                    });
                    this.audio.addEventListener("progress", function () {
                        if(this.audio.buffered.length > 0) {
                            if(isToursDebugEnabled && window.console && console.log("Tour " + this.title + " downloaded " + (this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration))) {
                                ;
                            }
                        }
                    });
                    this.audio.controls = false;
                    this.audio.autoplay = false;
                    this.audio.loop = false;
                    this.audio.volume = 1;
                    this.audio.preload = "none";
                    // add audio sources of different audio file extensions for audio element
                    var blobPrefix = this.audioBlobUrl.substring(0, this.audioBlobUrl.length - 3);
                    for(var i = 0; i < ChronoZoom.Settings.toursAudioFormats.length; i++) {
                        var audioSource = document.createElement("Source");
                        audioSource.setAttribute("src", blobPrefix + ChronoZoom.Settings.toursAudioFormats[i].ext);
                        this.audio.appendChild(audioSource);
                    }
                    this.audio.load();
                    if(isToursDebugEnabled && window.console && console.log("Loading of tour " + this.title + " is queued")) {
                        ;
                    }
                }
                /*
                Raises that bookmark playback is over. Called only if state is "play" and currentPlace is bookmark
                @param goBack (boolen) specifies the direction to move (prev - true, next - false)
                */
                function onBookmarkIsOver(goBack) {
                    this.bookmarks[this.currentPlace.bookmark].elapsed = 0// reset bookmark's playback progress
                    ;
                    // Going to the next bookmark if we are not at the end
                    if((this.currentPlace.bookmark == this.bookmarks.length - 1) && !goBack) {
                        // reset tour state
                        this.state = 'pause';
                        this.currentPlace = {
                            type: 'goto',
                            bookmark: 0
                        };
                        this.RaiseTourFinished();
                    } else {
                        this.goToTheNextBookmark(goBack);
                    }
                }
                ;
                /*
                Moves the tour to the next or to the prev bookmark activating elliptical zoom
                @param goBack(boolen) specifies the direction to move(prev - true, next - false)
                */
                function goToTheNextBookmark(goBack) {
                    var newBookmark = this.currentPlace.bookmark;
                    var oldBookmark = newBookmark;
                    // calculate index of new bookmark in array of bookmarks
                    if(goBack) {
                        newBookmark = Math.max(0, newBookmark - 1);
                    } else {
                        newBookmark = Math.min(this.bookmarks.length - 1, newBookmark + 1);
                    }
                    // raise bookmark finished callback functions
                    this.RaiseBookmarkFinished(oldBookmark);
                    // change current position in tour and start EllipticalZoom animation
                    this.currentPlace = {
                        type: 'goto',
                        bookmark: newBookmark
                    };
                    var bookmark = this.bookmarks[this.currentPlace.bookmark];// next bookmark
                    
                    // activate bookmark & audio naration if required
                    if(newBookmark != 0) {
                        this.RaiseBookmarkStarted(bookmark);
                        // start audio narration
                        if(this.isAudioEnabled && this.state === 'play' && this.isAudioLoaded == true) {
                            this.startBookmarkAudio(bookmark);
                        }
                    }
                    // initialize bookmark's timer
                    if(this.state != 'pause' && this.isAudioLoaded == true) {
                        this.setTimer(bookmark);
                    }
                    if(isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark)) {
                        ;
                    }
                    // start new EllipticalZoom animation if needed
                    this.currentPlace.animationId = this.zoomTo(getBookmarkVisible(bookmark), this.onGoToSuccess, this.onGoToFailure, bookmark.url);
                }
                /*
                Resumes/starts audio narration for bookmark.
                @param bookmark         (bookmark) bookmark which audio narration part should be played.
                */
                function startBookmarkAudio(bookmark) {
                    if(isToursDebugEnabled && window.console && console.log("playing source: " + this.audio.currentSrc)) {
                        ;
                    }
                    this.audio.pause();
                    // set audio track's time to time when this bookmark was paused (beginning of bookmark if it wasn't paused)
                    try  {
                        this.audio.currentTime = bookmark.lapseTime + bookmark.elapsed;
                        if(isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed))) {
                            ;
                        }
                    } catch (ex) {
                        if(window.console && console.error("currentTime assignment: " + ex)) {
                            ;
                        }
                    }
                    if(isToursDebugEnabled && window.console && console.log("audio element is forced to play")) {
                        ;
                    }
                    this.audio.play();
                }
                /*
                Sets up the transition to the next bookmark timer. Resets the currently active one.
                */
                function setTimer(bookmark) {
                    // clear active timer
                    if(this.timerOnBookmarkIsOver) {
                        clearTimeout(this.timerOnBookmarkIsOver);
                    }
                    // calculate time to the end of active bookmark
                    var duration = bookmark.duration;
                    if(bookmark.elapsed != 0) {
                        duration = Math.max(duration - bookmark.elapsed, 0);
                    }
                    // save start time
                    this.currentPlace.startTime = new Date().getTime();
                    if(isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds")) {
                        ;
                    }
                    // activate new timer
                    this.timerOnBookmarkIsOver = setTimeout(this.onBookmarkIsOver, duration * 1000/* ms */ );
                }
                // Zoom animation callbacks:
                function onGoToSuccess(animationId) {
                    // we've finished zooming into the bookmark
                    // the function is called only when state is play and currentPlace is goto, otherwise we are paused
                    if(!this.currentPlace || this.currentPlace.animationId == undefined || this.currentPlace.animationId != animationId) {
                        // callback is obsolete
                        return;
                    }
                    var curURL = ChronoZoom.UrlNav.getURL();
                    if(typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = new Array();
                    }
                    curURL.hash.params["tour"] = Tours.tour.sequenceNum;
                    //curURL.hash.params["bookmark"] = self.currentPlace.bookmark+1;
                    //This flag is used to overcome hashchange event handler
                    ChronoZoom.Common.hashHandle = false;
                    ChronoZoom.UrlNav.setURL(curURL);
                    if(isToursDebugEnabled && window.console && console.log("reached the bookmark index " + this.currentPlace.bookmark)) {
                        ;
                    }
                    this.currentPlace = {
                        type: 'bookmark',
                        bookmark: this.currentPlace.bookmark
                    };
                    //start the audio after the transition to the first bookmark if not paused
                    if(this.currentPlace.bookmark == 0) {
                        // raise bookmark started callback functions
                        var bookmark = this.bookmarks[this.currentPlace.bookmark];
                        this.RaiseBookmarkStarted(bookmark);
                        if(this.state != 'pause') {
                            if(this.isAudioLoaded != true) {
                                // stop tour if audio is not ready yet
                                tourPause();
                            } else {
                                // audio is ready
                                this.setTimer(bookmark);
                                if(this.isAudioEnabled) {
                                    this.startBookmarkAudio(bookmark);
                                }
                            }
                        }
                    }
                }
                ;
function onGoToFailure(animationId) {
                    // we've been interrupted during zoom to the bookmark
                    // the function is called only when state is play and currentPlace is goto, otherwise we are paused
                    if(!this.currentPlace || this.currentPlace.animationId == undefined || this.currentPlace.animationId != animationId) {
                        // callback is obsolete
                        return;
                    }
                    // pause tour
                    this.pause();
                    if(isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition")) {
                        ;
                    }
                }
                ;
function play() {
                    if(this.state !== 'pause') {
                        return;
                    }
                    // first we go to the bookmark and then continue play it
                    if(isToursDebugEnabled && window.console && console.log("tour playback activated")) {
                        ;
                    }
                    this.state = 'play';
                    var visible = this.vc.virtualCanvas("getViewport").visible;
                    if(this.currentPlace != null && this.currentPlace.bookmark != null && ChronoZoom.Common.compareVisibles(visible, getBookmarkVisible(this.bookmarks[this.currentPlace.bookmark]))) {
                        // current visible is equal to visible of bookmark
                        this.currentPlace = {
                            type: 'bookmark',
                            bookmark: this.currentPlace.bookmark
                        };
                    } else {
                        // current visible is not equal to visible of bookmark, animation is required
                        this.currentPlace = {
                            type: 'goto',
                            bookmark: this.currentPlace.bookmark
                        };
                    }
                    var bookmark = this.bookmarks[this.currentPlace.bookmark];
                    // indicates if animation to first bookmark is required
                    var isInTransitionToFirstBookmark = (this.currentPlace.bookmark == 0 && this.currentPlace.type == 'goto');
                    // transition to bookmark is over OR not in process of transition to first bookmark => start bookmark
                    if(this.currentPlace.type == 'bookmark' || this.currentPlace.bookmark != 0) {
                        this.RaiseBookmarkStarted(bookmark);
                        // start bookmark' timer & audio narration if audio is ready
                        if(this.isAudioLoaded == true) {
                            this.setTimer(bookmark);
                            if(this.isAudioEnabled) {
                                this.startBookmarkAudio(bookmark);
                            }
                        }
                    }
                    this.currentPlace.animationId = this.zoomTo(getBookmarkVisible(bookmark), this.onGoToSuccess, this.onGoToFailure, bookmark.url);
                    // raise tourStarted callback functions
                    if(this.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
                        this.RaiseTourStarted();
                    }
                    var curURL = ChronoZoom.UrlNav.getURL();
                    if(typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = new Array();
                    }
                    if(typeof curURL.hash.params["tour"] == 'undefined') {
                        curURL.hash.params["tour"] = Tours.tour.sequenceNum;
                        //This flag is used to overcome hashchange event handler
                        ChronoZoom.Common.hashHandle = false;
                        ChronoZoom.UrlNav.setURL(curURL);
                    }
                }
                ;
function pause() {
                    if(this.state !== 'play') {
                        return;
                    }
                    if(isToursDebugEnabled && window.console && console.log("tour playback paused")) {
                        ;
                    }
                    if(this.isAudioEnabled && this.isTourPlayRequested) {
                        this.isTourPlayRequested = false;
                    }
                    // clear active bookmark timer
                    if(this.timerOnBookmarkIsOver) {
                        clearTimeout(this.timerOnBookmarkIsOver);
                        this.timerOnBookmarkIsOver = undefined;
                    }
                    this.state = 'pause';
                    if(this.isAudioEnabled) {
                        this.audio.pause();
                        if(isToursDebugEnabled && window.console && console.log("audio element is forced to pause")) {
                            ;
                        }
                    }
                    var bookmark = this.bookmarks[this.currentPlace.bookmark];
                    // save the time when bookmark was paused
                    if(this.currentPlace.startTime) {
                        bookmark.elapsed += (new Date().getTime() - this.currentPlace.startTime) / 1000;
                    }// sec
                    
                }
                ;
function next() {
                    // goes to the next bookmark
                    // ignore if last bookmark
                    if(this.currentPlace.bookmark != this.bookmarks.length - 1) {
                        if(this.state === 'play') {
                            // clear active bookmark timer
                            if(this.timerOnBookmarkIsOver) {
                                clearTimeout(this.timerOnBookmarkIsOver);
                            }
                            this.timerOnBookmarkIsOver = undefined;
                        }
                        this.onBookmarkIsOver(false)// goes to the next bookmark
                        ;
                    }
                }
                ;
function prev() {
                    // goes to the previous bookmark
                    // ignore if first bookmark
                    if(this.currentPlace.bookmark == 0) {
                        //self.currentPlace = { type: 'goto', bookmark: 0, animationId: self.currentPlace.animationId };
                        return;
                    }
                    if(this.state === 'play') {
                        // clear active bookmark timer
                        if(this.timerOnBookmarkIsOver) {
                            clearTimeout(this.timerOnBookmarkIsOver);
                        }
                        this.timerOnBookmarkIsOver = undefined;
                    }
                    this.onBookmarkIsOver(true)// goes to the prev bookmark
                    ;
                }
                ;
                // public properties
                function getBookmark() {
                    return this.bookmarks[this.currentPlace.bookmark];
                }
                ;
                // calls every bookmarkStarted callback function
                function RaiseBookmarkStarted(bookmark) {
                    if(this.tour_BookmarkStarted.length > 0) {
                        for(var i = 0; i < this.tour_BookmarkStarted.length; i++) {
                            this.tour_BookmarkStarted[i](self, bookmark);
                        }
                    }
                }
                // calls every bookmarkFinished callback function
                function RaiseBookmarkFinished(bookmark) {
                    if(this.tour_BookmarkFinished.length > 0) {
                        for(var i = 0; i < this.tour_BookmarkFinished.length; i++) {
                            this.tour_BookmarkFinished[i](self, bookmark);
                        }
                    }
                }
                // calls every tourStarted callback function
                function RaiseTourStarted() {
                    if(this.tour_TourStarted.length > 0) {
                        for(var i = 0; i < this.tour_TourStarted.length; i++) {
                            this.tour_TourStarted[i](self);
                        }
                    }
                }
                // calls every tourFinished callback function
                function RaiseTourFinished() {
                    if(this.tour_TourFinished.length > 0) {
                        for(var i = 0; i < this.tour_TourFinished.length; i++) {
                            this.tour_TourFinished[i](self);
                        }
                    }
                }
            }
            return Tour;
        })();
        Tours.Tour = Tour;        
        /*
        Activates tour contol UI.
        @param    tour (Tour). A tour to play.
        @param    isAudioEnabled (Boolean) Whether to play audio during the tour or not
        */
        function activateTour(newTour, isAudioEnabled) {
            if(newTour != undefined) {
                var tourControlDiv = document.getElementById("tour_control");
                tourControlDiv.style.display = "block";
                Tours.tour = newTour;
                // add new tourFinished callback function
                Tours.tour.tour_TourFinished.push(function (tour) {
                    this.hideBookmark(tour);
                    this.tourPause();
                    this.hideBookmarks();
                });
                Tours.tour.toggleAudio(isAudioEnabled);
                // reset pause time for every bookmark
                for(var i = 0; i < Tours.tour.bookmarks.length; i++) {
                    Tours.tour.bookmarks[i].elapsed = 0;
                }
                // reset active tour' bookmark
                Tours.tour.currentPlace.bookmark = 0;
                // don't need to load audio if audio narration is off
                if(isAudioEnabled == true) {
                    Tours.tour.ReinitializeAudio();
                    Tours.tour.isAudioLoaded = true;
                }
                // start a tour
                tourResume();
            }
        }
        Tours.activateTour = activateTour;
        /*
        Diactivates a tour. Removes all tour controlls.
        */
        function removeActiveTour() {
            // stop active tour
            if(Tours.tour) {
                Tours.tour.tourPause();
            }
            this.isTourPlayRequested = false;
            // hide tour' UI
            var tourControlDiv = document.getElementById("tour_control");
            tourControlDiv.style.display = "none";
            if(Tours.tour) {
                Tours.tour.hideBookmarks();
                $("#bookmarks .header").html("");
                // remove audio track
                if(Tours.tour.audio) {
                    Tours.tour.audio = undefined;
                }
            }
            // reset active tour
            Tours.tour = undefined;
        }
        /*
        Handling of prev button click in UI
        */
        function tourPrev() {
            if(Tours.tour != undefined) {
                Tours.tour.prev();
            }
        }
        Tours.tourPrev = tourPrev;
        /*
        Handling of next button click in UI
        */
        function tourNext() {
            if(Tours.tour != undefined) {
                Tours.tours.tour.next();
            }
        }
        Tours.tourNext = tourNext;
        /*
        switch the tour in the paused state
        */
        function tourPause() {
            if(Tours.tour != undefined) {
                $("#tour_playpause").attr("src", "Images/tour_play_off.jpg");
                // pause tour
                Tours.tour.pause();
                // stop active animation
                ChronoZoom.Common.controller.stopAnimation();
                // remove animation callbacks
                Tours.tour.tourBookmarkTransitionInterrupted = undefined;
                Tours.tour.tourBookmarkTransitionCompleted = undefined;
            }
        }
        Tours.tourPause = tourPause;
        /*
        switch the tour in the running state
        */
        function tourResume() {
            $("#tour_playpause").attr("src", "Images/tour_pause_off.jpg");
            Tours.tour.play();
        }
        /*
        Handling of play/pause button click in UI
        */
        function tourPlayPause() {
            if(Tours.tour != undefined) {
                if(Tours.tour.state == "pause") {
                    tourResume();
                } else if(Tours.tour.state == "play") {
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
        Tours.tourPlayPause = tourPlayPause;
        /*
        Handling of close button click in UI.
        */
        function tourAbort() {
            // close tour and hide all tour' UI elements
            removeActiveTour();
            $("#bookmarks").hide();
            Tours.isBookmarksWindowVisible = false;
            var curURL = ChronoZoom.UrlNav.getURL();
            delete curURL.hash.params["tour"];
            delete curURL.hash.params["bookmark"];
            ChronoZoom.UrlNav.setURL(curURL);
        }
        Tours.tourAbort = tourAbort;
        function initializeToursUI() {
            $("#tours").hide();
            // Bookmarks window
            hideBookmarks();
        }
        Tours.initializeToursUI = initializeToursUI;
        function initializeToursContent() {
            var toursUI = $('#tours-content');
            Tours.tours.sort(function (u, v) {
                return u.sequenceNum - v.sequenceNum;
            });
            var category = null;
            var categoryContent;
            // add every tour in a categoried list in tours panel
            for(var i = 0; i < Tours.tours.length; i++) {
                var tour = Tours.tours[i];
                // add new bookmarkStarted callback function
                tour.tour_BookmarkStarted.push(function (t, bookmark) {
                    showBookmark(t, bookmark);
                });
                // add new bookmarkFinished callback function
                tour.tour_BookmarkFinished.push(function (t, bookmark) {
                    hideBookmark(t);
                });
                // add new category to tours menu
                if(tour.category !== category) {
                    var cat = $('<div class="category">' + tour.category + '</div>').appendTo(toursUI);
                    // add category' UI
                    var img = $('<img src="Images/collapse-down.png" class="collapseButton" />').appendTo(cat);
                    if(i == 0) {
                        cat.removeClass('category').addClass('categorySelected');
                        (img[0]).src = "Images/collapse-up.png";
                    }
                    categoryContent = $('<div class="itemContainer"></div>').appendTo(toursUI);
                    category = tour.category;
                }
                // add tour element into category
                $('<div class="item" tour="' + i + '">' + tour.title + '</div>').appendTo(categoryContent).click(function () {
                    // click event handler for added tour element
                    // close active tour
                    removeActiveTour();
                    // hide tour UI
                    $("#tours").hide('slide', {
                    }, 'slow');
                    ChronoZoom.Common.toggleOffImage('tours_index');
                    Tours.isTourWindowVisible = false;
                    // activate selected tour
                    var mytour = Tours.tours[this.getAttribute("tour")];
                    activateTour(mytour, Tours.isNarrationOn);
                    // deselect previously active tour in tours panel
                    $(".touritem-selected").removeClass("touritem-selected", "slow");
                    // mark this tour as selected in tours panel
                    $(this).addClass("touritem-selected", "slow");
                });
            }
            // create jquery widget for category' content sliding
            ($)("#tours-content").accordion({
                fillSpace: false,
                collapsible: true,
                autoHeight: false
            });
            // binding click at the tour category' expand button
            $("#tours-content").bind("accordionchangestart", function (event, ui) {
                if(ui.newHeader) {
                    ui.newHeader.removeClass('category');
                    ui.newHeader.addClass('categorySelected');
                    var img = ($(".collapseButton", ui.newHeader)[0]);
                    if(img) {
                        img.src = "Images/collapse-up.png";
                    }
                }
                if(ui.oldHeader) {
                    ui.oldHeader.removeClass('categorySelected');
                    ui.oldHeader.addClass('category');
                    var img = ($(".collapseButton", ui.oldHeader)[0]);
                    if(img) {
                        img.src = "Images/collapse-down.png";
                    }
                }
            });
        }
        Tours.initializeToursContent = initializeToursContent;
        /*
        Hides bookmark description text.
        */
        function hideBookmark(tour) {
            if(Tours.isBookmarksWindowExpanded && Tours.isBookmarksTextShown) {
                // end active sliding animation
                if(Tours.bookmarkAnimation) {
                    Tours.bookmarkAnimation.stop(true, true);
                }
                // start new animation
                Tours.bookmarkAnimation = $("#bookmarks .slideText").hide("drop", {
                }, 'slow', function () {
                    Tours.bookmarkAnimation = undefined;
                });
                $("#bookmarks .slideHeader").html("");
                Tours.isBookmarksTextShown = false;
            }
        }
        /*
        Shows bookmark description text.
        */
        function showBookmark(tour, bookmark) {
            if(!Tours.isBookmarksWindowVisible) {
                Tours.isBookmarksWindowVisible = true;
                // todo: check whether the bookmarks are expanded
                $("#bookmarks .slideText").html(bookmark.text);
                $("#bookmarks").show('slide', {
                }, 'slow');
            }
            $("#bookmarks .header").html(tour.title);
            $("#bookmarks .slideHeader").html(bookmark.caption);
            $("#bookmarks .slideFooter").html(bookmark.number + '/' + tour.bookmarks.length);
            if(Tours.isBookmarksWindowExpanded) {
                $("#bookmarks .slideText").html(bookmark.text);
                if(!Tours.isBookmarksTextShown) {
                    // stop active sliding animation
                    if(Tours.bookmarkAnimation) {
                        Tours.bookmarkAnimation.stop(true, true);
                    }
                    // start new animation
                    Tours.bookmarkAnimation = $("#bookmarks .slideText").show("drop", {
                    }, 'slow', function () {
                        Tours.bookmarkAnimation = undefined;
                    });
                    Tours.isBookmarksTextShown = true;
                }
            } else {
                $("#bookmarks .slideText").html(bookmark.text);
            }
        }
        /*
        Closes bookmark description window.
        */
        function hideBookmarks() {
            $("#bookmarks").hide();
            Tours.isBookmarksWindowVisible = false;
        }
        /*
        Tours button handler.
        */
        function onTourClicked() {
            if(ChronoZoom.Search.isSearchWindowVisible) {
                ChronoZoom.Search.onSearchClicked();
            }
            if(Tours.isTourWindowVisible) {
                ChronoZoom.Common.toggleOffImage('tours_index');
                $("#tours").hide('slide', {
                }, 'slow');
            } else {
                ChronoZoom.Common.toggleOnImage('tours_index');
                $("#tours").show('slide', {
                }, 'slow');
            }
            Tours.isTourWindowVisible = !Tours.isTourWindowVisible;
        }
        Tours.onTourClicked = onTourClicked;
        /* Highlights the tour button in the top menu */
        function tourButtonHighlight(isOn) {
            if(isOn) {
                ChronoZoom.Common.toggleOnImage('tours_index');
            } else {
                if(!Tours.isTourWindowVisible) {
                    ChronoZoom.Common.toggleOffImage('tours_index');
                }
            }
        }
        Tours.tourButtonHighlight = tourButtonHighlight;
        /*
        Collapses bookmark description window.
        */
        function collapseBookmarks() {
            if(!Tours.isBookmarksWindowExpanded) {
                return;
            }
            Tours.isBookmarksWindowExpanded = false;
            $("#bookmarks .header").hide('slide', {
            }, 'fast');
            $("#bookmarks .slideHeader").hide('slide', {
            }, 'fast');
            $("#bookmarks .slideText").hide('slide', {
            }, 'fast');
            $("#bookmarks .slideFooter").hide('slide', {
            }, 'fast');
            $("#bookmarks").effect('size', {
                to: {
                    width: 30
                }
            }, 'fast');
            $("#bookmarksCollapse").attr("src", "Images/expand-right.png");
        }
        /*
        Expands bookmark description window.
        */
        function expandBookmarks() {
            if(Tours.isBookmarksWindowExpanded) {
                return;
            }
            Tours.isBookmarksWindowExpanded = true;
            //$("#bookmarks").switchClass('bookmarksWindow', 'bookmarksWindowCollapsed', 'slow',
            $("#bookmarks").effect('size', {
                to: {
                    width: '200px',
                    height: 'auto'
                }
            }, 'slow', function () {
                $("#bookmarks").css('height', 'auto');
                $("#bookmarks .header").show('slide', {
                }, 'fast');
                $("#bookmarks .slideHeader").show('slide', {
                }, 'fast');
                $("#bookmarks .slideText").show('slide', {
                }, 'fast');
                $("#bookmarks .slideFooter").show('slide', {
                }, 'fast');
            });
            $("#bookmarksCollapse").attr("src", "Images/collapse-left.png");
        }
        /*
        Collapses/expands bookmark description window.
        */
        function onBookmarksCollapse() {
            if(!Tours.isBookmarksWindowExpanded) {
                expandBookmarks();
            } else {
                collapseBookmarks();
            }
        }
        Tours.onBookmarksCollapse = onBookmarksCollapse;
        /*
        Handles click in tour narration window.
        */
        function onNarrationClick() {
            if(Tours.isNarrationOn) {
                $("#tours-narration-on").removeClass("narration-selected", "slow");
                $("#tours-narration-off").addClass("narration-selected", "slow");
            } else {
                $("#tours-narration-on").addClass("narration-selected", "slow");
                $("#tours-narration-off").removeClass("narration-selected", "slow");
            }
            Tours.isNarrationOn = !Tours.isNarrationOn;
        }
        Tours.onNarrationClick = onNarrationClick;
        /*
        Called after successful response from tours request.
        @param content      (array) an array of tours that were returned by request
        */
        function parseTours(content) {
            Tours.tours = new Array();
            // build array of tours that could be played
            for(var i = 0; i < content.d.length; i++) {
                var areBookmarksValid = true;// indicates whether all bookmarks are correct or not
                
                var tourString = content.d[i];
                // skip tours with invalid parameters
                if((typeof tourString.bookmarks == 'undefined') || (typeof tourString.AudioBlobUrl == 'undefined') || (tourString.AudioBlobUrl == undefined) || (tourString.AudioBlobUrl == null) || (typeof tourString.Category == 'undefined') || (typeof tourString.Name == 'undefined') || (typeof tourString.Sequence == 'undefined')) {
                    continue;
                }
                // build array of bookmarks of current tour
                var tourBookmarks = new Array();
                for(var j = 0; j < tourString.bookmarks.length; j++) {
                    var bmString = tourString.bookmarks[j];
                    // break if at least one bookmarks has invalid parameters
                    if((typeof bmString.Description == 'undefined') || (typeof bmString.LapseTime == 'undefined') || (typeof bmString.Name == 'undefined') || (typeof bmString.URL == 'undefined')) {
                        areBookmarksValid = false;
                        break;
                    }
                    // cut unnecessary part of bookmark's URL
                    var bmURL = bmString.URL;
                    if(bmURL.indexOf("#") != -1) {
                        bmURL = bmURL.substring(bmURL.indexOf("#") + 1);
                    }
                    tourBookmarks.push(new TourBookmark(bmURL, bmString.Name, bmString.LapseTime, bmString.Description));
                }
                // skip tour with broken bookmarks
                if(!areBookmarksValid) {
                    continue;
                }
                // tour is correct and can be played
                Tours.tours.push(new Tour(tourString.Name, tourBookmarks, bookmarkTransition, ChronoZoom.Common.vc, tourString.Category, tourString.AudioBlobUrl, tourString.Sequence));
            }
        }
        Tours.parseTours = parseTours;
        /*
        Bookmark' transition handler function to be passed to tours.
        */
        function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
            Tours.tourBookmarkTransitionCompleted = onCompleted// reinitialize animation completed handler for bookmark' transition
            ;
            Tours.tourBookmarkTransitionInterrupted = onInterrupted// reinitialize animation interrupted handler for bookmark' transition
            ;
            Tours.pauseTourAtAnyAnimation = false;
            // id of this bookmark' transition animation
            var animId = ChronoZoom.Common.setVisible(visible);
            if(animId && bookmark) {
                ChronoZoom.Common.setNavigationStringTo = {
                    bookmark: bookmark,
                    id: animId
                };
            }
            return animId;
        }
        function loadTourFromURL() {
            var curURL = ChronoZoom.UrlNav.getURL();
            if((typeof curURL.hash.params !== 'undefined') && (curURL.hash.params["tour"] > Tours.tours.length)) {
                return;
            }
            if(typeof curURL.hash.params !== 'undefined' && typeof curURL.hash.params["tour"] !== 'undefined') {
                if(Tours.tours.tours == null) {
                    initializeToursContent();
                }
                if(Tours.isTourWindowVisible) {
                    onTourClicked();
                }
                //var mytour = tours[curURL.hash.params["tour"] - 1];
                Tours.tour = Tours.tours[curURL.hash.params["tour"] - 1];
                $(".touritem-selected").removeClass("touritem-selected", "slow");
                activateTour(Tours.tour, true);
                if(Tours.tour.audio) {
                    // pause unwanted audio playback
                    Tours.tour.audio.pause();
                    // prohibit unwated audio playback after loading of audio
                    Tours.tour.audio.preload = "none";
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
        Tours.loadTourFromURL = loadTourFromURL;
    })(ChronoZoom.Tours || (ChronoZoom.Tours = {}));
    var Tours = ChronoZoom.Tours;
})(ChronoZoom || (ChronoZoom = {}));
