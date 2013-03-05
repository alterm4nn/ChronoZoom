using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Framework.UserActions;
using OpenQA.Selenium;

namespace Framework.Helpers
{
    public class TimelineHelper : DependentActions
    {
        public List<string> GetLabels()
        {
            Logger.Log("<--");
            ReadOnlyCollection<IWebElement> webElements = FindElements(By.XPath("//*[@class='cz-timescale-label' and contains(@style,'display: block;')]"));
            List<string> labels = webElements.Select(label => label.Text).ToList();
            return labels;
        }
    }
}