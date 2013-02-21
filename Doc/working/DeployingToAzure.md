# Deploying ChronoZoom to Azure #

Login to [Azure Management Portal](https://manage.windowsazure.com)

Add Compute -> Web Site -> Custom Create -> Create Web Site

- Url -> choose your website 'name',  for this example ***mycz***
- Database -> Create New Sql Database
- DB Connection String Name -> ***Storage*** (must be Storage)
- Publish from Source Control -> Checked
- Next (page 2)
	
Specify Database Settings

- Server -> New Database Server (unless you have one ready)
- Login name -> ***myDatabaseUsername***
- Password -> ***myDatabasePassword***
- Next (page 3)
	
Specify Source Control Settings

- Source Control Type -> Git
- Repository Location -> Local Repository
	- could set up continuous replication from Github here but using a local repository for simplicity
- Next (page 4)
	
New user name and password (for Git)

- Username -> ***myGitUsername***
- Password -> ***myGitPassword***
	
Go to Dashboard for Web Site

- Copy Git Clone Url.  Will be something like: *https://***myGitUsername***@***mycz***.scm.azurewebsites.net/***mycz***.git*

----------

Get a copy of the current ChronoZoom sources locally

- git clone git@github.com:alterm4nn/ChronoZoom.git
- cd ChronoZoom

Add a connection to the Azure Web Site

- git remote add azure https://***myUsername***@***mycz***.scm.azurewebsites.net/***mycz***.git

Make your changes to the source code

Publish your changes onto the Azure Web Site

- git push --set-upstream azure master
 

----------

Browse to http://***mycz***.azurewebsites.net/ and behold your own copy of ChronoZoom!