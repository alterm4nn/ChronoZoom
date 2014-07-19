using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Linq;
using System.Linq;
using Chronozoom.Entities;

namespace Chronozoom.UI.Utils
{
    /// <summary>
    /// Example:
    /// 
    /// using (Chronozoom.UI.Utils.ExportImport xfer = new Utils.ExportImport())
    /// {
    ///     List<Utils.ExportImport.FlatTimeline> test = xfer.GetTimelines(new Guid("00000000-0000-0000-0000-000000000000")); // cosmos
    /// }
    /// </summary>
    public class ExportImport : IDisposable
    {
        private Storage             _storage;

        private List<FlatTimeline>  _flatTimelines;

        public class FlatTimeline
        {
            public Guid?    parentTimelineId { get; set; }
            public Timeline timeline         { get; set; }
        }

        #region "Constructor/Destructor"

        public ExportImport()
        {
            _storage = new Storage();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // free any managed resources
                _storage.Dispose();
            }
            // free any native resources
        }

        #endregion

        public List<FlatTimeline> GetTimelines(Guid topmostTimelineId)
        {
            _flatTimelines = new List<FlatTimeline>();

            IterateTimelineExport(null, topmostTimelineId);

            return _flatTimelines;
        }

        private void IterateTimelineExport(Guid? parentTimelineId, Guid timelineId)
        {
            Timeline timeline =
                _storage.Timelines.Where(t => t.Id == timelineId)
                .Include("Exhibits.ContentItems")
                .Include("ChildTimelines")
                .FirstOrDefault();

            if (timeline != null)
            {
                FlatTimeline flatTimeline       = new FlatTimeline();
                flatTimeline.parentTimelineId   = parentTimelineId;
                flatTimeline.timeline           = timeline;

                _flatTimelines.Add(flatTimeline);

                foreach (Timeline child in timeline.ChildTimelines)
                {
                    IterateTimelineExport(timeline.Id, child.Id);
                }
            }
        }

    }
}