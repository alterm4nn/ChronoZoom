var CZ = (function (CZ, $) {
    var Settings = CZ.Settings = CZ.Settings || {
    };
    $.extend(Settings, {
        maxTickArrangeIterations: // Timescale settings.
        3,
        tickLength: // max number of iterations in loop of ticks creating
        25,
        smallTickLength: // length of major tick
        12.5,
        minLabelSpace: // length of small tick
        50,
        minTickSpace: // minimum space (in px) between 2 labels on timescale
        8,
        minSmallTickSpace: // minimum space (in px) between 2 ticks on timescale
        8,
        timescaleThickness: 2
    });
    // thickness of timescale's baseline and ticks
    return CZ;
})(CZ || {
}, jQuery);
