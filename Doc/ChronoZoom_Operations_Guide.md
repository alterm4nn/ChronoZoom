# ChronoZoom Operations Guide #
You can use the [Azure Management Portal](https://manage.windowsazure.com/) to configure and monitor your ChronoZoom site (and any other sites or resources that you have created on Azure). This guide summarizes the most common tasks that you will need to perform on Azure.

## Common Operational Procedures ##

**To Monitor Performance Data:** Use the [Azure Management Portal](https://manage.windowsazure.com/) **DASHBOARD** management page. Here you can access performance data such as current service load, data flow, connections and requests. You can also download diagnostics logs under the quick glance section. Note that the option to generate logs must first be enabled from the **CONFIGURE** management page.

**To Increase Service Capacity:** Use the [Azure Management Portal](https://manage.windowsazure.com/) **SCALE** management page. 

**To Take Site Down for Maintenance:** Use the **STOP** button on the bottom bar of the [Azure Management Portal](https://manage.windowsazure.com/) **DASHBOARD** management page. Users will see a generic "This site is currently not available" page. To start the site again, click the **START** button on the bottom bar.

**To Add Endpoint Monitoring:** See [How to Monitor Cloud Services](http://www.windowsazure.com/en-us/manage/services/cloud-services/how-to-monitor-a-cloud-service/#endpointstatus).

**To Add a Staged Deployment:** TBD.



See the [Windows Azure Documentation](http://www.windowsazure.com/en-us/documentation/) for more detailed information.

## Azure Managment Portal ##

When you first sign in to Azure, you are presented with a list of resources. The Web site that you are using to host ChronoZoom should appear within this list along with the associated SQL database.

![Azure Management Console: all items](images/ops_guide-1.png)

Along the bottom of the page are several options: **New**, **Browse**, **Stop**, **Restart**, **Manage Domains**, **Delete**, and **Help**. Clicking the **Help** icon will display help content for whichever tab you are currently working in. The contents of the bottom bar will change depending on the tab you are in.

![Bottom bar](images/ops_guide-0.png)

### DASHBOARD Management Page ###
Click the name of your Web site to bring up the **DASHBOARD** management page. Here you can see all of the usage statistics for the site, as well as other useful information such as connection strings, URLs, FTP host name, and more.

![Web Site Dashboard](images/ops_guide-2.png)

### DEPLOYMENTS Management Page ###
Click **DEPLOYMENTS** to view the deployment history for your site.

![Deployment History](images/ops_guide-3.png)

### MONITOR Management Page ###
Click **MONITOR** to view real-time Web metrics for your site.

![Monitor](images/ops_guide-4.png)

### CONFIGURE Management Page ###
Click **CONFIGURE** to access the **CONFIGURE** management page for the web site. Here you can change web application specific settings, the type and level of diagnostic logging that is employed and any alternative hostnames used to connect to the web site.

![Configure](images/ops_guide-5.png)

### SCALE Management Page ###
Click **SCALE** to bring up the **SCALE** management page. Here you can modify scale options to give a Web site additional load capacity and/or fault tolerance.

![Scale](images/ops_guide-7.png)

### LINKED RESOURCES Management Page ###
Click **LINKED RESOURCES** to see the **LINKED RESOURCES** management page. This page is where you can manage all of the resources that your Web site is dependent upon. At the start, you should see only your SQL database. Note that you can scale the capacity of your SQL database on the **SCALE** tab for your Web site.

![Linked Resources](images/ops_guide-6.png)