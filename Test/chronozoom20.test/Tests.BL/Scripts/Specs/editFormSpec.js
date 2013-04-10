/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jasmine-jquery.js" />
/// <reference path="../Utils/jquery-ui.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/authoring.ui.js" />
/// <reference path="../Js/newauthoring.js" />
/// <reference path="../Js/czservice.js"/>
/// <reference path="../Js/js-ignore.js"/>

    describe("CZ.Authoring", function () {
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
            existedTimeline = { y: 5, height: 2, x: -5, width: 3, parent: parentTimeline, title: "Timeline Title", type: "timeline", children: [] };
            var newTimeline = { y: 1, height: 2, x: -8, width: 1, parent: parentTimeline, title: "dddd", type: "timeline", children: [] };
            parentTimeline.children = [existedTimeline];
            $('body').prepend('<div id="createTimelineForm">');
            $('body').prepend('<span id="TimelineErrorSpan" style="color:red; display:none">Input error</span>');
            $('body').prepend('<span id="timelineStartInput"</span>');
            $('body').prepend('<span id="timelineEndInput"</span>');
            $('body').prepend('<span id="timelineTitleInput"</span>');
            authoring.UI.showEditTimelineForm(newTimeline);
        });

        afterEach(function () {
            $('.ui-button-icon-primary.ui-icon.ui-icon-closethick:first').click();
        });

        it("1", function () {
            $('#timelineStartInput').val("eee");
            $('#timelineEndInput').val("123");
            $('#timelineTitleInput').val("ddd");
            $('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:first').click();            
            expect('block').toEqual($('#TimelineErrorSpan').css('display'));
        });
    });