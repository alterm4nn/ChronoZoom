/// <reference path='authoring.ts'/>
/// <reference path='settings.ts'/>
/// <reference path='layout.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>
/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            // Mouseup handlers.
            // Opens a window for creating new tour.
            function createTour() {
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = false;
                CZ.Authoring.mode = "editTour";

                Authoring.showEditTourForm(null);
            }
            UI.createTour = createTour;

            function createTimeline() {
                if (CZ.Layout.animatingElements.length != 0) {
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
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editTimeline") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editTimeline";
            }
            UI.editTimeline = editTimeline;

            function createExhibit() {
                if (CZ.Layout.animatingElements.length != 0) {
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
                if (CZ.Layout.animatingElements.length != 0) {
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
