using System.Collections.Generic;

namespace Application.Helper.Entities
{
    public class Bibliography
    {
        public List<Source> Sources { get; set; } 
    }

    public class Source
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}