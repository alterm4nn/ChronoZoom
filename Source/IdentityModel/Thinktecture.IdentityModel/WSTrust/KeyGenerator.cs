/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Security.Cryptography;

namespace Thinktecture.IdentityModel.WSTrust
{
    public static class KeyGenerator
    {
        private const int _maxKeyIterations = 20;
        private static RandomNumberGenerator _random = RandomNumberGenerator.Create();

        public static byte[] ComputeCombinedKey(byte[] requestorEntropy, byte[] issuerEntropy, int keySizeInBits)
        {
            if (requestorEntropy == null)
            {
                throw new ArgumentNullException("requestorEntropy");
            }
            if (issuerEntropy == null)
            {
                throw new ArgumentNullException("issuerEntropy");
            }
            int num = ValidateKeySizeInBytes(keySizeInBits);
            byte[] array = new byte[num];
            
            using (KeyedHashAlgorithm algorithm = new HMACSHA1())
            {
                algorithm.Key = requestorEntropy;
                byte[] buffer = issuerEntropy;
                byte[] buffer3 = new byte[(algorithm.HashSize / 8) + buffer.Length];
                byte[] buffer4 = null;
                try
                {
                    try
                    {
                        int num2 = 0;
                        while (num2 < num)
                        {
                            algorithm.Initialize();
                            buffer = algorithm.ComputeHash(buffer);
                            buffer.CopyTo(buffer3, 0);
                            issuerEntropy.CopyTo(buffer3, buffer.Length);
                            algorithm.Initialize();
                            buffer4 = algorithm.ComputeHash(buffer3);
                            for (int i = 0; i < buffer4.Length; i++)
                            {
                                if (num2 >= num)
                                {
                                    continue;
                                }
                                array[num2++] = buffer4[i];
                            }
                        }
                    }
                    catch
                    {
                        Array.Clear(array, 0, array.Length);
                        throw;
                    }
                    return array;
                }
                finally
                {
                    if (buffer4 != null)
                    {
                        Array.Clear(buffer4, 0, buffer4.Length);
                    }
                    Array.Clear(buffer3, 0, buffer3.Length);
                    algorithm.Clear();
                }
            }
        }

        private static int ValidateKeySizeInBytes(int keySizeInBits)
        {
            int num = keySizeInBits / 8;
            if (keySizeInBits <= 0)
            {
                throw new ArgumentOutOfRangeException("keySizeInBits");
            }
            if ((num * 8) != keySizeInBits)
            {
                throw new ArgumentOutOfRangeException("keySizeInBits");
            }
            return num;
        }
    }
}