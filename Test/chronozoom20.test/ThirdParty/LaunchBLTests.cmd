@echo off
IF exist ..\packages\Chutzpah.2.3.0\ ( echo Chutzpah found.. && sleep 2s ) ELSE ( echo Please install Chutzpah or rebuild solution && PAUSE && exit )

IF exist %windir%\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe ( echo MSBuild found.. && sleep 2s ) ELSE ( echo Please install MSBuild 4.0 && PAUSE && exit )

echo Start project build..
sleep 2s
%windir%\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe ..\ChronoZoom.Testing.sln

echo Start BL tests..
sleep 2s
..\packages\Chutzpah.2.3.0\tools\chutzpah.console.exe ..\Tests.BL\Scripts\Specs /junit ..\JUnitResult.xml
JUnitToHtml.exe /targetfile:..\JUnitResult.xml /reportfile:..\BLTestReport.html
..\BLTestReport.html