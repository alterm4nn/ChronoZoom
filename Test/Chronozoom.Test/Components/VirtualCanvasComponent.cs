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
    /// <summary>
    /// This is the Page Object for main functionality of Virtual Canvas.
    /// </summary>
    class VirtualCanvasComponent
    {
        #region Constants

        public const string VirtualCanvasCssClass = "virtualCanvas";
        public const string VirtualCanvasLayerDivCssClass = "virtualCanvasLayerDiv";
        public const string VirtualCanvasLayerCanvasCssClass = "virtualCanvasLayerCanvas";

        #endregion Constants

        // Using PageFactory class to autoassign fields in constructor.
        #region Fields

        private readonly IWebDriver virtualCanvasPage;
        private readonly IJavaScriptExecutor jsExecutor;

        [FindsBy(How = How.Id, Using = "vc")]
        private readonly IWebElement virtualCanvas;

        [FindsBy(How = How.Id, Using = "search_button")]
        private readonly IWebElement searchButton;

        [FindsBy(How = How.Id, Using = "searchTextBox")]
        private readonly IWebElement searchTextBox;

        [FindsBy(How = How.XPath, Using = ".//*[@class = 'searchResults']")]
        private readonly IWebElement searchResults;

        [FindsBy(How = How.Id, Using = "layerTimelines")]
        private readonly IWebElement layerTimelines;

        [FindsBy(How = How.Id, Using = "layerInfodots")]
        private readonly IWebElement layerInfodots;

        [FindsBy(How = How.XPath, Using = ".//*[@class = 'regimes_titles']/div[1]/div")]
        private readonly IWebElement humanityLink;

        [FindsBy(How = How.XPath, Using = ".//*[@class = 'regimes_titles']/div[2]/div")]
        private readonly IWebElement prehistoryLink;

        [FindsBy(How = How.XPath, Using = ".//*[@class = 'regimes_titles']/div[3]/div")]
        private readonly IWebElement lifeLink;

        [FindsBy(How = How.XPath, Using = ".//*[@class = 'regimes_titles']/div[4]/div")]
        private readonly IWebElement earthLink;

        [FindsBy(How = How.XPath, Using = ".//*[@class = 'regimes_titles']/div[5]/div")]
        private readonly IWebElement cosmosLink;

        [FindsBy(How = How.Id, Using = "human_rect")]
        private readonly IWebElement humanityBar;

        [FindsBy(How = How.Id, Using = "prehuman_rect")]
        private readonly IWebElement prehistoryBar;

        [FindsBy(How = How.Id, Using = "life_rect")]
        private readonly IWebElement lifeBar;

        [FindsBy(How = How.Id, Using = "earth_rect")]
        private readonly IWebElement earthBar;

        [FindsBy(How = How.Id, Using = "cosmos_rect")]
        private readonly IWebElement cosmosBar;

        #endregion Fields

        public VirtualCanvasComponent(IWebDriver driver)
        {
            virtualCanvasPage = driver;
            jsExecutor = driver as IJavaScriptExecutor;
            searchButton = null;
            searchTextBox = null;
            searchResults = null;
            virtualCanvas = null;
            layerTimelines = null;
            layerInfodots = null;
            humanityLink = null;
            prehistoryLink = null;
            lifeLink = null;
            earthLink = null;
            cosmosLink = null;
            humanityBar = null;
            prehistoryBar = null;
            lifeBar = null;
            earthBar = null;
            cosmosBar = null;
            PageFactory.InitElements(virtualCanvasPage, this);
        }

        #region Properties

        public IWebElement VirtualCanvas { get { return virtualCanvas; } }
        public IWebElement SearchButton { get { return searchButton; } }
        public IWebElement SearchResults { get { return searchResults; } }
        public IWebElement LayerTimelines { get { return layerTimelines; } }
        public IWebElement LayerInfodots { get { return layerInfodots; } }
        public IWebElement HumanityLink { get { return humanityLink; } }
        public IWebElement PrehistoryLink { get { return prehistoryLink; } }
        public IWebElement LifeLink { get { return lifeLink; } }
        public IWebElement EarthLink { get { return earthLink; } }
        public IWebElement CosmosLink { get { return cosmosLink; } }
        public IWebElement HumanityBar { get { return humanityBar; } }
        public IWebElement PrehistoryBar { get { return prehistoryBar; } }
        public IWebElement LifeBar { get { return lifeBar; } }
        public IWebElement EarthBar { get { return earthBar; } }
        public IWebElement CosmosBar { get { return cosmosBar; } }

        #endregion Properties

        // Methods to perform user actions on the page.
        #region High Level Functionality Methods

        public void EnterSearchQuery(string query)
        {
            searchTextBox.SendKeys(query);
        }

        public void ClearSearchTextBox()
        {
            searchTextBox.Clear();
        }

        #endregion High Level Functionality Methods

        // Methods, which call corresponding javascript function.
        #region Low Level Functionality Methods

        public void ResizeVirtualCanvas(int height)
        {
            // document.getElementById("id").style.height = height + "px";
            StringBuilder script = new StringBuilder("document.getElementById(");
            script.Append('"').Append(virtualCanvas.GetAttribute("id")).Append('"');
            script.Append(").style.height = ");
            script.Append(height).Append(" + \"px\";");
            
            jsExecutor.ExecuteScript(script.ToString());
        }

        public void UpdateViewport()
        {
            // $("#id").virtualCanvas("updateViewport");
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(virtualCanvas.GetAttribute("id")).Append('"');
            script.Append(").virtualCanvas(");
            script.Append('"').Append("updateViewport").Append('"').Append(");");
            
            jsExecutor.ExecuteScript(script.ToString());
        }

        public void SetVisible(JsVisible newVisible)
        {
            // $("#id").virtualCanvas("setVisible", newVisible);
            string json = JSONHelper.Stringify(newVisible);
            StringBuilder script = new StringBuilder("$(");
            script.Append('"').Append('#').Append(virtualCanvas.GetAttribute("id")).Append('"');
            script.Append(").virtualCanvas(");
            script.Append('"').Append("setVisible").Append('"');
            script.Append(',').Append(json).Append(");");
            
            jsExecutor.ExecuteScript(script.ToString());
        }

        public JsVisible GetViewport()
        {
            // return $("#id").virtualCanvas("getViewport");
            StringBuilder script = new StringBuilder("var vp = $(");
            script.Append('"').Append('#').Append(virtualCanvas.GetAttribute("id")).Append('"');
            script.Append(").virtualCanvas(");
            script.Append('"').Append("getViewport").Append('"').Append(");");
            script.AppendLine("return vp.visible;");
            
            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (JsVisible)JSONHelper.Parse(typeof(JsVisible), json);
        }

        public void MoveToVisible(JsVisible visible, bool noAnimation)
        {
            // controller.moveToVisible(visible, false);
            string json = JSONHelper.Stringify(visible);
            StringBuilder script = new StringBuilder("controller.moveToVisible(");
            script.Append(json).Append(',').Append(noAnimation.ToString().ToLower()).Append(");");

            jsExecutor.ExecuteScript(script.ToString());
        }

        public JsCoordinates VectorScreenToVirtual(JsCoordinates v)
        {
            // var vp = $("#id").virtualCanvas("getViewport");
            // return vp.vectorScreenToVirtual(v.X, v.Y);
            StringBuilder script = new StringBuilder("var vp = $('#");
            script.Append(virtualCanvas.GetAttribute("id"));
            script.Append("').virtualCanvas('getViewport');");
            script.AppendLine("return vp.vectorScreenToVirtual(");
            script.AppendFormat("{0},{1});", v.X, v.Y);

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (JsCoordinates)JSONHelper.Parse(typeof(JsCoordinates), json);
        }

        public JsCoordinates PointVirtualToScreen(JsCoordinates v)
        {
            // var vp = $("#id").virtualCanvas("getViewport");
            // return vp.vectorVirtualToScreen(v.X, v.Y);
            StringBuilder script = new StringBuilder("var vp = $('#");
            script.Append(virtualCanvas.GetAttribute("id"));
            script.Append("').virtualCanvas('getViewport');");
            script.AppendLine("return vp.pointVirtualToScreen(");
            script.AppendFormat("{0},{1});", v.X, v.Y);

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (JsCoordinates)JSONHelper.Parse(typeof(JsCoordinates), json);
        }

        public JsCoordinates PointScreenToVirtual(JsCoordinates v)
        {
            // var vp = $("#id").virtualCanvas("getViewport");
            // return vp.vectorVirtualToScreen(v.X, v.Y);
            StringBuilder script = new StringBuilder("var vp = $('#");
            script.Append(virtualCanvas.GetAttribute("id"));
            script.Append("').virtualCanvas('getViewport');");
            script.AppendLine("return vp.pointScreenToVirtual(");
            script.AppendFormat("{0},{1});", v.X, v.Y);

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (JsCoordinates)JSONHelper.Parse(typeof(JsCoordinates), json);
        }

        public JsCoordinates VectorVirtualToScreen(JsCoordinates v)
        {
            // var vp = $("#id").virtualCanvas("getViewport");
            // return vp.vectorVirtualToScreen(v.X, v.Y);
            StringBuilder script = new StringBuilder("var vp = $('#");
            script.Append(virtualCanvas.GetAttribute("id"));
            script.Append("').virtualCanvas('getViewport');");
            script.AppendLine("return vp.vectorVirtualToScreen(");
            script.AppendFormat("{0},{1});", v.X, v.Y);

            string json = JSONHelper.Stringify(jsExecutor.ExecuteScript(script.ToString()) as Dictionary<string, object>);
            return (JsCoordinates)JSONHelper.Parse(typeof(JsCoordinates), json);
        }

        public object FindElement(string id)
        {
            // return vc.virtualCanvas('findElement', 'id');
            StringBuilder script = new StringBuilder("$('#");
            script.Append(virtualCanvas.GetAttribute("id"));
            script.Append("').virtualCanvas('findElement', '");
            script.Append(id).Append("');");

            return jsExecutor.ExecuteScript(script.ToString());
        }

        #endregion Low Level Functionality Methods

        #region Auxiliary Methods

        public void WaitAnimation()
        {
            const int DelayMs = 100;
            WebDriverWait wait = new WebDriverWait(virtualCanvasPage, TimeSpan.FromSeconds(30));

            bool end = wait.Until<bool>((d) =>
            {
                JsVisible v1, v2;

                do
                {
                    v1 = GetViewport();
                    Thread.Sleep(DelayMs);
                    v2 = GetViewport();
                } while (v1 != v2);

                return true;
            });

            if (!end)
            {
                throw new Exception("Too long animation.");
            }
        }

        public void WaitContentLoading()
        {
            const int DelayMs = 100;
            WebDriverWait wait = new WebDriverWait(virtualCanvasPage, TimeSpan.FromSeconds(30));
            bool initialized = false;

            bool end = wait.Until<bool>((d) =>
            {
                do
                {
                    Thread.Sleep(DelayMs);
                    initialized = (bool)jsExecutor.ExecuteScript("if (visReg != undefined) { return true; } else { return false; }");
                } while (initialized == false);

                return true;
            });

            if (!end)
            {
                throw new Exception("Too long loading.");
            }
        }

        #endregion Auxiliary Methods
    }
}
