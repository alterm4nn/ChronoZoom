/*********
 * Menus *
 *********/

var CZ;
(function (CZ) {
    /*
    
    Menus contains logic to decide which (if any) top menus and their menu items to display, based on Menus public properties, and to render the top menus in the header.
    After changing one or more public properties, a call to the CZ.Menus.Refresh() function should be made in order for the menu display to be updated based on the latest property settings.
    It's OK to call Refresh() several times since this function has no db lookups, and just contains some very light DOM manipulation.

    The code to render a side panel or overlay, which is called from a menu item, is still mostly in /scripts/cz.js, (where it was originally coded.)
    This is partly due to the side panel code requiring various values embedded in cz.js, but mostly because the side panels can also be displayed from elsewhere.
    However the code to display side panels has been alterered so as not to directly hook menus or have display logic, and has been moved into public methods.

    See https://trello.com/c/fSZbqEFU/148-collection-view-header-ribbon-bar-title-bar for general logic regarding Menus display choices.

    */
    (function (Menus) {

        /*********************
         * Public Properties *      // Set to initial state of false for default anon user menus
         *********************/
        Menus.isSignedIn = false;   // Set to true while user is logged in
        Menus.isEditor   = false;   // Set to true if user has edit rights to the current collection - Note that isEditor should not be true unless isSignedIn is true
        Menus.isDisabled = false;   // Set to true while displaying a panel that is pseudo-modal
        Menus.isHidden = false;   // Set to true for "Kiosk Mode"
        Menus.isOverlay = false;   // Set to true while user is on the homescreen



        /******************
         * Public Methods *
         ******************/
        function Refresh()          // Call after any properties changed
        {
            if (Menus.isHidden)
            {
                $('#miniMenu').hide();
            }
            else
            {
                $('#miniMenu').show();
            }

            if (Menus.isDisabled)
            {
                $('#miniMenu').removeClass('disabled').addClass('disabled');
            }
            else
            {
                $('#miniMenu').removeClass('disabled');
            }
        }
        Menus.Refresh = Refresh;



        /*******************
         * Private Methods *
         *******************/
        $(document).ready(function ()
        {


            /***********
             * Menu UI *
             ***********/

            var slideDownSpeed = 250;
            var slideUpSpeed = 'fast';


            // *** primary menu ***

            $('#miniMenu').children('li')

                .mouseenter(function (event)
                {
                    // show
                    if ($(this).hasClass('active') && !$('#miniMenu').hasClass('disabled'))
                    {
                        $(this).children('ul').slideDown(slideDownSpeed);
                    }
                })
                .mouseleave(function (event)
                {
                    // hide
                    $(this).children('ul').slideUp(slideUpSpeed);
                })
                
                
            /*******************
             * Menu Item Hooks *
             *******************/
  
            var addressArray = window.location.href.split('czmin/');
            $('#miniMenuCZhref').attr("href", addressArray[0] + addressArray[1]);

        });


        /***********
         * Helpers *
         ***********/

        this.AddCollection =
        function AddCollection()
        {
            CZ.Authoring.hideMessageWindow();

            var newName = prompt("What name would you like for your new collection?\nNote: The name must be unique among your collections.", '') || '';
            newName     = $.trim(newName);

            var newPath = newName.replace(/[^a-zA-Z0-9\-]/g, '');
            if (newPath === '') return;

            if (newPath.length > 50)
            {
                CZ.Authoring.showMessageWindow
                (
                    "The name of your new collection must be no more than 50 characters in length.",
                    "Unable to Create Collection"
                );
                return;
            }

            CZ.Service.getCollection().done(function (currentCollection)
            {
                CZ.Service.isUniqueCollectionName(newName).done(function (isUniqueCollectionName)
                {
                    if (!isUniqueCollectionName || newPath === currentCollection.Path)
                    {
                        CZ.Authoring.showMessageWindow
                        (
                            "Sorry your new collection name is not unique enough. Please try a different name.",
                            "Unable to Create Collection"
                        );
                        return;
                    }

                    CZ.Service.postCollection(newPath, { Title: newName }).done(function (success)
                    {
                        if (success)
                        {
                            window.location =
                            (
                                window.location.protocol + '//' + window.location.host + '/' + CZ.Service.superCollectionName + '/' + newPath
                            )
                            .toLowerCase();
                        }
                        else
                        {
                            CZ.Authoring.showMessageWindow
                            (
                                "An unexpected error occured.",
                                "Unable to Create Collection"
                            );
                        }
                    });

                });
            });

        };


        this.ExportInformation =
        function ExportInformation()
        {
            CZ.Authoring.showMessageWindow
            (
                "Exporting a collection lets you save an entire collection to a file on your PC, which you can keep as a backup or share with others. " +
                "The collection's name, background, colors, timelines, exhibits, content items and tours are all included. If you've granted edit rights " +
                "to other people, please note that the list of editors is not included. When you import a previously exported collection, " +
                "it will always be imported as a new unpublished collection, which you can then edit and publish when you are ready.",
                "Exporting & Importing Collections"
            );
        };


        this.ExportCollection =
        function ExportCollection()
        {
            var promiseRootId       = CZ.Service.getRootTimelineId();
            var promiseCollection   = CZ.Service.getCollection();
            var promiseTours        = CZ.Service.getTours();

            $.when
            (
                promiseRootId,
                promiseCollection,
                promiseTours
            )
            .done(function(rootId, collection, tours)
            {

                CZ.Service.exportTimelines(rootId[0])
                .done(function (timelines)
                {
                    var exportData =
                    {
                        date:       new Date().toUTCString(),
                        schema:     constants.schemaVersion,
                        collection:
                        {
                            Title:  collection[0].Title,
                            theme:  collection[0].theme
                        },
                        timelines:  timelines,
                        tours:      tours[0].d
                    };

                    var fileBLOB = new Blob([JSON.stringify(exportData)], { type: 'application/json;charset=utf-8' });
                    var fileName = 'cz.' + collection[0].Path + '.json';

                    saveAs(fileBLOB, fileName);

                    CZ.Authoring.showMessageWindow
                    (
                        'The current collection has been provided to you as a file, which you can retain as a back-up, or share with others. ' +
                        'If you are not prompted to pick a file name, please check your downloads for a file called: "' + fileName + '".',
                        'Collection Successfully Exported'
                    );
                })
                .fail(function ()
                {
                    CZ.Authoring.showMessageWindow
                    (
                        'Sorry, we were unable to export this collection.',
                        'Unable to Export Collection'
                    );
                });

            })
            .fail(function()
            {
                CZ.Authoring.showMessageWindow
                (
                    'An unexpected error occured. Please feel free to try again.',
                    'Unable to Export Collection'
                );
            });

        };


        this.ImportCollection =
        function ImportCollection(stringifiedJSON)
        {
            CZ.Service.importCollection(stringifiedJSON).then(function (importMessage)
            {
                CZ.Authoring.showMessageWindow(importMessage);
            });
        };


    })(CZ.Menus || (CZ.Menus = {}));
    var Menus = CZ.Menus;
})(CZ || (CZ = {}));