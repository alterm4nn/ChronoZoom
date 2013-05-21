var __extends = this.__extends || function (d, b) {
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
                            iconImg: ".cz-contentitem-listitem-icon > img",
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
                this.iconImg.attr("src", this.data.Icon || "/images/Temp-Thumbnail2.png");
                this.titleTextblock.text(this.data.Title);
                this.typeTextblock.text(this.data.Type);
                this.container.dblclick(function (e) {
                    var vp = context.Target.vc.getViewport();
                    var visible = CZ.VCContent.getVisibleForElement(context.Target, 1.0, vp, true);
                    var target = {
                        newvisible: visible,
                        element: context.Target
                    };
                    CZ.Search.navigateToElement(target);
                });
            }
            return TourStopListItem;
        })(UI.ListItemBase);
        UI.TourStopListItem = TourStopListItem;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
