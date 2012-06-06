
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

    var audio;

    ReinitializeAudio();

    isTourPlayRequested = false;

    for (var i = 1; i < bookmarks.length; i++) {  //calculating bookmarks durations        
        bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
        bookmarks[i - 1].number = i;
    }
    bookmarks[bookmarks.length - 1].duration = 10; //this will be overrided when the audio will be downloaded
    bookmarks[bookmarks.length - 1].number = bookmarks.length;

    var timerOnBookmarkIsOver;  // timer id which is set for bookmark complete event (stored to be able to cancel it if paused)

    var onBookmarkIsOver = function (goBack) { // bookmark playback is over
        // the function is called only when state is play and currentPlace is bookmark.        

        var bookmark = self.bookmarks[self.currentPlace.bookmark];
        bookmark.elapsed = 0;

        // Going to the next bookmark if we are not at the end
        if ((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
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
        if (isOn) {
            isAudioEnabled = true;
        }
        else
            isAudioEnabled = false;
    }

    function ReinitializeAudio() {
        if (audio) {
            audio.pause();
        }
        audio = undefined;
        isAudioLoaded = false;
        audio = document.createElement('audio');
        audio.onloadedmetadata = function () {
            if (audio.duration != Infinity)
                bookmarks[bookmarks.length - 1].duration = audio.duration - bookmarks[bookmarks.length - 1].lapseTime; //overriding the last bookmark duration
            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)"));
        }
        audio.oncanplaythrough = function () {
            if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4"));
        }
        audio.onprogress = function () {
            if (audio.buffered.length > 0)
                if (isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (audio.buffered.end(audio.buffered.length - 1) / audio.duration)));
        }

        audio.controls = false;
        audio.autoplay = false;
        audio.loop = false;
        audio.volume = 1;

        var blobPrefix = audioBlobUrl.substring(0, audioBlobUrl.length - 3);
        for (var i = 0; i < toursAudioFormats.length; i++) {
            var audioSource = document.createElement("Source");
            audioSource.setAttribute("src", blobPrefix + toursAudioFormats[i].ext);
            if (toursAudioFormats[i].type)
                audioSource.setAttribute("type", toursAudioFormats[i].type);
            audio.appendChild(audioSource);
        }

        audio.preload = "auto";
        audio.load();
        if (isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued"));
    }


    /*
    Moves the tour to the next or to the rev bookmark activating elliptical zoom
    @param goBack (boolen) specifies the direction to move
    */
    var goToTheNextBookmark = function (goBack) {
        var newBookmark = self.currentPlace.bookmark;
        var oldBookmark = newBookmark;
        if (goBack) {
            newBookmark = Math.max(0, newBookmark - 1);
        }
        else {
            newBookmark = Math.min(self.bookmarks.length - 1, newBookmark + 1);
        }
        self.currentPlace = { type: 'goto', bookmark: newBookmark };

        RaiseBookmarkFinished(oldBookmark);

        bookmark = self.bookmarks[self.currentPlace.bookmark]; // next bookmark
        if (isAudioEnabled && newBookmark != 0 && self.state === 'play') {
            startBookmarkAudio(bookmark);
        }
        if (self.state != 'pause')
            setTimer(bookmark);

        if (isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark));
        self.currentPlace.animationID = zoomTo(getBookmarkVisible(bookmark), onGoToSuccess, onGoToFailure, bookmark.url);
    }

    function startBookmarkAudio(bookmark) {
        if (isToursDebugEnabled && window.console && console.log("playing source: " + audio.currentSrc));
        audio.pause();
        try {
            audio.currentTime = bookmark.lapseTime + bookmark.elapsed;
            if (isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed)));
        }
        catch (ex) {
            if (window.console && console.error("currentTime assignment: " + ex));
        }
        //if (audio.paused || audio.ended) {
        if (isToursDebugEnabled && window.console && console.log("audio element is forced to play"));
        audio.play();
        //}
    }

    /*
    sets up the transition to the next bookmark timer. resets the currently active one
    */
    function setTimer(bookmark) {
        if (timerOnBookmarkIsOver) {
            clearTimeout(timerOnBookmarkIsOver);            
        }
        var duration = bookmark.duration;
        if (bookmark.elapsed != 0) {
            duration = Math.max(duration - bookmark.elapsed, 0);
        }
        self.currentPlace.startTime = new Date().getTime();
        if (isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds"));
        timerOnBookmarkIsOver = setTimeout(onBookmarkIsOver, duration * 1000 /* ms */);
    }

    // Zoom animation callbacks:
    var onGoToSuccess = function (animationID) { // we've finished zooming into the bookmark
        // the function is called only when state is play and currentPlace is goto, otherwise we are paused        
        if (!self.currentPlace || self.currentPlace.animationID == undefined || self.currentPlace.animationID != animationID) // callback is obsolete
            return;

        if (self.state === 'pause') {
            var bookmark = self.bookmarks[self.currentPlace.bookmark];
            RaiseBookmarkStarted(bookmark);
            return;
        }
        self.currentPlace = { type: 'bookmark', bookmark: self.currentPlace.bookmark };

        var bookmark = self.bookmarks[self.currentPlace.bookmark];

        if (isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark));
        RaiseBookmarkStarted(bookmark);

        if (self.currentPlace.bookmark == 0) //start the audio after the transition to the first bookmark
        {
            setTimer(bookmark);
            if (isAudioEnabled)
                startBookmarkAudio(bookmark);
        }

    };

    var onGoToFailure = function (animationID) { // we've been interrupted during zoom to the bookmark
        // the function is called only when state is play and currentPlace is goto, otherwise we are paused
        if (!self.currentPlace || self.currentPlace.animationID == undefined || self.currentPlace.animationID != animationID) // callback is obsolete
            return;
        self.state = 'pause';
        if (isAudioEnabled) {
            if (isToursDebugEnabled && window.console && console.log("audio element is forced to pause"));
            audio.pause();
        }
        if (isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition"));
    };


    //-------------------------------------------------------------------------------------------
    // Public interface
    this.play = function () {
        if (this.state !== 'pause') return;

        // first we go to the bookmark and then continue play it
        if (isToursDebugEnabled && window.console && console.log("tour playback activated"));
        this.state = 'play';
        this.currentPlace = { type: 'goto', bookmark: this.currentPlace.bookmark };
        var bookmark = this.bookmarks[this.currentPlace.bookmark];
        var isInTransitionToFirstBookmark = (this.currentPlace.bookmark == 0 && this.currentPlace.type == 'goto');
        if (!isInTransitionToFirstBookmark) {
            setTimer(bookmark);
            if (isAudioEnabled)
                startBookmarkAudio(bookmark); //resuming the audio if the tour was paused not in the transition to the first bookmark
        }
        this.currentPlace.animationID = zoomTo(getBookmarkVisible(bookmark), onGoToSuccess, onGoToFailure, bookmark.url);

        if (this.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
            RaiseTourStarted();
        }
    };

    this.pause = function () {
        if (this.state !== 'play') return;

        if (isToursDebugEnabled && window.console && console.log("tour playback paused"));
        if (isAudioEnabled && isTourPlayRequested)
            isTourPlayRequested = false;

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
        if (this.currentPlace.startTime)
            bookmark.elapsed += (new Date().getTime() - this.currentPlace.startTime) / 1000; // sec
    };

    this.next = function () { // goes to the next bookmark
        if (self.currentPlace.bookmark != bookmarks.length - 1) {
            if (this.state === 'play') {
                if (timerOnBookmarkIsOver) clearTimeout(timerOnBookmarkIsOver);
                timerOnBookmarkIsOver = undefined;     
            }
            else // 'pause'
            {
                var bookmark = this.bookmarks[this.currentPlace.bookmark];
                bookmark.elapsed = 0;
            }
            onBookmarkIsOver(false); // goes to the next bookmark            
        }
    };

    this.prev = function () { // goes to the previous bookmark
        if (self.currentPlace.bookmark == 0) // this was the final bookmark
        {
            //self.currentPlace = { type: 'goto', bookmark: 0, animationID: self.currentPlace.animationID };
            return;
        }
        if (this.state === 'play') {
            if (timerOnBookmarkIsOver) clearTimeout(timerOnBookmarkIsOver);
            timerOnBookmarkIsOver = undefined;
        }
        else // 'paused'
        {
            var bookmark = this.bookmarks[this.currentPlace.bookmark];
            bookmark.elapsed = 0;
        }
        onBookmarkIsOver(true); // goes to the next bookmark
    };

    // public properties
    this.getBookmark = function () {
        return this.bookmarks[this.currentPlace.bookmark];
    };

    function RaiseBookmarkStarted(bookmark) {
        if (self.tour_BookmarkStarted.length > 0) {
            for (var i = 0; i < self.tour_BookmarkStarted.length; i++)
                self.tour_BookmarkStarted[i](self, bookmark);
        }
    }

    function RaiseBookmarkFinished(bookmark) {
        if (self.tour_BookmarkFinished.length > 0) {
            for (var i = 0; i < self.tour_BookmarkFinished.length; i++)
                self.tour_BookmarkFinished[i](self, bookmark);
        }
    }

    function RaiseTourStarted() {
        if (self.tour_TourStarted.length > 0) {
            for (var i = 0; i < self.tour_TourStarted.length; i++)
                self.tour_TourStarted[i](self);
        }
    }

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
        tour.tour_TourFinished.push(function (tour) {
            hideBookmark(tour);
            tourPause();
            hideBookmarks();
        });
        tour.toggleAudio(isAudioEnabled);
        for (var i = 0; i < tour.bookmarks.length; i++)
            tour.bookmarks[i].elapsed = 0;
        tour.currentPlace.bookmark = 0;
        tourResume();
    }
}

