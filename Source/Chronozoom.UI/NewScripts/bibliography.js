var CZ;
(function (CZ) {
    (function (Bibliography) {
        function initializeBibliography() {
            $("#bibliographyBack").hide();
            $("#biblCloseButton").mouseup(function () {
                pendingBibliographyForExhibitID = null;
                $("#bibliographyBack").hide('clip', {
                }, 'slow');
                window.location.hash = window.location.hash.replace(new RegExp("&b=[a-z0-9_]+$", "gi"), "");
            });
        }
        Bibliography.initializeBibliography = initializeBibliography;
        var pendingBibliographyForExhibitID = null;
        function showBibliography(descr, element, id) {
            var sender;
            try  {
                sender = CZ.VCContent.getChild(element, id);
            } catch (ex) {
                return;
            }
            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            var nav = CZ.UrlNav.vcelementToNavString(element, vp);
            if(window.location.hash.match("b=([a-z0-9_]+)") == null) {
                var bibl = "&b=" + id;
                if(window.location.hash.indexOf('@') == -1) {
                    bibl = "@" + bibl;
                }
                nav = nav + bibl;
            }
            window.location.hash = nav;
            sender.onmouseclick = null;
            var a = $("#bibliographyBack").css("display");
            if($("#bibliographyBack").css("display") == "none") {
                $("#bibliographyBack").show('clip', {
                }, 'slow', function () {
                    sender.onmouseclick = function (e) {
                        CZ.Common.vc.css('cursor', 'default');
                        showBibliography({
                            infodot: descr.infodot,
                            contentItems: descr.contentItems
                        }, element, id);
                        return true;
                    };
                });
            } else {
                sender.onmouseclick = function (e) {
                    CZ.Common.vc.css('cursor', 'default');
                    showBibliography({
                        infodot: descr.infodot,
                        contentItems: descr.contentItems
                    }, element, id);
                    return true;
                };
            }
            $("#bibliography .sources").empty();
            if(descr) {
                if(descr.infodot) {
                    $("#bibliography .title").text(descr.infodot.title + " > Bibliography");
                    getBibliography(descr.infodot.guid, descr.contentItems);
                } else {
                    $("#bibliography .title").text("> Bibliography");
                }
            }
        }
        Bibliography.showBibliography = showBibliography;
        function getBibliography(exhibitID, contentItems) {
            pendingBibliographyForExhibitID = exhibitID;
            var onBiblReceived = function (response) {
                if(exhibitID != pendingBibliographyForExhibitID) {
                    return;
                }
                var sources = $("#bibliography .sources");
                sources.empty();
                if(!response) {
                    return;
                }
                response.sort(function (a, b) {
                    if(a.Authors && b.Authors) {
                        return a.Authors > b.Authors ? 1 : -1;
                    }
                    if(a.Authors) {
                        return 1;
                    }
                    if(b.Authors) {
                        return -1;
                    }
                    if(a.Title && b.Title) {
                        return a.Title > b.Title ? 1 : -1;
                    }
                    if(a.Title) {
                        return 1;
                    }
                    if(b.Title) {
                        return -1;
                    }
                    return 0;
                });
                if(response.length != 0) {
                    $("<div></div>", {
                        id: "biblAdditionalResources",
                        class: "sectionTitle",
                        text: "Additional Resources"
                    }).appendTo(sources);
                    for(var i = 0; i < response.length; i++) {
                        var r = response[i];
                        var source = $("<div></div>", {
                            class: "source"
                        }).appendTo(sources);
                        $("<div></div>", {
                            class: "sourceName"
                        }).append($("<a></a>", {
                            href: r.Source,
                            target: "_blank",
                            text: r.Source
                        })).appendTo(source);
                        var descr = r.Authors ? r.Authors : '';
                        if(r.Title) {
                            if(descr != '') {
                                descr += '<br>';
                            }
                            descr += "<i>" + r.Title + "</i>";
                        }
                        if(r.Publication) {
                            if(descr != '') {
                                descr += '<br>';
                            }
                            descr += r.Publication;
                        }
                        if(r.PublicationDates) {
                            if(descr != '') {
                                descr += ', ';
                            }
                            descr += r.PublicationDates;
                        }
                        if(r.PageNumbers) {
                            if(descr != '') {
                                descr += ', ';
                            }
                            descr += r.PageNumbers;
                        }
                        $("<div></div>", {
                            class: "sourceDescr",
                            text: descr
                        }).appendTo(source);
                    }
                }
                if(contentItems.length != 0) {
                    $("<div></div>", {
                        id: "biblAdditionalResources",
                        class: "sectionTitle",
                        text: "Current Resources"
                    }).appendTo(sources);
                    for(var i = 0; i < contentItems.length; i++) {
                        var r = contentItems[i];
                        var source = $("<div></div>", {
                            class: "source"
                        }).appendTo(sources);
                        if(r.mediaSource) {
                            $("<div></div>", {
                                class: "sourceName"
                            }).append($("<a></a>", {
                                href: r.mediaSource,
                                target: "_blank",
                                text: r.mediaSource
                            })).appendTo(source);
                        } else {
                            $('<br/>').appendTo(source);
                        }
                        var descr = '';
                        if(r.title) {
                            descr += "<i>" + r.title + "</i>";
                        }
                        if(r.attribution) {
                            if(descr != '') {
                                descr += '<br>';
                            }
                            descr += r.attribution;
                        }
                        $("<div></div>", {
                            class: "sourceDescr",
                            text: descr
                        }).appendTo(source);
                    }
                }
            };
            var url;
            switch(CZ.Settings.czDataSource) {
                case 'db':
                    url = "Chronozoom.svc/GetBibliography";
                    break;
                default:
                    url = "Chronozoom.svc/GetBibliographyRelay";
                    break;
            }
            $.ajax({
                cache: false,
                type: "GET",
                async: true,
                dataType: "json",
                data: {
                    exhibitID: exhibitID
                },
                url: url,
                success: function (result) {
                    onBiblReceived(result.d);
                },
                error: function (xhr) {
                    console.log("Error connecting to service: " + xhr.responseText);
                }
            });
        }
    })(CZ.Bibliography || (CZ.Bibliography = {}));
    var Bibliography = CZ.Bibliography;
})(CZ || (CZ = {}));
;
