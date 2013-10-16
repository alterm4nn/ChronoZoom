/// <reference path='../scripts/cz.ts'/> 
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>


module CZ {
    export module StartPage {
        var _isRegimesVisible;

        /* Dummy data in an approximate format that might be returned from a service ... */
        export var tileData = [
            {
                "Idx": 0,
                "Title": "Big History is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_bighistory.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999998954347&y=-0.46459331778482354&w=3.841695822797034e-12&h=3.7430627449314544e-12"
            },
            {
                "Idx": 1,
                "Title": "CERN is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_cern.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999192440875&y=-0.4645933209201501&w=3.729306137185042e-11&h=3.633558592459924e-11"
            },
            {
                "Idx": 2,
                "Title": "Earth Science is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_earthscience.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999988061194&y=-0.46459331795948755&w=4.546120315559252e-12&h=4.4294015903520115e-12"
            },
            {
                "Idx": 3,
                "Title": "King Tut is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_kingtut.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999967062717304&y=-0.4645931999741229&w=3.5221148563086766e-10&h=3.4316868149181225e-10"
            },
            {
                "Idx": 4,
                "Title": "Napoleon is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_napoleon.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999840411981&y=-0.46459346560505227&w=5.935054278147061e-10&h=5.782675563705605e-10"
            },
            {
                "Idx": 5,
                "Title": "World War I is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_ww1.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999485392826&y=-0.4645933221621095&w=3.314938789411939e-12&h=3.229829860746773e-12"
            },
            {
                "Idx": 6,
                "Title": "Coluseum is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_colosseum.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999988732590944&y=-0.4645934478931077&w=1.0069124184819225e-9&h=9.810605875309654e-10"
            },
            {
                "Idx": 7,
                "Title": "Justin Morrill is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_justin_morrill.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999897945675&y=-0.46459338150077905&w=1.9362194151655837e-10&h=1.8865082227261387e-10"
            },
            {
                "Idx": 8,
                "Title": "Big History 2 is my favorite course ever",
                "Thumbnail": "../images/dummy/tile_bighistory.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4996898109169686&y=-0.46442779133805834&w=0.0007080832576286593&h=0.0006899036738441856"
            }
        ];


        /* ---------------- Tile Layout -------------------
         * Depending on how the tiles need to may layed out on reformat, these classnames in this list below will change.
         * From smallest to largest:
         * - Three rows of tiles 1 and 2
         * - Three rows of tiles 1 through 3
         * - One top row of tiles 1-4, and two columns of tiles 1-4
         * - Three columns of tiles 1-6
         *
         * With a different layout where uneven numbers of tiles is used there will be differences between the three sections 
         */
        export var tileLayout = [
            {
                "Name": "#combo0-icons",
                "Visibility": [
                    "box",
                    "box",
                    "box ex3",
                    "box ex3 ex4",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9"
                ],
            },
            {
                "Name": "#FeaturedTimelinesBlock-tiles",
                "Visibility": [
                    "box",
                    "box",
                    "box ex3",
                    "box ex3 ex4",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9"
                ],
            },
            {
                "Name": "#TwitterBlock-tiles",
                "Visibility": [
                    "box",
                    "box",
                    "box ex3",
                    "box ex3 ex4",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9"
                ],
            },
            {
                "Name": "#FavoriteTimelinesBlock-tiles",
                "Visibility": [
                    "box",
                    "box",
                    "box ex3",
                    "box ex3 ex4",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6"
                ],
            },
                        {
                "Name": "#MyTimelinesBlock-tiles",
                "Visibility": [
                    "box",
                    "box",
                    "box ex3",
                    "box ex3 ex4",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9",
                    "box ex3 ex4 ex6 ex9"
                ],
            },
        ];

