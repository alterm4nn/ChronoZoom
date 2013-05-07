using System;
using System.IO;
using System.Xml;
using Application.Driver;
using Application.Helper.Entities;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class AuthorizationHelper : DependentActions
    {
        public void AuthenticateAsGoogleUser()
        {
            Logger.Log("<-");

            if (!IsElementExists(By.XPath("//*[@name='Google']")))
            {
                Click(By.XPath("//*[@id='MoreOptions']/a"));
            }
            Click(By.XPath("//*[@name='Google']"));

            var user = new User { Type = UserType.Google };
            FillUserCredentials(user);
            Logger.Log(user.ToString());
            SetUserInfoAndSubmit(user);
            Sleep(10);
            Logger.Log("->");
        }

        public void AuthenticateAsYahooUser()
        {
            Logger.Log("<-");

            if (!IsElementExists(By.XPath("//*[@name='Yahoo!']")))
            {
                Click(By.XPath("//*[@id='MoreOptions']/a"));
            }
            Click(By.XPath("//*[@name='Yahoo!']"));

            var user = new User { Type = UserType.Yahoo };
            FillUserCredentials(user);
            Logger.Log(user.ToString());
            SetUserInfoAndSubmit(user);
            Logger.Log("->");
        }

        public void AuthenticateAsMicrosoftUser()
        {
            Logger.Log("<-");

            if (!IsElementExists(By.XPath("//*[@name='Windows Live™ ID']")))
            {
                Click(By.XPath("//*[@id='MoreOptions']/a"));
            }
            Click(By.XPath("//*[@name='Windows Live™ ID']"));

            var user = new User { Type = UserType.Microsoft };
            FillUserCredentials(user);
            Logger.Log(user.ToString());
            SetUserInfoAndSubmit(user);
            Logger.Log("->");
        }


        public void Logout()
        {
            Logger.Log("<-");
            if (FindElement(By.XPath("//*[@id='LoginPanel']/a")).Text == "Logout")
            {
                Click(By.XPath("//*[@id='LoginPanel']/a"));
            }
            Logger.Log("->");
        }

        public bool IsUserAuthenticated()
        {
            Logger.Log("<-");

            var isLogoutPresent = FindElement(By.XPath("//*[@id='LoginPanel']/a")).Text == "Logout";
            Logger.Log("isLogoutPresent: " + isLogoutPresent);

            //WaitCondition(() => Convert.ToBoolean(GetJavaScriptExecutionResult("CZ.Common.cosmosVisible != undefined")), 60);
            //OpenUrl(GetParentUriString(new Uri(Configuration.BaseUrl)) + "account/isauth");
            //WaitForElementIsExisted(By.TagName("body"));
            //var isApiAuth = bool.Parse(GetText(By.TagName("body")));
            //Logger.Log("isApiAuth: " + isApiAuth);

            var isCookieExist = IsUserCookieExist();
            Logger.Log("isCookieExist: " + isCookieExist);

            var result = isLogoutPresent && isCookieExist;
            Logger.Log("-> result: " + result);

            return result;
        }

        protected bool IsUserCookieExist()
        {
            var result = false;
            var userCookieNames = new[] { "FedAuth", "FedAuth1" };

            var cookies = GetAllCookies();
            foreach (var cookie in cookies)
            {
                if (userCookieNames[0] == cookie.Name || userCookieNames[1] == cookie.Name)
                {
                    result = true;
                }
            }
            return result;
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
                    user.Login = document.SelectSingleNode("//Accounts/micorsoft/login").InnerText;
                    user.Password = document.SelectSingleNode("//Accounts/micorsoft/password").InnerText;
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
                    WaitForElementIsDisplayed(By.XPath("//*[@id='LoginPanel']/a"));
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
            var lavidFilePath = string.Empty;

            const string accountsPathVsRun = @".\..\..\Constants\Accounts.xml";
            const string accountsPathConsoleRun = @"..\..\..\Application.Helper\Constants\Accounts.xml";

            if (File.Exists(accountsPathVsRun))
                lavidFilePath = accountsPathVsRun;
            if (File.Exists(accountsPathConsoleRun))
                lavidFilePath = accountsPathConsoleRun;
            if (string.IsNullOrEmpty(lavidFilePath))
            {
                throw new Exception("Cannot find Accounts.xml file");
            }
            return lavidFilePath;
        }
    }
}