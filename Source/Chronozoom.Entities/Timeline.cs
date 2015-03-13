// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Data.SqlTypes;

namespace Chronozoom.Entities
{
    /// <summary>
    /// A visual representation of a time period that contains a set of Exhibits, child Timelines, and Time Series Data, and is contained by another Timeline or a Collection. The Timeline entity is externally searchable and linkable.
    /// </summary>
    [KnownType(typeof(TimelineRaw))]
    [KnownType(typeof(ExhibitRaw))]
    [DataContract]
    public class Timeline
    {
        /// <summary>
        /// Constructor used to set default values.
        /// </summary>
        public Timeline()
        {
            this.Id = Guid.NewGuid();   // Don't use [DatabaseGenerated(DatabaseGeneratedOption.Identity)] on Id
            this.FromIsCirca = false;
            this.ToIsCirca   = false;
        }

        /// <summary>
        /// The ID of the timeline (GUID).
        /// </summary>
        [Key]
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        /// The depth of the timeline in the timeline tree.
        /// </summary>
        public int Depth { get; set; }

        /// <summary>
        /// The number of content items contained in subtree under current timeline.
        /// </summary>
        public int SubtreeSize { get; set; }

        /// <summary>
        /// The title of the timeline.
        /// </summary>
        [DataMember(Name = "title")]
        [MaxLength(200)]
        [Column(TypeName = "nvarchar")]
        public string Title { get; set; }

        /// <summary>
        /// The regime in which the timeline should occur.
        /// </summary>
        [DataMember]
        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string Regime { get; set; }

        /// <summary>
        /// The year the timeline begins.
        /// </summary>
        [DataMember(Name = "start")]
        public decimal FromYear { get; set; }

        /// <summary>
        /// If true, the timeline start date is circa/approximate.
        /// Default is false.
        /// </summary>
        [DataMember]
        [Column(TypeName = "bit")]
        public bool FromIsCirca { get; set; }

        /// <summary>
        /// The year the timeline ends.
        /// </summary>
        [DataMember(Name = "end")]
        public decimal ToYear { get; set; }

        /// <summary>
        /// If true, the timeline end date is circa/approximate.
        /// Default is false.
        /// </summary>
        [DataMember]
        [Column(TypeName = "bit")]
        public bool ToIsCirca { get; set; }

        /// <summary>
        /// ???
        /// </summary>
        public decimal ForkNode { get; set; }

        /// <summary>
        /// The height of the timeline.

        /// </summary>
        [DataMember]
        public decimal? Height { get; set; }

        /// <summary>
        /// The URL of background image.
        /// </summary>
        [DataMember(Name = "backgroundUrl")]
        [MaxLength(4000)]
        [Column(TypeName = "nvarchar")]
        public string BackgroundUrl { get; set; }

        /// <summary>
        /// The aspect ratio of the timeline: width / height.
        /// </summary>
        [DataMember(Name = "aspectRatio")]
        public decimal? AspectRatio { get; set; }

        /// <summary>
        /// The collection of child timelines belonging to the timeline.
        /// </summary>
        [DataMember(Name = "timelines")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Timeline> ChildTimelines { get; set; }

        /// <summary>
        /// The collection of exhibits belonging to the timeline.
        /// </summary>
        [DataMember(Name = "exhibits")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "Object property needs to be initialized externally")]
        public virtual Collection<Exhibit> Exhibits { get; set; }

        public virtual Entities.Collection Collection { get; set; }
    }

    [DataContract]
    [NotMapped]
    public class TimelineRaw : Timeline
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:Validate arguments of public methods", MessageId = "0"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "t")]
        public TimelineRaw() { }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:Validate arguments of public methods", MessageId = "0"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "t")]
        public TimelineRaw(Timeline t)
        {
            Id = t.Id;
            Depth = t.Depth;
            SubtreeSize = t.SubtreeSize;
            Title = t.Title;
            Regime = t.Regime;
            FromYear = t.FromYear;
            FromIsCirca = t.FromIsCirca;
            ToYear = t.ToYear;
            ToIsCirca = t.ToIsCirca;
            ForkNode = t.ForkNode;
            Height = t.Height;
            BackgroundUrl = t.BackgroundUrl;
            AspectRatio = t.AspectRatio;
        }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1707:IdentifiersShouldNotContainUnderscores", Justification = "Needs to match storage column name")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID", Justification = "Needs to match storage column name")]
        [DataMember(Name = "ParentTimelineId", EmitDefaultValue = false)]
        public Guid? Timeline_ID { get; set; }
    }
}
