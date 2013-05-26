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

            public get Type(): string {
                return this.type;
            }

        }

        export class FormEditTour extends CZ.UI.FormBase {
            private saveButton: JQuery;
            private deleteButton: JQuery;
            private addStopButton: JQuery;
            private titleInput: JQuery;
            private tourTitleInput: JQuery;
            private stops: TourStop[];
            private tour: any;

            public tourStopsListBox: TourStopListBox;


            // We only need to add additional initialization in constructor.
            constructor(container: JQuery, formInfo: IFormEditTourInfo) {
                super(container, formInfo);


                this.saveButton = container.find(formInfo.saveButton);
                this.deleteButton = container.find(formInfo.deleteButton);
                this.addStopButton = container.find(formInfo.addStopButton);
                this.titleInput = container.find(formInfo.titleInput);

                this.tourTitleInput = this.container.find(".cz-form-tour-title");

                this.saveButton.off();
                this.deleteButton.off();

                this.tour = formInfo.context;
                this.stops = [];
                if (this.tour) {
                    this.tourTitleInput.val(this.tour.title);
                    for (var i = 0, len = this.tour.bookmarks.length; i < len; i++) {
                        var bookmark = this.tour.bookmarks[i];
                        var target = CZ.Tours.bookmarkUrlToElement(bookmark.url);
                        if (target == null) {
                            target = {
                                type: "Unknown"
                            };
                        }
                        var stop = new TourStop(target, (!bookmark.caption || $.trim(bookmark.caption) === "") ? this.tour.title : bookmark.caption);
                        this.stops.push(stop);
                    }
                }
                this.tourStopsListBox = new CZ.UI.TourStopListBox(container.find(formInfo.tourStopsListBox), formInfo.tourStopsTemplate, this.stops);

                this.initialize();
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
                    if (this.tour == null) { // create new tour
                        // Add the tour to the local tours collection
                        var name = this.tourTitleInput.val();

                        // build array of bookmarks of current tour
                        var tourBookmarks = new Array();
                        var lapseTime = 0.0;

                        for (var j = 0, n = this.tourStopsListBox.items.length; j < n; j++) {
                            var tourstopItem = <TourStopListItem> this.tourStopsListBox.items[j];
                            var tourstop = <TourStop> tourstopItem.data;
                                                      
                            var url = UrlNav.vcelementToNavString(tourstop.Target);
                            var title = tourstop.Title;
                            var text = "";
                            tourBookmarks.push(new CZ.Tours.TourBookmark(url, title, lapseTime, text));

                            lapseTime += 10;
                        }

                        this.tour = new CZ.Tours.Tour(name,
                            tourBookmarks,
                            CZ.Tours.bookmarkTransition,
                            CZ.Common.vc,
                            "my tours", // catgory
                            "", //audio
                            CZ.Tours.tours.length)
                        CZ.Tours.tours.push(this.tour);
                        this.initializeAsEdit();
                    }
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

                this.activationSource.removeClass("active");
                this.container.find("cz-form-errormsg").hide();
                this.tourStopsListBox.container.empty();
            }

            private onTargetElementSelected(targetElement: any) {
                CZ.Authoring.isActive = false;
                CZ.Authoring.mode = "editTour";
                CZ.Authoring.callback = null;

                var stop = new TourStop(targetElement);
                this.tourStopsListBox.add(stop);
                this.show();
            }
        }
    }
}