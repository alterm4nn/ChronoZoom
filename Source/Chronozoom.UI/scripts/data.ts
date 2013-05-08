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

    }
}
