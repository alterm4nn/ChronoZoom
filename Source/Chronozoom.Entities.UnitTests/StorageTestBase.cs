using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace Chronozoom.Entities.UnitTests
{
    public class StorageTestBase
    {
        protected Storage Storage = new Storage();
        protected Collection BetaCollection = null;

        [TestInitialize]
        public void StorageTestBaseInitialize()
        {
            Storage.Database.Delete();

            BetaCollection = Storage.Collections.FirstOrDefault(candidate => candidate.Title == "Beta Content");
            Assert.IsNotNull(BetaCollection);
        }
    }
}
