(function ($) {
    $.fn.visible = function (noTransition) {
        return this.each(function () {
            var $this = $(this);
            if(noTransition) {
                $this.addClass("no-transition");
            } else {
                $this.removeClass("no-transition");
            }
            $this.css({
                opacity: 1,
                visibility: "visible"
            });
        });
    };
    $.fn.invisible = function (noTransition) {
        return this.each(function () {
            var $this = $(this);
            if(noTransition) {
                $this.addClass("no-transition");
            } else {
                $this.removeClass("no-transition");
            }
            $this.css({
                opacity: 0,
                visibility: "hidden"
            });
        });
    };
})(jQuery);
