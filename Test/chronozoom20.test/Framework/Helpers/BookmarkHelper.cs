using System;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class BookmarkHelper : DependentActions 
    {

        public void HideBookmark()
        {
            Logger.Log("<-");
            Click(By.Id("bookmarksCollapse"));
            Logger.Log("->");
        }

        public bool IsBookmarkExpanded()
        {
            Logger.Log("<-");
            bool result = Convert.ToBoolean(GetJavaScriptExecutionResult("isBookmarksWindowExpanded"));
            Logger.Log("-> IsBookmarkExpanded: " + result);
            return result;
        }
    }
}