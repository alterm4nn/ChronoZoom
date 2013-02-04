using System;
using System.Collections.ObjectModel;
using System.Threading;
using Framework.UserActions;

namespace Framework
{
    public class BrowserStateManager : CommonActions
    {
        public bool HasInternetConnection { get; set; }
        public string CurrentHandle { get; set; }

        public void RefreshState()
        {
            RestartBrowserIfDead();

            HasInternetConnection = IsInternetConnected();
            CurrentHandle = GetCurrentHandle();
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

        private bool IsInternetConnected()
        {
            var timeToReconnect = TimeSpan.FromSeconds(Configuration.ConnectionWait);

            var isInternetConnected = Convert.ToBoolean(GetJavaScriptExecutionResult("window.navigator.onLine;"));
            if (!isInternetConnected)
            {
                Logger.Log(string.Format("No internet connection, wait {0} minute(s).", timeToReconnect), LogType.Debug);
                Thread.Sleep(timeToReconnect);
                isInternetConnected = Convert.ToBoolean(GetJavaScriptExecutionResult("window.navigator.onLine;"));
                if (isInternetConnected)
                {
                    Logger.Log(string.Format("Internet connection found after {0} minute(s) waiting", timeToReconnect), LogType.Debug);
                }
                else
                {
                    Logger.Log(string.Format("Internet connection not found after {0} minutes waiting", timeToReconnect), LogType.Debug);
                    throw new Exception("Internet connection is not availabled");
                }
            }
            else
            {
                Logger.Log("Internet connection is availabled", LogType.Debug);
            }

            return isInternetConnected;
        }
    }
}