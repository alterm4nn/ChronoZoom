// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Chronozoom.Api.Models
{
    public class Timeline
    {
        public string id;
        public string parent;
        public double start;
        public double end;
        public string title;
        public List<Exhibit> exhibits = new List<Exhibit>();
        public List<Timeline> timelines = new List<Timeline>();

        // extra properties for backward compatibility
        public int UniqueID;
        public string Regime;
        public double? Height;
    }
}
