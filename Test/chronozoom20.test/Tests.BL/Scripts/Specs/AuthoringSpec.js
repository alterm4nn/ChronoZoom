/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Js/layout.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/newauthoring.js" />
/// <reference path="../Js/czservice.js" />


describe("CZ.Authoring", function () {
    var authoring;
    var service;
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
            existedTimeline = { y: 5, height: 2, x: -5, width: 3, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
            var newTimeline = { y: 1, height: 2, x: -8, width: 1, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
            parentTimeline.children = [existedTimeline];
            describe("When: user expands timeline without overlay", function () {
                var propFake = { title: "Timeline Title11", start: "-5", end: "-2" };
                it("Then: The timeline should be expanded", function () {
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.width).toEqual(propFake.end - propFake.start);
                });
            });

            describe("When: user expands timeline with parent right border overlay ", function () {
                var propFake = { title: "Timeline Title11", start: "-5", end: "0.01" };
                it("Then: The timeline should not be expanded", function () {
                    var widthBeforeChanges = newTimeline.width;
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.width).toEqual(widthBeforeChanges);
                });
            });

            describe("When: user expands timeline with parent left border overlay ", function () {
                var propFake = { title: "Timeline Title11", start: "-11.00000004", end: "-0.9" };
                it("Then: The timeline should not be expanded", function () {
                    var widthBeforeChanges = newTimeline.width;
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.width).toEqual(widthBeforeChanges);
                });
            });

            describe("When: user expands timeline in a butt joint with parent left border", function () {
                var propFake = { title: "Timeline Title11", start: "-10", end: "-0.9" };
                it("Then: The timeline should be expanded", function () {
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.width).toEqual(propFake.end - propFake.start);
                });
            });
            describe("When: user expands timeline in a butt joint with parent right border", function () {
                var propFake = { title: "Timeline Title11", start: "-8", end: "0" };
                it("Then: The timeline should be expanded", function () {
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake);
                    expect(newTimeline.width).toEqual(propFake.end - propFake.start);
                });
            });
        });

        describe("vertical and parallel", function () {
            existedTimeline = { y: 5, height: 2, x: -5, width: 3, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
            var newTimeline = { y: 5, height: 2, x: -8, width: 1, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
            parentTimeline.children = [existedTimeline];
            describe("When: user expands timeline with next timeline overlay", function () {
                var propFake = { title: "Timeline Title", start: "-8", end: "-3" };
                var widthBeforeChanges = newTimeline.width;
                _selectedTimeline = newTimeline;
                beforeEach(function () {
                    authoring.updateTimeline(newTimeline, propFake);
                });
                it("Then: The timeline should not be expanded", function () {
                    expect(newTimeline.width).toEqual(widthBeforeChanges);
                });
            });

            describe("When: user expands timeline in a butt joint with next timeline to right", function () {
                var propFake = { title: "Timeline Title", start: "-8.45", end: "-5" };
                _selectedTimeline = newTimeline;
                beforeEach(function () {
                    authoring.updateTimeline(newTimeline, propFake);
                });
                it("Then: The timeline should be expanded", function () {
                    expect(newTimeline.width).toEqual(propFake.end - propFake.start);
                });
            });

            describe("When: user expands timeline in a butt joint with next timeline to left", function () {
                var propFake = { title: "Timeline Title", start: "-2", end: "-1.154484" };
                _selectedTimeline = newTimeline;
                beforeEach(function () {
                    authoring.updateTimeline(newTimeline, propFake);
                });
                it("Then: The timeline should be expanded", function () {
                    expect(newTimeline.width).toEqual(propFake.end - propFake.start);
                });
            });
        });
    });

    describe("When: user changes title", function () {
        var title;
        var start;
        var end;
        existedTimeline = { y: 5, height: 2, x: -5, width: 3, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
        var newTimeline = { y: 1, height: 2, x: -8, width: 1, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
        _selectedTimeline = newTimeline;
        var propFake = { title: title, start: start, end: end };        
        dataIncorrect = ["-5", "-2", "title","incorrect timeline values"]
        dataCorrect = ["-8", "-6", "title", "correct timeline values"]

        using("When", [dataIncorrect, dataCorrect], function (startValue, endValue, titleValue) {
            it("The title should be changed", function () {
                var propFake = { title: titleValue, start: startValue, end: endValue };
                authoring.updateTimeline(newTimeline, propFake);
                expect(newTimeline.title).toEqual(titleValue);
            });
        });
        describe("And: title is empty", function () {
            it("Then: error should be thrown", function () {
                var propFake = { title: "", start: "-5", end: "-4" };                
                expect(function () { authoring.updateTimeline(newTimeline, propFake); }).toThrow(new Error("Title is empty"));
            });
        });
    });
    
    describe("Exhibit are", function () {
        parentTimeline.guid = "00000000-0000-0000-0000-000000000000";
        parentTimeline.id = "t55";
        parentTimeline.height = 10;
        parentTimeline.width = 10;
        parentTimeline.x = 0;
        parentTimeline.y = 0;
        parentTimeline.children = [];
        parentTimeline.type = "timeline";

        describe("should be created", function () {
            _hovered = parentTimeline;
            var _selectedExhibit = {};

            beforeEach(function () {
                setFixtures('<body></body>');
                $('body').prepend('<div id="vc"></div>');
                $('#vc').data('ui-virtualCanvas', { hovered: parentTimeline, element: $('#vc'), getViewport: function () { return { pointScreenToVirtual: function (xvalue, yvalue) { return { x: xvalue, y: yvalue }; } }; } });
                var vc = $('#vc');
                getXBrowserMouseOrigin = function (jqelement, event) { return { x: 2, y: 2 }; };
                authoring._isActive = true;
                authoring.initialize(vc);
                $('#vc').trigger('mousedown');
            });

            it("if 'mouseup' event is fired", function () {
                authoring.modeMouseHandlers["createExhibit"]["mouseup"]();
                expect(authoring._selectedExhibit.title).toEqual('Exhibit Title');
            });
        });
    });
});

function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1]]);
        jasmine.currentEnv_.currentSpec.description += ' ' + name + ': ' + values[i][3].concat(' ');
    }
}