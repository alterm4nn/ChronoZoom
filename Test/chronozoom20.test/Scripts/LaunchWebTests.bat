@Echo Off
if "%1"=="" ( 
powershell ./LaunchWebTests.ps1 -BuildKey "empty"
) else (
powershell ./LaunchWebTests.ps1 -BuildKey %1 )