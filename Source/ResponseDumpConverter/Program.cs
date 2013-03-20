using Chronozoom.Models;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;

namespace ResponseDumpConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Converting ResponseDump ... ");

            StreamReader file = null;
            try
            {
                file = File.OpenText(@"ResponseDump.txt");
                var serializer = new JsonSerializer();
                var r = (ReponseDump)serializer.Deserialize(file, typeof(ReponseDump));
                Chronozoom.Models.Globals.Root = r.d[0];
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
            }
            finally
            {
                if (file != null)
                    file.Close();
            }

            // convert to rest based model

            // write rest model to file


            Console.WriteLine("[Done]");
            Console.ReadKey();
        }
    }
}
