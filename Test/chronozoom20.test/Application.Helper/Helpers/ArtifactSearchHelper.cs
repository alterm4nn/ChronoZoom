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
        }

        public void FindAndSelectRandomVideo(out string videoUrlFromSearchResult)
        {
            SelectBingSearch();
            SelectVideoFilter();
            TypeSearchQwery("test");
            ClickSearchButton();
            WaitWhileResultsIsRender();
            int resultsCount = GetResultsCount();
            int randomVideoIndex = Random.Next(1, resultsCount);
            videoUrlFromSearchResult = GetResultUrlByIndex(randomVideoIndex);
            ClickByResult(randomVideoIndex);
        }

        public void FindAndSelectRandomPdf(out string pdfUrlFromSearchResult)
        {
            SelectBingSearch();
            SelectPdfFilter();
            TypeSearchQwery("test");
            ClickSearchButton();
            WaitWhileResultsIsRender();
            int resultsCount = GetResultsCount();
            int randomPdfIndex = Random.Next(1, resultsCount);
            pdfUrlFromSearchResult = GetResultUrlByIndex(randomPdfIndex);
            ClickByResult(randomPdfIndex);
        }

        private string GetMediaSourceByIndex(int index)
        {
            Logger.Log("<-");
            string url = FindElement(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[2]/div[" + index + "]/a")).GetAttribute("media-source");
            Logger.Log("-> imageUrl: " + url);
            return url;
        }

        private string GetResultUrlByIndex(int index)
        {
            Logger.Log("<-");
            string url = FindElement(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[2]/div[" + index + "]/a")).GetAttribute("href");
            Logger.Log("-> imageUrl: " + url);
            return url;
        }

        private int GetResultsCount()
        {
            Logger.Log("<-");
            int count = FindElements(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[2]/div[*]")).Count;
            Logger.Log("-> count: " + count);
            return count;
        }

        private void ClickByResult(int randomResultIndex)
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[2]/div[" + randomResultIndex + "]/div[1]"));
            Logger.Log("->");
        }

        private void SelectBingSearch()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='auth-edit-contentitem-form']/div[3]/div[1]/div/img"));
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
            TypeText(By.Id("bing-search-input"), text);
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
            WaitForElementIsNotDisplayed(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[1]/img"));
            Logger.Log("->");
        }

    }
}