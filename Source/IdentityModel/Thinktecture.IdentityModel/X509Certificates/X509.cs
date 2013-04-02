using System.Security.Cryptography.X509Certificates;

namespace Thinktecture.IdentityModel
{
    public static class X509
    {
        public static X509CertificatesLocation CurrentUser 
        { 
            get
            {
                return new X509CertificatesLocation(StoreLocation.CurrentUser);
            }
        }

        public static X509CertificatesLocation LocalMachine
        {
            get
            {
                return new X509CertificatesLocation(StoreLocation.LocalMachine);
            }
        }
    }
}
