var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            function _addContentItemForm(form, addSeparator) {
                var container = $("<div></div>", {
                    class: "cz-authoring-ci-container"
                });
                var title = $("<p></p>").append($("<label></label>", {
                    text: "Title"
                })).append($("<input></input>", {
                    class: "cz-authoring-ci-title",
                    style: "display: block;",
                    type: "text"
                }));
                var description = $("<p></p>").append($("<label></label>", {
                    style: "display: block;",
                    text: "Description"
                })).append($("<textarea></textarea>", {
                    class: "cz-authoring-ci-description",
                    style: "display: block;"
                }));
                var mediaSource = $("<p></p>").append($("<label></label>", {
                    text: "URL of image or video"
                })).append($("<input></input>", {
                    class: "cz-authoring-ci-uri",
                    style: "display: block;",
                    type: "text"
                }));
                var mediaType = $("<p></p>").append($("<label></label>", {
                    text: "Media type"
                })).append($("<select></select>", {
                    class: "cz-authoring-ci-media-type",
                    style: "display: block;"
                }).append($("<option></option>", {
                    value: "image",
                    text: "Image"
                }), $("<option></option>", {
                    value: "pdf",
                    text: "PDF"
                }), $("<option></option>", {
                    value: "video",
                    text: "Video"
                }), $("<option></option>", {
                    value: "audio",
                    text: "Audio"
                })));
                var attribution = $("<p></p>").append($("<label></label>", {
                    text: "Attribution"
                })).append($("<input></input>", {
                    class: "cz-authoring-ci-attribution",
                    style: "display: block;",
                    type: "text"
                }));
                var mediaSourceURL = $("<p></p>").append($("<label></label>", {
                    text: "Media Source"
                })).append($("<input></input>", {
                    class: "cz-authoring-ci-media-source",
                    style: "display: block;",
                    type: "text"
                }));
                var removeBtn = $("<button></button>", {
                    text: "Remove content item",
                    click: function () {
                        container.remove();
                    }
                });
                container.append(title);
                container.append(description);
                container.append(mediaSource);
                container.append(mediaType);
                container.append(attribution);
                container.append(mediaSourceURL);
                container.append(removeBtn);
                if(addSeparator == true) {
                    var separator = $("<hr />");
                    container.append(separator);
                }
                form.append(container);
            }
            function _getContentItemsData() {
                var contentItems = [];
                var containers = $(".cz-authoring-ci-container");
                $(".cz-authoring-ci-container").each(function () {
                    var CItitleInput = $(this).find(".cz-authoring-ci-title");
                    var mediaInput = $(this).find(".cz-authoring-ci-uri");
                    var mediaTypeInput = ($)(this).find(".cz-authoring-ci-media-type option");
                    var descriptionInput = $(this).find(".cz-authoring-ci-description");
                    var guid = $(this).attr("cz-authoring-ci-guid") || undefined;
                    var attributionInput = $(this).find(".cz-authoring-ci-attribution");
                    var mediaSourceInput = $(this).find(".cz-authoring-ci-media-source");
                    var selected = ($)(mediaTypeInput)[0];
                    for(var i = 0; i < mediaTypeInput.length; i++) {
                        if(mediaTypeInput[i].selected) {
                            selected = mediaTypeInput[i];
                            break;
                        }
                    }
                    contentItems.push({
                        title: CItitleInput.val(),
                        description: descriptionInput.val(),
                        uri: mediaInput.val(),
                        mediaType: selected.text,
                        attribution: attributionInput.val(),
                        mediaSource: mediaSourceInput.val(),
                        guid: guid,
                        parent: undefined
                    });
                });
                return contentItems;
            }
            function _fillContentItemForm(form, contentItem) {
                var titleInput = form.find(".cz-authoring-ci-title");
                var mediaInput = form.find(".cz-authoring-ci-uri");
                var mediaTypeInput = form.find(".cz-authoring-ci-media-type option");
                var descriptionInput = form.find(".cz-authoring-ci-description");
                var attributionInput = form.find(".cz-authoring-ci-attribution");
                var mediaSourceInput = form.find(".cz-authoring-ci-media-source");
                var mediaType = contentItem.mediaType.toLowerCase();
                if(mediaType === "picture") {
                    mediaType = "image";
                }
                form.attr("cz-authoring-ci-guid", contentItem.guid);
                titleInput.val(contentItem.title);
                mediaInput.val(contentItem.uri);
                descriptionInput.val(contentItem.description);
                attributionInput.val(contentItem.attribution);
                mediaSourceInput.val(contentItem.mediaSource);
                mediaTypeInput.each(function (option) {
                    if(this.value === mediaType) {
                        $(this).attr("selected", "selected");
                        return;
                    }
                });
            }
            function showCreateTimelineForm(t) {
                var isCancel = true;
                var titleInput = $("#timelineTitleInput");
                var startInput = new CZ.UI.DatePicker($("#timelineStartInput"));
                var endInput = new CZ.UI.DatePicker($("#timelineEndInput"));
                endInput.addEditMode_Infinite();
                titleInput.val(t.title);
                startInput.setDate(t.x);
                endInput.setDate(t.x + t.width);
                $("#createTimelineForm").dialog({
                    title: "create timeline",
                    modal: true,
                    height: 600,
                    width: 600,
                    buttons: {
                        "save and close": function () {
                            var isValid = CZ.Authoring.ValidateTimelineData(startInput.getDate(), endInput.getDate(), titleInput.val());
                            if(!isValid) {
                                $("#TimelineErrorSpan").css("display", "block");
                            }
                            if(isValid) {
                                var self = this;
                                isCancel = false;
                                CZ.Authoring.updateTimeline(t, {
                                    title: titleInput.val(),
                                    start: startInput.getDate(),
                                    end: endInput.getDate()
                                }).then(function (success) {
                                    $(self).dialog("close");
                                }, function (error) {
                                    alert("Unable to save changes. Please try again later.");
                                    console.log(error);
                                });
                            }
                        }
                    },
                    close: function () {
                        if(isCancel) {
                            CZ.Authoring.removeTimeline(t);
                        }
                        CZ.Authoring.isActive = false;
                        startInput.remove();
                        endInput.remove();
                        $("#TimelineErrorSpan").css("display", "none");
                        $("a:contains('create timeline')").removeClass("active");
                    }
                });
            }
            UI.showCreateTimelineForm = showCreateTimelineForm;
            function showEditTimelineForm(t) {
                var titleInput = $("#timelineTitleInput");
                var startInput = new CZ.UI.DatePicker($("#timelineStartInput"));
                var endInput = new CZ.UI.DatePicker($("#timelineEndInput"));
                endInput.addEditMode_Infinite();
                titleInput.val(t.title);
                startInput.setDate(t.x);
                endInput.setDate(t.x + t.width);
                $("#createTimelineForm").dialog({
                    title: "edit timeline",
                    modal: true,
                    height: 600,
                    width: 600,
                    buttons: {
                        "save and close": function () {
                            var isValid = CZ.Authoring.ValidateTimelineData(startInput.getDate(), endInput.getDate(), titleInput.val());
                            if(!isValid) {
                                $("#TimelineErrorSpan").css("display", "block");
                            }
                            if(isValid) {
                                var self = this;
                                CZ.Authoring.updateTimeline(t, {
                                    title: titleInput.val(),
                                    start: startInput.getDate(),
                                    end: endInput.getDate()
                                }).then(function (success) {
                                    $(self).dialog("close");
                                }, function (error) {
                                    alert("Unable to save changes. Please try again later.");
                                    console.log(error);
                                });
                            }
                        },
                        "delete": function () {
                            if(confirm("Are you sure want to delete timeline and all of its nested timelines and exhibits? Delete can't be undone!")) {
                                CZ.Authoring.removeTimeline(t);
                                $(this).dialog("close");
                            }
                        }
                    },
                    close: function () {
                        CZ.Authoring.isActive = false;
                        startInput.remove();
                        endInput.remove();
                        $("a:contains('edit timeline')").removeClass("active");
                        $("#TimelineErrorSpan").css("display", "none");
                    }
                });
            }
            UI.showEditTimelineForm = showEditTimelineForm;
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
            function showEditContentItemForm(c, e) {
                var titleInput = $("#contentItemTitleInput");
                var mediaInput = $("#contentItemMediaSourceInput");
                var descriptionInput = $("#contentItemDescriptionInput");
                var mediaTypeInput = ($)("#contentItemMediaTypeInput option");
                var attributionInput = $("#cz-authoring-ci-attribution");
                var mediaSourceInput = $("#cz-authoring-ci-media-source");
                var mediaType = c.contentItem.mediaType.toLowerCase();
                if(mediaType === "picture") {
                    mediaType = "image";
                }
                titleInput.val(c.contentItem.title);
                mediaInput.val(c.contentItem.uri);
                descriptionInput.val(c.contentItem.description);
                attributionInput.val(c.contentItem.attribution);
                mediaSourceInput.val(c.contentItem.mediaSource);
                mediaTypeInput.each(function (option) {
                    if(this.value === mediaType) {
                        $(this).attr("selected", "selected");
                        return;
                    }
                });
                $("#editContentItemForm").dialog({
                    title: "Edit content item",
                    modal: true,
                    height: 600,
                    width: 600,
                    buttons: {
                        "save and close": function () {
                            var selected = mediaTypeInput[0];
                            for(var i = 1; i < mediaTypeInput.length; i++) {
                                if(mediaTypeInput[i].selected) {
                                    selected = mediaTypeInput[i];
                                }
                            }
                            CZ.Authoring.updateContentItem(c, {
                                title: titleInput.val(),
                                uri: mediaInput.val(),
                                mediaType: selected.text,
                                description: descriptionInput.val(),
                                attribution: attributionInput.val(),
                                mediaSource: mediaSourceInput.val()
                            });
                            $(this).dialog("close");
                        },
                        "delete": function () {
                            if(confirm("Are you sure want to delete content item? Delete can't be undone!")) {
                                CZ.Authoring.removeContentItem(c);
                                $(this).dialog("close");
                            }
                        }
                    },
                    close: function () {
                        CZ.Authoring.isActive = false;
                        $("a:contains('edit exhibit')").removeClass("active");
                    }
                });
            }
            UI.showEditContentItemForm = showEditContentItemForm;
            function showEditProfileForm() {
                var username = $("#profile_username");
                var email = $("#profile_email");
                var display_name = $("profile_display_name");
                var agreement = $("profile_agreement");
                $("#editProfileForm").dialog({
                    title: "edit profile",
                    modal: true,
                    height: 600,
                    width: 600,
                    buttons: {
                        "save and close": function () {
                            CZ.Service.putProfile(username, display_name, email);
                        }
                    },
                    close: function () {
                        CZ.Authoring.isActive = false;
                    }
                });
            }
            UI.showEditProfileForm = showEditProfileForm;
            function showLoginForm() {
                $("#loginForm").dialog({
                    title: "login",
                    modal: true,
                    height: 600,
                    width: 600,
                    close: function () {
                        CZ.Authoring.isActive = false;
                    }
                });
            }
            UI.showLoginForm = showLoginForm;
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
            function editProfile() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "editProfile") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "editProfile";
                CZ.Authoring.showEditProfileForm();
            }
            UI.editProfile = editProfile;
            function login() {
                if(CZ.Layout.animatingElements.length != 0) {
                    return;
                }
                CZ.Authoring.isActive = (CZ.Authoring.mode !== "login") || !CZ.Authoring.isActive;
                CZ.Authoring.mode = "login";
                CZ.Authoring.showLoginForm();
            }
            UI.login = login;
        })(Authoring.UI || (Authoring.UI = {}));
        var UI = Authoring.UI;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
