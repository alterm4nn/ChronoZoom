# Installing the ChronoZoom Development Environment Tools #

## Minimum Requirements ##
- [Visual Studio 2012 Ultimate](http://www.microsoft.com/visualstudio/eng/products/visual-studio-overview) ([Express for Web](http://www.microsoft.com/visualstudio/eng/products/visual-studio-express-for-web) may work?)
- [Visual Studio 2012.2 CTP 3](http://www.microsoft.com/en-us/download/details.aspx?id=36539)
- [Visual Studio Tools for Git](http://visualstudiogallery.msdn.microsoft.com/abafc7d6-dcaa-40f4-8a5e-d6724bdb980c)
- [Git for Windows](http://code.google.com/p/msysgit/downloads/list?q=full+installer+official+git)
 - Be sure to select 'Run Git from the Windows Command Prompt'
- [Stylecop](http://stylecop.codeplex.com/)

## Recommended ##
- [Beyond Compare](http://www.scootersoftware.com/moreinfo.php)
 - [Using Beyond Compare with Git](http://www.scootersoftware.com/support.php?zz=kb_vcs)
- [Markdown Pad for Windows](http://markdownpad.com/)
- [Web Essentials 2012](http://visualstudiogallery.msdn.microsoft.com/07d54d12-7133-4e15-becb-6f451ea3bea6)
- [Jetbrains Resharper](http://www.jetbrains.com/resharper)
 - [Free license for open source development](http://www.jetbrains.com/eforms/openSourceRequest.action?licenseRequest=RSOSL)



## Optional ##
- [Web Platform Installer](http://www.microsoft.com/web/downloads/platform.aspx)
- [SQL Server Express 2012 SP1 with Tools](http://www.microsoft.com/en-us/download/details.aspx?id=35579)
 - Use Mixed Mode Authentication, Azure doesn't support Integrated Mode security
- Internet Information Server
- [Azure SDK for .NET](http://www.windowsazure.com/en-us/develop/downloads/)

## Setup SSH Key for Github authentication ##
See [Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys)

	ssh-keygen -t rsa -C "youremail@server.com" -f %userprofile%\.ssh\id_rsa
	clip < %userprofile%\.ssh\id_rsa.pub

---

See Learning to use Github for ChronoZoom development for more information on setting up your source code repository.