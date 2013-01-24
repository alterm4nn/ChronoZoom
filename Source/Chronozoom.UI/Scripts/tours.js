
var isTourWindowVisible = false;
var isBookmarksWindowVisible = false;
var isBookmarksWindowExpanded = true;
var isBookmarksTextShown = true;
var isNarrationOn = true;


var tours; // list of loaded tours
var tour; //an active tour. Undefined if no tour is active
var tourBookmarkTransitionCompleted; // a callbacks that is to be set by tour and to be called by animation framework
var tourBookmarkTransitionInterrupted;

var pauseTourAtAnyAnimation = false;

var bookmarkAnimation; // current animation of bookmark' description text sliding

var isToursDebugEnabled = false; // enables rebug output

/* TourBookmark represents a place in the virtual space with associated audio.
@param url  (string) Url that contains a state of the virtual canvas
@param caption (string) text describing the bookmark
@param lapseTime (number) a position in the audiotreck of the bookmark in seconds
*/
function TourBookmark(url, caption, lapseTime, text) {
    this.url = url;
    this.caption = caption;
    this.lapseTime = lapseTime;
    this.duration = undefined;
    this.text = text;
    this.number = 0;
    this.elapsed = 0; // number of seconds that were already played (if interrupted).
}

/*
@returns VisibleRegion2d for the bookmark
*/
function getBookmarkVisible(bookmark) {
    return navStringToVisible(bookmark.url, this.vc);
}


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
    this.category = category;
    this.vc = vc;
    this.sequenceNum = sequenceNum;

    this.tour_BookmarkStarted = [];
    this.tour_BookmarkFinished = [];
    this.tour_TourStarted = [];
    this.tour_TourFinished = [];

    var isAudioLoaded = false; //is set automaticly after the audio track is loaded
    var isAudioEnabled = false; //to be changed by toggleAudio function
    var isTourPlayRequested = false; //indicated whether the play should start after the data is loaded
    if (!bookmarks || bookmarks.length == 0) throw "Tour has no bookmarks";

    this.state = 'pause'; // possible states: play, pause, finished
    this.currentPlace = { type: 'goto', bookmark: 0 };

    var self = this;

    //ordering the bookmarks by the lapsetime
    bookmarks.sort(function (b1, b2) {
        return b1.lapseTime - b2.lapseTime;
    });

    var audio; // audio element of this tour

    isTourPlayRequested = false;

    for (var i = 1; i < bookmarks.length; i++) {  //calculating bookmarks durations        
        bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
        bookmarks[i - 1].number = i;
    }
    bookmarks[bookmarks.length - 1].duration = 10; //this will be overrided when the audio will be downloaded
    bookmarks[bookmarks.length - 1].number = bookmarks.length;

    var timerOnBookmarkIsOver;  // timer id which is set for bookmark complete event (stored to be able to cancel it if paused)

    /*
    Raises that bookmark playback is over. Called only if state is "play" and currentPlace is bookmark
    @param goBack (boolen) specifies the direction to move (prev - true, next - false)
    */
    var onBookmarkIsOver = function (goBack) {    

        self.bookmarks[self.currentPlace.bookmark].elapsed = 0; // reset bookmark's playback progress

        // Going to the next bookmark if we are not at the end
        if ((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
            // reset tour state
            self.state = 'pause';
            self.currentPlace = { type: 'goto', bookmark: 0 };
            RaiseTourFinished();
        }
        else {
            goToTheNextBookmark(goBack);
        }
    };

    /*
    Enables or disables an audio playback of the tour.
    @param isOn (Boolean) whether the audio is enabled
    */
    this.toggleAudio = function (isOn) {
        if (isOn)
            isAudioEnabled = true;
        else
            isAudioEnabled = false;
    }

    this.ReinitializeAudio = function () {
        // stop audio playback and clear audio element
        if (audio) {
            audio.pause();
        }
        audio = undefined;

        isAudioLoaded = false;
        // reinitialize audio element
        audio = document.createElement('audio');

        audio.addEventListener("loadedmetadata", function () {
            if (audio.duration != Infinity)
                bookmarks[bookmarks.length - 1].duration = audio.duration - bookmarks[bookmarks.length - 1].lapseTime; //overriding the last bookmark duration
            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)"));
        });
        audio.addEventListener("canplaythrough", function () {
            // audio track is fully loaded
            self.isAudioLoaded = true;

            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4"));
        });
        audio.addEventListener("progress", function () {
            if (audio.buffered.length > 0)
                if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (audio.buffered.end(audio.buffered.length - 1) / audio.duration)));
        });

        audio.controls = false;
        audio.autoplay = false;
        audio.loop = false;
        audio.volume = 1;

        audio.preload = "none";

        // add audio sources of different audio file extensions for audio element
        var blobPrefix = audioBlobUrl.substring(0, audioBlobUrl.length - 3);
        for (var i = 0; i < toursAudioFormats.length; i++) {
            var audioSource = document.createElement("Source");
            audioSource.setAttribute("src", blobPrefix + toursAudioFormats[i].ext);
            if (toursAudioFormats[i].type)
                audioSource.setAttribute("type", toursAudioFormats[i].type);
            audio.appendChild(audioSource);
        }

        audio.load();
        if (isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued"));
    }


    /*
    Moves the tour to the next or to the prev bookmark activating elliptical zoom
    @param goBack (boolen) specifies the direction to move (prev - true, next - false)
    */
    var goToTheNextBookmark = function (goBack) {
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
        RaiseBookmarkFinished(oldBookmark);

        // change current position in tour and start EllipticalZoom animation
        self.currentPlace = { type: 'goto', bookmark: newBookmark };

        var bookmark = self.bookmarks[self.currentPlace.bookmark]; // next bookmark

        // activate bookmark & audio naration if required
        if (newBookmark != 0){
            RaiseBookmarkStarted(bookmark);

            // start audio narration
            if (isAudioEnabled && self.state === 'play' && self.isAudioLoaded == true)
                startBookmarkAudio(bookmark);
            
        }

        // initialize bookmark's timer
        if (self.state != 'pause' && self.isAudioLoaded == true)
            setTimer(bookmark);

        if (isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark));

        // start new EllipticalZoom animation if needed
        self.currentPlace.animationID = zoomTo(getBookmarkVisible(bookmark), onGoToSuccess, onGoToFailure, bookmark.url);
    }

    /*
    Resumes/starts audio narration for bookmark.
    @param bookmark         (bookmark) bookmark which audio narration part should be played.
    */
    function startBookmarkAudio(bookmark) {
        if (isToursDebugEnabled && window.console && console.log("playing source: " + audio.currentSrc));

        audio.pause();

        // set audio track's time to time when this bookmark was paused (beginning of bookmark if it wasn't paused)
        try {
            audio.currentTime = bookmark.lapseTime + bookmark.elapsed;
            if (isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed)));
        }
        catch (ex) {
            if (window.console && console.error("currentTime assignment: " + ex));
        }

        if (isToursDebugEnabled && window.console && console.log("audio element is forced to play"));

        audio.play();
    }

    /*
    Sets up the transition to the next bookmark timer. Resets the currently active one.
    */
    function setTimer(bookmark) {
        // clear active timer
        if (timerOnBookmarkIsOver) {
            clearTimeout(timerOnBookmarkIsOver);
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
        timerOnBookmarkIsOver = setTimeout(onBookmarkIsOver, duration * 1000 /* ms */);
    }

    // Zoom animation callbacks:
    var onGoToSuccess = function (animationID) { // we've finished zooming into the bookmark
        // the function is called only when state is play and currentPlace is goto, otherwise we are paused        
        if (!self.currentPlace || self.currentPlace.animationID == undefined || self.currentPlace.animationID != animationID) // callback is obsolete
            return;

        var curURL = getURL();
        if (typeof curURL.hash.params == 'undefined')
            curURL.hash.params = new Array();
        curURL.hash.params["tour"] = tour.sequenceNum;
        //curURL.hash.params["bookmark"] = self.currentPlace.bookmark+1;

        //This flag is used to overcome hashchange event handler
        hashHandle = false;
        setURL(curURL);

        if (isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark));

        self.currentPlace = { type: 'bookmark', bookmark: self.currentPlace.bookmark };

        //start the audio after the transition to the first bookmark if not paused
        if (self.currentPlace.bookmark == 0) {
            // raise bookmark started callback functions
            var bookmark = self.bookmarks[self.currentPlace.bookmark];
            RaiseBookmarkStarted(bookmark);

            if (self.state != 'pause') {
                if (self.isAudioLoaded != true) // stop tour if audio is not ready yet
                    tourPause();
                else { // audio is ready
                    setTimer(bookmark);
                    if (isAudioEnabled)
                        startBookmarkAudio(bookmark);
                }
            }
        }

    };

    var onGoToFailure = function (animationID) { // we've been interrupted during zoom to the bookmark
        // the function is called only when state is play and currentPlace is goto, otherwise we are paused
        if (!self.currentPlace || self.currentPlace.animationID == undefined || self.currentPlace.animationID != animationID) // callback is obsolete
            return;

        // pause tour
        self.pause();

        if (isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition"));
    };


    //-------------------------------------------------------------------------------------------
    // Public interface
    this.play = function () {
        if (this.state !== 'pause') return;

        // first we go to the bookmark and then continue play it
        if (isToursDebugEnabled && window.console && console.log("tour playback activated"));
        this.state = 'play';

        var visible = vc.virtualCanvas("getViewport").visible;

        if (this.currentPlace != null && this.currentPlace.bookmark != null && compareVisibles(visible, getBookmarkVisible(this.bookmarks[this.currentPlace.bookmark])))
        // current visible is equal to visible of bookmark
            this.currentPlace = { type: 'bookmark', bookmark: this.currentPlace.bookmark };
        else
        // current visible is not equal to visible of bookmark, animation is required
            this.currentPlace = { type: 'goto', bookmark: this.currentPlace.bookmark };

        var bookmark = this.bookmarks[this.currentPlace.bookmark];

        // indicates if animation to first bookmark is required
        var isInTransitionToFirstBookmark = (this.currentPlace.bookmark == 0 && this.currentPlace.type == 'goto');

        // transition to bookmark is over OR not in process of transition to first bookmark => start bookmark
        if (this.currentPlace.type == 'bookmark' || this.currentPlace.bookmark != 0) { 
            RaiseBookmarkStarted(bookmark);
            
            // start bookmark' timer & audio narration if audio is ready
            if (this.isAudioLoaded == true) {
                setTimer(bookmark);
                if (isAudioEnabled)
                    startBookmarkAudio(bookmark);
            }
        }

        this.currentPlace.animationID = zoomTo(getBookmarkVisible(bookmark), onGoToSuccess, onGoToFailure, bookmark.url);

        // raise tourStarted callback functions
        if (this.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
            RaiseTourStarted();
        }

        var curURL = getURL();
        if (typeof curURL.hash.params == 'undefined') {
            curURL.hash.params = new Array();
        }

        if (typeof curURL.hash.params["tour"] == 'undefined') {
            curURL.hash.params["tour"] = tour.sequenceNum;

            //This flag is used to overcome hashchange event handler
            hashHandle = false;
            setURL(curURL);
        }
    };

    this.pause = function () {
        if (this.state !== 'play') return;

        if (isToursDebugEnabled && window.console && console.log("tour playback paused"));
        if (isAudioEnabled && isTourPlayRequested)
            isTourPlayRequested = false;

        // clear active bookmark timer
        if (timerOnBookmarkIsOver) {
            clearTimeout(timerOnBookmarkIsOver);
            timerOnBookmarkIsOver = undefined;
        }

        this.state = 'pause';
        if (isAudioEnabled) {
            audio.pause();
            if (isToursDebugEnabled && window.console && console.log("audio element is forced to pause"));
        }

        var bookmark = this.bookmarks[this.currentPlace.bookmark];
        // save the time when bookmark was paused
        if (this.currentPlace.startTime)
            bookmark.elapsed += (new Date().getTime() - this.currentPlace.startTime) / 1000; // sec
    };

    this.next = function () { // goes to the next bookmark
        // ignore if last bookmark
        if (self.currentPlace.bookmark != bookmarks.length - 1) {
            if (this.state === 'play') {
                // clear active bookmark timer
                if (timerOnBookmarkIsOver) clearTimeout(timerOnBookmarkIsOver);
                timerOnBookmarkIsOver = undefined;
            }

            onBookmarkIsOver(false); // goes to the next bookmark            
        }
    };

    this.prev = function () { // goes to the previous bookmark
        // ignore if first bookmark
        if (self.currentPlace.bookmark == 0)
        {
            //self.currentPlace = { type: 'goto', bookmark: 0, animationID: self.currentPlace.animationID };
            return;
        }
        if (this.state === 'play') {
            // clear active bookmark timer
            if (timerOnBookmarkIsOver) clearTimeout(timerOnBookmarkIsOver);
            timerOnBookmarkIsOver = undefined;
        }
        
        onBookmarkIsOver(true); // goes to the prev bookmark
    };

    // public properties
    this.getBookmark = function () {
        return this.bookmarks[this.currentPlace.bookmark];
    };

    // calls every bookmarkStarted callback function
    function RaiseBookmarkStarted(bookmark) {
        if (self.tour_BookmarkStarted.length > 0) {
            for (var i = 0; i < self.tour_BookmarkStarted.length; i++)
                self.tour_BookmarkStarted[i](self, bookmark);
        }
    }

    // calls every bookmarkFinished callback function
    function RaiseBookmarkFinished(bookmark) {
        if (self.tour_BookmarkFinished.length > 0) {
            for (var i = 0; i < self.tour_BookmarkFinished.length; i++)
                self.tour_BookmarkFinished[i](self, bookmark);
        }
    }

    // calls every tourStarted callback function
    function RaiseTourStarted() {
        if (self.tour_TourStarted.length > 0) {
            for (var i = 0; i < self.tour_TourStarted.length; i++)
                self.tour_TourStarted[i](self);
        }
    }

    // calls every tourFinished callback function
    function RaiseTourFinished() {
        if (self.tour_TourFinished.length > 0) {
            for (var i = 0; i < self.tour_TourFinished.length; i++)
                self.tour_TourFinished[i](self);
        }
    }
}

