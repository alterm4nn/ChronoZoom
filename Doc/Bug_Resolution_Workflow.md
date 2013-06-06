# Bug Resolution Workflow #
This document describes a workflow for resolving bugs. Use this workflow to ensure that your bug fixes do not cause regression or other code quality issues.

**Suggested Workflow:**

This is the workflow that you should follow whenever you work on a bug that is assigned to you.

1. Implement a [unit test](https://github.com/alterm4nn/ChronoZoom/blob/master/Doc/Getting%20started%20with%20Unit%20tests.md) to reproduce the issue. At this stage the test should not pass!
2. Do whatever work is required to fix the bug.
3. Run the unit test from step 1 to verify the fix (the test should pass this time).
4. Run all unit tests in the project. All tests should pass. This step is critical for avoiding regression.
5. Submit the fix for review using the [CodeCollaborator Review Tool](https://github.com/alterm4nn/ChronoZoom/blob/master/Doc/CodeReview.md).
6. Upon acceptance of the fix, make a pull request to the blessed repository ([https://github.com/alterm4nn/ChronoZoom](https://github.com/alterm4nn/ChronoZoom)).
7. Mark the bug as resolved (do not close).

**See Also**

[Getting Started with Unit tests](https://github.com/alterm4nn/ChronoZoom/blob/master/Doc/Getting%20started%20with%20Unit%20tests.md)

[Using the CodeCollaborator Review Tool](https://github.com/alterm4nn/ChronoZoom/blob/master/Doc/CodeReview.md)