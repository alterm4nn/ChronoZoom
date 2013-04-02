/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */


namespace Thinktecture.IdentityModel.Http.Cors.IIS
{
    public class UrlBasedCorsConfiguration
    {
        static UrlBasedCorsConfiguration()
        {
            Configuration = new CorsConfiguration();
        }

        public static CorsConfiguration Configuration { get; set; }    
    }
}
