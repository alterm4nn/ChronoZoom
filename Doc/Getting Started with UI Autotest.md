# Getting Started with UI Autotest #

This document shows you how to use [Selenium WebDriver](http://docs.seleniumhq.org/docs/03_webdriver.jsp) to run tests that emulate user actions within the browser. You can run tests locally, or remotely by using WebDriver Grid.

## Tools ##
- WebDriver as application driver
    - Chrome: https://code.google.com/p/selenium/wiki/ChromeDriver
    - Internet Explorer: https://code.google.com/p/selenium/wiki/InternetExplorerDriver
- Mstests as test runner <!-- Need more info about MSTest. Where to get, how to use? -->
- Visual Studio 2012 (or latest)

## Supported browsers ##
- Firefox
- Chrome
- Internet Explorer
- Safari (Mac only)

**How to run UI tests on your local computer**

1. Get code from github https://github.com/alterm4nn/ChronoZoom.
2. Build the Chronozoom.Entities project.
3. Open ChronoZoom.Testing.sln.
4. Build the solution  (All required packages will be installed).
5. Configure settings <!-- Where? Which file/setting do I modify? -->
    a. Set BaseUrl(http://test.chronozoomproject.org) 
    b. BrowserName("chrome", "firefox" or "internet explorer")

6. Add rules for chromedriver and iedriver in Windows Firewall <!-- Need more details -->
7. Fill UsersInfo.settings - this file is required for AuthorizationTests (The file is added to .gitignore) <!-- Need more details -->
8. Launch Visual Studio and open Test Explorer.
9. Run one test.
    a. Browser will be started
    b. Homepage will be opened
    c. Test will do something
    d. Browser will be closed
    e. Test results will be shown
