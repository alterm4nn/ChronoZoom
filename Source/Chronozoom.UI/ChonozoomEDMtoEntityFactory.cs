using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UI
{
    public static class ChonozoomEDMtoEntityFactory
    {
        public static Chronozoom.Entities.Timeline CreateTimeLine(ITimelineInfo lineInfo)
        {
            return new Chronozoom.Entities.Timeline(lineInfo.TimelineID,
                             lineInfo.Title,
                             lineInfo.Threshold,
                             lineInfo.Regime,
                             lineInfo.FromTimeUnit,
                             lineInfo.FromContentDate.HasValue == true ? lineInfo.FromContentDate.Value.Day : 0,
                             lineInfo.FromContentDate.HasValue == true ? lineInfo.FromContentDate.Value.Month : 0,
                             lineInfo.FromContentYear,
                             lineInfo.ToTimeUnit,
                             lineInfo.ToContentDate.HasValue == true ? lineInfo.ToContentDate.Value.Day : 0,
                             lineInfo.ToContentDate.HasValue == true ? lineInfo.ToContentDate.Value.Month : 0,
                             lineInfo.ToContentYear,
                             lineInfo.TimelineUniqueID,
                             lineInfo.TimelineSequence,
                             lineInfo.Height
                             );
        }

        public static Chronozoom.Entities.Exhibit CreateExhibit(IExhibitInfo eInfo)
        {
            return new Chronozoom.Entities.Exhibit(eInfo.ID,
                eInfo.Title,
                eInfo.Threshold,
                eInfo.Regime,
                eInfo.TimeUnit,
                eInfo.ContentDate.HasValue == true ? eInfo.ContentDate.Value.Day : 0,
                eInfo.ContentDate.HasValue == true ? eInfo.ContentDate.Value.Month : 0,
                eInfo.ContentYear,
                eInfo.UniqueID,
                eInfo.Sequence);
        }

        public static Chronozoom.Entities.ContentItem CreateContentItem(IExhibitContentItemInfo eciInfo)
        {
            return new Chronozoom.Entities.ContentItem(eciInfo.ID,
                eciInfo.Title,
                eciInfo.Caption,
                eciInfo.Threshold,
                eciInfo.Regime,
                eciInfo.TimeUnit,
                eciInfo.ContentDate,
                eciInfo.ContentYear,
                eciInfo.MediaType,
                eciInfo.MediaBlobURL,
                eciInfo.MediaSource,
                eciInfo.Attribution,
                eciInfo.UniqueID,
                eciInfo.Order ?? short.MaxValue);
        }

        public static Chronozoom.Entities.Reference CreateReferenceItem(IExhibitReferenceInfo erInfo)
        {
            return new Chronozoom.Entities.Reference(erInfo.ID,
                   erInfo.Title,
                   erInfo.Authors,
                   erInfo.BookChapters,
                   erInfo.CitationType,
                   erInfo.PageNumbers,
                   erInfo.Publication,
                   erInfo.PublicationDates,
                   erInfo.Source
                   );
        }
    }
}