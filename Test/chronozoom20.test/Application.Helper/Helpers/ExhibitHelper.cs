using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Application.Driver;
using Application.Helper.Constants;
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

        public void AddExhibitWithContentItem(Exhibit exhibit)
        {
            Logger.Log("<- " + exhibit);
            InitExhibitCreationMode();
            SetExhibitPoint();
            SetExhibitTitle(exhibit.Title);
            AddArtifacts(exhibit.ContentItems);
            SaveAndClose();
            Logger.Log("->");
        }

        public Exhibit GetNewExhibit()
        {
            Logger.Log("<-");
            const string script = Javascripts.LastCanvasElement;
            var exhibit = new Exhibit
                {
                    ContentItems = new Collection<Chronozoom.Entities.ContentItem>(),
                    Title = GetJavaScriptExecutionResult(script + ".title")
                };
            int contentItemsCount = int.Parse(GetJavaScriptExecutionResult(script + ".contentItems.length"));
            Logger.Log("- contentItemsCount: " + contentItemsCount, LogType.MessageWithoutScreenshot);
            for (int i = 0; i < contentItemsCount; i++)
            {
                var contentItem = new ContentItem();
                string item = string.Format("{0}.contentItems[{1}].", script, i);
                contentItem.Title = GetJavaScriptExecutionResult(item + "title");
                Logger.Log("- contentItem.Title: " + contentItem.Title, LogType.MessageWithoutScreenshot);
                contentItem.Caption = GetJavaScriptExecutionResult(item + "description");
                Logger.Log("- contentItem.Caption: " + contentItem.Caption, LogType.MessageWithoutScreenshot);
                contentItem.Uri = GetJavaScriptExecutionResult(item + "uri");
                Logger.Log("- contentItem.Uri: " + contentItem.Uri, LogType.MessageWithoutScreenshot);
                contentItem.MediaType = GetJavaScriptExecutionResult(item + "mediaType");
                Logger.Log("- contentItem.MediaType: " + contentItem.MediaType, LogType.MessageWithoutScreenshot);
                contentItem.MediaSource = GetJavaScriptExecutionResult(item + "mediaSource");
                Logger.Log("- contentItem.MediaSource: " + contentItem.MediaSource, LogType.MessageWithoutScreenshot);
                contentItem.Attribution = GetJavaScriptExecutionResult(item + "attribution");
                Logger.Log("- contentItem.Attribution: " + contentItem.Attribution, LogType.MessageWithoutScreenshot);
                exhibit.ContentItems.Add(contentItem);
            }
            exhibit.Id = new Guid(GetJavaScriptExecutionResult(script + ".guid"));
            Logger.Log("- exhibit.Id: " + exhibit.Id, LogType.MessageWithoutScreenshot);
            Logger.Log("->" + exhibit);
            return exhibit;
        }

        public void DeleteExhibitByJavascript(Exhibit exhibit)
        {
            int childrenCount = int.Parse(GetJavaScriptExecutionResult(Javascripts.CosmosChildrenCount));
            for (int i = 0; i < childrenCount; i++)
            {
                string title =
                    GetJavaScriptExecutionResult(
                        string.Format("{0}.children[{1}].title", Javascripts.Cosmos, i));
                if (title == exhibit.Title)
                {
                    ExecuteJavaScript(string.Format("CZ.Service.deleteExhibit({0}.children[{1}])", Javascripts.Cosmos, i));
                }
            }
        }

        public string GetFirstContentItemDescription()
        {
            Logger.Log("<-");
            string description = GetText(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
            Logger.Log("-> description: " + description);
            return description;
        }

        public void DeleteExhibit(Exhibit exhibit)
        {
            Logger.Log("<- title: " + exhibit.Title);
            NavigateToExhibit(exhibit);
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
            InitEditExhibitForm();
            ClickDeleteButton();
            ConfirmDeletion();
            Logger.Log("->");
        }

        public bool IsExhibitFound(Exhibit exhibit)
        {
            Logger.Log("<- exhibit: " + exhibit);
            try
            {
                ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('e{0}', 'timeline')", exhibit.Id));
                Logger.Log("-> true");
                return true;
            }
            catch (Exception)
            {
                Logger.Log("-> false");
                return false;
            }
        }

        public string GetEukaryoticCellsDescription()
        {
            Logger.Log("<-");
            HelperManager<NavigationHelper>.Instance.OpenExhibitEukaryoticCells();
            Logger.Log("ExhibitEukaryotic Cell is opened");
            string description = GetFirstContentItemDescription();
            Logger.Log("-> description: " + description);
            return description;
        }

        public string GetExpectedYouTubeUri(string uri)
        {
            Logger.Log("<- uri: " + uri, LogType.MessageWithoutScreenshot);
            string expectedUri = "http://www.youtube.com/embed/" + (uri.Split('=')[1]);
            Logger.Log("-> expected uri: " + expectedUri, LogType.MessageWithoutScreenshot);
            return expectedUri;
        }

        public void NavigateToExhibit(Exhibit exhibit)
        {
            Logger.Log("<- title: " + exhibit.Title);
            ExecuteJavaScript(string.Format("CZ.Search.goToSearchResult('e{0}')", exhibit.Id));
            WaitAnimation();
            Logger.Log("->");
        }

        public string GetTakeOurSurveyArtifactContentItemDescription()
        {
            Logger.Log("<-");
            string description = GetText(By.XPath("//*[@id='vc']/*[@class='contentItemDescription']/div"));
            Logger.Log("-> description: " + description);
            return description;
        }

        public void OpenBibliography()
        {
            Logger.Log("<-");
            HelperManager<ImageHelper>.Instance.ClickOnBibliographyImage();
            Logger.Log("->");
        }

        public bool IsBibliographyOpened()
        {
            return IsElementDisplayed(By.Id("bibliography"));
        }

        public Bibliography GetBibliography()
        {
            Logger.Log("<-");
            OpenBibliography();
            Bibliography bibliography = new Bibliography();
            bibliography.Sources = new List<Source>();
            Source bibliographySource = new Source();
            ReadOnlyCollection<IWebElement> sources = FindElements(By.ClassName("source"));
            foreach (IWebElement source in sources)
            {
                bibliographySource.Name = source.FindElement(By.ClassName("sourceName")).Text;
                bibliographySource.Description = source.FindElement(By.ClassName("sourceDescr")).Text;
                bibliography.Sources.Add(bibliographySource);
            }
            Logger.Log("->");
            return bibliography;
        }

        public void CloseBibliography()
        {
            Logger.Log("<-");
            Click(By.Id("biblCloseButton"));
            Logger.Log("->");
        }

        public void AddExhibitWithoutFormClosing(Exhibit exhibit)
        {
            Logger.Log("<- " + exhibit);
            InitExhibitCreationMode();
            SetExhibitPoint();
            SetExhibitTitle(exhibit.Title);
            Logger.Log("->");
        }

        public void ClickByAddArtifact()
        {
            Logger.Log("->");
            By createArtifactButton = By.XPath("//*[@class='cz-form-create-artifact cz-button']");
            WaitForElementEnabled(createArtifactButton);
            Click(createArtifactButton);
            Logger.Log("<-");
        }

        public string GetCurrentImageOrVideoUrl()
        {
            Logger.Log("->");
            string imageUrl = FindElement(By.XPath("//*[@id='auth-edit-contentitem-form']/div[@class='cz-form-content']/input[@class='cz-form-item-mediaurl cz-input']")).GetAttribute("value");
            Logger.Log("<- imageUrl: " + imageUrl);
            return imageUrl;
        }

        public string GetCurrentMediaSource()
        {
            Logger.Log("->");
            string mediaSource = FindElement(By.XPath("//*[@id='auth-edit-contentitem-form']/div[@class='cz-form-content']/input[@class='cz-form-item-mediasource cz-input']")).GetAttribute("value");
            Logger.Log("<- mediaSource: " + mediaSource);
            return mediaSource;
        }

        public string GetCurrentAttribution()
        {
            Logger.Log("->");
            string mediaSource = FindElement(By.XPath("//*[@id='auth-edit-contentitem-form']/div[@class='cz-form-content']/input[@class='cz-form-item-attribution cz-input']")).GetAttribute("value");
            Logger.Log("<- attribution: " + mediaSource);
            return mediaSource;
        }

        public string GetCurrentMediaType()
        {
            Logger.Log("->");
            string mediaSource = FindElement(By.XPath("//*[@id='auth-edit-contentitem-form']/div[@class='cz-form-content']/select[@class='cz-form-item-media-type cz-input']")).GetAttribute("value");
            Logger.Log("<- attribution: " + mediaSource);
            return mediaSource;
        }

        private void ConfirmDeletion()
        {
            AcceptAlert();
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
        }

        private void ClickDeleteButton()
        {
            Click(By.XPath("//*[@id='auth-edit-exhibit-form']//*[@class='cz-form-delete cz-button']"));
        }

        private void InitEditExhibitForm()
        {
            Logger.Log("<-");
            ExecuteJavaScript("CZ.Authoring.isActive = true");
            ExecuteJavaScript("CZ.Authoring.mode = 'editExhibit'");
            ExecuteJavaScript("CZ.Authoring.selectedExhibit = " + Javascripts.LastCanvasElement);
            ExecuteJavaScript("CZ.Authoring.showEditExhibitForm(CZ.Authoring.selectedExhibit)");
            Logger.Log("->");
        }

        private void SaveAndClose()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='auth-edit-exhibit-form']//*[@class='cz-form-save cz-button']"));
            Logger.Log("->");
        }

        private void SetExhibitTitle(string exhibitName)
        {
            Logger.Log("<- name: " + exhibitName);
            TypeText(By.XPath("//*[@id='auth-edit-exhibit-form']//*[@class='cz-form-item-title cz-input']"), exhibitName);
            Logger.Log("->");
        }

        private void InitExhibitCreationMode()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.XPath("//*[@title='Create Your Events']"));
            MoveToElementAndClick(By.XPath("//button[text()='create exhibit']"));
            Logger.Log("->");
        }

        private void SetExhibitPoint()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
            Logger.Log("->");
        }

        private void FillArtifact(ContentItem contentItem)
        {
            Logger.Log("<- contentItem: " + contentItem);
            if (contentItem.Title != null) SetTitle(contentItem.Title);
            if (contentItem.Caption != null) SetDescription(contentItem.Caption);
            if (contentItem.Uri != null) SetUrl(contentItem.Uri);
            if (contentItem.MediaType != null) SelectMediaType(contentItem.MediaType);
            if (contentItem.Attribution != null) SetAttribution(contentItem.Attribution);
            if (contentItem.MediaSource != null) SetMediaSourse(contentItem.MediaSource);
            Logger.Log("->");
        }

        private void SetMediaSourse(string mediaSource)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-mediasource cz-input']"), mediaSource);
        }

        private void SetAttribution(string attribution)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-attribution cz-input']"), attribution);
        }

        private void SelectMediaType(string mediaType)
        {
            SelectByText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-media-type cz-input']"), mediaType);
        }

        private void SetUrl(string mediaSourse)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-mediaurl cz-input']"), mediaSourse);
        }

        private void SetDescription(string description)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-descr cz-input']"), description);
        }

        private void SetTitle(string title)
        {
            TypeText(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-item-title cz-input']"), title);
        }


        private void AddArtifacts(IEnumerable<Chronozoom.Entities.ContentItem> contentItems)
        {
            Logger.Log("->");
            foreach (ContentItem contentItem in contentItems)
            {
                Logger.Log("-- " + contentItem);
                By createArtifactButton = By.XPath("//*[@class='cz-form-create-artifact cz-button']");
                WaitForElementEnabled(createArtifactButton);
                Click(createArtifactButton);
                FillArtifact(contentItem);
                Click(By.XPath("//*[@id='auth-edit-contentitem-form']//*[@class='cz-form-save cz-button']"));
            }
            Logger.Log("<-");
        }



    }
}