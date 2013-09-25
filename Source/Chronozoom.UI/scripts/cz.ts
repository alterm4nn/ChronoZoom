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
/// <reference path='../ui/start-page.ts'/>
/// <reference path='plugins/error-plugin.ts'/>
/// <reference path='plugins/utility-plugins.ts'/>

var constants: any;

module CZ {
    export var timeSeriesChart: CZ.UI.LineChart;
    export var leftDataSet: CZ.Data.DataSet;
    export var rightDataSet: CZ.Data.DataSet;


    export module HomePageViewModel {
        // Contains mapping: CSS selector -> html file.
        var _uiMap = {
            "#header-edit-form": "/ui/header-edit-form.html",
            "#auth-edit-timeline-form": "/ui/auth-edit-timeline-form.html",
            "#auth-edit-exhibit-form": "/ui/auth-edit-exhibit-form.html",
            "#auth-edit-contentitem-form": "/ui/auth-edit-contentitem-form.html",
            "$('<div></div>')": "/ui/contentitem-listbox.html",
            "#profile-form": "/ui/header-edit-profile-form.html",
            "#login-form": "/ui/header-login-form.html",
            "#auth-edit-tours-form": "/ui/auth-edit-tour-form.html", // 7
            "$('<div><!--Tours Authoring--></div>')": "/ui/tourstop-listbox.html", // 8
            "#toursList": "/ui/tourslist-form.html", // 9
            "$('<div><!--Tours list item --></div>')": "/ui/tour-listbox.html", // 10
            "#timeSeriesContainer": "/ui/timeseries-graph-form.html", //11
            "#timeSeriesDataForm": "/ui/timeseries-data-form.html", //12
            "#message-window": "/ui/message-window.html", // 13
            "#header-search-form": "/ui/header-search-form.html", // 14
            "#header-session-expired-form": "/ui/header-session-expired-form.html", // 15
            "#tour-caption-form": "/ui/tour-caption-form.html", // 16
            "#mediapicker-form": "/ui/mediapicker-form.html", // 17
            "#start-page":"/ui/start-page.html"
        };

        export enum FeatureActivation {
            Enabled,
            Disabled,
            RootCollection,
            NotRootCollection,
            NotProduction,
        }

        export interface FeatureInfo {
            Name: string;
            Activation: FeatureActivation;
            JQueryReference: string;
            IsEnabled: bool;
            HasBeenActivated: bool;
        }

        export var sessionForm: CZ.UI.FormHeaderSessionExpired;

        // Basic Flight-Control (Tracks the features that are enabled)
        //
        // FEATURES CAN ONLY BE ACTIVATED IN ROOTCOLLECTION AFTER HITTING ZERO ACTIVE BUGS.
        //
        // REMOVING THIS COMMENT OR BYPASSING THIS CHECK MAY BRING YOU BAD KARMA, ITS TRUE.
        //
        var _featureMap: FeatureInfo[] = [
            {
                Name: "Login",
                Activation: FeatureActivation.Enabled,
                JQueryReference: "#login-panel"
            },
            {
                Name: "Search",
                Activation: FeatureActivation.Enabled,
                JQueryReference: "#search-button"
            },
            {
                Name: "Tours",
                Activation: FeatureActivation.Enabled,
                JQueryReference: "#tours-index"
            },
            {
                Name: "Authoring",
                Activation: FeatureActivation.Enabled,
                JQueryReference: ".header-icon.edit-icon"
            },
            {
                Name: "TourAuthoring",
                Activation: FeatureActivation.Enabled,
                JQueryReference: ".cz-form-create-tour"
            },
            {
                Name: "WelcomeScreen",
                Activation: FeatureActivation.RootCollection,
                JQueryReference: "#welcomeScreenBack"
            },
            {
                Name: "Regimes",
                Activation: FeatureActivation.RootCollection,
                JQueryReference: ".header-regimes"
            },
            {
                Name: "TimeSeries",
                Activation: FeatureActivation.Enabled
            },
            {
                Name: "ManageCollections",
                Activation: FeatureActivation.Disabled,
                JQueryReference: "#collections_button"
            },
            {
                Name: "BreadCrumbs",
                Activation: FeatureActivation.Enabled,
                JQueryReference: ".header-breadcrumbs"
            },
            {
                Name: "Themes",
                Activation: FeatureActivation.NotProduction
            },
            {
                Name: "Skydrive",
                Activation: FeatureActivation.Enabled
            },
            {
                Name: "StartPage",
                Activation: FeatureActivation.NotProduction,
                JQueryReference: ".header-icon.home-icon"
            },
        ];

