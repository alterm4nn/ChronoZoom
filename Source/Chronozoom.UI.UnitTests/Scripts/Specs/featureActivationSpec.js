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
