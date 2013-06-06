﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Chronozoom.Models.Rest
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
}