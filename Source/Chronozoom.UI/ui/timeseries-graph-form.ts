/// <reference path='controls/formbase.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

interface TimeSeriesFormInfo extends CZ.UI.IFormBaseInfo {
}

class TimeSeriesForm extends CZ.UI.FormBase {
    // We only need to add additional initialization in constructor.
    constructor(container: JQuery, formInfo: TimeSeriesFormInfo) {
        super(container, formInfo);
    }
}