/*
Activates tour contol UI.
@param    tour (Tour). A tour to play.
@param    isAudioEnabled (Boolean) Whether to play audio during the tour or not
*/
function activateTour(newTour, isAudioEnabled) {
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
    tourPause();
    isTourPlayRequested = false;

    // hide tour' UI
    var tourControlDiv = document.getElementById("tour_control");
    tourControlDiv.style.display = "none";
    if (tour) {
        hideBookmarks();
        $("#bookmarks .header").html("");

        // remove audio track
        if (tour.audio)
            tour.audio = undefined;
    }

    // reset active tour
    tour = undefined;
}

/*
Handling of prev button click in UI
*/
function tourPrev() {
    if (tour != undefined) {
        tour.prev();
    }
}

/*
Handling of next button click in UI
*/
function tourNext() {
    if (tour != undefined) {
        tour.next();
    }
}

/*
switch the tour in the paused state
*/
function tourPause() {
    if (tour != undefined) {
        $("#tour_playpause").attr("src", "Images/tour_play_off.jpg");

        // pause tour
        tour.pause();
        // stop active animation
        controller.stopAnimation();
        // remove animation callbacks
        tourBookmarkTransitionInterrupted = undefined;
        tourBookmarkTransitionCompleted = undefined;
    }
}

/*
switch the tour in the running state
*/
function tourResume() {
    $("#tour_playpause").attr("src", "Images/tour_pause_off.jpg");
    tour.play();
}

