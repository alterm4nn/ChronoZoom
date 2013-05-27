using System;
using System.Threading;
using System.Linq;
using System.Diagnostics;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Entities;
using Chronozoom.Entities.Test;


namespace Chronozoom.Entities.Test
{
    [TestClass]
    public class TimelineSubtreeQueryStoredProcTest
    {
        protected Storage _storage = new Storage();

        [TestInitialize]
        public void Initialize()   //wait until database is loaded
        {
            while (_storage.Collections.Count() < 3) { Thread.Sleep(1000); };
        }
        [TestMethod]
        public void TestEntities_SubtreeQueryStoredProc_DataIsCorrect()
        {
            //TODO: actually add tests for correctness
            IEnumerable<TimelineRaw> result = _storage.TimelineSubtreeQuery(new Guid("2b6cd8e0-5833-ceaf-117e-cf74db7fed1f"), new Guid("48fbb8a8-7c5d-49c3-83e1-98939ae2ae67"), new decimal(-6000000000.0), new decimal(-1000000000.0), new decimal(10000.0), 200);
            TraceSource Trace = new TraceSource("Storage", SourceLevels.All);
            Assert.AreEqual(result.Count(), 41);
            Console.WriteLine("" + result.Count());
            foreach (TimelineRaw t in result)
            {
                Console.WriteLine("" + t.Id);
            }
        }
    }
}
