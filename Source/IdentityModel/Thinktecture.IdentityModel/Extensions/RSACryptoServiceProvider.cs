/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Diagnostics.Contracts;
using System.Security.Cryptography;
using System.Text;

namespace Thinktecture.IdentityModel.Extensions
{
    /// <summary>
    /// Extension methods for RSACryptoServiceProvider
    /// </summary>
    public static class RSAExtensions
    {
        /// <summary>
        /// Calculates a hash for an RSA key.
        /// </summary>
        /// <param name="rsa">The RSA key.</param>
        /// <returns>The hash byte array</returns>
        public static byte[] GetKeyHash(this RSA rsa)
        {
            Contract.Requires(rsa != null);
            Contract.Ensures(Contract.Result<byte[]>() != null);
            Contract.Ensures(Contract.Result<byte[]>().Length > 0);

            return rsa.GetKeyHash(string.Empty);
        }

        /// <summary>
        /// Calculates a hash string for an RSA key.
        /// </summary>
        /// <param name="rsa">The RSA key.</param>
        /// <returns>The hash string</returns>
        public static string GetKeyHashString(this RSA rsa)
        {
            Contract.Requires(rsa != null);
            Contract.Ensures(!String.IsNullOrEmpty(Contract.Result<string>()));


            return Convert.ToBase64String(rsa.GetKeyHash(string.Empty));
        }

        /// <summary>
        /// Calculates a hash string for an RSA key.
        /// </summary>
        /// <param name="rsa">The RSA Key</param>
        /// <param name="entropy">Additional entropy.</param>
        /// <returns>The hash string</returns>
        public static string GetKeyHashString(this RSA rsa, string entropy)
        {
            Contract.Requires(rsa != null);
            Contract.Requires(entropy != null);
            Contract.Ensures(!String.IsNullOrEmpty(Contract.Result<string>()));


            return Convert.ToBase64String(rsa.GetKeyHash(entropy));
        }

        /// <summary>
        /// Calculates a hash for an RSA key.
        /// </summary>
        /// <param name="rsa">The RSA key.</param>
        /// <param name="entropy">Additional entropy.</param>
        /// <returns>The hash byte array</returns>
        public static byte[] GetKeyHash(this RSA rsa, string entropy)
        {
            Contract.Requires(rsa != null);
            Contract.Requires(entropy != null);
            Contract.Ensures(Contract.Result<byte[]>() != null);
            Contract.Ensures(Contract.Result<byte[]>().Length > 0);


            int entropyLength = Encoding.UTF8.GetByteCount(entropy);
            RSAParameters rsaParams = rsa.ExportParameters(false);
            byte[] shaInput = new byte[rsaParams.Modulus.Length + rsaParams.Exponent.Length + entropyLength];
            byte[] shaOutput;

            int i = 0;
            rsaParams.Modulus.CopyTo(shaInput, i);
            i += rsaParams.Modulus.Length;
            rsaParams.Exponent.CopyTo(shaInput, i);
            i += rsaParams.Exponent.Length;
            i += Encoding.UTF8.GetBytes(entropy, 0, entropy.Length, shaInput, i);

            using (SHA256 sha = SHA256.Create())
            {
                shaOutput = sha.ComputeHash(shaInput);
            }

            return shaOutput;
        }
    }
}
