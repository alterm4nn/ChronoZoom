using System;
using System.IO;
using System.Net;

namespace ThumbGen
{
    class Program
    {
        [STAThread]
        public static void Main(string[] args)
        {
            try
            {
                Console.WriteLine("Initializing thumbgen...");

                #region Initialization
                // initialize controller

                ControllerSettings cs = new ControllerSettings(Properties.Settings.Default.InitialSize,
                    Properties.Settings.Default.SourceConnectionString,
                    Properties.Settings.Default.AzureBlobUrl,
                    Properties.Settings.Default.AzureAccountName,
                    Properties.Settings.Default.AccessKeyToBlob);

                Controller ctrl = new Controller();
                ctrl.SetControllerSettings(cs);

                Console.WriteLine("Azure and database connected successfully.");

                #endregion

               
                if (args.Length == 0 || args[0].ToLower() == "updateall")
                {
                    Console.WriteLine("ThumbGen: running in 'update all' mode");
                    // update all mode
                    ctrl.UpdateThumbnails();

                }
                else if (args.Length == 2 && args[0].ToLower() == "update")
                {
                    Console.WriteLine("ThumbGen: running in 'single update' mode");
                    Guid input;
                    Guid.TryParse(args[1], out input);

                    if (input == null)
                        Console.WriteLine("ThumbGen: given ID is not a valid guid");

                    // update one mode
                    ctrl.MakeThumbsForItemID(input);

                }
                else if (args.Length == 1 && args[0].ToLower() == "deleteall")
                {
                    Console.WriteLine("ThumbGen: running in clean up mode.");
                    Console.WriteLine("Program is going to delete all thumbnail data. Do you want to proceed? (Y/N)");

                    while (true)
                    {
                        ConsoleKeyInfo ki = Console.ReadKey();

                        if (ki.Key == ConsoleKey.Y)
                        {
                            // delete all mode
                            ctrl.RemoveAllThumbnails();
                            break;
                        }
                        else if (ki.Key == ConsoleKey.N)
                        {
                            Console.WriteLine("Operation was cancelled by user.");
                            break;
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
                else
                {
                    PrintHelp();
                }
            }
            catch (Exception e)
            {
                Console.Write("Exception caught: " + e.ToString() + "\n");
            }
        }

        /// <summary>
        /// 
        /// </summary>
        private static void PrintHelp()
        {
            Console.WriteLine("ThumbGen Console Application");
            Console.WriteLine("usage:");
            Console.WriteLine("thumbgen.exe [command]");
            Console.WriteLine("List of available commands:");
            Console.WriteLine("     updateall                - creates thumbs for all items without thumbs. ");
            Console.WriteLine("     deleteall                - deletes all thumbnails on Azure");
            Console.WriteLine("     update {GUID}            - creates thumbs for the item with specified GUID");
        }
    }
}
