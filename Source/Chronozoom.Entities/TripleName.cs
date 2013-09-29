using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;

namespace Chronozoom.Entities
{
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

        private static readonly Regex _prefixReg = new Regex(@"^([a-z0-9]+):([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex _namespaceReg = new Regex(@"^http://(?:www.)*chronozoom.com/([a-z0-9]+)#([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public static TripleName Parse(string name)
        {
            var mp = _prefixReg.Match(name);
            if (mp.Success)
                return new TripleName(null, mp.Groups[1].Value, mp.Groups[2].Value);
            var mn = _namespaceReg.Match(name);
            if (mn.Success)
                return new TripleName(mp.Groups[1].Value, null, mp.Groups[2].Value);
            elsehttp://localhost:4949/api/Twitter.svc.cs
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

        public static readonly Dictionary<String, String> PrefixesAndNamespaces = new Dictionary<string, string>
        { 
            { UserPrefix, "http://www.chronozoom.com/users#"},
            { PredicatePrefix, "http://www.chronozoom.com/preds#"},
            { TimelinePrefix, "http://chronozoom.com/timeline#"},
            { ExhibitPrefix, "http://chronozoom.com/exhibit#"},
            { ArtifactPrefix, "http://chronozoom.com/artifact#"},
            { ConstantPrefix, "http://chronozoom.com/constant#"},
        };
    }
}
