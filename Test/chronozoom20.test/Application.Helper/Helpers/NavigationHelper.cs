﻿using System;
using Application.Driver;
using Application.Helper.UserActions;
using OpenQA.Selenium;

namespace Application.Helper.Helpers
{
    public class NavigationHelper : DependentActions
    {
        public void OpenHomePage()
        {
            OpenUrl(Configuration.BaseUrl);
            WaitCondition(() => Convert.ToBoolean(GetJavaScriptExecutionResult("visReg != undefined")), 60);
        }

        public void OpenExhibitEukaryoticCells()
        {
            Logger.Log("<-");
            OpenLifePage();
            NavigateToProterozoic();
            ExecuteJavaScript("goToSearchResult('e121')");
            WaitAnimation();
            Logger.Log("->");
        }

        public void NavigateToCosmos()
        {
            Logger.Log("<-");
            Click(By.Id("cosmos_rect"));
            WaitAnimation();
            Logger.Log("->");
        }

        public void OpenLifePage()
        {
            Logger.Log("<-");
            WaitForElementEnabled(By.Id("life_rect"));
            Click(By.Id("life_rect"));
            Logger.Log("->");
        } 
        
        public void OpenHumanityPage()
        {
            Logger.Log("<-");
            WaitForElementEnabled(By.Id("human_rect"));
            Click(By.Id("human_rect"));
            Logger.Log("->");
        }

        public void NavigateToRomanHistoryTimeline()
        {
            Logger.Log("<-");
            ExecuteJavaScript("goToSearchResult('t44')");
            Logger.Log("->");
        }

        private void NavigateToProterozoic()
        {
            Logger.Log("<-");
            ExecuteJavaScript("goToSearchResult('t308')");
            Logger.Log("->");
        }



    }
}