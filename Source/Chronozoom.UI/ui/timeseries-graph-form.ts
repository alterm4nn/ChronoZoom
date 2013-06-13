/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/data.ts'/>
/// <reference path='../scripts/cz.ts'/>

module CZ {
    export module UI {
         
        export class LineChart {

            private canvas: any;
            private context: any;
            private container: any;

            constructor(container: JQuery) {
                this.container = container;

                this.canvas = <HTMLCanvasElement>document.createElement("canvas");
                $(this.canvas).prependTo($("#timeSeries"));

                this.canvas.width = container.width();
                this.canvas.height = container.height();

                this.context = this.canvas.getContext("2d");

                $("#closeTimeChartBtn").click(function () {
                    CZ.HomePageViewModel.hideTimeSeriesChart();
                });
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

                var ticks = [];
                for (var i = imin; i <= imax; i++)
                    ticks.push(i * k * h10);

                var result: any = {};
                result.ticks = ticks;
                result.h = h;
                result.h10 = h10;

                return result;
            }

            public generateAxisParameters(ymin: number, ymax: number, labelCount: number): any {
                var ticks = this.calculateTicks(ymin, ymax, labelCount);

                return null;
            }

            public clear(screenLeft: number, screenRight: number): void {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.context.fillStyle = "white";
                this.context.fillRect(screenLeft, 0, screenRight - screenLeft, this.canvas.height);

                var maxLegendWidth = Math.max(24, (screenRight - screenLeft) / 2 - 60);

                $("#rightLegend").css("right", $("#timeSeries").width() - screenRight + 30);
                $("#rightLegend").css("max-width", maxLegendWidth + "px");

                $("#leftLegend").css("left", screenLeft + 30);
                $("#leftLegend").css("max-width", maxLegendWidth + "px");
                
                $("#timeSeriesChartHeader").text("TimeSeries Chart");
            }

            public drawDataSet(dataSet: CZ.Data.DataSet, screenLeft: number, screenRight: number, verticalPadding: number, plotLeft: number, plotRight: number): void {
                var that = this;
                var plotBottom = Number.MAX_VALUE;
                var plotTop = Number.MIN_VALUE;

                dataSet.series.forEach(function (seria) {
                    if (seria.appearanceSettings && seria.appearanceSettings.yMin && seria.appearanceSettings.yMin < plotBottom) {
                        plotBottom = seria.appearanceSettings.yMin;
                    }

                    if (seria.appearanceSettings && seria.appearanceSettings.yMax && seria.appearanceSettings.yMax > plotTop) {
                        plotTop = seria.appearanceSettings.yMax;
                    }

                    if (seria.appearanceSettings && seria.appearanceSettings.thickness && seria.appearanceSettings.thickness > verticalPadding) {
                        verticalPadding = seria.appearanceSettings.thickness;
                    }
                });

                if ((plotTop - plotBottom) === 0) {
                    var absY = Math.max(0.1, Math.abs(plotBottom));
                    var offsetConstant = 0.01;
                    plotTop += absY * offsetConstant;
                    plotBottom -= absY * offsetConstant;
                }

                var screenHeight = this.canvas.height - 2 * verticalPadding;

                var dataToScreenX = (x) => { return (x - plotLeft) / (plotRight - plotLeft) * (screenRight - screenLeft) + screenLeft; };
                var dataToScreenY = (y) => { return verticalPadding + screenHeight * (plotTop - y) / (plotTop - plotBottom) };

                var x = dataSet.time;
                var n = x.length;

                var context = this.context;
                // size of the canvas
                var xmin = screenLeft, xmax = screenRight;
                var ymin = 0, ymax = this.canvas.height;

                dataSet.series.forEach(function (seria) {
                    //setup appearance 
                    context.strokeStyle = seria.appearanceSettings.stroke;
                    context.lineWidth = seria.appearanceSettings.thickness;
                    //ctx.lineCap = 'round';

                    //drawing line
                    var y = seria.values;

                    context.beginPath();
                    var x1, x2, y1, y2;
                    var i = 0;

                    // Looking for non-missing value
                    var nextValuePoint = function () {
                        for (; i < n; i++) {
                            if (isNaN(x[i]) || isNaN(y[i])) continue; // missing value
                            x1 = dataToScreenX(x[i]);
                            y1 = dataToScreenY(y[i]);
                            c1 = that.code(x1, y1, xmin, xmax, ymin, ymax);
                            break;
                        }
                        if (c1 == 0) // point is inside visible rect 
                            context.moveTo(x1, y1);
                    };
                    nextValuePoint();

                    var c1, c2, c1_, c2_;
                    var dx, dy;
                    var x2_, y2_;
                    var m = 1; // number of points for the current batch
                    for (i++; i < n; i++) {
                        if (isNaN(x[i]) || isNaN(y[i])) // missing value
                        {
                            if (m == 1) { // single point surrounded by missing values
                                context.stroke(); // finishing previous segment (it is broken by missing value)
                                var c = that.code(x1, y1, xmin, xmax, ymin, ymax);
                                if (c == 0) {
                                    context.beginPath();
                                    context.arc(x1, y1, seria.appearanceSettings.thickness / 2, 0, 2 * Math.PI);
                                    context.fill();
                                }
                            } else {
                                context.stroke(); // finishing previous segment (it is broken by missing value)
                            }
                            context.beginPath();
                            i++;
                            nextValuePoint();
                            m = 1;
                            continue;
                        }

                        x2_ = x2 = dataToScreenX(x[i]);
                        y2_ = y2 = dataToScreenY(y[i]);
                        if (Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1) continue;

                        // Clipping and drawing segment p1 - p2:
                        c1_ = c1;
                        c2_ = c2 = that.code(x2, y2, xmin, xmax, ymin, ymax);

                        while (c1 | c2) {
                            if (c1 & c2) break; // segment is invisible
                            dx = x2 - x1;
                            dy = y2 - y1;
                            if (c1) {
                                if (x1 < xmin) { y1 += dy * (xmin - x1) / dx; x1 = xmin; }
                                else if (x1 > xmax) { y1 += dy * (xmax - x1) / dx; x1 = xmax; }
                                else if (y1 < ymin) { x1 += dx * (ymin - y1) / dy; y1 = ymin; }
                                else if (y1 > ymax) { x1 += dx * (ymax - y1) / dy; y1 = ymax; }
                                c1 = that.code(x1, y1, xmin, xmax, ymin, ymax);
                            } else {
                                if (x2 < xmin) { y2 += dy * (xmin - x2) / dx; x2 = xmin; }
                                else if (x2 > xmax) { y2 += dy * (xmax - x2) / dx; x2 = xmax; }
                                else if (y2 < ymin) { x2 += dx * (ymin - y2) / dy; y2 = ymin; }
                                else if (y2 > ymax) { x2 += dx * (ymax - y2) / dy; y2 = ymax; }
                                c2 = that.code(x2, y2, xmin, xmax, ymin, ymax);
                            }
                        }
                        if (!(c1 & c2)) {
                            if (c1_ != 0) // point wasn't visible
                                context.moveTo(x1, y1);
                            context.lineTo(x2, y2);
                            m++;
                        }

                        x1 = x2_;
                        y1 = y2_;
                        c1 = c2_;
                    }

                    // Final stroke
                    if (m == 1) { // single point surrounded by missing values
                        context.stroke(); // finishing previous segment (it is broken by missing value)
                        var c = that.code(x1, y1, xmin, xmax, ymin, ymax);
                        if (c == 0) {
                            context.beginPath();
                            context.arc(x1, y1, seria.appearanceSettings.thickness / 2, 0, 2 * Math.PI);
                            context.fill();
                        }
                    } else {
                        context.stroke(); // finishing previous segment (it is broken by missing value)
                    }
                });


            }

