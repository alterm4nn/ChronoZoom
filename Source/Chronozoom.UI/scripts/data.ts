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
            var n = 10;
            var result = new DataSet();
            result.time = new Array(n);
            result.series = new Array(1);

            var seria = new Series();
            seria.values = new Array(n);
            result.series.push(seria);

            for (var i = 0; i < n; i++) {
                result.time.push(i * 1000000000 - 1000000000 * 2);
                seria.values.push(i);
            }

            return result;
        }

        export var sampleData = generateSampleData(); 
    }
}
