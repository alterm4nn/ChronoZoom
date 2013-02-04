param
(
$BuildKey = ""
)

function Get-ScriptDirectory
{
	$Invocation = (Get-Variable MyInvocation -Scope 1).Value
	Split-Path $Invocation.MyCommand.Path
}

function Get-ConfigPath
{
	$ConfigPath = Join-Path $SrcFolderpath "Tests\config.xml"
	$CustomConfigPath = Join-Path $SrcFolderpath "Tests\customconfig.xml"
    $ValidConfigPath = ""
	if(Test-Path($CustomConfigPath))
	{
		$ValidConfigPath = $CustomConfigPath
	}
	elseif(Test-Path($ConfigPath))
	{
		$ValidConfigPath = $ConfigPath
	}
	if(!(Test-Path($CustomConfigPath)) -and !(Test-Path($ConfigPath)))
	{
		Write-Host "Config file not found." -ForegroundColor Red
		exit
	}
	Set-ItemProperty $ValidConfigPath -name IsReadOnly -value $false
    $ValidConfigPath
}

function StartNewProcess([string]$processPath, [string]$processArguments)
{
$process = New-Object System.Diagnostics.Process
$setup = $process.StartInfo
$setup.FileName = $processPath
$setup.Arguments = $processArguments
$setup.UseShellExecute = $false
$setup.RedirectStandardError = $true
$setup.RedirectStandardOutput = $true
$setup.RedirectStandardInput = $false
# Hook into the standard output and error stream events
$errEvent = Register-ObjectEvent -InputObj $process `
    -Event "ErrorDataReceived" `
    -Action `
    {
        param
        (
            [System.Object] $sender,
            [System.Diagnostics.DataReceivedEventArgs] $e
        )
        Write-Host -foreground "DarkRed" $e.Data
    }
$outEvent = Register-ObjectEvent -InputObj $process `
    -Event "OutputDataReceived" `
    -Action `
    {
        param
        (
            [System.Object] $sender,
            [System.Diagnostics.DataReceivedEventArgs] $e
        )
        Write-Host $e.Data
    }
# Start the process
[Void] $process.Start()
# Begin async read events
$process.BeginOutputReadLine()
$process.BeginErrorReadLine()
# Wait until process exit
while (!$process.HasExited)
{
    Start-Sleep -Milliseconds 100
}
# Shutdown async read events
$process.CancelOutputRead()
$process.CancelErrorRead()
$process.Close()
Write-Host "Done"
}

$MSTest10Pathx64 = "${Env:ProgramFiles}" + "\Microsoft Visual Studio 10.0\Common7\IDE\MSTest.exe"
$MSTest10Pathx86 = "${Env:ProgramFiles(x86)}" + "\Microsoft Visual Studio 10.0\Common7\IDE\MSTest.exe"
$MSTest11Pathx64 = "${Env:ProgramFiles}" + "\Microsoft Visual Studio 11.0\Common7\IDE\MSTest.exe"
$MSTest11Pathx86 = "${Env:ProgramFiles(x86)}" + "\Microsoft Visual Studio 11.0\Common7\IDE\MSTest.exe"
$MSTestPath = ""

if (Test-Path($MSTest10Pathx64))
{
	$MSTestPath = $MSTest10Pathx64
}
if (Test-Path($MSTest10Pathx86))
{
	$MSTestPath = $MSTest10Pathx86
}
if (Test-Path($MSTest11Pathx64))
{
	$MSTestPath = $MSTest11Pathx64
}
if (Test-Path($MSTest11Pathx86))
{
	$MSTestPath = $MSTest11Pathx86
}

$SrcFolderpath = Get-ScriptDirectory | Split-Path -Parent

$AbsoleteTestDllPath = "Tests\bin\Debug\Tests.dll"
$Configuration = "Debug"
if($BuildKey -match "NB")
{
	$AbsoleteTestDllPath = "Tests\bin\NB\Tests.dll"
	$Configuration = "NB"
}
if($BuildKey -match "BVT")
{
	$AbsoleteTestDllPath = "Tests\bin\BVT\Tests.dll"
	$Configuration = "BVT"
	if($BuildKey.Length -gt 3)
	{
		$AbsoleteTestDllPath = "Tests\bin\Debug\Tests.dll"
	}
}

$TestsLibraryPath = Join-Path $SrcFolderpath $AbsoleteTestDllPath
$ConfigPath = Get-ConfigPath
$MSTestSettingsPath = Join-Path $SrcFolderpath "local.testsettings"
$TestResultsPath = Join-Path $SrcFolderpath "TestResults"
$TrxToHtmlResultPath = Join-Path $SrcFolderpath "Utils\Trx2HtmlReport.exe"
$solutionPath = join-path $SrcFolderpath "ChronoZoom.Testing.sln"

