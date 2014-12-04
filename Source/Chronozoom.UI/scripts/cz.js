/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='timescale.ts'/>
/// <reference path='viewport-controller.ts'/>
/// <reference path='gestures.ts'/>
/// <reference path='tours.ts'/>
/// <reference path='virtual-canvas.ts'/>
/// <reference path='uiloader.ts'/>
/// <reference path='media.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>
/// <reference path='../ui/controls/medialist.ts'/>
/// <reference path='../ui/auth-edit-timeline-form.ts'/>
/// <reference path='../ui/auth-edit-exhibit-form.ts'/>
/// <reference path='../ui/auth-edit-contentitem-form.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>
/// <reference path='../ui/auth-edit-collection-form.ts'/>
/// <reference path='../ui/auth-edit-collection-editors.ts'/>
/// <reference path='../ui/header-edit-form.ts' />
/// <reference path='../ui/header-edit-profile-form.ts'/>
/// <reference path='../ui/header-login-form.ts'/>
/// <reference path='../ui/header-search-form.ts' />
/// <reference path='../ui/timeseries-graph-form.ts'/>
/// <reference path='../ui/timeseries-data-form.ts'/>
/// <reference path='../ui/tourslist-form.ts'/>
/// <reference path='../ui/tour-caption-form.ts'/>
/// <reference path='../ui/message-window.ts'/>
/// <reference path='../ui/header-session-expired-form.ts'/>
/// <reference path='../ui/mediapicker-form.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
/// <reference path='extensions/extensions.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
/// <reference path='plugins/error-plugin.ts'/>
/// <reference path='plugins/utility-plugins.ts'/>
var constants;

