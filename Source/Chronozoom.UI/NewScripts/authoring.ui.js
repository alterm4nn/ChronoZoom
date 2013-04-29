var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            function createTimeline() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "createTimeline") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "createTimeline";
                $("div #footer-authoring > a").removeClass("active");
                if(CZ.Authoring.isActive) {
                    $("a:contains('create timeline')").addClass("active");
                } else {
                    $("a:contains('create timeline')").removeClass("active");
                }
            }
            UI.createTimeline = createTimeline;
            function editTimeline() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editTimeline") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editTimeline";
                $("div #footer-authoring > a").removeClass("active");
                if(CZ.Authoring.isActive) {
                    $("a:contains('edit timeline')").addClass("active");
                } else {
                    $("a:contains('edit timeline')").removeClass("active");
                }
            }
            UI.editTimeline = editTimeline;
            function createExhibit() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "createExhibit") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "createExhibit";
                $("div #footer-authoring > a").removeClass("active");
                if(CZ.Authoring.isActive) {
                    $("a:contains('create exhibit')").addClass("active");
                } else {
                    $("a:contains('create exhibit')").removeClass("active");
                }
            }
            UI.createExhibit = createExhibit;
            function editExhibit() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editExhibit") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editExhibit";
                $("div #footer-authoring > a").removeClass("active");
                if(CZ.Authoring.isActive) {
                    $("a:contains('edit exhibit')").addClass("active");
                } else {
                    $("a:contains('edit exhibit')").removeClass("active");
                }
            }
            UI.editExhibit = editExhibit;
        })(Authoring.UI || (Authoring.UI = {}));
        var UI = Authoring.UI;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
