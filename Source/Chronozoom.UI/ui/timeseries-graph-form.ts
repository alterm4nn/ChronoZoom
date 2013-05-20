/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

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

            private xRight: number;
            private xLeft: number;


            constructor(container: JQuery) {
                this.canvas = <HTMLCanvasElement>document.createElement("canvas");
                $(this.canvas).appendTo($("#timeSeries"));

                this.canvas.width = container.width();
                this.canvas.height = container.height();

                this.context = this.canvas.getContext("2d"); 

                this.xLeft = 0;
                this.xRight = this.canvas.width;
            }

            public updateLayout(left: number, right: number): void {
            }

            public updateRange(xLeft: number, xRight: number): void {
                this.xLeft = xLeft;
                this.xRight = xRight;
                this.render();
            }

            private render(): void {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.context.fillStyle = "gray";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.context.fillStyle = "white";
                this.context.fillRect(this.xLeft, 0, this.xRight - this.xLeft, this.canvas.height);
            }
        }
    }
}