using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class BaseExhibitHelper : DependentActions
    {
        protected void SetDescription(string description)
        {
            Logger.Log("<- description: " + description);
            TypeText(By.CssSelector("#auth-edit-contentitem-form .cz-form-item-descr.cz-input"), description);
            Logger.Log("->");
        }

        protected void SetTitle(string title)
        {
            Logger.Log("<- title: " + title);
            TypeText(By.CssSelector("#auth-edit-contentitem-form .cz-form-item-title.cz-input"), title);
            Logger.Log("->");
        }

        protected void InitArtifactForm()
        {
            Logger.Log("<-");
            By createArtifactButton = By.CssSelector(".cz-form-create-artifact.cz-button");
            WaitForElementEnabled(createArtifactButton);
            Click(createArtifactButton);
            Logger.Log("->");
        }

        protected void SaveArtifact()
        {
            Logger.Log("<-");
            By saveArtifactButton =
                By.CssSelector("#auth-edit-contentitem-form .cz-form-save.cz-button");
            WaitForElementEnabled(saveArtifactButton);
            Click(saveArtifactButton);
            Logger.Log("->");
        }
    }
}