//Gesture for performing Pan operation
//Take horizontal and vertical offset in screen coordinates
function PanGesture(xOffset, yOffset) {
    this.Type = "Pan";
    this.xOffset = xOffset;
    this.yOffset = yOffset;
}

//Gesture for perfoming Zoom operation
//Takes zoom origin point in screen coordinates and scale value
function ZoomGesture(xOrigin, yOrigin, scaleFactor) {
    this.Type = "Zoom";
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.scaleFactor = scaleFactor;
}

//Gesture for performing Stop of all
//current transitions and starting to performing new
function PinGesture() {
    this.Type = "Pin";
}

//Subject that converts input mouse events into Pan gestures 
function createPanSubject(vc) {

    var _doc = $(document);

    var mouseDown = vc.toObservable("mousedown");
    var mouseMove = vc.toObservable("mousemove");
    var mouseUp = _doc.toObservable("mouseup");

    var mouseMoves = mouseMove.Skip(1).Zip(mouseMove, function (left, right) {
        return new PanGesture(left.clientX - right.clientX, left.clientY - right.clientY);
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
        return new PinGesture();
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
        return new ZoomGesture(arg.origin.x, arg.origin.y, arg.delta > 0 ? 1 / zoomLevelFactor : 1 * zoomLevelFactor);
    });

    var mousedblclick = vc.toObservable("dblclick");

    var mousedblclicks = mousedblclick.Zip(mousedblclick, function (event) {
        var origin = getXBrowserMouseOrigin(vc, event);
        return new ZoomGesture(origin.x, origin.y, 1.0 / zoomLevelFactor);
    });

    //return mouseWheels.Merge(mousedblclicks); //disabling mouse double clicks, as it causes strange behavior in conjection with elliptical zooming on the clicked item.
    return mouseWheels;
}

//Creates gestures stream for specified jQuery element
function getGesturesStream(source) {
    var panController = createPanSubject(source);
    var zoomController = createZoomSubject(source);
    var pinController = createPinSubject(source);
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