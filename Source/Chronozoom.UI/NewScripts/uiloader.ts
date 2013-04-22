/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module UILoader {
        // Contains mapping: CSS selector -> html file.
        var _loadMap = {
            "#auth-event-form": "/ui/auth-event-form.html"
        };

        function loadHtml(selector, filepath) {
            var container = $(selector);
            var promise = new $.Deferred();

            if (!selector || !filepath || !container.length) {
                throw "Unable to load " + filepath + " " + selector;
            }

            container.load(filepath, function () {
                promise.resolve(container);
            });

            return promise;
        }

        export function loadAll() {
            var promises = [];

            for (var selector in _loadMap) {
                if (_loadMap.hasOwnProperty(selector)) {
                    promises.push(loadHtml(selector, _loadMap[selector]));
                }
            }

            return $.when.apply($, promises);
        }
    }
}