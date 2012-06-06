<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="Chronozoom.Azure" generation="1" functional="0" release="0" Id="30a657dc-92ff-49b8-8baa-dafad83720b2" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="Chronozoom.AzureGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="Chronozoom.UI:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/LB:Chronozoom.UI:Endpoint1" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="Chronozoom.UI:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/MapChronozoom.UI:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="Chronozoom.UIInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/MapChronozoom.UIInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:Chronozoom.UI:Endpoint1">
          <toPorts>
            <inPortMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/Chronozoom.UI/Endpoint1" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapChronozoom.UI:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/Chronozoom.UI/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapChronozoom.UIInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/Chronozoom.UIInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="Chronozoom.UI" generation="1" functional="0" release="0" software="C:\Chronozoom\Main\Source\Chronozoom.Azure\csx\DevPreview\roles\Chronozoom.UI" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="1792" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;Chronozoom.UI&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;Chronozoom.UI&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/Chronozoom.UIInstances" />
            <sCSPolicyFaultDomainMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/Chronozoom.UIFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyFaultDomain name="Chronozoom.UIFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="Chronozoom.UIInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="6be8c2f9-1519-4b71-be22-c31b6484a3bd" ref="Microsoft.RedDog.Contract\ServiceContract\Chronozoom.AzureContract@ServiceDefinition.build">
      <interfacereferences>
        <interfaceReference Id="cfb22462-9dce-49b3-84c4-05b9423dd2bc" ref="Microsoft.RedDog.Contract\Interface\Chronozoom.UI:Endpoint1@ServiceDefinition.build">
          <inPort>
            <inPortMoniker name="/Chronozoom.Azure/Chronozoom.AzureGroup/Chronozoom.UI:Endpoint1" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>