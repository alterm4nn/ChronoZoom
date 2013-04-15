var CZ;
(function (CZ) {
    (function (BreadCrumbs) {
        var hiddenFromLeft = [];
        var hiddenFromRight = [];
        BreadCrumbs.visibleAreaWidth = 0;
        var breadCrumbs;
        function updateBreadCrumbsLabels(newBreadCrumbs) {
            if(newBreadCrumbs) {
                if(breadCrumbs == null) {
                    breadCrumbs = newBreadCrumbs;
                    for(var i = 0; i < breadCrumbs.length; i++) {
                        addBreadCrumb(breadCrumbs[i].vcElement);
                    }
                    moveToRightEdge();
                    return;
                }
                for(var i = 0; i < breadCrumbs.length; i++) {
                    if(newBreadCrumbs[i] == null) {
                        removeBreadCrumb();
                    } else if(newBreadCrumbs[i].vcElement.id != breadCrumbs[i].vcElement.id) {
                        for(var j = i; j < breadCrumbs.length; j++) {
                            removeBreadCrumb();
                        }
                        for(var j = i; j < newBreadCrumbs.length; j++) {
                            addBreadCrumb(newBreadCrumbs[j].vcElement);
                        }
                        breadCrumbs = newBreadCrumbs;
                        return;
                    }
                }
                moveToRightEdge();
                for(var i = breadCrumbs.length; i < newBreadCrumbs.length; i++) {
                    addBreadCrumb(newBreadCrumbs[i].vcElement);
                }
                moveToRightEdge();
                breadCrumbs = newBreadCrumbs;
            }
        }
        BreadCrumbs.updateBreadCrumbsLabels = updateBreadCrumbsLabels;
        function updateHiddenBreadCrumbs() {
            hiddenFromLeft = [];
            hiddenFromRight = [];
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            $("#breadcrumbs-table tr td").each(function (index) {
                if($(this).attr("moving") != "left" && $(this).attr("moving") != "right") {
                    var elementOffset = $(this).position().left + tableOffset;
                    var elementWidth = $(this).width();
                    if(index == 0) {
                        if(elementOffset < 0) {
                            hiddenFromLeft.push(index);
                        }
                    } else if(index == $("#breadcrumbs-table tr td").length - 1) {
                        if(elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth) {
                            hiddenFromRight.push(index);
                        }
                    } else {
                        if(elementOffset + elementWidth / 3 < 0) {
                            hiddenFromLeft.push(index);
                        } else if(elementOffset + elementWidth * 2 / 3 > BreadCrumbs.visibleAreaWidth) {
                            hiddenFromRight.push(index);
                        }
                    }
                }
            });
            hiddenFromRight.reverse();
            if(hiddenFromLeft.length != 0) {
                $("#breadcrumbs-nav-left").stop(true, true).fadeIn('fast');
            } else {
                $("#breadcrumbs-nav-left").stop(true, true).fadeOut('fast');
            }
            if(hiddenFromRight.length != 0) {
                $("#breadcrumbs-nav-right").stop(true, true).fadeIn('fast');
            } else {
                $("#breadcrumbs-nav-right").stop(true, true).fadeOut('fast');
            }
        }
        BreadCrumbs.updateHiddenBreadCrumbs = updateHiddenBreadCrumbs;
        function showHiddenBreadCrumb(direction, index) {
            if(index == null) {
                updateHiddenBreadCrumbs();
                switch(direction) {
                    case "left":
                        if(hiddenFromLeft.length != 0) {
                            index = hiddenFromLeft.pop();
                        } else {
                            return;
                        }
                        break;
                    case "right":
                        if(hiddenFromRight.length != 0) {
                            index = hiddenFromRight.pop();
                        } else {
                            return;
                        }
                        break;
                }
            }
            $("#breadcrumbs-table tr").stop();
            var element = $("#bc_" + index);
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var elementOffset = element.position().left + tableOffset;
            var offset = 0;
            switch(direction) {
                case "left":
                    offset = -elementOffset;
                    break;
                case "right":
                    var elementWidth = element.width();
                    offset = BreadCrumbs.visibleAreaWidth - elementOffset - elementWidth - 1;
                    break;
            }
            if(offset != 0) {
                var str = "+=" + offset + "px";
                element.attr("moving", direction);
                $("#breadcrumbs-table tr").animate({
                    "left": str
                }, "slow", function () {
                    $("#breadcrumbs-table tr td").each(function () {
                        $(this).attr("moving", "false");
                    });
                    updateHiddenBreadCrumbs();
                });
            }
        }
        function moveToRightEdge(callback) {
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var tableWidth = $("#breadcrumbs-table tr").width();
            if(tableOffset <= 0) {
                var tableVisible = tableWidth + tableOffset;
                var difference = 0;
                if(tableWidth >= BreadCrumbs.visibleAreaWidth) {
                    if(tableVisible > BreadCrumbs.visibleAreaWidth) {
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    } else {
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    }
                } else {
                    difference = -tableOffset;
                }
                $("#breadcrumbs-table tr").stop();
                if(difference != 0) {
                    var str = "+=" + difference + "px";
                    $("#breadcrumbs-table tr").animate({
                        "left": str
                    }, "fast", function () {
                        $("#breadcrumbs-table tr td").each(function () {
                            $(this).attr("moving", "false");
                        });
                        updateHiddenBreadCrumbs();
                        if(callback != null) {
                            callback();
                        }
                    });
                }
            }
        }
        function removeBreadCrumb() {
            var length = $("#breadcrumbs-table tr td").length;
            if(length > 0) {
                var selector = "#bc_" + (length - 1);
                $(selector).remove();
                if(length > 1) {
                    selector = "#bc_" + (length - 2);
                    $(selector + " .breadcrumb-separator").hide();
                }
            }
        }
        function addBreadCrumb(element) {
            var length = $("#breadcrumbs-table tr td").length;
            var parent = $("#breadcrumbs-table tr");
            var td = $("<td id='bc_" + length + "'></td>");
            var div = $("<div class='breadcrumb-link' id='bc_link_" + element.id + "'></div>").click(function () {
                clickOverBreadCrumb(element.id, length);
            });
            var span = $("<span class='breadcrumb-separator' id='bc_'>&rsaquo;</span>");
            td.append(div);
            td.append(span);
            parent.append(td);
            div.text(element.title);
            switch(element.regime) {
                case "Cosmos":
                    $("#bc_link_" + element.id).addClass("breadcrumb-cosmos");
                    break;
                case "Earth":
                    $("#bc_link_" + element.id).addClass("breadcrumb-earth");
                    break;
                case "Life":
                    $("#bc_link_" + element.id).addClass("breadcrumb-life");
                    break;
                case "Pre-history":
                    $("#bc_link_" + element.id).addClass("breadcrumb-prehistory");
                    break;
                case "Humanity":
                    $("#bc_link_" + element.id).addClass("breadcrumb-humanity");
                    break;
            }
            $("#bc_" + length + " .breadcrumb-separator").hide();
            if(length > 0) {
                $("#bc_" + (length - 1) + " .breadcrumb-separator").show();
            }
            $("#bc_link_" + element.id).mouseover(function () {
                breadCrumbMouseOver(this);
            });
            $("#bc_link_" + element.id).mouseout(function () {
                breadCrumbMouseOut(this);
            });
        }
        function breadCrumbNavLeft() {
            var movingLeftBreadCrumbs = 0;
            var num = 0;
            $("#breadcrumbs-table tr td").each(function (index) {
                if($(this).attr("moving") == "left") {
                    movingLeftBreadCrumbs++;
                    if(num == 0) {
                        num = index;
                    }
                }
            });
            if(movingLeftBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = num - CZ.Settings.longNavigationLength;
                if(index < 0) {
                    index = 0;
                }
                showHiddenBreadCrumb("left", index);
            } else if(movingLeftBreadCrumbs < CZ.Settings.navigateNextMaxCount) {
                showHiddenBreadCrumb("left");
            }
        }
        BreadCrumbs.breadCrumbNavLeft = breadCrumbNavLeft;
        function breadCrumbNavRight() {
            var movingRightBreadCrumbs = 0;
            var num = 0;
            $("#breadcrumbs-table tr td").each(function (index) {
                if($(this).attr("moving") == "right") {
                    movingRightBreadCrumbs++;
                    num = index;
                }
            });
            if(movingRightBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = num + CZ.Settings.longNavigationLength;
                if(index >= $("#breadcrumbs-table tr td").length) {
                    index = $("#breadcrumbs-table tr td").length - 1;
                }
                showHiddenBreadCrumb("right", index);
            } else if(movingRightBreadCrumbs < CZ.Settings.navigateNextMaxCount) {
                showHiddenBreadCrumb("right");
            }
        }
        BreadCrumbs.breadCrumbNavRight = breadCrumbNavRight;
        function clickOverBreadCrumb(timelineID, breadCrumbLinkID) {
            CZ.Search.goToSearchResult(timelineID);
            var selector = "#bc_" + breadCrumbLinkID;
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var elementOffset = $(selector).position().left + tableOffset;
            var elementWidth = $(selector).width();
            if(elementOffset < 0) {
                showHiddenBreadCrumb("left", breadCrumbLinkID);
            } else if(elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth) {
                showHiddenBreadCrumb("right", breadCrumbLinkID);
            }
        }
        BreadCrumbs.clickOverBreadCrumb = clickOverBreadCrumb;
        function breadCrumbMouseOut(element) {
            $(element).removeClass("breadcrumb-hover");
        }
        function breadCrumbMouseOver(element) {
            $(element).addClass("breadcrumb-hover");
        }
        function changeToOff(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_on", "_off"));
        }
        function changeToOn(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_off", "_on"));
        }
    })(CZ.BreadCrumbs || (CZ.BreadCrumbs = {}));
    var BreadCrumbs = CZ.BreadCrumbs;
})(CZ || (CZ = {}));
