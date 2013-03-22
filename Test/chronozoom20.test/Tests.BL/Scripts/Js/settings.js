var CZ = (function (CZ, $) {
    var Settings = CZ.Settings = CZ.Settings || {};

    $.extend(Settings, {
        // Timescale settings.
        maxTickArrangeIterations: 3, // max number of iterations in loop of ticks creating
        tickLength: 25, // length of major tick
        smallTickLength: 12.5, // length of small tick
        minLabelSpace: 50, // minimum space (in px) between 2 labels on timescale
        minTickSpace: 8, // minimum space (in px) between 2 ticks on timescale
        minSmallTickSpace: 8,
        timescaleThickness: 2 // thickness of timescale's baseline and ticks
    });

    return CZ;
})(CZ || {}, jQuery);