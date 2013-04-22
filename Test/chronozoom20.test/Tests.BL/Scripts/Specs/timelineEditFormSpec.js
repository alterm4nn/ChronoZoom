/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jquery-ui.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/cz.dates.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/cz.datepicker.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/authoring.ui.js" />
/// <reference path="../Js/authoring.js" />
/// <reference path="../Js/czservice.js"/>
/// <reference path="js-ignore.js"/>

describe("Given:  'edit timeline' form is opened: ", function () {
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
        var newTimeline = { y: 1, height: 2, x: -8, width: 1, parent: parentTimeline, title: "existedname", type: "timeline", children: [] };
        init();
        authoring.UI.showEditTimelineForm(newTimeline);
    });
    afterEach(function () {
        $('.ui-button-icon-primary.ui-icon.ui-icon-closethick').click();
    });

    //"data = ['timeline title', 'start value', 'end value', 'description']"
    dataTitle = ["", "5", "10", "empty 'title'"];
    dataStart = ["titlename", "", "5", "empty 'start'"];
    dataEnd = ["title", "45", "", "empty 'end'"];
    dataStartNotNumber = ["title", "45", "abc", "'end' is not number"];
    dataNotNumber = ["title", "!@#", "789", "'start' is not number"];
    dataEndLessStart = ["title", "5", "2", "start is less than end"];

    using("Data set: ", [dataEndLessStart, dataTitle, dataStart, dataEnd, dataStartNotNumber, dataNotNumber], function (title, start, end, conditional) {

        describe("When: User set: " + conditional + " and save changes", function () {
            beforeEach(function () {

                $('#timelineTitleInput').val(title);
                $('.cz-datepicker-year:first').val(start);
                $('.cz-datepicker-year:last').val(end);

                $("span:contains('save and close')").click();
            });

            it("Then: Error message should be thrown.", function () {
                expect('block').toEqual($('#TimelineErrorSpan').css('display'));
            });
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

function init() {
    $('#createTimelineForm').length == 0 ? $('body').prepend('<div id="createTimelineForm" >') : "";
    $('#TimelineErrorSpan').length == 0 ? $('body').prepend('<span id="TimelineErrorSpan" style="color:red; display:none">Input error</span>') : "";
    $('#timelineStartInput').length == 0 ? $('body').prepend('<div id="timelineStartInput"</div>') : "";
    $('#timelineEndInput').length == 0 ? $('body').prepend('<div id="timelineEndInput"</div>') : "";
    $('#timelineTitleInput').length == 0 ? $('body').prepend('<span id="timelineTitleInput"</span>') : "";
}