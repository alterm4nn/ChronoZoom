/*! RIN | http://research.microsoft.com/rin | 2013-07-23 */
(function() {

    var rin = window.rin || {};
    window.rin = rin;

    // RIN core looks for the presence of this object when
    // deciding to dynamically load the experiences JS
    rin.experiences = rin.experiences || {};

}());
/// <reference path="../../../web/lib/rin-core-1.0.js" />

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

(function (rin) {
    "use strict";

    //Image Experience Provider
    var ImageES = (function (_super) {
        //Setting up the inheritance
        var __extends = function (d, b) {
            function __() { this.constructor = d; }
            __.prototype = b.prototype;
            d.prototype = new __();
        };

        //Extending the ImageES from _super class
        __extends(ImageES, _super);
        function ImageES(orchestrator, esData) {
            /// <summary>Image Experience Provider</summary>
            /// <param name="orchestrator" type="rin.OrchestratorProxy">Orchestrator Proxy element which can be used to called the core methods and listen to core events</param>
            /// <param name="esData" type="object">Experience Data for the provider to initialize and process</param>
            //Initialize the base class
            _super.call(this, orchestrator, esData);
            this._orchestrator = orchestrator;
            this._esData = esData;
            this.isDragging = false;
            this.lastTouchPoint = { "x": 0, "y": 0 };
            this._isImageLoaded = false;
            this._isContainerLoaded = false;
            this.viewportChangedEvent = new rin.contracts.Event();
            this.originalDimension = { "width": 0, "height": 0 };
            this.msGesture = null;
            this.cover = $(document.createElement('div'));
            this.proxy = $(document.createElement('div'));
            this.proxy.attr('data-proxy', this._esData.experienceId);
            this.proxy.data({
                'x': 0,
                'y': 0,
                'w': 0,
                'h': 0
            });
            this.proxy.css({ "background": "rgba(0,0,0,0)", "width": "0px", "height": "0px" });

            this._esData.data = this._esData.data || {};
            this._esData.data.defaultKeyframe = this._esData.data.defaultKeyframe || {
                "state": {
                    "viewport": {
                        "region": {
                            "center": {
                                "x": 0,
                                "y": 0
                            },
                            "span": {
                                "x": 0,
                                "y": 0
                            }
                        }
                    }
                },
                'type': 'relative'
            };

            //Load the text as a element html
            this._userInterfaceControl = convertToHtmlDom(ELEMENTHTML).firstChild;
            this._image = this._userInterfaceControl.firstChild;
            if (esData.resourceReferences && esData.resourceReferences[0] && esData.resourceReferences[0].resourceId) {
                //Get the first resource and take it as the resource to be loaded.
                this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);
            }
        }
        //Public Functions and overrides for the DiscreteKeyframeESBase functions
        ImageES.prototype.load = function (experienceStreamId) {
            var self = this;

            ///<summary>Loads a specific experience stream Id and its key frames</summary>
            ///<param name="experienceStreamId" type="String">Id of the experience stream to be loaded</param>
            this.addSliverInterpolator("viewport", function (sliverId, state) {
                return new rin.Ext.Interpolators.linearViewportInterpolator(state);
            });

            _super.prototype.load.call(this, experienceStreamId);

            //Set the state to buffering
            this.setState(rin.contracts.experienceStreamState.buffering);

            //Add a load event listener
            this._image.addEventListener("load", (function (event) {
                /// <summary>Set the state to ready once the image load is complete</summary>
                this._isImageLoaded = true;
                self._resetImagePosition();
                self.setState(rin.contracts.experienceStreamState.ready);
            }).bind(this));

            //Add abort and error event listeners
            this._image.addEventListener("abort", (function (event) {
                /// <summary>Set the state to error if image errors out</summary>

                //Set the state to error
                this.setState(rin.contracts.experienceStreamState.error);
            }).bind(this));
            this._image.addEventListener("error", (function (event) {
                /// <summary>Set the state to error if image errors out</summary>

                //Set the state to error
                this.setState(rin.contracts.experienceStreamState.error);
            }).bind(this));

            this._initInteractionHandlers();

            // Keep checking if all required components of the ES are ready
            //function checkReadyState() {
            //    if (self.setState() == rin.contracts.experienceStreamState.error) // Stop the loop in case of an error.
            //        return;

            //    if (self._isImageLoaded && self._userInterfaceControl.clientWidth > 0)
            //    {
            //        return;
            //    }
            //    setTimeout(checkReadyState, 300);
            //}
            //checkReadyState();

            //Set the image source
            this._image.src = this._url;
            
        };

        ImageES.prototype._resetImagePosition = function () {
            var self = this;
            // position the image in the center of the screen by default
            var widthScale = Math.min(1, self._userInterfaceControl.clientWidth / self._image.naturalWidth);
            var heightScale = Math.min(1, self._userInterfaceControl.clientHeight / self._image.naturalHeight);
            var scale = Math.min(widthScale, heightScale);

            var translateX = (self._userInterfaceControl.clientWidth - (self._image.naturalWidth * scale)) / 2;
            var translateY = (self._userInterfaceControl.clientHeight - (self._image.naturalHeight * scale)) / 2;

            self._image.style.height = (self._image.naturalHeight * scale) + "px";
            self._image.style.width = (self._image.naturalWidth * scale) + "px";
            self._image.style.top = translateY + "px";
            self._image.style.left = translateX + "px";

            self._viewportUpdated();
        };

        ImageES.prototype.constrainAspectRatio = function () {
            var widthScale = Math.min(1, self._userInterfaceControl.clientWidth / self._image.naturalWidth);
            var heightScale = Math.min(1, self._userInterfaceControl.clientHeight / self._image.naturalHeight);
            var scale = Math.min(widthScale, heightScale);
        }

        ImageES.prototype._initInteractionHandlers = function () {
            var self = this, cover = this.cover;

            // set up touch cover
            cover.css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
                'z-index': '100000000000000000000'
            });
            cover.hide();
            $('body').append(cover);

            // If running on IE 10/RT, enable multitouch support.
            if (window.navigator.msPointerEnabled && typeof (MSGesture) !== "undefined") {
                var immsgesturedown = function (e) {
                    self._orchestrator.startInteractionMode();
                    self._orchestrator.onESEvent(rin.contracts.esEventIds.interactionActivatedEventId, null);

                    if (!self.msGesture) {
                        self.msGesture = new MSGesture();
                        self.msGesture.target = self._image;
                    }

                    self.msGesture.addPointer(e.pointerId);

                    e.stopPropagation();
                    e.preventDefault();

                    cover.show();
                };
                this._image.addEventListener("MSPointerDown", immsgesturedown, false);
                cover[0].addEventListener("MSPointerDown", immsgesturedown, true);

                var immsgesturechange = function (e) {
                    if (e.translationX !== 0 || e.translationY !== 0) {
                        self._translateImage(e.translationX, e.translationY);
                    }

                    if (e.scale !== 1) {
                        self._scaleImage(e.scale, e.offsetX, e.offsetY);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                };
                this._image.addEventListener("MSGestureChange", immsgesturechange);
                cover[0].addEventListener('MSGestureChange', immsgesturechange, true);

                var immsgestureend = function (e) {
                    self.msGesture && self.msGesture.stop();
                    cover.hide();
                };
                this._image.addEventListener("MSGestureEnd", immsgestureend, false);
                cover[0].addEventListener('MSGestureEnd', immsgestureend, true);

                var msgesturestart = function (e) {
                    e.stopPropagation();
                    cover.show();
                };
                this._image.addEventListener("MSGestureStart", msgesturestart, false);
                cover[0].addEventListener('MSGestureStart', msgesturestart, true);
            } else {

                //Add the event listener for detecting interactions
                var immousedown = function (event) {
                    /// <summary>Bind the mouse down to raise an interaction event</summary>

                    cover.show();

                    this.lastTouchPoint = { "x": event.x, "y": event.y };
                    this.isDragging = true;
                    this._image.setCapture();

                    //Intimate Orchestrator that the user has interacted
                    this._orchestrator.startInteractionMode();
                    self._orchestrator.onESEvent(rin.contracts.esEventIds.interactionActivatedEventId, null);
                    return false;
                };
                this._image.addEventListener("mousedown", immousedown.bind(this));
                cover.on('mousedown', immousedown.bind(this));

                var immouseup = function (event) {
                    cover.hide();
                    this._image.releaseCapture();
                    this.isDragging = false;
                    return false;
                };
                this._image.addEventListener("mouseup", immouseup.bind(this));
                cover.on('mouseup', immouseup.bind(this));

                var immousemove = function (event) {
                    if (this.isDragging === true) {
                        var diffx = event.x - this.lastTouchPoint.x;
                        var diffy = event.y - this.lastTouchPoint.y;
                        this.lastTouchPoint.x = event.x;
                        this.lastTouchPoint.y = event.y;

                        this._translateImage(diffx, diffy);
                    }
                    return false;
                };
                this._image.addEventListener("mousemove", immousemove.bind(this));
                cover.on('mousemove', immousemove.bind(this));
            }

            this._image.addEventListener("mousewheel", (function (event) {
                //Intimate Orchestrator that the user has interacted
                this._orchestrator.startInteractionMode();
                self._orchestrator.onESEvent(rin.contracts.esEventIds.interactionActivatedEventId, null);

                var scale = (event.wheelDelta > 0 ? ZOOMINSTEP - 1 : ZOOMOUTSTEP - 1) * Math.abs(event.wheelDelta / 120) + 1;

                this._scaleImage(scale, event.offsetX, event.offsetY);

                return false;
            }).bind(this));
        };

        ImageES.prototype.raiseViewportUpdate = function () {
            var expid = this._esData.experienceId;
            var newLeft = this._currentViewport.region.center.x;
            var newTop = this._currentViewport.region.center.y;
            var newWidth = this._currentViewport.region.span.x;
            var newHeight = this._currentViewport.region.span.y;
            if (this.originalDimension.width === 0) {
                this.originalDimension.width = newWidth;
                this.originalDimension.height = newHeight;
            }

            if (!this.proxy[0].parentNode) {
                var viewerElt = $("#rinplayer").length ? $("#rinplayer") : $("#rinPlayer");
                viewerElt.append(this.proxy);
            }
            this.proxy.data({
                x: newLeft, y: newTop,
                w: newWidth, h: newHeight
            });

            this.viewportChangedEvent.publish({
                "x": this._currentViewport.region.center.x, "y": this._currentViewport.region.center.y,
                "width": this._currentViewport.region.span.x, "height": this._currentViewport.region.span.y
            });
        };

        ImageES.prototype.displayKeyframe = function (keyframeData) {
            /// <summary>Pauses a specific experience stream Id at the specified offset</summary>
            /// <param name="keyframeData" type="object">The keyframe data in the form of sliver containing viewport details</param>
            var absViewport;

            if (this.getState() !== rin.contracts.experienceStreamState.ready) {
                // Not ready yet, do not attempt to show anything.
                return;
            }

            if (this.msGesture) this.msGesture.stop();

            if (keyframeData && keyframeData.state && keyframeData.state.viewport) {
                if (keyframeData.type && keyframeData.type === 'relative') {
                    // convert keyframe data to absolute
                    var cw = this._userInterfaceControl.clientWidth;
                    var ch = this._userInterfaceControl.clientHeight;
                    var width, height, left, top;
                    //real_kfh = real_kfw * (new_ph / new_pw);
                    //real_kfx = -kfx * real_kfw;
                    //real_kfy = -kfy * real_kfw; //WEIRD -- seems to place too high if use -kfy * real_kfh
                    width = cw * parseFloat(keyframeData.state.viewport.region.span.x);
                    height = ch * parseFloat(keyframeData.state.viewport.region.span.y);
                    left = cw * parseFloat(keyframeData.state.viewport.region.center.x);
                    top = ch * parseFloat(keyframeData.state.viewport.region.center.y);
                    absViewport = {
                        region: {
                            center: {
                                x: left,
                                y: top
                            },
                            span: {
                                x: width,
                                y: height
                            }
                        }
                    };
                    this._fitImage(absViewport);
                } else {
                    this._fitImage(keyframeData.state.viewport);
                }
            }
        };

        ImageES.prototype.addedToStage = function() {
            // TODO: better way to hide the player controls if inside an popup?
            $(this._image).parents('.rin_popup_es_container')
                .find('.rin_Footer').addClass('rin_hide_footer');
        };

        ImageES.prototype.unload = function () {
            ///<summary>unloads a specific experience stream Id and its key frames</summary>
            //Clean-up the code here
            this.cover.remove();
            this.proxy.remove();
        };
        //Interaction Controls
        ImageES.prototype.getInteractionControls = function () {
            /// <summary>Gets the interaction Controls. This is done asynchronously</summary>

            if (!this._interactionControls) {
                this._interactionControls = document.createElement("div");
                //Request Pan Zoom Controls from the orchestrator
                this._orchestrator.getInteractionControls([
                    rin.contracts.interactionControlNames.panZoomControl
                ],
                (function (wrappedInteractionControls) {
                    //Load the controls into as interaction controls 
                    rin.util.assignAsInnerHTMLUnsafe(this._interactionControls, wrappedInteractionControls.innerHTML);
                    //Use knockout framework to bind the commands
                    ko.applyBindings(this, this._interactionControls);
                }).bind(this));
            }
            //Return the container element. After the orchestrator fetches the controls, it would be loaded inside this div
            return this._interactionControls;
        };

        //Pan Zoom Control Commands
        ImageES.prototype.goHomeCommand = function () {
            /// <summary>Resets the Image to fit the screen</summary>
            this._resetImagePosition();
        };
        ImageES.prototype.zoomOutCommand = function () {
            /// <summary>Zooms out the image by a standard scale</summary>
            this._scaleImage(ZOOMOUTSTEP);
        };
        ImageES.prototype.zoomInCommand = function () {
            /// <summary>Zooms in the image by a standard scale</summary>
            this._scaleImage(ZOOMINSTEP);
        };
        ImageES.prototype.panLeftCommand = function () {
            /// <summary>Moves the image left by a standard scale</summary>
            this._translateImage(-1 * PANSTEP, 0);
        };
        ImageES.prototype.panRightCommand = function () {
            /// <summary>Moves the image right by a standard scale</summary>
            this._translateImage(PANSTEP, 0);
        };
        ImageES.prototype.panUpCommand = function () {
            /// <summary>Moves the image up by a standard scale</summary>
            this._translateImage(0, -1 * PANSTEP);
        };
        ImageES.prototype.panDownCommand = function () {
            /// <summary>Moves the image down by a standard scale</summary>
            this._translateImage(0, PANSTEP);
        };

        //To get the state of the Experience at any given point of time - Used generally on the authoring side
        ImageES.prototype.captureKeyframe = function () {
            /// <summary>Get the current state.</summary>
            if (!this._currentViewport) {
                return "";
            }
            /*
            kfvx = -keyframe.state.viewport.region.center.x / keyframe.state.viewport.region.span.x;
            kfvy = -keyframe.state.viewport.region.center.y / keyframe.state.viewport.region.span.x;
            kfvw = $("#" + self.canvid).width() / keyframe.state.viewport.region.span.x;
            */
            var cw = this._userInterfaceControl.clientWidth;
            var ch = this._userInterfaceControl.clientHeight;
            var width, height, left, top;
            width = parseFloat(this._currentViewport.region.span.x) / cw;
            height = parseFloat(this._currentViewport.region.span.y) / ch;
            left = parseFloat(this._currentViewport.region.center.x) / cw;
            top = parseFloat(this._currentViewport.region.center.y) / ch;
            //top = -width/parseFloat(this._currentViewport.region.center.y);
            //left = -width / parseFloat(this._currentViewport.region.center.x);
            return {
                "state": {
                    "viewport": {
                        "region": {
                            "span": {
                                "x": width,
                                "y": height
                            },
                            "center": {
                                "x": left,
                                "y": top
                            }
                        }
                    }
                },
                "data": {
                    "contentType": "ZoomableImage",
                    
                },
                "type": 'relative',
                
            };
        };

        //Defining Private variables
        ImageES.prototype._orchestrator = null, //rin.internal.OrchestratorProxy,
        ImageES.prototype._esData = null, //Object,
        ImageES.prototype._interactionControls = null, //HTMLElement,
        ImageES.prototype._url = null, //String,
        ImageES.prototype._currentViewport = null, //ViewPort,
        ImageES.prototype._image = null, //HTMLImageElement,

        //"Private Helper Functions
        ImageES.prototype._viewportUpdated = function () {
            /// <summary>Stores the image dimensions</summary>
            var top = parseFloat(this._image.style.top);
            var left = parseFloat(this._image.style.left);
            var width = parseFloat(this._image.style.width);
            var height = parseFloat(this._image.style.height);
            this._currentViewport = new ViewPort({
                center: new TwoDCoordinates(left, top),
                span: new TwoDCoordinates(width, height)
            });

            this.raiseViewportUpdate();
            var playerState = this._orchestrator.getPlayerState();
            if (playerState === rin.contracts.playerState.pausedForExplore || playerState === rin.contracts.playerState.stopped) {
                this._orchestrator.onESEvent(rin.contracts.esEventIds.stateTransitionEventId, { isUserInitiated: true, transitionState: "completed" });
            }
        };
        ImageES.prototype._translateImage = function (xAxis, yAxis) {
            /// <summary>Moves the image by applying the transform property by x and y pixels.</summary>
            /// <param name="xAxis" type="float">Horizontal translation in pixels</param>
            /// <param name="yAxis" type="float">Vertical translation in pixels</param>
            this._currentViewport.region.center.x += xAxis;
            this._currentViewport.region.center.y += yAxis;
            this._fitImage(this._currentViewport);
        };
        ImageES.prototype._scaleImage = function (scale, x, y) {
            /// <summary>Scales the image by using the transform property</summary>
            /// <param name="scale" type="float">Scaling factor</param>

            if (x || y) {
                var newWidth = this._image.clientWidth * scale;
                var newHeight = this._image.clientHeight * scale;
                var constrainedWidth = Math.constrain(newWidth, this.originalDimension.width * 0.125, this.originalDimension.width * 16);
                var constrainedHeight = Math.constrain(newHeight, this.originalDimension.height * 0.125, this.originalDimension.height * 16);

                var changeInWidth = (constrainedWidth) - this._image.clientWidth;
                var changeInHeight = (constrainedHeight) - this._image.clientHeight;

                if (constrainedWidth !== newWidth) {
                    scale = 1;
                    changeInWidth = 0;
                }
                if (constrainedHeight !== newHeight) {
                    scale = 1;
                    changeInHeight = 0;
                }

                var leftPercentage = x / this._image.clientWidth;
                var topPercentage = y / this._image.clientHeight;
                this._translateImage(-leftPercentage * changeInWidth, -topPercentage * changeInHeight);
            }

            this._currentViewport.region.span.x *= scale;
            this._currentViewport.region.span.y *= scale;
            this._fitImage(this._currentViewport);
        };
        ImageES.prototype._fitImage = function (viewport) {
            /// <summary>Fits the image to the specified viewport</summary>
            /// <param name="viewport" type="Viewport">Viewport Sliver to set the image</param>
            var left = viewport.region.center.x;
            var top = viewport.region.center.y;
            var width = viewport.region.span.x;
            var height = viewport.region.span.y;

            // maintain aspect ratio!
            var realAspect = this._image.naturalWidth / this._image.naturalHeight;
            var newAspect = width / height;

            if (Math.abs(realAspect - newAspect) > 0.0001) {
                // fix aspect ratio
                if (realAspect >= 1) {
                    height = width / this._image.naturalWidth * this._image.naturalHeight;
                } else {
                    width = height / this._image.naturalHeight * this._image.naturalWidth;
                }
            }
            
            //var getTransformProperty = function (element) {
            //    /// <summary>Gets the transform property supported by the browser or false</summary>
            //    /// <param name="element" type="HtmlElement">Element for which transform property needs to be applied</param>
            //    /// <returns type="string or boolean" />

            //    // Note that in some versions of IE9 it is critical that
            //    // msTransform appear in this list before MozTransform
            //    var property,
            //        properties = [
            //            //W3C standard transform property
            //            'transform',
            //            //Safari and Chrome specific transform property
            //            'WebkitTransform',
            //            //IE specific transform property
            //            'msTransform',
            //            //Mozilla specific transfrom property
            //            'MozTransform',
            //            //Opera specific transform property
            //            'OTransform'
            //        ];
            //    property = properties.shift();
            //    while (property) {
            //        if (element.style[property] !== undefined) {
            //            return property;
            //        }
            //        property = properties.shift();
            //    }
            //    return false;
            //},
            //property = getTransformProperty(this._image);

            this._image.style.top = top + "px";
            this._image.style.left = left + "px";
            this._image.style.width = width + "px";
            this._image.style.height = height + "px";
            this._viewportUpdated();
        };
        return ImageES;
    })(rin.contracts.InterpolatedKeyframeESBase);

    //Registerning the ES in the es factory so that orchestrator can invoke it
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.ImageExperienceStream", function (orchestrator, esData) { return new ImageES(orchestrator, esData); });

    //Utility functions
    var convertToHtmlDom = function (htmlString) {
        return rin.util.createElementWithHtml(htmlString);
    };

    //Defining Constants
    var ZOOMINSTEP = 1.2,
        ZOOMOUTSTEP = 0.8,
        PANSTEP = 20,
        ELEMENTHTML = "<div style='position:absolute;left:0px;top:0px;height:100%; width:100%; overflow:hidden;'><img class='rin_selectDisable' style='position:absolute;left:0px;top:0px;height:100%; width:100%; pointer-events:auto'></img></div>";

    //"Private" Helper Classes
    var TwoDCoordinates = (function () {
        function TwoDCoordinates(x, y) {
            this.x = x;
            this.y = y;
        }
        TwoDCoordinates.prototype.toString = function () {
            return '{x:' + this.x + ',y:' + this.y + '}';
        };
        return TwoDCoordinates;
    })();

    var ViewPort = (function () {
        function ViewPort(region) {
            this.region = region;
        }
        return ViewPort;
    })();

}(window.rin));
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../../../web/js/seadragon-0.8.9.js" />
/// <reference path="../core/TaskTimer.js" />


window.rin = window.rin || {};

