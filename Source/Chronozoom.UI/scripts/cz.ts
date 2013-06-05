/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='timescale.ts'/>
/// <reference path='viewport-controller.ts'/>
/// <reference path='gestures.ts'/>
/// <reference path='tours.ts'/>
/// <reference path='virtual-canvas.ts'/>
/// <reference path='uiloader.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>
/// <reference path='../ui/auth-edit-timeline-form.ts'/>
/// <reference path='../ui/auth-edit-exhibit-form.ts'/>
/// <reference path='../ui/auth-edit-contentitem-form.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>
/// <reference path='../ui/header-edit-form.ts' />
/// <reference path='../ui/header-edit-profile-form.ts'/>
/// <reference path='../ui/header-login-form.ts'/>
/// <reference path='../ui/timeseries-graph-form.ts'/>
/// <reference path='../ui/timeseries-data-form.ts'/>
/// <reference path='../ui/tourslist-form.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>


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
            "#timeSeriesDataForm": "/ui/timeseries-data-form.html" //12
        };

        enum FeatureActivation {
            Enabled,
            Disabled,
            RootCollection,
            NotRootCollection,
        }

        interface FeatureInfo {
            Name: string;
            Activation: FeatureActivation;
            JQueryReference: string;
            IsEnabled: bool;
        }

        // Basic Flight-Control (Tracks the features that are enabled)
        //
        // FEATURES CAN ONLY BE ACTIVATED IN ROOTCOLLECTION AFTER HITTING ZERO ACTIVE BUGS.
        //
        // REMOVING THIS COMMENT OR BYPASSING THIS CHECK MAYBE BRING YOU BAD KARMA, ITS TRUE.
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
                Activation: FeatureActivation.NotRootCollection,
                JQueryReference: ".header-icon.edit-icon"
            },
            {
                Name: "WelcomeScreen",
                Activation: FeatureActivation.RootCollection,
                JQueryReference: "#welcomeScreenBack"
            },
            {
                Name: "Regimes",
                Activation: FeatureActivation.RootCollection,
                JQueryReference: ".regime-link"
            },
            {
                Name: "TimeSeries",
                Activation: FeatureActivation.NotRootCollection,
                JQueryReference: "#timeSeriesContainer"
            },
        ];

        function InitializeToursUI(profile, forms) {
            //var allowEditing = true;
            // IF THE FOLLOWING LINE IS COMMENTED IN PULL REQUEST IT IS A MISTAKE!
            var allowEditing = IsFeatureEnabled("Authoring") && (profile && profile != "" && profile.DisplayName === CZ.Service.superCollectionName);

            var onToursInitialized = function () {
                CZ.Tours.initializeToursUI();
                $("#tours_index").click(function () { // show form
                    CZ.Tours.removeActiveTour();
                    var form = new CZ.UI.FormToursList(forms[9], {
                        activationSource: $(this),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        tourTemplate: forms[10],
                        tours: CZ.Tours.tours,
                        takeTour: tour => {
                            CZ.Tours.removeActiveTour();
                            CZ.Tours.activateTour(tour, undefined);
                        },
                        editTour: allowEditing ? tour => {
                            if (CZ.Authoring.showEditTourForm)
                                CZ.Authoring.showEditTourForm(tour);
                        } : null
                    });
                    form.show();
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
            var canvasIsEmpty;

            CZ.Common.initialize();
            CZ.UILoader.loadAll(_uiMap).done(function () {
                var forms = arguments;

                timeSeriesChart = new CZ.UI.LineChart(forms[11]);

                $('#timeSeries_button').click(function () {
                    var tsForm = getFormById('#timeSeries_button');
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

                CZ.Service.getProfile()
                    .done(profile => { InitializeToursUI(profile, forms); })
                    .fail(err => { InitializeToursUI(null, forms); });

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

                CZ.Authoring.initialize(CZ.Common.vc, {
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
                        	context: {
                        	    exhibit: e,
                        	    contentItem: ci
                        	}
                         });
                        form.show(noAnimation);
                    }
                });

                if (canvasIsEmpty) {
                    CZ.Authoring.showCreateTimelineForm(defaultRootTimeline);
                }

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
                    allowRedirect: IsFeatureEnabled("Authoring")
                });

                var loginForm = new CZ.UI.FormLogin(forms[6], {
                    activationSource: $("#login-panel"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: ""
                });

                $("#profile-panel").click(function () {
                    if (!profileForm.isFormVisible) {
                        closeAllForms();
                    profileForm.show();
                    }
                    else {
                        profileForm.close();
                    }

                });

                if (IsFeatureEnabled("Login")) {
                    CZ.Service.getProfile().done(data => {
                        //Not authorized
                        if (data == "") {
                            $("#login-panel").show();
                        }
                            //Authorized for a first time
                        else if (data != "" && data.DisplayName == null) {
                            $("#profile-panel").show();
                            $("#profile-panel input#username").focus();

                            if (!profileForm.isFormVisible) {
                                closeAllForms();
                            profileForm.show();
                            }
                            else {
                                profileForm.close();
                            }
                        }
                        else {
                            $("#profile-panel").show();
                            $(".auth-panel-login").html(data.DisplayName);
                        }
                    }).fail((error) => {
                        $("#login-panel").show();
                    });
                }

                $("#login-panel").click(function () {
                    if (!loginForm.isFormVisible) {
                        closeAllForms();
                    loginForm.show();
                    }
                    else {
                        loginForm.close();
                    }
                });
            });

            CZ.Service.getServiceInformation().then(
                function (response) {
                    CZ.Settings.contentItemThumbnailBaseUri = response.thumbnailsPath;
                    CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                    CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                    CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
                });

            var url = CZ.UrlNav.getURL();
            var rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;

            if (rootCollection) {
                $('#timeSeries_button').hide();
            } else {
                $('#timeSeries_button').show();
            }

            $('#search_button')
                .mouseup(CZ.Search.onSearchClicked);

            // Commented by Dmitry Voytsekhovskiy: new tours window is now opened in a handler of UI map loading completion.
            //$('#tours_index')
            //    .mouseup(e =>
            //    {
            //        CZ.Tours.onTourClicked();
            //    });

            $('#human_rect')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.humanityVisible); });
            $('#prehuman_rect')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.prehistoryVisible); });
            $('#life_rect')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.lifeVisible); });
            $('#earth_rect')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.earthVisible); });
            $('#cosmos_rect')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.cosmosVisible); });

            $('#humanBookmark')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.humanityVisible); });
            $('#prehistoryBookmark')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.prehistoryVisible); });
            $('#lifeBookmark')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.lifeVisible); });
            $('#earthBookmark')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.earthVisible); });
            $('#cosmosBookmark')
                .click(() => { CZ.Search.navigateToBookmark(CZ.Common.cosmosVisible); });

            $('#breadcrumbs-nav-left')
                .click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right')
                .click(CZ.BreadCrumbs.breadCrumbNavRight);

            $('#tour_prev')
                .mouseout(() => { CZ.Common.toggleOffImage('tour_prev'); })
                .mouseover(() => { CZ.Common.toggleOnImage('tour_prev'); })
                .click(CZ.Tours.tourPrev);
            $('#tour_playpause')
                .mouseout(() => { CZ.Common.toggleOffImage('tour_playpause'); })
                .mouseover(() => { CZ.Common.toggleOnImage('tour_playpause'); })
                .click(CZ.Tours.tourPlayPause);
            $('#tour_next')
                .mouseout(() => { CZ.Common.toggleOffImage('tour_next'); })
                .mouseover(() => { CZ.Common.toggleOnImage('tour_next'); })
                .click(CZ.Tours.tourNext);
            $('#tour_exit')
                .mouseout(() => { CZ.Common.toggleOffImage('tour_exit'); })
                .mouseover(() => { CZ.Common.toggleOnImage('tour_exit'); })
                .click(CZ.Tours.tourAbort);

            $('#tours-narration')
                .click(CZ.Tours.onNarrationClick);

            $('#bookmarksCollapse')
                .click(CZ.Tours.onBookmarksCollapse);

            $('#biblCloseButton')
                .mouseout(() => { CZ.Common.toggleOffImage('biblCloseButton', 'png'); })
                .mouseover(() => { CZ.Common.toggleOnImage('biblCloseButton', 'png'); })
            
            
            $('#welcomeScreenCloseButton')
                .mouseover(() => { CZ.Common.toggleOnImage('welcomeScreenCloseButton', 'png'); })
                .mouseout(() => { CZ.Common.toggleOffImage('welcomeScreenCloseButton', 'png'); })
                .click(CZ.Common.startExploring);
            $('#welcomeScreenStartButton')
                .click(CZ.Common.startExploring);

            var wlcmScrnCookie = CZ.Common.getCookie("welcomeScreenDisallowed");
            if (wlcmScrnCookie != null) {
                CZ.Common.hideWelcomeScreen();
            }
            else {
                // click on gray area hides welcome screen
                $("#welcomeScreenOut").click(function (e) {
                    e.stopPropagation();
                });

                $("#welcomeScreenBack").click(function () {
                    CZ.Common.startExploring();
                });
            }

            // Feature activation control
            for (var idxFeature = 0; idxFeature < _featureMap.length; idxFeature++) {
                var enabled: bool = true;
                var feature = _featureMap[idxFeature];

                if (feature.Activation === FeatureActivation.Disabled) {
                    enabled = false;
                }

                if (feature.Activation === FeatureActivation.NotRootCollection && rootCollection) {
                    enabled = false;
                }

                if (feature.Activation === FeatureActivation.RootCollection && !rootCollection) {
                    enabled = false;
                }

                _featureMap[idxFeature].IsEnabled = enabled;
                if (!enabled) {
                    $(feature.JQueryReference).css("display", "none");
                }
            }

            if (!rootCollection)
                CZ.Authoring.isEnabled = true;

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

            CZ.Common.loadData().then(function (response) {
                if (!response) {
                    canvasIsEmpty = true;
                    if (CZ.Authoring.showCreateTimelineForm) {
                        CZ.Authoring.showCreateTimelineForm(defaultRootTimeline);
                    }
                }
            }); //retrieving the data

            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();

            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc); //gesture sequence of the virtual canvas
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax)); //gesture sequence of axis (tranformed according to axis behavior logic)
            var jointGesturesStream = canvasGestures.Merge(axisGestures);

            CZ.Common.controller = new CZ.ViewportController.ViewportController2(
                            function (visible) {
                                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                                var markerPos = CZ.Common.axis.MarkerPosition();
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

                                if (actAni && !hoveredInfodot.id) {
                                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                                    CZ.Common.updateMarker();
                                }

                                updateTimeSeriesChart(vp);
                            },
                            function () {
                                return CZ.Common.vc.virtualCanvas("getViewport");
                            },
                            jointGesturesStream);

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
            CZ.Common.controller.onAnimationComplete.push(
                                function (id) {
                                    if (CZ.Tours.tourBookmarkTransitionCompleted != undefined)
                                        CZ.Tours.tourBookmarkTransitionCompleted(id);
                                    if (CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished") //enabling wathcing for user activity while playing the bookmark
                                        CZ.Tours.pauseTourAtAnyAnimation = true;
                                });
            //Tour: notifyng tour that the transition was interrupted
            CZ.Common.controller.onAnimationUpdated.push(
                                function (oldId, newId) {
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
                                }
            );

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
                CZ.Common.updateLayout();
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

        function IsFeatureEnabled(featureName) {
            var feature: FeatureInfo[] = $.grep(_featureMap, function (e) { return e.Name === featureName; });
            return feature[0].IsEnabled;
        }

		function closeAllForms() {
            $('.cz-major-form').each((i, f) => { var form = $(f).data('form'); if (form) { form.close(); } });
                     
        }

        function getFormById(name) {
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
                var leftPlot = Dates.getDMYFromCoordinate(left).year;
                var rightPlot = Dates.getDMYFromCoordinate(right).year;


                timeSeriesChart.clear(leftCSS, rightCSS);
                timeSeriesChart.clearLegend("left");
                timeSeriesChart.clearLegend("right");

                var chartHeader = "TimeSeries Chart";

                if (leftDataSet !== undefined) {
                    timeSeriesChart.drawDataSet(leftDataSet, leftCSS, rightCSS, leftPlot, rightPlot);
                    timeSeriesChart.drawAxis(leftCSS, leftDataSet.series[0].appearanceSettings.yMin, leftDataSet.series[0].appearanceSettings.yMax, { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'left', font: '16px Calibri' });

                    for (var i = 0; i < leftDataSet.series.length; i++) {
                        timeSeriesChart.addLegendRecord("left", leftDataSet.series[i].appearanceSettings.stroke, leftDataSet.series[i].appearanceSettings.name);
                    }

                    chartHeader += " (" + leftDataSet.name;
                }

                if (rightDataSet !== undefined) {
                    timeSeriesChart.drawDataSet(rightDataSet, leftCSS, rightCSS, leftPlot, rightPlot);
                    timeSeriesChart.drawAxis(rightCSS, rightDataSet.series[0].appearanceSettings.yMin, rightDataSet.series[0].appearanceSettings.yMax, { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'right', font: '16px Calibri' });

                    for (var i = 0; i < rightDataSet.series.length; i++) {
                        timeSeriesChart.addLegendRecord("right", rightDataSet.series[i].appearanceSettings.stroke, rightDataSet.series[i].appearanceSettings.name);
                    }

                    var str = chartHeader.indexOf("(") > 0 ? ", " : " (";
                    chartHeader += str + rightDataSet.name + ")";
                } else {
                    chartHeader += ")";
                }

                $("#timeSeriesChartHeader").text(chartHeader);
            }
        }
    }
}
