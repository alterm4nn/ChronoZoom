﻿using System;
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

            var timelines = Storage.TimelinesQuery(BetaCollection.Id, minYear, maxYear, 0, null, maxElements, maxDepth);

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
            Timeline toDeleteTimeline = Storage.Timelines.FirstOrDefault(candidate => candidate.Title == "Mesoproterozoic Era");
            Assert.IsNotNull(toDeleteTimeline, "toDeleteTimeline == null");
            Guid timelineDeleteId = toDeleteTimeline.Id;
            Storage.DeleteTimeline(timelineDeleteId);
            Storage.SaveChanges();

            var timelineDeleted = Storage.Timelines.FirstOrDefault(candidate => candidate.Id == timelineDeleteId);
            Assert.IsNull(timelineDeleted, "Timeline was not deleted");
        }

        [TestMethod]
        public void TestEntities_DeleteTimeline_DeletesTimelineWithChildrens()
        {
            Timeline parentTimeline = Storage.Timelines.FirstOrDefault(candidate => candidate.Title == "Geologic Time Scale");

            Assert.IsNotNull(parentTimeline, "toDeleteTimeline == null");

            Guid parentTimelineId = parentTimeline.Id;

            string timelinesQuery = string.Format(
                CultureInfo.InvariantCulture,
                "SELECT * FROM Timelines WHERE Timeline_Id IN ('{0}')",
                string.Join("', '", parentTimelineId));

            IEnumerable<TimelineRaw> childrenTimelines = Storage.Database.SqlQuery<TimelineRaw>(timelinesQuery);

            List<Guid> childrenTimelineGuids = childrenTimelines.Select(timelineRaw => timelineRaw.Id).ToList();

            foreach (var guid in childrenTimelineGuids)
            {
                Assert.IsNotNull(guid, "Timeline was not deleted");
            }

            Storage.DeleteTimeline(parentTimelineId);
            Storage.SaveChanges();

            Timeline timelineDeleted = Storage.Timelines.FirstOrDefault(candidate => candidate.Id == parentTimelineId);
            Assert.IsNull(timelineDeleted, "Timeline was not deleted");

            IEnumerable<TimelineRaw> childrenTimelinesAfterDeletion = Storage.Database.SqlQuery<TimelineRaw>(timelinesQuery);
            foreach (TimelineRaw timeline in childrenTimelinesAfterDeletion)
            {
                Assert.IsNull(timeline.Id, "Timeline was not deleted");
            }
        }

        [TestMethod]
        public void TestEntities_DeleteExhibit()
        {
            Exhibit exhibit = Storage.Exhibits.FirstOrDefault(exh => exh.Title == "Fighting Stigma");
            Assert.IsNotNull(exhibit);
            Storage.DeleteExhibit(exhibit.Id);
            Storage.SaveChanges();
            Exhibit exhibitAfterDeletion = Storage.Exhibits.FirstOrDefault(exh => exh.Title == "Fighting Stigma");
            Assert.IsNull(exhibitAfterDeletion);

        }

        [TestMethod]
        public void TestEntities_TimelinesQuery_RetrievesImmediateLevel()
        {
            const int minYear = -10000000;
            const int maxYear = 9999;
            const int maxElements = 10;

            var timelines = Storage.TimelinesQuery(BetaCollection.Id, minYear, maxYear, 0, null, maxElements, 2);

            Assert.IsNotNull(timelines, "Base timeline expected to verify one-level timelines");
            foreach (Timeline timeline in timelines)
            {
                Assert.IsNull(timeline.ChildTimelines, "No children expected while retrieving one level");
            }
        }

        [TestMethod]
        public void ContentItemPathShouldBeCorrectly()
        {
            Guid collectionId = new Guid("2b6cd8e0-5833-ceaf-117e-cf74db7fed1f");
            Guid elementId = new Guid("428b173f-4e31-410d-9d88-f4fe94698289");
            const string contentItemName = "Salman Kahn Explains the Birth of Stars";

            string contentPath = Storage.GetContentPath(collectionId, elementId, contentItemName);

            string timelinesQuery = string.Format(
               CultureInfo.InvariantCulture,
               "SELECT * FROM ContentItems WHERE Title = '{0}' AND Collection_Id = '{1}'", contentItemName, collectionId);

            IEnumerable<ContentItemRaw> contentItems = Storage.Database.SqlQuery<ContentItemRaw>(timelinesQuery);

            Guid exhibitId = contentItems.First().Exhibit_ID;
            string expectedPath = String.Format("/t00000000-0000-0000-0000-000000000000/e{0}/{1}", exhibitId,
                                                elementId);
            Assert.AreEqual(expectedPath, contentPath);
        }


        [TestMethod]
        public void ContentItemPathShouldBeCorrectlyIfTitleNull()
        {
            Guid collectionId = new Guid("2b6cd8e0-5833-ceaf-117e-cf74db7fed1f");
            Guid elementId = new Guid("428b173f-4e31-410d-9d88-f4fe94698289");
            const string contentItemName = null;

            string contentPath = Storage.GetContentPath(collectionId, elementId, contentItemName);

            string timelinesQuery = string.Format(
               CultureInfo.InvariantCulture,
               "SELECT * FROM ContentItems WHERE Id = '{0}' AND Collection_Id = '{1}'", elementId, collectionId);

            IEnumerable<ContentItemRaw> contentItems = Storage.Database.SqlQuery<ContentItemRaw>(timelinesQuery);

            Guid exhibitId = contentItems.First().Exhibit_ID;
            string expectedPath = String.Format("/t00000000-0000-0000-0000-000000000000/e{0}/{1}", exhibitId,
                                                elementId);
            Assert.AreEqual(expectedPath, contentPath);
        }

        [TestMethod]
        public void TripletShouldBeCreatedIfDataPositive()
        {
            var timelineId = new Guid("2b6cd8e0-5833-ceaf-117e-cf74db7fed1f");
            const string userId = "ff5214e1-1bf4-4af5-8835-96cff2ce2cfd";
            string subjectStr = String.Format("czusr:{0}", userId);
            string objectStr = String.Format("cztimeline:{0}", timelineId);
            const string predicateStr = "czpred:favorite";

            bool result = Storage.PutTriplet(subjectStr, predicateStr, objectStr);
            Assert.IsTrue(result, "Triplet has not created");

            List<Triple> triples = Storage.GetTriplet(subjectStr, predicateStr);

            bool tr = false;
            foreach (Triple triple in triples)
            {
                tr = triple.Objects.Any(t => t.Object == objectStr);
            }
            Assert.IsTrue(tr);
        }

        [TestMethod]
        public void TripletShouldBeAddedTwoObject()
        {
            var timelineId = Guid.NewGuid();
            var secondTimelineId = Guid.NewGuid();
            const string userId = "ff5214e1-1bf4-4af5-8835-96cff2ce2cfd";
            string subjectStr = String.Format("czusr:{0}", userId);
            string objectStr = String.Format("cztimeline:{0}", timelineId);
            string objectStr2 = String.Format("cztimeline:{0}", secondTimelineId);
            const string predicateStr = "czpred:favorite";

            bool result = Storage.PutTriplet(subjectStr, predicateStr, objectStr);
            Assert.IsTrue(result, "Triplet has not created");

            List<Triple> triples = Storage.GetTriplet(subjectStr, predicateStr);

            bool tr = false;
            foreach (Triple triple in triples)
            {
                tr = triple.Objects.Any(t => t.Object == objectStr);
            }
            Assert.IsTrue(tr);

            bool result2 = Storage.PutTriplet(subjectStr, predicateStr, objectStr2);
            Assert.IsTrue(result2, "Triplet has not created");

            List<Triple> triples2 = Storage.GetTriplet(subjectStr, predicateStr);

            bool tr2 = false;
            foreach (Triple triple in triples2)
            {
                tr2 = triple.Objects.Any(t => t.Object == objectStr);
            }
            Assert.IsTrue(tr2);
        }

        [TestMethod]
        public void TripletShouldNotBeCreatedIfUserIdIsNotGuid()
        {
            //This test is failed
            const string userId = "not guid";
            const string predicateStr = "czpred:favorite";
            string timelineId = Guid.NewGuid().ToString();
            string subjectStr = String.Format("czusr:{0}", userId);
            string objectStr = String.Format("cztimeline:{0}", timelineId);

            bool result = Storage.PutTriplet(subjectStr, predicateStr, objectStr);
            Assert.IsFalse(result, "Triplet has created");
        }

        [TestMethod]
        public void TripletShouldNotBeCreatedIfTimelineIdIsNotGuid()
        {
            const string timelineId = "not guid";
            const string predicateStr = "czpred:favorite";

            string userId = Guid.NewGuid().ToString();
            string subjectStr = String.Format("czusr:{0}", userId);
            string objectStr = String.Format("cztimeline:{0}", timelineId);
            
            bool result = Storage.PutTriplet(subjectStr, predicateStr, objectStr);
            Assert.IsFalse(result, "Triplet has created");
        }

    }
}
