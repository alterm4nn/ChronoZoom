/// <reference path='../../scripts/cz.ts'/>
/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Media) {
        var BingMediaPicker = (function () {
            function BingMediaPicker(container, context) {
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
            BingMediaPicker.setup = function (context) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["bing"];
                var mediaPicker = new BingMediaPicker(mediaPickerContainer, context);
                var formContainer = $(".cz-form-bing-mediapicker");

                if (formContainer.length === 0) {
                    formContainer = $("#mediapicker-form").clone().removeAttr("id").addClass("cz-form-bing-mediapicker").appendTo($("#content"));
                }

                // Create form for Media Picker and append Media Picker to it.
                var form = new CZ.UI.FormMediaPicker(formContainer, mediaPickerContainer, "Import from Bing", {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });

                $(form).on("showcompleted", function (event) {
                    mediaPicker.searchTextbox.focus();
                });

                $(mediaPicker).on("resultclick", function (event) {
                    form.close();
                });

                // Align search results on window resize.
                var onWindowResize = function () {
                    return mediaPicker.onWindowResize();
                };

                $(window).on("resize", onWindowResize);

                $(form).on("closecompleted", function (event) {
                    $(window).off("resize", onWindowResize);
                });

                form.show();
            };

            BingMediaPicker.prototype.initialize = function () {
                var _this = this;
                this.progressBar.css("opacity", 0);
                this.searchTextbox.off();
                this.searchButton.off();
                $(this).off();

                this.searchTextbox.keypress(function (event) {
                    var code = event.which || event.keyCode;

                    if (code === 13) {
                        event.preventDefault();
                        _this.search();
                    }
                });

                this.searchButton.click(function (event) {
                    _this.search();
                });

                $(this).on("resultclick", function (event, mediaInfo) {
                    _this.onSearchResultClick(mediaInfo);
                });
            };

            BingMediaPicker.prototype.onSearchResultClick = function (mediaInfo) {
                $.extend(this.contentItem, mediaInfo);
                this.editContentItemForm.updateMediaInfo();
            };

            BingMediaPicker.prototype.getMediaType = function () {
                return this.mediaTypeRadioButtons.filter(":checked").val();
            };

            BingMediaPicker.prototype.convertResultToMediaInfo = function (result, mediaType) {
                var mediaInfoMap = {
                    image: {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.SourceUrl,
                        attribution: result.SourceUrl
                    },
                    video: {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.MediaUrl,
                        attribution: result.MediaUrl
                    },
                    pdf: {
                        uri: result.Url,
                        mediaType: mediaType,
                        mediaSource: result.Url,
                        attribution: result.Url
                    }
                };

                return mediaInfoMap[mediaType];
            };

            BingMediaPicker.prototype.search = function () {
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
            };

            BingMediaPicker.prototype.searchImages = function (query) {
                var _this = this;
                CZ.Service.getBingImages(query).done(function (response) {
                    _this.hideProgressBar();

                    if (response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createImageResult(result);
                        _this.searchResultsBox.append(resultContainer);
                        _this.alignThumbnails();
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };

            BingMediaPicker.prototype.searchVideos = function (query) {
                var _this = this;
                // NOTE: Only YouTube and Vimeo videos are supported.
                query += " (+site:youtube.com OR +site:vimeo.com)";
                CZ.Service.getBingVideos(query).done(function (response) {
                    _this.hideProgressBar();

                    if (response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createVideoResult(result);
                        _this.searchResultsBox.append(resultContainer);
                        _this.alignThumbnails();
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };

            BingMediaPicker.prototype.searchDocuments = function (query) {
                var _this = this;
                // NOTE: Currently only PDF is supported.
                CZ.Service.getBingDocuments(query, "pdf").done(function (response) {
                    _this.hideProgressBar();

                    if (response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }

                    for (var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createDocumentResult(result);
                        _this.searchResultsBox.append(resultContainer);
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };

            BingMediaPicker.prototype.createImageResult = function (result) {
                var _this = this;
                // thumbnail size
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height, CZ.Settings.mediapickerImageThumbnailMaxWidth, CZ.Settings.mediapickerImageThumbnailMaxHeight);

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
                    text: result.Width + "x" + result.Height + " - " + Math.round(result.FileSize / 8 / 1024) + " KB"
                });

                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.MediaUrl,
                    title: result.DisplayUrl,
                    "media-source": result.SourceUrl,
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

                thumbnailContainer.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "image"));
                });

                thumbnailContainer.append(thumbnail);

                return container.append(thumbnailContainer).append(title).append(size).append(url);
            };

            BingMediaPicker.prototype.createVideoResult = function (result) {
                var _this = this;
                // Set default thumbnail if there is no any.
                result.Thumbnail = result.Thumbnail || this.createDefaultThumbnail();

                // thumbnail size
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height, CZ.Settings.mediapickerVideoThumbnailMaxWidth, CZ.Settings.mediapickerVideoThumbnailMaxHeight);

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

                thumbnailContainer.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "video"));
                });

                thumbnailContainer.append(thumbnail);

                return container.append(thumbnailContainer).append(title).append(size).append(url);
            };

            BingMediaPicker.prototype.createDocumentResult = function (result) {
                var _this = this;
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
                title.add(descr).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "pdf"));
                });

                return container.append(title).append(descr).append(url);
            };

            BingMediaPicker.prototype.showProgressBar = function () {
                this.progressBar.animate({
                    opacity: 1
                });
            };

            BingMediaPicker.prototype.hideProgressBar = function () {
                this.progressBar.animate({
                    opacity: 0
                });
            };

            BingMediaPicker.prototype.showNoResults = function () {
                this.searchResultsBox.text("No results.");
            };

            BingMediaPicker.prototype.createDefaultThumbnail = function () {
                return {
                    ContentType: "image/png",
                    FileSize: 4638,
                    Width: 500,
                    Height: 500,
                    MediaUrl: "/images/Temp-Thumbnail2.png"
                };
            };

            BingMediaPicker.prototype.showErrorMessage = function (error) {
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
            };

            BingMediaPicker.prototype.onWindowResize = function () {
                this.alignThumbnails();
            };

            BingMediaPicker.prototype.alignThumbnails = function () {
                var container = this.searchResultsBox;
                var elements = container.children();

                if (elements.length === 0) {
                    return;
                }

                var rowWidth = container.width();
                var currentRow = {
                    elements: [],
                    width: 0
                };

                for (var i = 0, len = elements.length; i < len; i++) {
                    var curElement = $(elements[i]);
                    var curElementActualWidth = +curElement.attr("data-actual-width");
                    var curElementOuterWidth = curElement.outerWidth(true);
                    var curElementInnerWidth = curElement.innerWidth();

                    if (rowWidth < currentRow.width + curElementActualWidth) {
                        var delta = rowWidth - currentRow.width;
                        for (var j = 0, rowLen = currentRow.elements.length; j < rowLen; j++) {
                            var rowElement = currentRow.elements[j];
                            var rowElementActualWidth = +rowElement.attr("data-actual-width");
                            rowElement.width(rowElementActualWidth + delta / rowLen);
                        }
                        currentRow.elements = [];
                        currentRow.elements.push(curElement);

                        // content width + margin + padding + border width
                        currentRow.width = Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    } else {
                        currentRow.elements.push(curElement);

                        // content width + margin + padding + border width
                        currentRow.width += Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    }
                }
            };

            BingMediaPicker.prototype.fitThumbnailToContainer = function (aspectRatio, maxWidth, maxHeight) {
                var maxAspectRatio = maxWidth / maxHeight;
                var output = {
                    width: maxHeight * aspectRatio,
                    height: maxHeight
                };

                if (aspectRatio > maxAspectRatio) {
                    output.width = maxWidth;
                    output.height = maxWidth / aspectRatio;
                }

                return output;
            };
            return BingMediaPicker;
        })();
        Media.BingMediaPicker = BingMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
