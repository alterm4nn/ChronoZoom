using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;

namespace Application.Driver
{
    public class Logger
    {
        public static void Log(string message = "", LogType logType = LogType.MessageWithScreenshot)
        {
            Guid guid = Guid.NewGuid();
            MethodBase method;
            switch (logType)
            {
                case LogType.MessageWithoutScreenshot:
                    method = new StackFrame(1).GetMethod();
                    if (method.DeclaringType != null)
                    {
                        string nameSpace = string.Format("{0}.{1}", method.DeclaringType.FullName, method.Name);
                        WriteToFile(nameSpace + " : " + message);
                        string msg = DateTime.Now.ToString("HH:mm:ss") + " : " + nameSpace + ": " + message;
                        Console.WriteLine(msg);
                    }
                    break;
                case LogType.MessageWithScreenshot:
                    method = new StackFrame(1).GetMethod();
                    if (method.DeclaringType != null)
                    {
                        string nameSpace = string.Format("{0}.{1}", method.DeclaringType.FullName, method.Name);
                        WriteToFile(nameSpace + " : " + message + " " + guid);
                        string msg = DateTime.Now.ToString("HH:mm:ss") + " : " + nameSpace + ": " + message + " WebDriverScreenshot:" + guid;
                        ScreenshotManager.TakeScreenshot(guid);
                        Console.WriteLine(msg);
                    }
                    break;
                case LogType.Delimiter:
                    WriteToFile("");
                    WriteToFile("[New session of logging (" + DateTime.Now.ToString("yyyy-MM-dd") + ")]");
                    WriteToFile(message);
                    WriteToFile("----------------------------------------------");
                    break;
                case LogType.Debug:
                    Debug.WriteLine(message);
                    break;
            }
        }

        internal static void WriteToFile(string message)
        {
            message = DateTime.UtcNow + ", " + message;
            var fileInfo = new FileInfo("./Log.log");
            StreamWriter streamWriter = fileInfo.AppendText();
            streamWriter.WriteLine(message);
            streamWriter.Close();
        }
    }

    public enum LogType
    {
        MessageWithScreenshot,
        MessageWithoutScreenshot,
        Delimiter,
        Debug
    }
}