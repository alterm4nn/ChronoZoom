using System;
using Application.Driver;
using Application.Driver.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.BrowserImpl
{
    public class DefaultControls : CommonActions
    {
        public virtual void ClickCloseButton()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.Id("welcomeScreenCloseButton"));
            Logger.Log("->");
        }

        public virtual void NavigateBceToCeEra()
        {
            Logger.Log("<-");
            string targetDate = "0";
            Logger.Log("- targetDate: " + targetDate);
            string script = String.Format("CZ.Common.controller.moveToVisible(new CZ.Viewport.VisibleRegion2d(-{0},224031781.9944986,0.0009286813988062588),false)", targetDate);
            Logger.Log("- script: " + script);
            ExecuteJavaScript(script);
            Logger.Log("->");
        }

        public virtual void SecurityWarningAccept()
        {
            //No alert by default (chrome and IE).
        }
    }
}