using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Authoring.WebRole.Controllers
{
    public class AuthoringUtilities
    {
        public AuthoringUtilities()
        {

        }        
    }

    public enum AuthTable
    {
        AuthoringTable = 1,
        AuthoringTableRolePermission = 2,
        ContentItem = 3,
        ContentKeyword = 4,
        Keyword = 5,
        LicenseType = 6,
        MediaType = 7,
        Permission = 8,
        Regime = 9,
        Role = 10,
        Threshold = 11,
        TimeUnit = 12,
        User = 13,
        Bookmark = 14,
        CitationType = 15,
        ExhibitContentItem = 16,
        Exhibit = 17,
        ExhibitKeyword = 18,
        Reference = 19,
        ReferenceKeyword = 20,
        Timeline = 21,
        TimelineExhibit = 22,
        TourBookmark = 23,
        Tour = 24
    }

    public enum Permission
    {
        read = 1,
        write = 2,
        delete = 3,
        admin = 4
    }
}