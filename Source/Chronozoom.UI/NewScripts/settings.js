var CZ = (function (CZ, $) {
    var Settings = CZ.Settings = CZ.Settings || {
    };
    $.extend(Settings, {
        maxTickArrangeIterations: 3,
        tickLength: 25,
        smallTickLength: 12.5,
        minLabelSpace: 50,
        minTickSpace: 8,
        minSmallTickSpace: 8,
        timescaleThickness: 2
    });
    return CZ;
})(CZ || {
}, jQuery);
