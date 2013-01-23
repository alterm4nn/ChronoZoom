/* This file contains code to perform search over the Chronozoom database and show the results in UI.
The page design must correspond to the schema and naming conventions presented here.
*/

var isSearchWindowVisible = false;
var delayedSearchRequest = null;


// The method is called when the search button is clicked
function onSearchClicked() {
    if (isTourWindowVisible && onTourClicked)
        onTourClicked();

    if (isSearchWindowVisible) {
        toggleOffImage('search_button');
        $("#search").hide('slide', {}, 'slow');
    } else {
        toggleOnImage('search_button');
        $("#search").show('slide', {}, 'slow',
            function () {
                $("#searchTextBox").focus();
            });
    }
    isSearchWindowVisible = !isSearchWindowVisible;
}

function searchHighlight(isOn) {
    if (isOn) {
        toggleOnImage('search_button');
    }
    else {
        if (!isSearchWindowVisible)
            toggleOffImage('search_button');
    }
}



function initializeSearch() {
    $("#searchTextBox")
            .focus(function () {
                if ($(this).hasClass('emptyTextBox')) {
                    this.value = '';
                    $(this).removeClass('emptyTextBox');
                }
            })
            .blur(function () {
                if ($(this).hasClass('emptyTextBox')) {
                    if (this.value != '') {
                        $(this).removeClass('emptyTextBox');
                    }
                } else {
                    if (this.value == '') {
                        this.value = 'type here...';
                        $(this).addClass('emptyTextBox');
                    }
                }
            })
            .keyup(function () {
                if (delayedSearchRequest) {
                    clearTimeout(delayedSearchRequest);
                    delayedSearchRequest = null;
                }

                delayedSearchRequest = setTimeout(function () {
                    if ($('#searchTextBox').val() != "") {
                        $("#loadingImage").fadeIn('slow');
                    }
                    search(escapeSearchString($("#searchTextBox")[0].value.substr(0, 700))); // limit the search to the first 700 characters
                }, 300);
                
            });

    $("#search").hide();
}


function navigateToElement(e) {
    var animId = setVisibleByUserDirectly(e.newvisible);
    if (animId) {
        setNavigationStringTo = { element: e.element, id: animId };
    }
}

function navigateToBookmark(bookmark) {
    if (bookmark) {
        var visible = navStringToVisible(bookmark, vc);
        if (visible) {
            var animId = setVisibleByUserDirectly(visible);
            if (animId) {
                setNavigationStringTo = { bookmark: bookmark, id: animId };
            }
        }
    }
}

function goToSearchResult(id) {
    var elem = findVCElement(vc.virtualCanvas("getLayerContent"), id);
    if (!elem) {
        alert('Element not found in the content.');
    } else {
        var visible = getVisibleForElement(elem, 1.0, vc.virtualCanvas("getViewport"));
        navigateToElement({ element: elem, newvisible: visible });
    }
}

// Recursively finds and returns an element with given id.
// If not found, returns null.
function findVCElement(root, id) {
    var lookingForCI = id.charAt(0) === 'c';
    var rfind = function (el, id) {
        if (el.id === id) return el;
        if (!el.children) return null;
        var n = el.children.length;
        for (var i = 0; i < n; i++) {
            var child = el.children[i];
            if (child.id === id) return child;
        }
        for (var i = 0; i < n; i++) {
            var child = el.children[i];
            var res = rfind(child, id);
            if (res) return res;
        }
        if (lookingForCI && el.type === 'infodot') {
            var ci = getContentItem(el, id);
            if (ci != null) {
                return ci;
            }
        }

        return null;
    }

    return rfind(root, id);
}

function onSearchResults(searchString, results) {
    if (escapeSearchString($("#searchTextBox")[0].value).indexOf(searchString) === 0 || searchString === '') {
        var height;
        var output = $("#search .searchResults").empty();
        if (results == null) {

        }
        else if (results.length == 0) {
            $("<div class='searchNoResult'>No results</div>")
                            .appendTo(output)

        } else {
            var addResults = function (objectType, sectionTitle) {
                var first = true;
                for (var i = 0; i < results.length; i++) {
                    var item = results[i];
                    if (item.ObjectType != objectType) continue;
                    var resultId;
                    switch (item.ObjectType) {
                        case 0: resultId = 'e' + item.UniqueID; break; // exhibit
                        case 1: resultId = 't' + item.UniqueID; break; // timeline
                        case 2: resultId = 'c' + item.UniqueID; break; // content item
                        default: continue; // unknown type of result item
                    }
                    if (first) {
                        $("<div class='searchResultSection'>" + sectionTitle + "</div>").appendTo(output);
                        first = false;
                    }
                    $("<div class='searchResult' resultId='" + resultId + "'>" + results[i].Title + "</div>")
                            .appendTo(output)
                            .click(function () {
                                goToSearchResult(this.getAttribute('resultId'));
                            });
                }
            }
            addResults(1, "Timelines");
            addResults(0, "Exhibits");
            addResults(2, "Artifacts");

        }

    }

    if (isSearching) {
        isSearching = false;
    }
    if (pendingSearch != null) {
        var q = pendingSearch;
        pendingSearch = null;
        search(q);
    }

    $("#loadingImage").fadeOut('slow');
}

var pendingSearch = null;
var isSearching = false;
function search(searchString) {
    if (isSearching) {
        pendingSearch = searchString;
        return;
    }

    // isSearching is false
    isSearching = true;

    if (!searchString || searchString === '') {
        setTimeout(function () {
            onSearchResults(searchString, null);
        }, 1);
        return;
    }

    var url;
    switch (czDataSource) {
        case 'db': url = "Chronozoom.svc/Search";
            break;
        default: url = "Chronozoom.svc/SearchRelay";
            break;
    }
    $.ajax({
        cache: false,
        type: "GET",
        async: true,
        dataType: "json",
        data: { s: searchString },
        url: url,
        success: function (result) {
            if (czDataSource == 'db')
                onSearchResults(searchString, result.d);
            else
                onSearchResults(searchString, eval(result.d));
        },
        error: function (xhr) {
            alert("Error connecting to service: " + xhr.responseText);
        }
    });
}

function escapeSearchString(searchString) {
    if (searchString === null) return '';
    if (searchString) {
        searchString = searchString.replace(new RegExp('"', "g"), '');
    }
    return searchString;
}