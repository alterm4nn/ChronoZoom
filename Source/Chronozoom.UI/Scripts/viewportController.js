var ChronoZoom;
(function (ChronoZoom) {
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
                    window.setTimeout(callback, 1000 / ChronoZoom.Settings.targetFps);
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
                            initialViewport = new ChronoZoom.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new ChronoZoom.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                        }
                    } else {
                        initialViewport = new ChronoZoom.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new ChronoZoom.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }
                    ZoomViewport(initialViewport, gesture);
                } else {
                    if(previouslyEstimatedViewport) {
                        initialViewport = previouslyEstimatedViewport;
                    } else {
                        initialViewport = new ChronoZoom.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new ChronoZoom.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }
                    PanViewport(initialViewport, gesture);
                }
                self.coerceVisible(initialViewport, gesture);
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
                    if(ChronoZoom.Common.maxPermitedScale) {
                        if(visible.scale > ChronoZoom.Common.maxPermitedScale) {
                            gesture.scaleFactor = ChronoZoom.Common.maxPermitedScale / visible.scale;
                            ZoomViewport(vp, gesture);
                        }
                    }
                }
            };
            this.coerceVisibleHorizontalBound = function (vp) {
                var visible = vp.visible;
                if(ChronoZoom.Settings.maxPermitedTimeRange) {
                    if(visible.centerX > ChronoZoom.Settings.maxPermitedTimeRange.right) {
                        visible.centerX = ChronoZoom.Settings.maxPermitedTimeRange.right;
                    } else if(visible.centerX < ChronoZoom.Settings.maxPermitedTimeRange.left) {
                        visible.centerX = ChronoZoom.Settings.maxPermitedTimeRange.left;
                    }
                }
            };
            this.coerceVisibleVerticalBound = function (vp) {
                var visible = vp.visible;
                if(ChronoZoom.Common.maxPermitedVerticalRange) {
                    if(visible.centerY > ChronoZoom.Common.maxPermitedVerticalRange.bottom) {
                        visible.centerY = ChronoZoom.Common.maxPermitedVerticalRange.bottom;
                    } else if(visible.centerY < ChronoZoom.Common.maxPermitedVerticalRange.top) {
                        visible.centerY = ChronoZoom.Common.maxPermitedVerticalRange.top;
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
                    for(var i = 0; i < ChronoZoom.Settings.deeperZoomConstraints.length; i++) {
                        var possibleConstr = ChronoZoom.Settings.deeperZoomConstraints[i];
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
                self.recentViewport = new ChronoZoom.Viewport.Viewport2d(vp.aspectRatio, vp.width, vp.height, new ChronoZoom.Viewport.VisibleRegion2d(vis.centerX, vis.centerY, vis.scale));
            };
            gesturesSource.Subscribe(function (gesture) {
                if(typeof gesture != "undefined") {
                    var isAnimationActive = self.activeAnimation;
                    var oldId = isAnimationActive ? self.activeAnimation.id : undefined;
                    self.updateRecentViewport();
                    var latestViewport = self.recentViewport;
                    if(gesture.Type == "Pin") {
                        self.stopAnimation();
                        return;
                    }
                    if(gesture.Type == "Pan" || gesture.Type == "Zoom") {
                        var newlyEstimatedViewport = calculateTargetViewport(latestViewport, gesture, self.estimatedViewport);
                        if(!self.estimatedViewport) {
                            self.activeAnimation = new ChronoZoom.ViewportAnimation.PanZoomAnimation(latestViewport);
                            self.saveScreenParameters(latestViewport);
                        }
                        if(gesture.Type == "Pan") {
                            self.activeAnimation.velocity = ChronoZoom.Settings.panSpeedFactor * 0.001;
                        } else {
                            self.activeAnimation.velocity = ChronoZoom.Settings.zoomSpeedFactor * 0.0025;
                        }
                        self.activeAnimation.setTargetViewport(newlyEstimatedViewport);
                        self.estimatedViewport = newlyEstimatedViewport;
                    }
                    if(oldId != undefined) {
                        animationUpdated(oldId, self.activeAnimation.id);
                    } else {
                        AnimationStarted(self.activeAnimation.id);
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
                    animationUpdated(self.activeAnimation.id, undefined);
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
                        var stopAnimationID = self.activeAnimation.id;
                        self.updateRecentViewport();
                        setVisible(new ChronoZoom.Viewport.VisibleRegion2d(self.recentViewport.visible.centerX, self.recentViewport.visible.centerY, self.recentViewport.visible.scale));
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
                var e = ChronoZoom.Common.vc.virtualCanvas("getLastEvent");
                if(e != null) {
                    ChronoZoom.Common.vc.virtualCanvas("mouseMove", e);
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
                    oldId = this.activeAnimation.id;
                }
                self.updateRecentViewport();
                var vp = self.recentViewport;
                this.estimatedViewport = undefined;
                this.activeAnimation = new ChronoZoom.ViewportAnimation.EllipticalZoom(vp.visible, visible);
                self.viewportWidth = vp.width;
                self.viewportHeight = vp.height;
                if(!wasAnimationActive) {
                    if(this.activeAnimation.isActive) {
                        AnimationStarted(this.activeAnimation.id);
                    }
                    self.animationStep(self);
                } else {
                    animationUpdated(oldId, this.activeAnimation.id);
                }
                return (this.activeAnimation) ? this.activeAnimation.id : undefined;
            };
        }
        ViewportController.ViewportController2 = ViewportController2;
    })(ChronoZoom.ViewportController || (ChronoZoom.ViewportController = {}));
    var ViewportController = ChronoZoom.ViewportController;
})(ChronoZoom || (ChronoZoom = {}));
