using System;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Specifies the type of object contained by the search result.
    /// </summary>
    /// <param name="Exhibit"    >0</param>
    /// <param name="Timeline"   >1</param>
    /// <param name="ContentItem">2</param>
    [DataContract(Name = "ObjectType")]
    public enum ObjectType
    {
        [EnumMember]
        Exhibit     = 0,

        [EnumMember]
        Timeline    = 1,

        [EnumMember]
        ContentItem = 2
   }

    public class SearchResult
    {
        public Guid         Id              { get; set; }
        public ObjectType   ObjectType      { get; set; }
        public string       Title           { get; set; }
        public string       ReplacementURL  { get; set; }
    }

}