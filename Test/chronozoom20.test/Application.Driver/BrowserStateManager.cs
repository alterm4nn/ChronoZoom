using System;
using Application.Driver.UserActions;

namespace Application.Driver
{
    public class BrowserStateManager : CommonActions
    {
        private DriverManager _driverManager;
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