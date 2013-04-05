var isTourWindowVisible = false;
var isBookmarksWindowVisible = false;
var isBookmarksWindowExpanded = true;
var isBookmarksTextShown = true;
var isNarrationOn = true;
var tours;
var tour;
var tourBookmarkTransitionCompleted;
var tourBookmarkTransitionInterrupted;
var pauseTourAtAnyAnimation = false;
var bookmarkAnimation;
var isToursDebugEnabled = false;
function TourBookmark(url, caption, lapseTime, text) {
    this.url = url;
    this.caption = caption;
    this.lapseTime = lapseTime;
    this.duration = undefined;
    this.text = text;
    this.number = 0;
    this.elapsed = 0;
}
function getBookmarkVisible(bookmark) {
    return navStringToVisible(bookmark.url, this.vc);
}
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
    var isAudioLoaded = false;
    var isAudioEnabled = false;
    var isTourPlayRequested = false;
    if(!bookmarks || bookmarks.length == 0) {
        throw "Tour has no bookmarks";
    }
    this.state = 'pause';
    this.currentPlace = {
        type: 'goto',
        bookmark: 0
    };
    var self = this;
    bookmarks.sort(function (b1, b2) {
        return b1.lapseTime - b2.lapseTime;
    });
    var audio;
    isTourPlayRequested = false;
    for(var i = 1; i < bookmarks.length; i++) {
        bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
        bookmarks[i - 1].number = i;
    }
    bookmarks[bookmarks.length - 1].duration = 10;
    bookmarks[bookmarks.length - 1].number = bookmarks.length;
    var timerOnBookmarkIsOver;
    var onBookmarkIsOver = function (goBack) {
        self.bookmarks[self.currentPlace.bookmark].elapsed = 0;
        if((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
            self.state = 'pause';
            self.currentPlace = {
                type: 'goto',
                bookmark: 0
            };
            RaiseTourFinished();
        } else {
            goToTheNextBookmark(goBack);
        }
    };
    this.toggleAudio = function (isOn) {
        if(isOn) {
            isAudioEnabled = true;
        } else {
            isAudioEnabled = false;
        }
    };
    this.ReinitializeAudio = function () {
        if(audio) {
            audio.pause();
        }
        audio = undefined;
        isAudioLoaded = false;
        audio = document.createElement('audio');
        audio.addEventListener("loadedmetadata", function () {
            if(audio.duration != Infinity) {
                bookmarks[bookmarks.length - 1].duration = audio.duration - bookmarks[bookmarks.length - 1].lapseTime;
            }
            if(isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)")) {
                ;
            }
        });
        audio.addEventListener("canplaythrough", function () {
            self.isAudioLoaded = true;
            if(isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4")) {
                ;
            }
        });
        audio.addEventListener("progress", function () {
            if(audio.buffered.length > 0) {
                if(isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (audio.buffered.end(audio.buffered.length - 1) / audio.duration))) {
                    ;
                }
            }
        });
        audio.controls = false;
        audio.autoplay = false;
        audio.loop = false;
        audio.volume = 1;
        audio.preload = "none";
        var blobPrefix = audioBlobUrl.substring(0, audioBlobUrl.length - 3);
        for(var i = 0; i < toursAudioFormats.length; i++) {
            var audioSource = document.createElement("Source");
            audioSource.setAttribute("src", blobPrefix + toursAudioFormats[i].ext);
            if(toursAudioFormats[i].type) {
                audioSource.setAttribute("type", toursAudioFormats[i].type);
            }
            audio.appendChild(audioSource);
        }
        audio.load();
        if(isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued")) {
            ;
        }
    };
    var goToTheNextBookmark = function (goBack) {
        var newBookmark = self.currentPlace.bookmark;
        var oldBookmark = newBookmark;
        if(goBack) {
            newBookmark = Math.max(0, newBookmark - 1);
        } else {
            newBookmark = Math.min(self.bookmarks.length - 1, newBookmark + 1);
        }
        RaiseBookmarkFinished(oldBookmark);
        self.currentPlace = {
            type: 'goto',
            bookmark: newBookmark
        };
        var bookmark = self.bookmarks[self.currentPlace.bookmark];
        if(newBookmark != 0) {
            RaiseBookmarkStarted(bookmark);
            if(isAudioEnabled && self.state === 'play' && self.isAudioLoaded == true) {
                startBookmarkAudio(bookmark);
            }
        }
        if(self.state != 'pause' && self.isAudioLoaded == true) {
            setTimer(bookmark);
        }
        if(isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark)) {
            ;
        }
        self.currentPlace.animationID = zoomTo(getBookmarkVisible(bookmark), onGoToSuccess, onGoToFailure, bookmark.url);
    };
    function startBookmarkAudio(bookmark) {
        if(isToursDebugEnabled && window.console && console.log("playing source: " + audio.currentSrc)) {
            ;
        }
        audio.pause();
        try  {
            audio.currentTime = bookmark.lapseTime + bookmark.elapsed;
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
        audio.play();
    }
    function setTimer(bookmark) {
        if(timerOnBookmarkIsOver) {
            clearTimeout(timerOnBookmarkIsOver);
        }
        var duration = bookmark.duration;
        if(bookmark.elapsed != 0) {
            duration = Math.max(duration - bookmark.elapsed, 0);
        }
        self.currentPlace.startTime = new Date().getTime();
        if(isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds")) {
            ;
        }
        timerOnBookmarkIsOver = setTimeout(onBookmarkIsOver, duration * 1000);
    }
    var onGoToSuccess = function (animationID) {
        if(!self.currentPlace || self.currentPlace.animationID == undefined || self.currentPlace.animationID != animationID) {
            return;
        }
        var curURL = getURL();
        if(typeof curURL.hash.params == 'undefined') {
            curURL.hash.params = new Array();
        }
        curURL.hash.params["tour"] = tour.sequenceNum;
        hashHandle = false;
        setURL(curURL);
        if(isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark)) {
            ;
        }
        self.currentPlace = {
            type: 'bookmark',
            bookmark: self.currentPlace.bookmark
        };
        if(self.currentPlace.bookmark == 0) {
            var bookmark = self.bookmarks[self.currentPlace.bookmark];
            RaiseBookmarkStarted(bookmark);
            if(self.state != 'pause') {
                if(self.isAudioLoaded != true) {
                    tourPause();
                } else {
                    setTimer(bookmark);
                    if(isAudioEnabled) {
                        startBookmarkAudio(bookmark);
                    }
                }
            }
        }
    };
    var onGoToFailure = function (animationID) {
        if(!self.currentPlace || self.currentPlace.animationID == undefined || self.currentPlace.animationID != animationID) {
            return;
        }
        self.pause();
        if(isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition")) {
            ;
        }
    };
    this.play = function () {
        if(this.state !== 'pause') {
            return;
        }
        if(isToursDebugEnabled && window.console && console.log("tour playback activated")) {
            ;
        }
        this.state = 'play';
        var visible = vc.virtualCanvas("getViewport").visible;
        if(this.currentPlace != null && this.currentPlace.bookmark != null && compareVisibles(visible, getBookmarkVisible(this.bookmarks[this.currentPlace.bookmark]))) {
            this.currentPlace = {
                type: 'bookmark',
                bookmark: this.currentPlace.bookmark
            };
        } else {
            this.currentPlace = {
                type: 'goto',
                bookmark: this.currentPlace.bookmark
            };
        }
        var bookmark = this.bookmarks[this.currentPlace.bookmark];
        var isInTransitionToFirstBookmark = (this.currentPlace.bookmark == 0 && this.currentPlace.type == 'goto');
        if(this.currentPlace.type == 'bookmark' || this.currentPlace.bookmark != 0) {
            RaiseBookmarkStarted(bookmark);
            if(this.isAudioLoaded == true) {
                setTimer(bookmark);
                if(isAudioEnabled) {
                    startBookmarkAudio(bookmark);
                }
            }
        }
        this.currentPlace.animationID = zoomTo(getBookmarkVisible(bookmark), onGoToSuccess, onGoToFailure, bookmark.url);
        if(this.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
            RaiseTourStarted();
        }
        var curURL = getURL();
        if(typeof curURL.hash.params == 'undefined') {
            curURL.hash.params = new Array();
        }
        if(typeof curURL.hash.params["tour"] == 'undefined') {
            curURL.hash.params["tour"] = tour.sequenceNum;
            hashHandle = false;
            setURL(curURL);
        }
    };
    this.pause = function () {
        if(this.state !== 'play') {
            return;
        }
        if(isToursDebugEnabled && window.console && console.log("tour playback paused")) {
            ;
        }
        if(isAudioEnabled && isTourPlayRequested) {
            isTourPlayRequested = false;
        }
        if(timerOnBookmarkIsOver) {
            clearTimeout(timerOnBookmarkIsOver);
            timerOnBookmarkIsOver = undefined;
        }
        this.state = 'pause';
        if(isAudioEnabled) {
            audio.pause();
            if(isToursDebugEnabled && window.console && console.log("audio element is forced to pause")) {
                ;
            }
        }
        var bookmark = this.bookmarks[this.currentPlace.bookmark];
        if(this.currentPlace.startTime) {
            bookmark.elapsed += (new Date().getTime() - this.currentPlace.startTime) / 1000;
        }
    };
    this.next = function () {
        if(self.currentPlace.bookmark != bookmarks.length - 1) {
            if(this.state === 'play') {
                if(timerOnBookmarkIsOver) {
                    clearTimeout(timerOnBookmarkIsOver);
                }
                timerOnBookmarkIsOver = undefined;
            }
            onBookmarkIsOver(false);
        }
    };
    this.prev = function () {
        if(self.currentPlace.bookmark == 0) {
            return;
        }
        if(this.state === 'play') {
            if(timerOnBookmarkIsOver) {
                clearTimeout(timerOnBookmarkIsOver);
            }
            timerOnBookmarkIsOver = undefined;
        }
        onBookmarkIsOver(true);
    };
    this.getBookmark = function () {
        return this.bookmarks[this.currentPlace.bookmark];
    };
    function RaiseBookmarkStarted(bookmark) {
        if(self.tour_BookmarkStarted.length > 0) {
            for(var i = 0; i < self.tour_BookmarkStarted.length; i++) {
                self.tour_BookmarkStarted[i](self, bookmark);
            }
        }
    }
    function RaiseBookmarkFinished(bookmark) {
        if(self.tour_BookmarkFinished.length > 0) {
            for(var i = 0; i < self.tour_BookmarkFinished.length; i++) {
                self.tour_BookmarkFinished[i](self, bookmark);
            }
        }
    }
    function RaiseTourStarted() {
        if(self.tour_TourStarted.length > 0) {
            for(var i = 0; i < self.tour_TourStarted.length; i++) {
                self.tour_TourStarted[i](self);
            }
        }
    }
    function RaiseTourFinished() {
        if(self.tour_TourFinished.length > 0) {
            for(var i = 0; i < self.tour_TourFinished.length; i++) {
                self.tour_TourFinished[i](self);
            }
        }
    }
}
function activateTour(newTour, isAudioEnabled) {
    if(newTour != undefined) {
        var tourControlDiv = document.getElementById("tour_control");
        tourControlDiv.style.display = "block";
        tour = newTour;
        tour.tour_TourFinished.push(function (tour) {
            hideBookmark(tour);
            tourPause();
            hideBookmarks();
        });
        tour.toggleAudio(isAudioEnabled);
        for(var i = 0; i < tour.bookmarks.length; i++) {
            tour.bookmarks[i].elapsed = 0;
        }
        tour.currentPlace.bookmark = 0;
        if(isAudioEnabled == true) {
            tour.ReinitializeAudio();
            tour.isAudioLoaded = true;
        }
        tourResume();
    }
}
function removeActiveTour() {
    tourPause();
    isTourPlayRequested = false;
    var tourControlDiv = document.getElementById("tour_control");
    tourControlDiv.style.display = "none";
    if(tour) {
        hideBookmarks();
        $("#bookmarks .header").html("");
        if(tour.audio) {
            tour.audio = undefined;
        }
    }
    tour = undefined;
}
function tourPrev() {
    if(tour != undefined) {
        tour.prev();
    }
}
function tourNext() {
    if(tour != undefined) {
        tour.next();
    }
}
function tourPause() {
    if(tour != undefined) {
        $("#tour_playpause").attr("src", "/Images/tour_play_off.jpg");
        tour.pause();
        controller.stopAnimation();
        tourBookmarkTransitionInterrupted = undefined;
        tourBookmarkTransitionCompleted = undefined;
    }
}
function tourResume() {
    $("#tour_playpause").attr("src", "/Images/tour_pause_off.jpg");
    tour.play();
}
function tourPlayPause() {
    if(tour != undefined) {
        if(tour.state == "pause") {
            tourResume();
        } else if(tour.state == "play") {
            tourPause();
        }
    }
}
function tourAbort() {
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
    hideBookmarks();
}
function initializeToursContent() {
    var toursUI = $('#tours-content');
    tours.sort(function (u, v) {
        return u.sequenceNum - v.sequenceNum;
    });
    var category = null;
    var categoryContent;
    for(var i = 0; i < tours.length; i++) {
        var tour = tours[i];
        tour.tour_BookmarkStarted.push(function (t, bookmark) {
            showBookmark(t, bookmark);
        });
        tour.tour_BookmarkFinished.push(function (t, bookmark) {
            hideBookmark(t, bookmark);
        });
        if(tour.category !== category) {
            var cat = $('<div class="category">' + tour.category + '</div>').appendTo(toursUI);
            var img = $('<img src="/Images/collapse-down.png" class="collapseButton" />').appendTo(cat);
            if(i == 0) {
                cat.removeClass('category').addClass('categorySelected');
                img[0].src = "/Images/collapse-up.png";
            }
            categoryContent = $('<div class="itemContainer"></div>').appendTo(toursUI);
            category = tour.category;
        }
        $('<div class="item" tour="' + i + '">' + tour.title + '</div>').appendTo(categoryContent).click(function () {
            removeActiveTour();
            $("#tours").hide('slide', {
            }, 'slow');
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
        if(ui.newHeader) {
            ui.newHeader.removeClass('category');
            ui.newHeader.addClass('categorySelected');
            var img = $(".collapseButton", ui.newHeader)[0];
            if(img) {
                img.src = "/Images/collapse-up.png";
            }
        }
        if(ui.oldHeader) {
            ui.oldHeader.removeClass('categorySelected');
            ui.oldHeader.addClass('category');
            var img = $(".collapseButton", ui.oldHeader)[0];
            if(img) {
                img.src = "/Images/collapse-down.png";
            }
        }
    });
}
function hideBookmark(tour) {
    if(isBookmarksWindowExpanded && isBookmarksTextShown) {
        if(bookmarkAnimation) {
            bookmarkAnimation.stop(true, true);
        }
        bookmarkAnimation = $("#bookmarks .slideText").hide("drop", {
        }, 'slow', function () {
            bookmarkAnimation = undefined;
        });
        $("#bookmarks .slideHeader").html("");
        isBookmarksTextShown = false;
    }
}
function showBookmark(tour, bookmark) {
    if(!isBookmarksWindowVisible) {
        isBookmarksWindowVisible = true;
        $("#bookmarks .slideText").html(bookmark.text);
        $("#bookmarks").show('slide', {
        }, 'slow');
    }
    $("#bookmarks .header").html(tour.title);
    $("#bookmarks .slideHeader").html(bookmark.caption);
    $("#bookmarks .slideFooter").html(bookmark.number + '/' + tour.bookmarks.length);
    if(isBookmarksWindowExpanded) {
        $("#bookmarks .slideText").html(bookmark.text);
        if(!isBookmarksTextShown) {
            if(bookmarkAnimation) {
                bookmarkAnimation.stop(true, true);
            }
            bookmarkAnimation = $("#bookmarks .slideText").show("drop", {
            }, 'slow', function () {
                bookmarkAnimation = undefined;
            });
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
    if(isSearchWindowVisible) {
        onSearchClicked();
    }
    if(isTourWindowVisible) {
        toggleOffImage('tours_index');
        $("#tours").hide('slide', {
        }, 'slow');
    } else {
        toggleOnImage('tours_index');
        $("#tours").show('slide', {
        }, 'slow');
    }
    isTourWindowVisible = !isTourWindowVisible;
}
function tourButtonHighlight(isOn) {
    if(isOn) {
        toggleOnImage('tours_index');
    } else {
        if(!isTourWindowVisible) {
            toggleOffImage('tours_index');
        }
    }
}
function collapseBookmarks() {
    if(!isBookmarksWindowExpanded) {
        return;
    }
    isBookmarksWindowExpanded = false;
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
    $("#bookmarksCollapse").attr("src", "/Images/expand-right.png");
}
function expandBookmarks() {
    if(isBookmarksWindowExpanded) {
        return;
    }
    isBookmarksWindowExpanded = true;
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
    $("#bookmarksCollapse").attr("src", "/Images/collapse-left.png");
}
function onBookmarksCollapse() {
    if(!isBookmarksWindowExpanded) {
        expandBookmarks();
    } else {
        collapseBookmarks();
    }
}
function onNarrationClick() {
    if(isNarrationOn) {
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
    for(var i = 0; i < content.d.length; i++) {
        var areBookmarksValid = true;
        var tourString = content.d[i];
        if((typeof tourString.bookmarks == 'undefined') || (typeof tourString.AudioBlobUrl == 'undefined') || (tourString.AudioBlobUrl == undefined) || (tourString.AudioBlobUrl == null) || (typeof tourString.Category == 'undefined') || (typeof tourString.Name == 'undefined') || (typeof tourString.Sequence == 'undefined')) {
            continue;
        }
        var tourBookmarks = new Array();
        for(var j = 0; j < tourString.bookmarks.length; j++) {
            var bmString = tourString.bookmarks[j];
            if((typeof bmString.Description == 'undefined') || (typeof bmString.LapseTime == 'undefined') || (typeof bmString.Name == 'undefined') || (typeof bmString.URL == 'undefined')) {
                areBookmarksValid = false;
                break;
            }
            var bmURL = bmString.URL;
            if(bmURL.indexOf("#") != -1) {
                bmURL = bmURL.substring(bmURL.indexOf("#") + 1);
            }
            tourBookmarks.push(new TourBookmark(bmURL, bmString.Name, bmString.LapseTime, bmString.Description));
        }
        if(!areBookmarksValid) {
            continue;
        }
        tours.push(new Tour(tourString.Name, tourBookmarks, bookmarkTransition, vc, tourString.Category, tourString.AudioBlobUrl, tourString.Sequence));
    }
}
function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
    tourBookmarkTransitionCompleted = onCompleted;
    tourBookmarkTransitionInterrupted = onInterrupted;
    pauseTourAtAnyAnimation = false;
    var animId = setVisible(visible);
    if(animId && bookmark) {
        setNavigationStringTo = {
            bookmark: bookmark,
            id: animId
        };
    }
    return animId;
}
function loadTourFromURL() {
    var curURL = getURL();
    if((typeof curURL.hash.params !== 'undefined') && (curURL.hash.params["tour"] > tours.length)) {
        return;
    }
    if(typeof curURL.hash.params !== 'undefined' && typeof curURL.hash.params["tour"] !== 'undefined') {
        if(tours == null) {
            initializeToursContent();
        }
        if(isTourWindowVisible) {
            onTourClicked();
        }
        tour = tours[curURL.hash.params["tour"] - 1];
        $(".touritem-selected").removeClass("touritem-selected", "slow");
        activateTour(tour, true);
        if(tour.audio) {
            tour.audio.pause();
            tour.audio.preload = "none";
        }
        tourPause();
    }
}
