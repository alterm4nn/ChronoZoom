/// <reference path='urlnav.ts'/>
/// <reference path='cz.settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='vccontent.ts'/>
/// <reference path='czservice.ts'/>

/* This file contains code to perform search over the CZ database and show the results in UI.
The page design must correspond to the schema and naming conventions presented here.
*/

module CZ {
    export module Search {

        export var isSearchWindowVisible = false;
        var delayedSearchRequest = null;


        // The method is called when the search button is clicked
        export function onSearchClicked() {
            if (CZ.Tours.isTourWindowVisible && CZ.Tours.onTourClicked)
                CZ.Tours.onTourClicked();

            if (isSearchWindowVisible) {
                CZ.Common.toggleOffImage('search_button');
                $("#search").hide('slide', {}, 'slow');
            } else {
                CZ.Common.toggleOnImage('search_button');
                $("#search").show('slide', {}, 'slow',
                    function () {
                        $("#searchTextBox").focus();
                    });
            }
            isSearchWindowVisible = !isSearchWindowVisible;
        }

        export function searchHighlight(isOn) {
            if (isOn) {
                CZ.Common.toggleOnImage('search_button');
            }
            else {
                if (!isSearchWindowVisible)
                    CZ.Common.toggleOffImage('search_button');
            }
        }

        export function initializeSearch() {
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
                            search(escapeSearchString((<HTMLInputElement>$("#searchTextBox")[0]).value.substr(0, 700))); // limit the search to the first 700 characters
                        }, 300);
                
                    });

            $("#search").hide();
        }


        export function navigateToElement(e) {
            var animId = CZ.Common.setVisibleByUserDirectly(e.newvisible);
            if (animId) {
                CZ.Common.setNavigationStringTo = { element: e.element, id: animId };
            }
        }

        export function navigateToBookmark(bookmark) {
            if (bookmark) {
                var visible = CZ.UrlNav.navStringToVisible(bookmark, CZ.Common.vc);
                if (visible) {
                    var animId = CZ.Common.setVisibleByUserDirectly(visible);
                    if (animId) {
                        CZ.Common.setNavigationStringTo = { bookmark: bookmark, id: animId };
                    }
                }
            }
        }

        export function goToSearchResult(resultId) {
            var element = CZ.Common.vc.virtualCanvas("findElement", resultId);
            var navStringElement = CZ.UrlNav.vcelementToNavString(element);

            var visible = CZ.UrlNav.navStringToVisible(navStringElement, CZ.Common.vc);
            CZ.Common.controller.moveToVisible(visible)
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
                    var ci = CZ.VCContent.getContentItem(el, id);
                    if (ci != null) {
                        return ci;
                    }
                }

                return null;
            }

            return rfind(root, id);
        }

        function onSearchResults(searchString, results?) {
            if (escapeSearchString((<HTMLInputElement>$("#searchTextBox")[0]).value).indexOf(searchString) === 0 || searchString === '') {
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
                            if (item.objectType != objectType) continue;
                            var resultId;
                            switch (item.objectType) {
                                case 0: resultId = 'e' + item.id; break; // exhibit
                                case 1: resultId = 't' + item.id; break; // timeline
                                case 2: resultId = item.id; break; // content item
                                default: continue; // unknown type of result item
                            }
                            if (first) {
                                $("<div class='searchResultSection'>" + sectionTitle + "</div>").appendTo(output);
                                first = false;
                            }
                            $("<div class='searchResult' resultId='" + resultId + "'>" + results[i].title + "</div>")
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
                    onSearchResults(searchString);
                }, 1);
                return;
            }

            var url;
            switch (CZ.Settings.czDataSource) {
                case 'db': url = "/chronozoom.svc/Search";
                    break;
                default: url = "/chronozoom.svc/Search";
                    break;
            }
            $.ajax({
                cache: false,
                type: "GET",
                async: true,
                dataType: "json",
                data: { searchTerm: searchString, supercollection: CZ.Service.superCollectionName, collection: CZ.Service.collectionName },
                url: url,
                success: function (result) {
                    if (CZ.Settings.czDataSource == 'db')
                        onSearchResults(searchString, result.d);
                    else
                        onSearchResults(searchString, eval(result.d));
                },
                error: function (xhr) {
                    console.log("Error connecting to service: " + xhr.responseText);
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
    }
}
