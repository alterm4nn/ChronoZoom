var CZ;
(function (CZ) {
    (function (UI) {
        var DatePicker = (function () {
            function DatePicker(datePicker) {
                this.datePicker = datePicker;
                this.initialize();
            }
            DatePicker.prototype.initialize = function () {
                var mode = $("<select class='cz-datepicker-mode'></select>");
                var optionYear = $("<option value='year'>Year</option>");
                var optionDate = $("<option value='date'>Date</option>");
                mode.append(optionYear);
                mode.append(optionDate);
                this.datePicker.append(mode);
                var container = $("<div class='cz-datepicker-container'></div>");
                var yearBox = $("<input type='text' class='cz-datepicker-year'></input>");
                var regimesSelect = $("<select class='cz-datepicker-regime'></select>");
                var optionGa = $("<option value='ga'>Ga</option>");
                var optionMa = $("<option value='ma'>Ma</option>");
                var optionKa = $("<option value='ka'>Ka</option>");
                var optionBCE = $("<option value='bce'>BCE</option>");
                var optionCE = $("<option value='ce'>CE</option>");
                regimesSelect.append(optionGa).append(optionMa).append(optionKa).append(optionBCE).append(optionCE);
                container.append(yearBox);
                container.append(regimesSelect);
                this.datePicker.append(container);
            };
            DatePicker.prototype.setDate = function (coordinate) {
                this.coordinate = coordinate;
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
                var regime = $(this.datePicker.find(".cz-datepicker-regime option")[0]).val();
                this.datePicker.find(".cz-datepicker-regime option").each(function () {
                    if(this.selected) {
                        regime = $(this).val();
                    }
                });
                return CZ.Common.convertYearToCoordinate(year, regime);
            };
            DatePicker.prototype.remove = function () {
                this.datePicker.find(".cz-datepicker-mode").remove();
                this.datePicker.find(".cz-datepicker-container").remove();
            };
            return DatePicker;
        })();
        UI.DatePicker = DatePicker;        
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