$tempFolderName = Get-Date -Format "dd.MM.yy_HH.mm.ss"
$tempFolderPath = Join-Path $TestResultsPath $tempFolderName
New-Item -Path $tempFolderPath -ItemType "directory" | Out-Null

if (!(Test-Path($MSTest10Pathx64))-and!(Test-Path($MSTest10Pathx86))-and!(Test-Path($MSTest11Pathx86))-and!(Test-Path($MSTest11Pathx64)))
{
	Write-Host "MSTest not found" -ForegroundColor Red
	exit
}
else
{
    Write-host "MSTest found" -ForegroundColor Green
}

$MSBuildPath = ""
$MSBuildpathx64 = join-path $Env:windir "\Microsoft.NET\Framework64\v4.0.30319\msbuild.exe"
$MSBuildpathx86 = join-path $Env:windir "\Microsoft.NET\Framework\v4.0.30319\msbuild.exe"

if(test-path($MSBuildpathx86))
{
    $MSBuildPath = $MSBuildpathx86
}
elseif (test-path($MSBuildpathx64))
{
    $MSBuildPath = $MSBuildpathx64
}

if($MSBuildPath -eq "")
{
    Write-host "Can not find .NET Framework v4.0. please install and try again."
    exit
}

$MSBuildArgumentList = '"' + $solutionPath + '"' + " /p:Configuration=" + $Configuration
Write-Host "[Debug] msbuild arg list: " $MSBuildArgumentList

if((Test-Path($MSBuildPath)) -and ($MSBuildPath -ne "") -and (!(Test-path($TestsLibraryPath))))
{
	Write-Host "[Debug] msbuild args: " $MSBuildArgumentList
    StartNewProcess -processPath $MSBuildPath -processArguments $MSBuildArgumentList 
}

if (!(Test-Path($TestsLibraryPath)))
{
	Write-Host "Test.dll not found, please build manually test project in " $Configuration " configuration." -ForegroundColor Red
	exit
}

$xml = [xml](Get-Content $ConfigPath)
$isUsingGrid = $xml.Application.Settings.Global.IsUsingGrid
$x86hubUrl = $xml.Application.Settings.GridExecuting.x86HubUrl
$x64hubUrl = $xml.Application.Settings.GridExecuting.x64HubUrl

function New-Capability()
{
  param ($Platform, $BrowserName, $BrowserVersion)

  $capability = new-object PSObject
  
  $capability | add-member -type NoteProperty -Name Platform -Value $Platform
  $capability | add-member -type NoteProperty -Name BrowserName -Value $BrowserName
  $capability | add-member -type NoteProperty -Name BrowserVersion -Value $BrowserVersion

  return $capability
}

$capabilitiesArray = "",""
foreach ($capability in $xml.Application.Settings.GridExecuting.GridCapabilities.Capability)
{
	$localCapability = New-Capability -Platform $capability.Platform.ToLower() -BrowserName $capability.Browser.ToLower() -BrowserVersion $capability.Version.ToLower()
	$capabilitiesArray += $localCapability
}

function GetActuallyHub()
{
	param ($PlatformName)
	
	$ActuallyHub = ""
	
	if($PlatformName -match "x86")
	{
		$ActuallyHub = $xml.Application.Settings.GridExecuting.x86HubUrl
	}
	if($PlatformName -match "x64")
	{
		$ActuallyHub = $xml.Application.Settings.GridExecuting.x64HubUrl
	}
	
	return $ActuallyHub
}

function GetActuallyPlatform()
{
	param ($PlatformName)
	
	$ActuallyPlatform = ""
	
	if($PlatformName -match "Win7")
	{
		$ActuallyPlatform = "XP"
	}
	if($PlatformName -match "Win8")
	{
		$ActuallyPlatform = "Vista"
	}
	if($PlatformName -match "mac")
	{
		$ActuallyPlatform = "mac"
	}
	
	return $ActuallyPlatform
}

#region Category args
[Array]$IncludedCategories = $xml.Application.Settings.IncludeTestCategories.Category
[Array]$ExcludedCategories = $xml.Application.Settings.ExcludeTestCategories.Category

[String]$categoryArgs = ""

if($IncludedCategories -ne $null)
{
	$categoryArgs += $IncludedCategories -join '&'
	if($ExcludedCategories -ne $null)
	{
		$categoryArgs += '&!'
		$categoryArgs += $ExcludedCategories -join '&!'
	}
}
else
{
	if($ExcludedCategories -ne $null)
	{
		$categoryArgs += '!'
		$categoryArgs += $ExcludedCategories -join '&!'
	}
	else
	{
		$categoryArgs = ""
	}
}

