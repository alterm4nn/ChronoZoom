using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.Linq;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using Chronozoom.Entities;

namespace Chronozoom.UI.Utils
{
    //  Example: (need to be logged in first)
    // 
    //  using (Chronozoom.UI.Utils.ExportImport xfer = new Utils.ExportImport())
    //  {
    //      List<Utils.ExportImport.FlatTimeline> test = xfer.GetTimelines(new Guid()); // cosmos
    //  }

    public class ExportImport : IDisposable
    {
        private List<FlatTimeline>      _flatTimelines;
        private Storage                 _storage;
        private User                    _user;

        public class FlatCollection
        {
            public string               date                { get; set; }
            public string               schema              { get; set; }
            public Collection           collection          { get; set; }
            public List<FlatTimeline>   timelines           { get; set; }
            public List<Tour>           tours               { get; set; }
        }

        public class FlatTimeline
        {
            public Guid?                parentTimelineId    { get; set; }
            public Timeline             timeline            { get; set; }
        }

        #region "Constructor/Destructor"

        public ExportImport()
        {
            // persist storage
            _storage = new Storage();

            // persist user object
            _user = GetUser();
        }

        private User GetUser()
        {
            try // may not have a context if class instantiated during start-up for initial db seeding
            {
                Microsoft.IdentityModel.Claims.ClaimsIdentity claimsIdentity = HttpContext.Current.User.Identity as Microsoft.IdentityModel.Claims.ClaimsIdentity;
                if (claimsIdentity          == null || !claimsIdentity.IsAuthenticated) { return null; }

                Microsoft.IdentityModel.Claims.Claim nameIdentifierClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("nameidentifier", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                if (nameIdentifierClaim     == null)                                    { return null; }

                Microsoft.IdentityModel.Claims.Claim identityProviderClaim = claimsIdentity.Claims.Where(candidate => candidate.ClaimType.EndsWith("identityprovider", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                if (identityProviderClaim   == null)                                    { return null; }

                return _storage.Users.Where(u => u.NameIdentifier == nameIdentifierClaim.Value).FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // free any managed resources
                _storage.Dispose();
            }
            // free any native resources
        }

        #endregion

        public List<FlatTimeline> ExportTimelines(Guid topmostTimelineId)
        {
            _flatTimelines = new List<FlatTimeline>();

            IterateTimelineExport(null, topmostTimelineId);

            _flatTimelines.Reverse();

            return _flatTimelines;
        }

        public Exhibit ExportExhibit(Guid exhibitId)
        {
            Exhibit exhibit = _storage.Exhibits.Where(t => t.Id == exhibitId).Include("ContentItems").FirstOrDefault();

            return exhibit;
        }

        private void IterateTimelineExport(Guid? parentTimelineId, Guid timelineId)
        {
            Timeline timeline =
                _storage.Timelines.Where(t => t.Id == timelineId)
                .Include("Exhibits.ContentItems")
                .Include("ChildTimelines")
                .FirstOrDefault();

            if (timeline != null)
            {
                FlatTimeline flatTimeline               = new FlatTimeline();
                flatTimeline.parentTimelineId           = parentTimelineId;
                flatTimeline.timeline                   = timeline;

                for (int eachExhibit = 0; eachExhibit < flatTimeline.timeline.Exhibits.Count; eachExhibit++)
                {
                    flatTimeline.timeline.Exhibits[eachExhibit].UpdatedBy = null;
                }

                foreach (Timeline child in timeline.ChildTimelines)
                {
                    IterateTimelineExport(timeline.Id, child.Id);
                }

                flatTimeline.timeline.ChildTimelines    = null;
                _flatTimelines.Add(flatTimeline);
            }
        }

        public string ImportCollection
        (
            Guid collectionId, string collectionTitle, string collectionTheme, List<FlatTimeline> timelines, List<Tour> tours,
            bool makeDefault = false, bool forcePublic = false, bool keepOldGuids = false, string forceUserDisplayName = null
        )
        {
            int                     titleCount  = 1;
            string                  titleAppend = "";
            string                  path        = Regex.Replace(collectionTitle.Trim(), @"[^A-Za-z0-9\-]+", "").ToLower(); 
            string                  type;
            Guid                    GUID;
            Guid                    newGUID;
            Dictionary<Guid, Guid>  newGUIDs    = new Dictionary<Guid, Guid>();
            DateTime                timestamp   = DateTime.UtcNow;
            User                    user        = _user;

            // ensure user logged in or provided in override
            if (forceUserDisplayName != null) user = _storage.Users.Where(u => u.DisplayName == forceUserDisplayName).FirstOrDefault();
            if (user == null)               { return "In order to import a collection, you must first be logged in."; }

            // ensure collection title is unique for user

            while
            (
                _storage.Collections.Where(c => c.User.Id == user.Id && c.Path == path + titleAppend).FirstOrDefault() != null
            )
            {
                titleCount++;
                titleAppend = "-" + titleCount;
            }

            if ((path + titleAppend).Length > 50) { return "Either the name of the collection to be imported is too long, or a collecton with this name already exists."; }

            // create new collection under existing user's supercollection

            SuperCollection superCollection = _storage.SuperCollections.Where(s => s.User.Id == user.Id).Include("User").Include("Collections").FirstOrDefault();

            if (superCollection == null) { return "The collection could not be imported as you are not properly logged in. Please log out then log back in again first."; }

            Collection collection = new Collection
            {
                Id                  = keepOldGuids ? collectionId : Guid.NewGuid(),
                SuperCollection     = superCollection,
                Default             = makeDefault,
                Path                = path + titleAppend,
                Title               = collectionTitle.Trim() + titleAppend,
                Theme               = collectionTheme == "" ? null : collectionTheme,
                MembersAllowed      = false,
                Members             = null,
                PubliclySearchable  = forcePublic,
                User                = user
            };

            superCollection.Collections.Add(collection);

            // iterate through each timeline

            foreach (FlatTimeline flat in timelines)
            {
                // keep cross-reference between old and new timelineIds so child timelines can maintain a pointer to their parents
                if (!keepOldGuids)
                {
                    newGUID = Guid.NewGuid();
                    newGUIDs.Add(flat.timeline.Id, newGUID);
                    flat.timeline.Id = newGUID;

                    if (flat.parentTimelineId != null) // not root timeline
                    {
                        flat.parentTimelineId = newGUIDs[(Guid)flat.parentTimelineId];
                    }
                }

                flat.timeline.Collection = collection;

                // iterate through each exhibit in the timeline  - change last updated to now with current user
                
                for (int eachExhibit = 0; eachExhibit < flat.timeline.Exhibits.Count; eachExhibit++)
                {
                    // also keep cross-references for exhibits if new GUIDs are assigned
                    if (!keepOldGuids)
                    {
                        newGUID = Guid.NewGuid();
                        newGUIDs.Add(flat.timeline.Exhibits[eachExhibit].Id, newGUID);
                        flat.timeline.Exhibits[eachExhibit].Id      = newGUID;
                    }

                    flat.timeline.Exhibits[eachExhibit].Collection  = collection;
                    flat.timeline.Exhibits[eachExhibit].UpdatedBy   = user;
                    flat.timeline.Exhibits[eachExhibit].UpdatedTime = timestamp;

                    // iterate through each content item in the exhibit

                    for (int eachItem = 0; eachItem < flat.timeline.Exhibits[eachExhibit].ContentItems.Count; eachItem++)
                    {
                        // also keep cross-references for content items if new GUIDs are assigned
                        if (!keepOldGuids)
                        {
                            newGUID = Guid.NewGuid();
                            newGUIDs.Add(flat.timeline.Exhibits[eachExhibit].ContentItems[eachItem].Id, newGUID);
                            flat.timeline.Exhibits[eachExhibit].ContentItems[eachItem].Id     = newGUID;
                        }

                        flat.timeline.Exhibits[eachExhibit].ContentItems[eachItem].Collection = collection;
                    }
                }

                // add timeline to database

                if (flat.parentTimelineId == null)
                {
                    _storage.Timelines.Add(flat.timeline);
                }
                else
                {
                    Timeline parentTimeline =
                    _storage.Timelines.Where(t => t.Id == flat.parentTimelineId)
                    .Include("ChildTimelines.Exhibits.ContentItems")
                    .FirstOrDefault();

                    parentTimeline.ChildTimelines.Add(flat.timeline);
                }

                // commit creations

                try
                {
                    _storage.SaveChanges();
                }
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            Trace.TraceInformation("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                    return "Sorry, we were unable to fully import this collection due to an unexpected error, but it may have partially been imported. Please click on My Collections to check.";
                }

            }

            // iterate through each tour

            foreach (Tour tour in tours)
            {
                tour.Collection = collection;

                // if using new GUIDs, create new ids for tour components and replace url guid parts using old to new GUID mapping
                if (!keepOldGuids)
                {
                    tour.Id = Guid.NewGuid();

                    // iterate through each tour stop

                    for (int eachBookmark = 0; eachBookmark < tour.Bookmarks.Count; eachBookmark++)
                    {
                        tour.Bookmarks[eachBookmark].Id = Guid.NewGuid();

                        // breakdown each tour stop url segment into parts
                        string[] parts = tour.Bookmarks[eachBookmark].Url.Split('/');

                        // iterate through each part, replacing the GUID fraction of the part with the new GUID that was mapped earlier during the timelines population
                        for (int eachPart = 1; eachPart < parts.Length; eachPart++)
                        {
                            if (parts[eachPart].Length == 37)
                            {
                                // part has two components
                                type = parts[eachPart].Substring(0, 1);         // first character in part is type
                                GUID = new Guid(parts[eachPart].Remove(0, 1));  // rest of part is GUID
                            }
                            else
                            {
                                // part has one component
                                type = "";
                                GUID = new Guid(parts[eachPart]);               // entire part is GUID
                            }

                            GUID = newGUIDs[GUID];                              // lookup the earlier mapped GUID
                            parts[eachPart] = type + GUID.ToString();           // and replace the old GUID with mapped
                        }

                        // rejoin all the tour stop url segment parts back together
                        tour.Bookmarks[eachBookmark].Url = String.Join("/", parts);
                    }
                }

                // add the tour
                _storage.Tours.Add(tour);

                // commit tour to database
                try
                {
                    _storage.SaveChanges();
                }
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            Trace.TraceInformation("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                    return "We imported all of the timelines, exhibits and content items but we wre unable to fully import tours. Please click on My Collections to check.";
                }

            }

            return "The collection has been imported as \"" + collection.Title + "\". Please click on \"My Collections\" in order to see your new collection.";
        }

        public string ImportTimelines(Guid intoTimelineId, List<FlatTimeline> importContent)
        {
            string                  lastImport  = "";
            Guid                    newGUID;
            Dictionary<Guid, Guid>  newGUIDs    = new Dictionary<Guid, Guid>();
            Timeline                target      = _storage.Timelines.Where(t => t.Id == intoTimelineId).Include("Collection").FirstOrDefault();
            DateTime                timestamp   = DateTime.UtcNow;

            try
            {
                if (target == null)                         { return "The destination timeline, \"" + intoTimelineId.ToString() + "\", where you want to paste to, does not exist."; }

                if (_user == null)                          { return "In order to change a timeline, you must first be logged in."; }

                if (!UserIsMember(target.Collection.Id))    { return "You do not have permission to alter the \"" + target.Title + "\" timeline."; }
                
                // iterate through each timeline
                foreach (FlatTimeline flat in importContent)
                {
                    // topmost timeline to be imported - ensure that its date range fits within the target timeline date range
                    if (flat.parentTimelineId == null)
                    {
                        if (flat.timeline.FromYear < target.FromYear || flat.timeline.ToYear > target.ToYear)
                        {
                            return "Unable to paste \"" + flat.timeline.Title + "\" into \"" + target.Title + "\", since " + 
                                   flat.timeline.Title + "'s date range exceeds that of " + target.Title + ".";
                        }
                        if (flat.timeline.FromYear == target.FromYear && flat.timeline.ToYear == target.ToYear)
                        {
                            return "Unable to paste \"" + flat.timeline.Title + "\" into \"" + target.Title + "\", since " +
                                   "both timelines' date ranges are identical.";
                        }
                    }

                    // replace GUIDs with new ones since we're cloning rather than moving - and set collection ids to target collection

                    // keep cross-reference between old and new timelineIds so child timelines can maintain a pointer to their parents
                    newGUID = Guid.NewGuid();
                    newGUIDs.Add(flat.timeline.Id, newGUID);

                    flat.timeline.Id = newGUID;
                    flat.timeline.Collection = target.Collection;

                    if (flat.parentTimelineId == null)
                    {
                        flat.parentTimelineId = target.Id;
                    }
                    else
                    {
                        flat.parentTimelineId = newGUIDs[(Guid) flat.parentTimelineId];
                    }

                    // no need to keep cross-reference for exhibits or their content items but they will need new GUIDs
                    for (int eachExhibit = 0; eachExhibit < flat.timeline.Exhibits.Count; eachExhibit++)
                    {
                        flat.timeline.Exhibits[eachExhibit].Id          = Guid.NewGuid();
                        flat.timeline.Exhibits[eachExhibit].Collection  = target.Collection;
                        flat.timeline.Exhibits[eachExhibit].UpdatedBy   = _user;
                        flat.timeline.Exhibits[eachExhibit].UpdatedTime = timestamp;

                        for (int eachItem = 0; eachItem < flat.timeline.Exhibits[eachExhibit].ContentItems.Count; eachItem++)
                        {
                            flat.timeline.Exhibits[eachExhibit].ContentItems[eachItem].Id           = Guid.NewGuid();
                            flat.timeline.Exhibits[eachExhibit].ContentItems[eachItem].Collection   = target.Collection;
                        }
                    }

                    // add timeline to database
                    Timeline importParent =
                        _storage.Timelines.Where(t => t.Id == flat.parentTimelineId)
                        .Include("ChildTimelines.Exhibits.ContentItems")
                        .FirstOrDefault();

                    importParent.ChildTimelines.Add(flat.timeline);
                    _storage.SaveChanges();
                    lastImport = flat.timeline.Title;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                if (lastImport == "")
                {
                    return "Unable to import any timelines. An unexpected error has occured. " +
                           "Please feel free to try again.";
                }
                else
                {
                    return "Unable to fully import all timelines. One or more were successfully imported, " +
                           "up to and including \"" + lastImport + "\". " +
                           "Please refresh your browser to see the new content.";
                }
            }
            
            return "\"" + importContent[0].timeline.Title + "\" has been pasted into \"" + target.Title + "\". " +
                   "You may need to refresh your browser in order to see any new content.";
        }

        public string ImportExhibit(Guid intoTimelineId, Exhibit newExhibit)
        {
            Timeline target = _storage.Timelines.Where(t => t.Id == intoTimelineId).Include("Collection").FirstOrDefault();
            DateTime timestamp = DateTime.UtcNow;

            try
            {
                if (target == null) { return "The destination timeline, \"" + intoTimelineId.ToString() + "\", where you want to paste to, does not exist."; }

                if (_user == null) { return "In order to change a timeline, you must first be logged in."; }

                if (!UserIsMember(target.Collection.Id)) { return "You do not have permission to alter the \"" + target.Title + "\" timeline."; }

                if (newExhibit.Year < target.FromYear || newExhibit.Year > target.ToYear)
                {
                    return "Unable to paste \"" + newExhibit.Title + "\" into \"" + target.Title + "\", since " +
                            newExhibit.Title + "'s date exceeds that of " + target.Title + ".";
                }

                // replace GUIDs with new ones since we're cloning rather than moving - and set collection ids to target collection

                // keep cross-reference between old and new timelineIds so child timelines can maintain a pointer to their parents
                Guid newGUID = Guid.NewGuid();

                newExhibit.Id = newGUID;
                newExhibit.Collection = target.Collection;

                newExhibit.UpdatedBy = _user;
                newExhibit.UpdatedTime = timestamp;
                if (target.Exhibits == null)
                {
                    target.Exhibits = new System.Collections.ObjectModel.Collection<Exhibit>();
                }

                for (int eachItem = 0; eachItem < newExhibit.ContentItems.Count; eachItem++)
                {
                    newExhibit.ContentItems[eachItem].Id = Guid.NewGuid();
                    newExhibit.ContentItems[eachItem].Collection = target.Collection;
                }

                target.Exhibits.Add(newExhibit);
                _storage.SaveChanges();
                }
            
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return "Unable to import the exhibit. An unexpected error has occured. " +
                        "Please feel free to try again.";
                
            }

            return "\"" + newExhibit.Title + "\" has been pasted into \"" + target.Title + "\". " +
                   "You may need to refresh your browser in order to see any new content.";
        }

        private bool UserIsMember(Guid collectionId)
        {
            return // is owner or (members are allowed and is member)
            (_storage.Collections.Where(c => c.Id == collectionId && c.User.Id == _user.Id).Count() > 0) ||
            (
                (_storage.Collections.Where(c => c.Id == collectionId && c.MembersAllowed).Count()  > 0) &&
                (_storage.Members.Where(m => m.User.Id == _user.Id && m.Collection.Id == collectionId).Count() > 0)
            );
        }
    }
}