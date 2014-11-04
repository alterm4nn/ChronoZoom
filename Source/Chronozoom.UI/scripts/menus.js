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
        Menus.isHidden   = false;   // Set to true for "Kiosk Mode"



        /******************
         * Public Methods *
         ******************/
        function Refresh()          // Call after any properties changed
        {
            $('#btnToggleSignedIn').attr('data-active', Menus.isSignedIn);
            $('#btnToggleEditor'  ).attr('data-active', Menus.isEditor);
            $('#btnToggleDisable' ).attr('data-active', Menus.isDisabled);
            $('#btnToggleHide'    ).attr('data-active', Menus.isHidden);

            if (Menus.isHidden)
            {
                $('#mnu').hide();
            }
            else
            {
                $('#mnu').show();
            }

            if (Menus.isDisabled)
            {
                $('#mnu').removeClass('disabled').addClass('disabled');
            }
            else
            {
                $('#mnu').removeClass('disabled');
            }

            if (Menus.isSignedIn)
            {
                $('#mnuProfile')
                    .attr('title', 'My Profile / Sign Out')
                    .find('img').attr('src', '/images/profile-icon-green.png');
            }
            else
            {
                $('#mnuProfile')
                    .attr('title', 'Register / Sign In')
                    .find('img').attr('src', '/images/profile-icon.png');
            }

            if (Menus.isEditor)
            {
                $('#mnuCurate').removeClass('active').addClass('active');
            }
            else
            {
                $('#mnuCurate').removeClass('active');
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

            $('#mnu').children('li')

                .mouseenter(function (event)
                {
                    // show
                    if ($(this).hasClass('active') && !$('#mnu').hasClass('disabled'))
                    {
                        $(this).children('ul').slideDown(slideDownSpeed);
                    }
                })
                .mouseleave(function (event)
                {
                    // hide
                    $(this).children('ul').slideUp(slideUpSpeed);
                })
                .on('touchstart', function (event)
                {
                    // if has secondary menu then sticky toggle for touch events
                    if ($(this).children('ul').length === 1)
                    {
                        if ($(this).children('ul').is(':visible'))
                        {
                            $(this).trigger('mouseleave');
                        }
                        else
                        {
                            $(this).trigger('mouseenter');
                        }
                    }
                })


                // *** secondary menu ***

                .children('ul').children('li').click(function (event)
                {
                    event.stopPropagation();

                    if ($(this).children().hasClass('chevron'))
                    {
                        // has tertiary menu - sticky expand/hide
                        if ($(this).hasClass('active'))
                        {
                            // hide
                            $(this).children('.chevron').html('&#9654;'); // right chevron
                            $(this).removeClass('active').children('ul').slideUp(slideUpSpeed);
                        }
                        else
                        {
                            // show
                            $(this).children('.chevron').html('&#9698;'); // down chevron
                            $(this).addClass('active').children('ul').slideDown(slideDownSpeed);
                        }
                    }
                    else
                    {
                        // has no sub-menu - immediately hide drop-down
                        $(this).parent().slideUp(slideUpSpeed);
                    }
                })


                // *** tertiary menu ***

                .children('ul').children('li').click(function (event)
                {
                    event.stopPropagation();

                    // has no sub-menu - immediately hide drop-down
                    $(this).parent().parent().parent().slideUp(slideUpSpeed);
                });



            /*******************
             * Menu Item Hooks *
             *******************/

            $('#mnuViewTours').click(function (event)
            {
                event.stopPropagation();
                // show tours list pane (hide edit options)
                CZ.HomePageViewModel.panelShowToursList(false);
            });

            $('#mnuViewSeries').click(function (event)
            {
                event.stopPropagation();
                // toggle display of time series pane
                CZ.HomePageViewModel.panelToggleTimeSeries();
            });

            $('#mnuCurate').click(function (event)
            {
                if (Menus.isDisabled) return;
                if (!Menus.isSignedIn)
                {
                    // toggle display of register / log in pane
                    CZ.HomePageViewModel.panelToggleLogin();
                }
                else
                {
                    if (!Menus.isEditor)
                    {
                        CZ.Authoring.showMessageWindow
                        (
                            'Sorry, you do not have edit rights to this collection.',
                            'Unable to Curate'
                        );
                    }
                }
            });

            $('#mnuCreateTimeline').click(function (event)
            {
                event.stopPropagation();
                // show create timeline dialog
                CZ.HomePageViewModel.closeAllForms();
                CZ.StartPage.hide();
                CZ.Authoring.UI.createTimeline();
            });

            $('#mnuCreateExhibit').click(function (event)
            {
                event.stopPropagation();
                // show create exhibit dialog
                CZ.HomePageViewModel.closeAllForms();
                CZ.StartPage.hide();
                CZ.Authoring.UI.createExhibit();
            });

            $('#mnuCreateTour').click(function (event)
            {
                event.stopPropagation();
                // show create tour dialog
                CZ.HomePageViewModel.closeAllForms();
                CZ.StartPage.hide();
                CZ.Authoring.UI.createTour();
            });

            $('#mnuEditTours').click(function (event)
            {
                event.stopPropagation();
                // show tours list pane (with edit options)
                CZ.HomePageViewModel.panelShowToursList(true);
            });

            $('#mnuMine').click(function (event)
            {
                if (Menus.isDisabled) return;
                if (!Menus.isSignedIn)
                {
                    // toggle display of register / log in pane
                    CZ.HomePageViewModel.panelToggleLogin();
                }
                else
                {
                    // show my collections overlay (with preference for display of My Collections if viewing Cosmos)
                    CZ.StartPage.show(true);
                }
            });

            $('#mnuSearch').click(function (event)
            {
                if (Menus.isDisabled) return;
                // toggle display of search pane
                CZ.HomePageViewModel.panelToggleSearch();
            });

            $('#mnuProfile').click(function (event)
            {
                if (Menus.isDisabled) return;
                if (Menus.isSignedIn)
                {
                    // toggle display of profile pane (contains log out option)
                    CZ.HomePageViewModel.panelToggleProfile();
                }
                else
                {
                    // toggle display of register / log in pane
                    CZ.HomePageViewModel.panelToggleLogin();
                }
            });

        });



    })(CZ.Menus || (CZ.Menus = {}));
    var Menus = CZ.Menus;
})(CZ || (CZ = {}));