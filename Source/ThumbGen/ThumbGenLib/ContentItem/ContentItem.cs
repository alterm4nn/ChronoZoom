using System;
using System.Data.Linq.Mapping;
using System.Windows.Media.Imaging;

namespace ThumbGen
{
    [Table(Name = "ContentItem")]
    public class ContentItem
    {
        /// <summary>
        /// ID of the ContentItem
        /// </summary>
        [Column(IsPrimaryKey = true)]
        public Guid ID;

        /// <summary>
        /// Title of the ContentItem
        /// </summary>
        [Column]
        public string Title;

        /// <summary>
        /// Url for the media element of ContentItem
        /// </summary>
        [Column]
        public string MediaBlobURL;

        /// <summary>
        /// Description of the ContentItem
        /// </summary>
        [Column]
        public string Caption;

        /// <summary>
        /// Type of the ContentItem
        /// </summary>
        [Column]
        public Guid MediaTypeID;

        /// <summary>
        /// Original thumbnail of the element
        /// </summary>
        public BitmapSource thumbnail;
        
        /// <summary>
        /// indicates, whether item is marked as deleted and should not be used 
        /// </summary>
        [Column]
        public bool? IsDeleted;

        /// <summary>
        /// Inidicates, whether item is marked as visible element
        /// </summary>
        [Column]
        public bool? IsVisible;

        /// <summary>
        /// Creates object representing data from the ContentItem element
        /// </summary>
        /// <param name="_title"></param>
        /// <param name="_url"></param>
        /// <param name="_description"></param>
        /// <param name="_ciType"></param>
        public ContentItem(string _title, string _url, string _description, Guid _mType)
        {
            Title = _title;
            MediaBlobURL = _url;
            Caption = _description;
            MediaTypeID = _mType;
        }

        /// <summary>
        /// Empty constructor for using with LINQ queries
        /// </summary>
        public ContentItem()
        {

        }
    }
}
