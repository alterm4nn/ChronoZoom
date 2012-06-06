using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct JsTimeline
    {
        #region Fields

        [DataMember]
        public string __type;

        [DataMember]
        public JsTimeline[] ChildTimelines;

        [DataMember]
        public JsExhibit[] Exhibits;

        [DataMember]
        public object FromDate;

        [DataMember]
        public string FromTimeUnit;

        [DataMember]
        public double FromYear;

        [DataMember]
        public double height;

        [DataMember]
        public double heightEps;

        [DataMember]
        public string ID;

        [DataMember]
        public double left;

        [DataMember]
        public double realHeight;

        [DataMember]
        public double realY;

        [DataMember]
        public string Regime;

        [DataMember]
        public double right;

        [DataMember]
        public string Threshold;

        [DataMember]
        public string Title;

        [DataMember]
        public JsTitleRectangle titleRect;

        [DataMember]
        public object ToDate;

        [DataMember]
        public string ToTimeUnit;

        [DataMember]
        public double ToYear;

        [DataMember]
        public double y;

        #endregion Fields
    }
}
