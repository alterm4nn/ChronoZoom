using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Application.Helper.Entities
{
    [DataContract]
    [NotMapped]
    public class Tour : Chronozoom.Entities.Tour
    {
        public override string ToString()
        {
            return string.Format("[Tour: Name = {0}", Name);
        }
    }
}