/// <reference path='common.ts'/>
/// <reference path='cz.settings.ts'/>

/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export class DatePicker {
            private mode: JQuery;
            private container: JQuery;

            constructor(public datePicker: JQuery) {
                this.initialize();
            };

            public initialize() {
                this.mode = $("<select class='cz-datepicker-mode'></select>");
                
                var optionYear: JQuery = $("<option value='year'>Year</option>");
                var optionDate: JQuery = $("<option value='date'>Date</option>");

                var self = this;
                this.mode.change(function (event) {
                    var mode = self.mode.find(":selected").val();

                    switch (mode) {
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
            }


            public setDate(coordinate: number) {
                var date = CZ.Common.convertCoordinateToYear(coordinate);

                this.datePicker.find(".cz-datepicker-year").val(date.year);
                this.datePicker.find(".cz-datepicker-regime option").each(function () {
                    if (this.value == date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            }

            public getDate() {
                var year = this.datePicker.find(".cz-datepicker-year").val();
                var regime = this.datePicker.find(".cz-datepicker-regime :selected").val();

                return CZ.Common.convertYearToCoordinate(year, regime);
            }

            public remove() {
                this.mode.remove();
                this.container.remove();
            }

            private editModeYear() {
                this.container.empty();

                var yearBox: JQuery = $("<input type='text' class='cz-datepicker-year'></input>");
                var regimesSelect: JQuery = $("<select class='cz-datepicker-regime'></select>");

                var optionGa: JQuery = $("<option value='ga'>Ga</option>");
                var optionMa: JQuery = $("<option value='ma'>Ma</option>");
                var optionKa: JQuery = $("<option value='ka'>Ka</option>");
                var optionBCE: JQuery = $("<option value='bce'>BCE</option>");
                var optionCE: JQuery = $("<option value='ce'>CE</option>");

                regimesSelect.append(optionGa)
                    .append(optionMa)
                    .append(optionKa)
                    .append(optionBCE)
                    .append(optionCE);

                this.container.append(yearBox);
                this.container.append(regimesSelect);
            }

            private editModeDate() {
                this.container.empty();

                var daySelector: JQuery = $("<select class='cz-datepicker-day-selector'></select>");
                var monthSelector: JQuery = $("<select class='cz-datepicker-month-selector'></select>");
                var yearBox: JQuery = $("<input type='text' class='cz-datepicker-year'></input>");

                monthSelector.change(function (event) {
                    daySelector.empty();

                    var selectedIndex = (<HTMLSelectElement>monthSelector[0]).selectedIndex;
                    for (var i = 0; i < CZ.Settings.daysInMonth[selectedIndex]; i++) {
                        var dayOption: JQuery = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        daySelector.append(dayOption);
                    }
                });

                for (var i = 0; i < CZ.Settings.months.length; i++) {
                    var monthOption: JQuery = $("<option value='" + CZ.Settings.months[i] + "'>" + CZ.Settings.months[i] + "</option>");

                    monthSelector.append(monthOption);
                }

                this.container.append(monthSelector);
                this.container.append(daySelector);
                this.container.append(yearBox);
            }

            private editModeNone() {
                this.container.empty();
            }
        }
    }
}