// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using Chronozoom.Api.Models;
using System;
using System.Web.Http;

namespace Chronozoom.Api.Controllers
{
    public class TimelineController : ApiController
    {
        // sample request
        // http://localhost:4949/api/Timeline?left=-400&right=0&min_width=13700000000&lca_id=161
        public Timeline Get(double left, double right, double min_width, int lca_id/*, string filter*/)
        {
            if (left > right || min_width < 0 || lca_id < 0) return null;

            var root = Globals.Root;
            if (root == null) return null;

            if (left < root.left && right < root.left || left > root.right && right > root.right) return null;

            left = Math.Max(root.left, left);
            right = Math.Min(root.right, right);

            Timeline lca = null;

            var path = getPath(root, lca_id, ref lca);
            if (path == null || lca == null) return null;

            var content = getContent(lca, left, right, min_width);

            Timeline plca;
            for (plca = null, lca = path; lca.pathID != -1; plca = lca, lca = lca.ChildTimelines[lca.pathID]) ;
            if (plca != null)
            {
                lca.ChildTimelines.Clear();
                lca.Exhibits.Clear();
                lca.ChildTimelines.AddRange(content.ChildTimelines);
                lca.Exhibits.AddRange(content.Exhibits);
            }
            else
            {
                path = content;
            }

            return path;
        }

        private Timeline getPath(Timeline timeline, int lca_id, ref Timeline lca)
        {
            if (timeline.UniqueID == lca_id)
            {
                lca = timeline;
                Timeline t1 = timeline.clone();
                t1.isBuffered = false;
                t1.pathID = -1;
                return t1;
            }
            else
            {
                foreach (var child in timeline.ChildTimelines)
                {
                    Timeline t1 = getPath(child, lca_id, ref lca);
                    if (t1 != null)
                    {
                        var t2 = timeline.clone();
                        t2.isBuffered = false;

                        var k = 0;
                        foreach (var c in timeline.ChildTimelines)
                        {
                            if (c.UniqueID == t1.UniqueID)
                            {
                                t2.ChildTimelines.Add(t1);
                                t2.pathID = k;
                            }
                            else
                            {
                                var t = c.clone();
                                t.isBuffered = false;
                                t2.ChildTimelines.Add(t);
                            }
                            k++;
                        }

                        foreach (var e in timeline.Exhibits)
                        {
                            // var i = e.clone();
                            t2.Exhibits.Add(e);
                        }

                        return t2;
                    }
                }
                return null;
            }
        }

        private Timeline getContent(Timeline timeline, double left, double right, double min_width)
        {
            var t1 = timeline.clone();
            t1.isBuffered = true;
            t1.Exhibits.AddRange(timeline.Exhibits);

            foreach (var child in timeline.ChildTimelines)
            {
                if (!(child.left < left && child.right < left || child.left > right && child.right > right) && child.width >= min_width)
                    t1.ChildTimelines.Add(getContent(child, left, right, min_width));
                else
                    t1.ChildTimelines.Add(child.clone());
            }

            return t1;
        }
    }
}
