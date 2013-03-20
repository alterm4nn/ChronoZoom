/// <reference path='scripts/cz.settings.ts'/>
/// <reference path='scripts/common.ts'/>
/// <reference path='scripts/axis.ts'/>
/// <reference path='scripts/viewportcontroller.ts'/>
/// <reference path='scripts/gestures.ts'/>
/// <reference path='scripts/tours.ts'/>
/// <reference path='scripts/virtualCanvas.ts'/>
/// <reference path='scripts/typings/jquery/jquery.d.ts'/>
var ChronoZoom;
(function (ChronoZoom) {
    var HomePageViewModel;
    (function (HomePageViewModel) {
        $(document).ready(function () {
            $('.bubbleInfo').hide();
            ChronoZoom.Common.initialize();
            ChronoZoom.Common.ax.showThresholds = true;
            $('#search_button').mouseup(ChronoZoom.Search.onSearchClicked).mouseover(function () {
                ChronoZoom.Search.searchHighlight(true);
            }).mouseout(function () {
                ChronoZoom.Search.searchHighlight(false);
            });
            $('#tours_index').mouseup(ChronoZoom.Tours.onTourClicked).mouseover(function () {
                ChronoZoom.Tours.tourButtonHighlight(true);
            }).mouseout(function () {
                ChronoZoom.Tours.tourButtonHighlight(true);
            });
            $('#human_rect').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.humanityVisible);
            });
            $('#prehuman_rect').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.prehistoryVisible);
            });
            $('#life_rect').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.lifeVisible);
            });
            $('#earth_rect').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.earthVisible);
            });
            $('#cosmos_rect').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.cosmosVisible);
            });
            $('#humanBookmark').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.humanityVisible);
            });
            $('#prehistoryBookmark').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.prehistoryVisible);
            });
            $('#lifeBookmark').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.lifeVisible);
            });
            $('#earthBookmark').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.earthVisible);
            });
            $('#cosmosBookmark').click(function () {
                ChronoZoom.Search.navigateToBookmark(ChronoZoom.Common.cosmosVisible);
            });
            $('#bc_navLeft').click(ChronoZoom.BreadCrumbs.breadCrumbNavLeft);
            $('#bc_navRight').click(ChronoZoom.BreadCrumbs.breadCrumbNavRight);
            $('#tour_prev').mouseout(function () {
                ChronoZoom.Common.toggleOffImage('tour_prev');
            }).mouseover(function () {
                ChronoZoom.Common.toggleOnImage('tour_prev');
            }).click(ChronoZoom.Tours.tourPrev);
            $('#tour_playpause').mouseout(function () {
                ChronoZoom.Common.toggleOffImage('tour_playpause');
            }).mouseover(function () {
                ChronoZoom.Common.toggleOnImage('tour_playpause');
            }).click(ChronoZoom.Tours.tourPlayPause);
            $('#tour_next').mouseout(function () {
                ChronoZoom.Common.toggleOffImage('tour_next');
            }).mouseover(function () {
                ChronoZoom.Common.toggleOnImage('tour_next');
            }).click(ChronoZoom.Tours.tourNext);
            $('#tour_exit').mouseout(function () {
                ChronoZoom.Common.toggleOffImage('tour_exit');
            }).mouseover(function () {
                ChronoZoom.Common.toggleOnImage('tour_exit');
            }).click(ChronoZoom.Tours.tourAbort);
            $('#tours-narration').click(ChronoZoom.Tours.onNarrationClick);
            $('#bookmarksCollapse').click(ChronoZoom.Tours.onBookmarksCollapse);
            $('#biblCloseButton').mouseout(function () {
                ChronoZoom.Common.toggleOffImage('biblCloseButton', 'png');
            }).mouseover(function () {
                ChronoZoom.Common.toggleOnImage('biblCloseButton', 'png');
            });
            $('#welcomeScreenCloseButton').mouseover(function () {
                ChronoZoom.Common.toggleOnImage('welcomeScreenCloseButton', 'png');
            }).mouseout(function () {
                ChronoZoom.Common.toggleOffImage('welcomeScreenCloseButton', 'png');
            }).click(ChronoZoom.Common.hideWelcomeScreen);
            $('#closeWelcomeScreenButton').click(ChronoZoom.Common.closeWelcomeScreen);
            $('#regime_navigator').click(ChronoZoom.Common.passThrough);
            var wlcmScrnCookie = ChronoZoom.Common.getCookie("welcomeScreenDisallowed");
            if(wlcmScrnCookie != null) {
                ChronoZoom.Common.hideWelcomeScreen();
            } else {
                // click on gray area hides welcome screen
                $("#welcomeScreenOut").click(function (e) {
                    e.stopPropagation();
                });
                $("#welcomeScreenBack").click(function () {
                    ChronoZoom.Common.hideWelcomeScreen();
                });
            }
            if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                if(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                    var oprversion = new Number(RegExp.$1);// capture x.x portion and store as a number
                    
                    if(oprversion < 14.0) {
                        var fallback_agreement = ChronoZoom.Common.getCookie("new_bad_browser_agreement");
                        if((fallback_agreement == null) || (fallback_agreement == "")) {
                            window.location.href = "testFallBackPage.htm";
                            return;
                        }
                    }
                }
            } else if(navigator.userAgent.toLowerCase().indexOf('version') > -1) {
                if(/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                    var oprversion = new Number(RegExp.$1);// capture x.x portion and store as a number
                    
                    if(oprversion < 5.0) {
                        var fallback_agreement = ChronoZoom.Common.getCookie("new_bad_browser_agreement");
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
                            var fallback_agreement = ChronoZoom.Common.getCookie("new_bad_browser_agreement");
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
                // Suppress the default iOS elastic pan/zoom actions.
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            }
            if(navigator.userAgent.indexOf('Mac') != -1) {
                // Disable Mac OS Scrolling Bounce Effect
                var body = document.getElementsByTagName('body')[0];
                (body).style.overflow = "hidden";
            }
            // init seadragon. set path to image resources for nav buttons
            Seadragon.Config.imagePath = ChronoZoom.Settings.seadragonImagePath;
            ChronoZoom.Common.maxPermitedVerticalRange = {
                top: 0,
                bottom: 10000000
            }//temporary value until there is no data
            ;
            ChronoZoom.Common.regimeNavigator = $('#regime_navigator');
            ChronoZoom.Common.regimesRatio = 300 / Math.abs(ChronoZoom.Settings.maxPermitedTimeRange.left - ChronoZoom.Settings.maxPermitedTimeRange.right);
            if(window.location.hash) {
                ChronoZoom.Common.startHash = window.location.hash;
            }// to be processes after the data is loaded
            
            ChronoZoom.Common.loadData()//retrieving the data
            ;
            ChronoZoom.Search.initializeSearch();
            ChronoZoom.Bibliography.initializeBibliography();
            ChronoZoom.Tours.initializeToursUI();
            var canvasGestures = ChronoZoom.Gestures.getGesturesStream(ChronoZoom.Common.vc);//gesture sequence of the virtual canvas
            
            var axisGestures = ChronoZoom.Gestures.applyAxisBehavior(ChronoZoom.Gestures.getGesturesStream(ChronoZoom.Common.ax));//gesture sequence of axis (tranformed according to axis behavior logic)
            
            var jointGesturesStream = canvasGestures.Merge(axisGestures);
            ChronoZoom.Common.controller = new ChronoZoom.ViewportController.ViewportController2(function (visible) {
                var vp = ChronoZoom.Common.vc.virtualCanvas("getViewport");
                var markerPos = ChronoZoom.Common.ax.axis("MarkerPosition");
                var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;
                ChronoZoom.Common.vc.virtualCanvas("setVisible", visible, ChronoZoom.Common.controller.activeAnimation);
                ChronoZoom.Common.updateAxis(ChronoZoom.Common.vc, ChronoZoom.Common.ax);
                vp = ChronoZoom.Common.vc.virtualCanvas("getViewport");
                if(ChronoZoom.Tours.pauseTourAtAnyAnimation) {
                    //watch for the user animation during playing of some tour bookmark
                    ChronoZoom.Tours.tourPause();
                    ChronoZoom.Tours.pauseTourAtAnyAnimation = false;
                }
                var hoveredInfodot = ChronoZoom.Common.vc.virtualCanvas("getHoveredInfodot");
                var actAni = ChronoZoom.Common.controller.activeAnimation != undefined;
                if(actAni && !hoveredInfodot.id) {
                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                    ChronoZoom.Common.ax.axis("setTimeMarker", newMarkerPos);
                }
                ChronoZoom.Common.updateNavigator(vp);
            }, function () {
                return ChronoZoom.Common.vc.virtualCanvas("getViewport");
            }, jointGesturesStream);
            var hashChangeFromOutside = true;// True if url is changed externally
            
            // URL Nav: update URL when animation is complete
            ChronoZoom.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if(ChronoZoom.Common.setNavigationStringTo && ChronoZoom.Common.setNavigationStringTo.bookmark) {
                    // go to search result
                    ChronoZoom.UrlNav.navigationAnchor = ChronoZoom.UrlNav.navStringTovcElement(ChronoZoom.Common.setNavigationStringTo.bookmark, ChronoZoom.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = ChronoZoom.Common.setNavigationStringTo.bookmark;
                } else {
                    if(ChronoZoom.Common.setNavigationStringTo && ChronoZoom.Common.setNavigationStringTo.id == id) {
                        ChronoZoom.UrlNav.navigationAnchor = ChronoZoom.Common.setNavigationStringTo.element;
                    }
                    var vp = ChronoZoom.Common.vc.virtualCanvas("getViewport");
                    window.location.hash = ChronoZoom.UrlNav.vcelementToNavString(ChronoZoom.UrlNav.navigationAnchor, vp);
                }
                ChronoZoom.Common.setNavigationStringTo = null;
            });
            // URL Nav: handle URL changes from outside
            window.addEventListener("hashchange", function () {
                if(window.location.hash && hashChangeFromOutside && ChronoZoom.Common.hashHandle) {
                    var hash = window.location.hash;
                    var visReg = ChronoZoom.UrlNav.navStringToVisible(window.location.hash.substring(1), ChronoZoom.Common.vc);
                    if(visReg) {
                        ChronoZoom.Common.isAxisFreezed = true;
                        ChronoZoom.Common.controller.moveToVisible(visReg, true);
                        // to make sure that the hash is correct (it can be incorrectly changed in onCurrentlyObservedInfodotChanged)
                        if(window.location.hash != hash) {
                            hashChangeFromOutside = false;
                            window.location.hash = hash;
                        }
                    }
                    ChronoZoom.Common.hashHandle = true;
                } else {
                    hashChangeFromOutside = true;
                }
            });
            // Axis: enable showing thresholds
            ChronoZoom.Common.controller.onAnimationComplete.push(function () {
                ChronoZoom.Common.ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds enabled"));
                            });
            //Axis: disable showing thresholds
            ChronoZoom.Common.controller.onAnimationStarted.push(function () {
                ChronoZoom.Common.ax.axis("enableThresholds", true);
                //if (window.console && console.log("thresholds disabled"));
                            });
            // Axis: enable showing thresholds
            ChronoZoom.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if(oldId != undefined && newId == undefined) {
                    // animation interrupted
                    setTimeout(function () {
                        ChronoZoom.Common.ax.axis("enableThresholds", true);
                        //if (window.console && console.log("thresholds enabled"));
                                            }, 500);
                }
            });
            //Tour: notifyng tour that the bookmark is reached
            ChronoZoom.Common.controller.onAnimationComplete.push(function (id) {
                if(ChronoZoom.Tours.tourBookmarkTransitionCompleted != undefined) {
                    ChronoZoom.Tours.tourBookmarkTransitionCompleted(id);
                }
                if(ChronoZoom.Tours.tour != undefined && ChronoZoom.Tours.tour.state != "finished") {
                    //enabling wathcing for user activity while playing the bookmark
                    ChronoZoom.Tours.pauseTourAtAnyAnimation = true;
                }
            });
            //Tour: notifyng tour that the transition was interrupted
            ChronoZoom.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if(ChronoZoom.Tours.tour != undefined) {
                    if(ChronoZoom.Tours.tourBookmarkTransitionInterrupted != undefined) {
                        //in transition
                        var prevState = ChronoZoom.Tours.tour.state;
                        ChronoZoom.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = ChronoZoom.Tours.tour.state;
                        if(prevState == "play" && alteredState == "pause") {
                            //interruption caused toue pausing. stop any animations, updating UI as well
                            ChronoZoom.Tours.tourPause();
                        }
                        ChronoZoom.Common.setNavigationStringTo = null;
                    }
                }
            });
            ChronoZoom.Common.updateLayout();
            ChronoZoom.Common.vc.bind("elementclick", function (e) {
                ChronoZoom.Search.navigateToElement(e);
            });
            ChronoZoom.Common.vc.bind('cursorPositionChanged', function (cursorPositionChangedEvent) {
                ChronoZoom.Common.updateMarker();
            });
            ChronoZoom.Common.ax.bind('thresholdBookmarkChanged', function (thresholdBookmark) {
                var bookmark = ChronoZoom.UrlNav.navStringToVisible(thresholdBookmark.Bookmark, ChronoZoom.Common.vc);
                if(bookmark != undefined) {
                    ChronoZoom.Common.controller.moveToVisible(bookmark, false);
                }
            });
            // Reacting on the event when one of the infodot exploration causes inner zoom constraint
            ChronoZoom.Common.vc.bind("innerZoomConstraintChenged", function (constraint) {
                ChronoZoom.Common.controller.effectiveExplorationZoomConstraint = constraint.zoomValue// applying the constraint
                ;
                ChronoZoom.Common.ax.axis("allowMarkerMovesOnHover", !constraint.zoomValue);
            });
            ChronoZoom.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) {
                //reacting on the event when the first timeline that contains whole visible region is changed
                ChronoZoom.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });
            $(window).bind('resize', function () {
                ChronoZoom.Common.updateLayout();
            });
            var vp = ChronoZoom.Common.vc.virtualCanvas("getViewport");
            ChronoZoom.Common.vc.virtualCanvas("setVisible", ChronoZoom.VCContent.getVisibleForElement({
                x: -13700000000,
                y: 0,
                width: 13700000000,
                height: 5535444444.444445
            }, 1.0, vp));
            ChronoZoom.Common.updateAxis(ChronoZoom.Common.vc, ChronoZoom.Common.ax);
            var bid = window.location.hash.match("b=([a-z0-9_]+)");
            if(bid) {
                //bid[0] - source string
                //bid[1] - found match
                $("#bibliography .sources").empty();
                $("#bibliography .title").html("<span>Loading...</span>");
                $("#bibliographyBack").css("display", "block");
            }
        });
    })(HomePageViewModel || (HomePageViewModel = {}));
})(ChronoZoom || (ChronoZoom = {}));