(function (rin) {
    // ES for displaying deepzoom images.
    var DeepZoomES = function (orchestrator, esData) {
        DeepZoomES.parentConstructor.apply(this, arguments);
        var self = this;
        
        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(DeepZoomES.elementHtml).firstChild; // Experience stream UI DOM element.
        this._seadragonClip = this._userInterfaceControl.getElementsByClassName("seadragonClip")[0];
        this._seadragonClipContents = this._userInterfaceControl.getElementsByClassName("seadragonClipContents")[0];
        this._seadragonContainer = this._userInterfaceControl.getElementsByClassName("seadragonContainer")[0];
        this._seadragonElement = null;
        this._esData = esData;
        this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId); // Resolved url to the DZ image.
        this.viewportChangedEvent = new rin.contracts.Event();
        this.applyConstraints = orchestrator.getPlayerConfiguration().playerMode !== rin.contracts.playerMode.AuthorerEditor;
        this.old_left = 0;
        this.old_top = 0;
        this.old_width = 0;
        this.old_height = 0;
        this.msGesture = null;
        this.cover = $(document.createElement('div'));
        this.proxy = $(document.createElement('div'));
        this.proxy.attr('data-proxy', this._esData.experienceId);
        this.proxy.data({
            'x': 0,
            'y': 0,
            'w': 0,
            'h': 0
        });
        this.proxy.css({ "background": "rgba(0,0,0,0)", "width": "0px", "height": "0px" });

        esData.data = esData.data || {};
        esData.data.defaultKeyframe = esData.data.defaultKeyframe || {
            "state": {
                "viewport": {
                    "region": {
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "span": {
                            "x": 0,
                            "y": 0
                        }
                    }
                }
            }
        };

        // Set viewport visibility constrains
        Seadragon.Config.visibilityRatio = typeof esData.data.viewportConstrainRatio === "undefined" ? 0.05 : esData.data.viewportConstrainRatio;
        if (esData.data.viewportClamping && esData.data.viewportClamping !== this.viewportClampingOptions.none) {
            this.viewportClampingMode = esData.data.viewportClamping;
            Seadragon.Config.visibilityRatio = 1; // This is required to support viewport clamping.
        }

        // Monitor interactions on the ES
        $(this._userInterfaceControl).bind("mousedown mousewheel", function (e) {
            self._orchestrator.startInteractionMode();
            self._orchestrator.onESEvent(rin.contracts.esEventIds.interactionActivatedEventId, null);
            //self._userInterfaceControl.focus();
        });

        // Handle key events for panning
        this._userInterfaceControl.addEventListener('keydown', function (e) {
            if (e.keyCode === '37') //left arrow
                self.panLeftCommand();
            else if (e.keyCode === '38') //up arrow
                self.panUpCommand();
            else if (e.keyCode === '39') //right arrow
                self.panRightCommand();
            else if (e.keyCode === '40') //down arrow 
                self.panDownCommand();
        }, true);
        this.updateEA = null;
    };

    rin.util.extend(rin.contracts.InterpolatedKeyframeESBase, DeepZoomES);

    DeepZoomES.prototypeOverrides = {
        getEmbeddedArtifactsProxy: function (layoutEngine) {
            var provider = this;
            this.updateEA = function () { layoutEngine.render({}); };
            return new function () {
                var tmpRegion = { center: { x: 0, y: 0 }, span: { x: 0, y: 0 } };
                var tmpPoint = new Seadragon.Point();
                this.getEmbeddedArtifactsContainer = function () {
                    return provider._seadragonClipContents;
                };
                this.convertPointToScreen2D = function (inPoint, outPoint) {
                    tmpPoint.x = inPoint.x;
                    tmpPoint.y = inPoint.y;
                    var result = provider._viewer.viewport.pixelFromPoint(tmpPoint, true);
                    outPoint.x = result.x;
                    outPoint.y = result.y;
                    return true;
                };
                this.convertPointToWorld2D = function (inPoint, outPoint) {
                    tmpPoint.x = inPoint.x;
                    tmpPoint.y = inPoint.y;
                    var result = provider._viewer.viewport.pointFromPixel(tmpPoint, true);
                    outPoint.x = result.x;
                    outPoint.y = result.y;
                    return true;
                };
                this.getScreenDimensions = function (r) {
                    r.span.x = provider._userInterfaceControl.clientWidth;
                    r.span.y = provider._userInterfaceControl.clientHeight;
                    r.center.x = r.span.x / 2;
                    r.center.y = r.span.y / 2;
                };

                this.currentNormalizedZoom = function () {
                    return provider._viewer.viewport.getZoom(true);
                };
            };
        },

        // Load and initialize the ES.
        load: function (experienceStreamId) {
            var self = this;
            this.addSliverInterpolator("viewport", function (sliverId, state) {
                return new rin.Ext.Interpolators.linearViewportInterpolator(state);
            });

            DeepZoomES.parentPrototype.load.call(self, experienceStreamId);

            self.setState(rin.contracts.experienceStreamState.buffering); // Set to buffering till the ES is loaded.
            rin.internal.debug.write("Load called for " + self._url);

            self._viewer = new Seadragon.Viewer(self._seadragonContainer);
            self._viewer.clearControls();

            // Raise state transition event anytime the state of the ES has changed, like a pan or zoom.
            self._viewer.addEventListener('animationfinish', function () {
                var playerState = self._orchestrator.getPlayerState();
                if (playerState === rin.contracts.playerState.pausedForExplore || playerState === rin.contracts.playerState.stopped) {
                    self._orchestrator.onESEvent(rin.contracts.esEventIds.stateTransitionEventId, { isUserInitiated: true, transitionState: "completed" });
                }
            });
            
            /// Regex for matching zoom.it urls
            var zoomItMatch = self._url.match(new RegExp("http://(www\\.)?zoom\\.it/(\\w+)\\s*"));

            // Default animation time used for panning and zooming.
            Seadragon.Config.animationTime = 0.5;

            // Function to open the dzi if source is not a zoom.it url.
            function openDzi(dzi) {
                self._viewer.addEventListener('open', function (openedViewer) {
                    self._viewer.addEventListener('animation', function (viewer) { self.raiseViewportUpdate(); });
                    //self._viewer.addEventListener('animationstart', function (viewer) { self.raiseViewportUpdate(); });
                    self._viewer.addEventListener('animationfinish', function (viewer) { self.raiseViewportUpdate(); });
                    
                    self._seadragonElement = self._seadragonContainer.firstChild;
                    self.setState(rin.contracts.experienceStreamState.ready);
                    
                    self._orchestrator.getPlayerRootControl().addEventListener("resize", function () {
                            if (self.getState() === "ready") {
                                self._updateViewportClip(self._viewer);
                                if (self.applyConstraints) openedViewer.viewport.applyConstraints(true);
                            }
                    }, true);
                    self.initTouch();
                    self._updateViewportClip(openedViewer);
                    if (self.applyConstraints) openedViewer.viewport.applyConstraints(true);
                    self.raiseViewportUpdate();
                });

                self._viewer.addEventListener('error', function (openedViewer) {
                    rin.internal.debug.write("Deepzoom ES got into error state.");
                    self.setState(rin.contracts.experienceStreamState.error);
                });

                self._viewer.openDzi(dzi);
            }

            // Function to open a zoom.it url.
            function onZoomitresponseonse(response) {
                if (response.status !== 200) {
                    // e.g. the URL is malformed or the service is down
                    rin.internal.debug.write(response.statusText);
                    self._orchestrator.eventLogger.logErrorEvent("Error in loading deepzoom {0}. Error: {1}", self._url, response.statusText);
                    self.setState(rin.contracts.experienceStreamState.error);
                    return;
                }

                var content = response.content;

                if (content && content.ready) { // Image is ready!!
                    openDzi(content.dzi);
                } else if (content.failed) { // zoom.it couldnt process the image
                    rin.internal.debug.write(content.url + " failed to convert.");
                    self._orchestrator.eventLogger.logErrorEvent("Error in loading deepzoom {0}. Error: {1}", self._url, "failed to convert");
                    self.setState(rin.contracts.experienceStreamState.error);
                } else { // image is still under processing
                    rin.internal.debug.write(content.url + " is " + Math.round(100 * content.progress) + "% done.");
                    self.setState(rin.contracts.experienceStreamState.error);
                }
            }

            if (zoomItMatch) {
                // Using JSONP approach to to load a zoom.it url.
                var imageID = zoomItMatch[2];

                $.ajax({
                    url: "http://api.zoom.it/v1/content/" + imageID,
                    dataType: "jsonp",
                    success: onZoomitresponseonse
                });
            }
            else {
                openDzi(this._url);
            }
        },

        unload: function () {
            this._viewer.unload();
            this.cover.remove();
            this.proxy.remove();
        },

        // Pause the player.
        pause: function (offset, experienceStreamId) {
            DeepZoomES.parentPrototype.pause.call(this, offset, experienceStreamId);
        },
        
        // Apply a keyframe to the ES.
        displayKeyframe: function (keyframeData) {
            if (this.getState() !== rin.contracts.experienceStreamState.ready || !keyframeData.state) return; // Not ready yet, do not attempt to show anything.
            
            if (this.msGesture) {
                this.msGesture.stop();
                this.cover.hide();
            }

            var viewport = keyframeData.state.viewport;
            if (viewport) {
                var rect = new Seadragon.Rect(viewport.region.center.x, viewport.region.center.y, viewport.region.span.x, viewport.region.span.y);
                this._viewer.viewport.fitBounds(rect, true);
            }
        },

        raiseViewportUpdate: function(){
            this._updateViewportClip(this._viewer);
        },

        _updateViewportClip: function (viewer) {
            // Update EAs if present
            if (this.updateEA !== null) this.updateEA();

            // Get pixel coordinates of the DZ image
            var topLeft = viewer.viewport.pixelFromPoint(new Seadragon.Point(0, 0), true);
            var bottomRight = viewer.viewport.pixelFromPoint(new Seadragon.Point(1, viewer.source.height / viewer.source.width), true);
            var panelW = this._userInterfaceControl.clientWidth;
            var panelH = this._userInterfaceControl.clientHeight;

            // Apply viewport clamping
            var percentageAdjustment;
            if (this.viewportClampingMode !== this.viewportClampingOptions.none) {
                var adjOffset = 0;
                if (viewer.source.height <= viewer.source.width) {
                    if (this.viewportClampingMode === this.viewportClampingOptions.all) {
                        percentageAdjustment = panelH / viewer.source.height;
                        var proportionalWidth = viewer.source.width * percentageAdjustment;
                        adjOffset = panelW - proportionalWidth;
                    }
                    Seadragon.Config.minZoomDimension = panelH + (adjOffset > 0 ? adjOffset * viewer.source.height / viewer.source.width : 0);
                } else {
                    if (this.viewportClampingMode === this.viewportClampingOptions.all) {
                        percentageAdjustment = panelW / viewer.source.width;
                        var proportionalHeight = viewer.source.height * percentageAdjustment;
                        adjOffset = panelH - proportionalHeight;
                    }
                    Seadragon.Config.minZoomDimension = panelW + (adjOffset > 0 ? adjOffset * viewer.source.width / viewer.source.height : 0);
                }
            }

            // Apply the clip on the image
            this._seadragonClipContents.style.width = panelW + "px";
            this._seadragonClipContents.style.height = panelH + "px";

            var newLeft = topLeft.x;
            var newTop = topLeft.y;

            var newWidth = bottomRight.x - topLeft.x;
            var newHeight = bottomRight.y - topLeft.y;
            //console.log("nL = " + newLeft + ", nT = " + newTop + ", nW = " + newWidth + ", nH = " + newHeight);

            if (!this.proxy[0].parentNode) {
                var viewerElt = $("#rinplayer").length ? $("#rinplayer") : $("#rinPlayer");
                viewerElt.append(this.proxy);
            }
            this.proxy.data({
                x: newLeft, y: newTop,
                w: newWidth, h: newHeight
            });


            this.old_left = newLeft;
            this.old_top = newTop;
            this.old_width = newWidth;
            this.old_height = newHeight;

            if (newLeft > 0) {
                this._seadragonClip.style.left = newLeft + "px";
                this._seadragonClipContents.style.left = -newLeft + "px";
            }
            else {
                this._seadragonClip.style.left = "0px";
                this._seadragonClipContents.style.left = "0px";
                newLeft = 0;
            }
            if (newTop > 0) {
                this._seadragonClip.style.top = newTop + "px";
                this._seadragonClipContents.style.top = -newTop + "px";
            }
            else {
                this._seadragonClip.style.top = "0px";
                this._seadragonClipContents.style.top = "0px";
                newTop = 0;
            }

            this._seadragonClip.style.width = Math.min(panelW, (bottomRight.x - newLeft)) + "px";
            this._seadragonClip.style.height = Math.min(panelH, (bottomRight.y - newTop)) + "px";

            var pushstate = {
                x: this.old_left, y: this.old_top,
                width: this.old_width, height: this.old_height
            };
            this.viewportChangedEvent.publish(pushstate);
            return pushstate;
        },

        // Handle touch input for zoom and pan.
        touchHandler: function (event, cover) {
            var touches = event.changedTouches,
             first = touches ? touches[0] : { screenX: event.screenX, screenY: event.screenY, clientX: event.clientX, clientY: event.clientY, target: event.target },
             type = "";
            switch (event.type) {
                case "touchstart":
                case "MSPointerDown":
                    type = "mousedown"; cover.show(); break;
                case "touchmove":
                case "MSPointerMove":
                    type = "mousemove"; break;
                case "touchend":
                case "MSPointerUp":
                    type = "mouseup"; this.lastFirst = this.lastSecond = null; cover.hide(); break;
                default: return;
            }

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0, null);

            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
            return false;
        },

        // Initialize touch gestures.
        initTouch: function () {
            var self = this,
                node = self._viewer.drawer.elmt,
                cover = this.cover;

            // set up touch cover
            cover.css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
                'z-index': '100000000000000000000'
            });
            cover.hide();
            $('body').append(cover);

            // If running on IE 10/RT, enable multitouch support.
            if (window.navigator.msPointerEnabled && typeof (MSGesture) !== "undefined") {
                var onmspointerdown = function (e) {
                    self._orchestrator.startInteractionMode();
                    self._orchestrator.onESEvent(rin.contracts.esEventIds.interactionActivatedEventId, null);

                    if (!self.msGesture) {
                        self.msGesture = new MSGesture();
                        self.msGesture.target = node;
                    }

                    self.msGesture.addPointer(e.pointerId);

                    e.stopPropagation();
                    e.preventDefault();

                    cover.show();
                };
                Seadragon.Utils.addEvent(node, "MSPointerDown", onmspointerdown);
                cover[0].addEventListener('MSPointerDown', onmspointerdown, true);

                var onmsgesturechanged = function (e) {
                    self._viewer.viewport.panBy(self._viewer.viewport.deltaPointsFromPixels(new Seadragon.Point(-e.translationX, -e.translationY), true), false);
                    self._viewer.viewport.zoomBy(e.scale, self._viewer.viewport.pointFromPixel(new Seadragon.Point(e.offsetX, e.offsetY), true), false);
                    //if (self.applyConstraints)
                        self._viewer.viewport.applyConstraints(true);
                    e.stopPropagation();
                };
                Seadragon.Utils.addEvent(node, "MSGestureChange", onmsgesturechanged);
                cover[0].addEventListener('MSGestureChange', onmsgesturechanged, true);

                var onmsgestureend = function (e) {
                    if (self.msGesture) self.msGesture.stop();
                    cover.hide();
                };
                Seadragon.Utils.addEvent(node, "MSGestureEnd", onmsgestureend);
                cover[0].addEventListener('MSGestureEnd', onmsgestureend, true);

                var onmsgesturestart = function (e) {
                    e.stopPropagation();
                    cover.show();
                };
                Seadragon.Utils.addEvent(node, "MSGestureStart", onmsgesturestart);
                cover[0].addEventListener('MSGestureStart', onmsgesturestart, true);
            }
            else { // Not IE 10, use normal single touch handlers.
                var handler = function (event) { return self.touchHandler(event, cover); };
                self._userInterfaceControl.addEventListener("touchstart", handler, true);
                self._userInterfaceControl.addEventListener("touchmove", handler, true);
                self._userInterfaceControl.addEventListener("touchend", handler, true);
                self._userInterfaceControl.addEventListener("touchcancel", handler, true);
                cover.on('touchstart', handler);
                cover.on('touchmove', handler);
                cover.on('touchend', handler);
                cover.on('touchcancel', handler);

                self._userInterfaceControl.addEventListener("MSPointerDown", handler, true);
                self._userInterfaceControl.addEventListener("MSPointerMove", handler, true);
                self._userInterfaceControl.addEventListener("MSPointerUp", handler, true);
                cover.addEventListener('MSPointerDown', handler, true);
                cover.addEventListener('MSPointerMove', handler, true);
                cover.addEventListener('MSPointerUp', handler, true);
            }
        },

        // Get an instance of the interaction controls for this ES.
        getInteractionControls: function () {
            var self = this;
            if (!self.interactionControls) { // Check for a cached version. If not found, create one.
                self.interactionControls = document.createElement("div");

                this._orchestrator.getInteractionControls([rin.contracts.interactionControlNames.panZoomControl],
                    function (wrappedInteractionControls) {
                        // Populate the container div with the actual controls.
                        rin.util.assignAsInnerHTMLUnsafe(self.interactionControls, wrappedInteractionControls.innerHTML);
                        // Bind the controls with its view-model.
                        ko.applyBindings(self, self.interactionControls);
                    });
            }

            // Return the cached version or the container div, it will be populated once the interaction control is ready.
            return this.interactionControls;
        },

        // Zoom in to the image by a predefined amount.
        zoomInCommand: function () {
            this._viewer.viewport.zoomBy(1.2, null, false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        // Zoom out from the image by a predefined amount.
        zoomOutCommand: function () {
            this._viewer.viewport.zoomBy(0.8, null, false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        // Pan the image by a predefined amount.
        panLeftCommand: function () {
            this._viewer.viewport.panBy(new Seadragon.Point(-this.panDistance / this._viewer.viewport.getZoom(true), 0), false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        // Pan the image by a predefined amount.
        panRightCommand: function () {
            this._viewer.viewport.panBy(new Seadragon.Point(this.panDistance / this._viewer.viewport.getZoom(true), 0), false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        // Pan the image by a predefined amount.
        panUpCommand: function () {
            this._viewer.viewport.panBy(new Seadragon.Point(0, -this.panDistance / this._viewer.viewport.getZoom(true)), false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        // Pan the image by a predefined amount.
        panDownCommand: function () {
            this._viewer.viewport.panBy(new Seadragon.Point(0, this.panDistance / this._viewer.viewport.getZoom(true)), false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        goHomeCommand: function () {
            this._viewer.viewport.goHome(false);
            if (this.applyConstraints) this._viewer.viewport.applyConstraints(true);
        },
        // Get a keyframe of the current state.
        captureKeyframe: function () {
            if (!this._viewer || !this._viewer.viewport) return "";
            var rect = this._viewer.viewport.getBounds();
            
            return {
                "state": {
                    "viewport": {
                        "region": {
                            "center": {
                                "x": rect.x,
                                "y": rect.y
                            },
                            "span": {
                                "x": rect.width,
                                "y": rect.height
                            }
                        }
                    }
                }
            };
        },

        _viewer: null,
        panDistance: 0.2,
        interactionControls: null,
        applyConstraints: true,
        isExplorable: true,
        viewportClampingOptions: { all: "all", letterbox: "letterbox", none: "none" },
        viewportClampingMode: "none"
    };

    rin.util.overrideProperties(DeepZoomES.prototypeOverrides, DeepZoomES.prototype);
    DeepZoomES.keyframeFormat = "<ZoomableMediaKeyframe Media_Type='SingleDeepZoomImage' Viewport_X='{0}' Viewport_Y='{1}' Viewport_Width='{2}' Viewport_Height='{3}'/>";
    DeepZoomES.elementHtml = "<div style='height:100%;width:100%;position:absolute;background:transparent;pointer-events:none;' tabindex='0'><div class='seadragonClip' style='height:100%;width:100%;position:absolute;background:transparent;left:0px;top:0px;overflow:hidden;pointer-events:auto;' tabindex='0'><div class='seadragonClipContents' style='height:333px;width:600px;position:absolute;'><div class='seadragonContainer' style='height:100%;width:100%;position:absolute;' tabindex='0'></div></div></div></div>";
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.DeepZoomExperienceStream", function (orchestrator, esData) { return new DeepZoomES(orchestrator, esData); });
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.ZoomableMediaExperienceStream", function (orchestrator, esData) { return new DeepZoomES(orchestrator, esData); });
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.ZoomableMediaExperienceStreamV2",
     function (orchestrator, esData) 
     { 
        var resourceUrl = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);
        if(rin.util.endsWith(resourceUrl, ".jpg") || rin.util.endsWith(resourceUrl, ".jpeg") || rin.util.endsWith(resourceUrl, ".png"))
        {
            var factoryFunction = rin.ext.getFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.ImageExperienceStream");
            return factoryFunction(orchestrator, esData);
        }
        else
        {
            return new DeepZoomES(orchestrator, esData); 
        }
     });    
})(rin);
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // ES for playing video clips.
    var VideoES = function (orchestrator, esData) {
        VideoES.parentConstructor.apply(this, arguments);
        var self = this;
        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(VideoES.elementHTML).firstChild;
        this._video = this._userInterfaceControl;
        this._esData = esData;

        this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);

        // Handle any interaction on the video and pause the player.
        $(this._userInterfaceControl).bind("mousedown", function (e) {
            self._orchestrator.pause();
        });
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, VideoES);

    VideoES.prototypeOverrides = {
        // Load and initialize the video.
        load: function (experienceStreamId) {
            // Call load on parent to init the keyframes.
            VideoES.parentPrototype.load.call(this, experienceStreamId);
            if (!this._url) throw new Error("Video source not found!");

            var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
            if (isIOS) {
                this._orchestrator.eventLogger.logErrorEvent("Video is not supported in safari since it cannot be programmatically started. Disabling video ES: " + experienceStreamId);
                this._userInterfaceControl.innerHTML = "";
                this.setState(rin.contracts.experienceStreamState.error);
                return;
            }

            var self = this;

            // Load any video trim data.
            if (self._esData.data.markers) {
                self._startMarker = self._esData.data.markers.beginAt;
            }

            // Set to buffering till the load is complete.
            this.setState(rin.contracts.experienceStreamState.buffering);
            rin.internal.debug.write("Load called for " + this._url);

            // Handle any errors while loading the video.
            this._video.onerror = function (error) {
                var errorString = "Video failed to load. Error: " + (self._video.error ? self._video.error.code : error) + "<br/>Url: " + self._url;
                var esInfo = self._orchestrator.debugOnlyGetESItemInfo();
                if (esInfo) {
                    errorString += "<br/>ES Info: {0}:{1} <br/>Lifetime {2}-{3}".rinFormat(esInfo.providerName, esInfo.id,
                    esInfo.beginOffset, esInfo.endOffset);
                }
                self._orchestrator.eventLogger.logErrorEvent(errorString);
                self.setState(rin.contracts.experienceStreamState.error);
            };

            // Handle load complete of the video.
            this._video.oncanplay = function () {
                rin.internal.debug.write("oncanplay called from " + self._url);
                if (self._desiredVideoPositon >= 0 && Math.abs(self._video.currentTime * 1000 - self._desiredVideoPositon) > 10) {
                    self._seek(self._desiredVideoPositon);
                    self._desiredVideoPositon = -1;
                }
            };

            // Handle ready state change and change the ES state accordingly.
            this._video.onreadystatechange = function (args) {
                var state = self._video.state();
                self.readyStateCheck();
            };

            // Constantly check for the state of the video to mointor buffering start and stop.
            this.readyStateCheck = function () {
                var state = self.getState();

                if (state === rin.contracts.experienceStreamState.ready || state === rin.contracts.experienceStreamState.error) return;

                if (self._video.readyState === self.CONST_READY_STATE) {
                    self.setState(rin.contracts.experienceStreamState.ready);
                }
                else {
                    self.setState(rin.contracts.experienceStreamState.buffering);
                    setTimeout(self.readyStateCheck, 500);
                }
            };

            // set video source
            var baseUrl = (this._url.substr(0, this._url.lastIndexOf('.')) || this._url) + ".";
            for (var i = 0; i < this._supportedFormats.length; i++) {
                var srcElement = document.createElement("source");
                srcElement.setAttribute("type", this._supportedFormats[i].type);
                srcElement.setAttribute("src", baseUrl + this._supportedFormats[i].ext);
                this._video.appendChild(srcElement);
            }

            this.readyStateCheck();
        },
        // Unload the video.
        unload: function () {
            try {
                this._video.pause();
                var srcElements = this._video.getElementsByTagName("source");
                for (var i = srcElements.length - 1; i >= 0; i--) {
                    var srcElement = srcElements[i];
                    srcElement.parentNode.removeChild(srcElement);
                }
                this._video.removeAttribute("src");
                this._video.load(); //As per Best practices  - http://dev.w3.org/html5/spec-author-view/video.html#best-practices-for-authors-using-media-elements
            }
            catch (e) {
                rin.internal.debug.assert(!e);
            }
        },
        // Play the video.
        play: function (offset, experienceStreamId) {
            try {
                var epsilon = 0.05; // Ignore minute seeks.
                if (Math.abs(this._video.currentTime - (this._startMarker + offset)) > epsilon) {
                    this._seek(offset, experienceStreamId);
                }
                this._updateMute();
                this._video.play();
            } catch (e) { rin.internal.debug.assert(false, "exception at video element " + e.Message); }
        },
        // Pause the video.
        pause: function (offset, experienceStreamId) {
            try {
                var epsilon = 0.05; // Ignore minute seeks.
                if (Math.abs(this._video.currentTime - (this._startMarker + offset)) > epsilon) {
                    this._seek(offset, experienceStreamId);
                }
                this._video.pause();
            } catch (e) { rin.internal.debug.assert(false, "exception at video element " + e.Message); }
        },
        // Set the base volume for the ES. This will get multiplied with the keyframed volume to get to the final applied volume.
        setVolume: function (baseVolume) {
            this._baseVolume = baseVolume;
            this._video.volume = this._baseVolume * this._getKeyframeVolume(this._lastKeyframe);
        },
        // Mute or Unmute the audio.
        setIsMuted: function (value) {
            this._updateMute();
        },

        onESEvent: function (sender, eventId, eventData) {
            if (eventId === rin.contracts.esEventIds.playerConfigurationChanged) {
                this._updateMute();
            }
            else if (eventId === rin.contracts.esEventIds.popupDisplayEvent) {
                this._updateMute();
            }
        },

        // Handle seeking of video.
        _seek: function (offset, experienceStreamId) {
            offset += this._startMarker;

            // See if the video element is ready.
            if (this._video.readyState === this.CONST_READY_STATE) {

                // In IE, video cannot seek before its initialTime. This property doesn't exist in Chrome.
                if (this._video.initialTime) {
                    offset = Math.max(offset, this._video.initialTime);
                }

                // See if we can seek to the specified offset.
                if (this._video.seekable) {
                    for (var i = 0; i < this._video.seekable.length; i++) {
                        if (this._video.seekable.start(i) <= offset && offset <= this._video.seekable.end(i)) {
                            this._video.currentTime = offset;
                            return;
                        }
                    }
                }
                this._desiredVideoPositon = offset;
            }
            else {
                this._desiredVideoPositon = offset;
            }
        },
        _getKeyframeVolume: function (keyframe) {
            if (keyframe && keyframe.state && keyframe.state.sound) {
                return keyframe.state.sound.volume;
            }
            else if (keyframe && keyframe.data && keyframe.data["default"]) {
                var data = rin.internal.XElement(keyframeData.data["default"]);
                if (data) return parseFloat(curData.attributeValue("Volume"));
            }
            return 1;
        },
        _setAudioVolume: function (value) {
            var volume = Math.min(1, Math.max(0, value) * this._baseVolume);
            this._video.volume = volume;
        },
        _updateMute: function () {
            var playerConfiguration = this._orchestrator.getPlayerConfiguration();
            this._video.muted = playerConfiguration.isMuted || this._orchestrator.activePopup;
        },
        CONST_READY_STATE: 4,
        _desiredVideoPositon: -1, // Seek location in case the video is not buffered or loaded yet at the location.
        _url: null,
        _baseVolume: 1, // Volume from orchestrator.
        _startMarker: 0, // Start trim position for the video.
        _interactionControls: null,
        // List of formats supported by the ES. Browser will pick the first one which it supports.
        // All the below sources are added to the Video tag irrespective of the source file format.
        _supportedFormats : [
            { ext: "webm", type: "video/webm" },
            { ext: "mp4", type: "video/mp4" },
            { ext: "ogv", type: "video/ogg; codecs=\"theora, vorbis\"" }
        ]
    };

    VideoES.elementHTML = "<video style='height:100%;width:100%;position:absolute' preload='auto'>Sorry, Your browser does not support HTML5 video.</video>";
    rin.util.overrideProperties(VideoES.prototypeOverrides, VideoES.prototype);
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.VideoExperienceStream", function (orchestrator, esData) { return new VideoES(orchestrator, esData); });
})(rin);

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // Code audio es to provide background as well as foreground audio.
    var AudioES = function (orchestrator, esData) {
        AudioES.parentConstructor.apply(this, arguments);
        this._orchestrator = orchestrator;

        this._userInterfaceControl = rin.util.createElementWithHtml(AudioES.elementHTML);
        this._audio = this._userInterfaceControl.firstChild;
        this._esData = esData;

        this._isBackgroundAudioMode = this._esData && this._esData.data && this._esData.data.markers && this._esData.data.markers.isBackgroundAudioMode;
        if (this._isBackgroundAudioMode) {
            this._audio.loop = true;
        }

        var esBaseVolume = (this._esData.data.markers && this._esData.data.markers.baseVolume) || 1;
        if (typeof esBaseVolume === "number") {
            this._esBaseVolume = esBaseVolume < 0 ? 0 : esBaseVolume > 1 ? 1 : esBaseVolume;
        }

        var pauseVolumeDefault = this._isBackgroundAudioMode ? this._esBaseVolume : 0;
        var pauseVolume = (this._esData.data.markers && this._esData.data.markers.pauseVolume) || pauseVolumeDefault;
        if (typeof pauseVolume === "number") {
            this._pauseVolume = pauseVolume < 0 ? 0 : pauseVolume > 1 ? 1 : pauseVolume;
        }

        this._desiredAudioPosition = -1;

        this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, AudioES);

    AudioES.prototypeOverrides = {
        // Load and initialize the ES.
        load: function (experienceStreamId) {
            // Call load on parent to init the keyframes.
            AudioES.parentPrototype.load.call(this, experienceStreamId);

            if (!this._url) throw new Error("Audio source not found!");

            var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
            if (isIOS) {
                this._orchestrator.eventLogger.logErrorEvent("Audio is not supported in safari since it cannot be programmatically started. Disabling audio ES: " + experienceStreamId);
                this._userInterfaceControl.innerHTML = "";
                this.setState(rin.contracts.experienceStreamState.error);
                return;
            }

            var self = this;
            // Set to buffering till the audio is loaded.
            this.setState(rin.contracts.experienceStreamState.buffering);
            rin.internal.debug.write("Load called for " + this._url);

            // Handle any error while loading audio.
            this._audio.onerror = function (errorString) {
                var errorStr = "Audio failed to load. Error: " + (self._audio.error ? self._audio.error.code : error) + "<br/>Url: " + self._url,
                    esInfo = self._orchestrator.debugOnlyGetESItemInfo();
                if (esInfo) {
                    errorStr += "<br/>ES Info: {0}:{1} <br/>Lifetime {2}-{3}".rinFormat(esInfo.providerName, esInfo.id,
                    esInfo.beginOffset, esInfo.endOffset);
                }
                self._orchestrator.eventLogger.logErrorEvent(errorStr);
                self.setState(rin.contracts.experienceStreamState.error);
            };
            //this._audio.onsuspend = function (args) {
            //    // do nothing for now
            //};
            //this._audio.onabort = function (args) {
            //    // do nothing for now
            //};
            this._audio.onstalled = function (args) {
                // Not dead / real error yet, but something is probably wrong
                console.log("STALLED STALLED STALLED STALLED STALLED!!!!!");
            };

            // Handle load complete of audio.
            this._audio.addEventListener("canplaythrough", function () {
                rin.internal.debug.write("oncanplay called from " + self._url);
                self.setState(rin.contracts.experienceStreamState.ready);
                if (self._desiredAudioPosition >= 0 && Math.abs(self._audio.currentTime - self._desiredAudioPosition) > 0.01 /*epsilon*/) {
                    self._seekAudio(self._desiredAudioPosition);
                    self._desiredAudioPosition = -1;
                }
            });

            // Handle running out of audio to play during playback
            var isWaitingOver = function () {
                if (self._audio.readyState >= 3) {
                    self.setState(rin.contracts.experienceStreamState.ready);
                    if (self._desiredAudioPosition >= 0 && Math.abs(self._audio.currentTime - self._desiredAudioPosition) > 0.01 /*epsilon*/) {
                        self._seekAudio(self._desiredAudioPosition);
                        self._desiredAudioPosition = -1;
                    }
                } else {
                    setTimeout(isWaitingOver, 5);
                }
            };
            this._audio.onwaiting = function () {
                rin.internal.debug.write("onwaiting called from " + self._url);
                self.setState(rin.contracts.experienceStreamState.buffering);
                isWaitingOver();
            };

            // RL: got rid of this, timeout check is completely unnecessary
            // Constantly check if the audio is ready and update the state as necessary.
            //this.readyStateCheck = function () {
            //    console.log("AUDIO LOADING IN AUDIOES");
            //    var state = self.getState();
            //    if ((self._isMediaLoaded && state == rin.contracts.experienceStreamState.ready) || state == rin.contracts.experienceStreamState.error) return;

            //    if (self._audio.readyState === self.const_ready_state) {
            //        if (!self._isMediaLoaded){
            //            self._isMediaLoaded = true;
            //            self.setState(rin.contracts.experienceStreamState.ready);
            //            self._startBackgroundAudioOnReady();
            //        }
            //    }
            //    else {
            //        if (!self._isBackgroundAudioMode) self.setState(rin.contracts.experienceStreamState.buffering);
            //        setTimeout(self.readyStateCheck, 250);
            //    }
            //}

            // Set audio sources with all supported formats
            var baseUrl = (this._url.substr(0, this._url.lastIndexOf('.')) || this._url) + ".";
            for (var i = 0; i < this._supportedFormats.length; i++) {
                var srcElement = document.createElement("source");
                srcElement.setAttribute("type", this._supportedFormats[i].type);
                srcElement.setAttribute("src", baseUrl + this._supportedFormats[i].ext);
                this._audio.appendChild(srcElement);
            }
            this._audio.load();

            //if (this._isBackgroundAudioMode) {
            //    self.setState(rin.contracts.experienceStreamState.ready);
            //}

            //this.readyStateCheck();
        },
        // Unload the ES.
        unload: function () {
            console.log("AUDIO UNLOAD CALLED");
            try {
                this._audio.pause();
                var srcElements = this._audio.getElementsByTagName("source");
                for (var i = srcElements.length - 1; i >= 0; i--) {
                    var srcElement = srcElements[i];
                    srcElement.parentNode.removeChild(srcElement);
                }
                this._audio.removeAttribute("src");
                this._audio.load(); //As per Best practices  - http://dev.w3.org/html5/spec-author-view/video.html#best-practices-for-authors-using-media-elements
            } catch (e) { rin.internal.debug.assert(!e);} // Ignore errors on unload.
        },
        // Play from the given offset.
        play: function (offset, experienceStreamId) {
            console.log("Audio play, " + this._esData.experienceId + ', time: ' + offset);

            try {
                this._updateMute();
                this._playPauseActionCount++;
                if (offset <= this._audio.duration) {
                    this._seekAudio(offset);
                    this._audio.play();
                } else {
                    this._audio.pause();
                }
            } catch (e) {
                rin.internal.debug.assert(false, "exception at audio element " + e.Message);
            }

            // Call play on parent to maintain keyframe integrity.
            AudioES.parentPrototype.play.call(this, offset, experienceStreamId);
        },
        // Pause at the given offset.
        pause: function (offset, experienceStreamId) {
            try {
                this._playPauseActionCount++;
                this._audio.pause();
                this._seekAudio(offset);
            } catch (e) {
                rin.internal.debug.assert(false, "exception at audio element " + e.Message);
            }

            // Call pause on parent to maintain keyframe integrity.
            AudioES.parentPrototype.pause.call(this, offset, experienceStreamId);
        },
        // Set the base volume for the ES. This will get multiplied with the keyframed volume to get to the final applied volume.
        setVolume: function (baseVolume) {
            this._orchestratorVolume = baseVolume;
            var effectiveVolume = this._computeEffectiveVolume();
            this._audio.volume = Math.min(1, Math.max(0, effectiveVolume));
            //this._animateVolume(this.const_animation_time, effectiveVolume);
            console.log("effective volume = " + effectiveVolume);
        },

        // Mute or Unmute the audio.
        setIsMuted: function (value) {
            this._updateMute();
        },

        onESEvent: function (sender, eventId, eventData) {
            if (eventId === rin.contracts.esEventIds.playerConfigurationChanged) {
                this._updateMute();
            }
            else if (eventId === rin.contracts.esEventIds.popupDisplayEvent) {
                if (eventData && eventData.displayed && eventData.hasAudio) {
                    this._animateVolume(this.const_animation_time, 0);
                }
                else if (eventData && eventData.displayed === false && eventData.hasAudio) {
                    var effectiveVolume = this._computeEffectiveVolume();
                    this._animateVolume(this.const_animation_time, effectiveVolume);
                }
            }
        },

        _startBackgroundAudioOnReady: function(){
            if (!this._isBackgroundAudioMode) return;

            //TODO: After everest, pass right offset and screenplayId to play/pause methods.
            if (this._orchestrator.getPlayerState() === rin.contracts.playerState.playing) {
                this.play();
            }
            else {
                this.pause();
            }
        },

        // Seek to a position in the audio.
        _seekAudio: function (offset) {
            var epsilon = 0.4; // Ignore minute seeks.
            var debug = this._audio.currentTime;
            if (Math.abs(this._audio.currentTime - offset) < epsilon) return;

            // See if the video element is ready.
            if (this._isBackgroundAudioMode || offset <= this._audio.duration) {
                if (this._audio.readyState >= 1) { // 1 is metadata state
                    // In IE, video cannot seek before its initialTime. This property doesn't exist in Chrome.
                    if (this._audio.initialTime) {
                        offset = Math.max(offset, this._audio.initialTime);
                    }


                    rin.internal.debug.assert(this._audio.seekable);
                    // See if we can seek to the specified offset.
                    var didSeek = false;
                    if (this._audio.seekable) {
                        for (var i = 0; i < this._audio.seekable.length; i++) {
                            if (this._audio.seekable.start(i) <= offset && offset <= this._audio.seekable.end(i)) {
                                this._audio.currentTime = offset;
                                didSeek = true;
                                break;
                            }
                        }
                    }
                    if (!didSeek) {
                        this._desiredAudioPosition = offset;
                    }
                }
                else {
                    this._desiredAudioPosition = offset;
                }
            }
        },
        // Apply/Interpolate to a keyframe.
        displayKeyframe: function (keyframeData, nextKeyframeData, interpolationOffset) {
            var currentKeyframeVolume, nextKeyframeVolume = null;

            // Load current keyframe.
            if (keyframeData) {
                currentKeyframeVolume = this._getKeyframeVolume(keyframeData);

                // start volume interpolation to next key volume if one is present.
                if (nextKeyframeData) {
                    nextKeyframeVolume = this._getKeyframeVolume(nextKeyframeData);
                    var keyframeDuration = nextKeyframeData.offset - keyframeData.offset;
                    var animation = new rin.internal.DoubleAnimation(keyframeDuration, currentKeyframeVolume, nextKeyframeVolume);
                    currentKeyframeVolume = animation.getValueAt(interpolationOffset);
                    this._audio.volume = this._computeEffectiveVolume(currentKeyframeVolume);
                    this._animateVolume(keyframeDuration - interpolationOffset, this._computeEffectiveVolume(nextKeyframeVolume));
                }
                else {
                    this._audio.volume = this._computeEffectiveVolume(currentKeyframeVolume);
                }
            }
        },

        _getKeyframeVolume:function(keyframe){
            if (keyframe && keyframe.state && keyframe.state.sound) {
                return keyframe.state.sound.volume;
            }
            else if (keyframe && keyframe.data && keyframe.data["default"]) {
                var data = rin.internal.XElement(keyframeData.data["default"]);
                if (data) return parseFloat(curData.attributeValue("Volume"));
            }
            return 1;
        },

        _getCurrentKeyframeVolume: function () {
            // TODO: narend: Post everest, convert base to use continuous interpolation and return current interpolated value.
            return 1;
        },

        _computeEffectiveVolume: function (multiplicationFactor) {
            return this._orchestratorVolume * this._getCurrentKeyframeVolume() * ((typeof multiplicationFactor === "number") ? multiplicationFactor: 1);
        },

        // Interpolate volume for smooth fade in and out.
        _animateVolume: function (animationTime, targetVolume, onComplete) {
            if (this._activeVolumeAnimation !== null) {
                this._activeVolumeAnimation.stop();
                this._activeVolumeAnimation = null;
            }

            if (Math.abs(this._audio.volume - targetVolume) <= 0.02 /*epsilon*/) {
                if (onComplete) onComplete();
                return;
            }

            var self = this;
            var volumeAnimation = new rin.internal.DoubleAnimation(animationTime, this._audio.volume, targetVolume);
            var volumeAnimationStoryboard = new rin.internal.Storyboard(
                volumeAnimation,
                function (value) {
                    self._audio.volume = Math.min(1, Math.max(0, value));
                },
                function () {
                    self._activeVolumeAnimation = null;
                    if (onComplete) onComplete();
                });

            volumeAnimationStoryboard.begin();
            this._activeVolumeAnimation = volumeAnimationStoryboard;
        },
        _updateMute: function(){
            var playerConfiguration = this._orchestrator.getPlayerConfiguration();
            var isMuted = playerConfiguration.isMuted || (playerConfiguration.activePopup && playerConfiguration.activePopup.hasAudio)
                || (this._isBackgroundAudioMode && playerConfiguration.isMusicMuted) || (!this._isBackgroundAudioMode && playerConfiguration.isNarrativeMuted);
            this._audio.muted = !!isMuted;
        },
        const_ready_state: 4,
        const_animation_time: 0,
        _desiredAudioPosition: -1, // Store audio seek location in case of audio is not yet ready.
        _url: null,
        _activeVolumeAnimation: null, // storyboard of an active volume interpolation.
        _orchestratorVolume: 1, // volume from orchestrator.
        _pauseVolume: 0, // volume during pause
        _esBaseVolume: 1, // base volume set at the ES level
        _startMarker: 0, // trim start of the audio clip.
        _playPauseActionCount: 0,
        _interactionControls: null,
        _isBackgroundAudioMode: false,
        _isMediaLoaded: false,
        // List of formats supported by the ES. Browser will pick the first one which it supports.
        // All the below sources are added to the Audio tag irrespective of the source file format.
        _supportedFormats : [
            { ext: "ogg", type: "audio/ogg; codecs=\"theora, vorbis\"" },
            { ext: "mp3", type: "audio/mpeg" },
            { ext: "mp4", type: "audio/mp4" },
            { ext: "aac", type: "audio/aac" },
            { ext: "wav", type: "audio/wav" }
        ]
    };

    AudioES.elementHTML = "<audio style='height:0;width:0' preload='auto'>Sorry, Your browser does not support HTML5 audio.</audio>";
    rin.util.overrideProperties(AudioES.prototypeOverrides, AudioES.prototype);
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.AudioExperienceStream", function (orchestrator, esData) { return new AudioES(orchestrator, esData); });
})(rin);
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />
/// <reference path="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"/>

window.rin = window.rin || {};

(function (rin) {
    // ES for displaying bing maps.
    var MapES = function (orchestrator, esData) {
        MapES.parentConstructor.apply(this, arguments);
        var self = this;

        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(MapES.elementHtml).firstChild;
        this._esData = esData;

        this._userInterfaceControl.addEventListener('mousedown', function () {
            self._orchestrator.startInteractionMode();
        }, true);
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, MapES);

    MapES.prototypeOverrides = {
        _initMap: function (experienceStreamId) {
            // Create the map control.
            var mapOptions = {
                credentials: "AnEde1n9Se4JmFkyw76VxdSkFfSMm5bUaT1qp5ClQDw65KEtLsG0uyXWYtzWobgk",
                mapTypeId: Microsoft.Maps.MapTypeId.road,
                labelOverlay: Microsoft.Maps.LabelOverlay.hidden,
                enableClickableLogo: false,
                enableSearchLogo: false,
                showDashboard: false,
                showScalebar: false,
                showCopyright: false,
                backgroundColor: new Microsoft.Maps.Color(0, 0, 0, 0)
            };

            this._map = new Microsoft.Maps.Map(this._userInterfaceControl, mapOptions);

            // Use the base class to load the keyframes and seek to experienceStreamId.
            MapES.parentPrototype.load.call(this, experienceStreamId);

            // Set the state to Ready.
            this.setState(rin.contracts.experienceStreamState.ready);
        },
        load: function (experienceStreamId) {
            var self = this;
            if (window.MSApp && WinJS) {
                // Create the map control.
                Microsoft.Maps.loadModule('Microsoft.Maps.Map', {
                    callback: function () {
                        self._initMap(experienceStreamId);
                    },
                    culture: "en-us",
                    homeRegion: "US"
                });
            }
            else {
                this._initMap(experienceStreamId);
            }
        },
        unload: function () {
            MapES.parentPrototype.unload.call(this);
            if (typeof this._map != 'undefined' && this._map != null) {
                this._map.dispose();
                this._map = null;
            }
        },
        displayKeyframe: function (keyframeData) {
            if (keyframeData.state.viewport && keyframeData.state.viewport.region) {
                var viewOptions = { animate: true };
                var north = (keyframeData.state.viewport.region.center.y * 2 + keyframeData.state.viewport.region.span.y) / 2;
                var west = (keyframeData.state.viewport.region.center.x * 2 - keyframeData.state.viewport.region.span.x) / 2
                var south = (keyframeData.state.viewport.region.center.y * 2 - keyframeData.state.viewport.region.span.y) / 2;
                var east = (keyframeData.state.viewport.region.center.x * 2 + keyframeData.state.viewport.region.span.x) / 2;
                viewOptions.bounds = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(north, west), new Microsoft.Maps.Location(south, east));
            }            
            if (keyframeData.state.map && keyframeData.state.map.style) {
                var mapStyle = keyframeData.state.map.style;
                switch (mapStyle) {
                    case "Road":
                        viewOptions.mapTypeId = Microsoft.Maps.MapTypeId.road;
                        break;
                    case "Aerial":
                        // TODO: Switch labels off.
                        viewOptions.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
                        break;
                    case "AerialWithLabels":
                        // TODO: Switch labels on.
                        viewOptions.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
                        break;
                    case "Vector":
                        // TODO: Hide the default map tile layer.
                        viewOptions.mapTypeId = Microsoft.Maps.MapTypeId.road;
                        break;
                }
            }

            // [Aldo] There is some issue with the way we are organizing the div's i guess, in IE9, map keyframes are not rendered properly.
            //        Below changes in height and width is a hack to fix the issue. This makes the browser relayout the divs and it works fine.
            this._userInterfaceControl.style["height"] = "99.9999%";
            this._userInterfaceControl.style["width"] = "99.9999%";
            var self = this;
            setTimeout(function () {
                self._userInterfaceControl.style["height"] = "100%";
                self._userInterfaceControl.style["width"] = "100%";
                self._map.setView(viewOptions);
            }, 1);
        },

        // Pan the map by the given distance and direction.
        panBy: function (x, y) {
            var bounds = this._map.getBounds();
            var pixelCenter = this._map.tryLocationToPixel(bounds.center);
            pixelCenter.x += x;
            pixelCenter.y += y;

            var options = this._map.getOptions();
            options.center = this._map.tryPixelToLocation(pixelCenter);
            options.zoom = this._map.getZoom();
            this._map.setView(options);
        },

        // Zoom in to the Map.
        zoomInCommand: function () {
            var options = this._map.getOptions();
            options.zoom = this._map.getZoom() + 1;
            this._map.setView(options);
        },

        // Zoom out from the Map.
        zoomOutCommand: function () {
            var options = this._map.getOptions();
            options.zoom = this._map.getZoom() - 1;
            this._map.setView(options);
        },

        // Methods to pan the map.
        panLeftCommand: function () {
            this.panBy(-this._panDistance, 0);
        },
        panRightCommand: function () {
            this.panBy(this._panDistance, 0);
        },
        panUpCommand: function () {
            this.panBy(0, -this._panDistance);
        },
        panDownCommand: function () {
            this.panBy(0, this._panDistance);
        },
        // Get interaction controls for Map.
        getInteractionControls: function () {
            var self = this;
            if (!self._interactionControls) {
                self._interactionControls = document.createElement("div");

                self._orchestrator.getInteractionControls([rin.contracts.interactionControlNames.panZoomControl],
                    function (wrappedInteractionControls) {
                        rin.util.assignAsInnerHTMLUnsafe(self._interactionControls, wrappedInteractionControls.innerHTML);
                        ko.applyBindings(self, self._interactionControls);
                    });
            }

            return self._interactionControls;
        },
        captureKeyframe: function () {
            // Set the state to Ready.
            if (this._map === null) return;
            var bounds = this._map.getBounds(),
                north = bounds.getNorth(),
                south = bounds.getSouth(),
                east = bounds.getEast(),
                west = bounds.getWest(),
                mapTypeId = this._map.getMapTypeId(), mapType;
            switch (mapTypeId) {
                case Microsoft.Maps.MapTypeId.road:
                    mapType = "Road";
                    break;
                case Microsoft.Maps.MapTypeId.aerial:
                    // TODO: Switch labels off.
                    mapType = "Aerial";
                    break;
                case Microsoft.Maps.MapTypeId.aerial:
                    // TODO: Switch labels on.
                    mapType = "AerialWithLabels";
                    break;
                case Microsoft.Maps.MapTypeId.auto:
                    mapType = "Auto";
                    break;
                case Microsoft.Maps.MapTypeId.birdseye:
                    mapType = "BirdsEye";
                    break;
                case Microsoft.Maps.MapTypeId.collinsBart:
                    mapType = "CollinsBart";
                    break;
                case Microsoft.Maps.MapTypeId.mercator:
                    mapType = "Mercator";
                    break;
                case Microsoft.Maps.MapTypeId.ordnanceSurvey:
                    mapType = "OrdnanceSurvey";
                    break;
            }
            
            return {
                "state": {
                    "viewport": {
                        "region": {
                            "center": {
                                "x": (east + west)/2,
                                "y": (north + south)/2
                            },
                            "span": {
                                "x": (east - west),
                                "y": (north - south)
                            }
                        }
                    },
                    "map": {
                        "style" : mapType
                    }
                }
            };
        },

        isExplorable: true,
        _panDistance: 100, // default pan distance
        _interactionControls: null,
        _map: null
    };

    MapES.elementHtml = "<div style='height:100%;width:100%;position:absolute;background:black;'></div>";
    rin.util.overrideProperties(MapES.prototypeOverrides, MapES.prototype);
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.MapExperienceStream", function (orchestrator, esData) { return new MapES(orchestrator, esData); });
})(rin);
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

rin.PhotosynthES = function (orchestrator, esData) {
    this.stateChangedEvent = new rin.contracts.Event();
    this._orchestrator = orchestrator;
    this._userInterfaceControl = rin.util.createElementWithHtml(rin.PhotosynthES.elementHTML);
    this._esData = esData;
};

rin.PhotosynthES.prototype = {
    load: function (experienceStreamId) {
        this.setState(rin.contracts.experienceStreamState.ready);
    },
    play: function (offset, experienceStreamId) {
    },
    pause: function (offset, experienceStreamId) {
    },
    unload: function () {

    },
    getState: function () {
        return this._state;
    },
    setState: function (value) {
        if (this._state == value) return;
        var previousState = this._state;
        this._state = value;
        this.stateChangedEvent.publish(new rin.contracts.ESStateChangedEventArgs(previousState, value, this));
    },
    stateChangedEvent: new rin.contracts.Event(),
    getUserInterfaceControl: function () { return this._userInterfaceControl; },

    _userInterfaceControl: rin.util.createElementWithHtml(""),
    _orchestrator: null,
    _esData: null
};

rin.PhotosynthES.elementHTML = "<div style='width:100%;height:100%;color:white;font-size:24px'>Photosynth ES Placeholder: This is placeholder ES until we get HTML5 version...</div>";

rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.PhotosynthExperienceStream", function (orchestrator, esData) { return new rin.PhotosynthES(orchestrator, esData); });
rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.PhotosynthES", function (orchestrator, esData) { return new rin.PhotosynthES(orchestrator, esData); });

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};
(function (rin) {
    // ES for displaying 360 degree panoramas.
    var PanoramicES = function (orchestrator, esData) {
        PanoramicES.parentConstructor.apply(this, arguments);
        var self = this;
        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(PanoramicES.elementHTML).firstChild;
        this._panoPlaceHolder = $(".panoHolder", this._userInterfaceControl)[0];

        this._panoHintTimeoutId = null;
        this._panoHint = $(this._userInterfaceControl).find('.panoHint');

        this._esData = esData;
        this._esData.data = this._esData.data || {};

        this._skipPanoHint = false;

        if (!isLowEndMachine && typeof esData.data.showLowerFidelityWhileMoving != "undefined") {
            // Always use low fidility images while moving if running on iPad or Surface RT
            var isLowEndMachine = window.navigator.userAgent.indexOf("iPad;") > -1 || window.navigator.userAgent.indexOf("ARM;") > -1;
            if (!isLowEndMachine)
                this._lowFidilityWhileMoving = esData.data.showLowerFidelityWhileMoving;
        }

        if (typeof esData.data.maxPixelScaleFactor != "undefined")
            this._maxPixelScaleFactor = esData.data.maxPixelScaleFactor;

        if (typeof esData.data.interpolatorType != "undefined")
            this._interpolatorType = esData.data.interpolatorType;
        else
            this._interpolatorType = "linear";

        if (typeof esData.data.enforceViewLimits != "undefined")
            this._enforceViewLimits = esData.data.enforceViewLimits;

        if ((typeof esData.data.smoothTransitions != "undefined") && esData.data.smoothTransitions)
            this.overrideTransientTrajectoryFunction = true;

        if (typeof esData.data.viewShrinkFactor != "undefined")
            this._viewShrinkFactor = esData.data.viewShrinkFactor;

        if (typeof esData.data.transitionDurationOverrides != "undefined") {
            this._durationScaleOverride = esData.data.transitionDurationOverrides.durationScaleOverride;
            this._transitionPauseDurationInSec = esData.data.transitionDurationOverrides.transitionPauseDurationInSec;
            if (typeof esData.data.transitionDurationOverrides.simplePathOnly != "undefined")
            {
                this._simplePathOnly = esData.data.transitionDurationOverrides.simplePathOnly;
            }
        }

        // Load the defaults for adaptive transitions
        var adaptiveDataOverride = this._orchestrator.getResourceResolver().resolveData("R-DefaultAdaptiveTransitionProfile", this._esData.id);
        if (adaptiveDataOverride)
        {
            if (adaptiveDataOverride.durationScaleOverride != undefined) {
                this._adaptiveDurationScaleOverride = adaptiveDataOverride.durationScaleOverride;
            }
            if (adaptiveDataOverride.capAdaptiveOffset != undefined) {
                this._capAdaptiveOffset = adaptiveDataOverride.capAdaptiveOffset;
            }
            if (adaptiveDataOverride.maxAdaptiveDuration != undefined) {
                this._maxAdaptiveDuration = adaptiveDataOverride.maxAdaptiveDuration;
            }
            else
                this._maxAdaptiveDuration = -1;
        }


        this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);

        // Check for any interactions on the ES and pause the player.
        // Clicking on EAs cause mousedown and interaction mode to start. Ignore mousedown for now.
        $(this._panoPlaceHolder).bind("MSPointerDown mousedown mousewheel", function (e) {
            //Code to get the world coordinates for a mouse location
            //Don't delete
            //if (self._viewer && self._tryCalculate) {
            //    var temp = self.getEmbeddedArtifactsProxy();
            //    var pointInWorld = { };
            //    var pointInScreen = {
            //        x: e.screenX,
            //        y: e.screenY
            //    };
            //    temp.convertPointToWorld2D(pointInScreen, pointInWorld);
            //    alert("X: " + pointInWorld.x + " y:" + pointInWorld.y);
            //}
            
            if (self._isInResumeFromMode)
                return;

            self._panoHint.fadeOut(250);
            if (self._panoHintTimeoutId) {
                clearTimeout(self._panoHintTimeoutId);
                self._panoHintTimeoutId = null;
            }

            self._orchestrator.startInteractionMode();
            self._userInterfaceControl.focus();
        });
        
        
        //Set up defaultKeyframe
        this._esData.data.defaultKeyframe = this._esData.data.defaultKeyframe || {
            "state": {
                "viewport": {
                    "region": {
                        "center": {
                            "x": 1,
                            "y": 0.1
                        },
                        "span": {
                            "x": 0,
                            "y": 0.6
                        }
                    }
                }
            },
            offset: 0
        };
        this._esData.data.defaultKeyframe.offset = 0; //In case it was not set already
        this.updateEA = null;
    };

    rin.util.extend(rin.contracts.InterpolatedKeyframeESBase, PanoramicES);

    PanoramicES.prototypeOverrides = {
        // Load and initialize the ES.
        load: function (experienceStreamId) {
            var self = this;

            this.addSliverInterpolator("viewport", function (sliverId, state) {
                if (self._interpolatorType)
                {
                    switch (self._interpolatorType)
                    {
                        case "vectorBased":
                            return new rin.Ext.Interpolators.viewportInterpolator2D(state, self._interpolatorType);
                        case "linear":
                        default:
                            return new rin.Ext.Interpolators.linearViewportInterpolator(state);
                            break;
                    }
                }
                else
                    return new rin.Ext.Interpolators.linearViewportInterpolator(state);
            });


            // Call load on parent to init the keyframes.
            PanoramicES.parentPrototype.load.call(self, experienceStreamId);

            this.setState(rin.contracts.experienceStreamState.buffering);
            rin.internal.debug.write("Load called for " + this._url);

            // dispose previous viewer if it exists
            if (this._viewer) {
                this._viewer.dispose();
            }
            // Extract the cid of the pano from the url
            var cidStartIndex = self._url.indexOf("cid=");

            if (cidStartIndex > 0) {
                rin.internal.debug.write("createFromCid() has been deprecated");
                self.setState(rin.contracts.experienceStreamState.error);
            }
            else {
                // fetch the rml that defines the panoramic view
                PhotosynthRml.createFromJsonUri(self._url, function (rml, error) {
                    if (rml) {
                        setTimeout(function () {
                            self._createViewer(rml);
                            self._viewer.disableRendering();

                            // ES will be set to ready when a minimum amount of data is pre rendered.
                            self._doPreRender();

                            if (!self._esData.experienceStreams[experienceStreamId] ||
                                !self._esData.experienceStreams[experienceStreamId].keyframes ||
                                !self._esData.experienceStreams[experienceStreamId].keyframes.length) {
                                if (self._esData.data.defaultKeyframe) {
                                    // When there are no keyframes, we want to set the view on the pano viewer
                                    // to the default keyframe once. However setting it once is not working
                                    // hence the following hack to force a view update
                                    // TODO: need to investigate to find a simpler way to set the view once

                                    var kf2 = rin.util.deepCopy(self._esData.data.defaultKeyframe);
                                    kf2.state.viewport.region.center.x += 0.1;
                                    kf2.state.viewport.region.center.y += 0.1;
                                    self.displayKeyframe(kf2);
                                    setTimeout(function () {
                                        self.displayKeyframe(self._esData.data.defaultKeyframe);
                                    }, 300);
                                }
                            }
                        }, 500);
                    }
                    else {
                        if (error instanceof JsonDownloadFailedError) {
                            //Failed to download
                            rin.internal.debug.write('json failed to download');
                        }
                        else if (error instanceof JsonMalformedError) {
                            //Failed to parse the response of the json request
                            rin.internal.debug.write('json was malformed');
                        }
                        else {
                            //Some other unknown error.
                            rin.internal.debug.write('unknown error when attempting to download json');
                        }
                        self.setState(rin.contracts.experienceStreamState.error);
                    }
                });
            }
        },

        _doPreRender: function () {
            // skip pre render for now as its WIP
            this.setState(rin.contracts.experienceStreamState.ready);
            return;

            var keyframesToLoad = this.getKeyframes(0, 10, 0.2);
            var camController = this._viewer.getActiveCameraController();
            var allTiles = {}, downloadQueue = new Array();
            var loadedCount = 0, totalCount = 0, failedCount = 0, allTilesAdded = false;
            var images = new Array();
            var self = this;

            for (var i = 0; i < keyframesToLoad.length; i++) {
                var keyframeData = keyframesToLoad[i];
                // set camera params
                var viewportFOV = keyframeData.state.viewport.region.span.y;
                var viewportHeading = keyframeData.state.viewport.region.center.x;
                var viewportPitch = keyframeData.state.viewport.region.center.y;

                camController.setVerticalFov(viewportFOV, false);
                camController.setPitchAndHeading(viewportPitch, viewportHeading, false);

                var tmpTiles = this._viewer.downloadAll("panorama", [0.9, 1.2], function () { }, function () { }, false, camController._camera);

                for (var ti in tmpTiles) {
                    if (!allTiles[ti]) {
                        allTiles[ti] = tmpTiles[ti];
                        //downloadQueue.push(url);
                        totalCount++;
                    }
                }

                allTilesAdded = true;
            }
            //alert(totalCount);

            // download all
            var loadComp = function () {
                loadedCount++;
                if (allTilesAdded && loadedCount >= totalCount) {
                    //alert("preload complete. " + failedCount);
                    self.setState(rin.contracts.experienceStreamState.ready);
                }
            };
            
            var loadFailed = function () {
                failedCount++;
                loadComp();
            };

            var checkDownloadStatus = function () {
                if (allTilesAdded && loadedCount >= totalCount) {
                    //alert("preload complete. " + failedCount);
                    self.setState(rin.contracts.experienceStreamState.ready);
                } else {
                    setTimeout(checkDownloadStatus, 300);
                }
            };

            for (var i in allTiles) {
                var img = new Image();
                img.onload = loadComp;
                img.onerror = loadFailed;
                img.src = allTiles[i].url;
            }
        },

        // Pause the ES.
        pause: function (offset, experienceStreamId) {
            // Call pause on parent to sync the keyframes.
            PanoramicES.parentPrototype.pause.call(this, offset, experienceStreamId);
        },
        // Display a keyframe.
        displayKeyframe: function (keyframeData) {
            //if not ready, do nothing
            if (this.getState() != rin.contracts.experienceStreamState.ready || !keyframeData.state)
                return; 
            var viewportFOV = keyframeData.state.viewport.region.span.y; //we will ignore the span.x (horizontal FOV)
            var viewportHeading = keyframeData.state.viewport.region.center.x;
            var viewportPitch = keyframeData.state.viewport.region.center.y;
            
            this._setCamera({ "fov": viewportFOV, "heading": viewportHeading, "pitch": viewportPitch, "animate": false });
        },

        addedToStage: function() {
            if (this._viewer) {
                this._viewer.enableRendering();
                this.showPanoHint();
            } else {
                var self = this;
                setTimeout(function () {
                    self.addedToStage();
                },300);
            }
        },

        // show a pano hint once per session
        showPanoHint: function() {

            // fetch the flag from session storage
            try {
                this._skipPanoHint = (sessionStorage.getItem('rin.skipPanoHint') === 'true');
            }
            catch (ex) {
                // ignore exceptions that can occur when session storage is disabled
            }

            if (!this._skipPanoHint) {

                this._skipPanoHint = true;

                try {
                    sessionStorage.setItem('rin.skipPanoHint', 'true');
                }
                catch (ex) {
                    // ignore exceptions that can occur when session storage is disabled
                }

                // store fade in callback id so it can be cancelled if needed
                this._panoHintTimeoutId = setTimeout($.proxy(function() {
                    this._panoHint.fadeIn(500);

                    // create callback to fade out hint
                    this._panoHintTimeoutId = setTimeout($.proxy(function() {
                        this._panoHint.fadeOut(1000);
                        this._panoHintTimeoutId = null;
                    }, this), 3500);

                }, this), 1500);
            }
        },

        removedFromStage: function() {
            if (this._viewer) {
                this._viewer.disableRendering();
            }
            this._playCalled = false; //treat the next play call as first one
        },

        pickStartHeadingToTakeShortestPath : function (source, target) {
            //Always want to take the shortest path between the source and the target i.e. if source
            //is 10 degrees and target is 350 degrees we want to travel 20 degrees not 340
            if (Math.abs(target - source) > Math.PI) {
                if (source < target) {
                    return source + Math.PI * 2.0;
                }
                else {
                    return source - Math.PI * 2.0;
                }
            }
            else {
                return source;
            }
        },


        // We handle many different cases here:
        // We check any transitionType specified on the ES
        // Case A: No transitionType specified. this was called from "UpNext" button. Here we will 
        //              - target frame = view of the experienceStream at the given offset
        //              - check if we are close to the target frame, if so then just call seekUrl directly and return
        //              - else call animateToPose to get to the target view
        //              - in the callback from animateToPose, check if the animation was completed, if not then do nothing more
        //              - if animation completed successfully, then we pause for _transitionPauseDurationInSec seconds
        //              - call seekUrl to proceed with the actual transition.
        // Case B: "noZoomOut" case we treat this to be a special kind of transition
        //         here we expect the es to have a single keyframe, it will be the final view of the transition in this ES before moving on 
        //         to the next ES in the transition screenplay. We compare the FOV of the target keyframe with the current FOV.
        //         Case B.1 if current view is a zoomed-out view compared to the target keyframe, then 
        //              - we will use animateToPose to get to the target keyframe (expecting that animateToPose doesnt cause a zoom-out)
        //              - in the callback from animateToPose, we will not add any extra pause and call seekUrl to proceed with the actual transition.
        //         Case B.2 else the current view is a zoomed-in view compared to the target keyframe.
        //              - we skip calling the animateToPose to get to the target keyframe (because it will cause a zoom-out which we don't want)
        //              - immediately call seekUrl to proceed with the actual transition
        //Case C: "noAnimation" - since no animation is to be run, we call seekUrl right away
        //Case D: "fastZoom" - we will always call animateToPose to get to the first keyframe of the ES, we want to get there fast, 
        //         so we set the durationscaleoverride to 1, and transitionDuration to 0 sec, simplePathOnly = true
        // Case E: "adaptiveFirstDuration" - here we will not call animateToPose here, but instead later on in the trajectory adjust the offset 
        //          of second keyframe to a reasonable value depending on the current view and view of the second keyframe 
        resumeFrom: function (offset, experienceStreamId, seekUrl) {
            var self = this;
            var experienceStreamData = self._esData.experienceStreams[experienceStreamId];
            //Check the flags on ES 
            if (!experienceStreamData || experienceStreamData.transitionType == "noAnimation" || experienceStreamData.transitionType == "adaptiveFirstDuration") {
                //Case C or E above
                // no animation so call seekUrl right away
                self._orchestrator.seekUrl(seekUrl);
                return;
            }

            self._orchestrator.onESEvent(rin.contracts.esEventIds.resumeTransitionEvent, { transitionState: "started" });

            //Check if the transitionDurationoverrides are mentioned in the given experiencestream as well. If so, we will use those instead
            // of the defaults for this experience.
            var esTransitionOverrides = experienceStreamData.transitionDurationOverrides;
            var transitionPause = (esTransitionOverrides && esTransitionOverrides.transitionPauseDurationInSec != undefined) ? esTransitionOverrides.transitionPauseDurationInSec :
                self._transitionPauseDurationInSec;
            var durationScaleOverride = ( esTransitionOverrides && esTransitionOverrides.durationScaleOverride != undefined)? esTransitionOverrides.durationScaleOverride :
                self._durationScaleOverride;
            var simplePathOnly = (esTransitionOverrides && esTransitionOverrides.simplePathOnly != undefined) ? esTransitionOverrides.simplePathOnly :
                self._simplePathOnly;
            var noZoomOutDuringTransition = false;
            if (experienceStreamData.transitionType == "noZoomOut")
            {
                noZoomOutDuringTransition = true;
            }
            else if (experienceStreamData.transitionType == "fastZoom") {
                // Case D above
                //TODO Read these values from a data object from the resourceTable
                transitionPause = 0;
                durationScaleOverride = 1;
                simplePathOnly = true;
            }

            var callback = function (completed) {
                if (completed) {
                    if (noZoomOutDuringTransition || transitionPause < 1E-5) {
                        //No pause will be added. Call the seekUrl immediately
                        self._isInResumeFromMode = false;
                        self._orchestrator.seekUrl(seekUrl);
                    }
                    else {
                        //Add a short pause before we will launch the transition
                        setTimeout(function () {
                            self._isInResumeFromMode = false;
                            self._orchestrator.seekUrl(seekUrl);
                        }, transitionPause * 1000);
                    }
                }
                else {
                    // completed == false, animateToPose was not completed / it was interrupted, do nothing further.
                    self._isInResumeFromMode = false;
                    self._orchestrator.onESEvent(rin.contracts.esEventIds.resumeTransitionEvent, { transitionState: "interrupted" });
                }
            }.bind(this);

            if (this._viewer) {
                var targetKeyframe = this.getKeyframeAt(offset, experienceStreamId);
                var viewportFOV = targetKeyframe.state.viewport.region.span.y; //we will ignore the span.x (horizontal FOV)
                var viewportHeading = targetKeyframe.state.viewport.region.center.x;
                var viewportPitch = targetKeyframe.state.viewport.region.center.y;

                // Figure out if animateToPose needs to be called at all

                var currentKF = this.captureKeyframe();
                if (currentKF) {
                    var currentFOV = currentKF.state.viewport.region.span.y; //we will ignore the span.x (horizontal FOV)

                    if (noZoomOutDuringTransition) {
                        // Case B above
                        if (viewportFOV < currentFOV) {
                            // Case B.1 above
                            // Call animateToPose
                            this._isInResumeFromMode = true;
                            this._viewer.getActiveCameraController().animateToPose(viewportPitch, viewportHeading, viewportFOV, callback, simplePathOnly, durationScaleOverride);
                            return;
                        }
                        else {
                            // Case B.2 above
                        }
                    }
                    else {
                        // Case A above
                        var sourceHeading = this.pickStartHeadingToTakeShortestPath(currentKF.state.viewport.region.center.x, viewportHeading)
                        var headingDiff = Math.abs(sourceHeading - viewportHeading);
                        var pitchDiff = Math.abs(currentKF.state.viewport.region.center.y - viewportPitch);
                        var fovDelta = Math.min(currentFOV, viewportFOV) / Math.max(currentFOV, viewportFOV);
                        var tendegreesInRadian = 10.0 * Math.PI / 180.0; // TODO: take into account screen resolution
                        if ((experienceStreamData.transitionType == "fastZoom") || Math.abs(fovDelta - 1.0) > 0.1 || headingDiff > tendegreesInRadian || pitchDiff > tendegreesInRadian) {
                            // Current view is NOT very close to the target view, call animateToPose and call the seekUrl in the callback
                            this._isInResumeFromMode = true;
                            this._viewer.getActiveCameraController().animateToPose(viewportPitch, viewportHeading, viewportFOV, callback, simplePathOnly, durationScaleOverride);
                            return;
                        }
                    }
                }
            }
            // animateToPose was not called, just call the seekUrl right away
            self._isInResumeFromMode = false;
            self._orchestrator.seekUrl(seekUrl);
        },

        // Set the camera parameters.
        _setCamera: function (data) {
            var cameraController = this._viewer.getActiveCameraController();

            cameraController.setVerticalFov(data.fov, data.animate);
            cameraController.setPitchAndHeading(data.pitch, data.heading, data.animate);
        },
        _viewer: null,
        // Create a pano viewer instance from the given rml.
        _createViewer: function (rml) {
            var self = this;            
            var cameraParams = {

                // **Start** Default values taken from pano-viewer.js 
                verticalFov: 80 * (Math.PI / 180), // degrees to radians
                position: { x: 0, y: 0, z: 0 },
                look: { x: 0, y: 0, z: -1 },
                //Use the following for testing a more general initial view
                //look: (new Vector3(-1, 0, -1)).normalize(),
                up: { x: 0, y: 1, z: 0 },
                side: { x: 1, y: 0, z: 0 },
                // **End** Default values taken from pano-viewer.js 

                leftBoundFactor: self._viewShrinkFactor,
                rightBoundFactor: self._viewShrinkFactor,
                topBoundFactor: self._viewShrinkFactor,
                bottomBoundFactor: self._viewShrinkFactor,
                maxPixelScaleFactor: self._maxPixelScaleFactor,
                enforceViewLimits: self._enforceViewLimits
            };
            this._viewer = new RwwViewer(this._panoPlaceHolder, {
                rml: rml,
                tileDownloadFailed: function (failCount, succeedCount) {
                    var total = failCount + succeedCount;
                    if (total > 4 && failCount > succeedCount) {
                        rin.internal.debug.write('tile download failures are high');
                    }
                },
                width: this._userInterfaceControl.offsetWidth,
                height: this._userInterfaceControl.offsetHeight,

                // OPTIONAL param.  Defaults to black with full opacity.
                // example: backgroundColor: { r: 0.4, g: 0.4, b: 0.4, a: 1},
                backgroundColor: rin.defaults.panoBackgroundColor,

                // OPTIONAL param.  Defaults to 'webgl' if available on the current
                // browser, else 'css'.  At the moment, it needs to be 'css', because
                // the imagery won't show in 'webgl' until we make some changes to the
                // HTTP response headers.
                renderer: 'css',
                cameraParameters: cameraParams,
                animating: false
            });
            this._viewer.setShowLowerFidelityWhileMoving(this._lowFidilityWhileMoving);
            var cameraController = this._viewer.getActiveCameraController();
            cameraController.viewChangeCallback = function () {
                if (self.updateEA != null)
                    self.updateEA();
            }
            

            // Keep updating the viewer size to its parent size. Using below method as onresize if not fired on div consistantly on all browsers
            // TODO: May be there is a better approach?
            self._updateInterval = setInterval(function () {
                if (self._viewer.width !== self._userInterfaceControl.offsetWidth ||
                    self._viewer.height !== self._userInterfaceControl.offsetHeight) {

                    self._viewer.width = self._userInterfaceControl.offsetWidth;
                    self._viewer.height = self._userInterfaceControl.offsetHeight;

                    self._viewer.setViewportSize(self._userInterfaceControl.offsetWidth, self._userInterfaceControl.offsetHeight);
                };
            }, 300); // using 300 so that its not too slow nor too fast to eat up cpu cycles
        },
        // Get interaction controls for panorama.
        getInteractionControls: function () {
            var self = this;
            if (!self._interactionControls) {
                self._interactionControls = document.createElement("div");

                self._orchestrator.getInteractionControls([rin.contracts.interactionControlNames.panZoomControl],
                    function (wrappedInteractionControls) {
                        rin.util.assignAsInnerHTMLUnsafe(self._interactionControls, wrappedInteractionControls.innerHTML);
                        ko.applyBindings(self, self._interactionControls);
                    });
            }

            return self._interactionControls;
        },
        // Zoom and pan commands.
        zoomInCommand: function () {
            var cameraController = this._viewer.getActiveCameraController();
            cameraController.setVerticalFov(Math.max(.05, cameraController.getVerticalFov() * (1 - this._zoomFactor)), true);
        },
        zoomOutCommand: function () {
            var cameraController = this._viewer.getActiveCameraController();
            cameraController.setVerticalFov(Math.min(2, cameraController.getVerticalFov() * (1 + this._zoomFactor)), true);
        },
        panLeftCommand: function () {
            var cameraController = this._viewer.getActiveCameraController();
            var currentPitchAndHeading = cameraController.getPitchAndHeading();
            cameraController.setPitchAndHeading(currentPitchAndHeading[0], currentPitchAndHeading[1] - (this._panDistance * cameraController.getVerticalFov()), true);
        },
        panRightCommand: function () {
            var cameraController = this._viewer.getActiveCameraController();
            var currentPitchAndHeading = cameraController.getPitchAndHeading();
            cameraController.setPitchAndHeading(currentPitchAndHeading[0], currentPitchAndHeading[1] + (this._panDistance * cameraController.getVerticalFov()), true);
        },
        panUpCommand: function () {
            var cameraController = this._viewer.getActiveCameraController();
            var currentPitchAndHeading = cameraController.getPitchAndHeading();
            cameraController.setPitchAndHeading(currentPitchAndHeading[0] + (this._panDistance * cameraController.getVerticalFov()), currentPitchAndHeading[1], true);
        },
        panDownCommand: function () {
            var cameraController = this._viewer.getActiveCameraController();
            var currentPitchAndHeading = cameraController.getPitchAndHeading();
            cameraController.setPitchAndHeading(currentPitchAndHeading[0] - (this._panDistance * cameraController.getVerticalFov()), currentPitchAndHeading[1], true);
        },

        // From pano-viewer.js
        convertHorizontalToVerticalFieldOfView: function(width, height, fov) {
            var focalLength = 0.5 / Math.tan(fov * 0.5);
            var aspectRatio = width/height;
            return 2 * Math.atan((0.5 * 1.0 / aspectRatio) / focalLength);
        },

        convertVerticalToHorizontalFieldOfView: function(width, height, fov) {
            var aspectRatio = width/height;
            var focalLength = (0.5 * 1.0 / aspectRatio) / Math.tan(fov * 0.5);
            return 2 * Math.atan(0.5 / focalLength);
        },

        captureKeyframe: function () {
            if (!this._viewer) return "";
            var cameraController = this._viewer.getActiveCameraController();
            var currentPitchAndHeading = cameraController.getPitchAndHeading();
            var fov = cameraController.getVerticalFov();
            if (fov && currentPitchAndHeading && !isNaN(fov) && !isNaN(currentPitchAndHeading[0]) && !isNaN(currentPitchAndHeading[1])) {
                var size = this._viewer.getViewportSize();
                var horizontalfov = this.convertVerticalToHorizontalFieldOfView(size.x, size.y, fov);
                var normalizedZoom = 1.0/fov;
                return {
                    "state": {
                        "viewport": {
                            "region": {
                                "center": {
                                    "x": currentPitchAndHeading[1],
                                    "y": currentPitchAndHeading[0]
                                },
                                "span": {
                                    "x": horizontalfov,
                                    "y": fov
                                }
                            },
                            "normalizedZoom": normalizedZoom
                        }
                    }
                };
            }
            else {
                return null;
            }
        },

        getEmbeddedArtifactsProxy: function (layoutEngine) {
            var provider = this;
            this.updateEA = function () { layoutEngine.render({}); };
            return new function () {
                this.getEmbeddedArtifactsContainer = function () {
                    return provider._userInterfaceControl;
                };
                this.convertPointToScreen2D = function (inPoint, outPoint) {
                    var heading = inPoint.x;
                    var pitch = inPoint.y;
                    var cameraController = provider._viewer.getActiveCameraController();
                    var pointInScreen2D = cameraController.tryPitchHeadingToPixel(pitch, heading);
                    if (!pointInScreen2D || pointInScreen2D.x == NaN || pointInScreen2D.y == NaN)
                        return false;
                    outPoint.x = pointInScreen2D.x;
                    outPoint.y = pointInScreen2D.y;
                    return true;
                };
                this.convertPointToWorld2D = function (inPoint, outPoint) {
                    var cameraController = provider._viewer.getActiveCameraController();
                    var pointInWorld2D = cameraController.tryPixelToPitchHeading(inPoint);
                    outPoint.x = pointInWorld2D.heading;
                    outPoint.y = pointInWorld2D.pitch;
                    return true;
                };
                this.getScreenDimensions = function (r) {
                    var width = provider._viewer.width;
                    var height = provider._viewer.height;
                    r.center.x = width / 2;
                    r.center.y = height / 2;
                    r.span.x = width;
                    r.span.y = height;
                };
                this.currentNormalizedZoom = function () {
                    // TODO - this is not normalized zoom! Both here and in reporting keyframes, we must use the right value.
                    // TODO - how expensive are these operations? If needed we may need to call them less often from EA system.
                    var cameraController = provider._viewer.getActiveCameraController();
                    var fov = cameraController.getVerticalFov();
                    if (typeof fov === "number" && fov > 1.0E-10) {
                        return 1.0 / fov;
                    } else {
                        return NaN;
                    }
                };
            };
        },
        // Unload the ES.
        unload: function () {
            if (this._updateInterval) clearInterval(this._updateInterval);
            if (this._viewer) {
                this._viewer.dispose();
            }
        },

        calculateAdaptiveOffset : function (firstKf, secondKf, experienceStream)
        {
            // adaptiveOffset = firstKf.offset + adaptiveDuration. 

            var duration = this.calculateAdaptiveDuration(firstKf, secondKf, experienceStream);
            var retval = secondKf.offset;
            if (duration >= 0) {
                retval = this._capAdaptiveOffset ? Math.min(secondKf.offset, firstKf.offset + duration) : firstKf.offset + duration;
            }
            return retval;
        },

        /* TODO: remove this 
        calculateAdaptiveOffset: function (firstKf, secondKf, experienceStream) {
            //We would like to adjust the offset of the second keyframe so that it takes reasonable amount of
            // time to get to it depending on the views in firstKf and secondKf

            //TODO: look for a profile, and for overrides for transitions on that profile

            // Following calculation is based on panoviewer's ballisticPath duration calculation for simple paths
            var MIN_DURATION = 0.5;
            var firstRegion = firstKf.state.viewport.region;
            var secondRegion = secondKf.state.viewport.region;
            var firstFov = firstRegion.span.y;
            var secondFov = secondRegion.span.y;
            var maxFov = Math.max(firstFov, secondFov);
            var minFov = Math.min(firstFov, secondFov);

            var pitch1 = firstRegion.center.y;
            var pitch2 = secondRegion.center.y;
            var heading2 = secondRegion.center.x;
            var heading1 = this.pickStartHeadingToTakeShortestPath(firstRegion.center.x, heading2)
            var middleFov = Math.abs(pitch1 - pitch2) + Math.abs(heading1 - heading2);
            if (middleFov > maxFov) {
                // the difference in pitch & heading is more than the fov difference
                maxFov = middleFov;
            }

            var retval = secondKf.offset;
            if (minFov > 1E-5) {
                var fovDelta = maxFov / minFov;
                var duration = (MIN_DURATION + Math.log(fovDelta)) * 700 * (this._adaptiveDurationScaleOverride);
                duration /= 1000;
                //We will cap the adaptiveoffset to offset of the secondKf if so specified
                retval = this._capAdaptiveOffset ? Math.min(secondKf.offset, firstKf.offset + duration) : firstKf.offset + duration;
            }
            return retval;
        }, */

        //Calculate the reasonable amount of time needed to get to the secondKf from firstKf
        calculateAdaptiveDuration: function (firstKf, secondKf, experienceStream) {
            //TODO: look for a profile, and for overrides for transitions on that profile
            // Following calculation is based on panoviewer's ballisticPath duration calculation for simple paths
            var MIN_DURATION = 0.5;
            var firstRegion = firstKf.state.viewport.region; 
            var secondRegion = secondKf.state.viewport.region;
            var firstFov = firstRegion.span.y;
            var secondFov = secondRegion.span.y;
            var maxFov = Math.max(firstFov, secondFov);
            var minFov = Math.min(firstFov, secondFov);
            
            var pitch1 = firstRegion.center.y;
            var pitch2 = secondRegion.center.y;
            var heading2 = secondRegion.center.x;
            var heading1 = this.pickStartHeadingToTakeShortestPath(firstRegion.center.x, heading2)
            var middleFov = Math.abs(pitch1 - pitch2) + Math.abs(heading1 - heading2);
            if (middleFov > maxFov) {
                // the difference in pitch & heading is more than the fov difference
                maxFov = middleFov;
            }

            if (minFov > 1E-5) {

                var maxAdaptiveDuration = this._maxAdaptiveDuration;
                var adaptiveDurationScaleOverride = this._adaptiveDurationScaleOverride;
                // Check if adaptiveTransitionProfileOverride was mentioned on the experience
                if (experienceStream.adaptiveTransitionProfileOverride != undefined) {
                    if (experienceStream.adaptiveTransitionProfileOverride.maxAdaptiveDuration != undefined) {
                        maxAdaptiveDuration = experienceStream.adaptiveTransitionProfileOverride.maxAdaptiveDuration;
                    }

                    if (experienceStream.adaptiveTransitionProfileOverride.durationScaleOverride != undefined) {
                        adaptiveDurationScaleOverride = experienceStream.adaptiveTransitionProfileOverride.durationScaleOverride;
                    }
                }

                var fovDelta = maxFov / minFov;
                var calculatedAdaptiveDuration = (MIN_DURATION + Math.log(fovDelta)) * 700 * (adaptiveDurationScaleOverride);
                calculatedAdaptiveDuration /= 1000;

                // Adatptive duration depends on 
                //           - calculatedAdaptiveDuration - calculated based on the two views
                //          - maxAdaptiveDurationInSec - max allowed adaptive duration found in settings
                // adaptiveDuration = min (calculatedAdaptiveDuration, maxAdaptiveDurationInSec)                


                if (maxAdaptiveDuration > 0) {
                    calculatedAdaptiveDuration = Math.min(maxAdaptiveDuration, calculatedAdaptiveDuration);
                }
                return calculatedAdaptiveDuration;
            }
            else {
                return -1;
            }
        },
        _interactionControls: null,
        _zoomFactor: .2,
        _panDistance: .3,
        isExplorable: true,
        _tryCalculate: false,
        _lowFidilityWhileMoving: true,
        _enforceViewLimits: null,
        _durationScaleOverride: 4,
        _adaptiveDurationScaleOverride: 3,
        _capAdaptiveOffset: true,
        _maxAdaptiveDuration: -1,
        _transitionPauseDurationInSec: 0,
        _simplePathOnly: false,
        _viewShrinkFactor: null,
        _maxPixelScaleFactor: null,
        _isInResumeFromMode: false
    };

    PanoramicES.elementHTML = 
        "<div style='height:100%;width:100%;background-color:black;position:absolute;'>" +
            "<div class='panoHolder' style='height:100%;width:100%;background-color:black;position:absolute;'></div>" + 
            "<div class='panoHint'><h3>Panoramic Image</h3><div class='panoHintDrag'>Drag</div><div class='panoHintPinch'>Zoom</div></div>" +
        "</div>";

    rin.util.overrideProperties(PanoramicES.prototypeOverrides, PanoramicES.prototype);
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.PanoramicExperienceStream", function (orchestrator, esData) { return new PanoramicES(orchestrator, esData); });
})(rin);

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/
/// <reference path="../core/Common.js" />
window.rin = window.rin || {};
//-- New Knockout binding to handle both tap and click.
ko.bindingHandlers.clickOrTouch = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).rinTouchGestures(function (e, touchGesture) {
            if (touchGesture.gesture == 'simpletap') {
                var handlerFunction = valueAccessor() || {};
                if (!handlerFunction)
                    return;
                try {
                    var argsForHandler = rin.util.makeArray(arguments);
                    argsForHandler.unshift(viewModel);
                    handlerFunction.apply(viewModel, argsForHandler);
                } finally { }
            }
        }, { simpleTap: true, swipe: false });
        return null;
    }
};

