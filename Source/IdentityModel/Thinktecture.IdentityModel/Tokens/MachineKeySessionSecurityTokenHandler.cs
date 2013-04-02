using System;
using System.Collections.ObjectModel;
using Microsoft.IdentityModel;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Web;

namespace Thinktecture.IdentityModel.Tokens
{
    public class MachineKeySessionSecurityTokenHandler : SessionSecurityTokenHandler
    {
        private static ReadOnlyCollection<CookieTransform> MachineKeyTransforms;

        static MachineKeySessionSecurityTokenHandler()
        {
            MachineKeyTransforms = new ReadOnlyCollection<CookieTransform>(
                new CookieTransform[] { 
                    new DeflateCookieTransform(), new MachineKeyTransform() });
        }

        public MachineKeySessionSecurityTokenHandler()
            : base(MachineKeyTransforms)
        {
        }

        public MachineKeySessionSecurityTokenHandler(TimeSpan tokenLifetime)
            : base(MachineKeyTransforms, new MruSecurityTokenCache(), tokenLifetime)
        {
        }
    }
}
