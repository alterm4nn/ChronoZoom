/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public interface IHttpRequestWrapper
    {
        string Resource { get; }
        IDictionary<string, object> Properties { get; }
        string Method { get; }
        string GetHeader(string name);
    }
}
