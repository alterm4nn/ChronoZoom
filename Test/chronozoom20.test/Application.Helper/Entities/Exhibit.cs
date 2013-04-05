using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Application.Helper.Entities
{
    public class Exhibit : Chronozoom.Entities.Exhibit
    {
        public override string ToString()
        {
            var contentItemsCount = (ContentItems == null) ? "" : ",  ContentItemsCount = " + ContentItems.Count;
            return string.Format("[Exhibit: Title = {0}, Time = {1}{2}]", Title, Time, contentItemsCount);
        }
    }
}