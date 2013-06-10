using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chronozoom.Entities.Test
{
    public class StorageTestBase
    {
        protected Storage _storage = new Storage();
        protected Collection _betaCollection = null;

        [TestInitialize]
        public void Initialize()
        {
            _storage.Database.Delete();

            _betaCollection = _storage.Collections.Where(candidate => candidate.Title == "Beta Content").FirstOrDefault();
            Assert.IsNotNull(_betaCollection);
        }
    }
}
