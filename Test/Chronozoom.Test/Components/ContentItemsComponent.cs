using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Interactions.Internal;
using OpenQA.Selenium.Interactions;
using System.Diagnostics;
using Chronozoom.Test.Auxiliary;

namespace Chronozoom.Test.Components
{
    public class ContentItemsComponent
    {

        private readonly IWebDriver virtualCanvasPage;
        private JavaScriptGenerator scriptGenerator;

        public ContentItemsComponent(IWebDriver driver)
        {
            virtualCanvasPage = driver;
            scriptGenerator = new JavaScriptGenerator();
        }

        // Add circle to root element.
        public void AddCircle(string id)
        {
            scriptGenerator.InvokeVariableNestedField("add_Circle", null, true, id);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add rectangle to root element.
        public void AddRectangle(string id)
        {
            scriptGenerator.InvokeVariableNestedField("add_Rectangle", null, true, id);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add text to root element.
        public void AddText(string id, string text)
        {
            scriptGenerator.InvokeVariableNestedField("add_Text", null, true, id, text);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add image to root element.
        public void AddImage(string id)
        {
            scriptGenerator.InvokeVariableNestedField("add_Image", null, true, id);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add video to root element.
        public void AddVideo(string youtubeID, string vimeoID)
        {
            scriptGenerator.InvokeVariableNestedField("add_Video", null, true, youtubeID, vimeoID);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add audio to root element.
        public void AddAudio(string id)
        {
            scriptGenerator.InvokeVariableNestedField("add_Audio", null, true, id);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add multiline text to root element.
        public void AddMultiText(string id1, string id2, string text)
        {
            scriptGenerator.InvokeVariableNestedField("add_MultiText", null, true, id1, id2, text);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Change field settings for non text element with given id.
        public void ChangeSettings(string id, string settings)
        {
            scriptGenerator.InvokeVariableNestedField("changeSettings", null, true, id, settings);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Looks for an element with given id in root element.
        // Returns true if element was found, otherwise returns false.
        public bool GetChild(string id)
        {
            scriptGenerator.InvokeReturnVariable("get_Child", null, true, id);
            return ((string)scriptGenerator.ExecuteScript(virtualCanvasPage) == "True");
        }

        // Removes element with given id from root element.
        // Returns true if element was found and deleted, otherwise returns false.
        public bool RemoveChild(string id)
        {
            scriptGenerator.InvokeReturnVariable("remove_Child", null, true, id);
            return (bool)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Looks for an infodot with given id.
        // Returns true if infodot was found, otherwise returns false.
        public bool GetInfodot(string id)
        {
            scriptGenerator.InvokeReturnVariable("getInfodot", null, true, id);
            return (bool)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Looks for a content element of demo infodot with given id and index in content items collection
        // (0 for main item, 1-12 for minor items).
        // Returns true if element was found, otherwise returns false.
        public bool GetInfodotCI(string infodotID, string contentItemID)
        {
            scriptGenerator.InvokeReturnVariable("getInfodotCI", null, true, infodotID, contentItemID);
            return (bool)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Return infodot's title.
        public string GetInfodotTitle(string infodotID)
        {
            scriptGenerator.InvokeReturnVariable("getTitle", null, true, infodotID);
            return (string)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Set visible on demo infodot.
        public void ViewDemoInfodot()
        {
            scriptGenerator.InvokeVariableNestedField("viewDemoInfodot", null, true);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Set visible to view thumbnail of demo infodot.
        public void ViewDemoInfodotThumbnail()
        {
            scriptGenerator.InvokeVariableNestedField("viewDemoInfodotThumbnail", null, true);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Return title of minor content item of demo infodot.
        public string GetContentItemTitle()
        {
            scriptGenerator.InvokeReturnVariable("getCITitle", null, true);
            return (string)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Return description of minor content item of demo infodot.
        public bool GetContentItemDescription()
        {
            scriptGenerator.InvokeReturnVariable("getCIDescription", null, true);
            return (bool)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Return true if media element of minor content item of demo infodot was loaded,
        // otherwise return false.
        public bool GetContentItemMediaElement()
        {
            scriptGenerator.InvokeReturnVariable("getCIMedia", null, true);
            return (bool)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Set visible to minor content item of demo infodot.
        public void ViewDemoInfodotCI()
        {
            scriptGenerator.InvokeVariableNestedField("viewDemoInfodotMinorCI", null, true);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Return "visible" if thumbnail of minor content item of demo infodot is visible,
        // otherwise return "not visible".
        public string GetContentItemThumbnail()
        {
            scriptGenerator.InvokeReturnVariable("getDemoInfodotCIThumbnail", null, true);
            return (string)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Return "visible" if thumbnail of demo infodot is visible,
        // otherwise return "not visible".
        public string GetInfodotThumbnail()
        {
            scriptGenerator.InvokeReturnVariable("getDemoInfodotThumbnail", null, true);
            return (string)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Add infodot with 1 main and 2 minor content items.
        public void AddInfodot()
        {
            scriptGenerator.InvokeVariableNestedField("add_Infodot", null, true);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Remove demo infodot.
        public void RemoveInfodot(string id)
        {
            scriptGenerator.InvokeVariableNestedField("removeInfodot", null, true, id);
            scriptGenerator.ExecuteScript(virtualCanvasPage);
        }

        // Check if bibliography link was added to infodot.
        public bool GetBibliography()
        {
            scriptGenerator.InvokeReturnVariable("getDemoInfodotBibliography", null, true);
            return (bool)scriptGenerator.ExecuteScript(virtualCanvasPage);
        }
    }
}
