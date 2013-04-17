var CZ;
(function (CZ) {
    (function (UI) {
        var DatePicker = (function () {
            function DatePicker(datePicker) {
                this.datePicker = datePicker;
                this.initialize();
            }
            DatePicker.prototype.initialize = function () {
                this.mode = $("<select class='cz-datepicker-mode'></select>");
                var optionYear = $("<option value='year'>Year</option>");
                var optionDate = $("<option value='date'>Date</option>");
                var self = this;
                this.mode.change(function (event) {
                    var mode = self.mode.find(":selected").val();
                    switch(mode) {
                        case "year":
                            self.editModeYear();
                            break;
                        case "date":
                            self.editModeDate();
                            break;
                    }
                });
                this.mode.append(optionYear);
                this.mode.append(optionDate);
                this.datePicker.append(this.mode);
                this.container = $("<div class='cz-datepicker-container'></div>");
                this.datePicker.append(this.container);
                this.editModeYear();
            };
            DatePicker.prototype.setDate = function (coordinate) {
                var date = CZ.Common.convertCoordinateToYear(coordinate);
                this.datePicker.find(".cz-datepicker-year").val(date.year);
                this.datePicker.find(".cz-datepicker-regime option").each(function () {
                    if(this.value == date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            };
            DatePicker.prototype.getDate = function () {
                var year = this.datePicker.find(".cz-datepicker-year").val();
                var regime = this.datePicker.find(".cz-datepicker-regime :selected").val();
                return CZ.Common.convertYearToCoordinate(year, regime);
            };
            DatePicker.prototype.remove = function () {
                this.mode.remove();
                this.container.remove();
            };
            DatePicker.prototype.editModeYear = function () {
                this.container.empty();
                var yearBox = $("<input type='text' class='cz-datepicker-year'></input>");
                var regimesSelect = $("<select class='cz-datepicker-regime'></select>");
                var optionGa = $("<option value='ga'>Ga</option>");
                var optionMa = $("<option value='ma'>Ma</option>");
                var optionKa = $("<option value='ka'>Ka</option>");
                var optionBCE = $("<option value='bce'>BCE</option>");
                var optionCE = $("<option value='ce'>CE</option>");
                regimesSelect.append(optionGa).append(optionMa).append(optionKa).append(optionBCE).append(optionCE);
                this.container.append(yearBox);
                this.container.append(regimesSelect);
            };
            DatePicker.prototype.editModeDate = function () {
                this.container.empty();
                var daySelector = $("<select class='cz-datepicker-day-selector'></select>");
                var monthSelector = $("<select class='cz-datepicker-month-selector'></select>");
                var yearBox = $("<input type='text' class='cz-datepicker-year'></input>");
                monthSelector.change(function (event) {
                    daySelector.empty();
                    var selectedIndex = (monthSelector[0]).selectedIndex;
                    for(var i = 0; i < CZ.Settings.daysInMonth[selectedIndex]; i++) {
                        var dayOption = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        daySelector.append(dayOption);
                    }
                });
                for(var i = 0; i < CZ.Settings.months.length; i++) {
                    var monthOption = $("<option value='" + CZ.Settings.months[i] + "'>" + CZ.Settings.months[i] + "</option>");
                    monthSelector.append(monthOption);
                }
                this.container.append(monthSelector);
                this.container.append(daySelector);
                this.container.append(yearBox);
            };
            DatePicker.prototype.editModeNone = function () {
                this.container.empty();
            };
            return DatePicker;
        })();
        UI.DatePicker = DatePicker;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
