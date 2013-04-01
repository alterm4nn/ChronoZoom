using Application.Driver;
using Application.Helper.Interfaces;

namespace Application.Helper.BrowserImpl
{
    public class FirefoxControls : DefaultControls, IControls
    {
        public override void ClickCloseButton()
        {
            ExecuteJavaScript("closeWelcomeScreen()");
        }

        public override void NavigateBceToCeEra()
        {
            OpenUrl(Configuration.BaseUrl + @"#/t55/t174/t66/t46/t361/t364/t377/t161@x=0.09842277303042166&y=-0.04391631637999881&w=0.0002611895548267019&h=0.00039153105944797343");
        }
    }
}