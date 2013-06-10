# Getting started with Unit tests #
This document shows you how to use Unit tests (UTs).

## Tools ##
- [Jasmine](http://pivotal.github.io/jasmine/) is a behavior-driven development framework for testing JavaScript code
- [Chutzpah](http://chutzpah.codeplex.com/) - A JavaScript Test Runner 

**How to run Unit tests**

1. Download Chutzpah from [site] (http://chutzpah.codeplex.com/)
2. Extract archive to any folder
3. Get the source code from github (fork https://github.com/alterm4nn/ChronoZoom).
4. Run Chutzpah  for **Test\chronozoom20.test\Tests.Unit\Scripts\Specs\** from command line (cmd.exe)
	
	*Example:*
	[Path to unpackaged chutzpah]\chutzpah.console.exe  [Chronozoom solution dir]\Test\chronozoom20.test\Tests.Unit\Scripts\Specs\
	
	If you want open results in browser you could use key "/openInBrowser"
	
	*Example:*
	[Path to extracted chutzpah]\chutzpah.console.exe  [solution dir]\Test\chronozoom20.test\Tests.Unit\Scripts\Specs\ /openInBrowser
	
	All chutzpah Command Line Options - [there](http://chutzpah.codeplex.com/wikipage?title=Command%20Line%20Options&referringTitle=Documentation)

	**Note**
If you want to run tests from Visual Studio 2012's Unit Text Explorer you should install "[Chutzpah Test Adapter for Visual Studio](http://visualstudiogallery.msdn.microsoft.com/71a4e9bd-f660-448f-bd92-f5a65d39b7f0)"

	Open Tools in Visual Studio menu
	Select Extesions and Updates
	Find Chutzpah Test Adapter for Visual Studio
	Install it