rin.ContentBrowserES = function (orchestrator, esData, dimension) {
    this._orchestrator = orchestrator;
    this._esData = esData;
    this._dimension = dimension;
    var resourceResolver = this._orchestrator.getResourceResolver();
    var htmlfile = resourceResolver.resolveSystemResource('contentbrowser/' + dimension + '.htm');
    var jsfile = resourceResolver.resolveSystemResource('contentbrowser/' + dimension + '.js');

    this._userInterfaceControl = document.createElement("div");
    this._userInterfaceControl.style.width = "100%";
    this._userInterfaceControl.style.height = "100%";
    this._userInterfaceControl.style.position = "absolute";

    var self = this;
    //--Download the theme based htm file
    var htmlDownload = {
        url: htmlfile,
        dataType: "html",
        error: function (jqxhr, textStatus, errorThrown) {
            self.setState(rin.contracts.experienceStreamState.error);
            self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading the html file: {1}", errorThrown, htmlfile);
        },
        success: function (data, textStatus, jqxhr) {
            self._elementHtml = data;
            self._isHtmlLoaded = true;
            self._updateView();
        }
    };
    $.ajax(htmlDownload);

    //--Download the js file associated with the current CB
    $.getScript(jsfile)
    .done(function (script, textStatus) {
        self._isJsLoaded = true;
        self._updateView();
    })
    .fail(function (jqxhr, textStatus, errorThrown) {
        self.setState(rin.contracts.experienceStreamState.error);
        self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading the js file: {1}", errorThrown, jsfile);
    });

    var control = this._userInterfaceControl;
    var lastZIndex = 0;
    this._userInterfaceControl.hide = function () {
        lastZIndex = control.style.zIndex;
        control.style.zIndex = 0;
    }
    this._userInterfaceControl.unhide = function () {
        control.style.zIndex = lastZIndex;
        this._userInterfaceControl.opacity = 1;
    }
    this._collectionData = {};

    /* Disabling this for Everest as ImageES is used in the popup gallery. Todo Enable afterwards 
    //--Bind the mouseup to fire interaction event
    $(this._userInterfaceControl).bind("mouseup", function (e) {
        self._orchestrator.startInteractionMode();
    });*/
    //Set the initial state to buffering and load the 
    this.setState(rin.contracts.experienceStreamState.buffering);
    this._loadCollectionJSON();
};

