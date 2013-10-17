/// <reference path='../ui/tourstop-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var TourStop = (function () {
            function TourStop(target, title) {
                if (target == undefined || target == null)
                    throw "target element of a tour stop is null or undefined";
                if (typeof target.type == "undefined")
                    throw "type of the tour stop target element is undefined";
                this.targetElement = target;
                if (target.type === "Unknown") {
                    this.type = target.type;
                    this.title = title;
                } else if (target.type === "contentItem") {
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
                    if (!this.thumbUrl)
                        this.thumbUrl = this.GetThumbnail(this.targetElement);
                    return this.thumbUrl;
                },
                enumerable: true,
                configurable: true
            });

            TourStop.prototype.GetThumbnail = function (element) {
                // uncomment for debug: return "http://upload.wikimedia.org/wikipedia/commons/7/71/Ivan_kramskoy_self_portrait_tr.gif";
                var defaultThumb = "/images/Temp-Thumbnail2.png";
                try  {
                    if (!element)
                        return defaultThumb;
                    if (element.type === "contentItem") {
                        var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x64/' + element.id + '.png';
                        return thumbnailUri;
                    }
                    if (element.type === "infodot") {
                        if (element.contentItems && element.contentItems.length > 0) {
                            var child = element.contentItems[0];
                            var thumbnailUri = CZ.Settings.contentItemThumbnailBaseUri + 'x64/' + child.id + '.png';
                            return thumbnailUri;
                        }
                    } else if (element.type === "timeline") {
                        for (var n = element.children.length, i = 0; i < n; i++) {
                            var child = element.children[i];
                            if (child.type === "infodot" || child.type === "timeline") {
                                var thumb = this.GetThumbnail(child);
                                if (thumb && thumb !== defaultThumb)
                                    return thumb;
                            }
                        }
                    }
                } catch (exc) {
                    if (console && console.error)
                        console.error("Failed to get a thumbnail url: " + exc);
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
            // We only need to add additional initialization in constructor.
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
                if (this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    this.tourDescriptionInput.val(this.tour.description);
                    for (var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
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
                    return self.onStopsReordered.apply(self, [item, startPos, endPos]);
                });
                this.tourStopsListBox.itemRemove(function (item, index) {
                    return self.onStopRemoved.apply(self, [item, index]);
                });
                this.initialize();
            }
            FormEditTour.bookmarkToTourstop = function (bookmark) {
                var target = CZ.Tours.bookmarkUrlToElement(bookmark.url);
                if (target == null) {
                    target = {
                        type: "Unknown"
                    };
                }
                var stop = new TourStop(target, (!bookmark.caption || $.trim(bookmark.caption) === "") ? undefined : bookmark.caption);
                stop.Description = bookmark.text;
                stop.LapseTime = bookmark.lapseTime;
                return stop;
            };

            FormEditTour.tourstopToBookmark = function (tourstop, index) {
                var url = CZ.UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var bookmark = new CZ.Tours.TourBookmark(url, title, tourstop.LapseTime, tourstop.Description);
                bookmark.number = index + 1;
                return bookmark;
            };

            FormEditTour.prototype.deleteTourAsync = function () {
                return CZ.Service.deleteTour(this.tour.id);
            };

            // Creates new tour instance from the current state of the UI.
            // Returns a promise of the created tour. May fail.
            FormEditTour.prototype.putTourAsync = function (sequenceNum) {
                var deferred = $.Deferred();
                var self = this;
                var stops = this.getStops();

                // Add the tour to the local tours collection
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var category = "tours";
                var n = stops.length;
                var tourId = undefined;
                if (this.tour) {
                    category = this.tour.category;
                    tourId = this.tour.id;
                }

                // Posting the tour to the service
                var request = CZ.Service.putTour2(new CZ.UI.Tour(tourId, name, descr, category, n, stops));

                request.done(function (q) {
                    // build array of bookmarks of current tour
                    var tourBookmarks = new Array();
                    for (var j = 0; j < n; j++) {
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
                if (this.tour == null) {
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
                        if (CZ.Authoring.mode == "editTour-selectTarget") {
                            CZ.Authoring.showMessageWindow("Click an element to select it as a tour stop.", "New tour stop", function () {
                                if (CZ.Authoring.mode == "editTour-selectTarget")
                                    self.onTargetElementSelected(null);
                            });
                        }
                    }, 500);
                });
                this.saveButton.click(function (event) {
                    var message;
                    if (!_this.tourTitleInput.val())
                        message = "Please enter the title.";
else if (_this.tourStopsListBox.items.length == 0)
                        message = "Please add a tour stop to the tour.";
                    if (message) {
                        alert(message);
                        return;
                    }

                    var self = _this;

                    _this.saveButton.prop('disabled', true);

                    if (_this.tour == null) {
                        // Add the tour to the local tours collection
                        _this.putTourAsync(CZ.Tours.tours.length).done(function (tour) {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);
                            _this.hide();
                        }).fail(function (f) {
                            if (console && console.error) {
                                console.error("Failed to create a tour: " + f.status + " " + f.statusText);
                            }
                            alert("Failed to create a tour");
                        }).done(function () {
                            _this.saveButton.prop('disabled', false);
                        });
                    } else {
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === _this.tour) {
                                _this.putTourAsync(i).done(function (tour) {
                                    _this.tour = CZ.Tours.tours[i] = tour;
                                    _this.hide();
                                }).fail(function (f) {
                                    if (console && console.error) {
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
                    if (_this.tour == null)
                        return;
                    _this.deleteTourAsync().done(function (q) {
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === _this.tour) {
                                _this.tour = null;
                                CZ.Tours.tours.splice(i, 1);
                                _this.close();
                                break;
                            }
                        }
                    }).fail(function (f) {
                        if (console && console.error) {
                            console.error("Failed to delete a tour: " + f.status + " " + f.statusText);
                        }
                        alert("Failed to delete a tour");
                    });
                });
            };

            // Gets an array of TourStops as they are currently in the listbox.
            FormEditTour.prototype.getStops = function () {
                var n = this.tourStopsListBox.items.length;
                var stops = new Array(n);
                for (; --n >= 0;) {
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
                for (var i = 0; i < n; i++) {
                    var stop = stops[i];
                    stop.LapseTime = lapseTime;
                    lapseTime += CZ.Settings.tourDefaultTransitionTime;
                }
            };

            // New tour stop is added.
            FormEditTour.prototype.onTargetElementSelected = function (targetElement) {
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.hideMessageWindow();
                CZ.Authoring.isActive = false;
                CZ.Authoring.callback = null;

                if (targetElement) {
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
