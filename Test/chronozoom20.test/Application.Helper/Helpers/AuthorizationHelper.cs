using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using Application.Driver;
using Application.Helper.Entities;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class AuthorizationHelper : DependentActions
    {

        public void OpenLoginPage()
        {
            Logger.Log("<-");
            Click(By.Id("login-button"));
            Logger.Log("->");
        }

        public void AuthenticateAsExistedGoogleUser()
        {
            Logger.Log("<-");
            LoginToAcsProvider("chronozoomer@gmail.com");
            Logger.Log("->");
        }

        public void AuthenticateAsGoogleUser()
        {
            Logger.Log("<-");
            var user = new User { Login = "chronozoomtest@gmail.com" };
            LoginToAcsProvider(user);
            Logger.Log("->");
        }

        public void AuthenticateAsYahooUser()
        {
            Logger.Log("<-");
            var user = new User { Login = "chronozoom@yahoo.com" };
            LoginToAcsProvider(user);
            Logger.Log("->");
        }

        public void AuthenticateAsMicrosoftUser()
        {
            Logger.Log("<-");
            var user = new User { Login = "chronozoom@outlook.com" };
            LoginToAcsProvider(user);
            Logger.Log("->");
        }

        public void AuthenticateAsMicrosoftUserToSkyDrive()
        {
            Logger.Log("<-");
            var user = new User { Login = "chronozoom@outlook.com" };
            FillUserCredentials(user);
            LoginUser(user);
            Logger.Log("->", LogType.MessageWithoutScreenshot);
        }

        public void Logout()
        {
            Logger.Log("<-");
            if (!IsElementDisplayed(By.Id("profile-form")))
            {
                OpenEditProfileForm();
            }
            MoveToElementAndClick(By.Id("cz-form-logout"));
            Logger.Log("->");
        }

        public bool IsUserLogout()
        {
            Logger.Log("<-");
            By loginButton = By.Id("login-button");
            WaitForElementIsDisplayed(loginButton);
            bool isUserLogout = IsElementDisplayed(loginButton);
            Logger.Log("-> isUserLogout :" + isUserLogout);
            return isUserLogout;
        }

        public bool IsExistedUserAuthenticated()
        {
            Logger.Log("<-");
            By loginButton = By.Id("edit_profile_button");
            WaitForElementIsDisplayed(loginButton);
            Click(loginButton);
            bool result = IsUserAuthenticated();
            Logger.Log("-> result: " + result);
            return result;
        }

        public bool IsNewUserAuthenticated()
        {
            Logger.Log("<-");
            WaitForElementIsDisplayed(By.CssSelector("#profile-form>.cz-form-content"));
            bool result = IsUserAuthenticated();
            Logger.Log("-> result: " + result);
            return result;
        }

        public bool IsUserCookieExist()
        {
            var userCookieNames = new[] { "FedAuth", "FedAuth1" };
            int index = 0;
            ReadOnlyCollection<Cookie> cookies = GetAllCookies();
            Dictionary<string, int> cookiesDictionary = cookies.ToDictionary(cookie => cookie.Name, value => 1);

            foreach (string userCookieName in userCookieNames)
            {
                if (cookiesDictionary.ContainsKey(userCookieName))
                {
                    index++;
                }
            }
            return index == userCookieNames.Length;
        }

        public void DeleteAuthenticatedCookies()
        {
            var userCookieNames = new[] { "FedAuth", "FedAuth1" };
            foreach (string userCookieName in userCookieNames)
            {
                DeleteCookieByName(userCookieName);
            }
        }

        public void ClickOnUserName()
        {
            Logger.Log("<-");
            Click(By.ClassName("auth-panel-login"));
            Logger.Log("->");
        }


        public bool IsEditProfileFormDisplayed()
        {
            Logger.Log("<-");
            bool result = IsElementDisplayed(By.Id("profile-form"));
            Logger.Log("-> result: " + result);
            return result;
        }


        public void ProvideEmail(string email)
        {
            Logger.Log("<-");
            OpenEditProfileForm();
            SetEmail(email);
            PressEnter(By.Id("email"));
            AcceptAlert();
        }

        public bool IsAlertDispalyed()
        {
            return IsAlertPresented();
        }

        public bool IsUserNamePresented()
        {
            return IsElementExisted(By.ClassName("auth-panel-login"));
        }

        public void LogoutFromSkyDrive()
        {
            Logger.Log("<-");
            OpenUrl("https://login.live.com/oauth20_logout.srf");
            Logger.Log("->");
        }

        private void FillUserCredentials(User user)
        {
            IEnumerable<User> users = GetUsersFromJson();
            if (users != null)
                foreach (User userData in users)
                {
                    if (userData.Login == user.Login)
                    {
                        user.Password = userData.Password;
                        user.Type = userData.Type;
                        break;
                    }
                }
        }
        private IEnumerable<User> GetUsersFromJson()
        {
            StreamReader stream = new StreamReader("Accounts.json");
            string text = stream.ReadToEnd();
            stream.Close();
            byte[] byteArray = Encoding.UTF8.GetBytes(text);
            MemoryStream memoryStream = new MemoryStream(byteArray);
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(IEnumerable<User>));
            IEnumerable<User> users = serializer.ReadObject(memoryStream) as IEnumerable<User>;
            memoryStream.Close();
            return users;
        }

       private bool IsUserAuthenticated()
        {
            Logger.Log("<-");
            var isLogoutPresent = IsElementDisplayed(By.Id("cz-form-logout"));
            Logger.Log("isLogoutPresent: " + isLogoutPresent);

            var isCookieExist = IsUserCookieExist();
            Logger.Log("isCookieExist: " + isCookieExist);

            var result = isLogoutPresent && isCookieExist;
            Logger.Log("-> result: " + result);

            return result;
        }

        private void LoginUser(User user)
        {
            Logger.Log("<-");
            Logger.Log(user.ToString());
            SetUserInfoAndSubmit(user);
            AcceptSecurityWarning();
            Logger.Log("->", LogType.MessageWithoutScreenshot);
        }

        private void SetUserInfoAndSubmit(User user)
        {
            Logger.Log("<- user type: " + user.Type);

            switch (user.Type)
            {
                case "google":
                    TypeText(By.Id("Email"), user.Login);
                    TypeText(By.Id("Passwd"), user.Password);
                    Click(By.Id("signIn"));
                    break;
                case "yahoo":
                    TypeText(By.Id("username"), user.Login);
                    TypeText(By.Id("passwd"), user.Password);
                    Click(By.Id(".save"));
                    break;
                case "microsoft":
                    ClickElementAndType(By.Id("idDiv_PWD_UsernameExample"), user.Login);
                    ClickElementAndType(By.Id("idDiv_PWD_PasswordExample"), user.Password);
                    Click(By.Id("idSIButton9"));
                    break;
            }
            Logger.Log("->", LogType.MessageWithoutScreenshot);
        }

        private void OpenIdentityProviderPage(User user)
        {
            Logger.Log("<- user type: " + user.Type);
            switch (user.Type)
            {
                case "google":
                    Click(By.CssSelector("[name='Google']"));
                    break;
                case "yahoo":
                    Click(By.CssSelector("[name='Yahoo!']"));
                    break;
                case "microsoft":
                    Click(By.CssSelector("[name='Windows Live™ ID']"));
                    break;
                default:
                    throw new Exception("User type is not defined"); 
            }
            Logger.Log("->");
        }

        private void OpenEditProfileForm()
        {
            Logger.Log("<-");
            Click(By.Id("edit_profile_button"));
            Logger.Log("->");
        }

        private void SetEmail(string email)
        {
            Logger.Log("<- email: " + email);
            TypeText(By.Id("email"), email);
            Logger.Log("->");
        }

        public void LogoutByUrl()
        {
            Logger.Log("<-");
            OpenUrl(Configuration.BaseUrl + "/pages/logoff.aspx");
            Logger.Log("->");
        }

        private void LoginToAcsProvider(string email)
        {
            var user = new User { Login = email };
            LoginToAcsProvider(user);
        }

        private void LoginToAcsProvider(User user)
        {
            Logger.Log("<-");
            FillUserCredentials(user);
            OpenIdentityProviderPage(user);
            LoginUser(user);
            Logger.Log("->");
        }

    }
}