rin.ContentBrowserES.prototype = new rin.contracts.DiscreteKeyframeESBase();
rin.ContentBrowserES.base = rin.contracts.DiscreteKeyframeESBase.prototype;
rin.ContentBrowserES.changeTrigger = { none: 0, onkeyframeapplied: 1, onnext: 2, onprevious: 3, onclick: 4 };
rin.ContentBrowserES.currentMode = { preview: 0, expanded: 1 };

rin.ContentBrowserES.prototypeOverrides = {
    load: function (experienceStreamId) {
        rin.ContentBrowserES.base.load.call(this, experienceStreamId);

        if (this._esData.data["default"] != undefined) {
            this._showFilmstripAlways = (new rin.internal.XElement(this._esData.data["default"]).elementValue("ShowFilmstripAlways", false) == "true");
            this._showDescriptionByDefault = (new rin.internal.XElement(this._esData.data["default"]).elementValue("ShowDescriptionByDefault", false) == "true");
        }
    },

    unload: function () {
        rin.ContentBrowserES.base.unload.call(this);
    },

    setDataContext: function (collectionData) {
        //--Bind the UI to the viewmodel
        if (collectionData.groupsList.length > 0) {
            this.collectionViewModel = this.getViewModel(collectionData, this._orchestrator);
            this._isJSONLoaded = true;
            this._updateView();
        }
    },

    getCapturedKeyframe: function (keyframeData) {
        if (typeof keyframeData != undefined) {
            return keyframeData;
        }
        return null;
    },

    displayKeyframe: function (keyframeData) {
        if (keyframeData != undefined) {
            var dataElement = keyframeData.state["kf-selstate"];
            if (dataElement != undefined) {
                this.goToState(dataElement);
            }
        }
    },

    captureKeyframe: function () {
        return JSON.parse('{"state" : { "kf-selstate": { "item": {"itemid": "{0}", "view": { "display": { "show": true } } } } } }'.rinFormat(this.collectionViewModel.currentItem().id));
    },
    addedToStage: function () {
    },

    removedFromStage: function () {
        // this._orchestrator.onESEvent(this, rin.contracts.esEventIds.showControls, null); //todo: investigate what needs to happen here. Do we really need showControls esEvent?
    },

    getCurrentState: function () { return null; },

    goToState: function (artifactState) {
        if (this.collectionViewModel === undefined || this.collectionViewModel == null)
            return;
        //--Get the group/item to be selected and call Applykeyframe on it.
        for (var item in artifactState) {
            var itemId = artifactState[item].itemid;
            var selectedItem = null;

            this.collectionViewModel.groups.foreach(function (group) {
                 selectedItem = group.itemsList.firstOrDefault(function (item) {
                    return item.id == itemId; });
            });

            if (selectedItem != null) {
               if (selectedItem && selectedItem.id !== this.collectionViewModel.currentItem().id) {
                   this.collectionViewModel.onApplyKeyframe(selectedItem);
               }
               break;
            }
        }
    },

    toggleDescription: function (isDescVisible) { },

    toggleFilmstrip: function (isFilmstripVisible) { },

    //--Populates the viewmodel
    getViewModel: function (collectionData, orchestrator) {
        var collectionViewModel = {
            orchestrator: orchestrator,
            title: collectionData.title, //collection title
            description: collectionData.description, //collection description
            groups: collectionData.groupsList, //--the groups list along with the items in it
            itemUpdateTrigger: rin.ContentBrowserES.changeTrigger.none,
            previousItem: {}, //--the item that was previously selected
            currentMode: rin.ContentBrowserES.currentMode.preview, //--current mode of CB - is it in expanded mode or preview
            currentItem: ko.observable({}), //--currently selected item
            isLastItem: ko.observable(false),
            isFirstItem: ko.observable(false),
            initViewModel: function () {
                if (this.groups.length > 0 && this.groups[0].itemsList.length > 0) {
                    this.currentItem(this.groups[0].itemsList[0]);
                    this.isFirstItem(true);
                }
            },
            onPrevious: function () {
                var groupIndex = self.currentItem().groupIndex;
                var index = self.groups[groupIndex].itemsList.indexOf(self.currentItem());
                self.beforeSelectionChange();

                if (index > 0) {
                    index--;
                }
                else if (index === 0 && groupIndex > 0) {
                    groupIndex--;
                    index = self.groups[groupIndex].itemsList.length - 1;
                }
                else
                    return;
                self.itemUpdateTrigger = rin.ContentBrowserES.changeTrigger.onprevious;
                self.afterSelectionChange(groupIndex, index);
            },
            onNext: function () {
                var groupIndex = self.currentItem().groupIndex;
                var index = self.groups[groupIndex].itemsList.indexOf(self.currentItem());
                self.beforeSelectionChange();

                if (index < self.groups[groupIndex].itemsList.length - 1) {
                    index++;
                }
                else if (index === (self.groups[groupIndex].itemsList.length - 1) && groupIndex < (self.groups.length - 1)) {
                    groupIndex++;
                    index = 0;
                }
                else
                    return;
                self.itemUpdateTrigger = rin.ContentBrowserES.changeTrigger.onnext;
                self.afterSelectionChange(groupIndex, index);
            },
            onMediaClick: function (selecteditem) {
                self.previousItem = self.currentItem();
                self.beforeSelectionChange();
                var index = self.groups[selecteditem.groupIndex].itemsList.indexOf(selecteditem);
                self.itemUpdateTrigger = rin.ContentBrowserES.changeTrigger.onclick;
                self.afterSelectionChange(selecteditem.groupIndex, index);
            },
            onApplyKeyframe: function (selecteditem) {
                self.previousItem = self.currentItem();
                self.beforeSelectionChange();
                var index = self.groups[selecteditem.groupIndex].itemsList.indexOf(selecteditem);
                self.itemUpdateTrigger = rin.ContentBrowserES.changeTrigger.onkeyframeapplied;
                self.afterSelectionChange(selecteditem.groupIndex, index);
            },
            onExplore: function () {
                //When clicked on a preview image, launch a popup, or go to expanded mode
                self.getItemESData(self.currentItem());
                var popup = new rin.PopupControl(self.orchestrator);
                popup.load(self.currentItem().esData, self);
                self.currentMode = rin.ContentBrowserES.currentMode.expanded;

                $(popup).bind('onclose', function (e) {
                    self.currentMode = rin.ContentBrowserES.currentMode.preview;
                });
            },
            beforeSelectionChange: function () {
                self.isFirstItem(false);
                self.isLastItem(false);
                self.itemUpdateTrigger = rin.ContentBrowserES.changeTrigger.none;
            },
            afterSelectionChange: function (groupIndex, index) {
                if (index === 0 && groupIndex === 0)
                    self.isFirstItem(true);
                else if (index === (self.groups[groupIndex].itemsList.length - 1) && groupIndex === (self.groups.length - 1))
                    self.isLastItem(true);

                self.previousItem = self.currentItem();

                var selectedItem = self.groups[groupIndex].itemsList[index];
                if (self.currentMode == rin.ContentBrowserES.currentMode.expanded) {
                    self.getItemESData(selectedItem);
                }

                self.currentItem(selectedItem);
            },
            getItemESData: function (itemData) {
                if (itemData.esData === undefined) {
                    itemData.esData = rin.internal.esDataGenerator.getExperienceStream(itemData);
                }
            }
        };
        var self = collectionViewModel;
        collectionViewModel.initViewModel();
        return collectionViewModel;
    },
    _updateView: function () {
        //--once html, associated javascript and the collection data model are all loaded
        //--create and append the view, apply bindings and initialize the view javascript
        if (this._isHtmlLoaded && this._isJsLoaded && this._isJSONLoaded) {
            this._userInterfaceControl.appendChild(rin.util.createElementWithHtml(this._elementHtml).firstChild);
            ko.applyBindings(this.collectionViewModel, this._userInterfaceControl.firstChild);

            var viewLoad = this._dimension;
            if (viewLoad in rin.ContentBrowserES)
                new rin.ContentBrowserES[viewLoad](this._userInterfaceControl.firstChild);
        }
    },
    _loadCollectionJSON: function () {
        //--from the es data, load the collection json
        var resourceResolver = this._orchestrator.getResourceResolver();
        var resourceName = resourceResolver.resolveResource(this._esData.resourceReferences[0].resourceId, this._esData.experienceId);

        if (resourceName) {
            var self = this;
            var cache = !(self._orchestrator.getPlayerConfiguration().playerMode === rin.contracts.playerMode.AuthorerPreview || self._orchestrator.getPlayerConfiguration().playerMode === rin.contracts.playerMode.AuthorerEditor);
            rin.internal.JSONLoader.loadJSON(resourceName, function (data, jsonUrl) {
                self._collectionData = rin.internal.JSONLoader.processCollectionJSON(jsonUrl, data[0].collection, resourceResolver, true);
                self.setDataContext(self._collectionData);
                self.setState(rin.contracts.experienceStreamState.ready);
                self.displayKeyframe(self._lastKeyframe);
            }, function (error, jsonUrl) {
                self.setState(rin.contracts.experienceStreamState.error);
                self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading the json file: {1}", error, jsonUrl);
            }, cache);
        }
    }
};

