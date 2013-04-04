var CZ;
(function (CZ) {
    (function (Authoring) {
        (function (UI) {
            function _addContentItemForm(form, addSeparator) {
                var container = $("<div class='cz-authoring-ci-container'></div>");
                var title = $("<p>" + "<label>Title</label>" + "<input class='cz-authoring-ci-title' style='display: block' type='text'/>" + "</p>");
                var description = $("<p>" + "<label style='display: block'>Description</label>" + "<textarea class='cz-authoring-ci-description' style='display: block' />" + "</p>");
                var mediaSource = $("<p>" + "<label>Media source</label>" + "<input class='cz-authoring-ci-media-source' style='display: block' type='text'/>" + "</p>");
                var mediaType = $("<p>" + "<label>Media type</label>" + "<select class='cz-authoring-ci-media-type' style='display: block'>" + "<option value='image'>Image</option>" + "<option value='pdf'>PDF</option> " + "<option value='video'>Video</option>" + "<option value='audio'>Audio</option>" + "</select>" + "</p>");
                var removeBtn = $("<button>Remove content item</button>");
                removeBtn[0].onclick = function () {
                    container.remove();
                };
                container.append(title);
                container.append(description);
                container.append(mediaSource);
                container.append(mediaType);
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
                    ;
                    var mediaInput = $(this).find(".cz-authoring-ci-media-source");
                    var mediaTypeInput = $(this).find(".cz-authoring-ci-media-type option");
                    var descriptionInput = $(this).find(".cz-authoring-ci-description");
                    var guid = $(this).attr("cz-authoring-ci-guid") || null;
                    var selected = $(mediaTypeInput)[0];
                    for(var i = 0; i < mediaTypeInput.length; i++) {
                        if(mediaTypeInput[i].getAttribute("selected") === "selected") {
                            selected = mediaTypeInput[i];
                            break;
                        }
                    }
                    contentItems.push({
                        title: CItitleInput.val(),
                        description: descriptionInput.val(),
                        uri: mediaInput.val(),
                        mediaType: selected.innerText,
                        guid: guid,
                        parent: null
                    });
                });
                return contentItems;
            }
        })(Authoring.UI || (Authoring.UI = {}));
        var UI = Authoring.UI;
    })(CZ.Authoring || (CZ.Authoring = {}));
    var Authoring = CZ.Authoring;
})(CZ || (CZ = {}));
