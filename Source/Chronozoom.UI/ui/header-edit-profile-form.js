/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
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
        var FormEditProfile = (function (_super) {
            __extends(FormEditProfile, _super);
            function FormEditProfile(container, formInfo) {
                _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.logoutButton = container.find(formInfo.logoutButton);
                this.usernameInput = container.find(formInfo.usernameInput);
                this.emailInput = container.find(formInfo.emailInput);
                this.agreeInput = container.find(formInfo.agreeInput);
                this.loginPanel = $(document.body).find(formInfo.loginPanel).first();
                this.profilePanel = $(document.body).find(formInfo.profilePanel).first();
                this.loginPanelLogin = $(document.body).find(formInfo.loginPanelLogin).first();
                this.allowRedirect = formInfo.allowRedirect;
                this.collectionTheme = formInfo.collectionTheme;
                this.collectionThemeInput = container.find(formInfo.collectionThemeInput);
                this.collectionThemeWrapper = container.find(formInfo.collectionThemeWrapper);

                this.usernameInput.off("keypress");
                this.emailInput.off("keypress");

                this.initialize();
            }
            FormEditProfile.prototype.validEmail = function (e) {
                if (String(e).length > 254)
                    return false;
                var filter = /^([\w^_]+((?:([-_.\+][\w^_]+)|))+|(xn--[\w^_]+))@([\w^_]+(?:(-+[\w^_]+)|)|(xn--[\w^_]+))(?:\.([\w^_]+(?:([\w-_\.\+][\w^_]+)|)|(xn--[\w^_]+)))$/i;
                return String(e).search(filter) != -1;
            };

            FormEditProfile.prototype.validUsername = function (e) {
                var filter = /^[a-z0-9\-_]{4,20}$/i;
                return String(e).search(filter) != -1;
            };

            FormEditProfile.prototype.initialize = function () {
                var _this = this;
                var profile = CZ.Service.getProfile();

                if (this.collectionThemeWrapper) {
                    this.collectionThemeWrapper.show();
                }

                profile.done(function (data) {
                    if (data.DisplayName != null) {
                        _this.usernameInput.val(data.DisplayName);
                        if (data.DisplayName != "") {
                            _this.usernameInput.prop('disabled', true);
                        }
                        _this.emailInput.val(data.Email);
                        if (data.Email !== undefined && data.Email !== '' && data.Email != null) {
                            _this.agreeInput.attr('checked', true);
                            _this.agreeInput.prop('disabled', true);
                        }
                    }
                });

                this.saveButton.click(function (event) {
                    var isValid = _this.validUsername(_this.usernameInput.val());
                    if (!isValid) {
                        alert("Provided incorrect username, \n'a-z', '0-9', '-', '_' - characters allowed only. ");
                        return;
                    }

                    var emailAddress = "";
                    if (_this.emailInput.val()) {
                        var emailIsValid = _this.validEmail(_this.emailInput.val());
                        if (!emailIsValid) {
                            alert("Provided incorrect email address");
                            return;
                        }

                        var agreeTerms = _this.agreeInput.prop("checked");
                        if (!agreeTerms) {
                            alert("Please agree with provided terms");
                            return;
                        }

                        emailAddress = _this.emailInput.val();
                    }

                    _this.collectionTheme = _this.collectionThemeInput.val();

                    CZ.Service.getProfile().done(function (curUser) {
                        CZ.Service.getProfile(_this.usernameInput.val()).done(function (getUser) {
                            if (curUser.DisplayName == null && typeof getUser.DisplayName != "undefined") {
                                //such username exists
                                alert("Sorry, this username is already in use. Please try again.");
                                return;
                            }
                            CZ.Service.putProfile(_this.usernameInput.val(), emailAddress).then(function (success) {
                                if (_this.collectionTheme) {
                                    CZ.Service.putCollection(_this.usernameInput.val(), _this.usernameInput.val(), { theme: _this.collectionTheme }).then(function () {
                                        if (_this.allowRedirect) {
                                            window.location.assign("/" + success);
                                        } else {
                                            _this.close();
                                        }
                                    });
                                } else {
                                    if (_this.allowRedirect) {
                                        window.location.assign("/" + success);
                                    } else {
                                        _this.close();
                                    }
                                }
                            }, function (error) {
                                alert("Unable to save changes. Please try again later.");
                                console.log(error);
                            });
                        });
                    });
                });

                this.logoutButton.click(function (event) {
                    WL.logout();
                    window.location.assign("/pages/logoff.aspx");
                });

                // Prevent default behavior of Enter key for input elements.
                var preventEnterKeyPress = function (event) {
                    if (event.which == 13) {
                        event.preventDefault();
                    }
                };
                this.usernameInput.keypress(preventEnterKeyPress);
                this.emailInput.keypress(preventEnterKeyPress);
            };

            FormEditProfile.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.collectionThemeInput.val(this.collectionTheme);
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

            FormEditProfile.prototype.setTheme = function (theme) {
                this.collectionTheme = theme;
            };
            return FormEditProfile;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditProfile = FormEditProfile;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
