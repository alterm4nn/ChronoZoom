using System;
using System.Web.Security;

namespace Thinktecture.IdentityModel.Tokens
{
    class MachineKeyMetadataCache : IMetadataCache
    {
        IMetadataCache inner;
        public MachineKeyMetadataCache(IMetadataCache inner)
        {
            if (inner == null) throw new ArgumentNullException("inner");

            this.inner = inner;
        }

        public TimeSpan Age
        {
            get { return inner.Age; }
        }

        public byte[] Load()
        {
            var bytes = inner.Load();
            try
            {
                var str = System.Text.Encoding.UTF8.GetString(bytes); 
                return MachineKey.Decode(str, MachineKeyProtection.All);
            }
            catch
            {
                inner.Save(null);
            }
            return null;
        }

        public void Save(byte[] data)
        {
            var str = MachineKey.Encode(data, MachineKeyProtection.All);
            data = System.Text.Encoding.UTF8.GetBytes(str);
            inner.Save(data);
        }
    }
}
