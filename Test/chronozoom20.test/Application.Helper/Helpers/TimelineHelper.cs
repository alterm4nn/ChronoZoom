using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class TimelineHelper : DependentActions
    {
        public void AddTimeline(string name)
        {
            Logger.Log("<- name: " + name);
            InitTimelineCreationMode();
            DrawTimeline();
            SetTimelineName(name);
            SaveAndClose();
            Logger.Log("->");
        }

        public string GetLastTimelinename()
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
            Click(By.ClassName("ui-dialog-buttonset"));
        }

        private void SetTimelineName(string timelineName)
        {
            Logger.Log("<- name: " + timelineName);
            TypeText(By.Id("timelineTitleInput"), timelineName);
            Logger.Log("->");
        }

        private void DrawTimeline()
        {
            Logger.Log("<-");
            MoveToElementAndDrugAndDrop(By.ClassName("virtualCanvasLayerCanvas"), 50, 50);
            Logger.Log("->");
        }

        private void InitTimelineCreationMode()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='footer-authoring']/a[1]"));
            Logger.Log("->");
        }
    }
}