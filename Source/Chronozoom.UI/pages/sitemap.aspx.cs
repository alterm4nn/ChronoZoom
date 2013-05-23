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

        private static Lazy<IChronozoomSVC> _chronozoomService = new Lazy<IChronozoomSVC>(() =>
        {
            WebHttpBinding myBinding = new WebHttpBinding();
            myBinding.MaxReceivedMessageSize = 100000000;

            EndpointAddress myEndpoint = new EndpointAddress(_hostPath.Value + "/api/chronozoom.svc");

            ChannelFactory<IChronozoomSVC> factory = new ChannelFactory<IChronozoomSVC>(myBinding, myEndpoint);
            factory.Endpoint.Behaviors.Add(new WebHttpBehavior());
            return factory.CreateChannel();
        });

        protected static IEnumerable<SuperCollection> Collections()
        {
            return _chronozoomService.Value.GetCollections();
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