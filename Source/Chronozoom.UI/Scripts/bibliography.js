function initializeBibliography() {
    $("#bibliographyBack").hide();
    $("#biblCloseButton").mouseup(function () {
        pendingBibliographyForExhibitID = null;
        $("#bibliographyBack").hide('clip', {}, 'slow');
        window.location.hash = window.location.hash.replace(new RegExp("&b=[a-z0-9_]+$", "gi"), "");
    });
}

var pendingBibliographyForExhibitID = null;

function showBibliography(descr, element, id) {
    // Bibliography link that raised showBibliohraphy.
    var sender;
    // Trying to find sender of bibliography link. Stop process of showing bibliography, if didn't find.
    try {
        sender = getChild(element, id);
    }
    catch (ex) {
        return;
    }

    var vp = vc.virtualCanvas("getViewport");
    var nav = vcelementToNavString(element, vp);

    if (window.location.hash.match("b=([a-z0-9_]+)") == null) {
        var bibl = "&b=" + id;
        if (window.location.hash.indexOf('@') == -1)
            bibl = "@" + bibl;
        nav = nav + bibl;
    }
    
    window.location.hash = nav;

    // Remove 'onmouseclick' handler from current bibliography link to prevent multiple opening animation of bibliography window.
    sender.onmouseclick = null;
    var a = $("#bibliographyBack").css("display");
    if ($("#bibliographyBack").css("display") == "none") {
        $("#bibliographyBack").show('clip', {}, 'slow', function () {
            // After bibliography window was fully opened, reset 'onmouseclick' handler for sender of bibliography link.
            sender.onmouseclick = function (e) {
                this.vc.element.css('cursor', 'default');
                showBibliography({ infodot: descr.infodot, contentItems: descr.contentItems }, element, id);

                return true;
            }
        });
    } else {
        // After bibliography window was fully opened, reset 'onmouseclick' handler for sender of bibliography link.
        sender.onmouseclick = function (e) {
            
            this.vc.element.css('cursor', 'default');
            showBibliography({ infodot: descr.infodot, contentItems: descr.contentItems }, element, id);

            return true;
        }
    }


    // clearing all fields
    $("#bibliography .sources").empty();
    $("#bibliography .title").html("<span></span> &gt; Bibliography");
    // Filling with new information
    if (descr) {
        if (descr.infodot) {
            $("#bibliography .title span").html(descr.infodot.title);
            getBibliography(descr.infodot.guid, descr.contentItems);
        }
        else {
            $("#bibliography .title span").html('');
        }
    }
}

