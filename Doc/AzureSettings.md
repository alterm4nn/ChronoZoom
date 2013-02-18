# Adjusting Settings on Azure #

Settings are stored in web.config and can be overriden using the Configure tab of the Azure Managment Portal for your Web Site under **app settings**.

----------

## CacheDuration ##

Amount of time in minutes to cache database reads.  Only applies to Timelines, Tours, and Thresholds.  Searches and References are not cached today.  Default value is 5.