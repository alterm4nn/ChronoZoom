using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class BaseExhibitHelper : DependentActions
    {
        protected void SetDescription(string description)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-descr cz-input']"), description);
        }

        protected void SetTitle(string title)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-title cz-input']"), title);
        }

        protected void InitArtifactForm()
        {
            Logger.Log("<-");
            By createArtifactButton = By.XPath("//*[@class='cz-form-create-artifact cz-button']");
            WaitForElementEnabled(createArtifactButton);
            Click(createArtifactButton);
            Logger.Log("->");
        }

        protected void SaveArtifact()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-save cz-button']"));
            Logger.Log("->");
        }
    }
}