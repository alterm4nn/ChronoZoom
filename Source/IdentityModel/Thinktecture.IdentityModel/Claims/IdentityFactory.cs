using Microsoft.IdentityModel.Claims;

namespace Thinktecture.IdentityModel.Claims
{
    public static class IdentityFactory
    {
        public static ClaimsIdentity Create(string authenticationType, params Claim[] claims)
        {
            return new ClaimsIdentity(claims, authenticationType);
        }
    }
}
