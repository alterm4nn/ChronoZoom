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
}
