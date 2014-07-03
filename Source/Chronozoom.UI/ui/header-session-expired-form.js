/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/service.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderSessionExpired = (function (_super) {
            __extends(FormHeaderSessionExpired, _super);
            function FormHeaderSessionExpired(container, formInfo) {
                _super.call(this, container, formInfo);
                this.time = 60;
                this.sessionTimeSpan = container.find(formInfo.sessionTimeSpan);
                this.sessionButton = container.find(formInfo.sessionButton);

                this.initialize();
            }
            FormHeaderSessionExpired.prototype.initialize = function () {
                var _this = this;
                this.sessionButton.click(function () {
                    CZ.Service.getProfile();
                    clearTimeout(_this.timer);
                    _this.time = 60;
                    _this.close();
                    _this.sessionTimeSpan.html(_this.time.toString());
                    CZ.Authoring.resetSessionTimer();
                    return false;
                });
            };

            FormHeaderSessionExpired.prototype.onTimer = function () {
                var _this = this;
                if (this.time > 0) {
                    this.time--;
                    this.sessionTimeSpan.html(this.time.toString());
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function () {
                        _this.onTimer();
                    }, 1000);
                } else {
                    clearTimeout(this.timer);

                    this.close();
                    document.location.href = "/account/logout";
                }
            };
            FormHeaderSessionExpired.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });

                this.timer = setTimeout(function () {
                    _this.onTimer();
                }, 1000);
                this.activationSource.addClass("active");
            };

            FormHeaderSessionExpired.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderSessionExpired;
        })(CZ.UI.FormBase);
        UI.FormHeaderSessionExpired = FormHeaderSessionExpired;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
