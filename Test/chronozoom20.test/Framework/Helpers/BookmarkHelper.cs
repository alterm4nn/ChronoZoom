using System;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class BookmarkHelper : DependentActions 
    {

        public void HideBookmark()
        {
            Click(By.Id("bookmarksCollapse"));
        }

        public bool IsBookmarkExpanded()
        {
            return Convert.ToBoolean(GetJavaScriptExecutionResult("isBookmarksWindowExpanded"));
        }

    }
}