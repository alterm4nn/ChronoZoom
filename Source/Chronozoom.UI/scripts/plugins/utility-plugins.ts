/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

(function ($) {
    /**
     * Make the element fully visible using opacity and visibility CSS rules.
     * @param  {bool} noTransition If true then CSS transition won't be used.
     */
    $.fn.visible = function (noTransition?: bool) {
        return this.each(function () {
            var $this = $(this);
            if (noTransition) {
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

    /**
     * Make the element fully invisible using opacity and visibility CSS rules.
     * @param  {bool} noTransition If true then CSS transition won't be used.
     */
    $.fn.invisible = function (noTransition?: bool) {
        return this.each(function () {
            var $this = $(this);
            if (noTransition) {
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