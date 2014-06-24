var CZ;
(function (CZ) {
    (function (UI) {
        var DatePicker = (function () {
            function DatePicker(datePicker) {
                this.datePicker = datePicker;
                this.INFINITY_VALUE = 9999;
                this.WRONG_YEAR_INPUT = "Year should be a number.";
                if (!(datePicker instanceof jQuery && datePicker.is("div")))
                    throw "DatePicker parameter is invalid! It should be jQuery instance of DIV.";

                this.coordinate = 0;

                this.initialize();
            }
            DatePicker.prototype.initialize = function () {
                var _this = this;
                this.datePicker.addClass("cz-datepicker");

                this.modeSelector = $("<select class='cz-datepicker-mode cz-input'></select>");

                var optionYear = $("<option value='year'>Year</option>");
                var optionDate = $("<option value='date'>Date</option>");

                this.modeSelector.change(function (event) {
                    var mode = _this.modeSelector.find(":selected").val();
                    _this.errorMsg.text("");
                    switch (mode) {
                        case "year":
                            _this.editModeYear();
                            _this.setDate_YearMode(_this.coordinate, false);
                            break;
                        case "date":
                            _this.editModeDate();
                            _this.setDate_DateMode(_this.coordinate);
                            break;

                        case "infinite":
                            _this.editModeInfinite();
                            break;
                    }
                });

                this.modeSelector.append(optionYear);
                this.modeSelector.append(optionDate);

                this.dateContainer = $("<div class='cz-datepicker-container'></div>");
                this.errorMsg = $("<div class='cz-datepicker-errormsg'></div>");
                this.datePicker.append(this.modeSelector);
                this.datePicker.append(this.dateContainer);
                this.datePicker.append(this.errorMsg);

                this.editModeYear();
                this.setDate(this.coordinate, true);
            };

            DatePicker.prototype.remove = function () {
                this.datePicker.empty();
                this.datePicker.removeClass("cz-datepicker");
            };

            DatePicker.prototype.addEditMode_Infinite = function () {
                var optionIntinite = $("<option value='infinite'>Infinite</option>");
                this.modeSelector.append(optionIntinite);
            };

            DatePicker.prototype.setCirca = function (circa) {
                $(this.circaSelector).find('input').prop('checked', circa);
            };

            DatePicker.prototype.setDate = function (coordinate, ZeroYearConversation) {
                if (typeof ZeroYearConversation === "undefined") { ZeroYearConversation = false; }
                if (!this.validateNumber(coordinate)) {
                    return false;
                }

                coordinate = Number(coordinate);
                this.coordinate = coordinate;
                var regime = CZ.Dates.convertCoordinateToYear(this.coordinate).regime;

                if (this.coordinate === this.INFINITY_VALUE) {
                    this.modeSelector.find(":selected").attr("selected", "false");
                    this.modeSelector.find("option").each(function () {
                        if ($(this).val() === "infinite") {
                            $(this).attr("selected", "selected");
                            return;
                        }
                    });
                    this.editModeInfinite();
                    return;
                }

                switch (regime.toLowerCase()) {
                    case "ga":
                    case "ma":
                    case "ka":
                        this.modeSelector.find(":selected").attr("selected", "false");
                        this.modeSelector.find("option").each(function () {
                            if ($(this).val() === "year") {
                                $(this).attr("selected", "selected");
                                return;
                            }
                        });
                        this.editModeYear();
                        this.setDate_YearMode(coordinate, ZeroYearConversation);
                        break;
                    case "bce":
                    case "ce":
                        this.modeSelector.find(":selected").attr("selected", "false");
                        this.modeSelector.find("option").each(function () {
                            if ($(this).val() === "date") {
                                $(this).attr("selected", "selected");
                                return;
                            }
                        });
                        this.editModeDate();
                        this.setDate_DateMode(coordinate);
                        break;
                }
            };

            DatePicker.prototype.getCirca = function () {
                var mode = this.modeSelector.find(":selected").val();
                switch (mode) {
                    case "year":
                    case "date":
                        return $(this.circaSelector).find('input').prop('checked');
                        break;
                    default:
                        return false;
                        break;
                }
            };

            DatePicker.prototype.getDate = function () {
                var mode = this.modeSelector.find(":selected").val();
                switch (mode) {
                    case "year":
                        return this.getDate_YearMode();
                        break;
                    case "date":
                        return this.getDate_DateMode();
                        break;

                    case "infinite":
                        return this.INFINITY_VALUE;
                        break;
                }
            };

            DatePicker.prototype.editModeYear = function () {
                var _this = this;
                this.dateContainer.empty();

                this.yearSelector = $("<input type='text' class='cz-datepicker-year-year cz-input'></input>");
                this.regimeSelector = $("<select class='cz-datepicker-regime cz-input'></select>");
                this.circaSelector = $('<div class="cz-datepicker-circa">Circa / Approximate: <input type="checkbox" /></label>');

                this.yearSelector.focus(function (event) {
                    _this.errorMsg.text("");
                });

                this.regimeSelector.change(function (event) {
                    _this.checkAndRemoveNonIntegerPart();
                });

                this.yearSelector.blur(function (event) {
                    if (!_this.validateNumber(_this.yearSelector.val())) {
                        _this.errorMsg.text(_this.WRONG_YEAR_INPUT);
                    }

                    _this.checkAndRemoveNonIntegerPart();
                });
                var optionGa = $("<option value='ga'>Ga</option>");
                var optionMa = $("<option value='ma'>Ma</option>");
                var optionKa = $("<option value='ka'>Ka</option>");
                var optionBCE = $("<option value='bce'>BCE</option>");
                var optionCE = $("<option value='ce'>CE</option>");

                this.regimeSelector.append(optionGa).append(optionMa).append(optionKa).append(optionBCE).append(optionCE);

                this.dateContainer.append(this.yearSelector);
                this.dateContainer.append(this.regimeSelector);
                this.dateContainer.append('<br />');
                this.dateContainer.append(this.circaSelector);
            };

            DatePicker.prototype.editModeDate = function () {
                var _this = this;
                this.dateContainer.empty();

                this.daySelector = $("<select class='cz-datepicker-day-selector cz-input'></select>");
                this.monthSelector = $("<select class='cz-datepicker-month-selector cz-input'></select>");
                this.yearSelector = $("<input type='text' class='cz-datepicker-year-date cz-input'></input>");
                this.circaSelector = $('<div class="cz-datepicker-circa">Circa / Approximate: <input type="checkbox" /></label>');

                this.yearSelector.focus(function (event) {
                    _this.errorMsg.text("");
                });

                this.yearSelector.blur(function (event) {
                    if (!_this.validateNumber(_this.yearSelector.val()))
                        _this.errorMsg.text(_this.WRONG_YEAR_INPUT);

                    _this.checkAndRemoveNonIntegerPart();
                });

                var self = this;
                this.monthSelector.change(function (event) {
                    self.daySelector.empty();

                    var selectedIndex = self.monthSelector[0].selectedIndex;
                    for (var i = 0; i < CZ.Dates.daysInMonth[selectedIndex]; i++) {
                        var dayOption = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        self.daySelector.append(dayOption);
                    }
                });

                for (var i = 0; i < CZ.Dates.months.length; i++) {
                    var monthOption = $("<option value='" + CZ.Dates.months[i] + "'>" + CZ.Dates.months[i] + "</option>");
                    this.monthSelector.append(monthOption);
                }

                self.monthSelector.trigger("change");

                this.dateContainer.append(this.monthSelector);
                this.dateContainer.append(this.daySelector);
                this.dateContainer.append(this.yearSelector);
                this.dateContainer.append('<br />');
                this.dateContainer.append(this.circaSelector);
            };

            DatePicker.prototype.editModeInfinite = function () {
                this.dateContainer.empty();
            };

            DatePicker.prototype.checkAndRemoveNonIntegerPart = function () {
                var regime = this.regimeSelector.find(":selected").val().toLowerCase();
                var mode = this.modeSelector.find(":selected").val().toLowerCase();

                if (regime === 'ce' || regime === 'bce' || mode === 'date') {
                    this.yearSelector.val(parseFloat(this.yearSelector.val()).toFixed());
                }
            };

            DatePicker.prototype.setDate_YearMode = function (coordinate, ZeroYearConversation) {
                var date = CZ.Dates.convertCoordinateToYear(coordinate);
                if ((date.regime.toLowerCase() == "bce") && (ZeroYearConversation))
                    date.year--;
                this.yearSelector.val(date.year.toString());

                this.regimeSelector.find(":selected").attr("selected", "false");

                this.regimeSelector.find("option").each(function () {
                    if (this.value === date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            };

            DatePicker.prototype.setDate_DateMode = function (coordinate) {
                var date = CZ.Dates.getYMDFromCoordinate(coordinate);

                this.yearSelector.val(date.year.toString());
                var self = this;

                this.monthSelector.find("option").each(function (index) {
                    if (this.value === CZ.Dates.months[date.month]) {
                        $(this).attr("selected", "selected");

                        $.when(self.monthSelector.trigger("change")).done(function () {
                            self.daySelector.find("option").each(function () {
                                if (parseInt(this.value) === date.day) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        });
                    }
                });
            };

            DatePicker.prototype.getDate_YearMode = function () {
                var year = this.yearSelector.val();
                if (!this.validateNumber(year))
                    return false;
                var regime = this.regimeSelector.find(":selected").val();

                return CZ.Dates.convertYearToCoordinate(year, regime);
            };

            DatePicker.prototype.getDate_DateMode = function () {
                var year = this.yearSelector.val();
                if (!this.validateNumber(year))
                    return false;
                year = parseInt(year);

                var month = this.monthSelector.find(":selected").val();
                month = CZ.Dates.months.indexOf(month);
                var day = parseInt(this.daySelector.find(":selected").val());

                return CZ.Dates.getCoordinateFromYMD(year, month, day);
            };

            DatePicker.prototype.validateNumber = function (year) {
                return !isNaN(Number(year)) && isFinite(Number(year)) && !isNaN(parseFloat(year));
            };
            return DatePicker;
        })();
        UI.DatePicker = DatePicker;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
