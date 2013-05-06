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




    using("Data set: ", [
            //"data = ['timeline title', 'start value', 'end value', 'regime', 'description']"
            ["title", "5", "2", "ce", "ce", "start is less than end"],
            ["title", "5", "10", "ce", "bce", "start is less than end"],
            ["title", "5", "10", "ce", "ka", "start is less than end"],
            ["title", "5", "10", "ce", "ma", "start is less than end"],
            ["title", "5", "10", "ce", "ga", "start is less than end"],
            ["title", "2", "-5", "bce", "ce", "start is less than end"],
            ["title", "2", "5", "bce", "ka", "start is less than end"],
            ["title", "2", "5", "bce", "ma", "start is less than end"],
            ["title", "2", "5", "bce", "ga", "start is less than end"],
            ["title", "2", "5", "bce", "bce", "start is less than end"],
            ["title", "2", "-5000000", "ma", "ce", "start is less than end"],
            ["title", "2", "5000000", "ma", "bce", "start is less than end"],
            ["title", "2", "5000", "ma", "ka", "start is less than end"],
            ["title", "2", "5", "ma", "ga", "start is less than end"],
            ["title", "2", "5", "ma", "ma", "start is less than end"],
            ["title", "2", "0.005", "ka", "ma", "start is less than end"],
            ["title", "20", "1", "ka", "ga", "start is less than end"],
            ["title", "2", "5000", "ka", "bce", "start is less than end"],
            ["title", "2", "-5000", "ka", "ce", "start is less than end"],
            ["title", "2", "5", "ka", "ka", "start is less than end"],
            ["title", "2", "5", "ga", "ga", "start is less than end"],
            ["title", "2", "5e+3", "ga", "ma", "start is less than end"],
            ["title", "2", "5e+6", "ga", "ka", "start is less than end"],
            ["title", "2", "5e+9", "ga", "bce", "start is less than end"],
            ["title", "2", "-5e+9", "ga", "ce", "start is less than end"]
    ], function (title, start, end, regimeStart, regimeEnd, conditional) {

        describe("When: User set: " + conditional + " and save changes", function () {
            beforeEach(function () {
                setValues(title, start, end, regimeStart, regimeEnd);
            });

            it("Then: Error message should be thrown.", function () {
                expect('block').toEqual($('#TimelineErrorSpan').css('display'));
            });
        });
    });

    var regimes = ["ce", "bce", "ma", "ga", "ka"];
    //bug https://github.com/alterm4nn/ChronoZoom/issues/93
    describe("When: User set start as empty", function () {
        using1("Data set: ", regimes, function (regime) {
            describe("And: regime: " + regime + " and save changes", function () {
                beforeEach(function () {
                    setValues("text", "", Math.floor((Math.random() * 100) + 1), regime, regime);
                });
                it("Then: Error message should be thrown.", function () {
                    expect('block').toEqual($('#TimelineErrorSpan').css('display'));
                });
            });
        });
    });

    describe("When: User set start as not number", function () {
        using1("Data set: ", regimes, function (regime) {
            describe("And: regime: " + regime + " and save changes", function () {
                beforeEach(function () {
                    setValues("text", "!@34*&#", Math.floor((Math.random() * 100) + 1), regime, regime);
                });
                it("Then: Error message should be thrown.", function () {
                    expect('block').toEqual($('#TimelineErrorSpan').css('display'));
                });
            });
        });
    });

    describe("When: User set end as not number", function () {
        using1("Data set: ", regimes, function (regime) {
            describe("And: regime: " + regime + " and save changes", function () {
                beforeEach(function () {
                    setValues("text", Math.floor((Math.random() * 100) + 1), "ddd@#$", regime, regime);
                });
                it("Then: Error message should be thrown.", function () {
                    expect('block').toEqual($('#TimelineErrorSpan').css('display'));
                });
            });
        });
    });

    describe("When: User set end as empty", function () {
        using1("Data set: ", regimes, function (regime) {
            describe("And: regime: " + regime + " and save changes", function () {
                beforeEach(function () {
                    setValues("text", Math.floor((Math.random() * 100) + 1), "", regime, regime);
                });
                it("Then: Error message should be thrown.", function () {
                    expect('block').toEqual($('#TimelineErrorSpan').css('display'));
                });
            });
        });
    });

    describe("When user set text instead year", function () {
        it("should display error message 'Year should be a number'", function () {
            $('#timelineTitleInput').val('Title');
            $('.cz-datepicker-year:first').val('some text');
            $('.cz-datepicker-year:last').val('some text');
            $('.cz-datepicker-year').trigger('blur');

            expect($('.cz-datepicker-errormsg:first').text()).toEqual("Year should be a number.");
            expect($('.cz-datepicker-errormsg:last').text()).toEqual("Year should be a number.");
        });
    });

    describe("When user set empty title", function () {
        describe("And: save changes", function () {
            beforeEach(function () {
                setValues("", 5, 10, "ga", "ga");
            });
            it("Then: Error message should be thrown.", function () {
                expect('block').toEqual($('#TimelineErrorSpan').css('display'));
            });
        });
    });
});

