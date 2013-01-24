using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using Chronozoom.Entities;
using System.Web;
using System.Net;

namespace UI
{
    public partial class Prod_BibliographyView : IBibliographyView { }
    public partial class Prod_ContentItemView : IContentItemView { }
    public partial class Prod_ExhibitContentItemInfo : IExhibitContentItemInfo { }
    public partial class Prod_ExhibitInfo : IExhibitInfo { }
    public partial class Prod_ExhibitReferenceInfo : IExhibitReferenceInfo { }
    public partial class Prod_ExhibitView : IExhibitView { }
    public partial class Prod_ThresholdView : IThresholdView { }
    public partial class Prod_TimelineInfo : ITimelineInfo { }
    public partial class Prod_TimelineView : ITimelineView { }
    public partial class Prod_TourBookmarkView : ITourBookmarkView { }
    public partial class Prod_TourView : ITourView { }

    public partial class Staging_BibliographyView : IBibliographyView { }
    public partial class Staging_ContentItemView : IContentItemView { }
    public partial class Staging_ExhibitContentItemInfo : IExhibitContentItemInfo { }
    public partial class Staging_ExhibitInfo : IExhibitInfo { }
    public partial class Staging_ExhibitReferenceInfo : IExhibitReferenceInfo { }
    public partial class Staging_ExhibitView : IExhibitView { }
    public partial class Staging_ThresholdView : IThresholdView { }
    public partial class Staging_TimelineInfo : ITimelineInfo { }
    public partial class Staging_TimelineView : ITimelineView { }
    public partial class Staging_TourBookmarkView : ITourBookmarkView { }
    public partial class Staging_TourView : ITourView { }

    public partial class Auth_BibliographyView : IBibliographyView { }
    public partial class Auth_ContentItemsView : IContentItemView { }
    public partial class Auth_ExhibitContentItemInfoView : IExhibitContentItemInfo { }
    public partial class Auth_ExhibitInfoView : IExhibitInfo { }
    public partial class Auth_ExhibitReferenceInfoView : IExhibitReferenceInfo { }
    public partial class Auth_ExhibitView : IExhibitView { }
    public partial class Auth_ThresholdView : IThresholdView { }
    public partial class Auth_TimelineInfoView : ITimelineInfo { }
    public partial class Auth_TimelineView : ITimelineView { }
    public partial class Auth_TourBookmarkView : ITourBookmarkView { }
    public partial class Auth_TourView : ITourView { }

    public enum DataEnvironment
    {
        Dev,
        Production,
        Staging,
    }

    public class DataEnvironmentAccess
    {
        private readonly DataEnvironment Env = DataEnvironment.Staging;
        public ChronoZoomEntities DB { get; private set; }
        
        private DataEnvironmentAccess()
        {
            this.DB = new ChronoZoomEntities();
            DataEnvironment env;

            if (Enum.TryParse<DataEnvironment>(System.Configuration.ConfigurationManager.AppSettings["Environment"], out env))
            {
                this.Env = env;
            }                
        }

        public static DataEnvironmentAccess AnInstance
        {
            get { return new DataEnvironmentAccess(); }
        }

        public IEnumerable<IExhibitContentItemInfo> GetIExhibitContentItemInfo()
        {
            if (this.Env == DataEnvironment.Production)
            {
                return DB.Prod_ExhibitContentItemInfo.AsEnumerable<IExhibitContentItemInfo>().OrderBy(item => item.Order).OrderBy(item => item.Title);
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                return DB.Staging_ExhibitContentItemInfo.AsEnumerable<IExhibitContentItemInfo>().OrderBy(item => item.Order).OrderBy(item => item.Title);
            }
            else
            {
                return DB.Auth_ExhibitContentItemInfoView.AsEnumerable<IExhibitContentItemInfo>().OrderBy(item => item.Order).OrderBy(item => item.Title);
            }
        }

        public IEnumerable<IExhibitReferenceInfo> GetIExhibitReferenceInfo()
        {
            if (this.Env == DataEnvironment.Production)
            {
                return DB.Prod_ExhibitReferenceInfo.AsEnumerable<IExhibitReferenceInfo>();
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                return DB.Staging_ExhibitReferenceInfo.AsEnumerable<IExhibitReferenceInfo>();
            }
            else
            {
                return DB.Auth_ExhibitReferenceInfoView.AsEnumerable<IExhibitReferenceInfo>();
            }
        }

