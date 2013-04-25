var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            function showCreateExhibitForm(e) {
                var isCancel = true;
                var titleInput = $("#exhibitTitleInput");
                var dateInput = new CZ.UI.DatePicker($("#exhibitDateInput"));
                titleInput.val(e.title);
                dateInput.setDate(e.infodotDescription.date);
                var contentItems = e.contentItems;
                for(var i = 0; i < contentItems.length; i++) {
                    _addContentItemForm($("#createExhibitForm"), true);
                }
                $(".cz-authoring-ci-container").each(function (index) {
                    _fillContentItemForm($(this), contentItems[index]);
                });
                $("#createExhibitForm").dialog({
                    title: "create exhibit",
                    modal: true,
                    height: 600,
                    width: 600,
                    buttons: {
                        "save and close": function () {
                            var contentItems = _getContentItemsData();
                            var isValid = CZ.Authoring.ValidateExhibitData(dateInput.getDate(), titleInput.val(), contentItems);
                            if(!isValid) {
                                $("#ExhibitErrorSpan").css("display", "block");
                            } else {
                                CZ.Authoring.updateExhibit(e, {
                                    title: titleInput.val(),
                                    date: dateInput.getDate(),
                                    contentItems: contentItems
                                });
                                isCancel = false;
                                $(this).dialog("close");
                            }
                        },
                        "add content item": function () {
                            if($(this).find(".cz-authoring-ci-container").length < CZ.Settings.infodotMaxContentItemsCount) {
                                _addContentItemForm($(this), true);
                            }
                        }
                    },
                    close: function () {
                        if(isCancel) {
                            CZ.Authoring.removeExhibit(e);
                        }
                        CZ.Authoring.isActive = false;
                        dateInput.remove();
                        $("a:contains('create exhibit')").removeClass("active");
                        $("#ExhibitErrorSpan").css("display", "none");
                        $(this).find(".cz-authoring-ci-container").each(function () {
                            $(this).remove();
                        });
                    }
                });
            }
            UI.showCreateExhibitForm = showCreateExhibitForm;
            function showEditExhibitForm(e) {
                var titleInput = $("#exhibitTitleInput");
                var dateInput = new CZ.UI.DatePicker($("#exhibitDateInput"));
                titleInput.val(e.title);
                dateInput.setDate(e.infodotDescription.date);
                var contentItems = e.contentItems;
                for(var i = 0; i < contentItems.length; i++) {
                    _addContentItemForm($("#createExhibitForm"), true);
                }
                $(".cz-authoring-ci-container").each(function (index) {
                    _fillContentItemForm($(this), contentItems[index]);
                });
                $("#createExhibitForm").dialog({
                    title: "edit exhibit",
                    modal: true,
                    height: 600,
                    width: 600,
                    buttons: {
                        "save and close": function () {
                            contentItems = _getContentItemsData();
                            var isValid = CZ.Authoring.ValidateExhibitData(dateInput.getDate(), titleInput.val(), contentItems);
                            if(!isValid) {
                                $("#ExhibitErrorSpan").css("display", "block");
                            } else {
                                CZ.Authoring.updateExhibit(e, {
                                    title: titleInput.val(),
                                    date: dateInput.getDate(),
                                    contentItems: contentItems
                                });
                                $(this).dialog("close");
                                $(this).find(".cz-authoring-ci-container").each(function () {
                                    $(this).remove();
                                });
                            }
                        },
                        "delete": function () {
                            if(confirm("Are you sure want to delete exhibit and all of its content items? Delete can't be undone!")) {
                                CZ.Authoring.removeExhibit(e);
                                $(this).dialog("close");
                            }
                        },
                        "add content item": function () {
                            if($(this).find(".cz-authoring-ci-container").length < CZ.Settings.infodotMaxContentItemsCount) {
                                _addContentItemForm($("#createExhibitForm"), true);
                            }
                        }
                    },
                    close: function () {
                        CZ.Authoring.isActive = false;
                        dateInput.remove();
                        $("a:contains('edit exhibit')").removeClass("active");
                        $("#ExhibitErrorSpan").css("display", "none");
                        $(this).find(".cz-authoring-ci-container").each(function () {
                            $(this).remove();
                        });
                    }
                });
            }
            UI.showEditExhibitForm = showEditExhibitForm;
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