function getBibliography(exhibitID, contentItems) {
    pendingBibliographyForExhibitID = exhibitID;

    var onBiblReceived = function (response) {
        if (exhibitID != pendingBibliographyForExhibitID) return; // obsolete response

        var sources = $("#bibliography .sources");
        sources.empty();
        if (!response) return; // obsolete response

        response.sort(function (a, b) {
            if (a.Authors && b.Authors) return a.Authors > b.Authors ? 1 : -1;
            if (a.Authors) return 1;
            if (b.Authors) return -1;
            if (a.Title && b.Title) return a.Title > b.Title ? 1 : -1;
            if (a.Title) return 1;
            if (b.Title) return -1;
            return 0;
        });

        if (response.length != 0) {
            $('<div class="sectionTitle" id="biblAdditionalResources">Additional Resources</div>').
                appendTo(sources);
            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                var source = $('<div class="source"></div>').appendTo(sources);
                $('<div class="sourceName"><a href="' + r.Source + '" target="_blank">' + r.Source + '<a/></div>').appendTo(source);

                // http://www.chicagomanualofstyle.org/tools_citationguide.html
                var descr = r.Authors ? r.Authors : '';
                if (r.Title) {
                    if (descr != '') descr += '<br>';
                    descr += "<i>" + r.Title + "</i>";
                }
                if (r.Publication) {
                    if (descr != '') descr += '<br>';
                    descr += r.Publication;
                }
                if (r.PublicationDates) {
                    if (descr != '') descr += ', ';
                    descr += r.PublicationDates;
                }
                if (r.PageNumbers) {
                    if (descr != '') descr += ', ';
                    descr += r.PageNumbers;
                }

                $('<div class="sourceDescr">' + descr + '</div>').appendTo(source);
            }
        }
        if (contentItems.length != 0) {
            $('<div class="sectionTitle" id="biblAdditionalResources">Current Resources</div>').
                appendTo(sources);
            for (var i = 0; i < contentItems.length; i++) {
                var r = contentItems[i];
                var source = $('<div class="source"></div>').appendTo(sources);
                if (r.mediaSource) {
                    $('<div class="sourceName"><a href="' + r.mediaSource + '" target="_blank">' + r.mediaSource + '<a/></div>').appendTo(source);
                } else {
                    $('<br/>').appendTo(source);
                }

                var descr = '';
                if (r.title) {
                    descr += "<i>" + r.title + "</i>";
                }
                if (r.attribution) {
                    if (descr != '') descr += '<br>';
                    descr += r.attribution;
                }

                $('<div class="sourceDescr">' + descr + '</div>').appendTo(source);
            }
        }
    };

    var url;
    switch (czDataSource) {
        case 'db': url = "Chronozoom.svc/GetBibliography";
            break;
        default: url = "Chronozoom.svc/GetBibliographyRelay";
            break;
    }
    $.ajax({
        cache: false,
        type: "GET",
        async: true,
        dataType: "json",
        data: { exhibitID: exhibitID },
        url: url,
        success: function (result) {
            if (czDataSource == 'db')
                onBiblReceived(result.d);
            else
                onBiblReceived(eval(result.d));
        },
        error: function (xhr) {
            alert("Error connecting to service: " + xhr.responseText);
        }
    });

    /*
    // todo: make ajax call here
    setTimeout(function () {
    var response = [{ "__type": "Reference:#Chronozoom.Entities",
    "Authors": "Rick Potts",
    "BookChapters": "1",
    "CitationType": "Website",
    "ID": "64c4c9ea-db5e-4b28-91e5-8cf0f8a3282e",
    "PageNumbers": "1",
    "Publication": "Smithsonian National Museum of Natural History",
    "PublicationDates": "2011",
    "Source": "http:\/\/humanorigins.si.edu\/research\/whats-hot\/human-origins-program-blogs-field-summer",
    "Title": "The Human Origins Program blogs from the field this summer!"
    },

    { "__type": "Reference:#Chronozoom.Entities",
    "Authors": "Carl Zimmer",
    "BookChapters": "1",
    "CitationType": "Article",
    "ID": "f2485a9b-1c6d-4034-bb30-65377aa18028",
    "PageNumbers": "1",
    "Publication": "New York Times - Science",
    "PublicationDates": "August 23, 2011",
    "Source": "http:\/\/www.nytimes.com\/2011\/08\/30\/science\/30species.html?_r=2",
    "Title": "How Many Species? A Study Says 8.7 Million, but It’s Tricky"
    },

    { "__type": "Reference:#Chronozoom.Entities", "Authors": "J. D. Watson and F. H. C. Crick", "BookChapters": "1", "CitationType": "Paper", "ID": "d3d1ba7b-2028-4fab-9652-ecfc667b33cf", "PageNumbers": "171, 737-738", "Publication": "Nature", "PublicationDates": "April 25, 1953", "Source": "http:\/\/www.exploratorium.edu\/origins\/coldspring\/ideas\/printit.html", "Title": "A Structure for Deoxyribose Nucleic Acid" }, { "__type": "Reference:#Chronozoom.Entities", "Authors": "Paul Rincon", "BookChapters": "1", "CitationType": "Article", "ID": "d8f01b95-1f38-43ea-b086-57ff3a834a9c", "PageNumbers": "1", "Publication": "BBC News", "PublicationDates": "17 December, 2003", "Source": "http:\/\/news.bbc.co.uk\/2\/hi\/science\/nature\/3321819.stm", "Title": "Oldest evidence of photosynthesis" }, { "__type": "Reference:#Chronozoom.Entities", "Authors": "Tim Appenzeller", "BookChapters": "1", "CitationType": "Article", "ID": "7a9a60d7-ba6e-47d1-b916-6db01ede60db", "PageNumbers": "1", "Publication": "National Geographic", "PublicationDates": "February 2004", "Source": "http:\/\/ngm.nationalgeographic.com\/ngm\/0402\/feature5\/online_extra.html",
    "Title": "The case of the missing carbon"
    }];
    onBiblReceived(response);
    }, 2000);*/
}

