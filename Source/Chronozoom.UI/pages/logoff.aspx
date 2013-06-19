<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="logoff.aspx.cs" Inherits="Chronozoom.UI.LogOff" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Logging Out - ChronoZoom</title>
</head>
<body>
    <iframe src="<% Response.Write(Chronozoom.UI.LogOff.LogOffUrl().ToString()); %>" seamless="seamless" style="border: 0px none transparent;" onload="window.location = '/';">

    </iframe>
</body>
</html>
