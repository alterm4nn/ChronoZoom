/**
 * Back-end for ink drawing. Instance created in InkES. In InkES, we need them to follow artworks.
 * Uses the RaphaelJS library for svg manipulation.
 * @param canvId        the id of the div to which we'll assign the Raphael canvas.
 * @param html_elt      in the case that the div above is not in the dom yet, send in a variable for its html element.
 */

var tagInk = function (canvId, html_elt) {
    "use strict";

    // set up the Raphael paper/canvas
    var that = {};
    var canvid = canvId,
        html_elt = (html_elt) ? html_elt : $("#" + canvid)[0],
        domelement = $(html_elt),
        textElt,
        paper = Raphael(html_elt, "100%", "100%");
    
    // Enum defining ink modes
    var InkMode = {
        shapes: 0, //shape manipulation
        draw: 1,
        erase: 2,
        text: 5,
    };

    // brush variables
    var penColor = "#000000",
        penOpacity = 1.0,
        penWidth = 4,
        eraserWidth = 5,
        ml = [], //path M/L values (see svg path format)
        xy = [], //path coordinates; each entry has an x and y property
        pa = [], //path attributes
        pathObjects = [],
        currpaths = ""; //this will be the string representing all of our paths; to get the paths individually, split at 'M'


    // ellipse/rectangle variables
    var shapeStrokeColor = "#ffffff",
        shapeStrokeOpacity = 0.7,
        shapeStrokeWidth = 5,
        shapeFillColor = "#000000",
        shapeFillOpacity = 0;

    // block/isolate variables
    var marqueeFillColor = "#000000",
        marqueeFillOpacity = 0.8,
        trans_mode = 'isolate',
        transCoords = [],
        transLetters = [],
        trans_currpath = "",
        bounding_shapes = "";

    // text variables
    var fontFamily = "'Times New Roman', serif",
        fontColor = "#ffffff",
        fontSize = '12px',
        fontOpacity = 1.0,
        textboxid = "textbox",
        outerdivid = "outerdiv",
        lastText = "",
        svgText,
        magX = domelement.width(),
        magY = domelement.height();

    // misc variables
    var inktrack = null,
        calling_file = 'inkes',
        marquees = [], // old marquees
        click = false, // has the mouse been clicked?
        datastring = "",
        mode = InkMode.draw,
        enabled = true, //attached ink tracks by default
        initKeyframe = {},
        artName = "",
        EID = "", // rin experience id (name of the ink track)
        oldScale = 1,
        firstTimeThrough = 2,
        inkPannedX,
        inkPannedY;

    // set up the coordinates for adjustViewBox
    var viewerElt = ($("#rinplayer").length) ? $("#rinplayer") : $("#rinPlayer"),
        origPaperX = 0, // original coordinates of the paper (match with rinContainer)
        origPaperY = 0,
        origPaperW = viewerElt.width(),
        origPaperH = viewerElt.height(),
        origpx = 0, // original coordinates of the artwork
        origpy = 0,
        origpw = 0,
        origph = 0,
        lastpx = 0, // most recent coordinates of the artwork
        lastpy = 0,
        lastpw = 0,
        lastph = 0,
        lastcx = 0, // most recent coordinates of the "virtual canvas" which helps us place inks correctly
        lastcy = 0, // the virtual canvas is where the Raphael canvas would be if it were moving with the artwork
        lastcw = origPaperW,
        lastch = origPaperH,
        oldOpac = 0; // keeps track of whether an ink is on screen or not

    that.canvid = canvId;
    $("#" + canvid + " svg").css("position", "absolute");

    // methods //

    /** KEEP
     * Pans and resizes all inks to move with the artwork. Uses the initial keyframe of the artwork (converted here to absolute coordinates) and the
     * inputted dimensions to compute deltas and scale factors. Once we have these, first pan to (0,0), then scale, then pan to pos+deltas.
     * @param dims   the current dimensions of our artwork in absolute coordinates
     */
    function adjustViewBox(dims, no_opac_check) {
        var new_px = dims.x,
            new_py = dims.y,
            new_pw = dims.width,
            new_ph = dims.height,
            real_kfw, real_kfh, real_kfx, real_kfy;
        // convert weird deeepzoom keyframe coordinates to absolute coordinates
        real_kfw = origPaperW / initKeyframe.w; // deepzoom keyframe width is what we multiply the absolute width of art by to get width of viewer
        real_kfh = real_kfw * (new_ph / new_pw); // deepzoom keyframe height is kind of confusing, so use width * (1 / aspect_ratio of art)
        real_kfx = -initKeyframe.x * real_kfw; // deepzoom keyframe x times absolute width of art is what we must translate art by to reach the left of viewer
        real_kfy = -initKeyframe.y * real_kfw; // (WEIRD -- seems to place too high if use -kfy * real_kfh)

        // if the new position is not trivially different from the old position, pan and zoom
        if (nontrivial({ x: new_px, y: new_py, w: new_pw, h: new_ph }, { x: lastpx, y: lastpy, w: lastpw, h: lastph })) {
            //var eid_elt = $("[ES_ID='" + EID + "']");
            var lambda_w = origPaperW / real_kfw;
            var lambda_h = origPaperH / real_kfh;
            var nvw = new_pw * lambda_w; // nv*: dimensions of the new virtual canvas (where the ink canvas would be if we were panning and zooming it with the artwork)
            var nvh = new_ph * lambda_h;
            var nvx = (nvw / origPaperW) * (origPaperX - real_kfx) + new_px;
            var nvy = (nvh / origPaperH) * (origPaperY - real_kfy) + new_py;

            var SW = nvw / lastcw; // scale factor in x direction
            // var SH = nvh / lastch; // scale factor in y direction (in case we ever have non-aspect-ratio-preserving scaling)

            oldScale = new_pw / origpw;
            // oldScaleH = new_ph / origph; // in case we ever have non-aspect-ratio-preserving scaling

            if (!transCoords.length || trans_mode === 'block') { // for all ink types except isolates (can't just resize the window for them)
                var newwid = origPaperW / oldScale;
                var newhei = origPaperH / oldScale;
                paper.setViewBox(-nvx / oldScale, -nvy / oldScale, newwid, newhei); // see raphael documentation
            }
            else {
                var cw = domelement.width();
                var ch = domelement.height();
                magX = cw;
                magY = ch;
                panObjects(-lastcx / origPaperW, -lastcy / origPaperH, { cw: cw, ch: ch }, 0); // no need to draw updated ink yet
                resizeObjects(SW, SW); // still no need, since we still have to pan
                panObjects(nvx / origPaperW, nvy / origPaperH, { cw: cw, ch: ch }, 1);
            }

            // reset coordinates
            lastcx = nvx;
            lastcy = nvy;
            lastcw = nvw;
            lastch = nvh;
            lastpx = new_px;
            lastpy = new_py;
            lastpw = new_pw;
            lastph = new_ph;
        }
    }
    that.adjustViewBox = adjustViewBox;

    /** KEEP
     * Convert a string representing a block transparency to one representing an isolate transparency.
     * Block/isolate is determined by the fill property of the svg element. If we draw the path counterclockwise (rather than clockwise)
     * and also draw a path around the whole canvas, the in-between space will be filled and we will get an isolate transparency. This
     * method reverses the given path and adds the aforementioned outer path.
     * @param pth    the path to reverse
     * @return    reversed path (with outer path)
     */
    function block_to_isol(pth) {
        var new_pth = "";
        var segs = [""];
        var parsed_pth = Raphael.parsePathString(pth);
        var num_array = [];
        var mstart = 0;
        var ctr = 0;
        var cw = viewerElt.width();
        var ch = viewerElt.height();

        // iterate through in reverse order
        for (var i = parsed_pth.length - 2; i >= 0; i--) {
            if (parsed_pth[i][0] == "z") {
                new_pth += "M" + num_array[0] + "," + num_array[1];
                for (var j = 2; j < num_array.length; j++) {
                    new_pth += ((j % 6 == 2) ? ("C" + num_array[j]) : (num_array[j]));
                    new_pth += ((j % 6 != 1) ? (",") : "");
                }
                new_pth += "z";
                num_array.length = 0;
                num_array = []; // every time we hit a close-path command ('z'), restart num_array for new path
            }
            else if (parsed_pth[i][0] == "M") {
                num_array.push(parsed_pth[i][1]);
                num_array.push(parsed_pth[i][2]);
            }
            else {
                num_array.push(parsed_pth[i][5]);
                num_array.push(parsed_pth[i][6]);
                num_array.push(parsed_pth[i][3]);
                num_array.push(parsed_pth[i][4]);
                num_array.push(parsed_pth[i][1]);
                num_array.push(parsed_pth[i][2]);
            }
        }

        // manually add the last path, since there is no 'z' at the start of our pathstring
        new_pth += "M" + num_array[0] + "," + num_array[1];
        for (var j = 2; j < num_array.length; j++) {
            new_pth += ((j % 6 == 2) ? ("C" + num_array[j]) : (num_array[j]));
            new_pth += ((j % 6 != 1) ? (",") : "");
        }
        new_pth += "z";
        new_pth += "M-5,-5L" + (cw + 5) + ",-5L" + (cw + 5) + "," + (ch + 5) + "L-5," + (ch + 5) + "L-5,-5z"; // outer path
        return new_pth;
    }
    that.block_to_isol = block_to_isol;

    /** KEEP
     * Uses the arrays ml, xy, and pa to draw paths with the correct properties.
     * First clears the canvas of existing paths, then draws new ones.
     */
    function drawPaths() {
        var cw = viewerElt.width();
        var ch = viewerElt.height();
        var paths = "";
        var cpaths = "";
        var len = pathObjects.length;
        for (var i = 0; i < len; i++) { //removes paths from canvas
            pathObjects[i].remove();
        }
        pathObjects.length = 0;
        for (var i = 0; i < ml.length; i++) { //construct the paths
            if (ml[i] === 'M') {
                paths += "PATH::[pathstring]"; // the paths to be drawn now
                cpaths += "PATH::[pathstring]"; // the paths we will save for our datastring (in relative coordinates)
            }
            paths += ml[i] + (cw * xy[i][0]) + ',' + (ch * xy[i][1]); // absolute coords
            cpaths += ml[i] + (xy[i][0]) + ',' + (xy[i][1]); // relative coords
            if (ml[i + 1] != 'L') {
                // if we're here, we've reached the end of a path, so add style information to the path strings
                paths += "[stroke]" + pa[i].color + "[strokeo]" + pa[i].opacity + "[strokew]" + (ch * pa[i].width) + "[]|";
                cpaths += "[stroke]" + pa[i].color + "[strokeo]" + pa[i].opacity + "[strokew]" + pa[i].width + "[]|";
            }
        }
        var path = [];
        if (paths.length > 0) {
            path = paths.split('PATH::');
        }
        for (var i = 1; i < path.length; i++) {
            var pstring = get_attr(path[i], "pathstring", "s");
            var strokec = get_attr(path[i], "stroke", "s");
            var strokeo = get_attr(path[i], "strokeo", "f");
            var strokew = get_attr(path[i], "strokew", "f");
            var drawing = paper.path(pstring); // draw the path to the canvas
            drawing.data("type", "path");
            drawing.attr({
                "stroke-width": strokew,
                "stroke-opacity": strokeo,
                "stroke": strokec,
                "stroke-linejoin": "round",
                "stroke-linecap": "round"
            });
            pathObjects.push(drawing);
        }
        currpaths = cpaths; // currpaths is used in update_datastring as the string representing all paths on the canvas
        //update_datastring();
    }
    that.drawPaths = drawPaths;

    /** KEEP
     * A helper function to draw transparencies. Takes the arrays transLetters (representing the
     * svg path commands in the transparency string) and transCoords (corresponding locations on the
     * canvas in relative coordinates) and draws the appropriate type of transparency to the canvas.
     * If the type is 'isolate,' calls block_to_isol, which reverses the path and adds an outer path
     * around the canvas to fill the in-between space.
     */
    function drawTrans() {
        remove_all(); // be careful that this method isn't called unless the type of the ink is 'trans'!
        var cw = domelement.width();
        var ch = domelement.height();
        var path = "";
        var ind = 0;
        // iterate through the transLetters array and create our svg path accordingly
        for (var i = 0; i < transLetters.length; i++) {
            if (transLetters[i] == "M" || transLetters[i] == "L") { // if M or L, add next two coords to the path
                path += transLetters[i] + (transCoords[ind] * cw) + "," + (transCoords[ind + 1] * ch);
                ind += 2;
            }
            else if (transLetters[i] == "C") {
                path += "C" + (transCoords[ind] * cw);
                for (var k = 1; k < 6; k++) { // if C, add next six coords to the path (coords represent bezier curve)
                    path += "," + ((k % 2) ? (transCoords[ind + k] * ch) : (transCoords[ind + k] * cw));
                }
                ind += 6;
            }
            else if (transLetters[i] == "z") // if z, close the path
                path += "z"
            else
                console.log("ELSE: " + transLetters[i]);
        }
        var final_path = path;
        if (trans_mode == 'isolate') // if the mode is 'isolate,' reverse the path and add an outer path
            final_path = block_to_isol(path);
        var trans = paper.path(final_path).attr({ "fill": marqueeFillColor, "fill-opacity": marqueeFillOpacity, "stroke-width": 0 }).data("type", "trans");
        trans_currpath = "TRANS::[path]" + path + "[color]" + marqueeFillColor + "[opac]" + marqueeFillOpacity + "[mode]" + trans_mode + "[]";
        update_datastring(); // this call might be unnecessary
    }
    that.drawTrans = drawTrans;

    /** KEEP
     * Takes in a datastring and parses for a certain attribute by splitting at "[" and "]" (these surround
     * attribute names).
     * NOTE if errors are coming from this function, could be that the datastring is empty...
     * @param str        the datastring
     * @param attr       the attribute we'll parse for
     * @param parsetype  'i' (int), 's' (string), or 'f' (float)
     * @return  the value of the attribute in the correct format
     */
    function get_attr(str, attr, parsetype) {
        if (parsetype === "f") {
            return parseFloat(str.split("[" + attr + "]")[1].split("[")[0]);
        } else if (parsetype === "s") {
            return str.split("[" + attr + "]")[1].split("[")[0];
        } else {
            return parseInt(str.split("[" + attr + "]")[1].split("[")[0]);
        }
    }
    that.get_attr = get_attr;

    /** KEEP
     * Loads an ink onto the ink canvas using its datastring (e.g. from track data).
     * @param   the datastring to be loaded (see update_datastring for datastring format)
     */
    function loadInk(datastr) {
        var shapes = datastr.split("|");
        var i;
        var cw = domelement.width();
        var ch = domelement.height();
        magX = cw;
        magY = ch;
        var shapes_len = shapes.length;
        for (i = 0; i < shapes_len; i++) {
            var shape = shapes[i];
            if (shape && (shape != "")) {
                var type = shape.split("::")[0];
                switch (type.toLowerCase()) {
                    case "text":
                        // format: [str]<text>[font]<font>[fontsize]<fontsize>[color]<font color>[x]<x>[y]<y>[]
                        var size = get_attr(shape, "fontsize", "f") * ch;
                        fontSize = size;
                        var x = get_attr(shape, "x", "f") * cw;
                        var y = get_attr(shape, "y", "f") * ch;
                        var w, h;
                        try {
                            w = get_attr(shape, 'w', 'f');
                            h = get_attr(shape, 'h', 'f');
                        } catch (err) {
                            w = null;
                            h = null;
                        }
                        var text_color = get_attr(shape, "color", "s");
                        var text_font = get_attr(shape, "font", "s");
                        var text_text = get_attr(shape, "str", "s");
                        var text = paper.text(x, y, text_text);
                        text.attr({
                            "font-family": text_font,
                            "font-size": size + "px",
                            "fill": text_color,
                            "text-anchor": "start",
                        });
                        text.data({
                            "x": x,
                            "y": y,
                            'w': w,
                            'h': h,
                            "fontsize": size,
                            "color": text_color,
                            "font": text_font,
                            "type": "text",
                            "str": text_text,
                        });
                        textElt = text;
                        break;
                    case "path":
                        // format: [pathstring]M284,193L284,193[stroke]000000[strokeo]1[strokew]10[]
                        if (!currpaths) {
                            currpaths = "";
                        }
                        currpaths += shape + "|";
                        update_ml_xy_pa(shape + "|");
                        break;
                    case "trans":
                        // format: [path]<path>[color]<color>[opac]<opac>[mode]<block or isolate>[]
                        if (!trans_currpath) {
                            trans_currpath = "";
                        }
                        trans_currpath += shape + "|";
                        var pathstring = get_attr(shape, "path", 's');
                        marqueeFillColor = get_attr(shape, "color", 's');
                        marqueeFillOpacity = get_attr(shape, "opac", "f");
                        trans_mode = get_attr(shape, "mode", 's');
                        transCoords = pathstring.match(/[0-9.\-]+/g);
                        transLetters = pathstring.match(/[CMLz]/g);
                        drawTrans();
                        break;
                    default:
                        console.log("Using deprecated ink types: " + type.toLowerCase() + ".");
                        break;
                }
            }
        }
        drawPaths();

        // force adjustViewBox to run so viewbox is always set 
        //lastpx = origpx + 10000;
        if (enabled) {
            paper.setViewBox(0, 0, cw, ch);
            //adjustViewBox({ x: origpx, y: origpy, width: origpw, height: origph });
        }
    }
    that.loadInk = loadInk;

    /** KEEP
     * Helper function to determine whether p1 and p2 are effectively the same point. Returns true if so.
     */
    function nontrivial(p1, p2) {
        return ((Math.abs(p1.x - p2.x) > 0.00000001) || (Math.abs(p1.y - p2.y) > 0.00000001) || (Math.abs(p1.w - p2.w) > 0.00000001) || (Math.abs(p1.h - p2.h) > 0.00000001));
    }
    that.nontrivial = nontrivial;

    /** KEEP
     * Pans all objects in the canvas by dx, dy.
     * @param dx, dy    the deltas
     * @param draw      should we take time to draw the objects?
     */
    function panObjects(dx, dy, canv_dims, draw) {
        var cw = canv_dims.cw;
        var ch = canv_dims.ch;
        paper.forEach(function (elt) { // first take care of panning rects, ellipses, and texts by changing their attributes
            var type = elt.data("type");
            if (type === "text") {
                elt.attr({
                    'x': parseFloat(elt.attr("x")) + dx * cw,
                    'y': parseFloat(elt.attr("y")) + dy * ch,
                });
                elt.data('x', parseFloat(elt.data("x")) + dx * cw);
                elt.data('y', parseFloat(elt.data("y")) + dy * ch);
                inkPannedX = elt.attr('x');
                inkPannedY = elt.attr('y');
            }
        });

        // pan paths by modifying xy
        var xylen = xy.length;
        for (var i = 0; i < xylen; i++) {
            xy[i][0] = xy[i][0] + dx;
            xy[i][1] = xy[i][1] + dy;
        }

        // pan transparencies by modifying transCoords
        var tclen = transCoords.length;
        for (var i = 0; i < tclen; i++) {
            transCoords[i] += ((i % 2) ? dy : dx);
        }

        // if type is drawing, call drawPaths if necessary
        if (xylen && draw) {
            drawPaths();
        }

        // if type is transparency, call drawTrans if ncecessary
        if (tclen && draw) {
            drawTrans();
        }

        // if the type of our ink is a text, redraw (if necessary) by just removing all and loading the datastring back in
        if (!xylen && !tclen && draw) {
            var dstring = update_datastring();
            remove_all();
            datastring = dstring;
            loadInk(datastring);
        }
    }
    that.panObjects = panObjects;

    /** KEEP
     * Helper function to convert to relative coordinates.
     * @param abs_coord   the absolute coordinate
     * @param canv_dim    the relevant canvas dimension to scale by
     */
    function rel_dims(abs_coord, canv_dim) {
        return parseFloat(abs_coord) / parseFloat(canv_dim);
    }
    that.rel_dims = rel_dims;

    /** KEEP
     * Removes all Raphael elements from the canvas and clears arrays
     */
    function remove_all() {
        paper.clear();
        ml.length = 0;
        xy.length = 0;
        pa.length = 0;
        pathObjects.length = 0;
        marquees.length = 0;
        currpaths = "";
        datastring = '';
    }
    that.remove_all = remove_all;

    /** KEEP
     * Resizes all elements in the ink canvas.
     * @param scale_x, scale_y   the scale factors to resize by
     * @param draw               should we take the time to draw the result?
     */
    function resizeObjects(scale_x, scale_y, draw) {
        paper.forEach(function (elt) { // resize ellipses, rects, and texts by scaling attributes
            var type = elt.data("type");
            if (type === "text") {
                elt.attr({
                    'font-size': parseFloat(elt.attr("font-size")) * scale_y,
                    'x': elt.attr("x") * scale_x,
                    'y': elt.attr("y") * scale_y,
                });
                elt.data({
                    'fontsize': elt.data("fontsize") * scale_y,
                    'x': elt.data("x") * scale_x,
                    'y': elt.data("y") * scale_y,
                });
            }
        });

        // resize paths by scaling elements of xy
        var xylen = xy.length;
        for (var i = 0; i < xylen; i++) {
            xy[i][0] = xy[i][0] * scale_x;
            xy[i][1] = xy[i][1] * scale_y;
            pa[i].width = pa[i].width * scale_x;
        }

        // resize transparencies by scaling elements of transCoords
        var tclen = transCoords.length;
        for (var i = 0; i < tclen; i++) {
            transCoords[i] *= ((i % 2) ? scale_y : scale_x);
        }

        // call drawPaths or drawTrans to update paths and transparencies, respectively, if need be
        if (xylen && draw)
            drawPaths();
        if (tclen && draw)
            drawTrans();

        // update texts if need by by calling remove_all and then loading in the datastring
        if (!xylen && !tclen && draw) {
            var dstring = update_datastring();
            remove_all();
            datastring = dstring;
            loadInk(datastring);
        }
    }
    that.resizeObjects = resizeObjects;

    /** KEEP
     * Set the variables related to adjustViewBox (original artwork location) using the art proxy,
     * which keeps track of its dimensions
     */
    function retrieveOrigDims() {
        var proxy = $("[data-proxy='" + artName + "']");
        var kfx = initKeyframe.x;
        var kfy = initKeyframe.y;
        var kfw = initKeyframe.w;
        var real_kfw = origPaperW / kfw;
        var real_kfh = real_kfw * (proxy.data("h") / proxy.data("w"));
        var real_kfx = -kfx * real_kfw;
        var real_kfy = -kfy * real_kfh;
        origpx = real_kfx;
        origpy = real_kfy;
        origpw = real_kfw;
        origph = real_kfh;
        lastpx = origpx;
        lastpy = origpy;
        lastpw = origpw;
        lastph = origph;
    }
    that.retrieveOrigDims = retrieveOrigDims;

    /** KEEP
     * Setter for the artname of a linked ink's associated artwork
     */
    function setArtName(name) {
        artName = name;
    }
    that.setArtName = setArtName;

    /** KEEP
     * Setter (sets experience id of ink)
     */
    function setEID(inEID) {
        EID = inEID;
    }
    that.setEID = setEID;

    /** KEEP
     * Sets the initial artwork keyframe
     */
    function setInitKeyframeData(kf) {
        initKeyframe = kf;
    }
    that.setInitKeyframeData = setInitKeyframeData;

    /** KEEP
     * Sets the ink mode
     */
    function set_mode(i) {
        i = parseInt(i);
        mode = i;
    }
    that.set_mode = set_mode;

    /** KEEP
     * Returns a string giving all necessary information to recreate the current scene.
     * The result is stored in ink tracks as the 'datastring.' Also used throughout
     * InkAuthoring to make sure we have an up to date datastring. The formats for each
     * type of ink is given below (note that the trailing '[]' makes it easier to parse).
     * Note that the MARQUEE type is deprecated -- it has been replaced by TRANS type
     * transparencies represented by paths rather than collections of rectangles. The
     * BOUNDRECT and BOUNDELLIPSE types are for reloading rectangles and ellipses when we
     * edit transparencies (their formats are identical to RECT/ELLIPSE). All coordinates are relative.
     *
     *   PATH::[pathstring]<svg path string>[stroke]<color>[strokeo]<opacity>[strokew]<width>[]
     *   RECT::[x]<x>[y]<y>[w]<width>[h]<height>[fillc]<color>[fillo]<opac>[strokec]<color>[strokeo]<opac>[strokew]<width>[]
     *   ELLIPSE::[cx]<center x>[cy]<center y>[rx]<x radius>[ry]<y radius>[fillc]<color>[fillo]<opac>[strokec]<color>[strokeo]<opac>[strokew]<width>[]
     *   MARQUEE::[x]<x>[y]<y>[w]<width>[h]<height>[surrfillc]<fill color>[surrfillo]<fill opac>[]
     *   TEXT::[str]<text>[font]<font>[fontsize]<fontsize>[color]<font color>[x]<x>[y]<y>[w]<width>[h]<height>[]
     *   TRANS::[path]<path>[color]<color>[opac]<opac>[mode]<block or isolate>[]
     *   BOUNDRECT::[x]<x>[y]<y>[w]<width>[h]<height>[fillc]<color>[fillo]<opac>[strokec]<color>[strokeo]<opac>[strokew]<width>[]
     *   BOUNDELLIPSE::[cx]<center x>[cy]<center y>[rx]<x radius>[ry]<y radius>[fillc]<color>[fillo]<opac>[strokec]<color>[strokeo]<opac>[strokew]<width>[]
     *
     * @return    up to date datastring
     */
    function update_datastring() {
        var data_string = "";
        var canv_width = domelement.width();
        var canv_height = domelement.height();
        if (currpaths && currpaths != "") { // add pen paths to datastring
            if (currpaths.split("Mundefined").length > 1)
                currpaths = currpaths.split("Mundefined").join("");
            data_string += currpaths;
        }
        if (trans_currpath && trans_currpath != "") { // add transparency paths to datastring
            data_string += trans_currpath;
        }

        paper.forEach(function (elt) { // now check the canvas for text
            if (elt.data("type") === "text") {
                var pth = "TEXT::[str]" + elt.data("str")
                    + "[font]" + elt.data("font")
                    + "[fontsize]" + rel_dims(elt.data("fontsize"), canv_height) //scale font-size
                    + "[color]" + elt.data("color")
                    + "[x]" + rel_dims(elt.data("x"), canv_width)
                    + "[y]" + rel_dims(elt.data("y"), canv_height)
                    + "[w]" + elt.data('w')
                    + "[h]" + elt.data('h')
                    + "[]";
                data_string += pth + "|";
            }
            else {
                console.log("type = " + elt.data("type"));
            }
        });
        datastring = data_string;
        return data_string;
    }
    that.update_datastring = update_datastring;

    /** KEEP
     * When we load in a path datastring, update ml, xy, and pa to reflect the new data.
     * @param str   the datastring loaded
     */
    function update_ml_xy_pa(str) {
        var i, j;

        // add info to ml and pa
        for (i = 0; i < str.length; i++) {
            if ((str[i] == "L") || (str[i] == "M")) {
                var cpth = str.substring(i).split("|")[0];
                var strokec = get_attr(cpth, "stroke", "s");
                var strokeo = get_attr(cpth, "strokeo", "f");
                var strokew = get_attr(cpth, "strokew", "f");
                ml.push(str[i]);
                pa.push({ "color": strokec, "opacity": strokeo, "width": strokew });
            }
        }

        // add info to xy (probably easier with regular expressions)
        var arr1 = str.split("L");
        for (i = 0; i < arr1.length; i++) {
            if (arr1[i].length > 0) {
                var arr2 = arr1[i].split("M");
                for (j = 0; j < arr2.length; j++) {
                    if (arr2[j].length > 0 && arr2[j].charAt(0) != 'P') {
                        var arr3 = arr2[j].split(",");
                        xy.push([parseFloat(arr3[0]), parseFloat(arr3[1])]);
                    }
                }
            }
        }
        click = false;
    }
    that.update_ml_xy_pa = update_ml_xy_pa;

    return that;
};