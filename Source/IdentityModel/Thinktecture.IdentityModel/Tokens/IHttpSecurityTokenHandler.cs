using System.IdentityModel.Tokens;

namespace Thinktecture.IdentityModel.Tokens
{
    public interface IHttpSecurityTokenHandler
    {
        bool CanReadToken(string tokenString);
        SecurityToken ReadToken(string tokenString);
    }
}
