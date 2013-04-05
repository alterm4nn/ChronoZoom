var CZ;
(function (CZ) {
    (function (ViewportAnimation) {
        var globalAnimationID = 1;
        function PanZoomAnimation(startViewport) {
            this.isForciblyStoped = false;
            this.ID = globalAnimationID++;
            var startVisible = startViewport.visible;
            this.velocity = 0.001;
            this.isActive = true;
            this.type = "PanZoom";
            this.startViewport = new CZ.Viewport.Viewport2d(startViewport.aspectRatio, startViewport.width, startViewport.height, new CZ.Viewport.VisibleRegion2d(startVisible.centerX, startVisible.centerY, startVisible.scale));
            this.estimatedEndViewport;
            this.endCenterInSC;
            this.startCenterInSC = this.startViewport.pointVirtualToScreen(startVisible.centerX, startVisible.centerY);
            this.previousFrameCenterInSC = this.startCenterInSC;
            this.previousFrameViewport = this.startViewport;
            this.prevFrameTime = new Date();
            this.direction;
            this.pathLeng;
            this.setTargetViewport = function (estimatedEndViewport) {
                this.estimatedEndViewport = estimatedEndViewport;
                var prevVis = this.previousFrameViewport.visible;
                this.startViewport = new CZ.Viewport.Viewport2d(this.previousFrameViewport.aspectRatio, this.previousFrameViewport.width, this.previousFrameViewport.height, new CZ.Viewport.VisibleRegion2d(prevVis.centerX, prevVis.centerY, prevVis.scale));
                this.startCenterInSC = this.startViewport.pointVirtualToScreen(prevVis.centerX, prevVis.centerY);
                this.previousFrameCenterInSC = {
                    x: this.startCenterInSC.x,
                    y: this.startCenterInSC.y
                };
                var estimatedVisible = this.estimatedEndViewport.visible;
                this.endCenterInSC = this.startViewport.pointVirtualToScreen(estimatedVisible.centerX, estimatedVisible.centerY);
                this.direction = {
                    X: this.endCenterInSC.x - this.startCenterInSC.x,
                    Y: this.endCenterInSC.y - this.startCenterInSC.y
                };
                var dirX = this.direction.X;
                var dirY = this.direction.Y;
                this.pathLeng = Math.sqrt(dirX * dirX + dirY * dirY);
                if(this.pathLeng < 1e-1) {
                    this.direction.X = this.direction.Y = 0;
                    if(estimatedVisible.scale == prevVis.scale) {
                        this.isActive = false;
                    }
                } else {
                    this.direction.X /= this.pathLeng;
                    this.direction.Y /= this.pathLeng;
                }
            };
            this.produceNextVisible = function (currentViewport) {
                var currentCenterInSC = this.startViewport.pointVirtualToScreen(currentViewport.visible.centerX, currentViewport.visible.centerY);
                var currScale = currentViewport.visible.scale;
                var startVisible = this.startViewport.visible;
                var curTime = new Date();
                var timeDiff = curTime.getTime() - this.prevFrameTime.getTime();
                var k = this.velocity * timeDiff;
                var dx = this.endCenterInSC.x - this.previousFrameCenterInSC.x;
                var dy = this.endCenterInSC.y - this.previousFrameCenterInSC.y;
                var curDist = Math.max(1.0, Math.sqrt(dx * dx + dy * dy));
                var prevFrameVisible = this.previousFrameViewport.visible;
                var updatedVisible = new CZ.Viewpoer.VisibleRegion2d(prevFrameVisible.centerX, prevFrameVisible.centerY, prevFrameVisible.scale);
                this.previousFrameCenterInSC.x += curDist * k * this.direction.X;
                this.previousFrameCenterInSC.y += curDist * k * this.direction.Y;
                updatedVisible.scale += (this.estimatedEndViewport.visible.scale - updatedVisible.scale) * k;
                this.prevFrameTime = curTime;
                dx = this.previousFrameCenterInSC.x - this.startCenterInSC.x;
                dy = this.previousFrameCenterInSC.y - this.startCenterInSC.y;
                var distToStart = Math.sqrt(dx * dx + dy * dy);
                var scaleDistToStart = this.estimatedEndViewport.visible.scale - startVisible.scale;
                var scaleDistCurrent = updatedVisible.scale - startVisible.scale;
                if((distToStart >= this.pathLeng) || Math.abs(scaleDistCurrent) > Math.abs(scaleDistToStart)) {
                    this.isActive = false;
                    return this.estimatedEndViewport.visible;
                }
                ;
                var virtPoint = this.startViewport.pointScreenToVirtual(this.previousFrameCenterInSC.x, this.previousFrameCenterInSC.y);
                updatedVisible.centerX = virtPoint.x;
                updatedVisible.centerY = virtPoint.y;
                this.previousFrameViewport.visible = updatedVisible;
                return updatedVisible;
            };
        }
        ViewportAnimation.PanZoomAnimation = PanZoomAnimation;
        function EllipticalZoom(startVisible, endVisible) {
            this.isForciblyStoped = false;
            this.ID = globalAnimationID++;
            this.type = "EllipticalZoom";
            this.isActive = true;
            this.targetVisible = new CZ.Viewport.VisibleRegion2d(endVisible.centerX, endVisible.centerY, endVisible.scale);
            this.startTime = (new Date()).getTime();
            this.imprecision = 0.0001;
            function cosh(x) {
                return (Math.exp(x) + Math.exp(-x)) / 2;
            }
            function sinh(x) {
                return (Math.exp(x) - Math.exp(-x)) / 2;
            }
            function tanh(x) {
                return sinh(x) / cosh(x);
            }
            this.u = function (s) {
                var val = this.startScale / Math.pow(this.ro, 2) * cosh(this.r0) * tanh(this.ro * s + this.r0) - this.startScale / Math.pow(this.ro, 2) * sinh(this.r0) + this.u0;
                return val;
            };
            this.scale = function (t) {
                return this.startScale * cosh(this.r0) / cosh(this.ro * (t * this.S) + this.r0);
            };
            this.x = function (t) {
                return startPoint.X + (endPoint.X - startPoint.X) / this.pathLen * this.u(t * this.S);
            };
            this.y = function (t) {
                return startPoint.Y + (endPoint.Y - startPoint.Y) / this.pathLen * this.u(t * this.S);
            };
            this.produceNextVisible = function (currentViewport) {
                var curTime = (new Date()).getTime();
                var t;
                if(this.duration > 0) {
                    t = Math.min(1.0, (curTime - this.startTime) / this.duration);
                } else {
                    t = 1.0;
                }
                t = animationEase(t);
                if(t == 1.0) {
                    this.isActive = false;
                }
                return new CZ.Viewport.VisibleRegion2d(this.x(t), this.y(t), this.scale(t));
            };
            var startPoint = {
                X: startVisible.centerX,
                Y: startVisible.centerY
            };
            var startScale = startVisible.scale;
            var endPoint = {
                X: endVisible.centerX,
                Y: endVisible.centerY
            };
            var endScale = endVisible.scale;
            var xDiff = startPoint.X - endPoint.X;
            var yDiff = startPoint.Y - endPoint.Y;
            this.pathLen = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
            var ro = 0.1 * CZ.Settings.ellipticalZoomZoomoutFactor;
            this.ro = ro;
            var u0 = 0;
            this.u0 = u0;
            var u1 = this.pathLen;
            this.startPoint = startPoint;
            this.startScale = startScale;
            this.endPoint = endPoint;
            this.endScale = endScale;
            if(Math.abs(u0 - u1) > this.imprecision) {
                var uDiff = u0 - u1;
                var b0 = (endScale * endScale - startScale * startScale + Math.pow(ro, 4) * uDiff * uDiff) / (2 * startScale * ro * ro * (-uDiff));
                var b1 = (endScale * endScale - startScale * startScale - Math.pow(ro, 4) * uDiff * uDiff) / (2 * endScale * ro * ro * (-uDiff));
                this.r0 = Math.log(-b0 + Math.sqrt(b0 * b0 + 1));
                if(this.r0 == -Infinity) {
                    this.r0 = -Math.log(2 * b0);
                }
                this.r1 = Math.log(-b1 + Math.sqrt(b1 * b1 + 1));
                if(this.r1 == -Infinity) {
                    this.r1 = -Math.log(2 * b1);
                }
                this.S = (this.r1 - this.r0) / ro;
                this.duration = CZ.Settings.ellipticalZoomDuration / 300 * this.S;
            } else {
                var logScaleChange = Math.log(Math.abs(endScale - startScale)) + 10;
                if(logScaleChange < 0) {
                    this.isActive = false;
                }
                var scaleDiff = 0.5;
                if(endScale !== 0 || startScale !== 0) {
                    scaleDiff = Math.min(endScale, startScale) / Math.max(endScale, startScale);
                }
                if(scaleDiff === 1) {
                    this.isActive = false;
                }
                this.duration = CZ.Settings.ellipticalZoomDuration * scaleDiff * 0.2;
                this.x = function (s) {
                    return this.startPoint.X;
                };
                this.y = function (s) {
                    return this.startPoint.Y;
                };
                this.scale = function (s) {
                    return this.startScale + (this.endScale - this.startScale) * s;
                };
            }
        }
        ViewportAnimation.EllipticalZoom = EllipticalZoom;
        function animationEase(t) {
            return -2 * t * t * t + 3 * t * t;
        }
    })(CZ.ViewportAnimation || (CZ.ViewportAnimation = {}));
    var ViewportAnimation = CZ.ViewportAnimation;
})(CZ || (CZ = {}));
