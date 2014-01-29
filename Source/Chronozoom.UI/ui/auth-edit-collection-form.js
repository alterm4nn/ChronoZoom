var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditCollection = (function (_super) {
            __extends(FormEditCollection, _super);
            function FormEditCollection(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);
                this.contentItem = {};

                this.saveButton = container.find(formInfo.saveButton);
                this.backgroundInput = container.find(formInfo.backgroundInput);
                this.collectionTheme = formInfo.collectionTheme;
                this.activeCollectionTheme = formInfo.collectionTheme;
                this.mediaListContainer = container.find(formInfo.mediaListContainer);

                this.backgroundInput.on('input', function () {
                    _this.updateCollectionTheme();
                });

                this.saveButton.off();

                this.backgroundInput.focus(function () {
                    _this.backgroundInput.hideError();
                });

                this.initialize();
            }
            FormEditCollection.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);

                this.backgroundInput.val(this.collectionTheme.backgroundUrl);
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);

                this.saveButton.click(function (event) {
                    _this.updateCollectionTheme();
                    _this.activeCollectionTheme = _this.collectionTheme;

                    var themeData = {
                        theme: JSON.stringify(_this.collectionTheme)
                    };

                    CZ.Service.putCollection(CZ.Service.superCollectionName, CZ.Service.collectionName, themeData).always(function () {
                        _this.saveButton.prop('disabled', false);
                        _this.close();
                    });
                });
            };

            FormEditCollection.prototype.updateCollectionTheme = function () {
                this.collectionTheme.backgroundUrl = this.backgroundInput.val();

                CZ.Settings.applyTheme(this.collectionTheme, false);
            };

            FormEditCollection.prototype.updateMediaInfo = function () {
                this.backgroundInput.val(this.contentItem.uri || "");
                this.updateCollectionTheme();
            };

            FormEditCollection.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditCollection.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.backgroundInput.hideError();
                        _this.mediaList.remove();
                    }
                });

                CZ.Settings.applyTheme(this.activeCollectionTheme, false);
            };
            return FormEditCollection;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCollection = FormEditCollection;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
