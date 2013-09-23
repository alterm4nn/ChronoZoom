using System;
using Chronozoom.Entities.Test;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Chronozoom.Entities.UnitTests
{
    public partial class StorageTest : StorageTestBase
    {
        private const int NumTest = 1000; 

        [TestMethod]
        public void TestEntities_DepthField_GeneratedCorrectly()
        {
            var timelineRandomSamples = _storage.Timelines.SqlQuery(String.Format("SELECT TOP {0} * FROM Timelines ORDER BY NEWID()", NumTest));
            foreach (Timeline t in timelineRandomSamples)
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