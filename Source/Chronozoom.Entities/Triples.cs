using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;

namespace Chronozoom.Entities
{
    public partial class Storage
    {
        /// <summary>Ensures that triple name has prefix. If triple name has namespace, it is converted to prefix</summary>
        /// <param name="name">Name of the triple</param>
        /// <returns>Name of the triple with prefix available</returns>
        public TripleName EnsurePrefix(TripleName name) 
        {
            if(name.Prefix == null) {
                var found = TripleName.PrefixesAndNamespaces.FirstOrDefault(p => p.Value == name.Namespace );
                if (found.Key != null)
                    return new TripleName(name.Namespace, found.Key, name.Name);
                var tr = TriplePrefixes.FirstOrDefault(t => t.Namespace == name.Namespace);
                if(tr != null)
                    return new TripleName(name.Namespace, tr.Prefix, name.Name);
                else
                    throw new ArgumentException(String.Format("There is no known prefix for namespace {0}", name.Namespace));
            } else
                return name;
        }

        public TripleName TryEnsureNamespace(TripleName name)
        {
            if(name.Namespace == null) 
            {
                if (TripleName.PrefixesAndNamespaces.ContainsKey(name.Prefix))
                    return new TripleName(TripleName.PrefixesAndNamespaces[name.Prefix], name.Prefix, name.Name);
                var tr = TriplePrefixes.FirstOrDefault(x => x.Prefix == name.Prefix);
                return tr != null ? new TripleName(tr.Namespace, name.Prefix, name.Name) : name;
            } else
                return name;
        }

        /// <summary>Build list of triples that reference specified object</summary>
        /// <param name="predicate">Optional predicate name</param>
        /// <param name="obj">Object full name</param>
        /// <returns>List of triples</returns>
        public List<Triple> GetIncomingTriplets(string predicate, string obj)
        {
            var objectName = EnsurePrefix(TripleName.Parse(obj)).ToString();
            IQueryable<Triple> triples;
            if (!String.IsNullOrEmpty(predicate))
            {
                var predicateName = EnsurePrefix(TripleName.Parse(predicate)).ToString();
                triples = Triples.Where(t => t.Predicate == predicateName);
            }
            else
                // Not very efficient as it enumerates entire database
                triples = Triples;
            
            return triples.
                Include(o => o.Objects). // Include Objects collection
                Where(t => t.Objects.Any(o => o.Object == objectName)).
                ToArray(). // Stop LINQ to SQL and use simple collection transformations
                Select(t => new Triple {  
                    Subject = t.Subject, 
                    Predicate = t.Predicate, 
                    Objects = new Collection<TripleObject>(t.Objects.Where(o => o.Object == objectName).ToArray())
                }).ToList();
        }

        /// <summary>
        /// Get triple by specified parameters.
        /// </summary>
        /// <param name="subject">Subject name with prefix</param>
        /// <param name="predicate">Predicate name with prefix or null</param>
        /// <param name="obj">Object name with prefix or null</param>
        /// <param name="expandPrefixes">If 'True' returns namespaces, else - prefixes.</param>
        /// <returns>Returns list of triplets.</returns>
        /// <example>GetTriplet( “czusr:76087518-4f8e-4d3a-9bfb-2fd2332376eb”, “czpred:favorite”, null, false)</example>
        public List<Triple> GetTriplet(string subject, string predicate = null, string obj = null, bool expandPrefixes = false)
        {
            if(subject == null)
                throw new ArgumentNullException("subject");
            var subjectName = EnsurePrefix(TripleName.Parse(subject));
            string subjectStr = subjectName.ToString();
            
            IQueryable<Triple> triples;
            if(predicate != null) 
            {
                var predicateName = EnsurePrefix(TripleName.Parse(predicate));
                var predicateStr = predicateName.ToString();
                if (obj != null)
                {
                    var objectName = EnsurePrefix(TripleName.Parse(obj));
                    var objectStr = objectName.ToString();
                    triples = Triples.Where(t => t.Subject == subjectStr && t.Predicate == predicateStr).Include(o => o.Objects).Where(t => t.Objects.FirstOrDefault(x => x.Object == objectStr) != null);
                } 
                else
                    triples = Triples.Where(t => t.Subject == subjectStr && t.Predicate == predicateStr).Include(o => o.Objects);
            } 
            else 
                triples = Triples.Where(t => t.Subject == subjectStr).Include(o => o.Objects);

            if (expandPrefixes)
            {
                //ToDo:Use Join
                triples.ToList().ForEach(x =>
                {
                    x.Subject = TryEnsureNamespace(TripleName.Parse(x.Subject)).ToExpandedString();
                    x.Predicate = TryEnsureNamespace(TripleName.Parse(x.Predicate)).ToExpandedString();
                    foreach (var o in x.Objects) 
                        o.Object = TryEnsureNamespace(TripleName.Parse(o.Object)).ToExpandedString();
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
        /// <returns>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        /// <example>PutTriplet( “czusr:76087518-4f8e-4d3a-9bfb-2fd2332376eb”, “czpred:favorite”, "cztimeline:3a87bb5c-85f7-4305-8b2f-f2002580cd25")</example>
        public bool PutTriplet(TripleName subjectName, TripleName predicateName, TripleName objectName)
        {
            subjectName = EnsurePrefix(subjectName);
            predicateName = EnsurePrefix(predicateName);
            objectName = EnsurePrefix(objectName);
            var shortSubjectStr = subjectName.ToString();
            var shortPredicateStr = predicateName.ToString();
            var shortObjectStr = objectName.ToString();
            
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
        /// <param name="subjectName">Subject</param>
        /// <param name="predicateName">Predicate</param>
        /// <param name="objectName">Object</param>
        /// <returns>Returns 'True' if operation completed succeful, 'False' otherwise.</returns>
        public bool DeleteTriplet(TripleName subjectName, TripleName predicateName, TripleName objectName)
        {
            subjectName = EnsurePrefix(subjectName);
            predicateName = EnsurePrefix(predicateName);
            objectName = EnsurePrefix(objectName);

            var shortSubjectStr = subjectName.ToString();
            var shortPredicateStr = predicateName.ToString();
            var shortObjectStr = objectName.ToString();

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

        public TimelineShortcut GetTimelineShortcut(Timeline timeline)
        {
            string superCollectionPath  = "/" + timeline.Collection.SuperCollection.Title;
            string collectionPath       = "/" + timeline.Collection.Path;
            string contentPath          = "#" + GetContentPath(timeline.Collection.Id, timeline.Id, null);

            if (timeline.Collection.Default)
            {
                collectionPath = "";

                if (timeline.Collection.SuperCollection.Title == ConfigurationManager.AppSettings["DefaultSuperCollection"])
                {
                    superCollectionPath = "/";
                }
            }

            var timelineShortcut = new TimelineShortcut()
            {
                Title       = timeline.Title,
                TimelineUrl = superCollectionPath + collectionPath + contentPath,
                Author      = timeline.Collection.User == null ? "" : timeline.Collection.User.DisplayName,
                ImageUrl    = GetTimelineImageUrl(timeline)
            };

            return timelineShortcut;
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

            return "/images/tile-default.jpg";
        }
    }
}