        function resizeCrop($image: JQuery, imageProps: any, isListView?: boolean): void {
            var $startPage = $("#start-page");

            // Get size of the tile.
            var width = $image.parent().width();
            var height = $image.parent().height();

            if (isListView) {
                width = $image.width();
                height = $image.height();
            }

            // Show start page if it's not visible to get size of the tile.
            if (!$startPage.is(":visible")) {
                $startPage.show();
                width = $image.width();
                height = $image.height();
                $startPage.hide();
            }
            
            var naturalHeight = imageProps.naturalHeight;
            var naturalWidth = imageProps.naturalWidth;
            var ratio = naturalWidth / naturalHeight;
            var marginTop = 0;
            var marginLeft = 0;

            // Keep aspect ratio.
            if (naturalWidth > naturalHeight) {
                $image.height(height);
                $image.width(height * ratio);
                marginLeft = ($image.width() - width) / 2;
            } else if (naturalWidth < naturalHeight) {
                $image.width(width);
                $image.height(width / ratio);
                marginTop = ($image.height() - height) / 2;
            } else {
                $image.width(width);
                $image.height(height);
            }

            $image.css({
                "margin-top": -marginTop + "px",
                "margin-left": -marginLeft + "px"
            });
        }

        export function cloneTileTemplate(template, target, idx) {
            for (var i = 0; i < target[idx].Visibility.length; i++) {
                var o = $(template).clone(true, true).appendTo(target[idx].Name);
                o.attr("class", target[idx].Visibility[i]);
                o.attr("id", "t" + idx + "i" + i);
                $("#t" + idx + "i" + i + " .boxInner .tile-photo img").attr("src", tileData[i].Thumbnail).attr("alt", tileData[i].Title);
                $("#t" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-title").text(tileData[i].Title);
                $("#t" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-author").text(tileData[i].Author);
            }
        }

       export function cloneListTemplate(template,target,idx){
            for( var i = 0; i < tileData.length; i++){
                var o=$(template).clone( true, true).appendTo(target);
                o.attr("id","l"+idx+"i"+i);
                $("#l" + idx + "i" + i + " .li-title a").attr("href",tileData[i].URL);
                $("#l" + idx + "i" + i + " .li-title a").text(tileData[i].Title);
                $("#l" + idx + "i" + i + " .li-author").text(tileData[i].Author);
                $("#l" + idx + "i" + i + " .li-icon").text(tileData[i].Thumbnail);
            }
        }
        
        export function cloneTweetTemplate(template, target, idx){
            for (var i = 0; i < target[idx].Visibility.length; i++) {
                var o = $(template).clone(true, true).appendTo(target[idx].Name);
                o.attr("class", target[idx].Visibility[i]);
                o.attr("id", "m" + idx + "i" + i);

                $("#m" + idx + "i" + i + " .boxInner .tweet-meta .tweet-meta-text").dotdotdot({
                    watch: "window",
                });
            }
        }

        export function PlayIntroTour() {
            // "Introduction to ChronoZoom tour"
            // TODO: implement search of tour by title
            var introTour = CZ.Tours.tours[0];

            // check if tours failed to load
            if (typeof introTour === "undefined") {
                return false;
            }

            CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption(CZ.Tours.tourCaptionFormContainer, {
                activationSource: $(".tour-icon"),
                navButton: ".cz-form-nav",
                closeButton: ".cz-tour-form-close-btn > .cz-form-btn",
                titleTextblock: ".cz-tour-form-title",
                contentContainer: ".cz-form-content",
                minButton: ".cz-tour-form-min-btn > .cz-form-btn",
                captionTextarea: ".cz-form-tour-caption",
                tourPlayerContainer: ".cz-form-tour-player",
                bookmarksCount: ".cz-form-tour-bookmarks-count",
                narrationToggle: ".cz-toggle-narration",
                context: introTour
            });

            CZ.Tours.tourCaptionForm.show();
            CZ.Tours.activateTour(introTour, undefined);
        }

        export function listFlip(name){
            if( 'block' != document.getElementById(name+'-list').style.display){
                document.getElementById(name+'-list').style.display = 'block';
                document.getElementById(name+'-tiles').style.display = 'none';
                $("#" + name).find(".list-view-icon").addClass("active");
            } else {
                document.getElementById(name+'-list').style.display = 'none';
                document.getElementById(name+'-tiles').style.display = 'block';
                $("#" + name).find(".list-view-icon").removeClass("active");
                $(window).resize();
            }
        }

        export function fillFeaturedTimelines(timelines) {
            var $template = $("#template-tile .box");
            var layout = CZ.StartPage.tileLayout[1];

            for (var i = 0, len = Math.min(layout.Visibility.length, timelines.length); i < len; i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;
                var $startPage = $("#start-page");
                var $tile = $template.clone(true, true);
                var $tileImage = $tile.find(".boxInner .tile-photo img");
                var $tileTitle = $tile.find(".boxInner .tile-meta .tile-meta-title");
                var $tileAuthor = $tile.find(".boxInner .tile-meta .tile-meta-author");

                // Set appearance and click handler.
                // Initially the tile is hidden. Show it on image load.
                $tile.appendTo(layout.Name)
                    .addClass(layout.Visibility[i])
                    .attr("id", "featured" + i)
                    .click(timelineUrl, function (event) {
                        window.location.href = event.data;
                        hide();
                    })
                    .invisible();

                // Resize and crop image on load.
                $tileImage.load($tile, function (event) {
                    var $this = $(this);
                    var imageProps = event.target || event.srcElement;

                    // Resize and crop the image.
                    resizeCrop($this, imageProps);

                    // Resize and crop the image on window resize.
                    $(window).resize({
                        $image: $this,
                        imageProps: imageProps
                    }, function (event) {
                        resizeCrop(event.data.$image, event.data.imageProps);
                    });

                    // Show the tile with transition.
                    setTimeout(function () {
                        event.data.visible();
                    }, 0);
                }).attr({
                    src: timeline.ImageUrl,
                    alt: timeline.Title
                });

                // Set title and author.
                $tileTitle.text(timeline.Title.trim() || "No title :(");
                $tileAuthor.text(timeline.Author);
            }
        }

        export function fillFeaturedTimelinesList(timelines) {
            var template = "#template-timeline-list .timeline-list-item";
            var target = "#FeaturedTimelinesBlock-list";

            for (var i = 0; i < Math.min(tileData.length, timelines.length); i++){
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;

                var $timelineListItem = $(template).clone(true, true).appendTo(target);
                var $timelineListItemImage = $timelineListItem.find(".timeline-li-image img");

                var Name = "featured-list-elem" + i;
                var idx = 1;

                $timelineListItem.attr("id", "l" + idx + "i" + i);
                $timelineListItem.click(timelineUrl, function (event) {
                    window.location.href = event.data;
                    hide();
                });

                $timelineListItem.attr("data-title", timeline.Title.trim() || "No title :(");
                $timelineListItem.attr("data-author", timeline.Author);

                $timelineListItemImage.load($timelineListItemImage, function (event) {
                    var $this = $(this);
                    var imageProps = event.target || event.srcElement;

                    // Resize and crop the image.
                    resizeCrop($this, imageProps, true);
                }).attr({
                    src: timeline.ImageUrl,
                    alt: timeline.Title
                });
            }
        }

        export function fillFavoriteTimelines(timelines) {
            var $template = $("#template-tile .box");
            var layout = CZ.StartPage.tileLayout[3];

            for (var i = 0, len = Math.min(layout.Visibility.length, timelines.length); i < len; i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;
                var $startPage = $("#start-page");
                var $tile = $template.clone(true, true);
                var $tileImage = $tile.find(".boxInner .tile-photo img");
                var $tileTitle = $tile.find(".boxInner .tile-meta .tile-meta-title");
                var $tileAuthor = $tile.find(".boxInner .tile-meta .tile-meta-author");

                // Set appearance and click handler.
                // Initially the tile is hidden. Show it on image load.
                $tile.appendTo(layout.Name)
                    .addClass(layout.Visibility[i])
                    .attr("id", "favorite" + i)
                    .click(timelineUrl, function (event) {
                        window.location.href = event.data;
                        hide();
                    })
                    .invisible();

                // Resize and crop image on load.
                $tileImage.load($tile, function (event) {
                    var $this = $(this);
                    var imageProps = event.target || event.srcElement;

                    // Resize and crop the image.
                    resizeCrop($this, imageProps);

                    // Resize and crop the image on window resize.
                    $(window).resize({
                        $image: $this,
                        imageProps: imageProps
                    }, function (event) {
                        resizeCrop(event.data.$image, event.data.imageProps);
                    });

                    // Show the tile with transition.
                    setTimeout(function () {
                        event.data.visible();
                    }, 0);
                }).attr({
                    src: timeline.ImageUrl,
                    alt: timeline.Title
                });

                // Set title and author.
                $tileTitle.text(timeline.Title.trim() || "No title :(");
                $tileAuthor.text(timeline.Author);
            }
        }

        export function fillFavoriteTimelinesList(timelines) {
            var template = "#template-timeline-list .timeline-list-item";
            var target = "#FavoriteTimelinesBlock-list";

            for (var i = 0; i < Math.min(tileData.length, timelines.length) ; i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;

                var $timelineListItem = $(template).clone(true, true).appendTo(target);
                var $timelineListItemImage = $timelineListItem.find(".timeline-li-image img");

                var Name = "favorite-list-elem" + i;
                var idx = 1;

                $timelineListItem.attr("id", "lfav" + idx + "i" + i);
                $timelineListItem.click(timelineUrl, function (event) {
                    window.location.href = event.data;
                    hide();
                });

                $timelineListItem.attr("data-title", timeline.Title.trim() || "No title :(");
                $timelineListItem.attr("data-author", timeline.Author);

                $timelineListItemImage.load($timelineListItemImage, function (event) {
                    var $this = $(this);
                    var imageProps = event.target || event.srcElement;

                    // Resize and crop the image.
                    resizeCrop($this, imageProps, true);
                }).attr({
                    src: timeline.ImageUrl,
                    alt: timeline.Title
                });
            }
        }

        export function fillMyTimelines(timelines) {
            var $template = $("#template-tile .box");
            var layout = CZ.StartPage.tileLayout[4];
            for (var i = 0, len = Math.min(layout.Visibility.length, timelines.length); i < len; i++) {
                var timeline = timelines[i];
                var timelineUrl = "http://test.chronozoom.com/#/t" + timelines[0].id;
                if (i > 0) timelineUrl += "/t" + timeline.id;
                var $startPage = $("#start-page");
                var $tile = $template.clone(true, true);
                var $tileTitle = $tile.find(".boxInner .tile-meta .tile-meta-title");

                // Set appearance and click handler.
                // Initially the tile is hidden. Show it on image load.
                $tile.appendTo(layout.Name)
                    .addClass(layout.Visibility[i])
                    .attr("id", "my" + i)
                    .click(timelineUrl, function (event) {
                        window.location.href = event.data;
                        hide();
                    })
                // Set title
                $tileTitle.text(timeline.title.trim() || "No title :(");
            }
        }

        export function fillMyTimelinesList(timelines) {
            var template = "#template-timeline-list .timeline-list-item";
            var target = "#MyTimelinesBlock-list";

            for (var i = 0; i < Math.min(tileData.length, timelines.length) ; i++) {
                var timeline = timelines[i];

                var timelineUrl = "http://test.chronozoom.com/#/t" + timelines[0].id;
                if (i > 0) timelineUrl += "/t" + timeline.id;

                var $timelineListItem = $(template).clone(true, true).appendTo(target);
    
                var Name = "my-list-elem" + i;
                var idx = 1;

                $timelineListItem.attr("id", "lmy" + idx + "i" + i);
                $timelineListItem.click(timelineUrl, function (event) {
                    window.location.href = event.data;
                    hide();
                });

                $timelineListItem.attr("data-title", timeline.title.trim() || "No title :(");
            }
        }

        export function TwitterLayout(target, idx) {
            var ListTemplate = "#template-tweet-list .tweet-list-item";
            var ListElem = "#TwitterBlock-list";

            CZ.Service.getRecentTweets().done(response => {
                for (var i = 0, len = response.d.length; i < len; ++i) {
                    var tweet = response.d[i];
                    var text = tweet.Text;
                    var fullname = tweet.User.Name;
                    var username = tweet.User.ScreenName;
                    var photo = tweet.User.ProfileImageUrl;
                    var time = tweet.CreatedDate;
                    var myDate = new Date(time.match(/\d+/)[0] * 1);
                    var convertedDate = myDate.toLocaleTimeString() + "; " + myDate.getDate();
                    var tweetUsernameLink = "https://twitter.com/" + username;
                    var tweetLink = "https://twitter.com/" + username + "/statuses/" + tweet.IdStr;

                    var $tweetTile = $("#m" + idx + "i" + i);
                    var $tweetTileMeta = $tweetTile.find(".boxInner .tweet-meta");
                    var $tileMessage = $tweetTileMeta.find(".tweet-meta-text");
                    var $tileFullname = $tweetTileMeta.find(".tweet-meta-title");
                    var $tileUsername = $tweetTileMeta.find(".tweet-meta-author");
                    var $tileAvatar = $tweetTileMeta.find(".tweet-avatar-icon");
                    var $tileDate = $tweetTileMeta.find(".tile-meta-time");

                    convertedDate += "." + myDate.getMonth() + "." + myDate.getFullYear();

                    // Show content of Tweet tile on avatar load.
                    $tweetTileMeta.invisible(true);
                    $tileAvatar.load($tweetTileMeta, function (event) {
                        event.data.visible();
                    });

                    // Replace all @authors with links.
                    text = text.replace(
                        /(@([A-Za-z0-9_]+))/gi,
                        "<a class='tweet-message-link' target='blank' \
                        href='https://twitter.com/$2'>$1</a>"
                    );

                    // Replace all #tags with links.
                    text = text.replace(
                        /(#([A-Za-z0-9_]+))/gi,
                        "<a class='tweet-message-link' target='blank' \
                        href='https://twitter.com/search?q=$2&f=realtime'>$1</a>"
                    );

                    // Set tweet's properties to corresponding elements.
                    $tileMessage.html(text).attr("href", tweetLink);
                    $tileUsername.text("@" + username).attr("href", tweetUsernameLink);
                    $tileFullname.text(fullname);
                    $tileDate.text(convertedDate);

                    // Set avatar.
                    $tileAvatar.attr("src", photo);
              
                    // List View.
                    var $tweetListItem = $(ListTemplate).clone(true, true).appendTo(ListElem);
                    var $listItemMessage = $tweetListItem.find(".tweet-li-message");
                    var $listItemUsername = $tweetListItem.find(".tweet-li-header .tweet-li-username");
                    var $listItemFullname = $tweetListItem.find(".tweet-li-header .tweet-li-fullname");
                    var $listItemAvatar = $tweetListItem.find(".tweet-li-header .tweet-li-avatar");
                    var $listItemDate = $tweetListItem.find(".tweet-li-footer .tweet-li-date");
                    
                    $tweetListItem.attr("id", "l" + idx + "i" + i);
                    $listItemMessage.html(text).attr("href", tweetLink);
                    $listItemUsername.text("@" + username).attr("href", tweetUsernameLink);
                    $listItemFullname.text(fullname);
                    $listItemDate.text(convertedDate);
                    $listItemAvatar.attr("src", photo);
                }
            });
        }

        export function show() {      
            var $disabledButtons = $(".tour-icon, .timeSeries-icon, .edit-icon");
            $(".home-icon").addClass("active");

            // Disable buttons: save click handlers and remove them.
            $disabledButtons.attr("disabled", "disabled")
                .each(function (i, el) {
                    var events = $(el).data("events");
                    $(el).data("onclick", events && events.click && events.click[0]);
                })
                .off();

            // Hide regimes.
            $(".header-regimes").invisible();

            // Hide breadcrumbs.
            $(".header-breadcrumbs").invisible();

            // Hide all forms.
            CZ.HomePageViewModel.closeAllForms();

            // Show home page.
            $("#start-page").fadeIn();
        }

        export function hide() {
            var $disabledButtons = $(".tour-icon, .timeSeries-icon, .edit-icon");
            $(".home-icon").removeClass("active");

            // Enable buttons: add saved handlers.
            $disabledButtons.removeAttr("disabled")
                .each(function (i, el) {
                    $(el).click($(el).data("onclick"));
                });

            // Show regimes if necessary.
            if (_isRegimesVisible) {
                $(".header-regimes").visible();
            }

            // Show breadcrumbs.
            $(".header-breadcrumbs").visible();

            // Hide home page.
            $("#start-page").fadeOut();
        }

        export function initialize() {
            // Is regimes visible initially?
            _isRegimesVisible = $(".header-regimes").is(":visible");

            // Toggle for home button.
            $(".home-icon").click(function () {
                if ($("#start-page").is(":visible")) {
                    hide();
                } else {
                    show();
                }
            });
            
            // TODO: Replace with current user.
            CZ.Service.getUserFeatured().done(function (response) {
                // Show the newest featured timelines first.
                var timelines = response ? response.reverse() : [];
                fillFeaturedTimelines(timelines);
                fillFeaturedTimelinesList(timelines);
            });

            CZ.Service.getUserFavorites().then(response => {
                var timelines = response ? response.reverse() : [];
                
                // saving guids of favorite timelines
                timelines.forEach(function (timeline) {
                    // timelineUrl pattern is /{collection}/{supercollection}#{/t{guid}}+/t{favorite timeline guid}
                    // favorite timeline guid is the latest guid in url
                    CZ.Settings.favoriteTimelines.push(timeline.TimelineUrl.split("/").pop().slice(1));
                });

                if (timelines.length === 0) {
                    $("#FavoriteTimelinesBlock .list-view-icon").hide();
                    $("#FavoriteTimelinesBlock-tiles").text("You don't have any favorite timelines yet." +
                         "Click star icon of the timeline you like to save it as favorite.");
                }
                else {
                    fillFavoriteTimelines(timelines);
                    fillFavoriteTimelinesList(timelines);
                }
            },
            error => {
                console.log("[ERROR] getUserFavorites");
            });

            // CZ.StartPage.cloneTileTemplate("#template-tile .box", CZ.StartPage.tileLayout, 1); /* featured Timelines */
            //CZ.StartPage.cloneTileTemplate("#template-tile .box", CZ.StartPage.tileLayout, 2); /* popular Timelines */
            //CZ.StartPage.cloneListTemplate("#template-list .list-item", "#TwitterBlock-list", 2); /* featured Timelines */

            /*This part is filling MyTimelines with content*/
            CZ.Service.getTimelines(null).done(function (response) {
                // Show the newest featured timelines first.
                var roottimeline = response;
                var mytimelines = new Array();
                var i = 0;
                mytimelines[0] = roottimeline;
                roottimeline.timelines.forEach(function (timeline) {
                    i++;
                    mytimelines[i] = timeline;
                });
                fillMyTimelines(mytimelines);
                fillMyTimelinesList(mytimelines);
            });


            CZ.StartPage.cloneTweetTemplate("#template-tweet .box", CZ.StartPage.tileLayout, 2); /* Tweeted Timelines */
            CZ.StartPage.TwitterLayout(CZ.StartPage.tileLayout, 2);

            // Show home page if this is a root URL of ChronoZoom.
            var hash = CZ.UrlNav.getURL().hash;
            if (!hash.path || hash.path === "/t" + CZ.Settings.guidEmpty && !hash.params) {
                show();
            }
        }
    }
}
