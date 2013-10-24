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
        private string GetSubjectOwner(Storage storage, string subject)
        {
            var name = storage.EnsurePrefix(TripleName.Parse(subject)); 
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
#if RELEASE // Authenticate only in RELEASE mode 
            ApiOperation(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, "Anonymous users cannot delete triple");
                } 
                else 
                {
                    if(GetSubjectOwner(storage, triple.Subject) == user.Id.ToString())
                    {
#else
                    using(var storage = new Storage()) 
#endif
                        try
                        {
                            SetStatusCode(storage.DeleteTriplet(triple.Subject, triple.Predicate, triple.Object) ? HttpStatusCode.OK : HttpStatusCode.NotModified, "");
                        }
                        catch (ArgumentException exc)
                        {
                            SetStatusCode(HttpStatusCode.BadRequest, exc.Message);
                        }
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

        public void PutTriplet(SingleTriple triple)
        {
#if RELEASE
            ApiOperation(delegate(User user, Storage storage)
            {
                if (user == null)
                {
                    SetStatusCode(HttpStatusCode.Unauthorized, "Anonymous users cannot modify triple");
                }
                else
                {
                    if (GetSubjectOwner(storage, triple.Subject) == user.Id.ToString())
                    {
#else
                    using(var storage = new Storage()) 
#endif
                        try
                        {
                            SetStatusCode(storage.PutTriplet(triple.Subject, triple.Predicate, triple.Object) ? HttpStatusCode.OK : HttpStatusCode.NotModified, "");
                        }
                        catch (ArgumentException exc)
                        {
                            SetStatusCode(HttpStatusCode.BadRequest, exc.Message);
                        }
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