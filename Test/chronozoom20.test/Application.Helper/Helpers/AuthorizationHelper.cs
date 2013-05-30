using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Xml;
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

        public void AuthenticateAsGoogleUser()
        {
            Logger.Log("<-");
            var user = new User { Type = UserType.Google };
            OpenIdentityProviderPage(user);
            LoginUser(user);
            Logger.Log("->");
        }

        public void AuthenticateAsYahooUser()
        {
            Logger.Log("<-");
            var user = new User { Type = UserType.Yahoo };
            OpenIdentityProviderPage(user);
            LoginUser(user);
            Logger.Log("->");
        }

        public void AuthenticateAsMicrosoftUser()
        {
            Logger.Log("<-");
            var user = new User { Type = UserType.Microsoft };
            OpenIdentityProviderPage(user);
            LoginUser(user);
            Logger.Log("->");
        }


        public void Logout()
        {
            Logger.Log("<-");
            if (!IsElementDisplayed(By.Id("profile-form")))
            {
                Click(By.Id("edit_profile_button"));
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
            WaitForElementIsDisplayed(By.ClassName("cz-form-content"));
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

        protected User FillUserCredentials(User user)
        {
            var document = new XmlDocument();
            document.Load(GetValidAcountsXmlPath());

            switch (user.Type)
            {
                case UserType.Google:
                    user.Login = document.SelectSingleNode("//Accounts/google/login").InnerText;
                    user.Password = document.SelectSingleNode("//Accounts/google/password").InnerText;
                    break;
                case UserType.Microsoft:
                    user.Login = document.SelectSingleNode("//Accounts/microsoft/login").InnerText;
                    user.Password = document.SelectSingleNode("//Accounts/microsoft/password").InnerText;
                    break;
                case UserType.Yahoo:
                    user.Login = document.SelectSingleNode("//Accounts/yahoo/login").InnerText;
                    user.Password = document.SelectSingleNode("//Accounts/yahoo/password").InnerText;
                    break;
                default:
                    throw new Exception("Can not find user credentials, user: " + user);
            }

            return user;
        }

        private void SetUserInfoAndSubmit(User user)
        {
            Logger.Log("<- user type: " + user.Type);

            switch (user.Type)
            {
                case UserType.Google:
                    TypeText(By.Id("Email"), user.Login);
                    TypeText(By.Id("Passwd"), user.Password);
                    Click(By.Id("signIn"));
                    break;
                case UserType.Yahoo:
                    TypeText(By.Id("username"), user.Login);
                    TypeText(By.Id("passwd"), user.Password);
                    Click(By.Id(".save"));
                    break;
                case UserType.Microsoft:
                    ClickElementAndType(By.Id("idDiv_PWD_UsernameExample"), user.Login);
                    ClickElementAndType(By.Id("idDiv_PWD_PasswordExample"), user.Password);
                    Click(By.XPath("//*[@id='idSIButton9']"));
                    break;
            }
            Logger.Log("->");
        }

        private string GetValidAcountsXmlPath()
        {
            var validFilePath = string.Empty;

            const string accountsPathVsRun = @".\..\..\..\Application.Helper\Constants\Accounts.xml";
            const string accountsPathConsoleRun = @".\..\..\..\..\Application.Helper\Constants\Accounts.xml";

            if (File.Exists(accountsPathVsRun))
                validFilePath = accountsPathVsRun;
            if (File.Exists(accountsPathConsoleRun))
                validFilePath = accountsPathConsoleRun;
            if (string.IsNullOrEmpty(validFilePath))
            {
                throw new Exception("Cannot find Accounts.xml file");
            }

            return validFilePath;
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
            FillUserCredentials(user);
            Logger.Log(user.ToString());
            SetUserInfoAndSubmit(user);
            AcceptSecurityWarning();
            Logger.Log("->");
        }

        private void OpenIdentityProviderPage(User user)
        {
            Logger.Log("<- user type: " + user.Type);
            switch (user.Type)
            {
                case UserType.Google:
                    Click(By.XPath("//*[@name='Google']"));
                    break;
                case UserType.Yahoo:
                    Click(By.XPath("//*[@name='Yahoo!']"));
                    break;
                case UserType.Microsoft:
                    Click(By.XPath("//*[@name='Windows Live™ ID']"));
                    break;
            }
            Logger.Log("->");
        }
    }
}