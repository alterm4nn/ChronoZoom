using System;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class ArtifactSearchHelper : DependentActions
    {
        public Random Random { get; set; }

        public ArtifactSearchHelper()
        {
            Random = new Random();
        }

        public void FindAndSelectRandomImage(out string imageUrl, out string imageSource)
        {
            Logger.Log("<-");
            SelectBingSearch();
            SelectImageFilter();
            TypeSearchQwery("test");
            ClickSearchButton();
            WaitWhileResultsIsRender();
            int resultsCount = GetResultsCount();
            int randomImageIndex = Random.Next(1, resultsCount);
            imageSource = GetMediaSourceByIndex(randomImageIndex);
            imageUrl = GetResultUrlByIndex(randomImageIndex);
            ClickByResult(randomImageIndex);
            Logger.Log("->");
        }

        public void FindAndSelectRandomVideo(out string videoUrlFromSearchResult)
        {
            Logger.Log("<-");
            SelectBingSearch();
            SelectVideoFilter();
            TypeSearchQwery("test");
            ClickSearchButton();
            WaitWhileResultsIsRender();
            int resultsCount = GetResultsCount();
            int randomVideoIndex = Random.Next(1, resultsCount);
            videoUrlFromSearchResult = GetResultUrlByIndex(randomVideoIndex);
            ClickByResult(randomVideoIndex);
            Logger.Log("->");
        }

        public void FindAndSelectRandomPdf(out string pdfUrlFromSearchResult)
        {
            Logger.Log("<-");
            SelectBingSearch();
            SelectPdfFilter();
            TypeSearchQwery("test");
            ClickSearchButton();
            WaitWhileResultsIsRender();
            int resultsCount = GetResultsCount();
            int randomPdfIndex = Random.Next(1, resultsCount);
            pdfUrlFromSearchResult = GetResultUrlByIndex(randomPdfIndex);
            ClickByResult(randomPdfIndex);
            Logger.Log("->");
        }

        private string GetMediaSourceByIndex(int index)
        {
            Logger.Log("<-");
            string url = FindElement(By.XPath("//*[@id='bing-search-results']/div["+ index +"]/a")).GetAttribute("media-source");
            Logger.Log("-> imageUrl: " + url);
            return url;
        }

        private string GetResultUrlByIndex(int index)
        {
            Logger.Log("<-");
            string url = FindElement(By.XPath("//*[@id='bing-search-results']/div[" + index + "]/a")).GetAttribute("href");
            Logger.Log("-> imageUrl: " + url);
            return url;
        }

        private int GetResultsCount()
        {
            Logger.Log("<-");
            int count = FindElements(By.XPath("//div[@class='cz-bing-result-container']")).Count;
            Logger.Log("-> count: " + count);
            return count;
        }

        private void ClickByResult(int randomResultIndex)
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='bing-search-results']/div[" + randomResultIndex + "]/div[@class='cz-bing-result-title cz-darkgray']"));
            Logger.Log("->");
        }

        private void SelectBingSearch()
        {
            Logger.Log("<-");
            Click(By.XPath("//*/div[@class='cz-form-medialist cz-medialist']/div[@title='bing']"));
            Logger.Log("->");
        }

        private void SelectImageFilter()
        {
            Logger.Log("<-");
            Click(By.Id("bing-media-type-image"));
            Logger.Log("->");
        }

        private void SelectVideoFilter()
        {
            Logger.Log("<-");
            Click(By.Id("bing-media-type-video"));
            Logger.Log("->");
        }

        private void SelectPdfFilter()
        {
            Logger.Log("<-");
            Click(By.Id("bing-media-type-document"));
            Logger.Log("->");
        }

        private void TypeSearchQwery(string text)
        {
            Logger.Log("<-");
            TypeText(By.Id("bing-search-input"), text);
            Logger.Log("->");
        }

        private void ClickSearchButton()
        {
            Logger.Log("<-");
            Click(By.Id("bing-search-button"));
            Logger.Log("->");
        }

        private void WaitWhileResultsIsRender()
        {
            Logger.Log("<-");
            WaitForElementIsNotDisplayed(By.Id("bing-search-progress-bar"));
            Logger.Log("->");
        }

    }
}