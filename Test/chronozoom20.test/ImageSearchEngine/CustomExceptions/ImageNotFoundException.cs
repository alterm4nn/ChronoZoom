using System;

namespace ImageSearchEngine.CustomExceptions
{
    public class ImageNotFoundException : Exception
    {
        public ImageNotFoundException()
        {
        }

        public ImageNotFoundException(string message)
            : base(message) { }
    }


}