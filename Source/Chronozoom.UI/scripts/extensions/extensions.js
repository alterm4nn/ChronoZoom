/// <reference path='rinplayer.ts'/>
var CZ;
(function (CZ) {
    (function (Extensions) {
        var extensions = [];

        function mediaTypeIsExtension(mediaType) {
            return mediaType.toLowerCase().indexOf('extension-') === 0;
        }
        Extensions.mediaTypeIsExtension = mediaTypeIsExtension;

        function registerExtensions() {
            registerExtension("RIN", CZ.Extensions.RIN.getExtension, [
                "/scripts/extensions/rin-scripts/tagInk.js",
                "/scripts/extensions/rin-scripts/raphael.js",
                "/scripts/extensions/rin-scripts/rin-core-1.0.js"
            ]);
        }
        Extensions.registerExtensions = registerExtensions;

        function registerExtension(name, initializer, scripts) {
            extensions[name.toLowerCase()] = {
                "initializer": initializer,
                "scripts": scripts
            };
        }

        function activateExtension(mediaType) {
            if (!mediaTypeIsExtension(mediaType))
                return;

            var extensionName = extensionNameFromMediaType(mediaType);
            var scripts = getScriptsFromExtensionName(extensionName);
            scripts.forEach(function (script, index) {
                addScript(extensionName, script, index);
            });
        }
        Extensions.activateExtension = activateExtension;

        function getInitializer(mediaType) {
            var extensionName = extensionNameFromMediaType(mediaType);
            return extensions[extensionName.toLowerCase()].initializer;
        }
        Extensions.getInitializer = getInitializer;

        function extensionNameFromMediaType(mediaType) {
            var extensionIndex = 'extension-'.length;
            return mediaType.substring(extensionIndex, mediaType.length);
        }

        function addScript(extensionName, scriptPath, index) {
            var scriptId = "extension-" + extensionName + index;
            if (document.getElementById(scriptId))
                return;

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = scriptPath;
            script.id = scriptId;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        function getScriptsFromExtensionName(name) {
            return extensions[name.toLowerCase()].scripts;
        }
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
