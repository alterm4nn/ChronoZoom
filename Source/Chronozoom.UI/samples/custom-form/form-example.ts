/// <reference path='../../ui/controls/formbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

interface FormTestInfo extends CZ.UI.IFormBaseInfo {
    testButton: string;
}

class FormTest extends CZ.UI.FormBase {
    private testButton: JQuery;

    // We only need to add additional initialization in constructor.
    constructor(container: JQuery, formInfo: FormTestInfo) {
        super(container, formInfo);

        this.testButton = container.find(formInfo.testButton);

        this.testButton.click(event => {
            alert("It Works!");
        });
    }

    public show(): void {
        super.show();

        // Just an example how to highligh pressed "Show Form" button.
        // Ideally, it would be better to not place UI selectors in form code,
        // but pass them through parameters.
        this.activationSource.addClass("activeButton");
    }

    public close(): void {
        super.close();

        this.activationSource.removeClass("activeButton");
    }
}