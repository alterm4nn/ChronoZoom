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
        alertMessage = '';
    });

    describe("ValidateContentItems() function", function () {
        var contentItems;
        describe("should return", function () {

            //empty array
            it("true, if 'contentItems' is empty array", function () {
                contentItems = [];
                var isValid = validateContentItems(contentItems);
                expect(true).toEqual(isValid);
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
                expect('Sorry, only PDF is supported').toEqual(alertMessage);
            });

        });
    });
});