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
            OpenUrl("http://depot.cs.msu.su:9090/axis_marker/test/html/testTimescale.htm#/t55@x=0.49999985312312956&y=-0.4671147974140981&w=1.2906637834504491e-10&h=1.1385983007469986e-10");
        }
    }
}