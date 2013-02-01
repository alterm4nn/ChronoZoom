using System;
using System.Security.Cryptography;
using Framework.UserActions;

namespace Framework.Helpers
{
    public class CommonHelper : CommonActions
    {
        public string GenerateString(int lengthMin, int lengthMax, string pasChars = "1234567890abcdefghijklmopkqrstuvwxyzQAZWSXEDCRFVTGBYHNUJMIKLOP", bool cryptoRnd = true)
        {
            if (lengthMin == lengthMax && lengthMax == 0)
            {
                return pasChars;
            }
            var result = "";
            var systemRandom = new Random();
            var stringLength = systemRandom.Next(lengthMin, lengthMax);
            for (var i = 1; i <= stringLength; i++)
                result += Convert.ToChar(pasChars[cryptoRnd ? (int)Rnd((uint)(pasChars.Length - 1)) : systemRandom.Next(pasChars.Length - 1)]);
            return result;
        }

        public int GetRandomInt(int min, int max)
        {
            var systemRandom = new Random();
            return systemRandom.Next(min, max);
        }

        public string GetGeneratedGuid()
        {
            return Guid.NewGuid().ToString();
        }

        public string GetNormalizeCode(string text)
        {
            Logger.Log("<-- text: " + text);
            string normalizeText = GetNormalizeText(text);
            Logger.Log("--> normalize text:  " + normalizeText);
            return normalizeText;
        }

        private static string GetNormalizeText(string code)
        {
            return code.Replace("\n", String.Empty).Replace("\r", String.Empty).Replace(" ", String.Empty);
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