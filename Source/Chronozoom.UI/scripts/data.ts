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
            public time: number[];
            public series: Series[];

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

            return csvToDataSet(rolandData);
        }

        export function csvToDataSet(csvText: any): DataSet {
            var firstLineEnding = csvText.indexOf("\n");
            var appearance = csvText.substr(0, firstLineEnding);
            var dataText = csvText.substr(firstLineEnding, csvText.length);

            var csvArr = dataText.csvToArray({ trim: true });
            var dataLength = csvArr.length - 1;
            var seriesLength = csvArr[0].length - 1;

            var result = new DataSet();
            result.time = new Array();
            result.series = new Array();

            for (var i = 1; i <= seriesLength; i++) {
                var seria = new Series();
                seria.values = new Array();
                //TODO: add proper appearence settings
                seria.appearanceSettings = { thickness: 1, stroke: 'blue' };
                seria.appearanceSettings.yMin = parseFloat(csvArr[1][i]);
                seria.appearanceSettings.yMax = parseFloat(csvArr[1][i]);
                result.series.push(seria);
            }

            for (var i = 0; i < dataLength; i++) {
                result.time.push(csvArr[i + 1][0]);
                for (var j = 1; j <= seriesLength; j++) {
                    var value = parseFloat(csvArr[i + 1][j]);
                    var seria = result.series[j-1];
                    if (seria.appearanceSettings.yMin > value)
                        seria.appearanceSettings.yMin = value;
                    if (seria.appearanceSettings.yMax < value)
                        seria.appearanceSettings.yMax = value;
                    seria.values.push(value);
                }
            }

            return result;
        }
    }
}
