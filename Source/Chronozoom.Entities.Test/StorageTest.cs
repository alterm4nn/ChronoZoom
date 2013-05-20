using System;
using System.Linq;
using System.Data.Entity;
using Chronozoom.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Chronozoom.Entities.Test
{
    [TestClass]
    public class StorageTest
    {
        protected Storage _storage = new Storage();
        Collection _betaCollection = null;

        [TestInitialize]
        public void Initialize()
        {
            _storage.Database.Delete();
            _betaCollection = _storage.Collections.Where(candidate => candidate.Title == "Beta Content").FirstOrDefault();
            Assert.IsNotNull(_betaCollection);
        }

        [TestMethod]
        [TestCategoryAttribute("Entities")]
        public void TestEntities_TimelinesQuery_RetrievesMaxElements()
        {
            const int maxElements = 10;
            const int minYear = -10000000;
            const int maxYear = 9999;

            var timelines = _storage.TimelinesQuery(_betaCollection.Id, minYear, maxYear, 0, null, maxElements);

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
        [TestCategoryAttribute("Entities")]
        public void TestEntities_DeleteTimeline_DeletesTimeline()
        {
            Timeline unitedStateTimeline = _storage.Timelines.Where(candidate => candidate.Title == "United States").FirstOrDefault();
            Guid timelineDeleteId = unitedStateTimeline.Id;
            _storage.DeleteTimeline(timelineDeleteId);
            _storage.SaveChanges();

            var timelineDeleted = _storage.Timelines.Where(candidate => candidate.Id == timelineDeleteId).FirstOrDefault();
            Assert.IsNull(timelineDeleted, "Timeline was not deleted");
        }
    }
}
