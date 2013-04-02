/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * 
 * This code is licensed under the Microsoft Permissive License (Ms-PL)
 * 
 * SEE: http://www.microsoft.com/resources/sharedsource/licensingbasics/permissivelicense.mspx
 * 
 */

using System;

namespace Thinktecture.IdentityModel.Claims
{
    /// <summary>
    /// Exception for failed claims search operations
    /// </summary>
    [Serializable]
    public class ClaimNotFoundException : Exception
    {
        //
        // For guidelines regarding the creation of new exception types, see
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/cpconerrorraisinghandlingguidelines.asp
        // and
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dncscol/html/csharp07192001.asp
        //

        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimNotFoundException"/> class.
        /// </summary>
        public ClaimNotFoundException() { }
        
        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimNotFoundException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public ClaimNotFoundException(string message) : base(message) { }
        
        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimNotFoundException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="inner">The inner.</param>
        public ClaimNotFoundException(string message, Exception inner) : base(message, inner) { }
        
        /// <summary>
        /// Initializes a new instance of the <see cref="ClaimNotFoundException"/> class.
        /// </summary>
        /// <param name="info">The <see cref="T:System.Runtime.Serialization.SerializationInfo"/> that holds the serialized object data about the exception being thrown.</param>
        /// <param name="context">The <see cref="T:System.Runtime.Serialization.StreamingContext"/> that contains contextual information about the source or destination.</param>
        /// <exception cref="T:System.ArgumentNullException">
        /// The <paramref name="info"/> parameter is null.
        /// </exception>
        /// <exception cref="T:System.Runtime.Serialization.SerializationException">
        /// The class name is null or <see cref="P:System.Exception.HResult"/> is zero (0).
        /// </exception>
        protected ClaimNotFoundException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context)
            : base(info, context) { }
    }
}