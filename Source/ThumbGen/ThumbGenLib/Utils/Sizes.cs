using System;
using System.Windows;

namespace ThumbGen
{
    public static partial class Utils
    {
        public static Size[] GetSizes()
        {
            int inc = 3;

            Size[] ImageSizes = new Size[5];
            for (int p = 0; p < 5; p++)
            {
                ImageSizes[p] = new Size((int)Math.Pow(2, (double)(p + inc)), (int)Math.Pow(2, (double)(p + inc)));
            }

            return ImageSizes;
        }


    }
}