        public IEnumerable<IExhibitInfo> GetIExhibitInfo()
        {
            if (this.Env == DataEnvironment.Production)
            {
                return DB.Prod_ExhibitInfo.AsEnumerable<IExhibitInfo>();
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                return DB.Staging_ExhibitInfo.AsEnumerable<IExhibitInfo>();
            }
            else
            {
                return DB.Auth_ExhibitInfoView.AsEnumerable<IExhibitInfo>();
            }
        }

        public IEnumerable<ITimelineInfo> GetITimelineInfo()
        {
            if (this.Env == DataEnvironment.Production)
            {
                return DB.Prod_TimelineInfo.AsEnumerable<ITimelineInfo>();
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                return DB.Staging_TimelineInfo.AsEnumerable<ITimelineInfo>();
            }
            else
            {
                return DB.Auth_TimelineInfoView.AsEnumerable<ITimelineInfo>();
            }
        }

        public IEnumerable<IThresholdView> GetIThresholdView()
        {
            IEnumerable<IThresholdView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_ThresholdView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_ThresholdView;
            }
            else
            {
                val = DB.Auth_ThresholdView;
            }
            return val.Where(t => t.IsDeleted == null || t.IsDeleted == false).OrderBy(t => t.Threshold);
        }


        public IEnumerable<TimelineInfo> GetITimelineInfo(string s)
        {
            IEnumerable<TimelineInfo> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.spGetVisibleTimelinesForSearch((int)DataEnvironment.Production);
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.spGetVisibleTimelinesForSearch((int)DataEnvironment.Staging);
            }
            else
            {
                val = DB.spGetVisibleTimelinesForSearch((int)DataEnvironment.Dev);
            }

            return val.Where(t => t.Title.ToLower().Contains(s));
        }

        public IEnumerable<ITimelineView> GetITimelineView(string s)
        {
            IEnumerable<ITimelineView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_TimelineView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_TimelineView;
            }
            else
            {
                val = DB.Auth_TimelineView;
            }
            
            return val.Where(t => t.Title.Contains(s) && (t.IsDeleted == null || t.IsDeleted == false) && (t.IsVisible == null || t.IsVisible == true));
        }

        public IEnumerable<IExhibitView> GetIExhibitView(string s)
        {
            IEnumerable<IExhibitView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_ExhibitView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_ExhibitView;
            }
            else
            {
                val = DB.Auth_ExhibitView;
            }

            return val.Where(e => e.Title.ToLower().Contains(s) && (e.IsDeleted == null || e.IsDeleted == false) && (e.IsVisible == null || e.IsVisible == true));
        }

        public IEnumerable<IContentItemView> GetIContentItemView(string s)
        {
            IEnumerable<IContentItemView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_ContentItemView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_ContentItemView;
            }
            else
            {
                val = DB.Auth_ContentItemsView;
            }

            return val.Where(e => e.Title.Contains(s) && (e.IsDeleted == null || e.IsDeleted == false) && (e.IsVisible == null || e.IsVisible == true));
        }


        public IEnumerable<IExhibitContentItemInfo> GetIExhibitContentItemInfo(string s)
        {
            IEnumerable<IExhibitContentItemInfo> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_ExhibitContentItemInfo;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_ExhibitContentItemInfo;
            }
            else
            {
                val = DB.Auth_ExhibitContentItemInfoView;
            }

            return val.Where(e => e.Title.ToLower().Contains(s));
        }

        public IEnumerable<IBibliographyView> GetIBibliographyView(Guid guid)
        {
            IEnumerable<IBibliographyView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_BibliographyView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_BibliographyView;
            }
            else
            {
                val = DB.Auth_BibliographyView;
            }

            return val.Where(e => e.ExhibitID == guid && (e.IsDeleted == null || e.IsDeleted == false));
        }

        public IEnumerable<ITourView> GetITourView()
        {
            IEnumerable<ITourView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_TourView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_TourView;
            }
            else
            {
                val = DB.Auth_TourView;
            }

            return val.Where(t => t.IsDeleted == null || t.IsDeleted == false);
        }

        public IEnumerable<ITourBookmarkView> GetITourBookmarkView(Guid tourId)
        {
            IEnumerable<ITourBookmarkView> val = null;
            if (this.Env == DataEnvironment.Production)
            {
                val = DB.Prod_TourBookmarkView;
            }
            else if (this.Env == DataEnvironment.Staging)
            {
                val = DB.Staging_TourBookmarkView;
            }
            else
            {
                val = DB.Auth_TourBookmarkView;
            }

            return (from b in val
                     where b.TourID == tourId
                     && (b.Bookmark_IsDeleted == null || b.Bookmark_IsDeleted == false)
                     && (b.TourBookmark_IsDeleted == null || b.TourBookmark_IsDeleted == false)
                     select b);
        }
    }
}