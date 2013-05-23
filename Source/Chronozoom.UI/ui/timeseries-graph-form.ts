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

            private calculateTicks(ymin: number, ymax: number, labelCount: number): any {
                var delta = (ymax - ymin) / labelCount;
                var h = Math.round(Math.log(delta) / Math.LN10);
                var h10 = Math.pow(10, h);
                var k = delta / h10;
                if (k < 1.5)
                    k = 1;
                else if (k < 3.5)
                    k = 2;
                else
                    k = 5;

                var imin = Math.ceil(ymin / (k * h10));
                var imax = Math.floor(ymax / (k * h10));
                var actualLabelCount = imax - imin + 1;

                if (actualLabelCount < labelCount) {
                    while (true) {
                        var k1 = k;
                        var h1 = h;
                        if (k1 == 5)
                            k1 = 2;
                        else if (k1 == 2)
                            k1 = 1;
                        else {
                            h1--;
                            k1 = 5;
                        }
                        var imin1 = Math.ceil(ymin / (k1 * Math.pow(10, h1)));
                        var imax1 = Math.floor(ymax / (k1 * Math.pow(10, h1)));
                        var actualLabelCount1 = imax1 - imin1 + 1;
                        if (Math.abs(labelCount - actualLabelCount) > Math.abs(labelCount - actualLabelCount1)) {
                            imin = imin1;
                            imax = imax1;
                            k = k1;
                            h = h1;
                            h10 = Math.pow(10, h1);
                        } else
                            break;
                    }
                } else if (actualLabelCount > labelCount) {
                    while (true) {
                        var k1 = k;
                        var h1 = h;
                        if (k1 == 5) {
                            k1 = 1;
                            h1++;
                        }
                        else if (k1 == 2)
                            k1 = 5;
                        else
                            k1 = 2;
                        var imin1 = Math.ceil(ymin / (k1 * Math.pow(10, h1)));
                        var imax1 = Math.floor(ymax / (k1 * Math.pow(10, h1)));
                        var actualLabelCount1 = imax1 - imin1 + 1;
                        if (Math.abs(labelCount - actualLabelCount) > Math.abs(labelCount - actualLabelCount1) && actualLabelCount1 > 0) {
                            imin = imin1;
                            imax = imax1;
                            k = k1;
                            h = h1;
                            h10 = Math.pow(10, h1);
                        }
                        else
                            break;
                    }
                }

                var result = [];
                for (var i = imin; i <= imax; i++)
                    result.push(i * k * h10);

                return result;
            }

            public clear(screenLeft: number, screenRight: number): void {
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
                var dataToScreenY = (y) => { return (1 - (y - plotBottom) / (plotTop - plotBottom)) * this.canvas.height };

                var x = dataSet.time;
                var n = x.length;

                var ctx = this.context;

                dataSet.series.forEach(function (seria) {
                    //setup appearance 
                    ctx.strokeStyle = seria.appearanceSettings.stroke;
                    ctx.lineWidth = seria.appearanceSettings.thickness;

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

            public drawAxis(screenLeft: number, ymin: number, ymax: number, appearence: any): void {
                var ticks = this.calculateTicks(ymin, ymax, appearence.labelCount);
                var dataToScreenY = (y) => { return (1 - (y - ymin) / (ymax - ymin)) * this.canvas.height };

                var ctx = this.context;
                ctx.font = appearence.font;
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = appearence.stroke;
                ctx.fillStyle = appearence.stroke;
                ctx.lineWidth = appearence.majorTickThickness;
                var ticklength = appearence.tickLength;
                var textOffset = 2;

                if (appearence.axisLocation == "right") {
                    ticklength = -ticklength;
                    textOffset = -textOffset;
                }

                ctx.textAlign = appearence.axisLocation;

                ticks.forEach(function (tick) {
                    var y = dataToScreenY(tick);
                    ctx.beginPath();
                    ctx.moveTo(screenLeft, y);
                    ctx.lineTo(screenLeft + ticklength, y);
                    ctx.stroke();

                    ctx.fillText(tick, screenLeft + ticklength + textOffset, y);
                });

            }
        }
    }
}