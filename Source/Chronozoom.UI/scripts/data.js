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
            var n = 300;
            var result = new DataSet();
            result.time = new Array();
            result.series = new Array();
            var seria = new Series();
            seria.values = new Array();
            seria.appearanceSettings = {
            };
            seria.appearanceSettings.yMin = -5;
            seria.appearanceSettings.yMax = 5;
            result.series.push(seria);
            for(var i = 0; i < n; i++) {
                result.time.push(i * 13700000000 / n - 13700000000);
                seria.values.push(Math.random() * 10 - 5);
            }
            return result;
        }
        Data.generateSampleData = generateSampleData;
        Data.sampleData;
    })(CZ.Data || (CZ.Data = {}));
    var Data = CZ.Data;
})(CZ || (CZ = {}));
