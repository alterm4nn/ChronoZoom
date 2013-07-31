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
            registerMediaPicker("bing", "/images/media/bing-import-50x150.png", "/ui/media/bing-mediapicker.html", CZ.Media.BingMediaPicker);
            registerMediaPicker("skydrive", "/images/media/skydrive-import-50x50.png", "/ui/media/skydrive-mediapicker.html", CZ.Media.SkyDriveMediaPicker);
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
