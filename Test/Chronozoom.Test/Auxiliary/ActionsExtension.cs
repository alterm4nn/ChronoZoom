using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium;
using Selenium;

namespace Chronozoom.Test.Auxiliary
{
    /// <summary>
    /// This class provides an extended API of Selenium for mouse actions.
    /// </summary>
    public class ActionsExtension
    {
        // This log contains all offsets of mouse. It used to set default position of mouse.
        private Stack<Point> log = new Stack<Point>();

        private IWebDriver driver;
        private Actions builder;

        /// <summary>
        /// Initializes a new instance of the ActionsExtension class.
        /// </summary>
        /// <param name="driver">
        /// The OpenQA.Selenium.IWebDriver object on which the actions built will be performed.
        /// </param>
        public ActionsExtension(IWebDriver driver)
        {
            this.driver = driver;
            builder = new Actions(driver);
        }

        #region Properties

        /// <summary>
        /// The log with all offsets of mouse.
        /// </summary>
        public Stack<Point> Log
        {
            get
            {
                return log;
            }
            set
            {
                log = value;
            }
        }

        /// <summary>
        /// An instance of the OpenQA.Selenium.Interactions.Actions class.
        /// </summary>
        public Actions Builder
        {
            get
            {
                return builder;
            }
            set
            {
                builder = value;
            }
        }

        #endregion Properties

        #region Main Methods

        /// <summary>
        /// Clicks the mouse at the last known mouse coordinates.
        /// </summary>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension Click()
        {
            builder = builder.Click();
            return this;
        }

        /// <summary>
        /// Clicks the mouse on the specified element.
        /// </summary>
        /// <param name="element">The element on which to click.</param>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension Click(IWebElement onElement)
        {
            builder = builder.Click(onElement);
            int offsetX = onElement.Location.X + onElement.Size.Width / 2;
            int offsetY = onElement.Location.Y + onElement.Size.Height / 2;
            log.Push(new Point(-offsetX, -offsetY));
            return this;
        }

        /// <summary>
        /// Double-clicks the mouse at the last known mouse coordinates.
        /// </summary>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension DoubleClick()
        {
            builder = builder.DoubleClick();
            return this;
        }

        /// <summary>
        /// Clicks and holds the mouse button at the last known mouse coordinates.
        /// </summary>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension ClickAndHold()
        {
            builder = builder.ClickAndHold();
            return this;
        }

        /// <summary>
        /// Moves the mouse to the specified offset of the last known mouse coordinates.
        /// </summary>
        /// <param name="offsetX">The horizontal offset to which to move the mouse.</param>
        /// <param name="offsetY">The vertical offset to which to move the mouse.</param>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension MoveByOffset(int offsetX, int offsetY)
        {
            builder = builder.MoveByOffset(offsetX, offsetY);
            log.Push(new Point(-offsetX, -offsetY));
            return this;
        }

        /// <summary>
        /// Moves the mouse to the specified offset of the top-left corner of the specified element.
        /// </summary>
        /// <param name="toElement">The element to which to move the mouse.</param>
        /// <param name="offsetX">The horizontal offset to which to move the mouse.</param>
        /// <param name="offsetY">The vertical offset to which to move the mouse.</param>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension MoveToElement(IWebElement toElement, int offsetX, int offsetY)
        {
            builder = builder.MoveToElement(toElement, offsetX, offsetY);
            // NOTE: If the value of offset is too little, then Selenium ignores it.
            // TODO: Provide more accurate condition.
            if (toElement.Location.X > 10 && toElement.Location.Y > 10)
            {
                log.Push(new Point(-toElement.Location.X, -toElement.Location.Y));
            }
            log.Push(new Point(-offsetX, -offsetY));
            return this;
        }

        /// <summary>
        /// Releases the mouse button at the last known mouse coordinates.
        /// </summary>
        /// <returns>A self-reference to this ActionsExtension.</returns>
        public ActionsExtension Release()
        {
            builder = builder.Release();
            return this;
        }

        /// <summary>
        /// Performs the currently built action.
        /// </summary>
        public void Perform()
        {
            IAction action = builder.Build();
            action.Perform();

            builder = new Actions(driver);
        }

        /// <summary>
        /// This method set the context of OpenQA.Selenium.Interactions.Actions field to default.
        /// </summary>
        public void SetDefault()
        {
            Actions reverseBuilder = new Actions(driver);

            while (log.Count != 0)
            {
                Point offset = log.Pop();
                reverseBuilder.MoveByOffset(offset.X, offset.Y);
            }

            IAction action = reverseBuilder.Build();
            action.Perform();

            log.Clear();
        }

        /// <summary>
        /// (DEBUG) Provides coordinates of current mouse position.
        /// </summary>
        /// <remarks>
        /// Enter the following code in javascript code of test page.
        /// <code>
        /// var mouseX = 0;
        /// var mouseY = 0;

        /// $(document).mousemove(function (e) {
        ///    mouseX = e.pageX;
        ///    mouseY = e.pageY;
        /// });
        /// </code>
        /// </remarks>
        /// <returns>Current mouse position.</returns>
        public Point GetMousePosition()
        {
            IJavaScriptExecutor jsExecutor = driver as IJavaScriptExecutor;
            Point position;

            Dictionary<string, object> dic = jsExecutor.ExecuteScript("return {\"x\": mouseX, \"y\": mouseY};") as Dictionary<string, object>;
            string json = JSONHelper.Stringify(dic);

            position = (Point)JSONHelper.Parse(typeof(Point), json);

            return position;
        }

        #endregion Main Methods
    }
}
