using System;
using System.Globalization;

namespace RandomDataGenerator
{
    public class RandomDate
    {
        public static CustomDate GetRandomDate(long minYear = -13700000000)
        {
            Random gen = new Random();
            DateTime start = new DateTime(1, 1, 1);
            int range = (DateTime.Today - start).Days;
            DateTime d = start.AddDays(gen.Next(range));
            long year = LongRandom(minYear, DateTime.Today.Year, gen);
            int day = year > 0 ? DateTime.DaysInMonth((int)year, d.Month) : gen.Next(1, 28);
            var month = d.ToString("MMMM", CultureInfo.InvariantCulture);
            return new CustomDate { Day = day, Year = year, MonthName = month, MonthNumber = d.Month };
        }

        private static long LongRandom(long min, long max, Random rand)
        {
            byte[] buf = new byte[8];
            rand.NextBytes(buf);
            long longRand = BitConverter.ToInt64(buf, 0);

            return (Math.Abs(longRand % (max - min)) + min);
        }
    }

    public class CustomDate
    {
        public long Year { get; set; }
        public int Day { get; set; }
        public string MonthName { get; set; }
        public int MonthNumber { get; set; }
    }
}
