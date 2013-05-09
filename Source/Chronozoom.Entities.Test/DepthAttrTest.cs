using System;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Entities;
using Chronozoom.Entities.Test;


namespace Chronozoom.Entities.Test
{
    
    [TestClass]
    public class DepthAttrTest : StorageTest
    {
        private const int NUM_TEST = 1000; 
        [TestInitialize]
        public void Initialize()
        {
            base.Initialize();
            _storage.SaveChanges();
        }

        [TestMethod]
        public void TestDepthAttr()
        {
            var timeline_random_samples = _storage.Timelines.SqlQuery(String.Format("SELECT TOP {0} * FROM Timelines ORDER BY NEWID()", NUM_TEST));
            foreach (Timeline t in timeline_random_samples)
            {
                if (t.ChildTimelines != null)
                {
                    foreach (Timeline c in t.ChildTimelines)
                    {
                        Assert.AreEqual(t.Depth + 1, c.Depth);
                    }
                }
                if (t.Exhibits != null)
                {
                    foreach (Exhibit e in t.Exhibits)
                    {
                        Assert.AreEqual(t.Depth + 1, e.Depth);
                        if (e.ContentItems != null)
                        {
                            foreach (ContentItem ci in e.ContentItems)
                            {
                                Assert.AreEqual(e.Depth + 1, ci.Depth);
                            }
                        }
                    }
                }
            }
        }
    }
}