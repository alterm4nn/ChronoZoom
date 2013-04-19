/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export class DatePicker {
            private modeSelector: JQuery;
            private container: JQuery;

            private daySelector: JQuery;
            private monthSelector: JQuery;
            private yearSelector: JQuery;
            private regimeSelector: JQuery;

            private coordinate: number;

            constructor(public datePicker: JQuery) {
                this.initialize();
            };

            public initialize() {
                this.modeSelector = $("<select class='cz-datepicker-mode'></select>");
                
                var optionYear: JQuery = $("<option value='year'>Year</option>");
                var optionDate: JQuery = $("<option value='date'>Date</option>");

                var self = this;
                this.modeSelector.change(function (event) {
                    var mode = self.modeSelector.find(":selected").val();

                    switch (mode) {
                        case "year":
                            self.editModeYear();
                            self.setDate(self.coordinate);
                            break;
                        case "date":
                            self.editModeDate();
                            self.setDate_DateMode(self.coordinate);
                            break;
                        // this option might be disabled
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
            }
            
            public remove() {
                this.modeSelector.remove();
                this.container.remove();
            }

            public addEditMode_Infinite() {
                var optionIntinite: JQuery = $("<option value='infinite'>Infinite</option>");
                this.modeSelector.append(optionIntinite);
            }

            public setDate(coordinate: number) {
                this.coordinate = coordinate;
                var mode = this.modeSelector.find(":selected").val();

                switch (mode) {
                    case "year":
                        this.setDate_YearMode(coordinate);
                        break;
                    case "date":
                        this.setDate_DateMode(coordinate);
                        break;
                }
            }

            public getDate() {
                var mode = this.modeSelector.find(":selected").val();

                switch (mode) {
                    case "year":
                        return this.getDate_YearMode();
                        break;
                    case "date":
                        return this.getDate_DateMode();
                        break;
                    // this option might be disabled
                    case "infinite":
                        return 9999;
                        break;
                }
            }

            private editModeYear() {
                this.container.empty();

                this.yearSelector = $("<input type='text' class='cz-datepicker-year'></input>");
                this.regimeSelector = $("<select class='cz-datepicker-regime'></select>");

                var optionGa: JQuery = $("<option value='ga'>Ga</option>");
                var optionMa: JQuery = $("<option value='ma'>Ma</option>");
                var optionKa: JQuery = $("<option value='ka'>Ka</option>");
                var optionBCE: JQuery = $("<option value='bce'>BCE</option>");
                var optionCE: JQuery = $("<option value='ce'>CE</option>");

                this.regimeSelector.append(optionGa)
                    .append(optionMa)
                    .append(optionKa)
                    .append(optionBCE)
                    .append(optionCE);

                this.container.append(this.yearSelector);
                this.container.append(this.regimeSelector);
            }

            private editModeDate() {
                this.container.empty();

                this.daySelector = $("<select class='cz-datepicker-day-selector'></select>");
                this.monthSelector = $("<select class='cz-datepicker-month-selector'></select>");
                this.yearSelector = $("<input type='text' class='cz-datepicker-year'></input>");

                var self = this;
                this.monthSelector.change(function (event) {
                    self.daySelector.empty();

                    var selectedIndex = (<HTMLSelectElement>self.monthSelector[0]).selectedIndex;
                    for (var i = 0; i < CZ.Dates.daysInMonth[selectedIndex]; i++) {
                        var dayOption: JQuery = $("<option value='" + (i + 1) + "'>" + (i + 1) + "</option>");
                        self.daySelector.append(dayOption);
                    }
                });

                for (var i = 0; i < CZ.Dates.months.length; i++) {
                    var monthOption: JQuery = $("<option value='" + CZ.Dates.months[i] + "'>" + CZ.Dates.months[i] + "</option>");
                    this.monthSelector.append(monthOption);
                }

                self.monthSelector.trigger("change");

                this.container.append(this.monthSelector);
                this.container.append(this.daySelector);
                this.container.append(this.yearSelector);
            }

            private editModeInfinite() {
                this.container.empty();
            }

            private setDate_YearMode(coordinate: number) {
                var date = CZ.Dates.convertCoordinateToYear(coordinate);

                this.yearSelector.val(date.year);
                this.regimeSelector.find("option").each(function () {
                    if (this.value === date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            }

            private setDate_DateMode(coordinate: number) {
                var date = CZ.Dates.getDMYFromCoordinate(coordinate);

                this.yearSelector.val(date.year);
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
            }

            private getDate_YearMode() {
                var year = this.yearSelector.val();
                var regime = this.regimeSelector.find(":selected").val();

                return CZ.Dates.convertYearToCoordinate(year, regime);
            }

            private getDate_DateMode() {
                var year = this.yearSelector.val();
                var month = this.monthSelector.find(":selected").val();
                month = CZ.Dates.months.indexOf(month);
                var day = this.daySelector.find(":selected").val();

                return CZ.Dates.getCoordinateFromDMY(year, month, day);
            }
        }
    }
}