var CZ;
(function (CZ) {
    (function (UI) {
        var FormBase = (function () {
            function FormBase(container, activationSource) {
                if(!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.container = container;
                this.activationSource = activationSource;
                this.navPath = [];
                this.initialize();
            }
            FormBase.prototype.initialize = function () {
                var _this = this;
                this.navButton = this.container.find(".cz-form-nav");
                this.closeButton = this.container.find(".cz-form-close-btn > .cz-form-btn");
                this.titleTextblock = this.container.find(".cz-form-title");
                this.closeButton.click(function (event) {
                    _this.close();
                });
            };
            FormBase.prototype.show = function () {
                this.container.show("slow");
            };
            FormBase.prototype.close = function () {
                this.container.hide("slow");
            };
            return FormBase;
        })();
        UI.FormBase = FormBase;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
