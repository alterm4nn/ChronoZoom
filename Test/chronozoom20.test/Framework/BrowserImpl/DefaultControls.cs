using System;
using System.Globalization;
using Framework.Helpers;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.BrowserImpl
{
    public class DefaultControls : CommonActions
    {
        public virtual void ClickCloseButton()
        {
            MoveToElementAndClick(By.Id("welcomeScreenCloseButton"));
        }

        public virtual void NavigateBceToCeEra()
        {
            string targetDate = (DateTimeHelper.GetCurrentTimeInYearFormat() - 1).ToString(CultureInfo.InvariantCulture);
            Logger.Log("- targetDate: " + targetDate);
            string script = String.Format("controller.moveToVisible(new VisibleRegion2d(-{0},222893683.28948474,0.0009286813988062588),false)", targetDate);
            Logger.Log("- script: " + script);
            ExecuteJavaScript(script);
            WaitForElementIsDisplayed(By.Id("bc_link_t550"));
            WaitAnimation();
        }
    }
}