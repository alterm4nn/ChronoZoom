# Learning to use Github for ChronoZoom development #

## Some links to get you started ##

[Visual Studio Tools for Git (Preview)](http://visualstudiogallery.msdn.microsoft.com/abafc7d6-dcaa-40f4-8a5e-d6724bdb980c)

- [Scott Hanselman on Git and Visual Studio](http://www.hanselman.com/blog/GitSupportForVisualStudioGitTFSAndVSPutIntoContext.aspx)
- [Scott Hanselman walking through working on Github](http://www.hanselman.com/blog/GetInvolvedInOpenSourceTodayHowToContributeAPatchToAGitHubHostedOpenSourceProjectLikeCode52.aspx)

[Github’s introduction to Learning Git](http://learn.github.com/p/intro.html)

- [Github’s ‘Try Git’ for a 10 minute interactive lesson](http://try.github.com/)
- [Git Immersion Online Tutorial](http://gitimmersion.com/)
- [Github’s list of good Git resources](https://help.github.com/articles/what-are-other-good-resources-for-using-git-or-github)
- For even more information, check out [Github’s Help page](https://help.github.com/)

[Topic Branches](http://git-scm.com/book/en/Git-Branching-Branching-Workflows) – an important concept for working well together on Github

## Your first checkin ##
1.	Install the Visual Studio tools.

2.	Create an account on Github.

- [Signing up for a new Github Account](https://help.github.com/articles/signing-up-for-a-new-github-account)
- [Setting your email in Git](https://help.github.com/articles/setting-your-email-in-git)
- [Setting your username in Git](https://help.github.com/articles/setting-your-username-in-git)

3.	Fork the ‘blessed’ repository owned by Eugene, https://github.com/alterm4nn/ChronoZoom, into your own Github repository.

![Picture of fork button](ChronoZoom/tree/master/Images/Fork.jpg)

- [How to Fork a Repo](https://help.github.com/articles/fork-a-repo)

4.	Clone your ChronoZoom repository on Github to your local computer

- e.g. ‘git clone https://github.com/YourNameHere/ChronoZoom.git’
- [How to set up Git](http://learn.github.com/p/setup.html)
- [Normal Workflow](http://learn.github.com/p/normal.html)

5.	Create and switch to a ‘topic branch’ for what you are working on, e.g. ‘git checkout –b newFooBar’

- [Branching and Merging](http://learn.github.com/p/branching.html)
- [Git Branching Workflows](http://git-scm.com/book/en/Git-Branching-Branching-Workflows)

6.	Make your changes, commit into the local branch on your computer.

- [Recording Changes](http://git-scm.com/book/en/Git-Basics-Recording-Changes-to-the-Repository)

7.	Push the changes to Github so everyone can see them, e.g. ‘git push origin newFooBar’

- [Distributed Git](http://learn.github.com/p/remotes.html)

8.	When you’re ready to integrate your changes with the rest of the team, submit a ‘Pull Request’ back to Eugene

- [Using Pull Requests](https://help.github.com/articles/using-pull-requests)

## Tips ##
- Do not install ‘Github for Windows’.  This is an ‘easy to use’ tool that doesn’t integrate well with Visual Studio and can interfere with your Git installation.
- I’ve found it best to learn ‘git from the command line’ from the beginning and not rely upon GUI tools too much.  The GUI tools are great to get started, but you’ll rapidly find that you need the power of the command line as you get into the more advanced scenarios and having to ‘relearn’ git from the command line is a waste of time.

## For More Information ##

- [Git Reference](http://gitref.org/)
- [Pro Get free book](http://git-scm.com/book)