rin.util.overrideProperties(rin.ContentBrowserES.prototypeOverrides, rin.ContentBrowserES.prototype);

rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.RinTemplates.MetroOneDTemplateES", function (orchestrator, esData) { return new rin.ContentBrowserES(orchestrator, esData, "OneD"); });
rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.RinTemplates.MetroTwoDTemplateES", function (orchestrator, esData) { return new rin.ContentBrowserES(orchestrator, esData, "OneD"); });

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

//To bind a UI element directly using knockout
ko.bindingHandlers.element = {
    update: function (element, valueAccessor) {
        var elem = ko.utils.unwrapObservable(valueAccessor());
        $(element).empty();
        $(element).append(elem);
    }
};

rin.OverlayES = function (orchestrator, esData) {
    this._orchestrator = orchestrator;

    this._esData = esData;

    this._userInterfaceControl = rin.util.createElementWithHtml("<div></div>").firstChild;

    var contenttype = esData.data.contentType;
    var lowercaseContent = contenttype.toLowerCase();
    //Load the mediaoverlays.htm for the non-text experience streams mentioned below
    switch (lowercaseContent) {
        case "audio":
        case "video":
        case "zoomableimage":
        case "singledeepzoomimage":
        case "photosynth":
            contenttype = "MediaOverlays";
            break;
    }

    var resourceResolver = this._orchestrator.getResourceResolver();
    var htmlfile = resourceResolver.resolveSystemResource('overlays/' + contenttype + '.htm');

    var self = this;

    //--Download the theme based htm file
    var htmlDownload = {
        url: htmlfile,
        dataType: "html",
        error: function (jqxhr, textStatus, errorThrown) {
            self.setState(rin.contracts.experienceStreamState.error);
            self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading the html file: {1}", errorThrown, htmlfile);
        },
        success: function (data, textStatus, jqxhr) {
            self._userInterfaceControl = rin.util.createElementWithHtml(data).firstChild;

            $(self._userInterfaceControl).bind("mousedown", function (e) {
                self._orchestrator.startInteractionMode();
            });

            self._isHtmlLoaded = true;
            self.checkReady();
        }
    };
    $.ajax(htmlDownload);

    this._userInterfaceControl.hide = function () {
        lastZIndex = control.style.zIndex;
        control.style.zIndex = -10000;
    };

    //--from the es data, load the collection json
    var resourceResolver = this._orchestrator.getResourceResolver();
    var resourceName = resourceResolver.resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);
    this.setState(rin.contracts.experienceStreamState.buffering);

    if (resourceName) {
        var cache = !(self._orchestrator.getPlayerConfiguration().playerMode === rin.contracts.playerMode.AuthorerPreview || self._orchestrator.getPlayerConfiguration().playerMode === rin.contracts.playerMode.AuthorerEditor);
        rin.internal.JSONLoader.loadJSON(resourceName, function (data, jsonUrl) {
            self._collectionData = rin.internal.JSONLoader.processCollectionJSON(jsonUrl, data[0].collection, resourceResolver);
            self._isResourceLoaded = true;
            rin.internal.debug.write("Load called for collection" + jsonUrl);
            self.checkReady();
        }, function (error, jsonUrl) {
            self._isResourceLoaded = false;
            self.setState(rin.contracts.experienceStreamState.error);
            self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading the json file: {1}", error, jsonUrl);
        }, cache);
    }

    //--Check to see if both html and json collection are loaded and then set the state of the ES to ready
    this.checkReady = function () {
        if (self._isHtmlLoaded && self._isResourceLoaded)
            self.setState(rin.contracts.experienceStreamState.ready);
    }
    this._userInterfaceControl.unhide = function () { control.style.zIndex = lastZIndex; }
};

rin.OverlayES.prototype = new rin.contracts.DiscreteKeyframeESBase();
rin.OverlayES.base = rin.contracts.DiscreteKeyframeESBase.prototype;
rin.OverlayES.changeTrigger = { none: 0, onkeyframeapplied: 1, onnext: 2, onprevious: 3, onclick: 4 };
rin.OverlayES.currentMode = { preview: 0, expanded: 1 };

