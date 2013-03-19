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
            Logger.Log("<-");
            ReadOnlyCollection<IWebElement> webElements = FindElements(By.XPath("//*[@class='cz-timescale-label' and contains(@style,'display: block;')]"));
            List<string> labels = webElements.Select(label => label.Text).ToList();
            foreach (string label in labels)
            {
                Logger.Log("-> label: " + label + "\r\n");
            }
            return labels;
        }

        public double GetLeftBorderDate()
        {
            Logger.Log("<-");
            double value = GetBorderDate(By.Id("timescale_left_border"));
            Logger.Log("-> text: " + value);
            return value;
        }
        
        public double GetRightBorderDate()
        {
            Logger.Log("<-");
            double value = GetBorderDate(By.Id("timescale_right_border"));
            Logger.Log("-> text: " + value);
            return value;
        }

        public string GetLeftBorderDateAge()
        {
            Logger.Log("<-");
            string text = GetText(By.Id("timescale_left_border"));
            Logger.Log("-- text: " + text);
            return text.Split(' ')[1];
        } 
        
        public string GetRightBorderDateAge()
        {
            Logger.Log("<-");
            string text = GetText(By.Id("timescale_right_border"));
            Logger.Log("-- text: " + text);
            return text.Split(' ')[1];
        }

        public string GetMouseMarkerText()
        {
            Logger.Log("<-");
            string textMouseMarker = GetText(By.Id("timescale_marker"));
            Logger.Log("-> text: " + textMouseMarker);
            return textMouseMarker;
        }

        private double GetBorderDate(By by)
        {
            Logger.Log("<-");
            string timeText = GetText(by);
            Logger.Log("-- timeText: " + timeText);
            double value = ConvertDateToDouble(timeText.Split(' ')[0]);
            Logger.Log("-> text: " + value);
            return value;
        }

        private double ConvertDateToDouble(string date)
        {
            double value = Convert.ToDouble(date);
            return value;
        }
    }
}