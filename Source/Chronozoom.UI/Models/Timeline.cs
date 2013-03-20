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

    public static class TimelineExtensions
    {
        public static Timeline Clone(this Timeline timeline)
        {
            return new Timeline()
            {
                id = timeline.id,
                parent = timeline.id,
                start = timeline.start,
                end = timeline.end,
                title = timeline.title,
                exhibits = new List<Exhibit>(),
                timelines = new List<Timeline>(),

                // extra properties for backward compatibility
                UniqueID = timeline.UniqueID,
                Regime = timeline.Regime,
                Height = timeline.Height
            };
        }

        public static Timeline FindTimeline(this Timeline t1, string id)
        {
            if (t1 == null || string.IsNullOrEmpty(id))
                return null;

            if (t1.id == id)
            {
                return t1;
            }
            else
            {
                foreach (var t2 in t1.timelines)
                {
                    var t3 = FindTimeline(t2, id);

                    if (t3 != null)
                        return t3;
                }

                return null;
            }
        }

        public static Timeline FilterTimelines(this Timeline t1, double start, double end, double minspan)
        {
            if (t1 == null)
                return null;

            if (!(t1.start < start && t1.end < start || t1.start > end && t1.end > end) && (t1.end - t1.start >= minspan))
            {
                var t2 = t1.Clone();

                foreach (var e1 in t1.exhibits)
                {
                    var e2 = e1.Clone();
                    t2.exhibits.Add(e2);
                }

                foreach (var t3 in t1.timelines)
                {
                    t2.timelines.Add(FilterTimelines(t3, start, end, minspan));
                }

                return t2;
            }
            else
            {
                var t2 = t1.Clone();
                t2.timelines = null;
                t2.exhibits = null;
                return t2;
            }
        }
    }
}
