/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/data.ts'/>


declare var Dygraph: any;

module CZ {
    export module UI { 
        export interface TimeSeriesFormInfo extends CZ.UI.IFormBaseInfo {
        }

        export class TimeSeriesForm extends CZ.UI.FormBase {
            private graph: any;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: any) {
                super(container, formInfo);
            }
        }

        export class LineChart {

            private canvas: any;
            private context: any;

            constructor(container: JQuery) {
                this.canvas = <HTMLCanvasElement>document.createElement("canvas");
                $(this.canvas).appendTo($("#timeSeries"));

                this.canvas.width = container.width();
                this.canvas.height = container.height();

                this.context = this.canvas.getContext("2d"); 
            }

            public clear(screenLeft: number, screenRight: number) : void {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.context.fillStyle = "gray";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.context.fillStyle = "white";
                this.context.fillRect(screenLeft, 0, screenRight - screenLeft, this.canvas.height);
            }

            public drawDataSet(dataSet: CZ.Data.DataSet, screenLeft: number, screenRight: number, plotLeft: number, plotRight: number): void {
                //todo: determine y-range. It should be inside dataset
                var plotBottom = 0;
                var plotTop = 0;

                dataSet.series.forEach(function (seria) {
                    if (seria.appearanceSettings && seria.appearanceSettings.yMin && seria.appearanceSettings.yMin < plotBottom) {
                        plotBottom = seria.appearanceSettings.yMin;
                    }

                    if (seria.appearanceSettings && seria.appearanceSettings.yMax && seria.appearanceSettings.yMax > plotTop) {
                        plotTop = seria.appearanceSettings.yMax;
                    }
                });

                var dataToScreenX = (x) => { return (x - plotLeft) / (plotRight - plotLeft) * (screenRight - screenLeft) + screenLeft; };
                var dataToScreenY = (y) => { return (1 - (y - plotBottom) / (plotTop - plotBottom)) * this.canvas.height  };

                var x = dataSet.time;
                var n = x.length;

                var ctx = this.context;

                dataSet.series.forEach(function (seria) {
                    //setup appearance 
                    ctx.strokeStyle = 'blue';
                    ctx.fillStyle = 'blue'; 
                    ctx.lineWidth = 2;

                    //drawing line
                    var y = seria.values;

                    ctx.beginPath();
                    for (var i = 0; i < n; i++) {
                        var xi = dataToScreenX(x[i]);
                        var yi = dataToScreenY(y[i]);

                        if (i == 0)
                            ctx.moveTo(xi, yi);
                        else
                            ctx.lineTo(xi, yi); 
                    }
                     
                    ctx.stroke();
                });
            }
        }

        
    }
}