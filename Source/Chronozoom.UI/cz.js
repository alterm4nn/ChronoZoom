var CZ;
(function (CZ) {
    (function (Settings) {
        Settings.isAuthorized = false;
        Settings.czDataSource = 'db';
        Settings.czVersion = "main";
        Settings.ellipticalZoomZoomoutFactor = 0.5;
        Settings.ellipticalZoomDuration = 9000;
        Settings.panSpeedFactor = 3.0;
        Settings.zoomSpeedFactor = 2.0;
        Settings.zoomLevelFactor = 1.4;
        Settings.allowedVisibileImprecision = 0.00001;
        Settings.allowedMathImprecision = 0.000001;
        Settings.allowedMathImprecisionDecimals = parseInt(Settings.allowedMathImprecision.toExponential().split("-")[1]);
        Settings.canvasElementAnimationTime = 1300;
        Settings.canvasElementFadeInTime = 400;
        Settings.contentScaleMargin = 20;
        Settings.renderThreshold = 2;
        Settings.targetFps = 60;
        Settings.hoverAnimationSeconds = 2;
        Settings.fallbackImageUri = '/images/Temp-Thumbnail2.png';
        Settings.timelineHeaderMargin = 1.0 / 18.0;
        Settings.timelineHeaderSize = 1.0 / 9.0;
        Settings.timelineTooltipMaxHeaderSize = 5;
        Settings.timelineHeaderFontName = 'Arial';
        Settings.timelineHeaderFontColor = 'rgb(232,232,232)';
        Settings.timelineHoveredHeaderFontColor = 'white';
        Settings.timelineStrokeStyle = 'rgb(232,232,232)';
        Settings.timelineLineWidth = 1;
        Settings.timelineHoveredLineWidth = 1;
        Settings.timelineMinAspect = 0.2;
        Settings.timelineContentMargin = 0.01;
        Settings.timelineBorderColor = 'rgb(232,232,232)';
        Settings.timelineHoveredBoxBorderColor = 'rgb(232,232,232)';
        Settings.timelineBreadCrumbBorderOffset = 50;
        Settings.timelineCenterOffsetAcceptableImplicity = 0.00001;
        Settings.timelineColor = null;
        Settings.timelineHoverAnimation = 3 / 60.0;
        Settings.timelineGradientFillStyle = null;
        Settings.infodotShowContentZoomLevel = 9;
        Settings.infodotShowContentThumbZoomLevel = 2;
        Settings.infoDotHoveredBorderWidth = 40.0 / 450;
        Settings.infoDotBorderWidth = 27.0 / 450;
        Settings.infodotTitleWidth = 200.0 / 489;
        Settings.infodotTitleHeight = 60.0 / 489;
        Settings.infodotBibliographyHeight = 10.0 / 489;
        Settings.infoDotBorderColor = 'rgb(232,232,232)';
        Settings.infoDotHoveredBorderColor = 'white';
        Settings.infoDotFillColor = 'rgb(92,92,92)';
        Settings.infoDotTinyContentImageUri = '/images/tinyContent.png';
        Settings.infodotMaxContentItemsCount = 10;
        Settings.mediaContentElementZIndex = 100;
        Settings.contentItemDescriptionNumberOfLines = 10;
        Settings.contentItemShowContentZoomLevel = 9;
        Settings.contentItemThumbnailMinLevel = 3;
        Settings.contentItemThumbnailMaxLevel = 7;
        Settings.contentItemThumbnailBaseUri = 'http://czbeta.blob.core.windows.net/images/';
        Settings.contentItemTopTitleHeight = 47.0 / 540;
        Settings.contentItemContentWidth = 480.0 / 520;
        Settings.contentItemVerticalMargin = 13.0 / 540;
        Settings.contentItemMediaHeight = 260.0 / 540;
        Settings.contentItemSourceHeight = 10.0 / 540;
        Settings.contentItemSourceFontColor = 'rgb(232,232,232)';
        Settings.contentItemSourceHoveredFontColor = 'white';
        Settings.contentItemAudioHeight = 40.0 / 540;
        Settings.contentItemAudioTopMargin = 120.0 / 540;
        Settings.contentItemFontHeight = 140.0 / 540;
        Settings.contentItemHeaderFontName = 'Arial';
        Settings.contentItemHeaderFontColor = 'white';
        Settings.contentItemBoundingBoxBorderWidth = 13.0 / 520;
        Settings.contentItemBoundingBoxFillColor = 'rgb(36,36,36)';
        Settings.contentItemBoundingBoxBorderColor = undefined;
        Settings.contentItemBoundingHoveredBoxBorderColor = 'white';
        Settings.contentAppearanceAnimationStep = 0.01;
        Settings.infoDotZoomConstraint = 0.005;
        Settings.infoDotAxisFreezeThreshold = 0.75;
        Settings.maxPermitedTimeRange = {
            left: -13700000000,
            right: 0
        };
        Settings.deeperZoomConstraints = [
            {
                left: -14000000000,
                right: -1000000000,
                scale: 1000
            }, 
            {
                left: -1000000000,
                right: -1000000,
                scale: 1
            }, 
            {
                left: -1000000,
                right: -12000,
                scale: 0.001
            }, 
            {
                left: -12000,
                right: 0,
                scale: 0.00006
            }
        ];
        Settings.maxTickArrangeIterations = 3;
        Settings.spaceBetweenLabels = 15;
        Settings.spaceBetweenSmallTicks = 10;
        Settings.tickLength = 14;
        Settings.smallTickLength = 7;
        Settings.strokeWidth = 3;
        Settings.thresholdHeight = 10;
        Settings.thresholdWidth = 8;
        Settings.thresholdColors = [
            'rgb(173,71,155)', 
            'rgb(177,121,180)', 
            'rgb(220,123,154)', 
            'rgb(71,168,168)', 
            'rgb(95,187,71)', 
            'rgb(242,103,63)', 
            'rgb(247,144,63)', 
            'rgb(251,173,45)'
        ];
        Settings.thresholdTextColors = [
            'rgb(36,1,56)', 
            'rgb(60,31,86)', 
            'rgb(85,33,85)', 
            'rgb(0,56,100)', 
            'rgb(0,73,48)', 
            'rgb(125,25,33)', 
            'rgb(126,51,0)', 
            'rgb(92,70,14)'
        ];
        Settings.thresholdsDelayTime = 1000;
        Settings.thresholdsAnimationTime = 500;
        Settings.rectangleRadius = 3;
        Settings.axisTextSize = 12;
        Settings.axisTextFont = "Arial";
        Settings.axisStrokeColor = "rgb(221,221,221)";
        Settings.axisHeight = 47;
        Settings.horizontalTextMargin = 20;
        Settings.verticalTextMargin = 15;
        Settings.gapLabelTick = 3;
        Settings.activeMarkSize = 10;
        Settings.minLabelSpace = 50;
        Settings.minTickSpace = 8;
        Settings.minSmallTickSpace = 8;
        Settings.timescaleThickness = 2;
        Settings.markerWidth = 85;
        Settings.panelWidth = 185;
        Settings.cosmosTimelineID = "00000000-0000-0000-0000-000000000000";
        Settings.earthTimelineID = "48fbb8a8-7c5d-49c3-83e1-98939ae2ae67";
        Settings.lifeTimelineID = "d4809be4-3cf9-4ddd-9703-3ca24e4d3a26";
        Settings.prehistoryTimelineID = "a6b821df-2a4d-4f0e-baf5-28e47ecb720b";
        Settings.humanityTimelineID = "4afb5bb6-1544-4416-a949-8c8f473e544d";
        Settings.toursAudioFormats = [
            {
                ext: 'mp3'
            }, 
            {
                ext: 'wav'
            }
        ];
        Settings.tourDefaultTransitionTime = 10;
        Settings.seadragonServiceURL = "http://api.zoom.it/v1/content/?url=";
        Settings.seadragonImagePath = "/images/seadragonControls/";
        Settings.seadragonMaxConnectionAttempts = 3;
        Settings.seadragonRetryInterval = 2000;
        Settings.navigateNextMaxCount = 2;
        Settings.longNavigationLength = 10;
        Settings.serverUrlHost = location.protocol + "//" + location.host;
        Settings.minTimelineWidth = 100;
        Settings.signinUrlMicrosoft = "";
        Settings.signinUrlGoogle = "";
        Settings.signinUrlYahoo = "";
        Settings.sessionTime = 3600;
        Settings.guidEmpty = "00000000-0000-0000-0000-000000000000";
        Settings.ie = ((function () {
            var v = 3, div = document.createElement('div'), a = div.all || [];
            while(div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->' , a[0]) {
                ;
            }
            return (v > 4) ? v : undefined;
        })());
        Settings.theme;
        function applyTheme(theme) {
            if(!theme) {
                theme = "cosmos";
            }
            this.theme = theme;
            var themeData = {
                "cosmos": {
                    "background": "url('/images/background.jpg')",
                    "backgroundColor": "#232323",
                    "timelineColor": null,
                    "timelineHoverAnimation": 3 / 60.0,
                    "infoDotFillColor": 'rgb(92,92,92)',
                    "fallbackImageUri": '/images/Temp-Thumbnail2.png',
                    "timelineGradientFillStyle": null
                },
                "gray": {
                    "background": "none",
                    "backgroundColor": "#bebebe",
                    "timelineColor": null,
                    "timelineHoverAnimation": 3 / 60.0,
                    "infoDotFillColor": 'rgb(92,92,92)',
                    "fallbackImageUri": '/images/Temp-Thumbnail2.png',
                    "timelineGradientFillStyle": "#9e9e9e"
                },
                "aqua": {
                    "background": "none",
                    "backgroundColor": "rgb(238, 238, 238)",
                    "timelineColor": "rgba(52, 76, 130, 0.5)",
                    "timelineHoverAnimation": 3 / 60.0,
                    "infoDotFillColor": 'rgb(55,84,123)',
                    "fallbackImageUri": '/images/Temp-Thumbnail-Aqua.png',
                    "timelineGradientFillStyle": "rgb(80,123,175)"
                }
            };
            var themeSettings = themeData[theme];
            $('#vc').css('background-image', themeSettings.background);
            $('#vc').css('background-color', themeSettings.backgroundColor);
            CZ.Settings.timelineColor = themeSettings.timelineColor;
            CZ.Settings.timelineHoverAnimation = themeSettings.timelineHoverAnimation;
            CZ.Settings.infoDotFillColor = themeSettings.infoDotFillColor;
            CZ.Settings.fallbackImageUri = themeSettings.fallbackImageUri;
            CZ.Settings.timelineGradientFillStyle = themeSettings.timelineGradientFillStyle;
        }
        Settings.applyTheme = applyTheme;
        Settings.defaultBingSearchTop = 50;
        Settings.defaultBingSearchSkip = 0;
        Settings.mediapickerImageThumbnailMaxWidth = 240;
        Settings.mediapickerImageThumbnailMaxHeight = 155;
        Settings.mediapickerVideoThumbnailMaxWidth = 190;
        Settings.mediapickerVideoThumbnailMaxHeight = 130;
        Settings.WLAPIClientID = "0000000040101FFA";
        Settings.WLAPIRedirectUrl = "http://test.chronozoom.com/";
        Settings.errorMessageSlideDuration = 0;
    })(CZ.Settings || (CZ.Settings = {}));
    var Settings = CZ.Settings;
})(CZ || (CZ = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormBase = (function () {
            function FormBase(container, formInfo) {
                var _this = this;
                if(!(container instanceof jQuery && container.is("div"))) {
                    throw "Container parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.isFormVisible = false;
                this.container = container;
                this.prevForm = formInfo.prevForm;
                this.activationSource = formInfo.activationSource;
                this.navButton = this.container.find(formInfo.navButton);
                this.closeButton = this.container.find(formInfo.closeButton);
                this.titleTextblock = this.container.find(formInfo.titleTextblock);
                this.contentContainer = this.container.find(formInfo.contentContainer);
                this.container.data("form", this);
                if(this.prevForm) {
                    this.navButton.show();
                } else {
                    this.navButton.hide();
                }
                this.navButton.off();
                this.closeButton.off();
                this.navButton.click(function (event) {
                    _this.back();
                });
                this.closeButton.click(function (event) {
                    _this.close();
                });
            }
            FormBase.prototype.show = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.isFormVisible = true;
                this.container.show.apply(this.container, args);
            };
            FormBase.prototype.close = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.isFormVisible = false;
                this.container.data("form", undefined);
                this.container.hide.apply(this.container, args);
                this.container.trigger("close");
            };
            FormBase.prototype.back = function () {
                this.close();
                this.prevForm.show();
            };
            return FormBase;
        })();
        UI.FormBase = FormBase;        
        var FormUpdateEntity = (function (_super) {
            __extends(FormUpdateEntity, _super);
            function FormUpdateEntity(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
                this.saveButton = this.container.find(formInfo.saveButton);
                this.container.keypress(function (event) {
                    if(event.keyCode === 13) {
                        _this.saveButton.trigger("click");
                    }
                });
            }
            return FormUpdateEntity;
        })(FormBase);
        UI.FormUpdateEntity = FormUpdateEntity;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
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
            var expr = new RegExp("^(https|http):\/\/([a-z_0-9\-.]{4,})(?:\:([0-9]{1,5}))?(?:\/*)([a-z\-_0-9\/.%]*)[?]?([a-z\-_0-9=&]*)$", "i");
            var result = path.match(expr);
            if(result != null) {
                url = {
                    protocol: result[1],
                    host: result[2],
                    port: result[3]
                };
                if(result[4] != "") {
                    url.path = result[4].split("/");
                    if(url.path.length >= 1 && url.path[0].length > 0 && url.path[0] !== "cz.html") {
                        url.superCollectionName = url.path[0];
                        url.collectionName = url.superCollectionName;
                    }
                    if(url.path.length >= 2 && url.path[1].length > 0) {
                        url.collectionName = url.path[1];
                    }
                    if(url.path.length >= 3 && url.path[url.path.length - 1].length > 0) {
                        url.content = url.path[url.path.length - 1];
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
                window.location.href = "fallback.html";
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
                window.location.href = "fallback.html";
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
var CZ;
(function (CZ) {
    (function (Bibliography) {
        function initializeBibliography() {
            $("#bibliographyBack").hide();
            $("#biblCloseButton").mouseup(function () {
                pendingBibliographyForExhibitID = null;
                $("#bibliographyBack").hide('clip', {
                }, 'slow');
                window.location.hash = window.location.hash.replace(new RegExp("&b=[a-z0-9_\-]+$", "gi"), "");
            });
        }
        Bibliography.initializeBibliography = initializeBibliography;
        var pendingBibliographyForExhibitID = null;
        function showBibliography(descr, element, id) {
            var sender;
            try  {
                sender = CZ.VCContent.getChild(element, id);
            } catch (ex) {
                return;
            }
            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            var nav = CZ.UrlNav.vcelementToNavString(element, vp);
            if(window.location.hash.match("b=([a-z0-9_\-]+)") == null) {
                var bibl = "&b=" + id;
                if(window.location.hash.indexOf('@') == -1) {
                    bibl = "@" + bibl;
                }
                nav = nav + bibl;
            }
            window.location.hash = nav;
            sender.onmouseclick = null;
            var a = $("#bibliographyBack").css("display");
            if($("#bibliographyBack").css("display") == "none") {
                $("#bibliographyBack").show('clip', {
                }, 'slow', function () {
                    sender.onmouseclick = function (e) {
                        CZ.Common.vc.css('cursor', 'default');
                        showBibliography({
                            infodot: descr.infodot,
                            contentItems: descr.contentItems
                        }, element, id);
                        return true;
                    };
                });
            } else {
                sender.onmouseclick = function (e) {
                    CZ.Common.vc.css('cursor', 'default');
                    showBibliography({
                        infodot: descr.infodot,
                        contentItems: descr.contentItems
                    }, element, id);
                    return true;
                };
            }
            $("#bibliography .sources").empty();
            if(descr) {
                if(descr.infodot) {
                    $("#bibliography .title").text(descr.infodot.title + " > Bibliography");
                    getBibliography(descr.infodot.guid, descr.contentItems);
                } else {
                    $("#bibliography .title").text("> Bibliography");
                }
            }
        }
        Bibliography.showBibliography = showBibliography;
        function getBibliography(exhibitID, contentItems) {
            if(contentItems.length != 0) {
                var sources = $("#bibliography .sources");
                sources.empty();
                $("<div></div>", {
                    id: "biblAdditionalResources",
                    class: "sectionTitle",
                    text: "Current Resources"
                }).appendTo(sources);
                for(var i = 0; i < contentItems.length; i++) {
                    var r = contentItems[i];
                    var source = $("<div></div>", {
                        class: "source"
                    }).appendTo(sources);
                    if(r.mediaSource) {
                        $("<div></div>", {
                            class: "sourceName"
                        }).append($("<a></a>", {
                            href: r.mediaSource,
                            target: "_blank",
                            text: r.mediaSource
                        })).appendTo(source);
                    } else {
                        $('<br/>').appendTo(source);
                    }
                    var sourceDescr = $("<div></div>", {
                        class: "sourceDescr"
                    });
                    if(r.title) {
                        $("<i></i>", {
                            text: r.title,
                            class: "truncateText"
                        }).appendTo(sourceDescr);
                    }
                    if(r.attribution) {
                        if(r.title !== '') {
                            $("<br></br>", {
                            }).appendTo(sourceDescr);
                        }
                        $("<div></div>", {
                            text: r.attribution,
                            class: "truncateText"
                        }).appendTo(sourceDescr);
                    }
                    sourceDescr.appendTo(source);
                }
            }
        }
    })(CZ.Bibliography || (CZ.Bibliography = {}));
    var Bibliography = CZ.Bibliography;
})(CZ || (CZ = {}));
;
var CZ;
(function (CZ) {
    (function (Extensions) {
        (function (RIN) {
            function getScript() {
                return "http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjs/lib/rin-core-1.0.js";
            }
            RIN.getScript = getScript;
            function getExtension(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload) {
                var rinDiv;
                if(!rinDiv) {
                    rinDiv = document.createElement('div');
                    rinDiv.setAttribute("id", id);
                    rinDiv.setAttribute("class", "rinPlayer");
                    rinDiv.addEventListener("mousemove", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("mousedown", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
                    rinDiv.addEventListener("mousewheel", CZ.Common.preventbubble, false);
                    rin.processAll(null, 'http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjs/').then(function () {
                        var playerElement = document.getElementById(id);
                        var playerControl = rin.getPlayerControl(rinDiv);
                        var deepstateUrl = playerControl.resolveDeepstateUrlFromAbsoluteUrl(window.location.href);
                        playerControl.load(contentSource);
                    });
                } else {
                    rinDiv.isAdded = false;
                }
                return new RINPlayer(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload, rinDiv);
            }
            RIN.getExtension = getExtension;
            function RINPlayer(vc, parent, layerid, id, contentSource, vx, vy, vw, vh, z, onload, rinDiv) {
                this.base = CZ.VCContent.CanvasDomItem;
                this.base(vc, layerid, id, vx, vy, vw, vh, z);
                this.initializeContent(rinDiv);
                this.onRemove = function () {
                    var rinplayerControl = rin.getPlayerControl(rinDiv);
                    if(rinplayerControl) {
                        rinplayerControl.pause();
                        if(rinplayerControl.unload) {
                            rinplayerControl.unload();
                        }
                        rinplayerControl = null;
                    }
                    this.prototype.onRemove.call(this);
                };
                this.prototype = new CZ.VCContent.CanvasDomItem(vc, layerid, id, vx, vy, vw, vh, z);
            }
        })(Extensions.RIN || (Extensions.RIN = {}));
        var RIN = Extensions.RIN;
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Extensions) {
        var extensions = [];
        function mediaTypeIsExtension(mediaType) {
            return mediaType.toLowerCase().indexOf('extension-') === 0;
        }
        Extensions.mediaTypeIsExtension = mediaTypeIsExtension;
        function registerExtensions() {
            registerExtension("RIN", CZ.Extensions.RIN.getExtension, "http://553d4a03eb844efaaf7915517c979ef4.cloudapp.net/rinjs/lib/rin-core-1.0.js");
        }
        Extensions.registerExtensions = registerExtensions;
        function registerExtension(name, initializer, script) {
            extensions[name.toLowerCase()] = {
                "initializer": initializer,
                "script": script
            };
        }
        function activateExtension(mediaType) {
            if(!mediaTypeIsExtension(mediaType)) {
                return;
            }
            var extensionName = extensionNameFromMediaType(mediaType);
            addScript(extensionName, getScriptFromExtensionName(extensionName));
        }
        Extensions.activateExtension = activateExtension;
        function getInitializer(mediaType) {
            var extensionName = extensionNameFromMediaType(mediaType);
            return extensions[extensionName.toLowerCase()].initializer;
        }
        Extensions.getInitializer = getInitializer;
        function extensionNameFromMediaType(mediaType) {
            var extensionIndex = 'extension-'.length;
            return mediaType.substring(extensionIndex, mediaType.length);
        }
        function addScript(extensionName, scriptPath) {
            var scriptId = "extension-" + extensionName;
            if(document.getElementById(scriptId)) {
                return;
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = scriptPath;
            script.id = scriptId;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        function getScriptFromExtensionName(name) {
            return extensions[name.toLowerCase()].script;
        }
    })(CZ.Extensions || (CZ.Extensions = {}));
    var Extensions = CZ.Extensions;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (VCContent) {
        var elementclick = ($).Event("elementclick");
        function getVisibleForElement(element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if(width < 0) {
                width = viewport.width;
            }
            var scaleX = scale * element.width / width;
            var height = viewport.height - margin;
            if(height < 0) {
                height = viewport.height;
            }
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
            if(vw <= 0 || vh <= 0) {
                throw "Image size must be positive";
            }
            return VCContent.addChild(element, new CanvasImage(element.vc, layerid, id, imgSrc, vx, vy, vw, vh, onload), false);
        };
        VCContent.addLodImage = function (element, layerid, id, vx, vy, vw, vh, imgSources, onload) {
            if(vw <= 0 || vh <= 0) {
                throw "Image size must be positive";
            }
            return VCContent.addChild(element, new CanvasLODImage(element.vc, layerid, id, imgSources, vx, vy, vw, vh, onload), false);
        };
        VCContent.addSeadragonImage = function (element, layerid, id, vx, vy, vw, vh, z, imgSrc, onload) {
            if(vw <= 0 || vh <= 0) {
                throw "Image size must be positive";
            }
            return VCContent.addChild(element, new SeadragonImage(element.vc, element, layerid, id, imgSrc, vx, vy, vw, vh, z, onload), false);
        };
        VCContent.addExtension = function (extensionName, element, layerid, id, vx, vy, vw, vh, z, imgSrc, onload) {
            if(vw <= 0 || vh <= 0) {
                throw "Extension size must be positive";
            }
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
            if(element.onIsRenderedChanged) {
                element.onIsRenderedChanged();
            }
            var n = element.children.length;
            for(; --n >= 0; ) {
                if(element.children[n].isRendered) {
                    turnIsRenderedOff(element.children[n]);
                }
            }
        }
        VCContent.render = function (element, contexts, visibleBox_v, viewport2d, opacity) {
            if(!element.isVisible(visibleBox_v)) {
                if(element.isRendered) {
                    turnIsRenderedOff(element);
                }
                return;
            }
            var sz = viewport2d.vectorVirtualToScreen(element.width, element.height);
            if(sz.y <= CZ.Settings.renderThreshold || (element.width != 0 && sz.x <= CZ.Settings.renderThreshold)) {
                if(element.isRendered) {
                    turnIsRenderedOff(element);
                }
                return;
            }
            var ctx = contexts[element.layerid];
            if(element.opacity != null) {
                opacity *= element.opacity;
            }
            if(element.isRendered == undefined || !element.isRendered) {
                element.isRendered = true;
                if(element.onIsRenderedChanged) {
                    element.onIsRenderedChanged();
                }
            }
            element.render(ctx, visibleBox_v, viewport2d, sz, opacity);
            var children = element.children;
            var n = children.length;
            for(var i = 0; i < n; i++) {
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
            for(var i = 0; i < n; i++) {
                var child = parent.children[i];
                if(child.id == id) {
                    if(typeof CZ.Layout.animatingElements[child.id] !== 'undefined') {
                        delete CZ.Layout.animatingElements[child.id];
                        CZ.Layout.animatingElements.length--;
                    }
                    parent.children.splice(i, 1);
                    clear(child);
                    if(child.onRemove) {
                        child.onRemove();
                    }
                    child.parent = null;
                    return true;
                }
            }
            return false;
        };
        var removeTimeline = function (timeline) {
            var n = timeline.children.length;
            console.log(n);
            for(var i = 0; i < n; i++) {
                var child = timeline.children[i];
                if(timeline.onRemove) {
                    timeline.onRemove();
                }
                child.parent = timeline.parent;
            }
        };
        function clear(element) {
            var n = element.children.length;
            for(var i = 0; i < n; i++) {
                var child = element.children[i];
                if(typeof CZ.Layout.animatingElements[child.id] !== 'undefined') {
                    delete CZ.Layout.animatingElements[child.id];
                    CZ.Layout.animatingElements.length--;
                }
                clear(child);
                if(child.onRemove) {
                    child.onRemove();
                }
                child.parent = null;
            }
            element.children = [];
        }
        ;
        function getChild(element, id) {
            var n = element.children.length;
            for(var i = 0; i < n; i++) {
                if(element.children[i].id == id) {
                    return element.children[i];
                }
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
                if(!dontRender) {
                    this.vc.invalidate();
                }
            };
            this.isInside = function (point_v) {
                return true;
            };
            this.render = function (contexts, visibleBox_v, viewport2d) {
                this.vc.breadCrumbs = [];
                if(!this.isVisible(visibleBox_v)) {
                    return;
                }
                var n = this.children.length;
                for(var i = 0; i < n; i++) {
                    VCContent.render(this.children[i], contexts, visibleBox_v, viewport2d, 1.0);
                }
                if(this.vc.breadCrumbs.length > 0 && (this.vc.recentBreadCrumb == undefined || this.vc.breadCrumbs[vc.breadCrumbs.length - 1].vcElement.id != this.vc.recentBreadCrumb.vcElement.id)) {
                    this.vc.recentBreadCrumb = this.vc.breadCrumbs[vc.breadCrumbs.length - 1];
                    this.vc.breadCrumbsChanged();
                } else {
                    if(this.vc.breadCrumbs.length == 0 && this.vc.recentBreadCrumb != undefined) {
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
            if(sz <= 1) {
                return 0;
            }
            var zl = (sz & 1) ? 1 : 0;
            for(var i = 1; i < 32; i++) {
                sz = sz >>> 1;
                if(sz & 1) {
                    if(zl > 0) {
                        zl = i + 1;
                    } else {
                        zl = i;
                    }
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
                if(self.prevContent) {
                    if(!self.prevContent.opacity) {
                        self.prevContent.opacity = 1.0;
                    }
                    self.content.opacity = 0.0;
                }
                self.zoomLevel = newContent.zoomLevel;
            };
            var onAsyncContentLoaded = function () {
                if(self.asyncContent) {
                    startTransition(self.asyncContent);
                    self.asyncContent = null;
                    delete this.onLoad;
                    self.vc.requestInvalidate();
                }
            };
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if(this.asyncContent) {
                    return;
                }
                if(!this.prevContent) {
                    var newZoomLevel = getZoomLevel(size_p);
                    if(this.zoomLevel != newZoomLevel) {
                        var newContent = this.changeZoomLevel(this.zoomLevel, newZoomLevel);
                        if(newContent) {
                            if(newContent.content.isLoading) {
                                this.asyncContent = newContent;
                                newContent.content.onLoad = onAsyncContentLoaded;
                            } else {
                                startTransition(newContent);
                            }
                        }
                    }
                }
                if(this.prevContent) {
                    var renderTime = new Date();
                    var renderTimeDiff = renderTime - self.lastRenderTime;
                    self.lastRenderTime = renderTime;
                    var contentAppearanceAnimationStep = renderTimeDiff / 1600;
                    var doInvalidate = false;
                    var lopacity = this.prevContent.opacity;
                    lopacity = Math.max(0.0, lopacity - contentAppearanceAnimationStep);
                    if(lopacity != this.prevContent.opacity) {
                        doInvalidate = true;
                    }
                    if(lopacity == 0) {
                        VCContent.removeChild(this, this.prevContent.id);
                        this.prevContent = null;
                    } else {
                        this.prevContent.opacity = lopacity;
                    }
                    lopacity = this.content.opacity;
                    lopacity = Math.min(1.0, lopacity + contentAppearanceAnimationStep);
                    if(!doInvalidate && lopacity != this.content.opacity) {
                        doInvalidate = true;
                    }
                    this.content.opacity = lopacity;
                    if(doInvalidate) {
                        this.vc.requestInvalidate();
                    }
                }
            };
            this.onIsRenderedChanged = function () {
                if(typeof this.removeWhenInvisible === 'undefined' || !this.removeWhenInvisible) {
                    return;
                }
                if(!this.isRendered) {
                    if(this.asyncContent) {
                        this.asyncContent = null;
                    }
                    if(this.prevContent) {
                        VCContent.removeChild(this, this.prevContent.id);
                        this.prevContent = null;
                    }
                    if(this.newContent) {
                        VCContent.removeChild(this, this.newContent.id);
                        this.newContent.content.onLoad = null;
                        this.newContent = null;
                    }
                    if(this.content) {
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
                if(left < right && top < bottom) {
                    if(this.settings.fillStyle) {
                        var opacity1 = this.settings.gradientOpacity ? opacity * (1 - this.settings.gradientOpacity) : opacity;
                        ctx.globalAlpha = opacity1;
                        ctx.fillStyle = this.settings.fillStyle;
                        ctx.fillRect(left, top, right - left, bottom - top);
                        if(this.settings.gradientOpacity && this.settings.gradientFillStyle) {
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
                    if(this.settings.strokeStyle) {
                        ctx.strokeStyle = this.settings.strokeStyle;
                        if(this.settings.lineWidth) {
                            if(this.settings.isLineWidthVirtual) {
                                ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                            } else {
                                ctx.lineWidth = this.settings.lineWidth;
                            }
                        } else {
                            ctx.lineWidth = 1;
                        }
                        var lineWidth2 = ctx.lineWidth / 2.0;
                        if(this.settings.outline) {
                            p.x += lineWidth2;
                            p.y += lineWidth2;
                            top += lineWidth2;
                            bottom -= lineWidth2;
                            left += lineWidth2;
                            right -= lineWidth2;
                            p2.x -= lineWidth2;
                            p2.y -= lineWidth2;
                        }
                        if(p.x > 0) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, top - lineWidth2);
                            ctx.lineTo(p.x, bottom + lineWidth2);
                            ctx.stroke();
                        }
                        if(p.y > 0) {
                            ctx.beginPath();
                            ctx.moveTo(left - lineWidth2, p.y);
                            ctx.lineTo(right + lineWidth2, p.y);
                            ctx.stroke();
                        }
                        if(p2.x < viewport2d.width) {
                            ctx.beginPath();
                            ctx.moveTo(p2.x, top - lineWidth2);
                            ctx.lineTo(p2.x, bottom + lineWidth2);
                            ctx.stroke();
                        }
                        if(p2.y < viewport2d.height) {
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
            this.titleObject = addText(this, layerid, id + "__header__", timelineinfo.timeStart + marginLeft, timelineinfo.top + marginTop, baseline, headerSize, timelineinfo.header, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle'
            }, headerWidth);
            this.title = this.titleObject.text;
            this.regime = timelineinfo.regime;
            this.settings.gradientOpacity = 0;
            if(CZ.Settings.timelineGradientFillStyle) {
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
                if(this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id != id) {
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
                if(this.titleObject.initialized == false) {
                    var vp = this.vc.getViewport();
                    this.titleObject.screenFontSize = CZ.Settings.timelineHeaderSize * vp.heightVirtualToScreen(this.height);
                }
                if(this.titleObject.screenFontSize <= CZ.Settings.timelineTooltipMaxHeaderSize) {
                    this.tooltipEnabled = true;
                } else {
                    this.tooltipEnabled = false;
                }
                if(CZ.Common.tooltipMode != "infodot") {
                    CZ.Common.tooltipMode = "timeline";
                    if(this.tooltipEnabled == false) {
                        CZ.Common.stopAnimationTooltip();
                        this.tooltipIsShown = false;
                        return;
                    }
                    if(this.tooltipIsShown == false) {
                        switch(this.regime) {
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
                if(this.vc.currentlyHoveredTimeline != null && this.vc.currentlyHoveredTimeline.id == id) {
                    this.vc.currentlyHoveredTimeline = null;
                    if((this.tooltipIsShown == true) && (CZ.Common.tooltipMode == "timeline")) {
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
                if(this.settings.hoverAnimationDelta) {
                    this.settings.gradientOpacity = Math.min(1, Math.max(0, this.settings.gradientOpacity + this.settings.hoverAnimationDelta));
                }
                this.base_render(ctx, visibleBox, viewport2d, size_p, opacity);
                if(CZ.Settings.isAuthorized === true && typeof this.favoriteBtn === "undefined" && this.titleObject.width !== 0) {
                    var btnX = CZ.Authoring.isEnabled ? this.x + this.width - 1.8 * this.titleObject.height : this.x + this.width - 1.0 * this.titleObject.height;
                    var btnY = this.titleObject.y + 0.15 * this.titleObject.height;
                    this.favoriteBtn = VCContent.addImage(this, layerid, id + "__favorite", btnX, btnY, 0.7 * this.titleObject.height, 0.7 * this.titleObject.height, "/images/star.svg");
                    this.favoriteBtn.reactsOnMouse = true;
                    this.favoriteBtn.onmouseclick = function () {
                        CZ.Service.putUserFavorite(id);
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
                if(CZ.Authoring.isEnabled && typeof this.editButton === "undefined" && this.titleObject.width !== 0) {
                    this.editButton = VCContent.addImage(this, layerid, id + "__edit", this.x + this.width - 1.15 * this.titleObject.height, this.titleObject.y, this.titleObject.height, this.titleObject.height, "/images/edit.svg");
                    this.editButton.reactsOnMouse = true;
                    this.editButton.onmouseclick = function () {
                        if(CZ.Common.vc.virtualCanvas("getHoveredInfodot").x == undefined) {
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
                if(this.settings.hoverAnimationDelta) {
                    if(this.settings.gradientOpacity == 0 || this.settings.gradientOpacity == 1) {
                        this.settings.hoverAnimationDelta = undefined;
                    } else {
                        this.vc.requestInvalidate();
                    }
                }
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var p2 = {
                    x: p.x + size_p.x,
                    y: p.y + size_p.y
                };
                var isCenterInside = viewport2d.visible.centerX - CZ.Settings.timelineCenterOffsetAcceptableImplicity <= this.x + this.width && viewport2d.visible.centerX + CZ.Settings.timelineCenterOffsetAcceptableImplicity >= this.x && viewport2d.visible.centerY - CZ.Settings.timelineCenterOffsetAcceptableImplicity <= this.y + this.height && viewport2d.visible.centerY + CZ.Settings.timelineCenterOffsetAcceptableImplicity >= this.y;
                var isVisibleInTheRectangle = ((p.x < CZ.Settings.timelineBreadCrumbBorderOffset && p2.x > viewport2d.width - CZ.Settings.timelineBreadCrumbBorderOffset) || (p.y < CZ.Settings.timelineBreadCrumbBorderOffset && p2.y > viewport2d.height - CZ.Settings.timelineBreadCrumbBorderOffset));
                if(isVisibleInTheRectangle && isCenterInside) {
                    var length = vc.breadCrumbs.length;
                    if(length > 1) {
                        if(vc.breadCrumbs[length - 1].vcElement.parent.id == this.parent.id) {
                            return;
                        }
                    }
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
                if(this.settings.strokeStyle) {
                    ctx.strokeStyle = this.settings.strokeStyle;
                    if(this.settings.lineWidth) {
                        if(this.settings.isLineWidthVirtual) {
                            ctx.lineWidth = viewport2d.widthVirtualToScreen(this.settings.lineWidth);
                        } else {
                            ctx.lineWidth = this.settings.lineWidth;
                        }
                    } else {
                        ctx.lineWidth = 1;
                    }
                    ctx.stroke();
                }
                if(this.settings.fillStyle) {
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
            var br = ($).browser;
            var isIe9 = br.msie && parseInt(br.version, 10) >= 9;
            if(isIe9) {
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
            if(typeof this.settings.textBaseline != 'undefined' && this.settings.textBaseline === 'middle') {
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
                if(this.screenFontSize != fontSize) {
                    this.screenFontSize = fontSize;
                }
                if(!this.initialized) {
                    if(this.settings.wrapText) {
                        var numberOfLines = this.settings.numberOfLines ? this.settings.numberOfLines : 1;
                        this.settings.numberOfLines = numberOfLines;
                        fontSize = size_p.y / numberOfLines / k;
                        while(true) {
                            ctx.font = fontSize + "pt " + this.settings.fontName;
                            var mlines = this.text.split('\n');
                            var textHeight = 0;
                            var lines = [];
                            for(var il = 0; il < mlines.length; il++) {
                                var words = mlines[il].split(' ');
                                var lineWidth = 0;
                                var currentLine = '';
                                var wsize;
                                var space = ctx.measureText(' ').width;
                                for(var iw = 0; iw < words.length; iw++) {
                                    wsize = ctx.measureText(words[iw]);
                                    var newWidth = lineWidth == 0 ? lineWidth + wsize.width : lineWidth + wsize.width + space;
                                    if(newWidth > size_p.x && lineWidth > 0) {
                                        lines.push(currentLine);
                                        lineWidth = 0;
                                        textHeight += fontSize * k;
                                        iw--;
                                        currentLine = '';
                                    } else {
                                        if(currentLine === '') {
                                            currentLine = words[iw];
                                        } else {
                                            currentLine += ' ' + words[iw];
                                        }
                                        lineWidth = newWidth;
                                    }
                                    var NewWordWidth;
                                    if((words.length == 1) && (wsize.width > size_p.x)) {
                                        var NewWordWidth = wsize.width;
                                        while(NewWordWidth > size_p.x) {
                                            fontSize /= 1.5;
                                            NewWordWidth /= 1.5;
                                        }
                                    }
                                }
                                lines.push(currentLine);
                                textHeight += fontSize * k;
                            }
                            if(textHeight > size_p.y) {
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
                        if(this.width == 0) {
                            var size = ctx.measureText(this.text);
                            size_p.x = size.width;
                            this.width = viewport2d.widthScreenToVirtual(size.width);
                        } else {
                            var size = ctx.measureText(this.text);
                            if(size.width > size_p.x) {
                                this.height = this.width * size_p.y / size.width;
                                if(this.settings.textBaseline === 'middle') {
                                    this.newY = this.newBaseline - this.newHeight / 2;
                                }
                                fontSize = viewport2d.heightVirtualToScreen(this.height);
                                this.screenFontSize = fontSize;
                            } else if(typeof this.settings.adjustWidth && this.settings.adjustWidth) {
                                var nwidth = viewport2d.widthScreenToVirtual(size.width);
                                if(this.settings.textAlign === 'center') {
                                    this.x = this.x + (this.width - nwidth) / 2;
                                } else if(this.settings.textAlign === 'right') {
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
                if(this.settings.textAlign) {
                    ctx.textAlign = this.settings.textAlign;
                    if(this.settings.textAlign === 'center') {
                        p.x = p.x + size_p.x / 2.0;
                    } else if(this.settings.textAlign === 'right') {
                        p.x = p.x + size_p.x;
                    }
                }
                if(!this.settings.wrapText) {
                    if(this.settings.textBaseline) {
                        ctx.textBaseline = this.settings.textBaseline;
                    }
                    drawText(this.text, ctx, p.x, bp, fontSize, this.settings.fontName);
                } else {
                    fontSize = viewport2d.heightVirtualToScreen(this.settings.fontSizeVirtual);
                    this.screenFontSize = fontSize;
                    ctx.textBaseline = 'middle';
                    var bp = p.y + fontSize * k / 2;
                    for(var i = 0; i < this.text.length; i++) {
                        drawText(this.text[i], ctx, p.x, bp, fontSize, this.settings.fontName);
                        bp += fontSize * k;
                    }
                }
            };
            this.isVisible = function (visibleBox_v) {
                var objBottom = this.y + this.height;
                if(this.width > 0) {
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
                    if(fitWidth <= 0) {
                        context.fillText(text, x, y);
                        return;
                    }
                    var words = text.split(' ');
                    var currentLine = 0;
                    var idx = 1;
                    while(words.length > 0 && idx <= words.length) {
                        var str = words.slice(0, idx).join(' ');
                        var w = context.measureText(str).width;
                        if(w > fitWidth) {
                            if(idx == 1) {
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
                    if(idx > 0) {
                        context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
                    }
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
                if(!img['isRemoved']) {
                    if(img.naturalHeight) {
                        var ar0 = self.width / self.height;
                        var ar1 = img.naturalWidth / img.naturalHeight;
                        if(ar0 > ar1) {
                            var imgWidth = ar1 * self.height;
                            var offset = (self.width - imgWidth) / 2.0;
                            self.x += offset;
                            self.width = imgWidth;
                        } else if(ar0 < ar1) {
                            var imgHeight = self.width / ar1;
                            var offset = (self.height - imgHeight) / 2.0;
                            self.y += offset;
                            self.height = imgHeight;
                        }
                    }
                    img['isLoaded'] = true;
                    if(self.onLoad) {
                        self.onLoad();
                    }
                    self.vc.requestInvalidate();
                } else {
                    delete img['isRemoved'];
                    delete img['isLoaded'];
                }
            };
            var onCanvasImageLoadError = function (e) {
                if(!img['isFallback']) {
                    img['isFallback'] = true;
                    img.src = CZ.Settings.fallbackImageUri;
                } else {
                    throw "Cannot load an image!";
                }
            };
            this.img.addEventListener("load", onCanvasImageLoad, false);
            if(onload) {
                this.img.addEventListener("load", onload, false);
            }
            this.img.addEventListener("error", onCanvasImageLoadError, false);
            this.img.src = imageSource;
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if(!this.img.isLoaded) {
                    return;
                }
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                ctx.globalAlpha = opacity;
                ctx.drawImage(this.img, p.x, p.y, size_p.x, size_p.y);
            };
            this.onRemove = function () {
                this.img.removeEventListener("load", onCanvasImageLoad, false);
                this.img.removeEventListener("error", onCanvasImageLoadError, false);
                if(this.onload) {
                    this.img.removeEventListener("load", this.onload, false);
                }
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
                if(n == 0) {
                    return null;
                }
                for(; --n >= 0; ) {
                    if(this.imageSources[n].zoomLevel <= newZoomLevel) {
                        if(this.imageSources[n].zoomLevel === currentZoomLevel) {
                            return null;
                        }
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
                if(content) {
                    content.style.position = 'absolute';
                    content.style.overflow = 'hidden';
                    content.style.zIndex = z;
                }
            };
            this.onIsRenderedChanged = function () {
                if(!this.content) {
                    return;
                }
                if(this.isRendered) {
                    if(!this.content.isAdded) {
                        this.vc.element[0].appendChild(this.content);
                        this.content.isAdded = true;
                    }
                    this.content.style.display = 'block';
                } else {
                    this.content.style.display = 'none';
                }
            };
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if(!this.content) {
                    return;
                }
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
                if(c1 <= c2) {
                    clipRectTop = c1 - p.y;
                    clipRectBottom = c2 - p.y;
                }
                a1 = screenLeft;
                a2 = screenRight;
                b1 = p.x;
                b2 = p.x + size_p.x;
                c1 = Math.max(a1, b1);
                c2 = Math.min(a2, b2);
                if(c1 <= c2) {
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
                if(!this.content) {
                    return;
                }
                try  {
                    if(this.content.isAdded) {
                        if(this.content.src) {
                            this.content.src = "";
                        }
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
            var textElem = $("<div style='position:relative' class='text'></div>");
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
            if(!pdfSrc.match("/^" + pdfViewer + "/")) {
                pdfSrc = pdfViewer + pdfSrc;
            }
            if(pdfSrc.indexOf('?') == -1) {
                pdfSrc += '?&embedded=true&wmode=opaque';
            } else {
                pdfSrc += '&embedded=true&wmode=opaque';
            }
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
            if(videoSrc.indexOf('?') == -1) {
                videoSrc += '?wmode=opaque';
            } else {
                videoSrc += '&wmode=opaque';
            }
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
                if(!this.content) {
                    return;
                }
                var p = viewport2d.pointVirtualToScreen(this.x, this.y);
                var width = parseFloat(srcData[1]);
                var height = parseFloat(srcData[2]);
                var scale = size_p.x / width;
                if(height / width > size_p.y / size_p.x) {
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
        function SeadragonImage(vc, parent, layerid, id, imageSource, vx, vy, vw, vh, z, onload) {
            var self = this;
            this.base = CanvasDomItem;
            this.base(vc, layerid, id, vx, vy, vw, vh, z);
            this.onload = onload;
            this.nAttempts = 0;
            this.timeoutHandles = [];
            var container = document.createElement('div');
            container.setAttribute("id", id);
            container.setAttribute("style", "color: white");
            this.initializeContent(container);
            this.viewer = new Seadragon.Viewer(container);
            this.viewer.elmt.addEventListener("mousemove", CZ.Common.preventbubble, false);
            this.viewer.elmt.addEventListener("mousedown", CZ.Common.preventbubble, false);
            this.viewer.elmt.addEventListener("DOMMouseScroll", CZ.Common.preventbubble, false);
            this.viewer.elmt.addEventListener("mousewheel", CZ.Common.preventbubble, false);
            this.viewer.addEventListener("open", function (e) {
                if(self.onload) {
                    self.onload();
                }
                self.vc.requestInvalidate();
            });
            this.viewer.addEventListener("resize", function (e) {
                self.viewer.setDashboardEnabled(e.elmt.clientWidth > 250);
            });
            this.onSuccess = function (resp) {
                if(resp.error) {
                    self.showFallbackImage();
                    return;
                }
                var content = resp.content;
                if(content.ready) {
                    for(var i = 0; i < self.timeoutHandles.length; i++) {
                        clearTimeout(self.timeoutHandles[i]);
                    }
                    self.viewer.openDzi(content.dzi);
                } else if(content.failed) {
                    self.showFallbackImage();
                } else {
                    if(self.nAttempts < CZ.Settings.seadragonMaxConnectionAttempts) {
                        self.viewer.showMessage("Loading " + Math.round(100 * content.progress) + "% done.");
                        self.timeoutHandles.push(setTimeout(self.requestDZI, CZ.Settings.seadragonRetryInterval));
                    } else {
                        self.showFallbackImage();
                    }
                }
            };
            this.onError = function () {
                if(self.nAttempts < CZ.Settings.seadragonMaxConnectionAttempts) {
                    self.timeoutHandles.push(setTimeout(self.requestDZI, CZ.Settings.seadragonRetryInterval));
                } else {
                    self.showFallbackImage();
                }
            };
            this.requestDZI = function () {
                self.nAttempts++;
                $.ajax({
                    url: CZ.Settings.seadragonServiceURL + encodeURIComponent(imageSource),
                    dataType: "jsonp",
                    success: self.onSuccess,
                    error: self.onError
                });
            };
            this.render = function (ctx, visibleBox, viewport2d, size_p, opacity) {
                if(self.viewer.isFullPage()) {
                    return;
                }
                this.prototype.render.call(this, ctx, visibleBox, viewport2d, size_p, opacity);
                if(self.viewer.viewport) {
                    self.viewer.viewport.resize({
                        x: size_p.x,
                        y: size_p.y
                    });
                    self.viewer.viewport.update();
                }
            };
            this.onRemove = function () {
                self.viewer.close();
                this.prototype.onRemove.call(this);
            };
            this.showFallbackImage = function () {
                for(var i = 0; i < self.timeoutHandles.length; i++) {
                    clearTimeout(self.timeoutHandles[i]);
                }
                self.onRemove();
                VCContent.removeChild(parent, self.id);
                VCContent.addImage(parent, layerid, id, vx, vy, vw, vh, imageSource);
            };
            self.requestDZI();
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
                strokeStyle: CZ.Settings.contentItemBoundingBoxBorderColor,
                lineWidth: CZ.Settings.contentItemBoundingBoxBorderWidth * vw,
                fillStyle: CZ.Settings.contentItemBoundingBoxFillColor,
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
                if(newZl >= CZ.Settings.contentItemShowContentZoomLevel) {
                    if(curZl >= CZ.Settings.contentItemShowContentZoomLevel) {
                        return null;
                    }
                    var container = new ContainerElement(vc, layerid, id + "__content", vx, vy, vw, vh);
                    var mediaID = id + "__media__";
                    var imageElem = null;
                    if(this.contentItem.mediaType.toLowerCase() === 'image' || this.contentItem.mediaType.toLowerCase() === 'picture') {
                        imageElem = VCContent.addImage(container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, this.contentItem.uri);
                    } else if(this.contentItem.mediaType.toLowerCase() === 'deepimage') {
                        imageElem = VCContent.addSeadragonImage(container, layerid, mediaID, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex, this.contentItem.uri);
                    } else if(this.contentItem.mediaType.toLowerCase() === 'video') {
                        VCContent.addVideo(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if(this.contentItem.mediaType.toLowerCase() === 'audio') {
                        mediaTop += CZ.Settings.contentItemAudioTopMargin * vh;
                        mediaHeight = vh * CZ.Settings.contentItemAudioHeight;
                        addAudio(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if(this.contentItem.mediaType.toLowerCase() === 'pdf') {
                        VCContent.addPdf(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if(this.contentItem.mediaType.toLowerCase() === 'skydrive-document') {
                        VCContent.addSkydriveDocument(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if(this.contentItem.mediaType.toLowerCase() === 'skydrive-image') {
                        VCContent.addSkydriveImage(container, layerid, mediaID, this.contentItem.uri, vx + leftOffset, mediaTop, contentWidth, mediaHeight, CZ.Settings.mediaContentElementZIndex);
                    } else if(CZ.Extensions.mediaTypeIsExtension(contentItem.mediaType)) {
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
                    if(sourceText) {
                        var addSourceText = function (sx, sw, sy) {
                            var sourceItem = addText(container, layerid, id + "__source__", sx, sy, sy + sourceHeight / 2.0, 0.9 * sourceHeight, sourceText, {
                                fontName: CZ.Settings.contentItemHeaderFontName,
                                fillStyle: CZ.Settings.contentItemSourceFontColor,
                                textBaseline: 'middle',
                                textAlign: 'right',
                                opacity: 1,
                                adjustWidth: true
                            }, sw);
                            if(mediaSource) {
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
                    var descr = addScrollText(container, layerid, id + "__description__", vx + leftOffset, descrTop, contentWidth, descrHeight, this.contentItem.description, 30, {
                    });
                    if(CZ.Authoring.isEnabled) {
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
                    if(zl >= CZ.Settings.contentItemThumbnailMaxLevel) {
                        if(curZl >= CZ.Settings.contentItemThumbnailMaxLevel && curZl < CZ.Settings.contentItemShowContentZoomLevel) {
                            return null;
                        }
                        zl = CZ.Settings.contentItemThumbnailMaxLevel;
                    } else if(zl <= CZ.Settings.contentItemThumbnailMinLevel) {
                        if(curZl <= CZ.Settings.contentItemThumbnailMinLevel && curZl > 0) {
                            return null;
                        }
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
            this.base(vc, layerid, id, time, vyc, radv, {
                strokeStyle: CZ.Settings.infoDotBorderColor,
                lineWidth: CZ.Settings.infoDotBorderWidth * radv,
                fillStyle: CZ.Settings.infoDotFillColor,
                isLineWidthVirtual: true
            });
            this.guid = infodotDescription.guid;
            this.type = 'infodot';
            this.isBuffered = infodotDescription.isBuffered;
            this.contentItems = contentItems;
            this.hasContentItems = false;
            this.infodotDescription = infodotDescription;
            this.title = infodotDescription.title;
            this.opacity = typeof infodotDescription.opacity !== 'undefined' ? infodotDescription.opacity : 1;
            contentItems.sort(function (a, b) {
                if(typeof a.order !== 'undefined' && typeof b.order === 'undefined') {
                    return -1;
                } else if(typeof a.order === 'undefined' && typeof b.order !== 'undefined') {
                    return 1;
                } else if(typeof a.order === 'undefined' && typeof b.order === 'undefined') {
                    return 0;
                } else if(a.order < b.order) {
                    return -1;
                } else if(a.order > b.order) {
                    return 1;
                } else {
                    return 0;
                }
            });
            for(var i = 0; i < contentItems.length; i++) {
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
                if(this.vc.currentlyHoveredTimeline != null) {
                    CZ.Common.stopAnimationTooltip();
                    this.vc.currentlyHoveredTimeline.tooltipIsShown = false;
                }
                $(".bubbleInfo span").text(infodotDescription.title);
                this.panelWidth = $('.bubbleInfo').outerWidth();
                this.panelHeight = $('.bubbleInfo').outerHeight();
                CZ.Common.tooltipMode = "infodot";
                if((this.tooltipEnabled == true) && (this.tooltipIsShown == false)) {
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
                if(this.tooltipIsShown == true) {
                    CZ.Common.stopAnimationTooltip();
                }
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
                if(newZl >= CZ.Settings.infodotShowContentThumbZoomLevel && newZl < CZ.Settings.infodotShowContentZoomLevel) {
                    var URL = CZ.UrlNav.getURL();
                    if(typeof URL.hash.params != 'undefined' && typeof URL.hash.params['b'] != 'undefined') {
                        bibliographyFlag = false;
                    }
                    if(curZl >= CZ.Settings.infodotShowContentThumbZoomLevel && curZl < CZ.Settings.infodotShowContentZoomLevel) {
                        return null;
                    }
                    infodot.tooltipEnabled = true;
                    var contentItem = null;
                    if(infodot.contentItems.length > 0) {
                        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.newY, 2 * innerRad, 2 * innerRad);
                        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
                        if(items) {
                            for(var i = 0; i < items.length; i++) {
                                VCContent.addChild(contentItem, items[i], false);
                            }
                        }
                    }
                    if(contentItem) {
                        infodot.hasContentItems = true;
                        return {
                            zoomLevel: newZl,
                            content: contentItem
                        };
                    } else {
                        return null;
                    }
                } else if(newZl >= CZ.Settings.infodotShowContentZoomLevel) {
                    if(curZl >= CZ.Settings.infodotShowContentZoomLevel) {
                        return null;
                    }
                    infodot.tooltipEnabled = false;
                    if(infodot.tooltipIsShown == true) {
                        CZ.Common.stopAnimationTooltip();
                        infodot.tooltipIsShown = false;
                    }
                    var contentItem = null;
                    if(infodot.contentItems.length > 0) {
                        contentItem = new ContainerElement(vc, layerid, id + "__contentItems", root.x, root.y, 2 * innerRad, 2 * innerRad);
                        var items = buildVcContentItems(infodot.contentItems, time, vyc, innerRad, vc, layerid);
                        if(items) {
                            for(var i = 0; i < items.length; i++) {
                                VCContent.addChild(contentItem, items[i], false);
                            }
                        }
                    }
                    if(contentItem == null) {
                        return null;
                    }
                    var titleWidth = CZ.Settings.infodotTitleWidth * radv * 2;
                    var titleHeight = CZ.Settings.infodotTitleHeight * radv * 2;
                    var centralSquareSize = (270 / 2 + 5) / 450 * 2 * radv;
                    var titleTop = vyc - centralSquareSize - titleHeight;
                    var title = '';
                    if(infodotDescription && infodotDescription.title && infodotDescription.date) {
                        var exhibitDate = CZ.Dates.convertCoordinateToYear(infodotDescription.date);
                        if((exhibitDate.regime == "CE") || (exhibitDate.regime == "BCE")) {
                            var date_number = Number(infodotDescription.date);
                            var exhibitDate = CZ.Dates.convertCoordinateToYear(date_number);
                            var exhibitYMD = CZ.Dates.getYMDFromCoordinate(date_number);
                            date_number = Math.abs(date_number);
                            if(date_number == Math.floor(date_number)) {
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
                    if(CZ.Authoring.isEnabled) {
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
                        CZ.Bibliography.showBibliography({
                            infodot: infodotDescription,
                            contentItems: infodot.contentItems
                        }, contentItem, id + "__bibliography");
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
                    if(bid && bibliographyFlag) {
                        CZ.Bibliography.showBibliography({
                            infodot: infodotDescription,
                            contentItems: infodot.contentItems
                        }, contentItem, bid[1]);
                    }
                    if(contentItem) {
                        infodot.hasContentItems = true;
                        return {
                            zoomLevel: newZl,
                            content: contentItem
                        };
                    }
                } else {
                    infodot.tooltipEnabled = true;
                    infodot.hasContentItems = false;
                    if(infodot.contentItems.length == 0) {
                        return null;
                    }
                    var zl = newZl;
                    if(zl <= CZ.Settings.contentItemThumbnailMinLevel) {
                        if(curZl <= CZ.Settings.contentItemThumbnailMinLevel && curZl > 0) {
                            return null;
                        }
                    }
                    if(zl >= CZ.Settings.contentItemThumbnailMaxLevel) {
                        if(curZl >= CZ.Settings.contentItemThumbnailMaxLevel && curZl < CZ.Settings.infodotShowContentZoomLevel) {
                            return null;
                        }
                        zl = CZ.Settings.contentItemThumbnailMaxLevel;
                    }
                    if(zl < CZ.Settings.contentItemThumbnailMinLevel) {
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
                if(sw < 0.5) {
                    return;
                }
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
            this.prototype = new CanvasCircle(vc, layerid, id, time, vyc, radv, {
                strokeStyle: CZ.Settings.infoDotBorderColor,
                lineWidth: CZ.Settings.infoDotBorderWidth * radv,
                fillStyle: CZ.Settings.infoDotFillColor,
                isLineWidthVirtual: true
            });
        }
        function getContentItem(infodot, cid) {
            if(infodot.type !== 'infodot' || infodot.contentItems.length === 0) {
                return null;
            }
            var radv = infodot.width / 2;
            var innerRad = radv - CZ.Settings.infoDotHoveredBorderWidth * radv;
            var citems = buildVcContentItems(infodot.contentItems, infodot.x + infodot.width / 2, infodot.y + infodot.height / 2, innerRad, infodot.vc, infodot.layerid);
            if(!citems) {
                return null;
            }
            for(var i = 0; i < citems.length; i++) {
                if(citems[i].id == cid) {
                    return {
                        id: cid,
                        x: citems[i].x,
                        y: citems[i].y,
                        width: citems[i].width,
                        height: citems[i].height,
                        parent: infodot,
                        type: "contentItem",
                        vc: infodot.vc
                    };
                }
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
            if(n <= 0) {
                return null;
            }
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
            for(var i = 0, len = Math.min(CZ.Settings.infodotMaxContentItemsCount, n); i < len; i++) {
                var ci = contentItems[i];
                if(i === 0) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, -_wc / 2 * rad + xc, -_hc / 2 * rad + yc, _wc * rad, _hc * rad, ci));
                } else if(i >= 1 && i <= 3) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xl, yc + rad * arrangeLeft[(i - 1) % 3], lw, lh, ci));
                } else if(i >= 4 && i <= 6) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xr, yc + rad * arrangeRight[(i - 1) % 3], lw, lh, ci));
                } else if(i >= 7 && i <= 9) {
                    vcitems.push(new ContentItem(vc, layerid, ci.id, xc + rad * arrangeBottom[(i - 1) % 3], yb, lw, lh, ci));
                }
            }
            return vcitems;
        }
        function arrangeContentItemsInField(n, dx) {
            if(n == 0) {
                return null;
            }
            var margin = 0.05 * dx;
            var x1, x2, x3, x4;
            if(n % 2 == 0) {
                x1 = -margin / 2 - dx;
                x2 = margin / 2;
                if(n == 4) {
                    x3 = x1 - dx - margin;
                    x4 = x2 + margin + dx;
                    return [
                        x3, 
                        x1, 
                        x2, 
                        x4
                    ];
                }
                return [
                    x1, 
                    x2
                ];
            } else {
                x1 = -dx / 2;
                if(n > 1) {
                    x2 = dx / 2 + margin;
                    x3 = x1 - dx - margin;
                    return [
                        x3, 
                        x1, 
                        x2
                    ];
                }
                return [
                    x1
                ];
            }
        }
    })(CZ.VCContent || (CZ.VCContent = {}));
    var VCContent = CZ.VCContent;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var ListBoxBase = (function () {
            function ListBoxBase(container, listBoxInfo, listItemsInfo, getType) {
                if (typeof getType === "undefined") { getType = function (context) {
                    return "default";
                }; }
                if(!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }
                this.container = container;
                this.listItemsInfo = listItemsInfo;
                this.getType = getType;
                this.items = [];
                if(this.listItemsInfo.default) {
                    this.listItemsInfo.default.ctor = this.listItemsInfo.default.ctor || ListItemBase;
                }
                for(var i = 0, context = listBoxInfo.context, len = context.length; i < len; ++i) {
                    this.add(context[i]);
                }
                this.itemDblClickHandler = function (item, idx) {
                };
                this.itemRemoveHandler = function (item, idx) {
                };
                this.itemMoveHandler = function (item, idx1, idx2) {
                };
                var self = this;
                if(listBoxInfo.sortableSettings) {
                    var origStart = listBoxInfo.sortableSettings.start;
                    var origStop = listBoxInfo.sortableSettings.stop;
                    $.extend(listBoxInfo.sortableSettings, {
                        start: function (event, ui) {
                            ui.item.startPos = ui.item.index();
                            if(origStart) {
                                origStart(event, ui);
                            }
                        },
                        stop: function (event, ui) {
                            ui.item.stopPos = ui.item.index();
                            var item = self.items.splice(ui.item.startPos, 1)[0];
                            self.items.splice(ui.item.stopPos, 0, item);
                            self.itemMoveHandler(ui.item, ui.item.startPos, ui.item.stopPos);
                            if(origStop) {
                                origStop(event, ui);
                            }
                        }
                    });
                    this.container.sortable(listBoxInfo.sortableSettings);
                }
            }
            ListBoxBase.prototype.add = function (context) {
                var type = this.getType(context);
                var typeInfo = this.listItemsInfo[type];
                var container = typeInfo.container.clone();
                var uiMap = typeInfo.uiMap;
                var ctor = typeInfo.ctor;
                var item = new ctor(this, container, uiMap, context);
                this.items.push(item);
                return item;
            };
            ListBoxBase.prototype.remove = function (item) {
                var i = this.items.indexOf(item);
                if(i !== -1) {
                    item.container.remove();
                    this.items.splice(i, 1);
                    this.itemRemoveHandler(item, i);
                }
            };
            ListBoxBase.prototype.clear = function () {
                for(var i = 0, len = this.items.length; i < len; ++i) {
                    var item = this.items[i];
                    item.container.remove();
                }
                this.items.length = 0;
            };
            ListBoxBase.prototype.selectItem = function (item) {
                var i = this.items.indexOf(item);
                if(i !== -1) {
                    this.itemDblClickHandler(item, i);
                }
            };
            ListBoxBase.prototype.itemDblClick = function (handler) {
                this.itemDblClickHandler = handler;
            };
            ListBoxBase.prototype.itemRemove = function (handler) {
                this.itemRemoveHandler = handler;
            };
            ListBoxBase.prototype.itemMove = function (handler) {
                this.itemMoveHandler = handler;
            };
            return ListBoxBase;
        })();
        UI.ListBoxBase = ListBoxBase;        
        var ListItemBase = (function () {
            function ListItemBase(parent, container, uiMap, context) {
                var _this = this;
                if(!(container instanceof jQuery)) {
                    throw "Container parameter is invalid! It should be jQuery instance.";
                }
                this.parent = parent;
                this.container = container;
                this.data = context;
                this.container.dblclick(function (_) {
                    return _this.parent.selectItem(_this);
                });
                this.closeButton = this.container.find(uiMap.closeButton);
                if(this.closeButton.length) {
                    this.closeButton.click(function (event) {
                        return _this.close();
                    });
                }
                this.parent.container.append(this.container);
            }
            ListItemBase.prototype.close = function () {
                this.parent.remove(this);
            };
            return ListItemBase;
        })();
        UI.ListItemBase = ListItemBase;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStopListBox = (function (_super) {
            __extends(TourStopListBox, _super);
            function TourStopListBox(container, listItemContainer, contentItems) {
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: {
                        forcePlaceholderSize: true,
                        cursor: "move",
                        placeholder: "cz-listbox-placeholder",
                        revert: 100,
                        opacity: 0.75,
                        tolerance: "pointer",
                        scroll: false,
                        start: function (event, ui) {
                            ui.placeholder.height(ui.item.height());
                        }
                    }
                };
                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-form-tour-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            typeTextblock: ".cz-contentitem-listitem-highlighted"
                        }
                    }
                };
                listItemsInfo.default.ctor = TourStopListItem;
                        _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            return TourStopListBox;
        })(UI.ListBoxBase);
        UI.TourStopListBox = TourStopListBox;        
        var TourStopListItem = (function (_super) {
            __extends(TourStopListItem, _super);
            function TourStopListItem(parent, container, uiMap, context) {
                        _super.call(this, parent, container, uiMap, context);
                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.typeTextblock = this.container.find(uiMap.typeTextblock);
                var self = this;
                var descr = this.container.find(".cz-tourstop-description");
                descr.text(self.data.Description);
                descr.change(function (ev) {
                    self.data.Description = self.Description;
                });
                var thumbUrl = this.data.ThumbnailUrl;
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if(console && console.warn) {
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                    }
                };
                img.src = thumbUrl;
                this.titleTextblock.text(this.data.Title);
                this.typeTextblock.text(this.data.Type);
                this.Activate();
                this.container.click(function (e) {
                    self.Activate();
                });
                this.container.dblclick(function (e) {
                    if(typeof context.Target.vc == "undefined") {
                        return;
                    }
                    var vp = context.Target.vc.getViewport();
                    var visible = CZ.VCContent.getVisibleForElement(context.Target, 1.0, vp, true);
                    var target = {
                        newvisible: visible,
                        element: context.Target
                    };
                    CZ.Search.navigateToElement(target);
                });
            }
            Object.defineProperty(TourStopListItem.prototype, "Description", {
                get: function () {
                    var descr = this.container.find(".cz-tourstop-description");
                    return descr.val();
                },
                enumerable: true,
                configurable: true
            });
            TourStopListItem.prototype.Activate = function () {
                var myDescr = this.container.find(".cz-tourstop-description");
                this.parent.container.find(".cz-tourstop-description").not(myDescr).hide();
                myDescr.show(500);
            };
            return TourStopListItem;
        })(UI.ListItemBase);
        UI.TourStopListItem = TourStopListItem;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStop = (function () {
            function TourStop(target, title) {
                if(target == undefined || target == null) {
                    throw "target element of a tour stop is null or undefined";
                }
                if(typeof target.type == "undefined") {
                    throw "type of the tour stop target element is undefined";
                }
                this.targetElement = target;
                if(target.type === "Unknown") {
                    this.type = target.type;
                    this.title = title;
                } else if(target.type === "contentItem") {
                    this.type = "Content Item";
                    this.title = title ? title : target.contentItem.title;
                } else {
                    this.type = target.type === "timeline" ? "Timeline" : "Event";
                    this.title = title ? title : target.title;
                }
            }
            Object.defineProperty(TourStop.prototype, "Target", {
                get: function () {
                    return this.targetElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourStop.prototype, "Title", {
                get: function () {
                    return this.title;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourStop.prototype, "Description", {
                get: function () {
                    return this.description;
                },
                set: function (d) {
                    this.description = d;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourStop.prototype, "LapseTime", {
                get: function () {
                    return this.lapseTime;
                },
                set: function (value) {
                    this.lapseTime = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourStop.prototype, "Type", {
                get: function () {
                    return this.type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourStop.prototype, "NavigationUrl", {
                get: function () {
                    return CZ.UrlNav.vcelementToNavString(this.targetElement);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourStop.prototype, "ThumbnailUrl", {
                get: function () {
                    if(!this.thumbUrl) {
                        this.thumbUrl = this.GetThumbnail(this.targetElement);
                    }
                    return this.thumbUrl;
                },
                enumerable: true,
                configurable: true
            });
            TourStop.prototype.GetThumbnail = function (element) {
                var defaultThumb = "/images/Temp-Thumbnail2.png";
                try  {
                    if(!element) {
                        return defaultThumb;
                    }
                    if(element.type === "contentItem") {
                        var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x64/' + element.id + '.png';
                        return thumbnailUri;
                    }
                    if(element.type === "infodot") {
                        if(element.contentItems && element.contentItems.length > 0) {
                            var child = element.contentItems[0];
                            var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x64/' + child.id + '.png';
                            return thumbnailUri;
                        }
                    } else if(element.type === "timeline") {
                        for(var n = element.children.length, i = 0; i < n; i++) {
                            var child = element.children[i];
                            if(child.type === "infodot" || child.type === "timeline") {
                                var thumb = this.GetThumbnail(child);
                                if(thumb && thumb !== defaultThumb) {
                                    return thumb;
                                }
                            }
                        }
                    }
                } catch (exc) {
                    if(console && console.error) {
                        console.error("Failed to get a thumbnail url: " + exc);
                    }
                }
                return defaultThumb;
            };
            return TourStop;
        })();
        UI.TourStop = TourStop;        
        var Tour = (function () {
            function Tour(id, title, description, category, sequence, stops) {
                this.id = id;
                this.title = title;
                this.description = description;
                this.sequence = sequence;
                this.stops = stops;
                this.category = category;
            }
            Object.defineProperty(Tour.prototype, "Id", {
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tour.prototype, "Title", {
                get: function () {
                    return this.title;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tour.prototype, "Category", {
                get: function () {
                    return this.category;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tour.prototype, "Sequence", {
                get: function () {
                    return this.sequence;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tour.prototype, "Description", {
                get: function () {
                    return this.description;
                },
                set: function (val) {
                    this.description = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tour.prototype, "Stops", {
                get: function () {
                    return this.stops;
                },
                enumerable: true,
                configurable: true
            });
            return Tour;
        })();
        UI.Tour = Tour;        
        var FormEditTour = (function (_super) {
            __extends(FormEditTour, _super);
            function FormEditTour(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.addStopButton = container.find(formInfo.addStopButton);
                this.titleInput = container.find(formInfo.titleInput);
                this.tourTitleInput = this.container.find(".cz-form-tour-title");
                this.tourDescriptionInput = this.container.find(".cz-form-tour-description");
                this.clean();
                this.saveButton.off();
                this.deleteButton.off();
                this.tour = formInfo.context;
                var stops = [];
                var self = this;
                if(this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    this.tourDescriptionInput.val(this.tour.description);
                    for(var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
                        var bookmark = this.tour.bookmarks[i];
                        var stop = FormEditTour.bookmarkToTourstop(bookmark);
                        stops.push(stop);
                    }
                } else {
                    this.tourTitleInput.val("");
                    this.tourDescriptionInput.val("");
                }
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, stops);
                this.tourStopsListBox.itemMove(function (item, startPos, endPos) {
                    return self.onStopsReordered.apply(self, [
                        item, 
                        startPos, 
                        endPos
                    ]);
                });
                this.tourStopsListBox.itemRemove(function (item, index) {
                    return self.onStopRemoved.apply(self, [
                        item, 
                        index
                    ]);
                });
                this.initialize();
            }
            FormEditTour.bookmarkToTourstop = function bookmarkToTourstop(bookmark) {
                var target = CZ.Tours.bookmarkUrlToElement(bookmark.url);
                if(target == null) {
                    target = {
                        type: "Unknown"
                    };
                }
                var stop = new TourStop(target, (!bookmark.caption || $.trim(bookmark.caption) === "") ? undefined : bookmark.caption);
                stop.Description = bookmark.text;
                stop.LapseTime = bookmark.lapseTime;
                return stop;
            };
            FormEditTour.tourstopToBookmark = function tourstopToBookmark(tourstop, index) {
                var url = CZ.UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var bookmark = new CZ.Tours.TourBookmark(url, title, tourstop.LapseTime, tourstop.Description);
                bookmark.number = index + 1;
                return bookmark;
            };
            FormEditTour.prototype.deleteTourAsync = function () {
                return CZ.Service.deleteTour(this.tour.id);
            };
            FormEditTour.prototype.putTourAsync = function (sequenceNum) {
                var deferred = $.Deferred();
                var self = this;
                var stops = this.getStops();
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var category = "tours";
                var n = stops.length;
                var tourId = undefined;
                if(this.tour) {
                    category = this.tour.category;
                    tourId = this.tour.id;
                }
                var request = CZ.Service.putTour2(new CZ.UI.Tour(tourId, name, descr, category, n, stops));
                request.done(function (q) {
                    var tourBookmarks = new Array();
                    for(var j = 0; j < n; j++) {
                        var tourstop = stops[j];
                        var bookmark = FormEditTour.tourstopToBookmark(tourstop, j);
                        tourBookmarks.push(bookmark);
                    }
                    var tour = new CZ.Tours.Tour(q.TourId, name, tourBookmarks, CZ.Tours.bookmarkTransition, CZ.Common.vc, category, "", sequenceNum, descr);
                    deferred.resolve(tour);
                }).fail(function (q) {
                    deferred.reject(q);
                });
                return deferred.promise();
            };
            FormEditTour.prototype.initializeAsEdit = function () {
                this.deleteButton.show();
                this.titleTextblock.text("Edit Tour");
                this.saveButton.text("update tour");
            };
            FormEditTour.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);
                if(this.tour == null) {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Tour");
                    this.saveButton.text("create tour");
                } else {
                    this.initializeAsEdit();
                }
                var self = this;
                this.addStopButton.click(function (event) {
                    CZ.Authoring.isActive = true;
                    CZ.Authoring.mode = "editTour-selectTarget";
                    CZ.Authoring.callback = function (arg) {
                        return self.onTargetElementSelected(arg);
                    };
                    self.hide();
                    setTimeout(function () {
                        if(CZ.Authoring.mode == "editTour-selectTarget") {
                            CZ.Authoring.showMessageWindow("Click an element to select it as a tour stop.", "New tour stop", function () {
                                if(CZ.Authoring.mode == "editTour-selectTarget") {
                                    self.onTargetElementSelected(null);
                                }
                            });
                        }
                    }, 500);
                });
                this.saveButton.click(function (event) {
                    var message;
                    if(!_this.tourTitleInput.val()) {
                        message = "Please enter the title.";
                    } else if(_this.tourStopsListBox.items.length == 0) {
                        message = "Please add a tour stop to the tour.";
                    }
                    if(message) {
                        alert(message);
                        return;
                    }
                    var self = _this;
                    _this.saveButton.prop('disabled', true);
                    if(_this.tour == null) {
                        _this.putTourAsync(CZ.Tours.tours.length).done(function (tour) {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);
                            _this.hide();
                        }).fail(function (f) {
                            if(console && console.error) {
                                console.error("Failed to create a tour: " + f.status + " " + f.statusText);
                            }
                            alert("Failed to create a tour");
                        }).done(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    } else {
                        for(var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if(CZ.Tours.tours[i] === _this.tour) {
                                _this.putTourAsync(i).done(function (tour) {
                                    _this.tour = CZ.Tours.tours[i] = tour;
                                    _this.hide();
                                }).fail(function (f) {
                                    if(console && console.error) {
                                        console.error("Failed to update a tour: " + f.status + " " + f.statusText);
                                    }
                                    alert("Failed to update a tour");
                                }).always(function () {
                                    _this.saveButton.prop('disabled', false);
                                });
                                break;
                            }
                        }
                    }
                });
                this.deleteButton.click(function (event) {
                    if(_this.tour == null) {
                        return;
                    }
                    _this.deleteTourAsync().done(function (q) {
                        for(var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if(CZ.Tours.tours[i] === _this.tour) {
                                _this.tour = null;
                                CZ.Tours.tours.splice(i, 1);
                                _this.close();
                                break;
                            }
                        }
                    }).fail(function (f) {
                        if(console && console.error) {
                            console.error("Failed to delete a tour: " + f.status + " " + f.statusText);
                        }
                        alert("Failed to delete a tour");
                    });
                });
            };
            FormEditTour.prototype.getStops = function () {
                var n = this.tourStopsListBox.items.length;
                var stops = new Array(n);
                for(; --n >= 0; ) {
                    stops[n] = this.tourStopsListBox.items[n].data;
                }
                return stops;
            };
            FormEditTour.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditTour.prototype.hide = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            FormEditTour.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });
                CZ.Authoring.isActive = false;
                this.clean();
            };
            FormEditTour.prototype.clean = function () {
                this.activationSource.removeClass("active");
                this.container.find(".cz-form-errormsg").hide();
                this.container.find(".cz-listbox").empty();
                this.tourTitleInput.val("");
                this.tourDescriptionInput.val("");
            };
            FormEditTour.prototype.onStopsReordered = function () {
                this.updateSequence();
            };
            FormEditTour.prototype.onStopRemoved = function () {
                this.updateSequence();
            };
            FormEditTour.prototype.updateSequence = function () {
                var stops = this.getStops();
                var n = stops.length;
                var lapseTime = 0;
                for(var i = 0; i < n; i++) {
                    var stop = stops[i];
                    stop.LapseTime = lapseTime;
                    lapseTime += CZ.Settings.tourDefaultTransitionTime;
                }
            };
            FormEditTour.prototype.onTargetElementSelected = function (targetElement) {
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.hideMessageWindow();
                CZ.Authoring.isActive = false;
                CZ.Authoring.callback = null;
                if(targetElement) {
                    var n = this.tourStopsListBox.items.length;
                    var stop = new TourStop(targetElement);
                    stop.LapseTime = n == 0 ? 0 : ((this.tourStopsListBox.items[this.tourStopsListBox.items.length - 1]).data).LapseTime + CZ.Settings.tourDefaultTransitionTime;
                    this.tourStopsListBox.add(stop);
                }
                this.show();
            };
            return FormEditTour;
        })(CZ.UI.FormBase);
        UI.FormEditTour = FormEditTour;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Service) {
        var Map;
        (function (Map) {
            function bookmark(ts) {
                return {
                    name: ts.Title,
                    url: ts.NavigationUrl,
                    lapseTime: ts.LapseTime,
                    description: ts.Description
                };
            }
            function tour(t) {
                var bookmarks = new Array(t.Stops.length);
                for(var i = 0, n = t.Stops.length; i < n; i++) {
                    bookmarks[i] = bookmark(t.Stops[i]);
                }
                var tourRequest = {
                    id: t.Id,
                    name: t.Title,
                    description: t.Description,
                    audio: "",
                    category: t.Category,
                    sequence: t.Sequence,
                    bookmarks: bookmarks
                };
                return tourRequest;
            }
            Map.tour = tour;
            function timeline(t) {
                return {
                    id: t.guid,
                    ParentTimelineId: t.parent.guid,
                    start: CZ.Dates.getDecimalYearFromCoordinate(t.x),
                    end: typeof t.endDate !== 'undefined' ? t.endDate : CZ.Dates.getDecimalYearFromCoordinate(t.x + t.width),
                    title: t.title,
                    Regime: t.regime
                };
            }
            Map.timeline = timeline;
            function exhibit(e) {
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: undefined
                };
            }
            Map.exhibit = exhibit;
            function exhibitWithContentItems(e) {
                var mappedContentItems = [];
                $(e.contentItems).each(function (contentItemIndex, contentItem) {
                    mappedContentItems.push(Map.contentItem(contentItem));
                });
                return {
                    id: e.guid,
                    ParentTimelineId: e.parent.guid,
                    time: e.infodotDescription.date,
                    title: e.title,
                    description: undefined,
                    contentItems: mappedContentItems
                };
            }
            Map.exhibitWithContentItems = exhibitWithContentItems;
            function contentItem(ci) {
                return {
                    id: ci.guid,
                    ParentExhibitId: ci.contentItem ? ci.contentItem.ParentExhibitId : ci.ParentExhibitId,
                    title: ci.contentItem ? ci.contentItem.title : ci.title,
                    description: ci.contentItem ? ci.contentItem.description : ci.description,
                    uri: ci.contentItem ? ci.contentItem.uri : ci.uri,
                    mediaType: ci.contentItem ? ci.contentItem.mediaType : ci.mediaType,
                    attribution: ci.contentItem ? ci.contentItem.attribution : ci.attribution,
                    mediaSource: ci.contentItem ? ci.contentItem.mediaSource : ci.mediaSource,
                    order: ci.contentItem ? ci.contentItem.order : ci.order
                };
            }
            Map.contentItem = contentItem;
        })(Map || (Map = {}));
        var _serviceUrl = CZ.Settings.serverUrlHost + "/api/";
        function Request(urlBase) {
            var _url = urlBase;
            var _hasParameters = false;
            Object.defineProperty(this, "url", {
                configurable: false,
                get: function () {
                    return _url;
                }
            });
            this.addToPath = function (item) {
                if(item) {
                    _url += _url.match(/\/$/) ? item : "/" + item;
                }
            };
            this.addParameter = function (name, value) {
                if(value !== undefined && value !== null) {
                    _url += _hasParameters ? "&" : "?";
                    _url += name + "=" + value;
                    _hasParameters = true;
                }
            };
            this.addParameters = function (params) {
                for(var p in params) {
                    if(params.hasOwnProperty(p)) {
                        this.addParameter(p, params[p]);
                    }
                }
            };
        }
        Service.Request = Request;
        ;
        Service.collectionName = "";
        Service.superCollectionName = "";
        function getTimelines(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("gettimelines");
            request.addParameter("supercollection", Service.superCollectionName);
            request.addParameter("collection", Service.collectionName);
            request.addParameters(r);
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTimelines = getTimelines;
        function getCollections(superCollectionName) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath("collections");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getCollections = getCollections;
        function getStructure(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("structure");
            request.addParameters(r);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getStructure = getStructure;
        function postData(r) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("data");
            return $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(r)
            });
        }
        Service.postData = postData;
        function putCollection(superCollectionName, collectionName, c) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(superCollectionName);
            request.addToPath(collectionName);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.putCollection = putCollection;
        function deleteCollection(c) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(c.name);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(c)
            });
        }
        Service.deleteCollection = deleteCollection;
        function putTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.putTimeline = putTimeline;
        function deleteTimeline(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("timeline");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.timeline(t))
            });
        }
        Service.deleteTimeline = deleteTimeline;
        function putExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.exhibitWithContentItems(e))
            });
        }
        Service.putExhibit = putExhibit;
        function deleteExhibit(e) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("exhibit");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.exhibit(e))
            });
        }
        Service.deleteExhibit = deleteExhibit;
        function putContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.putContentItem = putContentItem;
        function deleteContentItem(ci) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("contentitem");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(Map.contentItem(ci))
            });
        }
        Service.deleteContentItem = deleteContentItem;
        function putTour2(t) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tour2");
            console.log("[PUT] " + request.url);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify(Map.tour(t))
            });
        }
        Service.putTour2 = putTour2;
        function deleteTour(tourId) {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tour");
            console.log("[DELETE] " + request.url);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: JSON.stringify({
                    id: tourId
                })
            });
        }
        Service.deleteTour = deleteTour;
        function getTours() {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath("tours");
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getTours = getTours;
        function getSearch(query) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("Search");
            var data = {
                searchTerm: query,
                supercollection: CZ.Service.superCollectionName,
                collection: CZ.Service.collectionName
            };
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data
            });
        }
        Service.getSearch = getSearch;
        function getBingImages(query, top, skip) {
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getImages");
            var data = {
                query: query,
                top: top,
                skip: skip
            };
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingImages = getBingImages;
        function getBingVideos(query, top, skip) {
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getVideos");
            var data = {
                query: query,
                top: top,
                skip: skip
            };
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingVideos = getBingVideos;
        function getBingDocuments(query, doctype, top, skip) {
            if (typeof doctype === "undefined") { doctype = undefined; }
            if (typeof top === "undefined") { top = CZ.Settings.defaultBingSearchTop; }
            if (typeof skip === "undefined") { skip = CZ.Settings.defaultBingSearchSkip; }
            var request = new Service.Request(_serviceUrl);
            request.addToPath("bing/getDocuments");
            var data = {
                query: query,
                doctype: doctype,
                top: top,
                skip: skip
            };
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                data: data,
                success: function (response) {
                }
            });
        }
        Service.getBingDocuments = getBingDocuments;
        function getRecentTweets() {
            var request = new Service.Request(_serviceUrl);
            request.addToPath("twitter/getRecentTweets");
            console.log("[GET] " + request.url);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                url: request.url,
                success: function (response) {
                }
            });
        }
        Service.getRecentTweets = getRecentTweets;
        function getServiceInformation() {
            CZ.Authoring.resetSessionTimer();
            var request = new Request(_serviceUrl);
            request.addToPath("info");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getServiceInformation = getServiceInformation;
        function getContentPath(reference) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath(Service.superCollectionName);
            request.addToPath(Service.collectionName);
            request.addToPath(reference);
            request.addToPath("contentpath");
            return $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: request.url
            });
        }
        Service.getContentPath = getContentPath;
        function putExhibitContent(e, oldContentItems) {
            CZ.Authoring.resetSessionTimer();
            var newGuids = e.contentItems.map(function (ci) {
                return ci.guid;
            });
            var promises = e.contentItems.map(function (ci) {
                return putContentItem(ci).then(function (response) {
                    ci.id = ci.guid = response;
                });
            }).concat(oldContentItems.filter(function (ci) {
                return (ci.guid && newGuids.indexOf(ci.guid) === -1);
            }).map(function (ci) {
                return deleteContentItem(ci);
            }));
            return $.when.apply($, promises);
        }
        Service.putExhibitContent = putExhibitContent;
        function putProfile(displayName, email) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            var user = {
                "DisplayName": displayName,
                "Email": email
            };
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(user)
            });
        }
        Service.putProfile = putProfile;
        function deleteProfile(displayName) {
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            var user = {
                "DisplayName": displayName
            };
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url,
                data: JSON.stringify(user)
            });
        }
        Service.deleteProfile = deleteProfile;
        function getProfile(displayName) {
            if (typeof displayName === "undefined") { displayName = ""; }
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("user");
            if(displayName != "") {
                request.addParameter("name", displayName);
            }
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            }).done(function (profile) {
                if(!profile.id) {
                    return null;
                }
                return profile;
            });
        }
        Service.getProfile = getProfile;
        function getMimeTypeByUrl(url) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("getmimetypebyurl");
            if(url == "") {
                return result;
            }
            request.addParameter("url", url);
            $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url,
                async: false
            }).done(function (mime) {
                if(mime) {
                    result = mime;
                }
            });
            return result;
        }
        Service.getMimeTypeByUrl = getMimeTypeByUrl;
        function getUserFavorites() {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorites");
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getUserFavorites = getUserFavorites;
        function deleteUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorite");
            if(guid == "") {
                return null;
            }
            request.addParameter("guid", guid);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.deleteUserFavorite = deleteUserFavorite;
        function putUserFavorite(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfavorite");
            if(guid == "") {
                return null;
            }
            request.addParameter("guid", guid);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.putUserFavorite = putUserFavorite;
        function getUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfeatured");
            request.addParameter("guid", guid);
            return $.ajax({
                type: "GET",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.getUserFeatured = getUserFeatured;
        function deleteUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfeatured");
            if(guid == "") {
                return null;
            }
            request.addParameter("guid", guid);
            return $.ajax({
                type: "DELETE",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.deleteUserFeatured = deleteUserFeatured;
        function putUserFeatured(guid) {
            var result = "";
            CZ.Authoring.resetSessionTimer();
            var request = new Service.Request(_serviceUrl);
            request.addToPath("userfeatured");
            if(guid == "") {
                return null;
            }
            request.addParameter("guid", guid);
            return $.ajax({
                type: "PUT",
                cache: false,
                contentType: "application/json",
                url: request.url
            });
        }
        Service.putUserFeatured = putUserFeatured;
    })(CZ.Service || (CZ.Service = {}));
    var Service = CZ.Service;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Dates) {
        Dates.months = [
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December'
        ];
        Dates.daysInMonth = [
            31, 
            28, 
            31, 
            30, 
            31, 
            30, 
            31, 
            31, 
            30, 
            31, 
            30, 
            31
        ];
        function getCoordinateFromYMD(year, month, day) {
            var sign = (year === -1) ? 1 : year / Math.abs(year), isLeap = isLeapYear(year), daysInYear = isLeap ? 366 : 365, coord = (year > -1) ? year : year + 1;
            var sumDaysOfMonths = function (s, d, i) {
                return s + (i < month) * d;
            };
            var days = Dates.daysInMonth.reduce(sumDaysOfMonths, +(isLeap && month > 1)) + day;
            coord += (days - 1) / daysInYear;
            coord = roundDecimal(coord, CZ.Settings.allowedMathImprecisionDecimals);
            return coord;
        }
        Dates.getCoordinateFromYMD = getCoordinateFromYMD;
        function getYMDFromCoordinate(coord, MarkerCorrection) {
            if (typeof MarkerCorrection === "undefined") { MarkerCorrection = false; }
            var absCoord = Math.abs(coord), floorCoord = Math.floor(coord), sign = (coord === 0) ? 1 : coord / absCoord, day = 0, month = 0, year = (coord >= 1) ? floorCoord : floorCoord - 1, isLeap = isLeapYear(year), daysInYear = isLeap ? 366 : 365, daysFraction = sign * (absCoord - Math.abs(floorCoord));
            day = Math.round(daysFraction * daysInYear);
            if(MarkerCorrection) {
                day = Math.floor(daysFraction * daysInYear);
            }
            day += +(day < daysInYear);
            while(day > Dates.daysInMonth[month] + (+(isLeap && month === 1))) {
                day -= Dates.daysInMonth[month];
                if(isLeap && month === 1) {
                    day--;
                }
                month++;
            }
            return {
                year: year,
                month: month,
                day: day
            };
        }
        Dates.getYMDFromCoordinate = getYMDFromCoordinate;
        function getCoordinateFromDecimalYear(decimalYear) {
            var localPresent = getPresent();
            var presentDate = getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
            return decimalYear === 9999 ? presentDate : (decimalYear < 0 ? decimalYear + 1 : decimalYear);
        }
        Dates.getCoordinateFromDecimalYear = getCoordinateFromDecimalYear;
        function getDecimalYearFromCoordinate(coordinate) {
            return coordinate < 1 ? --coordinate : coordinate;
        }
        Dates.getDecimalYearFromCoordinate = getDecimalYearFromCoordinate;
        function convertCoordinateToYear(coordinate) {
            var year = {
                year: coordinate,
                regime: "CE"
            };
            var eps_const = 100000;
            if(coordinate <= -999999999) {
                year.year = (year.year - 1) / (-1000000000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ga';
            } else if(coordinate <= -999999) {
                year.year = (year.year - 1) / (-1000000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ma';
            } else if(coordinate <= -9999) {
                year.year = (year.year - 1) / (-1000);
                year.year = Math.round(year.year * eps_const) / eps_const;
                year.regime = 'Ka';
            } else if(coordinate < 1) {
                year.year = (year.year - 1) / (-1);
                year.year = Math.ceil(year.year);
                year.regime = 'BCE';
            } else {
                year.year = Math.floor(year.year);
            }
            return year;
        }
        Dates.convertCoordinateToYear = convertCoordinateToYear;
        function convertYearToCoordinate(year, regime) {
            var coordinate = year;
            switch(regime.toLowerCase()) {
                case "ga":
                    coordinate = year * (-1000000000) + 1;
                    break;
                case "ma":
                    coordinate = year * (-1000000) + 1;
                    break;
                case "ka":
                    coordinate = year * (-1000) + 1;
                    break;
                case "bce":
                    coordinate = year * (-1) + 1;
                    break;
            }
            return coordinate;
        }
        Dates.convertYearToCoordinate = convertYearToCoordinate;
        var present = undefined;
        function getPresent() {
            if(!present) {
                present = new Date();
                present.presentDay = present.getUTCDate();
                present.presentMonth = present.getUTCMonth();
                present.presentYear = present.getUTCFullYear();
            }
            return present;
        }
        Dates.getPresent = getPresent;
        function isLeapYear(year) {
            return (year >= 1582 && (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)));
        }
        Dates.isLeapYear = isLeapYear;
        function numberofLeap(year) {
            var startLeap = 1582;
            if(year < startLeap) {
                return 0;
            }
            var years1 = Math.floor(year / 4) - Math.floor(startLeap / 4);
            years1 -= Math.floor(year / 100) - Math.floor(startLeap / 100);
            years1 += Math.floor(year / 400) - Math.floor(startLeap / 400);
            if(isLeapYear(year)) {
                years1--;
            }
            return years1;
        }
        Dates.numberofLeap = numberofLeap;
        function roundDecimal(decimal, precision) {
            return Math.round(decimal * Math.pow(10, precision)) / Math.pow(10, precision);
        }
    })(CZ.Dates || (CZ.Dates = {}));
    var Dates = CZ.Dates;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Authoring) {
        var _vcwidget;
        var _dragStart = {
        };
        var _dragPrev = {
        };
        var _dragCur = {
        };
        var _hovered = {
        };
        var _rectPrev = {
            type: "rectangle"
        };
        var _rectCur = {
            type: "rectangle"
        };
        var _circlePrev = {
            type: "circle"
        };
        var _circleCur = {
            type: "circle"
        };
        Authoring.selectedTimeline = {
        };
        Authoring.selectedExhibit = {
        };
        Authoring.selectedContentItem = {
        };
        Authoring.isActive = false;
        Authoring.isEnabled = false;
        Authoring.isDragging = false;
        Authoring.mode = null;
        Authoring.contentItemMode = null;
        Authoring.showCreateTimelineForm = null;
        Authoring.showCreateRootTimelineForm = null;
        Authoring.showEditTimelineForm = null;
        Authoring.showCreateExhibitForm = null;
        Authoring.showEditExhibitForm = null;
        Authoring.showEditContentItemForm = null;
        Authoring.showEditTourForm = null;
        Authoring.showMessageWindow = null;
        Authoring.hideMessageWindow = null;
        Authoring.callback = null;
        Authoring.timer;
        function isIntersecting(te, obj) {
            switch(obj.type) {
                case "timeline":
                case "infodot":
                    return (te.x + te.width > obj.x && te.x < obj.x + obj.width && te.y + te.height > obj.y && te.y < obj.y + obj.height);
                default:
                    return false;
            }
        }
        function isIncluded(tp, obj) {
            switch(obj.type) {
                case "infodot":
                    return (tp.x <= obj.infodotDescription.date && tp.x + tp.width >= obj.infodotDescription.date && tp.y + tp.height >= obj.y + obj.height);
                    break;
                case "timeline":
                case "rectangle":
                case "circle":
                    return (tp.x <= obj.x + CZ.Settings.allowedMathImprecision && tp.x + tp.width >= obj.x + obj.width - CZ.Settings.allowedMathImprecision && tp.y + tp.height >= obj.y + obj.height - CZ.Settings.allowedMathImprecision);
                default:
                    return true;
            }
        }
        function checkTimelineIntersections(tp, tc, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;
            if(!tp || tp.guid === null) {
                return true;
            }
            if(!isIncluded(tp, tc) && tp.id !== "__root__") {
                return false;
            }
            for(i = 0 , len = tp.children.length; i < len; ++i) {
                selfIntersection = editmode ? (tp.children[i] === Authoring.selectedTimeline) : (tp.children[i] === tc);
                if(!selfIntersection && isIntersecting(tc, tp.children[i])) {
                    return false;
                }
            }
            if(editmode && Authoring.selectedTimeline.children && Authoring.selectedTimeline.children.length > 0) {
                for(i = 0 , len = Authoring.selectedTimeline.children.length; i < len; ++i) {
                    if(!isIncluded(tc, Authoring.selectedTimeline.children[i])) {
                        return false;
                    }
                }
            }
            return true;
        }
        function checkExhibitIntersections(tp, ec, editmode) {
            var i = 0;
            var len = 0;
            var selfIntersection = false;
            if(!isIncluded(tp, ec)) {
                return false;
            }
            return true;
        }
        Authoring.checkExhibitIntersections = checkExhibitIntersections;
        function updateNewRectangle() {
            _rectCur.x = Math.min(_dragStart.x, _dragCur.x);
            _rectCur.y = Math.min(_dragStart.y, _dragCur.y);
            _rectCur.width = Math.abs(_dragStart.x - _dragCur.x);
            _rectCur.height = Math.abs(_dragStart.y - _dragCur.y);
            if(checkTimelineIntersections(_hovered, _rectCur, false)) {
                var settings = $.extend({
                }, _hovered.settings);
                settings.strokeStyle = "yellow";
                $.extend(_rectPrev, _rectCur);
                CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                CZ.VCContent.addRectangle(_hovered, _hovered.layerid, "newTimelineRectangle", _rectCur.x, _rectCur.y, _rectCur.width, _rectCur.height, settings);
            } else {
                $.extend(_rectCur, _rectPrev);
            }
        }
        function updateNewCircle() {
            _circleCur.r = (_hovered.width > _hovered.height) ? _hovered.height / 27.7 : _hovered.width / 10.0;
            _circleCur.x = _dragCur.x - _circleCur.r;
            _circleCur.y = _dragCur.y - _circleCur.r;
            _circleCur.width = _circleCur.height = 2 * _circleCur.r;
            if(checkExhibitIntersections(_hovered, _circleCur, false)) {
                $.extend(_circlePrev, _circleCur);
                CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
                CZ.VCContent.addCircle(_hovered, "layerInfodots", "newExhibitCircle", _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, {
                    strokeStyle: "yellow"
                }, false);
            } else {
                $.extend(_circleCur, _circlePrev);
            }
        }
        function renewExhibit(e) {
            var vyc = e.y + e.height / 2;
            var time = e.x + e.width / 2;
            var id = e.id;
            var cis = e.contentItems;
            var descr = e.infodotDescription;
            descr.opacity = 1;
            descr.title = e.title;
            descr.guid = e.guid;
            var parent = e.parent;
            var radv = e.outerRad;
            CZ.VCContent.removeChild(parent, id);
            return CZ.VCContent.addInfodot(parent, "layerInfodots", id, time, vyc, radv, cis, descr);
        }
        Authoring.renewExhibit = renewExhibit;
        function createNewTimeline() {
            return CZ.VCContent.addTimeline(_hovered, _hovered.layerid, undefined, {
                timeStart: _rectCur.x,
                timeEnd: _rectCur.x + _rectCur.width,
                header: "Timeline Title",
                top: _rectCur.y,
                height: _rectCur.height,
                fillStyle: _hovered.settings.fillStyle,
                regime: _hovered.regime,
                gradientFillStyle: _hovered.settings.gradientFillStyle,
                lineWidth: _hovered.settings.lineWidth,
                strokeStyle: _hovered.settings.gradientFillStyle
            });
        }
        Authoring.createNewTimeline = createNewTimeline;
        function createNewExhibit() {
            CZ.VCContent.removeChild(_hovered, "newExhibitCircle");
            return CZ.VCContent.addInfodot(_hovered, "layerInfodots", undefined, _circleCur.x + _circleCur.r, _circleCur.y + _circleCur.r, _circleCur.r, [], {
                title: "Exhibit Title",
                date: _circleCur.x + _circleCur.r,
                guid: undefined
            });
        }
        function updateTimelineTitle(t) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            t.left = t.x;
            t.right = t.x + t.width;
            var titleBorderBox = CZ.Layout.GenerateTitleObject(t.height, t, ctx);
            CZ.VCContent.removeChild(t, t.id + "__header__");
            var baseline = t.y + titleBorderBox.marginTop + titleBorderBox.height / 2.0;
            t.titleObject = CZ.VCContent.addText(t, t.layerid, t.id + "__header__", t.x + titleBorderBox.marginLeft, t.y + titleBorderBox.marginTop, baseline, titleBorderBox.height, t.title, {
                fontName: CZ.Settings.timelineHeaderFontName,
                fillStyle: CZ.Settings.timelineHeaderFontColor,
                textBaseline: 'middle',
                opacity: 1
            }, titleBorderBox.width);
            if(CZ.Authoring.isEnabled && typeof t.editButton !== "undefined") {
                t.editButton.x = t.x + t.width - 1.15 * t.titleObject.height;
                t.editButton.y = t.titleObject.y;
                t.editButton.width = t.titleObject.height;
                t.editButton.height = t.titleObject.height;
            }
        }
        Authoring.modeMouseHandlers = {
            createTimeline: {
                mousemove: function () {
                    if(CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewRectangle();
                    }
                },
                mouseup: function () {
                    if(_dragCur.x === _dragStart.x && _dragCur.y === _dragStart.y) {
                        return;
                    }
                    if(_hovered.type === "timeline") {
                        CZ.VCContent.removeChild(_hovered, "newTimelineRectangle");
                        Authoring.selectedTimeline = createNewTimeline();
                        Authoring.showCreateTimelineForm(Authoring.selectedTimeline);
                    }
                }
            },
            editTour: {
            },
            "editTour-selectTarget": {
                mouseup: function () {
                    if(Authoring.callback != null && _hovered != undefined && _hovered != null && typeof _hovered.type != "undefined") {
                        Authoring.callback(_hovered);
                    }
                },
                mousemove: function () {
                }
            },
            editTimeline: {
                mouseup: function () {
                    Authoring.showEditTimelineForm(Authoring.selectedTimeline);
                }
            },
            createExhibit: {
                mousemove: function () {
                    if(CZ.Authoring.isDragging && _hovered.type === "timeline") {
                        updateNewCircle();
                    }
                },
                mouseup: function () {
                    if(_hovered.type === "timeline") {
                        updateNewCircle();
                        Authoring.selectedExhibit = createNewExhibit();
                        Authoring.showCreateExhibitForm(Authoring.selectedExhibit);
                    }
                }
            },
            editExhibit: {
                mouseup: function () {
                    Authoring.showEditExhibitForm(Authoring.selectedExhibit);
                }
            },
            editContentItem: {
                mouseup: function () {
                    Authoring.showEditContentItemForm(Authoring.selectedContentItem, Authoring.selectedExhibit);
                }
            }
        };
        function initialize(vc, formHandlers) {
            _vcwidget = vc.data("ui-virtualCanvas");
            _vcwidget.element.on("mousedown", function (event) {
                if(CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    CZ.Authoring.isDragging = true;
                    _dragStart = posv;
                    _dragPrev = {
                    };
                    _dragCur = posv;
                    _hovered = _vcwidget.hovered || {
                    };
                }
            });
            _vcwidget.element.on("mouseup", function (event) {
                if(CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    CZ.Authoring.isDragging = false;
                    _dragPrev = _dragCur;
                    _dragCur = posv;
                    CZ.Common.controller.stopAnimation();
                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mouseup"]();
                }
            });
            _vcwidget.element.on("mousemove", function (event) {
                if(CZ.Authoring.isActive) {
                    var viewport = _vcwidget.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(_vcwidget.element, event);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    _dragPrev = _dragCur;
                    _dragCur = posv;
                    CZ.Authoring.modeMouseHandlers[CZ.Authoring.mode]["mousemove"]();
                }
            });
            Authoring.showCreateTimelineForm = formHandlers && formHandlers.showCreateTimelineForm || function () {
            };
            Authoring.showCreateRootTimelineForm = formHandlers && formHandlers.showCreateRootTimelineForm || function () {
            };
            Authoring.showEditTimelineForm = formHandlers && formHandlers.showEditTimelineForm || function () {
            };
            Authoring.showCreateExhibitForm = formHandlers && formHandlers.showCreateExhibitForm || function () {
            };
            Authoring.showEditExhibitForm = formHandlers && formHandlers.showEditExhibitForm || function () {
            };
            Authoring.showEditContentItemForm = formHandlers && formHandlers.showEditContentItemForm || function () {
            };
            Authoring.showEditTourForm = formHandlers && formHandlers.showEditTourForm || function () {
            };
            Authoring.showMessageWindow = formHandlers && formHandlers.showMessageWindow || function (mess, title) {
            };
            Authoring.hideMessageWindow = formHandlers && formHandlers.hideMessageWindow || function () {
            };
        }
        Authoring.initialize = initialize;
        function updateTimeline(t, prop) {
            var deffered = new jQuery.Deferred();
            var temp = {
                x: Number(prop.start),
                y: t.y,
                width: prop.end === 9999 ? Number(CZ.Dates.getCoordinateFromDecimalYear(prop.end) - prop.start) : Number(prop.end - prop.start),
                height: t.height,
                type: "rectangle"
            };
            if(checkTimelineIntersections(t.parent, temp, true)) {
                t.x = temp.x;
                t.width = temp.width;
                t.endDate = prop.end;
                if(t.children.length < 3) {
                    t.height = Math.min.apply(Math, [
                        t.parent.height * CZ.Layout.timelineHeightRate, 
                        t.width * CZ.Settings.timelineMinAspect, 
                        t.height
                    ]);
                }
                t.title = prop.title;
                updateTimelineTitle(t);
                CZ.Service.putTimeline(t).then(function (success) {
                    t.id = "t" + success;
                    t.guid = success;
                    t.titleObject.id = "t" + success + "__header__";
                    if(!t.parent.guid) {
                        document.location.reload(true);
                    } else {
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                    deffered.resolve(t);
                }, function (error) {
                    deffered.reject(error);
                });
            } else {
                deffered.reject('Timeline intersects with parent timeline or other siblings');
            }
            return deffered.promise();
        }
        Authoring.updateTimeline = updateTimeline;
        ;
        function removeTimeline(t) {
            var deferred = $.Deferred();
            CZ.Service.deleteTimeline(t).then(function (updateCanvas) {
                CZ.Common.vc.virtualCanvas("requestInvalidate");
                deferred.resolve();
            });
            CZ.VCContent.removeChild(t.parent, t.id);
        }
        Authoring.removeTimeline = removeTimeline;
        function updateExhibit(oldExhibit, args) {
            var deferred = $.Deferred();
            if(oldExhibit && oldExhibit.contentItems && args) {
                var newExhibit = $.extend({
                }, oldExhibit, {
                    children: null
                });
                newExhibit = $.extend(true, {
                }, newExhibit);
                delete newExhibit.children;
                delete newExhibit.contentItems;
                $.extend(true, newExhibit, args);
                CZ.Service.putExhibit(newExhibit).then(function (response) {
                    newExhibit.guid = response.ExhibitId;
                    for(var i = 0; i < newExhibit.contentItems.length; i++) {
                        newExhibit.contentItems[i].ParentExhibitId = newExhibit.guid;
                    }
                    $(response.ContentItemId).each(function (contentItemIdIndex, contentItemId) {
                        newExhibit.contentItems[contentItemIdIndex].id = contentItemId;
                        newExhibit.contentItems[contentItemIdIndex].guid = contentItemId;
                    });
                    newExhibit = renewExhibit(newExhibit);
                    newExhibit.id = "e" + response.ExhibitId;
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve(newExhibit);
                }, function (error) {
                    console.log("Error connecting to service: update exhibit.\n" + error.responseText);
                    deferred.reject(error);
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        }
        Authoring.updateExhibit = updateExhibit;
        function removeExhibit(e) {
            var deferred = $.Deferred();
            if(e && e.id && e.parent) {
                var clone = $.extend({
                }, e, {
                    children: null
                });
                clone = $.extend(true, {
                }, clone);
                CZ.Service.deleteExhibit(clone).then(function (response) {
                    CZ.VCContent.removeChild(e.parent, e.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: remove exhibit.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        }
        Authoring.removeExhibit = removeExhibit;
        function updateContentItem(e, c, args) {
            var deferred = $.Deferred();
            if(e && e.contentItems && e.contentItems.length && c && args) {
                var clone = $.extend(true, {
                }, c, args);
                CZ.Service.putContentItem(clone).then(function (response) {
                    $.extend(c, clone);
                    c.id = c.guid = response;
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: update content item.\n" + error.responseText);
                    deferred.reject(error);
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        }
        Authoring.updateContentItem = updateContentItem;
        function removeContentItem(e, c) {
            var deferred = $.Deferred();
            if(e && e.contentItems && e.contentItems.length && c && c.index) {
                var clone = $.extend(true, {
                }, c);
                CZ.Service.deleteContentItem(clone).then(function (response) {
                    e.contentItems.splice(c.index, 1);
                    e = renewExhibit(e);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                    deferred.resolve();
                }, function (error) {
                    console.log("Error connecting to service: remove content item.\n" + error.responseText);
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        }
        Authoring.removeContentItem = removeContentItem;
        function validateTimelineData(start, end, title) {
            var isValid = (start !== false) && (end !== false);
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.isIntervalPositive(start, end);
            return isValid;
        }
        Authoring.validateTimelineData = validateTimelineData;
        function validateExhibitData(date, title, contentItems) {
            var isValid = date !== false;
            isValid = isValid && CZ.Authoring.isNotEmpty(title);
            isValid = isValid && CZ.Authoring.validateContentItems(contentItems, null);
            return isValid;
        }
        Authoring.validateExhibitData = validateExhibitData;
        function validateNumber(number) {
            return !isNaN(Number(number) && parseFloat(number)) && isNotEmpty(number) && (number !== false);
        }
        Authoring.validateNumber = validateNumber;
        function isNotEmpty(obj) {
            return (obj !== '' && obj !== null);
        }
        Authoring.isNotEmpty = isNotEmpty;
        function isIntervalPositive(start, end) {
            return (parseFloat(start) + 1 / 366 <= parseFloat(end));
        }
        Authoring.isIntervalPositive = isIntervalPositive;
        function validateContentItems(contentItems, mediaInput) {
            var isValid = true;
            if(contentItems.length == 0) {
                return false;
            }
            var i = 0;
            while(contentItems[i] != null) {
                var ci = contentItems[i];
                isValid = isValid && CZ.Authoring.isNotEmpty(ci.title) && CZ.Authoring.isNotEmpty(ci.uri) && CZ.Authoring.isNotEmpty(ci.mediaType);
                var mime = CZ.Service.getMimeTypeByUrl(ci.uri);
                console.log("mime:" + mime);
                if(ci.mediaType.toLowerCase() === "image") {
                    var imageReg = /\.(jpg|jpeg|png|gif)$/i;
                    if(!imageReg.test(ci.uri)) {
                        if(mime != "image/jpg" && mime != "image/jpeg" && mime != "image/gif" && mime != "image/png") {
                            if(mediaInput) {
                                mediaInput.showError("Sorry, only JPG/PNG/GIF images are supported.");
                            }
                            isValid = false;
                        }
                    }
                } else if(ci.mediaType.toLowerCase() === "video") {
                    var youtube = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|[\S\?\&]+&v=|\/user\/\S+))([^\/&#]{10,12})/;
                    var vimeo = /vimeo\.com\/([0-9]+)/i;
                    var vimeoEmbed = /player.vimeo.com\/video\/([0-9]+)/i;
                    if(youtube.test(ci.uri)) {
                        var youtubeVideoId = ci.uri.match(youtube)[1];
                        ci.uri = "http://www.youtube.com/embed/" + youtubeVideoId;
                    } else if(vimeo.test(ci.uri)) {
                        var vimeoVideoId = ci.uri.match(vimeo)[1];
                        ci.uri = "http://player.vimeo.com/video/" + vimeoVideoId;
                    } else if(vimeoEmbed.test(ci.uri)) {
                    } else {
                        if(mediaInput) {
                            mediaInput.showError("Sorry, only YouTube or Vimeo videos are supported.");
                        }
                        isValid = false;
                    }
                } else if(ci.mediaType.toLowerCase() === "pdf") {
                    var pdf = /\.(pdf)$|\.(pdf)\?/i;
                    if(!pdf.test(ci.uri)) {
                        if(mime != "application/pdf") {
                            if(mediaInput) {
                                mediaInput.showError("Sorry, only PDF extension is supported.");
                            }
                            isValid = false;
                        }
                    }
                } else if(ci.mediaType.toLowerCase() === "skydrive-document") {
                    var skydrive = /skydrive\.live\.com\/embed/;
                    if(!skydrive.test(ci.uri)) {
                        alert("This is not a Skydrive embed link.");
                        isValid = false;
                    }
                } else if(ci.mediaType.toLowerCase() === "skydrive-image") {
                    var splited = ci.uri.split(' ');
                    var skydrive = /skydrive\.live\.com\/embed/;
                    var width = /[0-9]/;
                    var height = /[0-9]/;
                    if(!skydrive.test(splited[0]) || !width.test(splited[1]) || !height.test(splited[2])) {
                        if(mediaInput) {
                            mediaInput.showError("This is not a Skydrive embed link.");
                        }
                        isValid = false;
                    }
                }
                if(!isValid) {
                    return false;
                }
                i++;
            }
            return isValid;
        }
        Authoring.validateContentItems = validateContentItems;
        function showSessionForm() {
            CZ.HomePageViewModel.sessionForm.show();
        }
        Authoring.showSessionForm = showSessionForm;
        function resetSessionTimer() {
            if(CZ.Authoring.timer != null) {
                clearTimeout(CZ.Authoring.timer);
                CZ.Authoring.timer = setTimeout(function () {
                    showSessionForm();
                }, (CZ.Settings.sessionTime - 60) * 1000);
            }
        }
        Authoring.resetSessionTimer = resetSessionTimer;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var TourListBox = (function (_super) {
            __extends(TourListBox, _super);
            function TourListBox(container, listItemContainer, contentItems, takeTour, editTour) {
                this.takeTour = takeTour;
                this.editTour = editTour;
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: null
                };
                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            typeTextblock: ".cz-contentitem-listitem-highlighted"
                        }
                    }
                };
                listItemsInfo.default.ctor = TourListItem;
                        _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            Object.defineProperty(TourListBox.prototype, "TakeTour", {
                get: function () {
                    return this.takeTour;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TourListBox.prototype, "EditTour", {
                get: function () {
                    return this.editTour;
                },
                enumerable: true,
                configurable: true
            });
            return TourListBox;
        })(UI.ListBoxBase);
        UI.TourListBox = TourListBox;        
        var TourListItem = (function (_super) {
            __extends(TourListItem, _super);
            function TourListItem(parent, container, uiMap, context) {
                if(!context) {
                    throw "Tour list item's context is undefined";
                }
                        _super.call(this, parent, container, uiMap, context);
                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(".cz-contentitem-listitem-descr");
                var self = this;
                var thumbUrl = this.data.thumbnailUrl;
                this.iconImg.attr("src", this.data.icon || "/images/Temp-Thumbnail2.png");
                var img = new Image();
                img.onload = function () {
                    self.iconImg.replaceWith(img);
                };
                img.onerror = function () {
                    if(console && console.warn) {
                        console.warn("Could not load a thumbnail image " + thumbUrl);
                    }
                };
                img.src = thumbUrl;
                this.titleTextblock.text(this.data.title);
                if(this.data.description) {
                    this.descrTextblock.text(this.data.description);
                } else {
                    this.descrTextblock.hide();
                }
                this.container.find("#takeTour").click(function (e) {
                    parent.TakeTour(context);
                });
                container.find(".cz-tourslist-editing").css("display", parent.EditTour ? "inline" : "none");
                if(parent.EditTour) {
                    this.container.find("#editTour").click(function (e) {
                        parent.EditTour(context);
                    });
                }
            }
            return TourListItem;
        })(UI.ListItemBase);
        UI.TourListItem = TourListItem;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormToursList = (function (_super) {
            __extends(FormToursList, _super);
            function FormToursList(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
                this.takeTour = formInfo.takeTour;
                this.editTour = formInfo.editTour;
                var tours = formInfo.tours.sort(function (a, b) {
                    return a.sequenceNum - b.sequenceNum;
                });
                this.toursListBox = new CZ.UI.TourListBox(container.find("#tours"), formInfo.tourTemplate, formInfo.tours, function (tour) {
                    _this.onTakeTour(tour);
                }, this.editTour ? function (tour) {
                    _this.onEditTour(tour);
                } : null);
                this.initialize();
            }
            FormToursList.prototype.initialize = function () {
            };
            FormToursList.prototype.show = function () {
                var self = this;
                $(window).resize(this.onWindowResize);
                this.onWindowResize(null);
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormToursList.prototype.close = function () {
                var _this = this;
                $(window).unbind("resize", this.onWindowResize);
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500,
                    complete: function () {
                        _this.container.find("cz-form-errormsg").hide();
                        _this.container.find("#tours").empty();
                        _this.toursListBox.container.empty();
                    }
                });
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            };
            FormToursList.prototype.onTakeTour = function (tour) {
                this.close();
                this.takeTour(tour);
            };
            FormToursList.prototype.onEditTour = function (tour) {
                this.close();
                this.editTour(tour);
            };
            FormToursList.prototype.onWindowResize = function (e) {
                var height = $(window).height();
                this.container.height(height - 70);
                this.container.find("#tours").height(height - 200);
            };
            return FormToursList;
        })(CZ.UI.FormBase);
        UI.FormToursList = FormToursList;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var TourPlayer = (function () {
            function TourPlayer(container, playerInfo) {
                this.container = container;
                this.tour = playerInfo.context;
                this.playPauseButton = this.container.find(playerInfo.playPauseButton);
                this.nextButton = this.container.find(playerInfo.nextButton);
                this.prevButton = this.container.find(playerInfo.prevButton);
                this.volButton = this.container.find(playerInfo.volButton);
                this.playPauseButton.off();
                this.nextButton.off();
                this.prevButton.off();
                this.volButton.off();
                this.initialize();
            }
            TourPlayer.prototype.initialize = function () {
                var _this = this;
                this.playPauseButton.attr("state", "pause");
                this.volButton.attr("state", "on");
                this.playPauseButton.click(function (event) {
                    var state = _this.playPauseButton.attr("state");
                    var stateHandlers = {
                        play: function () {
                            _this.play();
                        },
                        pause: function () {
                            _this.pause();
                        }
                    };
                    stateHandlers[state]();
                });
                this.nextButton.click(function (event) {
                    _this.next();
                });
                this.prevButton.click(function (event) {
                    _this.prev();
                });
                this.volButton.click(function (event) {
                    var state = _this.volButton.attr("state");
                    var stateHandlers = {
                        on: function () {
                            _this.volumeOff();
                        },
                        off: function () {
                            _this.volumeOn();
                        }
                    };
                    stateHandlers[state]();
                });
            };
            TourPlayer.prototype.play = function () {
                this.playPauseButton.attr("state", "pause");
                CZ.Tours.tourResume();
            };
            TourPlayer.prototype.pause = function () {
                this.playPauseButton.attr("state", "play");
                CZ.Tours.tourPause();
            };
            TourPlayer.prototype.next = function () {
                CZ.Tours.tourNext();
            };
            TourPlayer.prototype.prev = function () {
                CZ.Tours.tourPrev();
            };
            TourPlayer.prototype.exit = function () {
                CZ.Tours.tourAbort();
            };
            TourPlayer.prototype.volumeOn = function () {
                this.volButton.attr("state", "on");
                CZ.Tours.isNarrationOn = true;
                this.tour.audioElement.volume = 1;
            };
            TourPlayer.prototype.volumeOff = function () {
                this.volButton.attr("state", "off");
                CZ.Tours.isNarrationOn = false;
                this.tour.audioElement.volume = 0;
            };
            return TourPlayer;
        })();
        UI.TourPlayer = TourPlayer;        
        var FormTourCaption = (function (_super) {
            __extends(FormTourCaption, _super);
            function FormTourCaption(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.minButton = this.container.find(formInfo.minButton);
                this.captionTextarea = this.container.find(formInfo.captionTextarea);
                this.tourPlayerContainer = this.container.find(formInfo.tourPlayerContainer);
                this.bookmarksCount = this.container.find(formInfo.bookmarksCount);
                this.tour = formInfo.context;
                this.tourPlayer = new CZ.UI.TourPlayer(this.tourPlayerContainer, {
                    playPauseButton: "div:nth-child(2)",
                    nextButton: "div:nth-child(3)",
                    prevButton: "div:nth-child(1)",
                    volButton: "div:nth-child(4)",
                    context: this.tour
                });
                this.minButton.off();
                this.initialize();
            }
            FormTourCaption.prototype.initialize = function () {
                var _this = this;
                this.titleTextblock.text(this.tour.title);
                this.bookmarksCount.text("Slide 1 of " + this.tour.bookmarks.length);
                this.captionTextarea.css("opacity", 0);
                this.isMinimized = false;
                this.minButton.click(function (event) {
                    _this.minimize();
                });
            };
            FormTourCaption.prototype.hideBookmark = function () {
                this.captionTextarea.css("opacity", 0);
            };
            FormTourCaption.prototype.showBookmark = function (bookmark) {
                this.captionTextarea.text(bookmark.text);
                this.bookmarksCount.text("Slide " + bookmark.number + " of " + this.tour.bookmarks.length);
                this.captionTextarea.stop();
                this.captionTextarea.animate({
                    opacity: 1
                });
            };
            FormTourCaption.prototype.showTourEndMessage = function () {
                this.captionTextarea.text(CZ.Tours.TourEndMessage);
                this.bookmarksCount.text("Start a tour");
            };
            FormTourCaption.prototype.setPlayPauseButtonState = function (state) {
                this.tourPlayer.playPauseButton.attr("state", state);
            };
            FormTourCaption.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormTourCaption.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.tourPlayer.exit();
                    }
                });
                this.activationSource.removeClass("active");
            };
            FormTourCaption.prototype.minimize = function () {
                if(this.isMinimized) {
                    this.contentContainer.show({
                        effect: "slide",
                        direction: "up",
                        duration: 500
                    });
                } else {
                    this.contentContainer.hide({
                        effect: "slide",
                        direction: "up",
                        duration: 500
                    });
                }
                this.isMinimized = !this.isMinimized;
            };
            return FormTourCaption;
        })(CZ.UI.FormBase);
        UI.FormTourCaption = FormTourCaption;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Tours) {
        Tours.isTourWindowVisible = false;
        Tours.isBookmarksWindowVisible = false;
        Tours.isBookmarksWindowExpanded = true;
        Tours.isBookmarksTextShown = true;
        Tours.isNarrationOn = true;
        Tours.tours;
        Tours.tour;
        Tours.tourBookmarkTransitionCompleted;
        Tours.tourBookmarkTransitionInterrupted;
        Tours.pauseTourAtAnyAnimation = false;
        Tours.bookmarkAnimation;
        var isToursDebugEnabled = false;
        Tours.TourEndMessage = "Thank you for watching this tour!";
        Tours.tourCaptionFormContainer;
        Tours.tourCaptionForm;
        var TourBookmark = (function () {
            function TourBookmark(url, caption, lapseTime, text) {
                this.url = url;
                this.caption = caption;
                this.lapseTime = lapseTime;
                this.text = text;
                this.duration = undefined;
                this.elapsed = 0;
                if(this.text === null) {
                    this.text = "";
                }
            }
            return TourBookmark;
        })();
        Tours.TourBookmark = TourBookmark;        
        function getBookmarkVisible(bookmark) {
            return CZ.UrlNav.navStringToVisible(bookmark.url, CZ.Common.vc);
        }
        Tours.getBookmarkVisible = getBookmarkVisible;
        function hasActiveTour() {
            return Tours.tour != undefined;
        }
        Tours.hasActiveTour = hasActiveTour;
        function bookmarkUrlToElement(bookmarkUrl) {
            var element = CZ.UrlNav.navStringTovcElement(bookmarkUrl, CZ.Common.vc.virtualCanvas("getLayerContent"));
            if(!element) {
                return null;
            }
            return element;
        }
        Tours.bookmarkUrlToElement = bookmarkUrlToElement;
        var Tour = (function () {
            function Tour(id, title, bookmarks, zoomTo, vc, category, audio, sequenceNum, description) {
                this.id = id;
                this.title = title;
                this.bookmarks = bookmarks;
                this.zoomTo = zoomTo;
                this.vc = vc;
                this.category = category;
                this.audio = audio;
                this.sequenceNum = sequenceNum;
                this.description = description;
                this.tour_BookmarkStarted = [];
                this.tour_BookmarkFinished = [];
                this.tour_TourStarted = [];
                this.tour_TourFinished = [];
                this.state = 'pause';
                this.currentPlace = {
                    type: 'goto',
                    bookmark: 0,
                    startTime: null,
                    animationId: null
                };
                this.isTourPlayRequested = false;
                this.isAudioLoaded = false;
                this.isAudioEnabled = false;
                if(!bookmarks || bookmarks.length == 0) {
                    throw "Tour has no bookmarks";
                }
                var self = this;
                this.thumbnailUrl = CZ.Settings.contentItemThumbnailBaseUri + id + '.jpg';
                bookmarks.sort(function (b1, b2) {
                    return b1.lapseTime - b2.lapseTime;
                });
                for(var i = 1; i < bookmarks.length; i++) {
                    bookmarks[i - 1].number = i;
                    bookmarks[i - 1].duration = bookmarks[i].lapseTime - bookmarks[i - 1].lapseTime;
                }
                bookmarks[bookmarks.length - 1].duration = 10;
                bookmarks[bookmarks.length - 1].number = bookmarks.length;
                self.toggleAudio = function toggleAudio(isOn) {
                    if(isOn && self.audio) {
                        self.isAudioEnabled = true;
                    } else {
                        self.isAudioEnabled = false;
                    }
                };
                self.ReinitializeAudio = function ReinitializeAudio() {
                    if(!self.audio) {
                        return;
                    }
                    if(self.audioElement) {
                        self.audioElement.pause();
                    }
                    self.audioElement = undefined;
                    self.isAudioLoaded = false;
                    self.audioElement = document.createElement('audio');
                    self.audioElement.addEventListener("loadedmetadata", function () {
                        if(self.audioElement.duration != Infinity) {
                            self.bookmarks[self.bookmarks.length - 1].duration = self.audioElement.duration - self.bookmarks[self.bookmarks.length - 1].lapseTime;
                        }
                        if(isToursDebugEnabled && window.console && console.log("Tour " + self.title + " metadata loaded (readystate 1)")) {
                            ;
                        }
                    });
                    self.audioElement.addEventListener("canplaythrough", function () {
                        self.isAudioLoaded = true;
                        if(isToursDebugEnabled && window.console && console.log("Tour " + self.title + " readystate 4")) {
                            ;
                        }
                    });
                    self.audioElement.addEventListener("progress", function () {
                        if(self.audioElement && self.audioElement.buffered.length > 0) {
                            if(isToursDebugEnabled && window.console && console.log("Tour " + self.title + " downloaded " + (self.audioElement.buffered.end(self.audioElement.buffered.length - 1) / self.audioElement.duration))) {
                                ;
                            }
                        }
                    });
                    self.audioElement.controls = false;
                    self.audioElement.autoplay = false;
                    self.audioElement.loop = false;
                    self.audioElement.volume = 1;
                    self.audioElement.preload = "none";
                    var blobPrefix = self.audio.substring(0, self.audio.length - 3);
                    for(var i = 0; i < CZ.Settings.toursAudioFormats.length; i++) {
                        var audioSource = document.createElement("Source");
                        audioSource.setAttribute("src", blobPrefix + CZ.Settings.toursAudioFormats[i].ext);
                        self.audioElement.appendChild(audioSource);
                    }
                    self.audioElement.load();
                    if(isToursDebugEnabled && window.console && console.log("Loading of tour " + self.title + " is queued")) {
                        ;
                    }
                };
                self.onBookmarkIsOver = function onBookmarkIsOver(goBack) {
                    self.bookmarks[self.currentPlace.bookmark].elapsed = 0;
                    if((self.currentPlace.bookmark == self.bookmarks.length - 1) && !goBack) {
                        self.state = 'pause';
                        self.currentPlace = {
                            type: 'goto',
                            bookmark: 0
                        };
                        self.RaiseTourFinished();
                    } else {
                        self.goToTheNextBookmark(goBack);
                    }
                };
                self.goToTheNextBookmark = function goToTheNextBookmark(goBack) {
                    var newBookmark = self.currentPlace.bookmark;
                    var oldBookmark = newBookmark;
                    if(goBack) {
                        newBookmark = Math.max(0, newBookmark - 1);
                    } else {
                        newBookmark = Math.min(self.bookmarks.length - 1, newBookmark + 1);
                    }
                    self.RaiseBookmarkFinished(oldBookmark);
                    self.currentPlace = {
                        type: 'goto',
                        bookmark: newBookmark
                    };
                    var bookmark = self.bookmarks[self.currentPlace.bookmark];
                    if(newBookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);
                        if(self.isAudioEnabled && self.state === 'play' && self.isAudioLoaded == true) {
                            self.startBookmarkAudio(bookmark);
                        }
                    }
                    if(self.state != 'pause' && self.isAudioLoaded == true) {
                        self.setTimer(bookmark);
                    }
                    if(isToursDebugEnabled && window.console && console.log("Transitioning to the bm index " + newBookmark)) {
                        ;
                    }
                    var targetVisible = getBookmarkVisible(bookmark);
                    if(!targetVisible) {
                        if(isToursDebugEnabled && window.console && console.log("bookmark index " + newBookmark + " references to nonexistent item")) {
                            ;
                        }
                        goBack ? self.prev() : self.next();
                        return;
                    }
                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);
                };
                self.startBookmarkAudio = function startBookmarkAudio(bookmark) {
                    if(!self.audio) {
                        return;
                    }
                    if(isToursDebugEnabled && window.console && console.log("playing source: " + self.audioElement.currentSrc)) {
                        ;
                    }
                    self.audioElement.pause();
                    try  {
                        self.audioElement.currentTime = bookmark.lapseTime + bookmark.elapsed;
                        if(isToursDebugEnabled && window.console && console.log("audio currentTime is set to " + (bookmark.lapseTime + bookmark.elapsed))) {
                            ;
                        }
                    } catch (ex) {
                        if(window.console && console.error("currentTime assignment: " + ex)) {
                            ;
                        }
                    }
                    if(isToursDebugEnabled && window.console && console.log("audio element is forced to play")) {
                        ;
                    }
                    self.audioElement.play();
                };
                self.setTimer = function setTimer(bookmark) {
                    if(self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                    }
                    var duration = bookmark.duration;
                    if(bookmark.elapsed != 0) {
                        duration = Math.max(duration - bookmark.elapsed, 0);
                    }
                    self.currentPlace.startTime = new Date().getTime();
                    if(isToursDebugEnabled && window.console && console.log("transition to next bookmark will be in " + duration + " seconds")) {
                        ;
                    }
                    self.timerOnBookmarkIsOver = setTimeout(self.onBookmarkIsOver, duration * 1000);
                };
                self.onGoToSuccess = function onGoToSuccess(animationId) {
                    if(!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId) {
                        return;
                    }
                    var curURL = CZ.UrlNav.getURL();
                    if(typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = [];
                    }
                    curURL.hash.params["tour"] = Tours.tour.sequenceNum;
                    CZ.Common.hashHandle = false;
                    CZ.UrlNav.setURL(curURL);
                    if(isToursDebugEnabled && window.console && console.log("reached the bookmark index " + self.currentPlace.bookmark)) {
                        ;
                    }
                    self.currentPlace = {
                        type: 'bookmark',
                        bookmark: self.currentPlace.bookmark
                    };
                    if(self.currentPlace.bookmark == 0) {
                        var bookmark = self.bookmarks[self.currentPlace.bookmark];
                        self.RaiseBookmarkStarted(bookmark);
                        if(self.state != 'pause') {
                            if(self.isAudioLoaded != true) {
                                tourPause();
                            } else {
                                self.setTimer(bookmark);
                                if(self.isAudioEnabled) {
                                    self.startBookmarkAudio(bookmark);
                                }
                            }
                        }
                    }
                };
                self.onGoToFailure = function onGoToFailure(animationId) {
                    if(!self.currentPlace || self.currentPlace.animationId == undefined || self.currentPlace.animationId != animationId) {
                        return;
                    }
                    self.pause();
                    if(isToursDebugEnabled && window.console && console.log("tour interrupted by user during transition")) {
                        ;
                    }
                };
                self.play = function play() {
                    if(self.state !== 'pause') {
                        return;
                    }
                    if(isToursDebugEnabled && window.console && console.log("tour playback activated")) {
                        ;
                    }
                    self.state = 'play';
                    var visible = self.vc.virtualCanvas("getViewport").visible;
                    var bookmarkVisible = getBookmarkVisible(self.bookmarks[self.currentPlace.bookmark]);
                    if(bookmarkVisible === null) {
                        self.next();
                        return;
                    }
                    if(self.currentPlace != null && self.currentPlace.bookmark != null && CZ.Common.compareVisibles(visible, bookmarkVisible)) {
                        self.currentPlace = {
                            type: 'bookmark',
                            bookmark: self.currentPlace.bookmark
                        };
                    } else {
                        self.currentPlace = {
                            type: 'goto',
                            bookmark: self.currentPlace.bookmark
                        };
                    }
                    var bookmark = self.bookmarks[self.currentPlace.bookmark];
                    showBookmark(Tours.tour, bookmark);
                    var isInTransitionToFirstBookmark = (self.currentPlace.bookmark == 0 && self.currentPlace.type == 'goto');
                    if(self.currentPlace.type == 'bookmark' || self.currentPlace.bookmark != 0) {
                        self.RaiseBookmarkStarted(bookmark);
                        if(self.isAudioLoaded == true) {
                            self.setTimer(bookmark);
                            if(self.isAudioEnabled) {
                                self.startBookmarkAudio(bookmark);
                            }
                        }
                    }
                    self.currentPlace.animationId = self.zoomTo(getBookmarkVisible(bookmark), self.onGoToSuccess, self.onGoToFailure, bookmark.url);
                    if(self.currentPlace.bookmark === 0 && isInTransitionToFirstBookmark) {
                        self.RaiseTourStarted();
                    }
                    var curURL = CZ.UrlNav.getURL();
                    if(typeof curURL.hash.params == 'undefined') {
                        curURL.hash.params = new Array();
                    }
                    if(typeof curURL.hash.params["tour"] == 'undefined') {
                        curURL.hash.params["tour"] = Tours.tour.sequenceNum;
                        CZ.Common.hashHandle = false;
                        CZ.UrlNav.setURL(curURL);
                    }
                };
                self.pause = function pause() {
                    if(self.state !== 'play') {
                        return;
                    }
                    if(isToursDebugEnabled && window.console && console.log("tour playback paused")) {
                        ;
                    }
                    if(self.isAudioEnabled && self.isTourPlayRequested) {
                        self.isTourPlayRequested = false;
                    }
                    if(self.timerOnBookmarkIsOver) {
                        clearTimeout(self.timerOnBookmarkIsOver);
                        self.timerOnBookmarkIsOver = undefined;
                    }
                    self.state = 'pause';
                    if(self.isAudioEnabled) {
                        self.audioElement.pause();
                        if(isToursDebugEnabled && window.console && console.log("audio element is forced to pause")) {
                            ;
                        }
                    }
                    var bookmark = self.bookmarks[self.currentPlace.bookmark];
                    if(self.currentPlace.startTime) {
                        bookmark.elapsed += (new Date().getTime() - self.currentPlace.startTime) / 1000;
                    }
                };
                self.next = function next() {
                    if(self.state === 'play') {
                        if(self.timerOnBookmarkIsOver) {
                            clearTimeout(self.timerOnBookmarkIsOver);
                        }
                        self.timerOnBookmarkIsOver = undefined;
                    }
                    self.onBookmarkIsOver(false);
                };
                self.prev = function prev() {
                    if(self.currentPlace.bookmark == 0) {
                        return;
                    }
                    if(self.state === 'play') {
                        if(self.timerOnBookmarkIsOver) {
                            clearTimeout(self.timerOnBookmarkIsOver);
                        }
                        self.timerOnBookmarkIsOver = undefined;
                    }
                    self.onBookmarkIsOver(true);
                };
                self.RaiseBookmarkStarted = function RaiseBookmarkStarted(bookmark) {
                    if(self.tour_BookmarkStarted.length > 0) {
                        for(var i = 0; i < self.tour_BookmarkStarted.length; i++) {
                            self.tour_BookmarkStarted[i](self, bookmark);
                        }
                    }
                    showBookmark(this, bookmark);
                };
                self.RaiseBookmarkFinished = function RaiseBookmarkFinished(bookmark) {
                    if(self.tour_BookmarkFinished.length > 0) {
                        for(var i = 0; i < self.tour_BookmarkFinished.length; i++) {
                            self.tour_BookmarkFinished[i](self, bookmark);
                        }
                    }
                    hideBookmark(this);
                };
                self.RaiseTourStarted = function RaiseTourStarted() {
                    if(self.tour_TourStarted.length > 0) {
                        for(var i = 0; i < self.tour_TourStarted.length; i++) {
                            self.tour_TourStarted[i](self);
                        }
                    }
                };
                self.RaiseTourFinished = function RaiseTourFinished() {
                    if(self.tour_TourFinished.length > 0) {
                        for(var i = 0; i < self.tour_TourFinished.length; i++) {
                            self.tour_TourFinished[i](self);
                        }
                    }
                };
            }
            return Tour;
        })();
        Tours.Tour = Tour;        
        function activateTour(newTour, isAudioEnabled) {
            if(isAudioEnabled == undefined) {
                isAudioEnabled = Tours.isNarrationOn;
            }
            if(newTour != undefined) {
                Tours.tour = newTour;
                Tours.tour.tour_TourFinished.push(function (tour) {
                    showTourEndMessage();
                    tourPause();
                    hideBookmarks();
                });
                Tours.tour.toggleAudio(isAudioEnabled);
                for(var i = 0; i < Tours.tour.bookmarks.length; i++) {
                    Tours.tour.bookmarks[i].elapsed = 0;
                }
                Tours.tour.currentPlace.bookmark = 0;
                if(isAudioEnabled == true) {
                    Tours.tour.ReinitializeAudio();
                    Tours.tour.isAudioLoaded = true;
                }
                tourResume();
            }
        }
        Tours.activateTour = activateTour;
        function removeActiveTour() {
            if(Tours.tour) {
                tourPause();
                Tours.tour.isTourPlayRequested = false;
            }
            if(Tours.tour) {
                hideBookmarks();
                $("#bookmarks .header").text("");
                if(Tours.tour.audioElement) {
                    Tours.tour.audioElement = undefined;
                }
            }
            Tours.tour = undefined;
        }
        Tours.removeActiveTour = removeActiveTour;
        function tourPrev() {
            if(Tours.tour != undefined) {
                Tours.tour.prev();
            }
        }
        Tours.tourPrev = tourPrev;
        function tourNext() {
            if(Tours.tour != undefined) {
                Tours.tour.next();
            }
        }
        Tours.tourNext = tourNext;
        function tourPause() {
            Tours.tourCaptionForm.setPlayPauseButtonState("play");
            if(Tours.tour != undefined) {
                $("#tour_playpause").attr("src", "/images/tour_play_off.jpg");
                Tours.tour.pause();
                CZ.Common.controller.stopAnimation();
                Tours.tour.tourBookmarkTransitionInterrupted = undefined;
                Tours.tour.tourBookmarkTransitionCompleted = undefined;
            }
        }
        Tours.tourPause = tourPause;
        function tourResume() {
            Tours.tourCaptionForm.setPlayPauseButtonState("pause");
            $("#tour_playpause").attr("src", "/images/tour_pause_off.jpg");
            Tours.tour.play();
        }
        Tours.tourResume = tourResume;
        function tourPlayPause() {
            if(Tours.tour != undefined) {
                if(Tours.tour.state == "pause") {
                    tourResume();
                } else if(Tours.tour.state == "play") {
                    tourPause();
                }
            }
        }
        Tours.tourPlayPause = tourPlayPause;
        function tourAbort() {
            removeActiveTour();
            $("#bookmarks").hide();
            Tours.isBookmarksWindowVisible = false;
            var curURL = CZ.UrlNav.getURL();
            if(curURL.hash.params["tour"]) {
                delete curURL.hash.params["tour"];
            }
            CZ.UrlNav.setURL(curURL);
        }
        Tours.tourAbort = tourAbort;
        function initializeToursUI() {
            $("#tours").hide();
            hideBookmarks();
        }
        Tours.initializeToursUI = initializeToursUI;
        function initializeToursContent() {
            Tours.tours.sort(function (u, v) {
                return u.sequenceNum - v.sequenceNum;
            });
        }
        Tours.initializeToursContent = initializeToursContent;
        function hideBookmark(tour) {
            Tours.tourCaptionForm.hideBookmark();
        }
        function showTourEndMessage() {
            Tours.tourCaptionForm.showTourEndMessage();
        }
        function showBookmark(tour, bookmark) {
            Tours.tourCaptionForm.showBookmark(bookmark);
        }
        function hideBookmarks() {
            $("#bookmarks").hide();
            Tours.isBookmarksWindowVisible = false;
        }
        function onTourClicked() {
            if(CZ.Search.isSearchWindowVisible) {
                CZ.Search.onSearchClicked();
            }
            if(Tours.isTourWindowVisible) {
                $(".tour-icon").removeClass("active");
                $("#tours").hide('slide', {
                }, 'slow');
            } else {
                $(".tour-icon").addClass("active");
                $("#tours").show('slide', {
                }, 'slow');
            }
            Tours.isTourWindowVisible = !Tours.isTourWindowVisible;
        }
        Tours.onTourClicked = onTourClicked;
        function collapseBookmarks() {
            if(!Tours.isBookmarksWindowExpanded) {
                return;
            }
            Tours.isBookmarksWindowExpanded = false;
            $("#bookmarks .header").hide('slide', {
            }, 'fast');
            $("#bookmarks .slideHeader").hide('slide', {
            }, 'fast');
            $("#bookmarks .slideText").hide('slide', {
            }, 'fast');
            $("#bookmarks .slideFooter").hide('slide', {
            }, 'fast');
            $("#bookmarks").effect('size', {
                to: {
                    width: '30px'
                }
            }, 'fast', function () {
                $("#bookmarks").css('width', '30px');
            });
            $("#bookmarksCollapse").attr("src", "/images/expand-right.png");
        }
        function expandBookmarks() {
            if(Tours.isBookmarksWindowExpanded) {
                return;
            }
            Tours.isBookmarksWindowExpanded = true;
            $("#bookmarks").effect('size', {
                to: {
                    width: '200px',
                    height: 'auto'
                }
            }, 'slow', function () {
                $("#bookmarks").css('width', '200px');
                $("#bookmarks").css('height', 'auto');
                $("#bookmarks .header").show('slide', {
                }, 'fast');
                $("#bookmarks .slideHeader").show('slide', {
                }, 'fast');
                $("#bookmarks .slideText").show('slide', {
                }, 'fast');
                $("#bookmarks .slideFooter").show('slide', {
                }, 'fast');
            });
            $("#bookmarksCollapse").attr("src", "/images/collapse-left.png");
        }
        function onBookmarksCollapse() {
            if(!Tours.isBookmarksWindowExpanded) {
                expandBookmarks();
            } else {
                collapseBookmarks();
            }
        }
        Tours.onBookmarksCollapse = onBookmarksCollapse;
        function onNarrationClick() {
            if(Tours.isNarrationOn) {
                $("#tours-narration-on").removeClass("narration-selected", "slow");
                $("#tours-narration-off").addClass("narration-selected", "slow");
            } else {
                $("#tours-narration-on").addClass("narration-selected", "slow");
                $("#tours-narration-off").removeClass("narration-selected", "slow");
            }
            Tours.isNarrationOn = !Tours.isNarrationOn;
        }
        Tours.onNarrationClick = onNarrationClick;
        function parseTours(content) {
            Tours.tours = new Array();
            for(var i = 0; i < content.d.length; i++) {
                var areBookmarksValid = true;
                var tourString = content.d[i];
                if((typeof tourString.bookmarks == 'undefined') || (typeof tourString.name == 'undefined') || (typeof tourString.sequence == 'undefined') || (tourString.bookmarks.length == 0)) {
                    continue;
                }
                var tourBookmarks = new Array();
                for(var j = 0; j < tourString.bookmarks.length; j++) {
                    var bmString = tourString.bookmarks[j];
                    if((typeof bmString.description == 'undefined') || (typeof bmString.lapseTime == 'undefined') || (typeof bmString.name == 'undefined') || (typeof bmString.url == 'undefined')) {
                        areBookmarksValid = false;
                        break;
                    }
                    tourBookmarks.push(new TourBookmark(bmString.url, bmString.name, bmString.lapseTime, bmString.description));
                }
                if(!areBookmarksValid) {
                    continue;
                }
                var tour = new Tour(tourString.id, tourString.name, tourBookmarks, bookmarkTransition, CZ.Common.vc, tourString.category, tourString.audio, tourString.sequence, tourString.description);
                Tours.tours.push(tour);
            }
            $("body").trigger("toursInitialized");
        }
        Tours.parseTours = parseTours;
        function bookmarkTransition(visible, onCompleted, onInterrupted, bookmark) {
            Tours.tourBookmarkTransitionCompleted = onCompleted;
            Tours.tourBookmarkTransitionInterrupted = onInterrupted;
            Tours.pauseTourAtAnyAnimation = false;
            var animId = CZ.Common.setVisible(visible);
            if(animId && bookmark) {
                CZ.Common.setNavigationStringTo = {
                    bookmark: bookmark,
                    id: animId
                };
            }
            return animId;
        }
        Tours.bookmarkTransition = bookmarkTransition;
        function loadTourFromURL() {
            var curURL = CZ.UrlNav.getURL();
            if((typeof curURL.hash.params !== 'undefined') && (curURL.hash.params["tour"] > Tours.tours.length)) {
                return;
            }
            if(typeof curURL.hash.params !== 'undefined' && typeof curURL.hash.params["tour"] !== 'undefined') {
                if(Tours.tours == null) {
                    initializeToursContent();
                }
                if(Tours.isTourWindowVisible) {
                    onTourClicked();
                }
                Tours.tour = Tours.tours[curURL.hash.params["tour"] - 1];
                $(".touritem-selected").removeClass("touritem-selected", "slow");
                activateTour(Tours.tour, true);
                if(Tours.tour.audio) {
                    Tours.tour.audio.pause();
                    Tours.tour.audio.preload = "none";
                }
                tourPause();
            }
        }
        Tours.loadTourFromURL = loadTourFromURL;
    })(CZ.Tours || (CZ.Tours = {}));
    var Tours = CZ.Tours;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Search) {
        Search.isSearchWindowVisible = false;
        var delayedSearchRequest = null;
        function onSearchClicked() {
            if(CZ.Tours.isTourWindowVisible && CZ.Tours.onTourClicked) {
                CZ.Tours.onTourClicked();
            }
            if(Search.isSearchWindowVisible) {
                $(".search-icon").removeClass("active");
                $("#search").hide('slide', {
                }, 'slow');
            } else {
                $(".search-icon").addClass("active");
                $("#search").show('slide', {
                }, 'slow', function () {
                    $("#searchTextBox").focus();
                });
            }
            Search.isSearchWindowVisible = !Search.isSearchWindowVisible;
        }
        Search.onSearchClicked = onSearchClicked;
        function initializeSearch() {
            $("#searchTextBox").focus(function () {
                if($(this).hasClass('emptyTextBox')) {
                    this.value = '';
                    $(this).removeClass('emptyTextBox');
                }
            }).blur(function () {
                if($(this).hasClass('emptyTextBox')) {
                    if(this.value != '') {
                        $(this).removeClass('emptyTextBox');
                    }
                } else {
                    if(this.value == '') {
                        this.value = 'type here...';
                        $(this).addClass('emptyTextBox');
                    }
                }
            }).keyup(function () {
                if(delayedSearchRequest) {
                    clearTimeout(delayedSearchRequest);
                    delayedSearchRequest = null;
                }
                delayedSearchRequest = setTimeout(function () {
                    if($('#searchTextBox').val() != "") {
                        $("#loadingImage").fadeIn('slow');
                    }
                    search(escapeSearchString(($("#searchTextBox")[0]).value.substr(0, 700)));
                }, 300);
            });
            $("#search").hide();
        }
        Search.initializeSearch = initializeSearch;
        function navigateToElement(e) {
            if(!CZ.Authoring.isActive) {
                var animId = CZ.Common.setVisibleByUserDirectly(e.newvisible);
                if(animId) {
                    CZ.Common.setNavigationStringTo = {
                        element: e.element,
                        id: animId
                    };
                }
            }
        }
        Search.navigateToElement = navigateToElement;
        function navigateToBookmark(bookmark) {
            if(bookmark && !CZ.Authoring.isActive) {
                var visible = CZ.UrlNav.navStringToVisible(bookmark, CZ.Common.vc);
                if(visible) {
                    var animId = CZ.Common.setVisibleByUserDirectly(visible);
                    if(animId) {
                        CZ.Common.setNavigationStringTo = {
                            bookmark: bookmark,
                            id: animId
                        };
                    }
                }
            }
        }
        Search.navigateToBookmark = navigateToBookmark;
        function goToSearchResult(resultId, elementType) {
            var element = findVCElement(CZ.Common.vc.virtualCanvas("getLayerContent"), resultId, elementType);
            var navStringElement = CZ.UrlNav.vcelementToNavString(element);
            CZ.StartPage.hide();
            var visible = CZ.UrlNav.navStringToVisible(navStringElement, CZ.Common.vc);
            CZ.Common.controller.moveToVisible(visible);
        }
        Search.goToSearchResult = goToSearchResult;
        function findVCElement(root, id, elementType) {
            var lookingForCI = elementType === "contentItem";
            var rfind = function (el, id) {
                if(el.id === id) {
                    return el;
                }
                if(!el.children) {
                    return null;
                }
                var n = el.children.length;
                for(var i = 0; i < n; i++) {
                    var child = el.children[i];
                    if(child.id === id) {
                        return child;
                    }
                }
                for(var i = 0; i < n; i++) {
                    var child = el.children[i];
                    var res = rfind(child, id);
                    if(res) {
                        return res;
                    }
                }
                if(lookingForCI && el.type === 'infodot') {
                    var ci = CZ.VCContent.getContentItem(el, id);
                    if(ci != null) {
                        return ci;
                    }
                }
                return null;
            };
            return rfind(root, id);
        }
        function onSearchResults(searchString, results) {
            if(escapeSearchString(($("#searchTextBox")[0]).value).indexOf(searchString) === 0 || searchString === '') {
                var height;
                var output = $("#search .searchResults").empty();
                if(results == null) {
                } else if(results.length == 0) {
                    $("<div></div>", {
                        class: "searchNoResult",
                        text: "No results"
                    }).appendTo(output);
                } else {
                    var addResults = function (objectType, sectionTitle) {
                        var first = true;
                        for(var i = 0; i < results.length; i++) {
                            var item = results[i];
                            if(item.objectType != objectType) {
                                continue;
                            }
                            var resultId;
                            var elementType;
                            switch(item.objectType) {
                                case 0:
                                    resultId = 'e' + item.id;
                                    elementType = "exhibit";
                                    break;
                                case 1:
                                    resultId = 't' + item.id;
                                    elementType = "timeline";
                                    break;
                                case 2:
                                    resultId = item.id;
                                    elementType = "contentItem";
                                    break;
                                default:
                                    continue;
                            }
                            if(first) {
                                $("<div></div>", {
                                    class: "searchResultSection",
                                    text: sectionTitle
                                }).appendTo(output);
                                first = false;
                            }
                            $("<div></div>", {
                                class: "searchResult",
                                resultId: resultId,
                                text: results[i].title,
                                click: function () {
                                    goToSearchResult(this.getAttribute("resultId"), this.getAttribute("data-element-type"));
                                }
                            }).attr("data-element-type", elementType).appendTo(output);
                        }
                    };
                    addResults(1, "Timelines");
                    addResults(0, "Exhibits");
                    addResults(2, "Artifacts");
                }
            }
            if(isSearching) {
                isSearching = false;
            }
            if(pendingSearch != null) {
                var q = pendingSearch;
                pendingSearch = null;
                search(q);
            }
            $("#loadingImage").fadeOut('slow');
        }
        var pendingSearch = null;
        var isSearching = false;
        function search(searchString) {
            if(isSearching) {
                pendingSearch = searchString;
                return;
            }
            isSearching = true;
            if(!searchString || searchString === '') {
                setTimeout(function () {
                    onSearchResults(searchString);
                }, 1);
                return;
            }
            var url;
            switch(CZ.Settings.czDataSource) {
                case 'db':
                    url = "/api/Search";
                    break;
                default:
                    url = "/api/Search";
                    break;
            }
            $.ajax({
                cache: false,
                type: "GET",
                async: true,
                dataType: "json",
                data: {
                    searchTerm: searchString,
                    supercollection: CZ.Service.superCollectionName,
                    collection: CZ.Service.collectionName
                },
                url: url,
                success: function (result) {
                    onSearchResults(searchString, result.d);
                },
                error: function (xhr) {
                    console.log("Error connecting to service: " + xhr.responseText);
                }
            });
        }
        function escapeSearchString(searchString) {
            if(searchString === null) {
                return '';
            }
            if(searchString) {
                searchString = searchString.replace(new RegExp('"', "g"), '');
            }
            return searchString;
        }
    })(CZ.Search || (CZ.Search = {}));
    var Search = CZ.Search;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (BreadCrumbs) {
        var hiddenFromLeft = [];
        var hiddenFromRight = [];
        BreadCrumbs.visibleAreaWidth = 0;
        var breadCrumbs;
        function updateBreadCrumbsLabels(newBreadCrumbs) {
            if(newBreadCrumbs) {
                if(breadCrumbs == null) {
                    breadCrumbs = newBreadCrumbs;
                    for(var i = 0; i < breadCrumbs.length; i++) {
                        addBreadCrumb(breadCrumbs[i].vcElement);
                    }
                    moveToRightEdge();
                    return;
                }
                for(var i = 0; i < breadCrumbs.length; i++) {
                    if(newBreadCrumbs[i] == null) {
                        removeBreadCrumb();
                    } else if(newBreadCrumbs[i].vcElement.id != breadCrumbs[i].vcElement.id) {
                        for(var j = i; j < breadCrumbs.length; j++) {
                            removeBreadCrumb();
                        }
                        for(var j = i; j < newBreadCrumbs.length; j++) {
                            addBreadCrumb(newBreadCrumbs[j].vcElement);
                        }
                        breadCrumbs = newBreadCrumbs;
                        return;
                    }
                }
                moveToRightEdge();
                for(var i = breadCrumbs.length; i < newBreadCrumbs.length; i++) {
                    addBreadCrumb(newBreadCrumbs[i].vcElement);
                }
                moveToRightEdge();
                breadCrumbs = newBreadCrumbs;
            }
        }
        BreadCrumbs.updateBreadCrumbsLabels = updateBreadCrumbsLabels;
        function updateHiddenBreadCrumbs() {
            hiddenFromLeft = [];
            hiddenFromRight = [];
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            $("#breadcrumbs-table tr td").each(function (index) {
                if($(this).attr("moving") != "left" && $(this).attr("moving") != "right") {
                    var elementOffset = $(this).position().left + tableOffset;
                    var elementWidth = $(this).width();
                    if(index == 0) {
                        if(elementOffset < 0) {
                            hiddenFromLeft.push(index);
                        }
                    } else if(index == $("#breadcrumbs-table tr td").length - 1) {
                        if(elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth) {
                            hiddenFromRight.push(index);
                        }
                    } else {
                        if(elementOffset + elementWidth / 3 < 0) {
                            hiddenFromLeft.push(index);
                        } else if(elementOffset + elementWidth * 2 / 3 > BreadCrumbs.visibleAreaWidth) {
                            hiddenFromRight.push(index);
                        }
                    }
                }
            });
            hiddenFromRight.reverse();
            if(hiddenFromLeft.length != 0) {
                $("#breadcrumbs-nav-left").stop(true, true).fadeIn('fast');
            } else {
                $("#breadcrumbs-nav-left").stop(true, true).fadeOut('fast');
            }
            if(hiddenFromRight.length != 0) {
                $("#breadcrumbs-nav-right").stop(true, true).fadeIn('fast');
            } else {
                $("#breadcrumbs-nav-right").stop(true, true).fadeOut('fast');
            }
        }
        BreadCrumbs.updateHiddenBreadCrumbs = updateHiddenBreadCrumbs;
        function showHiddenBreadCrumb(direction, index) {
            if(index == null) {
                updateHiddenBreadCrumbs();
                switch(direction) {
                    case "left":
                        if(hiddenFromLeft.length != 0) {
                            index = hiddenFromLeft.pop();
                        } else {
                            return;
                        }
                        break;
                    case "right":
                        if(hiddenFromRight.length != 0) {
                            index = hiddenFromRight.pop();
                        } else {
                            return;
                        }
                        break;
                }
            }
            $("#breadcrumbs-table tr").stop();
            var element = $("#bc_" + index);
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var elementOffset = element.position().left + tableOffset;
            var offset = 0;
            switch(direction) {
                case "left":
                    offset = -elementOffset;
                    break;
                case "right":
                    var elementWidth = element.width();
                    offset = BreadCrumbs.visibleAreaWidth - elementOffset - elementWidth - 1;
                    break;
            }
            if(offset != 0) {
                var str = "+=" + offset + "px";
                element.attr("moving", direction);
                $("#breadcrumbs-table tr").animate({
                    "left": str
                }, "slow", function () {
                    $("#breadcrumbs-table tr td").each(function () {
                        $(this).attr("moving", "false");
                    });
                    updateHiddenBreadCrumbs();
                });
            }
        }
        function moveToRightEdge(callback) {
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var tableWidth = $("#breadcrumbs-table tr").width();
            if(tableOffset <= 0) {
                var tableVisible = tableWidth + tableOffset;
                var difference = 0;
                if(tableWidth >= BreadCrumbs.visibleAreaWidth) {
                    if(tableVisible > BreadCrumbs.visibleAreaWidth) {
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    } else {
                        difference = BreadCrumbs.visibleAreaWidth - tableVisible - 1;
                    }
                } else {
                    difference = -tableOffset;
                }
                $("#breadcrumbs-table tr").stop();
                if(difference != 0) {
                    var str = "+=" + difference + "px";
                    $("#breadcrumbs-table tr").animate({
                        "left": str
                    }, "fast", function () {
                        $("#breadcrumbs-table tr td").each(function () {
                            $(this).attr("moving", "false");
                        });
                        updateHiddenBreadCrumbs();
                        if(callback != null) {
                            callback();
                        }
                    });
                }
            }
        }
        function removeBreadCrumb() {
            var length = $("#breadcrumbs-table tr td").length;
            if(length > 0) {
                var selector = "#bc_" + (length - 1);
                $(selector).remove();
                if(length > 1) {
                    selector = "#bc_" + (length - 2);
                    $(selector + " .breadcrumb-separator").hide();
                }
            }
        }
        function addBreadCrumb(element) {
            var length = $("#breadcrumbs-table tr td").length;
            $("#breadcrumbs-table tr").append($("<td></td>", {
                id: "bc_" + length
            }).append($("<div></div>", {
                id: "bc_link_" + element.id,
                class: "breadcrumb-link",
                text: element.title,
                click: function () {
                    clickOverBreadCrumb(element.id, length);
                }
            })).append($("<span></span>", {
                id: "bc_",
                class: "breadcrumb-separator",
                text: "›"
            })));
            switch(element.regime) {
                case "Cosmos":
                    $("#bc_link_" + element.id).addClass("breadcrumb-cosmos");
                    break;
                case "Earth":
                    $("#bc_link_" + element.id).addClass("breadcrumb-earth");
                    break;
                case "Life":
                    $("#bc_link_" + element.id).addClass("breadcrumb-life");
                    break;
                case "Pre-history":
                    $("#bc_link_" + element.id).addClass("breadcrumb-prehistory");
                    break;
                case "Humanity":
                    $("#bc_link_" + element.id).addClass("breadcrumb-humanity");
                    break;
            }
            $("#bc_" + length + " .breadcrumb-separator").hide();
            if(length > 0) {
                $("#bc_" + (length - 1) + " .breadcrumb-separator").show();
            }
            $("#bc_link_" + element.id).mouseover(function () {
                breadCrumbMouseOver(this);
            });
            $("#bc_link_" + element.id).mouseout(function () {
                breadCrumbMouseOut(this);
            });
        }
        function breadCrumbNavLeft() {
            var movingLeftBreadCrumbs = 0;
            var num = 0;
            $("#breadcrumbs-table tr td").each(function (index) {
                if($(this).attr("moving") == "left") {
                    movingLeftBreadCrumbs++;
                    if(num == 0) {
                        num = index;
                    }
                }
            });
            if(movingLeftBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = num - CZ.Settings.longNavigationLength;
                if(index < 0) {
                    index = 0;
                }
                showHiddenBreadCrumb("left", index);
            } else if(movingLeftBreadCrumbs < CZ.Settings.navigateNextMaxCount) {
                showHiddenBreadCrumb("left");
            }
        }
        BreadCrumbs.breadCrumbNavLeft = breadCrumbNavLeft;
        function breadCrumbNavRight() {
            var movingRightBreadCrumbs = 0;
            var num = 0;
            $("#breadcrumbs-table tr td").each(function (index) {
                if($(this).attr("moving") == "right") {
                    movingRightBreadCrumbs++;
                    num = index;
                }
            });
            if(movingRightBreadCrumbs == CZ.Settings.navigateNextMaxCount) {
                var index = num + CZ.Settings.longNavigationLength;
                if(index >= $("#breadcrumbs-table tr td").length) {
                    index = $("#breadcrumbs-table tr td").length - 1;
                }
                showHiddenBreadCrumb("right", index);
            } else if(movingRightBreadCrumbs < CZ.Settings.navigateNextMaxCount) {
                showHiddenBreadCrumb("right");
            }
        }
        BreadCrumbs.breadCrumbNavRight = breadCrumbNavRight;
        function clickOverBreadCrumb(timelineID, breadCrumbLinkID) {
            CZ.Search.goToSearchResult(timelineID);
            var selector = "#bc_" + breadCrumbLinkID;
            var tableOffset = $("#breadcrumbs-table tr").position().left;
            var elementOffset = $(selector).position().left + tableOffset;
            var elementWidth = $(selector).width();
            if(elementOffset < 0) {
                showHiddenBreadCrumb("left", breadCrumbLinkID);
            } else if(elementOffset + elementWidth > BreadCrumbs.visibleAreaWidth) {
                showHiddenBreadCrumb("right", breadCrumbLinkID);
            }
        }
        BreadCrumbs.clickOverBreadCrumb = clickOverBreadCrumb;
        function breadCrumbMouseOut(element) {
            $(element).removeClass("breadcrumb-hover");
        }
        function breadCrumbMouseOver(element) {
            $(element).addClass("breadcrumb-hover");
        }
        function changeToOff(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_on", "_off"));
        }
        function changeToOn(element) {
            var src = element.getAttribute("src");
            element.setAttribute("src", src.replace("_off", "_on"));
        }
    })(CZ.BreadCrumbs || (CZ.BreadCrumbs = {}));
    var BreadCrumbs = CZ.BreadCrumbs;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Viewport) {
        function VisibleRegion2d(centerX, centerY, scale) {
            this.centerX = centerX;
            this.centerY = centerY;
            this.scale = scale;
        }
        Viewport.VisibleRegion2d = VisibleRegion2d;
        function Viewport2d(aspectRatio, width, height, visible) {
            this.aspectRatio = aspectRatio;
            this.visible = visible;
            this.width = width;
            this.height = height;
            this.widthScreenToVirtual = function (wp) {
                return this.visible.scale * wp;
            };
            this.heightScreenToVirtual = function (hp) {
                return this.aspectRatio * this.visible.scale * hp;
            };
            this.widthVirtualToScreen = function (wv) {
                return wv / this.visible.scale;
            };
            this.heightVirtualToScreen = function (hv) {
                return hv / (this.aspectRatio * this.visible.scale);
            };
            this.vectorVirtualToScreen = function (vx, vy) {
                return {
                    x: vx / this.visible.scale,
                    y: vy / (this.aspectRatio * this.visible.scale)
                };
            };
            this.pointVirtualToScreen = function (px, py) {
                return {
                    x: (px - this.visible.centerX) / this.visible.scale + this.width / 2.0,
                    y: (py - this.visible.centerY) / (this.aspectRatio * this.visible.scale) + this.height / 2.0
                };
            };
            this.pointScreenToVirtual = function (px, py) {
                return {
                    x: (px - this.width / 2.0) * this.visible.scale + this.visible.centerX,
                    y: this.visible.centerY - (this.height / 2.0 - py) * (this.aspectRatio * this.visible.scale)
                };
            };
            this.vectorScreenToVirtual = function (px, py) {
                return {
                    x: px * this.visible.scale,
                    y: this.aspectRatio * this.visible.scale * py
                };
            };
        }
        Viewport.Viewport2d = Viewport2d;
    })(CZ.Viewport || (CZ.Viewport = {}));
    var Viewport = CZ.Viewport;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (ViewportAnimation) {
        var globalAnimationID = 1;
        function PanZoomAnimation(startViewport) {
            this.isForciblyStoped = false;
            this.ID = globalAnimationID++;
            var startVisible = startViewport.visible;
            this.velocity = 0.001;
            this.isActive = true;
            this.type = "PanZoom";
            this.startViewport = new CZ.Viewport.Viewport2d(startViewport.aspectRatio, startViewport.width, startViewport.height, new CZ.Viewport.VisibleRegion2d(startVisible.centerX, startVisible.centerY, startVisible.scale));
            this.estimatedEndViewport;
            this.endCenterInSC;
            this.startCenterInSC = this.startViewport.pointVirtualToScreen(startVisible.centerX, startVisible.centerY);
            this.previousFrameCenterInSC = this.startCenterInSC;
            this.previousFrameViewport = this.startViewport;
            this.prevFrameTime = new Date();
            this.direction;
            this.pathLeng;
            this.setTargetViewport = function (estimatedEndViewport) {
                this.estimatedEndViewport = estimatedEndViewport;
                var prevVis = this.previousFrameViewport.visible;
                this.startViewport = new CZ.Viewport.Viewport2d(this.previousFrameViewport.aspectRatio, this.previousFrameViewport.width, this.previousFrameViewport.height, new CZ.Viewport.VisibleRegion2d(prevVis.centerX, prevVis.centerY, prevVis.scale));
                this.startCenterInSC = this.startViewport.pointVirtualToScreen(prevVis.centerX, prevVis.centerY);
                this.previousFrameCenterInSC = {
                    x: this.startCenterInSC.x,
                    y: this.startCenterInSC.y
                };
                var estimatedVisible = this.estimatedEndViewport.visible;
                this.endCenterInSC = this.startViewport.pointVirtualToScreen(estimatedVisible.centerX, estimatedVisible.centerY);
                this.direction = {
                    X: this.endCenterInSC.x - this.startCenterInSC.x,
                    Y: this.endCenterInSC.y - this.startCenterInSC.y
                };
                var dirX = this.direction.X;
                var dirY = this.direction.Y;
                this.pathLeng = Math.sqrt(dirX * dirX + dirY * dirY);
                if(this.pathLeng < 1e-1) {
                    this.direction.X = this.direction.Y = 0;
                    if(estimatedVisible.scale == prevVis.scale) {
                        this.isActive = false;
                    }
                } else {
                    this.direction.X /= this.pathLeng;
                    this.direction.Y /= this.pathLeng;
                }
            };
            this.produceNextVisible = function (currentViewport) {
                var currentCenterInSC = this.startViewport.pointVirtualToScreen(currentViewport.visible.centerX, currentViewport.visible.centerY);
                var currScale = currentViewport.visible.scale;
                var startVisible = this.startViewport.visible;
                var curTime = new Date();
                var timeDiff = curTime.getTime() - this.prevFrameTime.getTime();
                var k = this.velocity * timeDiff;
                var dx = this.endCenterInSC.x - this.previousFrameCenterInSC.x;
                var dy = this.endCenterInSC.y - this.previousFrameCenterInSC.y;
                var curDist = Math.max(1.0, Math.sqrt(dx * dx + dy * dy));
                var prevFrameVisible = this.previousFrameViewport.visible;
                var updatedVisible = new CZ.Viewport.VisibleRegion2d(prevFrameVisible.centerX, prevFrameVisible.centerY, prevFrameVisible.scale);
                this.previousFrameCenterInSC.x += curDist * k * this.direction.X;
                this.previousFrameCenterInSC.y += curDist * k * this.direction.Y;
                updatedVisible.scale += (this.estimatedEndViewport.visible.scale - updatedVisible.scale) * k;
                this.prevFrameTime = curTime;
                dx = this.previousFrameCenterInSC.x - this.startCenterInSC.x;
                dy = this.previousFrameCenterInSC.y - this.startCenterInSC.y;
                var distToStart = Math.sqrt(dx * dx + dy * dy);
                var scaleDistToStart = this.estimatedEndViewport.visible.scale - startVisible.scale;
                var scaleDistCurrent = updatedVisible.scale - startVisible.scale;
                if((distToStart >= this.pathLeng) || Math.abs(scaleDistCurrent) > Math.abs(scaleDistToStart)) {
                    this.isActive = false;
                    return this.estimatedEndViewport.visible;
                }
                ;
                var virtPoint = this.startViewport.pointScreenToVirtual(this.previousFrameCenterInSC.x, this.previousFrameCenterInSC.y);
                updatedVisible.centerX = virtPoint.x;
                updatedVisible.centerY = virtPoint.y;
                this.previousFrameViewport.visible = updatedVisible;
                return updatedVisible;
            };
        }
        ViewportAnimation.PanZoomAnimation = PanZoomAnimation;
        function EllipticalZoom(startVisible, endVisible) {
            this.isForciblyStoped = false;
            this.ID = globalAnimationID++;
            this.type = "EllipticalZoom";
            this.isActive = true;
            this.targetVisible = new CZ.Viewport.VisibleRegion2d(endVisible.centerX, endVisible.centerY, endVisible.scale);
            this.startTime = (new Date()).getTime();
            this.imprecision = 0.0001;
            function cosh(x) {
                return (Math.exp(x) + Math.exp(-x)) / 2;
            }
            function sinh(x) {
                return (Math.exp(x) - Math.exp(-x)) / 2;
            }
            function tanh(x) {
                return sinh(x) / cosh(x);
            }
            this.u = function (s) {
                var val = this.startScale / (this.ro * this.ro) * (this.coshR0 * tanh(this.ro * s + this.r0) - this.sinhR0) + this.u0;
                if(this.uS < this.pathLen) {
                    val = val * this.uSRatio;
                }
                return Math.min(val, this.pathLen);
            };
            this.scale = function (t) {
                return this.startScale * cosh(this.r0) / cosh(this.ro * (t * this.S) + this.r0);
            };
            this.x = function (t) {
                return startPoint.X + (endPoint.X - startPoint.X) / this.pathLen * this.u(t * this.S);
            };
            this.y = function (t) {
                return startPoint.Y + (endPoint.Y - startPoint.Y) / this.pathLen * this.u(t * this.S);
            };
            this.produceNextVisible = function (currentViewport) {
                var curTime = (new Date()).getTime();
                var t;
                if(this.duration > 0) {
                    t = Math.min(1.0, (curTime - this.startTime) / this.duration);
                } else {
                    t = 1.0;
                }
                t = animationEase(t);
                if(t == 1.0) {
                    this.isActive = false;
                }
                return new CZ.Viewport.VisibleRegion2d(this.x(t), this.y(t), this.scale(t));
            };
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
            var ro = 0.1 * CZ.Settings.ellipticalZoomZoomoutFactor;
            this.ro = ro;
            var u0 = 0;
            this.u0 = u0;
            var u1 = this.pathLen;
            this.startPoint = startPoint;
            this.startScale = startScale;
            this.endPoint = endPoint;
            this.endScale = endScale;
            if(Math.abs(u0 - u1) > this.imprecision) {
                var uDiff = u0 - u1;
                var b0 = (endScale * endScale - startScale * startScale + Math.pow(ro, 4) * uDiff * uDiff) / (2 * startScale * ro * ro * (-uDiff));
                var b1 = (endScale * endScale - startScale * startScale - Math.pow(ro, 4) * uDiff * uDiff) / (2 * endScale * ro * ro * (-uDiff));
                this.r0 = Math.log(-b0 + Math.sqrt(b0 * b0 + 1));
                if(this.r0 == -Infinity) {
                    this.r0 = -Math.log(2 * b0);
                }
                this.r1 = Math.log(-b1 + Math.sqrt(b1 * b1 + 1));
                if(this.r1 == -Infinity) {
                    this.r1 = -Math.log(2 * b1);
                }
                this.S = (this.r1 - this.r0) / ro;
                this.duration = CZ.Settings.ellipticalZoomDuration / 300 * this.S;
            } else {
                var logScaleChange = Math.log(Math.abs(endScale - startScale)) + 10;
                if(logScaleChange < 0) {
                    this.isActive = false;
                }
                var scaleDiff = 0.5;
                if(endScale !== 0 || startScale !== 0) {
                    scaleDiff = Math.min(endScale, startScale) / Math.max(endScale, startScale);
                }
                if(scaleDiff === 1) {
                    this.isActive = false;
                }
                this.duration = CZ.Settings.ellipticalZoomDuration * scaleDiff * 0.2;
                this.x = function (s) {
                    return this.startPoint.X;
                };
                this.y = function (s) {
                    return this.startPoint.Y;
                };
                this.scale = function (s) {
                    return this.startScale + (this.endScale - this.startScale) * s;
                };
            }
            this.coshR0 = cosh(this.r0);
            this.sinhR0 = sinh(this.r0);
            this.uS = this.u(this.S);
            this.uSRatio = this.pathLen / this.uS;
        }
        ViewportAnimation.EllipticalZoom = EllipticalZoom;
        function animationEase(t) {
            return -2 * t * t * t + 3 * t * t;
        }
        ViewportAnimation.animationEase = animationEase;
    })(CZ.ViewportAnimation || (CZ.ViewportAnimation = {}));
    var ViewportAnimation = CZ.ViewportAnimation;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Layout) {
        var isLayoutAnimation = true;
        Layout.animatingElements = {
            length: 0
        };
        Layout.timelineHeightRate = 0.4;
        function Timeline(title, left, right, childTimelines, exhibits) {
            this.Title = title;
            this.left = left;
            this.right = right;
            this.ChildTimelines = childTimelines;
            this.Exhibits = exhibits;
        }
        function Infodot(x, contentItems) {
            this.x = x;
            this.ContentItems = contentItems;
        }
        function titleObject(name) {
            this.name = name;
        }
        function Prepare(timeline) {
            timeline.left = CZ.Dates.getCoordinateFromDecimalYear(timeline.start);
            timeline.right = CZ.Dates.getCoordinateFromDecimalYear(timeline.end);
            timeline.endDate = timeline.end;
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (exhibit) {
                    exhibit.x = CZ.Dates.getCoordinateFromDecimalYear(exhibit.time);
                    exhibit.contentItems.forEach(function (contentItem) {
                        CZ.Extensions.activateExtension(contentItem.mediaType);
                    });
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeline) {
                    childTimeline.ParentTimeline = timeline;
                    Prepare(childTimeline);
                });
            }
            GenerateAspect(timeline);
            if(timeline.Height) {
                timeline.Height /= 100;
            } else if(!timeline.AspectRatio && !timeline.Height) {
                timeline.Height = CZ.Layout.timelineHeightRate;
            }
        }
        function GenerateAspect(timeline) {
            if(timeline.ID == CZ.Settings.cosmosTimelineID) {
                timeline.AspectRatio = 10;
            }
        }
        function LayoutTimeline(timeline, parentWidth, measureContext) {
            var headerPercent = CZ.Settings.timelineHeaderSize + 2 * CZ.Settings.timelineHeaderMargin;
            var timelineWidth = timeline.right - timeline.left;
            timeline.width = timelineWidth;
            if(timeline.AspectRatio && !timeline.height) {
                timeline.height = timelineWidth / timeline.AspectRatio;
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    if(tl.AspectRatio) {
                        tl.height = (tl.right - tl.left) / tl.AspectRatio;
                    } else if(timeline.height && tl.Height) {
                        tl.height = Math.min(timeline.height * tl.Height, (tl.right - tl.left) * CZ.Settings.timelineMinAspect);
                    }
                    LayoutTimeline(tl, timelineWidth, measureContext);
                });
            }
            if(!timeline.height) {
                var scaleCoef = undefined;
                if(timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (tl) {
                        if(tl.Height && !tl.AspectRatio) {
                            var localScale = tl.height / tl.Height;
                            if(!scaleCoef || scaleCoef < localScale) {
                                scaleCoef = localScale;
                            }
                        }
                    });
                }
                if(scaleCoef) {
                    if(timeline.timelines instanceof Array) {
                        timeline.timelines.forEach(function (tl) {
                            if(tl.Height && !tl.AspectRatio) {
                                var scaleParam = scaleCoef * tl.Height / tl.height;
                                if(scaleParam > 1) {
                                    tl.realY *= scaleParam;
                                    Scale(tl, scaleParam, measureContext);
                                }
                            }
                        });
                    }
                    timeline.height = scaleCoef;
                }
            }
            var exhibitSize = CalcInfodotSize(timeline);
            var tlRes = LayoutChildTimelinesOnly(timeline);
            var res = LayoutContent(timeline, exhibitSize);
            if(timeline.height) {
                var titleObject = GenerateTitleObject(timeline.height, timeline, measureContext);
                if(timeline.exhibits instanceof Array) {
                    if(timeline.exhibits.length > 0 && (tlRes.max - tlRes.min) < timeline.height) {
                        while((res.max - res.min) > (timeline.height - titleObject.bboxHeight) && exhibitSize > timelineWidth / 20.0) {
                            exhibitSize /= 1.5;
                            res = LayoutContent(timeline, exhibitSize);
                        }
                    }
                }
                if((res.max - res.min) > (timeline.height - titleObject.bboxHeight)) {
                    var contentHeight = res.max - res.min;
                    var fullHeight = contentHeight / (1 - headerPercent);
                    var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                    timeline.height = fullHeight;
                } else {
                }
                timeline.titleRect = titleObject;
            } else {
                var min = res.min;
                var max = res.max;
                var minAspect = 1.0 / CZ.Settings.timelineMinAspect;
                var minHeight = timelineWidth / minAspect;
                var contentHeight = Math.max((1 - headerPercent) * minHeight, max - min);
                var fullHeight = contentHeight / (1 - headerPercent);
                var titleObject = GenerateTitleObject(fullHeight, timeline, measureContext);
                timeline.titleRect = titleObject;
                timeline.height = fullHeight;
            }
            timeline.heightEps = parentWidth * CZ.Settings.timelineContentMargin;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.realY = 0;
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.realY -= res.min;
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY -= res.min;
                });
            }
        }
        function PositionContent(contentArray, arrangedArray, intersectionFunc) {
            contentArray.forEach(function (el) {
                var usedY = new Array();
                arrangedArray.forEach(function (ael) {
                    if(intersectionFunc(el, ael)) {
                        usedY.push({
                            top: ael.realY + ael.realHeight,
                            bottom: ael.realY
                        });
                    }
                });
                var y = 0;
                if(usedY.length > 0) {
                    var segmentPoints = new Array();
                    usedY.forEach(function (segment) {
                        segmentPoints.push({
                            type: "bottom",
                            value: segment.bottom
                        });
                        segmentPoints.push({
                            type: "top",
                            value: segment.top
                        });
                    });
                    segmentPoints.sort(function (l, r) {
                        return l.value - r.value;
                    });
                    var freeSegments = new Array();
                    var count = 0;
                    for(i = 0; i < segmentPoints.length - 1; i++) {
                        if(segmentPoints[i].type == "top") {
                            count++;
                        } else {
                            count--;
                        }
                        if(count == 0 && segmentPoints[i + 1].type == "bottom") {
                            freeSegments.push({
                                bottom: segmentPoints[i].value,
                                top: segmentPoints[i + 1].value
                            });
                        }
                    }
                    var foundPlace = false;
                    for(var i = 0; i < freeSegments.length; i++) {
                        if((freeSegments[i].top - freeSegments[i].bottom) > el.realHeight) {
                            y = freeSegments[i].bottom;
                            foundPlace = true;
                            break;
                        }
                    }
                    ;
                    if(!foundPlace) {
                        y = segmentPoints[segmentPoints.length - 1].value;
                    }
                }
                el.realY = y;
                arrangedArray.push(el);
            });
        }
        function LayoutContent(timeline, exhibitSize) {
            var sequencedContent = new Array();
            var unsequencedContent = new Array();
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    if(tl.Sequence) {
                        sequencedContent.push(tl);
                    } else {
                        unsequencedContent.push(tl);
                    }
                });
            }
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.size = exhibitSize;
                    eb.left = eb.x - eb.size / 2.0;
                    eb.right = eb.x + eb.size / 2.0;
                    eb.realHeight = exhibitSize;
                    if(eb.left < timeline.left) {
                        eb.left = timeline.left;
                        eb.right = eb.left + eb.size;
                        eb.isDeposed = true;
                    } else if(eb.right > timeline.right) {
                        eb.right = timeline.right;
                        eb.left = timeline.right - eb.size;
                        eb.isDeposed = true;
                    }
                    if(eb.Sequence) {
                        sequencedContent.push(eb);
                    } else {
                        unsequencedContent.push(eb);
                    }
                });
            }
            sequencedContent.sort(function (l, r) {
                return l.Sequence - r.Sequence;
            });
            var arrangedElements = new Array();
            PositionContent(sequencedContent, arrangedElements, function (el, ael) {
                return el.left < ael.right;
            });
            PositionContent(unsequencedContent, arrangedElements, function (el, ael) {
                return !(el.left >= ael.right || ael.left >= el.right);
            });
            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;
            arrangedElements.forEach(function (element) {
                if(element.realY < min) {
                    min = element.realY;
                }
                if((element.realY + element.realHeight) > max) {
                    max = element.realY + element.realHeight;
                }
            });
            if(arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }
            return {
                max: max,
                min: min
            };
        }
        function LayoutChildTimelinesOnly(timeline) {
            var arrangedElements = new Array();
            if(timeline.timelines instanceof Array) {
                PositionContent(timeline.timelines, arrangedElements, function (el, ael) {
                    return !(el.left >= ael.right || ael.left >= el.right);
                });
            }
            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;
            arrangedElements.forEach(function (element) {
                if(element.realY < min) {
                    min = element.realY;
                }
                if((element.realY + element.realHeight) > max) {
                    max = element.realY + element.realHeight;
                }
            });
            if(arrangedElements.length == 0) {
                max = 0;
                min = 0;
            }
            return {
                max: max,
                min: min
            };
        }
        function Scale(timeline, scale, mctx) {
            if(scale < 1) {
                throw "Only extending of content is allowed";
            }
            timeline.height *= scale;
            timeline.realHeight = timeline.height + 2 * timeline.heightEps;
            timeline.titleRect = GenerateTitleObject(timeline.height, timeline, mctx);
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY *= scale;
                    if(!tl.AspectRatio) {
                        Scale(tl, scale, mctx);
                    }
                });
            }
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (eb) {
                    eb.realY *= scale;
                });
            }
        }
        function Arrange(timeline) {
            timeline.y = timeline.realY + timeline.heightEps;
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (infodot) {
                    infodot.y = infodot.realY + infodot.size / 2.0 + timeline.y;
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (tl) {
                    tl.realY += timeline.y;
                    Arrange(tl);
                });
            }
        }
        function CalcInfodotSize(timeline) {
            return (timeline.right - timeline.left) / 20.0;
        }
        function GenerateTitleObject(tlHeight, timeline, measureContext) {
            var tlW = timeline.right - timeline.left;
            measureContext.font = "100pt " + CZ.Settings.timelineHeaderFontName;
            var size = measureContext.measureText(timeline.title);
            var height = CZ.Settings.timelineHeaderSize * tlHeight;
            var width = height * size.width / 100.0;
            var margin = Math.min(tlHeight, tlW) * CZ.Settings.timelineHeaderMargin;
            if(width + 2 * margin > tlW) {
                width = tlW - 2 * margin;
                height = width * 100.0 / size.width;
            }
            return {
                width: width - 2.1 * height,
                height: height,
                marginTop: tlHeight - height - margin,
                marginLeft: margin,
                bboxWidth: width + 2 * margin - 2.1 * height,
                bboxHeight: height + 2 * margin
            };
        }
        Layout.GenerateTitleObject = GenerateTitleObject;
        function Convert(parent, timeline) {
            var tlColor = GetTimelineColor(timeline);
            var t1 = CZ.VCContent.addTimeline(parent, "layerTimelines", 't' + timeline.id, {
                isBuffered: timeline.timelines instanceof Array,
                guid: timeline.id,
                timeStart: timeline.left,
                timeEnd: timeline.right,
                top: timeline.y,
                height: timeline.height,
                header: timeline.title,
                fillStyle: "rgba(0,0,0,0.25)",
                titleRect: timeline.titleRect,
                strokeStyle: tlColor,
                regime: timeline.Regime,
                endDate: timeline.endDate,
                opacity: 0
            });
            if(timeline.exhibits instanceof Array) {
                timeline.exhibits.forEach(function (childInfodot) {
                    var contentItems = [];
                    if(typeof childInfodot.contentItems !== 'undefined') {
                        contentItems = childInfodot.contentItems;
                        for(var i = 0; i < contentItems.length; ++i) {
                            contentItems[i].guid = contentItems[i].id;
                        }
                    }
                    var infodot1 = CZ.VCContent.addInfodot(t1, "layerInfodots", 'e' + childInfodot.id, (childInfodot.left + childInfodot.right) / 2.0, childInfodot.y, 0.8 * childInfodot.size / 2.0, contentItems, {
                        isBuffered: false,
                        guid: childInfodot.id,
                        title: childInfodot.title,
                        date: childInfodot.time,
                        opacity: 1
                    });
                });
            }
            if(timeline.timelines instanceof Array) {
                timeline.timelines.forEach(function (childTimeLine) {
                    Convert(t1, childTimeLine);
                });
            }
        }
        function GetTimelineColor(timeline) {
            if(timeline.Regime == "Cosmos") {
                return "rgba(152, 108, 157, 1.0)";
            } else if(timeline.Regime == "Earth") {
                return "rgba(81, 127, 149, 1.0)";
            } else if(timeline.Regime == "Life") {
                return "rgba(73, 150, 73, 1.0)";
            } else if(timeline.Regime == "Pre-history") {
                return "rgba(237, 145, 50, 1.0)";
            } else if(timeline.Regime == "Humanity") {
                return "rgba(212, 92, 70, 1.0)";
            } else {
                return "rgba(255, 255, 255, 0.5)";
            }
        }
        Layout.FindChildTimeline = function (timeline, id, recursive) {
            var result = undefined;
            if(timeline && timeline.timelines instanceof Array) {
                var n = timeline.timelines.length;
                for(var i = 0; i < n; i++) {
                    var childTimeline = timeline.timelines[i];
                    if(childTimeline.id == id) {
                        result = childTimeline;
                        break;
                    } else {
                        if(recursive == true) {
                            result = Layout.FindChildTimeline(childTimeline, id, recursive);
                            if(result != undefined) {
                                break;
                            }
                        }
                    }
                }
            }
            return result;
        };
        function GetVisibleFromTimeline(timeline, vcph) {
            if(timeline) {
                var vp = vcph.virtualCanvas("getViewport");
                var width = timeline.right - timeline.left;
                var scaleX = vp.visible.scale * width / vp.width;
                var scaleY = vp.visible.scale * timeline.height / vp.height;
                return new CZ.Viewport.VisibleRegion2d(timeline.left + (timeline.right - timeline.left) / 2.0, timeline.y + timeline.height / 2.0, Math.max(scaleX, scaleY));
            }
        }
        function LoadTimeline(root, rootTimeline) {
            root.beginEdit();
            Convert(root, rootTimeline);
            root.endEdit(true);
        }
        function Load(root, timeline) {
            if(timeline) {
                Prepare(timeline);
                var measureContext = (document.createElement("canvas")).getContext('2d');
                LayoutTimeline(timeline, 0, measureContext);
                Arrange(timeline);
                LoadTimeline(root, timeline);
            }
        }
        Layout.Load = Load;
        function generateLayout(tmd, tsg) {
            try  {
                if(!tmd.AspectRatio) {
                    tmd.height = tsg.height;
                }
                var root = new CZ.VCContent.CanvasRootElement(tsg.vc, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                Load(root, tmd);
                return root.children[0];
            } catch (msg) {
                console.log("exception in [nikita's layout]: " + msg);
            }
        }
        function convertRelativeToAbsoluteCoords(el, delta) {
            if(!delta) {
                return;
            }
            if(typeof el.y !== 'undefined') {
                el.y += delta;
                el.newY += delta;
            }
            if(typeof el.baseline !== 'undefined') {
                el.baseline += delta;
                el.newBaseline += delta;
            }
            el.children.forEach(function (child) {
                convertRelativeToAbsoluteCoords(child, delta);
            });
        }
        function shiftAbsoluteCoords(el, delta) {
            if(!delta) {
                return;
            }
            if(typeof el.newY !== 'undefined') {
                el.newY += delta;
            }
            if(typeof el.newBaseline !== 'undefined') {
                el.newBaseline += delta;
            }
            el.children.forEach(function (child) {
                shiftAbsoluteCoords(child, delta);
            });
        }
        function calculateForceOnChildren(tsg) {
            var eps = tsg.height / 10;
            var v = [];
            for(var i = 0, el; i < tsg.children.length; i++) {
                el = tsg.children[i];
                if(el.type && (el.type === "timeline" || el.type === "infodot")) {
                    el.force = 0;
                    v.push(el);
                }
            }
            v.sort(function (el, ael) {
                return el.newY - ael.newY;
            });
            for(var i = 0, el; i < v.length; i++) {
                el = v[i];
                if(el.type && el.type === "timeline") {
                    if(el.delta) {
                        var l = el.x;
                        var r = el.x + el.width;
                        var b = el.y + el.newHeight + eps;
                        for(var j = i + 1; j < v.length; j++) {
                            var ael = v[j];
                            if(ael.x > l && ael.x < r || ael.x + ael.width > l && ael.x + ael.width < r || ael.x + ael.width > l && ael.x + ael.width === 0 && r === 0) {
                                if(ael.y < b) {
                                    ael.force += el.delta;
                                    l = Math.min(l, ael.x);
                                    r = Math.max(r, ael.x + ael.width);
                                    b = ael.y + ael.newHeight + el.delta + eps;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        function animateElement(elem) {
            var duration = CZ.Settings.canvasElementAnimationTime;
            var args = [];
            if(elem.fadeIn == false && typeof elem.animation === 'undefined') {
                elem.height = elem.newHeight;
                elem.y = elem.newY;
                if(elem.baseline) {
                    elem.baseline = elem.newBaseline;
                }
            }
            if(elem.newY != elem.y && !elem.id.match("__header__")) {
                args.push({
                    property: "y",
                    startValue: elem.y,
                    targetValue: elem.newY
                });
            }
            if(elem.newHeight != elem.height && !elem.id.match("__header__")) {
                args.push({
                    property: "height",
                    startValue: elem.height,
                    targetValue: elem.newHeight
                });
            }
            if(elem.opacity != 1 && elem.fadeIn == false) {
                args.push({
                    property: "opacity",
                    startValue: elem.opacity,
                    targetValue: 1
                });
                duration = CZ.Settings.canvasElementFadeInTime;
            }
            if(isLayoutAnimation == false || args.length == 0) {
                duration = 0;
            }
            initializeAnimation(elem, duration, args);
            if(elem.fadeIn == true) {
                for(var i = 0; i < elem.children.length; i++) {
                    if(elem.children[i].fadeIn == true) {
                        animateElement(elem.children[i]);
                    }
                }
            } else {
                for(var i = 0; i < elem.children.length; i++) {
                    animateElement(elem.children[i]);
                }
            }
        }
        function initializeAnimation(elem, duration, args) {
            var startTime = (new Date()).getTime();
            elem.animation = {
                isAnimating: true,
                duration: duration,
                startTime: startTime,
                args: args
            };
            if(typeof Layout.animatingElements[elem.id] === 'undefined') {
                Layout.animatingElements[elem.id] = elem;
                Layout.animatingElements.length++;
            }
            elem.calculateNewFrame = function () {
                var curTime = (new Date()).getTime();
                var t;
                if(elem.animation.duration > 0) {
                    t = Math.min(1.0, (curTime - elem.animation.startTime) / elem.animation.duration);
                } else {
                    t = 1.0;
                }
                t = CZ.ViewportAnimation.animationEase(t);
                for(var i = 0; i < args.length; i++) {
                    if(typeof elem[args[i].property] !== 'undefined') {
                        elem[elem.animation.args[i].property] = elem.animation.args[i].startValue + t * (elem.animation.args[i].targetValue - elem.animation.args[i].startValue);
                    }
                }
                if(t == 1.0) {
                    elem.animation.isAnimating = false;
                    elem.animation.args = [];
                    delete Layout.animatingElements[elem.id];
                    Layout.animatingElements.length--;
                    if(elem.fadeIn == false) {
                        elem.fadeIn = true;
                    }
                    for(var i = 0; i < elem.children.length; i++) {
                        if(typeof elem.children[i].animation === 'undefined') {
                            animateElement(elem.children[i]);
                        }
                    }
                    return;
                }
            };
        }
        function numberWithCommas(n) {
            var parts = n.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
        function merge(src, dest) {
            if(src.id === dest.guid) {
                var srcChildTimelines = (src.timelines instanceof Array) ? src.timelines : [];
                var destChildTimelines = [];
                for(var i = 0; i < dest.children.length; i++) {
                    if(dest.children[i].type && dest.children[i].type === "timeline") {
                        destChildTimelines.push(dest.children[i]);
                    }
                }
                if(srcChildTimelines.length === destChildTimelines.length) {
                    dest.isBuffered = dest.isBuffered || (src.timelines instanceof Array);
                    var origTop = Number.MAX_VALUE;
                    var origBottom = Number.MIN_VALUE;
                    for(var i = 0; i < dest.children.length; i++) {
                        if(dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                            if(dest.children[i].newY < origTop) {
                                origTop = dest.children[i].newY;
                            }
                            if(dest.children[i].newY + dest.children[i].newHeight > origBottom) {
                                origBottom = dest.children[i].newY + dest.children[i].newHeight;
                            }
                        }
                    }
                    dest.delta = 0;
                    for(var i = 0; i < srcChildTimelines.length; i++) {
                        merge(srcChildTimelines[i], destChildTimelines[i]);
                    }
                    var haveChildTimelineExpanded = false;
                    for(var i = 0; i < destChildTimelines.length; i++) {
                        if(destChildTimelines[i].delta) {
                            haveChildTimelineExpanded = true;
                        }
                    }
                    if(haveChildTimelineExpanded) {
                        for(var i = 0; i < destChildTimelines.length; i++) {
                            if(destChildTimelines[i].delta) {
                                destChildTimelines[i].newHeight += destChildTimelines[i].delta;
                            }
                        }
                        calculateForceOnChildren(dest);
                        for(var i = 0; i < dest.children.length; i++) {
                            if(dest.children[i].force) {
                                shiftAbsoluteCoords(dest.children[i], dest.children[i].force);
                            }
                        }
                        var top = Number.MAX_VALUE;
                        var bottom = Number.MIN_VALUE;
                        var bottomElementName = "";
                        for(var i = 0; i < dest.children.length; i++) {
                            if(dest.children[i].type && (dest.children[i].type === "timeline" || dest.children[i].type === "infodot")) {
                                if(dest.children[i].newY < top) {
                                    top = dest.children[i].newY;
                                }
                                if(dest.children[i].newY + dest.children[i].newHeight > bottom) {
                                    bottom = dest.children[i].newY + dest.children[i].newHeight;
                                    bottomElementName = dest.children[i].title;
                                }
                            }
                        }
                        dest.delta = Math.max(0, (bottom - top) - (origBottom - origTop));
                        dest.titleObject.newY += dest.delta;
                        dest.titleObject.newBaseline += dest.delta;
                        dest.titleObject.opacity = 0;
                        dest.titleObject.fadeIn = false;
                        delete dest.titleObject.animation;
                        if(bottom > dest.titleObject.newY) {
                            var msg = bottomElementName + " EXCEEDS " + dest.title + ".\n" + "bottom: " + numberWithCommas(bottom) + "\n" + "   top: " + numberWithCommas(dest.titleObject.newY) + "\n";
                            console.log(msg);
                        }
                        for(var i = 1; i < dest.children.length; i++) {
                            var el = dest.children[i];
                            for(var j = 1; j < dest.children.length; j++) {
                                var ael = dest.children[j];
                                if(el.id !== ael.id) {
                                    if(!(ael.x <= el.x && ael.x + ael.width <= el.x || ael.x >= el.x + el.width && ael.x + ael.width >= el.x + el.width || ael.newY <= el.newY && ael.newY + ael.newHeight <= el.newY || ael.newY >= el.newY + el.newHeight && ael.newY + ael.newHeight >= el.newY + el.newHeight)) {
                                        var msg = el.title + " OVERLAPS " + ael.title + ".\n";
                                        console.log(msg);
                                    }
                                }
                            }
                        }
                    }
                } else if(srcChildTimelines.length > 0 && destChildTimelines.length === 0) {
                    var t = generateLayout(src, dest);
                    var margin = Math.min(t.width, t.newHeight) * CZ.Settings.timelineHeaderMargin;
                    dest.delta = Math.max(0, t.newHeight - dest.newHeight);
                    dest.children.splice(0);
                    for(var i = 0; i < t.children.length; i++) {
                        dest.children.push(t.children[i]);
                    }
                    dest.titleObject = dest.children[0];
                    dest.isBuffered = dest.isBuffered || (src.timelines instanceof Array);
                    for(var i = 0; i < dest.children.length; i++) {
                        convertRelativeToAbsoluteCoords(dest.children[i], dest.newY);
                    }
                } else {
                    dest.delta = 0;
                }
            } else {
                throw "error: Cannot merge timelines. Src and dest node ids differ.";
            }
        }
        function Merge(src, dest) {
            if(typeof CZ.Authoring !== 'undefined' && CZ.Authoring.isActive) {
                return;
            }
            if(src && dest) {
                if(dest.id === "__root__") {
                    src.AspectRatio = 10;
                    var t = generateLayout(src, dest);
                    convertRelativeToAbsoluteCoords(t, 0);
                    dest.children.push(t);
                    animateElement(dest);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                } else {
                    merge(src, dest);
                    dest.newHeight += dest.delta;
                    animateElement(dest);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            }
        }
        Layout.Merge = Merge;
    })(CZ.Layout || (CZ.Layout = {}));
    var Layout = CZ.Layout;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (ViewportController) {
        function ViewportController2(setVisible, getViewport, gesturesSource) {
            this.activeAnimation;
            this.FPS;
            this.maximumPermitedScale;
            this.leftPermitedBound;
            this.rightPermitedBound;
            this.topPermitedBound;
            this.bottomPermitedBound;
            this.effectiveExplorationZoomConstraint = undefined;
            if(!(window).requestAnimFrame) {
                (window).requestAnimFrame = function (callback) {
                    window.setTimeout(callback, 1000 / CZ.Settings.targetFps);
                };
            }
            this.viewportWidth;
            this.viewportHeight;
            this.setVisible = setVisible;
            this.getViewport = getViewport;
            var self = this;
            this.estimatedViewport = undefined;
            this.recentViewport = undefined;
            this.onAnimationComplete = [];
            this.onAnimationUpdated = [];
            this.onAnimationStarted = [];
            function PanViewport(viewport, panGesture) {
                var virtualOffset = viewport.vectorScreenToVirtual(panGesture.xOffset, panGesture.yOffset);
                var oldVisible = viewport.visible;
                viewport.visible.centerX = oldVisible.centerX - virtualOffset.x;
                viewport.visible.centerY = oldVisible.centerY - virtualOffset.y;
            }
            function ZoomViewport(viewport, zoomGesture) {
                var oldVisible = viewport.visible;
                var x = zoomGesture.xOrigin + (viewport.width / 2.0 - zoomGesture.xOrigin) * zoomGesture.scaleFactor;
                var y = zoomGesture.yOrigin + (viewport.height / 2.0 - zoomGesture.yOrigin) * zoomGesture.scaleFactor;
                var newCenter = viewport.pointScreenToVirtual(x, y);
                viewport.visible.centerX = newCenter.x;
                viewport.visible.centerY = newCenter.y;
                viewport.visible.scale = oldVisible.scale * zoomGesture.scaleFactor;
            }
            function calculateTargetViewport(latestViewport, gesture, previouslyEstimatedViewport) {
                var latestVisible = latestViewport.visible;
                var initialViewport;
                if(gesture.Type == "Zoom") {
                    if(gesture.Source == "Touch") {
                        if(previouslyEstimatedViewport) {
                            initialViewport = previouslyEstimatedViewport;
                        } else {
                            initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                        }
                    } else {
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }
                    ZoomViewport(initialViewport, gesture);
                } else {
                    if(previouslyEstimatedViewport) {
                        initialViewport = previouslyEstimatedViewport;
                    } else {
                        initialViewport = new CZ.Viewport.Viewport2d(latestViewport.aspectRatio, latestViewport.width, latestViewport.height, new CZ.Viewport.VisibleRegion2d(latestVisible.centerX, latestVisible.centerY, latestVisible.scale));
                    }
                    PanViewport(initialViewport, gesture);
                }
                return initialViewport;
            }
            this.saveScreenParameters = function (viewport) {
                self.viewportWidth = viewport.width;
                self.viewportHeight = viewport.height;
            };
            this.coerceVisible = function (vp, gesture) {
                this.coerceVisibleInnerZoom(vp, gesture);
                this.coerceVisibleOuterZoom(vp, gesture);
                this.coerceVisibleHorizontalBound(vp);
                this.coerceVisibleVerticalBound(vp);
            };
            this.coerceVisibleOuterZoom = function (vp, gesture) {
                if(gesture.Type === "Zoom") {
                    var visible = vp.visible;
                    if(typeof CZ.Common.maxPermitedScale != 'undefined' && CZ.Common.maxPermitedScale) {
                        if(visible.scale > CZ.Common.maxPermitedScale) {
                            gesture.scaleFactor = CZ.Common.maxPermitedScale / visible.scale;
                            ZoomViewport(vp, gesture);
                        }
                    }
                }
            };
            this.coerceVisibleHorizontalBound = function (vp) {
                var visible = vp.visible;
                if(CZ.Settings.maxPermitedTimeRange) {
                    if(visible.centerX > CZ.Settings.maxPermitedTimeRange.right) {
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.right;
                    } else if(visible.centerX < CZ.Settings.maxPermitedTimeRange.left) {
                        visible.centerX = CZ.Settings.maxPermitedTimeRange.left;
                    }
                }
            };
            this.coerceVisibleVerticalBound = function (vp) {
                var visible = vp.visible;
                if(CZ.Common.maxPermitedVerticalRange) {
                    if(visible.centerY > CZ.Common.maxPermitedVerticalRange.bottom) {
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.bottom;
                    } else if(visible.centerY < CZ.Common.maxPermitedVerticalRange.top) {
                        visible.centerY = CZ.Common.maxPermitedVerticalRange.top;
                    }
                }
            };
            this.coerceVisibleInnerZoom = function (vp, gesture) {
                var visible = vp.visible;
                var x = visible.centerX;
                var scale = visible.scale;
                var constr = undefined;
                if(this.effectiveExplorationZoomConstraint) {
                    constr = this.effectiveExplorationZoomConstraint;
                } else {
                    for(var i = 0; i < CZ.Settings.deeperZoomConstraints.length; i++) {
                        var possibleConstr = CZ.Settings.deeperZoomConstraints[i];
                        if(possibleConstr.left <= x && possibleConstr.right > x) {
                            constr = possibleConstr.scale;
                            break;
                        }
                    }
                }
                if(constr) {
                    if(scale < constr) {
                        visible.scale = constr;
                    }
                }
            };
            self.updateRecentViewport = function () {
                var vp = getViewport();
                var vis = vp.visible;
                self.recentViewport = new CZ.Viewport.Viewport2d(vp.aspectRatio, vp.width, vp.height, new CZ.Viewport.VisibleRegion2d(vis.centerX, vis.centerY, vis.scale));
            };
            var requestTimer = null;
            this.getMissingData = function (vbox, lca) {
                if(typeof CZ.Authoring === 'undefined' || CZ.Authoring.isActive === false) {
                    window.clearTimeout(requestTimer);
                    requestTimer = window.setTimeout(function () {
                        getMissingTimelines(vbox, lca);
                    }, 1000);
                }
            };
            function getMissingTimelines(vbox, lca) {
                CZ.Data.getTimelines({
                    lca: lca.guid,
                    start: vbox.left,
                    end: vbox.right,
                    minspan: CZ.Settings.minTimelineWidth * vbox.scale
                }).then(function (response) {
                    CZ.Layout.Merge(response, lca);
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }
            function getMissingExhibits(vbox, lca, exhibitIds) {
                CZ.Service.postData({
                    ids: exhibitIds
                }).then(function (response) {
                    MergeContentItems(lca, exhibitIds, response.exhibits);
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }
            function extractExhibitIds(timeline) {
                var ids = [];
                if(timeline.exhibits instanceof Array) {
                    timeline.exhibits.forEach(function (childExhibit) {
                        ids.push(childExhibit.id);
                    });
                }
                if(timeline.timelines instanceof Array) {
                    timeline.timelines.forEach(function (childTimeline) {
                        ids = ids.concat(extractExhibitIds(childTimeline));
                    });
                }
                return ids;
            }
            function MergeContentItems(timeline, exhibitIds, exhibits) {
                timeline.children.forEach(function (child) {
                    if(child.type === "infodot") {
                        var idx = exhibitIds.indexOf(child.guid);
                        if(idx !== -1) {
                            child.contentItems = exhibits[idx].contentItems;
                        }
                    }
                });
                timeline.children.forEach(function (child) {
                    if(child.type === "timeline") {
                        MergeContentItems(child, exhibitIds, exhibits);
                    }
                });
            }
            gesturesSource.Subscribe(function (gesture) {
                if(typeof gesture != "undefined" && !CZ.Authoring.isActive) {
                    var isAnimationActive = self.activeAnimation;
                    var oldId = isAnimationActive ? self.activeAnimation.ID : undefined;
                    self.updateRecentViewport();
                    var latestViewport = self.recentViewport;
                    if(gesture.Type == "Pin") {
                        self.stopAnimation();
                        return;
                    }
                    if(gesture.Type == "Pan" || gesture.Type == "Zoom") {
                        var newlyEstimatedViewport = calculateTargetViewport(latestViewport, gesture, self.estimatedViewport);
                        var vbox = CZ.Common.viewportToViewBox(newlyEstimatedViewport);
                        var wnd = new CZ.VCContent.CanvasRectangle(null, null, null, vbox.left, vbox.top, vbox.width, vbox.height, null);
                        if(!self.estimatedViewport) {
                            self.activeAnimation = new CZ.ViewportAnimation.PanZoomAnimation(latestViewport);
                            self.saveScreenParameters(latestViewport);
                        }
                        if(gesture.Type == "Pan") {
                            self.activeAnimation.velocity = CZ.Settings.panSpeedFactor * 0.001;
                        } else {
                            self.activeAnimation.velocity = CZ.Settings.zoomSpeedFactor * 0.0025;
                        }
                        self.activeAnimation.setTargetViewport(newlyEstimatedViewport);
                        self.estimatedViewport = newlyEstimatedViewport;
                    }
                    if(oldId != undefined) {
                        animationUpdated(oldId, self.activeAnimation.ID);
                    } else {
                        AnimationStarted(self.activeAnimation.ID);
                    }
                    if(!isAnimationActive) {
                        self.animationStep(self);
                    }
                }
            });
            self.updateRecentViewport();
            this.saveScreenParameters(self.recentViewport);
            this.stopAnimation = function () {
                self.estimatedViewport = undefined;
                if(self.activeAnimation) {
                    self.activeAnimation.isForciblyStoped = true;
                    self.activeAnimation.isActive = false;
                    animationUpdated(self.activeAnimation.ID, undefined);
                }
            };
            function animationUpdated(oldId, newId) {
                for(var i = 0; i < self.onAnimationUpdated.length; i++) {
                    self.onAnimationUpdated[i](oldId, newId);
                }
            }
            function AnimationStarted(newId) {
                for(var i = 0; i < self.onAnimationStarted.length; i++) {
                    self.onAnimationStarted[i](newId);
                }
            }
            this.animationStep = function (self) {
                if(self.activeAnimation) {
                    if(self.activeAnimation.isActive) {
                        (window).requestAnimFrame(function () {
                            self.animationStep(self);
                        });
                    } else {
                        var stopAnimationID = self.activeAnimation.ID;
                        self.updateRecentViewport();
                        setVisible(new CZ.Viewport.VisibleRegion2d(self.recentViewport.visible.centerX, self.recentViewport.visible.centerY, self.recentViewport.visible.scale));
                        if(!self.activeAnimation.isForciblyStoped) {
                            for(var i = 0; i < self.onAnimationComplete.length; i++) {
                                self.onAnimationComplete[i](stopAnimationID);
                            }
                        }
                        self.activeAnimation = undefined;
                        self.estimatedViewport = undefined;
                        return;
                    }
                    var vp = self.recentViewport;
                    if(self.viewportWidth != vp.width || self.viewportHeight != vp.height) {
                        self.stopAnimation();
                    }
                    var vis = self.activeAnimation.produceNextVisible(vp);
                    setVisible(vis);
                }
                this.frames++;
                this.oneSecondFrames++;
                var e = CZ.Common.vc.virtualCanvas("getLastEvent");
                if(e != null) {
                    CZ.Common.vc.virtualCanvas("mouseMove", e);
                }
            };
            this.frames = 0;
            this.oneSecondFrames = 0;
            window.setInterval(function () {
                self.FPS = self.oneSecondFrames;
                self.oneSecondFrames = 0;
            }, 1000);
            this.PanViewportAccessor = PanViewport;
            this.moveToVisible = function (visible, noAnimation) {
                var currentViewport = getViewport();
                var targetViewport = new CZ.Viewport.Viewport2d(currentViewport.aspectRatio, currentViewport.width, currentViewport.height, visible);
                var vbox = CZ.Common.viewportToViewBox(targetViewport);
                var wnd = new CZ.VCContent.CanvasRectangle(null, null, null, vbox.left, vbox.top, vbox.width, vbox.height, null);
                if(noAnimation) {
                    self.stopAnimation();
                    self.setVisible(visible);
                    return;
                }
                var wasAnimationActive = false;
                var oldId = undefined;
                if(this.activeAnimation) {
                    wasAnimationActive = this.activeAnimation.isActive;
                    oldId = this.activeAnimation.ID;
                }
                self.updateRecentViewport();
                var vp = self.recentViewport;
                this.estimatedViewport = undefined;
                this.activeAnimation = new CZ.ViewportAnimation.EllipticalZoom(vp.visible, visible);
                self.viewportWidth = vp.width;
                self.viewportHeight = vp.height;
                if(!wasAnimationActive) {
                    if(this.activeAnimation.isActive) {
                        AnimationStarted(this.activeAnimation.ID);
                    }
                    setTimeout(function () {
                        return self.animationStep(self);
                    }, 0);
                } else {
                    animationUpdated(oldId, this.activeAnimation.ID);
                }
                return (this.activeAnimation) ? this.activeAnimation.ID : undefined;
            };
        }
        ViewportController.ViewportController2 = ViewportController2;
    })(CZ.ViewportController || (CZ.ViewportController = {}));
    var ViewportController = CZ.ViewportController;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    function Timescale(container) {
        if(!container) {
            throw "Container parameter is undefined!";
        }
        if(container.tagName !== undefined && container.tagName.toLowerCase() === "div") {
            container = $(container);
        } else if(typeof (container) === "string") {
            container = $("#" + container);
            if(container.length === 0 || !container.is("div")) {
                throw "There is no DIV element with such ID.";
            }
        } else if(!(container instanceof jQuery && container.is("div"))) {
            throw "Container parameter is invalid! It should be DIV, or ID of DIV, or jQuery instance of DIV.";
        }
        var mouse_clicked = false;
        var mouse_hovered = false;
        container.mouseup(function (e) {
            mouse_clicked = false;
        });
        container.mousedown(function (e) {
            mouse_clicked = true;
        });
        container.mousemove(function (e) {
            mouse_hovered = true;
            mouseMove(e);
        });
        container.mouseleave(function (e) {
            mouse_hovered = false;
            mouse_clicked = false;
        });
        var that = this;
        var _container = container;
        var _range = {
            min: 0,
            max: 1
        };
        var _ticks = [];
        var _ticksInfo = [];
        var _mode = "cosmos";
        var _position = "top";
        var _deltaRange;
        var _size;
        var _width;
        var _height;
        var _canvasHeight;
        var _markerPosition;
        var _tickSources = {
            "cosmos": new CZ.CosmosTickSource(),
            "calendar": new CZ.CalendarTickSource(),
            "date": new CZ.DateTickSource()
        };
        var isHorizontal = (_position === "bottom" || _position === "top");
        var canvas = $("<canvas></canvas>");
        var labelsDiv = $("<div></div>");
        var marker = $("<div id='timescale_marker' class='cz-timescale-marker'></div>");
        var markerText = $("<div id='marker-text'></div>");
        var markertriangle = $("<div id='marker-triangle'></div>");
        var canvasSize = CZ.Settings.tickLength + CZ.Settings.timescaleThickness;
        var text_size;
        var fontSize;
        var strokeStyle;
        var ctx;
        init();
        Object.defineProperties(this, {
            position: {
                configurable: false,
                get: function () {
                    return _position;
                },
                set: function (value) {
                    _position = value;
                    isHorizontal = (_position === "bottom" || _position === "top");
                }
            },
            mode: {
                configurable: false,
                get: function () {
                    return _mode;
                },
                set: function (value) {
                    _tickSources[_mode].hideDivs();
                    _mode = value;
                }
            },
            container: {
                configurable: false,
                get: function () {
                    return _container;
                }
            },
            range: {
                configurable: false,
                get: function () {
                    return _range;
                }
            },
            ticks: {
                configurable: false,
                get: function () {
                    return _ticks;
                }
            },
            ticksInfo: {
                configurable: false,
                get: function () {
                    return _ticksInfo;
                }
            },
            tickSource: {
                configurable: false,
                get: function () {
                    return _tickSources[_mode];
                }
            },
            markerPosition: {
                configurable: false,
                get: function () {
                    return _markerPosition;
                }
            }
        });
        function init() {
            _container.addClass("cz-timescale");
            _container.addClass("unselectable");
            marker.addClass("cz-timescale-marker");
            markertriangle.addClass("cz-timescale-marker-triangle");
            labelsDiv.addClass("cz-timescale-labels-container");
            marker[0].appendChild(markerText[0]);
            marker[0].appendChild(markertriangle[0]);
            _container[0].appendChild(labelsDiv[0]);
            _container[0].appendChild(canvas[0]);
            _container[0].appendChild(marker[0]);
            (canvas[0]).height = canvasSize;
            text_size = -1;
            strokeStyle = _container ? _container.css("color") : "Black";
            ctx = (canvas[0]).getContext("2d");
            fontSize = 45;
            if(_container.currentStyle) {
                fontSize = _container.currentStyle["font-size"];
                ctx.font = fontSize + _container.currentStyle["font-family"];
            } else if(document.defaultView && (document.defaultView).getComputedStyle) {
                fontSize = (document.defaultView).getComputedStyle(_container[0], null).getPropertyValue("font-size");
                ctx.font = fontSize + (document.defaultView).getComputedStyle(_container[0], null).getPropertyValue("font-family");
            } else if(_container.style) {
                fontSize = _container.style["font-size"];
                ctx.font = fontSize + _container.style["font-family"];
            }
        }
        function updateSize() {
            var prevSize = _size;
            _width = _container.outerWidth(true);
            _height = _container.outerHeight(true);
            if(isHorizontal) {
                _size = _width;
                if(_size != prevSize) {
                    (canvas[0]).width = _size;
                    labelsDiv.css("width", _size);
                }
            } else {
                _size = _height;
                if(_size != prevSize) {
                    (canvas[0]).height = _size;
                    labelsDiv.css("height", _size);
                }
            }
            _deltaRange = (_size - 1) / (_range.max - _range.min);
            _canvasHeight = (canvas[0]).height;
            if(isHorizontal) {
                text_size = (_ticksInfo[0] && _ticksInfo[0].height !== text_size) ? _ticksInfo[0].height : 0;
                if(text_size !== 0) {
                    labelsDiv.css("height", text_size);
                    (canvas[0]).height = canvasSize;
                }
            } else {
                text_size = (_ticksInfo[0] && _ticksInfo[0].width !== text_size) ? _ticksInfo[0].width : 0;
                if(text_size !== 0) {
                    labelsDiv.css("width", text_size);
                    (canvas[0]).width = canvasSize;
                    var textOffset = 0;
                    _width = text_size + canvasSize + textOffset;
                    _container.css("width", _width);
                }
            }
        }
        function setMode() {
            var beta;
            if(_range.min <= -10000) {
                that.mode = "cosmos";
            } else {
                beta = Math.floor(Math.log(_range.max - _range.min) * (1 / Math.log(10)));
                if(beta < 0) {
                    that.mode = "date";
                } else {
                    that.mode = "calendar";
                }
            }
        }
        function getTicksInfo() {
            var len = _ticks.length;
            var size;
            var width;
            var height;
            var h = isHorizontal ? _canvasHeight : 0;
            var tick;
            _ticksInfo = new Array(len);
            for(var i = 0; i < len; i++) {
                tick = _ticks[i];
                if(tick.label) {
                    size = tick.label._size;
                    width = size.width;
                    height = size.height;
                    if(!width) {
                        width = ctx.measureText(tick.position).width * 1.5;
                    }
                    if(!height) {
                        height = (isHorizontal ? h : parseFloat(fontSize)) + 8;
                    }
                    _ticksInfo[i] = {
                        position: that.getCoordinateFromTick(tick.position),
                        width: width,
                        height: height,
                        hasLabel: true
                    };
                } else {
                    _ticksInfo[i] = {
                        position: that.getCoordinateFromTick(tick.position),
                        width: 0,
                        height: 0,
                        hasLabel: false
                    };
                }
            }
        }
        function addNewLabels() {
            var label;
            var labelDiv;
            for(var i = 0, len = _ticks.length; i < len; i++) {
                label = _ticks[i].label;
                if(label && !label.hasClass('cz-timescale-label')) {
                    labelDiv = label[0];
                    labelsDiv[0].appendChild(labelDiv);
                    label.addClass('cz-timescale-label');
                    label._size = {
                        width: labelDiv.offsetWidth,
                        height: labelDiv.offsetHeight
                    };
                }
            }
        }
        function checkLabelsArrangement() {
            var delta;
            var deltaSize;
            var len = _ticks.length - 1;
            if(len == -1) {
                return false;
            }
            for(var i1 = 0, i2 = 1; i2 < len; i1 = i2 , i2++) {
                while(i2 < len + 1 && !_ticksInfo[i2].hasLabel) {
                    i2++;
                }
                if(i2 > len) {
                    break;
                }
                if(_ticksInfo[i1].hasLabel) {
                    delta = Math.abs(_ticksInfo[i2].position - _ticksInfo[i1].position);
                    if(delta < CZ.Settings.minTickSpace) {
                        return true;
                    }
                    if(isHorizontal) {
                        deltaSize = (_ticksInfo[i1].width + _ticksInfo[i2].width) / 2;
                        if(i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].width / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].width / 2;
                        } else if(i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].width / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].width / 2;
                        }
                    } else {
                        deltaSize = (_ticksInfo[i1].height + _ticksInfo[i2].height) / 2;
                        if(i1 === 0 && (_ticksInfo[i1].position - _ticksInfo[i1].height / 2 < 0)) {
                            deltaSize -= _ticksInfo[i1].height / 2;
                        } else if(i2 == len - 1 && (_ticksInfo[i2].position - _ticksInfo[i2].height / 2 > _size)) {
                            deltaSize -= _ticksInfo[i2].height / 2;
                        }
                    }
                    if(delta - deltaSize < CZ.Settings.minLabelSpace) {
                        return true;
                    }
                }
            }
            return false;
        }
        function updateMajorTicks() {
            var i;
            _ticks = _tickSources[_mode].getTicks(_range);
            addNewLabels();
            getTicksInfo();
            if(checkLabelsArrangement()) {
                for(i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].decreaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if(!checkLabelsArrangement()) {
                        break;
                    }
                }
            } else {
                for(i = 0; i < CZ.Settings.maxTickArrangeIterations; ++i) {
                    _ticks = _tickSources[_mode].increaseTickCount();
                    addNewLabels();
                    getTicksInfo();
                    if(checkLabelsArrangement()) {
                        _ticks = _tickSources[_mode].decreaseTickCount();
                        getTicksInfo();
                        addNewLabels();
                        break;
                    }
                }
            }
        }
        function renderBaseLine() {
            if(isHorizontal) {
                if(_position == "bottom") {
                    ctx.fillRect(0, 0, _size, CZ.Settings.timescaleThickness);
                } else {
                    ctx.fillRect(0, CZ.Settings.tickLength, _size, CZ.Settings.timescaleThickness);
                }
            } else {
                if(_position == "right") {
                    ctx.fillRect(0, 0, CZ.Settings.timescaleThickness, _size);
                } else {
                    ctx.fillRect(CZ.Settings.tickLength, 0, CZ.Settings.timescaleThickness, _size);
                }
            }
        }
        function renderMajorTicks() {
            var x;
            var shift;
            ctx.beginPath();
            for(var i = 0, len = _ticks.length; i < len; i++) {
                x = _ticksInfo[i].position;
                if(isHorizontal) {
                    shift = _ticksInfo[i].width / 2;
                    if(i === 0 && x < shift) {
                        shift = 0;
                    } else if(i == len - 1 && x + shift > _size) {
                        shift *= 2;
                    }
                    ctx.moveTo(x, 1);
                    ctx.lineTo(x, 1 + CZ.Settings.tickLength);
                    if(_ticks[i].label) {
                        _ticks[i].label.css("left", x - shift);
                    }
                } else {
                    x = (_size - 1) - x;
                    shift = _ticksInfo[i].height / 2;
                    if(i === 0 && x + shift > _size) {
                        shift *= 2;
                    } else if(i == len - 1 && x < shift) {
                        shift = 0;
                    }
                    ctx.moveTo(1, x);
                    ctx.lineTo(1 + CZ.Settings.tickLength, x);
                    if(_ticks[i].label) {
                        _ticks[i].label.css("top", x - shift);
                        if(_position == "left") {
                            _ticks[i].label.css("left", text_size - (this.rotateLabels ? _ticksInfo[i].height : _ticksInfo[i].width));
                        }
                    }
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
        function renderSmallTicks() {
            var minDelta;
            var i;
            var len;
            var smallTicks = _tickSources[_mode].getSmallTicks(_ticks);
            var x;
            ctx.beginPath();
            if(smallTicks && smallTicks.length > 0) {
                minDelta = Math.abs(that.getCoordinateFromTick(smallTicks[1]) - that.getCoordinateFromTick(smallTicks[0]));
                len = smallTicks.length;
                for(i = 1; i < len - 1; i++) {
                    minDelta = Math.min(minDelta, Math.abs(that.getCoordinateFromTick(smallTicks[i + 1]) - that.getCoordinateFromTick(smallTicks[i])));
                }
                if(minDelta >= CZ.Settings.minSmallTickSpace) {
                    switch(_position) {
                        case "bottom":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, 1);
                                ctx.lineTo(x, 1 + CZ.Settings.smallTickLength);
                            }
                            break;
                        case "top":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(x, CZ.Settings.tickLength - CZ.Settings.smallTickLength);
                                ctx.lineTo(x, 1 + CZ.Settings.tickLength);
                            }
                            break;
                        case "left":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(CZ.Settings.tickLength - CZ.Settings.smallTickLength, _size - x - 1);
                                ctx.lineTo(CZ.Settings.tickLength, _size - x - 1);
                            }
                            break;
                        case "right":
                            for(i = 0; i < len; i++) {
                                x = that.getCoordinateFromTick(smallTicks[i]);
                                ctx.moveTo(1, _size - x - 1);
                                ctx.lineTo(1 + CZ.Settings.smallTickLength, _size - x - 1);
                            }
                            break;
                    }
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
        function mouseMove(e) {
            var point = CZ.Common.getXBrowserMouseOrigin(container, e);
            var k = (_range.max - _range.min) / _width;
            var time = _range.max - k * (_width - point.x);
            that.setTimeMarker(time);
        }
        this.setTimeMarker = function (time, vcGesture) {
            if (typeof vcGesture === "undefined") { vcGesture = false; }
            if((!mouse_clicked) && ((!vcGesture) || ((vcGesture) && (!mouse_hovered)))) {
                if(time > CZ.Settings.maxPermitedTimeRange.right) {
                    time = CZ.Settings.maxPermitedTimeRange.right;
                }
                if(time < CZ.Settings.maxPermitedTimeRange.left) {
                    time = CZ.Settings.maxPermitedTimeRange.left;
                }
                var k = (_range.max - _range.min) / _width;
                var point = (time - _range.max) / k + _width;
                var text = _tickSources[_mode].getMarkerLabel(_range, time);
                _markerPosition = point;
                markerText.text(text);
                marker.css("left", point - marker.width() / 2);
            }
        };
        function render() {
            setMode();
            updateMajorTicks();
            updateSize();
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;
            ctx.lineWidth = CZ.Settings.timescaleThickness;
            if(isHorizontal) {
                ctx.clearRect(0, 0, _size, canvasSize);
            } else {
                ctx.clearRect(0, 0, canvasSize, _size);
            }
            renderBaseLine();
            renderMajorTicks();
            renderSmallTicks();
        }
        this.getCoordinateFromTick = function (x) {
            var delta = _deltaRange;
            var k = _size / (_range.max - _range.min);
            var log10 = 1 / Math.log(10);
            var x1 = k * (x - _range.min);
            var beta;
            var firstYear;
            if(_range.min >= -10000) {
                beta = Math.log(_range.max - _range.min) * log10;
                firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
                if(beta >= 0) {
                    x1 += k * firstYear;
                }
            }
            if(isFinite(delta)) {
                return x1;
            } else {
                return _size / 2;
            }
        };
        this.update = function (range) {
            _range = range;
            render();
        };
        this.destroy = function () {
            _container[0].innerHTML = "";
            _container.removeClass("cz-timescale");
            _container.removeClass("unselectable");
        };
        this.remove = function () {
            var parent = _container[0].parentElement;
            if(parent) {
                parent.removeChild(_container[0]);
            }
            this.destroy();
        };
    }
    CZ.Timescale = Timescale;
    ;
    function TickSource() {
        this.delta , this.beta;
        this.range = {
            min: -1,
            max: 0
        };
        this.log10 = 1 / Math.log(10);
        this.startDate = null , this.endDate = null , this.firstYear = null;
        this.regime = "";
        this.level = 1;
        this.present;
        var divPool = [];
        var isUsedPool = [];
        var inners = [];
        var styles = [];
        var len = 0;
        this.start;
        this.finish;
        this.width = 900;
        this.getDiv = function (x) {
            var inner = this.getLabel(x);
            var i = inners.indexOf(inner);
            if(i != -1) {
                isUsedPool[i] = true;
                styles[i].display = "block";
                return divPool[i];
            } else {
                var i = isUsedPool.indexOf(false);
                if(i != -1) {
                    isUsedPool[i] = true;
                    styles[i].display = "block";
                    inners[i] = inner;
                    var div = divPool[i][0];
                    div.innerHTML = inner;
                    divPool[i]._size = {
                        width: div.offsetWidth,
                        height: div.offsetHeight
                    };
                    return divPool[i];
                } else {
                    var div = $("<div>" + inner + "</div>");
                    isUsedPool[len] = true;
                    divPool[len] = div;
                    inners[len] = inner;
                    styles[len] = div[0].style;
                    div._size = undefined;
                    len++;
                    return div;
                }
            }
        };
        this.refreshDivs = function () {
            for(var i = 0; i < len; i++) {
                if(isUsedPool[i]) {
                    isUsedPool[i] = false;
                } else {
                    styles[i].display = "none";
                }
            }
        };
        this.hideDivs = function () {
            for(var i = 0; i < len; i++) {
                styles[i].display = "none";
            }
        };
        this.getTicks = function (range) {
            this.getRegime(range.min, range.max);
            return this.createTicks(range);
        };
        this.getLabel = function (x) {
            return x;
        };
        this.getRegime = function (l, r) {
        };
        this.createTicks = function (range) {
        };
        this.getSmallTicks = function (ticks) {
            if(ticks.length !== 0) {
                return this.createSmallTicks(ticks);
            }
        };
        this.createSmallTicks = function (ticks) {
        };
        this.decreaseTickCount = function () {
            if(this.delta == 1) {
                this.delta = 2;
            } else if(this.delta == 2) {
                this.delta = 5;
            } else if(this.delta == 5) {
                this.delta = 1;
                this.beta++;
            }
            return this.createTicks(this.range);
        };
        this.increaseTickCount = function () {
            if(this.delta == 1) {
                this.delta = 5;
                this.beta--;
            } else if(this.delta == 2) {
                this.delta = 1;
            } else if(this.delta == 5) {
                this.delta = 2;
            }
            return this.createTicks(this.range);
        };
        this.round = function (x, n) {
            var pow = 1;
            var i;
            if(n <= 0) {
                n = Math.max(0, Math.min(-n, 15));
                pow = 1;
                for(i = 0; i > n; i--) {
                    pow /= 10;
                }
                return Math.round(x * pow) / pow;
            } else {
                pow = 1;
                for(i = 0; i < n; i++) {
                    pow *= 10;
                }
                var val = pow * Math.round(x / pow);
                return val;
            }
        };
        this.getMarkerLabel = function (range, time) {
            return time;
        };
    }
    CZ.TickSource = TickSource;
    ;
    function CosmosTickSource() {
        this.base = CZ.TickSource;
        this.base();
        var that = this;
        this.getLabel = function (x) {
            var text;
            var n = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4);
            text = Math.abs(x) / this.level;
            if(n < 0) {
                text = (new Number(text)).toFixed(-n);
            }
            text += " " + (x < 0 ? this.regime : String(this.regime).charAt(0));
            return text;
        };
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            if(this.range.min < CZ.Settings.maxPermitedTimeRange.left) {
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            }
            if(this.range.max > CZ.Settings.maxPermitedTimeRange.right) {
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            var localPresent = CZ.Dates.getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if(this.range.min <= -10000000000) {
                this.regime = "Ga";
                this.level = 1000000000;
                if(this.beta < 7) {
                    this.regime = "Ma";
                    this.level = 1000000;
                }
            } else if(this.range.min <= -10000000) {
                this.regime = "Ma";
                this.level = 1000000;
            } else if(this.range.min <= -10000) {
                this.regime = "ka";
                this.level = 1000;
            }
        };
        this.createTicks = function (range) {
            var ticks = new Array();
            if(this.regime == "Ga" && this.beta < 7) {
                this.beta = 7;
            } else if(this.regime == "Ma" && this.beta < 2) {
                this.beta = 2;
            } else if(this.regime == "ka" && this.beta < -1) {
                this.beta = -1;
            }
            var dx = this.delta * Math.pow(10, this.beta);
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;
            var num = 0;
            var x0 = min * dx;
            if(dx == 2) {
                count++;
            }
            for(var i = 0; i < count + 1; i++) {
                var tick_position = this.round(x0 + i * dx, this.beta);
                if(tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = {
                        position: tick_position,
                        label: this.getDiv(tick_position)
                    };
                    num++;
                }
            }
            this.refreshDivs();
            return ticks;
        };
        this.createSmallTicks = function (ticks) {
            var minors = new Array();
            var n = 4;
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);
            if(k * step < CZ.Settings.minSmallTickSpace) {
                return null;
            }
            var tick = ticks[0].position - step;
            while(tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }
            for(var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                for(var k = 1; k <= n; k++) {
                    tick = t + step * k;
                    minors.push(tick);
                }
            }
            tick = ticks[ticks.length - 1].position + step;
            while(tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };
        this.getMarkerLabel = function (range, time) {
            var labelText;
            this.getRegime(range.min, range.max);
            var numOfDigits = Math.max(Math.floor(Math.log(this.delta * Math.pow(10, this.beta) / this.level) * this.log10), -4) - 1;
            labelText = (Math.abs(time / this.level)).toFixed(Math.abs(numOfDigits));
            var localPresent = CZ.Dates.getPresent();
            var presentDate = CZ.Dates.getCoordinateFromYMD(localPresent.presentYear, localPresent.presentMonth, localPresent.presentDay);
            if(time == presentDate) {
                if(this.regime !== "ka") {
                    labelText = 0;
                } else {
                    labelText = 2;
                }
            }
            labelText += " " + (time < 0 ? this.regime : String(this.regime).charAt(0));
            return labelText;
        };
        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if(width < 0) {
                width = viewport.width;
            }
            var scaleX = scale * element.width / width;
            var height = viewport.height - margin;
            if(height < 0) {
                height = viewport.height;
            }
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.max(scaleX, scaleY)
            };
            return vs;
        };
    }
    CZ.CosmosTickSource = CosmosTickSource;
    ;
    CZ.CosmosTickSource.prototype = new CZ.TickSource();
    function CalendarTickSource() {
        this.base = CZ.TickSource;
        this.base();
        this.getLabel = function (x) {
            var text;
            var DMY = CZ.Dates.getYMDFromCoordinate(x);
            var year = DMY.year;
            if(year <= 0) {
                text = -year + " BCE";
            } else {
                text = year + " CE";
            }
            return text;
        };
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            if(this.range.min < CZ.Settings.maxPermitedTimeRange.left) {
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            }
            if(this.range.max > CZ.Settings.maxPermitedTimeRange.right) {
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            var localPresent = CZ.Dates.getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
            this.range.max -= this.firstYear;
            this.range.min -= this.firstYear;
            this.startDate = this.present;
            this.endDate = this.present;
            if(this.range.min < 0) {
                this.startDate = CZ.Dates.getYMDFromCoordinate(this.range.min);
            }
            if(this.range.max < 0) {
                this.endDate = CZ.Dates.getYMDFromCoordinate(this.range.max);
            }
            this.delta = 1;
            this.beta = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            this.regime = "BCE/CE";
            this.level = 1;
        };
        this.createTicks = function (range) {
            var ticks = new Array();
            if(this.beta < 0) {
                this.beta = 0;
            }
            var dx = this.delta * Math.pow(10, this.beta);
            var min = Math.floor(this.range.min / dx);
            var max = Math.floor(this.range.max / dx);
            var count = max - min + 1;
            var num = 0;
            var x0 = min * dx;
            if(dx == 2) {
                count++;
            }
            for(var i = 0; i < count + 1; i++) {
                var tick_position = CZ.Dates.getCoordinateFromYMD(x0 + i * dx, 0, 1);
                if(tick_position === 0 && dx > 1) {
                    tick_position += 1;
                }
                if(tick_position >= this.range.min && tick_position <= this.range.max && tick_position != ticks[ticks.length - 1]) {
                    ticks[num] = {
                        position: tick_position,
                        label: this.getDiv(tick_position)
                    };
                    num++;
                }
            }
            this.refreshDivs();
            return ticks;
        };
        this.createSmallTicks = function (ticks) {
            var minors = new Array();
            var n = 4;
            var beta1 = Math.floor(Math.log(this.range.max - this.range.min) * this.log10);
            if(beta1 <= 0.3) {
                n = 3;
            }
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var l = ticks.length > 1 ? ticks[1].position - ticks[0].position : 0;
            var step = l / (n + 1);
            if(k * step < CZ.Settings.minSmallTickSpace) {
                return null;
            }
            var tick = ticks[0].position - step;
            while(tick > this.range.min) {
                minors.push(tick);
                tick -= step;
            }
            for(var i = 0; i < ticks.length - 1; i++) {
                var t = ticks[i].position;
                if(step > 1e-10 + 1 / (n + 1) && Math.abs(t - 1.0) < 1e-10) {
                    t = 0;
                }
                for(var k = 1; k <= n; k++) {
                    tick = t + step * k;
                    minors.push(tick);
                }
            }
            tick = ticks[ticks.length - 1].position + step;
            while(tick < this.range.max) {
                minors.push(tick);
                tick += step;
            }
            return minors;
        };
        this.getMarkerLabel = function (range, time) {
            this.getRegime(range.min, range.max);
            var labelText = parseFloat(new Number(time - this.firstYear).toFixed(2));
            labelText += (labelText > 0 ? -0.5 : -1.5);
            labelText = Math.round(labelText);
            if(labelText < 0) {
                labelText = -labelText;
            } else if(labelText == 0) {
                labelText = 1;
            }
            if(time < this.firstYear + 1) {
                labelText += " " + "BCE";
            } else {
                labelText += " " + "CE";
            }
            return labelText;
        };
        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if(width < 0) {
                width = viewport.width;
            }
            var scaleX = scale * element.width / width;
            var height = viewport.height - margin;
            if(height < 0) {
                height = viewport.height;
            }
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: scaleX
            };
            return vs;
        };
    }
    CZ.CalendarTickSource = CalendarTickSource;
    ;
    CZ.CalendarTickSource.prototype = new CZ.TickSource();
    function DateTickSource() {
        this.base = CZ.TickSource;
        this.base();
        var year, month, day;
        var tempDays = 0;
        this.getRegime = function (l, r) {
            if(l < r) {
                this.range.min = l;
                this.range.max = r;
            } else {
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            if(this.range.min < CZ.Settings.maxPermitedTimeRange.left) {
                this.range.min = CZ.Settings.maxPermitedTimeRange.left;
            }
            if(this.range.max > CZ.Settings.maxPermitedTimeRange.right) {
                this.range.max = CZ.Settings.maxPermitedTimeRange.right;
            }
            var localPresent = CZ.Dates.getPresent();
            this.present = {
                year: localPresent.getUTCFullYear(),
                month: localPresent.getUTCMonth(),
                day: localPresent.getUTCDate()
            };
            this.firstYear = CZ.Dates.getCoordinateFromYMD(0, 0, 1);
            this.startDate = CZ.Dates.getYMDFromCoordinate(this.range.min);
            this.endDate = CZ.Dates.getYMDFromCoordinate(this.range.max);
            this.delta = 1;
            this.beta = Math.log(this.range.max - this.range.min) * this.log10;
            if(this.beta >= -0.2) {
                this.regime = "Quarters_Month";
            }
            if(this.beta <= -0.2 && this.beta >= -0.8) {
                this.regime = "Month_Weeks";
            }
            if(this.beta <= -0.8 && this.beta >= -1.4) {
                this.regime = "Weeks_Days";
            }
            if(this.beta <= -1.4) {
                this.regime = "Days_Quarters";
            }
            this.level = 1;
        };
        this.getLabel = function (x) {
            var text = CZ.Dates.months[month];
            var year_temp = year;
            if(year == 0) {
                year_temp--;
            }
            if(text == "January") {
                text += " " + year_temp;
            }
            if(tempDays == 1) {
                text = day + " " + CZ.Dates.months[month];
            }
            if((this.regime == "Weeks_Days") && (day == 3)) {
                text += ", " + year_temp;
            }
            if((this.regime == "Days_Quarters") && (day == 1)) {
                text += ", " + year_temp;
            }
            return text;
        };
        this.getMinTicks = function () {
            this.getRegime(this.range.min, this.range.max);
            return this.createTicks(this.range);
        };
        this.createTicks = function (range) {
            tempDays = 0;
            var ticks = new Array();
            var num = 0;
            var countMonths = 0;
            var countDays = 0;
            var tempYear = this.startDate.year;
            var tempMonth = this.startDate.month;
            while(tempYear < this.endDate.year || (tempYear == this.endDate.year && tempMonth <= this.endDate.month)) {
                countMonths++;
                tempMonth++;
                if(tempMonth >= 12) {
                    tempMonth = 0;
                    tempYear++;
                }
            }
            year = this.startDate.year;
            month = this.startDate.month - 1;
            var month_step = 1;
            var date_step = 1;
            for(var j = 0; j <= countMonths + 2; j += month_step) {
                month += month_step;
                if(month >= 12) {
                    month = 0;
                    year++;
                }
                if((this.regime == "Quarters_Month") || (this.regime == "Month_Weeks")) {
                    var tick = CZ.Dates.getCoordinateFromYMD(year, month, 1);
                    if(tick >= this.range.min && tick <= this.range.max) {
                        if(tempDays != 1) {
                            if((month % 3 == 0) || (this.regime == "Month_Weeks")) {
                                ticks[num] = {
                                    position: tick,
                                    label: this.getDiv(tick)
                                };
                                num++;
                            }
                        }
                    }
                }
                if((this.regime == "Weeks_Days") || (this.regime == "Days_Quarters")) {
                    countDays = Math.floor(CZ.Dates.daysInMonth[month]);
                    if((month === 1) && (CZ.Dates.isLeapYear(year))) {
                        countDays++;
                    }
                    tempDays = 1;
                    for(var k = 1; k <= countDays; k += date_step) {
                        day = k;
                        tick = CZ.Dates.getCoordinateFromYMD(year, month, day);
                        if(tick >= this.range.min && tick <= this.range.max) {
                            if(this.regime == "Weeks_Days") {
                                if((k == 3) || (k == 10) || (k == 17) || (k == 24) || (k == 28)) {
                                    ticks[num] = {
                                        position: tick,
                                        label: this.getDiv(tick)
                                    };
                                    num++;
                                }
                            } else {
                                ticks[num] = {
                                    position: tick,
                                    label: this.getDiv(tick)
                                };
                                num++;
                            }
                        }
                    }
                }
            }
            this.refreshDivs();
            return ticks;
        };
        this.createSmallTicks = function (ticks) {
            var minors = new Array();
            var k = this.width / (this.range.max - this.range.min);
            var nextStep = true;
            var step;
            var n;
            var tick = ticks[0].position;
            var date = CZ.Dates.getYMDFromCoordinate(tick);
            if(this.regime == "Quarters_Month") {
                n = 2;
            } else if(this.regime == "Month_Weeks") {
                n = CZ.Dates.daysInMonth[date.month];
            } else if(this.regime == "Weeks_Days") {
                n = 7;
            } else if(this.regime == "Days_Quarters") {
                n = 4;
            }
            if(this.regime == "Quarters_Month") {
                step = Math.floor(2 * CZ.Dates.daysInMonth[date.month] / n);
            } else if(this.regime == "Month_Weeks") {
                step = 1;
            } else if(this.regime == "Weeks_Days") {
                step = 1;
            } else if(this.regime == "Days_Quarters") {
                step = 0.25;
            }
            if(k * step < CZ.Settings.minSmallTickSpace) {
                return null;
            }
            date.day -= step;
            tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
            if(this.regime != "Month_Weeks") {
                while(tick > this.range.min) {
                    minors.push(tick);
                    date.day -= step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                }
            } else {
                var j = CZ.Dates.daysInMonth[date.month];
                while(tick > this.range.min) {
                    if((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 27)) {
                        minors.push(tick);
                    }
                    date.day -= step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    j--;
                }
            }
            for(var i = 0; i < ticks.length - 1; i++) {
                var tick = ticks[i].position;
                var date = CZ.Dates.getYMDFromCoordinate(tick);
                var j_step = 1;
                for(var j = 1; j <= n; j += j_step) {
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    if(this.regime != "Month_Weeks") {
                        if(minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace) {
                            minors.push(tick);
                        }
                    } else {
                        if((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                            if(minors.length == 0 || k * (ticks[i + 1].position - tick) > CZ.Settings.minSmallTickSpace) {
                                minors.push(tick);
                            }
                        }
                    }
                }
            }
            var tick = ticks[ticks.length - 1].position;
            var date = CZ.Dates.getYMDFromCoordinate(tick);
            date.day += step;
            tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
            if(this.regime != "Month_Weeks") {
                while(tick < this.range.max) {
                    minors.push(tick);
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                }
            } else {
                var j = 0;
                while(tick < this.range.max) {
                    if((j == 2) || (j == 9) || (j == 16) || (j == 23) || (j == 28)) {
                        minors.push(tick);
                    }
                    date.day += step;
                    tick = CZ.Dates.getCoordinateFromYMD(date.year, date.month, date.day);
                    j++;
                }
            }
            return minors;
        };
        this.getMarkerLabel = function (range, time) {
            this.getRegime(range.min, range.max);
            var date = CZ.Dates.getYMDFromCoordinate(time, true);
            var labelText = date.year + "." + (date.month + 1) + "." + date.day;
            return labelText;
        };
        this.getVisibleForElement = function (element, scale, viewport, use_margin) {
            var margin = 2 * (CZ.Settings.contentScaleMargin && use_margin ? CZ.Settings.contentScaleMargin : 0);
            var width = viewport.width - margin;
            if(width < 0) {
                width = viewport.width;
            }
            var scaleX = scale * element.width / width;
            var height = viewport.height - margin;
            if(height < 0) {
                height = viewport.height;
            }
            var scaleY = scale * element.height / height;
            var vs = {
                centerX: element.x + element.width / 2.0,
                centerY: element.y + element.height / 2.0,
                scale: Math.min(scaleX, scaleY)
            };
            return vs;
        };
    }
    CZ.DateTickSource = DateTickSource;
    ;
    CZ.DateTickSource.prototype = new CZ.TickSource();
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (VirtualCanvas) {
        function initialize() {
            ($).widget("ui.virtualCanvas", {
                _layersContent: undefined,
                _layers: [],
                _create: function () {
                    var self = this;
                    self.element.addClass("virtualCanvas");
                    var size = self._getClientSize();
                    this.lastEvent = null;
                    this.canvasWidth = null;
                    this.canvasHeight = null;
                    this.requestNewFrame = false;
                    self.cursorPositionChangedEvent = new ($).Event("cursorPositionChanged");
                    self.breadCrumbsChangedEvent = $.Event("breadCrumbsChanged");
                    self.innerZoomConstraintChangedEvent = $.Event("innerZoomConstraintChanged");
                    self.currentlyHoveredInfodot = undefined;
                    self.breadCrumbs = [];
                    self.recentBreadCrumb = {
                        vcElement: {
                            title: "initObject"
                        }
                    };
                    self.cursorPosition = 0.0;
                    var layerDivs = self.element.children("div");
                    layerDivs.each(function (index) {
                        $(this).addClass("virtualCanvasLayerDiv unselectable").zIndex(index * 3);
                        var layerCanvasJq = $("<canvas></canvas>").appendTo($(this)).addClass("virtualCanvasLayerCanvas").zIndex(index * 3 + 1);
                        self._layers.push($(this));
                    });
                    this._layersContent = new CZ.VCContent.CanvasRootElement(self, undefined, "__root__", -Infinity, -Infinity, Infinity, Infinity);
                    this.options.visible = new CZ.Viewport.VisibleRegion2d(0, 0, 1);
                    this.updateViewport();
                    self.element.bind('mousemove.' + this.widgetName, function (e) {
                        self.mouseMove(e);
                    });
                    self.element.bind('mousedown.' + this.widgetName, function (e) {
                        switch(e.which) {
                            case 1:
                                self._mouseDown(e);
                                break;
                        }
                    });
                    self.element.bind('mouseup.' + this.widgetName, function (e) {
                        switch(e.which) {
                            case 1:
                                self._mouseUp(e);
                        }
                    });
                    self.element.bind('mouseleave.' + this.widgetName, function (e) {
                        self._mouseLeave(e);
                    });
                },
                destroy: function () {
                    this._destroy();
                },
                _mouseDown: function (e) {
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    this.lastClickPosition = {
                        x: origin.x,
                        y: origin.y
                    };
                    $("iframe").css("pointer-events", "none");
                    $('#iframe_layer').css("display", "block").css("z-index", "99999");
                },
                _mouseUp: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    if(this.lastClickPosition && this.lastClickPosition.x == origin.x && this.lastClickPosition.y == origin.y) {
                        this._mouseClick(e);
                    }
                    $("iframe").css("pointer-events", "auto");
                    $('#iframe_layer').css("display", "none");
                },
                _mouseLeave: function (e) {
                    if(this.currentlyHoveredContentItem != null && this.currentlyHoveredContentItem.onmouseleave != null) {
                        this.currentlyHoveredContentItem.onmouseleave(e);
                    }
                    if(this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.onmouseleave != null) {
                        this.currentlyHoveredInfodot.onmouseleave(e);
                    }
                    if(this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.onmouseunhover != null) {
                        this.currentlyHoveredTimeline.onmouseunhover(null, e);
                    }
                    CZ.Common.stopAnimationTooltip();
                    this.lastEvent = null;
                },
                _mouseClick: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    var _mouseClickNode = function (contentItem, pv) {
                        var inside = contentItem.isInside(pv);
                        if(!inside) {
                            return false;
                        }
                        for(var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if(_mouseClickNode(child, posv)) {
                                return true;
                            }
                        }
                        if(contentItem.reactsOnMouse && contentItem.onmouseclick) {
                            return contentItem.onmouseclick(pv, e);
                        }
                        return false;
                    };
                    _mouseClickNode(this._layersContent, posv);
                },
                getHoveredTimeline: function () {
                    return this.currentlyHoveredTimeline;
                },
                getHoveredInfodot: function () {
                    return this.currentlyHoveredInfodot;
                },
                getCursorPosition: function () {
                    return this.cursorPosition;
                },
                _setConstraintsByInfodotHover: function (e) {
                    var val;
                    if(e) {
                        var recentVp = this.getViewport();
                        val = e.outerRad * CZ.Settings.infoDotZoomConstraint / recentVp.width;
                    } else {
                        val = undefined;
                    }
                    this.RaiseInnerZoomConstraintChanged(val);
                },
                RaiseInnerZoomConstraintChanged: function (e) {
                    this.innerZoomConstraintChangedEvent.zoomValue = e;
                    this.element.trigger(this.innerZoomConstraintChangedEvent);
                },
                RaiseCursorChanged: function () {
                    this.cursorPositionChangedEvent.Time = this.cursorPosition;
                    this.element.trigger(this.cursorPositionChangedEvent);
                },
                updateTooltipPosition: function (posv) {
                    var scrPoint = this.viewport.pointVirtualToScreen(posv.x, posv.y);
                    var heigthOffset = 17;
                    var length, height;
                    var obj = null;
                    if(CZ.Common.tooltipMode == 'infodot') {
                        obj = this.currentlyHoveredInfodot;
                    } else if(CZ.Common.tooltipMode == 'timeline') {
                        obj = this.currentlyHoveredTimeline;
                    }
                    if(obj == null) {
                        return;
                    }
                    length = parseInt(scrPoint.x) + obj.panelWidth;
                    height = parseInt(scrPoint.y) + obj.panelHeight + heigthOffset;
                    if(length > this.canvasWidth) {
                        scrPoint.x = this.canvasWidth - obj.panelWidth;
                    }
                    if(height > this.canvasHeight) {
                        scrPoint.y = this.canvasHeight - obj.panelHeight - heigthOffset + 1;
                    }
                    $('.bubbleInfo').css({
                        position: "absolute",
                        top: scrPoint.y,
                        left: scrPoint.x
                    });
                },
                mouseMove: function (e) {
                    var viewport = this.getViewport();
                    var origin = CZ.Common.getXBrowserMouseOrigin(this.element, e);
                    var posv = viewport.pointScreenToVirtual(origin.x, origin.y);
                    if(!this.currentlyHoveredInfodot) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }
                    if(!this.currentlyHoveredTimeline) {
                        this.cursorPosition = posv.x;
                        this.RaiseCursorChanged();
                    }
                    var mouseInStack = [];
                    var _mouseMoveNode = function (contentItem, forceOutside, pv) {
                        if(forceOutside) {
                            if(contentItem.reactsOnMouse && contentItem.isMouseIn && contentItem.onmouseleave) {
                                contentItem.onmouseleave(pv, e);
                                contentItem.isMouseIn = false;
                            }
                        } else {
                            var inside = contentItem.isInside(pv);
                            forceOutside = !inside;
                            if(contentItem.reactsOnMouse) {
                                if(inside) {
                                    if(contentItem.isMouseIn) {
                                        if(contentItem.onmousemove) {
                                            contentItem.onmousemove(pv, e);
                                        }
                                        if(contentItem.onmousehover) {
                                            mouseInStack.push(contentItem);
                                        }
                                    } else {
                                        contentItem.isMouseIn = true;
                                        if(contentItem.onmouseenter) {
                                            contentItem.onmouseenter(pv, e);
                                        }
                                    }
                                } else {
                                    if(contentItem.isMouseIn) {
                                        contentItem.isMouseIn = false;
                                        if(contentItem.onmouseleave) {
                                            contentItem.onmouseleave(pv, e);
                                        }
                                    } else {
                                        if(contentItem.onmousemove) {
                                            contentItem.onmousemove(pv, e);
                                        }
                                    }
                                }
                            }
                            contentItem.isMouseIn = inside;
                        }
                        for(var i = 0; i < contentItem.children.length; i++) {
                            var child = contentItem.children[i];
                            if(!forceOutside || child.isMouseIn) {
                                _mouseMoveNode(child, forceOutside, pv);
                            }
                        }
                    };
                    _mouseMoveNode(this._layersContent, false, posv);
                    if(mouseInStack.length == 0) {
                        if(this.hovered && this.hovered.onmouseunhover) {
                            this.hovered.onmouseunhover(posv, e);
                            this.hovered = null;
                        }
                    }
                    for(var n = mouseInStack.length; --n >= 0; ) {
                        if(mouseInStack[n].onmousehover) {
                            mouseInStack[n].onmousehover(posv, e);
                            if(this.hovered && this.hovered != mouseInStack[n] && this.hovered.onmouseunhover) {
                                if(!this.currentlyHoveredInfodot || (this.currentlyHoveredInfodot && this.currentlyHoveredInfodot.parent && this.currentlyHoveredInfodot.parent != this.hovered)) {
                                    this.hovered.onmouseunhover(posv, e);
                                }
                            }
                            if(this.currentlyHoveredContentItem) {
                                this.hovered = this.currentlyHoveredContentItem;
                            } else {
                                this.hovered = mouseInStack[n];
                            }
                            break;
                        }
                    }
                    if((this.currentlyHoveredInfodot != null && this.currentlyHoveredInfodot.tooltipEnabled == true) || (this.currentlyHoveredTimeline != null && this.currentlyHoveredTimeline.tooltipEnabled == true && CZ.Common.tooltipMode != "infodot")) {
                        var obj = null;
                        if(CZ.Common.tooltipMode == 'infodot') {
                            obj = this.currentlyHoveredInfodot;
                        } else if(CZ.Common.tooltipMode == 'timeline') {
                            obj = this.currentlyHoveredTimeline;
                        }
                        if(obj != null) {
                            if(obj.tooltipIsShown == false) {
                                obj.tooltipIsShown = true;
                                CZ.Common.animationTooltipRunning = $('.bubbleInfo').fadeIn();
                            }
                        }
                        this.updateTooltipPosition(posv);
                    }
                    this.lastEvent = e;
                },
                getLastEvent: function () {
                    return this.lastEvent;
                },
                getLayerContent: function () {
                    return this._layersContent;
                },
                findElement: function (id) {
                    var rfind = function (el, id) {
                        if(el.id === id) {
                            return el;
                        }
                        if(!el.children) {
                            return null;
                        }
                        var n = el.children.length;
                        for(var i = 0; i < n; i++) {
                            var child = el.children[i];
                            if(child.id === id) {
                                return child;
                            }
                        }
                        for(var i = 0; i < n; i++) {
                            var child = el.children[i];
                            var res = rfind(child, id);
                            if(res) {
                                return res;
                            }
                        }
                        return null;
                    };
                    return rfind(this._layersContent, id);
                },
                _destroy: function () {
                    this.element.removeClass("virtualCanvas");
                    this.element.children(".virtualCanvasLayerDiv").each(function (index) {
                        $(this).removeClass("virtualCanvasLayerDiv").removeClass("unselectable");
                        $(this).remove(".virtualCanvasLayerCanvas");
                    });
                    this.element.unbind('.' + this.widgetName);
                    this._layers = undefined;
                    this._layersContent = undefined;
                    return this;
                },
                _visibleToViewBox: function (visible) {
                    var view = this.getViewport();
                    var w = view.widthScreenToVirtual(view.width);
                    var h = view.heightScreenToVirtual(view.height);
                    var x = visible.centerX - w / 2;
                    var y = visible.centerY - h / 2;
                    return {
                        Left: x,
                        Right: x + w,
                        Top: y,
                        Bottom: y + h
                    };
                },
                setVisible: function (newVisible, isInAnimation) {
                    delete this.viewport;
                    this.options.visible = newVisible;
                    this.isInAnimation = isInAnimation && isInAnimation.isActive;
                    var viewbox_v = this._visibleToViewBox(newVisible);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                updateViewport: function () {
                    var size = this._getClientSize();
                    var n = this._layers.length;
                    for(var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        layer.width(size.width).height(size.height);
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        if(canvas) {
                            canvas.width = size.width;
                            canvas.height = size.height;
                        }
                    }
                    this.canvasWidth = CZ.Common.vc.width();
                    this.canvasHeight = CZ.Common.vc.height();
                    this.setVisible(this.options.visible);
                },
                _getClientSize: function () {
                    return {
                        width: this.element[0].clientWidth,
                        height: this.element[0].clientHeight
                    };
                },
                getViewport: function () {
                    if(!this.viewport) {
                        var size = this._getClientSize();
                        var o = this.options;
                        this.viewport = new CZ.Viewport.Viewport2d(o.aspectRatio, size.width, size.height, o.visible);
                    }
                    return this.viewport;
                },
                _renderCanvas: function (elementsRoot, visibleBox_v, viewport) {
                    var n = this._layers.length;
                    if(n == 0) {
                        return;
                    }
                    var contexts = {
                    };
                    for(var i = 0; i < n; i++) {
                        var layer = this._layers[i];
                        var canvas = layer.children(".virtualCanvasLayerCanvas").first()[0];
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, viewport.width, viewport.height);
                        var layerid = layer[0].id;
                        contexts[layerid] = ctx;
                    }
                    elementsRoot.render(contexts, visibleBox_v, viewport);
                },
                invalidate: function () {
                    var viewbox_v = this._visibleToViewBox(this.options.visible);
                    var viewport = this.getViewport();
                    this._renderCanvas(this._layersContent, viewbox_v, viewport);
                },
                breadCrumbsChanged: function () {
                    this.breadCrumbsChangedEvent.breadCrumbs = this.breadCrumbs;
                    this.element.trigger(this.breadCrumbsChangedEvent);
                },
                requestInvalidate: function () {
                    this.requestNewFrame = false;
                    if(CZ.Layout.animatingElements.length != 0) {
                        for(var id in CZ.Layout.animatingElements) {
                            if(CZ.Layout.animatingElements[id].animation && CZ.Layout.animatingElements[id].animation.isAnimating) {
                                CZ.Layout.animatingElements[id].calculateNewFrame();
                                this.requestNewFrame = true;
                            }
                        }
                    }
                    if(this.isInAnimation) {
                        return;
                    }
                    this.isInAnimation = true;
                    var self = this;
                    setTimeout(function () {
                        self.isInAnimation = false;
                        self.invalidate();
                        if(self.requestNewFrame) {
                            self.requestInvalidate();
                        }
                    }, 1000.0 / CZ.Settings.targetFps);
                },
                _findLca: function (tl, wnd) {
                    for(var i = 0; i < tl.children.length; i++) {
                        if(tl.children[i].type === 'timeline' && tl.children[i].contains(wnd)) {
                            return this._findLca(tl.children[i], wnd);
                        }
                    }
                    return tl;
                },
                findLca: function (wnd) {
                    var cosmosTimeline = this._layersContent.children[0];
                    var eps = 1;
                    var cosmosLeft = cosmosTimeline.x + eps;
                    var cosmosRight = cosmosTimeline.x + cosmosTimeline.width - eps;
                    var cosmosTop = cosmosTimeline.y + eps;
                    var cosmosBottom = cosmosTimeline.y + cosmosTimeline.height - eps;
                    wnd.left = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x));
                    wnd.right = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x + wnd.width));
                    wnd.top = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y));
                    wnd.bottom = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y + wnd.height));
                    wnd.x = wnd.left;
                    wnd.y = wnd.top;
                    wnd.width = Math.max(0, wnd.right - wnd.left);
                    wnd.height = Math.max(0, wnd.bottom - wnd.top);
                    return this._findLca(cosmosTimeline, wnd);
                },
                _inBuffer: function (tl, wnd, scale) {
                    if(tl.intersects(wnd) && tl.isVisibleOnScreen(scale)) {
                        if(!tl.isBuffered) {
                            return false;
                        } else {
                            var b = true;
                            for(var i = 0; i < tl.children.length; i++) {
                                if(tl.children[i].type === 'timeline') {
                                    b = b && this._inBuffer(tl.children[i], wnd, scale);
                                }
                            }
                            return b;
                        }
                    }
                    return true;
                },
                inBuffer: function (wnd, scale) {
                    var cosmosTimeline = this._layersContent.children[0];
                    var cosmosLeft = cosmosTimeline.x;
                    var cosmosRight = cosmosTimeline.x + cosmosTimeline.width;
                    var cosmosTop = cosmosTimeline.y;
                    var cosmosBottom = cosmosTimeline.y + cosmosTimeline.height;
                    wnd.left = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x));
                    wnd.right = Math.max(cosmosLeft, Math.min(cosmosRight, wnd.x + wnd.width));
                    wnd.top = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y));
                    wnd.bottom = Math.max(cosmosTop, Math.min(cosmosBottom, wnd.y + wnd.height));
                    wnd.x = wnd.left;
                    wnd.y = wnd.top;
                    wnd.width = Math.max(0, wnd.right - wnd.left);
                    wnd.height = Math.max(0, wnd.bottom - wnd.top);
                    return this._inBuffer(cosmosTimeline, wnd, scale);
                },
                options: {
                    aspectRatio: 1,
                    visible: {
                        centerX: 0,
                        centerY: 0,
                        scale: 1
                    }
                }
            });
        }
        VirtualCanvas.initialize = initialize;
    })(CZ.VirtualCanvas || (CZ.VirtualCanvas = {}));
    var VirtualCanvas = CZ.VirtualCanvas;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var DatePicker = (function () {
            function DatePicker(datePicker) {
                this.datePicker = datePicker;
                this.INFINITY_VALUE = 9999;
                this.WRONG_YEAR_INPUT = "Year should be a number.";
                if(!(datePicker instanceof jQuery && datePicker.is("div"))) {
                    throw "DatePicker parameter is invalid! It should be jQuery instance of DIV.";
                }
                this.coordinate = 0;
                this.initialize();
            }
            DatePicker.prototype.initialize = function () {
                var _this = this;
                this.datePicker.addClass("cz-datepicker");
                this.modeSelector = $("<select class='cz-datepicker-mode cz-input'></select>");
                var optionYear = $("<option value='year'>Year</option>");
                var optionDate = $("<option value='date'>Date</option>");
                this.modeSelector.change(function (event) {
                    var mode = _this.modeSelector.find(":selected").val();
                    _this.errorMsg.text("");
                    switch(mode) {
                        case "year":
                            _this.editModeYear();
                            _this.setDate_YearMode(_this.coordinate, false);
                            break;
                        case "date":
                            _this.editModeDate();
                            _this.setDate_DateMode(_this.coordinate);
                            break;
                        case "infinite":
                            _this.editModeInfinite();
                            break;
                    }
                });
                this.modeSelector.append(optionYear);
                this.modeSelector.append(optionDate);
                this.dateContainer = $("<div class='cz-datepicker-container'></div>");
                this.errorMsg = $("<div class='cz-datepicker-errormsg'></div>");
                this.datePicker.append(this.modeSelector);
                this.datePicker.append(this.dateContainer);
                this.datePicker.append(this.errorMsg);
                this.editModeYear();
                this.setDate(this.coordinate, true);
            };
            DatePicker.prototype.remove = function () {
                this.datePicker.empty();
                this.datePicker.removeClass("cz-datepicker");
            };
            DatePicker.prototype.addEditMode_Infinite = function () {
                var optionIntinite = $("<option value='infinite'>Infinite</option>");
                this.modeSelector.append(optionIntinite);
            };
            DatePicker.prototype.setDate = function (coordinate, ZeroYearConversation) {
                if (typeof ZeroYearConversation === "undefined") { ZeroYearConversation = false; }
                if(!this.validateNumber(coordinate)) {
                    return false;
                }
                coordinate = Number(coordinate);
                this.coordinate = coordinate;
                var regime = CZ.Dates.convertCoordinateToYear(this.coordinate).regime;
                if(this.coordinate === this.INFINITY_VALUE) {
                    this.modeSelector.find(":selected").attr("selected", "false");
                    this.modeSelector.find("option").each(function () {
                        if($(this).val() === "infinite") {
                            $(this).attr("selected", "selected");
                            return;
                        }
                    });
                    this.editModeInfinite();
                    return;
                }
                switch(regime.toLowerCase()) {
                    case "ga":
                    case "ma":
                    case "ka":
                        this.modeSelector.find(":selected").attr("selected", "false");
                        this.modeSelector.find("option").each(function () {
                            if($(this).val() === "year") {
                                $(this).attr("selected", "selected");
                                return;
                            }
                        });
                        this.editModeYear();
                        this.setDate_YearMode(coordinate, ZeroYearConversation);
                        break;
                    case "bce":
                    case "ce":
                        this.modeSelector.find(":selected").attr("selected", "false");
                        this.modeSelector.find("option").each(function () {
                            if($(this).val() === "date") {
                                $(this).attr("selected", "selected");
                                return;
                            }
                        });
                        this.editModeDate();
                        this.setDate_DateMode(coordinate);
                        break;
                }
            };
            DatePicker.prototype.getDate = function () {
                var mode = this.modeSelector.find(":selected").val();
                switch(mode) {
                    case "year":
                        return this.getDate_YearMode();
                        break;
                    case "date":
                        return this.getDate_DateMode();
                        break;
                    case "infinite":
                        return this.INFINITY_VALUE;
                        break;
                }
            };
            DatePicker.prototype.editModeYear = function () {
                var _this = this;
                this.dateContainer.empty();
                this.yearSelector = $("<input type='text' class='cz-datepicker-year-year cz-input'></input>");
                this.regimeSelector = $("<select class='cz-datepicker-regime cz-input'></select>");
                this.yearSelector.focus(function (event) {
                    _this.errorMsg.text("");
                });
                this.regimeSelector.change(function (event) {
                    _this.checkAndRemoveNonIntegerPart();
                });
                this.yearSelector.blur(function (event) {
                    if(!_this.validateNumber(_this.yearSelector.val())) {
                        _this.errorMsg.text(_this.WRONG_YEAR_INPUT);
                    }
                    _this.checkAndRemoveNonIntegerPart();
                });
                var optionGa = $("<option value='ga'>Ga</option>");
                var optionMa = $("<option value='ma'>Ma</option>");
                var optionKa = $("<option value='ka'>Ka</option>");
                var optionBCE = $("<option value='bce'>BCE</option>");
                var optionCE = $("<option value='ce'>CE</option>");
                this.regimeSelector.append(optionGa).append(optionMa).append(optionKa).append(optionBCE).append(optionCE);
                this.dateContainer.append(this.yearSelector);
                this.dateContainer.append(this.regimeSelector);
            };
            DatePicker.prototype.editModeDate = function () {
                var _this = this;
                this.dateContainer.empty();
                this.daySelector = $("<select class='cz-datepicker-day-selector cz-input'></select>");
                this.monthSelector = $("<select class='cz-datepicker-month-selector cz-input'></select>");
                this.yearSelector = $("<input type='text' class='cz-datepicker-year-date cz-input'></input>");
                this.yearSelector.focus(function (event) {
                    _this.errorMsg.text("");
                });
                this.yearSelector.blur(function (event) {
                    if(!_this.validateNumber(_this.yearSelector.val())) {
                        _this.errorMsg.text(_this.WRONG_YEAR_INPUT);
                    }
                    _this.checkAndRemoveNonIntegerPart();
                });
                var self = this;
                this.monthSelector.change(function (event) {
                    self.daySelector.empty();
                    var selectedIndex = (self.monthSelector[0]).selectedIndex;
                    for(var i = 0; i < CZ.Dates.daysInMonth[selectedIndex]; i++) {
                        var dayOption = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        self.daySelector.append(dayOption);
                    }
                });
                for(var i = 0; i < CZ.Dates.months.length; i++) {
                    var monthOption = $("<option value='" + CZ.Dates.months[i] + "'>" + CZ.Dates.months[i] + "</option>");
                    this.monthSelector.append(monthOption);
                }
                self.monthSelector.trigger("change");
                this.dateContainer.append(this.monthSelector);
                this.dateContainer.append(this.daySelector);
                this.dateContainer.append(this.yearSelector);
            };
            DatePicker.prototype.editModeInfinite = function () {
                this.dateContainer.empty();
            };
            DatePicker.prototype.checkAndRemoveNonIntegerPart = function () {
                var regime = this.regimeSelector.find(":selected").val().toLowerCase();
                var mode = this.modeSelector.find(":selected").val().toLowerCase();
                if(regime === 'ce' || regime === 'bce' || mode === 'date') {
                    this.yearSelector.val(parseFloat(this.yearSelector.val()).toFixed());
                }
            };
            DatePicker.prototype.setDate_YearMode = function (coordinate, ZeroYearConversation) {
                var date = CZ.Dates.convertCoordinateToYear(coordinate);
                if((date.regime.toLowerCase() == "bce") && (ZeroYearConversation)) {
                    date.year--;
                }
                this.yearSelector.val(date.year);
                this.regimeSelector.find(":selected").attr("selected", "false");
                this.regimeSelector.find("option").each(function () {
                    if(this.value === date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            };
            DatePicker.prototype.setDate_DateMode = function (coordinate) {
                var date = CZ.Dates.getYMDFromCoordinate(coordinate);
                this.yearSelector.val(date.year);
                var self = this;
                this.monthSelector.find("option").each(function (index) {
                    if(this.value === CZ.Dates.months[date.month]) {
                        $(this).attr("selected", "selected");
                        $.when(self.monthSelector.trigger("change")).done(function () {
                            self.daySelector.find("option").each(function () {
                                if(parseInt(this.value) === date.day) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        });
                    }
                });
            };
            DatePicker.prototype.getDate_YearMode = function () {
                var year = this.yearSelector.val();
                if(!this.validateNumber(year)) {
                    return false;
                }
                var regime = this.regimeSelector.find(":selected").val();
                return CZ.Dates.convertYearToCoordinate(year, regime);
            };
            DatePicker.prototype.getDate_DateMode = function () {
                var year = this.yearSelector.val();
                if(!this.validateNumber(year)) {
                    return false;
                }
                year = parseInt(year);
                var month = this.monthSelector.find(":selected").val();
                month = CZ.Dates.months.indexOf(month);
                var day = parseInt(this.daySelector.find(":selected").val());
                return CZ.Dates.getCoordinateFromYMD(year, month, day);
            };
            DatePicker.prototype.validateNumber = function (year) {
                return !isNaN(Number(year)) && isFinite(Number(year)) && !isNaN(parseFloat(year));
            };
            return DatePicker;
        })();
        UI.DatePicker = DatePicker;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            function createTour() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = false;
                CZ.Authoring.mode = "editTour";
                Authoring.showEditTourForm(null);
            }
            UI.createTour = createTour;
            function createTimeline() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.showMessageWindow("Click and drag to set the approximate length of the timeline.", "Create Timeline");
                var prevIsActive = CZ.Authoring.isActive;
                var prevMode = CZ.Authoring.mode;
                var messageForm = CZ.HomePageViewModel.getFormById("#message-window");
                messageForm.closeButton.click(function (event) {
                    CZ.Authoring.isActive = prevIsActive;
                    CZ.Authoring.mode = prevMode;
                });
                CZ.Authoring.isActive = true;
                CZ.Authoring.mode = "createTimeline";
            }
            UI.createTimeline = createTimeline;
            function editTimeline() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editTimeline") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editTimeline";
            }
            UI.editTimeline = editTimeline;
            function createExhibit() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.showMessageWindow("Click inside a timeline to set the approximate date of the exhibit.", "Create Exhibit");
                var prevIsActive = CZ.Authoring.isActive;
                var prevMode = CZ.Authoring.mode;
                var messageForm = CZ.HomePageViewModel.getFormById("#message-window");
                messageForm.closeButton.click(function (event) {
                    CZ.Authoring.isActive = prevIsActive;
                    CZ.Authoring.mode = prevMode;
                });
                CZ.Authoring.isActive = true;
                CZ.Authoring.mode = "createExhibit";
            }
            UI.createExhibit = createExhibit;
            function editExhibit() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editExhibit") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editExhibit";
            }
            UI.editExhibit = editExhibit;
        })(Authoring.UI || (Authoring.UI = {}));
        var UI = Authoring.UI;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Data) {
        function getTimelines(r) {
            if(r === undefined || r === null) {
                r = {
                    start: -50000000000,
                    end: 9999,
                    maxElements: null,
                    minspan: null
                };
            }
            return CZ.Service.getTimelines(r).then(function (response) {
            }, function (error) {
            });
        }
        Data.getTimelines = getTimelines;
        var DataSet = (function () {
            function DataSet() { }
            DataSet.prototype.getVerticalPadding = function () {
                var padding = 0;
                this.series.forEach(function (seria) {
                    if(seria.appearanceSettings && seria.appearanceSettings.thickness && seria.appearanceSettings.thickness > padding) {
                        padding = seria.appearanceSettings.thickness;
                    }
                });
                return padding;
            };
            return DataSet;
        })();
        Data.DataSet = DataSet;        
        var Series = (function () {
            function Series() {
                this.values = new Array();
            }
            return Series;
        })();
        Data.Series = Series;        
        function generateSampleData() {
            var rolandData;
            $.ajax({
                cache: false,
                type: "GET",
                async: false,
                dataType: "text",
                url: '/dumps/beta-timeseries.csv',
                success: function (result) {
                    rolandData = result;
                },
                error: function (xhr) {
                    alert("Error fetching timeSeries Data: " + xhr.responseText);
                }
            });
            return csvToDataSet(rolandData, ",", "sampleData");
        }
        Data.generateSampleData = generateSampleData;
        function csvToDataSet(csvText, delimiter, name) {
            var dataText = csvText;
            var csvArr = dataText.csvToArray({
                trim: true,
                fSep: delimiter,
                quot: "'"
            });
            if(csvArr === undefined) {
                throw "Error parsing input file: file has incorrect format";
            }
            var dataLength = csvArr.length - 1;
            if(dataLength < 2) {
                throw "Error parsing input file: Input should be csv/text file with header and at least one data row";
            }
            var seriesLength = csvArr[0].length - 1;
            if(seriesLength < 1) {
                throw "Error parsing input file: table should contain one column with X-axis data and at least one column for Y-axis data";
            }
            var result = new DataSet();
            result.name = name;
            result.time = new Array();
            result.series = new Array();
            for(var i = 1; i <= seriesLength; i++) {
                var seria = new Series();
                seria.values = new Array();
                seria.appearanceSettings = {
                    thickness: 1,
                    stroke: 'blue'
                };
                var seriaHeader = csvArr[0][i];
                var appearanceRegex = new RegExp("{(.*)}");
                var loadedAppearence = appearanceRegex.exec(seriaHeader);
                if(loadedAppearence !== null) {
                    loadedAppearence = parseStyleString(loadedAppearence[1]);
                    for(var prop in loadedAppearence) {
                        seria.appearanceSettings[prop] = loadedAppearence[prop];
                    }
                }
                var headerRegex = new RegExp("(.*){");
                var header = headerRegex.exec(seriaHeader);
                if(header !== null) {
                    seria.appearanceSettings.name = header[1];
                } else {
                    seria.appearanceSettings.name = seriaHeader;
                }
                seria.appearanceSettings.yMin = parseFloat(csvArr[1][i]);
                seria.appearanceSettings.yMax = parseFloat(csvArr[1][i]);
                result.series.push(seria);
            }
            for(var i = 0; i < dataLength; i++) {
                if(csvArr[i + 1].length !== (seriesLength + 1)) {
                    throw "Error parsing input file: incompatible data row " + (i + 1);
                }
                result.time.push(parseFloat(csvArr[i + 1][0]));
                for(var j = 1; j <= seriesLength; j++) {
                    var value = parseFloat(csvArr[i + 1][j]);
                    var seria = result.series[j - 1];
                    if(seria.appearanceSettings.yMin > value) {
                        seria.appearanceSettings.yMin = value;
                    }
                    if(seria.appearanceSettings.yMax < value) {
                        seria.appearanceSettings.yMax = value;
                    }
                    seria.values.push(value);
                }
            }
            return result;
        }
        Data.csvToDataSet = csvToDataSet;
        function parseStyleString(styleString) {
            var result = {
            };
            var items = styleString.split(";");
            var n = items.length;
            for(var i = 0; i < n; i++) {
                var pair = items[i].split(':', 2);
                if(pair && pair.length === 2) {
                    var name = pair[0].trim();
                    var val = pair[1].trim();
                    if(/^\d+$/.test(val)) {
                        val = parseFloat(val);
                    }
                    result[name] = val;
                }
            }
            return result;
        }
        Data.parseStyleString = parseStyleString;
    })(CZ.Data || (CZ.Data = {}));
    var Data = CZ.Data;
})(CZ || (CZ = {}));
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
            var _doc = ($(document));
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
                var xevent = ($).Event("xbrowserwheel");
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
            var _doc = ($)(document);
            var touchStart = vc.toObservable("touchstart");
            var touchMove = vc.toObservable("touchmove");
            var touchEnd = _doc.toObservable("touchend");
            var touchCancel = _doc.toObservable("touchcancel");
            var gestures = touchStart.SelectMany(function (o) {
                return touchMove.TakeUntil(touchEnd.Merge(touchCancel)).Skip(1).Zip(touchMove, function (left, right) {
                    return {
                        "left": left.originalEvent,
                        "right": right.originalEvent
                    };
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
            var _doc = ($)(document);
            var gestureStart = vc.toObservable("gesturestart");
            var gestureChange = vc.toObservable("gesturechange");
            var gestureEnd = _doc.toObservable("gestureend");
            var touchCancel = _doc.toObservable("touchcancel");
            var gestures = gestureStart.SelectMany(function (o) {
                return gestureChange.TakeUntil(gestureEnd.Merge(touchCancel)).Skip(1).Zip(gestureChange, function (left, right) {
                    return {
                        "left": left.originalEvent,
                        "right": right.originalEvent
                    };
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
                    return {
                        "left": left.originalEvent,
                        "right": right.originalEvent
                    };
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
                if(child === dom) {
                    return;
                }
            });
            gesturesDictionary.push(dom);
            dom.addEventListener("MSPointerDown", function (e) {
                if(dom.gesture === undefined) {
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
            if(window.navigator.msPointerEnabled && (window).MSGesture) {
                addMSGestureSource(source[0]);
                panController = createTouchPanSubjectWin8(source);
                var zoomControllerTouch = createTouchZoomSubjectWin8(source);
                var zoomControllerMouse = createZoomSubject(source);
                zoomController = zoomControllerTouch.Merge(zoomControllerMouse);
                pinController = createTouchPinSubjectWin8(source);
            } else if('ontouchstart' in document.documentElement) {
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
            if(window.navigator.msPointerEnabled && (window).MSGesture) {
                addMSGestureSource(source[0]);
                panController = createTouchPanSubjectWin8(source);
                var zoomControllerTouch = createTouchZoomSubjectWin8(source);
                var zoomControllerMouse = createZoomSubject(source);
                pinController = createTouchPinSubjectWin8(source);
            } else if('ontouchstart' in document.documentElement) {
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
                if(el.Type == "Pan") {
                    el.yOffset = 0;
                }
                return el;
            });
        }
        Gestures.applyAxisBehavior = applyAxisBehavior;
    })(CZ.Gestures || (CZ.Gestures = {}));
    var Gestures = CZ.Gestures;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var LineChart = (function () {
            function LineChart(container) {
                this.container = container;
                this.canvas = document.createElement("canvas");
                $(this.canvas).prependTo($("#timeSeries"));
                this.canvas.width = container.width();
                this.canvas.height = container.height();
                this.context = this.canvas.getContext("2d");
                $("#closeTimeChartBtn").click(function () {
                    CZ.HomePageViewModel.hideTimeSeriesChart();
                });
            }
            LineChart.prototype.calculateTicks = function (ymin, ymax, labelCount) {
                var delta = (ymax - ymin) / labelCount;
                var h = Math.round(Math.log(delta) / Math.LN10);
                var h10 = Math.pow(10, h);
                var k = delta / h10;
                if(k < 1.5) {
                    k = 1;
                } else if(k < 3.5) {
                    k = 2;
                } else {
                    k = 5;
                }
                var imin = Math.ceil(ymin / (k * h10));
                var imax = Math.floor(ymax / (k * h10));
                var actualLabelCount = imax - imin + 1;
                if(actualLabelCount < labelCount) {
                    while(true) {
                        var k1 = k;
                        var h1 = h;
                        if(k1 == 5) {
                            k1 = 2;
                        } else if(k1 == 2) {
                            k1 = 1;
                        } else {
                            h1--;
                            k1 = 5;
                        }
                        var imin1 = Math.ceil(ymin / (k1 * Math.pow(10, h1)));
                        var imax1 = Math.floor(ymax / (k1 * Math.pow(10, h1)));
                        var actualLabelCount1 = imax1 - imin1 + 1;
                        if(Math.abs(labelCount - actualLabelCount) > Math.abs(labelCount - actualLabelCount1)) {
                            imin = imin1;
                            imax = imax1;
                            k = k1;
                            h = h1;
                            h10 = Math.pow(10, h1);
                        } else {
                            break;
                        }
                    }
                } else if(actualLabelCount > labelCount) {
                    while(true) {
                        var k1 = k;
                        var h1 = h;
                        if(k1 == 5) {
                            k1 = 1;
                            h1++;
                        } else if(k1 == 2) {
                            k1 = 5;
                        } else {
                            k1 = 2;
                        }
                        var imin1 = Math.ceil(ymin / (k1 * Math.pow(10, h1)));
                        var imax1 = Math.floor(ymax / (k1 * Math.pow(10, h1)));
                        var actualLabelCount1 = imax1 - imin1 + 1;
                        if(Math.abs(labelCount - actualLabelCount) > Math.abs(labelCount - actualLabelCount1) && actualLabelCount1 > 0) {
                            imin = imin1;
                            imax = imax1;
                            k = k1;
                            h = h1;
                            h10 = Math.pow(10, h1);
                        } else {
                            break;
                        }
                    }
                }
                var ticks = [];
                for(var i = imin; i <= imax; i++) {
                    var newTick = i * k * h10;
                    if(h < 0) {
                        newTick = newTick.toPrecision(-h);
                    }
                    ticks.push(newTick);
                }
                var result = {
                };
                result.ticks = ticks;
                result.h = h;
                result.h10 = h10;
                return result;
            };
            LineChart.prototype.clear = function (screenLeft, screenRight) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.fillStyle = "white";
                this.context.fillRect(screenLeft, 0, screenRight - screenLeft, this.canvas.height);
                var maxLegendWidth = Math.max(24, (screenRight - screenLeft) / 2 - 60);
                $("#rightLegend").css("right", $("#timeSeries").width() - screenRight + 30);
                $("#rightLegend").css("max-width", maxLegendWidth + "px");
                $("#leftLegend").css("left", screenLeft + 30);
                $("#leftLegend").css("max-width", maxLegendWidth + "px");
                $("#timeSeriesChartHeader").text("TimeSeries Chart");
            };
            LineChart.prototype.drawDataSet = function (dataSet, screenLeft, screenRight, verticalPadding, plotLeft, plotRight, plotTop, plotBottom) {
                var that = this;
                dataSet.series.forEach(function (seria) {
                    if(seria.appearanceSettings && seria.appearanceSettings.thickness && seria.appearanceSettings.thickness > verticalPadding) {
                        verticalPadding = seria.appearanceSettings.thickness;
                    }
                });
                var screenHeight = this.canvas.height - 2 * verticalPadding;
                var dataToScreenX = function (x) {
                    return (x - plotLeft) / (plotRight - plotLeft) * (screenRight - screenLeft) + screenLeft;
                };
                var dataToScreenY = function (y) {
                    return verticalPadding + screenHeight * (plotTop - y) / (plotTop - plotBottom);
                };
                var x = dataSet.time;
                var n = x.length;
                var context = this.context;
                var xmin = screenLeft, xmax = screenRight;
                var ymin = 0, ymax = this.canvas.height;
                dataSet.series.forEach(function (seria) {
                    context.strokeStyle = seria.appearanceSettings.stroke;
                    context.lineWidth = seria.appearanceSettings.thickness;
                    var y = seria.values;
                    context.beginPath();
                    var x1, x2, y1, y2;
                    var i = 0;
                    var nextValuePoint = function () {
                        for(; i < n; i++) {
                            if(isNaN(x[i]) || isNaN(y[i])) {
                                continue;
                            }
                            x1 = dataToScreenX(x[i]);
                            y1 = dataToScreenY(y[i]);
                            c1 = that.code(x1, y1, xmin, xmax, ymin, ymax);
                            break;
                        }
                        if(c1 == 0) {
                            context.moveTo(x1, y1);
                        }
                    };
                    nextValuePoint();
                    var c1, c2, c1_, c2_;
                    var dx, dy;
                    var x2_, y2_;
                    var m = 1;
                    for(i++; i < n; i++) {
                        if(isNaN(x[i]) || isNaN(y[i])) {
                            if(m == 1) {
                                context.stroke();
                                var c = that.code(x1, y1, xmin, xmax, ymin, ymax);
                                if(c == 0) {
                                    context.beginPath();
                                    context.arc(x1, y1, seria.appearanceSettings.thickness / 2, 0, 2 * Math.PI);
                                    context.fill();
                                }
                            } else {
                                context.stroke();
                            }
                            context.beginPath();
                            i++;
                            nextValuePoint();
                            m = 1;
                            continue;
                        }
                        x2_ = x2 = dataToScreenX(x[i]);
                        y2_ = y2 = dataToScreenY(y[i]);
                        if(Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1) {
                            continue;
                        }
                        c1_ = c1;
                        c2_ = c2 = that.code(x2, y2, xmin, xmax, ymin, ymax);
                        while(c1 | c2) {
                            if(c1 & c2) {
                                break;
                            }
                            dx = x2 - x1;
                            dy = y2 - y1;
                            if(c1) {
                                if(x1 < xmin) {
                                    y1 += dy * (xmin - x1) / dx;
                                    x1 = xmin;
                                } else if(x1 > xmax) {
                                    y1 += dy * (xmax - x1) / dx;
                                    x1 = xmax;
                                } else if(y1 < ymin) {
                                    x1 += dx * (ymin - y1) / dy;
                                    y1 = ymin;
                                } else if(y1 > ymax) {
                                    x1 += dx * (ymax - y1) / dy;
                                    y1 = ymax;
                                }
                                c1 = that.code(x1, y1, xmin, xmax, ymin, ymax);
                            } else {
                                if(x2 < xmin) {
                                    y2 += dy * (xmin - x2) / dx;
                                    x2 = xmin;
                                } else if(x2 > xmax) {
                                    y2 += dy * (xmax - x2) / dx;
                                    x2 = xmax;
                                } else if(y2 < ymin) {
                                    x2 += dx * (ymin - y2) / dy;
                                    y2 = ymin;
                                } else if(y2 > ymax) {
                                    x2 += dx * (ymax - y2) / dy;
                                    y2 = ymax;
                                }
                                c2 = that.code(x2, y2, xmin, xmax, ymin, ymax);
                            }
                        }
                        if(!(c1 & c2)) {
                            if(c1_ != 0) {
                                context.moveTo(x1, y1);
                            }
                            context.lineTo(x2, y2);
                            m++;
                        }
                        x1 = x2_;
                        y1 = y2_;
                        c1 = c2_;
                    }
                    if(m == 1) {
                        context.stroke();
                        var c = that.code(x1, y1, xmin, xmax, ymin, ymax);
                        if(c == 0) {
                            context.beginPath();
                            context.arc(x1, y1, seria.appearanceSettings.thickness / 2, 0, 2 * Math.PI);
                            context.fill();
                        }
                    } else {
                        context.stroke();
                    }
                });
            };
            LineChart.prototype.code = function (x, y, xmin, xmax, ymin, ymax) {
                var a = x < xmin ? 1 : 0;
                var b = x > xmax ? 1 : 0;
                var c = y < ymin ? 1 : 0;
                var d = y > ymax ? 1 : 0;
                return a << 3 | b << 2 | c << 1 | d;
            };
            LineChart.prototype.generateAxisParameters = function (tickOrigin, secondScreenBorder, ymin, ymax, appearence) {
                var that = this;
                var ticksForDraw = [];
                var verticalPadding = appearence.verticalPadding ? appearence.verticalPadding : 0;
                var screenHeight = this.canvas.height - 2 * verticalPadding;
                var dataToScreenY = function (y) {
                    return verticalPadding + screenHeight * (ymax - y) / (ymax - ymin);
                };
                var plotToScreenY = function (top) {
                    return (ymax - ymin) * (1 - ((top - verticalPadding) / screenHeight)) + ymin;
                };
                var ticks = this.calculateTicks(plotToScreenY(this.canvas.height), plotToScreenY(0), appearence.labelCount).ticks;
                var ctx = this.context;
                ctx.font = appearence.font;
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = appearence.stroke;
                ctx.fillStyle = appearence.stroke;
                ctx.lineWidth = appearence.majorTickThickness;
                var ticklength = appearence.tickLength;
                var textOffset = 2;
                if(appearence.axisLocation == "right") {
                    ticklength = -ticklength;
                    textOffset = -textOffset;
                }
                ctx.textAlign = appearence.axisLocation;
                ticks.forEach(function (tick) {
                    var tickForDraw = {
                    };
                    tickForDraw.tick = tick;
                    var y = dataToScreenY(tick);
                    tickForDraw.y = y;
                    tickForDraw.xLineStart = tickOrigin;
                    tickForDraw.xLineEnd = tickOrigin + ticklength;
                    tickForDraw.xText = tickOrigin + ticklength + textOffset;
                    var textWidth = ctx.measureText(tick).width;
                    if(appearence.axisLocation == "right") {
                        textWidth = -textWidth;
                    }
                    var offset = ticklength + textWidth + 2 * textOffset;
                    tickForDraw.isGridLineVisible = offset > 0 && (tickOrigin + offset) <= secondScreenBorder || offset < 0 && (tickOrigin + offset) >= secondScreenBorder;
                    tickForDraw.xGridLineStart = tickOrigin + offset;
                    tickForDraw.xGridLineEnd = secondScreenBorder;
                    ticksForDraw.push(tickForDraw);
                });
                return ticksForDraw;
            };
            LineChart.prototype.drawAxis = function (ticksForDraw, appearence) {
                var that = this;
                var ctx = this.context;
                ctx.font = appearence.font;
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = appearence.stroke;
                ctx.fillStyle = appearence.stroke;
                ctx.lineWidth = appearence.majorTickThickness;
                ctx.textAlign = appearence.axisLocation;
                ticksForDraw.forEach(function (tick) {
                    ctx.strokeStyle = appearence.stroke;
                    ctx.beginPath();
                    ctx.moveTo(tick.xLineStart, tick.y);
                    ctx.lineTo(tick.xLineEnd, tick.y);
                    ctx.stroke();
                    var minTextOffset = 8;
                    ctx.fillText(tick.tick, tick.xText, Math.max(minTextOffset, Math.min(that.canvas.height - minTextOffset, tick.y)));
                });
            };
            LineChart.prototype.drawHorizontalGridLines = function (ticksForDraw, appearence) {
                var that = this;
                var ctx = this.context;
                ctx.strokeStyle = 'lightgray';
                ctx.lineWidth = appearence.majorTickThickness;
                ticksForDraw.forEach(function (tick) {
                    if(tick.isGridLineVisible) {
                        ctx.beginPath();
                        ctx.moveTo(tick.xGridLineStart, tick.y);
                        ctx.lineTo(tick.xGridLineEnd, tick.y);
                        ctx.stroke();
                    }
                });
            };
            LineChart.prototype.drawVerticalGridLines = function (screenLeft, screenRight, plotLeft, plotRight) {
                var ctx = this.context;
                var verticalTicks = CZ.Common.axis.ticksInfo;
                var height = this.canvas.height;
                ctx.strokeStyle = 'lightgray';
                verticalTicks.forEach(function (tick) {
                    var coord = tick.position;
                    ctx.beginPath();
                    ctx.moveTo(coord, 0);
                    ctx.lineTo(coord, height);
                    ctx.stroke();
                });
            };
            LineChart.prototype.updateCanvasHeight = function () {
                $("#timeSeries").height($("#timeSeriesContainer").height() - 36);
                this.canvas.height = $("#timeSeries").height();
                this.canvas.width = $("#timeSeries").width();
            };
            LineChart.prototype.clearLegend = function (location) {
                var legendCnt = location === "left" ? $("#leftLegend") : $("#rightLegend");
                var legend = location === "left" ? $("#leftLegendList") : $("#rightLegendList");
                legend.empty();
                legendCnt.hide();
            };
            LineChart.prototype.addLegendRecord = function (location, stroke, description) {
                var legend = location === "left" ? $("#leftLegendList") : $("#rightLegendList");
                var legendCont = location === "left" ? $("#leftLegend") : $("#rightLegend");
                legendCont.show();
                var cont = $('<li></li>');
                var strokeIndicatior = $('<div></div>').addClass("tsc-legend-indicator");
                strokeIndicatior.css("background-color", stroke);
                var descriptionDiv = $('<div></div>').addClass("tsc-legend-description");
                descriptionDiv.css("max-width", parseFloat(legendCont.css("max-width")) - 24);
                descriptionDiv.text(description);
                strokeIndicatior.appendTo(cont);
                descriptionDiv.appendTo(cont);
                cont.height(24).appendTo(legend);
            };
            LineChart.prototype.checkLegendVisibility = function (screenWidth) {
                var baseIndicatorSize = 24;
                var horOffset = 30;
                var topOffset = 10;
                return screenWidth >= baseIndicatorSize + horOffset && this.canvas.height >= baseIndicatorSize + topOffset;
            };
            return LineChart;
        })();
        UI.LineChart = LineChart;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Common) {
        Common.maxPermitedScale;
        Common.maxPermitedVerticalRange;
        Common.controller;
        Common.isAxisFreezed = true;
        Common.startHash;
        var searchString;
        Common.ax;
        Common.axis;
        Common.vc;
        var visReg;
        Common.cosmosVisible;
        Common.earthVisible;
        Common.lifeVisible;
        Common.prehistoryVisible;
        Common.humanityVisible;
        var content;
        var breadCrumbs;
        var firstTimeWelcomeChecked = true;
        var regimes = [];
        var k = 1000000000;
        Common.setNavigationStringTo;
        Common.hashHandle = true;
        var tourNotParsed = undefined;
        Common.supercollection = "";
        Common.collection = "";
        Common.initialContent = null;
        function initialize() {
            Common.ax = ($)('#axis');
            Common.axis = new CZ.Timescale(Common.ax);
            CZ.VirtualCanvas.initialize();
            Common.vc = ($)('#vc');
            Common.vc.virtualCanvas();
        }
        Common.initialize = initialize;
        function getXBrowserMouseOrigin(jqelement, event) {
            var offsetX;
            offsetX = event.pageX - jqelement[0].offsetLeft;
            var offsetY;
            offsetY = event.pageY - jqelement[0].offsetTop;
            return {
                x: offsetX,
                y: offsetY
            };
        }
        Common.getXBrowserMouseOrigin = getXBrowserMouseOrigin;
        function sqr(d) {
            return d * d;
        }
        Common.sqr = sqr;
        function preventbubble(e) {
            if(e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
        Common.preventbubble = preventbubble;
        function toggleOffImage(elemId, ext) {
            if(!ext) {
                ext = 'jpg';
            }
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if(imageSrc.substring(len - 6, len - 4) == "on") {
                var newSrc = prefix + "_off." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }
        Common.toggleOffImage = toggleOffImage;
        function toggleOnImage(elemId, ext) {
            if(!ext) {
                ext = 'jpg';
            }
            var imageSrc = $("#" + elemId).attr("src");
            var len = imageSrc.length;
            var prefix = imageSrc.substring(0, len - 7);
            if(imageSrc.substring(len - 6, len - 4) == "ff") {
                var newSrc = prefix + "on." + ext;
                $("#" + elemId).attr("src", newSrc);
            }
        }
        Common.toggleOnImage = toggleOnImage;
        function showFooter() {
            $("#footerBack").show('clip', {
            }, 'slow');
        }
        Common.showFooter = showFooter;
        Common.animationTooltipRunning = null;
        Common.tooltipMode = "default";
        function stopAnimationTooltip() {
            if(Common.animationTooltipRunning != null) {
                $('.bubbleInfo').stop();
                $(".bubbleInfo").css("opacity", "0.9");
                $(".bubbleInfo").css("filter", "alpha(opacity=90)");
                $(".bubbleInfo").css("-moz-opacity", "0.9");
                Common.animationTooltipRunning = null;
                $(".bubbleInfo").attr("id", "defaultBox");
                $(".bubbleInfo").hide();
            }
        }
        Common.stopAnimationTooltip = stopAnimationTooltip;
        function compareVisibles(vis1, vis2) {
            return vis2 != null ? (Math.abs(vis1.centerX - vis2.centerX) < CZ.Settings.allowedVisibileImprecision && Math.abs(vis1.centerY - vis2.centerY) < CZ.Settings.allowedVisibileImprecision && Math.abs(vis1.scale - vis2.scale) < CZ.Settings.allowedVisibileImprecision) : false;
        }
        Common.compareVisibles = compareVisibles;
        function setVisibleByUserDirectly(visible) {
            CZ.Tours.pauseTourAtAnyAnimation = false;
            if(CZ.Tours.tour != undefined && CZ.Tours.tour.state == "play") {
                CZ.Tours.tourPause();
            }
            return setVisible(visible);
        }
        Common.setVisibleByUserDirectly = setVisibleByUserDirectly;
        function setVisible(visible) {
            if(visible) {
                return Common.controller.moveToVisible(visible);
            }
        }
        Common.setVisible = setVisible;
        function updateMarker() {
            Common.axis.setTimeMarker(Common.vc.virtualCanvas("getCursorPosition"), true);
        }
        Common.updateMarker = updateMarker;
        function loadDataUrl() {
            var match = /dataurl=([^\/]*)/g.exec(window.location.hash);
            if(match) {
                return unescape(match[1]);
            } else {
                switch(CZ.Settings.czDataSource) {
                    case 'db':
                        return "/api/get";
                    case 'relay':
                        return "ChronozoomRelay";
                    case 'dump':
                        return "/dumps/beta-get.json";
                    default:
                        return null;
                }
            }
        }
        function loadData() {
            return CZ.Data.getTimelines(null).then(function (response) {
                if(!response) {
                    return;
                }
                ProcessContent(response);
                Common.vc.virtualCanvas("updateViewport");
                if(CZ.Common.initialContent) {
                    CZ.Service.getContentPath(CZ.Common.initialContent).then(function (response) {
                        window.location.hash = response;
                    }, function (error) {
                        console.log("Error connecting to service:\n" + error.responseText);
                    });
                }
                CZ.Service.getTours().then(function (response) {
                    CZ.Tours.parseTours(response);
                    CZ.Tours.initializeToursContent();
                }, function (error) {
                    console.log("Error connecting to service:\n" + error.responseText);
                });
            }, function (error) {
                console.log("Error connecting to service:\n" + error.responseText);
            });
        }
        Common.loadData = loadData;
        function ProcessContent(content) {
            var root = Common.vc.virtualCanvas("getLayerContent");
            root.beginEdit();
            CZ.Layout.Merge(content, root);
            root.endEdit(true);
            InitializeRegimes(content);
            if(Common.startHash) {
                visReg = CZ.UrlNav.navStringToVisible(Common.startHash.substring(1), Common.vc);
            }
            if(!visReg && Common.cosmosVisible) {
                window.location.hash = Common.cosmosVisible;
                visReg = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc);
            }
            if(visReg) {
                Common.controller.moveToVisible(visReg, true);
                updateAxis(Common.vc, Common.ax);
                var vp = Common.vc.virtualCanvas("getViewport");
                if(Common.startHash && window.location.hash !== Common.startHash) {
                    hashChangeFromOutside = false;
                    window.location.hash = Common.startHash;
                }
            }
        }
        function InitializeRegimes(content) {
            var f = function (timeline) {
                if(!timeline) {
                    return null;
                }
                var v = Common.vc.virtualCanvas("findElement", 't' + timeline.id);
                regimes.push(v);
                if(v) {
                    v = CZ.UrlNav.vcelementToNavString(v);
                }
                return v;
            };
            var cosmosTimeline = content;
            Common.cosmosVisible = f(cosmosTimeline);
            CZ.UrlNav.navigationAnchor = Common.vc.virtualCanvas("findElement", 't' + cosmosTimeline.id);
            $("#regime-link-cosmos").click(function () {
                var visible = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc);
                setVisible(visible);
            });
            var earthTimeline = CZ.Layout.FindChildTimeline(cosmosTimeline, CZ.Settings.earthTimelineID, true);
            if(typeof earthTimeline !== "undefined") {
                Common.earthVisible = f(earthTimeline);
                $("#regime-link-earth").click(function () {
                    var visible = CZ.UrlNav.navStringToVisible(Common.earthVisible, Common.vc);
                    setVisible(visible);
                });
                var lifeTimeline = CZ.Layout.FindChildTimeline(earthTimeline, CZ.Settings.lifeTimelineID);
                if(typeof lifeTimeline !== "undefined") {
                    Common.lifeVisible = f(lifeTimeline);
                    $("#regime-link-life").click(function () {
                        var visible = CZ.UrlNav.navStringToVisible(Common.lifeVisible, Common.vc);
                        setVisible(visible);
                    });
                    var prehistoryTimeline = CZ.Layout.FindChildTimeline(lifeTimeline, CZ.Settings.prehistoryTimelineID);
                    if(typeof prehistoryTimeline !== "undefined") {
                        Common.prehistoryVisible = f(prehistoryTimeline);
                        $("#regime-link-prehistory").click(function () {
                            var visible = CZ.UrlNav.navStringToVisible(Common.prehistoryVisible, Common.vc);
                            setVisible(visible);
                        });
                        var humanityTimeline = CZ.Layout.FindChildTimeline(prehistoryTimeline, CZ.Settings.humanityTimelineID, true);
                        if(typeof humanityTimeline !== "undefined") {
                            Common.humanityVisible = f(humanityTimeline);
                            $("#regime-link-humanity").click(function () {
                                var visible = CZ.UrlNav.navStringToVisible(Common.humanityVisible, Common.vc);
                                setVisible(visible);
                            });
                        }
                    }
                }
            }
            Common.maxPermitedVerticalRange = {
                top: cosmosTimeline.y,
                bottom: cosmosTimeline.y + cosmosTimeline.height
            };
            CZ.Settings.maxPermitedTimeRange = {
                left: cosmosTimeline.left,
                right: cosmosTimeline.right
            };
            Common.maxPermitedScale = CZ.UrlNav.navStringToVisible(Common.cosmosVisible, Common.vc).scale * 1.1;
        }
        function updateLayout() {
            CZ.BreadCrumbs.visibleAreaWidth = $(".breadcrumbs-container").width();
            CZ.BreadCrumbs.updateHiddenBreadCrumbs();
            Common.vc.virtualCanvas("updateViewport");
            updateAxis(Common.vc, Common.ax);
            CZ.BreadCrumbs.updateBreadCrumbsLabels();
        }
        Common.updateLayout = updateLayout;
        function updateAxis(vc, ax) {
            var vp = vc.virtualCanvas("getViewport");
            var lt = vp.pointScreenToVirtual(0, 0);
            var rb = vp.pointScreenToVirtual(vp.width, vp.height);
            var newrange = {
                min: lt.x,
                max: rb.x
            };
            Common.axis.update(newrange);
        }
        Common.updateAxis = updateAxis;
        function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }
        Common.setCookie = setCookie;
        function getCookie(c_name) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for(i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if(x == c_name) {
                    return unescape(y);
                }
            }
            return null;
        }
        Common.getCookie = getCookie;
        function viewportToViewBox(vp) {
            var w = vp.widthScreenToVirtual(vp.width);
            var h = vp.heightScreenToVirtual(vp.height);
            var x = vp.visible.centerX - w / 2;
            var y = vp.visible.centerY - h / 2;
            return {
                left: x,
                right: x + w,
                top: y,
                bottom: y + h,
                width: w,
                height: h,
                centerX: vp.visible.centerX,
                centerY: vp.visible.centerY,
                scale: vp.visible.scale
            };
        }
        Common.viewportToViewBox = viewportToViewBox;
    })(CZ.Common || (CZ.Common = {}));
    var Common = CZ.Common;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UILoader) {
        function loadHtml(selector, filepath) {
            var container = $(selector);
            var promise = new $.Deferred();
            if(!filepath) {
                promise.resolve(container);
                return promise;
            }
            if(!selector || !container.length) {
                throw "Unable to load " + filepath + " " + selector;
            }
            container.load(filepath, function () {
                promise.resolve(container);
            });
            return promise;
        }
        UILoader.loadHtml = loadHtml;
        function loadAll(uiMap) {
            var promises = [];
            for(var selector in uiMap) {
                if(uiMap.hasOwnProperty(selector)) {
                    promises.push(loadHtml(selector, uiMap[selector]));
                }
            }
            return $.when.apply($, promises);
        }
        UILoader.loadAll = loadAll;
    })(CZ.UILoader || (CZ.UILoader = {}));
    var UILoader = CZ.UILoader;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Media) {
        var BingMediaPicker = (function () {
            function BingMediaPicker(container, context) {
                this.container = container;
                this.contentItem = context;
                this.editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                this.searchTextbox = this.container.find(".cz-bing-search-input");
                this.mediaTypeRadioButtons = this.container.find(":radio");
                this.progressBar = this.container.find(".cz-form-progress-bar");
                this.searchResultsBox = this.container.find(".cz-bing-search-results");
                this.searchButton = this.container.find(".cz-bing-search-button");
                this.initialize();
            }
            BingMediaPicker.setup = function setup(context) {
                var mediaPickerContainer = CZ.Media.mediaPickersViews["bing"];
                var mediaPicker = new BingMediaPicker(mediaPickerContainer, context);
                var formContainer = $(".cz-form-bing-mediapicker");
                if(formContainer.length === 0) {
                    formContainer = $("#mediapicker-form").clone().removeAttr("id").addClass("cz-form-bing-mediapicker").appendTo($("#content"));
                }
                var form = new CZ.UI.FormMediaPicker(formContainer, mediaPickerContainer, "Import from Bing", {
                    activationSource: $(),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content"
                });
                $(form).on("showcompleted", function (event) {
                    mediaPicker.searchTextbox.focus();
                });
                $(mediaPicker).on("resultclick", function (event) {
                    form.close();
                });
                var onWindowResize = function () {
                    return mediaPicker.onWindowResize();
                };
                $(window).on("resize", onWindowResize);
                $(form).on("closecompleted", function (event) {
                    $(window).off("resize", onWindowResize);
                });
                form.show();
            };
            BingMediaPicker.prototype.initialize = function () {
                var _this = this;
                this.progressBar.css("opacity", 0);
                this.searchTextbox.off();
                this.searchButton.off();
                $(this).off();
                this.searchTextbox.keypress(function (event) {
                    var code = event.which || event.keyCode;
                    if(code === 13) {
                        event.preventDefault();
                        _this.search();
                    }
                });
                this.searchButton.click(function (event) {
                    _this.search();
                });
                $(this).on("resultclick", function (event, mediaInfo) {
                    _this.onSearchResultClick(mediaInfo);
                });
            };
            BingMediaPicker.prototype.onSearchResultClick = function (mediaInfo) {
                $.extend(this.contentItem, mediaInfo);
                this.editContentItemForm.updateMediaInfo();
            };
            BingMediaPicker.prototype.getMediaType = function () {
                return this.mediaTypeRadioButtons.filter(":checked").val();
            };
            BingMediaPicker.prototype.convertResultToMediaInfo = function (result, mediaType) {
                var mediaInfoMap = {
                    image: {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.SourceUrl,
                        attribution: result.SourceUrl
                    },
                    video: {
                        uri: result.MediaUrl,
                        mediaType: mediaType,
                        mediaSource: result.MediaUrl,
                        attribution: result.MediaUrl
                    },
                    pdf: {
                        uri: result.Url,
                        mediaType: mediaType,
                        mediaSource: result.Url,
                        attribution: result.Url
                    }
                };
                return mediaInfoMap[mediaType];
            };
            BingMediaPicker.prototype.search = function () {
                var query = this.searchTextbox.val();
                var mediaType = this.getMediaType();
                if(query.trim() === "") {
                    return;
                }
                this.searchResultsBox.empty();
                this.showProgressBar();
                switch(mediaType) {
                    case "image":
                        this.searchImages(query);
                        break;
                    case "video":
                        this.searchVideos(query);
                        break;
                    case "document":
                        this.searchDocuments(query);
                        break;
                }
            };
            BingMediaPicker.prototype.searchImages = function (query) {
                var _this = this;
                CZ.Service.getBingImages(query).done(function (response) {
                    _this.hideProgressBar();
                    if(response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }
                    for(var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createImageResult(result);
                        _this.searchResultsBox.append(resultContainer);
                        _this.alignThumbnails();
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };
            BingMediaPicker.prototype.searchVideos = function (query) {
                var _this = this;
                query += " (+site:youtube.com OR +site:vimeo.com)";
                CZ.Service.getBingVideos(query).done(function (response) {
                    _this.hideProgressBar();
                    if(response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }
                    for(var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createVideoResult(result);
                        _this.searchResultsBox.append(resultContainer);
                        _this.alignThumbnails();
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };
            BingMediaPicker.prototype.searchDocuments = function (query) {
                var _this = this;
                CZ.Service.getBingDocuments(query, "pdf").done(function (response) {
                    _this.hideProgressBar();
                    if(response.d.length === 0) {
                        _this.showNoResults();
                        return;
                    }
                    for(var i = 0, len = response.d.length; i < len; ++i) {
                        var result = response.d[i];
                        var resultContainer = _this.createDocumentResult(result);
                        _this.searchResultsBox.append(resultContainer);
                    }
                }).fail(function (error) {
                    _this.hideProgressBar();
                    _this.showErrorMessage(error);
                });
            };
            BingMediaPicker.prototype.createImageResult = function (result) {
                var _this = this;
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height, CZ.Settings.mediapickerImageThumbnailMaxWidth, CZ.Settings.mediapickerImageThumbnailMaxHeight);
                var imageOffset = (CZ.Settings.mediapickerImageThumbnailMaxHeight - rectangle.height) / 2;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: rectangle.width,
                    "data-actual-width": rectangle.width
                });
                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });
                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.Width + "x" + result.Height + " - " + Math.round(result.FileSize / 8 / 1024) + " KB"
                });
                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.MediaUrl,
                    title: result.DisplayUrl,
                    "media-source": result.SourceUrl,
                    target: "_blank"
                });
                var thumbnailContainer = $("<div></div>", {
                    width: "100%",
                    height: CZ.Settings.mediapickerImageThumbnailMaxHeight
                });
                var thumbnail = $("<img></img>", {
                    class: "cz-bing-result-thumbnail",
                    src: result.Thumbnail.MediaUrl,
                    height: rectangle.height,
                    width: "100%"
                });
                thumbnail.css("padding-top", imageOffset + "px");
                thumbnailContainer.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "image"));
                });
                thumbnailContainer.append(thumbnail);
                return container.append(thumbnailContainer).append(title).append(size).append(url);
            };
            BingMediaPicker.prototype.createVideoResult = function (result) {
                var _this = this;
                result.Thumbnail = result.Thumbnail || this.createDefaultThumbnail();
                var rectangle = this.fitThumbnailToContainer(result.Thumbnail.Width / result.Thumbnail.Height, CZ.Settings.mediapickerVideoThumbnailMaxWidth, CZ.Settings.mediapickerVideoThumbnailMaxHeight);
                var imageOffset = (CZ.Settings.mediapickerVideoThumbnailMaxHeight - rectangle.height) / 2;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: rectangle.width,
                    "data-actual-width": rectangle.width
                });
                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });
                var size = $("<div></div>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: "Duration - " + (result.RunTime / 1000) + " seconds"
                });
                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.MediaUrl,
                    href: result.MediaUrl,
                    title: result.MediaUrl,
                    target: "_blank"
                });
                var thumbnailContainer = $("<div></div>", {
                    width: "100%",
                    height: CZ.Settings.mediapickerVideoThumbnailMaxHeight
                });
                var thumbnail = $("<img></img>", {
                    class: "cz-bing-result-thumbnail",
                    src: result.Thumbnail.MediaUrl,
                    height: rectangle.height,
                    width: "100%"
                });
                thumbnail.css("padding-top", imageOffset + "px");
                thumbnailContainer.add(title).add(size).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "video"));
                });
                thumbnailContainer.append(thumbnail);
                return container.append(thumbnailContainer).append(title).append(size).append(url);
            };
            BingMediaPicker.prototype.createDocumentResult = function (result) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-bing-result-container",
                    width: 300
                });
                var title = $("<div></div>", {
                    class: "cz-bing-result-title cz-darkgray",
                    text: result.Title,
                    title: result.Title
                });
                var descr = $("<div></div>", {
                    class: "cz-bing-result-doc-description cz-lightgray",
                    height: 100,
                    text: result.Description
                });
                var url = $("<a></a>", {
                    class: "cz-bing-result-description cz-lightgray",
                    text: result.DisplayUrl,
                    href: result.Url,
                    title: result.DisplayUrl,
                    target: "_blank"
                });
                title.add(descr).click(function (event) {
                    $(_this).trigger("resultclick", _this.convertResultToMediaInfo(result, "pdf"));
                });
                return container.append(title).append(descr).append(url);
            };
            BingMediaPicker.prototype.showProgressBar = function () {
                this.progressBar.animate({
                    opacity: 1
                });
            };
            BingMediaPicker.prototype.hideProgressBar = function () {
                this.progressBar.animate({
                    opacity: 0
                });
            };
            BingMediaPicker.prototype.showNoResults = function () {
                this.searchResultsBox.text("No results.");
            };
            BingMediaPicker.prototype.createDefaultThumbnail = function () {
                return {
                    ContentType: "image/png",
                    FileSize: 4638,
                    Width: 500,
                    Height: 500,
                    MediaUrl: "/images/Temp-Thumbnail2.png"
                };
            };
            BingMediaPicker.prototype.showErrorMessage = function (error) {
                var errorMessagesByStatus = {
                    "400": "The search request is formed badly. Please contact developers about the error.",
                    "403": "Please sign in to ChronoZoom to use Bing search.",
                    "500": "We are sorry, but something went wrong. Please try again later."
                };
                var errorMessage = $("<span></span>", {
                    class: "cz-red",
                    text: errorMessagesByStatus[error.status]
                });
                this.searchResultsBox.append(errorMessage);
            };
            BingMediaPicker.prototype.onWindowResize = function () {
                this.alignThumbnails();
            };
            BingMediaPicker.prototype.alignThumbnails = function () {
                var container = this.searchResultsBox;
                var elements = container.children();
                if(elements.length === 0) {
                    return;
                }
                var rowWidth = container.width();
                var currentRow = {
                    elements: [],
                    width: 0
                };
                for(var i = 0, len = elements.length; i < len; i++) {
                    var curElement = $(elements[i]);
                    var curElementActualWidth = +curElement.attr("data-actual-width");
                    var curElementOuterWidth = curElement.outerWidth(true);
                    var curElementInnerWidth = curElement.innerWidth();
                    if(rowWidth < currentRow.width + curElementActualWidth) {
                        var delta = rowWidth - currentRow.width;
                        for(var j = 0, rowLen = currentRow.elements.length; j < rowLen; j++) {
                            var rowElement = currentRow.elements[j];
                            var rowElementActualWidth = +rowElement.attr("data-actual-width");
                            rowElement.width(rowElementActualWidth + delta / rowLen);
                        }
                        currentRow.elements = [];
                        currentRow.elements.push(curElement);
                        currentRow.width = Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    } else {
                        currentRow.elements.push(curElement);
                        currentRow.width += Math.ceil(curElementActualWidth + curElementOuterWidth - curElementInnerWidth);
                    }
                }
            };
            BingMediaPicker.prototype.fitThumbnailToContainer = function (aspectRatio, maxWidth, maxHeight) {
                var maxAspectRatio = maxWidth / maxHeight;
                var output = {
                    width: maxHeight * aspectRatio,
                    height: maxHeight
                };
                if(aspectRatio > maxAspectRatio) {
                    output.width = maxWidth;
                    output.height = maxWidth / aspectRatio;
                }
                return output;
            };
            return BingMediaPicker;
        })();
        Media.BingMediaPicker = BingMediaPicker;        
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Media) {
        (function (SkyDriveMediaPicker) {
            var editContentItemForm;
            var contentItem;
            SkyDriveMediaPicker.filePicker;
            SkyDriveMediaPicker.filePickerIframe;
            SkyDriveMediaPicker.logoutButton;
            SkyDriveMediaPicker.isEnabled;
            SkyDriveMediaPicker.helperText;
            var mediaType;
            function setup(context) {
                contentItem = context;
                editContentItemForm = CZ.HomePageViewModel.getFormById("#auth-edit-contentitem-form");
                SkyDriveMediaPicker.logoutButton = $("<button></button>", {
                    text: "Logout",
                    class: "cz-skydrive-logout-button",
                    click: onLogout
                });
                SkyDriveMediaPicker.helperText = $("<label></label>", {
                    text: "Selected items will be automatically shared",
                    class: "cz-skydrive-help-text"
                });
                SkyDriveMediaPicker.filePicker = showFilePicker().then(onFilePick, onError);
            }
            SkyDriveMediaPicker.setup = setup;
            function showFilePicker() {
                watchFilePicker(onFilePickerLoad);
                return WL.fileDialog({
                    mode: "open",
                    select: "single"
                });
            }
            function onFilePick(response) {
                onFilePickerClose();
                getEmbed(response).then(onContentReceive, onError);
            }
            function getEmbed(response) {
                switch(response.data.files[0].type) {
                    case "photo":
                        mediaType = "skydrive-image";
                        break;
                    default:
                        mediaType = "skydrive-document";
                        break;
                }
                return WL.api({
                    path: response.data.files[0].id + "/embed",
                    method: "GET"
                });
            }
            function onContentReceive(response) {
                var src = response.embed_html.match(/src=\"(.*?)\"/i)[1];
                var uri = src;
                if(mediaType === "skydrive-image") {
                    var width = parseFloat(response.embed_html.match(/width="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    var height = parseFloat(response.embed_html.match(/height="[0-9]+"/)[0].match(/[0-9]+/)[0]);
                    uri += ' ' + width + ' ' + height;
                }
                var mediaInfo = {
                    uri: uri,
                    mediaType: mediaType,
                    mediaSource: src,
                    attribution: src
                };
                $.extend(contentItem, mediaInfo);
                editContentItemForm.updateMediaInfo();
            }
            function onError(response) {
                var error = response.error;
                if(error.code === "user_canceled" || error.code === "request_canceled") {
                    onFilePickerClose();
                } else {
                    console.log(error.message);
                }
            }
            function onLogout() {
                if(window.confirm("Are you sure want to logout from Skydrive? All your unsaved changes will be lost.")) {
                    SkyDriveMediaPicker.logoutButton.hide();
                    SkyDriveMediaPicker.helperText.hide();
                    SkyDriveMediaPicker.filePicker.cancel();
                    WL.logout();
                    window.location.assign("https://login.live.com/oauth20_logout.srf?client_id=" + CZ.Settings.WLAPIClientID + "&redirect_uri=" + window.location.toString());
                }
            }
            function watchFilePicker(callback) {
                SkyDriveMediaPicker.filePickerIframe = $("iframe[sutra=picker]");
                if(SkyDriveMediaPicker.filePickerIframe.length > 0) {
                    callback();
                } else {
                    setTimeout(watchFilePicker, 50, callback);
                }
            }
            function onFilePickerLoad() {
                SkyDriveMediaPicker.logoutButton.appendTo("body");
                SkyDriveMediaPicker.helperText.appendTo("body");
                $(window).on("resize", onWindowResize);
                SkyDriveMediaPicker.filePickerIframe.load(function () {
                    onWindowResize();
                    SkyDriveMediaPicker.filePickerIframe.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.logoutButton.animate({
                        opacity: 1
                    });
                    SkyDriveMediaPicker.helperText.animate({
                        opacity: 1
                    });
                });
            }
            function onFilePickerClose() {
                SkyDriveMediaPicker.logoutButton.remove();
                SkyDriveMediaPicker.helperText.remove();
                $(window).off("resize", onWindowResize);
            }
            function onWindowResize() {
                var skyDriveFooterHeight = 56;
                var iframeOffset = SkyDriveMediaPicker.filePickerIframe.offset();
                var iframeHeight = SkyDriveMediaPicker.filePickerIframe.outerHeight(true);
                var buttonLeftMargin = parseInt(SkyDriveMediaPicker.logoutButton.css("margin-left"), 10);
                var buttonTopMargin = parseInt(SkyDriveMediaPicker.logoutButton.css("margin-top"), 10);
                SkyDriveMediaPicker.logoutButton.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin,
                    left: iframeOffset.left + buttonLeftMargin
                });
                SkyDriveMediaPicker.helperText.offset({
                    top: iframeOffset.top + iframeHeight - skyDriveFooterHeight + buttonTopMargin + 1,
                    left: iframeOffset.left + buttonLeftMargin + 90
                });
            }
        })(Media.SkyDriveMediaPicker || (Media.SkyDriveMediaPicker = {}));
        var SkyDriveMediaPicker = Media.SkyDriveMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (Media) {
        var _mediaPickers = {
        };
        var _mediaPickersViews = {
        };
        Object.defineProperties(CZ.Media, {
            mediaPickers: {
                get: function () {
                    return _mediaPickers;
                }
            },
            mediaPickersViews: {
                get: function () {
                    return _mediaPickersViews;
                }
            }
        });
        function initialize() {
            registerMediaPicker("bing", "/images/media/bing-import-50x150.png", CZ.Media.BingMediaPicker, "/ui/media/bing-mediapicker.html");
            if(CZ.Media.SkyDriveMediaPicker.isEnabled) {
                registerMediaPicker("skydrive", "/images/media/skydrive-import-50x150.png", CZ.Media.SkyDriveMediaPicker).done(function () {
                    WL.init({
                        client_id: CZ.Settings.WLAPIClientID,
                        redirect_uri: CZ.Settings.WLAPIRedirectUrl,
                        response_type: "token",
                        scope: "wl.signin,wl.photos,wl.skydrive,wl.skydrive_update"
                    });
                });
            }
        }
        Media.initialize = initialize;
        function registerMediaPicker(title, iconUrl, type, viewUrl, selector) {
            var order = Object.keys(_mediaPickers).length;
            var setup = type.setup;
            selector = selector || "$('<div></div>')";
            _mediaPickers[title] = {
            };
            return CZ.UILoader.loadHtml(selector, viewUrl).always(function (view) {
                _mediaPickersViews[title] = view;
                _mediaPickers[title] = {
                    title: title,
                    iconUrl: iconUrl,
                    order: order,
                    setup: setup
                };
            });
        }
        Media.registerMediaPicker = registerMediaPicker;
    })(CZ.Media || (CZ.Media = {}));
    var Media = CZ.Media;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var MediaList = (function () {
            function MediaList(container, mediaPickers, context) {
                this.container = container;
                this.mediaPickers = mediaPickers;
                this.context = context;
                this.container.addClass("cz-medialist");
                this.fillListOfLinks();
            }
            MediaList.prototype.fillListOfLinks = function () {
                var _this = this;
                var sortedMediaPickersKeys = Object.keys(this.mediaPickers).sort(function (key1, key2) {
                    return (_this.mediaPickers[key1].order - _this.mediaPickers[key2].order) > 0;
                });
                sortedMediaPickersKeys.forEach(function (key) {
                    if(_this.mediaPickers.hasOwnProperty(key)) {
                        var mp = _this.mediaPickers[key];
                        var link = _this.createMediaPickerLink(mp);
                        _this.container.append(link);
                    }
                });
            };
            MediaList.prototype.createMediaPickerLink = function (mp) {
                var _this = this;
                var container = $("<div></div>", {
                    class: "cz-medialist-item",
                    title: mp.title,
                    "media-picker": mp.title
                });
                var icon = $("<img></img>", {
                    class: "cz-medialist-item-icon",
                    src: mp.iconUrl
                });
                container.click(function (event) {
                    mp.setup(_this.context);
                });
                container.append(icon);
                return container;
            };
            MediaList.prototype.remove = function () {
                this.container.empty();
                this.container.removeClass("cz-medialist");
            };
            return MediaList;
        })();
        UI.MediaList = MediaList;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditTimeline = (function (_super) {
            __extends(FormEditTimeline, _super);
            function FormEditTimeline(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.startDate = new CZ.UI.DatePicker(container.find(formInfo.startDate));
                this.endDate = new CZ.UI.DatePicker(container.find(formInfo.endDate));
                this.titleInput = container.find(formInfo.titleInput);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.timeline = formInfo.context;
                this.saveButton.off();
                this.deleteButton.off();
                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });
                this.initialize();
            }
            FormEditTimeline.prototype.initialize = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);
                if(CZ.Authoring.mode === "createTimeline") {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Timeline");
                    this.saveButton.text("create timeline");
                } else if(CZ.Authoring.mode === "editTimeline") {
                    this.deleteButton.show();
                    this.titleTextblock.text("Edit Timeline");
                    this.saveButton.text("update timeline");
                } else if(CZ.Authoring.mode === "createRootTimeline") {
                    this.deleteButton.hide();
                    this.closeButton.hide();
                    this.titleTextblock.text("Create Root Timeline");
                    this.saveButton.text("create timeline");
                } else {
                    console.log("Unexpected authoring mode in timeline form.");
                    this.close();
                }
                this.isCancel = true;
                this.endDate.addEditMode_Infinite();
                this.titleInput.val(this.timeline.title);
                this.startDate.setDate(this.timeline.x, true);
                if(this.timeline.endDate === 9999) {
                    this.endDate.setDate(this.timeline.endDate, true);
                } else {
                    this.endDate.setDate(this.timeline.x + this.timeline.width, true);
                }
                this.saveButton.click(function (event) {
                    _this.errorMessage.empty();
                    var isDataValid = false;
                    isDataValid = CZ.Authoring.validateTimelineData(_this.startDate.getDate(), _this.endDate.getDate(), _this.titleInput.val());
                    if(!CZ.Authoring.isNotEmpty(_this.titleInput.val())) {
                        _this.titleInput.showError("Title can't be empty");
                    }
                    if(!CZ.Authoring.isIntervalPositive(_this.startDate.getDate(), _this.endDate.getDate())) {
                        _this.errorMessage.text('Time interval should no less than one day');
                    }
                    if(!isDataValid) {
                        return;
                    } else {
                        _this.errorMessage.empty();
                        var self = _this;
                        _this.saveButton.prop('disabled', true);
                        CZ.Authoring.updateTimeline(_this.timeline, {
                            title: _this.titleInput.val(),
                            start: _this.startDate.getDate(),
                            end: _this.endDate.getDate()
                        }).then(function (success) {
                            self.isCancel = false;
                            self.close();
                            self.timeline.onmouseclick();
                        }, function (error) {
                            if(error !== undefined && error !== null) {
                                self.errorMessage.text(error).show().delay(7000).fadeOut();
                            } else {
                                self.errorMessage.text("Sorry, internal server error :(").show().delay(7000).fadeOut();
                            }
                            console.log(error);
                        }).always(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    }
                });
                this.deleteButton.click(function (event) {
                    if(confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                        var isDataValid = true;
                        CZ.Authoring.removeTimeline(_this.timeline);
                        _this.close();
                    }
                });
            };
            FormEditTimeline.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormEditTimeline.prototype.close = function () {
                var _this = this;
                this.errorMessage.empty();
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.endDate.remove();
                        _this.startDate.remove();
                        _this.titleInput.hideError();
                    }
                });
                if(this.isCancel && CZ.Authoring.mode === "createTimeline") {
                    CZ.VCContent.removeChild(this.timeline.parent, this.timeline.id);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
                CZ.Authoring.isActive = false;
                this.activationSource.removeClass("active");
            };
            return FormEditTimeline;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditTimeline = FormEditTimeline;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var ContentItemListBox = (function (_super) {
            __extends(ContentItemListBox, _super);
            function ContentItemListBox(container, listItemContainer, contentItems) {
                var self = this;
                var listBoxInfo = {
                    context: contentItems,
                    sortableSettings: {
                        forcePlaceholderSize: true,
                        cursor: "move",
                        placeholder: "cz-listbox-placeholder",
                        revert: 100,
                        opacity: 0.75,
                        tolerance: "pointer",
                        scroll: false,
                        start: function (event, ui) {
                            ui.placeholder.height(ui.item.height());
                        },
                        stop: function (event, ui) {
                            for(var i = 0; i < self.items.length; i++) {
                                if(self.items[i].data) {
                                    self.items[i].data.order = i;
                                }
                            }
                        }
                    }
                };
                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            closeButton: ".cz-listitem-close-btn",
                            iconImg: ".cz-contentitem-listitem-icon > img",
                            titleTextblock: ".cz-contentitem-listitem-title",
                            descrTextblock: ".cz-contentitem-listitem-descr"
                        }
                    }
                };
                listItemsInfo.default.ctor = ContentItemListItem;
                        _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            ContentItemListBox.prototype.remove = function (item) {
                for(var i = this.items.indexOf(item) + 1; i < this.items.length; i++) {
                    if(this.items[i].data && this.items[i].data.order) {
                        this.items[i].data.order--;
                    }
                }
                _super.prototype.remove.call(this, item);
            };
            return ContentItemListBox;
        })(UI.ListBoxBase);
        UI.ContentItemListBox = ContentItemListBox;        
        var ContentItemListItem = (function (_super) {
            __extends(ContentItemListItem, _super);
            function ContentItemListItem(parent, container, uiMap, context) {
                var _this = this;
                        _super.call(this, parent, container, uiMap, context);
                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.descrTextblock = this.container.find(uiMap.descrTextblock);
                this.iconImg.attr("onerror", "this.src='/images/Temp-Thumbnail2.png';");
                this.iconImg.attr("src", this.data.uri);
                this.titleTextblock.text(this.data.title);
                this.descrTextblock.text(this.data.description);
                this.closeButton.off();
                this.closeButton.click(function () {
                    if(CZ.Authoring.mode === "createExhibit") {
                        _super.prototype.close.call(_this);
                    } else if(CZ.Authoring.mode === "editExhibit") {
                        if(_this.parent.items.length > 1) {
                            _super.prototype.close.call(_this);
                        }
                    }
                });
            }
            return ContentItemListItem;
        })(UI.ListItemBase);
        UI.ContentItemListItem = ContentItemListItem;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditExhibit = (function (_super) {
            __extends(FormEditExhibit, _super);
            function FormEditExhibit(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.datePicker = new CZ.UI.DatePicker(container.find(formInfo.datePicker));
                this.createArtifactButton = container.find(formInfo.createArtifactButton);
                this.contentItemsListBox = new CZ.UI.ContentItemListBox(container.find(formInfo.contentItemsListBox), formInfo.contentItemsTemplate, (formInfo.context).contentItems);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });
                this.contentItemsTemplate = formInfo.contentItemsTemplate;
                this.exhibit = formInfo.context;
                this.exhibitCopy = $.extend({
                }, formInfo.context, {
                    children: null
                });
                this.exhibitCopy = $.extend(true, {
                }, this.exhibitCopy);
                delete this.exhibitCopy.children;
                this.mode = CZ.Authoring.mode;
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }
            FormEditExhibit.prototype.initUI = function () {
                var _this = this;
                this.saveButton.prop('disabled', false);
                this.titleInput.change(function () {
                    _this.isModified = true;
                });
                this.datePicker.datePicker.change(function () {
                    _this.isModified = true;
                });
                if(this.mode === "createExhibit") {
                    this.titleTextblock.text("Create Exhibit");
                    this.saveButton.text("create exhibit");
                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);
                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.hide();
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(function () {
                        return _this.onCreateArtifact();
                    });
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                    this.contentItemsListBox.itemDblClick(function (item, index) {
                        return _this.onContentItemDblClick(item, index);
                    });
                    this.contentItemsListBox.itemRemove(function (item, index) {
                        return _this.onContentItemRemoved(item, index);
                    });
                    this.contentItemsListBox.itemMove(function (item, indexStart, indexStop) {
                        return _this.onContentItemMove(item, indexStart, indexStop);
                    });
                } else if(this.mode === "editExhibit") {
                    this.titleTextblock.text("Edit Exhibit");
                    this.saveButton.text("update exhibit");
                    this.titleInput.val(this.exhibit.title || "");
                    this.datePicker.setDate(Number(this.exhibit.infodotDescription.date) || "", true);
                    this.closeButton.show();
                    this.createArtifactButton.show();
                    this.saveButton.show();
                    this.deleteButton.show();
                    this.createArtifactButton.off();
                    this.createArtifactButton.click(function () {
                        return _this.onCreateArtifact();
                    });
                    this.saveButton.off();
                    this.saveButton.click(function () {
                        return _this.onSave();
                    });
                    this.deleteButton.off();
                    this.deleteButton.click(function () {
                        return _this.onDelete();
                    });
                    this.contentItemsListBox.itemDblClick(function (item, index) {
                        return _this.onContentItemDblClick(item, index);
                    });
                    this.contentItemsListBox.itemRemove(function (item, index) {
                        return _this.onContentItemRemoved(item, index);
                    });
                    this.contentItemsListBox.itemMove(function (item, indexStart, indexStop) {
                        return _this.onContentItemMove(item, indexStart, indexStop);
                    });
                } else {
                    console.log("Unexpected authoring mode in exhibit form.");
                }
            };
            FormEditExhibit.prototype.onCreateArtifact = function () {
                this.isModified = true;
                if(this.exhibit.contentItems.length < CZ.Settings.infodotMaxContentItemsCount) {
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = {
                        date: this.datePicker.getDate()
                    };
                    var newContentItem = {
                        title: "",
                        uri: "",
                        mediaSource: "",
                        mediaType: "",
                        attribution: "",
                        description: "",
                        order: this.exhibit.contentItems.length
                    };
                    this.exhibit.contentItems.push(newContentItem);
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "createContentItem";
                    CZ.Authoring.showEditContentItemForm(newContentItem, this.exhibit, this, true);
                } else {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage.text("Sorry, only 10 artifacts are allowed in one exhibit").show().delay(7000).fadeOut(function () {
                        return self.errorMessage.text(origMsg);
                    });
                }
            };
            FormEditExhibit.prototype.onSave = function () {
                var _this = this;
                var exhibit_x = this.datePicker.getDate() - this.exhibit.width / 2;
                var exhibit_y = this.exhibit.y;
                if(exhibit_x + this.exhibit.width >= this.exhibit.parent.x + this.exhibit.parent.width) {
                    exhibit_x = this.exhibit.parent.x + this.exhibit.parent.width - this.exhibit.width;
                }
                if(exhibit_x <= this.exhibit.parent.x) {
                    exhibit_x = this.exhibit.parent.x;
                }
                if(exhibit_y + this.exhibit.height >= this.exhibit.parent.y + this.exhibit.parent.height) {
                    exhibit_y = this.exhibit.parent.y + this.exhibit.parent.height - this.exhibit.height;
                }
                if(exhibit_y <= this.exhibit.parent.y) {
                    exhibit_y = this.exhibit.parent.y;
                }
                var newExhibit = {
                    title: this.titleInput.val() || "",
                    x: exhibit_x,
                    y: exhibit_y,
                    height: this.exhibit.height,
                    width: this.exhibit.width,
                    infodotDescription: {
                        date: CZ.Dates.getDecimalYearFromCoordinate(this.datePicker.getDate())
                    },
                    contentItems: this.exhibit.contentItems || [],
                    type: "infodot"
                };
                if(!CZ.Authoring.isNotEmpty(this.titleInput.val())) {
                    this.titleInput.showError("Title can't be empty");
                }
                if(CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true)) {
                    this.errorMessage.text("Exhibit intersects other elemenets");
                }
                if(CZ.Authoring.validateExhibitData(this.datePicker.getDate(), this.titleInput.val(), this.exhibit.contentItems) && CZ.Authoring.checkExhibitIntersections(this.exhibit.parent, newExhibit, true) && this.exhibit.contentItems.length >= 1 && this.exhibit.contentItems.length <= CZ.Settings.infodotMaxContentItemsCount) {
                    this.saveButton.prop('disabled', true);
                    CZ.Authoring.updateExhibit(this.exhibitCopy, newExhibit).then(function (success) {
                        _this.isCancel = false;
                        _this.isModified = false;
                        _this.close();
                        _this.exhibit.id = arguments[0].id;
                        _this.exhibit.onmouseclick();
                    }, function (error) {
                        var errorMessage = JSON.parse(error.responseText).errorMessage;
                        if(errorMessage !== "") {
                            _this.errorMessage.text(errorMessage);
                        } else {
                            _this.errorMessage.text("Sorry, internal server error :(");
                        }
                        _this.errorMessage.show().delay(7000).fadeOut();
                    }).always(function () {
                        _this.saveButton.prop('disabled', false);
                    });
                } else if(this.exhibit.contentItems.length === 0) {
                    var self = this;
                    var origMsg = this.errorMessage.text();
                    this.errorMessage.text("Cannot create exhibit without artifacts.").show().delay(7000).fadeOut(function () {
                        return self.errorMessage.text(origMsg);
                    });
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            };
            FormEditExhibit.prototype.onDelete = function () {
                if(confirm("Are you sure want to delete the exhibit and all of its content items? Delete can't be undone!")) {
                    CZ.Authoring.removeExhibit(this.exhibit);
                    this.isCancel = false;
                    this.isModified = false;
                    this.close();
                }
            };
            FormEditExhibit.prototype.onContentItemDblClick = function (item, _) {
                var idx;
                if(typeof item.data.order !== 'undefined' && item.data.order !== null && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if(typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) {
                        return ci.guid;
                    }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }
                if(idx >= 0) {
                    this.clickedListItem = item;
                    this.exhibit.title = this.titleInput.val() || "";
                    this.exhibit.x = this.datePicker.getDate() - this.exhibit.width / 2;
                    this.exhibit.infodotDescription = {
                        date: this.datePicker.getDate()
                    };
                    this.hide(true);
                    CZ.Authoring.contentItemMode = "editContentItem";
                    CZ.Authoring.showEditContentItemForm(this.exhibit.contentItems[idx], this.exhibit, this, true);
                }
            };
            FormEditExhibit.prototype.onContentItemRemoved = function (item, _) {
                var idx;
                this.isModified = true;
                if(typeof item.data.order !== 'undefined' && item.data.order !== null && item.data.order >= 0 && item.data.order < CZ.Settings.infodotMaxContentItemsCount) {
                    idx = item.data.order;
                } else if(typeof item.data.guid !== 'undefined' && item.data.guid !== null) {
                    idx = this.exhibit.contentItems.map(function (ci) {
                        return ci.guid;
                    }).indexOf(item.data.guid);
                } else {
                    idx = -1;
                }
                if(idx >= 0) {
                    this.exhibit.contentItems.splice(idx, 1);
                    for(var i = 0; i < this.exhibit.contentItems.length; i++) {
                        this.exhibit.contentItems[i].order = i;
                    }
                    this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                    CZ.Common.vc.virtualCanvas("requestInvalidate");
                }
            };
            FormEditExhibit.prototype.onContentItemMove = function (item, indexStart, indexStop) {
                this.isModified = true;
                var ci = this.exhibit.contentItems.splice(indexStart, 1)[0];
                this.exhibit.contentItems.splice(indexStop, 0, ci);
                for(var i = 0; i < this.exhibit.contentItems.length; i++) {
                    this.exhibit.contentItems[i].order = i;
                }
                this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                CZ.Common.vc.virtualCanvas("requestInvalidate");
            };
            FormEditExhibit.prototype.show = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            };
            FormEditExhibit.prototype.hide = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            FormEditExhibit.prototype.close = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                var _this = this;
                if(this.isModified) {
                    if(window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    } else {
                        return;
                    }
                }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.datePicker.remove();
                        _this.contentItemsListBox.clear();
                        _this.titleInput.hideError();
                    }
                });
                if(this.isCancel) {
                    if(this.mode === "createExhibit") {
                        CZ.VCContent.removeChild(this.exhibit.parent, this.exhibit.id);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    } else if(this.mode === "editExhibit") {
                        delete this.exhibit.contentItems;
                        $.extend(this.exhibit, this.exhibitCopy);
                        this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                        CZ.Common.vc.virtualCanvas("requestInvalidate");
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            };
            return FormEditExhibit;
        })(UI.FormUpdateEntity);
        UI.FormEditExhibit = FormEditExhibit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditCI = (function (_super) {
            __extends(FormEditCI, _super);
            function FormEditCI(container, formInfo) {
                var _this = this;
                        _super.call(this, container, formInfo);
                this.titleTextblock = container.find(formInfo.titleTextblock);
                this.titleInput = container.find(formInfo.titleInput);
                this.mediaInput = container.find(formInfo.mediaInput);
                this.mediaSourceInput = container.find(formInfo.mediaSourceInput);
                this.mediaTypeInput = container.find(formInfo.mediaTypeInput);
                this.attributionInput = container.find(formInfo.attributionInput);
                this.descriptionInput = container.find(formInfo.descriptionInput);
                this.errorMessage = container.find(formInfo.errorMessage);
                this.saveButton = container.find(formInfo.saveButton);
                this.mediaListContainer = container.find(formInfo.mediaListContainer);
                this.titleInput.focus(function () {
                    _this.titleInput.hideError();
                });
                this.mediaInput.focus(function () {
                    _this.mediaInput.hideError();
                });
                this.mediaSourceInput.focus(function () {
                    _this.mediaSourceInput.hideError();
                });
                this.prevForm = formInfo.prevForm;
                this.exhibit = formInfo.context.exhibit;
                this.contentItem = formInfo.context.contentItem;
                this.mode = CZ.Authoring.mode;
                this.isCancel = true;
                this.isModified = false;
                this.initUI();
            }
            FormEditCI.prototype.initUI = function () {
                var _this = this;
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem);
                var that = this;
                this.saveButton.prop('disabled', false);
                this.titleInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaSourceInput.change(function () {
                    _this.isModified = true;
                });
                this.mediaTypeInput.change(function () {
                    _this.isModified = true;
                });
                this.attributionInput.change(function () {
                    _this.isModified = true;
                });
                this.descriptionInput.change(function () {
                    _this.isModified = true;
                });
                this.descriptionInput.on('keyup', function (e) {
                    if(e.which == 13) {
                        that.saveButton.click(function () {
                            return that.onSave();
                        });
                    }
                });
                this.descriptionInput.on('keydown', function (e) {
                    if(e.which == 13) {
                        that.saveButton.off();
                    }
                });
                if(CZ.Media.SkyDriveMediaPicker.isEnabled && this.mediaTypeInput.find("option[value='skydrive-image']").length === 0) {
                    $("<option></option>", {
                        value: "skydrive-image",
                        text: " Skydrive Image "
                    }).appendTo(this.mediaTypeInput);
                    $("<option></option>", {
                        value: "skydrive-document",
                        text: " Skydrive Document "
                    }).appendTo(this.mediaTypeInput);
                }
                this.titleInput.val(this.contentItem.title || "");
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "");
                this.descriptionInput.val(this.contentItem.description || "");
                this.saveButton.off();
                this.saveButton.click(function () {
                    return _this.onSave();
                });
                if(CZ.Authoring.contentItemMode === "createContentItem") {
                    this.titleTextblock.text("Create New");
                    this.saveButton.text("create artifiact");
                    this.closeButton.hide();
                } else if(CZ.Authoring.contentItemMode === "editContentItem") {
                    this.titleTextblock.text("Edit");
                    this.saveButton.text("update artifact");
                    if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                        this.closeButton.hide();
                    } else {
                        this.closeButton.show();
                    }
                } else {
                    console.log("Unexpected authoring mode in content item form.");
                    this.close();
                }
                this.saveButton.show();
            };
            FormEditCI.prototype.onSave = function () {
                var _this = this;
                var newContentItem = {
                    title: this.titleInput.val() || "",
                    uri: this.mediaInput.val() || "",
                    mediaSource: this.mediaSourceInput.val() || "",
                    mediaType: this.mediaTypeInput.val() || "",
                    attribution: this.attributionInput.val() || "",
                    description: this.descriptionInput.val() || "",
                    order: this.contentItem.order
                };
                if(!CZ.Authoring.isNotEmpty(newContentItem.title)) {
                    this.titleInput.showError("Title can't be empty");
                }
                if(!CZ.Authoring.isNotEmpty(newContentItem.uri)) {
                    this.mediaInput.showError("URL can't be empty");
                }
                if(CZ.Authoring.validateContentItems([
                    newContentItem
                ], this.mediaInput)) {
                    if(CZ.Authoring.contentItemMode === "createContentItem") {
                        if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            (this.prevForm).contentItemsListBox.add(newContentItem);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        }
                    } else if(CZ.Authoring.contentItemMode === "editContentItem") {
                        if(this.prevForm && this.prevForm instanceof UI.FormEditExhibit) {
                            this.isCancel = false;
                            var clickedListItem = (this.prevForm).clickedListItem;
                            clickedListItem.iconImg.attr("src", newContentItem.uri);
                            clickedListItem.titleTextblock.text(newContentItem.title);
                            clickedListItem.descrTextblock.text(newContentItem.description);
                            $.extend(this.exhibit.contentItems[this.contentItem.order], newContentItem);
                            (this.prevForm).exhibit = this.exhibit = CZ.Authoring.renewExhibit(this.exhibit);
                            (this.prevForm).isModified = true;
                            CZ.Common.vc.virtualCanvas("requestInvalidate");
                            this.isModified = false;
                            this.back();
                        } else {
                            this.saveButton.prop('disabled', true);
                            CZ.Authoring.updateContentItem(this.exhibit, this.contentItem, newContentItem).then(function (response) {
                                _this.isCancel = false;
                                _this.isModified = false;
                                _this.close();
                            }, function (error) {
                                var errorMessage = error.statusText;
                                if(errorMessage.match(/Media Source/)) {
                                    _this.errorMessage.text("One or more fields filled wrong");
                                    _this.mediaSourceInput.showError("Media Source URL is not a valid URL");
                                } else {
                                    _this.errorMessage.text("Sorry, internal server error :(");
                                }
                                _this.errorMessage.show().delay(7000).fadeOut();
                            }).always(function () {
                                _this.saveButton.prop('disabled', false);
                            });
                        }
                    }
                } else {
                    this.errorMessage.text("One or more fields filled wrong").show().delay(7000).fadeOut();
                }
            };
            FormEditCI.prototype.updateMediaInfo = function () {
                this.mediaInput.val(this.contentItem.uri || "");
                this.mediaSourceInput.val(this.contentItem.mediaSource || "");
                this.mediaTypeInput.val(this.contentItem.mediaType || "");
                this.attributionInput.val(this.contentItem.attribution || "");
            };
            FormEditCI.prototype.show = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                CZ.Authoring.isActive = true;
                this.activationSource.addClass("active");
                this.errorMessage.hide();
                _super.prototype.show.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            };
            FormEditCI.prototype.close = function (noAnimation) {
                if (typeof noAnimation === "undefined") { noAnimation = false; }
                var _this = this;
                if(this.isModified) {
                    if(window.confirm("There is unsaved data. Do you want to close without saving?")) {
                        this.isModified = false;
                    } else {
                        return;
                    }
                }
                _super.prototype.close.call(this, noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.mediaList.remove();
                        _this.mediaInput.hideError();
                        _this.titleInput.hideError();
                        _this.mediaSourceInput.hideError();
                    }
                });
                if(this.isCancel) {
                    if(CZ.Authoring.contentItemMode === "createContentItem") {
                        this.exhibit.contentItems.pop();
                    }
                }
                this.activationSource.removeClass("active");
                CZ.Authoring.isActive = false;
            };
            return FormEditCI;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCI = FormEditCI;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderEdit = (function (_super) {
            __extends(FormHeaderEdit, _super);
            function FormHeaderEdit(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.createTimelineBtn = this.container.find(formInfo.createTimeline);
                this.createExhibitBtn = this.container.find(formInfo.createExhibit);
                this.createTourBtn = this.container.find(formInfo.createTour);
                this.initialize();
            }
            FormHeaderEdit.prototype.initialize = function () {
                var _this = this;
                this.createTimelineBtn.off();
                this.createExhibitBtn.off();
                this.createTourBtn.off();
                this.createTimelineBtn.click(function (event) {
                    CZ.Authoring.UI.createTimeline();
                    _this.close();
                });
                this.createExhibitBtn.click(function (event) {
                    CZ.Authoring.UI.createExhibit();
                    _this.close();
                });
                this.createTourBtn.click(function (event) {
                    CZ.Authoring.UI.createTour();
                    _this.close();
                });
            };
            FormHeaderEdit.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormHeaderEdit.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderEdit;
        })(CZ.UI.FormBase);
        UI.FormHeaderEdit = FormHeaderEdit;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditProfile = (function (_super) {
            __extends(FormEditProfile, _super);
            function FormEditProfile(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.saveButton = container.find(formInfo.saveButton);
                this.logoutButton = container.find(formInfo.logoutButton);
                this.usernameInput = container.find(formInfo.usernameInput);
                this.emailInput = container.find(formInfo.emailInput);
                this.agreeInput = container.find(formInfo.agreeInput);
                this.loginPanel = $(document.body).find(formInfo.loginPanel).first();
                this.profilePanel = $(document.body).find(formInfo.profilePanel).first();
                this.loginPanelLogin = $(document.body).find(formInfo.loginPanelLogin).first();
                this.allowRedirect = formInfo.allowRedirect;
                this.collectionTheme = formInfo.collectionTheme;
                this.collectionThemeInput = container.find(formInfo.collectionThemeInput);
                this.collectionThemeWrapper = container.find(formInfo.collectionThemeWrapper);
                this.usernameInput.off("keypress");
                this.emailInput.off("keypress");
                this.initialize();
            }
            FormEditProfile.prototype.validEmail = function (e) {
                if(String(e).length > 254) {
                    return false;
                }
                var filter = /^([\w^_]+((?:([-_.\+][\w^_]+)|))+|(xn--[\w^_]+))@([\w^_]+(?:(-+[\w^_]+)|)|(xn--[\w^_]+))(?:\.([\w^_]+(?:([\w-_\.\+][\w^_]+)|)|(xn--[\w^_]+)))$/i;
                return String(e).search(filter) != -1;
            };
            FormEditProfile.prototype.validUsername = function (e) {
                var filter = /^[a-z0-9\-_]{4,20}$/i;
                return String(e).search(filter) != -1;
            };
            FormEditProfile.prototype.initialize = function () {
                var _this = this;
                var profile = CZ.Service.getProfile();
                if(this.collectionThemeWrapper) {
                    this.collectionThemeWrapper.show();
                }
                profile.done(function (data) {
                    if(data.DisplayName != null) {
                        _this.usernameInput.val(data.DisplayName);
                        if(data.DisplayName != "") {
                            _this.usernameInput.prop('disabled', true);
                        }
                        _this.emailInput.val(data.Email);
                        if(data.Email !== undefined && data.Email !== '' && data.Email != null) {
                            _this.agreeInput.attr('checked', true);
                            _this.agreeInput.prop('disabled', true);
                        }
                    }
                });
                this.saveButton.click(function (event) {
                    var isValid = _this.validUsername(_this.usernameInput.val());
                    if(!isValid) {
                        alert("Provided incorrect username, \n'a-z', '0-9', '-', '_' - characters allowed only. ");
                        return;
                    }
                    var emailAddress = "";
                    if(_this.emailInput.val()) {
                        var emailIsValid = _this.validEmail(_this.emailInput.val());
                        if(!emailIsValid) {
                            alert("Provided incorrect email address");
                            return;
                        }
                        var agreeTerms = _this.agreeInput.prop("checked");
                        if(!agreeTerms) {
                            alert("Please agree with provided terms");
                            return;
                        }
                        emailAddress = _this.emailInput.val();
                    }
                    _this.collectionTheme = _this.collectionThemeInput.val();
                    CZ.Service.getProfile().done(function (curUser) {
                        CZ.Service.getProfile(_this.usernameInput.val()).done(function (getUser) {
                            if(curUser.DisplayName == null && typeof getUser.DisplayName != "undefined") {
                                alert("Sorry, this username is already in use. Please try again.");
                                return;
                            }
                            CZ.Service.putProfile(_this.usernameInput.val(), emailAddress).then(function (success) {
                                if(_this.collectionTheme) {
                                    CZ.Service.putCollection(_this.usernameInput.val(), _this.usernameInput.val(), {
                                        theme: _this.collectionTheme
                                    }).then(function () {
                                        if(_this.allowRedirect) {
                                            window.location.assign("/" + success);
                                        } else {
                                            _this.close();
                                        }
                                    });
                                } else {
                                    if(_this.allowRedirect) {
                                        window.location.assign("/" + success);
                                    } else {
                                        _this.close();
                                    }
                                }
                            }, function (error) {
                                alert("Unable to save changes. Please try again later.");
                                console.log(error);
                            });
                        });
                    });
                });
                this.logoutButton.click(function (event) {
                    WL.logout();
                    window.location.assign("/pages/logoff.aspx");
                });
                var preventEnterKeyPress = function (event) {
                    if(event.which == 13) {
                        event.preventDefault();
                    }
                };
                this.usernameInput.keypress(preventEnterKeyPress);
                this.emailInput.keypress(preventEnterKeyPress);
            };
            FormEditProfile.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.collectionThemeInput.val(this.collectionTheme);
                this.activationSource.addClass("active");
            };
            FormEditProfile.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            FormEditProfile.prototype.setTheme = function (theme) {
                this.collectionTheme = theme;
            };
            return FormEditProfile;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditProfile = FormEditProfile;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormLogin = (function (_super) {
            __extends(FormLogin, _super);
            function FormLogin(container, formInfo) {
                        _super.call(this, container, formInfo);
            }
            FormLogin.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            FormLogin.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormLogin;
        })(CZ.UI.FormBase);
        UI.FormLogin = FormLogin;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderSearch = (function (_super) {
            __extends(FormHeaderSearch, _super);
            function FormHeaderSearch(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.searchTextbox = container.find(formInfo.searchTextbox);
                this.searchResultsBox = container.find(formInfo.searchResultsBox);
                this.progressBar = container.find(formInfo.progressBar);
                this.resultSections = container.find(formInfo.resultSections);
                this.resultsCountTextblock = container.find(formInfo.resultsCountTextblock);
                this.initialize();
            }
            FormHeaderSearch.prototype.initialize = function () {
                var _this = this;
                this.fillFormWithSearchResults();
                this.searchResults = [];
                this.progressBar.css("opacity", 0);
                this.hideResultsCount();
                this.clearResultSections();
                this.hideSearchResults();
                this.searchTextbox.off();
                var onSearchQueryChanged = function (event) {
                    clearTimeout(_this.delayedSearchRequest);
                    _this.delayedSearchRequest = setTimeout(function () {
                        var query = _this.searchTextbox.val();
                        query = _this.escapeSearchQuery(query);
                        _this.showProgressBar();
                        _this.sendSearchQuery(query).then(function (response) {
                            _this.hideProgressBar();
                            _this.searchResults = response ? response.d : response;
                            _this.updateSearchResults();
                        }, function (error) {
                            console.log("Error connecting to service: search.\n" + error.responseText);
                        });
                    }, 300);
                };
                this.searchTextbox.on("input search", onSearchQueryChanged);
                var isIE9 = (CZ.Settings.ie === 9);
                if(isIE9) {
                    this.searchTextbox.on("keyup", function (event) {
                        switch(event.which) {
                            case 8:
                            case 46:
                                onSearchQueryChanged(event);
                                break;
                        }
                    });
                    this.searchTextbox.on("cut", onSearchQueryChanged);
                }
            };
            FormHeaderSearch.prototype.sendSearchQuery = function (query) {
                return (query === "") ? $.Deferred().resolve(null).promise() : CZ.Service.getSearch(query);
            };
            FormHeaderSearch.prototype.updateSearchResults = function () {
                var _this = this;
                this.clearResultSections();
                if(this.searchResults === null) {
                    this.hideSearchResults();
                    return;
                }
                if(this.searchResults.length === 0) {
                    this.showNoResults();
                    return;
                }
                var resultTypes = {
                    0: "exhibit",
                    1: "timeline",
                    2: "contentItem"
                };
                var sections = {
                    exhibit: $(this.resultSections[1]),
                    timeline: $(this.resultSections[0]),
                    contentItem: $(this.resultSections[2])
                };
                var idPrefixes = {
                    exhibit: "e",
                    timeline: "t",
                    contentItem: ""
                };
                this.searchResults.forEach(function (item) {
                    var form = _this;
                    var resultType = resultTypes[item.objectType];
                    var resultId = idPrefixes[resultType] + item.id;
                    var resultTitle = item.title;
                    sections[resultType].append($("<div></div>", {
                        class: "cz-form-search-result",
                        text: resultTitle,
                        "result-id": resultId,
                        "result-type": resultType,
                        click: function () {
                            var self = $(this);
                            CZ.Search.goToSearchResult(self.attr("result-id"), self.attr("result-type"));
                            form.close();
                        }
                    }));
                });
                this.showResultsCount();
                this.showNonEmptySections();
            };
            FormHeaderSearch.prototype.fillFormWithSearchResults = function () {
                this.container.show();
                this.searchResultsBox.css("height", "calc(100% - 150px)");
                this.searchResultsBox.css("height", "-moz-calc(100% - 150px)");
                this.searchResultsBox.css("height", "-webkit-calc(100% - 150px)");
                this.searchResultsBox.css("height", "-o-calc(100% - 150px)");
                this.container.hide();
            };
            FormHeaderSearch.prototype.clearResultSections = function () {
                this.resultSections.find("div").remove();
            };
            FormHeaderSearch.prototype.escapeSearchQuery = function (query) {
                return query ? query.replace(/"/g, "") : "";
            };
            FormHeaderSearch.prototype.getResultsCountString = function () {
                var count = this.searchResults.length;
                return count + ((count === 1) ? " result" : " results");
            };
            FormHeaderSearch.prototype.showProgressBar = function () {
                this.progressBar.animate({
                    opacity: 1
                });
            };
            FormHeaderSearch.prototype.hideProgressBar = function () {
                this.progressBar.animate({
                    opacity: 0
                });
            };
            FormHeaderSearch.prototype.showNonEmptySections = function () {
                this.searchResultsBox.show();
                this.resultSections.show();
                this.resultSections.each(function (i, item) {
                    var results = $(item).find("div");
                    if(results.length === 0) {
                        $(item).hide();
                    }
                });
            };
            FormHeaderSearch.prototype.showNoResults = function () {
                this.searchResultsBox.show();
                this.resultSections.hide();
                this.resultsCountTextblock.show();
                this.resultsCountTextblock.text("No results");
            };
            FormHeaderSearch.prototype.showResultsCount = function () {
                this.searchResultsBox.show();
                this.resultsCountTextblock.show();
                this.resultsCountTextblock.text(this.getResultsCountString());
            };
            FormHeaderSearch.prototype.hideResultsCount = function () {
                this.resultsCountTextblock.hide();
            };
            FormHeaderSearch.prototype.hideSearchResults = function () {
                this.hideResultsCount();
                this.searchResultsBox.hide();
            };
            FormHeaderSearch.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.searchTextbox.focus();
                    }
                });
                this.activationSource.addClass("active");
            };
            FormHeaderSearch.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderSearch;
        })(CZ.UI.FormBase);
        UI.FormHeaderSearch = FormHeaderSearch;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var TimeSeriesDataForm = (function (_super) {
            __extends(TimeSeriesDataForm, _super);
            function TimeSeriesDataForm(container, formInfo) {
                        _super.call(this, container, formInfo);
                var existingTimSeriesList = $("#existingTimeSeries");
                if(existingTimSeriesList.children().length == 0) {
                    var preloadedlist;
                    $.ajax({
                        cache: false,
                        type: "GET",
                        async: false,
                        dataType: "JSON",
                        url: '/dumps/timeseries-preloaded.txt',
                        success: function (result) {
                            preloadedlist = result.d;
                        },
                        error: function (xhr) {
                            alert("Error fetching pre-loaded timeseries list: " + xhr.responseText);
                        }
                    });
                    preloadedlist.forEach(function (preloaded) {
                        var li = $('<li></li>').css("margin-left", 10).css("margin-bottom", "3px").height(22).appendTo(existingTimSeriesList);
                        var link = $('<a></a>').addClass("cz-form-preloadedrecord").appendTo(li);
                        link.css("color", "#0464a2");
                        link.css("font-size", "16px");
                        link.css("float", "left");
                        link.css("width", "140px");
                        link.css("cursor", "pointer");
                        link.text(preloaded.name);
                        var div = $("<span></span>").addClass("cz-form-preloadedrecord").appendTo(li);
                        div.text("Source:");
                        var sourceDiv = $("<a></a>").addClass("cz-form-preloadedrecord").appendTo(li);
                        sourceDiv.css("color", "#0464a2");
                        sourceDiv.css("cursor", "pointer");
                        sourceDiv.text(preloaded.source);
                        sourceDiv.prop("href", preloaded.link);
                        link.click(function (e) {
                            var data;
                            $.ajax({
                                cache: false,
                                type: "GET",
                                async: false,
                                dataType: "text",
                                url: preloaded.file,
                                success: function (result) {
                                    data = result;
                                },
                                error: function (xhr) {
                                    alert("Error fetching timeSeries Data: " + xhr.responseText);
                                }
                            });
                            var dataSet = undefined;
                            try  {
                                dataSet = CZ.Data.csvToDataSet(data, preloaded.delimiter, preloaded.source);
                            } catch (err) {
                                alert(err);
                                return;
                            }
                            CZ.HomePageViewModel.showTimeSeriesChart();
                            CZ.rightDataSet = dataSet;
                            var vp = CZ.Common.vc.virtualCanvas("getViewport");
                            CZ.HomePageViewModel.updateTimeSeriesChart(vp);
                        });
                    });
                }
                this.input = $("#fileLoader");
                var that = this;
                $("#fileLoader").change(function () {
                    var fl = $("#fileLoader");
                    $("#selectedFile").text(fl[0].files[0].name);
                });
                if(this.checkFileLoadCompatibility()) {
                    $("#loadDataBtn").click(function () {
                        var fr = that.openFile({
                            "onload": function (e) {
                                that.updateUserData(fr.result);
                            }
                        });
                    });
                } else {
                    $("#uploadDataCnt").hide();
                }
            }
            TimeSeriesDataForm.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.addClass("active");
            };
            TimeSeriesDataForm.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "right",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            TimeSeriesDataForm.prototype.checkFileLoadCompatibility = function () {
                return window['File'] && window['FileReader'] && window['FileList'] && window['Blob'];
            };
            TimeSeriesDataForm.prototype.openFile = function (callbacks) {
                var file = this.input[0].files[0];
                var fileReader = new FileReader();
                fileReader.onloadstart = callbacks["onloadstart"];
                fileReader.onerror = callbacks["onerror"];
                fileReader.onabort = callbacks["onabort"];
                fileReader.onload = callbacks["onload"];
                fileReader.onloadend = callbacks["onloadend"];
                fileReader.readAsText(file);
                return fileReader;
            };
            TimeSeriesDataForm.prototype.updateUserData = function (csvString) {
                var dataSet = undefined;
                var delimValue = $("#delim").prop("value");
                if(delimValue === "tab") {
                    delimValue = "\t";
                } else if(delimValue === "space") {
                    delimValue = " ";
                }
                try  {
                    dataSet = CZ.Data.csvToDataSet(csvString, delimValue, this.input[0].files[0].name);
                } catch (err) {
                    alert(err);
                    return;
                }
                CZ.HomePageViewModel.showTimeSeriesChart();
                CZ.leftDataSet = dataSet;
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                CZ.HomePageViewModel.updateTimeSeriesChart(vp);
            };
            return TimeSeriesDataForm;
        })(CZ.UI.FormBase);
        UI.TimeSeriesDataForm = TimeSeriesDataForm;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var MessageWindow = (function (_super) {
            __extends(MessageWindow, _super);
            function MessageWindow(container, message, title) {
                        _super.call(this, container, {
            activationSource: null,
            prevForm: null,
            navButton: ".cz-form-nav",
            closeButton: ".cz-form-close-btn > .cz-form-btn",
            titleTextblock: ".cz-form-title",
            contentContainer: ".cz-form-content"
        });
                this.tourTitleInput = this.container.find(".cz-form-label");
                this.titleTextblock.text(title || "ChronoZoom");
                this.tourTitleInput.text(message);
                this.setHeight();
            }
            MessageWindow.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: function () {
                        $(document).on("keyup", _this, _this.onDocumentKeyPress);
                    }
                });
            };
            MessageWindow.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 300,
                    complete: function () {
                        $(document).off("keyup", _this.onDocumentKeyPress);
                    }
                });
            };
            MessageWindow.prototype.onDocumentKeyPress = function (e) {
                var self = e.data;
                if(e.which == 27 && self.isFormVisible) {
                    self.closeButton.click();
                }
            };
            MessageWindow.prototype.setHeight = function () {
                this.container.show();
                var messageHeight = this.tourTitleInput.outerHeight(true);
                this.contentContainer.height(messageHeight);
                this.container.hide();
            };
            return MessageWindow;
        })(CZ.UI.FormBase);
        UI.MessageWindow = MessageWindow;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormHeaderSessionExpired = (function (_super) {
            __extends(FormHeaderSessionExpired, _super);
            function FormHeaderSessionExpired(container, formInfo) {
                        _super.call(this, container, formInfo);
                this.time = 60;
                this.sessionTimeSpan = container.find(formInfo.sessionTimeSpan);
                this.sessionButton = container.find(formInfo.sessionButton);
                this.initialize();
            }
            FormHeaderSessionExpired.prototype.initialize = function () {
                var _this = this;
                this.sessionButton.click(function () {
                    CZ.Service.getProfile();
                    clearTimeout(_this.timer);
                    _this.time = 60;
                    _this.close();
                    _this.sessionTimeSpan.html(_this.time.toString());
                    CZ.Authoring.resetSessionTimer();
                    return false;
                });
            };
            FormHeaderSessionExpired.prototype.onTimer = function () {
                var _this = this;
                if(this.time > 0) {
                    this.time--;
                    this.sessionTimeSpan.html(this.time.toString());
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function () {
                        _this.onTimer();
                    }, 1000);
                } else {
                    clearTimeout(this.timer);
                    this.close();
                    document.location.href = "/account/logout";
                }
            };
            FormHeaderSessionExpired.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });
                this.timer = setTimeout(function () {
                    _this.onTimer();
                }, 1000);
                this.activationSource.addClass("active");
            };
            FormHeaderSessionExpired.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            };
            return FormHeaderSessionExpired;
        })(CZ.UI.FormBase);
        UI.FormHeaderSessionExpired = FormHeaderSessionExpired;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (UI) {
        var FormMediaPicker = (function (_super) {
            __extends(FormMediaPicker, _super);
            function FormMediaPicker(container, mediaPickerContainer, title, formInfo) {
                        _super.call(this, container, formInfo);
                this.titleTextblock.text(title);
                this.contentContainer.append(mediaPickerContainer);
                $(this).off();
            }
            FormMediaPicker.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        $(_this).trigger("showcompleted");
                    }
                });
                this.activationSource.addClass("active");
            };
            FormMediaPicker.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        $(_this).trigger("closecompleted");
                    }
                });
                this.activationSource.removeClass("active");
            };
            return FormMediaPicker;
        })(CZ.UI.FormBase);
        UI.FormMediaPicker = FormMediaPicker;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
var CZ;
(function (CZ) {
    (function (StartPage) {
        var _isRegimesVisible;
        StartPage.tileData = [
            {
                "Idx": 0,
                "Title": "Big History",
                "Thumbnail": "../images/dummy/tile_bighistory.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999998954347&y=-0.46459331778482354&w=3.841695822797034e-12&h=3.7430627449314544e-12"
            }, 
            {
                "Idx": 1,
                "Title": "CERN",
                "Thumbnail": "../images/dummy/tile_cern.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999192440875&y=-0.4645933209201501&w=3.729306137185042e-11&h=3.633558592459924e-11"
            }, 
            {
                "Idx": 2,
                "Title": "Earth Science",
                "Thumbnail": "../images/dummy/tile_earthscience.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999988061194&y=-0.46459331795948755&w=4.546120315559252e-12&h=4.4294015903520115e-12"
            }, 
            {
                "Idx": 3,
                "Title": "King Tut",
                "Thumbnail": "../images/dummy/tile_kingtut.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999967062717304&y=-0.4645931999741229&w=3.5221148563086766e-10&h=3.4316868149181225e-10"
            }, 
            {
                "Idx": 4,
                "Title": "Napoleon",
                "Thumbnail": "../images/dummy/tile_napoleon.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999840411981&y=-0.46459346560505227&w=5.935054278147061e-10&h=5.782675563705605e-10"
            }, 
            {
                "Idx": 5,
                "Title": "World War I",
                "Thumbnail": "../images/dummy/tile_ww1.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999999485392826&y=-0.4645933221621095&w=3.314938789411939e-12&h=3.229829860746773e-12"
            }, 
            {
                "Idx": 6,
                "Title": "Coluseum",
                "Thumbnail": "../images/dummy/tile_colosseum.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.49999988732590944&y=-0.4645934478931077&w=1.0069124184819225e-9&h=9.810605875309654e-10"
            }, 
            {
                "Idx": 7,
                "Title": "Justin Morrill",
                "Thumbnail": "../images/dummy/tile_justin_morrill.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4999999897945675&y=-0.46459338150077905&w=1.9362194151655837e-10&h=1.8865082227261387e-10"
            }, 
            {
                "Idx": 8,
                "Title": "Big History 2",
                "Thumbnail": "../images/dummy/tile_bighistory.jpg",
                "Author": "Some Author",
                "URL": "http://www.chronozoom.com/#/t00000000-0000-0000-0000-000000000000@x=0.4996898109169686&y=-0.46442779133805834&w=0.0007080832576286593&h=0.0006899036738441856"
            }
        ];
        StartPage.tileLayout = [
            {
                "Name": "#combo0-icons",
                "Visibility": [
                    "box", 
                    "box", 
                    "box ex3", 
                    "box ex3 ex4", 
                    "box ex3 ex4 ex6", 
                    "box ex3 ex4 ex6"
                ]
            }, 
            {
                "Name": "#FeaturedTimelinesBlock-tiles",
                "Visibility": [
                    "box", 
                    "box", 
                    "box ex3", 
                    "box ex3 ex4", 
                    "box ex3 ex4 ex6", 
                    "box ex3 ex4 ex6"
                ]
            }, 
            {
                "Name": "#TwitterBlock",
                "Visibility": [
                    "box", 
                    "box", 
                    "box ex3", 
                    "box ex3 ex4", 
                    "box ex3 ex4 ex6", 
                    "box ex3 ex4 ex6"
                ]
            }, 
            
        ];
        function resizeCrop($image, imageProps) {
            var $startPage = $("#start-page");
            var width = $image.parent().width();
            var height = $image.parent().height();
            if(!$startPage.is(":visible")) {
                $startPage.show();
                width = $image.width();
                height = $image.height();
                $startPage.hide();
            }
            var naturalHeight = imageProps.naturalHeight;
            var naturalWidth = imageProps.naturalWidth;
            var ratio = naturalWidth / naturalHeight;
            var marginTop = 0;
            var marginLeft = 0;
            if(naturalWidth > naturalHeight) {
                $image.height(height);
                $image.width(height * ratio);
                marginLeft = ($image.width() - width) / 2;
            } else if(naturalWidth < naturalHeight) {
                $image.width(width);
                $image.height(width / ratio);
                marginTop = ($image.height() - height) / 2;
            } else {
                $image.width(width);
                $image.height(height);
            }
            $image.css({
                "margin-top": -marginTop + "px",
                "margin-left": -marginLeft + "px"
            });
        }
        function cloneTileTemplate(template, target, idx) {
            for(var i = 0; i < target[idx].Visibility.length; i++) {
                var o = $(template).clone(true, true).appendTo(target[idx].Name);
                o.attr("class", target[idx].Visibility[i]);
                o.attr("id", "t" + idx + "i" + i);
                $("#t" + idx + "i" + i + " .boxInner .tile-photo img").attr("src", StartPage.tileData[i].Thumbnail).attr("alt", StartPage.tileData[i].Title);
                $("#t" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-title").text(StartPage.tileData[i].Title);
                $("#t" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-author").text(StartPage.tileData[i].Author);
            }
        }
        StartPage.cloneTileTemplate = cloneTileTemplate;
        function cloneListTemplate(template, target, idx) {
            for(var i = 0; i < StartPage.tileData.length; i++) {
                var o = $(template).clone(true, true).appendTo(target);
                o.attr("id", "l" + idx + "i" + i);
                $("#l" + idx + "i" + i + " .li-title a").attr("href", StartPage.tileData[i].URL);
                $("#l" + idx + "i" + i + " .li-title a").text(StartPage.tileData[i].Title);
                $("#l" + idx + "i" + i + " .li-author").text(StartPage.tileData[i].Author);
                $("#l" + idx + "i" + i + " .li-icon").text(StartPage.tileData[i].Thumbnail);
            }
        }
        StartPage.cloneListTemplate = cloneListTemplate;
        function cloneTweetTemplate(template, target, idx) {
            for(var i = 0; i < target[idx].Visibility.length; i++) {
                var o = $(template).clone(true, true).appendTo(target[idx].Name);
                o.attr("class", target[idx].Visibility[i]);
                o.attr("id", "m" + idx + "i" + i);
            }
        }
        StartPage.cloneTweetTemplate = cloneTweetTemplate;
        function PlayIntroTour() {
            var intoTour = CZ.Tours.tours[0];
            if(typeof intoTour === "undefined") {
                return false;
            }
            CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption(CZ.Tours.tourCaptionFormContainer, {
                activationSource: $(".tour-icon"),
                navButton: ".cz-form-nav",
                closeButton: ".cz-tour-form-close-btn > .cz-form-btn",
                titleTextblock: ".cz-tour-form-title",
                contentContainer: ".cz-form-content",
                minButton: ".cz-tour-form-min-btn > .cz-form-btn",
                captionTextarea: ".cz-form-tour-caption",
                tourPlayerContainer: ".cz-form-tour-player",
                bookmarksCount: ".cz-form-tour-bookmarks-count",
                narrationToggle: ".cz-toggle-narration",
                context: intoTour
            });
            CZ.Tours.tourCaptionForm.show();
            CZ.Tours.activateTour(intoTour, undefined);
        }
        StartPage.PlayIntroTour = PlayIntroTour;
        function TwitterLayout(target, idx) {
            CZ.Service.getRecentTweets().done(function (response) {
                for(var i = 0, len = response.d.length; i < len; ++i) {
                    var text = response.d[i].Text;
                    var author = response.d[i].User.Name;
                    var time = response.d[i].CreatedDate;
                    var myDate = new Date(time.match(/\d+/)[0] * 1);
                    var convertedDate = myDate.toLocaleTimeString() + "; " + myDate.getDate();
                    convertedDate += "." + myDate.getMonth() + "." + myDate.getFullYear();
                    $("#m" + idx + "i" + i + " .boxInner .tile-meta .tweet-meta-text").text(text);
                    $("#m" + idx + "i" + i + " .boxInner .tile-meta .tweet-meta-author").text(author);
                    $("#m" + idx + "i" + i + " .boxInner .tile-meta .tile-meta-time").text(convertedDate);
                }
            });
        }
        StartPage.TwitterLayout = TwitterLayout;
        function listFlip(name) {
            if('block' != document.getElementById(name + '-list').style.display) {
                document.getElementById(name + '-list').style.display = 'block';
                document.getElementById(name + '-tiles').style.display = 'none';
                $("#" + name).find(".list-view-icon").addClass("active");
            } else {
                document.getElementById(name + '-list').style.display = 'none';
                document.getElementById(name + '-tiles').style.display = 'block';
                $("#" + name).find(".list-view-icon").removeClass("active");
            }
        }
        StartPage.listFlip = listFlip;
        function fillFeaturedTimelines(timelines) {
            var $template = $("#template-tile .box");
            var layout = CZ.StartPage.tileLayout[1];
            for(var i = 0, len = Math.min(layout.Visibility.length, timelines.length); i < len; i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;
                var $startPage = $("#start-page");
                var $tile = $template.clone(true, true);
                var $tileImage = $tile.find(".boxInner .tile-photo img");
                var $tileTitle = $tile.find(".boxInner .tile-meta .tile-meta-title");
                var $tileAuthor = $tile.find(".boxInner .tile-meta .tile-meta-author");
                $tile.appendTo(layout.Name).addClass(layout.Visibility[i]).attr("id", "featured" + i).click(timelineUrl, function (event) {
                    window.location.href = event.data;
                    hide();
                }).invisible();
                $tileImage.load($tile, function (event) {
                    var $this = $(this);
                    var imageProps = event.srcElement;
                    resizeCrop($this, imageProps);
                    $(window).resize({
                        $image: $this,
                        imageProps: imageProps
                    }, function (event) {
                        resizeCrop(event.data.$image, event.data.imageProps);
                    });
                    setTimeout(function () {
                        event.data.visible();
                    }, 0);
                }).attr({
                    src: timeline.ImageUrl,
                    alt: timeline.Title
                });
                $tileTitle.text(timeline.Title);
                $tileAuthor.text(timeline.Author);
            }
        }
        StartPage.fillFeaturedTimelines = fillFeaturedTimelines;
        function fillFeaturedTimelinesList(timelines) {
            var template = "#template-list .list-item";
            var target = "#FeaturedTimelinesBlock-list";
            for(var i = 0; i < Math.min(StartPage.tileData.length, timelines.length); i++) {
                var timeline = timelines[i];
                var timelineUrl = timeline.TimelineUrl;
                var TemplateClone = $(template).clone(true, true).appendTo(target);
                var Name = "featured-list-elem" + i;
                var idx = 1;
                TemplateClone.attr("id", "l" + idx + "i" + i);
                $("#l" + idx + "i" + i + " .li-title a").attr("href", timelineUrl);
                $("#l" + idx + "i" + i + " .li-title a").text(timeline.Title);
                $("#l" + idx + "i" + i + " .li-author").text(timeline.Author);
            }
        }
        StartPage.fillFeaturedTimelinesList = fillFeaturedTimelinesList;
        function show() {
            var $disabledButtons = $(".tour-icon, .timeSeries-icon, .edit-icon");
            $(".home-icon").addClass("active");
            $disabledButtons.attr("disabled", "disabled").each(function (i, el) {
                var events = $(el).data("events");
                $(el).data("onclick", events && events.click && events.click[0]);
            }).off();
            $(".header-regimes").invisible();
            $(".header-breadcrumbs").invisible();
            CZ.HomePageViewModel.closeAllForms();
            $("#start-page").fadeIn();
        }
        StartPage.show = show;
        function hide() {
            var $disabledButtons = $(".tour-icon, .timeSeries-icon, .edit-icon");
            $(".home-icon").removeClass("active");
            $disabledButtons.removeAttr("disabled").each(function (i, el) {
                $(el).click($(el).data("onclick"));
            });
            if(_isRegimesVisible) {
                $(".header-regimes").visible();
            }
            $(".header-breadcrumbs").visible();
            $("#start-page").fadeOut();
        }
        StartPage.hide = hide;
        function initialize() {
            _isRegimesVisible = $(".header-regimes").is(":visible");
            $(".home-icon").click(function () {
                if($("#start-page").is(":visible")) {
                    hide();
                } else {
                    show();
                }
            });
            CZ.Service.getUserFeatured("63c4373e-6712-44a6-9bb4-b99a2783f53a").done(function (response) {
                fillFeaturedTimelines(response);
                fillFeaturedTimelinesList(response);
            });
            CZ.StartPage.cloneTweetTemplate("#template-tweet .box", CZ.StartPage.tileLayout, 2);
            CZ.StartPage.TwitterLayout(CZ.StartPage.tileLayout, 2);
            var hash = CZ.UrlNav.getURL().hash;
            if(!hash.path || hash.path === "/t" + CZ.Settings.guidEmpty && !hash.params) {
                show();
            }
        }
        StartPage.initialize = initialize;
    })(CZ.StartPage || (CZ.StartPage = {}));
    var StartPage = CZ.StartPage;
})(CZ || (CZ = {}));
(function ($) {
    $.fn.showError = function (msg, className, props) {
        className = className || "error";
        props = props || {
        };
        $.extend(true, props, {
            class: className,
            text: msg
        });
        var $errorTemplate = $("<div></div>", props).attr("error", true);
        var $allErrors = $();
        var $errorElems = $();
        var result = this.each(function () {
            var $this = $(this);
            var isDiv;
            var $div;
            var $error;
            if(!$this.data("error")) {
                isDiv = $this.is("div");
                $div = isDiv ? $this : $this.closest("div");
                $error = $errorTemplate.clone();
                $allErrors = $allErrors.add($error);
                $errorElems = $errorElems.add($this);
                $errorElems = $errorElems.add($div);
                $errorElems = $errorElems.add($div.children());
                $this.data("error", $error);
                if(isDiv) {
                    $div.append($error);
                } else {
                    $this.after($error);
                }
            }
        });
        if($allErrors.length > 0) {
            $errorElems.addClass(className);
            $allErrors.slideDown(CZ.Settings.errorMessageSlideDuration);
        }
        return result;
    };
    $.fn.hideError = function () {
        var $allErrors = $();
        var $errorElems = $();
        var classes = "";
        var result = this.each(function () {
            var $this = $(this);
            var $error = $this.data("error");
            var $div;
            var className;
            if($error) {
                $div = $this.is("div") ? $this : $this.closest("div");
                className = $error.attr("class");
                if(classes.split(" ").indexOf(className) === -1) {
                    classes += " " + className;
                }
                $allErrors = $allErrors.add($error);
                $errorElems = $errorElems.add($this);
                $errorElems = $errorElems.add($div);
                $errorElems = $errorElems.add($div.children());
            }
        });
        if($allErrors.length > 0) {
            $allErrors.slideUp(CZ.Settings.errorMessageSlideDuration).promise().done(function () {
                $allErrors.remove();
                $errorElems.removeData("error");
                $errorElems.removeClass(classes);
            });
        }
        return result;
    };
})(jQuery);
(function ($) {
    $.fn.visible = function (noTransition) {
        return this.each(function () {
            var $this = $(this);
            if(noTransition) {
                $this.addClass("no-transition");
            } else {
                $this.removeClass("no-transition");
            }
            $this.css({
                opacity: 1,
                visibility: "visible"
            });
        });
    };
    $.fn.invisible = function (noTransition) {
        return this.each(function () {
            var $this = $(this);
            if(noTransition) {
                $this.addClass("no-transition");
            } else {
                $this.removeClass("no-transition");
            }
            $this.css({
                opacity: 0,
                visibility: "hidden"
            });
        });
    };
})(jQuery);
var constants;
var CZ;
(function (CZ) {
    CZ.timeSeriesChart;
    CZ.leftDataSet;
    CZ.rightDataSet;
    (function (HomePageViewModel) {
        var _uiMap = {
            "#header-edit-form": "/ui/header-edit-form.html",
            "#auth-edit-timeline-form": "/ui/auth-edit-timeline-form.html",
            "#auth-edit-exhibit-form": "/ui/auth-edit-exhibit-form.html",
            "#auth-edit-contentitem-form": "/ui/auth-edit-contentitem-form.html",
            "$('<div></div>')": "/ui/contentitem-listbox.html",
            "#profile-form": "/ui/header-edit-profile-form.html",
            "#login-form": "/ui/header-login-form.html",
            "#auth-edit-tours-form": "/ui/auth-edit-tour-form.html",
            "$('<div><!--Tours Authoring--></div>')": "/ui/tourstop-listbox.html",
            "#toursList": "/ui/tourslist-form.html",
            "$('<div><!--Tours list item --></div>')": "/ui/tour-listbox.html",
            "#timeSeriesContainer": "/ui/timeseries-graph-form.html",
            "#timeSeriesDataForm": "/ui/timeseries-data-form.html",
            "#message-window": "/ui/message-window.html",
            "#header-search-form": "/ui/header-search-form.html",
            "#header-session-expired-form": "/ui/header-session-expired-form.html",
            "#tour-caption-form": "/ui/tour-caption-form.html",
            "#mediapicker-form": "/ui/mediapicker-form.html",
            "#start-page": "/ui/start-page.html"
        };
        (function (FeatureActivation) {
            FeatureActivation._map = [];
            FeatureActivation._map[0] = "Enabled";
            FeatureActivation.Enabled = 0;
            FeatureActivation._map[1] = "Disabled";
            FeatureActivation.Disabled = 1;
            FeatureActivation._map[2] = "RootCollection";
            FeatureActivation.RootCollection = 2;
            FeatureActivation._map[3] = "NotRootCollection";
            FeatureActivation.NotRootCollection = 3;
            FeatureActivation._map[4] = "NotProduction";
            FeatureActivation.NotProduction = 4;
        })(HomePageViewModel.FeatureActivation || (HomePageViewModel.FeatureActivation = {}));
        var FeatureActivation = HomePageViewModel.FeatureActivation;
        HomePageViewModel.sessionForm;
        var _featureMap = [
            {
                Name: "Login",
                Activation: FeatureActivation.Enabled,
                JQueryReference: "#login-panel"
            }, 
            {
                Name: "Search",
                Activation: FeatureActivation.Enabled,
                JQueryReference: "#search-button"
            }, 
            {
                Name: "Tours",
                Activation: FeatureActivation.Enabled,
                JQueryReference: "#tours-index"
            }, 
            {
                Name: "Authoring",
                Activation: FeatureActivation.Enabled,
                JQueryReference: ".header-icon.edit-icon"
            }, 
            {
                Name: "TourAuthoring",
                Activation: FeatureActivation.Enabled,
                JQueryReference: ".cz-form-create-tour"
            }, 
            {
                Name: "WelcomeScreen",
                Activation: FeatureActivation.RootCollection,
                JQueryReference: "#welcomeScreenBack"
            }, 
            {
                Name: "Regimes",
                Activation: FeatureActivation.RootCollection,
                JQueryReference: ".header-regimes"
            }, 
            {
                Name: "TimeSeries",
                Activation: FeatureActivation.Enabled
            }, 
            {
                Name: "ManageCollections",
                Activation: FeatureActivation.Disabled,
                JQueryReference: "#collections_button"
            }, 
            {
                Name: "BreadCrumbs",
                Activation: FeatureActivation.Enabled,
                JQueryReference: ".header-breadcrumbs"
            }, 
            {
                Name: "Themes",
                Activation: FeatureActivation.NotProduction
            }, 
            {
                Name: "Skydrive",
                Activation: FeatureActivation.Enabled
            }, 
            {
                Name: "StartPage",
                Activation: FeatureActivation.NotProduction,
                JQueryReference: ".header-icon.home-icon"
            }, 
            
        ];
        HomePageViewModel.rootCollection;
        function UserCanEditCollection(profile) {
            if(CZ.Service.superCollectionName && CZ.Service.superCollectionName.toLowerCase() === "sandbox") {
                return true;
            }
            if(!profile || !profile.DisplayName || !CZ.Service.superCollectionName || profile.DisplayName.toLowerCase() !== CZ.Service.superCollectionName.toLowerCase()) {
                return false;
            }
            return true;
        }
        function InitializeToursUI(profile, forms) {
            CZ.Tours.tourCaptionFormContainer = forms[16];
            var allowEditing = IsFeatureEnabled(_featureMap, "TourAuthoring") && UserCanEditCollection(profile);
            var onTakeTour = function (tour) {
                CZ.HomePageViewModel.closeAllForms();
                CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption(CZ.Tours.tourCaptionFormContainer, {
                    activationSource: $(".tour-icon"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-tour-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-tour-form-title",
                    contentContainer: ".cz-form-content",
                    minButton: ".cz-tour-form-min-btn > .cz-form-btn",
                    captionTextarea: ".cz-form-tour-caption",
                    tourPlayerContainer: ".cz-form-tour-player",
                    bookmarksCount: ".cz-form-tour-bookmarks-count",
                    narrationToggle: ".cz-toggle-narration",
                    context: tour
                });
                CZ.Tours.tourCaptionForm.show();
                CZ.Tours.removeActiveTour();
                CZ.Tours.activateTour(tour, undefined);
            };
            var onToursInitialized = function () {
                $("#tours_index").click(function () {
                    var toursListForm = getFormById("#toursList");
                    if(toursListForm.isFormVisible) {
                        toursListForm.close();
                    } else {
                        closeAllForms();
                        var form = new CZ.UI.FormToursList(forms[9], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            tourTemplate: forms[10],
                            tours: CZ.Tours.tours,
                            takeTour: onTakeTour,
                            editTour: allowEditing ? function (tour) {
                                if(CZ.Authoring.showEditTourForm) {
                                    CZ.Authoring.showEditTourForm(tour);
                                }
                            } : null
                        });
                        form.show();
                    }
                });
            };
            if(CZ.Tours.tours) {
                onToursInitialized();
            } else {
                $("body").bind("toursInitialized", onToursInitialized);
            }
        }
        var defaultRootTimeline = {
            title: "My Timeline",
            x: 1950,
            endDate: 9999,
            children: [],
            parent: {
                guid: null
            }
        };
        $(document).ready(function () {
            window.console = window.console || (function () {
                var c = {
                };
                c.log = c.warn = c.debug = c.info = c.log = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();
            $('.bubbleInfo').hide();
            var url = CZ.UrlNav.getURL();
            HomePageViewModel.rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;
            ApplyFeatureActivation();
            CZ.Extensions.registerExtensions();
            CZ.Media.SkyDriveMediaPicker.isEnabled = IsFeatureEnabled(_featureMap, "Skydrive");
            CZ.Media.initialize();
            CZ.Common.initialize();
            CZ.UILoader.loadAll(_uiMap).done(function () {
                var forms = arguments;
                CZ.timeSeriesChart = new CZ.UI.LineChart(forms[11]);
                $('#timeSeries_button').click(function () {
                    var tsForm = getFormById('#timeSeriesDataForm');
                    if(tsForm === false) {
                        closeAllForms();
                        var timSeriesDataFormDiv = forms[12];
                        var timSeriesDataForm = new CZ.UI.TimeSeriesDataForm(timSeriesDataFormDiv, {
                            activationSource: $("#timeSeries_button"),
                            closeButton: ".cz-form-close-btn > .cz-form-btn"
                        });
                        timSeriesDataForm.show();
                    } else {
                        if(tsForm.isFormVisible) {
                            tsForm.close();
                        } else {
                            closeAllForms();
                            tsForm.show();
                        }
                    }
                });
                $(".header-icon.edit-icon").click(function () {
                    var editForm = getFormById("#header-edit-form");
                    if(editForm === false) {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderEdit(forms[0], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            createTimeline: ".cz-form-create-timeline",
                            createExhibit: ".cz-form-create-exhibit",
                            createTour: ".cz-form-create-tour"
                        });
                        form.show();
                        ApplyFeatureActivation();
                    } else {
                        if(editForm.isFormVisible) {
                            editForm.close();
                        } else {
                            closeAllForms();
                            editForm.show();
                        }
                    }
                });
                $(".header-icon.search-icon").click(function () {
                    var searchForm = getFormById("#header-search-form");
                    if(searchForm === false) {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderSearch(forms[14], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            searchTextbox: ".cz-form-search-input",
                            searchResultsBox: ".cz-form-search-results",
                            progressBar: ".cz-form-progress-bar",
                            resultSections: ".cz-form-search-results > .cz-form-search-section",
                            resultsCountTextblock: ".cz-form-search-results-count"
                        });
                        form.show();
                    } else {
                        if(searchForm.isFormVisible) {
                            searchForm.close();
                        } else {
                            closeAllForms();
                            searchForm.show();
                        }
                    }
                });
                CZ.Authoring.initialize(CZ.Common.vc, {
                    showMessageWindow: function (message, title, onClose) {
                        var wnd = new CZ.UI.MessageWindow(forms[13], message, title);
                        if(onClose) {
                            wnd.container.bind("close", function () {
                                wnd.container.unbind("close", onClose);
                                onClose();
                            });
                        }
                        wnd.show();
                    },
                    hideMessageWindow: function () {
                        var wnd = forms[13].data("form");
                        if(wnd) {
                            wnd.close();
                        }
                    },
                    showEditTourForm: function (tour) {
                        CZ.Tours.removeActiveTour();
                        var form = new CZ.UI.FormEditTour(forms[7], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            addStopButton: ".cz-form-tour-addstop",
                            titleInput: ".cz-form-title",
                            tourStopsListBox: "#stopsList",
                            tourStopsTemplate: forms[8],
                            context: tour
                        });
                        form.show();
                    },
                    showCreateTimelineForm: function (timeline) {
                        CZ.Authoring.hideMessageWindow();
                        CZ.Authoring.mode = "createTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateRootTimelineForm: function (timeline) {
                        CZ.Authoring.mode = "createRootTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showEditTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateExhibitForm: function (exhibit) {
                        CZ.Authoring.hideMessageWindow();
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditExhibitForm: function (exhibit) {
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListBox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditContentItemForm: function (ci, e, prevForm, noAnimation) {
                        var form = new CZ.UI.FormEditCI(forms[3], {
                            activationSource: $(".header-icon.edit-icon"),
                            prevForm: prevForm,
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            titleInput: ".cz-form-item-title",
                            mediaSourceInput: ".cz-form-item-mediasource",
                            mediaInput: ".cz-form-item-mediaurl",
                            descriptionInput: ".cz-form-item-descr",
                            attributionInput: ".cz-form-item-attribution",
                            mediaTypeInput: ".cz-form-item-media-type",
                            mediaListContainer: ".cz-form-medialist",
                            context: {
                                exhibit: e,
                                contentItem: ci
                            }
                        });
                        form.show(noAnimation);
                    }
                });
                HomePageViewModel.sessionForm = new CZ.UI.FormHeaderSessionExpired(forms[15], {
                    activationSource: $("#header-session-expired-form"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: "",
                    sessionTimeSpan: "#session-time",
                    sessionButton: "#session-button"
                });
                CZ.Service.getProfile().done(function (data) {
                    if(data != "") {
                        CZ.Settings.isAuthorized = true;
                        CZ.Authoring.timer = setTimeout(function () {
                            CZ.Authoring.showSessionForm();
                        }, (CZ.Settings.sessionTime - 60) * 1000);
                    }
                    CZ.Authoring.isEnabled = UserCanEditCollection(data);
                }).fail(function (error) {
                    CZ.Authoring.isEnabled = UserCanEditCollection(null);
                }).always(function () {
                    if(!CZ.Authoring.isEnabled) {
                        $(".edit-icon").hide();
                    }
                    CZ.Common.loadData().then(function (response) {
                        if(!response) {
                            if(CZ.Authoring.isEnabled) {
                                if(CZ.Authoring.showCreateRootTimelineForm) {
                                    CZ.Authoring.showCreateRootTimelineForm(defaultRootTimeline);
                                }
                            } else {
                                CZ.Authoring.showMessageWindow("Looks like this collection is empty. Come back later when author will fill it with content.", "Collection is empty :(");
                            }
                        }
                    });
                });
                var profileForm = new CZ.UI.FormEditProfile(forms[5], {
                    activationSource: $("#login-panel"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    saveButton: "#cz-form-save",
                    logoutButton: "#cz-form-logout",
                    titleInput: ".cz-form-item-title",
                    usernameInput: ".cz-form-username",
                    emailInput: ".cz-form-email",
                    agreeInput: ".cz-form-agree",
                    loginPanel: "#login-panel",
                    profilePanel: "#profile-panel",
                    loginPanelLogin: "#profile-panel.auth-panel-login",
                    context: "",
                    allowRedirect: IsFeatureEnabled(_featureMap, "Authoring"),
                    collectionTheme: CZ.Settings.theme,
                    collectionThemeInput: "#collection-theme",
                    collectionThemeWrapper: IsFeatureEnabled(_featureMap, "Themes") ? "#collection-theme-wrapper" : null
                });
                var loginForm = new CZ.UI.FormLogin(forms[6], {
                    activationSource: $("#login-panel"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: ""
                });
                $("#profile-panel").click(function (event) {
                    event.preventDefault();
                    if(!profileForm.isFormVisible) {
                        closeAllForms();
                        profileForm.setTheme(CZ.Settings.theme);
                        profileForm.show();
                    } else {
                        profileForm.close();
                    }
                });
                if(IsFeatureEnabled(_featureMap, "Login")) {
                    CZ.Service.getProfile().done(function (data) {
                        if(data == "") {
                            $("#login-panel").show();
                        } else if(data != "" && data.DisplayName == null) {
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $("#profile-panel input#username").focus();
                            if(!profileForm.isFormVisible) {
                                closeAllForms();
                                profileForm.setTheme(CZ.Settings.theme);
                                profileForm.show();
                            } else {
                                profileForm.close();
                            }
                        } else {
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $(".auth-panel-login").html(data.DisplayName);
                        }
                        InitializeToursUI(data, forms);
                    }).fail(function (error) {
                        $("#login-panel").show();
                        InitializeToursUI(null, forms);
                    });
                }
                $("#login-panel").click(function (event) {
                    event.preventDefault();
                    if(!loginForm.isFormVisible) {
                        closeAllForms();
                        loginForm.show();
                    } else {
                        loginForm.close();
                    }
                });
                if(IsFeatureEnabled(_featureMap, "StartPage")) {
                    CZ.StartPage.initialize();
                }
            });
            CZ.Service.getServiceInformation().then(function (response) {
                CZ.Settings.contentItemThumbnailBaseUri = response.thumbnailsPath;
                CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
            });
            CZ.Settings.applyTheme(null);
            if(CZ.Service.superCollectionName) {
                CZ.Service.getCollections(CZ.Service.superCollectionName).then(function (response) {
                    $(response).each(function (index) {
                        if(response[index] && response[index].Title.toLowerCase() === CZ.Service.collectionName.toLowerCase()) {
                            CZ.Settings.applyTheme(response[index].theme);
                        }
                    });
                });
            }
            $('#breadcrumbs-nav-left').click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right').click(CZ.BreadCrumbs.breadCrumbNavRight);
            $('#biblCloseButton').mouseout(function () {
                CZ.Common.toggleOffImage('biblCloseButton', 'png');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('biblCloseButton', 'png');
            });
            if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            }
            if(navigator.userAgent.indexOf('Mac') != -1) {
                var body = document.getElementsByTagName('body')[0];
                (body).style.overflow = "hidden";
            }
            Seadragon.Config.imagePath = CZ.Settings.seadragonImagePath;
            CZ.Common.maxPermitedVerticalRange = {
                top: 0,
                bottom: 10000000
            };
            if(window.location.hash) {
                CZ.Common.startHash = window.location.hash;
            }
            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();
            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc);
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax));
            var timeSeriesGestures = CZ.Gestures.getPanPinGesturesStream($("#timeSeriesContainer"));
            var jointGesturesStream = canvasGestures.Merge(axisGestures.Merge(timeSeriesGestures));
            CZ.Common.controller = new CZ.ViewportController.ViewportController2(function (visible) {
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                var markerPos = CZ.Common.axis.markerPosition;
                var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;
                CZ.Common.vc.virtualCanvas("setVisible", visible, CZ.Common.controller.activeAnimation);
                CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
                vp = CZ.Common.vc.virtualCanvas("getViewport");
                if(CZ.Tours.pauseTourAtAnyAnimation) {
                    CZ.Tours.tourPause();
                    CZ.Tours.pauseTourAtAnyAnimation = false;
                }
                var hoveredInfodot = CZ.Common.vc.virtualCanvas("getHoveredInfodot");
                var actAni = CZ.Common.controller.activeAnimation != undefined;
                if(actAni) {
                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                    CZ.Common.updateMarker();
                }
                updateTimeSeriesChart(vp);
            }, function () {
                return CZ.Common.vc.virtualCanvas("getViewport");
            }, jointGesturesStream);
            var hashChangeFromOutside = true;
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if(CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.bookmark) {
                    CZ.UrlNav.navigationAnchor = CZ.UrlNav.navStringTovcElement(CZ.Common.setNavigationStringTo.bookmark, CZ.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = CZ.Common.setNavigationStringTo.bookmark;
                } else {
                    if(CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.id == id) {
                        CZ.UrlNav.navigationAnchor = CZ.Common.setNavigationStringTo.element;
                    }
                    var vp = CZ.Common.vc.virtualCanvas("getViewport");
                    window.location.hash = CZ.UrlNav.vcelementToNavString(CZ.UrlNav.navigationAnchor, vp);
                }
                CZ.Common.setNavigationStringTo = null;
            });
            window.addEventListener("hashchange", function () {
                if(window.location.hash && hashChangeFromOutside && CZ.Common.hashHandle) {
                    var hash = window.location.hash;
                    var visReg = CZ.UrlNav.navStringToVisible(window.location.hash.substring(1), CZ.Common.vc);
                    if(visReg) {
                        CZ.Common.isAxisFreezed = true;
                        CZ.Common.controller.moveToVisible(visReg, true);
                        if(window.location.hash != hash) {
                            hashChangeFromOutside = false;
                            window.location.hash = hash;
                        }
                    }
                    CZ.Common.hashHandle = true;
                } else {
                    hashChangeFromOutside = true;
                }
            });
            CZ.Common.controller.onAnimationComplete.push(function () {
            });
            CZ.Common.controller.onAnimationStarted.push(function () {
            });
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if(oldId != undefined && newId == undefined) {
                    setTimeout(function () {
                    }, 500);
                }
            });
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                if(CZ.Tours.tourBookmarkTransitionCompleted != undefined) {
                    CZ.Tours.tourBookmarkTransitionCompleted(id);
                }
                if(CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished") {
                    CZ.Tours.pauseTourAtAnyAnimation = true;
                }
            });
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if(CZ.Tours.tour != undefined) {
                    if(CZ.Tours.tourBookmarkTransitionInterrupted != undefined) {
                        var prevState = CZ.Tours.tour.state;
                        CZ.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = CZ.Tours.tour.state;
                        if(prevState == "play" && alteredState == "pause") {
                            CZ.Tours.tourPause();
                        }
                        CZ.Common.setNavigationStringTo = null;
                    }
                }
            });
            CZ.Common.updateLayout();
            CZ.Common.vc.bind("elementclick", function (e) {
                CZ.Search.navigateToElement(e);
            });
            CZ.Common.vc.bind('cursorPositionChanged', function (cursorPositionChangedEvent) {
                CZ.Common.updateMarker();
            });
            CZ.Common.ax.bind('thresholdBookmarkChanged', function (thresholdBookmark) {
                var bookmark = CZ.UrlNav.navStringToVisible(thresholdBookmark.Bookmark, CZ.Common.vc);
                if(bookmark != undefined) {
                    CZ.Common.controller.moveToVisible(bookmark, false);
                }
            });
            CZ.Common.vc.bind("innerZoomConstraintChanged", function (constraint) {
                CZ.Common.controller.effectiveExplorationZoomConstraint = constraint.zoomValue;
                CZ.Common.axis.allowMarkerMovesOnHover = !constraint.zoomValue;
            });
            CZ.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) {
                CZ.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });
            $(window).bind('resize', function () {
                CZ.timeSeriesChart.updateCanvasHeight();
                CZ.Common.updateLayout();
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                updateTimeSeriesChart(vp);
            });
            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            CZ.Common.vc.virtualCanvas("setVisible", CZ.VCContent.getVisibleForElement({
                x: -13700000000,
                y: 0,
                width: 13700000000,
                height: 5535444444.444445
            }, 1.0, vp, false), true);
            CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
            var bid = window.location.hash.match("b=([a-z0-9_]+)");
            if(bid) {
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        });
        function IsFeatureEnabled(featureMap, featureName) {
            var feature = $.grep(featureMap, function (e) {
                return e.Name === featureName;
            });
            return feature[0].IsEnabled;
        }
        HomePageViewModel.IsFeatureEnabled = IsFeatureEnabled;
        function closeAllForms() {
            $('.cz-major-form').each(function (i, f) {
                var form = $(f).data('form');
                if(form && form.isFormVisible === true) {
                    form.close();
                }
            });
        }
        HomePageViewModel.closeAllForms = closeAllForms;
        function getFormById(name) {
            var form = $(name).data("form");
            if(form) {
                return form;
            } else {
                return false;
            }
        }
        HomePageViewModel.getFormById = getFormById;
        function showTimeSeriesChart() {
            $('#timeSeriesContainer').height('30%');
            $('#timeSeriesContainer').show();
            $('#vc').height('70%');
            CZ.timeSeriesChart.updateCanvasHeight();
            CZ.Common.updateLayout();
        }
        HomePageViewModel.showTimeSeriesChart = showTimeSeriesChart;
        function hideTimeSeriesChart() {
            CZ.leftDataSet = undefined;
            CZ.rightDataSet = undefined;
            $('#timeSeriesContainer').height(0);
            $('#timeSeriesContainer').hide();
            $('#vc').height('100%');
            CZ.Common.updateLayout();
        }
        HomePageViewModel.hideTimeSeriesChart = hideTimeSeriesChart;
        function updateTimeSeriesChart(vp) {
            var left = vp.pointScreenToVirtual(0, 0).x;
            if(left < CZ.Settings.maxPermitedTimeRange.left) {
                left = CZ.Settings.maxPermitedTimeRange.left;
            }
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if(right > CZ.Settings.maxPermitedTimeRange.right) {
                right = CZ.Settings.maxPermitedTimeRange.right;
            }
            if(CZ.timeSeriesChart !== undefined) {
                var leftCSS = vp.pointVirtualToScreen(left, 0).x;
                var rightCSS = vp.pointVirtualToScreen(right, 0).x;
                var leftPlot = CZ.Dates.getYMDFromCoordinate(left).year;
                var rightPlot = CZ.Dates.getYMDFromCoordinate(right).year;
                CZ.timeSeriesChart.clear(leftCSS, rightCSS);
                CZ.timeSeriesChart.clearLegend("left");
                CZ.timeSeriesChart.clearLegend("right");
                var chartHeader = "TimeSeries Chart";
                if(CZ.rightDataSet !== undefined || CZ.leftDataSet !== undefined) {
                    CZ.timeSeriesChart.drawVerticalGridLines(leftCSS, rightCSS, leftPlot, rightPlot);
                }
                var screenWidthForLegend = rightCSS - leftCSS;
                if(CZ.rightDataSet !== undefined && CZ.leftDataSet !== undefined) {
                    screenWidthForLegend /= 2;
                }
                var isLegendVisible = CZ.timeSeriesChart.checkLegendVisibility(screenWidthForLegend);
                if(CZ.leftDataSet !== undefined) {
                    var padding = CZ.leftDataSet.getVerticalPadding() + 10;
                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;
                    CZ.leftDataSet.series.forEach(function (seria) {
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });
                    if((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }
                    var axisAppearence = {
                        labelCount: 4,
                        tickLength: 10,
                        majorTickThickness: 1,
                        stroke: 'black',
                        axisLocation: 'left',
                        font: '16px Calibri',
                        verticalPadding: padding
                    };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(leftCSS, rightCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.leftDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);
                    if(isLegendVisible) {
                        for(var i = 0; i < CZ.leftDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("left", CZ.leftDataSet.series[i].appearanceSettings.stroke, CZ.leftDataSet.series[i].appearanceSettings.name);
                        }
                    }
                    chartHeader += " (" + CZ.leftDataSet.name;
                }
                if(CZ.rightDataSet !== undefined) {
                    var padding = CZ.rightDataSet.getVerticalPadding() + 10;
                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;
                    CZ.rightDataSet.series.forEach(function (seria) {
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }
                        if(seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });
                    if((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }
                    var axisAppearence = {
                        labelCount: 4,
                        tickLength: 10,
                        majorTickThickness: 1,
                        stroke: 'black',
                        axisLocation: 'right',
                        font: '16px Calibri',
                        verticalPadding: padding
                    };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(rightCSS, leftCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.rightDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);
                    if(isLegendVisible) {
                        for(var i = 0; i < CZ.rightDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("right", CZ.rightDataSet.series[i].appearanceSettings.stroke, CZ.rightDataSet.series[i].appearanceSettings.name);
                        }
                    }
                    var str = chartHeader.indexOf("(") > 0 ? ", " : " (";
                    chartHeader += str + CZ.rightDataSet.name + ")";
                } else {
                    chartHeader += ")";
                }
                $("#timeSeriesChartHeader").text(chartHeader);
            }
        }
        HomePageViewModel.updateTimeSeriesChart = updateTimeSeriesChart;
        function ApplyFeatureActivation() {
            for(var idxFeature = 0; idxFeature < _featureMap.length; idxFeature++) {
                var feature = _featureMap[idxFeature];
                if(feature.IsEnabled === undefined) {
                    var enabled = true;
                    if(feature.Activation === FeatureActivation.Disabled) {
                        enabled = false;
                    }
                    if(feature.Activation === FeatureActivation.NotRootCollection && HomePageViewModel.rootCollection) {
                        enabled = false;
                    }
                    if(feature.Activation === FeatureActivation.RootCollection && !HomePageViewModel.rootCollection) {
                        enabled = false;
                    }
                    if(feature.Activation === FeatureActivation.NotProduction && (!constants || constants.environment === "Production")) {
                        enabled = false;
                    }
                    _featureMap[idxFeature].IsEnabled = enabled;
                }
                if(feature.JQueryReference) {
                    if(!_featureMap[idxFeature].IsEnabled) {
                        $(feature.JQueryReference).css("display", "none");
                    } else if(!_featureMap[idxFeature].HasBeenActivated) {
                        _featureMap[idxFeature].HasBeenActivated = true;
                        $(feature.JQueryReference).css("display", "block");
                    }
                }
            }
        }
    })(CZ.HomePageViewModel || (CZ.HomePageViewModel = {}));
    var HomePageViewModel = CZ.HomePageViewModel;
})(CZ || (CZ = {}));
