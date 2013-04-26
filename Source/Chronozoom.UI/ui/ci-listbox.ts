/// <reference path='../NewScripts/typings/jquery/jquery.d.ts'/>

/// <reference path='../NewScripts/controls/listboxbase.ts'/>

module CZ {
    export module UI {

        export interface IContentItemListItemUIMap extends IListItemBaseUIMap {
            iconImg: string;
            titleTextblock: string;
            descrTextblock: string;
        }

        export interface IContentItemListItemInfo extends IListItemBaseInfo {
            default: {
                container: JQuery;
                uiMap: IContentItemListItemUIMap;
                ctor?: new(
                    parent: ContentItemListBox,
                    container: JQuery,
                    uiMap: IContentItemListItemUIMap,
                    context: any)
                    => ContentItemListItem;
            };
        }

        export class ContentItemListBox extends ListBoxBase {
            constructor(container: JQuery,
                        listBoxInfo: IListBoxBaseInfo,
                        listItemsInfo: IContentItemListItemInfo) {

                listItemsInfo.default.ctor = ContentItemListItem;
                super(container, listBoxInfo, listItemsInfo);
            }
        }

        export class ContentItemListItem extends ListItemBase {
            public iconImg: JQuery;
            public titleTextblock: JQuery;
            public descrTextblock: JQuery;

            constructor(parent: ContentItemListBox,
                        container: JQuery,
                        uiMap: IContentItemListItemUIMap,
                        context: any) {

                super(parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(uiMap.descrTextblock);

                this.iconImg.attr("src", this.data.icon);
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);
            }
        }
    }
}