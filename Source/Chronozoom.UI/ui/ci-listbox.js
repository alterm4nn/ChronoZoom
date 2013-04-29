var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var ContentItemListBox = (function (_super) {
            __extends(ContentItemListBox, _super);
            function ContentItemListBox(container, contentItems) {
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: {
                        forcePlaceholderSize: true,
                        cursor: "move",
                        placeholder: "placeholder-example",
                        revert: 100,
                        opacity: 0.75,
                        tolerance: "pointer",
                        scroll: false,
                        create: function () {
                        }
                    }
                };
                var listItemsInfo = {
                    default: {
                        container: $('<li class="cz-listitem">' + '<div class="cz-ci-listitem-icon">' + '<img src="placeholder" alt="" />' + '</div>' + '<div class="cz-ci-listitem-content">' + '<h4 class="cz-ci-listitem-title">Content Item Title</h4>' + '<p class="cz-ci-listitem-descr">Content Item Description</p>' + '</div>' + '<div class="cz-listitem-close-btn">' + 'X' + '</div>' + '</li>'),
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-ci-listitem-icon > img",
                            titleTextblock: ".cz-ci-listitem-title",
                            descrTextblock: ".cz-ci-listitem-descr"
                        }
                    }
                };
                listItemsInfo.default.ctor = ContentItemListItem;
                        _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            return ContentItemListBox;
        })(UI.ListBoxBase);
        UI.ContentItemListBox = ContentItemListBox;        
        var ContentItemListItem = (function (_super) {
            __extends(ContentItemListItem, _super);
            function ContentItemListItem(parent, container, uiMap, context) {
                        _super.call(this, parent, container, uiMap, context);
                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(uiMap.descrTextblock);
                this.iconImg.attr("src", this.data.icon || "/Images/Temp-Thumbnail2.png");
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);
            }
            return ContentItemListItem;
        })(UI.ListItemBase);
        UI.ContentItemListItem = ContentItemListItem;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
