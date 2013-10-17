/// <reference path='../../scripts/media.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (UI) {
        var MediaList = (function () {
            function MediaList(container, mediaPickers, context) {
                this.container = container;
                this.mediaPickers = mediaPickers;
                this.context = context;

                this.container.addClass("cz-medialist");
                this.fillListOfLinks();
            }
            MediaList.prototype.fillListOfLinks = function () {
                var _this = this;
                // Sort mediaPickers keys by 'order' property.
                var sortedMediaPickersKeys = Object.keys(this.mediaPickers).sort(function (key1, key2) {
                    return _this.mediaPickers[key1].order - _this.mediaPickers[key2].order;
                });

                // Construct list of links dynamically.
                sortedMediaPickersKeys.forEach(function (key) {
                    if (_this.mediaPickers.hasOwnProperty(key)) {
                        var mp = _this.mediaPickers[key];
                        var link = _this.createMediaPickerLink(mp);
                        _this.container.append(link);
                    }
                });
            };

            MediaList.prototype.createMediaPickerLink = function (mp) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-medialist-item",
                    title: mp.title,
                    "media-picker": mp.title
                });

                var icon = $("<img></img>", {
                    class: "cz-medialist-item-icon",
                    src: mp.iconUrl
                });

                container.click(function (event) {
                    mp.setup(_this.context);
                });

                container.append(icon);
                return container;
            };

            MediaList.prototype.remove = function () {
                this.container.empty();
                this.container.removeClass("cz-medialist");
            };
            return MediaList;
        })();
        UI.MediaList = MediaList;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