var CZ;
(function (CZ) {
    CZ.timeSeriesChart;
    CZ.leftDataSet;
    CZ.rightDataSet;

    (function (HomePageViewModel) {
        // Contains mapping of jQuery selector to HTML file, which is used to initialize the various panels via CZ.UILoader.
        var _uiMap =
        {
            "#header-edit-form": "/ui/header-edit-form.html",
            "#auth-edit-timeline-form": "/ui/auth-edit-timeline-form.html",
            "#auth-edit-exhibit-form": "/ui/auth-edit-exhibit-form.html",
            "#auth-edit-contentitem-form": "/ui/auth-edit-contentitem-form.html",
            "$('<div></div>')": "/ui/contentitem-listbox.html",
            "#profile-form": "/ui/header-edit-profile-form.html",
            "#login-form": "/ui/header-login-form.html",
            "#auth-edit-tours-form": "/ui/auth-edit-tour-form.html",
            "$('<div><!--Tours Authoring--></div>')": "/ui/tourstop-listbox.html",
            "#toursList": "/ui/tourslist-form.html",
            "$('<div><!--Tours list item --></div>')": "/ui/tour-listbox.html",
            "#timeSeriesContainer": "/ui/timeseries-graph-form.html",
            "#timeSeriesDataForm": "/ui/timeseries-data-form.html",
            "#message-window": "/ui/message-window.html",
            "#header-search-form": "/ui/header-search-form.html",
            "#header-session-expired-form": "/ui/header-session-expired-form.html",
            "#tour-caption-form": "/ui/tour-caption-form.html",
            "#mediapicker-form": "/ui/mediapicker-form.html",
            "#overlay": "/ui/overlay.html",
            "#auth-edit-collection-form": "/ui/auth-edit-collection-form.html",
            "#auth-edit-collection-editors": "/ui/auth-edit-collection-editors.html"
        };

        HomePageViewModel.sessionForm;
        HomePageViewModel.rootCollection;

        function UserCanEditCollection(profile)
        {
            // can't edit if no profile, no display name or no supercollection
            if (!profile || !profile.DisplayName || !CZ.Service.superCollectionName)
            {
                return false;
            }

            // override - anyone can edit the sandbox
            if (CZ.Service.superCollectionName.toLowerCase() === "sandbox")
            {
                return true;
            }

            // if here then logged in and on a page (other than sandbox) with a supercollection and collection
            // so return canEdit Boolean, which was previously set after looking up permissions in db.
            return CZ.Service.canEdit;
        }

        function InitializeToursUI(profile, forms)
        {
            CZ.Tours.tourCaptionFormContainer = forms[16];
            var allowEditing =UserCanEditCollection(profile);

            CZ.Tours.takeTour = function(tour)
            {
                CZ.HomePageViewModel.closeAllForms();
                CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption
                (
                    CZ.Tours.tourCaptionFormContainer,
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-tour-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-tour-form-title",
                        contentContainer: ".cz-form-content",
                        minButton: ".cz-tour-form-min-btn > .cz-form-btn",
                        captionTextarea: ".cz-form-tour-caption",
                        tourPlayerContainer: ".cz-form-tour-player",
                        bookmarksCount: ".cz-form-tour-bookmarks-count",
                        narrationToggle: ".cz-toggle-narration",
                        context: tour
                    }
                );
                CZ.Tours.tourCaptionForm.show();
                CZ.Tours.removeActiveTour();
                CZ.Tours.activateTour(tour, undefined);
            };

            CZ.HomePageViewModel.panelShowToursList = function (canEdit)
            {
                // canEdit undefined    = use allowEditing
                // canEdit false        = read only rendering
                // canEdit true         = edit rights rendering
                if (typeof canEdit == 'undefined') canEdit = allowEditing;


                if (canEdit && CZ.Tours.tours)
                {
                    if (CZ.Tours.tours.length === 0)
                    {
                        // if there are no tours to show and user has tour editing rights, lets fire off the add a tour dialog instead
                        CZ.Overlay.Hide();
                        CZ.HomePageViewModel.closeAllForms();
                        CZ.Authoring.UI.createTour();
                        return;
                    }
                }

                var toursListForm = getFormById("#toursList");
                if (toursListForm.isFormVisible)
                {
                    toursListForm.close();
                }
                else
                {
                    CZ.Overlay.Hide();
                    closeAllForms();
                    var form = new CZ.UI.FormToursList
                    (
                        forms[9],
                        {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            tourTemplate: forms[10],
                            tours: CZ.Tours.tours,
                            takeTour: CZ.Tours.takeTour,
                            editTour: canEdit ? function (tour)
                            {
                                if (CZ.Authoring.showEditTourForm) CZ.Authoring.showEditTourForm(tour);
                            }
                            : null,
                            createTour: ".cz-form-create-tour"
                        }
                    );
                    form.show();
                }
            };
        }

        var defaultRootTimeline = { title: "My Timeline", x: 1950, endDate: 9999, children: [], parent: { guid: null } };

        $(document).ready(function () {
            // ensures there will be no 'console is undefined' errors
            window.console = window.console || (function () {
                var c = {};
                c.log = c.warn = c.debug = c.info = c.log = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();

            $('.bubbleInfo').hide();

            // auto-hourglass
            $('#wait').hide();

            $(document).ajaxStart(function () {
                $('#wait').show();
            });
            $(document).ajaxStop(function () {
                $('#wait').hide();
            });

            // overlay & general wrapper theme
            var theme = localStorage.getItem('theme') || '';
            if (theme === '')
            {
                theme = 'theme-linen'; // initial
                localStorage.setItem('theme', theme);
            }
            $('body').addClass(theme);

            // populate collection names from URL
            var url = CZ.UrlNav.getURL();
            HomePageViewModel.rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;

            // register ChronoZoom extensions
            CZ.Extensions.registerExtensions();

            // register ChronoZoom media pickers
            CZ.Media.SkyDriveMediaPicker.isEnabled = true;
            CZ.Media.initialize();
            CZ.Common.initialize();

            // hook logo click
            $('.header-logo').click(function ()
            {
                //window.location.href = '/';
                CZ.Overlay.Show(false);  // false = home page overlay
            });

            // ensure we have a supercollection for getCanEdit and other API calls.
            if (typeof CZ.Service.superCollectionName === 'undefined' && CZ.Common.isInCosmos()) CZ.Service.superCollectionName = 'chronozoom';

            // check if current user has edit permissions before continuing with load
            // since other parts of load need to know if can display edit buttons etc.
            CZ.Service.getCanEdit().done(function (result)
            {
                CZ.Service.canEdit = (result === true);
                finishLoad();
            });
        });

        function finishLoad()
        {
            // only invoked after user's edit permissions are checked (AJAX callback)
            CZ.UILoader.loadAll(_uiMap).done(function ()
            {
                var forms = arguments;

                CZ.Settings.isCosmosCollection = CZ.Common.isInCosmos();
                if (CZ.Settings.isCosmosCollection) $('.header-regimes').show();

                CZ.Menus.isEditor = CZ.Service.canEdit;
                CZ.Menus.Refresh();
                CZ.Overlay.Initialize();

                CZ.timeSeriesChart = new CZ.UI.LineChart(forms[11]);

                CZ.HomePageViewModel.panelToggleTimeSeries = function ()
                {
                    CZ.Overlay.Hide();
                    var tsForm = getFormById('#timeSeriesDataForm');
                    if (tsForm === false)
                    {
                        closeAllForms();

                        var timeSeriesDataFormDiv = forms[12];
                        var timeSeriesDataForm = new CZ.UI.TimeSeriesDataForm
                        (
                            timeSeriesDataFormDiv,
                            {
                                activationSource: $(),
                                closeButton: ".cz-form-close-btn > .cz-form-btn"
                            }
                        );
                        timeSeriesDataForm.show();
                    }
                    else
                    {
                        if (tsForm.isFormVisible)
                        {
                            tsForm.close();
                        }
                        else
                        {
                            closeAllForms();
                            tsForm.show();
                        }
                    }
                };

                CZ.HomePageViewModel.panelToggleSearch = function ()
                {
                    var searchForm = getFormById("#header-search-form");
                    if (searchForm === false)
                    {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderSearch
                        (
                            forms[14],
                            {
                                activationSource: $(this),
                                navButton: ".cz-form-nav",
                                closeButton: ".cz-form-close-btn > .cz-form-btn",
                                titleTextblock: ".cz-form-title",
                                searchTextbox: ".cz-form-search-input",
                                searchResultsBox: ".cz-form-search-results",
                                progressBar: ".cz-form-progress-bar",
                                resultSections: ".cz-form-search-results > .cz-form-search-section",
                                resultsCountTextblock: ".cz-form-search-results-count"
                            }
                        );
                        form.show();
                    }
                    else
                    {
                        if (searchForm.isFormVisible)
                        {
                            searchForm.close();
                        }
                        else
                        {
                            closeAllForms();
                            searchForm.show();
                        }
                    }
                };

                $("#editCollectionButton img").click(function () {
                    closeAllForms();
                    var form = new CZ.UI.FormEditCollection(forms[19], {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        deleteButton: '.cz-form-delete',
                        titleTextblock: ".cz-form-title",
                        saveButton: ".cz-form-save",
                        errorMessage: '.cz-form-errormsg',
                        collectionName: '#cz-collection-name',
                        collectionPath: '#cz-collection-path',
                        collectionTheme: CZ.Settings.theme,
                        backgroundInput: $(".cz-form-collection-background"),
                        kioskmodeInput: $(".cz-form-collection-kioskmode"),
                        mediaListContainer: ".cz-form-medialist",
                        timelineBackgroundColorInput: $(".cz-form-timeline-background"),
                        timelineBackgroundOpacityInput: $(".cz-form-timeline-background-opacity"),
                        timelineBorderColorInput: $(".cz-form-timeline-border"),
                        exhibitBackgroundColorInput: $(".cz-form-exhibit-background"),
                        exhibitBackgroundOpacityInput: $(".cz-form-exhibit-background-opacity"),
                        exhibitBorderColorInput: $(".cz-form-exhibit-border"),
                        chkDefault: '#cz-form-collection-default',
                        chkPublic:  '#cz-form-public-search',
                        chkEditors: '#cz-form-multiuser-enable',
                        btnEditors: '#cz-form-multiuser-manage'
                    });
                    form.show();
                });

                $('body').on('click', '#cz-form-multiuser-manage', function (event) {
                    var form = new CZ.UI.FormManageEditors(forms[20], {
                        activationSource: $(this),
                        navButton: ".cz-form-nav",
                        titleTextblock: ".cz-form-title",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        saveButton: ".cz-form-save"
                    });
                    form.show();
                });

                CZ.Authoring.initialize(CZ.Common.vc, {
                    showMessageWindow: function (message, title, onClose) {
                        var wnd = new CZ.UI.MessageWindow(forms[13], message, title);
                        if (onClose)
                            wnd.container.bind("close", function () {
                                wnd.container.unbind("close", onClose);
                                onClose();
                            });
                        wnd.show();
                    },
                    hideMessageWindow: function () {
                        var wnd = forms[13].data("form");
                        if (wnd)
                            wnd.close();
                    },
                    showEditTourForm: function (tour) {
                        CZ.Tours.removeActiveTour();
                        var form = new CZ.UI.FormEditTour(forms[7], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            addStopButton: ".cz-form-tour-addstop",
                            titleInput: ".cz-form-title",
                            tourStopsListBox: "#stopsList",
                            tourStopsTemplate: forms[8],
                            context: tour
                        });
                        form.show();
                    },
                    showCreateTimelineForm: function (timeline) {
                        CZ.Authoring.hideMessageWindow();
                        CZ.Authoring.mode = "createTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            mediaListContainer: ".cz-form-medialist",
                            backgroundUrl: ".cz-form-background-url",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: ".cz-form-errormsg",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateRootTimelineForm: function (timeline) {
                        CZ.Authoring.mode = "createRootTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            mediaListContainer: ".cz-form-medialist",
                            backgroundUrl: ".cz-form-background-url",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: ".cz-form-errormsg",
                            context: timeline
                        });
                        form.show();
                    },
                    showEditTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            mediaListContainer: ".cz-form-medialist",
                            backgroundUrl: ".cz-form-background-url",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: ".cz-form-errormsg",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateExhibitForm: function (exhibit) {
                        CZ.Authoring.hideMessageWindow();
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditExhibitForm: function (exhibit) {
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditContentItemForm: function (ci, e, prevForm, noAnimation) {
                        var form = new CZ.UI.FormEditCI(forms[3], {
                            activationSource: $(),
                            prevForm: prevForm,
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            titleInput: ".cz-form-item-title",
                            mediaSourceInput: ".cz-form-item-mediasource",
                            mediaInput: ".cz-form-item-mediaurl",
                            descriptionInput: ".cz-form-item-descr",
                            attributionInput: ".cz-form-item-attribution",
                            mediaTypeInput: ".cz-form-item-media-type",
                            mediaListContainer: ".cz-form-medialist",
                            context: {
                                exhibit: e,
                                contentItem: ci
                            }
                        });
                        form.show(noAnimation);
                    }
                });

                HomePageViewModel.sessionForm = new CZ.UI.FormHeaderSessionExpired(forms[15], {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: "",
                    sessionTimeSpan: "#session-time",
                    sessionButton: "#session-button"
                });

                var loginForm = new CZ.UI.FormLogin
                (
                    forms[6],
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        titleInput: ".cz-form-item-title",
                        context: ""
                    }
                );
                CZ.HomePageViewModel.panelToggleLogin = function ()
                {
                    if (loginForm.isFormVisible)
                    {
                        loginForm.close();
                    }
                    else
                    {
                        closeAllForms();
                        loginForm.show();
                    }
                };

                var profileForm = new CZ.UI.FormEditProfile
                (
                    forms[5],
                    {
                        activationSource: $(),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        saveButton: "#cz-form-save",
                        logoutButton: "#cz-form-logout",
                        titleInput: ".cz-form-item-title",
                        usernameInput: ".cz-form-username",
                        emailInput: ".cz-form-email",
                        agreeInput: ".cz-form-agree",
                        loginPanel: "#login-panel",
                        profilePanel: "#profile-panel",
                        loginPanelLogin: "#profile-panel.auth-panel-login",
                        context: "",
                        allowRedirect: true
                    }
                );
                CZ.HomePageViewModel.panelToggleProfile = function ()
                {
                    if (profileForm.isFormVisible)
                    {
                        profileForm.close();
                    }
                    else
                    {
                        closeAllForms();
                        profileForm.show();
                    }
                };

                CZ.Service.getProfile().done(function (data)
                {
                    if (data !== '')
                    {
                        CZ.Settings.isAuthorized            = true;
                        CZ.Menus.isSignedIn                 = true;
                        CZ.Menus.Refresh();
                        CZ.Settings.userSuperCollectionName = data.DisplayName || '';
                        CZ.Settings.userCollectionName      = data.DisplayName || '';
                        CZ.Settings.userDisplayName         = data.DisplayName || '';
                        CZ.Authoring.timer                  = setTimeout(function ()
                        {
                            CZ.Authoring.showSessionForm();
                        }, (CZ.Settings.sessionTime - 60) * 1000);
                    }

                    CZ.Authoring.isEnabled = UserCanEditCollection(data);
                    InitializeToursUI(data, forms);
                })
                .fail(function (error)
                {
                    var canEdit                 = UserCanEditCollection(null);
                    CZ.Authoring.isEnabled      = canEdit;
                    CZ.Settings.isAuthorized    = canEdit;

                    InitializeToursUI(null, forms);
                })
                .always(function ()
                {
                    // *****************************
                    // *** Collection Load Logic ***
                    // *****************************

                    // load the entire collection
                    CZ.Common.loadData().then(function (response)
                    {
                        // if collection is empty
                        if (!response)
                        {
                            // if user has edit rights
                            if (CZ.Authoring.isEnabled)
                            {
                                // show a form to create the root timeline
                                if (CZ.Authoring.showCreateRootTimelineForm)
                                {
                                    CZ.Authoring.showCreateRootTimelineForm(defaultRootTimeline);
                                }
                            }
                            else
                            {
                                // tell the user there is no content
                                CZ.Authoring.showMessageWindow
                                (
                                    'There is no content in this collection yet. '               +
                                    'Please click on the ChronoZoom logo, (found just above this message,) '  +
                                    'to see some other collections that you can view.',
                                    "Collection Has No Content"
                                );
                            }
                        }
                    });

                    // get and store the collection title and owner
                    CZ.Service.getCollection().done(function (collection)
                    {
                        if (collection != null)
                        {
                            CZ.Common.collectionTitle   = collection.Title || '';
                            CZ.Settings.collectionOwner = collection.User.DisplayName;
                        }

                        //  set the canvas edit collection icon title
                        $('#editCollectionButton').find('.title').text(CZ.Common.collectionTitle);
                    });


                    // **************************************
                    // *** Start-Up Overlay Display Logic ***
                    // **************************************

                    // if user can edit collection then unhide the canvas edit collection icon
                    if (CZ.Authoring.isEnabled) $('#editCollectionButton').find('.hidden').removeClass('hidden');

                    // if logged in and user hasn't completed profile
                    if (CZ.Menus.isSignedIn && CZ.Settings.userSuperCollectionName === '')
                    {
                        // show profile form on top of home page overlay
                        CZ.Overlay.Show();
                        profileForm.show();
                        $('#username').focus();
                    }
                    // else if logged in and my collections was requested
                    else if (CZ.Menus.isSignedIn && sessionStorage.getItem('showMyCollections') === 'requested')
                    {
                        // show my collections overlay
                        CZ.Overlay.Show(true);
                    }
                    else
                    {
                        if  // if no auto-tour and collection is Big History collection
                        (
                            CZ.Tours.getAutoTourGUID() === ''   // <--  Always check first as fn must fire.
                            &&                                  //      This fn sets up tours.js's parseTours
                            (                                   //      to auto-start a tour, if specified.
                                (CZ.Settings.isCosmosCollection && window.location.hash === '') ||
                                window.location.hash === '#/t00000000-0000-0000-0000-000000000000'
                            )
                        )
                        {
                            // show home page overlay
                            CZ.Overlay.Show();
                        }
                    }

                    // remove any my collections queued request
                    sessionStorage.removeItem('showMyCollections');

                    // remove splash screen
                    $('#splash').fadeOut('slow');
                });

            });

            CZ.Service.getServiceInformation().then(function (response) {
                CZ.Settings.contentItemThumbnailBaseUri = response.thumbnailsPath;
                CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
            });

            CZ.Settings.applyTheme(null, CZ.Service.superCollectionName != null);

            // If not the default supercollection's default collection then look up the appropriate collection's theme
            if (CZ.Service.superCollectionName)
            {
                CZ.Service.getCollections(CZ.Service.superCollectionName).then(function (response)
                {
                    $(response).each(function (index) {
                        if
                        (
                            response[index] &&
                            (
                                (response[index].Default && ((typeof CZ.Service.collectionName) === 'undefined')) ||
                                (response[index].Path === CZ.Service.collectionName)
                            )
                        )
                        {
                            var themeData = null;
                            try  {
                                themeData = JSON.parse(response[index].theme);
                            } catch (e) {
                            }

                            CZ.Settings.applyTheme(themeData, false);
                        }
                    });
                });
            }

            $('#breadcrumbs-nav-left').click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right').click(CZ.BreadCrumbs.breadCrumbNavRight);

            $('#biblCloseButton').mouseout(function () {
                CZ.Common.toggleOffImage('biblCloseButton', 'png');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('biblCloseButton', 'png');
            });

            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                // Suppress the default iOS elastic pan/zoom actions.
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            }

            if (navigator.userAgent.indexOf('Mac') != -1) {
                // Disable Mac OS Scrolling Bounce Effect
                var body = document.getElementsByTagName('body')[0];
                body.style.overflow = "hidden";
            }

            // init seadragon. set path to image resources for nav buttons
            Seadragon.Config.imagePath = CZ.Settings.seadragonImagePath;

            if (window.location.hash)
                CZ.Common.startHash = window.location.hash; // to be processes after the data is loaded

            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();

            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc);
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax));
            var timeSeriesGestures = CZ.Gestures.getPanPinGesturesStream($("#timeSeriesContainer"));
            var jointGesturesStream = canvasGestures.Merge(axisGestures.Merge(timeSeriesGestures));

            CZ.Common.controller = new CZ.ViewportController.ViewportController2(function (visible) {
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                var markerPos = CZ.Common.axis.markerPosition;
                var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;

                CZ.Common.vc.virtualCanvas("setVisible", visible, CZ.Common.controller.activeAnimation);
                CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
                vp = CZ.Common.vc.virtualCanvas("getViewport");
                if (CZ.Tours.pauseTourAtAnyAnimation) {
                    CZ.Tours.tourPause();
                    CZ.Tours.pauseTourAtAnyAnimation = false;
                }

                var hoveredInfodot = CZ.Common.vc.virtualCanvas("getHoveredInfodot");
                var actAni = CZ.Common.controller.activeAnimation != undefined;

                if (actAni) {
                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                    CZ.Common.updateMarker();
                }

                updateTimeSeriesChart(vp);
            }, function () {
                return CZ.Common.vc.virtualCanvas("getViewport");
            }, jointGesturesStream);

            var hashChangeFromOutside = true;

            // URL Nav: update URL when animation is complete
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.bookmark) {
                    CZ.UrlNav.navigationAnchor = CZ.UrlNav.navStringTovcElement(CZ.Common.setNavigationStringTo.bookmark, CZ.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = CZ.Common.setNavigationStringTo.bookmark;
                } else {
                    if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.id == id)
                        CZ.UrlNav.navigationAnchor = CZ.Common.setNavigationStringTo.element;

                    var vp = CZ.Common.vc.virtualCanvas("getViewport");
                    window.location.hash = CZ.UrlNav.vcelementToNavString(CZ.UrlNav.navigationAnchor, vp);
                }
                CZ.Common.setNavigationStringTo = null;
            });

            // URL Nav: handle URL changes from outside
            window.addEventListener("hashchange", function () {
                if (window.location.hash && hashChangeFromOutside && CZ.Common.hashHandle) {
                    var hash = window.location.hash;
                    var visReg = CZ.UrlNav.navStringToVisible(window.location.hash.substring(1), CZ.Common.vc);
                    if (visReg) {
                        CZ.Common.isAxisFreezed = true;
                        CZ.Common.controller.moveToVisible(visReg, true);

                        // to make sure that the hash is correct (it can be incorrectly changed in onCurrentlyObservedInfodotChanged)
                        if (window.location.hash != hash) {
                            hashChangeFromOutside = false;
                            window.location.hash = hash;
                        }
                    }
                    CZ.Common.hashHandle = true;
                } else
                    hashChangeFromOutside = true;
            });

            /*
            // Axis: enable showing thresholds
            CZ.Common.controller.onAnimationComplete.push(function () {
                //CZ.Common.ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds enabled"));
            });

            //Axis: disable showing thresholds
            CZ.Common.controller.onAnimationStarted.push(function () {
                //CZ.Common.ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds disabled"));
            });

            // Axis: enable showing thresholds
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if (oldId != undefined && newId == undefined) {
                    setTimeout(function () {
                        //CZ.Common.ax.axis("enableThresholds", true);
                        //if (window.console && console.log("thresholds enabled"));
                    }, 500);
                }
            });
            */

            //Tour: notifyng tour that the bookmark is reached
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                if (CZ.Tours.tourBookmarkTransitionCompleted != undefined)
                    CZ.Tours.tourBookmarkTransitionCompleted(id);
                if (CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished")
                    CZ.Tours.pauseTourAtAnyAnimation = true;
            });

            //Tour: notifyng tour that the transition was interrupted
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if (CZ.Tours.tour != undefined) {
                    if (CZ.Tours.tourBookmarkTransitionInterrupted != undefined) {
                        var prevState = CZ.Tours.tour.state;
                        CZ.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = CZ.Tours.tour.state;

                        if (prevState == "play" && alteredState == "pause")
                            CZ.Tours.tourPause();

                        CZ.Common.setNavigationStringTo = null;
                    }
                }
            });

            CZ.Common.updateLayout();

            CZ.Common.vc.bind("elementclick", function (e) {
                CZ.Search.navigateToElement(e);
            });

            CZ.Common.vc.bind('cursorPositionChanged', function (cursorPositionChangedEvent) {
                CZ.Common.updateMarker();
            });

            CZ.Common.ax.bind('thresholdBookmarkChanged', function (thresholdBookmark) {
                var bookmark = CZ.UrlNav.navStringToVisible(thresholdBookmark.Bookmark, CZ.Common.vc);
                if (bookmark != undefined) {
                    CZ.Common.controller.moveToVisible(bookmark, false);
                }
            });

            // Reacting on the event when one of the infodot exploration causes inner zoom constraint
            CZ.Common.vc.bind("innerZoomConstraintChanged", function (constraint) {
                CZ.Common.controller.effectiveExplorationZoomConstraint = constraint.zoomValue; // applying the constraint
                CZ.Common.axis.allowMarkerMovesOnHover = !constraint.zoomValue;
            });

            CZ.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) {
                CZ.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });

            $(window).bind('resize', function () {
                if (CZ.timeSeriesChart) {
                    CZ.timeSeriesChart.updateCanvasHeight();
                }

                CZ.Common.updateLayout();

                //updating timeSeries chart
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                updateTimeSeriesChart(vp);
            });

            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            CZ.Common.vc.virtualCanvas("setVisible", CZ.VCContent.getVisibleForElement({
                x: -13700000000,
                y: 0,
                width: 13700000000,
                height: 5535444444.444445
            }, 1.0, vp, false), true);
            CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);

            var bid = window.location.hash.match("b=([a-z0-9_\-]+)");
            if (bid) {
                //bid[0] - source string
                //bid[1] - found match
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        }

        function closeAllForms() {
            $('.cz-major-form').each(function (i, f) {
                var form = $(f).data('form');
                if (form && form.isFormVisible === true) {
                    form.close();
                }
            });
        }
        HomePageViewModel.closeAllForms = closeAllForms;

        function getFormById(name) {
            var form = $(name).data("form");
            if (form)
                return form;
            else
                return false;
        }
        HomePageViewModel.getFormById = getFormById;

        function showTimeSeriesChart() {
            $('#timeSeriesContainer').height('30%');
            $('#timeSeriesContainer').show();
            $('#vc').height('70%');
            CZ.timeSeriesChart.updateCanvasHeight();
            CZ.Common.updateLayout();
        }
        HomePageViewModel.showTimeSeriesChart = showTimeSeriesChart;

        function hideTimeSeriesChart() {
            CZ.leftDataSet = undefined;
            CZ.rightDataSet = undefined;
            $('#timeSeriesContainer').height(0);
            $('#timeSeriesContainer').hide();
            $('#vc').height('100%');
            CZ.Common.updateLayout();
        }
        HomePageViewModel.hideTimeSeriesChart = hideTimeSeriesChart;

        function updateTimeSeriesChart(vp) {
            var left = vp.pointScreenToVirtual(0, 0).x;
            if (left < CZ.Settings.maxPermitedTimeRange.left)
                left = CZ.Settings.maxPermitedTimeRange.left;
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if (right > CZ.Settings.maxPermitedTimeRange.right)
                right = CZ.Settings.maxPermitedTimeRange.right;

            if (CZ.timeSeriesChart !== undefined) {
                var leftCSS = vp.pointVirtualToScreen(left, 0).x;
                var rightCSS = vp.pointVirtualToScreen(right, 0).x;
                var leftPlot = CZ.Dates.getYMDFromCoordinate(left).year;
                var rightPlot = CZ.Dates.getYMDFromCoordinate(right).year;

                CZ.timeSeriesChart.clear(leftCSS, rightCSS);
                CZ.timeSeriesChart.clearLegend("left");
                CZ.timeSeriesChart.clearLegend("right");

                var chartHeader = "Time Series Chart";

                if (CZ.rightDataSet !== undefined || CZ.leftDataSet !== undefined) {
                    CZ.timeSeriesChart.drawVerticalGridLines(leftCSS, rightCSS, leftPlot, rightPlot);
                }

                var screenWidthForLegend = rightCSS - leftCSS;
                if (CZ.rightDataSet !== undefined && CZ.leftDataSet !== undefined) {
                    screenWidthForLegend /= 2;
                }
                var isLegendVisible = CZ.timeSeriesChart.checkLegendVisibility(screenWidthForLegend);

                if (CZ.leftDataSet !== undefined) {
                    var padding = CZ.leftDataSet.getVerticalPadding() + 10;

                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;

                    CZ.leftDataSet.series.forEach(function (seria) {
                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }

                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });

                    if ((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }

                    var axisAppearence = { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'left', font: '16px Calibri', verticalPadding: padding };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(leftCSS, rightCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.leftDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < CZ.leftDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("left", CZ.leftDataSet.series[i].appearanceSettings.stroke, CZ.leftDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    chartHeader += " (" + CZ.leftDataSet.name;
                }

                if (CZ.rightDataSet !== undefined) {
                    var padding = CZ.rightDataSet.getVerticalPadding() + 10;

                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;

                    CZ.rightDataSet.series.forEach(function (seria) {
                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }

                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });

                    if ((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }

                    var axisAppearence = { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'right', font: '16px Calibri', verticalPadding: padding };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(rightCSS, leftCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.rightDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < CZ.rightDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("right", CZ.rightDataSet.series[i].appearanceSettings.stroke, CZ.rightDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    var str = chartHeader.indexOf("(") > 0 ? ", " : " (";
                    chartHeader += str + CZ.rightDataSet.name + ")";
                } else {
                    chartHeader += ")";
                }

                $("#timeSeriesChartHeader").text(chartHeader);
            }
        }
        HomePageViewModel.updateTimeSeriesChart = updateTimeSeriesChart;

    })(CZ.HomePageViewModel || (CZ.HomePageViewModel = {}));
    var HomePageViewModel = CZ.HomePageViewModel;
})(CZ || (CZ = {}));
