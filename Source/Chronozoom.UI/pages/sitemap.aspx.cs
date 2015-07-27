using Chronozoom.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Chronozoom.UI
{
    public partial class SiteMap : System.Web.UI.Page
    {
        private static Lazy<string> _hostPath = new Lazy<string>(() =>
        {
            Uri uri = HttpContext.Current.Request.Url;
            return uri.Scheme + Uri.SchemeDelimiter + uri.Host + ":" + uri.Port;
        });

        protected static IEnumerable<SuperCollectionInfo> Collections()
        {
            return ChronozoomSVC.Instance.GetSuperCollections();
        }

        [SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase")]
        protected static Uri UrlForCollection(SuperCollection superCollection, Collection collection)
        {
            if (superCollection == null || collection == null || string.IsNullOrEmpty(superCollection.Title) || string.IsNullOrEmpty(collection.Title))
                return null;

            string path = _hostPath.Value + "/" + FriendlyUrl.FriendlyUrlEncode(superCollection.Title) + "/";
            if (string.CompareOrdinal(superCollection.Title, collection.Title) != 0)
            {
                path += FriendlyUrl.FriendlyUrlEncode(collection.Title) + "/";
            }

            return new Uri(path);
        }
    }
}