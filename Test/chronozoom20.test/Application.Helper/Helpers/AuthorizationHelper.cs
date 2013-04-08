using System;
using System.Text;
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
            
            var user = new User { Login = Constants.UsersInfo.Default.google_login, Password = Constants.UsersInfo.Default.google_password, Type = UserType.Google };
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
            
            var user = new User { Login = Constants.UsersInfo.Default.yahoo_login, Password = Constants.UsersInfo.Default.yahoo_password, Type = UserType.Yahoo };
            Logger.Log(user.ToString());
            SetUserInfoAndSubmit(user);
            Logger.Log("->");
        }

        public void AuthenticateAsMsUser()
        {
            Logger.Log("<-");

            if (!IsElementExists(By.XPath("//*[@name='Windows Live™ ID']")))
            {
                Click(By.XPath("//*[@id='MoreOptions']/a"));
            }
            Click(By.XPath("//*[@name='Windows Live™ ID']"));

            var user = new User { Login = Constants.UsersInfo.Default.wlid_login, Password = Constants.UsersInfo.Default.wlid_password, Type = UserType.Ms };
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

            WaitCondition(() => Convert.ToBoolean(GetJavaScriptExecutionResult("visReg != undefined")), 60);
            OpenUrl(GetParentUriString(new Uri(Configuration.BaseUrl)) + "account/isauth");
            WaitForElementIsExisted(By.TagName("body"));
            var isApiAuth = bool.Parse(GetText(By.TagName("body")));
            Logger.Log("isApiAuth: " + isApiAuth);

            var isCookieExist = IsUserCookieExist();
            Logger.Log("isCookieExist: " + isCookieExist);

            var result = isLogoutPresent && isApiAuth && isCookieExist;
            Logger.Log("-> result: " + result);

            return result;
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
                case UserType.Ms:
                    ClickElementAndType(By.Id("idDiv_PWD_UsernameExample"), user.Login);
                    ClickElementAndType(By.Id("idDiv_PWD_PasswordExample"), user.Password);
                    Click(By.XPath("//*[@id='idSIButton9']"));
                    break;
            }

            Logger.Log("->");
        }

        private string GetParentUriString(Uri uri)
        {
            var parentName = new StringBuilder();
            parentName.Append(uri.Scheme);
            parentName.Append("://");
            parentName.Append(uri.Host);

            for (int i = 0; i < uri.Segments.Length - 1; i++)
            {
                parentName.Append(uri.Segments[i]);
            }
            return parentName.ToString();
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
    }
}