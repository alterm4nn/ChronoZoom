using System;
using System.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Runtime.Caching;

namespace Chronozoom.UI
{
    [SuppressMessage("Microsoft.Naming", "CA1710:IdentifiersShouldHaveCorrectSuffix")]
    public sealed class StorageCache : MemoryCache
    {
        private Lazy<TimeSpan> _expirationSpan = new Lazy<TimeSpan>(() =>
            {
                return new TimeSpan(0, int.Parse(ConfigurationManager.AppSettings["CacheDuration"], CultureInfo.InvariantCulture), 0);
            });

        public StorageCache() : base("Storage")
        {
            
        }

        public void Add(string cacheKey, object data)
        {
            CacheItemPolicy policy = new CacheItemPolicy();
            policy.SlidingExpiration = _expirationSpan.Value;

            Add(cacheKey, data, policy);
        }
    }
}