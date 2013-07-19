/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>

module CZ {
    export module UI {

        export interface ITourListItemUIMap extends IListItemBaseUIMap {
            iconImg: string;
            titleTextblock: string;
        }

        export interface ITourListItemInfo extends IListItemBaseInfo {
            default: {
                container: JQuery;
                uiMap: ITourListItemUIMap;
                ctor?: new (
                    parent: TourListBox,
                    container: JQuery,
                    uiMap: ITourListItemUIMap,
                    context: any)
                    => TourListItem;
            };
        }

        export class TourListBox extends ListBoxBase {

            private takeTour: (tour: any) => void;
            private editTour: (tour: any) => void;

            constructor(container: JQuery, listItemContainer: JQuery, contentItems: any,
                takeTour: (tour: any) => void ,
                editTour: (tour: any) => void ) {

                this.takeTour = takeTour;
                this.editTour = editTour;

                var listBoxInfo: IListBoxBaseInfo = {
                    context: contentItems,
                    sortableSettings: null
                };

                var listItemsInfo: ITourListItemInfo = {
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

                listItemsInfo.default.ctor = TourListItem;
                super(container, listBoxInfo, listItemsInfo);
            }

            public get TakeTour(): (tour: any) => void {
                return this.takeTour;
            }

            public get EditTour(): (tour: any) => void {
                return this.editTour;
            }
        }

        export class TourListItem extends ListItemBase {
            public iconImg: JQuery;
            public titleTextblock: JQuery;
            public descrTextblock: JQuery;

            constructor(parent: TourListBox,
                container: JQuery,
                uiMap: ITourListItemUIMap,
                context: any) {
                if (!context) throw "Tour list item's context is undefined";
                super(parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(".cz-contentitem-listitem-descr");

                var self = this;
                var thumbUrl = this.data.thumbnailUrl;
                this.iconImg.attr("src", this.data.icon || "/images/Temp-Thumbnail2.png");
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if (console && console.warn)
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                };
                img.src = thumbUrl; // fires off loading of image

                this.titleTextblock.text(this.data.title);
                if (this.data.description)
                    this.descrTextblock.text(this.data.description);
                else
                    this.descrTextblock.hide();

                this.container.find("#takeTour").click(e =>
                {
                    parent.TakeTour(context);
                });

                container.find(".cz-tourslist-editing").css("display", parent.EditTour ? "inline" : "none");
                if (parent.EditTour) {
                    this.container.find("#editTour").click(e =>
                    {
                        parent.EditTour(context);
                    });
                }
            }
        }
    }
}