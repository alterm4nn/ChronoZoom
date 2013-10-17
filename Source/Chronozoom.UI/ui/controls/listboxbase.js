/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path="../../scripts/typings/jqueryui/jqueryui.d.ts" />
var CZ;
(function (CZ) {
    (function (UI) {
        /**
        * Base class for a listbox.
        * - container: a jQuery object with listbox's container.
        * - listBoxInfo: information about listbox's data and settings.
        * - listItemInfo: information about types of listitems.
        * - getType: a function to define type of listitems depending on their data.
        */
        var ListBoxBase = (function () {
            function ListBoxBase(container, listBoxInfo, listItemsInfo, getType) {
                if (typeof getType === "undefined") { getType = function (context) {
                    return "default";
                }; }
                if (!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }

                this.container = container;
                this.listItemsInfo = listItemsInfo;
                this.getType = getType;
                this.items = [];

                if (this.listItemsInfo.default) {
                    this.listItemsInfo.default.ctor = this.listItemsInfo.default.ctor || ListItemBase;
                }

                for (var i = 0, context = listBoxInfo.context, len = context.length; i < len; ++i) {
                    this.add(context[i]);
                }

                // Setup default handlers
                this.itemDblClickHandler = function (item, idx) {
                };
                this.itemRemoveHandler = function (item, idx) {
                };
                this.itemMoveHandler = function (item, idx1, idx2) {
                };

                // Apply jQueryUI sortable widget.
                var self = this;
                if (listBoxInfo.sortableSettings) {
                    var origStart = listBoxInfo.sortableSettings.start;
                    var origStop = listBoxInfo.sortableSettings.stop;
                    $.extend(listBoxInfo.sortableSettings, {
                        start: function (event, ui) {
                            ui.item.startPos = ui.item.index();
                            if (origStart)
                                origStart(event, ui);
                        },
                        stop: function (event, ui) {
                            ui.item.stopPos = ui.item.index();
                            var item = self.items.splice(ui.item.startPos, 1)[0];
                            self.items.splice(ui.item.stopPos, 0, item);
                            self.itemMoveHandler(ui.item, ui.item.startPos, ui.item.stopPos);
                            if (origStop)
                                origStop(event, ui);
                        }
                    });
                    this.container.sortable(listBoxInfo.sortableSettings);
                }
            }
            /**
            * Produces listitem from data and add it to a listbox.
            * - context: a data to display in a listitem.
            */
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

            /**
            * Removes listitem from a listbox.
            */
            ListBoxBase.prototype.remove = function (item) {
                var i = this.items.indexOf(item);

                if (i !== -1) {
                    item.container.remove();
                    this.items.splice(i, 1);
                    this.itemRemoveHandler(item, i);
                }
            };

            /**
            * Clears all listitems from a listbox.
            */
            ListBoxBase.prototype.clear = function () {
                for (var i = 0, len = this.items.length; i < len; ++i) {
                    var item = this.items[i];
                    item.container.remove();
                }
                this.items.length = 0;
            };

            /**
            * Selects an element of the listbox
            */
            ListBoxBase.prototype.selectItem = function (item) {
                var i = this.items.indexOf(item);

                if (i !== -1) {
                    this.itemDblClickHandler(item, i);
                }
            };

            /**
            * Setup listitem clicked handler
            */
            ListBoxBase.prototype.itemDblClick = function (handler) {
                this.itemDblClickHandler = handler;
            };

            /**
            * Setup listitem removed handler
            */
            ListBoxBase.prototype.itemRemove = function (handler) {
                this.itemRemoveHandler = handler;
            };

            /**
            * Setup listitem move handler
            */
            ListBoxBase.prototype.itemMove = function (handler) {
                this.itemMoveHandler = handler;
            };
            return ListBoxBase;
        })();
        UI.ListBoxBase = ListBoxBase;

        /**
        * Base class for a listitem.
        * - parent: parent listbox.
        * - container: a jQuery object with listitem's container.
        * - uiMap: uiMap: a set of CSS selectors for elements in HTML code of listitem's container.
        * - context: a data to display in a listitem.
        */
        var ListItemBase = (function () {
            function ListItemBase(parent, container, uiMap, context) {
                var _this = this;
                if (!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }

                this.parent = parent;
                this.container = container;
                this.data = context;

                // Setup click on a listitem
                this.container.dblclick(function (_) {
                    return _this.parent.selectItem(_this);
                });

                // Setup close button of a listitem.
                this.closeButton = this.container.find(uiMap.closeButton);

                if (this.closeButton.length) {
                    this.closeButton.click(function (event) {
                        return _this.close();
                    });
                }

                // Append listitems container to a listbox.
                this.parent.container.append(this.container);
            }
            /**
            * Closes an item and removes it from a listbox.
            */
            ListItemBase.prototype.close = function () {
                this.parent.remove(this);
            };
            return ListItemBase;
        })();
        UI.ListItemBase = ListItemBase;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
