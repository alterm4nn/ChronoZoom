using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Contains a set of content items, and is contained by a timeline or a collection.
    /// </summary>
    [KnownType(typeof(ContentItemRaw))]
    [DataContract]
    public class Exhibit
    {
        /// <summary>
        /// Constructor used to set default values.
        /// </summary>
        public Exhibit()
        {
            this.UpdatedTime = DateTime.UtcNow; // Must be set on creation else we'd need to store as datetime2, which isn't supported in CE.
            this.IsCirca = false;
        }

        /// <summary>
        /// The ID of the exhibit.
        /// </summary>
        [Key]
        [DataMember(Name = "id")]
        public Guid Id { get; set; }
        
        /// <summary>
        /// The depth of the exhibit in the timeline tree
        /// </summary>
        public int Depth { get; set; }

        /// <summary>
        /// The title of the exhibit.
        /// </summary>
        [DataMember(Name = "title")]
        [MaxLength(200)]
        [Column(TypeName = "nvarchar")]
        public string Title { get; set; }

        /// <summary>
        /// The year in which the exhibit appears.
        /// </summary>
        [DataMember(Name = "time")]
        public decimal Year { get; set; }
        
        /// <summary>
        /// If true, the exhibit date is circa/approximate.
        /// Default is false.
        /// </summary>
        [DataMember]
        [Column(TypeName = "bit")]
        public bool IsCirca { get; set; }

        /// <summary>
        /// The user who last updated this exhibit.
        /// Can be null if there have been no updates.
        /// </summary>
        [DataMember]
        public User UpdatedBy { get; set; }

        /// <summary>
        /// Date/Time is UTC/GMT, is never null, and is not displayed to the user.
        /// </summary>
        [DataMember]
        [Column(TypeName = "datetime")]
        public DateTime UpdatedTime { get; set; }
        
        /// <summary>
        /// The offset from the top bound of the box in percents of the box height.
        /// </summary>
        [DataMember (Name = "offsetY")]
        public decimal? OffsetY { get; set; }
        
        /// <summary>
        /// Specifies the collection of content items that is associated with the exhibit.
        /// </summary>
        [DataMember(Name = "contentItems")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<ContentItem> ContentItems { get; set; }

        /// <summary>
        /// Specifies the collection that is associated with the exhibit.
        /// </summary>
        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class ExhibitRaw : Exhibit
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name = "ParentTimelineId")]
        public Guid Timeline_ID { get; set; }
    }
}