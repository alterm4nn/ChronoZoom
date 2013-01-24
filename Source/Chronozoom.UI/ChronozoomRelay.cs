using System;
using System.Web;
using System.Net;
using System.IO;
using System.Text;

namespace UI
{
    public class ChronozoomRelay : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var req = WebRequest.Create("http://[Your domain]/Chronozoom.svc/get");
            using (var response = req.GetResponse())
            using (var stream = response.GetResponseStream())
            {
                byte[] buf = new byte[8192];
                do
                {
                    int count = stream.Read(buf, 0, buf.Length);
                    if (count == 0) break;

                    context.Response.Write(Encoding.UTF8.GetString(buf, 0, count));
                } while (true);
            }
        }
    }
}
