@echo off
IF exist %windir%\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe ( echo MSBuild found.. && sleep 2s ) ELSE ( echo Please install MSBuild 4.0 && PAUSE && exit )

echo Start project build..
sleep 2s
%windir%\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe ..\ChronoZoom.Testing.sln

SET ChutzPath=""
FOR /D %%G IN ("..\packages\Chutzpah*") DO set ChutzPath=%%G

IF exist %ChutzPath% ( echo Chutzpah found.. && sleep 2s ) ELSE ( echo Please install Chutzpah nuget package.. && PAUSE && exit )

echo Start Unit tests..
sleep 2s
%ChutzPath%\tools\chutzpah.console.exe ..\Tests.Unit\Scripts\Specs /junit ..\JUnitResult.xml
..\ThirdParty\JUnitToHtml.exe /targetfile:..\JUnitResult.xml /reportfile:..\UnitTestReport.html
..\UnitTestReport.html