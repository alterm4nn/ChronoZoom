/// <reference path='rinplayer.ts'/>

module CZ {
    export module Extensions {
        var extensions = [
        ];

        export function mediaTypeIsExtension(mediaType: string) {
            return mediaType.toLowerCase().indexOf('extension-') === 0
        }

        export function registerExtensions() {
            registerExtension("RIN", CZ.Extensions.RIN.getExtension, "http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjs/lib/rin-core-1.0.js");
        }

        function registerExtension(name: string, initializer, script: string) {
            extensions[name.toLowerCase()] = {
                "initializer": initializer,
                "script": script
            };
        }

        export function activateExtension(mediaType: string) {
            if (!mediaTypeIsExtension(mediaType))
                return;

            var extensionName: string = extensionNameFromMediaType(mediaType);
            addScript(extensionName, getScriptFromExtensionName(extensionName));
        }

        export function getInitializer(mediaType: string) {
            var extensionName: string = extensionNameFromMediaType(mediaType);
            return extensions[extensionName.toLowerCase()].initializer;
        }

        function extensionNameFromMediaType(mediaType: string) {
            var extensionIndex: number = 'extension-'.length;
            return mediaType.substring(extensionIndex, mediaType.length);
        }

        function addScript(extensionName: string, scriptPath: string) {
            var scriptId: string = "extension-" + extensionName;
            if (document.getElementById(scriptId))
                return;

            var script : any = document.createElement("script");
            script.type = "text/javascript";
            script.src = scriptPath;
            script.id = scriptId;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        function getScriptFromExtensionName(name: string) {
            return extensions[name.toLowerCase()].script;
        }
    }
}