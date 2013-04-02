﻿using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace Thinktecture.IdentityModel
{
    [EditorBrowsable(EditorBrowsableState.Never)]
    public class X509CertificatesFinder
    {
        StoreLocation _location;
        StoreName _name;
        X509FindType _findType;
        
        public X509CertificatesFinder(StoreLocation location, StoreName name, X509FindType findType)
        {
            _location = location;
            _name = name;
            _findType = findType;
        }

        public IEnumerable<X509Certificate2> Find(object findValue, bool validOnly = true)
        {
            var certs = new List<X509Certificate2>();

            var store = new X509Store(_name, _location);
            try
            {
                store.Open(OpenFlags.ReadOnly);

                var certColl = store.Certificates.Find(_findType, findValue, validOnly);
                return certColl.Cast<X509Certificate2>();
            }
            finally
            {
                store.Close();
            }
        }

        //public X509Certificate2 FindFirst(object findValue, bool validOnly = true)
        //{
        //    return FindAll(findValue, validOnly).FirstOrDefault();
        //}
    }
}
