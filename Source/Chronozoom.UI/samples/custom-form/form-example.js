/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var FormTest = (function (_super) {
    __extends(FormTest, _super);
    // We only need to add additional initialization in constructor.
    function FormTest(container, formInfo) {
        _super.call(this, container, formInfo);

        this.testButton = container.find(formInfo.testButton);

        this.testButton.click(function (event) {
            alert("It Works!");
        });
    }
    FormTest.prototype.show = function () {
        _super.prototype.show.call(this);

        // Just an example how to highligh pressed "Show Form" button.
        // Ideally, it would be better to not place UI selectors in form code,
        // but pass them through parameters.
        this.activationSource.addClass("activeButton");
    };

    FormTest.prototype.close = function () {
        _super.prototype.close.call(this);

        this.activationSource.removeClass("activeButton");
    };
    return FormTest;
})(CZ.UI.FormBase);
