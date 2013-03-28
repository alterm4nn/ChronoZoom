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
    var existedTimeline;
    var parentTimeline = {};
    parentTimeline.guid = "00000000-0000-0000-0000-000000000000";
    parentTimeline.id = "t55";
    parentTimeline.height = 10;
    parentTimeline.width = 10;
    parentTimeline.x = -10;
    parentTimeline.y = 0;
    parentTimeline.children = [];
    beforeEach(function () {
        var editmode = true;
        authoring = CZ.Authoring;
    });

    describe("Given: timelines are", function () {
        describe("horizontal and parallel", function () {
            existedTimeline = {y: 5,height: 2,x: -5,width: 3,parent: parentTimeline,title: "Timeline Title",type: "timeline",children: []};
            var newTimeline = { y: 1, height: 2, x: -8, width: 1, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
            parentTimeline.children = [existedTimeline];
            describe("When: user extends timeline without overlay", function () {
                it("Then: The timeline should be extended", function () {
                    var propFake = { title: "Timeline Title11", start: "-5", end: "-2" };
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.title).toEqual("Timeline Title11");
                    expect(newTimeline.width).toEqual(propFake.end - propFake.start);
                });
            });

            describe("When: user extends timeline with parent right border overlay ", function () {
                it("Then: The timeline should not be extended", function () {
                    var propFake = { title: "Timeline Title11", start: "-5", end: "0.01" };
                    var widthBeforeChanges = newTimeline.width;
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.title).toEqual("Timeline Title11");
                    expect(newTimeline.width).toEqual(widthBeforeChanges);
                });
            });

            describe("When: user extends timeline with parent left border overlay ", function () {
                it("Then: The timeline should not be extended", function () {
                    var propFake = { title: "Timeline Title11", start: "-11.00000004", end: "-0.9" };
                    var widthBeforeChanges = newTimeline.width;
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.title).toEqual("Timeline Title11");
                    expect(newTimeline.width).toEqual(widthBeforeChanges);
                });
            });

        });
    });


});