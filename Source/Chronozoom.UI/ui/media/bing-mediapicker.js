var CZ;
(function (CZ) {
    (function (Media) {
        var BingMediaPicker = (function () {
            function BingMediaPicker(container, context) {
                this.container = container;
                this.contentItem = context;
                this.searchTextbox = this.container.find(".cz-form-search-input");
                this.mediaTypeRadioButtons = this.container.find(":radio");
                this.progressBar = this.container.find(".cz-form-progress-bar");
                this.searchResultsBox = this.container.find(".cz-form-bing-search-results");
                this.searchButton = this.container.find(".cz-form-search-button");
                this.initialize();
            }
            BingMediaPicker.setup = function setup(context) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["bing"];
                var mediaPicker = new BingMediaPicker(mediaPickerContainer, context);
                var formContainer = $(".cz-form-bing-mediapicker");
                if(formContainer.length === 0) {
                    formContainer = $("#mediapicker-form").clone().removeAttr("id").addClass("cz-form-bing-mediapicker").appendTo($("#content"));
                }
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
                form.show();
            };
            BingMediaPicker.prototype.initialize = function () {
                var _this = this;
                this.progressBar.css("opacity", 0);
                this.searchResultsBox.empty();
                this.searchTextbox.val("");
                this.mediaTypeRadioButtons.first().attr("checked", "true");
                this.searchTextbox.off();
                this.searchButton.off();
                $(this).off();
                this.searchTextbox.keypress(function (event) {
                    var code = event.which || event.keyCode;
                    if(code === 13) {
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
                var editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                $.extend(this.contentItem, mediaInfo);
                editContentItemForm.updateMediaInfo();
            };
            BingMediaPicker.prototype.getMediaType = function () {
                return this.mediaTypeRadioButtons.filter(":checked").val();
            };
            BingMediaPicker.prototype.convertResultToMediaInfo = function (result, mediaType) {
                return {
                    uri: result.MediaUrl || result.Url,
                    mediaType: mediaType,
                    mediaSource: result.SourceUrl,
                    attribution: result.SourceUrl
                };
            };
            BingMediaPicker.prototype.search = function () {
                var query = this.searchTextbox.val();
                var mediaType = this.getMediaType();
                this.searchResultsBox.empty();
                this.showProgressBar();
                switch(mediaType) {
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
                    if(response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }
                    for(var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createImageResult(result);
                        _this.searchResultsBox.append(resultContainer);
                    }
                });
            };
            BingMediaPicker.prototype.searchVideos = function (query) {
                var _this = this;
                CZ.Service.getBingVideos(query).done(function (response) {
                    _this.hideProgressBar();
                    if(response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }
                    for(var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createVideoResult(result);
                        _this.searchResultsBox.append(resultContainer);
                    }
                });
            };
            BingMediaPicker.prototype.searchDocuments = function (query) {
                var _this = this;
                CZ.Service.getBingDocuments(query, "pdf").done(function (response) {
                    _this.hideProgressBar();
                    if(response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }
                    for(var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createDocumentResult(result);
                        _this.searchResultsBox.append(resultContainer);
                    }
                });
            };
            BingMediaPicker.prototype.createImageResult = function (result) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 183 * result.Thumbnail.Width / result.Thumbnail.Height
                });
                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title
                });
                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.Width + "x" + result.Height + " - " + Math.round(result.FileSize / 8 / 1024) + " KB"
                });
                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.MediaUrl,
                    target: "_blank"
                });
                var thumbnail = $("<img></img>", {
                    src: result.Thumbnail.MediaUrl,
                    height: 183,
                    width: 183 * result.Thumbnail.Width / result.Thumbnail.Height,
                    class: "cz-bing-result-thumbnail"
                });
                thumbnail.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "image"));
                });
                return container.append(thumbnail).append(title).append(size).append(url);
            };
            BingMediaPicker.prototype.createVideoResult = function (result) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 140 * result.Thumbnail.Width / result.Thumbnail.Height
                });
                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title
                });
                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: "Duration - " + (result.RunTime / 1000) + " seconds"
                });
                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.MediaUrl,
                    target: "_blank"
                });
                var thumbnail = $("<img></img>", {
                    src: result.Thumbnail.MediaUrl,
                    height: 140,
                    width: 140 * result.Thumbnail.Width / result.Thumbnail.Height,
                    class: "cz-bing-result-thumbnail"
                });
                thumbnail.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "video"));
                });
                return container.append(thumbnail).append(title).append(size).append(url);
            };
            BingMediaPicker.prototype.createDocumentResult = function (result) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 300
                });
                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title
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
                    target: "_blank"
                });
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
            return BingMediaPicker;
        })();
        Media.BingMediaPicker = BingMediaPicker;        
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
