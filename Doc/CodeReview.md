# Using the Code Collaborator Review Tool #

## Installation ##

- Install the [Windows Client](http://support.smartbear.com/downloads/codecollaborator/installers-7-0/).
- Set Server Url to ***http://mrccodereview.cloudapp.net***.
- Add SCM by pointing to your ChronoZoom repository directory and chosing **Validate**, **OK**.

## Code Review Process ##

- Commit to your local repository using a topic branch:
 - `git checkout -b myFeature`
 - Make changes, validate locally, fix Stylecop & code analysis issues, run tests:
 - `git commit -a -m "Description of my feature changes"`
 - Find your commit id using `git log -1`
 
- Using Code Collaborator Client, click **Add Unpushed Commits** and go through the wizard.
- Modify based on code review feedback.  Use [`git commit --amend`](http://nathanhoad.net/git-amend-your-last-commit)
- When the code review is complete, push to github, `git push origin +myFeature:myFeature`
- Create a pull request for your feature branch from github.