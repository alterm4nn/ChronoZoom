/// <reference path='common.ts'/>
/// <reference path='viewport-animation.ts'/>
var CZ;
(function (CZ) {
    (function (ViewportController) {
        //constructs the new instance of the viewportController that handles an animations of the viewport
        //@param setVisible (void setVisible(visible))      a callback which is called when controller wants to set intermediate visible regions while animation.
        //@param getViewport (Viewport2D getViewport())     a callback which is called when controller wants to get recent state of corresponding viewport.
        //@param gestureSource (merged RX gesture stream)   an RX stream of gestures described in gestures.js
        function ViewportController2(setVisible, getViewport, gesturesSource) {
            this.activeAnimation;

            //recent FPS value
            this.FPS;

            //the outer visible scale that is permitied to observe.
            //it is automaticly adjusted on each viewport resize event not to let the user observe the interval
            //greater that "maxPermitedTimeRange" interval in settings.cs
            this.maximumPermitedScale;

            //the range that are permited to navigate
            //these values are automaticly updated at each new gesture handling according to present scale of the viewport
            //to adjust an offset in virtual coords that is specified in a settings.cs in a pixels
            //through updatePermitedBounds function
            this.leftPermitedBound;
            this.rightPermitedBound;
            this.topPermitedBound;
            this.bottomPermitedBound;

            //a scale constraint value to prevent the user from zooming too deep into the infodot, contentItem, etc
            //is used in coerceVisibleInnerZoom, and overrides the timelines zooming constraints
            //is to be set by the page that join the controller and the virtual canvas
            //(number)
            this.effectiveExplorationZoomConstraint = undefined;

            if (!(window).requestAnimFrame)
                (window).requestAnimFrame = function (callback) {
                    window.setTimeout(callback, 1000 / CZ.Settings.targetFps);
                };

            //storing screen size to detect window resize
            this.viewportWidth;
            this.viewportHeight;

            //storing callbacks
            this.setVisible = setVisible;
            this.getViewport = getViewport;

            //the latest known state of the viewport
            var self = this;

            //an estimated viewport state that will be at the and of the ongoing pan/zoom animation
            this.estimatedViewport = undefined;

            //a recent copy of the viewport;
            this.recentViewport = undefined;

            //callbacks array. each element will be invoked when animation is completed (viewport took the required state)
            //callback has one argument - the id of complete animation
            this.onAnimationComplete = [];

            //callbacks array. each element will be invoked when the animation parameters are updated or new animation activated
            //callback has two arguments - (the id of interupted animation,the id of newly created animation)
            //if animation is interrapted and no new animation obect is created, a newly created animation id is undefined
            //if anumation is updated and no new animation object is created, a created id is the same as an interrupted id
            this.onAnimationUpdated = [];

            //callbacks array. each element will be invoked when the animation starts
            //callback has one argument - (the id of started animation)
            this.onAnimationStarted = [];

            /*Transforms the viewport correcting its visible according to pan gesture passed
            @param viewport     (Viewport2D)    The viewport to transform
            @param gesture      (PanGesture) The gesture to apply
            */
            function PanViewport(viewport, panGesture) {
                var virtualOffset = viewport.vectorScreenToVirtual(panGesture.xOffset, panGesture.yOffset);
                var oldVisible = viewport.visible;
                viewport.visible.centerX = oldVisible.centerX - virtualOffset.x;
                viewport.visible.centerY = oldVisible.centerY - virtualOffset.y;
            }

            /*Transforms the viewport correcting its visible according to zoom gesture passed
            @param viewport     (Viewport2D)    The viewport to transform
            @param gesture      (ZoomGesture) The gesture to apply
            */
            function ZoomViewport(viewport, zoomGesture) {
                var oldVisible = viewport.visible;
                var x = zoomGesture.xOrigin + (viewport.width / 2.0 - zoomGesture.xOrigin) * zoomGesture.scaleFactor;
                var y = zoomGesture.yOrigin + (viewport.height / 2.0 - zoomGesture.yOrigin) * zoomGesture.scaleFactor;
                var newCenter = viewport.pointScreenToVirtual(x, y);
                viewport.visible.centerX = newCenter.x;
                viewport.visible.centerY = newCenter.y;
                viewport.visible.scale = oldVisible.scale * zoomGesture.scaleFactor;
            }

            /*calculates a viewport that will be actual at the end of the gesture handling animation
            @param previouslyEstimatedViewport       (Viewport2D)    the state of the viewport that is expacted to be at the end of the ongoing Pan/Zoom animation. undefined if no pan/zoom animation is active
            @param gesture                  (Gesture)       the gesture to handle (only Pan and Zoom gesture)
            @param latestViewport           (Viewport2D)    the state of the viewort that is currently observed by the user
            @remarks    The is no checks for gesture type. So make shure that the gestures only of pan and zoom types would be passed to this method
            */
            function calculateTargetViewport(latestViewport, gesture, previouslyEstimatedViewport) {
                var latestVisible = latestViewport.visible;
                var initialViewport;
                if (gesture.Type == "Zoom") {
                    if (gesture.Source == "Touch") {
                        if (previouslyEstimatedViewport)
                            initialViewport = previouslyEstimatedViewport;
else {
                            initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                        }
                    } else {
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }

                    //calculating changed viewport according to the gesture
                    ZoomViewport(initialViewport, gesture);
                } else {
                    if (previouslyEstimatedViewport)
                        initialViewport = previouslyEstimatedViewport;
else {
                        //there is no previously estimated viewport and there is no currently active Pan/Zoom animation. Cloning latest viewport (deep copy)
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }

                    //calculating changed viewport according to the gesture
                    PanViewport(initialViewport, gesture);
                }

                //self.coerceVisible(initialViewport, gesture); //applying navigaion constraints
                return initialViewport;
            }

            /*
            Saves the height and the width of the viewport in screen coordinates and recalculates rependant characteristics (e.g. maximumPermitedScale)
            @param viewport  (Viewport2D) a viewport to take parameters from
            */
            this.saveScreenParameters = function (viewport) {
                self.viewportWidth = viewport.width;
                self.viewportHeight = viewport.height;
            };

            /*
            Is used for coercing of the visible regions produced by the controller according to navigation constraints
            Navigation constraints are set in settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            @param gesture the gesture which caused the viewport to change
            we need the viewport (width, height) and the (zoom)gesture to
            undo the (zoom)gesture when it exceed the navigation constraints
            */
            this.coerceVisible = function (vp, gesture) {
                this.coerceVisibleInnerZoom(vp, gesture);
                this.coerceVisibleOuterZoom(vp, gesture);
                this.coerceVisibleHorizontalBound(vp);
                this.coerceVisibleVerticalBound(vp);
            };

            this.coerceVisibleOuterZoom = function (vp, gesture) {
                if (gesture.Type === "Zoom") {
                    var visible = vp.visible;
                    if (typeof CZ.Common.maxPermitedScale != 'undefined' && CZ.Common.maxPermitedScale) {
                        if (visible.scale > CZ.Common.maxPermitedScale) {
                            gesture.scaleFactor = CZ.Common.maxPermitedScale / visible.scale;
                            ZoomViewport(vp, gesture);
                        }
                    }
                }
            };

            /*
            Applys out of bounds constraint to the visible region (Preventing the user from observing the future time and the past before set treshold)
            The bounds are set as maxPermitedTimeRange variable in a settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            */
            this.coerceVisibleHorizontalBound = function (vp) {
                var visible = vp.visible;
                if (CZ.Settings.maxPermitedTimeRange) {
                    if (visible.centerX > CZ.Settings.maxPermitedTimeRange.right)
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.right;
else if (visible.centerX < CZ.Settings.maxPermitedTimeRange.left)
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.left;
                }
            };

            /*
            Applys out of bounds constraint to the visible region (Preventing the user from observing the future time and the past before set treshold)
            The bounds are set as maxPermitedTimeRange variable in a settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            */
            this.coerceVisibleVerticalBound = function (vp) {
                var visible = vp.visible;
                if (CZ.Common.maxPermitedVerticalRange) {
                    if (visible.centerY > CZ.Common.maxPermitedVerticalRange.bottom)
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.bottom;
else if (visible.centerY < CZ.Common.maxPermitedVerticalRange.top)
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.top;
                }
            };

            /*
            Applys a deeper zoom constraint to the visible region
            Deeper (minimum scale) zoom constraint is set as deeperZoomConstraints array in a settings.js file
            @param vp (Viewport) the viewport.visible region to coerce
            @param gesture the gesture which caused the viewport to change
            */
            this.coerceVisibleInnerZoom = function (vp, gesture) {
                var visible = vp.visible;
                var x = visible.centerX;
                var scale = visible.scale;
                var constr = undefined;
                if (this.effectiveExplorationZoomConstraint)
                    constr = this.effectiveExplorationZoomConstraint;
else
                    for (var i = 0; i < CZ.Settings.deeperZoomConstraints.length; i++) {
                        var possibleConstr = CZ.Settings.deeperZoomConstraints[i];
                        if (possibleConstr.left <= x && possibleConstr.right > x) {
                            constr = possibleConstr.scale;
                            break;
                        }
                    }
                if (constr) {
                    if (scale < constr) {
                        visible.scale = constr;
                    }
                }
            };

            self.updateRecentViewport = function () {
                var vp = getViewport();
                var vis = vp.visible;
                self.recentViewport = new CZ.Viewport.Viewport2d(vp.aspectRatio, vp.width, vp.height, new CZ.Viewport.VisibleRegion2d(vis.centerX, vis.centerY, vis.scale));
            };

            var requestTimer = null;
            this.getMissingData = function (vbox, lca) {
                if (typeof CZ.Authoring === 'undefined' || CZ.Authoring.isActive === false) {
                    window.clearTimeout(requestTimer);
                    requestTimer = window.setTimeout(function () {
                        getMissingTimelines(vbox, lca);
                    }, 1000);
                }
            };

            function getMissingTimelines(vbox, lca) {
                CZ.Data.getTimelines({
                    lca: lca.guid,
                    start: vbox.left,
                    end: vbox.right,
                    minspan: CZ.Settings.minTimelineWidth * vbox.scale
                }).then(function (response) {
                    CZ.Layout.Merge(response, lca);
                    // NYI: Server currently does not support incremental data. Consider/Future:
                    //      var exhibitIds = extractExhibitIds(response);
                    //      getMissingExhibits(vbox, lca, exhibitIds);
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }

            function getMissingExhibits(vbox, lca, exhibitIds) {
                CZ.Service.postData({
                    ids: exhibitIds
                }).then(function (response) {
                    MergeContentItems(lca, exhibitIds, response.exhibits);
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }

            function extractExhibitIds(timeline) {
                var ids = [];
                if (timeline.exhibits instanceof Array) {
                    timeline.exhibits.forEach(function (childExhibit) {
                        ids.push(childExhibit.id);
                    });
                }
                if (timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (childTimeline) {
                        ids = ids.concat(extractExhibitIds(childTimeline));
                    });
                }
                return ids;
            }

            function MergeContentItems(timeline, exhibitIds, exhibits) {
                timeline.children.forEach(function (child) {
                    if (child.type === "infodot") {
                        var idx = exhibitIds.indexOf(child.guid);
                        if (idx !== -1) {
                            child.contentItems = exhibits[idx].contentItems;
                        }
                    }
                });

                timeline.children.forEach(function (child) {
                    if (child.type === "timeline")
                        MergeContentItems(child, exhibitIds, exhibits);
                });
            }

            gesturesSource.Subscribe(function (gesture) {
                if (typeof gesture != "undefined" && !CZ.Authoring.isActive) {
                    var isAnimationActive = self.activeAnimation;
                    var oldId = isAnimationActive ? self.activeAnimation.ID : undefined;

                    self.updateRecentViewport();
                    var latestViewport = self.recentViewport;

                    if (gesture.Type == "Pin") {
                        self.stopAnimation();
                        return;
                    }

                    if (gesture.Type == "Pan" || gesture.Type == "Zoom") {
                        var newlyEstimatedViewport = calculateTargetViewport(latestViewport, gesture, self.estimatedViewport);

                        var vbox = CZ.Common.viewportToViewBox(newlyEstimatedViewport);
                        var wnd = new CZ.VCContent.CanvasRectangle(null, null, null, vbox.left, vbox.top, vbox.width, vbox.height, null);

                        if (!self.estimatedViewport) {
                            self.activeAnimation = new CZ.ViewportAnimation.PanZoomAnimation(latestViewport);

                            //storing size to handle window resize
                            self.saveScreenParameters(latestViewport);
                        }

                        if (gesture.Type == "Pan")
                            self.activeAnimation.velocity = CZ.Settings.panSpeedFactor * 0.001;
else
                            self.activeAnimation.velocity = CZ.Settings.zoomSpeedFactor * 0.0025;

                        //set or update the target state of the viewport
                        self.activeAnimation.setTargetViewport(newlyEstimatedViewport);
                        self.estimatedViewport = newlyEstimatedViewport;
                    }

                    if (oldId != undefined)
                        animationUpdated(oldId, self.activeAnimation.ID);
else
                        AnimationStarted(self.activeAnimation.ID);

                    if (!isAnimationActive)
                        self.animationStep(self);
                }
            });

            self.updateRecentViewport();
            this.saveScreenParameters(self.recentViewport);

            //requests to stop any ongoing animation
            this.stopAnimation = function () {
                self.estimatedViewport = undefined;
                if (self.activeAnimation) {
                    self.activeAnimation.isForciblyStoped = true;
                    self.activeAnimation.isActive = false;

                    animationUpdated(self.activeAnimation.ID, undefined);
                }
            };

            /*
            Notify all subscribers that the ongoiung animation is updated (or halted)
            */
            function animationUpdated(oldId, newId) {
                for (var i = 0; i < self.onAnimationUpdated.length; i++)
                    self.onAnimationUpdated[i](oldId, newId);
            }

            /*
            Notify all subscribers that the animation is started
            */
            function AnimationStarted(newId) {
                for (var i = 0; i < self.onAnimationStarted.length; i++)
                    self.onAnimationStarted[i](newId);
            }

            //sets visible and schedules a new call of animation step if the animation still active and needs more frames
            this.animationStep = function (self) {
                if (self.activeAnimation) {
                    if (self.activeAnimation.isActive)
                        (window).requestAnimFrame(function () {
                            self.animationStep(self);
                        });
else {
                        var stopAnimationID = self.activeAnimation.ID;

                        self.updateRecentViewport();
                        setVisible(new CZ.Viewport.VisibleRegion2d(self.recentViewport.visible.centerX, self.recentViewport.visible.centerY, self.recentViewport.visible.scale));
                        if (!self.activeAnimation.isForciblyStoped)
                            for (var i = 0; i < self.onAnimationComplete.length; i++)
                                self.onAnimationComplete[i](stopAnimationID);
                        self.activeAnimation = undefined;
                        self.estimatedViewport = undefined;
                        return;
                    }

                    var vp = self.recentViewport;
                    if (self.viewportWidth != vp.width || self.viewportHeight != vp.height)
                        self.stopAnimation();

                    var vis = self.activeAnimation.produceNextVisible(vp);
                    setVisible(vis);
                }

                this.frames++;
                this.oneSecondFrames++;

                var e = CZ.Common.vc.virtualCanvas("getLastEvent");
                if (e != null) {
                    CZ.Common.vc.virtualCanvas("mouseMove", e);
                }
            };

            //FrameRate calculation related
            this.frames = 0;
            this.oneSecondFrames = 0;
            window.setInterval(function () {
                self.FPS = self.oneSecondFrames;
                self.oneSecondFrames = 0;
            }, 1000);

            //tests related accessors
            this.PanViewportAccessor = PanViewport;

            //preforms an elliptical zoom to the passed visible region
            //param visible (Visible2D) a visible region to zoom into
            //param noAnimation (bool) - method performs instant transition without any animation if true
            this.moveToVisible = function (visible, noAnimation) {
                var currentViewport = getViewport();
                var targetViewport = new CZ.Viewport.Viewport2d(currentViewport.aspectRatio, currentViewport.width, currentViewport.height, visible);
                var vbox = CZ.Common.viewportToViewBox(targetViewport);
                var wnd = new CZ.VCContent.CanvasRectangle(null, null, null, vbox.left, vbox.top, vbox.width, vbox.height, null);

                if (noAnimation) {
                    self.stopAnimation();
                    self.setVisible(visible);
                    return;
                }

                var wasAnimationActive = false;
                var oldId = undefined;
                if (this.activeAnimation) {
                    wasAnimationActive = this.activeAnimation.isActive;
                    oldId = this.activeAnimation.ID;
                }

                self.updateRecentViewport();
                var vp = self.recentViewport;
                this.estimatedViewport = undefined;
                this.activeAnimation = new CZ.ViewportAnimation.EllipticalZoom(vp.visible, visible);

                //storing size to handle window resize
                self.viewportWidth = vp.width;
                self.viewportHeight = vp.height;

                if (!wasAnimationActive) {
                    if (this.activeAnimation.isActive)
                        AnimationStarted(this.activeAnimation.ID);

                    // Added by Dmitry Voytsekhovskiy, 20/06/2013
                    // I make the animation step call asynchronous to first return the active animation id, then call the step.
                    // This would fix a bug when a target viewport is very close to the current viewport and animation finishes in a single step,
                    // hence it calls the animation completed handlers which accept the animation id, but these handler couldn't yet get the id to expect
                    // if the call is synchronous.
                    setTimeout(function () {
                        return self.animationStep(self);
                    }, 0);
                } else {
                    animationUpdated(oldId, this.activeAnimation.ID);
                }

                return (this.activeAnimation) ? this.activeAnimation.ID : undefined;
            };
            //end of public fields
        }
        ViewportController.ViewportController2 = ViewportController2;
    })(CZ.ViewportController || (CZ.ViewportController = {}));
    var ViewportController = CZ.ViewportController;
})(CZ || (CZ = {}));
