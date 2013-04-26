var CZ;
(function (CZ) {
    (function (UI) {
        var ListBoxBase = (function () {
            function ListBoxBase(container, listBoxInfo, listItemsInfo, getType) {
                if (typeof getType === "undefined") { getType = function (context) {
                    return "default";
                }; }
                if(!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }
                this.container = container;
                this.listItemsInfo = listItemsInfo;
                this.getType = getType;
                this.items = [];
                if(this.listItemsInfo.default) {
                    this.listItemsInfo.default.ctor = this.listItemsInfo.default.ctor || ListItemBase;
                }
                for(var i = 0, context = listBoxInfo.context, len = context.length; i < len; ++i) {
                    this.add(context[i]);
                }
                this.container.sortable(listBoxInfo.sortableSettings);
            }
            ListBoxBase.prototype.add = function (context) {
                var type = this.getType(context);
                var typeInfo = this.listItemsInfo[type];
                var container = typeInfo.container.clone();
                var uiMap = typeInfo.uiMap;
                var ctor = typeInfo.ctor;
                var item = new ctor(this, container, uiMap, context);
                this.items.push(item);
                return item;
            };
            ListBoxBase.prototype.remove = function (item) {
                var i = this.items.indexOf(item);
                if(i !== -1) {
                    item.container.remove();
                    this.items.splice(i, 1);
                }
            };
            ListBoxBase.prototype.clear = function () {
                for(var i = 0, len = this.items.length; i < len; ++i) {
                    var item = this.items[i];
                    item.container.remove();
                }
                this.items.length = 0;
            };
            return ListBoxBase;
        })();
        UI.ListBoxBase = ListBoxBase;        
        var ListItemBase = (function () {
            function ListItemBase(parent, container, uiMap, context) {
                var _this = this;
                if(!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }
                this.parent = parent;
                this.container = container;
                this.data = context;
                this.closeButton = this.container.find(uiMap.closeButton);
                if(!this.closeButton.length) {
                    throw "Close button is not found in a given UI map.";
                }
                this.closeButton.click(function (event) {
                    return _this.close();
                });
                this.parent.container.append(this.container);
            }
            ListItemBase.prototype.close = function () {
                this.parent.remove(this);
            };
            return ListItemBase;
        })();
        UI.ListItemBase = ListItemBase;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
