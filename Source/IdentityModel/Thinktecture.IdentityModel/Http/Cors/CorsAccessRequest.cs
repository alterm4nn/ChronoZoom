/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System.Collections.Generic;
using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsAccessRequest
    {
        IHttpRequestWrapper httpRequest;
        
        public CorsAccessRequest(IHttpRequestWrapper httpRequest)
        {
            this.httpRequest = httpRequest;
        }

        public string Resource
        {
            get
            {
                return httpRequest.Resource;
            }
        }

        public IDictionary<string, object> Properties
        {
            get
            {
                return httpRequest.Properties;
            }
        }
        public string Origin
        {
            get
            {
                return httpRequest.GetHeader(CorsConstants.RequestHeader_Orign);
            }
        }

        public bool IsCors
        {
            get
            {
                return this.Origin != null;
            }
        }

        public bool IsCorsPreflight
        {
            get
            {
                return
                    this.httpRequest.Method == "OPTIONS" &&
                    this.IsCors &&
                    this.RequestedMethod != null;
            }
        }

        public bool IsCorsSimple
        {
            get
            {
                return
                    this.IsCors &&
                    !this.IsCorsPreflight;
            }
        }

        public string RequestedMethod
        {
            get
            {
                return this.httpRequest.GetHeader(CorsConstants.RequestHeader_RequestedMethod);
            }
        }
        
        public IEnumerable<string> RequestedHeaders
        {
            get
            {
                var val = this.httpRequest.GetHeader(CorsConstants.RequestHeader_RequestedHeaders);
                if (val != null)
                {
                    return val.Split(',').Select(x => x.Trim()).Distinct();
                }
                return Enumerable.Empty<string>();
            }
        }
    }
}
