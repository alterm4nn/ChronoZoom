using Newtonsoft.Json;
using System;
using System.IO;

namespace ResponseDumpConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Converting ResponseDump ... ");

            #region Read ResponseDump.txt
            StreamReader fileIn = null;
            try
            {
                fileIn = File.OpenText(@"..\..\..\Chronozoom.UI\ResponseDump.txt");
                var serializer = new JsonSerializer();
                var r = (ReponseDump)serializer.Deserialize(fileIn, typeof(ReponseDump));
                Chronozoom.Models.Globals.Root = r.d[0];
            }
            catch (Exception e)
            {
                if (fileIn != null) fileIn.Close();
                Console.WriteLine("[Fail]");
                Console.WriteLine(e.Message);
                Console.ReadKey();
                return;
            }
            finally
            {
                if (fileIn != null) fileIn.Close();
            }
            #endregion

            # region Convert ResponseDump to ResponseDumpRest
            try
            {
                Chronozoom.Models.Rest.Globals.Root = ConvertToRest(Chronozoom.Models.Globals.Root, null);
            } 
            catch (Exception e)
            {
                Console.WriteLine("[Fail]");
                Console.WriteLine(e.Message);
                Console.ReadKey();
                return;
            }
            #endregion

            #region Write ResponseDumpRest.txt
            StreamWriter fileOut = null;
            try
            {
                fileOut = File.CreateText(@"..\..\..\Chronozoom.UI\ResponseDumpRest.txt");
                var serializer = new JsonSerializer();
                serializer.Serialize(fileOut, Chronozoom.Models.Rest.Globals.Root);
            }
            catch (Exception e)
            {
                if (fileOut != null) fileOut.Close();
                Console.WriteLine("[Fail]");
                Console.WriteLine(e.Message);
                Console.ReadKey();
            }
            finally
            {
                if (fileOut != null) fileOut.Close();
            }
            #endregion

            Console.WriteLine("[Success]");
            Console.ReadKey();
        }

        private static Chronozoom.Models.Rest.Timeline ConvertToRest(Chronozoom.Models.Timeline t1, Chronozoom.Models.Timeline p1)
        {
            var t2 = new Chronozoom.Models.Rest.Timeline();
            t2.id = t1.ID;
            t2.parent = (p1 == null) ? null : p1.ID;
            t2.start = Utility.ParseDateTime(t1.FromTimeUnit, t1.FromDay, t1.FromMonth, t1.FromYear);
            t2.end = Utility.ParseDateTime(t1.ToTimeUnit, t1.ToDay, t1.ToMonth, t1.ToYear);
            t2.title = t1.Title;
            // extra timeline properties for backward compatibility
            t2.UniqueID = t1.UniqueID;
            t2.Regime = t1.Regime;
            t2.Height = t1.Height;

            foreach (var e1 in t1.Exhibits)
            {
                var e2 = new Chronozoom.Models.Rest.Exhibit();
                e2.id = e1.ID;
                e2.parent = t1.ID;
                e2.time = Utility.ParseDateTime(e1.TimeUnit, e1.Day, e1.Month, e1.Year);
                e2.title = e1.Title;
                e2.description = string.Empty;
                // extra exhibit properties for backward compatibility
                e2.UniqueID = e1.UniqueID;

                foreach (var c1 in e1.ContentItems)
                {
                    var c2 = new Chronozoom.Models.Rest.ContentItem();
                    c2.id = c1.ID;
                    c2.parent = e1.ID;
                    c2.title = c1.Title;
                    c2.description = c1.Caption;
                    c2.uri = c1.Uri;
                    c2.mediaType = c1.MediaType;
                    // extra ContentItem properties for backward compatibility
                    c2.UniqueID = c1.UniqueID;
                    c2.Order = c1.Order;
                    e2.contentItems.Add(c2);
                }

                t2.exhibits.Add(e2);
            }

            foreach (var child in t1.ChildTimelines)
            {
                t2.timelines.Add(ConvertToRest(child, t1));
            }

            return t2;
        }
    }
}
