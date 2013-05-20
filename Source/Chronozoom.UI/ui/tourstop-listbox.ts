/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>

module CZ {
    export module UI {

        export interface ITourStopListItemUIMap extends IListItemBaseUIMap {
            iconImg: string;
            titleTextblock: string;
            descrTextblock: string;
        }

        export interface ITourStopListItemInfo extends IListItemBaseInfo {
            default: {
                container: JQuery;
                uiMap: ITourStopListItemUIMap;
                ctor?: new (
                    parent: TourStopListBox,
                    container: JQuery,
                    uiMap: ITourStopListItemUIMap,
                    context: any)
                    => TourStopListItem;
            };
        }

        export class TourStopListBox extends ListBoxBase {
            constructor(container: JQuery, listItemContainer: JQuery, contentItems: any) {
                var listBoxInfo: IListBoxBaseInfo = {
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

                var listItemsInfo: ITourStopListItemInfo = {
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

                listItemsInfo.default.ctor = TourStopListItem;
                super(container, listBoxInfo, listItemsInfo);
            }
        }

        export class TourStopListItem extends ListItemBase {
            public iconImg: JQuery;
            public titleTextblock: JQuery;
            public descrTextblock: JQuery;

            constructor(parent: TourStopListBox,
                container: JQuery,
                uiMap: IContentItemListItemUIMap,
                context: any) {

                super(parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(uiMap.descrTextblock);

                this.iconImg.attr("src", this.data.icon || "/images/Temp-Thumbnail2.png");
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);

                this.closeButton.off();
                this.closeButton.click(() => {
                    //if (CZ.Authoring.mode === "createExhibit") {
                    //    super.close();
                    //} else if (CZ.Authoring.mode === "editExhibit") {
                    //    if (this.parent.items.length > 1) {
                    //        super.close();
                    //    }
                    //}
                });
            }
        }
    }
}