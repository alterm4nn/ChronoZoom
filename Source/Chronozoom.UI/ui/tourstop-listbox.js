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
                            descrTextblock: ".cz-contentitem-listitem-descr"
                        }
                    }
                };
                listItemsInfo.default.ctor = UI.ContentItemListItem;
                        _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            return TourStopListBox;
        })(UI.ListBoxBase);
        UI.TourStopListBox = TourStopListBox;        
        var TourStopListItem = (function (_super) {
            __extends(TourStopListItem, _super);
            function TourStopListItem(parent, container, uiMap, context) {
                var _this = this;
                        _super.call(this, parent, container, uiMap, context);
                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(uiMap.descrTextblock);
                this.iconImg.attr("src", this.data.icon || "/images/Temp-Thumbnail2.png");
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);
                this.closeButton.off();
                this.closeButton.click(function () {
                    if(CZ.Authoring.mode === "createExhibit") {
                        _super.prototype.close.call(_this);
                    } else if(CZ.Authoring.mode === "editExhibit") {
                        if(_this.parent.items.length > 1) {
                            _super.prototype.close.call(_this);
                        }
                    }
                });
            }
            return TourStopListItem;
        })(UI.ListItemBase);
        UI.TourStopListItem = TourStopListItem;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
