# Getting Started with UI Autotest #
This document shows you how to use Buisness Logic tests (BLTs).
BLTs were been implemented by javascript and Jasmine framework and check base functionality of Chronozoom project.

## Tools ##
- [Jasmine]((http://pivotal.github.io/jasmine/)) is a behavior-driven development framework for testing JavaScript code
- [Chutzpah](http://chutzpah.codeplex.com/) - A JavaScript Test Runner 
- [Visual Studio 2012](http://www.microsoft.com/visualstudio/eng/products/visual-studio-overview) (or latest).


**How to run BL tests**

	1. Download Chutzpah from http://chutzpah.codeplex.com/
	2. Unpack archive to any folder
	3. Get the source code from github (fork https://github.com/alterm4nn/ChronoZoom).
	4. Build the **Test\chronozoom20.test\Tests.BL\Tests.BL.csproj** project.(All required packages will be installed)
		a.  You can use [MsBuild.exe](http://msdn.microsoft.com/en-us/library/vstudio/ms164311.aspx) for building the project
		Example: pathToMsBuild\MsBuild.exe [Chronozoom solution dir]\Test\chronozoom20.test\Tests.BL\Tests.BL.csproj
	5. Run Chutzpah  for **Test\chronozoom20.test\Tests.BL\Scripts\Specs\** from command line (cmd.exe)
	
		Example:
		[Path to unpackaged chutzpah]\chutzpah.console.exe  **[Chronozoom solution dir]\Test\chronozoom20.test\Tests.BL\Scripts\Specs\**
		
		If you want open results in browser you could use key " /openInBrowser"
		
		Example: 
		[Path to unpackaged chutzpah]\chutzpah.console.exe  **[Chronozoom solution dir]\Test\chronozoom20.test\Tests.BL\Scripts\Specs\** /openInBrowser
		
		All chutzpah command Line Options - [there](http://chutzpah.codeplex.com/wikipage?title=Command%20Line%20Options&referringTitle=Documentation)
