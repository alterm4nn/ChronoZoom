/// <reference path="../../../Chronozoom.UI/scripts/data.js"/>
/// <reference path="../../../Chronozoom.UI/ui/timeseries-data-form.js"/>
/// <reference path="../../../Chronozoom.UI/ui/timeseries-graph-form.js"/>
/// <reference path="../../../Chronozoom.UI/scripts/external/csvToArray.v2.1.js"/>

describe("csvToDataSet() method", function () {

    var validcsv = ["x,y\r\n-13000000000,500000\r\n-12000000000,600000\r\n-11000000000,700000", ','];
    var validcsv1 = ["x y\r\n-13000000000 500000\r\n-12000000000 600000\r\n-11000000000 700000", ' '];
    var validcsv2 = ["x;y\r\n-13000000000;500000\r\n-12000000000;600000\r\n-11000000000;700000", ';'];
    var validcsv3 = ["x	y\r\n-13000000000	500000\r\n-12000000000	600000\r\n-11000000000	700000", '	'];
    
    var equalsCsv0 = ["x,equal\r\n-1200,100\r\n-1100,100\r\n-1400,100\r\n-1200,100\r\n-1450,100", 100];
    var equalsCsv1 = ["x,equal\r\n-1200,10\r\n-1100,10\r\n-1400,10\r\n-1200,10\r\n-1450,10", 10];
    var equalsCsv2 = ["x,equal\r\n-1200,0.5\r\n-1100,0.5\r\n-1400,0.5\r\n-1200,0.5\r\n-1450,0.5", 0.5];
    var equalsCsv3 = ["x,equal\r\n-1200,-1\r\n-1100,-1\r\n-1400,-1\r\n-1200,-1\r\n-1450,-1", -1];
    
    var invalidcsv1 = "x\r\n-13000000000\r\n-12000000000\r\n-11000000000";
    var invalidcsv2 = "x,y\r\n-13000000000,500000\r\n-12000000000,600000,100\r\n-11000000000,700000";
    var invalidcsv3 = "x,y\r\n";
    var csvWithHints = "x,y{stroke:'cyan';thickness:3}\r\n-13000000000,500000\r\n-12000000000,600000\r\n-11000000000,700000";

    var validData = [
        validcsv, validcsv1,
        validcsv2, validcsv3
    ];

    var equalsCsv = [equalsCsv0,equalsCsv1,equalsCsv2,equalsCsv3];
    

    usingCsvToDataSet("", equalsCsv, function (csv, maxValue) {
        it("When: values are equal and = " + maxValue + ". Then: should parse csv file and generate dataSet strucrure with valid min and max values for each seria", function () {
            var dataSet = CZ.Data.csvToDataSet(csv, ',', "sample");
            expect(dataSet.name).toEqual("sample");
            expect(dataSet.time.length).toEqual(5);
            expect(dataSet.series.length).toEqual(1);
            expect(dataSet.series[0].values[0]).toEqual(maxValue);
            expect(dataSet.series[0].appearanceSettings.yMin).toEqual(maxValue);
            expect(dataSet.series[0].appearanceSettings.yMax).toEqual(maxValue);
        });
    });

    usingCsvToDataSet("", validData, function (csv, delimeter) {
        it("When: use delimiter - '" + delimeter + "' Then: should parse csv file and generate dataSet strucrure with valid min and max values for each seria", function () {
            var dataSet = CZ.Data.csvToDataSet(csv, delimeter, "sample");
            expect(dataSet.name).toEqual("sample");
            expect(dataSet.time.length).toEqual(3);
            expect(dataSet.series.length).toEqual(1);
            expect(dataSet.series[0].values[0]).toEqual(500000);
            expect(dataSet.series[0].appearanceSettings.yMin).toEqual(500000);
            expect(dataSet.series[0].appearanceSettings.yMax).toEqual(700000);
        });
    });

    it("should notify user that input csv should contain at least on series column", function () {
        expect(function () {
            CZ.Data.csvToDataSet(invalidcsv1);
        }).toThrow("Error parsing input file: table should contain one column with X-axis data and at least one column for Y-axis data");
    });

    it("should notify user that input csv containts incompatible row", function () {
        expect(function () {
            CZ.Data.csvToDataSet(invalidcsv2);
        }).toThrow("Error parsing input file: incompatible data row 2");
    });

    it("should notify user that input csv should containt at least one data row", function () {
        expect(function () {
            CZ.Data.csvToDataSet(invalidcsv3);
        }).toThrow("Error parsing input file: Input should be csv/text file with header and at least one data row");
    });

    it("should parse visual hints and add them as seria's propety to dataSet structure", function () {
        var dataSet = CZ.Data.csvToDataSet(csvWithHints, ",", "sample");

        expect(dataSet.series[0].appearanceSettings.stroke).toEqual('cyan');
        expect(dataSet.series[0].appearanceSettings.thickness).toEqual(3);
    });
});

describe("LineChart", function () {

    var axisAppearence = {
        labelCount: 4,
        tickLength: 10,
        majorTickThickness: 1,
        stroke: 'black',
        axisLocation: 'right',
        font: '16px Calibri',
        verticalPadding: 15
    }

    it("should produce correct ticks for input range", function () {
        var ticksDescr = CZ.UI.LineChart.prototype.calculateTicks(-1, 1, axisAppearence.labelCount);
        //labels should be [-1,0,1]
        expect(ticksDescr.ticks.length).toEqual(3);
        expect(ticksDescr.ticks[1]).toEqual(0);
    });
});

function usingCsvToDataSet(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1]]);
        jasmine.currentEnv_.currentSpec.description += name;
    }
}