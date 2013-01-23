//Gesture for performing Pan operation
//Take horizontal and vertical offset in screen coordinates
//@param src    Source of gesture stream. ["Mouse", "Touch"]
function PanGesture(xOffset, yOffset, src) {
    this.Type = "Pan";
    this.Source = src;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
}

//Gesture for perfoming Zoom operation
//Takes zoom origin point in screen coordinates and scale value
function ZoomGesture(xOrigin, yOrigin, scaleFactor, src) {
    this.Type = "Zoom";
    this.Source = src;
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.scaleFactor = scaleFactor;
}

//Gesture for performing Stop of all
//current transitions and starting to performing new
function PinGesture(src) {
    this.Type = "Pin";
    this.Source = src;
}


/*****************************************
* Gestures for non touch based devices   *
* mousedown, mousemove, mouseup          *
* xbrowserwheel                          *
******************************************/

//Subject that converts input mouse events into Pan gestures 
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

//Subject that converts input mouse events into Pin gestures
function createPinSubject(vc) {
    var mouseDown = vc.toObservable("mousedown");

    return mouseDown.Select(function (md) {
        return new PinGesture("Mouse");
    });
}

//Subject that converts input mouse events into Zoom gestures 
function createZoomSubject(vc) {

    vc.mousewheel(function (objEvent, intDelta) {
        var event = jQuery.Event("xbrowserwheel");
        event.delta = intDelta;
        event.origin = getXBrowserMouseOrigin(vc, objEvent)
        vc.trigger(event);
    });

    var mouseWheel = vc.toObservable("xbrowserwheel");

    var mouseWheels = mouseWheel.Zip(mouseWheel, function (arg) {
        return new ZoomGesture(arg.origin.x, arg.origin.y, arg.delta > 0 ? 1 / zoomLevelFactor : 1 * zoomLevelFactor, "Mouse");
    });

    var mousedblclick = vc.toObservable("dblclick");

    var mousedblclicks = mousedblclick.Zip(mousedblclick, function (event) {
        var origin = getXBrowserMouseOrigin(vc, event);
        return new ZoomGesture(origin.x, origin.y, 1.0 / zoomLevelFactor, "Mouse");
    });

    //return mouseWheels.Merge(mousedblclicks); //disabling mouse double clicks, as it causes strange behavior in conjection with elliptical zooming on the clicked item.
    return mouseWheels;
}


/*********************************************************
* Gestures for iPad (or any webkit based touch browser)  *
* touchstart, touchmove, touchend, touchcancel           *
* gesturestart, gesturechange, gestureend                *  
**********************************************************/

//Subject that converts input touch events into Pan gestures
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

//Subject that converts input touch events into Pin gestures
function createTouchPinSubject(vc) {
    var touchStart = vc.toObservable("touchstart");

    return touchStart.Select(function (ts) {
        return new PinGesture("Touch");
    });
}

//Subject that converts input touch events into Zoom gestures
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


/**************************************************************
* Gestures for IE on Win8                                     *
* MSPointerUp, MSPointerDown                                  *
* MSGestureStart, MSGestureChange, MSGestureEnd, MSGestureTap *
***************************************************************/

//Subject that converts input touch events (on win8+) into Pan gestures
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

//Subject that converts input touch events (on win8+) into Pin gestures
function createTouchPinSubjectWin8(vc) {
    var pointerDown = vc.toObservable("MSPointerDown");

    return pointerDown.Select(function (gt) {
        return new PinGesture("Touch");
    });
}

//Subject that converts input touch events (on win8+) into Zoom gestures
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

var vcGestureObject;
function addPointerToGesture(evt) {
    vcGestureObject.addPointer(evt.pointerId);
}

//Creates gestures stream for specified jQuery element
function getGesturesStream(source) {
    var panController;
    var zoomController;
    var pinController;

    if (window.navigator.msPointerEnabled) {
        var vc = document.getElementById("vc");
        vcGestureObject = new MSGesture();
        vcGestureObject.target = vc;
        vc.addEventListener("MSPointerMove", addPointerToGesture, false);

        // win 8
        panController = createTouchPanSubjectWin8(source);
        var zoomControllerTouch = createTouchZoomSubjectWin8(source);
        var zoomControllerMouse = createZoomSubject(source);
        zoomController = zoomControllerTouch.Merge(zoomControllerMouse);
        pinController = createTouchPinSubjectWin8(source);
    }
    else if ('ontouchstart' in document.documentElement) {
        // webkit browser
        panController = createTouchPanSubject(source);
        zoomController = createTouchZoomSubject(source);
        pinController = createTouchPinSubject(source);
    } else {
        // no touch support, only mouse events
        panController = createPanSubject(source);
        zoomController = createZoomSubject(source);
        pinController = createPinSubject(source);
    }

    return pinController.Merge(panController.Merge(zoomController));
}

//modify the gesture stream to apply the logic of gesture handling by the axis
function applyAxisBehavior(gestureSequence) {
    return gestureSequence
    .Where(function (el) { return el.Type != "Zoom" }) //skipping zooms
    .Select(function (el) { //setting any vertical movement to zero
        if (el.Type == "Pan")
            el.yOffset = 0;
        return el;
    });
}