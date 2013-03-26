var CZ = (function (CZ, $) {
    var Service = CZ.Service = CZ.Service || {};

    $.extend(Service, {
        /* Creates given timeline on the server
        */
        putTimeline: function (t) {
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                url: serverUrlBase + "/api/collection/Timeline",
                data: JSON.stringify({
                    id: t.id,
                    title: t.title,
                    start: t.x,
                    end: t.x + t.width,
                    parent: t.parent.guid,
                    exhibits: undefined,
                    timelines: undefined
                }),
                success: function (result) {
                    //ProcessContent(result);
                    vc.virtualCanvas("updateViewport");
                },
                error: function (xhr) {
                    console.log(xhr);
                    alert("Error connecting to service:\n");
                }
            });
        },

        /* Updates given timeline on the server
        */
        updateTimeline: function (t) {

        },
    });

    return CZ;
})(CZ || {}, jQuery);