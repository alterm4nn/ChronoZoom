/// <reference path='contentitem-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts' />
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormEditExhibitInfo extends IFormUpdateEntityInfo {
            titleTextblock: string;
            titleInput: string;
            datePicker: string;
            createArtifactButton: string;
            contentItemsListBox: string;
            errorMessage: string;
            deleteButton: string;
            contentItemsTemplate: JQuery;
            context: Object;
        }

        export class FormEditExhibit extends FormUpdateEntity {
            private titleTextblock: JQuery;
            private titleInput: JQuery;
            private datePicker: DatePicker;
            private createArtifactButton: JQuery;
            public contentItemsListBox: ContentItemListBox;
            private errorMessage: JQuery;
            private saveButton: JQuery;
            private deleteButton: JQuery;

            private contentItemsTemplate: JQuery;

            public exhibit: any; // CanvasInfodot
            private exhibitCopy: any;

            private mode; // create | edit
            private isCancel: bool; // is form closed without saving changes
            public isModified: bool;

            public clickedListItem: ContentItemListItem; // the contentitem on which the user dbl clicked

            constructor(container: JQuery, formInfo: IFormEditExhibitInfo) {
                super(container, formInfo);

                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, (<any>formInfo.context).contentItems);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);

                this.titleInput.focus(() => {
                    this.titleInput.hideError();
                });

                this.contentItemsTemplate = formInfo.contentItemsTemplate;

                this.exhibit = formInfo.context;
                this.exhibitCopy = $.extend({}, formInfo.context, { children: null }); // shallow copy of exhibit (without children)
                this.exhibitCopy = $.extend(true, {}, this.exhibitCopy); // deep copy of exhibit
                delete this.exhibitCopy.children;

                this.mode = CZ.Authoring.mode; // deep copy mode. it never changes throughout the lifecycle of the form.
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }

            private initUI() {
                this.saveButton.prop('disabled', false);

                this.titleInput.change(() => { this.isModified = true; });
                this.datePicker.datePicker.change(() => { this.isModified = true; });

                if (this.mode === "createExhibit") {
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("create exhibit");

                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);
                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.hide();

                    // this.closeButton.click() is handled by base
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(() => this.onCreateArtifact());
                    this.saveButton.off();
                    this.saveButton.click(() => this.onSave());

                    this.contentItemsListBox.itemDblClick((item, index) => this.onContentItemDblClick(item, index));
                    this.contentItemsListBox.itemRemove((item, index) => this.onContentItemRemoved(item, index));
                    this.contentItemsListBox.itemMove((item, indexStart, indexStop) => this.onContentItemMove(item, indexStart, indexStop));

                } else if (this.mode === "editExhibit") {
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("update exhibit");

                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);

                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.show();

                    // this.closeButton.click() is handled by base
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(() => this.onCreateArtifact());
                    this.saveButton.off();
                    this.saveButton.click(() => this.onSave());
                    this.deleteButton.off();
                    this.deleteButton.click(() => this.onDelete());

                    this.contentItemsListBox.itemDblClick((item, index) => this.onContentItemDblClick(item, index));
                    this.contentItemsListBox.itemRemove((item, index) => this.onContentItemRemoved(item, index));
                    this.contentItemsListBox.itemMove((item, indexStart, indexStop) => this.onContentItemMove(item, indexStart, indexStop));

                } else {
                    console.log("Unexpected authoring mode in exhibit form.");
                }
            }

            private onCreateArtifact() {
                this.isModified = true;
                if (this.exhibit.contentItems.length < CZ.Settings.infodotMaxContentItemsCount) {
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = { date: this.datePicker.getDate() };
                    var newContentItem = {
                        title: "",
                        uri: "",
                        mediaSource: "",
                        mediaType: "",
                        attribution: "",
                        description: "",
                        order: this.exhibit.contentItems.length
                    };
                    this.exhibit.contentItems.push(newContentItem);
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "createContentItem";
                    CZ.Authoring.showEditContentItemForm(newContentItem, this.exhibit, this, true);
                }
                else {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage
                        .text("Sorry, only 10 artifacts are allowed in one exhibit")
                        .show()
                        .delay(7000)
                        .fadeOut(() => self.errorMessage.text(origMsg));
                }
            }

            private onSave() {                
                var exhibit_x = this.datePicker.getDate() - this.exhibit.width / 2;
                var exhibit_y = this.exhibit.y;

                if (exhibit_x + this.exhibit.width >= this.exhibit.parent.x + this.exhibit.parent.width) {
                    exhibit_x = this.exhibit.parent.x + this.exhibit.parent.width - this.exhibit.width;
                }
                if (exhibit_x <= this.exhibit.parent.x) {
                    exhibit_x = this.exhibit.parent.x;
                }

                if (exhibit_y + this.exhibit.height >= this.exhibit.parent.y + this.exhibit.parent.height) {
                    exhibit_y = this.exhibit.parent.y + this.exhibit.parent.height - this.exhibit.height;
                }
                if (exhibit_y <= this.exhibit.parent.y) {
                    exhibit_y = this.exhibit.parent.y;
                }

               var newExhibit = {
                    title: this.titleInput.val() || "",
                    x: exhibit_x,
                    y: exhibit_y,
                    height: this.exhibit.height,
                    width: this.exhibit.width,
                    infodotDescription: { date: CZ.Dates.getDecimalYearFromCoordinate(this.datePicker.getDate()) },
                    contentItems: this.exhibit.contentItems || [],
                    type: "infodot"
                };

                if (!CZ.Authoring.isNotEmpty(this.titleInput.val())) {
                    this.titleInput.showError("Title can't be empty");
                }

                if (CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true)) {
                    this.errorMessage.text("Exhibit intersects other elemenets");
                }

                if (CZ.Authoring.validateExhibitData(this.datePicker.getDate(), this.titleInput.val(), this.exhibit.contentItems) &&
                    CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true) &&
                    this.exhibit.contentItems.length >= 1 && this.exhibit.contentItems.length <= CZ.Settings.infodotMaxContentItemsCount) {

                    this.saveButton.prop('disabled', true);
                    CZ.Authoring.updateExhibit(this.exhibitCopy, newExhibit).then(
                        success => {
                            this.isCancel = false;
                            this.isModified = false;
                            this.close();

                            this.exhibit.id = arguments[0].id;

                            this.exhibit.onmouseclick();

                        },
                        error => {
                            var errorMessage = JSON.parse(error.responseText).errorMessage;

                            if (errorMessage !== "") {
                                this.errorMessage.text(errorMessage);
                            }
                            else {
                                this.errorMessage.text("Sorry, internal server error :(")
                            }

                            this.errorMessage.show().delay(7000).fadeOut();
                        }
                    ).always(() => {
                        this.saveButton.prop('disabled', false);
                    });
                } else if (this.exhibit.contentItems.length === 0) {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage
                        .text("Cannot create exhibit without artifacts.")
                        .show()
                        .delay(7000)
                        .fadeOut(() => self.errorMessage.text(origMsg));
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            }

            private onDelete() {
                if (confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                    CZ.Authoring.removeExhibit(this.exhibit);
                    this.isCancel = false;
                    this.isModified = false;
                    this.close();
                }
                
            }

            private onContentItemDblClick(item: ListItemBase, _: number) {
                var idx;
                if (typeof item.data.order !== 'undefined' && item.data.order !== null
                    && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if (typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) { return ci.guid; }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }

                if (idx >= 0) {
                    this.clickedListItem = <ContentItemListItem>item;
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = { date: this.datePicker.getDate() };
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "editContentItem";
                    CZ.Authoring.showEditContentItemForm(this.exhibit.contentItems[idx], this.exhibit, this, true);
                }
            }

            private onContentItemRemoved(item: ListItemBase, _: number) {
                var idx;
                this.isModified = true;
                if (typeof item.data.order !== 'undefined' && item.data.order !== null
                    && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if (typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) { return ci.guid; }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }

                if (idx >= 0) {
                    this.exhibit.contentItems.splice(idx, 1);
                    for (var i = 0; i < this.exhibit.contentItems.length; i++) this.exhibit.contentItems[i].order = i;
                    this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            }

            public onContentItemMove(item: ListItemBase, indexStart: number, indexStop: number) {
                this.isModified = true;
                var ci = this.exhibit.contentItems.splice(indexStart, 1)[0];
                this.exhibit.contentItems.splice(indexStop, 0, ci);
                for (var i = 0; i < this.exhibit.contentItems.length; i++) this.exhibit.contentItems[i].order = i;
                this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                CZ.Common.vc.virtualCanvas("requestInvalidate");
            }

            public show(noAnimation?: bool = false) {
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                super.show(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            }

            public hide(noAnimation?: bool = false) {
                super.close(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            }

            public close(noAnimation?: bool = false) {
                if (this.isModified) {
                    if (window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    }
                    else {
                        return;
                    }                   
                }

                super.close(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        this.datePicker.remove();
                        this.contentItemsListBox.clear();
                        this.titleInput.hideError();
                    }
                });
                if (this.isCancel) {
                    if (this.mode === "createExhibit") {
                        CZ.VCContent.removeChild(this.exhibit.parent, this.exhibit.id);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    } else if (this.mode === "editExhibit") {
                        delete this.exhibit.contentItems;
                        $.extend(this.exhibit, this.exhibitCopy);
                        this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            }
        }
    }
}
