// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Collection
    {
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string UserId { get; set; }
    }
}
