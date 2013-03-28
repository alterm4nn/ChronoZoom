using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASC.Models
{
    public class User
    {
        private string nameIdentifier;
        private string identityProvider;
        private string settings;

        public string NameIdentifier
        {
            get
            {
                return nameIdentifier;
            }
            set
            {
                nameIdentifier = value;
            }
        }
        public string IdentityProvider
        {
            get
            {
                return identityProvider;
            }
            set
            {
                identityProvider = value;
            }
        }
        public string Settings
        {
            get
            {
                return settings;
            }
            set
            {
                settings = value;
            }
        }

    }
}