var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditProfile = (function (_super) {
            __extends(FormEditProfile, _super);
            function FormEditProfile(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.logoutButton = container.find(formInfo.logoutButton);
                this.usernameInput = container.find(formInfo.usernameInput);
                this.emailInput = container.find(formInfo.emailInput);
                this.agreeInput = container.find(formInfo.agreeInput);
                this.loginPanel = $(document.body).find(formInfo.loginPanel);
                this.profilePanel = $(document.body).find(formInfo.profilePanel);
                this.loginPanelLogin = $(document.body).find(formInfo.loginPanelLogin);
                this.initialize();
            }
            FormEditProfile.prototype.validEmail = function (e) {
                var filter = /^\w+@[a-zA-Z_\.]+?\.[a-zA-Z]{2,4}$/;
                return String(e).search(filter) != -1;
            };
            FormEditProfile.prototype.validUsername = function (e) {
                var filter = /^[a-z0-9\-_]{4,20}$/i;
                return String(e).search(filter) != -1;
            };
            FormEditProfile.prototype.initialize = function () {
                var _this = this;
                var profile = CZ.Service.getProfile();
                profile.done(function (data) {
                    if(data.DisplayName != null) {
                        _this.usernameInput.val(data.DisplayName);
                        if(data.DisplayName != "") {
                            _this.usernameInput.prop('disabled', true);
                            _this.agreeInput.attr('checked', true);
                            _this.agreeInput.prop('disabled', true);
                        }
                        _this.emailInput.val(data.Email);
                    }
                });
                this.saveButton.click(function (event) {
                    var isValid = _this.validUsername(_this.usernameInput.val());
                    if(!isValid) {
                        alert("Provided incorrect username, \n'a-z', '0-9', '-', '_' - characters allowed only. ");
                        return;
                    }
                    isValid = _this.validEmail(_this.emailInput.val());
                    if(!isValid) {
                        alert("Provided incorrect email address");
                        return;
                    }
                    isValid = _this.agreeInput.prop("checked");
                    if(!isValid) {
                        alert("Please agree with provided terms");
                        return;
                    }
                    CZ.Service.putProfile(_this.usernameInput.val(), _this.emailInput.val()).then(function (success) {
                        window.location.assign("\\" + success);
                    }, function (error) {
                        alert("Unable to save changes. Please try again later.");
                        console.log(error);
                    });
                });
                this.logoutButton.click(function (event) {
                    return $.ajax({
                        url: "/account/logout"
                    }).done(function (data) {
                        _this.profilePanel.hide();
                        _this.loginPanel.show();
                        _super.prototype.close.call(_this);
                    });
                });
            };
            FormEditProfile.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditProfile.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormEditProfile;
        })(CZ.UI.FormBase);
        UI.FormEditProfile = FormEditProfile;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
