
var CZ;
(function (CZ) {
    (function (VCContent) {
        var elementclick = $.Event("elementclick");

        function getVisibleForElement(element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if (width < 0)
                width = viewport.width;
            var scaleX = scale * element.width / width;

            var height = viewport.height - margin;
            if (height < 0)
                height = viewport.height;
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.max(scaleX, scaleY)
            };
            return vs;
        }
        VCContent.getVisibleForElement = getVisibleForElement;

        var zoomToElementHandler = function (sender, e, scale) {
            var vp = sender.vc.getViewport();
            var visible = getVisibleForElement(sender, scale, vp, true);
            elementclick.newvisible = visible;
            elementclick.element = sender;
            sender.vc.element.trigger(elementclick);
            return true;
        };

        function CanvasElement(vc, layerid, id, vx, vy, vw, vh) {
            this.vc = vc;
            this.id = id;
            this.layerid = layerid;
            this.x = vx;
            this.y = vy;
            this.newY = vy;
            this.width = vw;
            this.height = vh;
            this.newHeight = vh;

            this.children = [];
            this.fadeIn = false;

            this.isVisible = function (visibleBox_v) {
                var objRight = this.x + this.width;
                var objBottom = this.y + this.height;
                return Math.max(this.x, visibleBox_v.Left) <= Math.min(objRight, visibleBox_v.Right) && Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
            };

            this.isInside = function (point_v) {
                return point_v.x >= this.x && point_v.x <= this.x + this.width && point_v.y >= this.y && point_v.y <= this.y + this.height;
            };

            this.render = function (ctx, visibleBox_v, viewport2d, size_p, opacity) {
            };
        }
        VCContent.CanvasElement = CanvasElement;

        VCContent.addRectangle = function (element, layerid, id, vx, vy, vw, vh, settings) {
            return VCContent.addChild(element, new CanvasRectangle(element.vc, layerid, id, vx, vy, vw, vh, settings), false);
        };

        VCContent.addCircle = function (element, layerid, id, vxc, vyc, vradius, settings, suppressCheck) {
            return VCContent.addChild(element, new CanvasCircle(element.vc, layerid, id, vxc, vyc, vradius, settings), suppressCheck);
        };

        VCContent.addImage = function (element, layerid, id, vx, vy, vw, vh, imgSrc, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Image size must be positive";
            return VCContent.addChild(element, new CanvasImage(element.vc, layerid, id, imgSrc, vx, vy, vw, vh, onload), false);
        };
        VCContent.addLodImage = function (element, layerid, id, vx, vy, vw, vh, imgSources, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Image size must be positive";
            return VCContent.addChild(element, new CanvasLODImage(element.vc, layerid, id, imgSources, vx, vy, vw, vh, onload), false);
        };

        VCContent.addExtension = function (extensionName, element, layerid, id, vx, vy, vw, vh, z, imgSrc, onload) {
            if (vw <= 0 || vh <= 0)
                throw "Extension size must be positive";
            var initializer = CZ.Extensions.getInitializer(extensionName);

            return VCContent.addChild(element, initializer(element.vc, element, layerid, id, imgSrc, vx, vy, vw, vh, z, onload), false);
        };

        VCContent.addVideo = function (element, layerid, id, videoSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasVideoItem(element.vc, layerid, id, videoSource, vx, vy, vw, vh, z), false);
        };

        VCContent.addPdf = function (element, layerid, id, pdfSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasPdfItem(element.vc, layerid, id, pdfSource, vx, vy, vw, vh, z), false);
        };

        var addAudio = function (element, layerid, id, audioSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasAudioItem(element.vc, layerid, id, audioSource, vx, vy, vw, vh, z), false);
        };

        VCContent.addSkydriveDocument = function (element, layerid, id, embededSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasSkydriveDocumentItem(element.vc, layerid, id, embededSource, vx, vy, vw, vh, z), false);
        };

        VCContent.addSkydriveImage = function (element, layerid, id, embededSource, vx, vy, vw, vh, z) {
            return VCContent.addChild(element, new CanvasSkydriveImageItem(element.vc, layerid, id, embededSource, vx, vy, vw, vh, z), false);
        };

        function addText(element, layerid, id, vx, vy, baseline, vh, text, settings, vw) {
            return VCContent.addChild(element, new CanvasText(element.vc, layerid, id, vx, vy, baseline, vh, text, settings, vw), false);
        }
        VCContent.addText = addText;
        ;

        function addScrollText(element, layerid, id, vx, vy, vw, vh, text, z, settings) {
            return VCContent.addChild(element, new CanvasScrollTextItem(element.vc, layerid, id, vx, vy, vw, vh, text, z), false);
        }
        VCContent.addScrollText = addScrollText;
        ;

        function addMultiLineText(element, layerid, id, vx, vy, baseline, vh, text, lineWidth, settings) {
            return VCContent.addChild(element, new CanvasMultiLineTextItem(element.vc, layerid, id, vx, vy, vh, text, lineWidth, settings), false);
        }
        VCContent.addMultiLineText = addMultiLineText;
        ;

        function turnIsRenderedOff(element) {
            element.isRendered = false;
            if (element.onIsRenderedChanged)
                element.onIsRenderedChanged();
            var n = element.children.length;
            for (; --n >= 0;) {
                if (element.children[n].isRendered)
                    turnIsRenderedOff(element.children[n]);
            }
        }

        VCContent.render = function (element, contexts, visibleBox_v, viewport2d, opacity) {
            if (!element.isVisible(visibleBox_v)) {
                if (element.isRendered)
                    turnIsRenderedOff(element);
                return;
            }

            var sz = viewport2d.vectorVirtualToScreen(element.width, element.height);
            if (sz.y <= CZ.Settings.renderThreshold || (element.width != 0 && sz.x <= CZ.Settings.renderThreshold)) {
                if (element.isRendered)
                    turnIsRenderedOff(element);
                return;
            }

            var ctx = contexts[element.layerid];
            if (element.opacity != null) {
                opacity *= element.opacity;
            }

            if (element.isRendered == undefined || !element.isRendered) {
                element.isRendered = true;
                if (element.onIsRenderedChanged)
                    element.onIsRenderedChanged();
            }
            element.render(ctx, visibleBox_v, viewport2d, sz, opacity);

            var children = element.children;
            var n = children.length;
            for (var i = 0; i < n; i++) {
                VCContent.render(children[i], contexts, visibleBox_v, viewport2d, opacity);
            }
        };

        VCContent.addChild = function (parent, element, suppresCheck) {
            var isWithin = parent.width == Infinity || (element.x >= parent.x && element.x + element.width <= parent.x + parent.width) && (element.y >= parent.y && element.y + element.height <= parent.y + parent.height);

            parent.children.push(element);
            element.parent = parent;
            return element;
        };

        VCContent.removeChild = function (parent, id) {
            var n = parent.children.length;
            for (var i = 0; i < n; i++) {
                var child = parent.children[i];
                if (child.id == id) {
                    if (typeof CZ.Layout.animatingElements[child.id] !== 'undefined') {
                        delete CZ.Layout.animatingElements[child.id];
                        CZ.Layout.animatingElements.length--;
                    }

                    parent.children.splice(i, 1);
                    clear(child);
                    if (child.onRemove)
                        child.onRemove();
                    child.parent = null;
                    return true;
                }
            }
            return false;
        };

        var removeTimeline = function (timeline) {
            var n = timeline.children.length;
            console.log(n);
            for (var i = 0; i < n; i++) {
                var child = timeline.children[i];

                if (timeline.onRemove)
                    timeline.onRemove();

                child.parent = timeline.parent;
            }
        };

        function clear(element) {
            var n = element.children.length;
            for (var i = 0; i < n; i++) {
                var child = element.children[i];

                if (typeof CZ.Layout.animatingElements[child.id] !== 'undefined') {
                    delete CZ.Layout.animatingElements[child.id];
                    CZ.Layout.animatingElements.length--;
                }

                clear(child);
                if (child.onRemove)
                    child.onRemove();
                child.parent = null;
            }
            element.children = [];
        }
        ;

        function getChild(element, id) {
            var n = element.children.length;
            for (var i = 0; i < n; i++) {
                if (element.children[i].id == id)
                    return element.children[i];
            }
            throw "There is no child with id [" + id + "]";
        }
        VCContent.getChild = getChild;
        ;

        function CanvasRootElement(vc, layerid, id, vx, vy, vw, vh) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.opacity = 0;

            this.isVisible = function (visibleBox_v) {
                return this.children.length != 0;
            };

            this.beginEdit = function () {
                return this;
            };

            this.endEdit = function (dontRender) {
                if (!dontRender)
                    this.vc.invalidate();
            };

            this.isInside = function (point_v) {
                return true;
            };

            this.render = function (contexts, visibleBox_v, viewport2d) {
                this.vc.breadCrumbs = [];
                if (!this.isVisible(visibleBox_v))
                    return;
                var n = this.children.length;
                for (var i = 0; i < n; i++) {
                    VCContent.render(this.children[i], contexts, visibleBox_v, viewport2d, 1.0);
                }

                if (this.vc.breadCrumbs.length > 0 && (this.vc.recentBreadCrumb == undefined || this.vc.breadCrumbs[vc.breadCrumbs.length - 1].vcElement.id != this.vc.recentBreadCrumb.vcElement.id)) {
                    this.vc.recentBreadCrumb = this.vc.breadCrumbs[vc.breadCrumbs.length - 1];
                    this.vc.breadCrumbsChanged();
                } else {
                    if (this.vc.breadCrumbs.length == 0 && this.vc.recentBreadCrumb != undefined) {
                        this.vc.recentBreadCrumb = undefined;
                        this.vc.breadCrumbsChanged();
                    }
                }
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }
        VCContent.CanvasRootElement = CanvasRootElement;

        function getZoomLevel(size_p) {
            var sz = Math.max(size_p.x, size_p.y);
            if (sz <= 1)
                return 0;
            var zl = (sz & 1) ? 1 : 0;
            for (var i = 1; i < 32; i++) {
                sz = sz >>> 1;
                if (sz & 1) {
                    if (zl > 0)
                        zl = i + 1;
                    else
                        zl = i;
                }
            }
            return zl;
        }

        function CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.zoomLevel = 0;
            this.prevContent = null;
            this.newContent = null;
            this.asyncContent = null;
            this.lastRenderTime = 0;

            var self = this;

            this.changeZoomLevel = function (currentZoomLevel, newZoomLevel) {
                return null;
            };

            var startTransition = function (newContent) {
                self.lastRenderTime = new Date();

                self.prevContent = self.content;
                self.content = newContent.content;
                VCContent.addChild(self, self.content, false);

                if (self.prevContent) {
                    if (!self.prevContent.opacity)
                        self.prevContent.opacity = 1.0;
                    self.content.opacity = 0.0;
                }
                self.zoomLevel = newContent.zoomLevel;
            };

            var onAsyncContentLoaded = function () {
                if (self.asyncContent) {
                    startTransition(self.asyncContent);
                    self.asyncContent = null;
                    delete this.onLoad;
                    self.vc.requestInvalidate();
                }
            };

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (this.asyncContent)
                    return;
                if (!this.prevContent) {
                    var newZoomLevel = getZoomLevel(size_p);
                    if (this.zoomLevel != newZoomLevel) {
                        var newContent = this.changeZoomLevel(this.zoomLevel, newZoomLevel);
                        if (newContent) {
                            if (newContent.content.isLoading) {
                                this.asyncContent = newContent;
                                newContent.content.onLoad = onAsyncContentLoaded;
                            } else {
                                startTransition(newContent);
                            }
                        }
                    }
                }
                if (this.prevContent) {
                    var renderTime = new Date();
                    var renderTimeDiff = renderTime.getTime() - self.lastRenderTime;
                    self.lastRenderTime = renderTime.getTime();

                    var contentAppearanceAnimationStep = renderTimeDiff / 1600;

                    var doInvalidate = false;
                    var lopacity = this.prevContent.opacity;
                    lopacity = Math.max(0.0, lopacity - contentAppearanceAnimationStep);
                    if (lopacity != this.prevContent.opacity)
                        doInvalidate = true;
                    if (lopacity == 0) {
                        VCContent.removeChild(this, this.prevContent.id);
                        this.prevContent = null;
                    } else {
                        this.prevContent.opacity = lopacity;
                    }

                    lopacity = this.content.opacity;
                    lopacity = Math.min(1.0, lopacity + contentAppearanceAnimationStep);
                    if (!doInvalidate && lopacity != this.content.opacity)
                        doInvalidate = true;
                    this.content.opacity = lopacity;

                    if (doInvalidate)
                        this.vc.requestInvalidate();
                }
            };

            this.onIsRenderedChanged = function () {
                if (typeof this.removeWhenInvisible === 'undefined' || !this.removeWhenInvisible)
                    return;
                if (!this.isRendered) {
                    if (this.asyncContent) {
                        this.asyncContent = null;
                    }
                    if (this.prevContent) {
                        VCContent.removeChild(this, this.prevContent.id);
                        this.prevContent = null;
                    }
                    if (this.newContent) {
                        VCContent.removeChild(this, this.newContent.id);
                        this.newContent.content.onLoad = null;
                        this.newContent = null;
                    }
                    if (this.content) {
                        VCContent.removeChild(this, this.content.id);
                        this.content = null;
                    }

                    this.zoomLevel = 0;
                }
            };
            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        function ContainerElement(vc, layerid, id, vx, vy, vw, vh) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        function CanvasRectangle(vc, layerid, id, vx, vy, vw, vh, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.settings = settings;
            this.type = "rectangle";

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var p2 = viewport2d.pointVirtualToScreen(this.x + this.width, this.y + this.height);
                var left = Math.max(0, p.x);
                var top = Math.max(0, p.y);
                var right = Math.min(viewport2d.width, p2.x);
                var bottom = Math.min(viewport2d.height, p2.y);
                if (left < right && top < bottom) {
                    if (this.settings.fillStyle) {
                        var opacity1 = this.settings.gradientOpacity ? opacity * (1 - this.settings.gradientOpacity) : opacity;
                        ctx.globalAlpha = opacity1;
                        ctx.fillStyle = this.settings.fillStyle;
                        ctx.fillRect(left, top, right - left, bottom - top);

                        if (this.settings.gradientOpacity && this.settings.gradientFillStyle) {
                            var lineargradient = ctx.createLinearGradient(left, bottom, right, top);
                            var transparent = "rgba(0, 0, 0, 0)";
                            lineargradient.addColorStop(0, this.settings.gradientFillStyle);
                            lineargradient.addColorStop(1, transparent);

                            ctx.globalAlpha = opacity * this.settings.gradientOpacity;
                            ctx.fillStyle = lineargradient;
                            ctx.fillRect(left, top, right - left, bottom - top);
                        }
                    }

                    ctx.globalAlpha = opacity;
                    if (this.settings.strokeStyle) {
                        ctx.strokeStyle = this.settings.strokeStyle;
                        if (this.settings.lineWidth) {
                            if (this.settings.isLineWidthVirtual) {
                                ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                            } else {
                                ctx.lineWidth = this.settings.lineWidth;
                            }
                        } else
                            ctx.lineWidth = 1;
                        var lineWidth2 = ctx.lineWidth / 2.0;
                        if (this.settings.outline) {
                            p.x += lineWidth2;
                            p.y += lineWidth2;
                            top += lineWidth2;
                            bottom -= lineWidth2;
                            left += lineWidth2;
                            right -= lineWidth2;
                            p2.x -= lineWidth2;
                            p2.y -= lineWidth2;
                        }

                        if (p.x > 0) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, top - lineWidth2);
                            ctx.lineTo(p.x, bottom + lineWidth2);
                            ctx.stroke();
                        }
                        if (p.y > 0) {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p.y);
                            ctx.lineTo(right + lineWidth2, p.y);
                            ctx.stroke();
                        }
                        if (p2.x < viewport2d.width) {
                            ctx.beginPath();
                            ctx.moveTo(p2.x, top - lineWidth2);
                            ctx.lineTo(p2.x, bottom + lineWidth2);
                            ctx.stroke();
                        }
                        if (p2.y < viewport2d.height) {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p2.y);
                            ctx.lineTo(right + lineWidth2, p2.y);
                            ctx.stroke();
                        }
                    }
                }
            };

            this.intersects = function (rect) {
                return !(this.x + this.width < rect.x || this.x > rect.x + rect.width || this.y + this.height < rect.y || this.y > rect.y + rect.height);
            };

            this.contains = function (rect) {
                return (rect.x > this.x && rect.x + rect.width < this.x + this.width && rect.y > this.y && rect.y + rect.height < this.y + this.height);
            };

            this.isVisibleOnScreen = function (scale) {
                return this.width / scale >= CZ.Settings.minTimelineWidth;
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }
        VCContent.CanvasRectangle = CanvasRectangle;

        function CanvasTimeline(vc, layerid, id, vx, vy, vw, vh, settings, timelineinfo) {
            this.base = CanvasRectangle;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.guid = timelineinfo.guid;
            this.type = 'timeline';

            this.isBuffered = timelineinfo.isBuffered;
            this.settings = settings;
            this.parent = undefined;
            this.currentlyObservedTimelineEvent = vc.currentlyObservedTimelineEvent;
            this.settings.outline = true;
            this.type = 'timeline';

            this.endDate = timelineinfo.endDate;

            var width = timelineinfo.timeEnd - timelineinfo.timeStart;

            var headerSize = timelineinfo.titleRect ? timelineinfo.titleRect.height : CZ.Settings.timelineHeaderSize * timelineinfo.height;
            var headerWidth = timelineinfo.titleRect && (CZ.Authoring.isEnabled || CZ.Settings.isAuthorized) ? timelineinfo.titleRect.width : 0;
            var marginLeft = timelineinfo.titleRect ? timelineinfo.titleRect.marginLeft : CZ.Settings.timelineHeaderMargin * timelineinfo.height;
            var marginTop = timelineinfo.titleRect ? timelineinfo.titleRect.marginTop : (1 - CZ.Settings.timelineHeaderMargin) * timelineinfo.height - headerSize;
            var baseline = timelineinfo.top + marginTop + headerSize / 2.0;

            this.titleObject = addText(this, layerid, id + "__header__", CZ.Authoring.isEnabled ? timelineinfo.timeStart + marginLeft + headerSize : timelineinfo.timeStart + marginLeft, timelineinfo.top + marginTop, baseline, headerSize, timelineinfo.header, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle'
            }, headerWidth);

            this.title = this.titleObject.text;
            this.regime = timelineinfo.regime;
            this.settings.gradientOpacity = 0;

            if (CZ.Settings.timelineGradientFillStyle) {
                this.settings.gradientFillStyle = CZ.Settings.timelineGradientFillStyle;
            } else {
                this.settings.gradientFillStyle = timelineinfo.gradientFillStyle || timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
            }

            this.reactsOnMouse = true;

            this.tooltipEnabled = true;
            this.tooltipIsShown = false;

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };
            this.onmousehover = function (pv, e) {
                if (this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id != id) {
                    try  {
                        this.vc.currentlyHoveredInfodot.id;
                    } catch (ex) {
                        CZ.Common.stopAnimationTooltip();
                        this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
                    }
                }

                this.vc.currentlyHoveredTimeline = this;

                this.settings.strokeStyle = CZ.Settings.timelineHoveredBoxBorderColor;
                this.settings.lineWidth = CZ.Settings.timelineHoveredLineWidth;
                this.titleObject.settings.fillStyle = CZ.Settings.timelineHoveredHeaderFontColor;
                this.settings.hoverAnimationDelta = CZ.Settings.timelineHoverAnimation;
                this.vc.requestInvalidate();

                if (this.titleObject.initialized == false) {
                    var vp = this.vc.getViewport();
                    this.titleObject.screenFontSize = CZ.Settings.timelineHeaderSize * vp.heightVirtualToScreen(this.height);
                }

                if (this.titleObject.screenFontSize <= CZ.Settings.timelineTooltipMaxHeaderSize)
                    this.tooltipEnabled = true;
                else
                    this.tooltipEnabled = false;

                if (CZ.Common.tooltipMode != "infodot") {
                    CZ.Common.tooltipMode = "timeline";

                    if (this.tooltipEnabled == false) {
                        CZ.Common.stopAnimationTooltip();
                        this.tooltipIsShown = false;
                        return;
                    }

                    if (this.tooltipIsShown == false) {
                        switch (this.regime) {
                            case "Cosmos":
                                $(".bubbleInfo").attr("id", "cosmosRegimeBox");
                                break;

                            case "Earth":
                                $(".bubbleInfo").attr("id", "earthRegimeBox");
                                break;

                            case "Life":
                                $(".bubbleInfo").attr("id", "lifeRegimeBox");
                                break;

                            case "Pre-history":
                                $(".bubbleInfo").attr("id", "prehistoryRegimeBox");
                                break;

                            case "Humanity":
                                $(".bubbleInfo").attr("id", "humanityRegimeBox");
                                break;
                        }

                        $(".bubbleInfo span").text(this.title);
                        this.panelWidth = $('.bubbleInfo').outerWidth();
                        this.panelHeight = $('.bubbleInfo').outerHeight();

                        this.tooltipIsShown = true;
                        CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                    }
                }
            };
            this.onmouseunhover = function (pv, e) {
                if (this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id == id) {
                    this.vc.currentlyHoveredTimeline = null;

                    if ((this.tooltipIsShown == true) && (CZ.Common.tooltipMode == "timeline")) {
                        CZ.Common.tooltipMode = "default";
                        CZ.Common.stopAnimationTooltip();
                        $(".bubbleInfo").attr("id", "defaultBox");
                        this.tooltipIsShown = false;
                    }
                }

                this.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                this.settings.lineWidth = CZ.Settings.timelineLineWidth;
                this.titleObject.settings.fillStyle = CZ.Settings.timelineHeaderFontColor;
                this.settings.hoverAnimationDelta = -CZ.Settings.timelineHoverAnimation;
                ;
                this.vc.requestInvalidate();
            };

            this.base_render = this.render;

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                this.titleObject.initialized = false;

                if (this.settings.hoverAnimationDelta) {
                    this.settings.gradientOpacity = Math.min(1, Math.max(0, this.settings.gradientOpacity + this.settings.hoverAnimationDelta));
                }

                this.base_render(ctx, visibleBox, viewport2d, size_p, opacity);

                if (CZ.Settings.isAuthorized === true && typeof this.favoriteBtn === "undefined" && this.titleObject.width !== 0) {
                    var btnX = this.x + this.width - 1.0 * this.titleObject.height;
                    var btnY = this.titleObject.y + 0.15 * this.titleObject.height;

                    this.favoriteBtn = VCContent.addImage(this, layerid, id + "__favorite", btnX, btnY, 0.7 * this.titleObject.height, 0.7 * this.titleObject.height, "/images/star.svg");
                    this.favoriteBtn.reactsOnMouse = true;

                    this.favoriteBtn.onmouseclick = function () {
                        var _this = this;
                        if (CZ.Settings.favoriteTimelines.indexOf(this.parent.guid) !== -1) {
                            CZ.Service.deleteUserFavorite(this.parent.guid).then(function (success) {
                                CZ.Authoring.showMessageWindow("Timeline '" + _this.parent.title + "' was removed from your favorite timelines.", "Timeline removed from favorites");
                            }, function (error) {
                                console.log("[ERROR] /deleteUserFavorite with guid " + _this.parent.guid + " failed.");
                            });
                            CZ.Settings.favoriteTimelines.splice(CZ.Settings.favoriteTimelines.indexOf(this.parent.guid), 1);
                        } else {
                            CZ.Service.putUserFavorite(this.parent.guid).then(function (success) {
                                CZ.Settings.favoriteTimelines.push(_this.parent.guid);
                                CZ.Authoring.showMessageWindow("Timeline '" + _this.parent.title + "' was added to your favorite timelines.", "Favorite timeline added");
                            }, function (error) {
                                console.log("[ERROR] /putUserFavorite with guid + " + _this.parent.guid + " failed.");
                            });
                        }
                        return true;
                    };

                    this.favoriteBtn.onmousehover = function () {
                        this.parent.settings.strokeStyle = "yellow";
                    };

                    this.favoriteBtn.onmouseunhover = function () {
                        this.parent.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                    };

                    this.favoriteBtn.onRemove = function () {
                        this.onmousehover = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick = undefined;
                    };
                }

                if (CZ.Authoring.isEnabled && typeof this.editButton === "undefined" && this.titleObject.width !== 0) {
                    this.editButton = VCContent.addImage(this, layerid, id + "__edit", this.x + this.titleObject.height * 0.15, this.titleObject.y, this.titleObject.height, this.titleObject.height, "/images/edit.svg");
                    this.editButton.reactsOnMouse = true;

                    this.editButton.onmouseclick = function () {
                        if (CZ.Common.vc.virtualCanvas("getHoveredInfodot").x == undefined) {
                            CZ.Authoring.isActive = true;
                            CZ.Authoring.mode = "editTimeline";
                            CZ.Authoring.selectedTimeline = this.parent;
                        }
                        return true;
                    };

                    this.editButton.onmousehover = function () {
                        this.parent.settings.strokeStyle = "yellow";
                    };

                    this.editButton.onmouseunhover = function () {
                        this.parent.settings.strokeStyle = timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineBorderColor;
                    };

                    this.editButton.onRemove = function () {
                        this.onmousehover = undefined;
                        this.onmouseunhover = undefined;
                        this.onmouseclick = undefined;
                    };
                }

                if (this.settings.hoverAnimationDelta) {
                    if (this.settings.gradientOpacity == 0 || this.settings.gradientOpacity == 1)
                        this.settings.hoverAnimationDelta = undefined;
                    else
                        this.vc.requestInvalidate();
                }

                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var p2 = { x: p.x + size_p.x, y: p.y + size_p.y };

                var isCenterInside = viewport2d.visible.centerX - CZ.Settings.timelineCenterOffsetAcceptableImplicity <= this.x + this.width && viewport2d.visible.centerX + CZ.Settings.timelineCenterOffsetAcceptableImplicity >= this.x && viewport2d.visible.centerY - CZ.Settings.timelineCenterOffsetAcceptableImplicity <= this.y + this.height && viewport2d.visible.centerY + CZ.Settings.timelineCenterOffsetAcceptableImplicity >= this.y;

                var isVisibleInTheRectangle = ((p.x < CZ.Settings.timelineBreadCrumbBorderOffset && p2.x > viewport2d.width - CZ.Settings.timelineBreadCrumbBorderOffset) || (p.y < CZ.Settings.timelineBreadCrumbBorderOffset && p2.y > viewport2d.height - CZ.Settings.timelineBreadCrumbBorderOffset));

                if (isVisibleInTheRectangle && isCenterInside) {
                    var length = vc.breadCrumbs.length;
                    if (length > 1)
                        if (vc.breadCrumbs[length - 1].vcElement.parent.id == this.parent.id)
                            return;
                    vc.breadCrumbs.push({
                        vcElement: this
                    });
                }
            };

            this.prototype = new CanvasRectangle(vc, layerid, id, vx, vy, vw, vh, settings);
        }

        function CanvasCircle(vc, layerid, id, vxc, vyc, vradius, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vxc - vradius, vyc - vradius, 2.0 * vradius, 2.0 * vradius);
            this.settings = settings;
            this.isObservedNow = false;

            this.type = "circle";

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var rad = this.width / 2.0;
                var xc = this.x + rad;
                var yc = this.y + rad;
                var p = viewport2d.pointVirtualToScreen(xc, yc);
                var radp = viewport2d.widthVirtualToScreen(rad);

                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radp, 0, Math.PI * 2, true);

                if (this.settings.strokeStyle) {
                    ctx.strokeStyle = this.settings.strokeStyle;
                    if (this.settings.lineWidth) {
                        if (this.settings.isLineWidthVirtual) {
                            ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                        } else {
                            ctx.lineWidth = this.settings.lineWidth;
                        }
                    } else
                        ctx.lineWidth = 1;
                    ctx.stroke();
                }
                if (this.settings.fillStyle) {
                    ctx.fillStyle = this.settings.fillStyle;
                    ctx.fill();
                }
            };

            this.isInside = function (point_v) {
                var len2 = CZ.Common.sqr(point_v.x - vxc) + CZ.Common.sqr(point_v.y - this.y - this.height / 2);
                return len2 <= vradius * vradius;
            };

            this.prototype = new CanvasElement(vc, layerid, id, vxc - vradius / 2, vyc - vradius / 2, vradius, vradius);
        }

        function addPopupWindow(url, id, width, height, scrollbars, resizable) {
            var w = width;
            var h = height;
            var s = scrollbars;
            var r = resizable;
            var features = 'width=' + w + ',height=' + h + ',scrollbars=' + s + ',resizable=' + r;
            window.open(url, id, features);
        }

        function drawText(text, ctx, x, y, fontSize, fontName) {
            var br = $.browser;
            var isIe9 = br.msie && parseInt(br.version, 10) >= 9;

            if (isIe9) {
                ctx.font = fontSize + "pt " + fontName;
                ctx.fillText(text, x, y);
            } else {
                var baseFontSize = 12;
                var targetFontSize = fontSize;
                var s = targetFontSize / baseFontSize;

                ctx.scale(s, s);
                ctx.font = baseFontSize + "pt " + fontName;
                ctx.fillText(text, x / s, y / s);
                ctx.scale(1 / s, 1 / s);
            }
        }

        function CanvasText(vc, layerid, id, vx, vy, baseline, vh, text, settings, wv) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, wv ? wv : 0, vh);
            this.text = text;
            this.baseline = baseline;
            this.newBaseline = baseline;
            this.settings = settings;
            this.opacity = settings.opacity || 0;
            this.type = "text";

            if (typeof this.settings.textBaseline != 'undefined' && this.settings.textBaseline === 'middle') {
                this.newBaseline = this.newY + this.newHeight / 2;
            }

            this.initialized = false;
            this.screenFontSize = 0;

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var p = viewport2d.pointVirtualToScreen(this.x, this.newY);
                var bp = viewport2d.pointVirtualToScreen(this.x, this.newBaseline).y;

                ctx.globalAlpha = opacity;
                ctx.fillStyle = this.settings.fillStyle;
                var fontSize = size_p.y;
                var k = 1.5;

                if (this.screenFontSize != fontSize)
                    this.screenFontSize = fontSize;

                if (!this.initialized) {
                    if (this.settings.wrapText) {
                        var numberOfLines = this.settings.numberOfLines ? this.settings.numberOfLines : 1;
                        this.settings.numberOfLines = numberOfLines;
                        fontSize = size_p.y / numberOfLines / k;

                        while (true) {
                            ctx.font = fontSize + "pt " + this.settings.fontName;

                            var mlines = this.text.split('\n');
                            var textHeight = 0;
                            var lines = [];
                            for (var il = 0; il < mlines.length; il++) {
                                var words = mlines[il].split(' ');
                                var lineWidth = 0;
                                var currentLine = '';
                                var wsize;
                                var space = ctx.measureText(' ').width;
                                for (var iw = 0; iw < words.length; iw++) {
                                    wsize = ctx.measureText(words[iw]);
                                    var newWidth = lineWidth == 0 ? lineWidth + wsize.width : lineWidth + wsize.width + space;
                                    if (newWidth > size_p.x && lineWidth > 0) {
                                        lines.push(currentLine);
                                        lineWidth = 0;
                                        textHeight += fontSize * k;
                                        iw--;
                                        currentLine = '';
                                    } else {
                                        if (currentLine === '')
                                            currentLine = words[iw];
                                        else
                                            currentLine += ' ' + words[iw];
                                        lineWidth = newWidth;
                                    }
                                    var NewWordWidth;
                                    if ((words.length == 1) && (wsize.width > size_p.x)) {
                                        var NewWordWidth = wsize.width;
                                        while (NewWordWidth > size_p.x) {
                                            fontSize /= 1.5;
                                            NewWordWidth /= 1.5;
                                        }
                                    }
                                }
                                lines.push(currentLine);
                                textHeight += fontSize * k;
                            }

                            if (textHeight > size_p.y) {
                                fontSize /= 1.5;
                            } else {
                                this.text = lines;
                                var fontSizeVirtual = viewport2d.heightScreenToVirtual(fontSize);
                                this.settings.fontSizeVirtual = fontSizeVirtual;
                                break;
                            }
                        }

                        this.screenFontSize = fontSize;
                    } else {
                        ctx.font = fontSize + "pt " + this.settings.fontName;

                        this.screenFontSize = fontSize;

                        if (this.width == 0) {
                            var size = ctx.measureText(this.text);
                            size_p.x = size.width;
                            this.width = viewport2d.widthScreenToVirtual(size.width);
                        } else {
                            var size = ctx.measureText(this.text);
                            if (size.width > size_p.x) {
                                this.height = this.width * size_p.y / size.width;
                                if (this.settings.textBaseline === 'middle') {
                                    this.newY = this.newBaseline - this.newHeight / 2;
                                }
                                fontSize = viewport2d.heightVirtualToScreen(this.height);

                                this.screenFontSize = fontSize;
                            } else if (typeof this.settings.adjustWidth && this.settings.adjustWidth) {
                                var nwidth = viewport2d.widthScreenToVirtual(size.width);

                                if (this.settings.textAlign === 'center') {
                                    this.x = this.x + (this.width - nwidth) / 2;
                                } else if (this.settings.textAlign === 'right') {
                                    this.x = this.x + this.width - nwidth;
                                }
                                this.width = nwidth;

                                p = viewport2d.pointVirtualToScreen(this.x, this.newY);
                                size_p.x = viewport2d.widthVirtualToScreen(this.width);
                            }
                        }
                    }
                    this.initialized = true;
                }

                if (this.settings.textAlign) {
                    ctx.textAlign = this.settings.textAlign;
                    if (this.settings.textAlign === 'center')
                        p.x = p.x + size_p.x / 2.0;
                    else if (this.settings.textAlign === 'right')
                        p.x = p.x + size_p.x;
                }

                if (!this.settings.wrapText) {
                    if (this.settings.textBaseline)
                        ctx.textBaseline = this.settings.textBaseline;

                    drawText(this.text, ctx, p.x, bp, fontSize, this.settings.fontName);
                } else {
                    fontSize = viewport2d.heightVirtualToScreen(this.settings.fontSizeVirtual);
                    this.screenFontSize = fontSize;
                    ctx.textBaseline = 'middle';

                    var bp = p.y + fontSize * k / 2;
                    for (var i = 0; i < this.text.length; i++) {
                        drawText(this.text[i], ctx, p.x, bp, fontSize, this.settings.fontName);
                        bp += fontSize * k;
                    }
                }
            };

            this.isVisible = function (visibleBox_v) {
                var objBottom = this.y + this.height;
                if (this.width > 0) {
                    var objRight = this.x + this.width;
                    return Math.max(this.x, visibleBox_v.Left) <= Math.min(objRight, visibleBox_v.Right) && Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
                }
                return Math.max(this.y, visibleBox_v.Top) <= Math.min(objBottom, visibleBox_v.Bottom);
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, wv ? wv : 0, vh);
        }

        function CanvasMultiLineTextItem(vc, layerid, id, vx, vy, vh, text, lineWidth, settings) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vh * 10, vh);
            this.settings = settings;
            this.text = text;

            this.render = function (ctx, visibleBox, viewport2d, size_p) {
                function textOutput(context, text, x, y, lineHeight, fitWidth) {
                    fitWidth = fitWidth || 0;

                    if (fitWidth <= 0) {
                        context.fillText(text, x, y);
                        return;
                    }
                    var words = text.split(' ');
                    var currentLine = 0;
                    var idx = 1;
                    while (words.length > 0 && idx <= words.length) {
                        var str = words.slice(0, idx).join(' ');
                        var w = context.measureText(str).width;
                        if (w > fitWidth) {
                            if (idx == 1) {
                                idx = 2;
                            }
                            context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
                            currentLine++;
                            words = words.splice(idx - 1);
                            idx = 1;
                        } else {
                            idx++;
                        }
                    }
                    if (idx > 0)
                        context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
                }
                ;

                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                ctx.fillStyle = settings.fillStyle;
                ctx.font = size_p.y + "pt " + settings.fontName;
                ctx.textBaseline = 'top';
                var height = viewport2d.heightVirtualToScreen(this.height);
                textOutput(ctx, this.text, p.x, p.y, height, lineWidth * height);
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vh * 10, vh);
        }

        function CanvasImage(vc, layerid, id, imageSource, vx, vy, vw, vh, onload) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.onload = onload;

            this.isLoading = true;
            var img = new Image();
            this.img = img;
            this.img.isLoaded = false;

            var self = this;
            var onCanvasImageLoad = function (s) {
                img['isLoading'] = false;
                if (!img['isRemoved']) {
                    if (img.naturalHeight) {
                        var ar0 = self.width / self.height;
                        var ar1 = img.naturalWidth / img.naturalHeight;
                        if (ar0 > ar1) {
                            var imgWidth = ar1 * self.height;
                            var offset = (self.width - imgWidth) / 2.0;
                            self.x += offset;
                            self.width = imgWidth;
                        } else if (ar0 < ar1) {
                            var imgHeight = self.width / ar1;
                            var offset = (self.height - imgHeight) / 2.0;
                            self.y += offset;
                            self.height = imgHeight;
                        }
                    }

                    img['isLoaded'] = true;
                    if (self.onLoad)
                        self.onLoad();
                    self.vc.requestInvalidate();
                } else {
                    delete img['isRemoved'];
                    delete img['isLoaded'];
                }
            };
            var onCanvasImageLoadError = function (e) {
                if (!img['isFallback']) {
                    img['isFallback'] = true;
                    img.src = CZ.Settings.fallbackImageUri;
                } else {
                    throw "Cannot load an image!";
                }
            };

            this.img.addEventListener("load", onCanvasImageLoad, false);
            if (onload)
                this.img.addEventListener("load", onload, false);
            this.img.addEventListener("error", onCanvasImageLoadError, false);
            this.img.src = imageSource;

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!this.img.isLoaded)
                    return;
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                ctx.globalAlpha = opacity;
                ctx.drawImage(this.img, p.x, p.y, size_p.x, size_p.y);
            };
            this.onRemove = function () {
                this.img.removeEventListener("load", onCanvasImageLoad, false);
                this.img.removeEventListener("error", onCanvasImageLoadError, false);
                if (this.onload)
                    this.img.removeEventListener("load", this.onload, false);
                this.img.isRemoved = true;
                delete this.img;
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }

        function CanvasLODImage(vc, layerid, id, imageSources, vx, vy, vw, vh, onload) {
            this.base = CanvasDynamicLOD;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.imageSources = imageSources;

            this.changeZoomLevel = function (currentZoomLevel, newZoomLevel) {
                var n = this.imageSources.length;
                if (n == 0)
                    return null;
                for (; --n >= 0;) {
                    if (this.imageSources[n].zoomLevel <= newZoomLevel) {
                        if (this.imageSources[n].zoomLevel === currentZoomLevel)
                            return null;
                        return {
                            zoomLevel: this.imageSources[n].zoomLevel,
                            content: new CanvasImage(vc, layerid, id + "@" + this.imageSources[n].zoomLevel, this.imageSources[n].imageSource, vx, vy, vw, vh, onload)
                        };
                    }
                }
                return null;
            };

            this.prototype = new CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh);
        }

        function CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z) {
            this.base = CanvasElement;
            this.base(vc, layerid, id, vx, vy, vw, vh);

            this.initializeContent = function (content) {
                this.content = content;
                if (content) {
                    content.style.position = 'absolute';
                    content.style.overflow = 'hidden';
                    content.style.zIndex = z;
                }
            };

            this.onIsRenderedChanged = function () {
                if (!this.content)
                    return;

                if (this.isRendered) {
                    if (!this.content.isAdded) {
                        this.vc.element[0].appendChild(this.content);
                        this.content.isAdded = true;
                    }
                    this.content.style.display = 'block';
                } else {
                    this.content.style.display = 'none';
                }
            };
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!this.content)
                    return;
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);

                var screenTop = 0;
                var screenBottom = viewport2d.height;
                var screenLeft = 0;
                var screenRight = viewport2d.width;

                var clipRectTop = 0, clipRectLeft = 0, clipRectBottom = size_p.y, clipRectRight = size_p.x;

                var a1 = screenTop;
                var a2 = screenBottom;
                var b1 = p.y;
                var b2 = p.y + size_p.y;
                var c1 = Math.max(a1, b1);
                var c2 = Math.min(a2, b2);
                if (c1 <= c2) {
                    clipRectTop = c1 - p.y;
                    clipRectBottom = c2 - p.y;
                }

                a1 = screenLeft;
                a2 = screenRight;
                b1 = p.x;
                b2 = p.x + size_p.x;
                c1 = Math.max(a1, b1);
                c2 = Math.min(a2, b2);
                if (c1 <= c2) {
                    clipRectLeft = c1 - p.x;
                    clipRectRight = c2 - p.x;
                }

                this.content.style.left = p.x + 'px';
                this.content.style.top = p.y + 'px';
                this.content.style.width = size_p.x + 'px';
                this.content.style.height = size_p.y + 'px';
                this.content.style.clip = 'rect(' + clipRectTop + 'px,' + clipRectRight + 'px,' + clipRectBottom + 'px,' + clipRectLeft + 'px)';
                this.content.style.opacity = opacity;
                this.content.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
            };

            this.onRemove = function () {
                if (!this.content)
                    return;
                try  {
                    if (this.content.isAdded) {
                        if (this.content.src)
                            this.content.src = "";
                        this.vc.element[0].removeChild(this.content);
                        this.content.isAdded = false;
                    }
                } catch (ex) {
                    alert(ex.Description);
                }
            };

            this.prototype = new CanvasElement(vc, layerid, id, vx, vy, vw, vh);
        }
        VCContent.CanvasDomItem = CanvasDomItem;

        function CanvasScrollTextItem(vc, layerid, id, vx, vy, vw, vh, text, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = $("<div></div>", {
                id: "citext_" + id,
                class: "contentItemDescription"
            }).appendTo(vc);

            elem[0].addEventListener("mousemove", CZ.Common.preventbubble, false);
            elem[0].addEventListener("mousedown", CZ.Common.preventbubble, false);
            elem[0].addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
            elem[0].addEventListener("mousewheel", CZ.Common.preventbubble, false);
            var textElem = $("<div style='position:relative; white-space: pre-line' class='text'></div>");
            textElem.text(text).appendTo(elem);

            this.initializeContent(elem[0]);

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                var fontSize = size_p.y / CZ.Settings.contentItemDescriptionNumberOfLines;
                elem.css('font-size', fontSize + "px");

                this.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);
            };

            this.onRemove = function () {
                this.prototype.onRemove.call(this);
                elem[0].removeEventListener("mousemove", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("mouseup", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("mousedown", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
                elem[0].removeEventListener("mousewheel", CZ.Common.preventbubble, false);
                elem = undefined;
            };

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        function CanvasPdfItem(vc, layerid, id, pdfSrc, vx, vy, vw, vh, z) {
            var pdfViewer = "http://docs.google.com/viewer?url=";
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);

            if (!pdfSrc.match("/^" + pdfViewer + "/")) {
                pdfSrc = pdfViewer + pdfSrc;
            }
            if (pdfSrc.indexOf('?') == -1)
                pdfSrc += '?&embedded=true&wmode=opaque';
            else
                pdfSrc += '&embedded=true&wmode=opaque';
            elem.setAttribute("src", pdfSrc);

            elem.setAttribute("visible", 'true');
            elem.setAttribute("controls", 'true');

            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        function CanvasVideoItem(vc, layerid, id, videoSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);
            if (videoSrc.indexOf('?') == -1)
                videoSrc += '?wmode=opaque';
            else
                videoSrc += '&wmode=opaque';
            elem.setAttribute("src", videoSrc);
            elem.setAttribute("visible", 'true');
            elem.setAttribute("controls", 'true');

            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        function CanvasAudioItem(vc, layerid, id, audioSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('audio');
            elem.setAttribute("id", id);
            elem.setAttribute("src", audioSrc);
            elem.setAttribute("visible", 'true');
            elem.setAttribute("controls", 'true');
            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        function CanvasSkydriveDocumentItem(vc, layerid, id, embededSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);
            elem.setAttribute("src", embededSrc);
            this.initializeContent(elem);

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        function CanvasSkydriveImageItem(vc, layerid, id, embededSrc, vx, vy, vw, vh, z) {
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);

            var srcData = embededSrc.split(" ");

            var elem = document.createElement('iframe');
            elem.setAttribute("id", id);
            elem.setAttribute("src", srcData[0]);
            elem.setAttribute("scrolling", "no");
            elem.setAttribute("frameborder", "0");
            this.initializeContent(elem);

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if (!this.content)
                    return;

                var p = viewport2d.pointVirtualToScreen(this.x, this.y);

                var width = parseFloat(srcData[1]);
                var height = parseFloat(srcData[2]);

                var scale = size_p.x / width;
                if (height / width > size_p.y / size_p.x) {
                    scale = size_p.y / height;
                }

                this.content.style.left = (p.x + size_p.x / 2) + 'px';
                this.content.style.top = (p.y + size_p.y / 2) + 'px';
                this.content.style.marginLeft = (-width / 2) + 'px';
                this.content.style.marginTop = (-height / 2) + 'px';

                this.content.style.width = width + 'px';
                this.content.style.height = height + 'px';
                this.content.style.opacity = opacity;
                this.content.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';

                this.content.style.webkitTransform = "scale(" + scale + ")";
                this.content.style.msTransform = "scale(" + scale + ")";
                this.content.style.MozTransform = "scale(" + scale + ")";
            };

            this.prototype = new CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
        }

        function addTimeline(element, layerid, id, timelineinfo) {
            var width = timelineinfo.timeEnd - timelineinfo.timeStart;
            var timeline = VCContent.addChild(element, new CanvasTimeline(element.vc, layerid, id, timelineinfo.timeStart, timelineinfo.top, width, timelineinfo.height, {
                strokeStyle: timelineinfo.strokeStyle ? timelineinfo.strokeStyle : CZ.Settings.timelineStrokeStyle,
                lineWidth: CZ.Settings.timelineLineWidth,
                fillStyle: CZ.Settings.timelineColor ? CZ.Settings.timelineColor : timelineinfo.fillStyle,
                opacity: typeof timelineinfo.opacity !== 'undefined' ? timelineinfo.opacity : 1
            }, timelineinfo), true);
            return timeline;
        }
        VCContent.addTimeline = addTimeline;

        function ContentItem(vc, layerid, id, vx, vy, vw, vh, contentItem) {
            this.base = CanvasDynamicLOD;
            this.base(vc, layerid, id, vx, vy, vw, vh);
            this.guid = contentItem.id;
            this.type = 'contentItem';
            this.contentItem = contentItem;

            var titleHeight = vh * CZ.Settings.contentItemTopTitleHeight * 0.8;
            var mediaHeight = vh * CZ.Settings.contentItemMediaHeight;
            var descrHeight = CZ.Settings.contentItemFontHeight * vh;

            var contentWidth = vw * CZ.Settings.contentItemContentWidth;
            var leftOffset = (vw - contentWidth) / 2.0;
            var verticalMargin = vh * CZ.Settings.contentItemVerticalMargin;

            var mediaTop = vy + verticalMargin;
            var sourceVertMargin = verticalMargin * 0.4;
            var sourceTop = mediaTop + mediaHeight + sourceVertMargin;
            var sourceRight = vx + vw - leftOffset;
            var sourceHeight = vh * CZ.Settings.contentItemSourceHeight * 0.8;
            var titleTop = sourceTop + verticalMargin + sourceHeight;

            var rect = VCContent.addRectangle(this, layerid, id + "__rect__", vx, vy, vw, vh, {
                strokeStyle: CZ.Settings.contentItemBoundingBoxBorderColor, lineWidth: CZ.Settings.contentItemBoundingBoxBorderWidth * vw, fillStyle: CZ.Settings.contentItemBoundingBoxFillColor,
                isLineWidthVirtual: true
            });
            this.reactsOnMouse = true;

            this.onmouseenter = function (e) {
                rect.settings.strokeStyle = CZ.Settings.contentItemBoundingHoveredBoxBorderColor;
                this.vc.currentlyHoveredContentItem = this;
                this.vc.requestInvalidate();
            };

            this.onmouseleave = function (e) {
                rect.settings.strokeStyle = CZ.Settings.contentItemBoundingBoxBorderColor;
                this.vc.currentlyHoveredContentItem = null;
                this.isMouseIn = false;
                this.vc.requestInvalidate();
            };
            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };

            var self = this;
            this.changeZoomLevel = function (curZl, newZl) {
                var vy = self.newY;
                var mediaTop = vy + verticalMargin;
                var sourceTop = mediaTop + mediaHeight + sourceVertMargin;
                var titleTop = sourceTop + verticalMargin + sourceHeight;

                if (newZl >= CZ.Settings.contentItemShowContentZoomLevel) {
                    if (curZl >= CZ.Settings.contentItemShowContentZoomLevel)
                        return null;

                    var container = new ContainerElement(vc, layerid, id + "__content", vx, vy, vw, vh);

                    var mediaID = id + "__media__";
                    var imageElem = null;
                    if (this.contentItem.mediaType.toLowerCase() === 'image' || this.contentItem.mediaType.toLowerCase() === 'picture') {
                        imageElem = VCContent.addImage(container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, this.contentItem.uri);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'video') {
                        VCContent.addVideo(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'audio') {
                        mediaTop += CZ.Settings.contentItemAudioTopMargin * vh;
                        mediaHeight = vh * CZ.Settings.contentItemAudioHeight;
                        addAudio(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'pdf') {
                        VCContent.addPdf(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'skydrive-document') {
                        VCContent.addSkydriveDocument(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (this.contentItem.mediaType.toLowerCase() === 'skydrive-image') {
                        VCContent.addSkydriveImage(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if (CZ.Extensions.mediaTypeIsExtension(contentItem.mediaType)) {
                        VCContent.addExtension(contentItem.mediaType, container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex, this.contentItem.uri);
                    }

                    var titleText = this.contentItem.title;
                    addText(container, layerid, id + "__title__", vx + leftOffset, titleTop, titleTop + titleHeight / 2.0, 0.9 * titleHeight, titleText, {
                        fontName: CZ.Settings.contentItemHeaderFontName,
                        fillStyle: CZ.Settings.contentItemHeaderFontColor,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        opacity: 1,
                        wrapText: true,
                        numberOfLines: 1
                    }, contentWidth);

                    var sourceText = this.contentItem.attribution;
                    var mediaSource = this.contentItem.mediaSource;
                    if (sourceText) {
                        var addSourceText = function (sx, sw, sy) {
                            var sourceItem = addText(container, layerid, id + "__source__", sx, sy, sy + sourceHeight / 2.0, 0.9 * sourceHeight, sourceText, {
                                fontName: CZ.Settings.contentItemHeaderFontName,
                                fillStyle: CZ.Settings.contentItemSourceFontColor,
                                textBaseline: 'middle',
                                textAlign: 'right',
                                opacity: 1,
                                adjustWidth: true
                            }, sw);

                            if (mediaSource) {
                                sourceItem.reactsOnMouse = true;
                                sourceItem.onmouseclick = function (e) {
                                    vc.element.css('cursor', 'default');
                                    window.open(mediaSource);
                                    return true;
                                };
                                sourceItem.onmouseenter = function (pv, e) {
                                    this.settings.fillStyle = CZ.Settings.contentItemSourceHoveredFontColor;
                                    this.vc.requestInvalidate();
                                    this.vc.element.css('cursor', 'pointer');
                                };
                                sourceItem.onmouseleave = function (pv, e) {
                                    this.settings.fillStyle = CZ.Settings.contentItemSourceFontColor;
                                    this.vc.requestInvalidate();
                                    this.vc.element.css('cursor', 'default');
                                };
                            }
                        };

                        addSourceText(vx + leftOffset, contentWidth, sourceTop);
                    }

                    var descrTop = titleTop + titleHeight + verticalMargin;
                    var descr = addScrollText(container, layerid, id + "__description__", vx + leftOffset, descrTop, contentWidth, descrHeight, this.contentItem.description, 30, {});

                    if (CZ.Authoring.isEnabled) {
                        var imageSize = (container.y + container.height - descr.y - descr.height) * 0.75;
                        var editButton = VCContent.addImage(container, layerid, id + "__edit", container.x + container.width - 1.25 * imageSize, descrTop + descrHeight, imageSize, imageSize, "/images/edit.svg");

                        editButton.reactsOnMouse = true;
                        editButton.onmouseclick = function () {
                            CZ.Authoring.isActive = true;
                            CZ.Authoring.mode = "editContentItem";
                            CZ.Authoring.contentItemMode = "editContentItem";
                            CZ.Authoring.selectedExhibit = self.parent.parent.parent;
                            CZ.Authoring.selectedContentItem = self.contentItem;
                            return true;
                        };

                        editButton.onmouseenter = function () {
                            rect.settings.strokeStyle = "yellow";
                        };

                        editButton.onmouseleave = function () {
                            rect.settings.strokeStyle = CZ.Settings.contentItemBoundingHoveredBoxBorderColor;
                        };
                    }

                    return {
                        zoomLevel: CZ.Settings.contentItemShowContentZoomLevel,
                        content: container
                    };
                } else {
                    var zl = newZl;
                    if (zl >= CZ.Settings.contentItemThumbnailMaxLevel) {
                        if (curZl >= CZ.Settings.contentItemThumbnailMaxLevel && curZl < CZ.Settings.contentItemShowContentZoomLevel)
                            return null;
                        zl = CZ.Settings.contentItemThumbnailMaxLevel;
                    } else if (zl <= CZ.Settings.contentItemThumbnailMinLevel) {
                        if (curZl <= CZ.Settings.contentItemThumbnailMinLevel && curZl > 0)
                            return null;
                        zl = CZ.Settings.contentItemThumbnailMinLevel;
                    }
                    var sz = 1 << zl;
                    var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x' + sz + '/' + contentItem.guid + '.png';

                    return {
                        zoomLevel: newZl,
                        content: new CanvasImage(vc, layerid, id + "@" + 1, thumbnailUri, vx, vy, vw, vh)
                    };
                }
            };

            this.prototype = new CanvasDynamicLOD(vc, layerid, id, vx, vy, vw, vh);
        }

        function CanvasInfodot(vc, layerid, id, time, vyc, radv, contentItems, infodotDescription) {
            this.base = CanvasCircle;
            this.base(vc, layerid, id, time, vyc, radv, { strokeStyle: CZ.Settings.infoDotBorderColor, lineWidth: CZ.Settings.infoDotBorderWidth * radv, fillStyle: CZ.Settings.infoDotFillColor, isLineWidthVirtual: true });
            this.guid = infodotDescription.guid;
            this.type = 'infodot';

            this.isBuffered = infodotDescription.isBuffered;
            this.contentItems = contentItems;
            this.hasContentItems = false;
            this.infodotDescription = infodotDescription;
            this.title = infodotDescription.title;
            this.opacity = typeof infodotDescription.opacity !== 'undefined' ? infodotDescription.opacity : 1;

            contentItems.sort(function (a, b) {
                if (typeof a.order !== 'undefined' && typeof b.order === 'undefined')
                    return -1;
                else if (typeof a.order === 'undefined' && typeof b.order !== 'undefined')
                    return 1;
                else if (typeof a.order === 'undefined' && typeof b.order === 'undefined')
                    return 0;
                else if (a.order < b.order)
                    return -1;
                else if (a.order > b.order)
                    return 1;
                else
                    return 0;
            });

            for (var i = 0; i < contentItems.length; i++) {
                contentItems[i].order = i;
            }

            var vyc = this.newY + radv;
            var innerRad = radv - CZ.Settings.infoDotHoveredBorderWidth * radv;
            this.outerRad = radv;

            this.reactsOnMouse = true;

            this.tooltipEnabled = true;
            this.tooltipIsShown = false;

            this.onmousehover = function (pv, e) {
                this.vc.currentlyHoveredInfodot = this;
                this.vc.requestInvalidate();
            };

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };

            this.onmouseenter = function (e) {
                this.settings.strokeStyle = CZ.Settings.infoDotHoveredBorderColor;
                this.settings.lineWidth = CZ.Settings.infoDotHoveredBorderWidth * radv;
                this.vc.requestInvalidate();

                if (this.vc.currentlyHoveredTimeline != null) {
                    CZ.Common.stopAnimationTooltip();
                    this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
                }

                $(".bubbleInfo span").text(infodotDescription.title);
                this.panelWidth = $('.bubbleInfo').outerWidth();
                this.panelHeight = $('.bubbleInfo').outerHeight();

                CZ.Common.tooltipMode = "infodot";

                if ((this.tooltipEnabled == true) && (this.tooltipIsShown == false)) {
                    this.tooltipIsShown = true;
                    $(".bubbleInfo").attr("id", "defaultBox");
                    CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                }

                this.vc.cursorPosition = time;
                this.vc.currentlyHoveredInfodot = this;
                this.vc._setConstraintsByInfodotHover(this);
                this.vc.RaiseCursorChanged();
            };

            this.onmouseleave = function (e) {
                this.isMouseIn = false;
                this.settings.strokeStyle = CZ.Settings.infoDotBorderColor;
                this.settings.lineWidth = CZ.Settings.infoDotBorderWidth * radv;
                this.vc.requestInvalidate();

                if (this.tooltipIsShown == true)
                    CZ.Common.stopAnimationTooltip();

                this.tooltipIsShown = false;
                CZ.Common.tooltipMode = "default";

                this.vc.currentlyHoveredInfodot = undefined;
                this.vc._setConstraintsByInfodotHover(undefined);
                this.vc.RaiseCursorChanged();
            };

            this.onmouseclick = function (e) {
                return zoomToElementHandler(this, e, 1.0);
            };

            var bibliographyFlag = true;

            var infodot = this;
            var root = new CanvasDynamicLOD(vc, layerid, id + "_dlod", time - innerRad, vyc - innerRad, 2 * innerRad, 2 * innerRad);
            root.removeWhenInvisible = true;
            VCContent.addChild(this, root, false);

            root.firstLoad = true;
            root.changeZoomLevel = function (curZl, newZl) {
                var vyc = infodot.newY + radv;

                if (newZl >= CZ.Settings.infodotShowContentThumbZoomLevel && newZl < CZ.Settings.infodotShowContentZoomLevel) {
                    var URL = CZ.UrlNav.getURL();
                    if (typeof URL.hash.params != 'undefined' && typeof URL.hash.params['b'] != 'undefined')
                        bibliographyFlag = false;

                    if (curZl >= CZ.Settings.infodotShowContentThumbZoomLevel && curZl < CZ.Settings.infodotShowContentZoomLevel)
                        return null;

                    infodot.tooltipEnabled = true;

                    var contentItem = null;

                    if (infodot.contentItems.length > 0) {
                        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.newY, 2 * innerRad, 2 * innerRad);
                        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
                        if (items)
                            for (var i = 0; i < items.length; i++)
                                VCContent.addChild(contentItem, items[i], false);
                    }

                    if (contentItem) {
                        infodot.hasContentItems = true;
                        return {
                            zoomLevel: newZl,
                            content: contentItem
                        };
                    } else
                        return null;
                } else if (newZl >= CZ.Settings.infodotShowContentZoomLevel) {
                    if (curZl >= CZ.Settings.infodotShowContentZoomLevel)
                        return null;

                    infodot.tooltipEnabled = false;

                    if (infodot.tooltipIsShown == true) {
                        CZ.Common.stopAnimationTooltip();
                        infodot.tooltipIsShown = false;
                    }

                    var contentItem = null;

                    if (infodot.contentItems.length > 0) {
                        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.y, 2 * innerRad, 2 * innerRad);
                        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
                        if (items)
                            for (var i = 0; i < items.length; i++)
                                VCContent.addChild(contentItem, items[i], false);
                    }
                    if (contentItem == null)
                        return null;

                    var titleWidth = CZ.Settings.infodotTitleWidth * radv * 2;
                    var titleHeight = CZ.Settings.infodotTitleHeight * radv * 2;
                    var centralSquareSize = (270 / 2 + 5) / 450 * 2 * radv;
                    var titleTop = vyc - centralSquareSize - titleHeight;
                    var title = '';

                    if (infodotDescription && infodotDescription.title && infodotDescription.date) {
                        var exhibitDate = CZ.Dates.convertCoordinateToYear(infodotDescription.date);
                        if ((exhibitDate.regime == "CE") || (exhibitDate.regime == "BCE")) {
                            var date_number = Number(infodotDescription.date);
                            var exhibitDate = CZ.Dates.convertCoordinateToYear(date_number);
                            var exhibitYMD = CZ.Dates.getYMDFromCoordinate(date_number);
                            date_number = Math.abs(date_number);
                            if (date_number == Math.floor(date_number)) {
                                title = infodotDescription.title + '\n(' + parseFloat((date_number).toFixed(2)) + ' ' + exhibitDate.regime + ')';
                            } else {
                                title = infodotDescription.title + '\n(' + exhibitYMD.year + "." + (exhibitYMD.month + 1) + "." + exhibitYMD.day + ' ' + exhibitDate.regime + ')';
                            }
                        } else {
                            title = infodotDescription.title + '\n(' + parseFloat(exhibitDate.year.toFixed(2)) + ' ' + exhibitDate.regime + ')';
                        }
                    }

                    var infodotTitle = addText(contentItem, layerid, id + "__title", time - titleWidth / 2, titleTop, titleTop, titleHeight, title, {
                        fontName: CZ.Settings.contentItemHeaderFontName,
                        fillStyle: CZ.Settings.contentItemHeaderFontColor,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        opacity: 1,
                        wrapText: true,
                        numberOfLines: 2
                    }, titleWidth);

                    if (CZ.Authoring.isEnabled) {
                        var imageSize = (titleTop - infodot.y) * 0.75;
                        var editButton = VCContent.addImage(infodot, layerid, id + "__edit", time - imageSize / 2, infodot.y + imageSize * 0.2, imageSize, imageSize, "/images/edit.svg");

                        editButton.reactsOnMouse = true;
                        editButton.onmouseclick = function () {
                            CZ.Authoring.isActive = true;
                            CZ.Authoring.mode = "editExhibit";
                            CZ.Authoring.selectedExhibit = infodot;
                            return true;
                        };

                        editButton.onmouseenter = function () {
                            infodot.settings.strokeStyle = "yellow";
                        };

                        editButton.onmouseleave = function () {
                            infodot.settings.strokeStyle = CZ.Settings.infoDotBorderColor;
                        };
                    }

                    var biblBottom = vyc + centralSquareSize + 63.0 / 450 * 2 * radv;
                    var biblHeight = CZ.Settings.infodotBibliographyHeight * radv * 2;
                    var biblWidth = titleWidth / 3;
                    var bibl = addText(contentItem, layerid, id + "__bibliography", time - biblWidth / 2, biblBottom - biblHeight, biblBottom - biblHeight / 2, biblHeight, "Bibliography", {
                        fontName: CZ.Settings.contentItemHeaderFontName,
                        fillStyle: CZ.Settings.timelineBorderColor,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        opacity: 1
                    }, biblWidth);
                    bibl.reactsOnMouse = true;
                    bibl.onmouseclick = function (e) {
                        this.vc.element.css('cursor', 'default');
                        CZ.Bibliography.showBibliography({ infodot: infodotDescription, contentItems: infodot.contentItems }, contentItem, id + "__bibliography");
                        return true;
                    };
                    bibl.onmouseenter = function (pv, e) {
                        this.settings.fillStyle = CZ.Settings.infoDotHoveredBorderColor;
                        this.vc.requestInvalidate();
                        this.vc.element.css('cursor', 'pointer');
                    };
                    bibl.onmouseleave = function (pv, e) {
                        this.settings.fillStyle = CZ.Settings.infoDotBorderColor;
                        this.vc.requestInvalidate();
                        this.vc.element.css('cursor', 'default');
                    };

                    var bid = window.location.hash.match("b=([a-z0-9_\-]+)");
                    if (bid && bibliographyFlag) {
                        CZ.Bibliography.showBibliography({ infodot: infodotDescription, contentItems: infodot.contentItems }, contentItem, bid[1]);
                    }

                    if (contentItem) {
                        infodot.hasContentItems = true;
                        return {
                            zoomLevel: newZl,
                            content: contentItem
                        };
                    }
                } else {
                    infodot.tooltipEnabled = true;

                    infodot.hasContentItems = false;
                    if (infodot.contentItems.length == 0)
                        return null;

                    var zl = newZl;

                    if (zl <= CZ.Settings.contentItemThumbnailMinLevel) {
                        if (curZl <= CZ.Settings.contentItemThumbnailMinLevel && curZl > 0)
                            return null;
                    }
                    if (zl >= CZ.Settings.contentItemThumbnailMaxLevel) {
                        if (curZl >= CZ.Settings.contentItemThumbnailMaxLevel && curZl < CZ.Settings.infodotShowContentZoomLevel)
                            return null;
                        zl = CZ.Settings.contentItemThumbnailMaxLevel;
                    }
                    if (zl < CZ.Settings.contentItemThumbnailMinLevel) {
                        return {
                            zoomLevel: zl,
                            content: new ContainerElement(vc, layerid, id + "__empty", time, vyc, 0, 0)
                        };
                    }
                    var contentItem = infodot.contentItems[0];
                    var sz = 1 << zl;
                    var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x' + sz + '/' + contentItem.guid + '.png';
                    var l = innerRad * 260 / 225;
                    return {
                        zoomLevel: zl,
                        content: new CanvasImage(vc, layerid, id + "@" + zl, thumbnailUri, time - l / 2.0, vyc - l / 2.0, l, l)
                    };
                }
            };

            var _rad = 450.0 / 2.0;
            var k = 1.0 / _rad;
            var _wc = (252.0 + 0) * k;
            var _hc = (262.0 + 0) * k;
            var strokeWidth = 3 * k * radv;
            var strokeLength = 24.0 * k * radv;
            var xlt0 = -_wc / 2 * radv + time;
            var ylt0 = -_hc / 2 * radv + vyc;
            var xlt1 = _wc / 2 * radv + time;
            var ylt1 = _hc / 2 * radv + vyc;

            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                this.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);

                var sw = viewport2d.widthVirtualToScreen(strokeWidth);
                if (sw < 0.5)
                    return;

                var vyc = infodot.y + radv;
                var xlt0 = -_wc / 2 * radv + time;
                var ylt0 = -_hc / 2 * radv + vyc;
                var xlt1 = _wc / 2 * radv + time;
                var ylt1 = _hc / 2 * radv + vyc;

                var rad = this.width / 2.0;
                var xc = this.x + rad;
                var yc = this.y + rad;
                var radp = size_p.x / 2.0;

                var sl = viewport2d.widthVirtualToScreen(strokeLength);
                var pl0 = viewport2d.pointVirtualToScreen(xlt0, ylt0);
                var pl1 = viewport2d.pointVirtualToScreen(xlt1, ylt1);

                ctx.lineWidth = sw;
                ctx.strokeStyle = CZ.Settings.contentItemBoundingBoxFillColor;
            };

            this.isInside = function (point_v) {
                var len2 = CZ.Common.sqr(point_v.x - this.x - (this.width / 2)) + CZ.Common.sqr(point_v.y - this.y - (this.height / 2));
                var rad = this.width / 2.0;
                return len2 <= rad * rad;
            };

            this.prototype = new CanvasCircle(vc, layerid, id, time, vyc, radv, { strokeStyle: CZ.Settings.infoDotBorderColor, lineWidth: CZ.Settings.infoDotBorderWidth * radv, fillStyle: CZ.Settings.infoDotFillColor, isLineWidthVirtual: true });
        }

        function getContentItem(infodot, cid) {
            if (infodot.type !== 'infodot' || infodot.contentItems.length === 0)
                return null;
            var radv = infodot.width / 2;
            var innerRad = radv - CZ.Settings.infoDotHoveredBorderWidth * radv;
            var citems = buildVcContentItems(infodot.contentItems, infodot.x + infodot.width / 2, infodot.y + infodot.height / 2, innerRad, infodot.vc, infodot.layerid);
            if (!citems)
                return null;
            for (var i = 0; i < citems.length; i++) {
                if (citems[i].id == cid)
                    return {
                        id: cid,
                        x: citems[i].x, y: citems[i].y, width: citems[i].width, height: citems[i].height,
                        parent: infodot,
                        type: "contentItem",
                        vc: infodot.vc
                    };
            }
            return null;
        }
        VCContent.getContentItem = getContentItem;

        function addInfodot(element, layerid, id, time, vyc, radv, contentItems, infodotDescription) {
            var infodot = new CanvasInfodot(element.vc, layerid, id, time, vyc, radv, contentItems, infodotDescription);
            return VCContent.addChild(element, infodot, true);
        }
        VCContent.addInfodot = addInfodot;

        function buildVcContentItems(contentItems, xc, yc, rad, vc, layerid) {
            var n = contentItems.length;
            if (n <= 0)
                return null;

            var _rad = 450.0 / 2.0;
            var k = 1.0 / _rad;
            var _wc = 260.0 * k;
            var _hc = 270.0 * k;

            var _xlc = -_wc / 2 - 38.0 * k;
            var _xrc = -_xlc;
            var _lw = 60.0 * k;
            var _lh = _lw;
            var lw = _lw * rad;
            var lh = _lh * rad;

            var _ytc = -_hc / 2 - 9.0 * k - _lh / 2;
            var _ybc = -_ytc;

            var arrangeLeft = arrangeContentItemsInField(3, _lh);
            var arrangeRight = arrangeContentItemsInField(3, _lh);
            var arrangeBottom = arrangeContentItemsInField(3, _lw);

            var xl = xc + rad * (_xlc - _lw / 2);
            var xr = xc + rad * (_xrc - _lw / 2);
            var yb = yc + rad * (_ybc - _lh / 2);

            var vcitems = [];

            for (var i = 0, len = Math.min(CZ.Settings.infodotMaxContentItemsCount, n); i < len; i++) {
                var ci = contentItems[i];
                if (i === 0) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, -_wc / 2 * rad + xc, -_hc / 2 * rad + yc, _wc * rad, _hc * rad, ci));
                } else if (i >= 1 && i <= 3) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xl, yc + rad * arrangeLeft[(i - 1) % 3], lw, lh, ci));
                } else if (i >= 4 && i <= 6) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xr, yc + rad * arrangeRight[(i - 1) % 3], lw, lh, ci));
                } else if (i >= 7 && i <= 9) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xc + rad * arrangeBottom[(i - 1) % 3], yb, lw, lh, ci));
                }
            }

            return vcitems;
        }

        function arrangeContentItemsInField(n, dx) {
            if (n == 0)
                return null;
            var margin = 0.05 * dx;
            var x1, x2, x3, x4;
            if (n % 2 == 0) {
                x1 = -margin / 2 - dx;
                x2 = margin / 2;
                if (n == 4) {
                    x3 = x1 - dx - margin;
                    x4 = x2 + margin + dx;
                    return [x3, x1, x2, x4];
                }
                return [x1, x2];
            } else {
                x1 = -dx / 2;
                if (n > 1) {
                    x2 = dx / 2 + margin;
                    x3 = x1 - dx - margin;
                    return [x3, x1, x2];
                }
                return [x1];
            }
        }
    })(CZ.VCContent || (CZ.VCContent = {}));
    var VCContent = CZ.VCContent;
})(CZ || (CZ = {}));
