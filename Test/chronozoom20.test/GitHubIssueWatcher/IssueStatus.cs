using System;
using System.Linq;
using System.Net;
using Newtonsoft.Json;

namespace GitHubIssueWatcher
{
    public class IssueStatus
    {

        public static bool IsIssueResolved(string issueNumber)
        {
            const string repositoryName = "alterm4nn";
            const string projectName = "ChronoZoom";
            var response = SendRequest(repositoryName, projectName, issueNumber);
            if (response != null)
            {
                ResultsData objects = JsonConvert.DeserializeObject<ResultsData>(response);
                return objects.Labels.Any(label => label.Name == "resolved");
            }
            return true;
        }

        private static string SendRequest(string repository, string project, string issue)
        {
            try
            {
                var client = new WebClient();
                string url = String.Format("https://api.github.com/repos/{0}/{1}/issues/{2}", repository, project, issue);
                var response = client.DownloadString(url);
                return response;
            }
            catch (Exception)
            {
                return null;
            }
          
            
        }
    }

    internal class ResultsData
    {
        public string State { get; set; }
        public Label[] Labels { get; set; }
    }

    internal class Label
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string Color { get; set; }
    }
}
