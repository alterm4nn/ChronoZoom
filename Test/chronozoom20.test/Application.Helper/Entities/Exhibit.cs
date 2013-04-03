using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Application.Helper.Entities
{
    public class Exhibit : Chronozoom.Entities.Exhibit
    {
        public string ExhibitId { get; set; }
        public override string ToString()
        {
            var contentItemsCount = (ContentItems == null) ? "" : ",  ContentItemsCount = " + ContentItems.Count;
            var exhibitId = (ExhibitId == null) ? "" : ",  ExhibitId = " + ExhibitId;
            return string.Format("[Exhibit: Title = {0}, Time = {1}{2}{3}]", Title, Time, contentItemsCount,exhibitId);
        }
    }
}