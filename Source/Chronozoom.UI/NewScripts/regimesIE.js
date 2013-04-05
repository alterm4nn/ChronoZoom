//IE9 trick
//This script passes mouse events over the div#regime_navigator to div.regime_rect's
/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (RegimesIE) {
        function isInside(e, elem) {
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            var offset = elem.offset();
            var width = elem.width();
            var height = elem.height();
            if(mouseX > offset.left && mouseX < offset.left + width && mouseY > offset.top && mouseY < offset.top + height) {
                return true;
            }
            return false;
        }
        function passThrough(e) {
            document.body.style.cursor = 'default';
            $("div.regime_rect").each(function () {
                if(isInside(e, $(this))) {
                    document.body.style.cursor = 'pointer';
                }
            });
        }
        function clickThrough(e) {
            $("div.regime_rect").each(function () {
                if(isInside(e, $(this))) {
                    $(this).click();
                }
            });
        }
        $(document).ready(function () {
            $("#regime_navigator").mousemove(passThrough);
            $("#regime_navigator").click(clickThrough);
            $(".regimes_rects").mouseout(function () {
                document.body.style.cursor = 'default';
            });
        });
    })(CZ.RegimesIE || (CZ.RegimesIE = {}));
    var RegimesIE = CZ.RegimesIE;
})(CZ || (CZ = {}));
