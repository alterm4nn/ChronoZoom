using System;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class TimeSeriesHelper : DependentActions
    {
        public void UploadFile(string path, string delimeters)
        {
            Logger.Log("<- filePath: " + path);
            InitUploadFileForm();
            SetFilePath(path);
            SelectDelimiters(delimeters);
            ClickLoad();
            Logger.Log("->");
        }

        public string UploadPreloadedFile()
        {
            Logger.Log("<-");
            InitUploadFileForm();
            int countPreloadedFiles = GetItemsCount(By.XPath("//*[@id='existingTimeSeries']/*"));
            int preloadedFileNumber = new Random().Next(1, countPreloadedFiles);
            ClickPreloadedFile(preloadedFileNumber);
            string preloadedFileName =
                GetText(
                    By.XPath(String.Format(
                        "//*[@id='existingTimeSeries']/li[{0}]//a[@class='cz-form-preloadedrecord']",
                        preloadedFileNumber)));
            Logger.Log("-> file name: " + preloadedFileName);
            return preloadedFileName;
        }

        public string GetTimeSeriesChartHeader()
        {
            Logger.Log("<-");
            string text = GetText(By.Id("timeSeriesChartHeader"));
            Logger.Log("-> text: " + text);
            return text;
        }


        public void CloseChart()
        {
            Logger.Log("<-");
            Click(By.Id("closeTimeChartBtn"));
            Logger.Log("->");
        }


        public void CloseUploadFileForm()
        {
            Logger.Log("<-");
            Click(By.XPath("//*[@id='timeSeriesDataForm']//li[@class='cz-form-close-btn']"));
            Logger.Log("->");
        }

        private void ClickLoad()
        {
            Logger.Log("<-");
            Click(By.Id("loadDataBtn"));
            Logger.Log("->");
        }

        private void SelectDelimiters(string delimeters)
        {
            SelectByText(By.Id("delim"), delimeters);
        }

        private void SetFilePath(string path)
        {
            Logger.Log("<- path: " + path);
            SetFilePath(By.Id("fileLoader"), path);
            Logger.Log("->");
        }

        private void InitUploadFileForm()
        {
            Logger.Log("<-");
            ClickOnTimeseriesButton();
            Logger.Log("->");
        }

        private void ClickPreloadedFile(int preloadedFileNumber)
        {
            string xpath = String.Format("//*[@id='existingTimeSeries']/li[{0}]/a[@class='cz-form-btn']",
                                         preloadedFileNumber);
            Click(By.XPath(xpath));
        }

    }
}