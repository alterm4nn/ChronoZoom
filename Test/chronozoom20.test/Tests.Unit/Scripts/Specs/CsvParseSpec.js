/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Js/csvUtils.js" />


//describe("Parsed file", function () { //TODO: csvUtils.js not found in blessed repository

//    //TestData
//    var reader;
//    var x = "x";
//    var y = "y";
//    var expectedx0 = "1800";
//    var expectedx1 = "1980";
//    var expectedy0 = "-158";
//    var expectedy1 = "45.40";
//    var incomingContent = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\n\r\n" + x + "," + y + "\r\n" + expectedx0 + "," + expectedy0 + "\r\n" + expectedx1 + "," + expectedy1;


//    beforeEach(function () {
//        reader = new CZ.CsvUtils.Reader();
//    });
    
//    it("should have values from Csv", function () {
//        var json = reader.parseFile(incomingContent);
//        expect(json.x.length).toEqual(2);
//        expect(json.y.length).toEqual(2);
//        expect(json.x[0]).toEqual(expectedx0);
//        expect(json.x[1]).toEqual(expectedx1);
//        expect(json.y[0]).toEqual(expectedy0);
//        expect(json.y[1]).toEqual(expectedy1);
//    });
    
    
//    describe("when cvs contains different dilimeters", function() {
//        using("cvs string", [[","], [" "], ["\t"]], function (value) {
//            it("should have values from Csv", function () {
//                var string = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\nx" + value + "t\r\n1900" + value + "4\r\n1980" + value +"101";
//                var json = reader.parseFile(string);
//                expect(json.x.length).toEqual(2);
//                expect(json.y.length).toEqual(2);
//                expect(json.x[0]).toEqual("1900");
//                expect(json.x[1]).toEqual("1980");
//                expect(json.y[0]).toEqual("4");
//                expect(json.y[1]).toEqual("101");
//            });
//        });
//    });
  
    
//    var errorText = "Invalid content of the file (record). ";
    
//    describe("when cvs contains empty values", function () {
//        //TestData
        
//        var incomingContent1 = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\nx,t\r\n\r\n\r\n,4\r\n1980,101";
//        var errorPosition1 = "[55,1]";
//        var data1 = [incomingContent1, errorPosition1];

//        var incomingContent2 = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\nx,t\r\n\r\n\r\n5,4\r\n,101";
//        var errorPosition2 = "[52,1]";
//        var data2 = [incomingContent2, errorPosition2];

        

//        using("invalid cvs string", [data1, data2], function (value, value1) {
//            it("should throw exeption", function () {
//                expect(function () { reader.parseFile(value); }).toThrow(new Error(errorText + value1));
//            });
//        });
//    });

//    describe("when file without schema", function() {
//        var incomingContentWithoutSchema = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\n\r\n444,444\r\n1980,101";
//        it("should have values from Csv", function () {
//            var json = reader.parseFile(incomingContentWithoutSchema);
//            expect(json.x.length).toEqual(2);
//        });
//    });

//    describe("when file without header", function () {
//        var incomingContentWithoutHeader = "t,x\r\n201,-0.45\r\n202,0.47";
//        it("should have values from Csv", function () {
//            var json = reader.parseFile(incomingContentWithoutHeader);
//            expect(json.x.length).toEqual(2);
//        });
//    });

//    describe("when file is empty data", function () {
//        var incomingContent = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\nx,t\r\n\n\n\n\n\n\n\n\n\n\n\n\n\n";
//        var errorPosition = "[44,1]";
//        var data = [incomingContent, errorPosition];
//        using("cvs string", [data], function(value) {
//            it("should parse with empty strings", function () {
//                var json = reader.parseFile(value);
//                expect(json.x[0]).toEqual("");
//            });
//        });
//    });
    
//    describe("when file is null", function () {
//        var file = null;
//        it("should throw error 'File parameter is undefined.'", function () {
//            expect(function () { reader.parseFile(file); }).toThrow(new Error("File parameter is undefined."));
//        });
//    });

//    describe("when delimiters is not supported", function () {
//        var file = "{\"thickness\":5, \"stroke\": \"#006aff\"}\r\nx,t\r\n15,25\r\n45,19";
//        var delimiter = ";";
//        it("should throw error 'Invalid delimiter character.'", function () {
//            expect(function () { reader.parseFile(file, delimiter); }).toThrow(new Error("Invalid delimiter character."));
//        });
//    });

//    describe("Open File with null input", function () {
//        var file = null;
//        var callbacks = "";
//        it("should throw error 'Input element is undefined.'", function () {
//            expect(function () { reader.openFile(file, callbacks); }).toThrow(new Error("Input element is undefined."));
//        });
//    });


//    describe("when file is start with spaces", function () {
//        var file = "   {\"thickness\":5, \"stroke\": \"#ff6aff\"}\r\nx,y\r\n231,-21.6678\t\r\n232, 29.4294 \r\n233, -1.9404     \t\t\t\t\t                 ";
//        it("should throw error 'Invalid content of the file (blank area).'", function () {
//            expect(function () { reader.parseFile(file); }).toThrow(new Error("Invalid content of the file (blank area). [3]"));
//        });
//    });
    

//});

//https://github.com/jphpsf/jasmine-data-provider
function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1]]);
        jasmine.currentEnv_.currentSpec.description += ' (with "' + name + '" using ' + values[i][0].concat(' ') + ')';
    }
}