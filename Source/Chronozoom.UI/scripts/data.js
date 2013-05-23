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
            var rolandData;
            $.ajax({
                cache: false,
                type: "GET",
                async: false,
                dataType: "json",
                url: '/dumps/beta-timeseries.json',
                success: function (result) {
                    rolandData = result;
                },
                error: function (xhr) {
                    alert("Error connecting to service: " + xhr.responseText);
                }
            });
            var n = rolandData.length / 2;
            var result = new DataSet();
            result.time = new Array();
            result.series = new Array();
            var seria = new Series();
            seria.values = new Array();
            seria.appearanceSettings = {
                thickness: 1,
                stroke: 'blue'
            };
            seria.appearanceSettings.yMin = rolandData[1];
            seria.appearanceSettings.yMax = rolandData[1];
            result.series.push(seria);
            for(var i = 0; i < n; i++) {
                result.time.push(rolandData[2 * i]);
                var y = rolandData[2 * i + 1];
                if(seria.appearanceSettings.yMin > y) {
                    seria.appearanceSettings.yMin = y;
                }
                if(seria.appearanceSettings.yMax < y) {
                    seria.appearanceSettings.yMax = y;
                }
                seria.values.push(y);
            }
            return result;
        }
        Data.generateSampleData = generateSampleData;
    })(CZ.Data || (CZ.Data = {}));
    var Data = CZ.Data;
})(CZ || (CZ = {}));
