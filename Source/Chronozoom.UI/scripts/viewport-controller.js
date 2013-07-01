var CZ;
(function (CZ) {
    (function (ViewportController) {
        function ViewportController2(setVisible, getViewport, gesturesSource) {
            this.activeAnimation;
            this.FPS;
            this.maximumPermitedScale;
            this.leftPermitedBound;
            this.rightPermitedBound;
            this.topPermitedBound;
            this.bottomPermitedBound;
            this.effectiveExplorationZoomConstraint = undefined;
            if(!(window).requestAnimFrame) {
                (window).requestAnimFrame = function (callback) {
                    window.setTimeout(callback, 1000 / CZ.Settings.targetFps);
                };
            }
            this.viewportWidth;
            this.viewportHeight;
            this.setVisible = setVisible;
            this.getViewport = getViewport;
            var self = this;
            this.estimatedViewport = undefined;
            this.recentViewport = undefined;
            this.onAnimationComplete = [];
            this.onAnimationUpdated = [];
            this.onAnimationStarted = [];
            function PanViewport(viewport, panGesture) {
                var virtualOffset = viewport.vectorScreenToVirtual(panGesture.xOffset, panGesture.yOffset);
                var oldVisible = viewport.visible;
                viewport.visible.centerX = oldVisible.centerX - virtualOffset.x;
                viewport.visible.centerY = oldVisible.centerY - virtualOffset.y;
            }
            function ZoomViewport(viewport, zoomGesture) {
                var oldVisible = viewport.visible;
                var x = zoomGesture.xOrigin + (viewport.width / 2.0 - zoomGesture.xOrigin) * zoomGesture.scaleFactor;
                var y = zoomGesture.yOrigin + (viewport.height / 2.0 - zoomGesture.yOrigin) * zoomGesture.scaleFactor;
                var newCenter = viewport.pointScreenToVirtual(x, y);
                viewport.visible.centerX = newCenter.x;
                viewport.visible.centerY = newCenter.y;
                viewport.visible.scale = oldVisible.scale * zoomGesture.scaleFactor;
            }
            function calculateTargetViewport(latestViewport, gesture, previouslyEstimatedViewport) {
                var latestVisible = latestViewport.visible;
                var initialViewport;
                if(gesture.Type == "Zoom") {
                    if(gesture.Source == "Touch") {
                        if(previouslyEstimatedViewport) {
                            initialViewport = previouslyEstimatedViewport;
                        } else {
                            initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                        }
                    } else {
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }
                    ZoomViewport(initialViewport, gesture);
                } else {
                    if(previouslyEstimatedViewport) {
                        initialViewport = previouslyEstimatedViewport;
                    } else {
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }
                    PanViewport(initialViewport, gesture);
                }
                return initialViewport;
            }
            this.saveScreenParameters = function (viewport) {
                self.viewportWidth = viewport.width;
                self.viewportHeight = viewport.height;
            };
            this.coerceVisible = function (vp, gesture) {
                this.coerceVisibleInnerZoom(vp, gesture);
                this.coerceVisibleOuterZoom(vp, gesture);
                this.coerceVisibleHorizontalBound(vp);
                this.coerceVisibleVerticalBound(vp);
            };
            this.coerceVisibleOuterZoom = function (vp, gesture) {
                if(gesture.Type === "Zoom") {
                    var visible = vp.visible;
                    if(typeof CZ.Common.maxPermitedScale != 'undefined' && CZ.Common.maxPermitedScale) {
                        if(visible.scale > CZ.Common.maxPermitedScale) {
                            gesture.scaleFactor = CZ.Common.maxPermitedScale / visible.scale;
                            ZoomViewport(vp, gesture);
                        }
                    }
                }
            };
            this.coerceVisibleHorizontalBound = function (vp) {
                var visible = vp.visible;
                if(CZ.Settings.maxPermitedTimeRange) {
                    if(visible.centerX > CZ.Settings.maxPermitedTimeRange.right) {
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.right;
                    } else if(visible.centerX < CZ.Settings.maxPermitedTimeRange.left) {
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.left;
                    }
                }
            };
            this.coerceVisibleVerticalBound = function (vp) {
                var visible = vp.visible;
                if(CZ.Common.maxPermitedVerticalRange) {
                    if(visible.centerY > CZ.Common.maxPermitedVerticalRange.bottom) {
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.bottom;
                    } else if(visible.centerY < CZ.Common.maxPermitedVerticalRange.top) {
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.top;
                    }
                }
            };
            this.coerceVisibleInnerZoom = function (vp, gesture) {
                var visible = vp.visible;
                var x = visible.centerX;
                var scale = visible.scale;
                var constr = undefined;
                if(this.effectiveExplorationZoomConstraint) {
                    constr = this.effectiveExplorationZoomConstraint;
                } else {
                    for(var i = 0; i < CZ.Settings.deeperZoomConstraints.length; i++) {
                        var possibleConstr = CZ.Settings.deeperZoomConstraints[i];
                        if(possibleConstr.left <= x && possibleConstr.right > x) {
                            constr = possibleConstr.scale;
                            break;
                        }
                    }
                }
                if(constr) {
                    if(scale < constr) {
                        visible.scale = constr;
                    }
                }
            };
            self.updateRecentViewport = function () {
                var vp = getViewport();
                var vis = vp.visible;
                self.recentViewport = new CZ.Viewport.Viewport2d(vp.aspectRatio, vp.width, vp.height, new CZ.Viewport.VisibleRegion2d(vis.centerX, vis.centerY, vis.scale));
            };
            gesturesSource.Subscribe(function (gesture) {
                if(typeof gesture != "undefined" && !CZ.Authoring.isActive) {
                    var isAnimationActive = self.activeAnimation;
                    var oldId = isAnimationActive ? self.activeAnimation.ID : undefined;
                    self.updateRecentViewport();
                    var latestViewport = self.recentViewport;
                    if(gesture.Type == "Pin") {
                        self.stopAnimation();
                        return;
                    }
                    if(gesture.Type == "Pan" || gesture.Type == "Zoom") {
                        window.clearTimeout(CZ.Common.requestMissingDataTimer);
                        var newlyEstimatedViewport = calculateTargetViewport(latestViewport, gesture, self.estimatedViewport);
                        if(!self.estimatedViewport) {
                            self.activeAnimation = new CZ.ViewportAnimation.PanZoomAnimation(latestViewport);
                            self.saveScreenParameters(latestViewport);
                        }
                        if(gesture.Type == "Pan") {
                            self.activeAnimation.velocity = CZ.Settings.panSpeedFactor * 0.001;
                        } else {
                            self.activeAnimation.velocity = CZ.Settings.zoomSpeedFactor * 0.0025;
                        }
                        self.activeAnimation.setTargetViewport(newlyEstimatedViewport);
                        self.estimatedViewport = newlyEstimatedViewport;
                    }
                    if(oldId != undefined) {
                        animationUpdated(oldId, self.activeAnimation.ID);
                    } else {
                        AnimationStarted(self.activeAnimation.ID);
                    }
                    if(!isAnimationActive) {
                        self.animationStep(self);
                    }
                }
            });
            self.updateRecentViewport();
            this.saveScreenParameters(self.recentViewport);
            this.stopAnimation = function () {
                self.estimatedViewport = undefined;
                if(self.activeAnimation) {
                    self.activeAnimation.isForciblyStoped = true;
                    self.activeAnimation.isActive = false;
                    animationUpdated(self.activeAnimation.ID, undefined);
                }
            };
            function animationUpdated(oldId, newId) {
                for(var i = 0; i < self.onAnimationUpdated.length; i++) {
                    self.onAnimationUpdated[i](oldId, newId);
                }
            }
            function AnimationStarted(newId) {
                for(var i = 0; i < self.onAnimationStarted.length; i++) {
                    self.onAnimationStarted[i](newId);
                }
            }
            this.animationStep = function (self) {
                if(self.activeAnimation) {
                    if(self.activeAnimation.isActive) {
                        (window).requestAnimFrame(function () {
                            self.animationStep(self);
                        });
                    } else {
                        var stopAnimationID = self.activeAnimation.ID;
                        self.updateRecentViewport();
                        setVisible(new CZ.Viewport.VisibleRegion2d(self.recentViewport.visible.centerX, self.recentViewport.visible.centerY, self.recentViewport.visible.scale));
                        if(!self.activeAnimation.isForciblyStoped) {
                            for(var i = 0; i < self.onAnimationComplete.length; i++) {
                                self.onAnimationComplete[i](stopAnimationID);
                            }
                        }
                        self.activeAnimation = undefined;
                        self.estimatedViewport = undefined;
                        return;
                    }
                    var vp = self.recentViewport;
                    if(self.viewportWidth != vp.width || self.viewportHeight != vp.height) {
                        self.stopAnimation();
                    }
                    var vis = self.activeAnimation.produceNextVisible(vp);
                    setVisible(vis);
                }
                this.frames++;
                this.oneSecondFrames++;
                var e = CZ.Common.vc.virtualCanvas("getLastEvent");
                if(e != null) {
                    CZ.Common.vc.virtualCanvas("mouseMove", e);
                }
            };
            this.frames = 0;
            this.oneSecondFrames = 0;
            window.setInterval(function () {
                self.FPS = self.oneSecondFrames;
                self.oneSecondFrames = 0;
            }, 1000);
            this.PanViewportAccessor = PanViewport;
            this.moveToVisible = function (visible, noAnimation) {
                if(noAnimation) {
                    self.stopAnimation();
                    self.setVisible(visible);
                    return;
                }
                var wasAnimationActive = false;
                var oldId = undefined;
                if(this.activeAnimation) {
                    wasAnimationActive = this.activeAnimation.isActive;
                    oldId = this.activeAnimation.ID;
                }
                self.updateRecentViewport();
                var vp = self.recentViewport;
                this.estimatedViewport = undefined;
                this.activeAnimation = new CZ.ViewportAnimation.EllipticalZoom(vp.visible, visible);
                self.viewportWidth = vp.width;
                self.viewportHeight = vp.height;
                if(!wasAnimationActive) {
                    if(this.activeAnimation.isActive) {
                        AnimationStarted(this.activeAnimation.ID);
                    }
                    setTimeout(function () {
                        return self.animationStep(self);
                    }, 0);
                } else {
                    animationUpdated(oldId, this.activeAnimation.ID);
                }
                return (this.activeAnimation) ? this.activeAnimation.ID : undefined;
            };
        }
        ViewportController.ViewportController2 = ViewportController2;
    })(CZ.ViewportController || (CZ.ViewportController = {}));
    var ViewportController = CZ.ViewportController;
})(CZ || (CZ = {}));
