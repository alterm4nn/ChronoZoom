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

                // Align search results on window resize.
                var onWindowResize = () => mediaPicker.onWindowResize();

                $(window).on("resize", onWindowResize);

                $(form).on("closecompleted", event => {
                    $(window).off("resize", onWindowResize);
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
                        this.alignThumbnails();
                    }
                }).fail(error => {
                    this.hideProgressBar();
                    this.showErrorMessage(error);
                });
            }

            private searchVideos(query: string): void {
                // NOTE: Only YouTube and Vimeo videos are supported.
                query += " (+site:youtube.com OR +site:vimeo.com)";
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
                        this.alignThumbnails();
                    }
                }).fail(error => {
                    this.hideProgressBar();
                    this.showErrorMessage(error);
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
                }).fail(error => {
                    this.hideProgressBar();
                    this.showErrorMessage(error);
                });
            }

            private createImageResult(result: any): JQuery {
                // thumbnail size
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height,
                    CZ.Settings.mediapickerImageThumbnailMaxWidth,
                    CZ.Settings.mediapickerImageThumbnailMaxHeight
                    );

                // vertical offset to align image vertically
                var imageOffset = (CZ.Settings.mediapickerImageThumbnailMaxHeight - rectangle.height) / 2;

                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: rectangle.width,
                    "data-actual-width": rectangle.width
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

                var thumbnailContainer = $("<div></div>", {
                    width: "100%",
                    height: CZ.Settings.mediapickerImageThumbnailMaxHeight
                });

                var thumbnail = $("<img></img>", {
                    class: "cz-bing-result-thumbnail",
                    src: result.Thumbnail.MediaUrl,
                    height: rectangle.height,
                    width: "100%"
                });
                thumbnail.css("padding-top", imageOffset + "px");

                thumbnailContainer.add(title)
                    .add(size)
                    .click(event => {
                        $(this).trigger("resultclick", this.convertResultToMediaInfo(result, "image"));
                    });

                thumbnailContainer.append(thumbnail);

                return container.append(thumbnailContainer)
                    .append(title)
                    .append(size)
                    .append(url);
            }

            private createVideoResult(result: any): JQuery {
                // Set default thumbnail if there is no any.
                result.Thumbnail = result.Thumbnail || this.createDefaultThumbnail();

                // thumbnail size
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height,
                    CZ.Settings.mediapickerVideoThumbnailMaxWidth,
                    CZ.Settings.mediapickerVideoThumbnailMaxHeight
                    );

                // vertical offset to align image vertically
                var imageOffset = (CZ.Settings.mediapickerVideoThumbnailMaxHeight - rectangle.height) / 2;

                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: rectangle.width,
                    "data-actual-width": rectangle.width
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

                var thumbnailContainer = $("<div></div>", {
                    width: "100%",
                    height: CZ.Settings.mediapickerVideoThumbnailMaxHeight
                });

                var thumbnail = $("<img></img>", {
                    class: "cz-bing-result-thumbnail",
                    src: result.Thumbnail.MediaUrl,
                    height: rectangle.height,
                    width: "100%"
                });
                thumbnail.css("padding-top", imageOffset + "px");

                thumbnailContainer.add(title)
                    .add(size)
                    .click(event => {
                        $(this).trigger("resultclick", this.convertResultToMediaInfo(result, "video"));
                    });

                thumbnailContainer.append(thumbnail);

                return container.append(thumbnailContainer)
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

            private showErrorMessage(error: any): void {
                var errorMessagesByStatus = {
                    "400": "The search request is formed badly. Please contact developers about the error.",
                    "403": "Please sign in to ChronoZoom to use Bing search.",
                    "500": "We are sorry, but something went wrong. Please try again later."
                };

                var errorMessage = $("<span></span>", {
                    class: "cz-red",
                    text: errorMessagesByStatus[error.status]
                });

                this.searchResultsBox.append(errorMessage);
            }

            public onWindowResize() {
                this.alignThumbnails();
            }

            public alignThumbnails() {
                var container = this.searchResultsBox;
                var elements = container.children();

                if (elements.length === 0) {
                    return;
                }

                var rowWidth = container.width(); // current width of search results row
                var currentRow = { // current row
                    elements: [],
                    width: 0
                };

                for (var i = 0, len = elements.length; i < len; i++) {
                    var curElement = $(elements[i]);
                    var curElementActualWidth = +curElement.attr("data-actual-width");
                    var curElementOuterWidth = curElement.outerWidth(true);
                    var curElementInnerWidth = curElement.innerWidth();

                    // next thumbnail exceed row width
                    if (rowWidth < currentRow.width + curElementActualWidth) {
                        var delta = rowWidth - currentRow.width; // available free space in row
                        for (var j = 0, rowLen = currentRow.elements.length; j < rowLen; j++) {
                            var rowElement = currentRow.elements[j];
                            var rowElementActualWidth = +rowElement.attr("data-actual-width");
                            rowElement.width(rowElementActualWidth + delta / rowLen);
                        }
                        currentRow.elements = [];
                        currentRow.elements.push(curElement);
                        // content width + margin + padding + border width
                        currentRow.width = Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    }
                    // next thumbnail is within row width
                    else {
                        currentRow.elements.push(curElement);
                        // content width + margin + padding + border width
                        currentRow.width += Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    }
                }
            }

            private fitThumbnailToContainer(aspectRatio, maxWidth, maxHeight) {
                var maxAspectRatio = maxWidth / maxHeight;
                var output = {
                    width: maxHeight * aspectRatio,
                    height: maxHeight
                }

                // doesn't fit in default rectangle
                if (aspectRatio > maxAspectRatio) {
                    output.width = maxWidth;
                    output.height = maxWidth / aspectRatio;
                }

                return output;
            }
        }
    }
}