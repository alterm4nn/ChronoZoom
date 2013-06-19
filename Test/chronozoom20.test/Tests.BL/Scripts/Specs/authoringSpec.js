/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Js/layout.js" />
/// <reference path="../Js/timescale.js" />
/// <reference path="../Js/dates.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/authoring.js" />
/// <reference path="../Js/service.js" />
/// <reference path="js-ignore.js" />

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

            describe("When: user expands timeline to present day without overlay ", function () {
                var propFake1 = { title: "Timeline Title11", start: "-5", end: 9999 };
                var dates = CZ.Dates;
                var localPresent = dates.getPresent();
                var presentDate = dates.getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
                var newTimeline = { y: 1, height: 2, x: -8, width: presentDate - propFake1.start, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
                
                it("Then: The timeline should be expanded to present day", function () {
                    _selectedTimeline = newTimeline;
                    authoring.updateTimeline(newTimeline, propFake1);
                    expect(newTimeline.width).toEqual(dates.getCoordinateFromDecimalYear(propFake1.end) - propFake1.start);
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
        dataIncorrect = ["-5", "-2", "title", "incorrect timeline values"];
        dataCorrect = ["-8", "-6", "title", "correct timeline values"];

        using("When", [dataIncorrect, dataCorrect], function (startValue, endValue, titleValue) {
            it("The title should be changed", function () {
                var propFake = { title: titleValue, start: startValue, end: endValue };
                authoring.updateTimeline(newTimeline, propFake);
                expect(newTimeline.title).toEqual(titleValue);
            });
        });
        xdescribe("And: title is empty", function () {
            it("Then: error should be thrown", function () {
                //Bug: https://github.com/alterm4nn/ChronoZoom/issues/259
                var propFake = { title: "", start: "-5", end: "-4" };
                expect(function () { authoring.updateTimeline(newTimeline, propFake); }).toThrow(new Error("Title is empty"));
            });
        });
    });

    describe("When: user deletes timeline", function () {
        var vcc;
        var service;
        beforeEach(function () {
            vcc = CZ.VCContent;
            service = CZ.Service;
            spyOn(vcc, 'removeChild');
        });
        it("Then: deleteTimeline and removeChild should be called", function () {
            spyOn(service, 'deleteTimeline').andCallThrough();
            authoring.removeTimeline(existedTimeline);
            expect(service.deleteTimeline).toHaveBeenCalledWith(existedTimeline);
            expect(vcc.removeChild).toHaveBeenCalledWith(existedTimeline.parent, existedTimeline.id);
        });
    });

    var contentItem = {
        ParentExhibitId: "e23e6734f-1f71-4d20-bf46-b452b25f2931",
        __type: "ContentItemRaw:#Chronozoom.Entities",
        attribution: "",
        description: "",
        guid: "c319cbb8-454f-4ca3-95fc-ae2ef2962222",
        id: "c319cbb8-454f-4ca3-95fc-ae2ef2962222",
        mediaSource: "",
        mediaType: "image",
        order: 0,
        title: "ContentItemImage",
        uri: "http://i.telegraph.co.uk/multimedia/archive/02429/eleanor_scriven_2429776k.jpg"
    };
    var infodotDescription = {
        date: -5481026446.42,
        guid: "23e6734f-1f71-4d20-bf46-b452b25f2931",
        isBuffered: false,
        opacity: 1,
        title: "Exhibit Title"
    };

    var exhibitParentTimeline = {
        guid: "00000000-0000-0000-0000-000000000000",
        id: "t55",
        height: 10,
        width: 10,
        x: 0,
        y: 0,
        children: [],
        type: "timeline"
    };

    var exhibit = {
        id: "e23e6734f-1f71-4d20-bf46-b452b25f2931",
        infodotDescription: infodotDescription,
        parent: exhibitParentTimeline,
        children: null,
        contentItems: [contentItem]
    };
    describe("When: user deletes exhibit", function () {
        var service;
        beforeEach(function () {
            service = CZ.Service;
        });

        it("Then: deleteExhibit should be called", function () {
            spyOn(service, 'deleteExhibit').andCallThrough();
            authoring.removeExhibit(exhibit);
            expect(service.deleteExhibit).toHaveBeenCalledWith(exhibit);
        });
    });

    describe("When: user updates exhibit", function () {
        var service;
        var clone;
        var args = {
            contentItems: {},
            height: 548000080.5376438,
            infodotDescription: infodotDescription,
            title: "1",
            type: "infodot",
            width: 548000080.5376438,
            x: -9219240083.628822,
            y: 4101223227.086694
        };
        beforeEach(function () {
            service = CZ.Service;
            clone = $.extend({
            }, exhibit, {
                children: null
            });
            clone = $.extend(true, {
            }, clone);
            delete clone.children;
            delete clone.contentItems;
            $.extend(true, clone, args);
        });

        it("Then: putExhibit should be called", function () {
            spyOn(service, 'putExhibit').andCallThrough();
            authoring.updateExhibit(exhibit, args);
            expect(service.putExhibit).toHaveBeenCalledWith(clone);
        });
    });

    describe("When: user updates contentItem", function () {
        var service;
        var clone;
        var args = {
            attribution: "",
            description: "",
            mediaSource: "",
            mediaType: "image",
            order: 0,
            title: "ContentItemImage",
            uri: "http://i.telegraph.co.uk/multimedia/archive/02429/eleanor_scriven_2429776k.jpg",
        };
        beforeEach(function () {
            service = CZ.Service;
            clone = $.extend(true, {
            }, contentItem, args);
        });

        it("Then: putContentItem should be called", function () {
            spyOn(service, 'putContentItem').andCallThrough();
            authoring.updateContentItem(exhibit, contentItem, args);
            expect(service.putContentItem).toHaveBeenCalledWith(clone);
        });
    });

    xdescribe("Exhibit are", function () {
        var exhibitParentTimeline = {};
        exhibitParentTimeline.guid = "00000000-0000-0000-0000-000000000000";
        exhibitParentTimeline.id = "t55";
        exhibitParentTimeline.height = 10;
        exhibitParentTimeline.width = 10;
        exhibitParentTimeline.x = 0;
        exhibitParentTimeline.y = 0;
        exhibitParentTimeline.children = [];
        exhibitParentTimeline.type = "timeline";

        describe("should be created", function () {
            _hovered = parentTimeline;
            var _selectedExhibit = {};

            beforeEach(function () {
                $('body').prepend('<div id="vc"></div>');
                $('#vc').data('ui-virtualCanvas', { hovered: exhibitParentTimeline, element: $('#vc'), getViewport: function () { return { pointScreenToVirtual: function (xvalue, yvalue) { return { x: xvalue, y: yvalue }; } }; } });
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