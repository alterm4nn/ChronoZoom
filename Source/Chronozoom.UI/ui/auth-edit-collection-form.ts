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
            kioskmodeInput: JQuery;
            collectionTheme: CZ.Settings.ICollectionTheme;
            mediaListContainer: string;

            timelineBackgroundColorInput: JQuery;
            timelineBackgroundOpacityInput: JQuery;
            timelineBorderColorInput: JQuery;

            exhibitBackgroundColorInput: JQuery;
            exhibitBackgroundOpacityInput: JQuery;
            exhibitBorderColorInput: JQuery;

            chkEditors: string;
            btnEditors: string;
        }

        export class FormEditCollection extends CZ.UI.FormUpdateEntity {
            public saveButton: JQuery;
            private backgroundInput: JQuery;
            private kioskmodeInput: JQuery;
            public collectionTheme: CZ.Settings.ICollectionTheme;
            public activeCollectionTheme: CZ.Settings.ICollectionTheme;
			private mediaListContainer: JQuery;
            private mediaList: CZ.UI.MediaList;
            private contentItem: any = {};

            private timelineBackgroundColorInput: JQuery;
            private timelineBackgroundOpacityInput: JQuery;
            private timelineBorderColorInput: JQuery;
            private exhibitBackgroundColorInput: JQuery;
            private exhibitBackgroundOpacityInput: JQuery;
            private exhibitBorderColorInput: JQuery;

            private chkEditors: JQuery;
            private btnEditors: JQuery;

            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormEditCollectionInfo) {
                super(container, formInfo);
				
                this.saveButton = container.find(formInfo.saveButton);
                this.backgroundInput = container.find(formInfo.backgroundInput);
                this.collectionTheme = formInfo.collectionTheme;
                this.activeCollectionTheme = jQuery.extend(true, {}, formInfo.collectionTheme);
                this.mediaListContainer = container.find(formInfo.mediaListContainer);
                this.kioskmodeInput = formInfo.kioskmodeInput;
                this.chkEditors = container.find(formInfo.chkEditors);
                this.btnEditors = container.find(formInfo.btnEditors);

                this.timelineBackgroundColorInput = formInfo.timelineBackgroundColorInput;
                this.timelineBackgroundOpacityInput = formInfo.timelineBackgroundOpacityInput;
                this.timelineBorderColorInput = formInfo.timelineBorderColorInput;
                this.exhibitBackgroundColorInput = formInfo.exhibitBackgroundColorInput;
                this.exhibitBackgroundOpacityInput = formInfo.exhibitBackgroundOpacityInput;
                this.exhibitBorderColorInput = formInfo.exhibitBorderColorInput;

				this.backgroundInput.on('input', () => {
                    this.updateCollectionTheme(true);
                });

                this.kioskmodeInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.timelineBackgroundColorInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.timelineBackgroundOpacityInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.timelineBorderColorInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundColorInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundOpacityInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.exhibitBorderColorInput.change(() => {
                    this.updateCollectionTheme(true);
                });

                this.saveButton.off();

                this.backgroundInput.focus(() => {
                    this.backgroundInput.hideError();
                });

                try {
                    this.initialize();
                }
                catch (e) {
                    console.log("Error initializing collection form attributes");
                }

                this.saveButton.click(event => {
                    this.updateCollectionTheme(true);
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

            private initialize(): void {
                this.saveButton.prop('disabled', false);

                this.backgroundInput.val(this.collectionTheme.backgroundUrl);
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);
                this.kioskmodeInput.attr("checked", this.collectionTheme.kioskMode.toString());

                if (!this.collectionTheme.timelineColor) this.collectionTheme.timelineColor = CZ.Settings.timelineColorOverride;
                this.timelineBackgroundColorInput.val(this.getHexColorFromColor(this.collectionTheme.timelineColor));
                this.timelineBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.timelineColor).toString());
                this.timelineBorderColorInput.val(this.getHexColorFromColor(this.collectionTheme.timelineStrokeStyle));

                this.exhibitBackgroundColorInput.val(this.getHexColorFromColor(this.collectionTheme.infoDotFillColor));
                this.exhibitBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.infoDotFillColor).toString());
                this.exhibitBorderColorInput.val(this.getHexColorFromColor(this.collectionTheme.infoDotBorderColor));

                // TODO: populate chkEditors then call this.renderManageEditorsButton();
                this.chkEditors.click(event => { this.renderManageEditorsButton(); });
                this.btnEditors.click(event => { alert('This feature is not yet available.\nIt is currently being implemented.'); });
            }

            private colorIsRgba(color: string) {
                return color ? color.substr(0, 5) === "rgba(" : false;
            }

            private colorIsRgb(color: string) {
                return color ? color.substr(0, 4) === "rgb(" : false;
            }

            private colorIsHex(color: string) {
                return color ? color.substr(0, 1) === "#" && color.length >= 7 : false;
            }

            private rgbaFromColor(color: string, alpha: number) {
                if (!color)
                    return color;

                if (this.colorIsRgba(color)) {
                    var parts = color.substr(5, color.length - 5 - 1).split(",");
                    if (parts.length > 3)
                        parts[parts.length - 1] = alpha.toString();
                    else
                        parts.push(alpha.toString());
                    return "rgba(" + parts.join(",") + ")";
                }

                var red = parseInt("0x" + color.substr(1, 2));
                var green = parseInt("0x" + color.substr(3, 2));
                var blue = parseInt("0x" + color.substr(5, 2));

                return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
            }

            private getOpacityFromRGBA(rgba: string): number {
                if (!rgba) return null;
                if (!this.colorIsRgba(rgba)) return 1.0;

                var parts = rgba.split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return parseFloat(lastPart);
            }

            private getHexColorFromColor(color: string): string {
                if (this.colorIsHex(color))
                    return color;

                if (!this.colorIsRgb(color) && !this.colorIsRgba(color))
                    return null;

                var offset = this.colorIsRgb(color) ? 4 : 5;
                var parts = color.substr(offset, color.length - offset - 1).split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return "#" + this.colorHexFromInt(parts[0]) + this.colorHexFromInt(parts[1]) + this.colorHexFromInt(parts[2]);
            }

            private colorHexFromInt(colorpart: string): string {
                var hex: string = Number(colorpart).toString(16);
                if (hex.length === 1)
                    return "0" + hex;

                return hex;
            }

            private renderManageEditorsButton(): void {
                if (this.chkEditors.prop('checked')) {
                    this.btnEditors.slideDown('fast');
                }
                else {
                    this.btnEditors.slideUp(  'fast');
                }
            }

            private updateCollectionTheme(clearError: boolean) {
                this.collectionTheme = {
                    backgroundUrl: this.backgroundInput.val(),
                    backgroundColor: "#232323",
                    
                    timelineColor: this.rgbaFromColor(this.timelineBackgroundColorInput.val(), this.timelineBackgroundOpacityInput.val()),
                    timelineStrokeStyle: this.timelineBorderColorInput.val(),

                    infoDotFillColor: this.rgbaFromColor(this.exhibitBackgroundColorInput.val(), this.exhibitBackgroundOpacityInput.val()),
                    infoDotBorderColor: this.exhibitBorderColorInput.val(),

                    kioskMode: this.kioskmodeInput.prop("checked")
                };

                // If the input holds an rgba color, update the textbox with new alpha value
                if (this.colorIsRgb(this.timelineBackgroundColorInput.val())) {
                    this.timelineBackgroundColorInput.val(this.collectionTheme.timelineColor);
                    this.exhibitBackgroundColorInput.val(this.collectionTheme.infoDotFillColor);
                }

                if (clearError)
                    this.backgroundInput.hideError();

                this.updateCollectionThemeFromTheme(this.collectionTheme);
            }

            private updateCollectionThemeFromTheme(theme: CZ.Settings.ICollectionTheme) {
                CZ.Settings.applyTheme(theme, false);

                CZ.Common.vc.virtualCanvas("forEachElement", (element) => {
                    if (element.type === "timeline") {
                        element.settings.fillStyle = theme.timelineColor;
                        element.settings.strokeStyle = theme.timelineStrokeStyle;
                        element.settings.gradientFillStyle = theme.timelineStrokeStyle;
                    } else if (element.type === "infodot") {
                        element.settings.fillStyle = theme.infoDotFillColor;
                        element.settings.strokeStyle = theme.infoDotBorderColor;
                    }
                });

                CZ.Common.vc.virtualCanvas("requestInvalidate");
            }

            public updateMediaInfo() {
                var clearError: boolean = true;

                // Using tempSource is less than ideal; however, SkyDrive does not support any permanent link to the file and therefore we will warn users. Future: Create an image cache in the server.
                if (this.contentItem.mediaType == "skydrive-image") {
                    this.backgroundInput.val(this.contentItem.tempSource || "");
                    clearError = false;
                    this.backgroundInput.showError("SkyDrive static links are not permanent. Consider hosting it as a public image instead.");
                }
                else {
                    this.backgroundInput.val(this.contentItem.uri || "");
                }

                this.updateCollectionTheme(clearError);
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

                this.backgroundInput.hideError();
                this.updateCollectionThemeFromTheme(this.activeCollectionTheme);
            }
        }
    }
}