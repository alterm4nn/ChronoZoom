var CZ;
(function (CZ) {
    (function (StartPage) {
        var _isRegimesVisible;
        StartPage.tileData = [
            {
                "Idx": 0,
                "Title": "Big History",
                "Thumbnail": "../images/dummy/tile_bighistory.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999998954347&y=-0.46459331778482354&w=3.841695822797034e-12&h=3.7430627449314544e-12"
            }, 
            {
                "Idx": 1,
                "Title": "CERN",
                "Thumbnail": "../images/dummy/tile_cern.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999192440875&y=-0.4645933209201501&w=3.729306137185042e-11&h=3.633558592459924e-11"
            }, 
            {
                "Idx": 2,
                "Title": "Earth Science",
                "Thumbnail": "../images/dummy/tile_earthscience.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999988061194&y=-0.46459331795948755&w=4.546120315559252e-12&h=4.4294015903520115e-12"
            }, 
            {
                "Idx": 3,
                "Title": "King Tut",
                "Thumbnail": "../images/dummy/tile_kingtut.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999967062717304&y=-0.4645931999741229&w=3.5221148563086766e-10&h=3.4316868149181225e-10"
            }, 
            {
                "Idx": 4,
                "Title": "Napoleon",
                "Thumbnail": "../images/dummy/tile_napoleon.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999840411981&y=-0.46459346560505227&w=5.935054278147061e-10&h=5.782675563705605e-10"
            }, 
            {
                "Idx": 5,
                "Title": "World War I",
                "Thumbnail": "../images/dummy/tile_ww1.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999485392826&y=-0.4645933221621095&w=3.314938789411939e-12&h=3.229829860746773e-12"
            }, 
            {
                "Idx": 6,
                "Title": "Coluseum",
                "Thumbnail": "../images/dummy/tile_colosseum.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999988732590944&y=-0.4645934478931077&w=1.0069124184819225e-9&h=9.810605875309654e-10"
            }, 
            {
                "Idx": 7,
                "Title": "Justin Morrill",
                "Thumbnail": "../images/dummy/tile_justin_morrill.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999897945675&y=-0.46459338150077905&w=1.9362194151655837e-10&h=1.8865082227261387e-10"
            }, 
            {
                "Idx": 8,
                "Title": "Big History 2",
                "Thumbnail": "../images/dummy/tile_bighistory.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4996898109169686&y=-0.46442779133805834&w=0.0007080832576286593&h=0.0006899036738441856"
            }
        ];
        StartPage.tileLayout = [
            {
                "Name": "#combo0-icons",
                "Visibility": [
                    "box", 
                    "box", 
                    "box ex3", 
                    "box ex3 ex4", 
                    "box ex3 ex4 ex6", 
                    "box ex3 ex4 ex6"
                ]
            }, 
            {
                "Name": "#FeaturedTimelinesBlock-tiles",
                "Visibility": [
                    "box", 
                    "box", 
                    "box ex3", 
                    "box ex3 ex4", 
                    "box ex3 ex4 ex6", 
                    "box ex3 ex4 ex6"
                ]
            }, 
            {
                "Name": "#TwitterBlock",
                "Visibility": [
                    "box", 
                    "box", 
                    "box ex3", 
                    "box ex3 ex4", 
                    "box ex3 ex4 ex6", 
                    "box ex3 ex4 ex6"
                ]
            }, 
            
        ];
        function resizeCrop($image, imageProps) {
            var $startPage = $("#start-page");
            var width = $image.parent().width();
            var height = $image.parent().height();
            if(!$startPage.is(":visible")) {
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
            if(naturalWidth > naturalHeight) {
                $image.height(height);
                $image.width(height * ratio);
                marginLeft = ($image.width() - width) / 2;
            } else if(naturalWidth < naturalHeight) {
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
        function cloneTileTemplate(template, target, idx) {
            for(var i = 0; i < target[idx].Visibility.length; i++) {
                var o = $(template).clone(true, true).appendTo(target[idx].Name);
                o.attr("class", target[idx].Visibility[i]);
                o.attr("id", "t" + idx + "i" + i);
                $("#t" + idx + "i" + i + " .boxInner .tile-photo img").attr("src", StartPage.tileData[i].Thumbnail).attr("alt", StartPage.tileData[i].Title);
                $("#t" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-title").text(StartPage.tileData[i].Title);
                $("#t" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-author").text(StartPage.tileData[i].Author);
            }
        }
        StartPage.cloneTileTemplate = cloneTileTemplate;
        function cloneListTemplate(template, target, idx) {
            for(var i = 0; i < StartPage.tileData.length; i++) {
                var o = $(template).clone(true, true).appendTo(target);
                o.attr("id", "l" + idx + "i" + i);
                $("#l" + idx + "i" + i + " .li-title a").attr("href", StartPage.tileData[i].URL);
                $("#l" + idx + "i" + i + " .li-title a").text(StartPage.tileData[i].Title);
                $("#l" + idx + "i" + i + " .li-author").text(StartPage.tileData[i].Author);
                $("#l" + idx + "i" + i + " .li-icon").text(StartPage.tileData[i].Thumbnail);
            }
        }
        StartPage.cloneListTemplate = cloneListTemplate;
        function cloneTweetTemplate(template, target, idx) {
            for(var i = 0; i < target[idx].Visibility.length; i++) {
                var o = $(template).clone(true, true).appendTo(target[idx].Name);
                o.attr("class", target[idx].Visibility[i]);
                o.attr("id", "m" + idx + "i" + i);
            }
        }
        StartPage.cloneTweetTemplate = cloneTweetTemplate;
        function PlayIntroTour() {
            var intoTour = CZ.Tours.tours[0];
            if(typeof intoTour === "undefined") {
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
                context: intoTour
            });
            CZ.Tours.tourCaptionForm.show();
            CZ.Tours.activateTour(intoTour, undefined);
        }
        StartPage.PlayIntroTour = PlayIntroTour;
        function TwitterLayout(target, idx) {
            CZ.Service.getRecentTweets().done(function (response) {
                for(var i = 0, len = response.d.length; i < len; ++i) {
                    var text = response.d[i].Text;
                    var author = response.d[i].User.Name;
                    var time = response.d[i].CreatedDate;
                    var myDate = new Date(time.match(/\d+/)[0] * 1);
                    var convertedDate = myDate.toLocaleTimeString() + "; " + myDate.getDate();
                    convertedDate += "." + myDate.getMonth() + "." + myDate.getFullYear();
                    $("#m" + idx + "i" + i + " .boxInner .tile-meta .tweet-meta-text").text(text);
                    $("#m" + idx + "i" + i + " .boxInner .tile-meta .tweet-meta-author").text(author);
                    $("#m" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-time").text(convertedDate);
                }
            });
        }
        StartPage.TwitterLayout = TwitterLayout;
        function listFlip(name) {
            if('block' != document.getElementById(name + '-list').style.display) {
                document.getElementById(name + '-list').style.display = 'block';
                document.getElementById(name + '-tiles').style.display = 'none';
                $("#" + name).find(".list-view-icon").addClass("active");
            } else {
                document.getElementById(name + '-list').style.display = 'none';
                document.getElementById(name + '-tiles').style.display = 'block';
                $("#" + name).find(".list-view-icon").removeClass("active");
            }
        }
        StartPage.listFlip = listFlip;
        function fillFeaturedTimelines(timelines) {
            var $template = $("#template-tile .box");
            var layout = CZ.StartPage.tileLayout[1];
            for(var i = 0, len = Math.min(layout.Visibility.length, timelines.length); i < len; i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;
                var $startPage = $("#start-page");
                var $tile = $template.clone(true, true);
                var $tileImage = $tile.find(".boxInner .tile-photo img");
                var $tileTitle = $tile.find(".boxInner .tile-meta .tile-meta-title");
                var $tileAuthor = $tile.find(".boxInner .tile-meta .tile-meta-author");
                $tile.appendTo(layout.Name).addClass(layout.Visibility[i]).attr("id", "featured" + i).click(timelineUrl, function (event) {
                    window.location.href = event.data;
                    hide();
                }).invisible();
                $tileImage.load($tile, function (event) {
                    var $this = $(this);
                    var imageProps = event.srcElement;
                    resizeCrop($this, imageProps);
                    $(window).resize({
                        $image: $this,
                        imageProps: imageProps
                    }, function (event) {
                        resizeCrop(event.data.$image, event.data.imageProps);
                    });
                    setTimeout(function () {
                        event.data.visible();
                    }, 0);
                }).attr({
                    src: timeline.ImageUrl,
                    alt: timeline.Title
                });
                $tileTitle.text(timeline.Title);
                $tileAuthor.text(timeline.Author);
            }
        }
        StartPage.fillFeaturedTimelines = fillFeaturedTimelines;
        function fillFeaturedTimelinesList(timelines) {
            var template = "#template-list .list-item";
            var target = "#FeaturedTimelinesBlock-list";
            for(var i = 0; i < Math.min(StartPage.tileData.length, timelines.length); i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;
                var TemplateClone = $(template).clone(true, true).appendTo(target);
                var Name = "featured-list-elem" + i;
                var idx = 1;
                TemplateClone.attr("id", "l" + idx + "i" + i);
                $("#l" + idx + "i" + i + " .li-title a").attr("href", timelineUrl);
                $("#l" + idx + "i" + i + " .li-title a").text(timeline.Title);
                $("#l" + idx + "i" + i + " .li-author").text(timeline.Author);
            }
        }
        StartPage.fillFeaturedTimelinesList = fillFeaturedTimelinesList;
        function show() {
            var $disabledButtons = $(".tour-icon, .timeSeries-icon, .edit-icon");
            $(".home-icon").addClass("active");
            $disabledButtons.attr("disabled", "disabled").each(function (i, el) {
                var events = $(el).data("events");
                $(el).data("onclick", events && events.click && events.click[0]);
            }).off();
            $(".header-regimes").invisible();
            $(".header-breadcrumbs").invisible();
            CZ.HomePageViewModel.closeAllForms();
            $("#start-page").fadeIn();
        }
        StartPage.show = show;
        function hide() {
            var $disabledButtons = $(".tour-icon, .timeSeries-icon, .edit-icon");
            $(".home-icon").removeClass("active");
            $disabledButtons.removeAttr("disabled").each(function (i, el) {
                $(el).click($(el).data("onclick"));
            });
            if(_isRegimesVisible) {
                $(".header-regimes").visible();
            }
            $(".header-breadcrumbs").visible();
            $("#start-page").fadeOut();
        }
        StartPage.hide = hide;
        function initialize() {
            _isRegimesVisible = $(".header-regimes").is(":visible");
            $(".home-icon").click(function () {
                if($("#start-page").is(":visible")) {
                    hide();
                } else {
                    show();
                }
            });
            CZ.Service.getUserFeatured("63c4373e-6712-44a6-9bb4-b99a2783f53a").done(function (response) {
                fillFeaturedTimelines(response);
                fillFeaturedTimelinesList(response);
            });
            CZ.StartPage.cloneTweetTemplate("#template-tweet .box", CZ.StartPage.tileLayout, 2);
            CZ.StartPage.TwitterLayout(CZ.StartPage.tileLayout, 2);
            var hash = CZ.UrlNav.getURL().hash;
            if(!hash.path || hash.path === "/t" + CZ.Settings.guidEmpty && !hash.params) {
                show();
            }
        }
        StartPage.initialize = initialize;
    })(CZ.StartPage || (CZ.StartPage = {}));
    var StartPage = CZ.StartPage;
})(CZ || (CZ = {}));
