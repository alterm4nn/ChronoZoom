var hiddenFromLeft = [];
var hiddenFromRight = [];
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
/// <reference path='cz.settings.ts'/>
/// <reference path='search.ts'/>
var hiddenFromLeft = [];// hidden breadcrumbs from the left side

var hiddenFromRight = [];// hidden breadcrumbs from the right side

// Updates current breadcrumbs path, raised when breadcrumbs path has changed.
// @param  newBreadCrumbs       (array) new breadcrumbs path.
            // length of new path is lower than length of current path, remove excess breadcrumb links
            } else // at least one breadcrumb link changed
            if(newBreadCrumbs[i].vcElement.id != breadCrumbs[i].vcElement.id) {
                // replace old breadcrumb links
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
        moveToRightEdge();
        for(i = breadCrumbs.length; i < newBreadCrumbs.length; i++) {
            addBreadCrumb(newBreadCrumbs[i].vcElement);
        }
        moveToRightEdge();
        breadCrumbs = newBreadCrumbs;
    }
}
function updateHiddenBreadCrumbs() {
    hiddenFromLeft = [];
    hiddenFromRight = [];
    var tableOffset = $(".breadCrumbTable").position().left;
    $(".breadCrumbTable tr td").each(function (index) {
        if($(this).attr("moving") != "left" && $(this).attr("moving") != "right") {
            var elementOffset = $(this).position().left + tableOffset;
            var elementWidth = $(this).width();
            if(index == 0) {
                if(elementOffset < 0) {
                    hiddenFromLeft.push(index);
        BreadCrumbs.updateBreadCrumbsLabels = updateBreadCrumbsLabels;
        function updateHiddenBreadCrumbs() {
            hiddenFromLeft = [];
            hiddenFromRight = [];
            var tableOffset = $(".breadCrumbTable").position().left;
            $(".breadCrumbTable tr td").each(function (index) {
                if($(this).attr("moving") != "left" && $(this).attr("moving") != "right") {
                    var elementOffset = $(this).position().left + tableOffset;
                    var elementWidth = $(this).width();
                    if(index == 0) {
                        if(elementOffset < 0) {
                            hiddenFromLeft.push(index);
                        }
                    } else if(index == $(".breadCrumbTable tr td").length - 1) {
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
        moveToRightEdge();
        // length of new breadcrumbs path is higher than length of current path
        for(i = breadCrumbs.length; i < newBreadCrumbs.length; i++) {
            addBreadCrumb(newBreadCrumbs[i].vcElement);
        }
        moveToRightEdge();
        breadCrumbs = newBreadCrumbs;
    }
}
// Update hidden breadcrumb links arrays. Breadcrumb is hidden, if more than 1/3 of its width
// is not visible and this breadcrumb is not animating.
function updateHiddenBreadCrumbs() {
    hiddenFromLeft = [];
    hiddenFromRight = [];
    var tableOffset = $(".breadCrumbTable").position().left;// breadcrumbs table offset from breadcrumbs visible area
    
    $(".breadCrumbTable tr td").each(function (index) {
        // element is not hidden if it is moving to be shown already
        if($(this).attr("moving") != "left" && $(this).attr("moving") != "right") {
            var elementOffset = $(this).position().left + tableOffset;// breadcrumb element offset from breadcrumbs visible area
            
            var elementWidth = $(this).width();
            // if at least 1 px of first breadcrumb link is hidden, then this breadcrumb is hidden
            if(index == 0) {
                if(elementOffset < 0) {
                    hiddenFromLeft.push(index);
                }
            } else if(index == $(".breadCrumbTable tr td").length - 1) {
                if(elementOffset + elementWidth > visibleAreaWidth) {
                    hiddenFromRight.push(index);
                }
            });
            hiddenFromRight.reverse();
            if(hiddenFromLeft.length != 0) {
                $("#bc_navLeft").stop(true, true).fadeIn('fast');
            } else {
                $("#bc_navLeft").stop(true, true).fadeOut('fast');
            }
            if(hiddenFromRight.length != 0) {
                $("#bc_navRight").stop(true, true).fadeIn('fast');
            } else // if at least 1 px of last breadcrumb link is hidden, then this breadcrumb is hidden
            if(index == $(".breadCrumbTable tr td").length - 1) {
                if(elementOffset + elementWidth > visibleAreaWidth) {
                    hiddenFromRight.push(index);
                }
            } else// else if 1/3 of breadcrumb's width is hidden, then this breadcrumb is hidden
             {
                $("#bc_navRight").stop(true, true).fadeOut('fast');
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
            $(".breadCrumbTable").stop();
            var element = $("#bc_" + index);
            var tableOffset = $(".breadCrumbTable").position().left;
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
                $(".breadCrumbTable").animate({
                    "left": str
                }, "slow", function () {
                    $(".breadCrumbTable tr td").each(function () {
                        $(this).attr("moving", "false");
                    });
                    updateHiddenBreadCrumbs();
                });
            }
        }
    });
    hiddenFromRight.reverse();
    if(hiddenFromLeft.length != 0) {
        $("#bc_navLeft").stop(true, true).fadeIn('fast');
    } else {
        $("#bc_navLeft").stop(true, true).fadeOut('fast');
    }
    if(hiddenFromRight.length != 0) {
        $("#bc_navRight").stop(true, true).fadeIn('fast');
    } else {
        $("#bc_navRight").stop(true, true).fadeOut('fast');
    }
}
function showHiddenBreadCrumb(direction, index) {
    if(index == null) {
        updateHiddenBreadCrumbs();
        switch(direction) {
            case "left":
                if(hiddenFromLeft.length != 0) {
                    index = hiddenFromLeft.pop();
        function moveToRightEdge(callback) {
            var tableOffset = $(".breadCrumbTable").position().left;
            var tableWidth = $(".breadCrumbTable").width();
            if(tableOffset <= 0) {
                var tableVisible = tableWidth + tableOffset;
                var difference = 0;
                if(tableWidth >= BreadCrumbs.visibleAreaWidth) {
                    if(tableVisible > BreadCrumbs.visibleAreaWidth) {
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    } else {
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    }
    });
    hiddenFromRight.reverse();
    // hide (show) left nav button if no hidden (at least 1 hidden) breadcrumb from left
    if(hiddenFromLeft.length != 0) {
        $("#bc_navLeft").stop(true, true).fadeIn('fast');
    } else {
        $("#bc_navLeft").stop(true, true).fadeOut('fast');
    }
    // hide (show) right nav button if no hidden (at least 1 hidden) breadcrumb from right
    if(hiddenFromRight.length != 0) {
        $("#bc_navRight").stop(true, true).fadeIn('fast');
    } else {
        $("#bc_navRight").stop(true, true).fadeOut('fast');
    }
}
// Moves hidden from left (right) breadcrumb to left (right) side of breadcrumb panel.
// @param direction     (string) direction of navigation.
// @param index         (number) index of breadcrumb to show, shows first hidden element if param is null.
function showHiddenBreadCrumb(direction, index) {
    // finds index of breadcrumb that should be shown if index is undefined
    if(index == null) {
        updateHiddenBreadCrumbs();
        switch(direction) {
            case "left":
                if(hiddenFromLeft.length != 0) {
                    index = hiddenFromLeft.pop();
                } else {
                    difference = -tableOffset;
                }
                $(".breadCrumbTable").stop();
                if(difference != 0) {
                    var str = "+=" + difference + "px";
                    $(".breadCrumbTable").animate({
                        "left": str
                    }, "fast", function () {
                        $(".breadCrumbTable tr td").each(function () {
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
    }
    $(".breadCrumbTable").stop();
    var element = $("#bc_" + index);
    var tableOffset = $(".breadCrumbTable").position().left;
    var elementOffset = element.position().left + tableOffset;
    var offset = 0;
        function removeBreadCrumb() {
            var length = $(".breadCrumbTable tr td").length;
            if(length > 0) {
                var selector = "#bc_" + (length - 1);
                $(selector).remove();
                if(length > 1) {
                    selector = "#bc_" + (length - 2);
                    $(selector + " .breadCrumbSeparator").hide();
                }
    }
    $(".breadCrumbTable").stop();
    var element = $("#bc_" + index);
    var tableOffset = $(".breadCrumbTable").position().left;// breadcrumbs table offset from breadcrumbs visible area
    
    var elementOffset = element.position().left + tableOffset;// breadcrumb element offset from breadcrumbs visible area
    
    var offset = 0;// offset for showing hidden breadcrumb element
    
        element.attr("moving", direction)// apply "moving" attribute to this breadcrumb element
        ;
                // clear "moving" attributes for each breadcrumb
            }
        }
        function addBreadCrumb(element) {
            var length = $(".breadCrumbTable tr td").length;
            var parent = $(".breadCrumbTable tr");
            var td = $("<td class='breadCrumbTableCell' id='bc_" + length + "'></td>");
            var div = $("<div class='breadCrumbLink' id='bc_link_" + element.id + "' onclick='clickOverBreadCrumb(\"" + element.id + "\", " + length + ")'></div>");
            var span = $("<span class='breadCrumbSeparator' id='bc_'>&rsaquo;</span>");
            td.append(div);
            td.append(span);
            parent.append(td);
            div.text(element.title);
            switch(element.regime) {
                case "Cosmos":
                    $("#bc_link_" + element.id).addClass("breadCrumbLinkCosmosRegime");
                    break;
                case "Earth":
                    $("#bc_link_" + element.id).addClass("breadCrumbLinkEarthRegime");
                    break;
                case "Life":
                    $("#bc_link_" + element.id).addClass("breadCrumbLinkLifeRegime");
                    break;
                case "Pre-history":
                    $("#bc_link_" + element.id).addClass("breadCrumbLinkPreHumanRegime");
                    break;
                case "Humanity":
                    $("#bc_link_" + element.id).addClass("breadCrumbLinkHumanityRegime");
                    break;
            }
            $("#bc_" + length + " .breadCrumbSeparator").hide();
            if(length > 0) {
                $("#bc_" + (length - 1) + " .breadCrumbSeparator").show();
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
            var number = 0;
            $(".breadCrumbTable tr td").each(function (index) {
                if($(this).attr("moving") == "left") {
                    movingLeftBreadCrumbs++;
                    if(number == 0) {
                        number = index;
                    }
                }
            });
            updateHiddenBreadCrumbs();
        });
    }
}
function moveToRightEdge(callback) {
    var tableOffset = $(".breadCrumbTable").position().left;
    var tableWidth = $(".breadCrumbTable").width();
    if(tableOffset <= 0) {
        var tableVisible = tableWidth + tableOffset;
        var difference = 0;
        if(tableWidth >= visibleAreaWidth) {
            if(tableVisible > visibleAreaWidth) {
                difference = visibleAreaWidth - tableVisible - 1;
            } else {
                difference = visibleAreaWidth - tableVisible - 1;
            if(movingLeftBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = number - CZ.Settings.longNavigationLength;
                if(index < 0) {
                    index = 0;
                }
                showHiddenBreadCrumb("left", index);
            } else if(movingLeftBreadCrumbs < CZ.Settings.navigateNextMaxCount) {
                showHiddenBreadCrumb("left");
            updateHiddenBreadCrumbs();
        });
    }
}
// Moves breadcrumbs path to the right edge of visible area of breadcrumbs if it is allowed.
// @param   callback            (function) callback function at the end of animation.
function moveToRightEdge(callback) {
    var tableOffset = $(".breadCrumbTable").position().left;// breadcrumbs table offset from breadcrumbs visible area (<= 0 in px)
    
    var tableWidth = $(".breadCrumbTable").width();// width of breadcrumbs table (>= 0 in px)
    
    if(tableOffset <= 0) {
        // some breadcrumbs are hidden
        // var hidden = tableOffset; // width in px of hidden from the left side part of breadcrumbs
        var tableVisible = tableWidth + tableOffset;// width in px of currently visible breadcrumbs part in visible area
        
        var difference = 0;
        if(tableWidth >= visibleAreaWidth) {
            if(tableVisible > visibleAreaWidth) {
                difference = visibleAreaWidth - tableVisible - 1;
            } else {
                // move to the right edge of visible area
                difference = visibleAreaWidth - tableVisible - 1;
            }
        } else {
            difference = -tableOffset;
        } else {
            // width of hidden part is not enought to fill whole visible area
            difference = -tableOffset;
        }
        $(".breadCrumbTable").stop();
        if(difference != 0) {
            var str = "+=" + difference + "px";
            $(".breadCrumbTable").animate({
                "left": str
            }, "fast", function () {
                $(".breadCrumbTable tr td").each(function () {
                    $(this).attr("moving", "false");
                });
                updateHiddenBreadCrumbs();
                if(callback != null) {
                    callback();
        BreadCrumbs.breadCrumbNavLeft = breadCrumbNavLeft;
        function breadCrumbNavRight() {
            var movingRightBreadCrumbs = 0;
            var number = 0;
            $(".breadCrumbTable tr td").each(function (index) {
                if($(this).attr("moving") == "right") {
                    movingRightBreadCrumbs++;
                    number = index;
        $(".breadCrumbTable").stop();
        if(difference != 0) {
            var str = "+=" + difference + "px";
            $(".breadCrumbTable").animate({
                "left": str
            }, "fast", function () {
                $(".breadCrumbTable tr td").each(function () {
                    // clear "moving" attributes for each breadcrumb
                    $(this).attr("moving", "false");
                });
                updateHiddenBreadCrumbs();
                if(callback != null) {
                    callback();
                }
            });
            if(movingRightBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = number + CZ.Settings.longNavigationLength;
                if(index >= $(".breadCrumbTable tr td").length) {
                    index = $(".breadCrumbTable tr td").length - 1;
                }
                showHiddenBreadCrumb("right", index);
            } else if(movingRightBreadCrumbs < CZ.Settings.navigateNextMaxCount) {
                showHiddenBreadCrumb("right");
            }
        }
    }
}
        BreadCrumbs.breadCrumbNavRight = breadCrumbNavRight;
        function clickOverBreadCrumb(timelineID, breadCrumbLinkID) {
            CZ.Search.goToSearchResult(timelineID);
            var selector = "#bc_" + breadCrumbLinkID;
            var tableOffset = $(".breadCrumbTable").position().left;
            var elementOffset = $(selector).position().left + tableOffset;
            var elementWidth = $(selector).width();
            if(elementOffset < 0) {
                showHiddenBreadCrumb("left", breadCrumbLinkID);
            } else if(elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth) {
                showHiddenBreadCrumb("right", breadCrumbLinkID);
    }
}
// Removes last breadcrumb link.
            }
        }
    }
}
function addBreadCrumb(element) {
    var length = $(".breadCrumbTable tr td").length;
    var parent = $(".breadCrumbTable tr");
    var td = $("<td class='breadCrumbTableCell' id='bc_" + length + "'></td>");
    var div = $("<div class='breadCrumbLink' id='bc_link_" + element.id + "' onclick='clickOverBreadCrumb(\"" + element.id + "\", " + length + ")'></div>");
    var span = $("<span class='breadCrumbSeparator' id='bc_'>&rsaquo;</span>");
    td.append(div);
    td.append(span);
    parent.append(td);
    div.text(element.title);
    switch(element.regime) {
        case "Cosmos":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkCosmosRegime");
            break;
        case "Earth":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkEarthRegime");
            break;
        case "Life":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkLifeRegime");
            break;
        case "Pre-history":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkPreHumanRegime");
            break;
        case "Humanity":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkHumanityRegime");
            break;
    }
    $("#bc_" + length + " .breadCrumbSeparator").hide();
    if(length > 0) {
        $("#bc_" + (length - 1) + " .breadCrumbSeparator").show();
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
    var number = 0;
    $(".breadCrumbTable tr td").each(function (index) {
        if($(this).attr("moving") == "left") {
            movingLeftBreadCrumbs++;
            if(number == 0) {
                number = index;
            }
        BreadCrumbs.clickOverBreadCrumb = clickOverBreadCrumb;
        function breadCrumbMouseOut(element) {
            $(element).removeClass("breadCrumbHover");
    }
}
// Adds new breadcrumb link.
// @param  element      (object) breadcrumb to be added.
function addBreadCrumb(element) {
    var length = $(".breadCrumbTable tr td").length;
    // add breadcrumb to table
    var parent = $(".breadCrumbTable tr");
    var td = $("<td class='breadCrumbTableCell' id='bc_" + length + "'></td>");
    // Without title, it will be added after appending.
    var div = $("<div class='breadCrumbLink' id='bc_link_" + element.id + "' onclick='clickOverBreadCrumb(\"" + element.id + "\", " + length + ")'></div>");
    var span = $("<span class='breadCrumbSeparator' id='bc_'>&rsaquo;</span>");
    td.append(div);
    td.append(span);
    parent.append(td);
    div.text(element.title)// As text to avoid script execution.
    ;
    // select color of the text for this breadcrumb
    switch(element.regime) {
        case "Cosmos":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkCosmosRegime");
            break;
        case "Earth":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkEarthRegime");
            break;
        case "Life":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkLifeRegime");
            break;
        case "Pre-history":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkPreHumanRegime");
            break;
        case "Humanity":
            $("#bc_link_" + element.id).addClass("breadCrumbLinkHumanityRegime");
            break;
    }
    // hide context search button for new breadcrumb element
    $("#bc_" + length + " .breadCrumbSeparator").hide();
    if(length > 0) {
        // show context search button for previous breadcrumb element
        $("#bc_" + (length - 1) + " .breadCrumbSeparator").show();
    }
    $("#bc_link_" + element.id).mouseover(function () {
        breadCrumbMouseOver(this);
    });
    $("#bc_link_" + element.id).mouseout(function () {
        breadCrumbMouseOut(this);
    });
}
// Handles click over navigate to left button.
function breadCrumbNavLeft() {
    var movingLeftBreadCrumbs = 0;// counter of currently moving to left breadcrumbs
    
    var number = 0;// index of first moving to left breadcrumb
    
    $(".breadCrumbTable tr td").each(function (index) {
        if($(this).attr("moving") == "left") {
            movingLeftBreadCrumbs++;
            if(number == 0) {
                number = index;
            }
        }
    });
    if(movingLeftBreadCrumbs == navigateNextMaxCount) {
        var index = number - longNavigationLength;
        if(index < 0) {
            index = 0;
        function breadCrumbMouseOver(element) {
            $(element).addClass("breadCrumbHover");
    });
    // perform long navigation if enough breadcrumbs are moving at one time
    if(movingLeftBreadCrumbs == navigateNextMaxCount) {
        var index = number - longNavigationLength;
        if(index < 0) {
            index = 0;
        }
        showHiddenBreadCrumb("left", index);
    } else if(movingLeftBreadCrumbs < navigateNextMaxCount) {
        showHiddenBreadCrumb("left");
    }
}
function breadCrumbNavRight() {
    var movingRightBreadCrumbs = 0;
    var number = 0;
    $(".breadCrumbTable tr td").each(function (index) {
        if($(this).attr("moving") == "right") {
            movingRightBreadCrumbs++;
            number = index;
        function changeToOff(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_on", "_off"));
        showHiddenBreadCrumb("left", index);
    } else // if not enough breadcrumbs are moving then show left breadcrumb
    if(movingLeftBreadCrumbs < navigateNextMaxCount) {
        showHiddenBreadCrumb("left");
    }
}
// Handles click over navigate to right button.
function breadCrumbNavRight() {
    var movingRightBreadCrumbs = 0;// counter of currently moving to right breadcrumbs
    
    var number = 0;// index of first moving to right breadcrumb
    
    $(".breadCrumbTable tr td").each(function (index) {
        if($(this).attr("moving") == "right") {
            movingRightBreadCrumbs++;
            number = index;
        }
    });
    if(movingRightBreadCrumbs == navigateNextMaxCount) {
        var index = number + longNavigationLength;
        if(index >= $(".breadCrumbTable tr td").length) {
            index = $(".breadCrumbTable tr td").length - 1;
        function changeToOn(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_off", "_on"));
    });
    // perform long navigation if enough breadcrumbs are moving at one time
    if(movingRightBreadCrumbs == navigateNextMaxCount) {
        var index = number + longNavigationLength;
        if(index >= $(".breadCrumbTable tr td").length) {
            index = $(".breadCrumbTable tr td").length - 1;
        }
        showHiddenBreadCrumb("right", index);
    } else if(movingRightBreadCrumbs < navigateNextMaxCount) {
        showHiddenBreadCrumb("right");
    }
}
function clickOverBreadCrumb(timelineID, breadCrumbLinkID) {
    goToSearchResult(timelineID);
    var selector = "#bc_" + breadCrumbLinkID;
    var tableOffset = $(".breadCrumbTable").position().left;
    var elementOffset = $(selector).position().left + tableOffset;
    var elementWidth = $(selector).width();
    if(elementOffset < 0) {
        showHiddenBreadCrumb("left", breadCrumbLinkID);
    } else if(elementOffset + elementWidth > visibleAreaWidth) {
        showHiddenBreadCrumb("right", breadCrumbLinkID);
    }
}
function breadCrumbMouseOut(element) {
    $(element).removeClass("breadCrumbHover");
}
function breadCrumbMouseOver(element) {
    $(element).addClass("breadCrumbHover");
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
        showHiddenBreadCrumb("right", index);
    } else // if not enough breadcrumbs are moving then show right breadcrumb
    if(movingRightBreadCrumbs < navigateNextMaxCount) {
        showHiddenBreadCrumb("right");
    }
}
// Handles click over breadcrumb link.
// @param   timelineID          (string) id of timeline to navigate.
// @param   breadCrumbLinkID    (string) id of table element which breadcrumb link was cliked.
function clickOverBreadCrumb(timelineID, breadCrumbLinkID) {
    goToSearchResult(timelineID)// start EllipticalZoom to element
    ;
    var selector = "#bc_" + breadCrumbLinkID;
    var tableOffset = $(".breadCrumbTable").position().left;
    var elementOffset = $(selector).position().left + tableOffset;
    var elementWidth = $(selector).width();
    // make breadcrumb link fully visible, if part of it was hidden.
    if(elementOffset < 0) {
        showHiddenBreadCrumb("left", breadCrumbLinkID);
    } else if(elementOffset + elementWidth > visibleAreaWidth) {
        showHiddenBreadCrumb("right", breadCrumbLinkID);
    }
}
// Functions to change breadcrumb's link color, to avoid bug when <class:hover> doesn't work in IE when mouse enter breadcrumb link
// through image that is right to it.
function breadCrumbMouseOut(element) {
    $(element).removeClass("breadCrumbHover");
}
function breadCrumbMouseOver(element) {
    $(element).addClass("breadCrumbHover");
}
// Changes image from <off> state to <on> state
function changeToOff(element) {
    var src = element.getAttribute("src");
    element.setAttribute("src", src.replace("_on", "_off"));
}
// Changes image from <on> state to <off> state
function changeToOn(element) {
    var src = element.getAttribute("src");
    element.setAttribute("src", src.replace("_off", "_on"));
}