/*
Diactivates a tour. Removes all controlls
*/
function stopTour() {
    tourPause();
    isTourPlayRequested = false;
    var tourControlDiv = document.getElementById("tour_control");
    tourControlDiv.style.display = "none";
    if (tour) {
        hideBookmarks();
        $("#bookmarks .header").html("");
        if (tour.audio)
            tour.audio = undefined;
    }
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
        tour.pause();
        controller.stopAnimation();
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
    }
}

/*
Handling of close button click in UI
*/
function tourAbort() {
    stopTour();
    $("#bookmarks").hide();
    isBookmarksWindowVisible = false;
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
    for (var i = 0; i < tours.length; i++) {
        var tour = tours[i];
        tour.tour_BookmarkStarted.push(function (t, bookmark) {
            showBookmark(t, bookmark);
        });

        tour.tour_BookmarkFinished.push(function (t, bookmark) {
            hideBookmark(t, bookmark);
        });

        if (tour.category !== category) {
            var cat = $('<div class="category">' + tour.category + '</div>').appendTo(toursUI);
            var img = $('<img src="Images/collapse-down.png" class="collapseButton" />').appendTo(cat);
            if (i == 0) {
                cat.removeClass('category').addClass('categorySelected');
                img[0].src = "Images/collapse-up.png";
            }
            categoryContent = $('<div class="itemContainer"></div>').appendTo(toursUI);
            category = tour.category;
        }
        $('<div class="item" tour="' + i + '">' + tour.title + '</div>').appendTo(categoryContent)
                    .click(function () {
                        stopTour();
                        $("#tours").hide('slide', {}, 'slow');
                        toggleOffImage('tours_index');
                        isTourWindowVisible = false;

                        var mytour = tours[this.getAttribute("tour")];

                        activateTour(mytour, isNarrationOn);
                        $(".touritem-selected").removeClass("touritem-selected", "slow");
                        $(this).addClass("touritem-selected", "slow");
                    });
    }

    $("#tours-content").accordion({
        fillSpace: false,
        collapsible: true,
        autoHeight: false
    });

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

function hideBookmark(tour) {
    if (isBookmarksWindowExpanded && isBookmarksTextShown) {
        $("#bookmarks .slideText").hide("drop", {}, 'slow');
        $("#bookmarks .slideHeader").html("");
        isBookmarksTextShown = false;
    }
}

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
            $("#bookmarks .slideText").show("drop", {}, 'slow');
            isBookmarksTextShown = true;
        }
    } else {
        $("#bookmarks .slideText").html(bookmark.text);
    }
}

