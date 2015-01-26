using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Chronozoom.Entities;
using Newtonsoft.Json;

namespace Chronozoom.UI.Utils
{
    public class PopulateDbFromJSON : IDisposable
    {
        private readonly string     _jsonDirectory;
        private Storage             _storage        = new Storage();
        private ExportImport        _commonImport   = new ExportImport();

        #region constructor and destructor

        public PopulateDbFromJSON()
        {
            _jsonDirectory = AppDomain.CurrentDomain.BaseDirectory + @"Dumps\";
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
                _commonImport.Dispose();
                _storage.Dispose();
            }
            // free any native resources
        }

        #endregion

        #region public methods

        /// <summary>
        /// It's possible to feed files created by the Export Collection menu item to this function.
        /// This function uses the same mechanism as the Import Collection menu item, the only differences being:
        /// 1) Instead of using the currently logged in user, we use the curatorDisplayName.
        /// 2) If this user doesn't exist, we create the user.
        /// 3) If the user doesn't have a supercollection, we create the supercollection.
        /// 4) We can define if the collection is the default collection here. (A pre-existing default collection for the user must not exist.)
        /// This function can therefore be used to seed the database with the Cosmos collection or other collections when the database is first created.
        /// </summary>
        public void ImportCollection(string curatorDisplayName, string collectionTitle, string jsonFile, bool curatorsDefaultCollection = true, bool forcePublic = true, bool keepOldGUIDs = true)
        {
            bool dirty                  = false;

            // parse json file contents first in case invalid flat collection
            string jsonStringified      = File.ReadAllText(_jsonDirectory + jsonFile);
            ExportImport.FlatCollection collectionTree = JsonConvert.DeserializeObject<ExportImport.FlatCollection>(jsonStringified);

            // remove any excess spaces from display names
            curatorDisplayName          = curatorDisplayName.Trim();
            collectionTitle             = collectionTitle.Trim();

            // generate equivalent path names (uniqueness is assumed)
            string superCollectionPath  = Regex.Replace(curatorDisplayName, @"[^A-Za-z0-9\-]+", "").ToLower();  // Aa-Zz, 0-9 and hyphen only, converted to lower case.
            string collectionPath       = Regex.Replace(collectionTitle,    @"[^A-Za-z0-9\-]+", "").ToLower();  // Aa-Zz, 0-9 and hyphen only, converted to lower case.

            // get curator's user record or create if doesn't exist
            User user = _storage.Users.Where(u => u.DisplayName == curatorDisplayName).FirstOrDefault();
            if (user == null)
            {
                user = new User
                {
                    Id                  = Guid.NewGuid(),
                    DisplayName         = curatorDisplayName,
                    IdentityProvider    = "Populated from JSON"
                };
                _storage.Users.Add(user);
                dirty = true;
            }

            // get curator's supercollection record or create if doesn't exist
            SuperCollection superCollection = _storage.SuperCollections.Include("Collections").Where(s => s.Title == superCollectionPath).FirstOrDefault();
            if (superCollection == null)
            {
                superCollection = new SuperCollection
                {
                    Id                  = Guid.NewGuid(),
                    Title               = superCollectionPath,
                    User                = user,
                    Collections         = new System.Collections.ObjectModel.Collection<Collection>()
                };
                _storage.SuperCollections.Add(superCollection);
                dirty = true;
            }

            // commit any user or supercollection creations to db
            if (dirty) _storage.SaveChanges();

            // use the standard export/import mechanism to import collection
            Console.WriteLine
            (
                _commonImport.ImportCollection
                (
                    collectionId:           collectionTree.collection.Id,
                    collectionTitle:        collectionTitle,
                    collectionTheme:        collectionTree.collection.Theme,
                    timelines:              collectionTree.timelines,
                    tours:                  collectionTree.tours,
                    makeDefault:            curatorsDefaultCollection,
                    forcePublic:            forcePublic,
                    keepOldGuids:           keepOldGUIDs,
                    forceUserDisplayName:   curatorDisplayName
                )
            );
        }

        #endregion

    }
}