/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/settings.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/media.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>

module CZ {
    export module UI {
        export interface IFormEditCollectionInfo extends CZ.UI.IFormUpdateEntityInfo {
			backgroundInput: JQuery;
            collectionTheme: CZ.Settings.ICollectionTheme;
			mediaListContainer: string;
        }

        export class FormEditCollection extends CZ.UI.FormUpdateEntity {
            public saveButton: JQuery;
            private backgroundInput: JQuery;
            public collectionTheme: CZ.Settings.ICollectionTheme;
            public activeCollectionTheme: CZ.Settings.ICollectionTheme;
			private mediaListContainer: JQuery;
            private mediaList: CZ.UI.MediaList;
            private contentItem: any = {};

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormEditCollectionInfo) {
                super(container, formInfo);
				
                this.saveButton = container.find(formInfo.saveButton);
                this.backgroundInput = container.find(formInfo.backgroundInput);
                this.collectionTheme = formInfo.collectionTheme;
                this.activeCollectionTheme = formInfo.collectionTheme;
				this.mediaListContainer = container.find(formInfo.mediaListContainer);

				this.backgroundInput.on('input', () => {
                    this.updateCollectionTheme();
				});

                this.saveButton.off();

                this.backgroundInput.focus(() => {
                    this.backgroundInput.hideError();
                });

                this.initialize();
            }

            private initialize(): void {
                this.saveButton.prop('disabled', false);

                this.backgroundInput.val(this.collectionTheme.backgroundUrl);
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);

                this.saveButton.click(event => {
                    this.updateCollectionTheme();
                    this.activeCollectionTheme = this.collectionTheme;

                    var themeData = {
                        theme: JSON.stringify(this.collectionTheme)
                    };

                    CZ.Service.putCollection(CZ.Service.superCollectionName, CZ.Service.collectionName, themeData).always(() => {
						this.saveButton.prop('disabled', false);
						this.close();
					})
                });
            }

            private updateCollectionTheme() {
                this.collectionTheme.backgroundUrl = this.backgroundInput.val();

                CZ.Settings.applyTheme(this.collectionTheme, false);
            }

            public updateMediaInfo() {
                this.backgroundInput.val(this.contentItem.uri || "");
                this.updateCollectionTheme();
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                        this.backgroundInput.hideError();
						this.mediaList.remove();
                    }
                });

                CZ.Settings.applyTheme(this.activeCollectionTheme, false);
            }
        }
    }
}