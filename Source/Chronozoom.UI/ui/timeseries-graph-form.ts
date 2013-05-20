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
                var dataToScreenX = (x) => { return (x - plotLeft) / (plotRight - plotLeft) * this.canvas.width + screenLeft; };
                var dataToScreenY = (y) => { return this.canvas.height / 2.0; };

                var x = dataSet.time;
                var n = x.length;

                var ctx = this.context;

                dataSet.series.forEach(function (seria) {
                    //setup appearance 
                    ctx.fillStyle = "blue";

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

                    ctx.closePath();
                });
            }
        }

        
    }
}