var CZ;
(function (CZ) {
    (function (UI) {
        var FormBase = (function () {
            function FormBase(container, formInfo) {
                var _this = this;
                if(!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.container = container;
                this.prevForm = formInfo.prevForm;
                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);
                if(this.prevForm) {
                    this.navButton.show();
                } else {
                    this.navButton.hide();
                }
                this.navButton.off();
                this.closeButton.off();
                this.navButton.click(function (event) {
                    _this.back();
                });
                this.closeButton.click(function (event) {
                    _this.close();
                });
            }
            FormBase.prototype.show = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.container.show.apply(this.container, args);
            };
            FormBase.prototype.close = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.container.hide.apply(this.container, args);
            };
            FormBase.prototype.back = function () {
                this.close();
                this.prevForm.show();
            };
            return FormBase;
        })();
        UI.FormBase = FormBase;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
