// Creates an instance of VisibleRegion.
// @param centerX, centerY  (number)     center point of visible rectangle (in virtual coordinates)
// @param scale             (number)     how many time units in a single screen pixel (time unit/pixel)
function VisibleRegion2d(centerX, centerY, scale) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.scale = scale;
}

// Creates an instance of Viewport2d.
// @param aspectRatio      (number)    how many h-units are in a single time unit
// @param width, height    (number)    sizes of the visible region (in screen coordinates)
// @param visible          (VisibleRegion2d) describes the visible region
// @remarks Virtual coordinate system is R^2 space, axis X goes to the right, axis Y goes down.
// Screen coordinate system: origin is the left-top corner of a viewport and X goes to the right, Y goes down.
// Viewport is a physical window where we render virtual canvas,
// (width,height) is a size of a viewport window in pixels.
// Visible describes the same window in the virtual space.
function Viewport2d(aspectRatio, width, height, visible) {
    this.aspectRatio = aspectRatio;
    this.visible = visible;
    this.width = width;
    this.height = height;

    // Converts pixels in h-units 
    // @param wp    (number)    Amount of pixels
    // @returns amount of h-units 
    this.widthScreenToVirtual = function (wp) {
        return this.visible.scale * wp;
    };
    // Converts pixels in t-units 
    // @param hp    (number)    Amount of pixels
    // @returns amount of t-units
    this.heightScreenToVirtual = function (hp) {
        return this.aspectRatio * this.visible.scale * hp;
    };
    // Converts h-units into pixels 
    // @param wv    (number)    Amount of h-units
    // @returns amount of pixels 
    this.widthVirtualToScreen = function (wv) {
        return wv / this.visible.scale;
    };
    // Converts t-units into pixels 
    // @param hv    (number)    Amount of t-units
    // @returns amount of pixels 
    this.heightVirtualToScreen = function (hv) {
        return hv / (this.aspectRatio * this.visible.scale);
    };
    // Converts a vector of a virtual space into screen space.
    // @param vx    (number)    Amount of t-units
    // @param vy    (number)    Amount of h-units
    // @returns     ({x:number, y:number})  vector (in screen pixels) 
    this.vectorVirtualToScreen = function (vx, vy) {
        return {
            x: vx / this.visible.scale,
            y: vy / (this.aspectRatio * this.visible.scale)
        };
    };
    // Converts a point of a virtual space into screen space.
    // @param px    (number)    Coordinate in t-units
    // @param py    (number)    Coordinate in h-units
    // @returns     ({x:number, y:number})  vector (in screen pixels) 
    this.pointVirtualToScreen = function (px, py) {
        return {
            x: (px - this.visible.centerX) / this.visible.scale + this.width / 2.0,
            y: (py - this.visible.centerY) / (this.aspectRatio * this.visible.scale) + this.height / 2.0
        };
    };
    // Converts a point of a virtual space into screen space.
    // @param vx    (number)    Coordinate in t-units
    // @param vy    (number)    Coordinate in h-units
    // @returns     ({x:number, y:number})  vector (t-units,h-units) 
    this.pointScreenToVirtual = function (px, py) {
        return {
            x: (px - this.width / 2.0) * this.visible.scale + this.visible.centerX,
            y: this.visible.centerY - (this.height / 2.0 - py) * (this.aspectRatio * this.visible.scale)
        };
    };
    // Converts a vector of a virtual space into screen space.
    // @param vx    (number)    Amount of t-units
    // @param vy    (number)    Amount of h-units
    // @returns     ({x:number, y:number})  vector (t-units,h-units)
    this.vectorScreenToVirtual = function (px, py) {
        return {
            x: px * this.visible.scale,
            y: this.aspectRatio * this.visible.scale * py
        };
    };
}

