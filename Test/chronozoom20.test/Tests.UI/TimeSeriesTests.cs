using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
    [TestClass]
    public class TimeSeriesTests : TestBase
    {

        internal string Path = Directory.GetCurrentDirectory() + "\\";

        #region Initialize and Cleanup

        [ClassInitialize]
        public static void ClassInitialize(TestContext testContext)
        {
            BrowserStateManager.RefreshState();
            HomePageHelper.OpenPage();
            WelcomeScreenHelper.CloseWelcomePopup();
        }

        [TestInitialize]
        public void TestInitialize()
        {

        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
            TimeSeriesHelper.CloseChart();
            TimeSeriesHelper.CloseUploadFileForm();
        }

        #endregion

        [TestMethod]
        public void timeseries_should_upload_csv_file()
        {
            const string filename = "positive.csv";
            TimeSeriesHelper.UploadFile(Path + filename, ",");
            StringAssert.Contains(TimeSeriesHelper.GetTimeSeriesChartHeader(), filename);
        }

        [TestMethod]
        public void timeseries_should_upload_txt_file()
        {
            const string filename = "textPositive.txt";
            TimeSeriesHelper.UploadFile(Path + filename, ",");
            StringAssert.Contains(TimeSeriesHelper.GetTimeSeriesChartHeader(), filename);
        }

        [TestMethod]
        public void timeseries_should_upload_csv_file_with_semicolon()
        {
            const string filename = "semicolon.csv";
            TimeSeriesHelper.UploadFile(Path + filename, ";");
            StringAssert.Contains(TimeSeriesHelper.GetTimeSeriesChartHeader(), filename);
        }

        [TestMethod]
        public void timeseries_should_upload_csv_file_with_space()
        {
            const string filename = "space.csv";
            TimeSeriesHelper.UploadFile(Path + filename, "space");
            StringAssert.Contains(TimeSeriesHelper.GetTimeSeriesChartHeader(), filename);
        }

        [TestMethod]
        public void timeseries_should_upload_csv_file_with_tab()
        {
            const string filename = "tab.csv";
            TimeSeriesHelper.UploadFile(Path + filename, "tab");
            StringAssert.Contains(TimeSeriesHelper.GetTimeSeriesChartHeader(), filename);
        }

        [TestMethod]
        public void timeseries_should_upload_preloaded_file()
        {
            string fileName = TimeSeriesHelper.UploadPreloadedFile();
            StringAssert.Contains(TimeSeriesHelper.GetTimeSeriesChartHeader(), fileName);
        }
    }
}