using System.Runtime.Serialization;

namespace Application.Helper.Entities
{
    public class Exhibit : Chronozoom.Entities.ExhibitRaw
    {
        public override string ToString()
        {
            var contentItemsCount = (ContentItems == null) ? "" : ",  ContentItemsCount = " + ContentItems.Count;
            return string.Format("[Exhibit: Title = {0}, Year = {1}{2}]", Title, Year, contentItemsCount);
        }
    }
}