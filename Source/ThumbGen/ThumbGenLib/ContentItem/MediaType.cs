using System;
using System.Data.Linq.Mapping;

namespace ThumbGen
{
    [Table(Name = "MediaType")]
    public class MediaType
    {
        [Column(IsPrimaryKey = true)]
        public Guid ID;

        [Column(Name = "MediaType")]
        public string typeID;

        /// <summary>
        /// Default constructor
        /// </summary>
        public MediaType() { }

        /// <summary>
        /// Get MediaType be the guid 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public static MediaTypes GetMediaType(Guid id)
        {
            if (id.ToString().ToLower() == "22258901-AD26-42F0-BC1B-C902FD542562".ToLower())
            {
                return MediaTypes.Image;
            }
            else if (id.ToString().ToLower() == "D1D0F4A5-1795-43A9-9B4F-6120261BA1B0".ToLower())
            {
                return MediaTypes.Video;
            }
            else if (id.ToString().ToLower() == "50727BB2-CD08-4C78-9C02-F514D40EB148".ToLower())
            {
                return MediaTypes.Audio;
            }
            else if (id.ToString().ToLower() == "8CBAF86D-8D55-450D-8BE0-187081A42F7B".ToLower())
            {
                return MediaTypes.Photosynth;
            }
            else if (id.ToString().ToLower() == "DA810942-8569-4B84-9590-E2FDAD61F0C9".ToLower())
            {
                return MediaTypes.PDF;
            }
            else
            {
                return MediaTypes.Other;
            }
        }

        /// <summary>
        /// Get Guid of specified MediaType
        /// </summary>
        /// <param name="mt"></param>
        /// <returns></returns>
        public static Guid GetMediaGuid(MediaTypes mt)
        {
            if (mt == MediaTypes.Image)
                return new Guid("22258901-AD26-42F0-BC1B-C902FD542562");
            else if (mt == MediaTypes.Video)
                return new Guid("D1D0F4A5-1795-43A9-9B4F-6120261BA1B0");
            else if (mt == MediaTypes.Audio)
                return new Guid("50727BB2-CD08-4C78-9C02-F514D40EB148");
            else if (mt == MediaTypes.Photosynth)
                return new Guid("8CBAF86D-8D55-450D-8BE0-187081A42F7B");
            else if (mt == MediaTypes.PDF)
                return new Guid("DA810942-8569-4B84-9590-E2FDAD61F0C9");
            else
                return new Guid();

        }
    }

    public enum MediaTypes
    {
        Image,
        Video,
        Audio,
        Photosynth,
        PDF,
        Other
    };
}
