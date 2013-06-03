using System;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Entities;
using Chronozoom.Entities.Migration;
using Chronozoom.Entities.Test;

namespace Chronozoom.Entities.Test
{
    [TestClass]
    public class PostOrderRetrievalTest:StorageTest
    {
        [TestInitialize]
        public void Initialize()
        {
            base.Initialize();
            _storage.SaveChanges();
             
        }

        [TestMethod]
        public void TestEntities_PostOrderRetrieval_RetrievesTimelineSubtree()
        {
            int num_timeline = 0, num_timeline_retrieved = 0;
            _storage.CreatePostOrderIndex();
            foreach (Timeline t in _storage.Timelines)
            {   
                ++num_timeline;
                if (t.Depth == 0)
                {
                    ++num_timeline_retrieved;
                    if (t.FirstNodeInSubtree != null)
                    {
                        for (Timeline c = _storage.Timelines.Where(_c => _c.Id == t.FirstNodeInSubtree).FirstOrDefault(); c != t; c = _storage.Timelines.Where(_c => _c.Id == c.Successor).FirstOrDefault()){
                            ++num_timeline_retrieved;
                        }
                    }
                }
                
            }
            Assert.AreEqual(num_timeline, num_timeline_retrieved);
        }
    }
}