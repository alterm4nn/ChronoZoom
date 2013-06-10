var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStop = (function () {
            function TourStop(bookmarkId, target, sequence, title) {
                this.bookmarkId = bookmarkId;
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
                if(!this.bookmarkId) {
                    this.bookmarkId = "00000000-0000-0000-0000-000000000000";
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
            Object.defineProperty(TourStop.prototype, "Sequence", {
                get: function () {
                    return this.sequence;
                },
                set: function (n) {
                    this.sequence = n;
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
                this.id = id ? id : "00000000-0000-0000-0000-000000000000";
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
                    for(var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
                        var bookmark = this.tour.bookmarks[i];
                        var stop = FormEditTour.bookmarkToTourstop(bookmark);
                        stops.push(stop);
                    }
                } else {
                    this.tourTitleInput.val("");
                }
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, stops, function (event, ui) {
                    return self.onStopsReordered.apply(self, [
                        event, 
                        ui
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
                var stop = new TourStop(bookmark.id, target, bookmark.number + 1, (!bookmark.caption || $.trim(bookmark.caption) === "") ? undefined : bookmark.caption);
                stop.Description = bookmark.description;
                stop.LapseTime = bookmark.lapseTime;
                return stop;
            };
            FormEditTour.tourstopToBookmark = function tourstopToBookmark(tourstop) {
                var url = CZ.UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var text = "";
                var bookmark = new CZ.Tours.TourBookmark(tourstop.bookmarkId, url, title, tourstop.LapseTime, text);
                bookmark.description = tourstop.Description;
                return bookmark;
            };
            FormEditTour.prototype.deleteTourAsync = function () {
                return CZ.Service.deleteTour(this.tour.id);
            };
            FormEditTour.prototype.createTourAsync = function () {
                var deferred = $.Deferred();
                var self = this;
                var stops = this.getStops();
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var category = "my tours";
                var n = stops.length;
                var request = CZ.Service.postTour(new CZ.UI.Tour(undefined, name, descr, category, n, stops));
                request.done(function (q) {
                    var tourBookmarks = new Array();
                    for(var j = 0; j < n; j++) {
                        var tourstop = stops[j];
                        tourstop.bookmarkId = q.BookmarkId[j];
                        var bookmark = FormEditTour.tourstopToBookmark(tourstop);
                        tourBookmarks.push(bookmark);
                    }
                    var tour = new CZ.Tours.Tour(q.TourId, name, tourBookmarks, CZ.Tours.bookmarkTransition, CZ.Common.vc, category, "", CZ.Tours.tours.length);
                    deferred.resolve(tour);
                }).fail(function (q) {
                    deferred.reject(q);
                });
                return deferred.promise();
            };
            FormEditTour.prototype.updateTourAsync = function () {
                if(!this.tour) {
                    throw "Tour is undefined";
                }
                var deferred = $.Deferred();
                var self = this;
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
                    var message;
                    if(!_this.tourTitleInput.val()) {
                        message = "Please enter the title";
                    } else if(_this.tourStopsListBox.items.length == 0) {
                        message = "Please add a tour stop to the tour";
                    }
                    if(message) {
                        alert(message);
                        return;
                    }
                    var self = _this;
                    if(_this.tour == null) {
                        _this.createTourAsync().done(function (tour) {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);
                            self.initializeAsEdit();
                            alert("Tour created");
                        }).fail(function (f) {
                            if(console && console.error) {
                                console.error("Failed to create a tour: " + f.status + " " + f.statusText);
                            }
                            alert("Failed to create a tour");
                        });
                    } else {
                        for(var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if(CZ.Tours.tours[i] === _this.tour) {
                                _this.updateTourAsync().done(function (tour) {
                                    _this.tour = CZ.Tours.tours[i] = tour;
                                    alert("Tour updated");
                                }).fail(function (f) {
                                    if(console && console.error) {
                                        console.error("Failed to update a tour: " + f.status + " " + f.statusText);
                                    }
                                    alert("Failed to update a tour");
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
                var stops = this.getStops();
                var n = stops.length;
                var lapseTime = 0;
                for(var i = 0; i < n; i++) {
                    var stop = stops[i];
                    stop.Sequence = i + 1;
                    stop.LapseTime = lapseTime;
                    lapseTime += CZ.Settings.tourDefaultTransitionTime;
                }
            };
            FormEditTour.prototype.onTargetElementSelected = function (targetElement) {
                CZ.Authoring.isActive = false;
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.callback = null;
                var n = this.tourStopsListBox.items.length;
                var stop = new TourStop("", targetElement, n + 1);
                if(n > 0) {
                    stop.LapseTime = ((this.tourStopsListBox.items[this.tourStopsListBox.items.length - 1]).data).LapseTime + CZ.Settings.tourDefaultTransitionTime;
                } else {
                    stop.LapseTime = 0;
                }
                this.tourStopsListBox.add(stop);
                this.show();
            };
            return FormEditTour;
        })(CZ.UI.FormBase);
        UI.FormEditTour = FormEditTour;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
