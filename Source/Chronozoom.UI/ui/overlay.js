var CZ;
(function (CZ) {
    (function (Overlay) {


        /**********************
         * Private Properties *
         **********************/
        
        var initialized     = false;
        var quantity        = (screen.width >= 1800 || screen.height >= 1800) ? 9 : 6;      // how many tiles to display in featured or recent lists
        var defaultImages   = ['/images/background.jpg',   '/images/default-tile.png'];     // use the default tile background if these are provided by API
        var brightImages    = ['/images/tile-default.jpg', '/images/tile-bighistory.jpg'];  // do not darken the background for tiles with these images
        var cosmosImage     = '/images/tile-bighistory.jpg';
        var $overlay        = $('#overlay');
        var $listWelcome;
        var $listCollections;
        var $listFeatured;
        var $listUpdated;
        var $listFavorites;
        var $templates;
        var $templateCollection;
        var $templateFeatured;
        var $templateTimeline;
        var $templateExhibit;
        var $templateNoFavorite;
        var $templateMarkPublic;



        /******************
         * Public Methods *
         ******************/

        function Initialize()
        {
            $listWelcome        = $overlay.find('#listWelcome');
            $listCollections    = $overlay.find('#listCollections');
            $listFeatured       = $overlay.find('#listFeatured');
            $listUpdated        = $overlay.find('#listUpdated');
            $listFavorites      = $overlay.find('#listFavorites');
            $templateCollection = $overlay.find('#tileCollection').html();
            $templateFeatured   = $overlay.find('#tileFeatured'  ).html();
            $templateTimeline   = $overlay.find('#tileTimeline'  ).html();
            $templateExhibit    = $overlay.find('#tileExhibit'   ).html();
            $templateNoFavorite = $overlay.find('#msgNoFavorite' ).html();
            $templateMarkPublic = $overlay.find('#msgMarkPublic' ).html();

            $('.overlay-list')
                .mouseenter(function (event)
                {
                    $(this).find('.hint').removeClass('hidden');
                })
                .mouseleave(function (event)
                {
                    $(this).find('.hint').addClass('hidden');
                })
            ;

            if (screen.width >= 1024 || screen.height >= 768)
            {
                $('#themePicker option:selected').attr('selected', null);
                $('#themePicker option[value="' + localStorage.getItem('theme') + '"]').attr('selected', 'selected');

                $('#themePicker').change(function (event)
                {
                    var theme = $('#themePicker option:selected').val();

                    $('body')
                    .removeClass(localStorage.getItem('theme'))
                    .addClass(theme);

                    localStorage.setItem('theme', theme);
                });

                $('#themePicker').removeClass('hidden');
            }

            initialized = true;

            populateFeatured(); // never changes during page lifecycle and shown in all views
        }
        Overlay.Initialize = Initialize;


        function Hide()
        {
            CZ.Menus.isOverlay = false;
            CZ.Menus.Refresh();

            if (CZ.Settings.isCosmosCollection)
            {
                $('.header-regimes' ).visible();
            }
            $('.header-breadcrumbs' ).visible();

            $overlay.fadeOut();
        }
        Overlay.Hide = Hide;


        function Show(preferPersonalizedLayout)
        {
            CZ.HomePageViewModel.closeAllForms();
            $('.header-regimes'     ).invisible();
            $('.header-breadcrumbs' ).invisible();

            CZ.Menus.isOverlay = true;
            CZ.Menus.Refresh();

            if (initialized)
            {
                layout(preferPersonalizedLayout);
            }

            $overlay.fadeIn();
        }
        Overlay.Show = Show;


        function ExploreBigHistory()
        {
            if (isInCosmos(window.location.pathname))
            {
                // already in the big history collection
                Hide();                                     // hide overlay
                $('#regime-link-cosmos').trigger('click');  // visually expand out to full view
            }
            else
            {
                // switch to big history as in a different collection
                window.location.href = '/#/t00000000-0000-0000-0000-000000000000@x=0'; // x=0 so don't start with overlay
            }
        }
        Overlay.ExploreBigHistory = ExploreBigHistory;


        function ExploreIntroTour()
        {
            if (isInCosmos(window.location.pathname))
            {
                // already in the big history collection
                if (CZ.Tours.tours.length > 0)
                {
                    // at least the first tour (the one we want) has been initialized so start tour
                    Hide();
                    CZ.Tours.takeTour(CZ.Tours.tours[0]);
                }
            }
            else
            {
                // switch to big history and auto-start tour
                window.location.href = '/#/t00000000-0000-0000-0000-000000000000@auto-tour=cd44d92d-8af3-4c4e-ab28-bf9a9397ea27';
            }
        }
        Overlay.ExploreIntroTour = ExploreIntroTour;



        /*******************
         * Private Methods *
         *******************/

        function layout(preferPersonalizedLayout)
        {
            if
            (
                (typeof CZ.Authoring === 'undefined')   ||
                (typeof CZ.Settings === 'undefined')    ||
                (preferPersonalizedLayout === false)    ||
                (!preferPersonalizedLayout  &&  CZ.Settings.isCosmosCollection) ||
                (!CZ.Authoring.isEnabled    && !CZ.Settings.isAuthorized)
            )
            {
                // home page view

                populateUpdated();

                $listCollections.hide();
                $listFavorites.hide();

                $listWelcome.show();
                $listFeatured.show();
                $listUpdated.show();
            }
            else
            {
                // my collections view

                populateCollections();
                populateFavorites();

                $listWelcome.hide();
                $listUpdated.hide();

                $listCollections.show();
                $listFeatured.show();
                $listFavorites.show();
            }
        }


        function populateFeatured()
        {
            $.getJSON(constants.featuredContentList, function (response)
            {
                var json    = response ? response : [];
                var $list   = $('<div></div>');

                $.each(json, function (index, item)
                {
                    if (index < quantity)
                    {
                        var tile =  $templateFeatured
                                    .replace(new RegExp('{{contentTitle}}', 'g'),   simpleClean(item.Title))
                                    .replace(           '{{collectionCurator}}',    item.Curator)
                                    .replace(           '{{contentBackground}}',    item.Background)
                                    .replace(           '{{contentURL}}',           item.Link)
                        ;
                        $list.append(tile);
                    }
                });

                $listFeatured.find('.overlay-tile').off('click').remove();
                $listFeatured
                    .append($list.html())
                    .find('.overlay-tile').click(function (event)
                    {
                        var newURL = $(this).attr('data-url');

                        if (newURL != '')
                        {
                            window.location.href = newURL;

                            if
                            (
                                window.location.pathname === newURL.split('#')[0] &&
                                (window.location.hash.length > 1 || newURL.indexOf('#') > -1)
                            )
                            {
                                setTimeout(function ()
                                {
                                    // if same page and has # anchor then .href won't reload
                                    // so force reload (using cache) but delay to give .href
                                    // a chance to fire first.
                                    window.location.reload();
                                },  200);
                            }
                        }
                    })
                ;

                loadCustomBackgrounds($listFeatured, false);
            })
            .fail(function ()
            {
                console.log('[ERROR] CZ.Overlay:populateFeatured');
            });
        }


        function populateUpdated()
        {
            CZ.Service.getRecentlyUpdatedExhibits(quantity).then(function (response)
            {
                var json        = response ? response : [];
                var $list       = $('<div></div>');
                var msg         = $templateMarkPublic;

                $.each(json, function (index, item)
                {
                    var year = CZ.Dates.convertCoordinateToYear(item.Year);
                    var image = CZ.Service.MakeSecureUri(item.CustomBackground);
                    var tile =  $templateExhibit
                                .replace(           '{{collectionTitle}}',      simpleClean(item.CollectionName))
                                .replace(           '{{collectionCurator}}',    item.CuratorName)
                                .replace(           '{{exhibitImage}}',         image)
                                .replace(new RegExp('{{exhibitTitle}}', 'g'),   simpleClean(item.Title))
                                .replace(           '{{exhibitYear}}',          year.year + '&nbsp;' + year.regime)
                                .replace(           '{{exhibitURL}}',           item.Link)
                    ;
                    $list.append(tile);
                });

                if (json.length < quantity || quantity > 6) $list.append(msg);

                $listUpdated.find('.overlay-list-note').remove(); // msg
                $listUpdated.find('.overlay-tile').off('click').remove();
                $listUpdated
                    .append($list.html())
                    .find('.overlay-tile')
                        .click(function (event)
                        {
                            if ($(this).attr('data-url') != '')
                            {
                                window.location.href = $(this).attr('data-url');
                            }
                            Hide();
                        })
                ;

                loadCustomBackgrounds($listUpdated, true);
            },
            function (error)
            {
                console.log('[ERROR] CZ.Overlay:populateUpdated');
            });
        }


        function populateCollections()
        {
            CZ.Service.getEditableCollections(true).then(function (response)
            {
                var json         = response ? response : [];
                var $list        = $('<div></div>');

                $.each(json, function (index, item)
                {
                    var url     = item.TimelineUrl  || '';
                    var image = item.ImageUrl || '';

                    if (hasDefaultBackground(image))        image   = '';
                    if (image === '' && isInCosmos(url))    image   = cosmosImage;
                    if (item.CurrentCollection)             url     = '';

                    image = CZ.Service.MakeSecureUri(image);
                    var tile =  $templateCollection
                                .replace(           '{{collectionURL}}',            url)
                                .replace(           '{{collectionBackground}}',     image)
                                .replace(new RegExp('{{collectionTitle}}', 'g'),    simpleClean(item.Title) || '')
                                .replace(           '{{collectionCurator}}',        item.Author             || '')
                    ;
                    $list.append(tile);
                });

                $listCollections.find('.overlay-tile').off('click').remove();
                $listCollections
                    .append($list.html())
                    .find('.overlay-tile').click(function (event)
                    {
                        if ($(this).attr('data-url') != '')
                        {
                            window.location.href = $(this).attr('data-url');
                        }
                        Hide();
                    })
                ;

                loadCustomBackgrounds($listCollections, true);
            },
            function (error)
            {
                console.log('[ERROR] CZ.Overlay:populateCollections');
            });
        }


        function populateFavorites()
        {
            CZ.Service.getUserFavorites().then(function (response)
            {
                var json         = response ? response : [];
                var $list        = $('<div></div>');

                $.each(json, function (index, item)
                {
                    var image   = item.CustomBackground || '';

                    if (hasDefaultBackground(image))    image   = '';
                    if (item.IsCosmosCollection)        image   = cosmosImage;

                    image = CZ.Service.MakeSecureUri(image);
                    var tile =  $templateTimeline
                                .replace(new RegExp('{{timelineTitle}}', 'g'),  simpleClean(item.Title)             || '')
                                .replace(           '{{timelineURL}}',          item.Link                           || '')
                                .replace(           '{{collectionBackground}}', image)
                                .replace(           '{{collectionTitle}}',      simpleClean(item.CollectionName)    || '')
                                .replace(           '{{collectionCurator}}',    item.CuratorName                    || '')
                    ;
                    $list.append(tile);
                });

                if (json.length === 0)
                {
                    var tile =  $templateTimeline
                                .replace(new RegExp('{{timelineTitle}}', 'g'),  'Big Bang to Present Day')
                                .replace(           '{{timelineURL}}',          '/#/t00000000-0000-0000-0000-000000000000@x=0')
                                .replace(           '{{collectionBackground}}', cosmosImage)
                                .replace(           '{{collectionTitle}}',      'Cosmos')
                                .replace(           '{{collectionCurator}}',    'ChronoZoom')
                    ;
                    var msg  = $templateNoFavorite;
                    $list
                        .append(tile)
                        .append(msg)
                    ;
                }

                $listFavorites.find('.overlay-list-note').remove(); // msg
                $listFavorites.find('.overlay-tile').off('click').remove();
                $listFavorites
                    .append($list.html())
                    .find('.overlay-tile').click(function (event)
                    {
                        if ($(this).attr('data-url') != '')
                        {
                            window.location.href = $(this).attr('data-url');
                        }
                        Hide();
                    })
                ;

                loadCustomBackgrounds($listFavorites);
            },
            function (error)
            {
                console.log('[ERROR] CZ.Overlay:populateFavorites');
            });
        }


        this.hasBrightBackground =
        function hasBrightBackground(imageURL)
        {
            if (typeof imageURL != 'string') return true;

            return $.inArray(imageURL.toLowerCase(), brightImages) > -1;
        };

        this.hasDefaultBackground =
        function hasDefaultBackground(imageURL)
        {
            if (typeof imageURL != 'string') return true;

            return $.inArray(imageURL.toLowerCase(), defaultImages) > -1;
        };


        this.isInCosmos =
        function isInCosmos(url)
        {
            if (typeof url != 'string') return false;

            var path    = url.toLowerCase().split('#')[0];
            var matches = ['/', '/chronozoom', '/chronozoom/', '/chronozoom/cosmos', '/chronozoom/cosmos/'];

            return $.inArray(path, matches) > -1;
        };


        function loadCustomBackgrounds($list, darken)
        {
            darken = (darken === true) || false;

            $list.find('.overlay-tile:not([data-image=""])').each(function (index, tile)
            {
                var $tile = $(tile);

                if ($tile.attr('data-image') || '' != '')
                {
                    if (darken && !hasBrightBackground($tile.attr('data-image')))
                    {
                        // use rgba gradient to darken provided custom background image
                        $tile
                        .css('background', 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(' + $tile.attr('data-image') + ')')
                        .css('background-size', 'cover') // do not combine with .css('background') call - this way browser will recalc scale
                        .attr('data-image', '');
                    }
                    else
                    {
                        // embed provided custom background image as is without darkening
                        $tile
                        .css('background', '#445 url(' + $tile.attr('data-image') + ')')
                        .css('background-size', 'cover') // do not combine with .css('background') call - this way browser will recalc scale
                        .attr('data-image', '');
                    }
                }
            });
        }


        function simpleClean(title)
        {
            // DB has collection, timeline and exhibit titles containing double quotes and "<" and ">".
            // Double quotes breaks rendering in title attributes, and "<" or ">" in elements, so this
            // function replaces them. It is NOT a substitute for a full cleansing for XSS, etc.
            if (typeof title === 'undefined') return '';
            return title
                    .replace(new RegExp('<', 'g'), "&lt;")
                    .replace(new RegExp('>', 'g'), "&gt;")
                    .replace(new RegExp('"', 'g'), "&quot;");
        }


    })(CZ.Overlay || (CZ.Overlay = {}));
    var Overlay = CZ.Overlay;
})(CZ || (CZ = {}));