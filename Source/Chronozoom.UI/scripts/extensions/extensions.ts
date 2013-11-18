/// <reference path='rinplayer.ts'/>

module CZ {
    export module Extensions {
        var extensions = [
        ];

        export function mediaTypeIsExtension(mediaType: string) {
            return mediaType.toLowerCase().indexOf('extension-') === 0
        }

        export function registerExtensions() {
            registerExtension(
                "RIN",
                CZ.Extensions.RIN.getExtension,
                [
                    "/scripts/extensions/rin-scripts/tagInk.js",
                    "/scripts/extensions/rin-scripts/raphael.js",
                    "/scripts/extensions/rin-scripts/rin-core-1.0.js"
                ]
            );
        }

        function registerExtension(name: string, initializer, scripts: string[]) {
            extensions[name.toLowerCase()] = {
                "initializer": initializer,
                "scripts": scripts
            };
        }

        export function activateExtension(mediaType: string) {
            if (!mediaTypeIsExtension(mediaType))
                return;

            var extensionName: string = extensionNameFromMediaType(mediaType);
            var scripts = getScriptsFromExtensionName(extensionName);
            scripts.forEach(function (script, index) {
                addScript(extensionName, script, index);
            });
        }

        export function getInitializer(mediaType: string) {
            var extensionName: string = extensionNameFromMediaType(mediaType);
            return extensions[extensionName.toLowerCase()].initializer;
        }

        function extensionNameFromMediaType(mediaType: string) {
            var extensionIndex: number = 'extension-'.length;
            return mediaType.substring(extensionIndex, mediaType.length);
        }

        function addScript(extensionName: string, scriptPath: string, index: number) {
            var scriptId: string = "extension-" + extensionName + index;
            if (document.getElementById(scriptId))
                return;

            var script : any = document.createElement("script");
            script.type = "text/javascript";
            script.src = scriptPath;
            script.id = scriptId;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        function getScriptsFromExtensionName(name: string) {
            return extensions[name.toLowerCase()].scripts;
        }
    }
}