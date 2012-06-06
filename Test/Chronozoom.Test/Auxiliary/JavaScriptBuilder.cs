using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Chronozoom.Test.Auxiliary
{
    public class JavaScriptBuilder
    {
        public StringBuilder script { get; set; }

        public JavaScriptBuilder()
        {
            script = new StringBuilder();
        }

        protected string QuotesIsolation(string name)
        {
            return '"' + name + '"';
        }

        protected void Variable(string name)
        {
            script.Append(name);            
        }

        protected void Return()
        {
            script.Append("return ");
        }

        protected void NestedField(string name)
        {
            script.Append('.');
            script.Append(name);
        }

        protected void JQRequest(string id)
        {
            string ID = '#' + id;
            script.Append("$(");
            script.Append(QuotesIsolation(ID));
            script.Append(')');
        }
    }
}
