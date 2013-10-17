/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/data.ts'/>
/// <reference path='../scripts/cz.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TimeSeriesDataForm = (function (_super) {
            __extends(TimeSeriesDataForm, _super);
            // We only need to add additional initialization in constructor.
            function TimeSeriesDataForm(container, formInfo) {
                _super.call(this, container, formInfo);

                var existingTimSeriesList = $("#existingTimeSeries");

                if (existingTimSeriesList.children().length == 0) {
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
                        var li = $('<li></li>').css("margin-left", 10).css("margin-bottom", "3px").height(22).appendTo(existingTimSeriesList);

                        var link = $('<a></a>').addClass("cz-form-preloadedrecord").appendTo(li);
                        link.css("color", "#0464a2");
                        link.css("font-size", "16px");
                        link.css("float", "left");
                        link.css("width", "140px");
                        link.css("cursor", "pointer");
                        link.text(preloaded.name);

                        var div = $("<span></span>").addClass("cz-form-preloadedrecord").appendTo(li);
                        div.text("Source:");

                        var sourceDiv = $("<a></a>").addClass("cz-form-preloadedrecord").appendTo(li);
                        sourceDiv.css("color", "#0464a2");
                        sourceDiv.css("cursor", "pointer");
                        sourceDiv.text(preloaded.source);
                        sourceDiv.prop("href", preloaded.link);

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

                            var dataSet = undefined;

                            try  {
                                dataSet = CZ.Data.csvToDataSet(data, preloaded.delimiter, preloaded.source);
                            } catch (err) {
                                alert(err);
                                return;
                            }

                            CZ.HomePageViewModel.showTimeSeriesChart();
                            CZ.rightDataSet = dataSet;
                            var vp = CZ.Common.vc.virtualCanvas("getViewport");
                            CZ.HomePageViewModel.updateTimeSeriesChart(vp);
                        });
                    });
                }

                this.input = $("#fileLoader");
                var that = this;

                $("#fileLoader").change(function () {
                    var fl = $("#fileLoader");
                    $("#selectedFile").text(fl[0].files[0].name);
                });

                if (this.checkFileLoadCompatibility()) {
                    $("#loadDataBtn").click(function () {
                        var fr = that.openFile({
                            "onload": function (e) {
                                that.updateUserData(fr.result);
                            }
                        });
                    });
                } else {
                    $("#uploadDataCnt").hide();
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

                //TODO: add verifivation of input file
                fileReader.onloadstart = callbacks["onloadstart"];
                fileReader.onerror = callbacks["onerror"];
                fileReader.onabort = callbacks["onabort"];
                fileReader.onload = callbacks["onload"];
                fileReader.onloadend = callbacks["onloadend"];

                fileReader.readAsText(file);

                return fileReader;
            };

            TimeSeriesDataForm.prototype.updateUserData = function (csvString) {
                var dataSet = undefined;

                var delimValue = $("#delim").prop("value");
                if (delimValue === "tab")
                    delimValue = "\t";
else if (delimValue === "space")
                    delimValue = " ";

                try  {
                    dataSet = CZ.Data.csvToDataSet(csvString, delimValue, this.input[0].files[0].name);
                } catch (err) {
                    alert(err);
                    return;
                }

                CZ.HomePageViewModel.showTimeSeriesChart();
                CZ.leftDataSet = dataSet;
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                CZ.HomePageViewModel.updateTimeSeriesChart(vp);
            };
            return TimeSeriesDataForm;
        })(CZ.UI.FormBase);
        UI.TimeSeriesDataForm = TimeSeriesDataForm;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