rin.OverlayES.prototypeOverrides = {
    load: function (experienceStreamId) {
        rin.OverlayES.base.load.call(this, experienceStreamId);
    },
    unload: function () {
        rin.OverlayES.base.unload.call(this);
    },
    getViewModel: function (itemId, collectionData, orchestrator) {
        //--Get the current item to be displayed from the keyframe
        var itemData = collectionData.items[itemId];
        if (itemData) {
            var self = this;
            var overlayViewModel = {
                overlayCollection: collectionData,
                orchestrator: orchestrator,
                currentItem: null,
                expandedItem: null,
                itemId: null,
                currentMode: rin.OverlayES.currentMode.preview,
                isExpanded: ko.observable(false),
                isBlurbVisible: ko.observable(true),
                onClickMore: function () {
                    self.overlayViewModel.isExpanded(true);
                    self.overlayViewModel.isBlurbVisible(false);
                },
                onExplore: function () {
                //--on click of cue, launch the associated behavior
                    this.currentMode = rin.OverlayES.currentMode.expanded;
                    if (this.currentItem.defaultExpandedModeBehavior) {
                        var behaviorFactory = rin.ext.getFactory(rin.contracts.systemFactoryTypes.behaviorFactory, this.currentItem.defaultExpandedModeBehavior);
                        if (behaviorFactory) {
                            var overlayBehavior = behaviorFactory(this.orchestrator);
                            if (overlayBehavior) {
                                overlayBehavior.executeBehavior({ "DataContext": this.currentItem, "CollectionData": this.overlayCollection }, function () {
                                    this.currentMode = rin.OverlayES.currentMode.preview;
                                });
                            }
                        }
                    }
                }
            };

            //--If its a play in place overlay, create a rines dynamically
            //--add it to the current overlay UI
            //--Subscribe to the ES events and sync the rines with the current overlay state(ESState and Play/Pause)
            if (itemData.playInPlace) {
                if (itemData.experienceStream === undefined) {                    
                    var rinESNarrative = rin.internal.esDataGenerator.getExperienceStream(
                        { "srcType": "MicrosoftResearch.Rin.RinExperienceStream",
                            "duration": itemData.smallMediaDuration || itemData.duration,
                            "smallMediaStartOffset": itemData.smallMediaStartOffset
                        });
                    var rinESData = rinESNarrative.experiences[rinESNarrative.id];
                    rinESData.id = rinESData.experienceId = rinESNarrative.id;

                    //--Generate the current item's associated narrative and assign it to the rinES
                    var itemESData = rin.internal.esDataGenerator.getExperienceStream(itemData);
                    rinESData.narrativeData = itemESData;
                    //--get the RinExperience stream
                    itemData.experienceStream = orchestrator.createExperienceStream("MicrosoftResearch.Rin.RinExperienceStream", rinESData, orchestrator);
                    this._subscribeToESEvents(itemData, itemData.experienceStream, rinESNarrative.id);
                    //--Load the rines
                    itemData.experienceStream.load(rinESData.id);
                    //--assign the rin escontrol UI to be bound in the Mediaoverlay
                    itemData.esControl = itemData.experienceStream._userInterfaceControl;
                }
            }
            //--We have a single overlay for sidebar text/blurb.
            //--So if there is a launch artifact specified in the itemdata, 
            //--show up the blurb first and assign the launch artifact id data to expanded item.
            //--else assign the itemdata to the expanded item to show up the side bar text
            if (typeof itemData.launchArtifact === "string") {
                overlayViewModel.expandedItem = collectionData.items[itemData.launchArtifact];
                overlayViewModel.isExpanded(false);
                overlayViewModel.isBlurbVisible(true);
                this._subscribeToPlayerEvents(overlayViewModel);
            }
            else {
                overlayViewModel.expandedItem = itemData;
                overlayViewModel.isExpanded(true);
                overlayViewModel.isBlurbVisible(false);
            }
            if (typeof itemData.fontColor === "string") {
                if (itemData.fontColor.length > 6) {
                    itemData.fontColor = "#" + itemData.fontColor.substring(3);
                }
            }
            else {
                itemData.fontColor = "#fcfcfc";
            }

            //--After setting all the properties, set the current item value and return the overlay view model.
            overlayViewModel.currentItem = itemData;

            return overlayViewModel;
        }
        return null;
    },
    _subscribeToPlayerEvents: function (overlayViewModel) {
        //--Sync up the player with the blurb expanded /collapsed mode.
        if (this._playerSubscription)
            this._playerSubscription.dispose();

        var self = this;
        this._playerSubscription = this._orchestrator.playerStateChangedEvent.subscribe(function () {
            var playerState = self._orchestrator.getPlayerState();
            if (playerState == rin.contracts.playerState.playing) {
                self.overlayViewModel.isExpanded(false);
                self.overlayViewModel.isBlurbVisible(true);
            }
        });
    },

    _subscribeToESEvents: function (itemData, experienceStream, uniqueId) {
        //--Sync up the ES events incase its a play in place overlay
        if (this._esSubscription)
            this._esSubscription.dispose();

        var self = this;
        this._esSubscription = experienceStream.stateChangedEvent.subscribe(function (esStateChangedEventArgs) {
            //--Check to see if this is the same experiencestream we had subscribed to.
            if (esStateChangedEventArgs.source._esData.id == uniqueId)
                self.setState(esStateChangedEventArgs.toState);
        }, uniqueId);
    },

    _bindOverlay: function (itemId, show) {
        if (this._collectionData != null && itemId && this._isHtmlLoaded) {
            //--form the view model from the itemid and apply bindings
            var $control = $(this._userInterfaceControl);

            if (typeof (this.overlayViewModel) === "undefined" || this.overlayViewModel == null || this.overlayViewModel.itemId != itemId) {
                this.overlayViewModel = this.getViewModel(itemId, this._collectionData, this._orchestrator);
                if (this.overlayViewModel != null && this.overlayViewModel.currentItem != null) {
                    this.overlayViewModel.itemId = itemId;
                    ko.applyBindings(this.overlayViewModel, this._userInterfaceControl);
                }
            }

            if (show === true) {
                if (this.overlayViewModel.currentItem.show !== show) {
                    $control.stop().fadeIn(1000);
                }
                //--If there is a Play in place overlay, call play on the experience stream
                if (this.overlayViewModel.currentItem.playInPlace && this.overlayViewModel.currentItem.experienceStream != null) {
                    if (typeof (this.overlayViewModel.currentItem.experienceStream.setVolume) === "function") {
                        this.overlayViewModel.currentItem.experienceStream.setVolume(this._baseVolume);
                    }
                    if (typeof (this.overlayViewModel.currentItem.experienceStream.setIsMuted) === "function") {
                        this.overlayViewModel.currentItem.experienceStream.setIsMuted(this._isMuted);
                    }
                }
            }
            else {
                if (this.overlayViewModel.currentItem.show !== show) {
                    $control.stop().fadeOut(1000);
                    //--If there is a Play in place overlay, call pause on the experience stream
                    if (this.overlayViewModel.currentItem.playInPlace && this.overlayViewModel.currentItem.experienceStream != null) {
                        this.overlayViewModel.currentItem.experienceStream.pause();
                    }
                }
            }
            this.overlayViewModel.currentItem.show = show;
        }
    },
    displayKeyframe: function (keyframeData) {
        if (keyframeData != undefined) {
            var artifactState = keyframeData.data["ea-selstate"];
            if (artifactState != undefined) {
                for (var item in artifactState) {
                    var itemId = artifactState[item].itemid;
                    var show = artifactState[item].view && artifactState[item].view.display && artifactState[item].view.display.show !== undefined ? artifactState[item].view.display.show : true;
                    this._bindOverlay(itemId, show);
                    rin.internal.debug.write("Display keyframe called for overlay item:" + itemId);
                }
            }
        }
    },
    // Play the rines incase of play in place overlay
    play: function (offset, experienceStreamId) {
        rin.OverlayES.base.play.call(this, offset, experienceStreamId);
        if (this.getState() === rin.contracts.experienceStreamState.ready) {
            if (this.overlayViewModel != null && this.overlayViewModel.currentItem != null) {
                if (this.overlayViewModel.currentItem.playInPlace && this.overlayViewModel.currentItem.experienceStream != null)
                    this.overlayViewModel.currentItem.experienceStream.play(offset, experienceStreamId);
            }
        }
    },
    // Pause the rines incase of play in place overlay
    pause: function (offset, experienceStreamId) {
        rin.OverlayES.base.pause.call(this, offset, experienceStreamId);
        if (this.getState() === rin.contracts.experienceStreamState.ready) {
            if (this.overlayViewModel != null && this.overlayViewModel.currentItem != null) {
                if (this.overlayViewModel.currentItem.playInPlace && this.overlayViewModel.currentItem.experienceStream != null)
                    this.overlayViewModel.currentItem.experienceStream.pause(offset, experienceStreamId);
            }
        }
    },

    // Set the base volume of the overlay. This will be multiplied with the keyframed volume to get the final volume.
    setVolume: function (baseVolume) {
        this._baseVolume = baseVolume;
        if (this.overlayViewModel &&
            this.overlayViewModel.currentItem &&
            this.overlayViewModel.currentItem.playInPlace &&
            this.overlayViewModel.currentItem.experienceStream != null &&
            typeof (this.overlayViewModel.currentItem.experienceStream.setVolume) === "function") {
            this.overlayViewModel.currentItem.experienceStream.setVolume(baseVolume);
        }
    },

    // Mute or unmute the play in place stream.
    setIsMuted: function (value) {
        this._isMuted = value;
        if (this.overlayViewModel &&
            this.overlayViewModel.currentItem &&
            this.overlayViewModel.currentItem.playInPlace &&
            this.overlayViewModel.currentItem.experienceStream != null &&
            typeof (this.overlayViewModel.currentItem.experienceStream.setIsMuted) === "function") {
            this.overlayViewModel.currentItem.experienceStream.setIsMuted(value);
        }
    }
};

rin.util.overrideProperties(rin.OverlayES.prototypeOverrides, rin.OverlayES.prototype);

rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.TwodLayoutEngine", function (orchestrator, esData) { return new rin.OverlayES(orchestrator, esData); });
rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "microsoftResearch.rin.twodlayoutengine", function (orchestrator, esData) { return new rin.OverlayES(orchestrator, esData); });

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // ES for hosting Ink elements clips.
    var InkES = function (orchestrator, esData) {
        InkES.parentConstructor.apply(this, arguments);
        var self = this;
        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(InkES.elementHTML).firstChild;
        this._rinInkContainer = this._userInterfaceControl.getElementsByClassName("rinInkContainer")[0];
        this._rinInkController = null;
        this.loaded = false; // flip to true once ink svg is initialized
        this.prevDims = null; // store dims of linked art while ink is not onscreen
        this._esData = esData;
        this._loadTimeout = null;
        this._timeout = null;
        this._unloaded = false;
        this.link = null;
        this._playCalled = false;
        this.lastDims = {x: 0, y: 0, w: 0, h: 0};
        if (esData.data.linkToExperience) {
            this.link = esData.data.linkToExperience;
            this.embeddedItem = this.link.embedding;
        }
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, InkES);

    InkES.prototypeOverrides = {
        // Load and initialize the video.
        load: function (experienceStreamId) {
            var self = this;
            if (self._unloaded) {
                return;
            }
            console.log("load called in INKES");
            //this._unloaded = false;

            //// Check if valid link and hook up events
            function findLinkedES() {
                
                // Get the linked ES instance
                var encoded_id = "";
                for (var i = 0; i < self._esData.experienceId.length; i++)
                    encoded_id += self._esData.experienceId.charCodeAt(i);
                var allESes = self._orchestrator.getESItems();
                self.linkedES = allESes.firstOrDefault(function (es) {
                    return es.id === self.link.embedding.experienceId;
                });

                if (self.linkedES && self.linkedES.experienceStream &&
                    self.linkedES.experienceStream.getState() === "ready" &&
                    self.linkedES.experienceStream.viewportChangedEvent && self.linkedES.experienceStream.raiseViewportUpdate) {
                    
                    self.linkedES.experienceStream.viewportChangedEvent.subscribe(function (newViewport) {
                        self.viewportChanged(newViewport);
                    },encoded_id);

                    self.loadInkItems();
                    self.linkedES.experienceStream.raiseViewportUpdate();
                    return;
                }
                else {
                    console.log("failed to find linkedES for " + encoded_id);
                    if (!self._unloaded) {
                        self._loadTimeout = setTimeout(findLinkedES, 1000);
                    }
                }
            }

            if (self.link.embedding.enabled) {
                findLinkedES();
            }
            else {
                self.loadInkItems();
            }
        },

        loadInkItems: function () {
            // Load all ink items here
            var self = this;
            var i;
            var DATASTRING = self.embeddedItem.element.datastring.str;

            // use the ink's title to get a unique id; title might have spaces, so encode it
            var EID = self._esData.experienceId;
            var inkNum = "";
            for (i = 0; i < EID.length; i++)
                inkNum += EID.charCodeAt(i);
            console.log("in inkES, inknum = " + inkNum);
            // the dom element to which we'll append the ink canvas container
            //var viewerElt = $("#rinplayer");
            //viewerElt = (viewerElt.length) ? viewerElt : $("#rinPlayer");
            //viewerElt.css("position", "absolute");

            // if we try to call loadInkItems too soon, use a callback to retry
            var callback = function () {
                if (self.loadInkItems) {
                    self.loadInkItems();
                }
            };

            // once we can load in to html, load it
            //if (self._rinInkContainer.parentNode.parentNode) {
			var onscreenInk = $("[ES_ID='" + EID + "']");
            if (onscreenInk[0] && onscreenInk[0].childNodes[0]) {
			//if ($("[ES_ID='" + EID + "']")[0] && $("[ES_ID='" + EID + "']")[0].childNodes[0]) {
                var iid = "inkCanv" + inkNum;
                if (self.link.embedding.enabled) {
                    // if our ink is attached:
                    if ($(self._rinInkContainer)[0].childNodes.length)
                        return;

                    // add the right ID to the ink container div, create the inkController
                    $(self._rinInkContainer).attr("id", iid);
                    //self._rinInkController = new LADS.TourAuthoring.InkAuthoring(iid, self._rinInkContainer, "inkes", null);
                    self._rinInkController = new tagInk(iid, self._rinInkContainer);
                    self._rinInkController.set_mode(-1);
                    self._rinInkController.setInitKeyframeData(self.link.embedding.initKeyframe);
                    self._rinInkController.setArtName(self.link.embedding.experienceId);
                    self._rinInkController.retrieveOrigDims();
                    self._rinInkController.setEID(EID);
                    self._rinInkController.loadInk(DATASTRING);
                }
                else {
                    // if our ink is unattached:
                    $(self._rinInkContainer).attr("id", iid);
                    //self._rinInkController = new LADS.TourAuthoring.InkAuthoring(iid, self._rinInkContainer, "inkes", null); //inkController("inkCanv" + inkNum, self._rinInkContainer);
                    self._rinInkController = new tagInk(iid, self._rinInkContainer);
                    self._rinInkController.set_mode(-1);
                    self._rinInkController.loadInk(DATASTRING);
                }
                this.loaded = true;
                self.setState(rin.contracts.experienceStreamState.ready);
            }
            else {
                if (!self._unloaded) {
                    console.log("ABOUT TO SET TIMEOUT IN INKES");
                    this._timeout = setTimeout(callback, 50);
                }
            }
        },

        viewportChanged: function (dims) {
            // take care of panning and zooming here
            //var check_onscreen = true; // set this to 'true' to check if an ink is on screen before calling adjustViewBox (this should be how it's done, but there's a problem with fades now)
            //var container = $("[ES_ID='" + this._esData.experienceId + "']")[0];
            if (this.loaded && (this._playCalled || parseFloat(this._rinInkContainer.parentNode.style.opacity))) {
                // check if play has been called or the opacity is 1 (want to let in one more viewportChanged event when the opacity could be 0)
                this._playCalled = false;
                try {
                    this._rinInkController.adjustViewBox(dims);
                }
                catch (err) {
                    console.log("error in viewportChanged: " + err);
                }
            } else {
                this.prevDims = dims;
            }
        },
        //// Play the video.
        play: function (offset, experienceStreamId) {
            // here we call adjustViewBox to position a linked ink correctly when it first comes on screen. There's an issue now if the ink starts at time 0 (maybe
            // other times, too -- test!)
            console.log("PLAY called for ink: " + this._esData.experienceId);
            this._playCalled = true;
            if (this.link.embedding.enabled) {
                if (this.prevDims) {
                    this._rinInkController.adjustViewBox(this.prevDims);
                } else {
                    var proxy = this.linkedES.experienceStream.proxy;
                    var x = parseFloat(proxy.data("x"));
                    var y = parseFloat(proxy.data("y"));
                    var w = parseFloat(proxy.data("w"));
                    var h = parseFloat(proxy.data("h"));
                    console.log("dims in inkes play: (" + x + "," + y + "," + w + "," + h + ")");
                    this._rinInkController.adjustViewBox({ x: x, y: y, width: w, height: h }, 1);
                }
            }
        },
        // Pause the video.
        pause: function (offset, experienceStreamId) {
        },
        //unload the ink es; just clear its timeout
        unload: function () {
            try {
                this._unloaded = true;
                if (this._timeout) {
                    clearTimeout(this._timeout);
                }
                if (this._loadTimeout) {
                    clearTimeout(this._loadTimeout);
                }
                console.log("UNLOADING INKES");
            } catch (e) {
                console.log("failed to clear timeout in inkES: "+e.message);
                rin.internal.debug.assert(!e);
            } // Ignore errors on unload.
        },
        // Set the base volume of the video. This will be multiplied with the keyframed volume to get the final volume.
        setVolume: function (baseVolume) {
        },
        // Mute or unmute the video.
        setIsMuted: function (value) {

        },
        _interactionControls: null
    };
    InkES.elementHTML = "<div style='height:100%;width:100%;position:relative;background:transparent'><div class='rinInkContainer inkCanv' style='pointer-events:none;height:100%;width:100%;left:0px;top:0px;position:absolute;background:transparent'></div></div>";
    rin.util.overrideProperties(InkES.prototypeOverrides, InkES.prototype);
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.InkExperienceStream", function (orchestrator, esData) { return new InkES(orchestrator, esData); });
})(rin);

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {

    // ES for displaying web pages.
    var WebViewES = function (orchestrator, esData) {
        WebViewES.parentConstructor.apply(this, arguments);
        var self = this;
        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(WebViewES.elementHTML).firstChild;
        this._iFrame = $("iframe", this._userInterfaceControl)[0]; // IFrame used to load the webpage
        this._controlDiv = $(".controlElement", this._userInterfaceControl)[0]; // Div sitting over the IFrame to intercept user interactions.
        this._esData = esData;
        this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);
        this._cssPath = esData && esData.data && esData.data.cssPath;

        $(this._controlDiv).bind("mousedown", function (e) {
            self._controlDiv.style.display = "none"; // Remove the overlay div so that the user can interact with the web page.
            self._orchestrator.startInteractionMode();
        });
        $(this._controlDiv).bind("mousewheel", function (e) {
            self._controlDiv.style.display = "none"; // Remove the overlay div so that the user can interact with the web page.
            self._orchestrator.startInteractionMode();
        });
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, WebViewES);

    WebViewES.prototypeOverrides = {
        // Load the ES and start loading the webpage.
        load: function (experienceStreamId) {
            if (!this._url)
                throw new Error("WebView source not found!");

            var self = this;
            this.setState(rin.contracts.experienceStreamState.buffering);

            // Load the page in the IFrame
            this._iFrame.onerror = function (source) {
                rin.internal.debug.write("error while loading iframe " + source);
                self.setState(rin.contracts.experienceStreamState.error);
                return true;
            }
            this._iFrame.src = this._url;
            this._iFrame.onload = function () {
                try {
                    if (self._cssPath) {
                        var css = document.createElement("link");
                        css.href = self._cssPath;
                        css.type = "text/css";
                        css.rel = "stylesheet";
                        var head = getHeadNode(self._iFrame.contentDocument);
                        head.appendChild(css);
                    }
                }
                catch (err) {
                    rin.internal.debug.write("error on iframe load " + err);
                }
                finally {
                    self.setState(rin.contracts.experienceStreamState.ready);
                }
            };
        },
        play: function (offset, experienceStreamId) {
            // Add the overlay div back in place to monitor for interactions.
            this._controlDiv.style.display = "block";
        },
        pause: function (offset, experienceStreamId) {
            // Add the overlay div back in place to monitor for interactions.
            this._controlDiv.style.display = "block";
        },
        _url: null,
    };

    rin.util.overrideProperties(WebViewES.prototypeOverrides, WebViewES.prototype);
    WebViewES.elementHTML = "<div style='height:100%;width:100%;position:absolute;border:0px;'><iframe style='overflow:hidden;height:100%;width:100%;position:absolute;border:none;'></iframe><div class='controlElement' style='height:100%;width:100%;position:absolute;background-color:rgba(1,1,1,.001);'></div></div>";
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.WebViewExperienceStream", function (orchestrator, esData) { return new WebViewES(orchestrator, esData); });

    //Helper methods

    // Adds a node to the doc - To Do Optimize this for cross-browser and Win 8 standards.
    var addElement = function (doc, element, referenceNode, referenceType) {
        var refChild = referenceNode || doc.lastChild;
        switch (referenceType) {
            case "before":
                doc.insertBefore(element, refChild);
                break;
            default:
                refChild.parentNode.appendChild(element);
                break;
        }
    },
    // Adds a node to the doc.
    createAndAddElement = function (doc, nodeName, attributes, referenceNode, referenceType) {
        var element = doc.createElement(nodeName),
            attrs = attributes || [],
            attributeName;
        for (attributeName in attrs) {
            if (attrs.hasOwnProperty(attributeName)) {
                element.setAttribute(attributeName, attrs[attributeName]);
            }
        }
        addElement(doc, element, referenceNode, referenceType);
        return element;
    },
    // Gets the first matching node by tag name or undefined.
    getFirstNodeByTagNameSafe = function (doc, nodeName) {
        var nodes = doc.getElementsByTagName(nodeName);
        return nodes && (nodes.length > 0 ? nodes[0] : undefined);
    },
    // Gets the body node or undefined.
    getBodyNode = function (doc) {
        var body = doc.body || getFirstNodeByTagNameSafe(doc, "body");
        return body;
    },
    // Gets the head node or undefined.
    getHeadNode = function (doc) {
        var head = doc.head || getFirstNodeByTagNameSafe(doc, "head") || createAndAddElement(doc, "head", null, getBodyNode(doc), "before");
        return head;
    };


})(rin);
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // ES for playing video clips.
    var RinES = function (orchestrator, esData) {
        RinES.parentConstructor.apply(this, arguments);
        var self = this;
        this._orchestrator = orchestrator;
        this._userInterfaceControl = rin.util.createElementWithHtml(RinES.elementHTML).firstChild;
        this._esData = esData;        
        this._url = orchestrator.getResourceResolver().resolveResource(esData.resourceReferences[0].resourceId, esData.experienceId);
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, RinES);

    RinES.prototypeOverrides = {        
        // Load and initialize the video.
        load: function (experienceStreamId) {
            var self = this,
                loadComplete = function () {
                    if (self.getState() === rin.contracts.experienceStreamState.ready) {
                        self._rinPlayer.volume(self._baseVolume);
                        self._rinPlayer.mute(self._mute);
                    }
                };
            // Set to buffering till the load is complete.
            this.setState(rin.contracts.experienceStreamState.buffering);

            // Create the rin player.
            this._userInterfaceControl.rinPlayer = rin.createPlayerControl(this._userInterfaceControl, "controls=false");
            this._rinPlayer = rin.getPlayerControl(this._userInterfaceControl);
            
            // Monitor internal rin state change and update to the parent rin.
            this._rinPlayer.orchestrator.isPlayerReadyChangedEvent.subscribe(function (isReady) {
                if(isReady)
                    self.setState(rin.contracts.experienceStreamState.ready);
                else
                    self.setState(rin.contracts.experienceStreamState.buffering);
            });

            this._rinPlayer.orchestrator.playerStateChangedEvent.subscribe(function (state) {
                switch (state.currentState) {                    
                    case rin.contracts.playerState.pausedForExplore:
                        self._orchestrator.pause();
                        break;
                    case rin.contracts.playerState.playing:
                        self._orchestrator.play();
                        break;
                }
            });

            // Monitor internal interaction calls and update parent rin.
            this._rinPlayer.interactionModeStarted.subscribe(function () {
                    self._orchestrator.startInteractionMode();
            });

            // Load the internal rin.
            if(this._esData.narrativeData != null) {
                self._rinPlayer.loadData(this._esData.narrativeData, loadComplete);
            }
            else if(this._url != null) {
                self._rinPlayer.load(this._url, loadComplete);
            }
        },
        //// Play the video.
        play: function (offset, experienceStreamId) {
            if (this.getState() === rin.contracts.experienceStreamState.ready)
                this._rinPlayer.play(offset, experienceStreamId);
        },
        // Pause the video.
        pause: function (offset, experienceStreamId) {
            if (this.getState() === rin.contracts.experienceStreamState.ready)
                this._rinPlayer.pause(offset, experienceStreamId);
        },
        // Set the base volume of the video. This will be multiplied with the keyframed volume to get the final volume.
        setVolume: function (baseVolume) {
            this._baseVolume = baseVolume;
            if (this.getState() === rin.contracts.experienceStreamState.ready)
                this._rinPlayer.volume(baseVolume);
        },
        // Mute or unmute the video.
        setIsMuted: function (value) {
            this._mute = value;
            if (this.getState() === rin.contracts.experienceStreamState.ready)
                this._rinPlayer.mute(value);
        },
        _desiredVideoPositon: -1, // Seek location in case the video is not buffered or loaded yet at the location.
        _url: null,
        _baseVolume: 1, // Volume from orchestrator.
        _mute: false,
        _startMarker: 0, // Start trim position for the video.
        _interactionControls: null,
        _rinPlayer : null
    };

    RinES.elementHTML = "<div class='rinPlayer' style='height:100%;width:100%;position:absolute'></div>";
    rin.util.overrideProperties(RinES.prototypeOverrides, RinES.prototype);
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.RinExperienceStream", function (orchestrator, esData) { return new RinES(orchestrator, esData); });
})(rin);

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // Lite ES that interpolates doubles and uses DiscreteKeyframeESBase as base class.
    var LiteDiscreteES = function (orchestrator, esData) {
        LiteDiscreteES.parentConstructor.apply(this, arguments);

        this._userInterfaceControl = rin.util.createElementWithHtml(LiteDiscreteES.elementHTML).firstChild;
        this._valuePlaceholder = $(".rinPlaceholderValue", this._userInterfaceControl)[0];
    };

    rin.util.extend(rin.contracts.DiscreteKeyframeESBase, LiteDiscreteES);

    LiteDiscreteES.prototypeOverrides = {
        // Load and display the ES.
        load: function (experienceStreamId) {
            LiteDiscreteES.parentPrototype.load.call(this, experienceStreamId);
            this.setState(rin.contracts.experienceStreamState.ready);
        },
        // Pause the player.
        pause: function (offset, experienceStreamId) {
            LiteDiscreteES.parentPrototype.pause.call(this, offset, experienceStreamId);
            if (this._activeValueAnimation !== null) {
                this._activeValueAnimation.stop();
                this._activeValueAnimation = null;
            }
        },
        // Apply/Interpolate to a keyframe.
        displayKeyframe: function (keyframeData, nextKeyframeData, interpolationOffset) {
            var curKeyValue, curKeyText,
                // If there is another keyframe following current one, load that for interpolation.
                nextKeyValue = nextKeyframeData && nextKeyframeData.state.value;

            // Load current keyframe.
            if (keyframeData) {
                curKeyValue = keyframeData.state.value;
                curKeyText = keyframeData.state.text;

                // start volume interpolation to next key volume if one is present.
                if (nextKeyValue) {
                    var keyframeDuration = nextKeyframeData.offset - keyframeData.offset;
                    var animation = new rin.internal.DoubleAnimation(keyframeDuration, curKeyValue, nextKeyValue);
                    curKeyValue = animation.getValueAt(interpolationOffset);
                    this._animateValue(curKeyValue, nextKeyValue, keyframeDuration - interpolationOffset);
                }

                rin.util.assignAsInnerHTMLUnsafe(this._userInterfaceControl.firstChild, curKeyText);
                rin.util.assignAsInnerHTMLUnsafe(this._valuePlaceholder, ~~curKeyValue);
            }
        },
        // Interpolate volume for smooth fade in and out.
        _animateValue: function (from, to, animationTime) {
            var self = this;
            var valueAnim = new rin.internal.DoubleAnimation(animationTime, from, to);
            var valueAnimationStoryboard = new rin.internal.Storyboard(
                valueAnim,
                function (value) {
                    rin.util.assignAsInnerHTMLUnsafe(self._valuePlaceholder, ~~value);
                },
                function () { self._activeValueAnimation = null; });

            if (this._activeValueAnimation !== null) {
                this._activeValueAnimation.stop();
                this._activeValueAnimation = null;
            }

            valueAnimationStoryboard.begin();
            this._activeValueAnimation = valueAnimationStoryboard;
        },
        _activeValueAnimation: null,
    };

    rin.util.overrideProperties(LiteDiscreteES.prototypeOverrides, LiteDiscreteES.prototype);
    LiteDiscreteES.elementHTML = "<div style='position:absolute;width:100%;height:100%'><div style='color:red;position:absolute;width:100%;height:100%'>Starting Test...</div><div style='color:white;position:absolute;right:20px;top:20px;' class='rinPlaceholderValue'></div></div>";
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.LiteDiscreteExperienceStream", function (orchestrator, esData) { return new LiteDiscreteES(orchestrator, esData); });
})(rin);
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/DiscreteKeyframeESBase.js" />
/// <reference path="../contracts/IExperienceStream.js" />
/// <reference path="../contracts/IOrchestrator.js" />
/// <reference path="../core/Common.js" />
/// <reference path="../core/EventLogger.js" />
/// <reference path="../core/PlayerConfiguration.js" />
/// <reference path="../core/ResourcesResolver.js" />
/// <reference path="../core/TaskTimer.js" />

