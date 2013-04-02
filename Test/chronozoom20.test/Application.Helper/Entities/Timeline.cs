using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Timeline : Chronozoom.Entities.Timeline
    {
        public override string ToString()
        {
            return string.Format("[Timeline: Title = {0}]", Title);
        }
    }
}