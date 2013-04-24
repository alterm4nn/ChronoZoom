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
                this.navPath = [];
                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);
                this.navButton.off();
                this.closeButton.off();
                this.closeButton.click(function (event) {
                    _this.close();
                });
            }
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
