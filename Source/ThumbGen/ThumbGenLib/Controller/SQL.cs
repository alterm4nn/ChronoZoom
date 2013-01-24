using System;
using System.Data.Linq;
using System.Linq;

namespace ThumbGen
{
    public partial class Controller
    {
        /// <summary>
        /// Configures SQL connection using given string
        /// </summary>
        /// <param name="connectionString"></param>
        public void ConfigureSQL(string connectionString)
        {
            SourceConnectionString = connectionString;
            db = new DataContext(SourceConnectionString);
        }


        /// <summary>
        /// Get content item by ID
        /// </summary>
        /// <param name="id">ID of the ContentItem</param>
        /// <returns>Requested ContentItem, or null if it's not presented</returns>
        private ContentItem GetContentItemByGuid(Guid id)
        {
            Table<ContentItem> cItems = db.GetTable<ContentItem>();

            var q = from ci in cItems
                    where ci.ID == id && ci.IsDeleted == null && (ci.IsVisible == true || ci.IsVisible == null)
                    select ci;

            return q.ToArray()[0];

        }

        /// <summary>
        /// Get all content items
        /// </summary>
        /// <returns>ContentItem array</returns>
        private ContentItem[] GetAllContentItems()
        {
            Table<ContentItem> cItems = db.GetTable<ContentItem>();

            var q = from ci in cItems
                    where ci.IsDeleted == null && ci.IsVisible == true
                    select ci;

            return q.ToArray();
        }
    }
}
