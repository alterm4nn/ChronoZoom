using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Entities;
using Chronozoom.Entities.Migration;
using Chronozoom.Entities.Test;

namespace Chronozoom.Entities.Test
{
    [TestClass]
    public class BreadthFirstSubTreeQueryTest : StorageTest
    {
        private Collection<TimelineRaw> getSubtree(Queue<TimelineRaw> q)
        {
            Collection<TimelineRaw> result = new Collection<TimelineRaw>();
            while (q.Count > 0)
            {
                TimelineRaw t = q.Dequeue();
                result.Add(t);
                var childTimelines = _storage.Database.SqlQuery<TimelineRaw>("select * from Timelines where Timeline_ID = {0}", t.Id);
                foreach (TimelineRaw c in childTimelines){
                    q.Enqueue(c);
                }
            }
            return result;
        }

        [TestInitialize]
        public void Initialize()
        {
            base.Initialize();
            _storage.SaveChanges();

        }

        [TestMethod]
        public void TestEntities_BreadthFirstSubTreeQuery_RetrievesTimelineSubtree()
        {
            int num_timeline = 0, num_timeline_retrieved = 0;
            foreach (Timeline t in _storage.Timelines)
            {
                ++num_timeline;
                if (t.Depth == 0)
                {
                    Queue<TimelineRaw> q = new Queue<TimelineRaw>();
                    TimelineRaw root = new TimelineRaw();
                    root.Id = t.Id;
                    q.Enqueue(root);
                    Collection<TimelineRaw> subtree = getSubtree(q);
                    num_timeline_retrieved += subtree.Count();
                }
            }
            Assert.AreEqual(num_timeline, num_timeline_retrieved);
        }
    }
}