using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;

namespace Chronozoom.Entities
{
    public partial class Storage
    {
        private Regex prefixReg = new Regex(@"^([a-z0-9]+):([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private Regex namespaceReg = new Regex(@"^http://(?:www.)*chronozoom.com/([a-z0-9]+)#([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private Dictionary<String, String> prefixesAndNamespaces = new Dictionary<string, string>() 
        { 
            {"czusr","http://www.chronozoom.com/users#"},
            {"czpred","http://www.chronozoom.com/preds#"},
            {"cztimeline", "http://chrnozoom.com/timeline#"}
        };

        /// <summary>
        /// Get object value without prefix and namespace.
        /// </summary>
        /// <param name="str">Object</param>
        /// <returns>Returns value;</returns>
        public string GetValue(string str)
        {
            var mp = prefixReg.Match(str);
            var mn = namespaceReg.Match(str);
            if (mp.Success)
                return mp.Groups[2].Value;
            if (mn.Success)
                return mn.Groups[2].Value;

            return String.Empty;
        }


        /// <summary>
        /// Get prefix by namespace.
        /// </summary>
        /// <param name="fullStr">Namespace string</param>
        /// <returns>Returns prefix.</returns>
        public string GetPrefix(string fullStr)
        {
            var mp = prefixReg.Match(fullStr);
            var mn = namespaceReg.Match(fullStr);
            if (mp.Success)
                return mp.Groups[1].Value;
            if (mn.Success)
                return mn.Groups[1].Value;

            return String.Empty;
        }

        /// <summary>
        /// Get namespace by prefix.
        /// </summary>
        /// <param name="prefixStr">Prefix string</param>
        /// <returns>Returns namespace.</returns>
        public string GetNamespace(string prefixStr)
        {
            if (prefixesAndNamespaces.ContainsKey(prefixStr))
            {
                //Search among standard namespaces
                return prefixesAndNamespaces[prefixStr];
            }
            else
            {
                var tr = TriplePrefixes.FirstOrDefault(x => x.Prefix == prefixStr);
                if (tr != null)
                {
                    //Prefix found in DB
                    return tr.Namespace;
                }
                else
                {
                    //Error: Not found in database
                    return null;
                }
            }
        }

        /// <summary>
        /// Convert to namespace string.
        /// </summary>
        /// <param name="str">prefix string</param>
        /// <returns>Returns namespace string.</returns>
        private string ToNamespaceStr(string str)
        {
            var mp = prefixReg.Match(str);
            if (mp.Success)
            {
                return string.Format("{0}:{1}", GetNamespace(mp.Groups[1].Value), mp.Groups[2].Value);
            }
            else
            {
                var mn = namespaceReg.Match(str);
                if (mn.Success)
                {
                    return str;
                }
                return null;
            }
        }

        /// <summary>
        /// Convert to prefix string.
        /// </summary>
        /// <param name="str">namespace string</param>
        /// <returns>Returns prefix string.</returns>
        private string ToPrefixString(string str)
        {
            var ms = namespaceReg.Match(str);
            if (ms.Success)
            {
                return string.Format("{0}:{1}", GetPrefix(ms.Groups[1].Value), ms.Groups[2].Value);
            }
            else
            {
                var mp = prefixReg.Match(str);
                if (mp.Success)
                {
                    return str;
                }
                return null;
            }
        }

        /// <summary>
        /// Get triple by specified parameters.
        /// </summary>
        /// <param name="subjectStr">Subject</param>
        /// <param name="predicateStr">Predicate</param>
        /// <param name="objectStr">Object</param>
        /// <param name="expandPrefixes">If 'True' returns namespaces, else - prefixes.</param>
        /// <returns>Returns list of triplets.</returns>
        public List<Triple> GetTriplet(string subjectStr, string predicateStr, string objectStr = null, bool expandPrefixes = false)
        {
            //GetTriplet( “czusr:76087518-4f8e-4d3a-9bfb-2fd2332376eb”, “czpred:favorite”, null, null)

            if ((prefixReg.Match(subjectStr).Success || namespaceReg.Match(subjectStr).Success) &&
                (prefixReg.Match(predicateStr).Success || namespaceReg.Match(predicateStr).Success) &&
                ((objectStr != null && (prefixReg.Match(objectStr).Success || namespaceReg.Match(objectStr).Success)) || (objectStr == null)) == false)
                return null;


            IQueryable<Triple> triples;
            if (objectStr == null)
            {
                triples = Triples.Where(t => t.Subject == subjectStr && t.Predicate == predicateStr).Include(o => o.Objects); ;
            }
            else
            {
                triples = Triples.Where(t => t.Subject == subjectStr && t.Predicate == predicateStr).Include(o => o.Objects).Where(t => t.Objects.FirstOrDefault(x => x.Object == objectStr) != null);
            }

            if (expandPrefixes)
            {
                //ToDo:Use Join
                triples.ToList().ForEach(x =>
                {
                    x.Subject = ToNamespaceStr(x.Subject);
                    x.Predicate = ToNamespaceStr(x.Predicate);
                    foreach (var o in x.Objects) o.Object = ToNamespaceStr(o.Object);
                });
            }

            return triples.ToList();
        }

        /// <summary>
        /// Add triple with specified parameters.
        /// </summary>
        /// <param name="subjectStr">Subject</param>
        /// <param name="predicateStr">Predicate</param>
        /// <param name="objectStr">Object</param>
        /// <returns>>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        public bool PutTriplet(string subjectStr, string predicateStr, string objectStr)
        {
            //PutTriplet( “czusr:76087518-4f8e-4d3a-9bfb-2fd2332376eb”, “czpred:favorite”, "cztimeline:3a87bb5c-85f7-4305-8b2f-f2002580cd25")

            if ((prefixReg.Match(subjectStr).Success || namespaceReg.Match(subjectStr).Success) &&
                (prefixReg.Match(predicateStr).Success || namespaceReg.Match(predicateStr).Success) &&
                (prefixReg.Match(objectStr).Success || namespaceReg.Match(objectStr).Success) == false)
                return false;

            var shortSubjectStr = ToPrefixString(subjectStr);
            var shortPredicateStr = ToPrefixString(predicateStr);
            var shortObjectStr = ToPrefixString(objectStr);

            var tr = Triples.Where(t => t.Subject == shortSubjectStr && t.Predicate == shortPredicateStr).Include(o => o.Objects).FirstOrDefault();
            if (tr != null)
            {
                if (tr.Objects.FirstOrDefault(x => x.Object == shortObjectStr) == null)
                {
                    tr.Objects.Add(
                        new TripleObject()
                        {
                            Object = shortObjectStr,
                            TripleObject_Id = Guid.NewGuid()
                        }
                    );
                }
                else
                {
                    return true;
                }
                SaveChanges();
                return true;
            }
            else
            {
                var triple = new Triple()
                {
                    Subject = shortSubjectStr,
                    Predicate = shortPredicateStr,
                    Id = Guid.NewGuid(),
                    Objects = new Collection<TripleObject>() 
                        { 
                            new TripleObject() 
                            { 
                                Object = shortObjectStr,
                                TripleObject_Id = Guid.NewGuid()
                            } 
                        }
                };
                Triples.Add(triple);
                SaveChanges();
                return true;
            }
        }

        /// <summary>
        /// Delete triple with specified parameters.
        /// </summary>
        /// <param name="subjectStr">Subject</param>
        /// <param name="predicateStr">Predicate</param>
        /// <param name="objectStr">Object</param>
        /// <returns>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        public bool DeleteTriplet(string subjectStr, string predicateStr, string objectStr)
        {
            if ((prefixReg.Match(subjectStr).Success || namespaceReg.Match(subjectStr).Success) &&
                (prefixReg.Match(predicateStr).Success || namespaceReg.Match(predicateStr).Success) &&
                (prefixReg.Match(objectStr).Success || namespaceReg.Match(objectStr).Success) == false)
                return false;


            var shortSubjectStr = ToPrefixString(subjectStr);
            var shortPredicateStr = ToPrefixString(predicateStr);
            var shortObjectStr = ToPrefixString(objectStr);

            var tr = Triples.Where(t => t.Subject == shortSubjectStr && t.Predicate == shortPredicateStr).Include(o => o.Objects).FirstOrDefault();
            if (tr != null)
            {
                var obj = tr.Objects.FirstOrDefault(o => o.Object == shortObjectStr);
                if (obj != null)
                {
                    TripleObjects.Remove(TripleObjects.Find(obj.TripleObject_Id));

                    if (tr.Objects.Count() == 0)
                        Triples.Remove(tr);

                    SaveChanges();
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Add new prefix and associated namespace with it.
        /// </summary>
        /// <param name="prefixStr">Prefix</param>
        /// <param name="fullStr">Namespace</param>
        /// <returns>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        public bool SetPrefix(string prefixStr, string fullStr)
        {
            var val = TriplePrefixes.FirstOrDefault(x => x.Prefix == prefixStr || x.Namespace == fullStr);
            if (val == null)
            {
                var t = new TriplePrefix()
                {
                    Namespace = fullStr,
                    Prefix = prefixStr
                };
                TriplePrefixes.Add(t);
                SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Delete prefix and associated namespace with it.
        /// </summary>
        /// <param name="prefixStr">Prefix</param>
        /// <param name="fullStr">Namespace</param>
        /// <returns>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        public bool DeletePrefix(string prefixStr, string fullStr)
        {
            var val = TriplePrefixes.FirstOrDefault(x => x.Prefix == prefixStr && x.Namespace == fullStr);
            if (val != null)
            {
                TriplePrefixes.Remove(val);
                SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
