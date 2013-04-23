/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module UILoader {
        
        export function loadHtml(selector, filepath) {
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

        export function loadAll(uiMap: Object) {
            var promises = [];

            for (var selector in uiMap) {
                if (uiMap.hasOwnProperty(selector)) {
                    promises.push(loadHtml(selector, uiMap[selector]));
                }
            }

            return $.when.apply($, promises);
        }
    }
}