/*
Handling of play/pause button click in UI
*/
function tourPlayPause() {
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
function tourAbort() {
    // close tour and hide all tour' UI elements
    removeActiveTour();
    $("#bookmarks").hide();
    isBookmarksWindowVisible = false;

    var curURL = getURL();
    delete curURL.hash.params["tour"];
    delete curURL.hash.params["bookmark"];
    setURL(curURL);
}




function initializeToursUI() {
    $("#tours").hide();

    // Bookmarks window
    hideBookmarks();
}



function initializeToursContent() {
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
            hideBookmark(t, bookmark);
        });

        
        // add new category to tours menu
        if (tour.category !== category) {
            var cat = $('<div class="category">' + tour.category + '</div>').appendTo(toursUI);
            
            // add category' UI
            var img = $('<img src="Images/collapse-down.png" class="collapseButton" />').appendTo(cat);
            if (i == 0) {
                cat.removeClass('category').addClass('categorySelected');
                img[0].src = "Images/collapse-up.png";
            }
            categoryContent = $('<div class="itemContainer"></div>').appendTo(toursUI);
            category = tour.category;
        }

        // add tour element into category
        $('<div class="item" tour="' + i + '">' + tour.title + '</div>').appendTo(categoryContent)
                    .click(function () { // click event handler for added tour element
                        // close active tour                            
                        removeActiveTour();
                        
                        // hide tour UI
                        $("#tours").hide('slide', {}, 'slow');
                        toggleOffImage('tours_index');
                        isTourWindowVisible = false;

                        // activate selected tour  
                        var mytour = tours[this.getAttribute("tour")];
                        activateTour(mytour, isNarrationOn);

                        // deselect previously active tour in tours panel
                        $(".touritem-selected").removeClass("touritem-selected", "slow");
                        // mark this tour as selected in tours panel
                        $(this).addClass("touritem-selected", "slow");
                    });
    }

    // create jquery widget for category' content sliding
    $("#tours-content").accordion({
        fillSpace: false,
        collapsible: true,
        autoHeight: false
    });

    // binding click at the tour category' expand button
    $("#tours-content").bind("accordionchangestart", function (event, ui) {
        if (ui.newHeader) {
            ui.newHeader.removeClass('category');
            ui.newHeader.addClass('categorySelected');

            var img = $(".collapseButton", ui.newHeader)[0];
            if (img) img.src = "Images/collapse-up.png";
        }
        if (ui.oldHeader) {
            ui.oldHeader.removeClass('categorySelected');
            ui.oldHeader.addClass('category');

            var img = $(".collapseButton", ui.oldHeader)[0];
            if (img) img.src = "Images/collapse-down.png";
        }
    });
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

        $("#bookmarks .slideHeader").html("");
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
        $("#bookmarks .slideText").html(bookmark.text);
        $("#bookmarks").show('slide', {}, 'slow');
    }

    $("#bookmarks .header").html(tour.title);
    $("#bookmarks .slideHeader").html(bookmark.caption);
    $("#bookmarks .slideFooter").html(bookmark.number + '/' + tour.bookmarks.length);

    if (isBookmarksWindowExpanded) {
        $("#bookmarks .slideText").html(bookmark.text);
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
        $("#bookmarks .slideText").html(bookmark.text);
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
function onTourClicked() {
    if (isSearchWindowVisible)
        onSearchClicked();

    if (isTourWindowVisible) {
        toggleOffImage('tours_index');
        $("#tours").hide('slide', {}, 'slow');
    } else {
        toggleOnImage('tours_index');
        $("#tours").show('slide', {}, 'slow');
    }
    isTourWindowVisible = !isTourWindowVisible;
}


/* Highlights the tour button in the top menu */
function tourButtonHighlight(isOn) {
    if (isOn) {
        toggleOnImage('tours_index');
    }
    else {
        if (!isTourWindowVisible)
            toggleOffImage('tours_index');
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
    $("#bookmarks").effect('size', { to: { width: 30} }, 'fast');
    $("#bookmarksCollapse").attr("src", "Images/expand-right.png");
}

/*
Expands bookmark description window. 
*/
function expandBookmarks() {
    if (isBookmarksWindowExpanded) return;
    isBookmarksWindowExpanded = true;
    //$("#bookmarks").switchClass('bookmarksWindow', 'bookmarksWindowCollapsed', 'slow',
    $("#bookmarks").effect('size', { to: { width: '200px', height: 'auto'} }, 'slow',
                function () {
                    $("#bookmarks").css('height', 'auto');
                    $("#bookmarks .header").show('slide', {}, 'fast');
                    $("#bookmarks .slideHeader").show('slide', {}, 'fast');
                    $("#bookmarks .slideText").show('slide', {}, 'fast');
                    $("#bookmarks .slideFooter").show('slide', {}, 'fast');
                });
    $("#bookmarksCollapse").attr("src", "Images/collapse-left.png");

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

/*
Handles click in tour narration window.
*/
function onNarrationClick() {
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
function parseTours(content) {
    tours = new Array();

    // build array of tours that could be played
    for (var i = 0; i < content.d.length; i++) {
        var areBookmarksValid = true; // indicates whether all bookmarks are correct or not
        var tourString = content.d[i];

        // skip tours with invalid parameters
        if ((typeof tourString.bookmarks == 'undefined') ||
                    (typeof tourString.AudioBlobUrl == 'undefined') ||
                    (tourString.AudioBlobUrl == undefined) ||
                    (tourString.AudioBlobUrl == null) ||
                    (typeof tourString.Category == 'undefined') ||
                    (typeof tourString.Name == 'undefined') ||
                    (typeof tourString.Sequence == 'undefined'))
            continue;

        // build array of bookmarks of current tour
        var tourBookmarks = new Array();

        for (var j = 0; j < tourString.bookmarks.length; j++) {
            var bmString = tourString.bookmarks[j];

            // break if at least one bookmarks has invalid parameters
            if ((typeof bmString.Description == 'undefined') ||
                    (typeof bmString.LapseTime == 'undefined') ||
                    (typeof bmString.Name == 'undefined') ||
                    (typeof bmString.URL == 'undefined')) {
                areBookmarksValid = false;
                break;
            }

            // cut unnecessary part of bookmark's URL
            var bmURL = bmString.URL;
            if (bmURL.indexOf("#") != -1) {
                bmURL = bmURL.substring(bmURL.indexOf("#") + 1);
            }
            tourBookmarks.push(new TourBookmark(bmURL, bmString.Name, bmString.LapseTime, bmString.Description));
        }

        // skip tour with broken bookmarks
        if (!areBookmarksValid)
            continue;

        // tour is correct and can be played
        tours.push(new Tour(tourString.Name, tourBookmarks, bookmarkTransition, vc, tourString.Category, tourString.AudioBlobUrl, tourString.Sequence));
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
    var animId = setVisible(visible);

    if (animId && bookmark) {
        setNavigationStringTo = { bookmark: bookmark, id: animId };
    }
    return animId;
}

function loadTourFromURL() {
    var curURL = getURL();
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