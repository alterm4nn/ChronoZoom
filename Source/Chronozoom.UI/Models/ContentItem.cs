// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Chronozoom.Api.Models
{
    public class ContentItem
    {
        public string id;
        public string parent;
        public string title;
        public string description;
        public string uri;
        public string mediaType;

        // extra properties for backward compatibility
        public int UniqueID;
        public short? Order;
    }

    public static class ContentItemExtensions
    {
        public static ContentItem Clone(this ContentItem contentItem)
        {
            return new ContentItem()
            {
                id = contentItem.id,
                parent = contentItem.parent,
                title = contentItem.title,
                description = contentItem.description,
                uri = contentItem.uri,
                mediaType = contentItem.mediaType,

                // extra properties for backward compatibility
                UniqueID = contentItem.UniqueID,
                Order = contentItem.Order
            };
        }
    }
}