window.rin = window.rin || {};

(function (rin) {
    // Simple lite ES that interpolates doubles and uses InterpolatedKeyframeESBase as base class.
    var LiteInterpolatedES = function (orchestrator, esData) {
        LiteInterpolatedES.parentConstructor.apply(this, arguments);

        this._userInterfaceControl = rin.util.createElementWithHtml(LiteInterpolatedES.elementHTML).firstChild;
        this._valuePlaceholder = $(".rinPlaceholderValue", this._userInterfaceControl)[0];

        esData.data.defaultKeyframe = esData.data.defaultKeyframe || {
            "state": {
                "text": "Test starting...",
                "value": 0
            }
        };
    };

    rin.util.extend(rin.contracts.InterpolatedKeyframeESBase, LiteInterpolatedES);

    LiteInterpolatedES.prototypeOverrides = {
        // Load and display the ES.
        load: function (experienceStreamId) {
            this.addSliverInterpolator("value", function (sliverId, state) {
                return new rin.Ext.Interpolators.linearDoubleInterpolator(sliverId, state);
            });

            LiteInterpolatedES.parentPrototype.load.call(this, experienceStreamId);
            this.setState(rin.contracts.experienceStreamState.ready);
        },
        // Apply/Interpolate to a keyframe.
        displayKeyframe: function (keyframeData) {
            rin.util.assignAsInnerHTMLUnsafe(this._valuePlaceholder, keyframeData.state.value.toFixed(1));
            rin.util.assignAsInnerHTMLUnsafe(this._userInterfaceControl.firstChild, keyframeData.state.text)
        }
    };

    rin.util.overrideProperties(LiteInterpolatedES.prototypeOverrides, LiteInterpolatedES.prototype);
    LiteInterpolatedES.elementHTML = "<div style='position:absolute;width:100%;height:100%'><div style='color:red;position:absolute;width:100%;height:100%'></div><div style='color:white;position:absolute;right:20px;top:20px;' class='rinPlaceholderValue'></div></div>";
    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.esFactory, "MicrosoftResearch.Rin.LiteInterpolatedExperienceStream", function (orchestrator, esData) { return new LiteInterpolatedES(orchestrator, esData); });
})(rin);
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
(function (rin, $) {

    // ES for displaying a Image Comparison Slider
    var ImageCompareES = function (orchestrator, esData) {
        ImageCompareES.parentConstructor.apply(this, arguments);

        // by default slider starts in the middle
        this.percent = 50;

        var resolver = orchestrator.getResourceResolver(),
            resources = esData.resourceReferences,
            experienceId = esData.experienceId;

        // TODO: is it safe to assume resources are always ordered?
        this.leftImageUrl = resolver.resolveResource(resources[0].resourceId, experienceId);
        this.rightImageUrl = resolver.resolveResource(resources[1].resourceId, experienceId);

        this.imageWidth = 0;
        this.imageHeight = 0;

        // NOTE: right image goes first since only the left element changes size
        this.el = rin.util.createElementWithHtml(
            '<div class="rin-ic-center">' +
                '<div class="rin-ic-right"></div>' +
                '<div class="rin-ic-left"></div>' +
                '<div class="rin-ic-slider">' +
                    '<div class="rin-ic-sliderbar"></div>' +
                '</div>' +
            '</div>');

        // cache parent element references
        this.$el = $(this.el).addClass('rin-ic');
        this.$center = this.$el.find('.rin-ic-center');

        // set image backgrounds
        this.$left = this.$el.find('.rin-ic-left')
            .css('background-image', 'url(' + this.leftImageUrl + ')');
        this.$right = this.$el.find('.rin-ic-right')
            .css('background-image', 'url(' + this.rightImageUrl + ')');

        // indicates whether user is controlling slider
        this.interactiveSlide = false;

        // listen to slide start drag by user
        this.$slider = this.$el.find('.rin-ic-slider')
            .on('pointerstart', $.proxy(function() {
                orchestrator.startInteractionMode();
                this.interactiveSlide = true;
            }, this));

        // we listen to slide events on parent element because the
        // slider element is too narrow, its easy for the user to
        // drag faster than we can update the position. we don't
        // want the drag to end until they leave the parent element
        this.$el.on('pointerstart pointermove pointerend', $.proxy(function(event) {

            // stop event propagation to prevent manipulation of page
            if (event.type === 'pointermove') {
                event.preventDefault();
            }

            if (!this.interactiveSlide) {
                return;
            } else if (event.type === 'pointerend') {
                this.interactiveSlide = false;
            }

            var offset = this.$center.offset(),
                width = this.$center.width(),
                x = event.pointer.x - offset.left,
                percent = x / width * 100;

            this.setPercent(percent);
        }, this));

        this.sliderBarLeft = 100;

        //Set up defaultKeyframe
        esData.data = esData.data || {};
        esData.data.defaultKeyframe = esData.data.defaultKeyframe ||
            { "state": { "percent" : this.percent } };
    };

    rin.util.extend(rin.contracts.InterpolatedKeyframeESBase, ImageCompareES);

    ImageCompareES.prototypeOverrides = {

        // Load and initialize the ES.
        load: function (experienceStreamId) {

            this.addSliverInterpolator("percent", function (sliverId, state) {
                return new rin.Ext.Interpolators.linearDoubleInterpolator(
                    sliverId, state);
            });

            this.windowResize = $.proxy(this.resize, this);
            $(window).on('resize', this.windowResize);

            // Call load on parent to init the keyframes.
            ImageCompareES.parentPrototype.load.call(this, experienceStreamId);
            this.setState(rin.contracts.experienceStreamState.buffering);

            // buffering state until both left and right images are loaded
            var leftImage = new Image(),
                rightImage = new Image(),
                loadCount = 0,
                TOTAL_IMAGES = 2,
                onImageLoaded = $.proxy(function() {
                    loadCount++;
                    if (loadCount === TOTAL_IMAGES) {
                        this.resize();
                        // signal to RIN that we are ready
                        this.setState(rin.contracts.experienceStreamState.ready);
                    }
                }, this);

            rightImage.onload = onImageLoaded;
            rightImage.src = this.rightImageUrl;

            // load the left image to get dimensions (assume identical size for right)
            leftImage.onload = $.proxy(function() {
                this.imageWidth = leftImage.width;
                this.imageHeight = leftImage.height;
                onImageLoaded();
            }, this);
            leftImage.src = this.leftImageUrl;
        },

        addedToStage: function() {

            // TODO: better way to hide the player controls if inside an popup?
            this.$el.parents('.rin_popup_es_container')
                .find('.rin_Footer').addClass('rin_hide_footer');

            // intermittent issues with directly calling resize. might be
            // triggered by fade-in delays? need to investigate further
            setTimeout(this.windowResize, 100);
        },

        unload: function() {
            $(window).off('resize', this.windowResize);
        },

        getUserInterfaceControl: function() {
            return this.el;
        },

        resize: function() {

            // wait until we know the image dimensions
            if (!this.imageWidth || !this.imageHeight) {
                return;
            }

            var parentWidth = this.$el.width(),
                parentHeight = this.$el.height(),
                parentAspect = parentWidth / parentHeight,
                imageAspect = this.imageWidth / this.imageHeight,
                scaledWidth, scaledHeight, offset;

            // identify how to scale and letterbox the images
            if (parentAspect > imageAspect) {
                scaledWidth = Math.ceil(parentHeight * imageAspect);
                scaledHeight = parentHeight;
                offset = Math.round((parentWidth - scaledWidth) / 2),
                this.$center.css({ left: offset, right: offset });
            } else {
                scaledWidth = parentWidth;
                scaledHeight = Math.ceil(parentWidth / imageAspect);
                offset = Math.round((parentHeight - scaledHeight) / 2),
                this.$center.css({ top: offset, bottom: offset });
            }

            // scale the two images
            var bgSize = scaledWidth + 'px ' + scaledHeight + 'px';
            this.$left.css('background-size', bgSize);
            this.$right.css('background-size', bgSize);

            // reset the slider position
            this.setPercent(this.percent);
        },

        pause: function (offset, experienceStreamId) {
            // Call pause on parent to sync the keyframes.
            ImageCompareES.parentPrototype.pause.call(this, offset, experienceStreamId);
        },

        displayKeyframe: function (keyframeData) {

            var READY = rin.contracts.experienceStreamState.ready;
            if (this.getState() !== READY || !keyframeData.state) {
                return; //if not ready, do nothing
            }

            this.setPercent(keyframeData.state.percent);
        },

        setPercent: function(percent) {
            this.percent = Math.max(0, Math.min(percent, 100));
            var width = this.$center.width(),
                leftWidth = Math.floor(width * this.percent / 100);

            this.$left.width(leftWidth);
            this.$slider.css('left', leftWidth - this.sliderBarLeft);
        },

        captureKeyframe: function () {
            return { "state": { "percent": this.percent } };
        },

        isExplorable: true
    };

    rin.util.overrideProperties(
        ImageCompareES.prototypeOverrides,
        ImageCompareES.prototype);

    rin.ext.registerFactory(
        rin.contracts.systemFactoryTypes.esFactory,
        "MicrosoftResearch.Rin.ImageCompareExperienceStream",
        function (orchestrator, esData) {
            return new ImageCompareES(orchestrator, esData);
        });

})(rin, jQuery);

/// <reference path="../core/Common.js" />
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};

rin.PopupControl = function (orchestrator) {
    this._orchestrator = orchestrator;

    var resourceResolver = this._orchestrator.getResourceResolver();
    //-- Download the relevant html and js files
    var htmlfile = resourceResolver.resolveSystemResource('popup/popup.htm');
    var jsfile = resourceResolver.resolveSystemResource('popup/popup.js');
    var _isHtmlLoaded, _isJsLoaded = false;
    var subscription = null;
    var self = this;

    var htmlDownload = {
        url: htmlfile,
        dataType: "html",
        error: function (jqxhr, textStatus, errorThrown) {
            popupViewModel.error(true);
            self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading html file: {1}", exception.Message, htmlfile);
        },
        success: function (data, textStatus, jqxhr) {
            self._elementHtml = data;
            _isHtmlLoaded = true;
            updateView();
        }
    };
    $.ajax(htmlDownload);

    $.getScript(jsfile)
    .done(function (script, textStatus) {
        _isJsLoaded = true;
        updateView();
    })
    .fail(function (jqxhr, settings, exception) {
        popupViewModel.error(true);
        self._orchestrator.eventLogger.logErrorEvent("Error: {0} downloading js file: {1}", exception.Message, jsfile);
    });

    //--External function to be called with experienceStreamData 
    //--and the datacontext(can be either a collectionViewModel or a plain collection Item)
    this.load = function (esData, dataContext) {
        this._orchestrator.getPlayerConfiguration().activePopup = this; //TODO: Post everest, find better place to store this kind of information instead of playerConfiguration.
        populateViewModel(esData, dataContext);
        updateView();
    }

    this.hasAudio = false;

    //--Triggers a onclose event callback when the popup control closes.
    //--CB uses this to assess the mode it is currently in
    var close = function () {
        if (self._userInterfaceControl) {
            self._popupControl.close(function () {
                if (self._playerControl != null) {
                    self._playerControl.pause();
                    self._playerControl.unload();
                }

                $(self._userInterfaceControl).remove();
                $(self).trigger('onclose', null);

                self._orchestrator.getPlayerConfiguration().activePopup = null;
                self._orchestrator.onESEvent(rin.contracts.esEventIds.popupDisplayEvent, { displayed: false, hasAudio: self.hasAudio });
            }, self);
        }
        //-- Dispose the subscription created for CurrentItem change in a collection mode
        if (subscription) {
            subscription.dispose();
        }
    }

    //--Update the ESData and the view when the current Item changes
    var onCurrentItemChange = function (newValue) {
        popupViewModel.esData = newValue.esData;
        updateView();
    }

    //Dummy popupview model, that can be extended 
    //based on the current datacontext 
    //(either with a collection data model in case of CB or a single item incase of Overlays)
    var popupViewModel = {
        esData: {},
        currentItem: ko.observable({}),
        isESLoading: ko.observable(false),
        onViewClose: function () {
            close();
        },
        error: ko.observable(false),
        init: function () {
            popupViewModel.error(false);
            popupViewModel.currentItem({});
        }
    }

    var populateViewModel = function (esData, dataContext) {
        popupViewModel.init();
        //-- if there is a collection just copy the data context items over to our viewmodel
        if (dataContext && dataContext.currentItem) {
            rin.util.overrideProperties(dataContext, popupViewModel);
        }//--its a single item
        else if (dataContext) {
            popupViewModel.currentItem(dataContext);
        }
        //--the current esData
        popupViewModel.esData = esData;
        self.hasAudio = !!dataContext.hasAudio;
        subscription = popupViewModel.currentItem.subscribe(onCurrentItemChange);
    }

    var updateView = function () {
        //Once html, javascript and viewmodel is loaded
        //create and load the view and show the experiencestream
        if (_isHtmlLoaded && _isJsLoaded && popupViewModel.esData) {
            var playerControl = $(".rin_mainContainer", self._orchestrator.getPlayerRootControl());

            if (self._userInterfaceControl === undefined) {
                self._userInterfaceControl = rin.util.createElementWithHtml(self._elementHtml).firstChild;
                playerControl.append(self._userInterfaceControl);
            }

            //--loads the popup and shows the new ES
            if (self._popupControl === undefined) {
                //-- clones the play pause controls, right side fb/volume controls from player and shows it up
                self._popupControl = new rin.PopupControl.View(self._userInterfaceControl, playerControl.width(), playerControl.height(), popupViewModel.esData.data.narrativeData.aspectRatio);

                ko.applyBindings(popupViewModel, self._userInterfaceControl);
                self._popupControl.showES(getPlayerControl(), null);
            }
            else {
                //--Hides the old ES and shows the new one
                self._popupControl.hideES(function () {
                    self._popupControl.showES(getPlayerControl(), null);
                });
            }

            self._orchestrator.onESEvent(rin.contracts.esEventIds.popupDisplayEvent, { displayed: true, hasAudio: self.hasAudio });
        }
    }

    var getPlayerControl = function () {
        var narrativeData = popupViewModel.esData;
        var playerElement = rin.util.createElementWithHtml("<div style='width:100%;height:100%'></div>");
        var configuration = rin.util.shallowCopy(orchestrator.getPlayerConfiguration());

        configuration.narrativeRootUrl = "";
        configuration.hideAllControllers = false;
        configuration.controls = true;
        configuration.controllerOptions = {
            header: false,
            playPause: true,
            share: false,
            fullscreen: false,
            seeker: true,
            volume: true,
            seekToBeginningOnEnd: true
        };
        if (typeof popupViewModel.currentItem.rootUrl === "string")
            configuration.narrativeRootUrl = popupViewModel.currentItem.rootUrl;
        self._playerControl = rin.createPlayerControl(playerElement.firstChild, configuration);
        self._playerControl.loadData(narrativeData, function () {
            self._playerControl.play();
        });
        self._playerControl.muteChangedEvent.subscribe(function (value) {
            orchestrator.getPlayerControl().mute(value);
        });

        return playerElement.firstChild;
    }
};
/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/IExperienceStream.js" />

rin.ext.registerFactory(rin.contracts.systemFactoryTypes.interactionControlFactory, rin.contracts.interactionControlNames.panZoomControl,
    function (resourcesResolver, loadedCallback) {
        $.get(resourcesResolver.resolveSystemResource("interactionControls/PanZoomControls.html"), null, function (visual) {
            var wrap = document.createElement("div"),
                systemRoot = resourcesResolver.getSystemRootUrl();
            wrap.style["display"] = "inline-block";
            rin.util.assignAsInnerHTMLUnsafe(wrap, visual.replace(/SYSTEM_ROOT/g, systemRoot));
            loadedCallback(wrap);
        });
    });

rin.ext.registerFactory(rin.contracts.systemFactoryTypes.interactionControlFactory, rin.contracts.interactionControlNames.mediaControl,
    function (resourcesResolver, loadedCallback) {
        $.get(resourcesResolver.resolveSystemResource("interactionControls/MediaControls.html"), null, function (visual) {
            var wrap = document.createElement("div"),
                systemRoot = resourcesResolver.getSystemRootUrl();
            rin.util.assignAsInnerHTMLUnsafe(wrap, visual.replace(/SYSTEM_ROOT/g, systemRoot))
            loadedCallback(wrap);
        });
    });

rin.ext.registerFactory(rin.contracts.systemFactoryTypes.interactionControlFactory, "MicrosoftResearch.Rin.InteractionControls.RotateControl",
   function (resourcesResolver, loadedCallback) {
       $.get(resourcesResolver.resolveSystemResource("interactionControls/RotateControl.html"), null, function (visual) {
           var wrap = document.createElement("div"),
               systemRoot = resourcesResolver.getSystemRootUrl();
           wrap.style["display"] = "inline-block";
           rin.util.assignAsInnerHTMLUnsafe(wrap, visual.replace(/SYSTEM_ROOT/g, systemRoot))
           loadedCallback(wrap);
       });
   });

/*!
* RIN Experience Provider JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Date: <placeholder for SDK release date>
*/

/// <reference path="../contracts/IExperienceStream.js" />

(function (rin) {
    // Behavior for expanding a overlay to fullscreen.
    var PopupBehavior = function (orchestrator) {
        this.orchestrator = orchestrator;

        // Execute this behavior on the assigned target.
        this.executeBehavior = function (behaviorArgs, completionCallback) {
            if (this.orchestrator.getPlayerConfiguration().activePopup) return; // we already have an active popup open. Cannot show another popup till other one is closed.
            var dataContext = behaviorArgs.DataContext;
            this.getItemESData(dataContext);
            var popup = new rin.PopupControl(this.orchestrator);
            popup.load(dataContext.esData, dataContext);

            $(popup).bind('onclose', function (e) {
                if (typeof (completionCallback) === 'function')
                    completionCallback();
            });
        };

        this.getItemESData = function (itemData) {
            if (itemData.esData === undefined) {
                itemData.esData = rin.internal.esDataGenerator.getExperienceStream(itemData);
            }
        };
    };

    rin.ext.registerFactory(rin.contracts.systemFactoryTypes.behaviorFactory, "MicrosoftResearch.Rin.Behaviors.Popup",
        function (orchestrator) {
            return new PopupBehavior(orchestrator);
        });
})(window.rin);
/// <reference path="../core/Common.js" />

// Behavior to seek the narrative to a specified time.
rin.interactionBehaviorService.registerInteractionBehavior("rin.interactionBehaviors.seekToHT", {
    execute: function (args, onCompleteCallback) {

        var playerState = args.orchestrator.getPlayerState();
        var url;
        if (args && args.sourceItem && args.sourceItem.url) {
            url = args.sourceItem.url;
        }
        else {
            if (args.sourceItem.seekTime !== undefined) {
                var shouldPlay = rin.contracts.playerState.playing || playerState == rin.contracts.playerState.inTransition;
                url = "http://default/?begin={0}&action={1}".rinFormat(args.sourceItem.seekTime, shouldPlay ? "play" : "pause");

            }
        }
        args.orchestrator.seekUrl(url);

        onCompleteCallback();
    }
});

// Behavior to seek the load a narrative in a popup
rin.interactionBehaviorService.registerInteractionBehavior("rin.interactionBehaviors.popup", {
    execute: function (args, onCompleteCallback) {

        var factoryFunction = rin.ext.getFactory(rin.contracts.systemFactoryTypes.behaviorFactory, "MicrosoftResearch.Rin.Behaviors.Popup");
        var popup = new factoryFunction(args.orchestrator);
        args.sourceItem.DataContext = args.sourceItem.data;
        popup.executeBehavior(args.sourceItem, onCompleteCallback);
    }
});

// Behavior to seek the narrative to a specified screenplay and offset.
rin.interactionBehaviorService.registerInteractionBehavior("rin.interactionBehaviors.seekToScreenplayOffset", {
    execute: function (args, onCompleteCallback) {

        var playerState = args.orchestrator.getPlayerState();
        if (playerState == rin.contracts.playerState.playing || playerState == rin.contracts.playerState.inTransition) {
            args.orchestrator.play(args.sourceItem.seekTime, args.sourceItem.screenplay);
        }
        else {
            args.orchestrator.pause(args.sourceItem.seekTime, args.sourceItem.screenplay);
        }

        onCompleteCallback();
    }
});

// Behavior to apply a well defined keyframe on the current ES
rin.interactionBehaviorService.registerInteractionBehavior("rin.interactionBehaviors.applyKeyframe", {
    execute: function (args, onCompleteCallback) {

        if (args.sourceES.displayKeyframe) {
            var kf = {
                "header": {
                    "offset": 0,
                    "holdDuration": 0.5
                },
                "data": {
                    "default": "<ZoomableMediaKeyframe Media_Type='SingleDeepZoomImage' Media_Source='R-1' Viewport_X='0.5923811970600481' Viewport_Y='0.29659771339558905' Viewport_Width='0.00025961484292674151' Viewport_Height='0.00014609263999044406' Highlight_Visible='false' Highlight_X='0' Highlight_Y='0' Highlight_Width='0' Highlight_Height='0' Highlight_Render_Style='NoHighlight' Highlight_Render_Attribs='' Media_AspRatio='0.53243931310913006'/>",
                    "TransitionTime": "<TransitionTime>0</TransitionTime>",
                    "PauseDuration": "<PauseDuration>0.5</PauseDuration>",
                    "keyframeThumbnail": "<Thumbnail>11a6ab9c-7cce-4c45-b4c4-bb45b6c44cdd_keyframe_cdd2ecd5-6e5f-45a7-b549-46d6bc835636.bmp</Thumbnail>"
                }
            };
            args.sourceES.displayKeyframe(kf);
        }

        onCompleteCallback();
    }
});
window.rin = window.rin || {};
rin.embeddedArtifacts = rin.embeddedArtifacts || {}

rin.embeddedArtifacts.utils = {};
rin.embeddedArtifacts.utils.Region = function() {
    this.center = {x:0,y:0};
    this.span = {x:0,y:0};
};

// Base class for embedded artifacts to abstract common methods.
// Its not a must to inherit this class for building an EA, but make sure you implement all required methods.
rin.embeddedArtifacts.EmbeddedArtifactBase = function (dataObject, resourceResolver) {
    this.resourceResolver = resourceResolver;
    this.dataObject = dataObject;
    this.zoomRange = dataObject.zoomRange || { from: 0, to: 1 };
    this.parameterRange = dataObject.parameterRange || { from: 0, to: 1 };
    this.visual = null; // Active DOM element for the visual of this EA
    this.visualLoadHelper = null;
    this.styleLoadHelper = null;
    this.interactionRequested = new rin.contracts.Event();
    this.layoutChanged = new rin.contracts.Event();
    this.anchoredOffset = dataObject.anchoredOffset || { x: 0, y: 0 };
    this.anchorCorner = dataObject.anchorCorner || "tl";
};

// Basic properties and methods for any EA
rin.embeddedArtifacts.EmbeddedArtifactBase.prototype = {
    visualLoadComplete:function () {
        this.raiseLayoutChanged();
    },

    // Set the source for the visual of this EA, this method can be called only if the source is a Url. If not you can set the visualLoadHelper and styleLoadHelper manually.
    setVisualSource: function (visualUrl, styleUrl) {
        this.visualLoadHelper = new rin.internal.AjaxDownloadHelper(visualUrl);
        this.styleLoadHelper = new rin.internal.AjaxDownloadHelper(styleUrl);
    },

    // Method bound to the click of an EA
    onClick: function () {
        this.interactionRequested.publish({actualEA:this});
    },

    // Method to ask the EA host to redraw all EAs
    raiseLayoutChanged : function(){
        if (this.visual) {
            this.layoutChanged.publish(this);
        }
    },

    resolverMediaUrl: function(url){
        if (url) {
            return url.indexOf("http") == 0 ? url : this.resourceResolver.resolveResource(url);
        } else { return null; }
    },

    // Method to recalculate the anchoring point of an EA. In case the anchoring point never changes after it is loaded, override this method and just return the anhoring point.
    getAnchoredOffset: function () {
        var offsetX = this.visual.anchorX,
            offsetY = this.visual.anchorY,
            visualHeight = this.visual.height || this.visual.clientHeight,
            visualWidth = this.visual.width || this.visual.clientWidth;

        if (offsetX <= 1 && offsetX >= -1) this.anchoredOffset.x = offsetX * visualWidth; // Anchor is specified in percentage if its between -1 and 1
        else this.anchoredOffset.x = offsetX;
        if (offsetY <= 1 && offsetY >= -1) this.anchoredOffset.y = offsetY * visualHeight;
        else this.anchoredOffset.y = offsetY;

        // Update anchor based on anchoring corner. 'tl' is default.
        if (this.anchorCorner === "bl")
            this.anchoredOffset.y += visualHeight;

        if (this.anchorCorner === "tr")
            this.anchoredOffset.x += visualWidth;

        if (this.anchorCorner === "br") {
            this.anchoredOffset.y += visualHeight;
            this.anchoredOffset.x += visualWidth;
        }

        return this.anchoredOffset;
    },

    setVolume: function (value) {
    },

    onPlayerStateChanged: function (state) {
        if (state.currentState == rin.contracts.playerState.pausedForExplore)
            this.isInPlayMode = false;
        else if (state.currentState == rin.contracts.playerState.playing)
            this.isInPlayMode = true;
    },
    isInPlayMode : null
};

