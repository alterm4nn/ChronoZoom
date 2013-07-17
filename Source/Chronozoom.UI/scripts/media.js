var CZ;
(function (CZ) {
    (function (Media) {
        var _mediaPickers = {
        };
        var _mediaPickersViews = {
        };
        Object.defineProperties(CZ.Media, {
            mediaPickers: {
                get: function () {
                    return _mediaPickers;
                }
            },
            mediaPickersViews: {
                get: function () {
                    return _mediaPickersViews;
                }
            }
        });
        function initialize() {
            registerMediaPicker("bing", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing1", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing2", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing3", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing4", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing5", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing6", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("bing7", "/images/media/bing-icon.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
        }
        Media.initialize = initialize;
        function registerMediaPicker(title, iconUrl, viewUrl, type, selector) {
            var order = Object.keys(_mediaPickers).length;
            var setup = type.setup;
            selector = selector || "$('<div></div>')";
            _mediaPickers[title] = {
            };
            return CZ.UILoader.loadHtml(selector, viewUrl).always(function (view) {
                _mediaPickersViews[title] = view;
                _mediaPickers[title] = {
                    title: title,
                    iconUrl: iconUrl,
                    order: order,
                    setup: setup
                };
            });
        }
        Media.registerMediaPicker = registerMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