function using1(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1]]);
        jasmine.currentEnv_.currentSpec.description += ' (with "' + name + '" using ' + values[i][0].concat(' ') + ')';
    }
}

function setValues(title, start, end, startRegime, endRegime) {
    $('#timelineTitleInput').val(title);
    $('#timelineStartInput .cz-datepicker-year').val(start);
    $('#timelineEndInput .cz-datepicker-year').val(end);
    ($)("#timelineStartInput .cz-datepicker-regime").val(startRegime).attr("selected", "selected");
    ($)("#timelineEndInput .cz-datepicker-regime").val(endRegime).attr("selected", "selected");
    $("span:contains('save and close')").click();
}

function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1], values[i][2], values[i][3], values[i][4], values[i][5]]);
        jasmine.currentEnv_.currentSpec.description += ' ' + name + '[' + "title: " + values[i][0] + ", start: " + values[i][1] + ", end: " + values[i][2] + ", regimeStart: " + values[i][3] + ", regimeEnd: " + values[i][4] + ", description: " + values[i][5].concat(']');
    }
}

function init() {
    $('#createTimelineForm').length == 0 ? $('body').prepend('<div id="createTimelineForm" >') : "";
    $('#TimelineErrorSpan').length == 0 ? $('body').prepend('<span id="TimelineErrorSpan" style="color:red; display:none">Input error</span>') : "";
    $('#timelineStartInput').length == 0 ? $('body').prepend('<div id="timelineStartInput"</div>') : "";
    $('#timelineEndInput').length == 0 ? $('body').prepend('<div id="timelineEndInput"</div>') : "";
    $('#timelineTitleInput').length == 0 ? $('body').prepend('<span id="timelineTitleInput"</span>') : "";
    $('#timelineStartInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ga").text("Ga")).attr("selected", "");
    $('#timelineStartInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ma").text("Ma")).attr("selected", "");;
    $('#timelineStartInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ka").text("Ka")).attr("selected", "");;
    $('#timelineStartInput .cz-datepicker-regime').append($("<option></option>").attr("value", "bce").text("BCE")).attr("selected", "");
    $('#timelineStartInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ce").text("CE")).attr("selected", "");;

    $('#timelineEndInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ga").text("Ga")).attr("selected", "");
    $('#timelineEndInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ma").text("Ma")).attr("selected", "");;
    $('#timelineEndInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ka").text("Ka")).attr("selected", "");;
    $('#timelineEndInput .cz-datepicker-regime').append($("<option></option>").attr("value", "bce").text("BCE")).attr("selected", "");
    $('#timelineEndInput .cz-datepicker-regime').append($("<option></option>").attr("value", "ce").text("CE")).attr("selected", "");;
}