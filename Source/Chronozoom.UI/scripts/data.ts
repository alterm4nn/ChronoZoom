/// <reference path='settings.ts'/>
/// <reference path='service.ts'/>

module CZ {

    /// CZ.Data provides an abstraction to CZ.Service to optimize client-server interations with the CZ service.
    export module Data {

        export function getTimelines(r) {
            if (r === undefined || r === null) {
                r = {
                    start: -50000000000,
                    end: 9999,
                    // Until progressive loading gets refined, allow server to retrieve as much data as appropriate.
                    maxElements: null,
                    // Can't specify minspan on first load since the timeline span will vary significantly.
                    minspan: null
                }
            }

            return CZ.Service.getTimelines(r).then(
                function (response) {
                },
                function (error) {
                });
        }

        export class DataSet {
            public name: string;
            public time: number[];
            public series: Series[];

            public getVerticalPadding() {
                var padding = 0;
                this.series.forEach(function (seria) {
                    if (seria.appearanceSettings && seria.appearanceSettings.thickness && seria.appearanceSettings.thickness > padding) {
                        padding = seria.appearanceSettings.thickness;
                    }
                });
                return padding;
            }
        }

        export class Series {
            public values: number[];
            public appearanceSettings: any;

            constructor() {
                this.values = new Array();
            }
        }

        export function generateSampleData() {

            var rolandData;
            $.ajax({ //main content fetching
                cache: false,
                type: "GET",
                async: false,
                dataType: "text",
                url: '/dumps/beta-timeseries.csv',
                success: function (result) {
                    rolandData = result;
                },
                error: function (xhr) {
                    alert("Error fetching timeSeries Data: " + xhr.responseText);
                }
            });

            return csvToDataSet(rolandData, ",", "sampleData");
        }

        export function csvToDataSet(csvText: any, delimiter: any, name: string): DataSet {
            var dataText = csvText;

            var csvArr = dataText.csvToArray({ trim: true, fSep: delimiter, quot: "'" });

            if (csvArr === undefined)
                throw "Error parsing input file: file has incorrect format";

            var dataLength = csvArr.length - 1;

            if (dataLength < 2)
                throw "Error parsing input file: Input should be csv/text file with header and at least one data row";

            var seriesLength = csvArr[0].length - 1;

            if (seriesLength < 1)
                throw "Error parsing input file: table should contain one column with X-axis data and at least one column for Y-axis data";

            var result = new DataSet();
            result.name = name;
            result.time = new Array();
            result.series = new Array();

            for (var i = 1; i <= seriesLength; i++) {
                var seria = new Series();
                seria.values = new Array();
                seria.appearanceSettings = { thickness: 1, stroke: 'blue' };

                var seriaHeader = csvArr[0][i];
                var appearanceRegex = new RegExp("{(.*)}");
                var loadedAppearence: any = appearanceRegex.exec(seriaHeader);
                if (loadedAppearence !== null) {
                    loadedAppearence = parseStyleString(loadedAppearence[1]);
                    for (var prop in loadedAppearence) {
                        seria.appearanceSettings[prop] = loadedAppearence[prop];
                    }
                }
                var headerRegex = new RegExp("(.*){");
                var header = headerRegex.exec(seriaHeader);
                if (header !== null) {
                    seria.appearanceSettings.name = header[1];
                } else {
                    seria.appearanceSettings.name = seriaHeader;
                }

                seria.appearanceSettings.yMin = parseFloat(csvArr[1][i]);
                seria.appearanceSettings.yMax = parseFloat(csvArr[1][i]);

                result.series.push(seria);
            }

            for (var i = 0; i < dataLength; i++) {
                if (csvArr[i + 1].length !== (seriesLength + 1))
                    throw "Error parsing input file: incompatible data row " + (i + 1);

                result.time.push(parseFloat(csvArr[i + 1][0]));
                for (var j = 1; j <= seriesLength; j++) {
                    var value = parseFloat(csvArr[i + 1][j]);
                    var seria = result.series[j - 1];
                    if (seria.appearanceSettings.yMin > value)
                        seria.appearanceSettings.yMin = value;
                    if (seria.appearanceSettings.yMax < value)
                        seria.appearanceSettings.yMax = value;
                    seria.values.push(value);
                }
            }

            return result;
        }

        export function parseStyleString(styleString: any) {
            var result = {};
            var items = styleString.split(";");
            var n = items.length;
            for (var i = 0; i < n; i++) {
                var pair = items[i].split(':', 2);
                if (pair && pair.length === 2) {
                    var name = pair[0].trim();
                    var val = pair[1].trim();
                    if (/^\d+$/.test(val)) {
                        val = parseFloat(val);
                    }
                    result[name] = val;
                }
            }
            return result;
        }
    }
}
