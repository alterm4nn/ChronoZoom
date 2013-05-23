using System;
using System.Diagnostics;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Entities;
using Chronozoom.Entities.Test;


namespace Chronozoom.Entities.Test
{
    [TestClass]
    public class TimelineSubtreeQueryStoredProcTest : StorageTest
    {
        [TestMethod]
        public void TestEntities_SubtreeQueryStoredProc_DataIsCorrect()
        {
            //TODO: actually add tests for correctness
            IEnumerable<Timeline> result = _storage.TimelineSubtreeQuery(new Guid("2b6cd8e0-5833-ceaf-117e-cf74db7fed1f"), new Guid("00000000-0000-0000-0000-000000000000"), -1123828290, -1423828290, 300000000, 2000);
            foreach (Timeline t in result)
            {
                Console.WriteLine(t.Id);
            }
        }
    }
}
