/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module Media {
        export class BingMediaPicker {
            public static setup(context: any) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["bing"];
                var mediaPicker = new BingMediaPicker(mediaPickerContainer, context);
                var formContainer = $(".cz-form-bing-mediapicker");

                // Create container for Media Picker's form if it doesn't exist.
                if (formContainer.length === 0) {
                    formContainer = $("#mediapicker-form")
                        .clone()
                        .removeAttr("id")
                        .addClass("cz-form-bing-mediapicker")
                        .appendTo($("#content"));
                }

                // Create form for Media Picker and append Media Picker to it.
                var form = new CZ.UI.FormMediaPicker(
                    formContainer,
                    mediaPickerContainer, 
                    "Import from Bing",
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        contentContainer: ".cz-form-content"
                    }
                );

                $(form).on("showcompleted", event => {
                    mediaPicker.searchTextbox.focus();
                });

                $(mediaPicker).on("resultclick", event => {
                    form.close();
                });

                form.show();
            }

            private editContentItemForm: CZ.UI.FormEditCI;
            private container: JQuery;
            private contentItem: any;

            private mediaTypeRadioButtons: JQuery;
            private progressBar: JQuery;
            private searchResultsBox: JQuery;
            private searchButton: JQuery;
            public searchTextbox: JQuery;

            constructor(container: JQuery, context: any) {
                this.container = container;
                this.contentItem = context;

                this.editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                this.searchTextbox = this.container.find(".cz-bing-search-input");
                this.mediaTypeRadioButtons = this.container.find(":radio");
                this.progressBar = this.container.find(".cz-form-progress-bar");
                this.searchResultsBox = this.container.find(".cz-bing-search-results");
                this.searchButton = this.container.find(".cz-bing-search-button");

                this.initialize();
            }

            private initialize(): void {
                this.progressBar.css("opacity", 0);
                this.searchResultsBox.empty();
                this.searchTextbox.val("");
                this.mediaTypeRadioButtons.first().attr("checked", "true");
                this.searchTextbox.off();
                this.searchButton.off();
                $(this).off();

                this.searchTextbox.keypress(event => {
                    var code = event.which || event.keyCode;

                    // If Enter button is pressed.
                    if (code === 13) {
                        event.preventDefault();
                        this.search();
                    }
                });

                this.searchButton.click(event => {
                    this.search();
                });

                $(this).on("resultclick", (event, mediaInfo) => {
                    this.onSearchResultClick(mediaInfo);
                });
            }

            private onSearchResultClick(mediaInfo: CZ.Media.MediaInfo): void {
                $.extend(this.contentItem, mediaInfo);
                this.editContentItemForm.updateMediaInfo();
            }

            private getMediaType(): string {
                return this.mediaTypeRadioButtons.filter(":checked").val();
            }

            private convertResultToMediaInfo(result: any, mediaType: string): CZ.Media.MediaInfo {
                var mediaInfoMap = {
                    image: <CZ.Media.MediaInfo> {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.SourceUrl,
                        attribution: result.SourceUrl
                    },
                    video: <CZ.Media.MediaInfo> {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.MediaUrl,
                        attribution: result.MediaUrl
                    },
                    pdf: <CZ.Media.MediaInfo> {
                        uri: result.Url,
                        mediaType: mediaType,
                        mediaSource: result.Url,
                        attribution: result.Url
                    }
                };
                
                return mediaInfoMap[mediaType];
            }

            private search(): void {
                var query = this.searchTextbox.val();
                var mediaType = this.getMediaType();

                if (query.trim() === "") {
                    return;
                }

                this.searchResultsBox.empty();
                this.showProgressBar();

                switch (mediaType) {
                    case "image":
                        this.searchImages(query);
                        break;
                    case "video":
                        this.searchVideos(query);
                        break;
                    case "document":
                        this.searchDocuments(query);
                        break;
                }
            }

            private searchImages(query: string): void {
                CZ.Service.getBingImages(query).done(response => {
                    this.hideProgressBar();

                    if (response.d.length === 0) {
                        this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = this.createImageResult(result);
                        this.searchResultsBox.append(resultContainer);
                    }
                });
            }

            private searchVideos(query: string): void {
                CZ.Service.getBingVideos(query).done(response => {
                    this.hideProgressBar();

                    if (response.d.length === 0) {
                        this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = this.createVideoResult(result);
                        this.searchResultsBox.append(resultContainer);
                    }
                });
            }

            private searchDocuments(query: string): void {
                // NOTE: Currently only PDF is supported.
                CZ.Service.getBingDocuments(query, "pdf").done(response => {
                    this.hideProgressBar();

                    if (response.d.length === 0) {
                        this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = this.createDocumentResult(result);
                        this.searchResultsBox.append(resultContainer);
                    }
                });
            }

            private createImageResult(result: any): JQuery {
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 183 * result.Thumbnail.Width / result.Thumbnail.Height
                });

                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });

                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.Width + "x" + result.Height + " - " +
                          Math.round(result.FileSize / 8 / 1024) + " KB"
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.MediaUrl,
                    title: result.DisplayUrl,
                    target: "_blank"
                });

                var thumbnail = $("<img></img>", {
                    src: result.Thumbnail.MediaUrl,
                    height: 183,
                    width: 183 * result.Thumbnail.Width / result.Thumbnail.Height,
                    class: "cz-bing-result-thumbnail"
                });

                thumbnail.add(title)
                    .add(size)
                    .click(event => {
                        $(this).trigger("resultclick", this.convertResultToMediaInfo(result, "image"));
                    });

                return container.append(thumbnail)
                    .append(title)
                    .append(size)
                    .append(url);
            }

            private createVideoResult(result: any): JQuery {
                // Set default thumbnail if there is no any.
                result.Thumbnail = result.Thumbnail || this.createDefaultThumbnail();

                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 140 * result.Thumbnail.Width / result.Thumbnail.Height
                });

                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });

                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: "Duration - " + (result.RunTime / 1000) + " seconds"
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.MediaUrl,
                    href: result.MediaUrl,
                    title: result.MediaUrl,
                    target: "_blank"
                });

                var thumbnail = $("<img></img>", {
                    src: result.Thumbnail.MediaUrl,
                    height: 140,
                    width: 140 * result.Thumbnail.Width / result.Thumbnail.Height,
                    class: "cz-bing-result-thumbnail"
                });

                thumbnail.add(title)
                    .add(size)
                    .click(event => {
                        $(this).trigger("resultclick", this.convertResultToMediaInfo(result, "video"));
                    });

                return container.append(thumbnail)
                    .append(title)
                    .append(size)
                    .append(url);
            }

            private createDocumentResult(result: any): JQuery {
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 300
                });

                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });

                var descr = $("<div></div>", {
                    class: "cz-bing-result-doc-description cz-lightgray",
                    height: 100,
                    text: result.Description
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.Url,
                    title: result.DisplayUrl,
                    target: "_blank"
                });

                // NOTE: Currently only PDF is supported.
                title.add(descr)
                    .click(event => {
                        $(this).trigger("resultclick", this.convertResultToMediaInfo(result, "pdf"));
                    });

                return container.append(title)
                    .append(descr)
                    .append(url);
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

            private showNoResults(): void {
                this.searchResultsBox.text("No results.");
            }

            private createDefaultThumbnail() {
                return {
                    ContentType: "image/png",
                    FileSize: 4638,
                    Width: 500,
                    Height: 500,
                    MediaUrl: "/images/Temp-Thumbnail2.png"
                };
            }
        }
    }
}