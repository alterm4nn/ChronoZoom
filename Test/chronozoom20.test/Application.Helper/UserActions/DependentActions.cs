using Application.Driver;
using Application.Driver.UserActions;
using Application.Helper.Interfaces;

namespace Application.Helper.UserActions
{
    public class DependentActions : CommonActions
    {
        private readonly IControls _controls;

        protected DependentActions()
        {
            _controls = IoC.Resolve<IControls>(Configuration.BrowserName);
        }

        protected void ClickCloseButton()
        {
            _controls.ClickCloseButton();
        }

        protected void NavigateBceToCeEra()
        {
            _controls.NavigateBceToCeEra();
        }

        protected void AcceptSecurityWarning()
        {
            _controls.SecurityWarningAccept();
        }
    }
}