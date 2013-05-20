var CZ;
(function (CZ) {
    (function (Data) {
        function getTimelines(r) {
            if(r === undefined || r === null) {
                r = {
                    start: -50000000000,
                    end: 9999,
                    maxElements: null,
                    minspan: null
                };
            }
            return CZ.Service.getTimelines(r).then(function (response) {
            }, function (error) {
            });
        }
        Data.getTimelines = getTimelines;
        var DataSet = (function () {
            function DataSet() { }
            return DataSet;
        })();
        Data.DataSet = DataSet;        
        var Series = (function () {
            function Series() {
                this.values = new Array();
            }
            return Series;
        })();
        Data.Series = Series;        
        function generateSampleData() {
            var n = 10;
            var result = new DataSet();
            result.time = new Array(n);
            result.series = new Array(1);
            var seria = new Series();
            seria.values = new Array(n);
            result.series.push(seria);
            for(var i = 0; i < n; i++) {
                result.time.push(i * 1000000000 - 1000000000 * 2);
                seria.values.push(i);
            }
            return result;
        }
        Data.generateSampleData = generateSampleData;
        Data.sampleData = generateSampleData();
    })(CZ.Data || (CZ.Data = {}));
    var Data = CZ.Data;
})(CZ || (CZ = {}));
