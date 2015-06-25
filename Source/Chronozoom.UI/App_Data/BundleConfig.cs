using System.Web.Optimization;

namespace Chronozoom.UI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            /*
            
            Not using .NET bundling of individual .js files as .NET bundling has issues merging ChronoZoom scripts.
            Known gotchas include comments on last line of a .js file commenting out a code line in next .js file.
            Instead we use a pre-build batch job that concatenates all of our custom .js files and places them in a
            single file, cz.merged.js, in the root directory. We can then bundle this single file, which correctly
            minifies.
            
            IMPORTANT: If you add/remove a .js file, remember to edit Merge.cmd so it is included in the pre-build merge.
            You should also include it in the .js list in cz.html in case the option to use unmerged .js files is chosen.
            
            CSS bundling and minification is handled by LESS, otherwise one could also add a StyleBundle in the same
            manner as the ScriptBundle shown below.
            
            */

            bundles.Add(new ScriptBundle("~/cz.merged.min.js").Include
            (   // comma separated list:
                "~/cz.merged.js"
            ));

            bundles.Add(new ScriptBundle("~/czmin.merged.min.js").Include
            (   // comma separated list:
                "~/czmin.merged.js"
            ));
        }
    }
}
