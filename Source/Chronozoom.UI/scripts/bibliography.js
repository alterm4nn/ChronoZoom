﻿var CZ;
(function (CZ) {
    (function (Bibliography) {
        function initializeBibliography() {
            $("#bibliographyBack").hide();
            $("#biblCloseButton").mouseup(function () {
                pendingBibliographyForExhibitID = null;
                $("#bibliographyBack").hide('clip', {}, 'slow');
                window.location.hash = window.location.hash.replace(new RegExp("&b=[a-z0-9_\-]+$", "gi"), "");
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

            if (window.location.hash.match("b=([a-z0-9_\-]+)") == null) {
                var bibl = "&b=" + id;
                if (window.location.hash.indexOf('@') == -1)
                    bibl = "@" + bibl;
                nav = nav + bibl;
            }

            window.location.hash = nav;

            sender.onmouseclick = null;
            var a = $("#bibliographyBack").css("display");
            if ($("#bibliographyBack").css("display") == "none") {
                $("#bibliographyBack").show('clip', {}, 'slow', function () {
                    sender.onmouseclick = function (e) {
                        CZ.Common.vc.css('cursor', 'default');
                        showBibliography({ infodot: descr.infodot, contentItems: descr.contentItems }, element, id);

                        return true;
                    };
                });
            } else {
                sender.onmouseclick = function (e) {
                    CZ.Common.vc.css('cursor', 'default');
                    showBibliography({ infodot: descr.infodot, contentItems: descr.contentItems }, element, id);

                    return true;
                };
            }

            $("#bibliography .sources").empty();

            if (descr) {
                if (descr.infodot) {
                    $("#bibliography .title").text(descr.infodot.title + " > Bibliography");
                    getBibliography(descr.infodot.guid, descr.contentItems);
                } else {
                    $("#bibliography .title").text("> Bibliography");
                }
            }
        }
        Bibliography.showBibliography = showBibliography;

        function getBibliography(exhibitID, contentItems) {
            if (contentItems.length != 0) {
                var sources = $("#bibliography .sources");
                sources.empty();

                $("<div></div>", {
                    id: "biblAdditionalResources",
                    class: "sectionTitle",
                    text: "Current Resources"
                }).appendTo(sources);

                for (var i = 0; i < contentItems.length; i++) {
                    var r = contentItems[i];
                    var source = $("<div></div>", {
                        class: "source"
                    }).appendTo(sources);

                    if (r.mediaSource) {
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

                    var sourceDescr = $("<div></div>", {
                        class: "sourceDescr"
                    });

                    if (r.title) {
                        $("<i></i>", {
                            text: r.title,
                            class: "truncateText"
                        }).appendTo(sourceDescr);
                    }
                    if (r.attribution) {
                        if (r.title !== '') {
                            $("<br></br>", {}).appendTo(sourceDescr);
                        }
                        $("<div></div>", {
                            text: r.attribution,
                            class: "truncateText"
                        }).appendTo(sourceDescr);
                    }

                    sourceDescr.appendTo(source);
                }
            }
        }
    })(CZ.Bibliography || (CZ.Bibliography = {}));
    var Bibliography = CZ.Bibliography;
})(CZ || (CZ = {}));
;
