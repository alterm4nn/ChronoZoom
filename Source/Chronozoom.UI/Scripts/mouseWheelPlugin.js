/**
* @param {Object} up
* @param {Object} down
* @param {Object} preventDefault
*/
jQuery.fn.extend({
    mousewheel: function (up, down, preventDefault) {
        return this.hover(
			function () {
			    jQuery.event.mousewheel.giveFocus(this, up, down, preventDefault);
			},
			function () {
			    jQuery.event.mousewheel.removeFocus(this);
			}
		);
    },
    mousewheeldown: function (fn, preventDefault) {
        return this.mousewheel(function () { }, fn, preventDefault);
    },
    mousewheelup: function (fn, preventDefault) {
        return this.mousewheel(fn, function () { }, preventDefault);
    },
    unmousewheel: function () {
        return this.each(function () {
            var jq = jQuery(this);
            if (jq.unmouseover) {
                jq.unmouseover().unmouseout();
                jQuery.event.mousewheel.removeFocus(this);
            }
        });
    },
    unmousewheeldown: jQuery.fn.unmousewheel,
    unmousewheelup: jQuery.fn.unmousewheel
});


jQuery.event.mousewheel = {
    giveFocus: function (el, up, down, preventDefault) {
        if (el._handleMousewheel) jQuery(el).unmousewheel();

        if (preventDefault == window.undefined && down && down.constructor != Function) {
            preventDefault = down;
            down = null;
        }

        el._handleMousewheel = function (event) {
            if (!event) event = window.event;
            if (preventDefault)
                if (event.preventDefault) event.preventDefault();
                else event.returnValue = false;
            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
                if (window.opera) delta = -delta;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (up && (delta > 0 || !down))
                up.apply(el, [event, delta]);
            else if (down && delta < 0)
                down.apply(el, [event, delta]);
        };

        if (window.addEventListener)
            window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
        window.onmousewheel = document.onmousewheel = el._handleMousewheel;
    },

    removeFocus: function (el) {
        if (!el._handleMousewheel) return;

        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
        window.onmousewheel = document.onmousewheel = null;
        el._handleMousewheel = null;
    }
};