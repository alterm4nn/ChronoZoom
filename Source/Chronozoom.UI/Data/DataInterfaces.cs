using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UI
{
    public interface IBibliographyView
    {
        System.Guid ExhibitID { get; }
        Nullable<System.Boolean> IsDeleted { get; }
        System.Guid ID { get; }
        System.String Title { get; }
        System.String Authors { get; }
        System.String BookChapters { get; }
        System.String CitationType { get; }
        System.String PageNumbers { get; }
        System.String Publication { get; }
        System.String PublicationDates { get; }
        System.String Source { get; }
    }

    public interface IContentItemView
    {
        System.Guid ID { get; }
        System.String Title { get; }
        System.String Caption { get; }
        System.String Topic { get; }
        System.Guid MediaTypeID { get; }
        System.Guid ThresholdID { get; }
        System.Guid RegimeID { get; }
        System.String MediaBlobURL { get; }
        System.Guid TimeUnitID { get; }
        Nullable<System.DateTimeOffset> ContentDate { get; }
        Nullable<System.Decimal> ContentYear { get; }
        System.String MediaSource { get; }
        System.String Attribution { get; }
        System.Guid LicenseTypeID { get; }
        Nullable<System.DateTime> CreatedOn { get; }
        Nullable<System.Guid> CreatedBy { get; }
        Nullable<System.DateTime> ModifiedOn { get; }
        Nullable<System.Guid> ModifiedBy { get; }
        Nullable<System.Boolean> IsVisible { get; }
        Nullable<System.Boolean> IsDeleted { get; }
        System.Int32 UniqueID { get; }
    }

    public interface IExhibitContentItemInfo
    {
        System.Guid ID { get; }
        System.Guid ExhibitID { get; }
        System.String Title { get; }
        System.String Caption { get; }
        System.String Threshold { get; }
        System.String Regime { get; }
        System.String TimeUnit { get; }
        Nullable<System.DateTimeOffset> ContentDate { get; }
        Nullable<System.Decimal> ContentYear { get; }
        System.String MediaType { get; }
        System.String MediaBlobURL { get; }
        System.String MediaSource { get; }
        System.String Attribution { get; }
        System.Int32 UniqueID { get; }
        Nullable<System.Int16> Order { get; }
        Nullable<System.Int32> CurrVersion { get; }
    }

    public interface IExhibitInfo
    {
        System.Guid ID { get; }
        System.Guid TimelineID { get; }
        System.String Title { get; }
        System.String Threshold { get; }
        System.String Regime { get; }
        System.String TimeUnit { get; }
        Nullable<System.DateTimeOffset> ContentDate { get; }
        Nullable<System.Decimal> ContentYear { get; }
        System.Int32 UniqueID { get; }
        Nullable<System.Int32> Sequence { get; }
    }

    public interface IExhibitReferenceInfo
    {
        System.Guid ID { get; }
        System.Guid ExhibitID { get; }
        System.String Title { get; }
        System.String Authors { get; }
        System.String BookChapters { get; }
        System.String CitationType { get; }
        System.String PageNumbers { get; }
        System.String Publication { get; }
        System.String PublicationDates { get; }
        System.String Source { get; }
    }

    public interface IExhibitView
    {
        System.Guid ID { get; }
        System.String Title { get; }
        System.Guid ThresholdID { get; }
        System.Guid RegimeID { get; }
        Nullable<System.DateTimeOffset> ContentDate { get; }
        Nullable<System.Decimal> ContentYear { get; }
        Nullable<System.DateTime> CreatedOn { get; }
        Nullable<System.Guid> CreatedBy { get; }
        Nullable<System.DateTime> ModifiedOn { get; }
        Nullable<System.Guid> ModifiedBy { get; }
        Nullable<System.Boolean> IsVisible { get; }
        Nullable<System.Boolean> IsDeleted { get; }
        Nullable<System.Guid> TimeUnitID { get; }
        System.Int32 UniqueID { get; }
        Nullable<System.Int32> Sequence { get; }
    }

    public interface IThresholdView
    {
        System.Guid ID { get; }
        System.String Threshold { get; }
        Nullable<System.Boolean> IsDeleted { get; }
        System.String Timeunit { get; }
        Nullable<System.DateTimeOffset> ThresholdDate { get; }
        Nullable<System.Decimal> ThresholdYear { get; }
        System.String ShortDescription { get; }
        System.String URL { get; }
    }

    public interface ITimelineInfo
    {
        System.Guid TimelineID { get; }
        System.String Title { get; }
        System.String Threshold { get; }
        System.String Regime { get; }
        System.String FromTimeUnit { get; }
        Nullable<System.DateTimeOffset> FromContentDate { get; }
        Nullable<System.Decimal> FromContentYear { get; }
        System.String ToTimeUnit { get; }
        Nullable<System.DateTimeOffset> ToContentDate { get; }
        Nullable<System.Decimal> ToContentYear { get; }
        System.Int32 TimelineUniqueID { get; }
        Nullable<System.Int32> TimelineSequence { get; }
        Nullable<System.Decimal> Height { get; }
        Nullable<System.Guid> ParentTimelineID { get; }
        Nullable<System.Int32> HasChildren { get; }
    }

    public interface ITimelineView
    {
        System.Guid ID { get; }
        System.String Title { get; }
        System.Guid ThresholdID { get; }
        System.Guid RegimeID { get; }
        Nullable<System.DateTimeOffset> FromContentDate { get; }
        Nullable<System.Decimal> FromContentYear { get; }
        Nullable<System.DateTimeOffset> ToContentDate { get; }
        Nullable<System.Decimal> ToContentYear { get; }
        Nullable<System.Guid> ParentTimelineID { get; }
        Nullable<System.DateTime> CreatedOn { get; }
        Nullable<System.Guid> CreatedBy { get; }
        Nullable<System.DateTime> ModifiedOn { get; }
        Nullable<System.Guid> ModifiedBy { get; }
        Nullable<System.Boolean> IsVisible { get; }
        Nullable<System.Boolean> IsDeleted { get; }
        Nullable<System.Guid> FromTimeUnit { get; }
        Nullable<System.Guid> ToTimeUnit { get; }
        System.String SourceURL { get; }
        System.String Attribution { get; }
        System.Int32 UniqueID { get; }
        Nullable<System.Int32> Sequence { get; }
        Nullable<System.Decimal> Height { get; }
    }

    public interface ITourBookmarkView
    {
        System.String Name { get; }
        Nullable<System.Int32> LapseTime { get; }
        System.String Description { get; }
        System.String URL { get; }
        System.Guid ID { get; }
        Nullable<System.Boolean> Bookmark_IsDeleted { get; }
        Nullable<System.Boolean> TourBookmark_IsDeleted { get; }
        System.Guid TourID { get; }
    }

    public interface ITourView
    {
        System.Guid ID { get; }
        System.String Name { get; }
        Nullable<System.Guid> CreatedBy { get; }
        Nullable<System.Guid> ModifiedBy { get; }
        Nullable<System.DateTime> CreatedOn { get; }
        Nullable<System.DateTime> ModifiedOn { get; }
        Nullable<System.Boolean> IsDeleted { get; }
        System.Int32 UniqueID { get; }
        System.String AudioBlobUrl { get; }
        System.String Category { get; }
        Nullable<System.Int32> Sequence { get; }
        Nullable<System.Int32> CurrVersion { get; }
    }
}