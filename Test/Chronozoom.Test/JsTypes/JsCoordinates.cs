using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct JsCoordinates
    {
        [DataMember]
        private double x;

        [DataMember]
        private double y;

        public JsCoordinates(double x = 0, double y = 0)
        {
            this.x = x;
            this.y = y;
        }

        public double X
        {
            get { return x; }
            set { x = value; }
        }

        public double Y
        {
            get { return y; }
            set { y = value; }
        }

        public override string ToString()
        {
            return String.Format("X: {0}, Y: {1}", x, y).ToString();
        }
    }
}
