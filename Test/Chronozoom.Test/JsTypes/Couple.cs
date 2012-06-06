using System;
using System.Runtime.Serialization;

namespace Chronozoom.Test.JsTypes
{
    [DataContract]
    public struct Couple
    {
        [DataMember]
        double right;

        [DataMember]
        double left;

        public double R1
        {
            get { return right; }
            set { right = value; }
        }

        public double L1
        {
            get { return left; }
            set { left = value; }
        }

        public Couple(double left = -14000000000.0, double right = 0.0)
        {
            this.left = left;
            this.right = right;
        }
    }
}
