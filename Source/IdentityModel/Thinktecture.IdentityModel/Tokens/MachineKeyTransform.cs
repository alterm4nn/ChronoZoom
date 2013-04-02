using System;
using System.Text;
using System.Web.Security;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Tokens
{
    public class MachineKeyTransform : CookieTransform
    {
        public override byte[] Decode(byte[] encoded)
        {
            if (encoded == null)
            {
                throw new ArgumentNullException("encoded");
            }
            return MachineKey.Decode(Encoding.UTF8.GetString(encoded), MachineKeyProtection.All);
        }

        public override byte[] Encode(byte[] value)
        {
            if (value == null)
            {
                throw new ArgumentNullException("value");
            }
            return Encoding.UTF8.GetBytes(MachineKey.Encode(value, MachineKeyProtection.All));
        }
    }
}
