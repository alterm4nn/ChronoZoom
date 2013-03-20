// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Chronozoom.Models
{
    public class Exhibit
    {
        public string ID;
        public string Title;
        public string Threshold;
        public string Regime;
        public string TimeUnit;
        public int? Day;
        public int? Month;
        public double? Year;
        public int UniqueID;
        public int? Sequence;

        public List<ContentItem> ContentItems = new List<ContentItem>();
        public List<Reference> References = new List<Reference>();

        // additional properties and methods
        public Exhibit clone()
        {
            var e = (Exhibit)this.MemberwiseClone();
            e.ContentItems = new List<ContentItem>();
            e.References = new List<Reference>();
            return e;
        }
    }
}
