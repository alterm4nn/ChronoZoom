using Application.Driver;
using Application.Helper.Entities;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class ExhibitHelper : DependentActions
    {
        public void AddExhibit(Exhibit exhibit)
        {
            Logger.Log("<- " + exhibit);
            InitExhibitCreationMode();
            SetExhibitPoint();
            SetExhibitTitle(exhibit.Title);
            SaveAndClose();
            Logger.Log("->");
        }

        private void SaveAndClose()
        {
            Click(By.XPath("//*[@class='ui-dialog-buttonset']/*[1]"));
        }

        private void SetExhibitTitle(string timelineName)
        {
            Logger.Log("<- name: " + timelineName);
            TypeText(By.Id("exhibitTitleInput"), timelineName);
            Logger.Log("->");
        }

        private void InitExhibitCreationMode()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.XPath("//*[@id='footer-authoring']/a[3]"));
            Logger.Log("->");
        }


        private void SetExhibitPoint()
        {
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
        }
    }
}