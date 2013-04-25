IF exist ..\packages\Chutzpah.2.3.0\ ( echo Chutzpah found ) ELSE ( echo Please install Chutzpah or rebuild solution && PAUSE && exit )

..\packages\Chutzpah.2.3.0\tools\chutzpah.console.exe ..\Tests.BL\Scripts\Specs /junit ..\JUnitResult.xml
JUnitToHtml.exe /targetfile:..\JUnitResult.xml /reportfile:..\JUnitResult.html
..\JUnitResult.html