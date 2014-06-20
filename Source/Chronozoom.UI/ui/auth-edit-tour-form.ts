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
            private description: string;
            private lapseTime: number;
            private thumbUrl: string;

            constructor(target: any, title?: string) {
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

            public get Target(): string {
                return this.targetElement;
            }

            public get Title(): string {
                return this.title;
            }

            public get Description(): string {
                return this.description;
            }

            public set Description(d: string) {
                this.description = d;
            }

            public get LapseTime(): number {
                return this.lapseTime;
            }
            public set LapseTime(value: number) {
                this.lapseTime = value;
            }

            public get Type(): string {
                return this.type;
            }

            public get NavigationUrl(): string {
                return CZ.UrlNav.vcelementToNavString(this.targetElement);
            }


            public get ThumbnailUrl(): string {
                if (!this.thumbUrl)
                    this.thumbUrl = this.GetThumbnail(this.targetElement);
                return this.thumbUrl;
            }


            private GetThumbnail(element): string {
                // uncomment for debug: return "http://upload.wikimedia.org/wikipedia/commons/7/71/Ivan_kramskoy_self_portrait_tr.gif";
                var defaultThumb = "/images/Temp-Thumbnail2.png";
                try {
                    if (!element) return defaultThumb;
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
                    }
                    else if (element.type === "timeline") {
                        for (var n = element.children.length, i = 0; i < n; i++) {
                            var child = element.children[i];
                            if (child.type === "infodot" || child.type === "timeline") {
                                var thumb = this.GetThumbnail(child);
                                if (thumb && thumb !== defaultThumb) return thumb;
                            }
                        }
                    }
                } catch (exc) {
                    if (console && console.error)
                        console.error("Failed to get a thumbnail url: " + exc);
                }
                return defaultThumb;
            }
        }

        export class Tour {
            private id: string;
            private title: string;
            private description: string;
            private audio: string;
            private sequence: number;
            private stops: CZ.UI.TourStop[];
            private category: string;

            constructor(id: string, title: string, description: string, audio: string, category: string, sequence: number, stops: CZ.UI.TourStop[]) {
                this.id = id;
                this.title = title;
                this.description = description;
                this.audio = audio;
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

            public set Description(val: string) {
                this.description = val;
            }

            public get Audio(): string {
                return this.audio;
            }

            public set Audio(val: string) {
                this.audio = val;
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
            private tourAudioInput: JQuery;
            private tourAudioControls: JQuery;
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
                this.tourAudioInput = this.container.find('#cz-form-tour-audio');
                this.tourAudioControls = this.container.find('#cz-form-tour-audio-controls');
                this.clean();

                this.saveButton.off();
                this.deleteButton.off();

                this.tour = <CZ.Tours.Tour> formInfo.context;
                var stops = [];
                var self = this;
                if (this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    this.tourDescriptionInput.val(this.tour.description);
                    this.tourAudioInput.val(this.tour.audio);
                    for (var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
                        var bookmark = this.tour.bookmarks[i]; // bookmarks are already ordered in the tour
                        var stop = FormEditTour.bookmarkToTourstop(bookmark);
                        stops.push(stop);
                    }
                } else {
                    this.tourTitleInput.val("");
                    this.tourDescriptionInput.val("");
                }
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, stops);
                this.tourStopsListBox.itemMove((item, startPos, endPos) => self.onStopsReordered.apply(self, [<any>item, <any>startPos, <any>endPos]));
                this.tourStopsListBox.itemRemove((item, index) => self.onStopRemoved.apply(self, [<any>item, <any>index]));
                this.initialize();
            }

            private static bookmarkToTourstop(bookmark: CZ.Tours.TourBookmark): TourStop {
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
            }

            private static tourstopToBookmark(tourstop: TourStop, index: number): CZ.Tours.TourBookmark {
                var url = UrlNav.vcelementToNavString(tourstop.Target);
                var title = tourstop.Title;
                var bookmark = new CZ.Tours.TourBookmark(url, title, tourstop.LapseTime, tourstop.Description);
                bookmark.number = index + 1;
                return bookmark;
            }

            private deleteTourAsync(): any {
                return CZ.Service.deleteTour(this.tour.id);
            }

            // Creates new tour instance from the current state of the UI.
            // Returns a promise of the created tour. May fail.
            private putTourAsync(sequenceNum): any {
                var deferred = $.Deferred();
                var self = this;
                var stops = this.getStops();


                // Add the tour to the local tours collection
                var name = this.tourTitleInput.val();
                var descr = this.tourDescriptionInput.val();
                var audio = this.tourAudioInput.val();
                var category = "tours";
                var n = stops.length;
                var tourId = undefined;
                if (this.tour) // updating the tour
                {
                    category = <string> this.tour.category;
                    tourId = this.tour.id;
                }

                // Posting the tour to the service
                var request = CZ.Service.putTour2(new CZ.UI.Tour(tourId, name, descr, audio, category, n, stops));

                request.done(q => {
                    // build array of bookmarks of current tour
                    var tourBookmarks = new Array();
                    for (var j = 0; j < n; j++) {
                        var tourstop = stops[j];
                        var bookmark = FormEditTour.tourstopToBookmark(tourstop, j);
                        tourBookmarks.push(bookmark);
                    }

                    var tour = new CZ.Tours.Tour(q.TourId,
                        name,
                        tourBookmarks,
                        CZ.Tours.bookmarkTransition,
                        CZ.Common.vc,
                        category, // category
                        audio, //audio
                        sequenceNum,
                        descr);
                    deferred.resolve(tour);
                }).fail(q => {
                    deferred.reject(q);
                });
                return deferred.promise();
            }
            
            private initializeAsEdit(): void {
                this.deleteButton.show();
                this.titleTextblock.text("Edit Tour");
                this.saveButton.text("Update Tour");
            }

            private initialize(): void {
                this.saveButton.prop('disabled', false);
                if (this.tour == null) // creating new tour
                {
                    this.deleteButton.hide();
                    this.titleTextblock.text("Create Tour");
                    this.saveButton.text("Create Tour");
                }
                else // editing an existing tour
                {
                    this.initializeAsEdit();
                }

                var self = this;

                this.renderAudioControls();
                this.tourAudioInput.on('change input', event =>
                {
                    this.renderAudioControls();
                });

                this.addStopButton.click(event =>
                {
                    CZ.Authoring.isActive = true; // for now we do not watch for mouse moves                    
                    CZ.Authoring.mode = "editTour-selectTarget";
                    CZ.Authoring.callback = arg => self.onTargetElementSelected(arg);
                    self.hide();
                    setTimeout(() =>
                    {
                        if (CZ.Authoring.mode == "editTour-selectTarget") { // due to animation delay, the window can already be closed when the delay completed, so we do this check.
                            CZ.Authoring.showMessageWindow("Click an element to select it as a tour stop.", "New tour stop",
                                () => // on close/cancel
                                {
                                    if (CZ.Authoring.mode == "editTour-selectTarget")
                                        self.onTargetElementSelected(null);
                                });
                        }
                    }, 500);
                });

                this.saveButton.click(event =>
                {
                    var message: string = '';

                    if (!this.tourTitleInput.val()) message += "Please enter a title.\n";

                    // audio URL validation
                    this.tourAudioInput.val($.trim(this.tourAudioInput.val())); // first trim excess space
                    if (this.tourAudioInput.val() != '' && !CZ.Data.validURL(this.tourAudioInput.val())) {
                        // content has been entered and is not a validly formed URL
                        message += 'Please provide a valid audio URL.\n';
                    }

                    if (this.tourStopsListBox.items.length == 0) message += "Please add a tour stop to the tour.\n";

                    if (message) {
                        alert(message);
                        return;
                    }

                    var self = this;

                    this.saveButton.prop('disabled', true);

                    // create new tour
                    if (this.tour == null) {
                        // Add the tour to the local tours collection
                        this.putTourAsync(CZ.Tours.tours.length).done(tour => {
                            self.tour = tour;
                            CZ.Tours.tours.push(tour);                            
                            this.hide();
                        }).fail(f => {
                            if (console && console.error) {
                                console.error("Failed to create a tour: " + f.status + " " + f.statusText);
                            }
                            alert("Failed to create a tour");
                        }).done(() => {
                            this.saveButton.prop('disabled', false);
                        });
                    } else {
                        // Update existing tour
                        for (var i = 0, n = CZ.Tours.tours.length; i < n; i++) {
                            if (CZ.Tours.tours[i] === this.tour) {
                                this.putTourAsync(i).done(tour => {
                                    this.tour = CZ.Tours.tours[i] = tour;
                                    this.hide();
                                }).fail(f => {
                                    if (console && console.error) {
                                        console.error("Failed to update a tour: " + f.status + " " + f.statusText);
                                    }
                                    alert("Failed to update a tour");
                                }).always(() => {
                                    this.saveButton.prop('disabled', false);
                                });
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

            // Gets an array of TourStops as they are currently in the listbox.
            private getStops(): TourStop[] {
                var n = this.tourStopsListBox.items.length;
                var stops: TourStop[] = <TourStop[]>new Array(n);
                for (; --n >= 0;) {
                    stops[n] = <TourStop> this.tourStopsListBox.items[n].data;
                }
                return stops;
            }

            public show(): void {
                super.show({
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            }

            public hide(noAnimation: boolean = false) {
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
                this.tourAudioInput.val('');
            }

            private renderAudioControls() {
                this.tourAudioControls.stop();
                this.tourAudioControls.html('<source src="' + this.tourAudioInput.val() + '" />');

                if (CZ.Data.validURL(this.tourAudioInput.val())) {
                    this.tourAudioControls.show();
                }
                else {
                    this.tourAudioControls.hide();
                }
            }

            private onStopsReordered() {
                this.updateSequence();
            }

            private onStopRemoved() {
                this.updateSequence();
            }

            private updateSequence() {
                var stops = this.getStops();
                var n = stops.length;
                var lapseTime = 0;
                for (var i = 0; i < n; i++) {
                    var stop = stops[i];
                    stop.LapseTime = lapseTime;
                    lapseTime += Settings.tourDefaultTransitionTime;
                }
            }

            // New tour stop is added.
            private onTargetElementSelected(targetElement: any) {
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.hideMessageWindow();
                CZ.Authoring.isActive = false;
                CZ.Authoring.callback = null;

                if (targetElement) {
                    var n = this.tourStopsListBox.items.length;
                    var stop = new TourStop(targetElement);
                    stop.LapseTime = n == 0 ? 0 : (<TourStop>(<TourStopListItem> this.tourStopsListBox.items[this.tourStopsListBox.items.length - 1]).data).LapseTime + Settings.tourDefaultTransitionTime;
                    this.tourStopsListBox.add(stop);
                }
                this.show();
            }
        }
    }
}