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
            var n = 300;
            var result = new DataSet();
            result.time = new Array();
            result.series = new Array();
            var seria = new Series();
            seria.values = new Array();
            seria.appearanceSettings = { thickness: 1, stroke: 'blue' };
            seria.appearanceSettings.yMin = -5;
            seria.appearanceSettings.yMax = 5;
            result.series.push(seria);
            for (var i = 0; i < n; i++) {
                result.time.push(i * 13700000000 / n - 13700000000);
                seria.values.push(Math.random() * 10 - 5);
            }

            return result;
        }

        export var sampleData: DataSet;
    }
}
