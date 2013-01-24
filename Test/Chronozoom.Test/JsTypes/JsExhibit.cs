using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct JsExhibit
    {
        #region Fields

        [DataMember]
        public string __type;

        [DataMember]
        public JsContentItem[] ContentItems;

        [DataMember]
        public object Date;

        [DataMember]
        public double height;

        [DataMember]
        public string ID;

        [DataMember]
        public string Regime;

        [DataMember]
        public string Threshold;

        [DataMember]
        public string TimeUnit;

        [DataMember]
        public string Title;

        [DataMember]
        public double width;

        [DataMember]
        public double x;

        [DataMember]
        public double y;

        [DataMember]
        public double Year;

        #endregion Fields
    }
}
