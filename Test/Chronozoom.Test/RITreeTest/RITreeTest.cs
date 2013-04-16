using System;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Chronozoom.Entities;


namespace Chronozoom.Test.RITreeTest
{
    [TestClass]
    public class RITreeTest
    {
        private readonly int num_timelines = 10000;   /* difference in query time was negligible for n == 10000 or n == 100000 on commodity hardware */
        private readonly Int64 offset = -13700000001;
        private readonly Int64 max_time = 13700004000;
        private RITreeTestStorage _storage;
        private Timeline[] random_timelines;

        [TestInitialize]
        public void TestInitialize()
        {
            _storage = new RITreeTestStorage();
            foreach (Timeline t in _storage.Timelines)
            {
                _storage.Timelines.Remove(t);
            }
            foreach (Bitmask b in _storage.Bitmasks)
            {
                _storage.Bitmasks.Remove(b);
            }
            _storage.SaveChanges();
            Int64 v = 1;
            for (int r = 0; r < 63; ++r)
            {
                Bitmask b = new Bitmask();
                b.ID = r;  /* this is just a placeholder */
                b.B1 = -(v << 1);
                b.B2 = v;
                b.B3 = v << 1;
                _storage.Bitmasks.Add(b);
                v <<= 1;
            }
            _storage.SaveChanges();
            Random rand = new Random();
            random_timelines = new Timeline[num_timelines];
            Console.WriteLine("adding " + num_timelines + " random timelines");
            for (int i = 0; i < num_timelines; ++i)
            {
                Int64 start = (Int64)Math.Floor(rand.NextDouble() * (max_time - 1));
                Int64 end = (Int64)Math.Floor(rand.NextDouble() * (max_time - start)) + start;
                Timeline t = new Timeline();
                t.Id = Guid.NewGuid();
                t.FromYear = (decimal)start - 13700000001;
                t.ToYear = (decimal)end - 13700000001;
                t.ForkNode = Storage.ForkNode((Int64)t.FromYear, (Int64)t.ToYear);
                t.Regime = "RITreeTestTimeline";
                random_timelines[i] = _storage.Timelines.Add(t);
            }
            _storage.SaveChanges();
        }
        
        [TestCleanup]
        public void TestCleanup()
        {
            foreach (Timeline t in _storage.Timelines)
            {
                _storage.Timelines.Remove(t);
            }
            foreach (Bitmask b in _storage.Bitmasks)
            {
                _storage.Bitmasks.Remove(b);
            }         
        }

        [TestMethod]
        public void TestRITree()
        {   /* test correctness of ForkNode computations */
            Int64 count1, count2, test_start_time = -7333311, test_end_time = 2013;
            Int64 start = test_start_time + 13700000001, end = test_end_time + 13700000001;
            Debug.Assert(Storage.ForkNode(offset + 3, offset + 7) == 4);
            Debug.Assert(Storage.ForkNode(offset + 29515, offset + 30500) == 29696);
            Debug.Assert(Storage.ForkNode(offset + 13700005424, offset + 13700005585) == 13700005504);
            Debug.Assert(Storage.ForkNode(offset + 3970765138, offset + 6840749504) == 4294967296);
            /* check (via random sampling) that the correct ForkNode computation is actually applied to records in DB */
            var r = _storage.Database.SqlQuery<Timeline>("SELECT TOP 10 * FROM Timelines ORDER BY NEWID()");
            foreach (Timeline t in r)
            {
                Console.WriteLine((t.FromYear - offset) + "," + (t.ToYear - offset) + "," + t.ForkNode);
            }
            /* check total number of timelines */
            Console.WriteLine(_storage.Timelines.Local.Count + " timeline(s) found");
            Console.WriteLine("test query interval: [" + test_start_time + "," + test_end_time + "]");
            /* test SQL range query */
            Console.WriteLine("testing SQL range query:");
            long t1 = DateTime.Now.Ticks;
            var r1 = _storage.Database.SqlQuery<Timeline>("SELECT * FROM Timelines WHERE (FromYear >= {0} AND FromYear <= {1}) OR (ToYear >= {0} AND ToYear <= {1}) OR (FromYear >= {0} AND ToYear <= {1}) OR (FromYear <= {0} AND ToYear >= {1})", test_start_time, test_end_time);
            long t2 = DateTime.Now.Ticks;
            count1 = 0;
            Console.WriteLine("time elapsed: " + ((t2 - t1) * 1.0 / TimeSpan.TicksPerMillisecond) + "ms");
            foreach (var r1_t in r1)
            {
                Console.WriteLine(r1_t.Id + ", " + r1_t.FromYear + "," + r1_t.ToYear + "," + r1_t.ForkNode);
                ++count1;
            }
            Console.WriteLine(count1 + " timeline(s) returned");
            /* test RI tree query */
            Console.WriteLine("testing RI-tree query:");
            t1 = DateTime.Now.Ticks;
            var r2 = _storage.Database.SqlQuery<Timeline>("SELECT DISTINCT [Timelines].* FROM [Timelines] JOIN (SELECT (CAST({2} AS BIGINT) & [B1]) AS [node] FROM [Bitmasks] WHERE (CAST({2} AS BIGINT) & [B2]) <> 0) AS [left_nodes] ON [Timelines].[ForkNode] = [left_nodes].[node] AND [Timelines].[ToYear] >= {0} UNION ALL SELECT DISTINCT [Timelines].* FROM [Timelines] JOIN (SELECT ((CAST({3} AS BIGINT) & [B1]) | [B3]) AS [node] FROM [bitmasks] WHERE (CAST({3} AS BIGINT) & [B3]) = 0) AS [right_nodes] ON [Timelines].[ForkNode] = [right_nodes].[node] AND [Timelines].[FromYear] <= {1} UNION ALL SELECT DISTINCT [Timelines].* FROM [Timelines] WHERE [Timelines].[ForkNode] BETWEEN {2} AND {3}", test_start_time, test_end_time, start, end);
            t2 = DateTime.Now.Ticks;
            count2 = 0;
            Console.WriteLine("time elapsed: " + ((t2 - t1) * 1.0 / TimeSpan.TicksPerMillisecond) + "ms");
            foreach (var r2_t in r2)
            {
                Console.WriteLine(r2_t.Id + ", " + r2_t.FromYear + "," + r2_t.ToYear + "," + r2_t.ForkNode);
                ++count2;
            }
            Console.WriteLine(count2 + " timeline(s) returned");
            Debug.Assert(count1 == count2);
        }
    }
}