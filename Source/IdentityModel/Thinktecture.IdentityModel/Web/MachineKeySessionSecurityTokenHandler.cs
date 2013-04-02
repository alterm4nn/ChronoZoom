/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Web
{
    public class MachineKeySessionSecurityTokenHandler : SessionSecurityTokenHandler
    {
        public MachineKeySessionSecurityTokenHandler()
            : base(CreateTransforms())
        { }

        public MachineKeySessionSecurityTokenHandler(SecurityTokenCache cache, TimeSpan tokenLifetime)
            : base(CreateTransforms(), cache, tokenLifetime)
        { }

        private static ReadOnlyCollection<CookieTransform> CreateTransforms()
        {
            return new List<CookieTransform>
                {
                    new DeflateCookieTransform(),
                    new MachineKeyCookieTransform()
                }.AsReadOnly();
        }
    }
}
