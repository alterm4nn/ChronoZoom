using Application.Helper.Interfaces;
using OpenQA.Selenium;

namespace Application.Helper.BrowserImpl
{
    public class IeControls : DefaultControls, IControls
    {
        public override void ClickOnTimeseriesButton()
        {
            ClickByJavaScript(By.Id("timeSeries_button"));
        }
    }
}