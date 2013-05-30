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
        Data.generateSampleData = generateSampleData;
        function csvToDataSet(csvText, delimiter, name) {
            var dataText = csvText;
            var csvArr = dataText.csvToArray({
                trim: true,
                fSep: delimiter
            });
            var dataLength = csvArr.length - 1;
            var seriesLength = csvArr[0].length - 1;
            var result = new DataSet();
            result.name = name;
            result.time = new Array();
            result.series = new Array();
            for(var i = 1; i <= seriesLength; i++) {
                var seria = new Series();
                seria.values = new Array();
                seria.appearanceSettings = {
                    thickness: 1,
                    stroke: 'blue',
                    name: csvArr[0][i]
                };
                seria.appearanceSettings.yMin = parseFloat(csvArr[1][i]);
                seria.appearanceSettings.yMax = parseFloat(csvArr[1][i]);
                result.series.push(seria);
            }
            for(var i = 0; i < dataLength; i++) {
                result.time.push(csvArr[i + 1][0]);
                for(var j = 1; j <= seriesLength; j++) {
                    var value = parseFloat(csvArr[i + 1][j]);
                    var seria = result.series[j - 1];
                    if(seria.appearanceSettings.yMin > value) {
                        seria.appearanceSettings.yMin = value;
                    }
                    if(seria.appearanceSettings.yMax < value) {
                        seria.appearanceSettings.yMax = value;
                    }
                    seria.values.push(value);
                }
            }
            return result;
        }
        Data.csvToDataSet = csvToDataSet;
    })(CZ.Data || (CZ.Data = {}));
    var Data = CZ.Data;
})(CZ || (CZ = {}));
