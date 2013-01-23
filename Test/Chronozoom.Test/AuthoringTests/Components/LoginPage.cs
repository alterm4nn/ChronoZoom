using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Support.PageObjects;
using OpenQA.Selenium.Interactions.Internal;
using OpenQA.Selenium.Interactions;
using System.Diagnostics;
using System.Drawing;
using System.Threading;

namespace Chronozoom.Test.AuthoringTests.Components
{
    /// <summary>
    /// Page object for login Controller of AuthoringTool.
    /// </summary>
    class LoginPage
    {
        #region Constants

        private const string Login = "admin";
        private const string Password = "admin$";
        // URL of login Controller.
        private const string URL = "http://localhost:44625/Account/LogOn";
        // Loading time to be sure that all page elements were loaded.
        private const int LoadingTime = 2000;

        #endregion Constants

        private readonly IWebDriver loginPage;

        #region Fields

        [FindsBy(How = How.Id, Using = "UserName")]
        public readonly IWebElement userName;

        [FindsBy(How = How.Id, Using = "Password")]
        public readonly IWebElement password;

        [FindsBy(How = How.Id, Using = "RememberMe")]
        public readonly IWebElement remember;

        [FindsBy(How = How.XPath, Using = "//p/input")] 
        public readonly IWebElement submit;

        #endregion Fields

        public LoginPage(IWebDriver driver)
        {
            loginPage = driver;
            loginPage.Navigate().GoToUrl(URL);

            userName = null;
            password = null;
            remember = null;
            submit = null;

            // Wait for few moments to be sure that all page elements were loaded.
            Thread.Sleep(LoadingTime);
            PageFactory.InitElements(loginPage, this);
        }

        /// <summary>
        /// Logging in to the site.
        /// </summary>
        public void LogOn()
        {
            // Fill user name's field.
            userName.SendKeys(Login);

            // Reset password field to avoid collusion in cases if it was automatically filled after login was typed.
            password.Clear();
            password.SendKeys(Password);

            // Check combobox "Remember Me".
            remember.Click();

            // Sumbit.
            submit.Click();

            // Wait for service's reaction on submitting of this timeline. If submit wasn't succesful, then current page would stay.
            // Otherwise, browser will be redirected to the home page.
            Thread.Sleep(LoadingTime);
        }
    }
}
