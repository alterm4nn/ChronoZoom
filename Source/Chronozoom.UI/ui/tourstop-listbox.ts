/// <reference path="../scripts/authoring.ts" />
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
/// <reference path='../ui/controls/listboxbase.ts'/>

module CZ {
    export module UI {

        export interface ITourStopListItemUIMap extends IListItemBaseUIMap {
            iconImg: string;
            titleTextblock: string;
            typeTextblock: string;
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
                            iconImg: ".cz-form-tour-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            typeTextblock: ".cz-contentitem-listitem-highlighted"
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
            public typeTextblock: JQuery;

            constructor(parent: TourStopListBox,
                container: JQuery,
                uiMap: ITourStopListItemUIMap,
                context: any) {

                super(parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.typeTextblock = this.container.find(uiMap.typeTextblock);

                var self = this;
                var descr = this.container.find(".cz-tourstop-description");
                descr.text(self.data.Description);
                descr.change(ev => {
                    self.data.Description = self.Description;
                });

                var thumbUrl = this.data.ThumbnailUrl;
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if (console && console.warn)
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                };
                img.src = thumbUrl; // fires off loading of image


                this.titleTextblock.text(this.data.Title);
                this.typeTextblock.text(this.data.Type);

                this.Activate();
                this.container.click(e =>
                {
                    self.Activate();
                });

                this.container.dblclick(e =>
                {
                    if (typeof context.Target.vc == "undefined") return;
                    var vp = context.Target.vc.getViewport();
                    var visible = VCContent.getVisibleForElement(context.Target, 1.0, vp, true);
                    var target = {
                        newvisible: visible,
                        element: context.Target
                    };
                    CZ.Search.navigateToElement(target);
                });
            }

            public get Description(): string {
                var descr = this.container.find(".cz-tourstop-description");
                return descr.val();
            }

            public Activate()
            {
                var myDescr = this.container.find(".cz-tourstop-description");
                this.parent.container.find(".cz-tourstop-description").not(myDescr).hide();
                myDescr.show(500);
            }
        }
    }
}