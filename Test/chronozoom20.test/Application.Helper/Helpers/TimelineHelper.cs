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
            CreateTimeline();
            WaitAjaxComplete(60);
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
            WaitAnimation();
            InitEditForm();
            ClickDelete();
            ConfirmDeletion();
            Logger.Log("->");
        }

        public void DeleteTimelineByJavaScript(Timeline timeline)
        {
            Logger.Log("<-");
            ExecuteJavaScript(string.Format("CZ.Authoring.removeTimeline({0})", Javascripts.LastCanvasElement));
            Logger.Log("->");
        }

        public bool IsTimelineFound(Timeline newTimeline)
        {
            Logger.Log("<- timeline: " + newTimeline);
            try
            {
                ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('{0}', 'timeline')", newTimeline.TimelineId));
                Logger.Log("-> true");
                return true;
            }
            catch (Exception)
            {
                //AcceptAlert();
                Logger.Log("-> false");
                return false;
            }
        }

        private void ConfirmDeletion()
        {
            AcceptAlert();
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
        }

        private void ClickDelete()
        {
            Click(By.XPath("//*[@id='auth-edit-timeline-form']//*[@class='cz-form-delete cz-button']"));
        }

        private void InitEditForm()
        {
            ExecuteJavaScript("CZ.Authoring.isActive = true");
            ExecuteJavaScript("CZ.Authoring.mode = 'editTimeline'");
            ExecuteJavaScript("CZ.Authoring.showEditTimelineForm(CZ.Authoring.selectedTimeline)");
        }

        private void NavigateToTimeLine(Timeline timeline)
        {
            Logger.Log("<-");
            ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('{0}')", timeline.TimelineId));
            Logger.Log("->");
        }

        private void CreateTimeline()
        {
            Click(By.XPath("//*[@id='auth-edit-timeline-form']//*[@class='cz-form-save cz-button']"));
        }

        private void SetTimelineName(string timelineName)
        {
            Logger.Log("<- timeline: " + timelineName);
            TypeText(By.XPath("//*[@id='auth-edit-timeline-form']//*[@class='cz-form-item-title cz-input']"), timelineName);
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
            MoveToElementAndClick(By.XPath("//*[@title='Create your events']"));
            MoveToElementAndClick(By.XPath("//button[text()='create timeline']"));
            Logger.Log("->");
        }

    }
}