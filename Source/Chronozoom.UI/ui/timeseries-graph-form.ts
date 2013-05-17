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

                this.graph = new Dygraph(
                    document.getElementById("dygraph"),
                       "Date,Temperature\n" +
                        "2008-05-07,75\n" +
                        "2008-05-08,70\n" +
                        "2008-05-09,80\n",
                        { drawXAxis: false });

            }
        }
    }
}