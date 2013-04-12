/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jquery-ui.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/authoring.ui.js" />
/// <reference path="../Js/authoring.js" />
/// <reference path="../Js/czservice.js"/>
/// <reference path="js-ignore.js"/>

describe("Given:  'edit exhibit' form is opened: ", function () {
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
        var infodotDescriptionOdject = { date: 1991.2900986362529 };
        var exhibit = { title: "new exhibit", infodotDescription: infodotDescriptionOdject, parent: parentTimeline, type: "timeline", contentItems: {} };
        init();
        authoring.UI.showEditExhibitForm(exhibit);
    });
    afterEach(function () {
        $('.ui-button-icon-primary.ui-icon.ui-icon-closethick').click();
    });

    //"data = ['timeline title', 'start value', 'end value', 'description']"
    var dataTitle = ["", "5", "empty 'title'"];
    var dataDate = ["exhibit name", , "empty 'date'"];
    
    var dataDateInNotNumber = ["title", "\"356\"", "'date' is not number"];
    var dataNotNumber = ["title", "!@#", "'date' is not number"];

    using("Data set: ", [dataTitle, dataDate, dataDateInNotNumber, dataNotNumber], function (title, start, conditional) {

        describe("When: User set: " + conditional + " and save changes", function () {
            beforeEach(function () {
                $('#exhibitTitleInput').val(title);
                $('#exhibitDateInput').val(start);

                $('.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only:first').click();
            });

            it("Then: Error message should be thrown.", function () {
                expect('block').toEqual($('#ExhibitErrorSpan').css('display'));
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
        jasmine.currentEnv_.currentSpec.description += ' ' + name + '[' + "title: " + values[i][0] + ", start: " + values[i][1] + ", end: " + values[i][2] + " , description: " + values[i][3] + ']';
    }
}

function init() {
    $('#createExhibitForm').length == 0 ? $('body').prepend('<div id="createExhibitForm" >') : "";
    $('#exhibitTitleInput').length == 0 ? $('body').prepend('<span id="exhibitTitleInput"</span>') : "";
    $('#exhibitDateInput').length == 0 ? $('body').prepend('<span id="exhibitDateInput"</span>') : "";
    $('#ExhibitErrorSpan').length == 0 ? $('body').prepend('<span id="ExhibitErrorSpan" style="color:red; display:none">Input error</span>') : "";
}