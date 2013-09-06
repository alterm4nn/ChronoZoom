using System;
using System.Security.Cryptography;
using System.Text;

namespace RandomDataGenerator
{
    public static class RandomString
    {
        public static string PasChars { get; set; }
        
        public static string GetRandomString(int minLength, int maxLenght, bool isUsingLowerChars = true, bool isUsingUpperChars = true, bool isUsingNumbers = true, bool isUsingSpecChars = false)
        {
            StringBuilder tempString = new StringBuilder();
            
           
            if (isUsingUpperChars) tempString.Append(Dictionaries.UpperChars);
            if (isUsingLowerChars) tempString.Append(Dictionaries.LowerChars);
            if (isUsingNumbers) tempString.Append(Dictionaries.Numbers);
            if (isUsingSpecChars) tempString.Append(Dictionaries.SpecChars);

            PasChars = tempString.ToString();

            if (minLength == maxLenght && maxLenght == 0)
            {
                return PasChars;
            }
            var result = "";
            var systemRandom = new Random();
            var stringLength = systemRandom.Next(minLength, maxLenght);
            for (var i = 1; i <= stringLength; i++)
                result += Convert.ToChar(PasChars[(int)Rnd((uint)(PasChars.Length - 1))]);
            return result;
        }

        private static uint Rnd(uint numSides)
        {
            if (numSides > 0)
            {
                var rndBytes = new byte[(int)(Math.Log(numSides, 256)) + 1];
                (new RNGCryptoServiceProvider()).GetBytes(rndBytes);
                uint rnd = 1;
                for (var i = 0; i < rndBytes.Length; i++) rnd = rnd * (Convert.ToUInt32(rndBytes[i]) + 1);
                if (rnd > numSides) rnd = rnd % numSides + 1;
                return rnd;
            }
            return 0;
        }
    }
}
