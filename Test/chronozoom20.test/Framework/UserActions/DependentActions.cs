using Framework.Interfaces;

namespace Framework.UserActions
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
    }
}