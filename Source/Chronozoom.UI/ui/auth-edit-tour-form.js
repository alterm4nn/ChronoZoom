var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStop = (function () {
            function TourStop(target, sequence, title) {
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
                this.sequence = sequence;
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
                    return "";
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
            Object.defineProperty(TourStop.prototype, "Sequence", {
                get: function () {
                    return this.sequence;
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
                this.saveButton.off();
                this.deleteButton.off();
                this.tour = formInfo.context;
                this.stops = [];
                if(this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    for(var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
                        var bookmark = this.tour.bookmarks[i];
                        var stop = FormEditTour.bookmarkToTourstop(bookmark);
                        this.stops.push(stop);
                    }
                } else {
                    this.tourTitleInput.val("");
                }
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, this.stops);
                this.initialize();
            }
            FormEditTour.bookmarkToTourstop = function bookmarkToTourstop(bookmark) {
                var target = CZ.Tours.bookmarkUrlToElement(bookmark.url);
                if(target == null) {
                    target = {
                        type: "Unknown"
                    };
                }
                var stop = new TourStop(target, bookmark.number + 1, (!bookmark.caption || $.trim(bookmark.caption) === "") ? undefined : bookmark.caption);
                stop.LapseTime = bookmark.lapseTime;
                return stop;
            };
            FormEditTour.tourstopToBookmark = function tourstopToBookmark(tourstop) {
                var url = CZ.UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var text = "";
                var bookmark = new CZ.Tours.TourBookmark(url, title, tourstop.LapseTime, text);
                return bookmark;
            };
            FormEditTour.prototype.createTourAsync = function () {
                var _this = this;
                var deferred = $.Deferred();
                var self = this;
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var category = "my tours";
                var n = this.tourStopsListBox.items.length;
                var request = CZ.Service.postTour(new CZ.UI.Tour(undefined, name, descr, category, n, this.stops));
                request.done(function (q) {
                    var tourBookmarks = new Array();
                    for(var j = 0; j < n; j++) {
                        var tourstopItem = _this.tourStopsListBox.items[j];
                        var tourstop = tourstopItem.data;
                        var bookmark = FormEditTour.tourstopToBookmark(tourstop);
                        tourBookmarks.push(bookmark);
                    }
                    var tour = new CZ.Tours.Tour(name, tourBookmarks, CZ.Tours.bookmarkTransition, CZ.Common.vc, category, "", CZ.Tours.tours.length);
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
                });
                this.saveButton.click(function (event) {
                    var self = _this;
                    if(_this.tour == null) {
                        _this.createTourAsync().done(function (tour) {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);
                            self.initializeAsEdit();
                            alert("Tour created");
                        }).fail(function (f) {
                            if(console && console.error) {
                                console.error("Failed to create a tour: " + f);
                            }
                            alert("Failed to create a tour");
                        });
                    } else {
                        for(var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if(CZ.Tours.tours[i] === _this.tour) {
                                throw "Not implemented";
                                break;
                            }
                        }
                    }
                });
                this.deleteButton.click(function (event) {
                    if(_this.tour == null) {
                        return;
                    }
                    for(var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                        if(CZ.Tours.tours[i] === _this.tour) {
                            _this.tour = null;
                            CZ.Tours.tours.splice(i, 1);
                            _this.close();
                            break;
                        }
                    }
                });
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
                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
                this.tourStopsListBox.container.empty();
            };
            FormEditTour.prototype.onTargetElementSelected = function (targetElement) {
                CZ.Authoring.isActive = false;
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.callback = null;
                var n = this.tourStopsListBox.items.length;
                var stop = new TourStop(targetElement, n + 1);
                if(n > 0) {
                    stop.LapseTime = ((this.tourStopsListBox.items[this.tourStopsListBox.items.length - 1]).data).LapseTime + CZ.Settings.tourDefaultTransitionTime;
                } else {
                    stop.LapseTime = 0;
                }
                this.tourStopsListBox.add(stop);
                this.stops.push(stop);
                this.show();
            };
            return FormEditTour;
        })(CZ.UI.FormBase);
        UI.FormEditTour = FormEditTour;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