// HotSpot EA
rin.embeddedArtifacts.HotSpot = function (dataObject, resourceResolver) {
    rin.embeddedArtifacts.HotSpot.parentConstructor.call(this, dataObject, resourceResolver);
    this.setVisualSource("embeddedArtifacts/HotSpot.html", "embeddedArtifacts/HotSpot.css");
    this.thumbnailUrl = this.resolverMediaUrl(dataObject.thumbnailUrl);
    this.text = dataObject.text || null;
}

rin.embeddedArtifacts.HotSpot.prototypeOverrides = {};

// Audio EA
rin.embeddedArtifacts.Audio = function (dataObject, resourceResolver) {
    rin.embeddedArtifacts.Audio.parentConstructor.call(this, dataObject, resourceResolver);
    var self = this;
    this.setVisualSource("embeddedArtifacts/Audio.html", "embeddedArtifacts/Audio.css");
    this.audioControl = document.createElement("audio");
    this.audioControl.preload = "auto";
    this.audioControl.src = this.resolverMediaUrl(dataObject.sourceFile);
    this.isEnvironmentalAudio = dataObject.isEnvironmental;

    // Constantly check if the audio is ready and update the state as necessary.
    var READY_STATE = 4,
        TIME_OUT = 500,
        readyStateCheckTimeout,
        readyStateCheck = function () {
            if (self.audioControl.readyState === READY_STATE) {
                clearTimeout(readyStateCheckTimeout);
                self.onLoadComplete();
            }
            else {
                readyStateCheckTimeout = setTimeout(readyStateCheck, TIME_OUT);
            }
        };
    this.audioControl.onerror = function () {
        if (readyStateCheckTimeout)
            clearTimeout(readyStateCheckTimeout);
    }
    readyStateCheck();
}

rin.embeddedArtifacts.Audio.prototypeOverrides = {
    // Method bound to the click of an EA
    onClick: function () {
        if (!this.isEnvironmentalAudio) {
            if (this.audioControl.paused)
                this.audioControl.play();
            else
                this.audioControl.pause();
        }
    },

    onLoadComplete: function () {
        if (this.isEnvironmentalAudio) {
            this.audioControl.loop = true;
            this.audioControl.autoplay = true;
            this.audioControl.controls = false;
        }
    },

    setVolume: function (value) {
        if (this.isEnvironmentalAudio) {
            //Check for playing and start if not
            if (value <= this.MIN_VOL) {
                this.audioControl.volume = 0;
                if (!this.audioControl.paused) {
                    this.audioControl.pause();
                }
            }
            else {
                this.audioControl.volume = Math.min(value, 1); //Max it to 1
                if (this.audioControl.paused) {
                    this.audioControl.play();
                }
            }
        }
    },

    MIN_VOL: 0.0001
};

// Video EA
rin.embeddedArtifacts.Video = function (dataObject, resourceResolver) {
    rin.embeddedArtifacts.Video.parentConstructor.call(this, dataObject, resourceResolver);
    this.setVisualSource("embeddedArtifacts/Video.html", "embeddedArtifacts/Video.css");
}
rin.embeddedArtifacts.Video.prototypeOverrides = {};

// Text with arrow EA
rin.embeddedArtifacts.TextWithArrow = function (dataObject) {
    rin.embeddedArtifacts.TextWithArrow.parentConstructor.call(this, dataObject);
    var self = this;
    this.setVisualSource("embeddedArtifacts/TextWithArrow.html", "embeddedArtifacts/TextWithArrow.css");

    this.text = dataObject.text || null;
    this.arrowLength = dataObject.arrowLength || 0;
    this.arrowDirection = dataObject.arrowDirection || null;
}

rin.embeddedArtifacts.TextWithArrow.prototypeOverrides = {
    // Update the anchoring details depending on the arrow length and arrow direction
    // TODO: This method deals with a lot of visual related stuff. Ideally this has to abstracted out to allow reusing the EA with other visuals.
    // This method helps avoiding lots of bindings in the UI. Bindings makes the app slower.
    updateLayout: function () {
        $(".rin_TWL_Arrow", self.visual).hide(); // Hide all arrows
        var visibleLineContainerClass;

        var box = $(".rin_TextWithLineContentContainer", this.visual);
        if (this.dataObject.backgroundColor)
            box.css("backgroundColor",this.dataObject.backgroundColor)
        if (this.dataObject.defaultInteractionBehavior)
            box.addClass("rin_TextWithLineWithLink");

        // set anchor based on the length and direction
        switch (self.arrowDirection) {
            case "tlu":
                self.visual.anchorX = -self.arrowLength;
                self.visual.anchorY = -self.arrowLength;
                self.anchorCorner = "tl";
                visibleLineContainerClass = "rin_TWL_TopLeft_Up";
                break;
            case "tld":
                self.visual.anchorX = -self.arrowLength;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "tl";
                visibleLineContainerClass = "rin_TWL_TopLeft_Down";
                break;
            case "tlh":
                self.visual.anchorX = -self.arrowLength;
                self.visual.anchorY = 0;
                self.anchorCorner = "tl";
                visibleLineContainerClass = "rin_TWL_TopLeft_Horizontal";
                break;
            case "tlv":
                self.visual.anchorX = 0;
                self.visual.anchorY = -self.arrowLength;
                self.anchorCorner = "tl";
                visibleLineContainerClass = "rin_TWL_TopLeft_Vertical";
                break;

            case "blu":
                self.visual.anchorX = -self.arrowLength;
                self.visual.anchorY = -self.arrowLength;
                self.anchorCorner = "bl";
                visibleLineContainerClass = "rin_TWL_BottomLeft_Up";
                break;
            case "bld":
                self.visual.anchorX = -self.arrowLength;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "bl";
                visibleLineContainerClass = "rin_TWL_BottomLeft_Down";
                break;
            case "blh":
                self.visual.anchorX = -self.arrowLength;
                self.visual.anchorY = 0;
                self.anchorCorner = "bl";
                visibleLineContainerClass = "rin_TWL_BottomLeft_Horizontal";
                break;
            case "blv":
                self.visual.anchorX = 0;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "bl";
                visibleLineContainerClass = "rin_TWL_BottomLeft_Vertical";
                break;

            case "bru":
                self.visual.anchorX = self.arrowLength;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "br";
                visibleLineContainerClass = "rin_TWL_BottomRight_Up";
                break;
            case "brd":
                self.visual.anchorX = self.arrowLength;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "br";
                visibleLineContainerClass = "rin_TWL_BottomRight_Down";
                break;
            case "brh":
                self.visual.anchorX = self.arrowLength;
                self.visual.anchorY = 0;
                self.anchorCorner = "br";
                visibleLineContainerClass = "rin_TWL_BottomRight_Horizontal";
                break;
            case "brv":
                self.visual.anchorX = 0;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "br";
                visibleLineContainerClass = "rin_TWL_BottomRight_Vertical";
                break;

            case "tru":
                self.visual.anchorX = self.arrowLength;
                self.visual.anchorY = -self.arrowLength;
                self.anchorCorner = "tr";
                visibleLineContainerClass = "rin_TWL_TopRight_Up";
                break;
            case "trd":
                self.visual.anchorX = self.arrowLength;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "tr";
                visibleLineContainerClass = "rin_TWL_TopRight_Down";
                break;
            case "trh":
                self.visual.anchorX = self.arrowLength;
                self.visual.anchorY = 0;
                self.anchorCorner = "tr";
                visibleLineContainerClass = "rin_TWL_TopRight_horizontal";
                break;
            case "trv":
                self.visual.anchorX = 0;
                self.visual.anchorY = self.arrowLength;
                self.anchorCorner = "tr";
                visibleLineContainerClass = "rin_TWL_TopRight_Vertical";
                break;
        }

        // Set height and width of the line container div
        var visibleLineContainer = $("." + visibleLineContainerClass);
        visibleLineContainer.show();
        visibleLineContainer.attr("width", self.arrowLength + "px");
        visibleLineContainer.attr("height", self.arrowLength + "px");

        // Update the translation in CSS so that the lines are correctly positioned even after the length is changed.
        if (parseFloat(visibleLineContainer.css("top")) > 0) visibleLineContainer.css("top", self.arrowLength + "px");
        else if (parseFloat(visibleLineContainer.css("top")) < 0) visibleLineContainer.css("top", -self.arrowLength + "px");
        if (parseFloat(visibleLineContainer.css("left")) > 0) visibleLineContainer.css("left", self.arrowLength + "px");
        else if (parseFloat(visibleLineContainer.css("left")) < 0) visibleLineContainer.css("left", -self.arrowLength + "px");
        if (parseFloat(visibleLineContainer.css("bottom")) > 0) visibleLineContainer.css("bottom", self.arrowLength + "px");
        else if (parseFloat(visibleLineContainer.css("bottom")) < 0) visibleLineContainer.css("bottom", -self.arrowLength + "px");
        if (parseFloat(visibleLineContainer.css("right")) > 0) visibleLineContainer.css("right", self.arrowLength + "px");
        else if (parseFloat(visibleLineContainer.css("right")) < 0) visibleLineContainer.css("right", -self.arrowLength + "px");

        // Update the line SVG height and width
        var lineSvg = $(".rin_TWL_Line", visibleLineContainer);
        var svgContainer = $("svg", visibleLineContainer);
        svgContainer.attr("width", self.arrowLength + "px");
        svgContainer.attr("height", self.arrowLength + "px");

        // Update the line itself according to the new length.
        if (lineSvg.attr("x1") > 0) lineSvg.attr("x1", self.arrowLength);
        else if (lineSvg.attr("x1") < 0) lineSvg.attr("x1", -self.arrowLength);
        if (lineSvg.attr("x2") > 0) lineSvg.attr("x2", self.arrowLength);
        else if (lineSvg.attr("x2") < 0) lineSvg.attr("x2", -self.arrowLength);
        if (lineSvg.attr("y1") > 0) lineSvg.attr("y1", self.arrowLength);
        else if (lineSvg.attr("y1") < 0) lineSvg.attr("y1", -self.arrowLength);
        if (lineSvg.attr("y2") > 0) lineSvg.attr("y2", self.arrowLength);
        else if (lineSvg.attr("y2") < 0) lineSvg.attr("y2", -self.arrowLength);
    },

    // Update anchor based of arrow direction and length
    visualLoadComplete: function () {
        this.updateLayout();
        this.raiseLayoutChanged();
    }
}

// Label EA
rin.embeddedArtifacts.Label = function (dataObject, resourceResolver) {
    rin.embeddedArtifacts.Label.parentConstructor.call(this, dataObject, resourceResolver);
    this.setVisualSource("embeddedArtifacts/Label.html", "embeddedArtifacts/Label.css");
    this.text = dataObject.text || null;
    this.linkType = dataObject.linkType;
}
rin.embeddedArtifacts.Label.prototypeOverrides = {
    visualLoadComplete: function () {
        if (this.dataObject.defaultInteractionBehavior) {
            $visual = $(this.visual);
            switch (this.dataObject.defaultInteractionBehavior) {
                case "rin.interactionBehaviors.seekToHT":
                    $visual.addClass("rin_LabelArtifactLink");
                    break;
                case "rin.interactionBehaviors.popup":
                    $visual.addClass("rin_LabelArtifactPopup");
                    break;
            }
            if (this.dataObject.linkType) {
                $visual.addClass('rin_Label_' + this.dataObject.linkType);
                $visual.addClass('rin_Label_Interactive');
            }
        }
    },
    getAnchoredOffset: function () {
        if (this.dataObject.anchoredOffset) // Consider if offset is set explicitly.
            return { x: this.anchoredOffset.x * this.visual.clientWidth, y: this.anchoredOffset.y * this.visual.clientHeight };
        else if (this.dataObject.linkType == "peakLabel") // Use bottom center for peak labels
            return { x: 0.5 * this.visual.clientWidth, y: 1.0 * this.visual.clientHeight };
        else // Use default
            return this.anchoredOffset;
    }
};

rin.util.extend(rin.embeddedArtifacts.EmbeddedArtifactBase,rin.embeddedArtifacts.HotSpot);
rin.util.overrideProperties(rin.embeddedArtifacts.HotSpot.prototypeOverrides, rin.embeddedArtifacts.HotSpot.prototype);

rin.util.extend(rin.embeddedArtifacts.EmbeddedArtifactBase, rin.embeddedArtifacts.Audio);
rin.util.overrideProperties(rin.embeddedArtifacts.Audio.prototypeOverrides, rin.embeddedArtifacts.Audio.prototype);

rin.util.extend(rin.embeddedArtifacts.EmbeddedArtifactBase, rin.embeddedArtifacts.Video);
rin.util.overrideProperties(rin.embeddedArtifacts.Video.prototypeOverrides, rin.embeddedArtifacts.Video.prototype);

rin.util.extend(rin.embeddedArtifacts.EmbeddedArtifactBase, rin.embeddedArtifacts.Label);
rin.util.overrideProperties(rin.embeddedArtifacts.Label.prototypeOverrides, rin.embeddedArtifacts.Label.prototype);

rin.util.extend(rin.embeddedArtifacts.EmbeddedArtifactBase, rin.embeddedArtifacts.TextWithArrow);
rin.util.overrideProperties(rin.embeddedArtifacts.TextWithArrow.prototypeOverrides, rin.embeddedArtifacts.TextWithArrow.prototype);

jQuery.fn.extend({
    rinTouchGestures: function (callback, options) {
        var swipeMinDistance = 20,
            swipeMaxDistance = $(window).width() * 0.8,
            swipeMinDelay = 50,
            swipeMaxDelay = 1000,
            doubleTapMinDelay = 50,
            doubleTapMaxDelay = 1000,
            longTapDelay = 1000;

        var captureGestures = {
            preventDefaults: true,
            swipe: true,
            doubleTap: false,
            longTap: false,
            simpleTap: false
        };

        options = options || captureGestures;

        for (var key in captureGestures) {
            if (typeof options[key] == "undefined") options[key] = captureGestures[key];
        }

        return this.each(function () {

            var gestureStartTime = null,
            lastTap = 0,
            longTapTimer = null,
            asLongTap = false;

            var startCoords = { x: 0, y: 0 };
            var endCoords = { x: 0, y: 0 };

            $(this).bind("touchstart mousedown", onGestureStart);

            if (options.swipe)
                $(this).bind("touchmove mousemove", onGestureMove);

            $(this).bind("touchend mouseup", onGestureEnd);

            function onGestureStart(e) {
                if (options.longTap) {
                    window.clearTimeout(longTapTimer);
                    asLongTap = false;
                    longTapTimer = window.setTimeout(
                        function () {
                            longTapEvent(e)
                        }
                        , longTapDelay);
                }

                gestureStartTime = (new Date).getTime();
                getCoordinates(startCoords, e);
                endCoords.x = 0;
                endCoords.y = 0;
            }

            function longTapEvent(e) {
                asLongTap = true;
                lastTap = 0;
                return callback.call(this, e, { gesture: 'longtap' });
            }

            function onSimpleTap(e) {
                if (options.longTap) {
                    window.clearTimeout(longTapTimer);
                }
                return callback.call(this, e, { gesture: 'simpletap' });
            }

            function onGestureMove(e) {
                if (options.preventDefaults) {
                    e.preventDefault();
                }
                if (options.longTap) {
                    window.clearTimeout(longTapTimer);
                }
                getCoordinates(endCoords, e);
            }

            function onGestureEnd(e) {
                var now = (new Date).getTime();

                if (options.preventDefaults) {
                    e.preventDefault();
                }
                if (options.longTap) {
                    window.clearTimeout(longTapTimer);
                    if (asLongTap) {
                        return false;
                    }
                }


                if (options.doubleTap) {
                    var delay = now - lastTap;
                    lastTap = now;
                    if ((delay > doubleTapMinDelay) && (delay < doubleTapMaxDelay)) {
                        lastTap = 0;
                        return callback.call(this, e, { gesture: 'doubletap', delay: delay });
                    }
                }

                if (options.swipe) {
                    var coords = {};
                    coords.delay = now - gestureStartTime;
                    coords.deltaX = endCoords.x - startCoords.x;
                    coords.deltaY = startCoords.y - endCoords.y;

                    absX = Math.abs(coords.deltaX);
                    absY = Math.abs(coords.deltaY);

                    coords.distance = (absX < absY) ? absY : absX;
                    coords.direction = (absX < absY) ? ((coords.deltaY < 0) ? 'down' : 'up') : (((coords.deltaX < 0) ? 'left' : 'right'));

                    if (endCoords.x != 0
                        && (coords.distance > swipeMinDistance)
                        && (coords.distance < swipeMaxDistance)
                        && (coords.delay > swipeMinDelay)
                        && (coords.delay < swipeMaxDelay)
                        ) {
                        lastTap = 0;
                        coords.gesture = 'swipe';
                        return callback.call(this, e, coords);
                    }
                }

                if (options.simpleTap)
                    onSimpleTap(e);
            }

            function getCoordinates(coords, e) {
                if (e.originalEvent !== undefined && e.originalEvent.targetTouches !== undefined && e.originalEvent.targetTouches.length > 0) {
                    coords.x = e.originalEvent.targetTouches[0].clientX;
                    coords.y = e.originalEvent.targetTouches[0].clientY;
                }
                else {
                    coords.x = e.clientX;
                    coords.y = e.clientY;
                }
            }
        });
    }
});

/// <reference path="../core/Common.js" />

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

//--Loads a JSON collection
rin.internal.JSONLoader = {
    loadJSON: function (jsonUrl, onsuccess, onerror, loadCachedCopy) {
        var cachedCopy = true;

        if (typeof loadCachedCopy !== undefined)
            cachedCopy = loadCachedCopy;
        
        var options = {
            url: jsonUrl,
            dataType: "json",
            cache: cachedCopy,
            error: function (jqxhr, textStatus, errorThrown) {
                onerror(errorThrown, jsonUrl);
            },
            success: function (data, textStatus, jqxhr) {
                onsuccess(data, jsonUrl);
            }
        };
        $.ajax(options);
    },
    //--Processes a JSON Collection, by creating lists for binding from the group/item dictionaries
    processCollectionJSON: function (jsonUrl, collectionData, resourceResolver, resolveIncludes) {
        //--properties to look out for to call resolveResourceReference on
        var properties = new rin.internal.List("thumbnailMedia", "src", "largeMedia", "smallMedia");
        collectionData.groupsList = rin.util.getDictionaryValues(collectionData.layout.groups);

        var lastSlashPos = jsonUrl.lastIndexOf("/");
        var rootUrl = jsonUrl.substr(0, lastSlashPos);

        var groupIndex = 0;
        collectionData.groupsList.foreach(function (group) {
            group.itemsList = rin.util.getDictionaryValues(group.items);
            group.itemsList.foreach(function (item) {
                if (resolveIncludes) {
                    if (item.includes) {
                        var itemToInclude = rin.util.deepCopy(collectionData.items[item.includes]);
                        rin.util.overrideProperties(item, itemToInclude); //This keeps the overriden properties in item as such
                        rin.util.overrideProperties(itemToInclude, item); //This copies missing data back to item
                    }
                }
                properties.foreach(function (property) {
                    //--resolve resource reference
                    if (item.hasOwnProperty(property) && item[property].lastIndexOf("http", 0) !== 0) {
                        item[property] = rin.util.combinePathElements(rootUrl, item[property]);
                    }
                });
                item.groupIndex = groupIndex;
            });
            groupIndex++;
        });

        for (var itemId in collectionData.items) {
            var item = collectionData.items[itemId];
            properties.foreach(function (property) {
                //--resolve resource reference
                if (item.hasOwnProperty(property) && item[property].lastIndexOf("http", 0) !== 0) {
                    item[property] = rin.util.combinePathElements(rootUrl, item[property]);
                }
            });
        }

        return collectionData;
    }
};
/*!
* RIN Core JavaScript Library v1.0
* http://research.microsoft.com/rin
*
* Copyright 2012-2013, Microsoft Research
* <placeholder for RIN License>
*
* Generates a narrative dynamically on the fly, 
* using a JSON object as datacontext
* Constraints: The following fields are expected in the json datacontext.
* 1. Estimated duration [duration or largeMediaDuration] of the narrative or the ES(in case of video, audio or a rin).
* 2. Any new ES providers not part of the current rin project has to be specified in [srcType]
* 3. Default aspect ratio is set to Widescreem, if there is a need for a differen one specify it in [aspectRatio]
* 4. If the Experiencestream has to have any keyframes, specify it in [keyframes]
* 5. If the resource urls [src] are relative urls, remember to specify the rootUrl in [rootUrl]
* 6. Multiple resource urls if required by the ES cannot be provided as of now. Capability to be added if necessary.
* Date: <placeholder for SDK release date>
*/

window.rin = window.rin || {};
window.rin.internal = window.rin.internal || {};

rin.internal.esDataGenerator = {
    _narrativeData: {
        "version": 1.0,
        "defaultScreenplayId": "SCP1",
        "screenplayProviderId": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
        "data": {
            "narrativeData": {
                "guid": "6aa09d19-cf2b-4c8e-8b57-7ea8701794f7",
                "aspectRatio": "$ASPECTRATIO$",
                "estimatedDuration": "$DURATION$",
                "branding": null
            }
        },
        "providers": {
            "$ESPROVIDER$": {
                "name": "$ESPROVIDER$",
                "version": 0.0
            },
            "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter": {
                "name": "MicrosoftResearch.Rin.DefaultScreenPlayInterpreter",
                "version": 0.0
            }
        },
        "resources": {
            "R-1": {
                "uriReference": "$RESOURCEREF$"
            }
        },
        "experiences": {
            "$ESID$": {
                "providerId": "$ESPROVIDER$",
                "data": {
                    "markers": {
                        "beginAt": '$STARTOFFSET$',
                        "endAt": '$ENDOFFSET$'
                    }
                },
                "resourceReferences": [
                        {
                            "resourceId": "R-1",
                            "required": true
                        }
                    ],
                "experienceStreams": {
                    "defaultStream": {
                        "duration": "0",
                        "data": {
                            "ContentType": "<$CONTENTTYPE$/>"
                        },
                        "keyframes": ["$KEYFRAMES$"]
                    }
                }
            }
        },
        "screenplays": {
            "SCP1": {
                "data": {
                    "experienceStreamReferences": [
					{
					    "experienceId": "$ESID$",
					    "experienceStreamId": "defaultStream",
					    "begin": "0",
					    "duration": "$DURATION$",
					    "layer": "foreground",
					    "dominantMedia": "visual",
					    "volume": '$VOLUME$'
					}]
                }
            }
        }
    },
    esSrcTypeToProviderDictionary: {
        "singledeepzoomimage": "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
        "deepzoomimage": "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
        "zoomableimage": "MicrosoftResearch.Rin.ImageExperienceStream",
        "image": "MicrosoftResearch.Rin.ImageExperienceStream",
        "zoomablevideo": "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
        "zoomablemediacollection": "MicrosoftResearch.Rin.ZoomableMediaExperienceStream",
        "video": "MicrosoftResearch.Rin.VideoExperienceStream",
        "audio": "MicrosoftResearch.Rin.AudioExperienceStream",
        "pivot": "MicrosoftResearch.Rin.PivotExperienceStream",
        "xps": "MicrosoftResearch.Rin.DocumentViewerExperienceStream",
        "photosynth": "MicrosoftResearch.Rin.PhotosynthES",
        "collection": "MicrosoftResearch.Rin.RinTemplates.$THEME$TwoDTemplateES",
        "collectiononed": "MicrosoftResearch.Rin.RinTemplates.$THEME$OneDTemplateES",
        "wall": "MicrosoftResearch.Rin.WallExperienceStream",
        "map": "MicrosoftResearch.Rin.MapExperienceStream"
    },
    getExperienceStream: function (context, themeName) {
        if (context === undefined)
            return;
        var esData = JSON.stringify(this._narrativeData);
        var providerName = this.esSrcTypeToProviderDictionary[context.srcType.toLowerCase()] || context.srcType;
        var keyframeData = context.keyframes || "";
        var aspectratio = context.aspectRatio || "None";
        var duration = context.duration || context.largeMediaDuration || context.smallMediaDuration || 0;
        var startOffset = context.largeMediaStartOffset || context.smallMediaStartOffset || 0;
        var endOffset = startOffset + duration;
        providerName = providerName.replace("$THEME$", themeName || "Metro");

        var esId = (context.id || "") + "_ES_" + Math.floor(Math.random() * 1000).toString() + "_Popup";

        esData = this.replaceAll('$ESID$', esId, esData);
        esData = this.replaceAll("$ESPROVIDER$", providerName, esData);
        esData = esData.replace('$RESOURCEREF$', context.src)
                       .replace('$CONTENTTYPE$', context.srcType)
                       .replace('$ASPECTRATIO$', aspectratio)
                       .replace('$DURATION$', duration)
                       .replace('$DURATION$', duration)
                       .replace('$STARTOFFSET$', startOffset)
                       .replace('$ENDOFFSET$', endOffset)
                       .replace('$VOLUME$', context.volume || 1)
                       .replace("$KEYFRAMES$", keyframeData);
        var esDataJSON = rin.util.parseJSON(esData);
        esDataJSON.id = esId;

        return esDataJSON;
    },

    replaceAll: function (find, replace, str) {
        return str.split(find).join(replace);
    }
};