            // Clipping algorithms
            private code(x: any, y: any, xmin: any, xmax: any, ymin: any, ymax: any): number {
                var a = x < xmin ? 1 : 0;
                var b = x > xmax ? 1 : 0;
                var c = y < ymin ? 1 : 0;
                var d = y > ymax ? 1 : 0;
                return a << 3 | b << 2 | c << 1 | d;
            };

            public drawAxis(tickOrigin: number, secondScreenBorder: number, ymin: number, ymax: number, appearence: any): void {
                var verticalPadding = appearence.verticalPadding ? appearence.verticalPadding : 0;
                var screenHeight = this.canvas.height - 2 * verticalPadding;

                var dataToScreenY = (y) => { return verticalPadding + screenHeight * (ymax - y) / (ymax - ymin); };
                var plotToScreenY = (top) => { return (ymax - ymin) * (1 - ((top - verticalPadding) / screenHeight)) + ymin; };

                var ticks = this.calculateTicks(plotToScreenY(this.canvas.height), plotToScreenY(0), appearence.labelCount).ticks;

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
                    ctx.strokeStyle = appearence.stroke;
                    ctx.beginPath();
                    ctx.moveTo(tickOrigin, y);
                    ctx.lineTo(tickOrigin + ticklength, y);
                    ctx.stroke();


                    ctx.fillText(tick, tickOrigin + ticklength + textOffset, y);

                    ctx.strokeStyle = 'lightgray';
                    //drawing gridline
                    var textWidth = ctx.measureText(tick).width;
                    if (appearence.axisLocation == "right") {
                        textWidth = -textWidth;
                    }
                    var offset = ticklength + textWidth + 2 * textOffset;
                    ctx.beginPath();
                    ctx.moveTo(tickOrigin + offset, y);
                    ctx.lineTo(secondScreenBorder, y);
                    ctx.stroke();
                });
            }

            public drawVerticalGridLines(screenLeft: number, screenRight: number, plotLeft: number, plotRight: number): void {
                var ctx = this.context;
                var verticalTicks: any = CZ.Common.axis.ticksInfo;
                var height = this.canvas.height;
                ctx.strokeStyle = 'lightgray';
                verticalTicks.forEach(function (tick) {
                    var coord = tick.position;
                    ctx.beginPath();
                    ctx.moveTo(coord, 0);
                    ctx.lineTo(coord, height);
                    ctx.stroke();
                });
            }

            public updateCanvasHeight(): void {
                $("#timeSeries").height($("#timeSeriesContainer").height() - 36);
                this.canvas.height = $("#timeSeries").height();
                this.canvas.width = $("#timeSeries").width();
            }

            public clearLegend(location: string): void {
                var legend = location === "left" ? $("#leftLegendList") : $("#rightLegendList");
                legend.empty();
                legend.hide();
            }

            public addLegendRecord(location: string, stroke: any, description: string): void {
                var legend = location === "left" ? $("#leftLegendList") : $("#rightLegendList");
                var legendCont = location === "left" ? $("#leftLegend") : $("#rightLegend");

                legend.show();
                var cont = $('<li></li>');
                var strokeIndicatior = $('<div></div>').addClass("tsc-legend-indicator");
                strokeIndicatior.css("background-color", stroke);

                var descriptionDiv = $('<div></div>').addClass("tsc-legend-description");
                descriptionDiv.css("max-width", parseFloat(legendCont.css("max-width")) - 24);
                descriptionDiv.text(description);

                strokeIndicatior.appendTo(cont);
                descriptionDiv.appendTo(cont);
                cont.height(24).appendTo(legend);
            }
        }
    }
}