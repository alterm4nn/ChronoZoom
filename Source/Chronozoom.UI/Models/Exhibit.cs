// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Chronozoom.Api.Models
{
    public class Exhibit
    {
        public string id;
        public string parent;
        public double time;
        public string title;
        public string description;
        public List<ContentItem> contentItems = new List<ContentItem>();

        // extra properties for backward compatibility
        public int UniqueID;
    }

    public static class ExhibitExtensions
    {
        public static Exhibit CloneStructure(this Exhibit exhibit)
        {
            var clone = new Exhibit()
            {
                id = exhibit.id,
                parent = exhibit.parent,
                time = exhibit.time,
                title = exhibit.title,
                description = exhibit.description,
                contentItems = new List<ContentItem>(),

                // extra properties for backward compatibility
                UniqueID = exhibit.UniqueID
            };

            return clone;
        }

        public static Exhibit CloneData(this Exhibit exhibit)
        {
            var clone = new Exhibit()
            {
                id = exhibit.id,
                parent = exhibit.parent,
                time = exhibit.time,
                title = exhibit.title,
                description = exhibit.description,
                contentItems = new List<ContentItem>(),

                // extra properties for backward compatibility
                UniqueID = exhibit.UniqueID
            };

            foreach (var contentItem in exhibit.contentItems)
                clone.contentItems.Add(contentItem.CloneData());

            return clone;
        }
    }
}
