# Using the CodeCollaborator Review Tool #

The ChronoZoom development team uses [Smartbear CodeCollaborator](http://smartbear.com/Software-Testing,-Development-and-Web-Monitoring-T/Software-Development/Collaborator) to conduct code reviews. This guide explains how to set up CodeCollaborator, how to create a review as an author and how to participate in a review. 

For more details, refer to [Getting Started with the
CodeCollaborator Client](http://support.smartbear.com/resources/cc/GettingStarted-Developers.pdf).

## Installation/Configuration ##

- Install the [Windows Client](http://support.smartbear.com/downloads/codecollaborator/installers-7-0/).
- Set the server Url to ***http://mrccodereview.cloudapp.net***.
- Add an SCM configuration:
    1. Launch the Code Collaborator client.
    1. Click **Add**.
    1. Under **Local Source Code Location** enter the local path for your ChronoZoom repository.
    1. Click **Validate**, then click **OK**.

## Code Review Process ##

### Use the CodeCollaborator Client ###

1. Click **Start**, **All Programs**, **Code Collaborator Client**, **Code Collaborator Client GUI**.

The CodeCollaborator Client GUI offers several options:
        
- **Add Changes:** Allows you to upload the modifications that are currently in the index. These are the modifications that would be committed if you typed `git commit` from a command line.
- **Add Unpushed Commits:** Selects all commits in your local branch that have not been pushed to its tracking branch. NOTE: This assumes that you have set up branch tracking in Git. If you see an error when running Add Unpushed Commits... (like, "Error initializing local changelists") make sure that your current branch has a tracking branch set. You can set this up, initially by running `git config branch.autosetupmerge always`. You can set this up on an existing branch by running `git branch --set-upstream name-of-branch name-of-upstream`.
- **Add Commits:** Allows you to upload commits, whether they've been pushed or not. You can add a specific commit by adding the commit ID and clicking **Add**.
- **Add Git Diffs:** Upload arbitrary Git diffs to the Collaborator Server for review.

- Commit to your local repository using a topic branch. The following example shows using **git checkout** with the **-b** option to create a new topic branch named "myFeature":
 - `git checkout -b myFeature`
 - Make changes, validate locally, fix Stylecop & code analysis issues, run tests:
 - `git commit -a -m "Description of my feature changes"`
 - Find your commit id using `git log -1`
 
- Using CodeCollaborator Client, click **Add Unpushed Commits** and go through the wizard.
- Modify based on code review feedback.  Use [`git commit --amend`](http://git-scm.com/book/en/Git-Basics-Undoing-Things)
- When the code review is complete, push to github, `git push origin +myFeature:myFeature`
- Create a pull request for your feature branch from github.