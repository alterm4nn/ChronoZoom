// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Tour
    {
        [DataMember]
        public Guid ID { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public int UniqueID { get; set; }

        [DataMember]
        public string AudioBlobUrl { get; set; }

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public int? Sequence { get; set; }

        [DataMember]
        public virtual List<BookMark> bookmarks { get; set; }
    }
}