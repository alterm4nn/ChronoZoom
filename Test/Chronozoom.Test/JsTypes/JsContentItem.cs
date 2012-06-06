using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct JsContentItem
    {
        #region Fields

        [DataMember]
        public string __type;

        [DataMember]
        public object Attribution;

        [DataMember]
        public string Caption;

        [DataMember]
        public object Date;

        [DataMember]
        public string ID;

        [DataMember]
        public object MediaSource;

        [DataMember]
        public string MediaType;

        [DataMember]
        public string Regime;

        [DataMember]
        public string Threshold;

        [DataMember]
        public string TimeUnit;

        [DataMember]
        public string Title;

        [DataMember]
        public string Uri;

        [DataMember]
        public double Year;

        #endregion Fields
    }
}
