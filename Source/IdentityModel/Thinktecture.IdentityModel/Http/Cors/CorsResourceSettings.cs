/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsResourceSettings
    {
        CorsFluentSettings settings;

        internal CorsResourceSettings(CorsFluentSettings settings)
        {
            this.settings = settings;
        }

        public CorsFluentSettings ForOrigins(params string[] origins)
        {
            if (origins == null || origins.Length == 0)
            {
                throw new ArgumentException("origins is null or empty.");
            }
            settings.SetOrigins(origins);
            return settings;
        }

        public CorsFluentSettings ForAllOrigins()
        {
            settings.SetOrigins(null);
            return settings;
        }

        public CorsFluentSettings AllowAllOrigins()
        {
            return this.ForAllOrigins().AllowAll();
        }

        public CorsFluentSettings AllowAllOriginsAllMethods()
        {
            return this.ForAllOrigins().AllowAllMethods();
        }
        
        public CorsFluentSettings AllowAllOriginsAllMethodsAndAllRequestHeaders()
        {
            return this.ForAllOrigins().AllowAllMethodsAndAllRequestHeaders();
        }
    }
}
