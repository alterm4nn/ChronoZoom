// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------


using System.Collections.Generic;
using System.Threading;

namespace Chronozoom.Api.Models
{
    public static class Globals
    {
        public static Timeline Root { get; set; }
        public static List<Collection> Collections = new List<Collection>();
        public static Mutex Mutex = new Mutex();
    }
}