function hideBookmarks() {
    $("#bookmarks").hide();
    isBookmarksWindowVisible = false;
}

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

function onBookmarksCollapse() {
    if (!isBookmarksWindowExpanded) {
        expandBookmarks();
    } else {
        collapseBookmarks();
    }
}

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



function parseTours(content) {
    tours = new Array();
    for (var i = 0; i < content.d.length; i++) {
        var areBookmarksValid = true;
        var tourString = content.d[i];
        if ((typeof tourString.bookmarks == 'undefined') ||
                    (typeof tourString.AudioBlobUrl == 'undefined') ||
                    (tourString.AudioBlobUrl == undefined) ||
                    (tourString.AudioBlobUrl == null) ||
                    (typeof tourString.Category == 'undefined') ||
                    (typeof tourString.Name == 'undefined') ||
                    (typeof tourString.Sequence == 'undefined'))
            continue;
        var tourBookmarks = new Array();
        var addedBookmarksCount = 0;
        for (var j = 0; j < tourString.bookmarks.length; j++) {
            var bmString = tourString.bookmarks[j];
            if ((typeof bmString.Description == 'undefined') ||
                    (typeof bmString.LapseTime == 'undefined') ||
                    (typeof bmString.Name == 'undefined') ||
                    (typeof bmString.URL == 'undefined')) {
                areBookmarksValid = false;
                break;
            }

            var bm = bmString.URL;
            if (bm.indexOf("#") != -1) {
                bm = bm.substring(bm.indexOf("#") + 1);
            }
            tourBookmarks.push(new TourBookmark(bm, bmString.Name, bmString.LapseTime, bmString.Description));
        }
        if (!areBookmarksValid)
            continue;

        tours.push(new Tour(tourString.Name, tourBookmarks, bookmarkTransition, vc, tourString.Category, tourString.AudioBlobUrl, tourString.Sequence));
    }
}


/*
bookmark transition function to be passed to tours
*/
function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
    tourBookmarkTransitionCompleted = onCompleted;
    tourBookmarkTransitionInterrupted = onInterrupted;
    pauseTourAtAnyAnimation = false;
    var animId = setVisible(visible);
    if (animId && bookmark) {
        setNavigationStringTo = { bookmark: bookmark, id: animId };
    }
    return animId;
}

