/// <reference path="../../../Chronozoom.UI/scripts/authoring.js" />
/// <reference path="../../../Chronozoom.UI/scripts/dates.js" />

describe("CZ.Authoring Exhibit part", function() {
    var alertMessage;
    alert = function(message) { alertMessage = message; };

    var authoring;
    beforeEach(function() {
        authoring = CZ.Authoring;
    });

    describe("checkExhibitIntersections() function", function() {
        describe("should return true if exhibit is not interected", function() {
            var parentTineline =
            {
                endDate: 9999,
                height: 10252854096.944561,
                newHeight: 10252854096.944561,
                newY: 0,
                type: "timeline",
                width: 13700002012.449314,
                x: -13699999999,
                y: 0
            };
            
            it("parentTineline.x < exhibit.infodotDescription.date ", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: 4480408133.423925,
                    infodotDescription: { date: parentTineline.x + 1 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });
            
            it("parentTineline.x = exhibit.infodotDescription.date", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: 4480408133.423925,
                    infodotDescription: { date: parentTineline.x }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

            it("parentTineline.y = exhibit.y", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: parentTineline.y,
                    infodotDescription: { date: -6849998996.27 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

            it("parentTineline.y < exhibit.y", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: parentTineline.y + 1,
                    infodotDescription: { date: -6849998996.27 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

            it("parentTineline.x + parentTineline.width = exhibit.infodotDescription.date", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: 4480408133.423925,
                    infodotDescription: { date: parentTineline.x + parentTineline.width }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

            it("parentTineline.x + parentTineline.width > exhibit.infodotDescription.date", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: 4480408133.423925,
                    infodotDescription: { date: parentTineline.x + parentTineline.width - 1 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

            it("parentTineline.y + parentTineline.height = exhibit.y + exhibit.height", function() {
                var exhibit = {
                    height: parentTineline.y,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: parentTineline.height,
                    infodotDescription: { date: -6849998996.27 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

            it("parentTineline.y + parentTineline.height > exhibit.y + exhibit.height", function() {
                var exhibit = {
                    height: parentTineline.y - 1,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: parentTineline.height - 1,
                    infodotDescription: { date: -6849998996.27 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(true);
            });

        });

        describe("should return false if exhibit is interected", function() {
            var parentTineline =
            {
                endDate: 9999,
                height: 10252854096.944561,
                newHeight: 10252854096.944561,
                newY: 0,
                type: "timeline",
                width: 13700002012.449314,
                x: -13699999999,
                y: 0
            };
            it("parentTineline.x > exhibit.infodotDescription.date ", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: 4480408133.423925,
                    infodotDescription: { date: parentTineline.x - 1 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(false);
            });


            it("parentTineline.y > exhibit.y", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: parentTineline.y - 1,
                    infodotDescription: { date: -6849998996.27 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(false);
            });

            it("parentTineline.x + parentTineline.width < exhibit.infodotDescription.date", function() {
                var exhibit = {
                    height: 548000080.4979726,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: 4480408133.423925,
                    infodotDescription: { date: parentTineline.x + parentTineline.width + 1 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(false);
            });

            it("parentTineline.y + parentTineline.height < exhibit.y + exhibit.height", function() {
                var exhibit = {
                    height: parentTineline.y + 1,
                    type: "infodot",
                    width: 548000080.4979726,
                    x: -7123999034.518987,
                    y: parentTineline.height + 1,
                    infodotDescription: { date: -6849998996.27 }
                };
                parentTineline.children = [exhibit];
                expect(authoring.checkExhibitIntersections(parentTineline, exhibit, true)).toBe(false);
            });

        });
    });

    describe("ValidateExhibitData() function", function () {
        var contentItems = [{ mediaType: 'image', uri: 'image.jpg', title: 'Title' }];
        title = 'text';
        var date = 100;
        describe("should return", function() {
            it("true, if Date is number, title is not empty, contentItems is not empty", function() {
                var result = authoring.validateExhibitData(date, title, contentItems);
                expect(true).toEqual(result);
            });

            it("false, if contentItems is not valid", function () {
                spyOn(authoring, 'validateContentItems').andReturn(false);
                var result = authoring.validateExhibitData(date, title, contentItems);
                expect(false).toEqual(result);
            });
            using("date is not numbers", [false], function(value) {
                it("should return false for invalid date", function() {
                    
                    expect(false).toEqual(authoring.validateExhibitData(value, title, contentItems));
                });
            });
            using("title is empty", ['',null], function (value) {
                it("should return false for invalid date", function() {
                    expect(false).toEqual(authoring.validateExhibitData(date, value, contentItems));
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
            func.apply(this, values[i]);
            jasmine.currentEnv_.currentSpec.description += ' (with "' + name + '" using ' + values[i].join(', ') + ')';
        }
    }


    