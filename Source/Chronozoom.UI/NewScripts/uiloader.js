var CZ;
(function (CZ) {
    (function (UILoader) {
        var _loadMap = {
            "#auth-event-form": "/ui/auth-event-form.html"
        };
        function loadHtml(selector, filepath) {
            var container = $(selector);
            var promise = new $.Deferred();
            if(!selector || !filepath || !container.length) {
                throw "Unable to load " + filepath + " " + selector;
            }
            container.load(filepath, function () {
                promise.resolve(container);
            });
            return promise;
        }
        function loadAll() {
            var promises = [];
            for(var selector in _loadMap) {
                if(_loadMap.hasOwnProperty(selector)) {
                    promises.push(loadHtml(selector, _loadMap[selector]));
                }
            }
            return $.when.apply($, promises);
        }
        UILoader.loadAll = loadAll;
    })(CZ.UILoader || (CZ.UILoader = {}));
    var UILoader = CZ.UILoader;
})(CZ || (CZ = {}));
