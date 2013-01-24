using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    [DataContract]
    public class Reference
    {
        [DataMember]
        public Guid ID { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Authors { get; set; }

        [DataMember]
        public string BookChapters { get; set; }

        [DataMember]
        public string CitationType { get; set; }
        
        [DataMember]
        public string PageNumbers { get; set; }

        [DataMember]
        public string Publication { get; set; }

        [DataMember]
        public string PublicationDates { get; set; }

        [DataMember]
        public string Source { get; set; }

        public Reference(Guid id, string title, string authors, string bookChapters, string citationType, string pageNumbers, string publication, string publicationDates, string source)
        {
            ID = id;
            Title = title;
            Authors = authors;
            BookChapters = bookChapters;
            CitationType = citationType;
            PageNumbers = pageNumbers;
            Publication = publication;
            PublicationDates = publicationDates;
            Source = source;
        }
    }
}
