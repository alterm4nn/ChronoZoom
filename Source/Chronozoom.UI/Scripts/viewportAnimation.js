globalAnimationID = 1;

/*the animation of zooming and panning where the animation speed is proportinal to the "distance" to target visible region
to make animation work one must call setTargetViewport method before requesting any animation frames
@param startViewport (Viewport2D) The state of the viewport at the begining of the animation
*/
function PanZoomAnimation(startViewport) {
    this.isForciblyStoped = false;
    this.ID = globalAnimationID++;
    var startVisible = startViewport.visible;

    this.velocity = 0.001; //affects animation speed, is to be overrided by the viewportController according to settings.js file

    this.isActive = true;  //are more animation frames needed
    this.type = "PanZoom";

    this.startViewport = new Viewport2d( //deep copy of the startViewport
                    startViewport.aspectRatio,
                    startViewport.width,
                    startViewport.height,
                    new VisibleRegion2d(startVisible.centerX, startVisible.centerY, startVisible.scale)
                );
    this.estimatedEndViewport; //an estimated state of the viewport at the end of the animation

    //estinmated start and end visible centers in the screen coordinate system of a start viewport 
    this.endCenterInSC;
    this.startCenterInSC = this.startViewport.pointVirtualToScreen(startVisible.centerX, startVisible.centerY);

    //previous animation frame is prepared according to current viewport state
    this.previousFrameCenterInSC = this.startCenterInSC;
    this.previousFrameViewport = this.startViewport;
    this.prevFrameTime = new Date();

    //visible center moving direction in the screen coodinate of the start viewport
    this.direction;
    this.pathLeng;

    //updates the target viewport
    //the method sets the previous frame as a start animation frame and do all calculation with a respect of that    
    //@param estimatedEndViewport   (Viewport2D)    a new target state of the viewport that must be achieved at the end of the animation
    this.setTargetViewport = function (estimatedEndViewport) {
        this.estimatedEndViewport = estimatedEndViewport;

        var prevVis = this.previousFrameViewport.visible;

        this.startViewport = new Viewport2d(
                    this.previousFrameViewport.aspectRatio,
                    this.previousFrameViewport.width,
                    this.previousFrameViewport.height,
                    new VisibleRegion2d(prevVis.centerX, prevVis.centerY, prevVis.scale)
                ); //previous frame becomes the first one

        //updating all coordinates according to the screen coodinate system of new start Viewport
        this.startCenterInSC = this.startViewport.pointVirtualToScreen(prevVis.centerX, prevVis.centerY);
        this.previousFrameCenterInSC = {
            x: this.startCenterInSC.x,
            y: this.startCenterInSC.y
        };
        var estimatedVisible = this.estimatedEndViewport.visible;
        this.endCenterInSC =
            this.startViewport.pointVirtualToScreen(estimatedVisible.centerX, estimatedVisible.centerY);

        this.direction = {
            X: this.endCenterInSC.x - this.startCenterInSC.x,
            Y: this.endCenterInSC.y - this.startCenterInSC.y
        };

        var dirX = this.direction.X;
        var dirY = this.direction.Y;

        this.pathLeng = Math.sqrt(dirX * dirX + dirY * dirY);

        //if the target viewport center is close to the current one setting zero vector as a direction
        if (this.pathLeng < 1e-1) {
            this.direction.X = this.direction.Y = 0;

            if (estimatedVisible.scale == prevVis.scale)//if the scales are the same as well the animation can be stoped
                this.isActive = false;
        }
        else {
            this.direction.X /= this.pathLeng; //normalizing rhe direction vector
            this.direction.Y /= this.pathLeng;
        }
    }


    //returns the viewport visible to be set on the next animation frame
    this.produceNextVisible = function (currentViewport) {
        //determining current state of the viewport
        var currentCenterInSC = this.startViewport.pointVirtualToScreen(currentViewport.visible.centerX, currentViewport.visible.centerY);
        var currScale = currentViewport.visible.scale;

        var startVisible = this.startViewport.visible;

        var curTime = new Date();
        var timeDiff = curTime.getTime() - this.prevFrameTime.getTime();
        var k = this.velocity * timeDiff;  //coeffecient is proportional to the time passed from the previous frame        

        var dx = this.endCenterInSC.x - this.previousFrameCenterInSC.x;
        var dy = this.endCenterInSC.y - this.previousFrameCenterInSC.y;

        var curDist = Math.max(1.0, //to keep minimal speed
            Math.sqrt(dx * dx + dy * dy)); //the distance to the target visible region

        //updating previous frame info. This will be returned as the requested animation frame
        var prevFrameVisible = this.previousFrameViewport.visible;
        var updatedVisible = new VisibleRegion2d(
        prevFrameVisible.centerX,
        prevFrameVisible.centerY,
        prevFrameVisible.scale
        );
        this.previousFrameCenterInSC.x += curDist * k * this.direction.X;
        this.previousFrameCenterInSC.y += curDist * k * this.direction.Y;
        updatedVisible.scale += (this.estimatedEndViewport.visible.scale - updatedVisible.scale) * k;
        this.prevFrameTime = curTime;


        //calculating distance to the start point of the animation
        dx = this.previousFrameCenterInSC.x - this.startCenterInSC.x;
        dy = this.previousFrameCenterInSC.y - this.startCenterInSC.y;

        var distToStart = Math.sqrt(dx * dx + dy * dy);
        var scaleDistToStart = this.estimatedEndViewport.visible.scale - startVisible.scale;
        var scaleDistCurrent = updatedVisible.scale - startVisible.scale;
        if ((distToStart >= this.pathLeng) //if we moved beyond the target point we must stop
        || Math.abs(scaleDistCurrent) > Math.abs(scaleDistToStart) //if we changed the scale more than needed we must stop
        ) {
            //we have reach the target visible. stop
            this.isActive = false;
            return this.estimatedEndViewport.visible;
        };

        var virtPoint = this.startViewport.pointScreenToVirtual(this.previousFrameCenterInSC.x, this.previousFrameCenterInSC.y);

        updatedVisible.centerX = virtPoint.x;
        updatedVisible.centerY = virtPoint.y;

        this.previousFrameViewport.visible = updatedVisible;

        return updatedVisible;
    }
}


