var CZ;
(function (CZ) {
    var HomePageViewModel;
    (function (HomePageViewModel) {
        var _uiMap = {
            "#auth-event-form": "/ui/auth-event-form.html",
            "#auth-edit-timeline-form": "/ui/auth-edit-timeline-form.html",
            "#auth-edit-exhibit-form": "/ui/auth-edit-exhibit-form.html",
            "#auth-edit-ci-form": "/ui/auth-edit-ci-form.html"
        };
        var FeatureActivation;
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
        })(FeatureActivation || (FeatureActivation = {}));
        var _featureMap = [
            {
                Name: "Login",
                Activation: FeatureActivation.NotRootCollection,
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
                JQueryReference: ".footer-authoring-link"
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
            
        ];
        $(document).ready(function () {
            window.console = window.console || (function () {
                var c = {
                };
                c.log = c.warn = c.debug = c.info = c.log = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();
            $('.bubbleInfo').hide();
            CZ.Common.initialize();
            CZ.UILoader.loadAll(_uiMap).done(function () {
                var forms = arguments;
                CZ.Authoring.initialize(CZ.Common.vc, {
                    showCreateTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $("a:contains('create timeline')"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            context: timeline
                        });
                        form.show();
                    },
                    showEditTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $("#showButton"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateExhibitForm: function (exhibit) {
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $("a:contains('create exhibit')"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-form-contentitems",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditExhibitForm: function (exhibit) {
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $("#showButton"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-form-contentitems",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditContentItemForm: function (ci, e) {
                        var form = new CZ.UI.FormEditCI(forms[3], {
                            activationSource: $("#showButton"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            saveButton: ".cz-form-save",
                            titleInput: ".cz-form-item-title",
                            mediaSourceInput: ".cz-form-item-mediasource",
                            mediaInput: ".cz-form-item-mediaurl",
                            descriptionInput: ".cz-form-item-descr",
                            attributionInput: ".cz-form-item-attribution",
                            mediaTypeInput: ".cz-form-item-media-type",
                            context: ci
                        });
                        form.show();
                    }
                });
            });
            CZ.Service.getServiceInformation().then(function (response) {
                CZ.Settings.contentItemThumbnailBaseUri = response.ThumbnailsPath;
            });
            var url = CZ.UrlNav.getURL();
            var rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            $('#search_button').mouseup(CZ.Search.onSearchClicked).mouseover(function () {
                CZ.Search.searchHighlight(true);
            }).mouseout(function () {
                CZ.Search.searchHighlight(false);
            });
            $('#tours_index').mouseup(CZ.Tours.onTourClicked).mouseover(function () {
                CZ.Tours.tourButtonHighlight(true);
            }).mouseout(function () {
                CZ.Tours.tourButtonHighlight(false);
            });
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
            $('#welcomeScreenCloseButton').mouseover(function () {
                CZ.Common.toggleOnImage('welcomeScreenCloseButton', 'png');
            }).mouseout(function () {
                CZ.Common.toggleOffImage('welcomeScreenCloseButton', 'png');
            }).click(CZ.Common.hideWelcomeScreen);
            $('#closeWelcomeScreenButton').click(CZ.Common.closeWelcomeScreen);
            var wlcmScrnCookie = CZ.Common.getCookie("welcomeScreenDisallowed");
            if(wlcmScrnCookie != null) {
                CZ.Common.hideWelcomeScreen();
            } else {
                $("#welcomeScreenOut").click(function (e) {
                    e.stopPropagation();
                });
                $("#welcomeScreenBack").click(function () {
                    CZ.Common.closeWelcomeScreen();
                });
            }
            _featureMap.forEach(function (feature) {
                var enabled = true;
                if(feature.Activation === FeatureActivation.Disabled) {
                    enabled = false;
                }
                if(feature.Activation === FeatureActivation.NotRootCollection && rootCollection) {
                    enabled = false;
                }
                if(feature.Activation === FeatureActivation.RootCollection && !rootCollection) {
                    enabled = false;
                }
                if(!enabled) {
                    $(feature.JQueryReference).css("display", "none");
                }
            });
            if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                if(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                    var oprversion = new Number(RegExp.$1);
                    if(oprversion < 14.0) {
                        var fallback_agreement = CZ.Common.getCookie("new_bad_browser_agreement");
                        if((fallback_agreement == null) || (fallback_agreement == "")) {
                            window.location.href = "testFallBackPage.htm";
                            return;
                        }
                    }
                }
            } else if(navigator.userAgent.toLowerCase().indexOf('version') > -1) {
                if(/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                    var oprversion = new Number(RegExp.$1);
                    if(oprversion < 5.0) {
                        var fallback_agreement = CZ.Common.getCookie("new_bad_browser_agreement");
                        if((fallback_agreement == null) || (fallback_agreement == "")) {
                            window.location.href = "testFallBackPage.htm";
                            return;
                        }
                    }
                }
            } else {
                var br = ($).browser;
                var isIe9 = br.msie && parseInt(br.version, 10) >= 9;
                if(!isIe9) {
                    var isFF9 = br.mozilla && parseInt(br.version, 10) >= 7;
                    if(!isFF9) {
                        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                        if(!is_chrome) {
                            var fallback_agreement = CZ.Common.getCookie("new_bad_browser_agreement");
                            if((fallback_agreement == null) || (fallback_agreement == "")) {
                                window.location.href = "testFallBackPage.htm";
                                return;
                            }
                        }
                        return;
                    }
                }
            }
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
            CZ.Common.loadData();
            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();
            CZ.Tours.initializeToursUI();
            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc);
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax));
            var jointGesturesStream = canvasGestures.Merge(axisGestures);
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
            if(bid) {
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        });
    })(HomePageViewModel || (HomePageViewModel = {}));
})(CZ || (CZ = {}));
