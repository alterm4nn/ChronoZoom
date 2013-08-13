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
                WaitCondition(()=>(FindElement(By.XPath("//*[@ class='cz-form-item-mediaurl cz-input']")).GetAttribute("value") != ""),15);
                SaveArtifact();
                isLoginToSkyDrive = true;
            }
            Logger.Log("<-");
        }

        private void InitSkyDriveForm()
        {
            Logger.Log("->");
            Click(By.XPath("//*[@title='skydrive']"));
            Logger.Log("<-");
        }

        private void LoginToSkyDrive()
        {
            Logger.Log("->");
            SwitchToWindow("Sign in to your Microsoft account");
            HelperManager<AuthorizationHelper>.Instance.AuthenticateAsMicrosoftUserToSkyDrive();
            SwitchToWindow("Cosmos - ChronoZoom");
            Logger.Log("<-");
        }

        private void AddSkyDriveImage(string fileName)
        {
            Logger.Log("->");
            SwitchToFrame(By.XPath("//*[@sutra='picker']"));
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
            SwitchToFrame(By.XPath("//*[@sutra='picker']"));
            OpenDocumentsFolder();
            SelectFile(fileName);
            SwitchToDefaultContent();
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
            string xpath = string.Format("//*[@alt='{0}']", fileName);
            Click(By.XPath(xpath));
            Click(By.Id("FilePickerView-0_9"));
            Logger.Log("<-");
        }
    }
}