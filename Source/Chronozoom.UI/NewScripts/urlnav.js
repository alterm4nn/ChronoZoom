var CZ;
(function (CZ) {
    (function (UrlNav) {
        UrlNav.navigationAnchor = null;
        function vcelementToNavString(vcElem, vp) {
            var nav = '';
            var el = vcElem;
            while(vcElem) {
                if(vcElem.type) {
                    nav = '/' + vcElem.id + nav;
                }
                vcElem = vcElem.parent;
            }
            if(nav && nav !== '' && vp) {
                var rx = (vp.visible.centerX - (el.x + el.width / 2)) / el.width;
                var ry = (vp.visible.centerY - (el.y + el.height / 2)) / el.height;
                var rw = vp.widthScreenToVirtual(vp.width) / el.width;
                var rh = vp.heightScreenToVirtual(vp.height) / el.height;
                var URL = getURL();
                nav += '@x=' + rx + "&y=" + ry + "&w=" + rw + "&h=" + rh;
                if(typeof URL.hash.params != 'undefined') {
                    if(typeof URL.hash.params['tour'] != 'undefined') {
                        nav += "&tour=" + URL.hash.params["tour"];
                    }
                    if(typeof URL.hash.params['bookmark'] != 'undefined') {
                        nav += "&bookmark=" + URL.hash.params["bookmark"];
                    }
                }
            }
            return nav;
        }
        UrlNav.vcelementToNavString = vcelementToNavString;
        function navStringTovcElement(nav, root) {
            if(!nav) {
                return null;
            }
            try  {
                var k = nav.indexOf('@');
                if(k >= 0) {
                    nav = nav.substr(0, k);
                }
                var path = nav.split('/');
                if(path.length <= 1) {
                    return null;
                }
                var lookup = function (id, root) {
                    if(typeof root.type !== 'undefined' && root.type === 'infodot') {
                        return CZ.VCContent.getContentItem(root, id);
                    }
                    if(!root.children || root.children.length == 0) {
                        return null;
                    }
                    var isTyped = false;
                    for(var i = 0; i < root.children.length; i++) {
                        var child = root.children[i];
                        if(!isTyped) {
                            if(child.type) {
                                isTyped = true;
                            }
                        }
                        if(isTyped) {
                            if(child.id === id) {
                                return child;
                            }
                        }
                    }
                    if(isTyped) {
                        return null;
                    }
                    for(var i = 0; i < root.children.length; i++) {
                        var found = lookup(id, root.children[i]);
                        if(found) {
                            return found;
                        }
                    }
                    return null;
                };
                for(var n = 1; n < path.length; n++) {
                    var id = path[n];
                    root = lookup(id, root);
                    if(root == null) {
                        return null;
                    }
                }
                return root;
            } catch (e) {
                return root;
            }
        }
        UrlNav.navStringTovcElement = navStringTovcElement;
        function navStringToVisible(nav, vc) {
            var k = nav.indexOf('@');
            var w = 1.05;
            var h = 1.05;
            var x = 0;
            var y = 0;
            if(k >= 0) {
                if(k == 0) {
                    return null;
                }
                var s = nav.substr(k + 1);
                nav = nav.substr(0, k);
                var parts = s.split('&');
                for(var i = 0; i < parts.length; i++) {
                    var start = parts[i].substring(0, 2);
                    if(start == "x=") {
                        x = parseFloat(parts[i].substring(2));
                    } else if(start == "y=") {
                        y = parseFloat(parts[i].substring(2));
                    } else if(start == "w=") {
                        w = parseFloat(parts[i].substring(2));
                    } else if(start == "h=") {
                        h = parseFloat(parts[i].substring(2));
                    }
                }
            }
            var element = navStringTovcElement(nav, vc.virtualCanvas("getLayerContent"));
            if(!element) {
                return null;
            }
            var vp = vc.virtualCanvas("getViewport");
            var xc = element.x + element.width / 2 + x * element.width;
            var yc = element.y + element.height / 2 + y * element.height;
            var wc = w * element.width;
            var hc = h * element.height;
            var ar0 = vp.width / vp.height;
            var ar1 = wc / hc;
            if(ar0 > ar1) {
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
        UrlNav.navStringToVisible = navStringToVisible;
        function getURL() {
            var url;
            var loc = document.location.toString().split("#");
            var path = loc[0];
            var hash = loc[1];
            var expr = new RegExp("^(https|http):\/\/([a-z_0-9\-.]{4,})(?:\:([0-9]{1,5}))?(?:\/*)([a-z\-_0-9\/.]*)[?]?([a-z\-_0-9=&]*)$", "i");
            var result = path.match(expr);
            if(result != null) {
                url = {
                    protocol: result[1],
                    host: result[2],
                    port: result[3]
                };
                if(result[4] != "") {
                    url.path = result[4].split("/");
                    if(url.path.length > 1) {
                        url.superCollectionName = url.path[0];
                    }
                    if(url.path.length > 2) {
                        url.collectionName = url.path[1];
                    }
                }
                if(result[5] != "") {
                    url.params = [];
                    var getParams = result[5].split("&");
                    for(var i = 0; i < getParams.length; i++) {
                        var pair = getParams[i].split("=");
                        url.params[pair[0]] = pair[1];
                    }
                }
            } else {
                window.location.href = "testFallBackPage.htm";
            }
            url.hash = {
                params: [],
                path: ""
            };
            if(typeof hash != 'undefined') {
                var h = hash.split("@");
                url.hash = {
                    path: h[0]
                };
                if(h.length > 1 && h[1] != "") {
                    var hashParams = new String(h[1]).split("&");
                    url.hash.params = [];
                    for(var i = 0; i < hashParams.length; i++) {
                        var pair = hashParams[i].split("=");
                        url.hash.params[pair[0]] = pair[1];
                    }
                }
            }
            return url;
        }
        UrlNav.getURL = getURL;
        function setURL(url, reload) {
            if(reload == null) {
                reload = false;
            } else {
                reload = true;
            }
            if(url == null) {
                window.location.href = "testFallBackPage.htm";
            }
            var path = url.protocol + "://" + url.host + ((url.port != "") ? (":" + url.port) : ("")) + "/" + (url.path === undefined ? "" : url.path.join('/'));
            var params = new Array();
            for(var key in url.params) {
                params.push(key + "=" + url.params[key]);
            }
            path += ((url.params != null) ? ("?" + params.join("&")) : (""));
            var hash = url.hash.path;
            var hash_params = [];
            for(var key in url.hash.params) {
                hash_params.push(key + "=" + url.hash.params[key]);
            }
            hash += ("@" + hash_params.join("&"));
            var loc = path + "#" + hash;
            if(reload == true) {
                window.location.href = loc;
            } else {
                window.location.hash = hash;
            }
        }
        UrlNav.setURL = setURL;
    })(CZ.UrlNav || (CZ.UrlNav = {}));
    var UrlNav = CZ.UrlNav;
})(CZ || (CZ = {}));
