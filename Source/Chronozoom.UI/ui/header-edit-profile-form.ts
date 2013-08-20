/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {


        export interface FormEditProfileInfo extends CZ.UI.IFormUpdateEntityInfo {
            logoutButton: string;
            usernameInput: string;
            emailInput: string;
            agreeInput: string;
            loginPanel: string;
            profilePanel: string;
            loginPanelLogin: string;
            context: Object;
            allowRedirect: bool;
            collectionTheme: string;
            collectionThemeInput: string;
            collectionThemeWrapper: string;
        }

        export class FormEditProfile extends CZ.UI.FormUpdateEntity {
            private saveButton: JQuery;
            private logoutButton: JQuery;
            private titleInput: JQuery;

            private isCancel: bool;
            private usernameInput: JQuery;
            private emailInput: JQuery;
            private agreeInput: JQuery;
            private loginPanel: JQuery;
            private profilePanel: JQuery;
            private loginPanelLogin: JQuery;
            private allowRedirect: bool;
            private collectionTheme: string;
            private collectionThemeInput: JQuery;
            private collectionThemeWrapper: JQuery;


            constructor(container: JQuery, formInfo: FormEditProfileInfo) {
                super(container, formInfo);
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

            private validEmail(e) {
                // Maximum length is 254: http://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                if (String(e).length > 254)
                    return false;
                var filter = /^([\w^_]+((?:([-_.\+][\w^_]+)|))+|(xn--[\w^_]+))@([\w^_]+(?:(-+[\w^_]+)|)|(xn--[\w^_]+))(?:\.([\w^_]+(?:([\w-_\.\+][\w^_]+)|)|(xn--[\w^_]+)))$/i;
                return String(e).search(filter) != -1;
            }

            private validUsername(e) {
                var filter = /^[a-z0-9\-_]{4,20}$/i;
                return String(e).search(filter) != -1;
            }


            private initialize(): void {
                var profile = CZ.Service.getProfile();

                if (this.collectionThemeWrapper) {
                    this.collectionThemeWrapper.show();
                }

                profile.done(data => {
                    if (data.DisplayName != null) {
                        this.usernameInput.val(data.DisplayName);
                        if (data.DisplayName != "") {
                            this.usernameInput.prop('disabled', true);                            
                        }
                        this.emailInput.val(data.Email);
                        if (data.Email !== undefined && data.Email !== '' && data.Email != null) {
                            this.agreeInput.attr('checked', true);
                            this.agreeInput.prop('disabled', true);
                        }
                    }
                });

                this.saveButton.click(event => {
                    var isValid = this.validUsername(this.usernameInput.val());
                    if (!isValid) {
                        alert("Provided incorrect username, \n'a-z', '0-9', '-', '_' - characters allowed only. ");
                        return;
                    }

                    var emailAddress = "";
                    if (this.emailInput.val()) {
                        var emailIsValid = this.validEmail(this.emailInput.val());
                        if (!emailIsValid) {
                            alert("Provided incorrect email address");
                            return;
                        }

                        var agreeTerms = this.agreeInput.prop("checked");
                        if (!agreeTerms) {
                            alert("Please agree with provided terms");
                            return;
                        }

                        emailAddress = this.emailInput.val();
                    }

                    this.collectionTheme = this.collectionThemeInput.val();

                    Service.getProfile().done((curUser) => {
                        Service.getProfile(this.usernameInput.val()).done((getUser) => {
                            if (curUser.DisplayName == null && typeof getUser.DisplayName != "undefined") {
                                //such username exists
                                alert("Sorry, this username is already in use. Please try again.");
                                return;
                            }
                            CZ.Service.putProfile(this.usernameInput.val(), emailAddress).then(
                                success => {
                                    if (this.collectionTheme) {
                                        CZ.Service.putCollection(this.usernameInput.val(), this.usernameInput.val(), { theme: this.collectionTheme }).then(() => {
                                            if (this.allowRedirect) {
                                                window.location.assign("/" + success);
                                            }
                                            else {
                                                this.close();
                                            }
                                        });
                                    }
                                    else {
                                        if (this.allowRedirect) {
                                            window.location.assign("/" + success);
                                        }
                                        else {
                                            this.close();
                                        }
                                    }
                                },
                                function (error) {
                                    alert("Unable to save changes. Please try again later.");
                                    console.log(error);
                                }
                            );
                        });
                    });
                });

                this.logoutButton.click(event =>
                {
                    window.location.assign("/pages/logoff.aspx");
                });

                // Prevent default behavior of Enter key for input elements.
                var preventEnterKeyPress = event => {
                    if (event.which == 13) {
                        event.preventDefault();
                    }
                };
                this.usernameInput.keypress(preventEnterKeyPress);
                this.emailInput.keypress(preventEnterKeyPress);
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.collectionThemeInput.val(this.collectionTheme);
                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            }

            public setTheme(theme: string) {
                this.collectionTheme = theme;
            }
        }
    }
}