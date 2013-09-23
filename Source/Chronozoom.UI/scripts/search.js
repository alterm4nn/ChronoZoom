var CZ;
(function (CZ) {
    (function (Search) {
        Search.isSearchWindowVisible = false;
        var delayedSearchRequest = null;
        function onSearchClicked() {
            if(CZ.Tours.isTourWindowVisible && CZ.Tours.onTourClicked) {
                CZ.Tours.onTourClicked();
            }
            if(Search.isSearchWindowVisible) {
                $(".search-icon").removeClass("active");
                $("#search").hide('slide', {
                }, 'slow');
            } else {
                $(".search-icon").addClass("active");
                $("#search").show('slide', {
                }, 'slow', function () {
                    $("#searchTextBox").focus();
                });
            }
            Search.isSearchWindowVisible = !Search.isSearchWindowVisible;
        }
        Search.onSearchClicked = onSearchClicked;
        function initializeSearch() {
            $("#searchTextBox").focus(function () {
                if($(this).hasClass('emptyTextBox')) {
                    this.value = '';
                    $(this).removeClass('emptyTextBox');
                }
            }).blur(function () {
                if($(this).hasClass('emptyTextBox')) {
                    if(this.value != '') {
                        $(this).removeClass('emptyTextBox');
                    }
                } else {
                    if(this.value == '') {
                        this.value = 'type here...';
                        $(this).addClass('emptyTextBox');
                    }
                }
            }).keyup(function () {
                if(delayedSearchRequest) {
                    clearTimeout(delayedSearchRequest);
                    delayedSearchRequest = null;
                }
                delayedSearchRequest = setTimeout(function () {
                    if($('#searchTextBox').val() != "") {
                        $("#loadingImage").fadeIn('slow');
                    }
                    search(escapeSearchString(($("#searchTextBox")[0]).value.substr(0, 700)));
                }, 300);
            });
            $("#search").hide();
        }
        Search.initializeSearch = initializeSearch;
        function navigateToElement(e) {
            if(!CZ.Authoring.isActive) {
                var animId = CZ.Common.setVisibleByUserDirectly(e.newvisible);
                if(animId) {
                    CZ.Common.setNavigationStringTo = {
                        element: e.element,
                        id: animId
                    };
                }
            }
        }
        Search.navigateToElement = navigateToElement;
        function navigateToBookmark(bookmark) {
            if(bookmark && !CZ.Authoring.isActive) {
                var visible = CZ.UrlNav.navStringToVisible(bookmark, CZ.Common.vc);
                if(visible) {
                    var animId = CZ.Common.setVisibleByUserDirectly(visible);
                    if(animId) {
                        CZ.Common.setNavigationStringTo = {
                            bookmark: bookmark,
                            id: animId
                        };
                    }
                }
            }
        }
        Search.navigateToBookmark = navigateToBookmark;
        function goToSearchResult(resultId, elementType) {
            var element = findVCElement(CZ.Common.vc.virtualCanvas("getLayerContent"), resultId, elementType);
            var navStringElement = CZ.UrlNav.vcelementToNavString(element);
            CZ.StartPage.hide();
            var visible = CZ.UrlNav.navStringToVisible(navStringElement, CZ.Common.vc);
            CZ.Common.controller.moveToVisible(visible);
        }
        Search.goToSearchResult = goToSearchResult;
        function findVCElement(root, id, elementType) {
            var lookingForCI = elementType === "contentItem";
            var rfind = function (el, id) {
                if(el.id === id) {
                    return el;
                }
                if(!el.children) {
                    return null;
                }
                var n = el.children.length;
                for(var i = 0; i < n; i++) {
                    var child = el.children[i];
                    if(child.id === id) {
                        return child;
                    }
                }
                for(var i = 0; i < n; i++) {
                    var child = el.children[i];
                    var res = rfind(child, id);
                    if(res) {
                        return res;
                    }
                }
                if(lookingForCI && el.type === 'infodot') {
                    var ci = CZ.VCContent.getContentItem(el, id);
                    if(ci != null) {
                        return ci;
                    }
                }
                return null;
            };
            return rfind(root, id);
        }
        function onSearchResults(searchString, results) {
            if(escapeSearchString(($("#searchTextBox")[0]).value).indexOf(searchString) === 0 || searchString === '') {
                var height;
                var output = $("#search .searchResults").empty();
                if(results == null) {
                } else if(results.length == 0) {
                    $("<div></div>", {
                        class: "searchNoResult",
                        text: "No results"
                    }).appendTo(output);
                } else {
                    var addResults = function (objectType, sectionTitle) {
                        var first = true;
                        for(var i = 0; i < results.length; i++) {
                            var item = results[i];
                            if(item.objectType != objectType) {
                                continue;
                            }
                            var resultId;
                            var elementType;
                            switch(item.objectType) {
                                case 0:
                                    resultId = 'e' + item.id;
                                    elementType = "exhibit";
                                    break;
                                case 1:
                                    resultId = 't' + item.id;
                                    elementType = "timeline";
                                    break;
                                case 2:
                                    resultId = item.id;
                                    elementType = "contentItem";
                                    break;
                                default:
                                    continue;
                            }
                            if(first) {
                                $("<div></div>", {
                                    class: "searchResultSection",
                                    text: sectionTitle
                                }).appendTo(output);
                                first = false;
                            }
                            $("<div></div>", {
                                class: "searchResult",
                                resultId: resultId,
                                text: results[i].title,
                                click: function () {
                                    goToSearchResult(this.getAttribute("resultId"), this.getAttribute("data-element-type"));
                                }
                            }).attr("data-element-type", elementType).appendTo(output);
                        }
                    };
                    addResults(1, "Timelines");
                    addResults(0, "Exhibits");
                    addResults(2, "Artifacts");
                }
            }
            if(isSearching) {
                isSearching = false;
            }
            if(pendingSearch != null) {
                var q = pendingSearch;
                pendingSearch = null;
                search(q);
            }
            $("#loadingImage").fadeOut('slow');
        }
        var pendingSearch = null;
        var isSearching = false;
        function search(searchString) {
            if(isSearching) {
                pendingSearch = searchString;
                return;
            }
            isSearching = true;
            if(!searchString || searchString === '') {
                setTimeout(function () {
                    onSearchResults(searchString);
                }, 1);
                return;
            }
            var url;
            switch(CZ.Settings.czDataSource) {
                case 'db':
                    url = "/api/Search";
                    break;
                default:
                    url = "/api/Search";
                    break;
            }
            $.ajax({
                cache: false,
                type: "GET",
                async: true,
                dataType: "json",
                data: {
                    searchTerm: searchString,
                    supercollection: CZ.Service.superCollectionName,
                    collection: CZ.Service.collectionName
                },
                url: url,
                success: function (result) {
                    onSearchResults(searchString, result.d);
                },
                error: function (xhr) {
                    console.log("Error connecting to service: " + xhr.responseText);
                }
            });
        }
        function escapeSearchString(searchString) {
            if(searchString === null) {
                return '';
            }
            if(searchString) {
                searchString = searchString.replace(new RegExp('"', "g"), '');
            }
            return searchString;
        }
    })(CZ.Search || (CZ.Search = {}));
    var Search = CZ.Search;
})(CZ || (CZ = {}));
