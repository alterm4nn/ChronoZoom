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
            ClickByBingSearch();
            SelectImageFilter();
            TypeSearchQwery("test");
            ClickSearchButton();
            WaitWhileResultsIsRender();
            int imagesCount = GetResultsCount();
            int randomImageIndex = Random.Next(1, imagesCount);
            ClickByImage(randomImageIndex);
            imageUrl = GetImageUrlByIndex(randomImageIndex);
            imageSource = GetMediaSourceByIndex(randomImageIndex);
        }

        private string GetMediaSourceByIndex(int index)
        {
            Logger.Log("<-");
            string url = FindElement(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[2]/div[" + index + "]/a")).GetAttribute("title");
            Logger.Log("-> imageUrl: " + url);
            return url;
        }

        private string GetImageUrlByIndex(int index)
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

        private void ClickByImage(int randomImageIndex)
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[2]/div[" + randomImageIndex + "]/div[1]/img"));
            Logger.Log("->");
        }

        private void ClickByBingSearch()
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
            TypeText(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[1]/div[1]/input"), text);
        }

        private void ClickSearchButton()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='content']/div[21]/div[2]/div/div[1]/div[1]/button"));
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