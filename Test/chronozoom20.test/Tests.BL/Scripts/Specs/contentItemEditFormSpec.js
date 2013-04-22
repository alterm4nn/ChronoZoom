/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Utils/jquery-ui.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/cz.dates.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/vccontent.js" />
/// <reference path="../Js/authoring.ui.js" />
/// <reference path="../Js/authoring.js" />
/// <reference path="../Js/czservice.js"/>
/// <reference path="js-ignore.js"/>

describe("Given:  'edit content item' form is opened: ", function () {
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
        var ContainerElement = { parent: exhibit };
        var contentItem = { title: "contentTitle", uri: "http://url", description: "description for contentItem", mediaType: "image"};
        var contentItemObject = { contentItem: contentItem, parent: ContainerElement };
        
        
        init();
        authoring.UI.showEditContentItemForm(contentItemObject, exhibit);
    });
    afterEach(function () {
        $('.ui-button-icon-primary.ui-icon.ui-icon-closethick').click();
    });

    //"data = ['timeline title', 'mediaSourse', 'description', 'description']"
    var dataTitle = ["", "http://uri", "description", "empty 'title'"];
    var dataUri = ["title", "", "description", "empty 'uri'"];
    var dataDescription = ["title", "http://uri", "", "empty 'description'"];

    using("Data set: ", [dataTitle, dataUri, dataDescription], function (title, media, description, conditional) {

        describe("When: User set: " + conditional + " and save changes", function () {
            beforeEach(function () {
                $('#contentItemTitleInput').val(title);
                $('#contentItemMediaSourceInput').val(media);
                $('#contentItemDescriptionInput').val(description);
                ($)("#contentItemMediaTypeInput").val('PDF').attr("selected","selected");

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
        jasmine.currentEnv_.currentSpec.description += ' ' + name + '[' + "title: " + values[i][0] + ", date: " + values[i][1] + " , description: " + values[i][3] + ']';
    }
}

function init() {
    $('#editContentItemForm').length == 0 ? $('body').prepend('<div id="editContentItemForm" >') : "";
    $('#contentItemTitleInput').length == 0 ? $('body').prepend('<span id="contentItemTitleInput"</span>') : "";
    $('#contentItemMediaSourceInput').length == 0 ? $('body').prepend('<span id="contentItemMediaSourceInput"</span>') : "";
    $('#contentItemDescriptionInput').length == 0 ? $('body').prepend('<span id="contentItemDescriptionInput"</span>') : "";
    $("#contentItemMediaTypeInput option").length == 0 ? $('body').prepend('<select id="contentItemMediaTypeInput">') : "";
    $('#contentItemMediaTypeInput').append($("<option></option>").attr("value", "pdf").text("PDF"));
    $('#contentItemMediaTypeInput').append($("<option></option>").attr("value", "image").text("Image"));
    $('#contentItemMediaTypeInput').append($("<option></option>").attr("value", "video").text("Video"));
    $('#contentItemMediaTypeInput').append($("<option></option>").attr("value", "audio").text("Audio"));
    $('#ExhibitErrorSpan').length == 0 ? $('body').prepend('<span id="ExhibitErrorSpan" style="color:red; display:none">Input error</span>') : "";
}