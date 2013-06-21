<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="logoff.aspx.cs" Inherits="Chronozoom.UI.LogOff" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Logging Out - ChronoZoom</title>
</head>
<body>
    <iframe width="1" height="1" src="<% Response.Write(Chronozoom.UI.LogOff.LogOffUrl().ToString()); %>" seamless="seamless" style="border: 0px none transparent;" onload="window.location = '/';">

    </iframe>

    <% if (Chronozoom.UI.LogOff.GetIdentityProvider() == "Yahoo!") { %>
    <script>
        function CheckLoadStatusAndWait() {
            if (document.readyState !== "complete") {
                setTimeout("CheckLoadStatusAndWait();", 500);
            } else {
                window.location = "/";
            }
        }

        CheckLoadStatusAndWait();
    </script> 
    <% } %>
</body>
</html>
