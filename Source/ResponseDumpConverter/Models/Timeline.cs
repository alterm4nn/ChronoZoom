// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using Newtonsoft.Json;
using System.Collections.Generic;

namespace Chronozoom.Models
{
    public class Timeline
    {
        public string ID;
        public string Title;
        public string Threshold;
        public string Regime;
        public string FromTimeUnit;
        public int? FromDay;
        public int? FromMonth;
        public double? FromYear;
        public string ToTimeUnit;
        public int? ToDay;
        public int? ToMonth;
        public double? ToYear;
        public int UniqueID;
        public int? Sequence;
        public double? Height;
        public double? AspectRatio;

        public List<Timeline> ChildTimelines = new List<Timeline>();
        public List<Exhibit> Exhibits = new List<Exhibit>();
    }
}
