using System.Web.Optimization;

namespace Chronozoom.UI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            // CSS bundling and minification handled by LESS, otherwise one
            // could use new StyleBundle in the same format as ScriptBundle.

            bundles.Add(new ScriptBundle("~/cz.min.js").Include(
            (
                "~/scripts/settings.js",
                "~/scripts/common.js",
                "~/scripts/viewport.js",
                "~/scripts/viewport-animation.js",
                "~/scripts/gestures.js",
                "~/scripts/virtual-canvas.js",
                "~/scripts/vccontent.js",
                "~/scripts/viewport-controller.js",
                "~/scripts/urlnav.js",
                "~/scripts/layout.js",
                "~/scripts/tours.js",
                "~/scripts/search.js",
                "~/scripts/bibliography.js",
                "~/scripts/breadcrumbs.js",
                "~/scripts/authoring.js",
                "~/scripts/authoring-ui.js",
                "~/scripts/service.js",
                "~/scripts/data.js",
                "~/scripts/media.js",
                "~/scripts/plugins/error-plugin.js",
                "~/scripts/plugins/utility-plugins.js",
                "~/scripts/extensions/extensions.js",
                "~/scripts/extensions/rinplayer.js",
                "~/ui/controls/datepicker.js",
                "~/ui/controls/listboxbase.js",
                "~/ui/controls/formbase.js",
                "~/ui/controls/medialist.js",
                "~/ui/media/bing-mediapicker.js",
                "~/ui/media/skydrive-mediapicker.js",
                "~/ui/contentitem-listbox.js",
                "~/ui/auth-edit-timeline-form.js",
                "~/ui/auth-edit-exhibit-form.js",
                "~/ui/auth-edit-contentitem-form.js",
                "~/ui/auth-edit-tour-form.js",
                "~/ui/auth-edit-collection-form.js",
                "~/ui/auth-edit-collection-editors.js",
                "~/ui/header-edit-form.js",
                "~/ui/header-edit-profile-form.js",
                "~/ui/header-login-form.js",
                "~/ui/header-logout-form.js",
                "~/ui/header-search-form.js",
                "~/ui/timeseries-data-form.js",
                "~/ui/timeseries-graph-form.js",
                "~/ui/tour-listbox.js",
                "~/ui/tourslist-form.js",
                "~/ui/tourstop-listbox.js",
                "~/ui/tour-caption-form.js",
                "~/ui/message-window.js",
                "~/ui/header-session-expired-form.js",
                "~/ui/mediapicker-form.js",
                "~/ui/start-page.js",
                "~/scripts/cz.js"
            ));
        }
    }
}
