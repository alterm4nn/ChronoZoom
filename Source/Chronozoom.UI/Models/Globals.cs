// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Web.Hosting;

namespace Chronozoom.Api.Models
{
    public static class Globals
    {
        public static Timeline Root { get; set; }

        public static void initData()
        {
            StreamReader file = null;
            try
            {
                file = File.OpenText(HostingEnvironment.ApplicationPhysicalPath + @"ResponseDump.txt");
                var serializer = new JsonSerializer();
                var r = (ReponseDump)serializer.Deserialize(file, typeof(ReponseDump));
                Root = r.d[0];
                Utility.ParseLeftRight(Root);
            } catch (Exception e) {
                Debug.WriteLine(e.Message);
            }
            finally
            {
                if (file != null)
                    file.Close();
            }
        }
    }
}