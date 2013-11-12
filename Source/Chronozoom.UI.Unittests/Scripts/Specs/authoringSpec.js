/// <reference path="../../../Chronozoom.UI/scripts/settings.js" />
/// <reference path="../../../Chronozoom.UI/scripts/authoring.js" />
/// <reference path="../../../Chronozoom.UI/scripts/dates.js" />
/// <reference path='../../../Chronozoom.UI/scripts/external/jquery-1.7.2.min.js'/>
/// <reference path="../../../Chronozoom.UI/scripts/service.js" />

describe("CZ.Authoring part", function () {
    var alertMessage;
    alert = function (message) { alertMessage = message; };

    var authoring;
    beforeEach(function () {
        authoring = CZ.Authoring;
        validateContentItems = authoring.validateContentItems;
        validateTimelineData = authoring.validateTimelineData;
        validateExhibitData = authoring.validateExhibitData;
        validateNumber = authoring.validateNumber;
        isNotEmpty = authoring.isNotEmpty;
        isIntervalPositive = authoring.isIntervalPositive;
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

            it("true, if 'mediaType' equal 'Image' and 'uri' end with 'gif'", function () {
                contentItems = [{ mediaType: 'Image', uri: 'www.example.com/image.gif', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            //it("false, if 'mediaType' equal 'Image' and 'uri' does not end with 'png|jpg|jpeg' (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'Image', uri: 'www.example.com/image', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('Sorry, only JPG/PNG/GIF images are supported.').toEqual(alertMessage);
            //});

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
            //it("false, if 'mediaType' equal 'Video' and 'uri' is invalid (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'Video', uri: 'http://video.com/video.php&id=65535', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('Sorry, only YouTube or Vimeo videos are supported.').toEqual(alertMessage);
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
            //it("false, if 'mediaType' equal 'PDF' and 'uri' doen not end with '.pdf' (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'PDF', uri: 'http://site.com/mypdffile', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('Sorry, only PDF extension is supported.').toEqual(alertMessage);
            //});
            
            //SkyDrive document
            it("true, if 'mediaType' equal 'skydrive-document' and 'uri' is skydrive embeded link", function () {
                contentItems = [{ mediaType: 'skydrive-document', uri: 'https://skydrive.live.com/embed?cid=BD02F080F32F9129&resid=BD02F080F32F9129%21117&authkey=AG-1M6GDeVQmZvE&em=2', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            
            //it("false, if 'mediaType' equal 'skydrive-document' and 'uri' is not skydrive embeded link (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'skydrive-document', uri: 'http://site.com/mypdffile', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('This is not a Skydrive embed link.').toEqual(alertMessage);
            //});

            //SkyDrive image
            it("true, if 'mediaType' equal 'skydrive-image' and 'uri' is skydrive embeded link", function () {
                contentItems = [{ mediaType: 'skydrive-image', uri: 'https://skydrive.live.com/embed?cid=BD02F080F32F9129&resid=BD02F080F32F9129%21107&authkey=AOCgBh3ykCqWIbc 308 319', title: 'Title' }];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
            });
            
            //it("false, if 'mediaType' equal 'skydrive-image' and 'uri' is not skydrive embeded link (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'skydrive-image', uri: 'https://skydrive.live.com/embed?cid=BD02F080F32F9129&resid=BD02F080F32F9129%21107&authkey=AOCgBh3ykCqWIbc', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('This is not a Skydrive embed link.').toEqual(alertMessage);
            //});

            //it("false, if 'mediaType' equal 'skydrive-image' and 'uri' is not skydrive embeded link (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'skydrive-image', uri: 'https://skydrive.ru/resid=BD02F080F32F9129%21107 150 200', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('This is not a Skydrive embed link.').toEqual(alertMessage);
            //});
            
            //it("false, if 'mediaType' equal 'skydrive-image' and 'uri' is not skydrive embeded link (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'skydrive-image', uri: 'https://skydrive.live.com/embed?cid=BD02F080F32F9129&resid=BD02F080F32F9129%21107&authkey=AOCgBh3ykCqWIbc 250', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('This is not a Skydrive embed link.').toEqual(alertMessage);
            //});
            //it("false, if 'mediaType' equal 'skydrive-image' and 'uri' is not skydrive embeded link (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'skydrive-image', uri: 'https://skydrive.live.com/embed?cid=BD02F080F32F9129&resid=BD02F080F32F9129%21107&authkey=AOCgBh3ykCqWIbc  ', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('This is not a Skydrive embed link.').toEqual(alertMessage);
            //});
            //it("false, if 'mediaType' equal 'skydrive-image' and 'uri' is not skydrive embeded link (and shown error alert)", function () {
            //    contentItems = [{ mediaType: 'skydrive-image', uri: 'https://skydrive.live.com/embed?cid=BD02F080F32F9129&resid=BD02F080F32F9129%21107&authkey=AOCgBh3ykCqWIbc  7', title: 'Title' }];
            //    var isValid = validateContentItems(contentItems);
            //    expect(false).toEqual(isValid);
            //    expect('This is not a Skydrive embed link.').toEqual(alertMessage);
            //});

        });
    });


    describe("validateTimelineData() function", function () {
        describe("should return", function () {

            var validInputData = [
                [1, 2, 'text'],
                [-1, 10, 'text'],
                [-10, -1, 'text']
            ];
            var invalidInputData = [
                [-2, false, 'text'], //bug https://github.com/alterm4nn/ChronoZoom/issues/411
                [false, -2, 'text'],
                [false, false, 'text'],
                [-2, -2, 'text'],
                [2, false, 'text'],
                [1, -10, 'text'],
                [2, 1, 'text'],
                [1, 50, ''],
                //[1, 50, ], according to https://github.com/alterm4nn/ChronoZoom/issues/259
                [1, , 'text']
            ];

            timelineDataUsing("true", validInputData, function (start, end, title) {
                it("should return", function () {
                    var isValid = validateTimelineData(start, end, title);
                    expect(true).toEqual(isValid);
                });
            });

            timelineDataUsing("false", invalidInputData, function (start, end, title) {
                it("should return", function () {
                    var isValid = validateTimelineData(start, end, title);
                    expect(false).toEqual(isValid);
                });
            });

        });
    });

    describe("validateNumber() function", function () {
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
                expect(true).toEqual(result);
            });

            it("false, if number end with point (2.)", function () {
                var number = 2.;
                var result = validateNumber(number);
                expect(true).toEqual(result);
            });

            it("false, if number contains both numeric and alphabet symbols (2f2)", function () {
                var number = '2f2';
                var result = validateNumber(number);
                expect(false).toEqual(result);
            });
        });
    });

    describe("isNotEmpty() function", function () {
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

            it("true, if object is \"space\"", function () {
                var obj = ' ';
                var result = isNotEmpty(obj);
                expect(true).toEqual(result);
            });
        });
    });

    describe("isIntervalPositive() function year mode", function () {
        describe("should return", function () {
            it("true, if start < end", function () {
                var start = 2, end = 5;
                var result = isIntervalPositive(start, end);
                expect(true).toEqual(result);
            });

            it("false, if start > end", function () {
                var start = 5, end = 2;
                var result = isIntervalPositive(start, end);
                expect(false).toEqual(result);
            });

            it("false, if start = end", function () {
                var start = 5, end = 5;
                var result = isIntervalPositive(start, end);
                expect(false).toEqual(result);
            });
        });
    });

    describe("isIntervalPositive() function date mode", function () {
        describe("should return", function () {
            var dates;
            beforeEach(function () {
                dates = CZ.Dates;
            });
            it("true, if start < end", function () {
                var start = dates.getCoordinateFromYMD(-201, 11, 31);
                var end = dates.getCoordinateFromYMD(1702, 11, 2);
                var result = isIntervalPositive(start, end);
                expect(true).toEqual(result);
            });

            it("false, if start > end", function () {
                var start = dates.getCoordinateFromYMD(2011, 11, 31);
                var end = dates.getCoordinateFromYMD(-1702, 11, 2);
                var result = isIntervalPositive(start, end);
                expect(false).toEqual(result);
            });

            it("false, if start = end", function () {
                var start = dates.getCoordinateFromYMD(1789, 11, 31);
                var end = dates.getCoordinateFromYMD(1789, 11, 31);
                var result = isIntervalPositive(start, end);
                expect(false).toEqual(result);
            });
        });
    });

    describe("isIntervalPositive() function ", function () {
        describe("Start in date mode and End in year mode", function () {
            describe("should return", function () {
                var dates;
                beforeEach(function () {
                    dates = CZ.Dates;
                });
                it("true, if start < end", function () {
                    var start = dates.getCoordinateFromYMD(-201, 11, 31);
                    var end = 1703;
                    var result = isIntervalPositive(start, end);
                    expect(true).toEqual(result);
                });

                it("false, if start > end", function () {
                    var start = dates.getCoordinateFromYMD(2011, 11, 31);
                    var end = -1702;
                    var result = isIntervalPositive(start, end);
                    expect(false).toEqual(result);
                });

                it("false, if start = end", function () {
                    var start = dates.getCoordinateFromYMD(1789, 11, 31);
                    var end = 1789;
                    var result = isIntervalPositive(start, end);
                    expect(false).toEqual(result);
                });
            });
        });

        describe("isIntervalPositive() function ", function () {
            describe("Start in year mode and End in date mode", function () {
                describe("should return", function () {
                    var dates;
                    beforeEach(function () {
                        dates = CZ.Dates;
                    });
                    it("true, if start < end", function () {
                        var start = -201;
                        var end = dates.getCoordinateFromYMD(1702, 11, 2);
                        var result = isIntervalPositive(start, end);
                        expect(true).toEqual(result);
                    });

                    it("false, if start > end", function () {
                        var start = 2011;
                        var end = dates.getCoordinateFromYMD(-1702, 11, 2);
                        var result = isIntervalPositive(start, end);
                        expect(false).toEqual(result);
                    });

                    it("fa;se, if start = end", function () {
                        var start = 1789;
                        var end = dates.getCoordinateFromYMD(1789, 00, 01);
                        var result = isIntervalPositive(start, end);
                        expect(false).toEqual(result);
                    });
                });
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

function timelineDataUsing(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1], values[i][2]]);
        jasmine.currentEnv_.currentSpec.description += ' ' + name + ' if input data equal: start: ' + values[i][0] + ', end: ' + values[i][1] + ', title: ' + values[i][2];
    }
}