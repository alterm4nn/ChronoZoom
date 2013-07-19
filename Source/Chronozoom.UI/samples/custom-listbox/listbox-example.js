var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RedGreenListBox = (function (_super) {
    __extends(RedGreenListBox, _super);
    function RedGreenListBox(container, listBoxInfo, listItemsInfo) {
        listItemsInfo.red.ctor = RedListItem;
        listItemsInfo.green.ctor = GreenListItem;
        _super.call(this, container, listBoxInfo, listItemsInfo, function (item) {
    var type = item.text.match(/red|green/i);
    return type ? type[0].toLowerCase() : "default";
});
    }
    return RedGreenListBox;
})(CZ.UI.ListBoxBase);
var RedListItem = (function (_super) {
    __extends(RedListItem, _super);
    function RedListItem(parent, container, uiMap, context) {
        var _this = this;
        _super.call(this, parent, container, uiMap, context);
        this.textblock = this.container.find(uiMap.textblock);
        this.textblock.text(context.text);
        this.container.click(function (event) {
            var oldtext = _this.textblock.text();
            _this.textblock.text("Clicked Red!");
            setTimeout(function () {
                _this.textblock.text(oldtext);
            }, 1500);
        });
    }
    return RedListItem;
})(CZ.UI.ListItemBase);
var GreenListItem = (function (_super) {
    __extends(GreenListItem, _super);
    function GreenListItem(parent, container, uiMap, context) {
        var _this = this;
        _super.call(this, parent, container, uiMap, context);
        this.textblock = this.container.find(uiMap.textblock);
        this.textblock.text(context.text);
        this.container.click(function (event) {
            var oldtext = _this.textblock.text();
            _this.textblock.text("Clicked Green!");
            setTimeout(function () {
                _this.textblock.text(oldtext);
            }, 1500);
        });
    }
    return GreenListItem;
})(CZ.UI.ListItemBase);
