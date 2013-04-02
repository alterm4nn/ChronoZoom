/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Text;
using System.Web.Security;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Web
{
    public class MachineKeyCookieTransform : CookieTransform
    {
        public override byte[] Decode(byte[] encoded)
        {
            return MachineKey.Decode(Encoding.UTF8.GetString(encoded), MachineKeyProtection.All);
        }

        public override byte[] Encode(byte[] value)
        {
            return Encoding.UTF8.GetBytes(MachineKey.Encode(value, MachineKeyProtection.All));
        }
    }
}
