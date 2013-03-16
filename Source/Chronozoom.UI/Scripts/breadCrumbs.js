var hiddenFromLeft = [];// hidden breadcrumbs from the left side

var hiddenFromRight = [];// hidden breadcrumbs from the right side

var visibleAreaWidth = 0;
// Updates current breadcrumbs path, raised when breadcrumbs path has changed.
// @param  newBreadCrumbs       (array) new breadcrumbs path.
function updateBreadCrumbsLabels(newBreadCrumbs) {
    if(newBreadCrumbs) {
        if(breadCrumbs == null) {
            breadCrumbs = newBreadCrumbs;
            for(i = 0; i < breadCrumbs.length; i++) {
                addBreadCrumb(breadCrumbs[i].vcElement);
            }
            moveToRightEdge();
            return;
        }
        for(i = 0; i < breadCrumbs.length; i++) {
            // length of new path is lower than length of current path, remove excess breadcrumb links
            if(newBreadCrumbs[i] == null) {
                removeBreadCrumb();
            } else // at least one breadcrumb link changed
            if(newBreadCrumbs[i].vcElement.id != breadCrumbs[i].vcElement.id) {
                // replace old breadcrumb links
                for(j = i; j < breadCrumbs.length; j++) {
                    removeBreadCrumb();
                }
                for(j = i; j < newBreadCrumbs.length; j++) {
                    addBreadCrumb(newBreadCrumbs[j].vcElement);
                }
                breadCrumbs = newBreadCrumbs;
                return;
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
            } else // if at least 1 px of last breadcrumb link is hidden, then this breadcrumb is hidden
            if(index == $(".breadCrumbTable tr td").length - 1) {
                if(elementOffset + elementWidth > visibleAreaWidth) {
                    hiddenFromRight.push(index);
                }
            } else// else if 1/3 of breadcrumb's width is hidden, then this breadcrumb is hidden
             {
                if(elementOffset + elementWidth / 3 < 0) {
                    hiddenFromLeft.push(index);
                } else if(elementOffset + elementWidth * 2 / 3 > visibleAreaWidth) {
                    hiddenFromRight.push(index);
                }
            }
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
    var tableOffset = $(".breadCrumbTable").position().left;// breadcrumbs table offset from breadcrumbs visible area
    
    var elementOffset = element.position().left + tableOffset;// breadcrumb element offset from breadcrumbs visible area
    
    var offset = 0;// offset for showing hidden breadcrumb element
    
    switch(direction) {
        case "left":
            offset = -elementOffset;
            break;
        case "right":
            var elementWidth = element.width();
            offset = visibleAreaWidth - elementOffset - elementWidth - 1;
            break;
    }
    if(offset != 0) {
        var str = "+=" + offset + "px";
        element.attr("moving", direction)// apply "moving" attribute to this breadcrumb element
        ;
        $(".breadCrumbTable").animate({
            "left": str
        }, "slow", function () {
            $(".breadCrumbTable tr td").each(function () {
                // clear "moving" attributes for each breadcrumb
                $(this).attr("moving", "false");
            });
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
                    // clear "moving" attributes for each breadcrumb
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
// Removes last breadcrumb link.
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
}
// Adds new breadcrumb link.
// @param  element      (object) breadcrumb to be added.
function addBreadCrumb(element) {
    var length = $(".breadCrumbTable tr td").length;
    // add breadcrumb to table
    var parent = $(".breadCrumbTable tr");
    $("<td class='breadCrumbTableCell' id='bc_" + length + "'>" + "<div class='breadCrumbLink' id='bc_link_" + element.id + "' onclick='clickOverBreadCrumb(\"" + element.id + "\", " + length + ")'>" + element.title + "</div>" + "<span class='breadCrumbSeparator' id='bc_'>&rsaquo;</span>" + "</td>").appendTo(parent);
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
    // perform long navigation if enough breadcrumbs are moving at one time
    if(movingLeftBreadCrumbs == navigateNextMaxCount) {
        var index = number - longNavigationLength;
        if(index < 0) {
            index = 0;
        }
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
    // perform long navigation if enough breadcrumbs are moving at one time
    if(movingRightBreadCrumbs == navigateNextMaxCount) {
        var index = number + longNavigationLength;
        if(index >= $(".breadCrumbTable tr td").length) {
            index = $(".breadCrumbTable tr td").length - 1;
        }
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
