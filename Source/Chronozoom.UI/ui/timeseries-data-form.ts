/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/data.ts'/> 
/// <reference path='../scripts/cz.ts'/> 

module CZ {
    export module UI {
        export class TimeSeriesDataForm extends CZ.UI.FormBase {
            private input: any;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: any) {
                super(container, formInfo);

                var existingTimSeriesList = $("#existingTimeSeries");

                if (existingTimSeriesList.children().length == 0) {
                    var preloadedlist;
                    $.ajax({ //main content fetching
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

                        var link = $('<a></a>').addClass("cz-form-btn").appendTo(li);
                        link.css("color", "#25a1ea");
                        link.css("float", "left");
                        link.text(preloaded.name);

                        var div = $("<div></div>").addClass("cz-form-preloadedrecord").appendTo(li);
                        div.text("Source:");

                        var sourceDiv = $("<a></a>").addClass("cz-form-preloadedrecord").appendTo(li);
                        sourceDiv.css("color", "blue");
                        sourceDiv.text(preloaded.source);
                        sourceDiv.prop("href", preloaded.link);

                        link.click(function (e) {
                            var data;
                            $.ajax({ //main content fetching
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

                            try {
                                dataSet = CZ.Data.csvToDataSet(data, preloaded.delimiter, preloaded.source);
                            }
                            catch (err) {
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
                    var fl: any = $("#fileLoader");
                    $("#selectedFile").text(fl[0].files[0].name);
                });

                if (this.checkFileLoadCompatibility()) {
                    $("#loadDataBtn").click(function () {
                        var fr = that.openFile({
                            "onload": function (e) {
                                that.updateUserData(fr.result); // this -> FileReader
                            }
                        });
                    });
                } else {
                    $("#uploadDataCnt").hide();
                }
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });

                this.activationSource.removeClass("active");
            }

            public checkFileLoadCompatibility(): bool {
                return window['File'] && window['FileReader'] && window['FileList'] && window['Blob'];
            }

            private openFile(callbacks): FileReader {
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
            }

            private updateUserData(csvString): void {
                var dataSet = undefined;

                var delimValue = $("#delim").prop("value");
                if (delimValue === "tab")
                    delimValue = "\t";
                else if (delimValue === "space")
                    delimValue = " ";

                try {
                    dataSet = CZ.Data.csvToDataSet(csvString, delimValue, this.input[0].files[0].name);
                }
                catch (err) {
                    alert(err);
                    return;
                }

                CZ.HomePageViewModel.showTimeSeriesChart();
                CZ.leftDataSet = dataSet;
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                CZ.HomePageViewModel.updateTimeSeriesChart(vp);
            }
        }
    }
}