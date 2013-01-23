$error.clear()

# Validation
if ($args.length -ne 3)
{
   Write-Host "Usage: AzureDeployNew.ps1 <BuildPath> <PackageName> <PublishProfile>"
   exit 880
}

if (!(test-path $args[0]))
{
   Write-Host "Invalid build path:" $args[0]
   exit 881
}

if (!(test-path (join-path $args[0] $args[1])))
{
   Write-Host "Invalid package:" $args[1]
   exit 881
}


if (!(test-path $args[2]))
{
   Write-Host "Invalid publish profile:" $args[2]
   exit 881
}

Import-Module AzurePublishHelpers
$azurePubXml = New-Object AzurePublishHelpers.AzurePubXmlHelper
$publishProfileFullPath = Resolve-Path $args[2]
$publishProfile = $azurePubXml.GetPublishProfile($publishProfileFullPath)
Write-Host Using PublishProfile: $publishProfile.ConnectionName
$azureConnections = New-Object AzurePublishHelpers.WindowsAzureConnectionsHelper

# If runnning as NetworkService, explicitly set the location of the connections file
# $azureConnections.ConnectionsFile = "c:\builds\WindowsAzureConnections.xml"

$connection = $azureConnections.GetConnection($publishProfile.ConnectionName)
if ($connection -eq $null)
{
    Write-Host Could not find connection $publishProfile.ConnectionName in $azureConnections.ConnectionsFile - Make sure you have imported it onto the build server.
    exit 882
}

$sub = $connection.SubscriptionId
$certThumbprint = $connection.CertificateThumbprint

# For NetworkService use LocalMachine, for user accounts use CurrentUser
$certPath = "cert:\CurrentUser\MY\" + $certThumbprint
Write-Host Using certificate: $certPath
$cert = get-item $certPath
$buildPath = $args[0]
$packagename = $args[1]
$serviceconfig = "ServiceConfiguration.cscfg"
$servicename = $publishProfile.HostedServiceName
$storageAccount = $publishProfile.StorageAccountName
$package = join-path $buildPath $packageName
$config = join-path $buildPath $serviceconfig
$deploymentSlot = $publishProfile.DeploymentSlot
$buildLabel = $publishProfile.DeploymentLabel
if ($publishProfile.AppendTimestampToDeploymentLabel)
{
    $a = Get-Date
    $buildLabel = $buildLabel + "." + $a.ToString("MM.dd.yyyy") + "." + $a.ToString("HH.mm.ss")
} 
 
if ((Get-PSSnapin | ?{$_.Name -eq "WAPPSCmdlets"}) -eq $null)
{
  Add-PsSnapin WAPPSCmdlets
}
 
 
$hostedService = Get-HostedService $servicename -Certificate $cert -SubscriptionId $sub | Get-Deployment -Slot $deploymentSlot
 
if ($hostedService.Status -ne $null)
{
    $hostedService |
      Set-DeploymentStatus 'Suspended' |
      Get-OperationStatus -WaitToComplete
    $hostedService |
      Remove-Deployment |
      Get-OperationStatus -WaitToComplete
}

Get-HostedService $servicename -Certificate $cert -SubscriptionId $sub |
    New-Deployment $deploymentSlot -package $package -configuration $config -label $buildLabel -serviceName $servicename -StorageServiceName $storageAccount |
    Get-OperationStatus -WaitToComplete
 
 
Get-HostedService $servicename -Certificate $cert -SubscriptionId $sub | 
    Get-Deployment -Slot $deploymentSlot | 
    Set-DeploymentStatus 'Running' | 
    Get-OperationStatus -WaitToComplete
  
 
$Deployment = Get-HostedService $servicename -Certificate $cert -SubscriptionId $sub | Get-Deployment -Slot $deploymentSlot
Write-host Deployed to $deploymentSlot slot: $Deployment.Url

if ($error) { exit 888 }
