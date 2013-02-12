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
    }
}