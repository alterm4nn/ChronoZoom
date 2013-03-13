using System;
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
            foreach (string label in labels)
            {
                Logger.Log("--> label: " + label + "\r\n");
            }
            return labels;
        }

        public double GetLeftBorderDate()
        {
            Logger.Log("<--");
            double value = GetBorderDate(By.Id("timescale_left_border"));
            Logger.Log("--> text: " + value);
            return value;
        }
        
        public double GetRightBorderDate()
        {
            Logger.Log("<--");
            double value = GetBorderDate(By.Id("timescale_right_border"));
            Logger.Log("--> text: " + value);
            return value;
        }

        private double GetBorderDate(By by)
        {
            Logger.Log("<--");
            string timeText = GetText(by);
            Logger.Log("-- timeText: " + timeText);
            double value = ConvertDateToDouble(timeText);
            Logger.Log("--> text: " + value);
            return value;
        }

        private double ConvertDateToDouble(string date)
        {
            string timeValue = date.Split(' ')[0];
            double value = Convert.ToDouble(timeValue);
            return value;
        }
    }
}