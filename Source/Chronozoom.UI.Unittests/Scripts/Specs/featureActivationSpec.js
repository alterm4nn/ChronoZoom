/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../chronozoom.ui/scripts/typings/jquery/jquery.d.ts"/>
/// <chutzpah_reference path="../../../chronozoom.ui/scripts/external/jquery-1.7.2.min.js" />

/// <reference path="../../../chronozoom.ui/scripts/cz.js" />


describe("featureActivation controller", function () {
    it("recognizes enabled feature as enabled", function () {
        var featureMap = [
            {
                Name: "Login",
                Activation: CZ.HomePageViewModel.FeatureActivation.Enabled,
                JQueryReference: "#login-panel",
                IsEnabled: true
            }
        ];
        expect(CZ.HomePageViewModel.IsFeatureEnabled(featureMap, "Login")).toBe(true);
    });
});
