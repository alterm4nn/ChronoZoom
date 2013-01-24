using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UI
{
    public static class EDMTimelineBuilder
    {
        public static Dictionary<Guid, List<Chronozoom.Entities.ContentItem>> LoadExhibitContentTypes(DataEnvironmentAccess db)
        {
            Dictionary<Guid, List<Chronozoom.Entities.ContentItem>> retItems =
                new Dictionary<Guid, List<Chronozoom.Entities.ContentItem>>();
            
            foreach (var item in db.GetIExhibitContentItemInfo())
            {
                List<Chronozoom.Entities.ContentItem> list = null;
                if (!retItems.TryGetValue(item.ExhibitID, out list))
                {
                    list = new List<Chronozoom.Entities.ContentItem>();
                    retItems.Add(item.ExhibitID, list);
                }
                list.Add(ChonozoomEDMtoEntityFactory.CreateContentItem(item));
            }
            return retItems;
        }

        public static Dictionary<Guid, List<Chronozoom.Entities.Reference>> LoadExhibitReferences(DataEnvironmentAccess db)
        {
            Dictionary<Guid, List<Chronozoom.Entities.Reference>> retItems =
                new Dictionary<Guid, List<Chronozoom.Entities.Reference>>();

            foreach (var item in db.GetIExhibitReferenceInfo())
            {
                List<Chronozoom.Entities.Reference> list = null;
                if (!retItems.TryGetValue(item.ExhibitID, out list))
                {
                    list = new List<Chronozoom.Entities.Reference>();
                    retItems.Add(item.ExhibitID, list);
                }
                list.Add(ChonozoomEDMtoEntityFactory.CreateReferenceItem(item));
            }
            return retItems;
        }

        public static Dictionary<Guid, List<Chronozoom.Entities.Exhibit>> LoadExhibits(
            DataEnvironmentAccess db,
            Dictionary<Guid, List<Chronozoom.Entities.Reference>> exhibitReferences,
            Dictionary<Guid, List<Chronozoom.Entities.ContentItem>> exhibitContentItems)
        {
            Dictionary<Guid, List<Chronozoom.Entities.Exhibit>> retItems =
                new Dictionary<Guid, List<Chronozoom.Entities.Exhibit>>();

            foreach (var item in db.GetIExhibitInfo().OrderBy(e => e.ContentYear))
            {
                List<Chronozoom.Entities.Exhibit> list = null;
                if (!retItems.TryGetValue(item.TimelineID, out list))
                {
                    list = new List<Chronozoom.Entities.Exhibit>();
                    retItems.Add(item.TimelineID, list);
                }
                Chronozoom.Entities.Exhibit exhibit = 
                    ChonozoomEDMtoEntityFactory.CreateExhibit(item);

                list.Add(exhibit);

                List<Chronozoom.Entities.Reference> references = null;
                if (exhibitReferences.TryGetValue(item.ID, out references))
                {
                    exhibit.References = references;
                }

                List<Chronozoom.Entities.ContentItem> contentItems = null;
                if (exhibitContentItems.TryGetValue(item.ID, out contentItems))
                {
                    exhibit.ContentItems = contentItems;
                }
            }
            return retItems;
        }

        public static List<Chronozoom.Entities.Timeline> LoadTimeline(DataEnvironmentAccess db,
            Dictionary<Guid, List<Chronozoom.Entities.Exhibit>> timeLineExhibits)
        {
            Dictionary<Guid, List<Chronozoom.Entities.Timeline>> containerLines =
                new Dictionary<Guid, List<Chronozoom.Entities.Timeline>>();
            Chronozoom.Entities.Timeline current = null;
            List<Chronozoom.Entities.Timeline> rootLines = new List<Chronozoom.Entities.Timeline>();

            foreach (var lineInfo in db.GetITimelineInfo().OrderBy(t => t.FromContentYear))
            {
                List<Chronozoom.Entities.Timeline> childLines = null;
                List<Chronozoom.Entities.Exhibit> exhibits = null;

                if (current == null ||
                    lineInfo.TimelineID != current.ID)
                {
                    current = ChonozoomEDMtoEntityFactory.CreateTimeLine(lineInfo);
                    if (timeLineExhibits.TryGetValue(current.ID, out exhibits))
                    {
                        current.Exhibits = exhibits;
                    }

                    if (lineInfo.HasChildren.HasValue)
                    {
                        if (!containerLines.TryGetValue(lineInfo.TimelineID, out childLines))
                        {
                            childLines = new List<Chronozoom.Entities.Timeline>();
                            containerLines.Add(lineInfo.TimelineID, childLines);
                        }
                        current.ChildTimelines = childLines;
                    }

                    if (!lineInfo.ParentTimelineID.HasValue)
                    {
                        rootLines.Add(current);
                    }
                    else
                    {
                        if (!containerLines.TryGetValue(lineInfo.ParentTimelineID.Value, out childLines))
                        {
                            childLines = new List<Chronozoom.Entities.Timeline>();
                            containerLines.Add(lineInfo.ParentTimelineID.Value, childLines);
                        }
                        childLines.Add(current);
                    }
                }
            }

            return rootLines;
        }

        public static List<Chronozoom.Entities.Timeline> BuildTimeLine(DataEnvironmentAccess db)
        {
            Dictionary<Guid, List<Chronozoom.Entities.Exhibit>> timeLineExhibits =
                EDMTimelineBuilder.LoadExhibits(
                    db,
                    EDMTimelineBuilder.LoadExhibitReferences(db),
                    EDMTimelineBuilder.LoadExhibitContentTypes(db));
            return EDMTimelineBuilder.LoadTimeline(
                    db,
                    timeLineExhibits);
        }
    }
}