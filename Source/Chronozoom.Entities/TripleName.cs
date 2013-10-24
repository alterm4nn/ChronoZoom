using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;

namespace Chronozoom.Entities
{
    /// <summary>Describes triple full name with name, namespace and prefix.
    /// Namespace or prefix may be absent</summary>
    public struct TripleName
    {
        private readonly string name, ns, prefix;

        public TripleName(string ns, string prefix, string name)
        {
            if(ns == null && prefix == null)
                throw new ArgumentException("Both namespace and prefix cannot be null", "name");

            this.prefix = prefix;
            this.ns = ns;
            this.name = name;
        }

        public string Name
        {
            get { return name; }
        }

        public string Namespace
        {
            get { return ns; }
        }

        public string Prefix 
        {
            get { return prefix; }
        }

        private static readonly Regex _prefixReg = new Regex(@"^([a-z0-9_]+):([a-z0-9_\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex _namespaceReg = new Regex(@"^http://(?:www.)*chronozoom.com/([a-z0-9]+)#([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        /// <summary>Parses string as full triple name</summary>
        /// <param name="name">String with full triple name</param>
        /// <returns>TripleName object</returns>
        public static TripleName Parse(string name)
        {
            var mp = _prefixReg.Match(name);
            if (mp.Success)
                return new TripleName(null, mp.Groups[1].Value, mp.Groups[2].Value);
            var mn = _namespaceReg.Match(name);
            if (mn.Success)
                return new TripleName(mp.Groups[1].Value, null, mp.Groups[2].Value);
            else
                throw new ArgumentException("Name does not have valid prefix or namespace");
        }

        public override string ToString()
        {
            return prefix != null ? String.Format("{0}:{1}", prefix, name) : String.Format("{0}:{1}", ns, name);
        }

        public string ToExpandedString()
        {
            return ns != null ? String.Format("{0}:{1}", ns, name) : String.Format("{0}:{1}", prefix, name);
        }

        public const string UserPrefix = "czusr";
        public const string TimelinePrefix = "cztimeline";
        public const string ExhibitPrefix = "czexhibit";
        public const string ArtifactPrefix = "czartifact";
        public const string PredicatePrefix = "czpred";
        public const string ConstantPrefix = "czconstant";
        public const string TourPrefix = "cztour";

        public static readonly Dictionary<String, String> PrefixesAndNamespaces = new Dictionary<string, string>
        { 
            // ChronoZoom specific prefixes
            { UserPrefix, "http://www.chronozoom.com/users#"},
            { PredicatePrefix, "http://www.chronozoom.com/preds#"},
            { TimelinePrefix, "http://www.chronozoom.com/timeline#"},
            { ExhibitPrefix, "http://www.chronozoom.com/exhibit#"},
            { ArtifactPrefix, "http://www.chronozoom.com/artifact#"},
            { ConstantPrefix, "http://www.chronozoom.com/constant#"},
            { TourPrefix, "http://www.chronozoom.com/tour#" },

            // Well known prefixes that might come useful
            { "rdfs", "http://www.w3.org/2000/01/rdf-schema#" },
            { "rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
            { "dc", "http://purl.org/dc/elements/1.1/" },
            { "foaf", "http://xmlns.com/foaf/0.1/" },
            { "owl", "http://www.w3.org/2002/07/owl#" },
            { "xsd", "http://www.w3.org/2001/XMLSchema#" },
            { "geo", "http://www.w3.org/2003/01/geo/wgs84_pos#" },
            { "bfo", "http://ifomis.org/bfo/1.1" }
        };
    }
}
