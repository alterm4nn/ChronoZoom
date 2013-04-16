# Getting Started with UI Autotest #

This document shows you how to use [Selenium WebDriver](http://docs.seleniumhq.org/docs/03_webdriver.jsp) to run tests that emulate user actions within the browser. You can run tests locally, or remotely by using WebDriver Grid.

## Tools ##
- WebDriver as application driver
    - Chrome: https://code.google.com/p/selenium/wiki/ChromeDriver
    - Internet Explorer: https://code.google.com/p/selenium/wiki/InternetExplorerDriver
- [Mstest](http://msdn.microsoft.com/en-us/library/ms182489(v=vs.80).aspx) to run tests.
- [Visual Studio 2012](http://www.microsoft.com/visualstudio/eng/products/visual-studio-overview) (or latest).

## Supported browsers ##
- Firefox (native WebDriver support)
- Safari (Mac only, native WebDriver support)
- Chrome (Chromedriver required)
- Internet Explorer (InternetExplorerDriver required)


**How to run UI tests on your local computer**

1. Get the source code from github (fork https://github.com/alterm4nn/ChronoZoom).
2. Open **Source\Chronozoom.sln**
3. Build the **Source\Chronozoom.Entities\Chronozoom.Entities.csproj** project.
4. Open **Test\chronozoom20.test\ChronoZoom.Testing.sln**.
5. Build the solution  (All required packages will be installed).
6. Configure tests settings:
	a. Open a file **Test\chronozoom20.test\Tests.UI\config.xml
	b. Set BaseUrl(http://test.chronozoomproject.org) 
	c. BrowserName("chrome", "firefox" or "internet explorer")
7. Add rules for chromedriver and iedriver in Windows Firewall:
	a. Open Windows Firewall
	b. Open Advanced Settings
	c. Open Inbound Rules
	d. Create new rule for programs (chromedriver and iedriver)
		i. Path to program: **Test\chronozoom20.test\ThirdParty\** + chromedriver.exe or IEDriverServer.exe
		ii. Set by default others settings
8. Configure setting for AuthorizationTests: 
	a. Open file **Test\chronozoom20.test\Application.Helper\Constants\Accounts.xml**
	b. Set Login and Password for Google, Yahoo and Microsoft accounts. **Please, Don't use own accounts. You can create accounts for tests**
	c. Save file
	d. Dont commit changes of the file to github. You can to add the file to git unstage (git update-index --assume-unchanged **PathToFile**/Accounts.xml)
9. Open Test Explorer and run UI tests (Tests from project Tests.UI)
10. Run a test.
    a. Browser will be started
    b. Homepage will be opened
    c. Test will do something
    d. Browser will be closed
    e. Test results will be shown
