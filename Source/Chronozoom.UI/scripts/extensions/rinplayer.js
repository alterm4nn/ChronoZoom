var CZ;
(function (CZ) {
    (function (Extensions) {
        (function (RIN) {
            function getScript() {
                return "http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjsTag/lib/rin-core-1.0.js";
            }
            RIN.getScript = getScript;

            function getExtension(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload) {
                var rinDiv;
                if (!rinDiv) {
                    rinDiv = document.createElement('div');
                    rinDiv.setAttribute("id", id);
                    rinDiv.setAttribute("class", "rinPlayer");
                    rinDiv.addEventListener("mousemove", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("mousedown", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("mousewheel", CZ.Common.preventbubble, false);

                    rin.processAll(null, 'http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjsTag/').then(function () {
                        var playerElement = document.getElementById(id);
                        var playerControl = rin.getPlayerControl(rinDiv);
                        if (playerControl) {
                            var deepstateUrl = playerControl.resolveDeepstateUrlFromAbsoluteUrl(window.location.href);
                            playerControl.load(contentSource);
                        }
                    });
                } else {
                    rinDiv.isAdded = false;
                }
                return new RINPlayer(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload, rinDiv);
            }
            RIN.getExtension = getExtension;

            function RINPlayer(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload, rinDiv) {
                this.base = CZ.VCContent.CanvasDomItem;
                this.base(vc, layerid, id, vx, vy, vw, vh, z);
                this.initializeContent(rinDiv);

                this.onRemove = function () {
                    //Handle the remove of RIN resources if any
                    var rinplayerControl = rin.getPlayerControl(rinDiv);
                    if (rinplayerControl) {
                        rinplayerControl.pause();
                        if (rinplayerControl.unload) {
                            rinplayerControl.unload();
                        }
                        rinplayerControl = null;
                    }
                    this.prototype.onRemove.call(this);
                };

                this.prototype = new CZ.VCContent.CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
            }
        })(Extensions.RIN || (Extensions.RIN = {}));
        var RIN = Extensions.RIN;
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
