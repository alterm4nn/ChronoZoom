/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/search.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormHeaderSearchInfo extends CZ.UI.IFormBaseInfo {
            searchTextbox: string;
            searchResultsBox: string;
            progressBar: string;
            resultSections: string;
            resultsCountTextblock: string;
        }

        export class FormHeaderSearch extends CZ.UI.FormBase {
            private searchTextbox: JQuery;
            private searchResultsBox: JQuery;
            private progressBar: JQuery;
            private resultSections: JQuery;
            private resultsCountTextblock: JQuery;

            private delayedSearchRequest: any;
            private searchResults: any[];

            constructor(container: JQuery, formInfo: IFormHeaderSearchInfo) {
                super(container, formInfo);

                this.searchTextbox = container.find(formInfo.searchTextbox);
                this.searchResultsBox = container.find(formInfo.searchResultsBox);
                this.progressBar = container.find(formInfo.progressBar);
                this.resultSections = container.find(formInfo.resultSections);
                this.resultsCountTextblock = container.find(formInfo.resultsCountTextblock);

                this.initialize();
            }

            private initialize(): void {
                this.fillFormWithSearchResults();

                this.searchResults = [];
                this.progressBar.css("opacity", 0);
                this.hideResultsCount();
                this.clearResultSections();
                this.hideSearchResults();
                this.searchTextbox.off();

                var onSearchQueryChanged = (event) => {
                    clearTimeout(this.delayedSearchRequest);

                    this.delayedSearchRequest = setTimeout(() => {
                        var query = this.searchTextbox.val();
                        query = this.escapeSearchQuery(query);
                        this.showProgressBar();
                        this.sendSearchQuery(query).then(
                            response => {
                                this.hideProgressBar();
                                this.searchResults = response ? response.d : response;
                                this.updateSearchResults();
                            },
                            error => {
                                console.log("Error connecting to service: search.\n" + error.responseText);
                            }
                        );
                    }, 300);
                }

                this.searchTextbox.on("input search", onSearchQueryChanged);

                // NOTE: Workaround for IE9. IE9 doesn't fire 'input' event on backspace/delete buttons.
                //       http://www.useragentman.com/blog/2011/05/12/fixing-oninput-in-ie9-using-html5widgets/
                //       https://github.com/zoltan-dulac/html5Forms.js/blob/master/shared/js/html5Widgets.js
                var isIE9 = (CZ.Settings.ie === 9);
                if (isIE9) {
                    this.searchTextbox.on("keyup", event => {
                        switch (event.which) {
                            case 8: // backspace
                            case 46: // delete
                                onSearchQueryChanged(event);
                                break;
                        }
                    });
                    this.searchTextbox.on("cut", onSearchQueryChanged);
                }
            }

            private sendSearchQuery(query): JQueryPromise {
                return (query === "") ? $.Deferred().resolve(null).promise() : 
                                        CZ.Service.getSearch(query);
            }

            private updateSearchResults(): void {
                this.clearResultSections();

                // Query string is empty. No update.
                if (this.searchResults === null) {
                    this.hideSearchResults();
                    return;
                }

                // No results for this query.
                if (this.searchResults.length === 0) {
                    this.showNoResults();
                    return;
                }

                // There are search results. Show them.
                var resultTypes = {
                    0: "exhibit",
                    1: "timeline",
                    2: "contentItem"
                };

                var sections = {
                    exhibit: $(this.resultSections[1]),
                    timeline: $(this.resultSections[0]),
                    contentItem: $(this.resultSections[2])
                };

                var idPrefixes = {
                    exhibit: "e",
                    timeline: "t",
                    contentItem: ""
                };

                this.searchResults.forEach(item => {
                    var resultType = resultTypes[item.objectType];
                    var resultId = idPrefixes[resultType] + item.id;
                    var resultTitle = item.title;
                    
                    sections[resultType].append($("<div></div>", {
                        class: "cz-form-search-result",                       
                        text: resultTitle,
                        "result-id": resultId,
                        "result-type": resultType,
                        click: function () {
                            CZ.Search.goToSearchResult(item);
                        }
                    }));
                });

                this.showResultsCount();
                this.showNonEmptySections();
            }

            private fillFormWithSearchResults(): void {
                // NOTE: Initially the form is hidden. Show it to compute heights and then hide again.
                this.container.show();
                this.searchResultsBox.css("height", "calc(100% - 150px)");
                this.searchResultsBox.css("height", "-moz-calc(100% - 150px)");
                this.searchResultsBox.css("height", "-webkit-calc(100% - 150px)");
                this.searchResultsBox.css("height", "-o-calc(100% - 150px)");
                this.container.hide();
            }

            private clearResultSections(): void {
                this.resultSections.find("div").remove();                
            }

            private escapeSearchQuery(query) {
                return query ? query.replace(/"/g, "") : "";
            }

            private getResultsCountString() {
                var count = this.searchResults.length;
                return count + ((count === 1) ? " result" : " results");
            }

            private showProgressBar(): void {
                this.progressBar.animate({
                    opacity: 1
                });
            }

            private hideProgressBar(): void {
                this.progressBar.animate({
                    opacity: 0
                });
            }

            private showNonEmptySections(): void {
                this.searchResultsBox.show();
                this.resultSections.show();
                this.resultSections.each((i, item) => {
                    var results = $(item).find("div");
                    if (results.length === 0) {
                        $(item).hide();
                    }
                });
            }

            private showNoResults(): void {
                this.searchResultsBox.show();
                this.resultSections.hide();
                this.resultsCountTextblock.show();
                this.resultsCountTextblock.text("No results");
            }

            private showResultsCount(): void {
                this.searchResultsBox.show();
                this.resultsCountTextblock.show();
                this.resultsCountTextblock.text(this.getResultsCountString());
            }

            private hideResultsCount(): void {
                this.resultsCountTextblock.hide();
            }

            private hideSearchResults(): void {
                this.hideResultsCount();
                this.searchResultsBox.hide();
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        this.searchTextbox.focus();
                    }
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            }
        }
    }
}