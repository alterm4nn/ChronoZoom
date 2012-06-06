using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Authoring.WebRole.Models
{
    public partial class ContentItem
    {
        //Store image file if media type is picture
        public HttpPostedFileBase ImageFile { get; set; }
    }
}