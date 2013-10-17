/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (UILoader) {
        function loadHtml(selector, filepath) {
            var container = $(selector);
            var promise = $.Deferred();

            if (!filepath) {
                promise.resolve(container);
                return promise;
            }

            if (!selector || !container.length) {
                throw "Unable to load " + filepath + " " + selector;
            }

            container.load(filepath, function () {
                promise.resolve(container);
            });

            return promise;
        }
        UILoader.loadHtml = loadHtml;

        function loadAll(uiMap) {
            var promises = [];

            for (var selector in uiMap) {
                if (uiMap.hasOwnProperty(selector)) {
                    promises.push(loadHtml(selector, uiMap[selector]));
                }
            }

            return $.when.apply($, promises);
        }
        UILoader.loadAll = loadAll;
    })(CZ.UILoader || (CZ.UILoader = {}));
    var UILoader = CZ.UILoader;
})(CZ || (CZ = {}));
