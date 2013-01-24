using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Authoring.WebRole.Models
{
    public partial class Tour
    {
        //Store audio file 
        public HttpPostedFileBase AudioFile { get; set; }

        //Store ogg audio file 
        public HttpPostedFileBase OggAudioFile { get; set; }

    }
}