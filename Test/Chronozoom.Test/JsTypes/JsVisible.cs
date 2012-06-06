using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct JsVisible
    {
        [DataMember]
        private double centerX;

        [DataMember]
        private double centerY;

        [DataMember]
        private double scale;

        public JsVisible(double centerX = 0, double centerY = 0, double scale = 0)
        {
            this.centerX = centerX;
            this.centerY = centerY;
            this.scale = scale;
        }

        public double CenterX
        {
            get { return centerX; }
            set { centerX = value; }
        }

        public double CenterY
        {
            get { return centerY; }
            set { centerY = value; }
        }

        public double Scale
        {
            get { return scale; }
            set { scale = value; }
        }

        public static JsVisible operator +(JsVisible v1, JsVisible v2)
        {
            return new JsVisible(v1.CenterX + v2.CenterX, v1.CenterY + v2.CenterY, v1.Scale + v2.Scale);
        }

        public static JsVisible operator -(JsVisible v1, JsVisible v2)
        {
            return new JsVisible(v1.CenterX - v2.CenterX, v1.CenterY - v2.CenterY, v1.Scale - v2.Scale);
        }

        public static bool operator ==(JsVisible v1, JsVisible v2)
        {
            return v1.CenterX == v2.CenterX && v1.CenterY == v2.CenterY && v1.Scale == v2.Scale;
        }

        public static bool operator !=(JsVisible v1, JsVisible v2)
        {
            return !(v1 == v2);
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return String.Format("CenterX: {0}, CenterY: {1}, Scale: {2}", centerX, centerY, scale).ToString();
        }
    }
}