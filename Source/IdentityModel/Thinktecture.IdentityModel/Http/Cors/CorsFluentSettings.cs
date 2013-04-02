/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsFluentSettings
    {
        CorsConfiguration config;
        IEnumerable<string> Resources;
        bool ResourcesFrozen;
        IEnumerable<string> origins;
        bool originsFrozen;
        List<CorsConfigurationEntry> entries;
        bool added = false;

        internal CorsFluentSettings(CorsConfiguration config)
        {
            this.config = config;
        }

        bool Frozen
        {
            get { return entries != null; }
        }

        internal void SetResources(string[] resources)
        {
            if (ResourcesFrozen)
            {
                throw new ArgumentException("FluentSettings already initialized with resources.");
            }
            ResourcesFrozen = true;
            this.Resources = resources;
            CheckInit();
        }

        internal void SetOrigins(string[] origins)
        {
            if (originsFrozen)
            {
                throw new ArgumentException("FluentSettings already initialized with origins.");
            }
            originsFrozen = true;
            this.origins = origins;
            CheckInit();
        }

        private void CheckInit()
        {
            if (entries == null && ResourcesFrozen && originsFrozen)
            {
                entries = new List<CorsConfigurationEntry>();

                if (Resources == null)
                {
                    // all Resources
                    if (origins == null)
                    {
                        // all origins
                        var item =
                            new CorsConfigurationEntry
                            {
                                AllResources = true,
                                AllowAnyOrigin = true
                            };
                        entries.Add(item);
                    }
                    else
                    {
                        // specific origins
                        var items =
                            from o in origins
                            select new CorsConfigurationEntry
                            {
                                AllResources = true,
                                Origin = o
                            };
                        entries.AddRange(items);
                    }
                }
                else
                {
                    // specific Resources
                    if (origins == null)
                    {
                        // all origins
                        var items =
                            from c in Resources
                            select new CorsConfigurationEntry
                            {
                                Resource = c,
                                AllowAnyOrigin = true
                            };
                        entries.AddRange(items);
                    }
                    else
                    {
                        // specific origins
                        var items =
                            from c in Resources
                            from o in origins
                            select new CorsConfigurationEntry
                            {
                                Resource = c,
                                Origin = o
                            };
                        entries.AddRange(items);
                    }
                }
            }
        }

        void EnsureAdded()
        {
            if (added) return;
            foreach (var entry in entries)
            {
                this.config.Add(entry);
            }
            added = true;
        }

        public CorsFluentSettings AllowAll()
        {
            return this.AllowAllMethodsAndAllRequestHeaders().AllowCookies();
        }

        public CorsFluentSettings AllowAllMethodsAndAllRequestHeaders()
        {
            return this.AllowAllMethods().AllowAllRequestHeaders();
        }

        public CorsFluentSettings AllowAllMethods()
        {
            this.EnsureAdded();
            foreach (var item in this.entries)
            {
                item.AllowAllMethods = true;
            }
            return this;
        }

        public CorsFluentSettings AllowMethods(params string[] methods)
        {
            if (methods == null || methods.Length == 0)
            {
                throw new ArgumentException("methods is null or empty.");
            }
            this.EnsureAdded();
            foreach (var item in this.entries)
            {
                methods = methods.Select(x => x.ToUpper()).ToArray();
                item.Methods = methods.Union(item.Methods ?? Enumerable.Empty<string>()).Distinct();
            }
            return this;
        }

        public CorsFluentSettings AllowAllRequestHeaders()
        {
            this.EnsureAdded();
            foreach (var item in this.entries)
            {
                item.AllowAllRequestedHeaders = true;
            }
            return this;
        }
        public CorsFluentSettings AllowRequestHeaders(params string[] headers)
        {
            if (headers == null || headers.Length == 0)
            {
                throw new ArgumentException("headers is null or empty.");
            }
            this.EnsureAdded();
            foreach (var item in this.entries)
            {
                item.RequestHeaders = headers.Union(item.RequestHeaders ?? Enumerable.Empty<string>()).Distinct();
            }
            return this;
        }

        public CorsFluentSettings AllowResponseHeaders(params string[] headers)
        {
            if (headers == null || headers.Length == 0)
            {
                throw new ArgumentException("headers is null or empty.");
            }
            this.EnsureAdded();
            foreach (var item in this.entries)
            {
                item.ResponseHeaders = headers.Union(item.ResponseHeaders ?? Enumerable.Empty<string>()).Distinct();
            }
            return this;
        }

        public CorsFluentSettings AllowCookies()
        {
            this.EnsureAdded();
            foreach (var item in this.entries)
            {
                item.AllowCookies = true;
            }
            return this;
        }
    }
}
