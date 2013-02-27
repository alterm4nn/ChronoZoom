# Contributing Guidelines #
Prior to contributing to ChronoZoom, you are required to sign an [OuterCurve Contributors Agreement](http://www.outercurve.org/Portals/0/docs/Outercurve%20Foundation%20Contribution%20Agreement%20%28editable%29.pdf) to assign the copyright of your contributions to the foundation.

## Setup and Installation ##
See the [ChronoZoom Developer's Guide](Doc/ChronoZoom_Developer_Guide.md) for detailed instructions on setting up a development environment and deploying ChronoZoom to Azure.

## Pull Requests ##
1. Before doing anything else, merge or rebase the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

1. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```
1. [Open a Pull Request](https://help.github.com/articles/using-pull-requests) with a clear title and description.

## Git Hygiene ##
While working, commit your changes in logical chunks. Use Git's [interactive rebase](https://help.github.com/articles/interactive-rebase) feature to tidy up your commits before making them public. Note that this should not be done after pushing changes to any remote repository. Additionally, be sure to observe these [git commit message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html). 

## Code Style ##
ChronoZoom follows the guidelines laid out by the designers of the .NET Framework class library as detailed in the book [*Framework Design Guidelines: Conventions, Idioms, and Patterns for Reusable .NET Libraries* by Krzysztof Cwalina and Brad Abrams](http://www.amazon.com/Framework-Design-Guidelines-Conventions-Libraries/dp/0321545613), published by Addison-Wesley in 2005 and on MSDN in [Design Guidelines for Developing Class Libraries](http://msdn.microsoft.com/en-us/library/ms229042(VS.100).aspx).

- Use the project's coding style, not your own. When in doubt, follow the existing code as an example of what to do.
- Use [Stylecop](http://stylecop.codeplex.com/) to ensure that your code is conformant with project style.

## Unit Tests ##
Prior to submitting you must run unit tests on your code.

## Reporting Issues ##
A bug is a demonstrable problem that is caused by code in the repository.

Please read the following guidelines before you report an [issue][issues]:

1. **Use GitHub issue search** to see if the issue has already been reported. If it has, please comment on the existing issue.

1. **Check whether the issue has been fixed** &mdash; The latest `master` or development branch may already contain a fix.

1. **Isolate the demonstrable problem** &mdash; make sure that the code in the
   project's repository is _definitely_ responsible for the issue. 

Please try to be as detailed as possible in your report. 

### Example of a good bug report:

> Short and descriptive title
>
> A summary of the issue and the browser/OS environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` (a link to the test case)
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).

**[File a bug report][issues]**

## Do not…

Please **do not** use the issue tracker for personal support requests (use
[StackOverflow](http://stackoverflow.com/questions/tagged/html5boilerplate) or IRC).

Please **do not** derail or troll issues. Keep the
discussion on topic and respect the opinions of others.


