/// <reference path="../Utils/jquery-1.7.2.min.js" />
/// <reference path="../Js/dates.js" />
/// <reference path="../Js/settings.js" />
/// <reference path="../Js/datepicker.js" />

describe("CZ datepicker", function () {
    var alertMessage;
    alert = function (message) { alertMessage = message; };

    var datepicker;
    var INFINITY_VALUE = 9999;
    beforeEach(function () {
        init();
        container = $('#datepicker');
        datepicker = new CZ.UI.DatePicker(container);
        alertMessage = '';
    });

    afterEach(function () {
        container.remove();
    });
    

    describe("setDate() function", function () {
        // set date as inifinity, 'infinite' edit mode was added to datepicker
        it("should set datepicker mode to 'infinite' mode if 9999 is date to set and 'infinite'" +
            " mode selector was added to datepicker",
            function () {
                var expectedMode = 'infinite';
                datepicker.addEditMode_Infinite();
                datepicker.setDate(INFINITY_VALUE, true);

                modeSelector = container.find(".cz-datepicker-mode");
                selected = "";
                modeSelector.find("option").each(function () {
                    if (this.selected === true) {
                        selected = $(this).val();
                    }
                });

                expect(expectedMode).toEqual(selected);
        });

        // set date as inifinity, 'infinite' edit mode wasn't added to datepicker
        it("should set datepicker mode to 'year' mode if 9999 is date to set and 'infinite'" +
            " mode selector wasn't added to datepicker", function () {
                var expectedMode = 'year';
                datepicker.setDate(INFINITY_VALUE);

                modeSelector = container.find(".cz-datepicker-mode");
                selected = "";
                modeSelector.find("option").each(function () {
                    if (this.selected === true) {
                        selected = $(this).val();
                    }
                });
                expect(expectedMode).toEqual(selected);
        });

        correctDates = ["1000", "-1000", "   1000"];
        using("Data set: ", [correctDates], function (correctDates) {
            // set correct number
            it("should set date if it's correct number", function () {
                datepicker.setDate(correctDates);
                var result = datepicker.getDate();
                expect("0").toNotEqual(result);
            });
        });

        incorrectDates = ["22sd", "", "d", "  . 5"];
        using("Data set: ", [incorrectDates], function (incorrectDates) {
            // set wrong number
            it("shouldn't set date if it isn't a number", function () {
                datepicker.setDate(incorrectDates);
                var result = datepicker.getDate();
                expect("0").toEqual(result);               
            });
        });
    });

    describe("getDate() function", function () {
        // mode "year", fraction value
        it("should return integer value in 'year' edit mode", function () {
            datepicker.editModeYear();
            datepicker.setDate("1000.5");
            result = datepicker.getDate();
            
            expect("1000").toEqual(result);
        });

        // mode "date", integer value
        it("may return integer value in 'date' edit mode", function () {
            container.find(":selected").selected = false;
            container.find("option").each(function () {
                if ($(this).val === "date") {
                    $(this).selected = true;

                    datepicker.setDate("1000");
                    result = datepicker.getDate();

                    expect("1000").toEqual(result);
                }
            });            
        });

        // mode "date", fraction value
        it("may return fraction value in 'date' edit mode", function () {
            container.find(":selected").selected = false;
            container.find("option").each(function () {
                if ($(this).val === "date") {
                    $(this).selected = true;

                    datepicker.setDate("1000.5");
                    result = datepicker.getDate();

                    expect("1000.5").toEqual(result);
                }
            });
        });

        // mode "infinite"
        it("should return 9999 value in 'infinite' edit mode", function () {
            datepicker.addEditMode_Infinite();

            container.find(":selected").selected = false;
            container.find("option").each(function () {
                if ($(this).val === "infinite") {
                    $(this).selected = true;
                    result = datepicker.getDate();

                    expect(INFINITY_VALUE).toEqual(result);
                }
            });
        });
    });

    describe("validateNumber() function", function () {
        // wrong input
        incorrectNumbers = ["5a", ".5a", "5 0", "a 5"]
        using("Data set: ", [incorrectNumbers], function (incorrectNumbers) {
            it("should return false if value is not correct number", function () {
                result = datepicker.validateNumber(incorrectNumbers);
                expect(false).toEqual(result);
            });
        });

        // correct input
        correctNumbers = ["5", "-5", ".5", " 5"]
        using("Data set: ", [correctNumbers], function (correctNumbers) {
            it("should return false if value is not correct number", function () {
                result = datepicker.validateNumber(correctNumbers);
                expect("0").toNotEqual(result);
            });
        });
    });
});

function init() {
    $('#datepicker').length == 0 ? $('body').prepend('<div id="datepicker"></div>') : "";
}

function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        for (var j = 0, length = values[i].length; j < length; j++) {
            func.apply(this, [values[i][j]]);
            jasmine.currentEnv_.currentSpec.description += ' ' + name + '[' + "date: " + values[i][j] + ']';
        }
    }
}