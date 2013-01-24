using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Support.PageObjects;
using OpenQA.Selenium.Interactions.Internal;
using OpenQA.Selenium.Interactions;
using System.Diagnostics;
using Chronozoom.Test.Auxiliary;
using System.Drawing;
using System.Threading;
using Chronozoom.Test.JsTypes;

namespace Chronozoom.Test.Components
{  
    class AxisComponent
    {
        public const string AxisClass = "axis";

        private readonly IWebDriver axisPage;
        private readonly IJavaScriptExecutor jsExecutor;

        [FindsBy(How = How.Id, Using = "axis")]
        private readonly IWebElement axis;

        public AxisComponent(IWebDriver driver)
        {
            axisPage = driver;
            jsExecutor = driver as IJavaScriptExecutor;
            axis = null;
            PageFactory.InitElements(axisPage, this);
        }

        public IWebElement Axis { get { return axis; } }

        public void SetRange(Couple couple)
        {
            string json = JSONHelper.Stringify(couple);
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"');
            script.Append(").axis(");
            script.Append('"').Append("setRange").Append('"');
            script.Append(',').Append(json).Append(");");

            jsExecutor.ExecuteScript(script.ToString());
        }

        public void SetPresent(DateTime data)
        {
            string json = JSONHelper.Stringify(data);
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"');
            script.Append(").axis(");
            script.Append('"').Append("setPresent").Append('"');
            script.Append(',').Append(json).Append(");");

            jsExecutor.ExecuteScript(script.ToString());
        }

        public double GetYearsBetweenDates()
        {
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"').Append(");");
            script.Append(").axis(");
            script.Append('"').Append("getYearsBetweenDates").Append('"').Append(");");
            
            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);  
            return (double)JSONHelper.Parse(typeof(double), json);
        }

        public DateTime GetDateForm()
        {
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"').Append(");");
            script.Append(").axis(");
            script.Append('"').Append("getDateForm").Append('"').Append(");");

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>); 
            return (DateTime)JSONHelper.Parse(typeof(DateTime), json);
        }

        public Couple GetRange()
        {
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"').Append(");");
            script.Append(").axis(");
            script.Append('"').Append("getRange").Append('"').Append(");");

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (Couple)JSONHelper.Parse(typeof(Couple), json);
        }

        public double[] Ticks()
        {
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"').Append(");");
            script.Append(").axis(");
            script.Append('"').Append("Ticks").Append('"').Append(");");

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            double[] tick = (double[])JSONHelper.Parse(typeof(double[]), json);
            return tick;
        }

        public string[] Lables()
        {
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"').Append(");");
            script.Append(").axis(");
            script.Append('"').Append("Lables").Append('"').Append(");");

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            string[] lable = (string[])JSONHelper.Parse(typeof(string[]), json);
            return lable;
        }

        public string Mode()
        {
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(axis.GetAttribute("id")).Append('"').Append(");");
            script.Append(").axis(");
            script.Append('"').Append("Ticks").Append('"').Append(");");

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (string)JSONHelper.Parse(typeof(string), json);
        }


    }
}