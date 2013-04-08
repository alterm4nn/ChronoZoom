using System;
using System.Globalization;
using Application.Driver;
using Application.Driver.UserActions;
using Application.Helper.Helpers;
using OpenQA.Selenium;

namespace Application.Helper.BrowserImpl
{
    public class DefaultControls : CommonActions
    {
        public virtual void ClickCloseButton()
        {
            MoveToElementAndClick(By.Id("welcomeScreenCloseButton"));
        }

        public virtual void NavigateBceToCeEra()
        {
            string targetDate = "0";
            Logger.Log("- targetDate: " + targetDate);
            string script = String.Format("controller.moveToVisible(new VisibleRegion2d(-{0},224031781.9944986,0.0009286813988062588),false)", targetDate);
            Logger.Log("- script: " + script);
            ExecuteJavaScript(script);
            //Wait For Humanity in bread crumbs
            WaitForElementIsDisplayed(By.Id("bc_link_t161"));
            Sleep(2);
            WaitAnimation();
        }
    }
}