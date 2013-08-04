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
            registerMediaPicker("bing", "/images/media/bing-import-50x150.png", CZ.Media.BingMediaPicker, "/ui/media/bing-mediapicker.html");
            if(CZ.Media.SkyDriveMediaPicker.isEnabled) {
                registerMediaPicker("skydrive", "/images/media/skydrive-import-50x50.png", CZ.Media.SkyDriveMediaPicker).done(function () {
                    WL.init({
                        client_id: "0000000040101FFA",
                        redirect_uri: "http://test.chronozoom.com/",
                        response_type: "token",
                        scope: "wl.signin,wl.photos,wl.skydrive,wl.skydrive_update"
                    });
                });
            }
        }
        Media.initialize = initialize;
        function registerMediaPicker(title, iconUrl, type, viewUrl, selector) {
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