/* Implements an "optimal" animated zoom/pan path between two view rectangles.
Based on the paper "Smooth and efficient zooming and panning" by Jarke j. van Wijk and Wim A.A. Nuij
@param startVisible   (visible2d) a viewport visible region from which the elliptical zoom starts
@param endVisible     (visible2d) a viewport visible region that will be reached at the end of elliptical zoom animation
*/
function EllipticalZoom(startVisible, endVisible) {
    this.isForciblyStoped = false;
    this.ID = globalAnimationID++;
    this.type = "EllipticalZoom";
    this.isActive = true;
    this.targetVisible = new VisibleRegion2d(endVisible.centerX, endVisible.centerY, endVisible.scale);
    this.startTime = (new Date()).getTime();

    this.imprecision = 0.0001; // Average imprecision in pathlength when centers of startVisible and endVisible visible regions are the same.

    function cosh(x) {
        return (Math.exp(x) + Math.exp(-x)) / 2;
    }

    function sinh(x) {
        return (Math.exp(x) - Math.exp(-x)) / 2;
    }

    function tanh(x) {
        return sinh(x) / cosh(x);
    }

    //is used in the visible center point coordinates calculation according the article
    //@param s    (number)  chenges between [0;this.S]
    this.u = function (s) {
        var val = this.startScale / Math.pow(this.ro, 2) * cosh(this.r0) * tanh(this.ro * s + this.r0) - this.startScale / Math.pow(this.ro, 2) * sinh(this.r0) + this.u0;
        return val;
    }

    //calculates the scale of the visible region taking t parameter that indicates the requid position in the transition curve
    //@param t   (number)       changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
    this.scale = function (t) {
        return this.startScale * cosh(this.r0) / cosh(this.ro * (t * this.S) + this.r0);
    }

    //calculates the "x" component of the visible center point at the requested moment of the animation
    //@param t    (number)      changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
    this.x = function (t) {
        return startPoint.X + (endPoint.X - startPoint.X) / this.pathLen * this.u(t * this.S);
    }

    //calculates the "y" component of the visible center point at the requested moment of the animation
    //@param t    (number)      changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
    this.y = function (t) {
        return startPoint.Y + (endPoint.Y - startPoint.Y) / this.pathLen * this.u(t * this.S);
    }    

    // Returns the visible region for the animation frame according to the current viewport state
    //param currentViewport (viewport2d) the parameter is ignored in this type of animation. the calculation is performed using only current time
    this.produceNextVisible = function (currentViewport) {
        var curTime = (new Date()).getTime();
        var t;

        if (this.duration > 0)
            t = Math.min(1.0, (curTime - this.startTime) / this.duration); //projecting current time to the [0;1] interval of the animation parameter
        else
            t = 1.0;

        // Change t value for accelereation and decceleration effect.
        t = animationEase(t);

        if (t == 1.0) { //the end of the animation. marking the animation as finished
            this.isActive = false;
        }

        return new VisibleRegion2d(
            this.x(t),
            this.y(t),
            this.scale(t));
    }

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

    var ro = 0.1 * ellipticalZoomZoomoutFactor; //is set from settings.js
    this.ro = ro;
    var u0 = 0;
    this.u0 = u0;
    var u1 = this.pathLen;
    this.startPoint = startPoint;
    this.startScale = startScale;
    this.endPoint = endPoint;
    this.endScale = endScale;

    //Centers of startVisible and endVisible visible regions are not equal.
    if (Math.abs(u0 - u1) > this.imprecision) {
        var uDiff = u0 - u1;
        var b0 = (endScale * endScale - startScale * startScale + Math.pow(ro, 4) * uDiff * uDiff) /
            (2 * startScale * ro * ro * (-uDiff));
        var b1 = (endScale * endScale - startScale * startScale - Math.pow(ro, 4) * uDiff * uDiff) /
            (2 * endScale * ro * ro * (-uDiff));

        //calculating parameters for further animation frames calculation

        this.r0 = Math.log(-b0 + Math.sqrt(b0 * b0 + 1));
        if (this.r0 == -Infinity) //happens when the double precision of r0 calculation yields infinity
            this.r0 = -Math.log(2 * b0); //instead approximating with the first element of the teylor series

        this.r1 = Math.log(-b1 + Math.sqrt(b1 * b1 + 1));
        if (this.r1 == -Infinity)  // the same reaction on Infinity as in r0 calculation
            this.r1 = -Math.log(2 * b1);

        this.S = (this.r1 - this.r0) / ro;
        this.duration = ellipticalZoomDuration / 300 * this.S; //300 is a number to make animation eye candy. Please adjust ellipticalZoomDuration in settings.js instead of 300 constant here.
    }
    else {//special case of i0 == u1, overridding methods
        var logScaleChange = Math.log(Math.abs(endScale - startScale)) + 10;
        if (logScaleChange < 0)
            this.isActive = false;

        //This coefficient helps to avoid constant duration value in cases when centers of endVisible and startVisible are the same
        var scaleDiff = 0.5;

        //Avoid divide by zero situations.
        if (endScale !== 0 || startScale !== 0) {
            //This value is almost the same in all cases, when we click to infodot and then click to main content item and vice versa.
            scaleDiff = Math.min(endScale, startScale) / Math.max(endScale, startScale);
        }

        //no animation is required, if start and end scales are the same.
        if (scaleDiff === 1) { 
            this.isActive = false;
        }

        this.duration = ellipticalZoomDuration * scaleDiff * 0.2;

        this.x = function (s) { return this.startPoint.X; }
        this.y = function (s) { return this.startPoint.Y; }
        this.scale = function (s) {
            return this.startScale + (this.endScale - this.startScale) * s;
        }
    }
}

//function to make animation EaseInOut. [0,1] -> [0,1]
//@param t    (number)      changes between [0;1]. 0 coresponds to the beginig of the animatoin. 1 coresponds to the end of the animation
function animationEase(t) {
    return -2 * t * t * t + 3 * t * t;
}