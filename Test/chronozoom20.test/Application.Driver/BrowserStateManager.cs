using System;
using Application.Driver.UserActions;

namespace Application.Driver
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
            var environment = DriverManager.GetEnvironmentInstance();
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