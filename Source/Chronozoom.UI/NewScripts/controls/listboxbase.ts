/// <reference path='../typings/jquery/jquery.d.ts'/>
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />

module CZ {
    export module UI {

        /**
         * Represents input data for a listbox.
         * - context: a collection of data, which will be displayed in a listbox.
         * - sortableSettings: an object with options for jQueryUI sortable widget.
         */
        export interface IListBoxBaseInfo {
            context: any[];
            sortableSettings: Object;
        }

        /**
         * Represents a set of CSS selectors for elements in HTML code of listitem's container.
         */
        export interface IListItemBaseUIMap {
            closeButton: string;
        }

        /**
         * Represents a set of types' descriptions. For each type:
         * - container: a jQuery object with listitem's container.
         * - uiMap: a set of CSS selectors for elements in HTML code of listitem's container.
         * - ctor: constructor for listitem of this type.
         */
        export interface IListItemBaseInfo {
            default: {
                container: JQuery;
                uiMap: IListItemBaseUIMap;
                ctor?: new(
                    parent: ListBoxBase,
                    container: JQuery,
                    uiMap: IListItemBaseUIMap, 
                    context: any)
                    => ListItemBase;
            };
        }

        /**
         * Base class for a listbox.
         * - container: a jQuery object with listbox's container.
         * - listBoxInfo: information about listbox's data and settings.
         * - listItemInfo: information about types of listitems.
         * - getType: a function to define type of listitems depending on their data.
         */
        export class ListBoxBase {
            public container: JQuery;
            public listItemsInfo: IListItemBaseInfo;
            public items: ListItemBase[];
            public getType: (context: any) => string;
            public onListItemClicked: (item: ListItemBase, index: number) => any;
            public onListItemRemoved: (item: ListItemBase, index: number) => any;

            constructor(container: JQuery,
                        listBoxInfo: IListBoxBaseInfo,
                        listItemsInfo: IListItemBaseInfo,
                        getType: (context: any) => string = (context: any) => "default") {

                if (!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }

                this.container = container;
                this.listItemsInfo = listItemsInfo;
                this.getType = getType;
                this.items = [];

                // Set default constructor.
                if (this.listItemsInfo.default) {
                    this.listItemsInfo.default.ctor = this.listItemsInfo.default.ctor || ListItemBase;
                }

                // Fill a collection of listitems. Use 'add' method to produce listitems from input data.
                for (var i = 0, context = listBoxInfo.context, len = context.length; i < len; ++i) {
                    this.add(context[i]);
                }

                // Apply jQueryUI sortable widget.
                this.container.sortable(listBoxInfo.sortableSettings);
            }

            /**
             * Produces listitem from data and add it to a listbox.
             * - context: a data to display in a listitem.
             */
            public add(context: any): ListItemBase {
                var type = this.getType(context);
                var typeInfo = this.listItemsInfo[type];

                var container = typeInfo.container.clone();
                var uiMap = typeInfo.uiMap;
                var ctor = typeInfo.ctor;

                var item = new ctor(this, container, uiMap, context);
                this.items.push(item);

                return item;
            }

            /**
             * Removes listitem from a listbox.
             */
            public remove(item: ListItemBase): void {
                var i = this.items.indexOf(item);

                if (i !== -1) {
                    item.container.remove();
                    this.items.splice(i, 1);
                    this.onListItemRemoved(item, i);
                }
            }

            /**
             * Clears all listitems from a listbox.
             */
            public clear(): void {
                for (var i = 0, len = this.items.length; i < len; ++i) {
                    var item = this.items[i];
                    item.container.remove();
                }
                this.items.length = 0;
            }

            /**
            * Selects an element of the listbox
            */
            public selectItem(item: ListItemBase): void {
                var i = this.items.indexOf(item);

                if (i !== -1) {
                    this.onListItemClicked(item, i);
                }
            }
        }

        /**
         * Base class for a listitem.
         * - parent: parent listbox.
         * - container: a jQuery object with listitem's container.
         * - uiMap: uiMap: a set of CSS selectors for elements in HTML code of listitem's container.
         * - context: a data to display in a listitem.
         */
        export class ListItemBase {
            public closeButton: JQuery;
            
            public parent: ListBoxBase;
            public container: JQuery;
            public data: any;
            
            constructor(parent: ListBoxBase,
                        container: JQuery,
                        uiMap: IListItemBaseUIMap,
                        context: any) {

                if (!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }

                this.parent = parent;
                this.container = container;
                this.data = context;

                // Setup click on a listitem
                this.container.click(_ => this.parent.selectItem(this));

                // Setup close button of a listitem.
                this.closeButton = this.container.find(uiMap.closeButton);

                if (!this.closeButton.length) {
                    throw "Close button is not found in a given UI map.";
                }

                this.closeButton.click(event => this.close());

                // Append listitems container to a listbox.
                this.parent.container.append(this.container);
            }

            /**
             * Closes an item and removes it from a listbox.
             */
            public close(): void {
                this.parent.remove(this);
            }
        }
    }
}