var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var FormTest = (function (_super) {
    __extends(FormTest, _super);
    function FormTest(container, formInfo) {
        _super.call(this, container, formInfo);

        this.testButton = container.find(formInfo.testButton);

        this.testButton.click(function (event) {
            alert("It Works!");
        });
    }
    FormTest.prototype.show = function () {
        _super.prototype.show.call(this);

        this.activationSource.addClass("activeButton");
    };

    FormTest.prototype.close = function () {
        _super.prototype.close.call(this);

        this.activationSource.removeClass("activeButton");
    };
    return FormTest;
})(CZ.UI.FormBase);
