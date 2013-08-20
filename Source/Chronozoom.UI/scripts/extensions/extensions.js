var CZ;
(function (CZ) {
    (function (Extensions) {
        var extensions = [];
        function mediaTypeIsExtension(mediaType) {
            return mediaType.toLowerCase().indexOf('extension-') === 0;
        }
        Extensions.mediaTypeIsExtension = mediaTypeIsExtension;
        function registerExtensions() {
            registerExtension("RIN", CZ.Extensions.RIN.getExtension, "http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjs/lib/rin-core-1.0.js");
        }
        Extensions.registerExtensions = registerExtensions;
        function registerExtension(name, initializer, script) {
            extensions[name.toLowerCase()] = {
                "initializer": initializer,
                "script": script
            };
        }
        function activateExtension(mediaType) {
            if(!mediaTypeIsExtension(mediaType)) {
                return;
            }
            var extensionName = extensionNameFromMediaType(mediaType);
            addScript(extensionName, getScriptFromExtensionName(extensionName));
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
        function addScript(extensionName, scriptPath) {
            var scriptId = "extension-" + extensionName;
            if(document.getElementById(scriptId)) {
                return;
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = scriptPath;
            script.id = scriptId;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        function getScriptFromExtensionName(name) {
            return extensions[name.toLowerCase()].script;
        }
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
