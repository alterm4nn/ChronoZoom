var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TimeSeriesDataForm = (function (_super) {
            __extends(TimeSeriesDataForm, _super);
            function TimeSeriesDataForm(container, formInfo) {
                        _super.call(this, container, formInfo);
                var existingTimSeriesList = $("#existingTimeSeries");
                if(existingTimSeriesList.children().length == 0) {
                    var preloadedlist;
                    $.ajax({
                        cache: false,
                        type: "GET",
                        async: false,
                        dataType: "JSON",
                        url: '/dumps/timeseries-preloaded.txt',
                        success: function (result) {
                            preloadedlist = result.d;
                        },
                        error: function (xhr) {
                            alert("Error fetching pre-loaded timeseries list: " + xhr.responseText);
                        }
                    });
                    preloadedlist.forEach(function (preloaded) {
                        var li = $('<ul></ul>').appendTo(existingTimSeriesList);
                        var par = $("<p></p>");
                        var link = $('<a></a>').addClass("cz-form-btn").appendTo(li);
                        link.css("color", "#25a1ea");
                        link.css("float", "left");
                        link.text(preloaded.name);
                        var div = $("<div>Source:</div>").appendTo(li);
                        div.css("margin-left", "3px");
                        div.css("margin-right", "3px");
                        div.css("float", "left");
                        var sourceDiv = $("<a></a>").appendTo(li);
                        sourceDiv.css("color", "blue");
                        sourceDiv.text(preloaded.source);
                        link.click(function (e) {
                            var data;
                            $.ajax({
                                cache: false,
                                type: "GET",
                                async: false,
                                dataType: "text",
                                url: preloaded.file,
                                success: function (result) {
                                    data = result;
                                },
                                error: function (xhr) {
                                    alert("Error fetching timeSeries Data: " + xhr.responseText);
                                }
                            });
                            CZ.HomePageViewModel.showTimeSeriesChart();
                            CZ.rightDataSet = CZ.Data.csvToDataSet(data, preloaded.delimiter, preloaded.source);
                            var vp = CZ.Common.vc.virtualCanvas("getViewport");
                            CZ.HomePageViewModel.updateTimeSeriesChart(vp);
                        });
                    });
                }
                this.input = $("#fileLoader");
                var that = this;
                if(this.checkFileLoadCompatibility()) {
                    $("#loaduserdatabtn").click(function () {
                        var fr = that.openFile({
                            "onload": function (e) {
                                that.updateUserData(fr.result);
                            }
                        });
                    });
                } else {
                    $("#uploaduserdatacontainer").hide();
                }
            }
            TimeSeriesDataForm.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            TimeSeriesDataForm.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            TimeSeriesDataForm.prototype.checkFileLoadCompatibility = function () {
                return window['File'] && window['FileReader'] && window['FileList'] && window['Blob'];
            };
            TimeSeriesDataForm.prototype.openFile = function (callbacks) {
                var file = this.input[0].files[0];
                var fileReader = new FileReader();
                fileReader.onloadstart = callbacks["onloadstart"];
                fileReader.onerror = callbacks["onerror"];
                fileReader.onabort = callbacks["onabort"];
                fileReader.onload = callbacks["onload"];
                fileReader.onloadend = callbacks["onloadend"];
                fileReader.readAsText(file);
                return fileReader;
            };
            TimeSeriesDataForm.prototype.updateUserData = function (csvString) {
                CZ.HomePageViewModel.showTimeSeriesChart();
                CZ.leftDataSet = CZ.Data.csvToDataSet(csvString, $("#delim").prop("value"), this.input[0].files[0].name);
                CZ.leftDataSet.series[0].appearanceSettings.stroke = "red";
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                CZ.HomePageViewModel.updateTimeSeriesChart(vp);
            };
            return TimeSeriesDataForm;
        })(CZ.UI.FormBase);
        UI.TimeSeriesDataForm = TimeSeriesDataForm;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
