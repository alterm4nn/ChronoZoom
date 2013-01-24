using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Globalization;
using System.Collections.ObjectModel;

namespace Chronozoom.Test.Auxiliary
{
    /// <summary>
    /// Provides Stringify and Parse methods to work with JSON.
    /// </summary>
    public static class JSONHelper
    {
        /// <summary>
        /// Converts object to JSON string.
        /// </summary>
        /// <remarks>A type of object must implement a data contract.</remarks>
        /// <param name="type">A type of object being converted.</param>
        /// <param name="obj">An object being converted.</param>
        /// <returns>JSON string of object.</returns>
        public static string Stringify(Type type, object obj)
        {
            // If types are not the same and object's type doesn't inherit from type.
            if (obj.GetType() != type && !type.IsInstanceOfType(obj))
            {
                throw new ArgumentException("type");
            }

            string json = String.Empty;
            MemoryStream helperStream = new MemoryStream();
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(type);

            using (StreamReader reader = new StreamReader(helperStream))
            {
                serializer.WriteObject(helperStream, obj);
                helperStream.Position = 0;
                json = reader.ReadToEnd();
            }

            return json;
        }

        /// <summary>
        /// Converts object to JSON string.
        /// </summary>
        /// <remarks>A type of object must implement a data contract.</remarks>
        /// <param name="obj">An object being converted.</param>
        /// <returns>JSON string of object.</returns>
        public static string Stringify(object obj)
        {
            string json = String.Empty;
            MemoryStream helperStream = new MemoryStream();
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());

            using (StreamReader reader = new StreamReader(helperStream))
            {
                serializer.WriteObject(helperStream, obj);
                helperStream.Position = 0;
                json = reader.ReadToEnd();
            }

            return json;
        }

        /// <summary>
        /// Converts Dictionary to JSON string.
        /// </summary>
        /// <param name="dic">A Dictionary being converted.</param>
        /// <returns>JSON string of Dictionary.</returns>
        public static string Stringify(Dictionary<string, object> dic)
        {
            if (dic == null)
            {
                throw new ArgumentNullException("dic");
            }

            StringBuilder json = new StringBuilder("{");

            foreach (KeyValuePair<string, object> pair in dic)
            {
                if (pair.Key == null)
                {
                    throw new NullReferenceException("Key of KeyValuePair in Dictionary are null.");
                }

                // Recursive build of JSON string.
                if (pair.Value is Dictionary<string, object>)
                {
                    json.Append('"').Append(pair.Key).Append('"').Append(':');
                    json.Append(Stringify(pair.Value as Dictionary<string, object>));
                    json.Append(',');
                }
                if (pair.Value is ReadOnlyCollection<object>)
                {
                    json.Append('"').Append(pair.Key).Append('"').Append(':');
                    json.Append(StringifyArray(pair.Value as ReadOnlyCollection<object>));
                    json.Append(',');
                }
                else
                {
                    // In case of double numbers it should parse value in
                    // "0.0" format, not in "0,0" format. Otherwise there
                    // will be serialization error.
                    // Strings must be in quotes. All " quotes replace with ' quotes.
                    double num;
                    string value = (pair.Value != null) ? pair.Value.ToString() : "null";

                    json.Append('"').Append(pair.Key).Append('"').Append(':');
                    if (Double.TryParse(value, out num))
                    {
                        string result = num.ToString(CultureInfo.CreateSpecificCulture("en-US"));
                        json.Append(result).Append(',');
                    }
                    else if (pair.Value != null && pair.Value.GetType() == typeof(string))
                    {
                        value = value.Replace('"', '\'');
                        json.Append('"').Append(value).Append('"').Append(',');
                    }
                    else
                    {
                        json.Append(value).Append(',');
                    }
                }
            }

            // Remove comma from the end of the string and add brace.
            json.Remove(json.Length - 1, 1).Append('}');
            return json.ToString();
        }  

        /// <summary>
        /// Parse JSON string to object.
        /// </summary>
        /// <remarks>A type of object must implement a data contract.</remarks>
        /// <param name="type">A type of object, which contains in JSON string.</param>
        /// <param name="json">A JSON string to parse.</param>
        /// <returns>Object from JSON string.</returns>
        public static object Parse(Type type, string json)
        {
            object obj = null;
            MemoryStream helperStream = new MemoryStream();
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(type);

            using (StreamWriter writer = new StreamWriter(helperStream))
            {
                writer.Write(json);
                writer.Flush();
                helperStream.Position = 0;
                obj = serializer.ReadObject(helperStream);
            }

            return obj;
        }

        private static string StringifyArray(ReadOnlyCollection<object> roc)
        {
            if (roc == null)
            {
                throw new ArgumentNullException("roc");
            }

            StringBuilder json = new StringBuilder("[");

            foreach (object obj in roc)
            {
                if (obj is Dictionary<string, object>)
                {
                    json.Append(Stringify(obj as Dictionary<string, object>));
                    json.Append(',');
                }
                else if (obj is ReadOnlyCollection<object>)
                {
                    json.Append(StringifyArray(obj as ReadOnlyCollection<object>));
                    json.Append(',');
                }
                else
                {
                    double num;
                    string value = (obj != null) ? obj.ToString() : "null";

                    if (Double.TryParse(value, out num))
                    {
                        string result = num.ToString(CultureInfo.CreateSpecificCulture("en-US"));
                        json.Append(result).Append(',');
                    }
                    else if (obj != null && obj.GetType() == typeof(string))
                    {
                        value = value.Replace('"', '\'');
                        json.Append('"').Append(value).Append('"').Append(',');
                    }
                    else
                    {
                        json.Append(value).Append(',');
                    }
                }
            }

            json.Remove(json.Length - 1, 1).Append(']');
            return json.ToString();
        }
    }
}
