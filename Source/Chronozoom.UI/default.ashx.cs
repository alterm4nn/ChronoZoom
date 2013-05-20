using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Chronozoom.UI
{
    /// <summary>
    /// Summary description for _default
    /// </summary>
    public class DefaultHttpHandler : IHttpHandler
    {
        private static const string _mainPageName = @"cz.html";  /* cannot be marked as static */
        private static readonly Lazy<string> _mainPage = new Lazy<string>(() =>
        {
            return File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + _mainPageName);
        });

        public void ProcessRequest(HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            context.Response.ContentType = "text/html";
            context.Response.Write(_mainPage.Value);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}