/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormBase = (function () {
            function FormBase(container, formInfo) {
                var _this = this;
                if (!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.isFormVisible = false;
                this.container = container;
                this.prevForm = formInfo.prevForm;
                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);
                this.contentContainer = this.container.find(formInfo.contentContainer);

                this.container.data("form", this);

                if (this.prevForm) {
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
                this.isFormVisible = true;
                this.container.show.apply(this.container, args);
            };

            FormBase.prototype.close = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.isFormVisible = false;
                this.container.data("form", undefined);
                this.container.hide.apply(this.container, args);
                this.container.trigger("close");
            };

            FormBase.prototype.back = function () {
                this.close();
                this.prevForm.show();
            };
            return FormBase;
        })();
        UI.FormBase = FormBase;

        var FormUpdateEntity = (function (_super) {
            __extends(FormUpdateEntity, _super);
            function FormUpdateEntity(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);

                this.saveButton = this.container.find(formInfo.saveButton);

                this.container.keypress(function (event) {
                    if (event.keyCode === 13) {
                        _this.saveButton.trigger("click");
                    }
                });
            }
            return FormUpdateEntity;
        })(FormBase);
        UI.FormUpdateEntity = FormUpdateEntity;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
