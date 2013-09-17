using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Text;
using Application.Driver;
using Application.Helper.Constants;
using Application.Helper.Entities;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class ExhibitHelper : BaseExhibitHelper
    {
        const string LastCanvasElement = Javascripts.LastCanvasElement;

        private readonly string _getYmdFromCoordinateScript =
            String.Format("CZ.Dates.getYMDFromCoordinate({0}.infodotDescription.date)", LastCanvasElement);

        public void AddExhibitWithContentItem(Exhibit exhibit)
        {
            Logger.Log("<- " + exhibit);
            InitExhibitCreationMode();
            SetExhibitPoint();
            SetExhibitTitle(exhibit.Title);
            if (exhibit.Year != 0)
            {
                SetExhibitDate(exhibit);
            }
            AddArtifacts(exhibit.ContentItems);
            SaveAndClose();
            Logger.Log("->");
        }

        public void AddExhibitWithSkyDriveContentItem(Exhibit exhibit)
        {
            Logger.Log("<- " + exhibit);
            InitExhibitCreationMode();
            SetExhibitPoint();
            SetExhibitTitle(exhibit.Title);
            HelperManager<ExhibitSkyDriveHelper>.Instance.AddSkyDriveArtifacts(exhibit.ContentItems);
            SaveAndClose();
            Logger.Log("->");
        }

        public Exhibit GetNewExhibit()
        {
            Logger.Log("<-");
            var exhibit = new Exhibit
                {
                    ContentItems = new Collection<Chronozoom.Entities.ContentItem>(),
                    Title = GetJavaScriptExecutionResult(LastCanvasElement + ".title"),
                    Year = GetNewExhibitYear(),
                    Month = GetNewExhibitMonth(),
                    Day = GetNewExhibitday()
                };
            int contentItemsCount = int.Parse(GetJavaScriptExecutionResult(LastCanvasElement + ".contentItems.length"));
            Logger.Log("- contentItemsCount: " + contentItemsCount, LogType.MessageWithoutScreenshot);
            for (int i = 0; i < contentItemsCount; i++)
            {
                var contentItem = new ContentItem();
                string item = string.Format("{0}.contentItems[{1}].", LastCanvasElement, i);
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
            WaitCondition(() => (GetJavaScriptExecutionResult(LastCanvasElement + ".guid") != string.Empty), 15);
            exhibit.Id = new Guid(GetJavaScriptExecutionResult(LastCanvasElement + ".guid"));
            Logger.Log("- exhibit.Id: " + exhibit.Id, LogType.MessageWithoutScreenshot);
            Logger.Log("->" + exhibit);
            return exhibit;
        }


        public string GetNewExhibitDisplayDate()
        {
            return
                GetJavaScriptExecutionResult(
                    String.Format("{0}.children[0].content.children[{0}.children[0].content.children.length-2].text[1]", LastCanvasElement));

        }

        private string GetNewExhibitday()
        {
            Logger.Log("->", LogType.MessageWithoutScreenshot);
            return GetJavaScriptExecutionResult(_getYmdFromCoordinateScript + ".day");
        }

        private string GetNewExhibitMonth()
        {
            Logger.Log("->", LogType.MessageWithoutScreenshot);
            int monthNumber = int.Parse(
                        GetJavaScriptExecutionResult(_getYmdFromCoordinateScript + ".month")) + 1;
            Logger.Log("- month number" + monthNumber, LogType.MessageWithoutScreenshot);
            return monthNumber == 0 ? "" : CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(monthNumber);
        }

        private decimal GetNewExhibitYear()
        {
            Logger.Log("->", LogType.MessageWithoutScreenshot);
            return Decimal.Parse(GetJavaScriptExecutionResult(_getYmdFromCoordinateScript + ".year"));
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
            string description = GetText(By.CssSelector("#vc>.contentItemDescription>div"));
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
            string description = GetFirstContentItemDescription();
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
            var bibliography = new Bibliography {Sources = new List<Source>()};
            var bibliographySource = new Source();
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
            Logger.Log("<-");
            By createArtifactButton = By.CssSelector(".cz-form-create-artifact.cz-button");
            WaitForElementEnabled(createArtifactButton);
            Click(createArtifactButton);
            Logger.Log("->");
        }

        public string GetCurrentImageOrVideoUrl()
        {
            Logger.Log("<-");
            string imageUrl = GetElementValue(By.CssSelector(SetAuthContentItemFormElementLocator("input.cz-form-item-mediaurl")));
            Logger.Log("-> imageUrl: " + imageUrl);
            return imageUrl;
        }

        public string GetCurrentMediaSource()
        {
            Logger.Log("<-");
            string mediaSource = GetElementValue(By.CssSelector(SetAuthContentItemFormElementLocator("input.cz-form-item-mediasource")));
            Logger.Log("-> mediaSource: " + mediaSource);
            return mediaSource;
        }

        public string GetCurrentAttribution()
        {
            Logger.Log("<-");
            string mediaSource = GetElementValue(By.CssSelector(SetAuthContentItemFormElementLocator("input.cz-form-item-attribution")));
            Logger.Log("-> attribution: " + mediaSource);
            return mediaSource;
        }

        public string GetCurrentMediaType()
        {
            Logger.Log("<-");
            string mediaSource = GetElementValue(By.CssSelector(SetAuthContentItemFormElementLocator("select.cz-form-item-media-type.cz-input")));
            Logger.Log("-> attribution: " + mediaSource);
            return mediaSource;
        }

        public string GetExhibitDisplayDate(Exhibit exhibit)
        {
            Logger.Log("<-");
            string scriptGetExhibit = String.Format("CZ.Common.vc.virtualCanvas('findElement', 'e{0}__title').text", exhibit.Id);
            int countExhibitTitleItems = int.Parse(GetJavaScriptExecutionResult(scriptGetExhibit + ".length"));
            var date = new StringBuilder();
            for (int index = 1; index < countExhibitTitleItems; index++)
            {
                date.Append(GetJavaScriptExecutionResult(String.Format("{0}[{1}]", scriptGetExhibit, index))).Append(" ");
            }
            Logger.Log("-> date: " + date);
            return date.ToString();
        }

        public decimal GetCoordinateFromYmd(decimal year, int month, int day)
        {
            string monthStr = (month - 1).ToString(CultureInfo.InvariantCulture);
            return Decimal.Parse(GetJavaScriptExecutionResult(String.Format("CZ.Dates.getCoordinateFromYMD({0},{1},{2})", year, monthStr, day)));
        }
        
        private void ConfirmDeletion()
        {
            AcceptAlert();
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
        }

        private void ClickDeleteButton()
        {
            Click(By.CssSelector("#auth-edit-exhibit-form .cz-form-delete.cz-button"));
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
            By saveButton = By.CssSelector("#auth-edit-exhibit-form .cz-form-save.cz-button");
            WaitForElementEnabled(saveButton);
            Click(saveButton);
            Logger.Log("->");
        }

        private void SetExhibitTitle(string exhibitName)
        {
            Logger.Log("<- name: " + exhibitName);
            TypeText(By.CssSelector("#auth-edit-exhibit-form .cz-form-item-title"), exhibitName);
            Logger.Log("->");
        }


        private void SetExhibitDate(Exhibit exhibit)
        {
            Logger.Log("<- name: " + exhibit.Title);
            SetTimeMode(exhibit.TimeMode);
            SetMonth(exhibit.Month);
            SetDay(exhibit.Day);
            SetYear(exhibit.Year.ToString(CultureInfo.InvariantCulture));
            Logger.Log("->");
        }

        private void SetTimeMode(string timeMode)
        {
            Logger.Log("<- time mode: " + timeMode);
            SelectByText(By.CssSelector(".cz-datepicker-mode.cz-input"), timeMode);
            Logger.Log("->");
        }

        private void SetMonth(string month)
        {
            Logger.Log("<- month: " + month);
            SelectByText(By.CssSelector(".cz-datepicker-month-selector.cz-input"), month);
            Logger.Log("->");
        }

        private void SetDay(string day)
        {
            Logger.Log("<- day: " + day);
            SelectByText(By.CssSelector(".cz-datepicker-day-selector.cz-input"), day);
            Logger.Log("->");
        }

        private void SetYear(string year)
        {
            Logger.Log("<- year: " + year);
            TypeText(By.CssSelector(".cz-datepicker-year-date.cz-input"), year);
            Logger.Log("->");
        }

        private void InitExhibitCreationMode()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.CssSelector("[title='Create Your Events']"));
            MoveToElementAndClick(By.CssSelector(".cz-form-create-exhibit.cz-button"));
            Logger.Log("->");
        }

        private void SetExhibitPoint()
        {
            Logger.Log("<-");
            MoveToElementAndClick(By.ClassName("virtualCanvasLayerCanvas"));
            Logger.Log("->");
        }

        private void FillArtifact(Chronozoom.Entities.ContentItem contentItem)
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
            Logger.Log("-> mediaSource: " + mediaSource);
            TypeText(By.CssSelector(SetAuthContentItemFormElementLocator(".cz-form-item-mediasource")), mediaSource);
            Logger.Log("<-");
        }

        private void SetAttribution(string attribution)
        {
            Logger.Log("-> attribution: " + attribution);
            TypeText(By.CssSelector(SetAuthContentItemFormElementLocator(".cz-form-item-attribution")), attribution);
            Logger.Log("<-");
        }

        private void SelectMediaType(string mediaType)
        {
            Logger.Log("-> mediaType: " + mediaType);
            SelectByText(By.CssSelector(SetAuthContentItemFormElementLocator(".cz-form-item-media-type")), mediaType);
            Logger.Log("<-");
        }

        private void SetUrl(string url)
        {
            Logger.Log("-> url: " + url);
            TypeText(By.CssSelector(SetAuthContentItemFormElementLocator(".cz-form-item-mediaurl")), url);
            Logger.Log("<-");
        }

        private void AddArtifacts(IEnumerable<Chronozoom.Entities.ContentItem> contentItems)
        {
            Logger.Log("->");
            foreach (Chronozoom.Entities.ContentItem contentItem in contentItems)
            {
                Logger.Log("-- " + contentItem);
                InitArtifactForm();
                FillArtifact(contentItem);
                SaveArtifact();
            }
            Logger.Log("<-");
        }

        private string SetAuthContentItemFormElementLocator(string element)
        {
            return String.Format("#auth-edit-contentitem-form>div.cz-form-content>{0}.cz-input", element);
        }

    }
}