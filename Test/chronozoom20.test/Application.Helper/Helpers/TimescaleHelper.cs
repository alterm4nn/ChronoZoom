using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class TimescaleHelper : DependentActions
    {
        public List<string> GetLabels()
        {
            Logger.Log("<-");
            ReadOnlyCollection<IWebElement> webElements = FindElements(By.XPath("//*[@class='cz-timescale-label' and contains(@style,'display: block;')]"));
            List<string> labels = webElements.Select(label => label.Text).ToList();
            foreach (string label in labels)
            {
                Logger.Log("-> label: " + label + "\r\n");
            }
            return labels;
        }

        public string GetMouseMarkerText()
        {
            Logger.Log("<-");
            string textMouseMarker = GetText(By.Id("marker-text"));
            Logger.Log("-> text: " + textMouseMarker);
            return textMouseMarker;
        }

        private double ConvertDateToDouble(string date)
        {
            double value = Convert.ToDouble(date);
            return value;
        }
    }
}