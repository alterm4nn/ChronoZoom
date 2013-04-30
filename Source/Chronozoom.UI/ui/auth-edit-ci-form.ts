/// <reference path='../NewScripts/controls/formbase.ts'/>
/// <reference path='../NewScripts/authoring.ts'/>

/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface FormEditCIInfo extends CZ.UI.FormBaseInfo {
            saveButton: string;
            titleInput: string;
            mediaSourceInput: string;
            mediaInput: string;
            descriptionInput: string;
            attributionInput: string;
            mediaTypeInput: string;
            context: {
                exhibit: Object;
                contentItem: Object;
            };
        }

        export class FormEditCI extends CZ.UI.FormBase {

            private saveButton: JQuery;
            private titleInput: JQuery;
            private mediaSourceInput: JQuery;
            private mediaInput: JQuery;
            private descriptionInput: JQuery;
            private attributionInput: JQuery;
            private mediaTypeInput: JQuery;   
            private contentItem: any;
            private exhibit: any;
            private isCancel: bool;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: FormEditCIInfo) {
                super(container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.titleInput = container.find(formInfo.titleInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
 
                this.contentItem = formInfo.context.contentItem;
                this.exhibit = formInfo.context.exhibit; 
                this.saveButton.off();
                this.initialize();
            }

            private initialize(): void {
                if ((CZ.Authoring.mode === "editExhibit") || (CZ.Authoring.mode === "createExhibit")) {
                    this.titleTextblock.text("Edit Artifact");
                    this.saveButton.text("edit artifact");
                }
                else {
                    console.log("Unexpected authoring mode in CI form.");
                    this.close();
                }
                this.isCancel = true;
                if (CZ.Authoring.CImode == "editCI") {
                    var c = this.contentItem;
                    this.titleInput.val(c.contentItem.title);
                    this.descriptionInput.val(c.contentItem.description);
                    this.attributionInput.val(c.attribution);
                    this.mediaSourceInput.val(c.contentItem.mediaSource);
                    this.mediaInput.val(c.contentItem.uri);
                    var mediaType = c.contentItem.mediaType;
                    if (mediaType === "Picture") {
                        mediaType = "image";
                    }
                    var med_opt = (<any>$)(this.mediaTypeInput[0]).find(".option");
                    
                    var selected = med_opt.context[0].selected;
                    for (var i = 0; i < med_opt.context.length; i++) {
                         if (med_opt.context[i].text === mediaType) {
                            med_opt.context[i].selected = true;
                        }
                    }
                }
                   //something with media type
                this.saveButton.click(event => {
                    var med_opt = (<any>$)(this.mediaTypeInput[0]).find(".option");
                    var selected = med_opt.context[0].selected;
                    for (var i = 0; i < med_opt.context.length; i++)
                        if (med_opt.context[i].selected) {
                            selected = med_opt.context[i];
                            break;
                        }
                    if (CZ.Authoring.CImode == "editCI") {
                        CZ.Authoring.updateContentItem(this.contentItem, {
                            title: this.titleInput.val(),
                            uri: this.mediaInput.val(),
                            mediaType: selected.text,
                            description: this.descriptionInput.val(),
                            attribution: this.attributionInput.val(),
                            mediaSource: this.mediaSourceInput.val(),
                        });
                     }

                    if (CZ.Authoring.CImode == "createCI") {
                        this.exhibit.contentItems.push({
                            title: this.titleInput.val(),
                            uri: this.mediaInput.val(),
                            mediaType: selected.text,
                            description: this.descriptionInput.val(),
                            attribution: this.attributionInput.val(),
                            mediaSource: this.mediaSourceInput.val(),
                            guid: undefined,//guid,
                            parent: undefined
                        });
                         this.close();
                    }
                    this.close();
                });
            }

            public show(): void {
                super.show({
                    effect: "slide", 
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("activeButton");
            }

            public close() {
                super.close({
                    effect: "slide", 
                    direction: "left",
                    duration: 500
                });

                CZ.Authoring.isActive = false;

                this.activationSource.removeClass("activeButton");
                this.container.find("#error-edit-CI").hide();
            }
        }
    }
}