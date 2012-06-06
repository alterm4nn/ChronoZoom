// Helper routines to perform URL to/from visible conversion

var navigationAnchor = null; // a canvas element which is used as an anchor for relative positioning in a bookmark

/* Builds a navigation string for the given typed virtual canvas element.
@param vcelem   (CanvasElement) An element of a virtual canvas.
@scale          (number) Optional scale (default is 1.0) that is a factor on the element size.

Remarks:
Example of the navigation string is '/t10/t24/e12/c10@w=1.5&h=1.0&x=0.33&y=0.25' which means
timeline with id 10 
which has child timeline with id 25 
which has child infodot with id 12 
which has child contentItem with id 10
with position (0.33,0.255) of the visible region center so left-upper corner is (0,0), right-bottom is (1,1)
with width 1.5x size of the element width so height 1.0 shows entire element vertically.
*/
function vcelementToNavString(vcElem, vp) {
    var nav = '';
    var el = vcElem;
    while (vcElem) {
        if (vcElem.type) {
            nav = '/' + vcElem.id + nav;
        }
        vcElem = vcElem.parent;
    }
    if (nav && nav !== '' && vp) {
        var rx = (vp.visible.centerX - (el.x + el.width / 2)) / el.width;
        var ry = (vp.visible.centerY - (el.y + el.height / 2)) / el.height;
        var rw = vp.widthScreenToVirtual(vp.width) / el.width;
        var rh = vp.heightScreenToVirtual(vp.height) / el.height;
        nav += '@x=' + rx + "&y=" + ry + "&w=" + rw + "&h=" + rh;
    }
    return nav;
}

/* Finds a virtual canvas element by given navigation string without scale.
@param nav      (String) A navigation string.
@param root     (CanvasElement) Root element for the canvas tree.
@returns {x,y,width,height} or null.

Remarks:
Example of the navigation string is '/t10/t24/e12/c10' which means
timeline with id 10 
which has child timeline with id 25 
which has child infodot with id 12 
which has child contentItem with id 10
#/t55/e118
*/
function navStringTovcElement(nav, root) {
    if (!nav) return null;
    try {
        var k = nav.indexOf('@');
        if (k >= 0) { // trims scale
            nav = nav.substr(0, k);
        }
        var path = nav.split('index.html');
        if (path.length <= 1) return null;

        var lookup = function (id, root) {
            if (typeof root.type !== 'undefined' && root.type === 'infodot' && !root.hasContentItems) {
                // If we are looking for a content item ('c...'), it is possible that they are not loaded actually in a virtual canvas.
                return getContentItem(root, id);
            }
            if (!root.children || root.children.length == 0) return null;

            var isTyped = false;
            for (var i = 0; i < root.children.length; i++) {
                var child = root.children[i];
                if (!isTyped) {
                    if (child.type) isTyped = true;
                }
                if (isTyped) {
                    if (child.id === id)
                        return child;
                }
            }
            if (isTyped) return null;
            for (var i = 0; i < root.children.length; i++) {
                var found = lookup(id, root.children[i]);
                if (found) return found;
            }
            return null;
        }

        for (var n = 1; n < path.length; n++) {
            var id = path[n];
            root = lookup(id, root);
            if (root == null) return null;
        }
        return root;
    } catch (e) {
        return root;
    }
}

/* Builds VisibleRegion2d from the navigation string for the virtual canvas.
@param nav      (String) A navigation string.
@param vc       jquery's virtual canvas widget

Remarks:
Example of the navigation string is '/t10/t24/e12/c10' which means
timeline with id 10 
which has child timeline with id 25 
which has child infodot with id 12 
which has child contentItem with id 10
#/t55/e118
*/
function navStringToVisible(nav, vc) {
    var k = nav.indexOf('@');
    var w = 1.05; // includes margins by default
    var h = 1.05;
    var x = 0; // center of the visible region
    var y = 0;
    if (k >= 0) {
        if (k == 0) return null;
        var s = nav.substr(k + 1);
        nav = nav.substr(0, k);
        var parts = s.split('&');
        for (var i = 0; i < parts.length; i++) {
            var start = parts[i].substring(0, 2);
            if (start == "x=")
                x = parseFloat(parts[i].substring(2));
            else if (start == "y=")
                y = parseFloat(parts[i].substring(2));
            else if (start == "w=")
                w = parseFloat(parts[i].substring(2));
            else if (start == "h=")
                h = parseFloat(parts[i].substring(2));
        }
    }

    var element = navStringTovcElement(nav, vc.virtualCanvas("getLayerContent"));
    if (!element) return null;

    var vp = vc.virtualCanvas("getViewport");

    var xc = element.x + element.width / 2 + x * element.width;
    var yc = element.y + element.height / 2 + y * element.height;
    var wc = w * element.width;
    var hc = h * element.height;

    // Adjusting the w,h to current aspect ratio:
    var ar0 = vp.width / vp.height; // self
    var ar1 = wc / hc; // img
    if (ar0 > ar1) {
        wc = ar0 * hc;
    }
    var scale = wc / vp.width;
    var vis2 = {
        centerX: xc,
        centerY: yc,
        scale: scale
    };
    return vis2;
}

// Obsolete
function visibleToParamString(s, presentYear) {
    return "x=" + vxToDateString(s.centerX, presentYear) +
                   "&y=" + s.centerY +
                   "&s=" + s.scale;
}

