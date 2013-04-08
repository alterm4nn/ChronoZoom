/// <reference path="../Utils/jquery-1.8.0.min.js" />
/// <reference path="../Js/csvUtils.js" />

//https://github.com/jphpsf/jasmine-data-provider
function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, [values[i][0], values[i][1]]);
        jasmine.currentEnv_.currentSpec.description += ' (with "' + name + '" using ' + values[i][0].concat(' ') + ')';
    }
}