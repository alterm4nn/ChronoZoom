/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

using System;
using System.Collections.Generic;
using System.Linq;

namespace Thinktecture.IdentityModel.Http.Cors
{
    public class CorsConfiguration
    {
        public CorsEngine Engine { get; private set; }
        public int? DefaultCacheDuration { get; set; }
        public Func<CorsAccessRequest, CorsConfigurationAllowProperties> DynamicConfigurationCallback { get; set; }
        public Func<CorsAccessRequest, CorsConfigurationAllowProperties, CorsConfigurationAllowProperties> StaticConfigurationAccessFilter { get; set; }

        private List<CorsConfigurationEntry> settings = new List<CorsConfigurationEntry>();

        public CorsConfiguration()
        {
            Engine = new CorsEngine(this);
            DefaultCacheDuration = CorsConstants.DefaultCacheDurationInSeconds;
        }

        public void Add(CorsConfigurationEntry entry)
        {
            // entry validation
            if (entry.AllResources && entry.Resource != null)
            {
                throw new ArgumentException("Resource not allowed if configured as AllResources.");
            }

            if (!entry.AllResources && String.IsNullOrEmpty(entry.Resource))
            {
                throw new ArgumentException("Resource required.");
            }

            if (entry.AllowAnyOrigin && entry.Origin != null)
            {
                throw new ArgumentException("Origin not allowed if configured as AllowAnyOrigin.");
            }

            if (!entry.AllowAnyOrigin && String.IsNullOrEmpty(entry.Origin))
            {
                throw new ArgumentException("Origin required.");
            }

            // entry relative to other registered settings validation
            if (entry.AllResources && entry.AllowAnyOrigin && FindAnyResourceForAnyOrigin() != null)
            {
                throw new InvalidOperationException("Entry already registered for AllResources and AllowAnyOrigin.");
            }

            if (entry.AllowAnyOrigin && !entry.AllResources && FindByResourceAnyOrigin(entry.Resource) != null)
            {
                throw new InvalidOperationException("Resource '" + entry.Resource + "' already registered for AllowAnyOrigin.");
            }

            if (!entry.AllowAnyOrigin && entry.AllResources && FindAnyResourceByOrigin(entry.Origin) != null)
            {
                throw new InvalidOperationException("Origin '" + entry.Origin + "' already registered for AllResources.");
            }

            if (!entry.AllowAnyOrigin && !entry.AllResources && FindByResourceAndOrigin(entry.Resource, entry.Origin) != null)
            {
                throw new InvalidOperationException("Resource '" + entry.Resource + "' already registered for Origin '" + entry.Origin + "'.");
            }

            if (entry.CacheDuration == null)
            {
                entry.CacheDuration = this.DefaultCacheDuration;
            }

            settings.Add(entry);
        }

        CorsConfigurationEntry FindByResourceAndOrigin(string resource, string origin)
        {
            var query =
                from item in settings
                where item.AllResources == false
                      && item.AllowAnyOrigin == false
                      && item.Resource.Equals(resource, StringComparison.OrdinalIgnoreCase)
                      && item.Origin.Equals(origin, StringComparison.OrdinalIgnoreCase)
                select item;
            return query.SingleOrDefault();
        }

        CorsConfigurationEntry FindByResourceAnyOrigin(string resource)
        {
            var query =
                from item in settings
                where item.AllResources == false
                      && item.AllowAnyOrigin == true
                      && item.Resource.Equals(resource, StringComparison.OrdinalIgnoreCase)
                select item;
            return query.SingleOrDefault();
        }

        CorsConfigurationEntry FindAnyResourceByOrigin(string origin)
        {
            var query =
                from item in settings
                where item.AllResources == true
                      && item.AllowAnyOrigin == false
                      && item.Origin.Equals(origin, StringComparison.OrdinalIgnoreCase)
                select item;
            return query.SingleOrDefault();
        }

        CorsConfigurationEntry FindAnyResourceForAnyOrigin()
        {
            var query =
                from item in settings
                where item.AllResources == true
                      && item.AllowAnyOrigin == true
                select item;
            return query.SingleOrDefault();
        }

        internal CorsConfigurationEntry GetConfigurationEntryForRequest(CorsAccessRequest accessRequest)
        {
            var configEntry = GetEntryFromStaticConfiguration(accessRequest);
            if (configEntry == null)
            {
                var response = GetEntryFromDynamicConfiguration(accessRequest);
                if (response != null)
                {
                    configEntry = response.EntryFromAllowProperties(accessRequest);
                }
            }
            return configEntry;
        }

        private CorsConfigurationEntry GetEntryFromStaticConfiguration(CorsAccessRequest accessRequest)
        {
            var configSetting = FindByResourceAndOrigin(accessRequest.Resource, accessRequest.Origin);
            if (configSetting == null) configSetting = FindByResourceAnyOrigin(accessRequest.Resource);
            if (configSetting == null) configSetting = FindAnyResourceByOrigin(accessRequest.Origin);
            if (configSetting == null) configSetting = FindAnyResourceForAnyOrigin();

            if (configSetting != null && StaticConfigurationAccessFilter != null)
            {
                var current = configSetting.Clone();
                var response = StaticConfigurationAccessFilter(accessRequest, current);
                if (response == null)
                {
                    // if they pass back null, they're indicating that the origin is not allowed
                    configSetting = null;
                }
                else
                {
                    configSetting = response.EntryFromAllowProperties(accessRequest);
                }
            }

            return configSetting;
        }

        private CorsConfigurationAllowProperties GetEntryFromDynamicConfiguration(CorsAccessRequest accessRequest)
        {
            if (DynamicConfigurationCallback != null)
            {
                return DynamicConfigurationCallback(accessRequest);
            }
            return null;
        }

        public CorsResourceSettings ForResources(params string[] resources)
        {
            if (resources == null || resources.Length == 0)
            {
                throw new ArgumentException("Resources is null or empty.");
            }
            var settings = new CorsFluentSettings(this);
            settings.SetResources(resources);
            return new CorsResourceSettings(settings);
        }

        public CorsResourceSettings ForAllResources()
        {
            var settings = new CorsFluentSettings(this);
            settings.SetResources(null);
            return new CorsResourceSettings(settings);
        }

        public CorsFluentSettings ForOrigins(params string[] origins)
        {
            if (origins == null || origins.Length == 0)
            {
                throw new ArgumentException("origins is null or empty.");
            }
            var settings = new CorsFluentSettings(this);
            settings.SetResources(null);
            settings.SetOrigins(origins);
            return settings;
        }

        public CorsFluentSettings ForAllOrigins()
        {
            var settings = new CorsFluentSettings(this);
            settings.SetResources(null);
            settings.SetOrigins(null);
            return settings;
        }

        public CorsFluentSettings ForAll()
        {
            return ForAllResources().ForAllOrigins();
        }

        public CorsFluentSettings AllowAll()
        {
            return ForAll().AllowAll();
        }

        public CorsFluentSettings AllowAllMethods()
        {
            return ForAll().AllowAllMethods();
        }
        
        public CorsFluentSettings AllowAllMethodsAndAllRequestHeaders()
        {
            return ForAll().AllowAllMethodsAndAllRequestHeaders();
        }
    }
}
