/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Utils/jquery-ui.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/authoring.ui.js" />
/// <reference path="../Js/newauthoring.js" />
/// <reference path="../Js/czservice.js"/>
/// <reference path="../Js/js-ignore.js"/>

describe("Given:  'edit timeline' form is opened: ", function () {
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
        authoring = CZ.Authoring;
        var newTimeline = { y: 1, height: 2, x: -8, width: 1, parent: parentTimeline, title: "dddd", type: "timeline", children: [] };
        $('body').prepend('<div id="createTimelineForm">');
        $('body').prepend('<span id="TimelineErrorSpan" style="color:red; display:none">Input error</span>');
        $('body').prepend('<span id="timelineStartInput"</span>');
        $('body').prepend('<span id="timelineEndInput"</span>');
        $('body').prepend('<span id="timelineTitleInput"</span>');
        authoring.UI.showEditTimelineForm(newTimeline);
    });
    afterEach(function () {
        $('.ui-button-icon-primary.ui-icon.ui-icon-closethick').click();
    });

    //describe("When: User set empty value to title", function () {
    //    beforeEach(function () {
    //        $('#timelineStartInput').val("456");
    //        $('#timelineEndInput').val("123");
    //        $('#timelineTitleInput').val("");
    //    });
    //    describe("And: save changes", function () {
    //        beforeEach(function () {
    //            $('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:first').click();
    //        });
    //        it("Then: Error message should be thrown", function () {
    //            expect('block').toEqual($('#TimelineErrorSpan').css('display'));
    //        });
    //    });
    //});
    //describe("When: User set empty value to 'start'", function () {
    //    beforeEach(function () {
    //        $('#timelineStartInput').val("");
    //        $('#timelineEndInput').val("123");
    //        $('#timelineTitleInput').val("timelinename");
    //    });
    //    describe("And: save changes", function () {
    //        beforeEach(function () {
    //            $('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:first').click();
    //        });
    //        it("Then: Error message should be thrown", function () {
    //            expect('block').toEqual($('#TimelineErrorSpan').css('display'));
    //        });
    //    });
    //});
    //describe("When: User set empty value to 'end'", function () {
    //    beforeEach(function () {
    //        $('#timelineStartInput').val("456");
    //        $('#timelineEndInput').val("");
    //        $('#timelineTitleInput').val("timelinename");
    //    });
    //    describe("And: save changes", function () {
    //        beforeEach(function () {
    //            $('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:first').click();
    //        });
    //        it("Then: Error message should be thrown", function () {
    //            expect('block').toEqual($('#TimelineErrorSpan').css('display'));
    //        });
    //    });
    //});

    //"data = ['timeline title', 'start value', 'end value', 'description']"
    dataTitle = ["", "5", "10", "empty 'title'"];
    dataStart = ["titlename", "", "5", "empty 'start'"];
    dataEnd = ["title", "45", "", "empty 'end'"];
    dataStartNotNumber = ["title", "45", "abc", "'end' is not number"];
    dataNotNumber = ["title", "!@#", "789", "'start' is not number"];
    dataEndLessStart = ["title", "5", "2", "start is less than end"];

    using("Data set: ", [dataEndLessStart,dataTitle, dataStart, dataEnd, dataStartNotNumber, dataNotNumber], function (title, start, end, conditional) {

        beforeEach(function () {
           
        });

        describe("When: User set: " + conditional + " and save changes", function () {
            beforeEach(function () {
                $('#timelineTitleInput').val(title);
                $('#timelineStartInput').val(start);
                $('#timelineEndInput').val(end);
                
                $('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:first').click();
            });
            it("Then: Error message should be thrown.", function () {
                
                expect('block').toEqual($('#TimelineErrorSpan').css('display'));
            });
        });
        
        afterEach(function () {
            $('.ui-button-icon-primary.ui-icon.ui-icon-closethick').click();
        });
    });
});



function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1], values[i][2], values[i][3]]);
        jasmine.currentEnv_.currentSpec.description += ' ' + name + '[' + "title: " + values[i][0] + ", start: " + values[i][1] + ", end: " + values[i][2] + " , description: " + values[i][3].concat(']');
    }
}