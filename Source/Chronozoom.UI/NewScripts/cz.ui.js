var CZ;
(function (CZ) {
    (function (UI) {
        var DatePicker = (function () {
            function DatePicker(datePicker) {
                this.datePicker = datePicker;
                this.initialize();
            }
            DatePicker.prototype.initialize = function () {
                this.modeSelector = $("<select class='cz-datepicker-mode'></select>");
                var optionYear = $("<option value='year'>Year</option>");
                var optionDate = $("<option value='date'>Date</option>");
                var self = this;
                this.modeSelector.change(function (event) {
                    var mode = self.modeSelector.find(":selected").val();
                    switch(mode) {
                        case "year":
                            self.editModeYear();
                            self.setDate(self.coordinate);
                            break;
                        case "date":
                            self.editModeDate();
                            self.setDate_DateMode(self.coordinate);
                            break;
                        case "infinite":
                            self.editModeInfinite();
                            break;
                    }
                });
                this.modeSelector.append(optionYear);
                this.modeSelector.append(optionDate);
                this.container = $("<div class='cz-datepicker-container'></div>");
                this.datePicker.append(this.modeSelector);
                this.datePicker.append(this.container);
                this.editModeYear();
            };
            DatePicker.prototype.remove = function () {
                this.modeSelector.remove();
                this.container.remove();
            };
            DatePicker.prototype.addEditMode_Infinite = function () {
                var optionIntinite = $("<option value='infinite'>Infinite</option>");
                this.modeSelector.append(optionIntinite);
            };
            DatePicker.prototype.setDate = function (coordinate) {
                this.coordinate = coordinate;
                var mode = this.modeSelector.find(":selected").val();
                switch(mode) {
                    case "year":
                        this.setDate_YearMode(coordinate);
                        break;
                    case "date":
                        this.setDate_DateMode(coordinate);
                        break;
                }
            };
            DatePicker.prototype.getDate = function () {
                var mode = this.modeSelector.find(":selected").val();
                switch(mode) {
                    case "year":
                        return this.getDate_YearMode();
                        break;
                    case "date":
                        return this.getDate_DateMode();
                        break;
                    case "infinite":
                        return 9999;
                        break;
                }
            };
            DatePicker.prototype.editModeYear = function () {
                this.container.empty();
                this.yearSelector = $("<input type='text' class='cz-datepicker-year'></input>");
                this.regimeSelector = $("<select class='cz-datepicker-regime'></select>");
                var optionGa = $("<option value='ga'>Ga</option>");
                var optionMa = $("<option value='ma'>Ma</option>");
                var optionKa = $("<option value='ka'>Ka</option>");
                var optionBCE = $("<option value='bce'>BCE</option>");
                var optionCE = $("<option value='ce'>CE</option>");
                this.regimeSelector.append(optionGa).append(optionMa).append(optionKa).append(optionBCE).append(optionCE);
                this.container.append(this.yearSelector);
                this.container.append(this.regimeSelector);
            };
            DatePicker.prototype.editModeDate = function () {
                this.container.empty();
                this.daySelector = $("<select class='cz-datepicker-day-selector'></select>");
                this.monthSelector = $("<select class='cz-datepicker-month-selector'></select>");
                this.yearSelector = $("<input type='text' class='cz-datepicker-year'></input>");
                var self = this;
                this.monthSelector.change(function (event) {
                    self.daySelector.empty();
                    var selectedIndex = (self.monthSelector[0]).selectedIndex;
                    for(var i = 0; i < CZ.Dates.daysInMonth[selectedIndex]; i++) {
                        var dayOption = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        self.daySelector.append(dayOption);
                    }
                });
                for(var i = 0; i < CZ.Dates.months.length; i++) {
                    var monthOption = $("<option value='" + CZ.Dates.months[i] + "'>" + CZ.Dates.months[i] + "</option>");
                    this.monthSelector.append(monthOption);
                }
                self.monthSelector.trigger("change");
                this.container.append(this.monthSelector);
                this.container.append(this.daySelector);
                this.container.append(this.yearSelector);
            };
            DatePicker.prototype.editModeInfinite = function () {
                this.container.empty();
            };
            DatePicker.prototype.setDate_YearMode = function (coordinate) {
                var date = CZ.Dates.convertCoordinateToYear(coordinate);
                this.yearSelector.val(date.year);
                this.regimeSelector.find("option").each(function () {
                    if(this.value === date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            };
            DatePicker.prototype.setDate_DateMode = function (coordinate) {
                var date = CZ.Dates.getDMYFromCoordinate(coordinate);
                this.yearSelector.val(date.year);
                var self = this;
                this.monthSelector.find("option").each(function (index) {
                    if(this.value === CZ.Dates.months[date.month]) {
                        $(this).attr("selected", "selected");
                        $.when(self.monthSelector.trigger("change")).done(function () {
                            self.daySelector.find("option").each(function () {
                                if(parseInt(this.value) === date.day) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        });
                    }
                });
            };
            DatePicker.prototype.getDate_YearMode = function () {
                var year = this.yearSelector.val();
                var regime = this.regimeSelector.find(":selected").val();
                return CZ.Dates.convertYearToCoordinate(year, regime);
            };
            DatePicker.prototype.getDate_DateMode = function () {
                var year = this.yearSelector.val();
                var month = this.monthSelector.find(":selected").val();
                month = CZ.Dates.months.indexOf(month);
                var day = this.daySelector.find(":selected").val();
                return CZ.Dates.getCoordinateFromDMY(year, month, day);
            };
            return DatePicker;
        })();
        UI.DatePicker = DatePicker;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
