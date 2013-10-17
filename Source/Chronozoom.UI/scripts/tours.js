/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='../ui/tourslist-form.ts' />
/// <reference path='../ui/tour-caption-form.ts' />
/// <reference path='urlnav.ts'/>
/// <reference path='common.ts'/>
var CZ;
(function (CZ) {
    (function (Tours) {
        Tours.isTourWindowVisible = false;
        var isBookmarksWindowVisible = false;
        var isBookmarksWindowExpanded = true;
        var isBookmarksTextShown = true;
        Tours.isNarrationOn = true;

        Tours.tours;
        Tours.tour;
        Tours.tourBookmarkTransitionCompleted;
        Tours.tourBookmarkTransitionInterrupted;

        Tours.pauseTourAtAnyAnimation = false;

        var bookmarkAnimation;

        var isToursDebugEnabled = false;

        Tours.TourEndMessage = "Thank you for watching this tour!";

        Tours.tourCaptionFormContainer;
        Tours.tourCaptionForm;

        /* TourBookmark represents a place in the virtual space with associated audio.
        @param url  (string) Url that contains a state of the virtual canvas
        @param caption (string) text describing the bookmark
        @param lapseTime (number) a position in the audiotreck of the bookmark in seconds
        */
        var TourBookmark = (function () {
            function TourBookmark(url, caption, lapseTime, text) {
                this.url = url;
                this.caption = caption;
                this.lapseTime = lapseTime;
                this.text = text;
                this.duration = undefined;
                this.elapsed = 0;
                if (this.text === null) {
                    this.text = "";
                }
            }
            return TourBookmark;
        })();
        Tours.TourBookmark = TourBookmark;

        /*
        @returns VisibleRegion2d for the bookmark
        */
        function getBookmarkVisible(bookmark) {
            return CZ.UrlNav.navStringToVisible(bookmark.url, CZ.Common.vc);
        }
        Tours.getBookmarkVisible = getBookmarkVisible;

        function hasActiveTour() {
            return Tours.tour != undefined;
        }
        Tours.hasActiveTour = hasActiveTour;

        function bookmarkUrlToElement(bookmarkUrl) {
            var element = CZ.UrlNav.navStringTovcElement(bookmarkUrl, CZ.Common.vc.virtualCanvas("getLayerContent"));
            if (!element)
                return null;
            return element;
        }
        Tours.bookmarkUrlToElement = bookmarkUrlToElement;

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
            function Tour(id, title, bookmarks, zoomTo, vc, category, audio, sequenceNum, description) {
                this.id = id;
                this.title = title;
                this.bookmarks = bookmarks;
                this.zoomTo = zoomTo;
                this.vc = vc;
                this.category = category;
                this.audio = audio;
                this.sequenceNum = sequenceNum;
                this.description = description;
                this.tour_BookmarkStarted = [];
                this.tour_BookmarkFinished = [];
                this.tour_TourStarted = [];
                this.tour_TourFinished = [];
                this.state = 'pause';
                this.currentPlace = { type: 'goto', bookmark: 0, startTime: null, animationId: null };
                this.isTourPlayRequested = false;
                this.isAudioLoaded = false;
                this.isAudioEnabled = false;
                if (!bookmarks || bookmarks.length == 0) {
                    throw "Tour has no bookmarks";
                }

                var self = this;
                this.thumbnailUrl = CZ.Settings.contentItemThumbnailBaseUri + id + '.jpg';

                //ordering the bookmarks by the lapsetime
                bookmarks.sort(function (b1, b2) {
                    return b1.lapseTime - b2.lapseTime;
                });

                for (var i = 1; i < bookmarks.length; i++) {
                    bookmarks[i - 1].number = i;
                    bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
                }
                bookmarks[bookmarks.length - 1].duration = 10;
                bookmarks[bookmarks.length - 1].number = bookmarks.length;

                /*
                Enables or disables an audio playback of the tour.
                @param isOn (Boolean) whether the audio is enabled
                */
                self.toggleAudio = function toggleAudio(isOn) {
                    if (isOn && self.audio)
                        self.isAudioEnabled = true;
else
                        self.isAudioEnabled = false;
                };

                self.ReinitializeAudio = function ReinitializeAudio() {
                    if (!self.audio)
                        return;

                    if (self.audioElement) {
                        self.audioElement.pause();
                    }

                    self.audioElement = undefined;

                    self.isAudioLoaded = false;

                    // reinitialize audio element
                    self.audioElement = document.createElement('audio');

                    self.audioElement.addEventListener("loadedmetadata", function () {
                        if (self.audioElement.duration != Infinity)
                            self.bookmarks[self.bookmarks.length - 1].duration = self.audioElement.duration - self.bookmarks[self.bookmarks.length - 1].lapseTime;
                        if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)"))
                            ;
                    });
                    self.audioElement.addEventListener("canplaythrough", function () {
                        // audio track is fully loaded
                        self.isAudioLoaded = true;

                        if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4"))
                            ;
                    });
                    self.audioElement.addEventListener("progress", function () {
                        if (self.audioElement && self.audioElement.buffered.length > 0)
                            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (self.audioElement.buffered.end(self.audioElement.buffered.length - 1) / self.audioElement.duration)))
                                ;
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
                    if (isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued"))
                        ;
                };

                /*
                Raises that bookmark playback is over. Called only if state is "play" and currentPlace is bookmark
                @param goBack (boolen) specifies the direction to move (prev - true, next - false)
                */
                self.onBookmarkIsOver = function onBookmarkIsOver(goBack) {
                    self.bookmarks[self.currentPlace.bookmark].elapsed = 0;

                    if ((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
                        // reset tour state
                        self.state = 'pause';
                        self.currentPlace = { type: 'goto', bookmark: 0 };
                        self.RaiseTourFinished();
                    } else {
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

                    if (goBack) {
                        newBookmark = Math.max(0, newBookmark - 1);
                    } else {
                        newBookmark = Math.min(self.bookmarks.length - 1, newBookmark + 1);
                    }

                    // raise bookmark finished callback functions
                    self.RaiseBookmarkFinished(oldBookmark);

                    // change current position in tour and start EllipticalZoom animation
                    self.currentPlace = { type: 'goto', bookmark: newBookmark };

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    if (newBookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);

                        if (self.isAudioEnabled && self.state === 'play' && self.isAudioLoaded == true)
                            self.startBookmarkAudio(bookmark);
                    }

                    if (self.state != 'pause' && self.isAudioLoaded == true)
                        self.setTimer(bookmark);

                    if (isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark))
                        ;

                    var targetVisible = getBookmarkVisible(bookmark);

                    if (!targetVisible) {
                        if (isToursDebugEnabled && window.console && console.log("bookmark index " + newBookmark + " references to nonexistent item"))
                            ;

                        // skip nonexistent bookmark
                        goBack ? self.prev() : self.next();
                        return;
                        //self.goToTheNextBookmark(goBack);
                    }

                    // start new EllipticalZoom animation if needed
                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);
                };

                /*
                Resumes/starts audio narration for bookmark.
                @param bookmark         (bookmark) bookmark which audio narration part should be played.
                */
                self.startBookmarkAudio = function startBookmarkAudio(bookmark) {
                    if (!self.audio)
                        return;
                    if (isToursDebugEnabled && window.console && console.log("playing source: " + self.audioElement.currentSrc))
                        ;

                    self.audioElement.pause();

                    try  {
                        self.audioElement.currentTime = bookmark.lapseTime + bookmark.elapsed;
                        if (isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed)))
                            ;
                    } catch (ex) {
                        if (window.console && console.error("currentTime assignment: " + ex))
                            ;
                    }

                    if (isToursDebugEnabled && window.console && console.log("audio element is forced to play"))
                        ;

                    self.audioElement.play();
                };

                /*
                Sets up the transition to the next bookmark timer. Resets the currently active one.
                */
                self.setTimer = function setTimer(bookmark) {
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

                    if (isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds"))
                        ;

                    // activate new timer
                    self.timerOnBookmarkIsOver = setTimeout(self.onBookmarkIsOver, duration * 1000);
                };

                // Zoom animation callbacks:
                self.onGoToSuccess = function onGoToSuccess(animationId) {
                    if (!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId)
                        return;

                    var curURL = CZ.UrlNav.getURL();
                    if (typeof curURL.hash.params == 'undefined')
                        curURL.hash.params = [];
                    curURL.hash.params["tour"] = Tours.tour.sequenceNum;

                    //curURL.hash.params["bookmark"] = self.currentPlace.bookmark+1;
                    //This flag is used to overcome hashchange event handler
                    CZ.Common.hashHandle = false;
                    CZ.UrlNav.setURL(curURL);

                    if (isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark))
                        ;

                    self.currentPlace = { type: 'bookmark', bookmark: self.currentPlace.bookmark };

                    if (self.currentPlace.bookmark == 0) {
                        // raise bookmark started callback functions
                        var bookmark = self.bookmarks[self.currentPlace.bookmark];
                        self.RaiseBookmarkStarted(bookmark);

                        if (self.state != 'pause') {
                            if (self.isAudioLoaded != true) {
                                tourPause();
                            } else {
                                self.setTimer(bookmark);
                                if (self.isAudioEnabled) {
                                    self.startBookmarkAudio(bookmark);
                                }
                            }
                        }
                    }
                };

                self.onGoToFailure = function onGoToFailure(animationId) {
                    if (!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId)
                        return;

                    // pause tour
                    self.pause();

                    if (isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition"))
                        ;
                };

                self.play = function play() {
                    if (self.state !== 'pause') {
                        return;
                    }

                    if (isToursDebugEnabled && window.console && console.log("tour playback activated"))
                        ;
                    self.state = 'play';

                    var visible = self.vc.virtualCanvas("getViewport").visible;
                    var bookmarkVisible = getBookmarkVisible(self.bookmarks[self.currentPlace.bookmark]);

                    if (bookmarkVisible === null) {
                        self.next();
                        return;
                    }

                    if (self.currentPlace != null && self.currentPlace.bookmark != null && CZ.Common.compareVisibles(visible, bookmarkVisible)) {
                        // current visible is equal to visible of bookmark
                        self.currentPlace = { type: 'bookmark', bookmark: self.currentPlace.bookmark };
                    } else {
                        // current visible is not equal to visible of bookmark, animation is required
                        self.currentPlace = { type: 'goto', bookmark: self.currentPlace.bookmark };
                    }

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    showBookmark(Tours.tour, bookmark);

                    // indicates if animation to first bookmark is required
                    var isInTransitionToFirstBookmark = (self.currentPlace.bookmark == 0 && self.currentPlace.type == 'goto');

                    if (self.currentPlace.type == 'bookmark' || self.currentPlace.bookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);

                        if (self.isAudioLoaded == true) {
                            self.setTimer(bookmark);
                            if (self.isAudioEnabled) {
                                self.startBookmarkAudio(bookmark);
                            }
                        }
                    }

                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);

                    if (self.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
                        self.RaiseTourStarted();
                    }

                    var curURL = CZ.UrlNav.getURL();
                    if (typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = new Array();
                    }

                    if (typeof curURL.hash.params["tour"] == 'undefined') {
                        curURL.hash.params["tour"] = Tours.tour.sequenceNum;

                        //This flag is used to overcome hashchange event handler
                        CZ.Common.hashHandle = false;
                        CZ.UrlNav.setURL(curURL);
                    }
                };

                self.pause = function pause() {
                    if (self.state !== 'play')
                        return;

                    if (isToursDebugEnabled && window.console && console.log("tour playback paused"))
                        ;
                    if (self.isAudioEnabled && self.isTourPlayRequested)
                        self.isTourPlayRequested = false;

                    if (self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.state = 'pause';
                    if (self.isAudioEnabled) {
                        self.audioElement.pause();
                        if (isToursDebugEnabled && window.console && console.log("audio element is forced to pause"))
                            ;
                    }

                    var bookmark = self.bookmarks[self.currentPlace.bookmark];

                    if (self.currentPlace.startTime)
                        bookmark.elapsed += (new Date().getTime() - self.currentPlace.startTime) / 1000;
                };

                self.next = function next() {
                    if (self.state === 'play') {
                        if (self.timerOnBookmarkIsOver)
                            clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.onBookmarkIsOver(false);
                };

                self.prev = function prev() {
                    if (self.currentPlace.bookmark == 0) {
                        //self.currentPlace = <Place>{ type: 'bookmark', bookmark: self.currentPlace.bookmark };
                        return;
                    }
                    if (self.state === 'play') {
                        if (self.timerOnBookmarkIsOver)
                            clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }

                    self.onBookmarkIsOver(true);
                };

                // calls every bookmarkStarted callback function
                self.RaiseBookmarkStarted = function RaiseBookmarkStarted(bookmark) {
                    if (self.tour_BookmarkStarted.length > 0) {
                        for (var i = 0; i < self.tour_BookmarkStarted.length; i++)
                            self.tour_BookmarkStarted[i](self, bookmark);
                    }
                    showBookmark(this, bookmark);
                };

                // calls every bookmarkFinished callback function
                self.RaiseBookmarkFinished = function RaiseBookmarkFinished(bookmark) {
                    if (self.tour_BookmarkFinished.length > 0) {
                        for (var i = 0; i < self.tour_BookmarkFinished.length; i++)
                            self.tour_BookmarkFinished[i](self, bookmark);
                    }
                    hideBookmark(this);
                };

                // calls every tourStarted callback function
                self.RaiseTourStarted = function RaiseTourStarted() {
                    if (self.tour_TourStarted.length > 0) {
                        for (var i = 0; i < self.tour_TourStarted.length; i++)
                            self.tour_TourStarted[i](self);
                    }
                };

                // calls every tourFinished callback function
                self.RaiseTourFinished = function RaiseTourFinished() {
                    if (self.tour_TourFinished.length > 0) {
                        for (var i = 0; i < self.tour_TourFinished.length; i++)
                            self.tour_TourFinished[i](self);
                    }
                };
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
            if (isAudioEnabled == undefined)
                isAudioEnabled = Tours.isNarrationOn;

            if (newTour != undefined) {
                Tours.tour = newTour;

                // add new tourFinished callback function
                Tours.tour.tour_TourFinished.push(function (tour) {
                    showTourEndMessage();
                    tourPause();
                    hideBookmarks();
                });

                Tours.tour.toggleAudio(isAudioEnabled);

                for (var i = 0; i < Tours.tour.bookmarks.length; i++)
                    Tours.tour.bookmarks[i].elapsed = 0;

                // reset active tour' bookmark
                Tours.tour.currentPlace.bookmark = 0;

                if (isAudioEnabled == true) {
                    Tours.tour.ReinitializeAudio();
                    Tours.tour.isAudioLoaded = true;
                }

                // start a tour
                tourResume();
            }
        }
        Tours.activateTour = activateTour;

        /*
        Deactivates a tour. Removes all tour controls.
        */
        function removeActiveTour() {
            if (Tours.tour) {
                tourPause();
                Tours.tour.isTourPlayRequested = false;
            }

            if (Tours.tour) {
                hideBookmarks();
                $("#bookmarks .header").text("");

                if (Tours.tour.audioElement)
                    Tours.tour.audioElement = undefined;
            }

            // reset active tour
            Tours.tour = undefined;
        }
        Tours.removeActiveTour = removeActiveTour;

        /*
        Handling of prev button click in UI
        */
        function tourPrev() {
            if (Tours.tour != undefined) {
                Tours.tour.prev();
            }
        }
        Tours.tourPrev = tourPrev;

        /*
        Handling of next button click in UI
        */
        function tourNext() {
            if (Tours.tour != undefined) {
                Tours.tour.next();
            }
        }
        Tours.tourNext = tourNext;

        /*
        switch the tour in the paused state
        */
        function tourPause() {
            Tours.tourCaptionForm.setPlayPauseButtonState("play");
            if (Tours.tour != undefined) {
                $("#tour_playpause").attr("src", "/images/tour_play_off.jpg");

                // pause tour
                Tours.tour.pause();

                // stop active animation
                CZ.Common.controller.stopAnimation();

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
            Tours.tourCaptionForm.setPlayPauseButtonState("pause");
            $("#tour_playpause").attr("src", "/images/tour_pause_off.jpg");
            Tours.tour.play();
        }
        Tours.tourResume = tourResume;

        /*
        Handling of play/pause button click in UI
        */
        function tourPlayPause() {
            if (Tours.tour != undefined) {
                if (Tours.tour.state == "pause") {
                    tourResume();
                } else if (Tours.tour.state == "play") {
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
            isBookmarksWindowVisible = false;

            var curURL = CZ.UrlNav.getURL();
            if (curURL.hash.params["tour"]) {
                delete curURL.hash.params["tour"];
            }
            CZ.UrlNav.setURL(curURL);
        }
        Tours.tourAbort = tourAbort;

        function initializeToursUI() {
            $("#tours").hide();

            // Bookmarks window
            hideBookmarks();
        }
        Tours.initializeToursUI = initializeToursUI;

        function initializeToursContent() {
            Tours.tours.sort(function (u, v) {
                return u.sequenceNum - v.sequenceNum;
            });
        }
        Tours.initializeToursContent = initializeToursContent;

        /*
        Hides bookmark description text.
        */
        function hideBookmark(tour) {
            Tours.tourCaptionForm.hideBookmark();
        }

        function showTourEndMessage() {
            Tours.tourCaptionForm.showTourEndMessage();
        }

        /*
        Shows bookmark description text.
        */
        function showBookmark(tour, bookmark) {
            Tours.tourCaptionForm.showBookmark(bookmark);
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
        function onTourClicked() {
            if (CZ.Search.isSearchWindowVisible)
                CZ.Search.onSearchClicked();

            if (Tours.isTourWindowVisible) {
                $(".tour-icon").removeClass("active");
                $("#tours").hide('slide', {}, 'slow');
            } else {
                $(".tour-icon").addClass("active");
                $("#tours").show('slide', {}, 'slow');
            }
            Tours.isTourWindowVisible = !Tours.isTourWindowVisible;
        }
        Tours.onTourClicked = onTourClicked;

        /*
        Collapses bookmark description window.
        */
        function collapseBookmarks() {
            if (!isBookmarksWindowExpanded)
                return;
            isBookmarksWindowExpanded = false;
            $("#bookmarks .header").hide('slide', {}, 'fast');
            $("#bookmarks .slideHeader").hide('slide', {}, 'fast');
            $("#bookmarks .slideText").hide('slide', {}, 'fast');
            $("#bookmarks .slideFooter").hide('slide', {}, 'fast');
            $("#bookmarks").effect('size', { to: { width: '30px' } }, 'fast', function () {
                $("#bookmarks").css('width', '30px');
            });
            $("#bookmarksCollapse").attr("src", "/images/expand-right.png");
        }

        /*
        Expands bookmark description window.
        */
        function expandBookmarks() {
            if (isBookmarksWindowExpanded)
                return;
            isBookmarksWindowExpanded = true;

            //$("#bookmarks").switchClass('bookmarksWindow', 'bookmarksWindowCollapsed', 'slow',
            $("#bookmarks").effect('size', { to: { width: '200px', height: 'auto' } }, 'slow', function () {
                $("#bookmarks").css('width', '200px');
                $("#bookmarks").css('height', 'auto');
                $("#bookmarks .header").show('slide', {}, 'fast');
                $("#bookmarks .slideHeader").show('slide', {}, 'fast');
                $("#bookmarks .slideText").show('slide', {}, 'fast');
                $("#bookmarks .slideFooter").show('slide', {}, 'fast');
            });
            $("#bookmarksCollapse").attr("src", "/images/collapse-left.png");
        }

        /*
        Collapses/expands bookmark description window.
        */
        function onBookmarksCollapse() {
            if (!isBookmarksWindowExpanded) {
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
            if (Tours.isNarrationOn) {
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

            for (var i = 0; i < content.d.length; i++) {
                var areBookmarksValid = true;
                var tourString = content.d[i];

                if ((typeof tourString.bookmarks == 'undefined') || (typeof tourString.name == 'undefined') || (typeof tourString.sequence == 'undefined') || (tourString.bookmarks.length == 0))
                    continue;

                // build array of bookmarks of current tour
                var tourBookmarks = new Array();

                for (var j = 0; j < tourString.bookmarks.length; j++) {
                    var bmString = tourString.bookmarks[j];

                    if ((typeof bmString.description == 'undefined') || (typeof bmString.lapseTime == 'undefined') || (typeof bmString.name == 'undefined') || (typeof bmString.url == 'undefined')) {
                        areBookmarksValid = false;
                        break;
                    }

                    tourBookmarks.push(new TourBookmark(bmString.url, bmString.name, bmString.lapseTime, bmString.description));
                }

                if (!areBookmarksValid)
                    continue;

                // tour is correct and can be played
                var tour = new Tour(tourString.id, tourString.name, tourBookmarks, bookmarkTransition, CZ.Common.vc, tourString.category, tourString.audio, tourString.sequence, tourString.description);
                Tours.tours.push(tour);
            }
            $("body").trigger("toursInitialized");
        }
        Tours.parseTours = parseTours;

        /*
        Bookmark' transition handler function to be passed to tours.
        */
        function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
            Tours.tourBookmarkTransitionCompleted = onCompleted;
            Tours.tourBookmarkTransitionInterrupted = onInterrupted;

            Tours.pauseTourAtAnyAnimation = false;

            // id of this bookmark' transition animation
            var animId = CZ.Common.setVisible(visible);

            if (animId && bookmark) {
                CZ.Common.setNavigationStringTo = { bookmark: bookmark, id: animId };
            }
            return animId;
        }
        Tours.bookmarkTransition = bookmarkTransition;

        function loadTourFromURL() {
            var curURL = CZ.UrlNav.getURL();
            if ((typeof curURL.hash.params !== 'undefined') && (curURL.hash.params["tour"] > Tours.tours.length))
                return;

            if (typeof curURL.hash.params !== 'undefined' && typeof curURL.hash.params["tour"] !== 'undefined') {
                if (Tours.tours == null)
                    initializeToursContent();

                if (Tours.isTourWindowVisible) {
                    onTourClicked();
                }

                //var mytour = tours[curURL.hash.params["tour"] - 1];
                Tours.tour = Tours.tours[curURL.hash.params["tour"] - 1];

                $(".touritem-selected").removeClass("touritem-selected", "slow");

                activateTour(Tours.tour, true);

                if (Tours.tour.audio) {
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
                //$("#tour_playpause").attr("src", "images/tour_play_off.jpg");
            }
        }
        Tours.loadTourFromURL = loadTourFromURL;
    })(CZ.Tours || (CZ.Tours = {}));
    var Tours = CZ.Tours;
})(CZ || (CZ = {}));
