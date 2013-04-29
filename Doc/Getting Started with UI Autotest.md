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

1. Get the source code from github (fork https://github.com/alterm4nn/ChronoZoom). For more information see [Clone the ChronoZoom GitHub Repository](https://github.com/willum070/ChronoZoom/blob/docs/Doc/ChronoZoom_Developer_Guide.md#clone-the-chronozoom-github-repository).
2. Open **Source\Chronozoom.sln**
3. Build the **Source\Chronozoom.Entities\Chronozoom.Entities.csproj** project.
4. Open **Test\chronozoom20.test\ChronoZoom.Testing.sln**.
5. Build the solution  (All required packages will be installed).
6. Configure tests settings:
	a. Open a file **Test\chronozoom20.test\Tests.UI\config.xml
	b. Set BaseUrl(http://test.chronozoomproject.org) 
	c. BrowserName("chrome", "firefox" or "internet explorer")
7. Add rules for chromedriver and iedriver in Windows Firewall:
	1. Open Windows Firewall.
	2. Click **Advanced settings**.
	3. Click **Inbound Rules**, then click **New Rule...**.
    4. Click **Programs**, then click **Next**
    5. Create a new rule for chromedriver using the following program path:
        `Test\chronozoom20.test\ThirdParty\chromedriver.exe`
    6. Complete the remaining wizard steps (accept default values).
    7. Repeat steps 2-6 to create a new rule for iedriver, using the following program path:
    	`Test\chronozoom20.test\ThirdParty\IEDriverServer.exe`
8. Configure setting for AuthorizationTests: 
	1. Open file `Test\chronozoom20.test\Application.Helper\Constants\Accounts.xml`
	2. Set Login and Password for Google, Yahoo and Microsoft accounts. **Please, Don't use your own accounts. You can create separate accounts for testing.**
	3. Save Accounts.xml.
	4. Don't commit these changes to github. Add the file to git unstage:
	   `git update-index --assume-unchanged **Test\chronozoom20.test\Application.Helper\Constants\Accounts.xml`
9. Open Test Explorer and run UI tests (tests are located within the **Tests.UI** project.).
10. Run a test.
    1. Browser will be started.
    2. Homepage will be opened.
    3. Test will do something.
    4. Browser will be closed.
    5. Test results will be shown.