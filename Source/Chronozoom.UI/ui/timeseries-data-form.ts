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
                        var li = $('<ul></ul>').appendTo(existingTimSeriesList);
                        var link = $('<a></a>').addClass("cz-form-btn").appendTo(li);
                        link.css("color", "#25a1ea");
                        link.text(preloaded.name);
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

                            CZ.HomePageViewModel.showTimeSeriesChart();
                            CZ.rightDataSet = CZ.Data.csvToDataSet(data, preloaded.delimiter, preloaded.name);
                            var vp = CZ.Common.vc.virtualCanvas("getViewport");
                            CZ.HomePageViewModel.updateTimeSeriesChart(vp);
                        });
                    });
                }

                this.input = $("#fileLoader");
                var that = this;

                if (this.checkFileLoadCompatibility()) {
                    $("#loaduserdatabtn").click(function () {
                        var fr = that.openFile({
                            "onload": function (e) {
                                that.updateUserData(fr.result); // this -> FileReader
                            }
                        });
                    });
                } else {
                    $("#uploaduserdatacontainer").hide();
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
                CZ.HomePageViewModel.showTimeSeriesChart();
                CZ.leftDataSet = CZ.Data.csvToDataSet(csvString, $("#delim").prop("value"), this.input[0].files[0].name);
                CZ.leftDataSet.series[0].appearanceSettings.stroke = "red";
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                CZ.HomePageViewModel.updateTimeSeriesChart(vp);
            }
        }
    }
}