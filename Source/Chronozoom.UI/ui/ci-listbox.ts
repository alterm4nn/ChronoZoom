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
        
        /*
        export class ContentItemListBox extends ListBoxBase {
            constructor(container: JQuery,
                        listBoxInfo: IListBoxBaseInfo,
                        listItemsInfo: IContentItemListItemInfo) {

                listItemsInfo.default.ctor = ContentItemListItem;
                super(container, listBoxInfo, listItemsInfo);
            }
        }
        */

        export class ContentItemListBox extends ListBoxBase {
            constructor(container: JQuery, contentItems: any) {
                var listBoxInfo: IListBoxBaseInfo = {
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
                            // NOTE: In case of scrollbar shifting,
                            //       control height manually.
                            //$(this).height($(this).height());
                        }
                    }
                };

                var listItemsInfo: IContentItemListItemInfo = {
                    default: {
                        container: $('<li class="cz-listitem">' +
                                        '<div class="cz-ci-listitem-icon">' +
                                            '<img src="placeholder" alt="" />' +
                                        '</div>' +

                                        '<div class="cz-ci-listitem-content">' +
                                            '<h4 class="cz-ci-listitem-title">Content Item Title</h4>' +
                                            '<p class="cz-ci-listitem-descr">Content Item Description</p>' +
                                        '</div>' +

                                        '<div class="cz-listitem-close-btn">' +
                                            'X' +
                                        '</div>' +
                                    '</li>'),
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-ci-listitem-icon > img",
                            titleTextblock: ".cz-ci-listitem-title",
                            descrTextblock: ".cz-ci-listitem-descr"
                        }
                    }
                };

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

                this.iconImg.attr("src", this.data.icon || "/Images/Temp-Thumbnail2.png");
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);
            }
        }
    }
}