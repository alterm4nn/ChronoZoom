using System;
using System.IO;

namespace ThumbGen
{
    /// <summary>
    /// Logger 
    /// </summary>
    public class Logger : IDisposable
    {
        /// <summary>
        /// Path to the log file
        /// </summary>
        private string LogPath;

        /// <summary>
        /// Log file
        /// </summary>
        StreamWriter file;

        public Logger(string _logPath)
        {
            LogPath = _logPath;
            file = new StreamWriter(LogPath, false);
            file.AutoFlush = true;
        }


        public void Log(string data)
        {
            if (!data.EndsWith("\n"))
                data += "\n";

            file.Write(DateTime.Now.ToString() + ": " + data);
                       
        }

        public void Dispose()
        {
            file.Close();
        }
    }
}
