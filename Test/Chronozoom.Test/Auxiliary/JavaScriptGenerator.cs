using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenQA.Selenium;

namespace Chronozoom.Test.Auxiliary
{
    public class JavaScriptGenerator : JavaScriptBuilder
    {
        /// <summary>
        /// Add script string to script.
        /// </summary>
        /// <param name="script">Script to be added.</param>
        public void InvokeMethod(string script)
        {
            this.script.Append(script);
        }

        /// <summary>
        /// Add full jQuery request with plugin and method with its parameters to script.
        /// </summary>
        /// <param name="id">ID of element.</param>
        /// <param name="plugin">Plugin name.</param>
        /// <param name="method">Method name.</param>
        /// <param name="list">Parameters of method.</param>
        public void InvokeJQPluginMethod(string id, string plugin, string method, params object[] list)
        {
            JQRequest(id);
            NestedField(plugin);
            script.Append('(');
            script.Append(QuotesIsolation(method));

            for (int i = 0; i < list.Length; i++)
            {
                script.Append(',');
                if (list[i] is string)
                    // Verify whether list[i] is JSON or not
                    if ((list[i] as string)[0] == '{')
                        script.Append(list[i] as string);
                    else
                        script.Append(QuotesIsolation(list[i] as string));
                else
                    script.Append(list[i].ToString());
            }

            script.Append(')');
            script.Append(';');
        }

        /// <summary>
        /// Add request to nested field of variable to script.
        /// </summary>
        /// <param name="name">Variable name.</param>
        /// <param name="nestedField">Full path to nested field.</param>
        /// <param name="isMethod">Flag that signalize that the field is a method or not.</param>
        /// <param name="list">Parameters to the method.</param>
        public void InvokeVariableNestedField(string name, string nestedField, bool isMethod, params object[] list)
        {
            script.Append(name);
            if (nestedField != null)
                NestedField(nestedField);

            if (isMethod)
            {
                script.Append('(');
                for (int i = 0; i < list.Length; i++)
                {
                    if (list[i] is string)
                        // Verify whether list[i] is JSON or not
                        if ((list[i] as string)[0] == '{')
                            script.Append(list[i] as string);
                        else
                            script.Append(QuotesIsolation(list[i] as string));
                    else
                        script.Append(list[i].ToString());
                    script.Append(',');
                }
                if (list.Length != 0)
                    script.Remove(script.Length - 1, 1);
                script.Append(')');
            }
            script.Append(';');
        }

        /// <summary>
        /// Add request to return nested field of variable to script.
        /// </summary>
        /// <param name="name">Variable name</param>
        /// <param name="nestedField">Full path to nested field.</param>
        /// <param name="isMethod">Flag that signalize that the field is a method or not.</param>
        /// <param name="list">Parameters to the method.</param>
        public void InvokeReturnVariable(string name, string nestedField, bool isMethod, params object[] list)
        {
            Return();
            script.Append(name);
            if (nestedField != null)
                NestedField(nestedField);

            if (isMethod)
            {
                script.Append('(');
                for (int i = 0; i < list.Length; i++)
                {
                    if (list[i] is string)
                        // Verify whether list[i] is JSON or not
                        if ((list[i] as string)[0] == '{')
                            script.Append(list[i] as string);
                        else
                            script.Append(QuotesIsolation(list[i] as string));
                    else
                        script.Append(list[i].ToString());
                    script.Append(',');
                }
                if (list.Length != 0)
                    script.Remove(script.Length - 1, 1);
                script.Append(')');
            }
            script.Append(';');
        }

        /// <summary>
        /// Add new variable that must be initialized to script.
        /// </summary>
        /// <param name="name"></param>
        public void NewVariable(string name)
        {
            script.Append("var ");
            script.Append(name);
            script.Append('=');
        }

        /// <summary>
        /// Execute script in WebDriver.
        /// </summary>
        /// <param name="driver">WebDriver that execute script.</param>
        /// <returns>Result of executed script.</returns>
        public object ExecuteScript(IWebDriver driver)
        {
            var result = (driver as IJavaScriptExecutor).ExecuteScript(script.ToString()); // returns null without "return"
            script = new StringBuilder();

            return result;
        }

        public JavaScriptGenerator() : base() { }

        public override string ToString()
        {
            return script.ToString();
        }
    }
}
