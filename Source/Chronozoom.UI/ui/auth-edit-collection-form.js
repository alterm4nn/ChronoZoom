/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/settings.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../scripts/media.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
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
            // We only need to add additional initialization in constructor.
            function FormEditCollection(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);
                this.contentItem = {};

                this.saveButton             = container.find(formInfo.saveButton);
                this.deleteButton           = container.find(formInfo.deleteButton);
                this.errorMessage           = container.find(formInfo.errorMessage);
                this.colorPickers           = container.find('input[type="color"]');
                this.rangePickers           = container.find('.cz-form-range');
                this.collectionName         = container.find(formInfo.collectionName);
                this.collectionPath         = container.find(formInfo.collectionPath);
                this.originalPath           = this.collectionPath;
                this.backgroundInput        = container.find(formInfo.backgroundInput);
                this.collectionTheme        = formInfo.collectionTheme;
                this.activeCollectionTheme  = jQuery.extend(true, {}, formInfo.collectionTheme);
                this.mediaListContainer     = container.find(formInfo.mediaListContainer);
                this.kioskmodeInput         = formInfo.kioskmodeInput;
                this.chkPublic              = container.find(formInfo.chkPublic);
                this.chkDefault             = container.find(formInfo.chkDefault);
                this.chkEditors             = container.find(formInfo.chkEditors);
                this.btnEditors             = container.find(formInfo.btnEditors);
                this.lnkUseDefaultImage     = container.find('.cz-form-default-image');

                this.timelineBackgroundColorInput = formInfo.timelineBackgroundColorInput;
                this.timelineBackgroundOpacityInput = formInfo.timelineBackgroundOpacityInput;
                this.timelineBorderColorInput = formInfo.timelineBorderColorInput;
                this.exhibitBackgroundColorInput = formInfo.exhibitBackgroundColorInput;
                this.exhibitBackgroundOpacityInput = formInfo.exhibitBackgroundOpacityInput;
                this.exhibitBorderColorInput = formInfo.exhibitBorderColorInput;

                this.collectionName.on('input change', function ()
                {
                    _this.updateCollectionPath();
                });

                this.lnkUseDefaultImage.click(function ()
                {
                    _this.backgroundInput.val('/images/background.jpg');
                    _this.updateCollectionTheme(true);
                });

                this.backgroundInput.on('input change', function () {
                    _this.updateCollectionTheme(true);
                });

                this.kioskmodeInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBackgroundColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBackgroundOpacityInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBorderColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundOpacityInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBorderColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.backgroundInput.focus(function () {
                    _this.backgroundInput.hideError();
                });

                try  {
                    this.initialize();
                } catch (e) {
                    console.log("Error initializing collection form attributes");
                }

                this.saveButton.off().click(function (event)
                {
                    _this.errorMessage.hide();

                    CZ.Service.isUniqueCollectionName(_this.collectionName.val()).done(function (isUniqueCollectionName)
                    {
                        if (!isUniqueCollectionName)
                        {
                            _this.errorMessage.html
                            (
                                "This collection name or URL has already been used. &nbsp;" +
                                "Please try a different collection name."
                            ).show();
                            return;
                        }

                        _this.updateCollectionTheme(true);
                        _this.activeCollectionTheme = _this.collectionTheme;

                        var collectionData =
                        {
                            Title:              $.trim(_this.collectionName.val()),
                            Path:               _this.collectionName.val().replace(/[^a-zA-Z0-9\-]/g, ''),
                            theme:              JSON.stringify(_this.collectionTheme),
                            PubliclySearchable: $(_this.chkPublic ).prop('checked'),
                            MembersAllowed:     $(_this.chkEditors).prop('checked'),
                            Default:            $(_this.chkDefault).prop('checked')
                        };

                        CZ.Service.putCollection(CZ.Service.superCollectionName, CZ.Service.collectionName, collectionData)
                        .done(function ()
                        {
                            _this.close();
                            if (_this.collectionPath.val() != _this.originalPath) window.location = _this.collectionPath.val();
                        })
                        .fail(function ()
                        {
                            _this.errorMessage.html('An unexpected error occured.').show();
                        });
                    });
                });

                this.deleteButton.off().click(function (event)
                {
                    _this.errorMessage.hide();

                    CZ.Service.deleteCollection().done(function (success)
                    {
                        if (success)
                        {
                            window.location =
                            (
                                window.location.protocol + '//' + window.location.host + '/' + CZ.Service.superCollectionName
                            )
                            .toLowerCase();
                        }
                        else
                        {
                            CZ.Authoring.showMessageWindow
                            (
                                "An unexpected error occured.",
                                "Unable to Delete Collection"
                            );
                        }
                    });
                });
            }
            FormEditCollection.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);

                // see http://refreshless.com/nouislider
                if (!this.rangePickers.hasClass('noUi-target'))
                {
                    this.rangePickers.noUiSlider
                    ({
                        connect:    'lower',
                        start:      0.5,
                        step:       0.05,
                        range:
                        {
                            'min':  0,
                            'max':  1
                        }
                    });
                }

                this.backgroundInput.val(this.collectionTheme.backgroundUrl);
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);
                this.kioskmodeInput.prop('checked', false);

                if (!this.collectionTheme.timelineColor) this.collectionTheme.timelineColor = CZ.Settings.timelineColorOverride;
                this.timelineBackgroundColorInput.val(this.getHexColorFromColor(this.collectionTheme.timelineColor));
                this.timelineBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.timelineColor).toString());
                this.timelineBorderColorInput.val(this.getHexColorFromColor(this.collectionTheme.timelineStrokeStyle));

                this.exhibitBackgroundColorInput.val(this.getHexColorFromColor(this.collectionTheme.infoDotFillColor));
                this.exhibitBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.infoDotFillColor).toString());
                this.exhibitBorderColorInput.val(this.getHexColorFromColor(this.collectionTheme.infoDotBorderColor));

                // see http://bgrins.github.io/spectrum
                this.colorPickers.spectrum();
                $.each(this.colorPickers, function (index, value)
                {
                    var $this = $(this);
                    $this.next().find('.sp-preview').attr('title', $this.attr('title'));
                });

                CZ.Service.getCollection().done(function (data)
                {
                    var themeFromDb = JSON.parse(data.theme);
                    if (themeFromDb == null) {
                        $(_this.kioskmodeInput).prop('checked', false);
                    } else {
                        $(_this.kioskmodeInput).prop('checked', themeFromDb.kioskMode);
                    }
                    $(_this.collectionName).val(data.Title);
                    _this.updateCollectionPath();
                    _this.originalPath = _this.collectionPath.val();
                    $(_this.chkDefault).prop('checked', data.Default);
                    $(_this.chkDefault).parent().attr('title', 'The default for ' + window.location.protocol + '//' + window.location.host + '/' + CZ.Service.superCollectionName);
                    if (data.Default)
                    {
                        $(_this.chkDefault).prop('disabled', true);
                        $(_this.deleteButton).hide();
                    }
                    $(_this.chkPublic ).prop('checked', data.PubliclySearchable);
                    $(_this.chkEditors).prop('checked', data.MembersAllowed);
                    _this.renderManageEditorsButton();
                });

                this.chkEditors.off().click(function (event) {
                    _this.renderManageEditorsButton();
                });
            };

            FormEditCollection.prototype.updateCollectionPath = function ()
            {
                this.collectionPath.val
                (
                    (
                        window.location.protocol + '//' + window.location.host + '/' +
                        CZ.Service.superCollectionName + '/' +
                        this.collectionName.val().replace(/[^a-zA-Z0-9\-]/g, '')
                    )
                    .toLowerCase()
                );
            };

            FormEditCollection.prototype.colorIsRgba = function (color) {
                return color ? color.substr(0, 5) === "rgba(" : false;
            };

            FormEditCollection.prototype.colorIsRgb = function (color) {
                return color ? color.substr(0, 4) === "rgb(" : false;
            };

            FormEditCollection.prototype.colorIsHex = function (color) {
                return color ? color.substr(0, 1) === "#" && color.length >= 7 : false;
            };

            FormEditCollection.prototype.rgbaFromColor = function (color, alpha) {
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
            };

            FormEditCollection.prototype.getOpacityFromRGBA = function (rgba) {
                if (!rgba)
                    return null;
                if (!this.colorIsRgba(rgba))
                    return 1.0;

                var parts = rgba.split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return parseFloat(lastPart);
            };

            FormEditCollection.prototype.getHexColorFromColor = function (color) {
                if (this.colorIsHex(color))
                    return color;

                if (!this.colorIsRgb(color) && !this.colorIsRgba(color))
                    return null;

                var offset = this.colorIsRgb(color) ? 4 : 5;
                var parts = color.substr(offset, color.length - offset - 1).split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return "#" + this.colorHexFromInt(parts[0]) + this.colorHexFromInt(parts[1]) + this.colorHexFromInt(parts[2]);
            };

            FormEditCollection.prototype.colorHexFromInt = function (colorpart) {
                var hex = Number(colorpart).toString(16);
                if (hex.length === 1)
                    return "0" + hex;

                return hex;
            };

            FormEditCollection.prototype.renderManageEditorsButton = function () {
                if (this.chkEditors.prop('checked')) {
                    this.btnEditors.slideDown('fast');
                } else {
                    this.btnEditors.slideUp('fast');
                }
            };

            FormEditCollection.prototype.updateCollectionTheme = function (clearError)
            {
                this.collectionTheme =
                {
                    backgroundUrl:          this.backgroundInput.val(),
                    backgroundColor:        "#232323",
                    kioskMode:              this.kioskmodeInput.prop("checked"),
                    /*
                    // native color picker:
                    timelineColor:          this.rgbaFromColor(this.timelineBackgroundColorInput.val(), this.timelineBackgroundOpacityInput.val()),
                    timelineStrokeStyle:    this.timelineBorderColorInput.val(),
                    infoDotFillColor:       this.rgbaFromColor(this.exhibitBackgroundColorInput.val(),  this.exhibitBackgroundOpacityInput.val()),
                    infoDotBorderColor:     this.exhibitBorderColorInput.val()
                    */
                    // spectrum color picker:
                    timelineColor:          this.rgbaFromColor(this.timelineBackgroundColorInput.spectrum('get').toHexString(), this.timelineBackgroundOpacityInput.val()),
                    timelineStrokeStyle:    this.timelineBorderColorInput.spectrum('get').toHexString(),
                    infoDotFillColor:       this.rgbaFromColor(this.exhibitBackgroundColorInput.spectrum( 'get').toHexString(), this.exhibitBackgroundOpacityInput.val()),
                    infoDotBorderColor:     this.exhibitBorderColorInput.spectrum( 'get').toHexString()
                };

                // if input has rgba color then update textbox with new alpha
                if (this.colorIsRgb(this.timelineBackgroundColorInput.val()))
                {
                    this.timelineBackgroundColorInput.val(this.collectionTheme.timelineColor);
                    this.exhibitBackgroundColorInput.val(this.collectionTheme.infoDotFillColor);
                }

                if (clearError) this.backgroundInput.hideError();

                this.updateCollectionThemeFromTheme(this.collectionTheme);
            };

            FormEditCollection.prototype.updateCollectionThemeFromTheme = function (theme) {
                CZ.Settings.applyTheme(theme, false);

                CZ.Common.vc.virtualCanvas("forEachElement", function (element) {
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
            };

            FormEditCollection.prototype.updateMediaInfo = function () {
                var clearError = true;

                // Using tempSource is less than ideal; however, SkyDrive does not support any permanent link to the file and therefore we will warn users. Future: Create an image cache in the server.
                if (this.contentItem.mediaType == "skydrive-image") {
                    this.backgroundInput.val(this.contentItem.tempSource || "");
                    clearError = false;
                    this.backgroundInput.showError("OneDrive static links are not permanent. Consider hosting it as a public image instead.");
                } else {
                    this.backgroundInput.val(this.contentItem.uri || "");
                }

                this.updateCollectionTheme(clearError);
            };

            FormEditCollection.prototype.show = function () {
                CZ.Menus.isDisabled = true;
                CZ.Menus.Refresh();
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditCollection.prototype.close = function () {
                var _this = this;
                CZ.Menus.isDisabled = false;
                CZ.Menus.Refresh();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.backgroundInput.hideError();
                        _this.mediaList.remove();
                    }
                });

                this.backgroundInput.hideError();
                this.updateCollectionThemeFromTheme(this.activeCollectionTheme);
            };
            return FormEditCollection;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCollection = FormEditCollection;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
