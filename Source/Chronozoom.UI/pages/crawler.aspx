<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="crawler.aspx.cs"
    Inherits="Chronozoom.UI.Crawler" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1">
    <title><% Uri url = new Uri(Request.Url.ToString());
              if (Chronozoom.UI.Crawler.IsTimeline(Chronozoom.UI.Crawler.UrlGuid(url))) { Response.Write(Chronozoom.UI.Crawler.Timelines(Chronozoom.UI.Crawler.UrlGuid(url)).Title + " - "); }
              if (Chronozoom.UI.Crawler.IsExhibit(Chronozoom.UI.Crawler.UrlGuid(url))) { Response.Write(Chronozoom.UI.Crawler.Exhibits(Chronozoom.UI.Crawler.UrlGuid(url)).Title + " - "); }
              if (Chronozoom.UI.Crawler.IsContentItem(Chronozoom.UI.Crawler.UrlGuid(url))) { Response.Write(Chronozoom.UI.Crawler.ContentItems(Chronozoom.UI.Crawler.UrlGuid(url)).Title + " - "); } %>ChronoZoom</title>
    <%if (Chronozoom.UI.Crawler.IsGuid(UrlGuid(url)).Equals(false)) { Response.Write("<meta name='description' content='ChronoZoom is an open-source community project dedicated to visualizing the history of everything' />"); } %>
</head>

<body>
    <form id="form1">
        <% //// #### IF GUID == TIMELINE ####
            if (Chronozoom.UI.Crawler.IsTimeline(Chronozoom.UI.Crawler.UrlGuid(url)))
            {
                Chronozoom.Entities.Timeline timeline = Chronozoom.UI.Crawler.Timelines(Chronozoom.UI.Crawler.UrlGuid(url));%>

        <div>
            <h1><%Response.Write(timeline.Title); %></h1>
            <%  foreach (Chronozoom.Entities.Exhibit exhibit in timeline.Exhibits.OrderBy(exhibit => exhibit.Year))
                { %>
            <h2><a href="<% Response.Write(Chronozoom.UI.Crawler.UrlForCollection(Chronozoom.UI.Crawler.UrlSuperCollection(url), Chronozoom.UI.Crawler.UrlCollection(url)) + exhibit.Id.ToString()); %>"><% Response.Write(exhibit.Title); %></a></h2>
            <% } %>
        </div>
        <div>
            <section title="Timelines">
                <% if (timeline.ChildTimelines != null)
                   {
                       foreach (Chronozoom.Entities.Timeline childtimeline in timeline.ChildTimelines)
                           if (childtimeline != null)
                           { %>
                <% Response.Write("<a href='" + Chronozoom.UI.Crawler.UrlForCollection(Chronozoom.UI.Crawler.UrlSuperCollection(url), Chronozoom.UI.Crawler.UrlCollection(url)) + childtimeline.Id.ToString() + "'>" + childtimeline.Title + "</a><br/>"); %>
                <% } %>
                <% } %>
            </section>
        </div>
        <% } %>
        <% //// #### GUID == EXHIBIT ####
            if (Chronozoom.UI.Crawler.IsExhibit(Chronozoom.UI.Crawler.UrlGuid(url)))
            {
                Chronozoom.Entities.Exhibit exhibit = Chronozoom.UI.Crawler.Exhibits(Chronozoom.UI.Crawler.UrlGuid(url));
        %>
        <h1><% Response.Write(exhibit.Title); %></h1>
        <% foreach (Chronozoom.Entities.ContentItem contentitem in exhibit.ContentItems.OrderBy(c => c.Order))
               if (contentitem != null)
               { %>
        <% if (contentitem.MediaType == "Image" || contentitem.MediaType == "Picture")
           { %>
        <p>
            <img src="<% Response.Write(contentitem.Uri); %>" />
        </p>
        <% } %>
        <% if (contentitem.MediaType == "PDF" || contentitem.MediaType == "Video" || contentitem.MediaType == "Audio" || contentitem.MediaType == "Photosynth")
           { %>
        <p>
            <embed src="<% Response.Write(contentitem.Uri); %>" width="435" height="325" />
        </p>
        <% } %>
        <a href="<% Response.Write(Chronozoom.UI.Crawler.UrlForCollection(Chronozoom.UI.Crawler.UrlSuperCollection(url), Chronozoom.UI.Crawler.UrlCollection(url)) + contentitem.Id.ToString()); %>"><%Response.Write(contentitem.Title); %></a> - <% Response.Write(contentitem.Caption); %>
        <% } %>
        <% } %>
        <% ////  #### IF GUID == CONTENTITEM #### -->
            if (Chronozoom.UI.Crawler.IsContentItem(Chronozoom.UI.Crawler.UrlGuid(url)))
            {
                Chronozoom.Entities.ContentItem contentitem = Chronozoom.UI.Crawler.ContentItems(Chronozoom.UI.Crawler.UrlGuid(url)); %>
        <h1><%Response.Write(contentitem.Title); %></h1>
        <% if (contentitem.MediaType == "Image" || contentitem.MediaType == "Picture")
           { %>
        <p>
            <img src="<% Response.Write(contentitem.Uri); %>" />
        </p>
        <% } %>
        <% if (contentitem.MediaType == "PDF" || contentitem.MediaType == "Video" || contentitem.MediaType == "Audio" || contentitem.MediaType == "Photosynth")
           { %>
        <p>
            <embed src="<% Response.Write(contentitem.Uri); %>" width="435" height="325" />
        </p>
        <% } %>
        <a href="<% Response.Write(Chronozoom.UI.Crawler.UrlForCollection(Chronozoom.UI.Crawler.UrlSuperCollection(url), Chronozoom.UI.Crawler.UrlCollection(url)) + contentitem.Id.ToString()); %>"><%Response.Write(contentitem.Title); %></a> - <% Response.Write(contentitem.Caption); %>
        <% } %>
        <footer>
            <p>
                <% //// Here we need a link to point to the Root Timeline of the collection, based on the FriendlyURL passed to the page %>
                <%--<% Response.Write("<a href='http://" + Request.ServerVariables["HTTP_HOST"] + "/" + Chronozoom.UI.Crawler.RootTimelineId(url) + "'>Home</a>"); %>--%>
                <% Response.Write("<a href='" + Chronozoom.UI.Crawler.UrlForCollection(Chronozoom.UI.Crawler.UrlSuperCollection(url), Chronozoom.UI.Crawler.UrlCollection(url)) + Chronozoom.UI.Crawler.RootTimelineId(url) + "'>Home</a>"); %>
            </p>
        </footer>
    </form>
</body>
</html>
