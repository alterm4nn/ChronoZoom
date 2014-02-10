/// <reference path='authoring.ts'/>
/// <reference path='settings.ts'/>
/// <reference path='layout.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>

/// <reference path='typings/jqueryui/jqueryui.d.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module Authoring {
        export module UI {
            // Mouseup handlers.

            // Opens a window for creating new tour.
            export function createTour() {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = false; // for now we do not watch for mouse moves
                CZ.Authoring.mode = "editTour";

                showEditTourForm(null);
            }

            export function createTimeline () {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.showMessageWindow(
                    "Click and drag to set the approximate length of the timeline.",
                    "Create Timeline"
                );

                var prevIsActive = CZ.Authoring.isActive;
                var prevMode = CZ.Authoring.mode;
                var messageForm = CZ.HomePageViewModel.getFormById("#message-window");

                messageForm.closeButton.click(event => {
                    CZ.Authoring.isActive = prevIsActive;
                    CZ.Authoring.mode = prevMode;
                    CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
                });

                CZ.Authoring.isActive = true;
                CZ.Authoring.mode = "createTimeline";

                CZ.Common.vc.virtualCanvas("cloakNonRootVirtualSpace");
            }

            export function editTimeline () {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editTimeline") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editTimeline";
            }

            export function createExhibit () {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.showMessageWindow(
                    "Click inside a timeline to set the approximate date of the exhibit.",
                    "Create Exhibit"
                );

                var prevIsActive = CZ.Authoring.isActive;
                var prevMode = CZ.Authoring.mode;
                var messageForm = CZ.HomePageViewModel.getFormById("#message-window");

                messageForm.closeButton.click(event => {
                    CZ.Authoring.isActive = prevIsActive;
                    CZ.Authoring.mode = prevMode;
                    CZ.Common.vc.virtualCanvas("showNonRootVirtualSpace");
                });

                CZ.Authoring.isActive = true;
                CZ.Authoring.mode = "createExhibit";

                CZ.Common.vc.virtualCanvas("cloakNonRootVirtualSpace");
            }

            export function editExhibit () {
                // skip authoring during ongoing dynamic layout animation
                if (CZ.Layout.animatingElements.length != 0) {
                    return;
                }

                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editExhibit") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editExhibit";
            }
        }
    }
}
