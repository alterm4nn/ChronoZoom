using System;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.Entities;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class TimelineHelper : DependentActions
    {
        public void AddTimeline(Timeline timeline)
        {
            Logger.Log("<- timeline: " + timeline);
            InitTimelineCreationMode();
            DrawTimeline();
            SetTimelineName(timeline.Title);
            SaveAndClose();
            Logger.Log("->");
        }

        public Timeline GetLastTimeline()
        {
            Logger.Log("<-");
            var timeline = new Timeline();
            const string script = Javascripts.LastCanvasElement;
            timeline.Title = GetJavaScriptExecutionResult(script + ".title");
            timeline.TimelineId = GetJavaScriptExecutionResult(script + ".id");
            Logger.Log("-> " + timeline);
            return timeline;
        }

        public void DeleteTimeline(Timeline timeline)
        {
            Logger.Log("<- timeline: " + timeline);
            NavigateToTimeLine(timeline);
            InitTimelineEditMode();
            InitEditForm();
            ClickDelete();
            ConfirmDeletion();
            Logger.Log("->");
        }


        public void DeleteTimelineByJavaScript(Timeline timeline)
        {
            Logger.Log("<-");
            ExecuteJavaScript(string.Format("CZ.Service.deleteTimeline({0})", Javascripts.LastCanvasElement));
            Logger.Log("->");
        }

        public bool IsTimelineFound(Timeline newTimeline)
        {
            Logger.Log("<- timeline: " + newTimeline);
            try
            {
                ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('{0}')", newTimeline.TimelineId));
                Logger.Log("-> true");
                return true;
            }
            catch (UnhandledAlertException e)
            {

                AcceptAlert();
                Logger.Log("-> false");
                return false;
            }
        }

        private void ConfirmDeletion()
        {
            AcceptAlert();
        }

        private void ClickDelete()
        {
            Click(By.XPath("//*[text()='delete']"));
        }

        private void InitEditForm()
        {
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
        }

        private void InitTimelineEditMode()
        {
            MoveToElementAndClick(By.XPath("//*[@id='footer-authoring']/a[2]"));
        }

        private void NavigateToTimeLine(Timeline timeline)
        {
            Logger.Log("<-");
            ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('{0}')", timeline.TimelineId));
            Logger.Log("->");
        }

        private void SaveAndClose()
        {
            Click(By.ClassName("ui-dialog-buttonset"));
        }

        private void SetTimelineName(string timelineName)
        {
            Logger.Log("<- timeline: " + timelineName);
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
            MoveToElementAndClick(By.XPath("//*[@id='footer-authoring']/a[1]"));
            Logger.Log("->");
        }

    }
}