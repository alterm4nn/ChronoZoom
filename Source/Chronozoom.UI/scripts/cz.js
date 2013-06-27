var constants;
var CZ;
(function (CZ) {
    CZ.timeSeriesChart;
    CZ.leftDataSet;
    CZ.rightDataSet;
    (function (HomePageViewModel) {
        var _uiMap = {
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
            "#message-window": "/ui/message-window.html"
        };
        (function (FeatureActivation) {
            FeatureActivation._map = [];
            FeatureActivation._map[0] = "Enabled";
            FeatureActivation.Enabled = 0;
            FeatureActivation._map[1] = "Disabled";
            FeatureActivation.Disabled = 1;
            FeatureActivation._map[2] = "RootCollection";
            FeatureActivation.RootCollection = 2;
            FeatureActivation._map[3] = "NotRootCollection";
            FeatureActivation.NotRootCollection = 3;
            FeatureActivation._map[4] = "NotProduction";
            FeatureActivation.NotProduction = 4;
        })(HomePageViewModel.FeatureActivation || (HomePageViewModel.FeatureActivation = {}));
        var FeatureActivation = HomePageViewModel.FeatureActivation;
        var _featureMap = [
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
                Activation: FeatureActivation.NotProduction,
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
            
        ];
        HomePageViewModel.rootCollection;
        function UserCanEditCollection(profile) {
            if(CZ.Service.superCollectionName && CZ.Service.superCollectionName.toLowerCase() === "sandbox") {
                return true;
            }
            if(!profile || !profile.DisplayName || !CZ.Service.superCollectionName || profile.DisplayName.toLowerCase() !== CZ.Service.superCollectionName.toLowerCase()) {
                return false;
            }
            return true;
        }
        function InitializeToursUI(profile, forms) {
            var allowEditing = IsFeatureEnabled(_featureMap, "TourAuthoring") && UserCanEditCollection(profile);
            var onToursInitialized = function () {
                CZ.Tours.initializeToursUI();
                $("#tours_index").click(function () {
                    CZ.Tours.removeActiveTour();
                    var toursListForm = getFormById("#toursList");
                    if(toursListForm.isFormVisible) {
                        toursListForm.close();
                    } else {
                        closeAllForms();
                        var form = new CZ.UI.FormToursList(forms[9], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            tourTemplate: forms[10],
                            tours: CZ.Tours.tours,
                            takeTour: function (tour) {
                                CZ.Tours.removeActiveTour();
                                CZ.Tours.activateTour(tour, undefined);
                            },
                            editTour: allowEditing ? function (tour) {
                                if(CZ.Authoring.showEditTourForm) {
                                    CZ.Authoring.showEditTourForm(tour);
                                }
                            } : null
                        });
                        form.show();
                    }
                });
            };
            if(CZ.Tours.tours) {
                onToursInitialized();
            } else {
                $("body").bind("toursInitialized", onToursInitialized);
            }
        }
        var defaultRootTimeline = {
            title: "My Timeline",
            x: 1950,
            endDate: 9999,
            children: [],
            parent: {
                guid: null
            }
        };
        $(document).ready(function () {
            window.console = window.console || (function () {
                var c = {
                };
                c.log = c.warn = c.debug = c.info = c.log = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();
            $('.bubbleInfo').hide();
            var canvasIsEmpty;
            CZ.Common.initialize();
            CZ.UILoader.loadAll(_uiMap).done(function () {
                var forms = arguments;
                CZ.timeSeriesChart = new CZ.UI.LineChart(forms[11]);
                $('#timeSeries_button').click(function () {
                    var tsForm = getFormById('#timeSeriesDataForm');
                    if(tsForm === false) {
                        closeAllForms();
                        var timSeriesDataFormDiv = forms[12];
                        var timSeriesDataForm = new CZ.UI.TimeSeriesDataForm(timSeriesDataFormDiv, {
                            activationSource: $("#timeSeries_button"),
                            closeButton: ".cz-form-close-btn > .cz-form-btn"
                        });
                        timSeriesDataForm.show();
                    } else {
                        if(tsForm.isFormVisible) {
                            tsForm.close();
                        } else {
                            closeAllForms();
                            tsForm.show();
                        }
                    }
                });
                $(".header-icon.edit-icon").click(function () {
                    var editForm = getFormById("#header-edit-form");
                    if(editForm === false) {
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
                    } else {
                        if(editForm.isFormVisible) {
                            editForm.close();
                        } else {
                            closeAllForms();
                            editForm.show();
                        }
                    }
                });
                CZ.Authoring.initialize(CZ.Common.vc, {
                    showMessageWindow: function (message, title, onClose) {
                        var wnd = new CZ.UI.MessageWindow(forms[13], message, title);
                        if(onClose) {
                            wnd.container.bind("close", function () {
                                wnd.container.unbind("close", onClose);
                                onClose();
                            });
                        }
                        wnd.show();
                    },
                    hideMessageWindow: function () {
                        var wnd = forms[13].data("form");
                        if(wnd) {
                            wnd.close();
                        }
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
                if(canvasIsEmpty) {
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
                    allowRedirect: IsFeatureEnabled(_featureMap, "Authoring")
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
                    if(!profileForm.isFormVisible) {
                        closeAllForms();
                        profileForm.show();
                    } else {
                        profileForm.close();
                    }
                });
                if(IsFeatureEnabled(_featureMap, "Login")) {
                    CZ.Service.getProfile().done(function (data) {
                        if(data == "") {
                            $("#login-panel").show();
                        } else if(data != "" && data.DisplayName == null) {
                            $("#profile-panel").show();
                            $("#profile-panel input#username").focus();
                            if(!profileForm.isFormVisible) {
                                closeAllForms();
                                profileForm.show();
                            } else {
                                profileForm.close();
                            }
                        } else {
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $(".auth-panel-login").html(data.DisplayName);
                        }
                        CZ.Authoring.isEnabled = UserCanEditCollection(data);
                        InitializeToursUI(data, forms);
                    }).fail(function (error) {
                        $("#login-panel").show();
                        CZ.Authoring.isEnabled = UserCanEditCollection(null);
                        InitializeToursUI(null, forms);
                    }).always(function () {
                        if(!CZ.Authoring.isEnabled) {
                            $(".edit-icon").hide();
                        }
                    });
                }
                $("#login-panel").click(function (event) {
                    event.preventDefault();
                    if(!loginForm.isFormVisible) {
                        closeAllForms();
                        loginForm.show();
                    } else {
                        loginForm.close();
                    }
                });
            });
            CZ.Service.getServiceInformation().then(function (response) {
                CZ.Settings.contentItemThumbnailBaseUri = response.thumbnailsPath;
                CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
            });
            var url = CZ.UrlNav.getURL();
            HomePageViewModel.rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;
            $('#search_button').mouseup(CZ.Search.onSearchClicked);
            $('#human_rect').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.humanityVisible);
            });
            $('#prehuman_rect').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.prehistoryVisible);
            });
            $('#life_rect').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.lifeVisible);
            });
            $('#earth_rect').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.earthVisible);
            });
            $('#cosmos_rect').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.cosmosVisible);
            });
            $('#humanBookmark').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.humanityVisible);
            });
            $('#prehistoryBookmark').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.prehistoryVisible);
            });
            $('#lifeBookmark').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.lifeVisible);
            });
            $('#earthBookmark').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.earthVisible);
            });
            $('#cosmosBookmark').click(function () {
                CZ.Search.navigateToBookmark(CZ.Common.cosmosVisible);
            });
            $('#breadcrumbs-nav-left').click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right').click(CZ.BreadCrumbs.breadCrumbNavRight);
            $('#tour_prev').mouseout(function () {
                CZ.Common.toggleOffImage('tour_prev');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('tour_prev');
            }).click(CZ.Tours.tourPrev);
            $('#tour_playpause').mouseout(function () {
                CZ.Common.toggleOffImage('tour_playpause');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('tour_playpause');
            }).click(CZ.Tours.tourPlayPause);
            $('#tour_next').mouseout(function () {
                CZ.Common.toggleOffImage('tour_next');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('tour_next');
            }).click(CZ.Tours.tourNext);
            $('#tour_exit').mouseout(function () {
                CZ.Common.toggleOffImage('tour_exit');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('tour_exit');
            }).click(CZ.Tours.tourAbort);
            $('#tours-narration').click(CZ.Tours.onNarrationClick);
            $('#bookmarksCollapse').click(CZ.Tours.onBookmarksCollapse);
            $('#biblCloseButton').mouseout(function () {
                CZ.Common.toggleOffImage('biblCloseButton', 'png');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('biblCloseButton', 'png');
            });
            ApplyFeatureActivation();
            if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            }
            if(navigator.userAgent.indexOf('Mac') != -1) {
                var body = document.getElementsByTagName('body')[0];
                (body).style.overflow = "hidden";
            }
            Seadragon.Config.imagePath = CZ.Settings.seadragonImagePath;
            CZ.Common.maxPermitedVerticalRange = {
                top: 0,
                bottom: 10000000
            };
            if(window.location.hash) {
                CZ.Common.startHash = window.location.hash;
            }
            CZ.Common.loadData().then(function (response) {
                if(!response) {
                    canvasIsEmpty = true;
                    if(CZ.Authoring.showCreateTimelineForm) {
                        CZ.Authoring.showCreateTimelineForm(defaultRootTimeline);
                    }
                }
            });
            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();
            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc);
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax));
            var timeSeriesGestures = CZ.Gestures.getPanPinGesturesStream($("#timeSeriesContainer"));
            var jointGesturesStream = canvasGestures.Merge(axisGestures.Merge(timeSeriesGestures));
            CZ.Common.controller = new CZ.ViewportController.ViewportController2(function (visible) {
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                var markerPos = CZ.Common.axis.MarkerPosition();
                var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;
                CZ.Common.vc.virtualCanvas("setVisible", visible, CZ.Common.controller.activeAnimation);
                CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
                vp = CZ.Common.vc.virtualCanvas("getViewport");
                if(CZ.Tours.pauseTourAtAnyAnimation) {
                    CZ.Tours.tourPause();
                    CZ.Tours.pauseTourAtAnyAnimation = false;
                }
                var hoveredInfodot = CZ.Common.vc.virtualCanvas("getHoveredInfodot");
                var actAni = CZ.Common.controller.activeAnimation != undefined;
                if(actAni && !hoveredInfodot.id) {
                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                    CZ.Common.updateMarker();
                }
                updateTimeSeriesChart(vp);
            }, function () {
                return CZ.Common.vc.virtualCanvas("getViewport");
            }, jointGesturesStream);
            var hashChangeFromOutside = true;
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if(CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.bookmark) {
                    CZ.UrlNav.navigationAnchor = CZ.UrlNav.navStringTovcElement(CZ.Common.setNavigationStringTo.bookmark, CZ.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = CZ.Common.setNavigationStringTo.bookmark;
                } else {
                    if(CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.id == id) {
                        CZ.UrlNav.navigationAnchor = CZ.Common.setNavigationStringTo.element;
                    }
                    var vp = CZ.Common.vc.virtualCanvas("getViewport");
                    window.location.hash = CZ.UrlNav.vcelementToNavString(CZ.UrlNav.navigationAnchor, vp);
                }
                CZ.Common.setNavigationStringTo = null;
            });
            window.addEventListener("hashchange", function () {
                if(window.location.hash && hashChangeFromOutside && CZ.Common.hashHandle) {
                    var hash = window.location.hash;
                    var visReg = CZ.UrlNav.navStringToVisible(window.location.hash.substring(1), CZ.Common.vc);
                    if(visReg) {
                        CZ.Common.isAxisFreezed = true;
                        CZ.Common.controller.moveToVisible(visReg, true);
                        if(window.location.hash != hash) {
                            hashChangeFromOutside = false;
                            window.location.hash = hash;
                        }
                    }
                    CZ.Common.hashHandle = true;
                } else {
                    hashChangeFromOutside = true;
                }
            });
            CZ.Common.controller.onAnimationComplete.push(function () {
            });
            CZ.Common.controller.onAnimationStarted.push(function () {
            });
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if(oldId != undefined && newId == undefined) {
                    setTimeout(function () {
                    }, 500);
                }
            });
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                if(CZ.Tours.tourBookmarkTransitionCompleted != undefined) {
                    CZ.Tours.tourBookmarkTransitionCompleted(id);
                }
                if(CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished") {
                    CZ.Tours.pauseTourAtAnyAnimation = true;
                }
            });
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if(CZ.Tours.tour != undefined) {
                    if(CZ.Tours.tourBookmarkTransitionInterrupted != undefined) {
                        var prevState = CZ.Tours.tour.state;
                        CZ.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = CZ.Tours.tour.state;
                        if(prevState == "play" && alteredState == "pause") {
                            CZ.Tours.tourPause();
                        }
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
                if(bookmark != undefined) {
                    CZ.Common.controller.moveToVisible(bookmark, false);
                }
            });
            CZ.Common.vc.bind("innerZoomConstraintChanged", function (constraint) {
                CZ.Common.controller.effectiveExplorationZoomConstraint = constraint.zoomValue;
                CZ.Common.axis.allowMarkerMovesOnHover = !constraint.zoomValue;
            });
            CZ.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) {
                CZ.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });
            $(window).bind('resize', function () {
                CZ.timeSeriesChart.updateCanvasHeight();
                CZ.Common.updateLayout();
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
            if(bid) {
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        });
        function IsFeatureEnabled(featureMap, featureName) {
            var feature = $.grep(featureMap, function (e) {
                return e.Name === featureName;
            });
            return feature[0].IsEnabled;
        }
        HomePageViewModel.IsFeatureEnabled = IsFeatureEnabled;
        function closeAllForms() {
            $('.cz-major-form').each(function (i, f) {
                var form = $(f).data('form');
                if(form) {
                    form.close();
                }
            });
        }
        function getFormById(name) {
            var form = $(name).data("form");
            if(form) {
                return form;
            } else {
                return false;
            }
        }
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
            if(left < CZ.Settings.maxPermitedTimeRange.left) {
                left = CZ.Settings.maxPermitedTimeRange.left;
            }
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if(right > CZ.Settings.maxPermitedTimeRange.right) {
                right = CZ.Settings.maxPermitedTimeRange.right;
            }
            if(CZ.timeSeriesChart !== undefined) {
                var leftCSS = vp.pointVirtualToScreen(left, 0).x;
                var rightCSS = vp.pointVirtualToScreen(right, 0).x;
                var leftPlot = CZ.Dates.getYMDFromCoordinate(left).year;
                var rightPlot = CZ.Dates.getYMDFromCoordinate(right).year;
                CZ.timeSeriesChart.clear(leftCSS, rightCSS);
                CZ.timeSeriesChart.clearLegend("left");
                CZ.timeSeriesChart.clearLegend("right");
                var chartHeader = "TimeSeries Chart";
                if(CZ.rightDataSet !== undefined || CZ.leftDataSet !== undefined) {
                    CZ.timeSeriesChart.drawVerticalGridLines(leftCSS, rightCSS, leftPlot, rightPlot);
                }
                var screenWidthForLegend = rightCSS - leftCSS;
                if(CZ.rightDataSet !== undefined && CZ.leftDataSet !== undefined) {
                    screenWidthForLegend /= 2;
                }
                var isLegendVisible = CZ.timeSeriesChart.checkLegendVisibility(screenWidthForLegend);
                if(CZ.leftDataSet !== undefined) {
                    var padding = CZ.leftDataSet.getVerticalPadding() + 10;
                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;
                    CZ.leftDataSet.series.forEach(function (seria) {
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });
                    if((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }
                    var axisAppearence = {
                        labelCount: 4,
                        tickLength: 10,
                        majorTickThickness: 1,
                        stroke: 'black',
                        axisLocation: 'left',
                        font: '16px Calibri',
                        verticalPadding: padding
                    };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(leftCSS, rightCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.leftDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);
                    if(isLegendVisible) {
                        for(var i = 0; i < CZ.leftDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("left", CZ.leftDataSet.series[i].appearanceSettings.stroke, CZ.leftDataSet.series[i].appearanceSettings.name);
                        }
                    }
                    chartHeader += " (" + CZ.leftDataSet.name;
                }
                if(CZ.rightDataSet !== undefined) {
                    var padding = CZ.rightDataSet.getVerticalPadding() + 10;
                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;
                    CZ.rightDataSet.series.forEach(function (seria) {
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });
                    if((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }
                    var axisAppearence = {
                        labelCount: 4,
                        tickLength: 10,
                        majorTickThickness: 1,
                        stroke: 'black',
                        axisLocation: 'right',
                        font: '16px Calibri',
                        verticalPadding: padding
                    };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(rightCSS, leftCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.rightDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);
                    if(isLegendVisible) {
                        for(var i = 0; i < CZ.rightDataSet.series.length; i++) {
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
        function ApplyFeatureActivation() {
            for(var idxFeature = 0; idxFeature < _featureMap.length; idxFeature++) {
                var feature = _featureMap[idxFeature];
                if(feature.IsEnabled === undefined) {
                    var enabled = true;
                    if(feature.Activation === FeatureActivation.Disabled) {
                        enabled = false;
                    }
                    if(feature.Activation === FeatureActivation.NotRootCollection && HomePageViewModel.rootCollection) {
                        enabled = false;
                    }
                    if(feature.Activation === FeatureActivation.RootCollection && !HomePageViewModel.rootCollection) {
                        enabled = false;
                    }
                    if(feature.Activation === FeatureActivation.NotProduction && (!constants || constants.environment === "Production")) {
                        enabled = false;
                    }
                    _featureMap[idxFeature].IsEnabled = enabled;
                }
                if(feature.JQueryReference) {
                    if(!_featureMap[idxFeature].IsEnabled) {
                        $(feature.JQueryReference).css("display", "none");
                    } else if(!_featureMap[idxFeature].HasBeenActivated) {
                        _featureMap[idxFeature].HasBeenActivated = true;
                        $(feature.JQueryReference).css("display", "block");
                    }
                }
            }
        }
    })(CZ.HomePageViewModel || (CZ.HomePageViewModel = {}));
    var HomePageViewModel = CZ.HomePageViewModel;
})(CZ || (CZ = {}));
