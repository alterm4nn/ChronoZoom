var ChronoZoom;
(function (ChronoZoom) {
    (function (MouseWheelPlugin) {
        /**
        * @param {Object} up
        * @param {Object} down
        * @param {Object} preventDefault
        */
        $.fn.extend({
            mousewheel: function (up, down, preventDefault) {
                return this.hover(function () {
                    $.event.mousewheel.giveFocus(this, up, down, preventDefault);
                }, function () {
                    $.event.mousewheel.removeFocus(this);
                });
            },
            mousewheeldown: function (fn, preventDefault) {
                return this.mousewheel(function () {
                }, fn, preventDefault);
            },
            mousewheelup: function (fn, preventDefault) {
                return this.mousewheel(fn, function () {
                }, preventDefault);
            },
            unmousewheel: function () {
                return this.each(function () {
                    var jq = $(this);
                    if(jq.unmouseover) {
                        jq.unmouseover().unmouseout();
                        $.event.mousewheel.removeFocus(this);
                    }
                });
            },
            unmousewheeldown: $.fn.unmousewheel,
            unmousewheelup: $.fn.unmousewheel
        });
        $.event.mousewheel = {
            giveFocus: function (el, up, down, preventDefault) {
                if(el._handleMousewheel) {
                    $(el).unmousewheel();
                }
                if(preventDefault == (window).undefined && down && down.constructor != Function) {
                    preventDefault = down;
                    down = null;
                }
                el._handleMousewheel = function (event) {
                    if(!event) {
                        event = window.event;
                    }
                    if(preventDefault) {
                        if(event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                    }
                    var delta = 0;
                    if(event.wheelDelta) {
                        delta = event.wheelDelta / 120;
                        if((window).opera) {
                            delta = -delta;
                        }
                    } else if(event.detail) {
                        delta = -event.detail / 3;
                    }
                    if(up && (delta > 0 || !down)) {
                        up.apply(el, [
                            event, 
                            delta
                        ]);
                    } else if(down && delta < 0) {
                        down.apply(el, [
                            event, 
                            delta
                        ]);
                    }
                };
                if(window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
                }
                window.onmousewheel = document.onmousewheel = el._handleMousewheel;
            },
            removeFocus: function (el) {
                if(!el._handleMousewheel) {
                    return;
                }
                if(window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
                }
                window.onmousewheel = document.onmousewheel = null;
                el._handleMousewheel = null;
            }
        };
    })(ChronoZoom.MouseWheelPlugin || (ChronoZoom.MouseWheelPlugin = {}));
    var MouseWheelPlugin = ChronoZoom.MouseWheelPlugin;
})(ChronoZoom || (ChronoZoom = {}));
