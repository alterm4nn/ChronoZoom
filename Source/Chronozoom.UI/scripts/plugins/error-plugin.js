(function ($) {
    $.fn.showError = function (msg, className, props) {
        className = className || "error";
        props = props || {
        };
        $.extend(true, props, {
            class: className,
            text: msg
        });
        var $errorTemplate = $("<div></div>", props).attr("error", true);
        var $allErrors = $();
        var $errorElems = $();
        var result = this.each(function () {
            var $this = $(this);
            var isDiv;
            var $div;
            var $error;
            if(!$this.data("error")) {
                isDiv = $this.is("div");
                $div = isDiv ? $this : $this.closest("div");
                $error = $errorTemplate.clone();
                $allErrors = $allErrors.add($error);
                $errorElems = $errorElems.add($this);
                $errorElems = $errorElems.add($div);
                $errorElems = $errorElems.add($div.children());
                $this.data("error", $error);
                if(isDiv) {
                    $div.append($error);
                } else {
                    $this.after($error);
                }
            }
        });
        if($allErrors.length > 0) {
            $errorElems.addClass(className);
            $allErrors.slideDown(CZ.Settings.errorMessageSlideDuration);
        }
        return result;
    };
    $.fn.hideError = function () {
        var $allErrors = $();
        var $errorElems = $();
        var classes = "";
        var result = this.each(function () {
            var $this = $(this);
            var $error = $this.data("error");
            var $div;
            var className;
            if($error) {
                $div = $this.is("div") ? $this : $this.closest("div");
                className = $error.attr("class");
                if(classes.split(" ").indexOf(className) === -1) {
                    classes += " " + className;
                }
                $allErrors = $allErrors.add($error);
                $errorElems = $errorElems.add($this);
                $errorElems = $errorElems.add($div);
                $errorElems = $errorElems.add($div.children());
            }
        });
        if($allErrors.length > 0) {
            $allErrors.slideUp(CZ.Settings.errorMessageSlideDuration).promise().done(function () {
                $allErrors.remove();
                $errorElems.removeData("error");
                $errorElems.removeClass(classes);
            });
        }
        return result;
    };
})(jQuery);
