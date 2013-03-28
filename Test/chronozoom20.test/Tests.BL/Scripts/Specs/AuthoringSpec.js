/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/newauthoring.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />


describe("CZ.Authoring", function () {
    var authoring;
    beforeEach(function () {
        authoring = CZ.Authoring;
    });


    it("works fine", function () {

        var tcfake = {};
        
        var tcfake1 = {
            height: 630402910.1206665,
            newHeight: 630402910.1206665,
            newY: 3513332454.40149,
            parent: tpfake,
            title: "Timeline Title",
            type: "timeline",
            width: 1,
            x: -13700000000,
            y: 3513332454.40149,
            children: []
        };

        var tpfake = {};
        tpfake.guid = "00000000-0000-0000-0000-000000000000";
        tpfake.id = "t55";
        tpfake.height = 6743440911.46846;
        tpfake.newHeight = 6743440911.46846;
        tpfake.newY = 0;
        tpfake.width = 13700000000;
        tpfake.x = -13700000000;
        tpfake.y = 0;
        tpfake.children = [tcfake1];

        var tcfake = {
            height: 630402910.1206665,
            newHeight: 630402910.1206665,
            newY: 3513332454.40149,
            parent: tpfake,
            title: "Timeline Title",
            type: "timeline",
            width: 1489212671.7343273,
            x: -12724623677.939362,
            y: 3513332454.40149,
            children: []
        };

      
        
        var editmode = true;
        //var propFake = { title: "Timeline Title11", start: "-12724623677.939362", end: "-11235411006.205034" };
        var propFake = { title: "Timeline Title11", start: "-12724623677.939362", end: "-1" };
        
        _selectedTimeline = tcfake;
        var title = authoring.updateTimeline(tcfake, propFake);
        expect(tcfake.title).toEqual("Timeline Title11");
        expect(tcfake.width).toEqual(propFake.end - propFake.start);
    });

});