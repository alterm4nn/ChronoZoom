/// <reference path='../../ui/controls/listboxbase.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

interface IRedGreenListItemInfo extends CZ.UI.IListItemBaseInfo {
    red: {
        container: JQuery;
        uiMap: CZ.UI.IListItemBaseUIMap;
        ctor?: any;
    };
    green: {
        container: JQuery;
        uiMap: CZ.UI.IListItemBaseUIMap;
        ctor?: any;
    };
}

class RedGreenListBox extends CZ.UI.ListBoxBase {
    constructor(container: JQuery,
                listBoxInfo: CZ.UI.IListBoxBaseInfo,
                listItemsInfo: IRedGreenListItemInfo) {

        listItemsInfo.red.ctor = RedListItem;
        listItemsInfo.green.ctor = GreenListItem;
        super(container, listBoxInfo, listItemsInfo, function (item) {
            var type = item.text.match(/red|green/i);
            return type ? type[0].toLowerCase() : "default";
        });
    }
}

class RedListItem extends CZ.UI.ListItemBase {
    public textblock: JQuery;

    constructor(parent: RedGreenListBox,
                container: JQuery,
                uiMap: any,
                context: any) {

        super(parent, container, uiMap, context);

        this.textblock = this.container.find(uiMap.textblock);
        this.textblock.text(context.text);

        this.container.click(event => {
            var oldtext = this.textblock.text();
            this.textblock.text("Clicked Red!");
            setTimeout(() => {
                this.textblock.text(oldtext);
            }, 1500);
        });
    }
}

class GreenListItem extends CZ.UI.ListItemBase {
    public textblock: JQuery;

    constructor(parent: RedGreenListBox,
                container: JQuery,
                uiMap: any,
                context: any) {

        super(parent, container, uiMap, context);

        this.textblock = this.container.find(uiMap.textblock);
        this.textblock.text(context.text);

        this.container.click(event => {
            var oldtext = this.textblock.text();
            this.textblock.text("Clicked Green!")
            setTimeout(() => {
                this.textblock.text(oldtext);
            }, 1500);
        });
    }
}