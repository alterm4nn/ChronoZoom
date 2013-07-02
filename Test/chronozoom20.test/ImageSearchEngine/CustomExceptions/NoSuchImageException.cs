using System;

namespace ImageSearchEngine.CustomExceptions
{
    public class NoSuchImageException : Exception
    {
        public NoSuchImageException()
        {
        }

        public NoSuchImageException(string message)
            : base(message) { }
    }


}