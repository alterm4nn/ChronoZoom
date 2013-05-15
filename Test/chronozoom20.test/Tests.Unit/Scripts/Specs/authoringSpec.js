/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Js/common.js" />
/// <reference path="../Js/cz.settings.js" />
/// <reference path="../Js/authoring.js" />

describe("CZ.Authoring part", function () {
    var alertMessage;
    alert = function (message) { alertMessage = message; };

    var authoring;
    beforeEach(function () {
        authoring = CZ.Authoring;
        validateContentItems = authoring.ValidateContentItems;
        validateTimelineData = authoring.ValidateTimelineData;
        validateExhibitData = authoring.ValidateExhibitData;
        validateNumber = authoring.ValidateNumber;
        isNotEmpty = authoring.IsNotEmpty;
        isNonegHeight = authoring.isNonegHeight;
        alertMessage = '';
    });

    describe("ValidateContentItems() function", function () {
        var contentItems;
        describe("should return", function () {

            //empty array
            it("false, if 'contentItems' is empty array", function () {
                contentItems = [];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
            });

            //Empty fields
            it("false, if 'title' is empty", function () {
                contentItems = [{ mediaType: 'Image', uri: 'Uri', title: '' }];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
            });
            it("false, if 'uri' is empty", function () {
                contentItems = [{ mediaType: 'Image', uri: '', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
            });
            it("false, if 'mediaType' is empty", function () {
                contentItems = [{ mediaType: '', uri: 'Uri', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
            });

            //Image
            it("true, if 'mediaType' equal 'Image' and 'uri' end with 'jpg'", function () {
                contentItems = [{ mediaType: 'Image', uri: 'www.example.com/image.jpg', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("true, if 'mediaType' equal 'Image' and 'uri' end with 'jpeg'", function () {
                contentItems = [{ mediaType: 'Image', uri: 'www.example.com/image.jpeg', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("true, if 'mediaType' equal 'Image' and 'uri' end with 'png'", function () {
                contentItems = [{ mediaType: 'Image', uri: 'www.example.com/image.png', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("false, if 'mediaType' equal 'Image' and 'uri' does not end with 'png|jpg|jpeg' (and shown error alert)", function () {
                contentItems = [{ mediaType: 'Image', uri: 'www.example.com/image', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
                expect('Sorry, only JPG/PNG images are supported').toEqual(alertMessage);
            });

            //Video
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://www.youtube.com/watch?v=3jvJD8Qv5ec'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://www.youtube.com/watch?v=3jvJD8Qv5ec', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://vimeo.com/37284939'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://vimeo.com/37284939', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://www.youtube.com/embed/3jvJD8Qv5ec'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://www.youtube.com/embed/3jvJD8Qv5ec', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://player.vimeo.com/video/37284939'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://player.vimeo.com/video/37284939', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("false, if 'mediaType' equal 'Video' and 'uri' is invalid (and shown error alert)", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://video.com/video.php&id=65535', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
                expect('Sorry, only YouTube or Vimeo videos are supported').toEqual(alertMessage);
            });
            //Vimeo copy video url at current time
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://vimeo.com/37284939#t=18'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://vimeo.com/37284939#t=18', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            //from 'Share' button
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://youtu.be/3jvJD8Qv5ec'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://youtu.be/3jvJD8Qv5ec', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            //From 'Share' buttom with time maker
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://youtu.be/3jvJD8Qv5ec?t=50s'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://youtu.be/3jvJD8Qv5ec?t=50s', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            //From 'Copy video url' context menu option
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://www.youtube.com/watch?feature=player_detailpage&v=3jvJD8Qv5ec'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://www.youtube.com/watch?feature=player_detailpage&v=3jvJD8Qv5ec', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            //From 'Copy video url at current time' context menu option
            it("true, if 'mediaType' equal 'Video' and 'uri' equal 'http://www.youtube.com/watch?feature=player_detailpage&v=3jvJD8Qv5ec#t=86s'", function () {
                contentItems = [{ mediaType: 'Video', uri: 'http://www.youtube.com/watch?feature=player_detailpage&v=3jvJD8Qv5ec#t=86s', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });

            //PDF
            it("true, if 'mediaType' equal 'PDF' and 'uri' end with '.pdf'", function () {
                contentItems = [{ mediaType: 'PDF', uri: 'http://research.microsoft.com/en-us/projects/chronozoom/chronozoom_overview.pdf', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            it("false, if 'mediaType' equal 'PDF' and 'uri' doen not end with '.pdf' (and shown error alert)", function () {
                contentItems = [{ mediaType: 'PDF', uri: 'http://site.com/mypdffile', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(false).toEqual(isValid);
                expect('Sorry, only PDF extension is supported').toEqual(alertMessage);
            });

        });
    });

    //todo: Need to use 'using' function
    describe("ValidateTimelineData() function", function () {
        describe("should return", function () {
            it("true, if start less than end", function () {
                var start = 2; var end = 5; var title = 'test';
                var isValid = validateTimelineData(start, end, title);
                expect(isValid).toEqual(true);
            });
        });
    });

    describe("ValidateNumber() function", function () {
        describe("should return", function () {
            it("true, if number not null ", function () {
                var number = 0;
                var result = validateNumber(number);
                expect(true).toEqual(result);
            });

            it("false, if number is empty ", function () {
                var number = '';
                var result = validateNumber(number);
                expect(false).toEqual(result);
            });

            it("false, if number equal any text ", function () {
                var number = 'text';
                var result = validateNumber(number);
                expect(false).toEqual(result);
            });

            it("false, if number equal NaN", function () {
                var number = NaN;
                var result = validateNumber(number);
                expect(false).toEqual(result);
            });

            it("false, if number start with point (.2)", function () {
                var number = .2;
                var result = validateNumber(number);
                expect(false).toEqual(result);
            });

            it("false, if number end with point (2.)", function () {
                var number = 2.;
                var result = validateNumber(number);
                expect(false).toEqual(result);
            });
        });
    });

    describe("IsNotEmpty() function", function () {
        describe("should return", function () {
            it("false, if object is empty ", function () {
                var obj = '';
                var result = isNotEmpty(obj);
                expect(false).toEqual(result);
            });

            it("false, if object is null ", function () {
                var obj = null;
                var result = isNotEmpty(obj);
                expect(false).toEqual(result);
            });

            it("true, if object is not null", function () {
                var obj = 'text';
                var result = isNotEmpty(obj);
                expect(true).toEqual(result);
            });
        });
    });

    describe("isNonegHeight() function", function () {
        describe("should return", function () {
            it("true, if start < end", function () {
                var start = 2, end = 5;
                var result = isNonegHeight(start, end);
                expect(true).toEqual(result);
            });

            it("false, if start > end", function () {
                var start = 5, end = 2;
                var result = isNonegHeight(start, end);
                expect(false).toEqual(result);
            });

            it("false, if start = end", function () {
                var start = 5, end = 5;
                var result = isNonegHeight(start, end);
                expect(false).toEqual(result);
            });
        });
    });

    //todo: need to use using, table of data:
    describe("ValidateExhibitData() function", function () {
        describe("should return", function () {
            it("true, if Date is number, title is not empty, contentItems is not empty", function () {
                var date = 100, title = 'text', contentItems = [{ mediaType: 'image', uri: 'image.jpg', title: 'Title' }];
                var result = validateExhibitData(date, title, contentItems);
                expect(true).toEqual(result);
            });
        });
    });
});

function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1], values[i][2], values[i][3], values[i][4], values[i][5]]);
        jasmine.currentEnv_.currentSpec.description += ' ' + name + '[' + "title: " + values[i][0] + ", start: " + values[i][1] + ", end: " + values[i][2] + ", regimeStart: " + values[i][3] + ", regimeEnd: " + values[i][4];
    }
}