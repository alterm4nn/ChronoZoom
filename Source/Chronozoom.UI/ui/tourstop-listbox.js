/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStopListBox = (function (_super) {
            __extends(TourStopListBox, _super);
            function TourStopListBox(container, listItemContainer, contentItems) {
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: {
                        forcePlaceholderSize: true,
                        cursor: "move",
                        placeholder: "cz-listbox-placeholder",
                        revert: 100,
                        opacity: 0.75,
                        tolerance: "pointer",
                        scroll: false,
                        start: function (event, ui) {
                            ui.placeholder.height(ui.item.height());
                        }
                    }
                };

                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-form-tour-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            typeTextblock: ".cz-contentitem-listitem-highlighted"
                        }
                    }
                };

                listItemsInfo.default.ctor = TourStopListItem;
                _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            return TourStopListBox;
        })(UI.ListBoxBase);
        UI.TourStopListBox = TourStopListBox;

        var TourStopListItem = (function (_super) {
            __extends(TourStopListItem, _super);
            function TourStopListItem(parent, container, uiMap, context) {
                _super.call(this, parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.typeTextblock = this.container.find(uiMap.typeTextblock);

                var self = this;

                var lapse = this.container.find(".cz-tourstop-lapse");
                var descr = this.container.find(".cz-tourstop-description");

                lapse.val(self.data.lapseTime);
                descr.text(self.data.Description);

                lapse.change(function (ev) {
                    self.data.lapseTime = self.LapseTime;
                });

                descr.change(function (ev) {
                    self.data.Description = self.Description;
                });

                var thumbUrl = this.data.ThumbnailUrl;
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if (console && console.warn)
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                };
                img.src = thumbUrl; // fires off loading of image

                this.titleTextblock.text(this.data.Title);
                this.typeTextblock.text(this.data.Type);

                this.Activate();
                this.container.click(function (e) {
                    self.Activate();
                });

                this.container.dblclick(function (e) {
                    if (typeof context.Target.vc == "undefined")
                        return;
                    var vp = context.Target.vc.getViewport();
                    var visible = CZ.VCContent.getVisibleForElement(context.Target, 1.0, vp, true);
                    var target = {
                        newvisible: visible,
                        element: context.Target
                    };
                    CZ.Search.navigateToElement(target);
                });
            }
            Object.defineProperty(TourStopListItem.prototype, "LapseTime", {
                get: function () {
                    var element = this.container.find('.cz-tourstop-lapse');
                    var rv = parseInt('0' + element.val());
                    if (rv > 3600)
                        rv = 3600; // max 1 hour
                    return rv;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TourStopListItem.prototype, "Description", {
                get: function () {
                    var descr = this.container.find(".cz-tourstop-description");
                    return descr.val();
                },
                enumerable: true,
                configurable: true
            });
            
            TourStopListItem.prototype.Activate = function () {
                var selectedStop = this.container.find('.cz-tourstop-detailblock');
                this.parent.container.find('.cz-tourstop-detailblock').not(selectedStop).hide();
                selectedStop
                    .show(500)
                    .find('.cz-tourstop-lapse')
                        .autoNumeric('destroy')
                        .autoNumeric('init');
            };
            return TourStopListItem;
        })(UI.ListItemBase);
        UI.TourStopListItem = TourStopListItem;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
