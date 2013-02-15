using System;
using Framework.UserActions;

namespace Framework
{
    public class BrowserStateManager : CommonActions
    {
        public bool HasInternetConnection { get; set; }

        public void RefreshState()
        {
            RestartBrowserIfDead();
        }

        private void RestartBrowserIfDead()
        {
            var environment = ApplicationManager.GetInstance().GetEnvironment();
            try
            {
                GetCurrentUrl();
            }
            catch (Exception)
            {
                environment.RestartDriver();
            }
        }
    }
}