        export var rootCollection: bool;

        function UserCanEditCollection(profile) {
            if (CZ.Service.superCollectionName && CZ.Service.superCollectionName.toLowerCase() === "sandbox") {
                return true;
            }

            if (!profile || !profile.DisplayName || !CZ.Service.superCollectionName || profile.DisplayName.toLowerCase() !== CZ.Service.superCollectionName.toLowerCase()) {
                return false
            }

            return true;
        }

        function InitializeToursUI(profile, forms) {
            CZ.Tours.tourCaptionFormContainer = forms[16];
            var allowEditing = IsFeatureEnabled(_featureMap, "TourAuthoring") && UserCanEditCollection(profile);

            var onTakeTour = tour => {
                CZ.HomePageViewModel.closeAllForms();
                CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption(CZ.Tours.tourCaptionFormContainer, {
                    activationSource: $(".tour-icon"),
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
                });
                CZ.Tours.tourCaptionForm.show();

                CZ.Tours.removeActiveTour();
                CZ.Tours.activateTour(tour, undefined);
            };

            var onToursInitialized = function () {
                $("#tours_index").click(function () { // show form
                    var toursListForm = getFormById("#toursList");

                    if (toursListForm.isFormVisible) {
                        toursListForm.close();
                    }
                    else {
                        closeAllForms();
                        var form = new CZ.UI.FormToursList(forms[9], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            tourTemplate: forms[10],
                            tours: CZ.Tours.tours,
                            takeTour: onTakeTour,
                            editTour: allowEditing ? tour => {
                                if (CZ.Authoring.showEditTourForm)
                                    CZ.Authoring.showEditTourForm(tour);
                            } : null
                        });
                        form.show();
                    }
                });
            };
            if (CZ.Tours.tours)
                onToursInitialized();
            else
                $("body").bind("toursInitialized", onToursInitialized);
        }

        var defaultRootTimeline = { title: "My Timeline", x: 1950, endDate: 9999, children: [], parent: { guid: null } };

