using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct JsTitleRectangle
    {
        #region Fields

        [DataMember]
        private double bboxHeight;

        [DataMember]
        private double bboxWidth;

        [DataMember]
        private double height;

        [DataMember]
        private double width;

        [DataMember]
        private double marginLeft;

        [DataMember]
        private double marginTop;

        #endregion Fields

        #region Properties

        public double BboxHeight { get { return bboxHeight; } set { bboxHeight = value; } }
        public double BboxWidth { get { return bboxWidth; } set { bboxWidth = value; } }
        public double Height { get { return height; } set { height = value; } }
        public double Width { get { return width; } set { width = value; } }
        public double MarginLeft { get { return marginLeft; } set { marginLeft = value; } }
        public double MarginTop { get { return marginTop; } set { marginTop = value; } }

        #endregion Properties
    }
}
