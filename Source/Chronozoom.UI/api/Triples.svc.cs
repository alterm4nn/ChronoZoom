using Chronozoom.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC : ITriplesAPI
    {
        public IEnumerable<Entities.Triple> GetTriplet(string subject, string predicate)
        {
            return ApiOperation<IEnumerable<Entities.Triple>>(delegate(User user, Storage storage) 
            {
                if (user == null) return null;
                if (user.Id.ToString() == storage.GetValue(subject))
                {
                    return storage.GetTriplet(subject, predicate);
                }
                else
                {
                    return null;
                }
            });
        }

        public IEnumerable<Entities.Triple> GetTriplet2(string subject, string predicate, string @object)
        {
            return ApiOperation<IEnumerable<Entities.Triple>>(delegate(User user, Storage storage)
            {
                if (user == null) return null;
                if (user.Id.ToString() == storage.GetValue(subject))
                {
                    return storage.GetTriplet(subject, predicate, @object);
                }
                else
                {
                    return null;
                }
            });
        }

        public bool DeleteTriplet(string subject, string predicate, string @object)
        {
            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null) return false;
                if (user.Id.ToString() == storage.GetValue(subject))
                {
                    return storage.DeleteTriplet(subject, predicate, @object);
                }
                else
                {
                    return false;
                }
            });
        }

        public bool PutTriplet(string subject, string predicate, string @object)
        {
            return ApiOperation<bool>(delegate(User user, Storage storage)
            {
                if (user == null) return false;
                if (user.Id.ToString() == storage.GetValue(subject))
                {
                    return storage.PutTriplet(subject, predicate, @object);
                }
                else
                {
                    return false;
                }
            });
        }


        public bool SetPrefix(string prefix, string @namespace)
        {
            //Not implemented
            //Prefixes aren't user associated, need to think about security policy
            return false;
        }

        public bool DeletePrefix(string prefix, string @namespace)
        {
            //Not implemented
            //Prefixes aren't user associated, need to think about security policy
            return false;
        }

        public Dictionary<string,string> GetPrefixes()
        {
            return ApiOperation<Dictionary<string, string>>(delegate(User user, Storage storage)
            {
                var d = new Dictionary<string,string>();

                foreach (var p in storage.TriplePrefixes)
                    d.Add(p.Prefix, p.Namespace);

                foreach (var p in storage.PrefixesAndNamespaces)
                    d.Add(p.Key, p.Value);
                return d;
            });

        }
    }
}