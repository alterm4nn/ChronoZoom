using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Chronozoom.Entities.UnitTests
{
    [TestClass]
    public partial class StorageTest
    {
        [TestMethod]
        public void TestEntities_TimelinesQuery_RetrievesMaxElements()
        {
            const int maxElements = 10;
            const int minYear = -10000000;
            const int maxYear = 9999;
            const int maxDepth = 30;

            var timelines = _storage.TimelinesQuery(_betaCollection.Id, minYear, maxYear, 0, null, maxElements, maxDepth);

            int timelineCount = 0;
            foreach (Timeline timeline in timelines)
            {
                timeline.Traverse(childTimeline => 
                {
                    timelineCount++;
                    timelineCount += childTimeline.Exhibits.Count();
                });
            }

            Assert.IsTrue(timelineCount <= maxElements, "Timelines maxElements query returned incorrect number of timelines");
        }

        [TestMethod]
        public void TestEntities_DeleteTimeline_DeletesTimeline()
        {
            Timeline toDeleteTimeline = _storage.Timelines.FirstOrDefault(candidate => candidate.Title == "Mesoproterozoic Era");
            Assert.IsNotNull(toDeleteTimeline, "toDeleteTimeline == null");
            Guid timelineDeleteId = toDeleteTimeline.Id;
            _storage.DeleteTimeline(timelineDeleteId);
            _storage.SaveChanges();

            var timelineDeleted = _storage.Timelines.FirstOrDefault(candidate => candidate.Id == timelineDeleteId);
            Assert.IsNull(timelineDeleted, "Timeline was not deleted");
        } 
        
        [TestMethod]
        public void TestEntities_DeleteTimeline_DeletesTimelineWithChildrens()
        {
            Timeline parentTimeline = _storage.Timelines.FirstOrDefault(candidate => candidate.Title == "Geologic Time Scale");

            Assert.IsNotNull(parentTimeline, "toDeleteTimeline == null");

            Guid parentTimelineId = parentTimeline.Id;

            string timelinesQuery = string.Format(
                CultureInfo.InvariantCulture,
                "SELECT * FROM Timelines WHERE Timeline_Id IN ('{0}')",
                string.Join("', '", parentTimelineId));

            IEnumerable<TimelineRaw> childrenTimelines = _storage.Database.SqlQuery<TimelineRaw>(timelinesQuery);

            List<Guid> childrenTimelineGuids = childrenTimelines.Select(timelineRaw => timelineRaw.Id).ToList();

            foreach (var guid in childrenTimelineGuids)
            {
                Assert.IsNotNull(guid, "Timeline was not deleted");
            }

            _storage.DeleteTimeline(parentTimelineId);
            _storage.SaveChanges();

            Timeline timelineDeleted = _storage.Timelines.FirstOrDefault(candidate => candidate.Id == parentTimelineId);
            Assert.IsNull(timelineDeleted, "Timeline was not deleted");

            IEnumerable<TimelineRaw> childrenTimelinesAfterDeletion = _storage.Database.SqlQuery<TimelineRaw>(timelinesQuery);
            foreach (TimelineRaw timeline in childrenTimelinesAfterDeletion)
            {
                Assert.IsNull(timeline.Id, "Timeline was not deleted");
            }
        }

        [TestMethod]
        public void TestEntities_TimelinesQuery_RetrievesImmediateLevel()
        {
            const int minYear = -10000000;
            const int maxYear = 9999;
            const int maxElements = 10;

            var timelines = _storage.TimelinesQuery(_betaCollection.Id, minYear, maxYear, 0, null, maxElements, 2);

            Assert.IsNotNull(timelines, "Base timeline expected to verify one-level timelines");
            foreach (Timeline timeline in timelines)
            {
                Assert.IsNull(timeline.ChildTimelines, "No children expected while retrieving one level");
            }
        }
    }
}
