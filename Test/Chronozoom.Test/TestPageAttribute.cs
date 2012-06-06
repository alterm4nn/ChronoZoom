using System;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
public class TestPageAttribute : Attribute
{
    public string TestPage { get; set; }

    public TestPageAttribute(string testPage)
    {
        TestPage = testPage;
    }
}