if (($categoryArgs -eq $null) -or ($categoryArgs -eq ""))
{
	$categoryArgs = ""
}
else
{
	$categoryArgs = '/category:"' + $categoryArgs + '"'
}
#endregion 

Write-Host "Category args: " $categoryArgs

if(($isUsingGrid -eq "true"))
{
	if($capabilitiesArray.Count -ge 1)
	{
		foreach ($tempCapability in $capabilitiesArray)
			{
				if ($tempCapability -ne "")
				{
					$resultFilename = "local.trx"
					
						$resultFileName = $tempCapability.Platform + "-" + $tempCapability.BrowserName + "-" + $tempCapability.BrowserVersion + ".trx"
						$resultFilePath = Join-Path $tempFolderPath $resultFileName
						
						$xml.Application.Settings.Global.BrowserName = $tempCapability.BrowserName
						$xml.Application.Settings.GridExecuting.BrowserVersion = $tempCapability.BrowserVersion
					
						$ActuallyPlatformName = GetActuallyPlatform -PlatformName $tempCapability.Platform
						$xml.Application.Settings.GridExecuting.PlatformName = [string]$ActuallyPlatformName
					
						$ActuallyHub = GetActuallyHub -PlatformName $tempCapability.Platform
						$xml.Application.Settings.GridExecuting.HubUrl = [string]$ActuallyHub	
						
						try
						{
							$xml.Save($ConfigPath)
						}
						catch
						{
							Write-Host "File config.xml is not writable, please unlock it." -ForegroundColor Red
							exit
						}
						
						$resultFilePath = join-path $tempFolderPath $resultFilename
					
					$RedirectStandardError = $resultFilePath + ".errors.log"
					$RedirectStandardOutput = $resultFilePath + ".output.log"

					$MSTestArgumentList = " /testcontainer:" + '"' + $TestsLibraryPath + '"' + " /resultsfile:" + '"'+$resultFilePath+'"' + " /testsettings:" + '"' + $MSTestSettingsPath + '"' + ' ' + $categoryArgs
					$currentTime = Get-Date -Format "HH.mm.ss"
					Write-Host "Environment: " $resultFilename.Replace('.trx','') "`t Time start: " $currentTime
					Write-Host "[Debug] mstest args: " $MSTestArgumentList
					StartNewProcess -processPath $MSTestPath -processArguments $MSTestArgumentList
					
					$buildMachineResultFilePath = Join-Path $TestResultsPath "result.trx"
					Copy-Item $resultFilePath -Destination $buildMachineResultFilePath -Force
				}
			}
		}
		else
		{
			Write-Host "Count of capabilities less or equal zero!" -ForegroundColor Red
			exit
		}
}

if(($isUsingGrid -eq "false"))
{
	$resultFilename = "local.trx"
	$resultFilePath = join-path $tempFolderPath $resultFilename
	$RedirectStandardError = $resultFilePath + ".errors.log"
	$RedirectStandardOutput = $resultFilePath + ".output.log"
					 
	$MSTestArgumentList = " /testcontainer:" + '"' + $TestsLibraryPath + '"' + " /resultsfile:" + '"'+$resultFilePath+'"' + " /testsettings:" + '"' + $MSTestSettingsPath + '"' + ' ' + $categoryArgs
	$currentTime = Get-Date -Format "HH.mm.ss"
	Write-Host "Environment: " $resultFilename.Replace('.trx','') "`t Time start: " $currentTime
	StartNewProcess -processPath $MSTestPath -processArguments $MSTestArgumentList 
}

$reportFilePath = join-path $tempFolderPath "TestReport.html"
$TrxParserArgumentList = "/resultsfolder:" + '"' + $tempFolderPath + '"' + " /reportfilepath:" + '"' + $reportFilePath + '" /reporttype:Full'


#region Screenshot collecting

$screenshotsFolderPath = join-path $tempFolderPath "Screenshots"
New-Item -Path $screenshotsFolderPath -ItemType Directory

$SsPathArray = @()
Get-ChildItem -Path $tempFolderPath -Filter *.png -Recurse  | foreach-object { $SsPathArray += $_.FullName }

foreach ($element in $SsPathArray) {
	Copy-Item $element $screenshotsFolderPath
}

#endregion

StartNewProcess -processPath $TrxToHtmlResultPath -processArguments $TrxParserArgumentList
Write-Host $reportFilePath