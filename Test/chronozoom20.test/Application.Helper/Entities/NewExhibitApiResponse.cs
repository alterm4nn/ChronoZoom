using System.Collections.ObjectModel;
using System.Runtime.Serialization;

namespace Application.Helper.Entities
{
    [DataContract]
    public class NewExhibitApiResponse
    {
        [DataMember(Name = "ContentItemId")]
        public Collection<string> ContentItemId { get; set; }
        [DataMember(Name = "ExhibitId")]
        public string ExhibitId { get; set; }

    }
}