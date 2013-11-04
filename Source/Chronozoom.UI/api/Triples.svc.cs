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
                        if(storage.GetSubjectOwner(TripleName.Parse(triple.Subject)) == user.Id.ToString())
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
                        objectName = storage.EnsurePrefix(objectName);
                        if (objectName.Prefix == "_")
                        {
                            var tripleOwner = storage.GetSubjectOwner(objectName);
                            if (tripleOwner != null && tripleOwner != user.Id.ToString())
                                SetStatusCode(HttpStatusCode.BadRequest, "Object bNode belongs to another user");
                        }

                        if (storage.GetSubjectOwner(subjectName) == user.Id.ToString())
                        {
#else
                            using(var storage = new Storage()) 
#endif
                            {

                                SetStatusCode(storage.PutTriplet(subjectName, predicateName, objectName) ? HttpStatusCode.OK : HttpStatusCode.NotModified, "");
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