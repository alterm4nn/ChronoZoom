using System.Collections.Generic;
using Application.Driver;
using Application.Helper.Entities;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class ExhibitSkyDriveHelper : BaseExhibitHelper
    {

        public void AddSkyDriveArtifacts(IEnumerable<Chronozoom.Entities.ContentItem> contentItems)
        {
            bool isLoginToSkyDrive = false;
            Logger.Log("->");
            foreach (ContentItem contentItem in contentItems)
            {
                Logger.Log("-- " + contentItem);
                InitArtifactForm();
                if (contentItem.Title != null) SetTitle(contentItem.Title);
                if (contentItem.Caption != null) SetDescription(contentItem.Caption);
                InitSkyDriveForm();
                if (!isLoginToSkyDrive)
                {
                    LoginToSkyDrive();
                }
                if (contentItem.SkyDriveFileType == ContentItem.SkyDriveType.Document)
                {
                    AddSkyDriveDocument(contentItem.FileName);
                }
                else
                {
                    AddSkyDriveImage(contentItem.FileName);
                }
                WaitCondition(() => (GetElementValue(By.CssSelector(".cz-form-item-mediaurl.cz-input")) != ""), Configuration.ImplicitWait);
                SaveArtifact();
                isLoginToSkyDrive = true;
            }
            Logger.Log("<-");
        }

        private void InitSkyDriveForm()
        {
            Logger.Log("->");
            Click(By.CssSelector("[title='skydrive']"));
            Logger.Log("<-");
        }

        private void LoginToSkyDrive()
        {
            Logger.Log("->");
            string currentWindowName = GetPageTitle();
            Logger.Log("- window name: " + currentWindowName);
            SwitchToWindow("Sign in to your Microsoft account");
            HelperManager<AuthorizationHelper>.Instance.AuthenticateAsMicrosoftUserToSkyDrive();
            SwitchToWindow(currentWindowName);
            Logger.Log("<-");
        }

        private void AddSkyDriveImage(string fileName)
        {
            Logger.Log("->");
            SwitchToSkyDriveFrame();
            OpenPicturesFolder();
            SelectFile(fileName);
            SwitchToDefaultContent();
        }

        private void OpenPicturesFolder()
        {
            Logger.Log("->");
            Click(By.XPath("//*[text()='Pictures']"));
            Logger.Log("<-");
        }

        private void AddSkyDriveDocument(string fileName)
        {
            Logger.Log("->");
            SwitchToSkyDriveFrame();
            OpenDocumentsFolder();
            SelectFile(fileName);
            SwitchToDefaultContent();
            Logger.Log("<-");
        }

        private void SwitchToSkyDriveFrame()
        {
            Logger.Log("->");
            SwitchToFrame(By.CssSelector("[sutra='picker']"));
            Logger.Log("<-");
        }

        private void OpenDocumentsFolder()
        {
            Logger.Log("->");
            Click(By.XPath("//*[text()='Documents']"));
            Logger.Log("<-");
        }

        private void SelectFile(string fileName)
        {
            Logger.Log("->");
            string xpath = string.Format("[alt='{0}']", fileName);
            Click(By.CssSelector(xpath));
            Click(By.Id("FilePickerView-0_9"));
            Logger.Log("<-");
        }
    }
}