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
        private readonly Regex _prefixReg = new Regex(@"^([a-z0-9]+):([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private readonly Regex _namespaceReg = new Regex(@"^http://(?:www.)*chronozoom.com/([a-z0-9]+)#([a-z0-9\-]*)$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        public readonly Dictionary<String, String> PrefixesAndNamespaces = new Dictionary<string, string>
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
            var mp = _prefixReg.Match(str);
            var mn = _namespaceReg.Match(str);
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
            var mp = _prefixReg.Match(fullStr);
            var mn = _namespaceReg.Match(fullStr);
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
            if (PrefixesAndNamespaces.ContainsKey(prefixStr))
            {
                //Search among standard namespaces
                return PrefixesAndNamespaces[prefixStr];
            }
            var tr = TriplePrefixes.FirstOrDefault(x => x.Prefix == prefixStr);
            return tr != null ? tr.Namespace : null;
        }

        /// <summary>
        /// Convert to namespace string.
        /// </summary>
        /// <param name="str">prefix string</param>
        /// <returns>Returns namespace string.</returns>
        private string ToNamespaceStr(string str)
        {
            var mp = _prefixReg.Match(str);
            if (mp.Success)
            {
                return string.Format("{0}:{1}", GetNamespace(mp.Groups[1].Value), mp.Groups[2].Value);
            }
            var mn = _namespaceReg.Match(str);
            return mn.Success ? str : null;
        }

        /// <summary>
        /// Convert to prefix string.
        /// </summary>
        /// <param name="str">namespace string</param>
        /// <returns>Returns prefix string.</returns>
        private string ToPrefixString(string str)
        {
            var ms = _namespaceReg.Match(str);
            if (ms.Success)
            {
                return string.Format("{0}:{1}", GetPrefix(ms.Groups[1].Value), ms.Groups[2].Value);
            }
            var mp = _prefixReg.Match(str);
            return mp.Success ? str : null;
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

            if ((_prefixReg.Match(subjectStr).Success || _namespaceReg.Match(subjectStr).Success) &&
                (_prefixReg.Match(predicateStr).Success || _namespaceReg.Match(predicateStr).Success) &&
                ((objectStr != null && (_prefixReg.Match(objectStr).Success || _namespaceReg.Match(objectStr).Success)) || (objectStr == null)) == false)
                return null;


            IQueryable<Triple> triples;
            if (objectStr == null)
            {
                triples = Triples.Where(t => t.Subject == subjectStr && t.Predicate == predicateStr).Include(o => o.Objects);
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

            if ((_prefixReg.Match(subjectStr).Success || _namespaceReg.Match(subjectStr).Success) &&
                (_prefixReg.Match(predicateStr).Success || _namespaceReg.Match(predicateStr).Success) &&
                (_prefixReg.Match(objectStr).Success || _namespaceReg.Match(objectStr).Success) == false)
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
                        new TripleObject
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
            var triple = new Triple
                {
                    Subject = shortSubjectStr,
                    Predicate = shortPredicateStr,
                    Id = Guid.NewGuid(),
                    Objects = new Collection<TripleObject>
                        { 
                            new TripleObject
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

        /// <summary>
        /// Delete triple with specified parameters.
        /// </summary>
        /// <param name="subjectStr">Subject</param>
        /// <param name="predicateStr">Predicate</param>
        /// <param name="objectStr">Object</param>
        /// <returns>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        public bool DeleteTriplet(string subjectStr, string predicateStr, string objectStr)
        {
            if ((_prefixReg.Match(subjectStr).Success || _namespaceReg.Match(subjectStr).Success) &&
                (_prefixReg.Match(predicateStr).Success || _namespaceReg.Match(predicateStr).Success) &&
                (_prefixReg.Match(objectStr).Success || _namespaceReg.Match(objectStr).Success) == false)
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

                    if (!tr.Objects.Any())
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
                var t = new TriplePrefix
                    {
                        Namespace = fullStr,
                        Prefix = prefixStr
                    };
                TriplePrefixes.Add(t);
                SaveChanges();
                return true;
            }
            return false;
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
            return false;
        }


        /// <summary>
        /// Get TimelineShortctu from Timeline
        /// </summary>
        /// <param name="timeline">Timeline object</param>
        /// <returns>TimelineShortcut</returns>
        public TimelineShortcut GetTimelineShortcut(Timeline timeline)
        {
            var ts = new TimelineShortcut()
            {
                Title = timeline.Title
            };

            if (timeline.Collection.Title == "Beta Content")
            {
                ts.TimelineUrl = String.Format("/#{0}", GetContentPath(timeline.Collection.Id, timeline.Id, null));
                ts.Author = "Chronozoom";
            }
            else
            {
                ts.TimelineUrl = String.Format("/{0}/{1}/#{2}", timeline.Collection.User.DisplayName, timeline.Collection.Title, GetContentPath(timeline.Collection.Id, timeline.Id, null));
                ts.Author = timeline.Collection.User.DisplayName;
            }
            ts.ImageUrl = GetTimelineImageUrl(timeline);
            return ts;
        }

        private static string GetTimelineImageUrl(Timeline timeline)
        {
            if (timeline.Exhibits != null)
            {
                foreach (var exhibit in timeline.Exhibits)
                {
                    foreach (var contentItem in exhibit.ContentItems)
                    {
                        var mediaType = contentItem.MediaType.ToLower();
                        if (mediaType.Equals("picture") || mediaType.Equals("image"))
                        {
                            return contentItem.Uri;
                        }
                    }
                }
            }

            return "/images/default-tile.png";
        }
    }
}
