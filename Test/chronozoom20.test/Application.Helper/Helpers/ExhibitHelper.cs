using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class ExhibitHelper : DependentActions
    {
        public void AddExhibit(string name)
        {
            Logger.Log("<- name: " + name);
            InitExhibitCreationMode();
            SetExhibitPoint();
            SetExhibitTitle(name);
            SaveAndClose();
            Logger.Log("->");
        }


        public string GetLastElementName()
        {
            Logger.Log("<-");
            string name =
                GetJavaScriptExecutionResult(
                    "vc.data('ui-virtualCanvas')._layersContent.children[0].children[vc.data('ui-virtualCanvas')._layersContent.children[0].children.length - 1].title");
            Logger.Log("-> name: " + name);
            return name;
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