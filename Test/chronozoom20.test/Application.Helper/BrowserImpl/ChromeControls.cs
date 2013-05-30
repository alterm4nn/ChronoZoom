using Application.Helper.Interfaces;

namespace Application.Helper.BrowserImpl
{
    public class ChromeControls : DefaultControls, IControls
    {
        public override void SecurityWarningAccept()
        {
            //No alert against Chrome.
        }
    }
}