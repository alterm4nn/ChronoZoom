# Getting started with BL tests #
This document shows you how to use Business Logic tests (BLTs).
BLTs are implemented using JavaScript and the Jasmine framework, and are used to check the base functionality of the ChronoZoom project.

## Tools ##
- [Jasmine](http://pivotal.github.io/jasmine/) - A behavior-driven development framework for testing JavaScript code.
- [Chutzpah](http://chutzpah.codeplex.com/) - An open source JavaScript test runner which helps you integrate JavaScript unit testing into your website.

**How to run BL tests**

1. Download Chutzpah from [Codeplex](http://chutzpah.codeplex.com/)
2. Extract the archive to any folder.
3. Get the source code from github (fork https://github.com/alterm4nn/ChronoZoom). For more information see [Clone the ChronoZoom GitHub Repository](https://github.com/willum070/ChronoZoom/blob/docs/Doc/ChronoZoom_Developer_Guide.md#clone-the-chronozoom-github-repository).
4. Build the **Test\chronozoom20.test\Tests.BL\Tests.BL.csproj** project.(All required packages will be installed)

You can use [MsBuild.exe](http://msdn.microsoft.com/en-us/library/vstudio/ms164311.aspx) for building the project

    *Example:* 
    `[pathToMsBuild]\MsBuild.exe [Chronozoom solution dir]\Test\chronozoom20.test\Tests.BL\Tests.BL.csproj`

5. Run Chutzpah  for **Test\chronozoom20.test\Tests.BL\Scripts\Specs\** from command line (cmd.exe)
	
    *Example:*
    `[Path to unpackaged chutzpah]\chutzpah.console.exe  [Chronozoom solution dir]\Test\chronozoom20.test\Tests.BL\Scripts\Specs\`

If you want open results in browser you could use key "/openInBrowser"

    *Example:*
    `[Path to extracted chutzpah]\chutzpah.console.exe  [solution dir]\Test\chronozoom20.test\Tests.BL\Scripts\Specs\ /openInBrowser`
	
[All chutzpah Command Line Options](http://chutzpah.codeplex.com/wikipage?title=Command%20Line%20Options&referringTitle=Documentation)