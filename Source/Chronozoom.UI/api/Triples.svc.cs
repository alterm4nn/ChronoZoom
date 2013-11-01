using Chronozoom.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC
    {
        private string GetSubjectOwner(Storage storage, TripleName name, List<string> bNodes = null)
        {
            name = storage.EnsurePrefix(name); 
            switch(name.Prefix) {
                case TripleName.UserPrefix:
                    return name.Name; 
                case TripleName.TimelinePrefix:
                    var collection = RetrieveCollection(storage, storage.GetCollectionFromTimeline(Guid.Parse(name.Name)));
                    return collection != null && collection.User != null ? collection.User.Id.ToString() : null;
                case TripleName.ExhibitPrefix:
                    collection = RetrieveCollection(storage, storage.GetCollectionFromExhibitGuid(Guid.Parse(name.Name)));
                    return collection != null && collection.User != null ? collection.User.Id.ToString() : null;
                case TripleName.ArtifactPrefix:
                    collection = RetrieveCollection(storage, storage.GetCollectionFromContentItemGuid(Guid.Parse(name.Name)));
                    return collection != null && collection.User != null ? collection.User.Id.ToString() : null;  
                case TripleName.TourPrefix:
                    var tourId = Guid.Parse(name.Name);
                    var tour = storage.Tours.FirstOrDefault(t => t.Id == tourId);
                    if (tour == null)
                        return null;
                    storage.Entry(tour).Reference(t => t.Collection).Load();
                    collection = RetrieveCollection(storage, tour.Collection.Id);
                    return collection != null && collection.User != null ? collection.User.Id.ToString() : null;
                case "_":
                    var subject = name.ToString();
                    // Guard against infinite loop
                    if (bNodes.Contains(subject))
                        return null; 
                    // Find subject of any triple that uses passed subject as object
                    var linkedSubject = storage.TripleObjects.Where(to => to.Object == subject).
                        Join(storage.Triples, to => to.TripleObject_Id, tr => tr.Id, (to, tr) => tr.Subject).FirstOrDefault();
                    if (String.IsNullOrEmpty(linkedSubject))
                        return null;
                    // Get owner of linked subject
                    if(bNodes == null)
                        bNodes = new List<string>(new string[] { subject });
                    else
                        bNodes.Add(subject);
                    return GetSubjectOwner(storage, TripleName.Parse(linkedSubject), bNodes);
                default:
                    return null;
            }
        }

        public IEnumerable<Entities.Triple> GetTriplets(string subject, string predicate, string @object)
        {
            try
            {
                using (var storage = new Storage())
                    return subject == null?
                        storage.GetIncomingTriplets(predicate,@object) :
                        storage.GetTriplet(
                            HttpUtility.UrlDecode(subject), 
                            predicate == null ? null : HttpUtility.UrlDecode(predicate), 
                            @object == null ? null : HttpUtility.UrlDecode(@object));
            }
            catch (ArgumentException exc)
            {
                SetStatusCode(HttpStatusCode.BadRequest, exc.Message);
                return null;
            }
        }

        public void DeleteTriplet(SingleTriple triple)
        {
            try
            {
                var subjectName = TripleName.Parse(triple.Subject);
                var predicateName = TripleName.Parse(triple.Predicate);
                var objectName = TripleName.Parse(triple.Object); 
#if RELEASE // Authenticate only in RELEASE mode 
                ApiOperation(delegate(User user, Storage storage)
                {
                    if (user == null)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, "Anonymous users cannot delete triple");
                    } 
                    else 
                    {
                        if(GetSubjectOwner(storage, TripleName.Parse(triple.Subject)) == user.Id.ToString())
                        {
#else
                            using(var storage = new Storage()) 
#endif
                                SetStatusCode(storage.DeleteTriplet(subjectName, predicateName, objectName) ? HttpStatusCode.OK : HttpStatusCode.NotModified, "");
#if RELEASE
                        }
                        else
                        {
                            SetStatusCode(HttpStatusCode.Unauthorized, "Only subject owners can delete triple");
                        }
                    }
                });
#endif
            }
            catch (ArgumentException exc)
            {
                SetStatusCode(HttpStatusCode.BadRequest, exc.Message);
            }
        }

        public void PutTriplet(SingleTriple triple)
        {
            try
            {
                var subjectName = TripleName.Parse(triple.Subject);
                var predicateName = TripleName.Parse(triple.Predicate);
                var objectName = TripleName.Parse(triple.Object);
#if RELEASE
                ApiOperation(delegate(User user, Storage storage)
                {
                    if (user == null)
                    {
                        SetStatusCode(HttpStatusCode.Unauthorized, "Anonymous users cannot modify triple");
                    }
                    else
                    {
                        if (GetSubjectOwner(storage, subjectName) == user.Id.ToString())
                        {
#else
                            using(var storage = new Storage()) 
#endif  
                                SetStatusCode(storage.PutTriplet(subjectName, predicateName, objectName) ? HttpStatusCode.OK : HttpStatusCode.NotModified, "");
#if RELEASE
                        }
                        else
                        {
                            SetStatusCode(HttpStatusCode.Unauthorized, "Only subject owners can modify triple");
                        }
                    }
                });
#endif
            }
            catch (ArgumentException exc)
            {
                SetStatusCode(HttpStatusCode.BadRequest, exc.Message);
            }            
        }


        public void SetPrefix(string prefix, string @namespace)
        {
            SetStatusCode(HttpStatusCode.Unauthorized, "Cannot modify prefix collection"); 
        }

        public void DeletePrefix(string prefix, string @namespace)
        {
            SetStatusCode(HttpStatusCode.Unauthorized, "Cannot modify prefix collection");
        }

        public Dictionary<string,string> GetPrefixes()
        {
            using(var storage = new Storage())
            {
                var d = new Dictionary<string,string>();

                foreach (var p in storage.TriplePrefixes)
                    d.Add(p.Prefix, p.Namespace);

                foreach (var p in TripleName.PrefixesAndNamespaces)
                    d.Add(p.Key, p.Value);
                return d;
            }
        }
    }
}