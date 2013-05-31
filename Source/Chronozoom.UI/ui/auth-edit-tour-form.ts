/// <reference path='../ui/tourstop-listbox.ts' />
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../scripts/authoring.ts'/>
/// <reference path='../scripts/typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {
        export interface IFormEditTourInfo extends CZ.UI.IFormBaseInfo {
            saveButton: string;
            deleteButton: string;
            addStopButton: string;
            titleInput: string;
            tourStopsListBox: string;
            tourStopsTemplate: JQuery;
            context: Object;
        }

        export class TourStop {
            private targetElement: any;
            private title: string;
            private type: string;
            private lapseTime: number;
            private sequence: number;

            constructor(public bookmarkId: string, target: any, sequence: number, title?: string) {
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

                this.sequence = sequence;
            }

            public get Target(): string {
                return this.targetElement;
            }

            public get Title(): string {
                return this.title;
            }

            public get Description(): string {
                return "";
            }

            public get LapseTime(): number {
                return this.lapseTime;
            }
            public set LapseTime(value: number) {
                this.lapseTime = value;
            }

            public get Sequence(): number {
                return this.sequence;
            }

            public get Type(): string {
                return this.type;
            }

            public get NavigationUrl(): string {
                return CZ.UrlNav.vcelementToNavString(this.targetElement);
            }

        }

        export class Tour {
            private id: string;
            private title: string;
            private description: string;
            private sequence: number;
            private stops: CZ.UI.TourStop[];
            private category: string;

            constructor(id: string, title: string, description: string, category: string, sequence: number, stops: CZ.UI.TourStop[]) {
                this.id = id;
                this.title = title;
                this.description = description;
                this.sequence = sequence;
                this.stops = stops;
                this.category = category;
            }

            public get Id(): string {
                return this.id;
            }

            public get Title(): string {
                return this.title;
            }

            public get Category(): string {
                return this.category;
            }

            public get Sequence(): number {
                return this.sequence;
            }

            public get Description(): string {
                return this.description;
            }

            public get Stops(): TourStop[] {
                return this.stops;
            }
        }

        export class FormEditTour extends CZ.UI.FormBase {
            private saveButton: JQuery;
            private deleteButton: JQuery;
            private addStopButton: JQuery;
            private titleInput: JQuery;
            private tourTitleInput: JQuery;
            private tourDescriptionInput: JQuery;
            private stops: TourStop[];
            private tour: CZ.Tours.Tour;

            public tourStopsListBox: TourStopListBox;


            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormEditTourInfo) {
                super(container, formInfo);

                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.addStopButton = container.find(formInfo.addStopButton);
                this.titleInput = container.find(formInfo.titleInput);

                this.tourTitleInput = this.container.find(".cz-form-tour-title");
                this.tourDescriptionInput = this.container.find(".cz-form-tour-description");
                this.clean();

                this.saveButton.off();
                this.deleteButton.off();

                this.tour = <CZ.Tours.Tour> formInfo.context;
                this.stops = [];
                if (this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    for (var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
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

            private static bookmarkToTourstop(bookmark: CZ.Tours.TourBookmark): TourStop {
                var target = CZ.Tours.bookmarkUrlToElement(bookmark.url);
                if (target == null) {
                    target = {
                        type: "Unknown"
                    };
                }
                var stop = new TourStop(bookmark.id, target, bookmark.number + 1, (!bookmark.caption || $.trim(bookmark.caption) === "") ? undefined : bookmark.caption);
                stop.LapseTime = bookmark.lapseTime;
                return stop;
            }

            private static tourstopToBookmark(tourstop: TourStop): CZ.Tours.TourBookmark {
                var url = UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var text = "";
                var bookmark = new CZ.Tours.TourBookmark(tourstop.bookmarkId, url, title, tourstop.LapseTime, text);
                return bookmark;
            }

            private deleteTourAsync(): any {
                return CZ.Service.deleteTour(this.tour.id);
            }

            // Creates new tour instance from the current state of the UI.
            // Returns a promise of the created tour. May fail.
            private createTourAsync(): any {
                var deferred = $.Deferred();
                var self = this;

                // Add the tour to the local tours collection
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var category = "my tours";
                var n = this.tourStopsListBox.items.length;

                // Posting the tour to the service
                var request = CZ.Service.postTour(new CZ.UI.Tour(undefined, name, descr, category, n, this.stops));

                request.done(q => {
                    // build array of bookmarks of current tour
                    var tourBookmarks = new Array();
                    for (var j = 0; j < n; j++) {
                        var tourstopItem = <TourStopListItem> this.tourStopsListBox.items[j];
                        var tourstop = <TourStop> tourstopItem.data;
                        tourstop.bookmarkId = q.BookmarkId[j];
                        var bookmark = FormEditTour.tourstopToBookmark(tourstop);
                        tourBookmarks.push(bookmark);
                    }

                    var tour = new CZ.Tours.Tour(q.TourId,
                        name,
                        tourBookmarks,
                        CZ.Tours.bookmarkTransition,
                        CZ.Common.vc,
                        category, // category
                        "", //audio
                        CZ.Tours.tours.length)
                    deferred.resolve(tour);
                }).fail(q => {
                    deferred.reject(q);
                });
                return deferred.promise();
            }

            private initializeAsEdit(): void {
                this.deleteButton.show();
                this.titleTextblock.text("Edit Tour");
                this.saveButton.text("update tour");
            }

            private initialize(): void {

                if (this.tour == null) // creating new tour
                {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Tour");
                    this.saveButton.text("create tour");
                }
                else // editing an existing tour
                {
                    this.initializeAsEdit();
                }

                var self = this;
                this.addStopButton.click(event =>
                {
                    CZ.Authoring.isActive = true; // for now we do not watch for mouse moves
                    CZ.Authoring.mode = "editTour-selectTarget";
                    CZ.Authoring.callback = arg => self.onTargetElementSelected(arg);
                    self.hide();
                });
                this.saveButton.click(event =>
                {
                    var message: string;
                    if (!this.tourTitleInput.val()) message = "Please enter the title";
                    else if (this.tourStopsListBox.items.length == 0) message = "Please add a tour stop to the tour";
                    if (message)
                    {
                        alert(message);
                        return;
                    }

                    var self = this;
                    // create new tour
                    if (this.tour == null) {
                        // Add the tour to the local tours collection
                        this.createTourAsync().done(tour => {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);
                            self.initializeAsEdit();
                            alert("Tour created");
                        }).fail(f => {
                            if (console && console.error) {
                                console.error("Failed to create a tour: " + f.status + " " + f.statusText);
                            }
                            alert("Failed to create a tour");
                        });
                    } else {
                        // Update existing tour
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === this.tour) {
                                throw "Not implemented";
                                //this.tour = CZ.Tours.tours[i] = this.createTour();
                                break;
                            }
                        }
                    }
                });
                this.deleteButton.click(event =>
                {
                    if (this.tour == null) return;
                    this.deleteTourAsync().done(q => {
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === this.tour) {
                                this.tour = null;
                                CZ.Tours.tours.splice(i, 1);
                                this.close();
                                break;
                            }
                        }
                    }).fail(f => {
                        if (console && console.error) {
                            console.error("Failed to delete a tour: " + f.status + " " + f.statusText);
                        }
                        alert("Failed to delete a tour");
                    });
                });
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }


            public hide(noAnimation?: bool = false) {
                super.close(noAnimation ? undefined : {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
                this.activationSource.removeClass("active");
            }


            public close() {
                super.close({
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: () => {
                    }
                });

                CZ.Authoring.isActive = false;
                this.clean();
            }

            private clean() {
                this.activationSource.removeClass("active");
                this.container.find(".cz-form-errormsg").hide();
                this.container.find(".cz-listbox").empty();
                this.tourTitleInput.val("");
                this.tourDescriptionInput.val("");
            }

            private onTargetElementSelected(targetElement: any) {
                CZ.Authoring.isActive = false;
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.callback = null;

                var n = this.tourStopsListBox.items.length;
                var stop = new TourStop("", targetElement, n + 1);
                if (n > 0) {
                    stop.LapseTime = (<TourStop>(<TourStopListItem> this.tourStopsListBox.items[this.tourStopsListBox.items.length - 1]).data).LapseTime
                        + Settings.tourDefaultTransitionTime;
                }
                else {
                    stop.LapseTime = 0;
                }
                this.tourStopsListBox.add(stop);
                this.stops.push(stop);
                this.show();
            }
        }
    }
}