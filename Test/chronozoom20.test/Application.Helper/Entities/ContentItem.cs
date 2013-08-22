using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Application.Helper.Entities
{
    [DataContract]
    [NotMapped]
    public class ContentItem : Chronozoom.Entities.ContentItemRaw
    {
        public string FileName { get; set; }
        public SkyDriveType SkyDriveFileType { get; set; }

        public override string ToString()
        {
            return string.Format("[ContentItem: Title = {0}, Caption = {1}, MediaSource = {2}, MediaType = {3}]", Title, Caption, MediaSource, MediaType);
        }

        public enum SkyDriveType
        {
            Document,
            Image
        }

    }
}