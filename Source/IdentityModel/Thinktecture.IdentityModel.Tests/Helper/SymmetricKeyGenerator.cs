using System.Security.Cryptography;

namespace Thinktecture.IdentityModel.Tests.Helper
{
    internal static class SymmetricKeyGenerator
    {
        public static byte[] Create(int keySize)
        {
            var bytes = new byte[keySize];
            new RNGCryptoServiceProvider().GetBytes(bytes);

            return bytes;
        }
    }
}