        $(document).ready(function () {
            //Ensures there will be no 'console is undefined' errors
            window.console = window.console || <any>(function () {
                var c = <any>{};
                c.log = c.warn = c.debug = c.info = c.log =
                    c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () { };
                return c;
            })();
           
            $('.bubbleInfo').hide();

            var url = CZ.UrlNav.getURL();
            rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;

            // Apply features
            ApplyFeatureActivation();

            // Register ChronoZoom Extensions
            CZ.Extensions.registerExtensions();

            // Register ChronoZoom Media Pickers.
            CZ.Media.SkyDriveMediaPicker.isEnabled = IsFeatureEnabled(_featureMap, "Skydrive");
            CZ.Media.initialize();

            CZ.Common.initialize();
            CZ.UILoader.loadAll(_uiMap).done(function () {
                var forms = arguments;

                timeSeriesChart = new CZ.UI.LineChart(forms[11]);

                $('#timeSeries_button').click(function () {
                    var tsForm = getFormById('#timeSeriesDataForm');
                    if (tsForm === false) {
                        closeAllForms();

                        var timSeriesDataFormDiv = forms[12];
                        var timSeriesDataForm = new CZ.UI.TimeSeriesDataForm(timSeriesDataFormDiv, {
                            activationSource: $("#timeSeries_button"),
                            closeButton: ".cz-form-close-btn > .cz-form-btn"
                        });
                        timSeriesDataForm.show();
                    }
                    else {
                        if (tsForm.isFormVisible) {
                            tsForm.close();
                        }
                        else {
                            closeAllForms();
                            tsForm.show();
                        }
                    }
                });

                $(".header-icon.edit-icon").click(function () {
                    var editForm = getFormById("#header-edit-form");
                    if (editForm === false) {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderEdit(forms[0], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            createTimeline: ".cz-form-create-timeline",
                            createExhibit: ".cz-form-create-exhibit",
                            createTour: ".cz-form-create-tour"
                        });
                        form.show();
                        ApplyFeatureActivation();
                    }
                    else {
                        if (editForm.isFormVisible) {
                            editForm.close();
                        }
                        else {
                            closeAllForms();
                            editForm.show();
                        }
                    }
                });

                $(".header-icon.search-icon").click(function () {
                    var searchForm = getFormById("#header-search-form");
                    if (searchForm === false) {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderSearch(forms[14], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            searchTextbox: ".cz-form-search-input",
                            searchResultsBox: ".cz-form-search-results",
                            progressBar: ".cz-form-progress-bar",
                            resultSections: ".cz-form-search-results > .cz-form-search-section",
                            resultsCountTextblock: ".cz-form-search-results-count"
                        });
                        form.show();
                    }
                    else {
                        if (searchForm.isFormVisible) {
                            searchForm.close();
                        }
                        else {
                            closeAllForms();
                            searchForm.show();
                        }
                    }
                });

                CZ.Authoring.initialize(CZ.Common.vc, {
                    showMessageWindow: function (message: string, title?: string, onClose?: () => any) {
                        var wnd = new CZ.UI.MessageWindow(forms[13], message, title);
                        if (onClose) wnd.container.bind("close", () =>
                        {
                            wnd.container.unbind("close", onClose);
                            onClose();
                        });
                        wnd.show();
                    },
                    hideMessageWindow: function () {
                        var wnd = <CZ.UI.MessageWindow>forms[13].data("form");
                        if (wnd)
                            wnd.close();
                    },
                    showEditTourForm: function (tour) {
                        CZ.Tours.removeActiveTour();
                        var form = new CZ.UI.FormEditTour(forms[7], {
                            activationSource: $(".header-icon.edit-icon"),
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
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateRootTimelineForm: function (timeline) {
                        CZ.Authoring.mode = "createRootTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showEditTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateExhibitForm: function (exhibit) {
                        CZ.Authoring.hideMessageWindow();
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(".header-icon.edit-icon"),
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
                            activationSource: $(".header-icon.edit-icon"),
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
                            activationSource: $(".header-icon.edit-icon"),
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

                sessionForm = new CZ.UI.FormHeaderSessionExpired(forms[15], {
                    activationSource: $("#header-session-expired-form"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: "",
                    sessionTimeSpan: "#session-time",
                    sessionButton: "#session-button"
                });

                CZ.Service.getProfile().done(data => {
                    //Authorized
                    if (data != "") {
                        CZ.Settings.isAuthorized = true;
                        CZ.Authoring.timer = setTimeout(() => { CZ.Authoring.showSessionForm(); }, (CZ.Settings.sessionTime - 60) * 1000);
                    }

                    CZ.Authoring.isEnabled = UserCanEditCollection(data);
                }).fail((error) => {
                    CZ.Authoring.isEnabled = UserCanEditCollection(null);
                }).always(() => {
                    if (!CZ.Authoring.isEnabled) {
                        $(".edit-icon").hide();
                    }

                    //retrieving the data
                    CZ.Common.loadData().then(function (response) {
                        // collection is empty
                        if (!response) {
                            // author should create a root timeline
                            // TODO: store 'user' variable in CZ that is the response of getProfile()
                            if (CZ.Authoring.isEnabled) {
                                if (CZ.Authoring.showCreateRootTimelineForm) {
                                    CZ.Authoring.showCreateRootTimelineForm(defaultRootTimeline);
                                }
                            }
                            // show message for other users that collection is empty
                            else {
                                CZ.Authoring.showMessageWindow(
                                    "Looks like this collection is empty. Come back later when author will fill it with content.",
                                    "Collection is empty :("
                                );
                            }
                        }
                    });
                });

                var profileForm = new CZ.UI.FormEditProfile(forms[5], {
                    activationSource: $("#login-panel"),
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
                    allowRedirect: IsFeatureEnabled(_featureMap, "Authoring"),
                    collectionTheme: CZ.Settings.theme,
                    collectionThemeInput: "#collection-theme",
                    collectionThemeWrapper: IsFeatureEnabled(_featureMap, "Themes") ? "#collection-theme-wrapper" : null
                });

                var loginForm = new CZ.UI.FormLogin(forms[6], {
                    activationSource: $("#login-panel"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: ""
                });

                $("#profile-panel").click(function (event) {
                    event.preventDefault();
                    if (!profileForm.isFormVisible) {
                        closeAllForms();
                        profileForm.setTheme(CZ.Settings.theme);
                        profileForm.show();
                    }
                    else {
                        profileForm.close();
                    }
                });

                if (IsFeatureEnabled(_featureMap, "Login")) {
                    CZ.Service.getProfile().done(data => {
                        //Not authorized
                        if (data == "") {
                            $("#login-panel").show();
                        }
                            //Authorized for a first time
                        else if (data != "" && data.DisplayName == null) {
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $("#profile-panel input#username").focus();

                            if (!profileForm.isFormVisible) {
                                closeAllForms();
                                profileForm.setTheme(CZ.Settings.theme);
                                profileForm.show();
                            }
                            else {
                                profileForm.close();
                            }
                        }
                        else {
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $(".auth-panel-login").html(data.DisplayName);
                        }

                        InitializeToursUI(data, forms);
                    }).fail((error) => {
                        $("#login-panel").show();

                        InitializeToursUI(null, forms);
                    });
                }

                $("#login-panel").click(function (event) {
                    event.preventDefault();
                    if (!loginForm.isFormVisible) {
                        closeAllForms();
                        loginForm.show();
                    }
                    else {
                        loginForm.close();
                    }
                });
                if (IsFeatureEnabled(_featureMap, "StartPage")) {
                    CZ.StartPage.initialize();
                }
            });

            CZ.Service.getServiceInformation().then(
                function (response) {
                    CZ.Settings.contentItemThumbnailBaseUri = response.thumbnailsPath;
                    CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                    CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                    CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
                });

            CZ.Settings.applyTheme(null);

            // If not the root URL.
            if (CZ.Service.superCollectionName) {
                CZ.Service.getCollections(CZ.Service.superCollectionName).then(response => {
                    $(response).each((index) => {
                        if (response[index] && response[index].Title.toLowerCase() === CZ.Service.collectionName.toLowerCase()) {
                            CZ.Settings.applyTheme(response[index].theme);
                        }
                    });
                });
            }

            $('#breadcrumbs-nav-left')
                .click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right')
                .click(CZ.BreadCrumbs.breadCrumbNavRight);

            $('#biblCloseButton')
                .mouseout(() => { CZ.Common.toggleOffImage('biblCloseButton', 'png'); })
                .mouseover(() => { CZ.Common.toggleOnImage('biblCloseButton', 'png'); })

            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                // Suppress the default iOS elastic pan/zoom actions.
                document.addEventListener('touchmove', function (e) { e.preventDefault(); });
            }

            if (navigator.userAgent.indexOf('Mac') != -1) {
                // Disable Mac OS Scrolling Bounce Effect
                var body = document.getElementsByTagName('body')[0];
                (<any>body).style.overflow = "hidden";
            }

            // init seadragon. set path to image resources for nav buttons 
            Seadragon.Config.imagePath = CZ.Settings.seadragonImagePath;

            CZ.Common.maxPermitedVerticalRange = { top: 0, bottom: 10000000 }; //temporary value until there is no data

            if (window.location.hash)
                CZ.Common.startHash = window.location.hash; // to be processes after the data is loaded

            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();

            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc); //gesture sequence of the virtual canvas
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax)); //gesture sequence of axis (tranformed according to axis behavior logic)
            var timeSeriesGestures = CZ.Gestures.getPanPinGesturesStream($("#timeSeriesContainer"));
            var jointGesturesStream = canvasGestures.Merge(axisGestures.Merge(timeSeriesGestures));

            CZ.Common.controller = new CZ.ViewportController.ViewportController2(
                function (visible) {
                    var vp = CZ.Common.vc.virtualCanvas("getViewport");
                    var markerPos = CZ.Common.axis.markerPosition;
                    var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;

                    CZ.Common.vc.virtualCanvas("setVisible", visible, CZ.Common.controller.activeAnimation);
                    CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
                    vp = CZ.Common.vc.virtualCanvas("getViewport");
                    if (CZ.Tours.pauseTourAtAnyAnimation) { //watch for the user animation during playing of some tour bookmark
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
                },
                function () {
                    return CZ.Common.vc.virtualCanvas("getViewport");
                },
                jointGesturesStream
            );

            var hashChangeFromOutside = true; // True if url is changed externally

            // URL Nav: update URL when animation is complete
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.bookmark) { // go to search result
                    CZ.UrlNav.navigationAnchor = CZ.UrlNav.navStringTovcElement(CZ.Common.setNavigationStringTo.bookmark, CZ.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = CZ.Common.setNavigationStringTo.bookmark;
                }
                else {
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
                if (oldId != undefined && newId == undefined) { // animation interrupted
                    setTimeout(function () {
                        //CZ.Common.ax.axis("enableThresholds", true);
                        //if (window.console && console.log("thresholds enabled"));
                    }, 500);
                }
            });

            //Tour: notifyng tour that the bookmark is reached
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                if (CZ.Tours.tourBookmarkTransitionCompleted != undefined)
                    CZ.Tours.tourBookmarkTransitionCompleted(id);
                if (CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished") //enabling wathcing for user activity while playing the bookmark
                    CZ.Tours.pauseTourAtAnyAnimation = true;
            });
            //Tour: notifyng tour that the transition was interrupted
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if (CZ.Tours.tour != undefined) {
                    if (CZ.Tours.tourBookmarkTransitionInterrupted != undefined) { //in transition
                        var prevState = CZ.Tours.tour.state;
                        CZ.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = CZ.Tours.tour.state;

                        if (prevState == "play" && alteredState == "pause") //interruption caused toue pausing. stop any animations, updating UI as well
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

            CZ.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) { //reacting on the event when the first timeline that contains whole visible region is changed
                CZ.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });

            $(window).bind('resize', function () {
                timeSeriesChart.updateCanvasHeight();
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

            var bid = window.location.hash.match("b=([a-z0-9_]+)");
            if (bid) {
                //bid[0] - source string
                //bid[1] - found match
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        });

        export function IsFeatureEnabled(featureMap: FeatureInfo[], featureName: string) {
            var feature: FeatureInfo[] = $.grep(featureMap, function (e) { return e.Name === featureName; });
            return feature[0].IsEnabled;
        }

        export function closeAllForms() {
            $('.cz-major-form').each((i, f) => {
                var form = $(f).data('form');
                if (form && form.isFormVisible === true) {
                    form.close();
                }
            });

        }

        export function getFormById(name) {
            var form = $(name).data("form");
            if (form)
                return form;
            else
                return false;
        }

        export function showTimeSeriesChart() {
            $('#timeSeriesContainer').height('30%');
            $('#timeSeriesContainer').show();
            $('#vc').height('70%');
            timeSeriesChart.updateCanvasHeight();
            CZ.Common.updateLayout();
        }

        export function hideTimeSeriesChart() {
            leftDataSet = undefined;
            rightDataSet = undefined;
            $('#timeSeriesContainer').height(0);
            $('#timeSeriesContainer').hide();
            $('#vc').height('100%');
            CZ.Common.updateLayout();
        }

        export function updateTimeSeriesChart(vp) {
            var left = vp.pointScreenToVirtual(0, 0).x;
            if (left < CZ.Settings.maxPermitedTimeRange.left) left = CZ.Settings.maxPermitedTimeRange.left;
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if (right > CZ.Settings.maxPermitedTimeRange.right) right = CZ.Settings.maxPermitedTimeRange.right;

            if (timeSeriesChart !== undefined) {
                var leftCSS = vp.pointVirtualToScreen(left, 0).x;
                var rightCSS = vp.pointVirtualToScreen(right, 0).x;
                var leftPlot = Dates.getYMDFromCoordinate(left).year;
                var rightPlot = Dates.getYMDFromCoordinate(right).year;


                timeSeriesChart.clear(leftCSS, rightCSS);
                timeSeriesChart.clearLegend("left");
                timeSeriesChart.clearLegend("right");

                var chartHeader = "TimeSeries Chart";

                if (rightDataSet !== undefined || leftDataSet !== undefined) {
                    timeSeriesChart.drawVerticalGridLines(leftCSS, rightCSS, leftPlot, rightPlot);
                }

                var screenWidthForLegend = rightCSS - leftCSS;
                if (rightDataSet !== undefined && leftDataSet !== undefined) {
                    screenWidthForLegend /= 2;
                }
                var isLegendVisible = timeSeriesChart.checkLegendVisibility(screenWidthForLegend);

                if (leftDataSet !== undefined) {
                    var padding = leftDataSet.getVerticalPadding() + 10;

                    var plotBottom: number = Number.MAX_VALUE;
                    var plotTop: number = Number.MIN_VALUE;

                    leftDataSet.series.forEach(function (seria) {
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
                    var tickForDraw = timeSeriesChart.generateAxisParameters(leftCSS, rightCSS, plotBottom, plotTop, axisAppearence);
                    timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    timeSeriesChart.drawDataSet(leftDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < leftDataSet.series.length; i++) {
                            timeSeriesChart.addLegendRecord("left", leftDataSet.series[i].appearanceSettings.stroke, leftDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    chartHeader += " (" + leftDataSet.name;
                }

                if (rightDataSet !== undefined) {
                    var padding = rightDataSet.getVerticalPadding() + 10;

                    var plotBottom: number = Number.MAX_VALUE;
                    var plotTop: number = Number.MIN_VALUE;

                    rightDataSet.series.forEach(function (seria) {
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
                    var tickForDraw = timeSeriesChart.generateAxisParameters(rightCSS, leftCSS, plotBottom, plotTop, axisAppearence);
                    timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    timeSeriesChart.drawDataSet(rightDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < rightDataSet.series.length; i++) {
                            timeSeriesChart.addLegendRecord("right", rightDataSet.series[i].appearanceSettings.stroke, rightDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    var str = chartHeader.indexOf("(") > 0 ? ", " : " (";
                    chartHeader += str + rightDataSet.name + ")";
                } else {
                    chartHeader += ")";
                }

                $("#timeSeriesChartHeader").text(chartHeader);
            }
        }

        function ApplyFeatureActivation() {
            // Feature activation control
            for (var idxFeature = 0; idxFeature < _featureMap.length; idxFeature++) {
                var feature = _featureMap[idxFeature];

                if (feature.IsEnabled === undefined) {
                    var enabled: bool = true;
                    if (feature.Activation === FeatureActivation.Disabled) {
                        enabled = false;
                    }

                    if (feature.Activation === FeatureActivation.NotRootCollection && rootCollection) {
                        enabled = false;
                    }

                    if (feature.Activation === FeatureActivation.RootCollection && !rootCollection) {
                        enabled = false;
                    }

                    if (feature.Activation === FeatureActivation.NotProduction && (!constants || constants.environment === "Production")) {
                        enabled = false;
                    }

                    _featureMap[idxFeature].IsEnabled = enabled;
                }

                if (feature.JQueryReference) {
                    if (!_featureMap[idxFeature].IsEnabled) {
                        $(feature.JQueryReference).css("display", "none");
                    }
                    else if (!_featureMap[idxFeature].HasBeenActivated) {
                        _featureMap[idxFeature].HasBeenActivated = true;
                        $(feature.JQueryReference).css("display", "block");
                    }
                }
            }
        }

        //export function FitToTimeSeriesData(vp) {
        //    if (rightDataSet === undefined && leftDataSet === undefined)
        //        return;

        //    var leftX = Number.MAX_VALUE, rightX = Number.MAX_VALUE;
        //    if (rightDataSet != undefined) {
        //        leftX = rightDataSet.time[0];
        //        rightX = rightDataSet.time[rightDataSet.time.length - 1];
        //    }

        //    if (leftDataSet != undefined) {
        //        if (leftDataSet.time[0] < leftX)
        //            leftX = leftDataSet.time[0];
        //        if (leftDataSet.time[leftDataSet.time.length - 1] > rightX)
        //            rightX = leftDataSet.time[leftDataSet.time.length - 1];
        //    }

        //    if (leftX < CZ.Settings.maxPermitedTimeRange.left) leftX = CZ.Settings.maxPermitedTimeRange.left;
        //    if (rightX > CZ.Settings.maxPermitedTimeRange.right) rightX = CZ.Settings.maxPermitedTimeRange.right;

        //    CZ.Common.controller.moveToVisible(visible);
        //}
    }
}
