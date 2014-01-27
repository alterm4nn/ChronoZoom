var CZ;
(function (CZ) {
    (function (Gestures) {
        function PanGesture(xOffset, yOffset, src) {
            this.Type = "Pan";
            this.Source = src;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
        }

        function ZoomGesture(xOrigin, yOrigin, scaleFactor, src) {
            this.Type = "Zoom";
            this.Source = src;
            this.xOrigin = xOrigin;
            this.yOrigin = yOrigin;
            this.scaleFactor = scaleFactor;
        }

        function PinGesture(src) {
            this.Type = "Pin";
            this.Source = src;
        }

        function createPanSubject(vc) {
            var _doc = $(document);

            var mouseDown = vc.toObservable("mousedown");
            var mouseMove = vc.toObservable("mousemove");
            var mouseUp = _doc.toObservable("mouseup");

            var mouseMoves = mouseMove.Skip(1).Zip(mouseMove, function (left, right) {
                return new PanGesture(left.clientX - right.clientX, left.clientY - right.clientY, "Mouse");
            });

            var stopPanning = mouseUp;

            var mouseDrags = mouseDown.SelectMany(function (md) {
                return mouseMoves.TakeUntil(stopPanning);
            });

            return mouseDrags;
        }

        function createPinSubject(vc) {
            var mouseDown = vc.toObservable("mousedown");

            return mouseDown.Select(function (md) {
                return new PinGesture("Mouse");
            });
        }

        function createZoomSubject(vc) {
            vc.mousewheel(function (event, delta, deltaX, deltaY) {
                var xevent = $.Event("xbrowserwheel");
                xevent.delta = delta;
                xevent.origin = CZ.Common.getXBrowserMouseOrigin(vc, event);
                vc.trigger(xevent);
            });

            var mouseWheel = vc.toObservable("xbrowserwheel");

            var mouseWheels = mouseWheel.Zip(mouseWheel, function (arg) {
                return new ZoomGesture(arg.origin.x, arg.origin.y, arg.delta > 0 ? 1 / CZ.Settings.zoomLevelFactor : 1 * CZ.Settings.zoomLevelFactor, "Mouse");
            });

            var mousedblclick = vc.toObservable("dblclick");

            var mousedblclicks = mousedblclick.Zip(mousedblclick, function (event) {
                var origin = CZ.Common.getXBrowserMouseOrigin(vc, event);
                return new ZoomGesture(origin.x, origin.y, 1.0 / CZ.Settings.zoomLevelFactor, "Mouse");
            });

            return mouseWheels;
        }

        function createTouchPanSubject(vc) {
            var _doc = $(document);

            var touchStart = vc.toObservable("touchstart");
            var touchMove = vc.toObservable("touchmove");
            var touchEnd = _doc.toObservable("touchend");
            var touchCancel = _doc.toObservable("touchcancel");

            var gestures = touchStart.SelectMany(function (o) {
                return touchMove.TakeUntil(touchEnd.Merge(touchCancel)).Skip(1).Zip(touchMove, function (left, right) {
                    return { "left": left.originalEvent, "right": right.originalEvent };
                }).Where(function (g) {
                    return g.left.scale === g.right.scale;
                }).Select(function (g) {
                    return new PanGesture(g.left.pageX - g.right.pageX, g.left.pageY - g.right.pageY, "Touch");
                });
            });

            return gestures;
        }

        function createTouchPinSubject(vc) {
            var touchStart = vc.toObservable("touchstart");

            return touchStart.Select(function (ts) {
                return new PinGesture("Touch");
            });
        }

        function createTouchZoomSubject(vc) {
            var _doc = $(document);

            var gestureStart = vc.toObservable("gesturestart");
            var gestureChange = vc.toObservable("gesturechange");
            var gestureEnd = _doc.toObservable("gestureend");
            var touchCancel = _doc.toObservable("touchcancel");

            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd.Merge(touchCancel)).Skip(1).Zip(gestureChange, function (left, right) {
                    return { "left": left.originalEvent, "right": right.originalEvent };
                }).Where(function (g) {
                    return g.left.scale !== g.right.scale && g.right.scale !== 0;
                }).Select(function (g) {
                    var delta = g.left.scale / g.right.scale;
                    return new ZoomGesture(o.originalEvent.layerX, o.originalEvent.layerY, 1 / delta, "Touch");
                });
            });

            return gestures;
        }

        function createTouchPanSubjectWin8(vc) {
            var gestureStart = vc.toObservable("MSGestureStart");
            var gestureChange = vc.toObservable("MSGestureChange");
            var gestureEnd = vc.toObservable("MSGestureEnd");

            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd).Skip(1).Zip(gestureChange, function (left, right) {
                    return { "left": left.originalEvent, "right": right.originalEvent };
                }).Where(function (g) {
                    return g.left.scale === g.right.scale && g.left.detail != g.left.MSGESTURE_FLAG_INERTIA && g.right.detail != g.right.MSGESTURE_FLAG_INERTIA;
                }).Select(function (g) {
                    return new PanGesture(g.left.offsetX - g.right.offsetX, g.left.offsetY - g.right.offsetY, "Touch");
                });
            });

            return gestures;
        }

        function createTouchPinSubjectWin8(vc) {
            var pointerDown = vc.toObservable("MSPointerDown");

            return pointerDown.Select(function (gt) {
                return new PinGesture("Touch");
            });
        }

        function createTouchZoomSubjectWin8(vc) {
            var gestureStart = vc.toObservable("MSGestureStart");
            var gestureChange = vc.toObservable("MSGestureChange");
            var gestureEnd = vc.toObservable("MSGestureEnd");

            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd).Where(function (g) {
                    return g.originalEvent.scale !== 0 && g.originalEvent.detail != g.originalEvent.MSGESTURE_FLAG_INERTIA;
                }).Select(function (g) {
                    return new ZoomGesture(o.originalEvent.offsetX, o.originalEvent.offsetY, 1 / g.originalEvent.scale, "Touch");
                });
            });

            return gestures;
        }

        var gesturesDictionary = [];
        function addMSGestureSource(dom) {
            gesturesDictionary.forEach(function (child) {
                if (child === dom) {
                    return;
                }
            });

            gesturesDictionary.push(dom);

            dom.addEventListener("MSPointerDown", function (e) {
                if (dom.gesture === undefined) {
                    var newGesture = new MSGesture();
                    newGesture.target = dom;
                    dom.gesture = newGesture;
                }

                dom.gesture.addPointer(e.pointerId);
            }, false);
        }
        ;

        function getGesturesStream(source) {
            var panController;
            var zoomController;
            var pinController;

            if (window.navigator.msPointerEnabled && window.MSGesture) {
                addMSGestureSource(source[0]);

                panController = createTouchPanSubjectWin8(source);
                var zoomControllerTouch = createTouchZoomSubjectWin8(source);
                var zoomControllerMouse = createZoomSubject(source);
                zoomController = zoomControllerTouch.Merge(zoomControllerMouse);
                pinController = createTouchPinSubjectWin8(source);
            } else if ('ontouchstart' in document.documentElement) {
                panController = createTouchPanSubject(source);
                zoomController = createTouchZoomSubject(source);
                pinController = createTouchPinSubject(source);
            } else {
                panController = createPanSubject(source);
                zoomController = createZoomSubject(source);
                pinController = createPinSubject(source);
            }

            return pinController.Merge(panController.Merge(zoomController));
        }
        Gestures.getGesturesStream = getGesturesStream;

        function getPanPinGesturesStream(source) {
            var panController;
            var pinController;

            if (window.navigator.msPointerEnabled && window.MSGesture) {
                addMSGestureSource(source[0]);

                panController = createTouchPanSubjectWin8(source);
                var zoomControllerTouch = createTouchZoomSubjectWin8(source);
                var zoomControllerMouse = createZoomSubject(source);
                pinController = createTouchPinSubjectWin8(source);
            } else if ('ontouchstart' in document.documentElement) {
                panController = createTouchPanSubject(source);
                pinController = createTouchPinSubject(source);
            } else {
                panController = createPanSubject(source);
                pinController = createPinSubject(source);
            }

            return pinController.Merge(panController.Select(function (el) {
                el.yOffset = 0;
                return el;
            }));
        }
        Gestures.getPanPinGesturesStream = getPanPinGesturesStream;

        function applyAxisBehavior(gestureSequence) {
            return gestureSequence.Where(function (el) {
                return el.Type != "Zoom";
            }).Select(function (el) {
                if (el.Type == "Pan")
                    el.yOffset = 0;
                return el;
            });
        }
        Gestures.applyAxisBehavior = applyAxisBehavior;
    })(CZ.Gestures || (CZ.Gestures = {}));
    var Gestures = CZ.Gestures;
})(CZ || (CZ = {}));
