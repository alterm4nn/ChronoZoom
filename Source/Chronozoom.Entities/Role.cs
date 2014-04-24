using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    // A list of all different roles a user associated with a collection can have.
    // Currently only Editor is being implemented. Other roles are comments only for discussion / future use.

    [DataContract]
    public enum Role
    {
      //ReadOnly    = 0,    // For possible future use if a collection is private and not generally visible to the public.
        Editor      = 1//,  // Can add, edit and remove collection entries but is unable to edit the list of users associated with a collection.
      //Admin       = 2,    // Can add and remove admins, editors and read-only members to list, but can't change who is owner or coowner, or delete collection.
      //CoOwner     = 3     // All of the same rights as collection owner, can change who is owner and add other co-owners.
    }
}
