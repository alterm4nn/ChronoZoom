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
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1711:IdentifiersShouldNotHaveIncorrectSuffix", Justification="SuperCollection in an inherent ChronoZoom concept")]
    public class SuperCollection
    {
        [Key]
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification="Automatically implemented properties must define both get and set accessors.")]
        public virtual Collection<Entities.Collection> Collections { get; private set; }
    }
}
