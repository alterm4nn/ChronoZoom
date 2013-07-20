/// <reference path='../../scripts/dates.ts'/>
/// <reference path='../../scripts/typings/jquery/jquery.d.ts'/>

/* TODO: implement public get/set functions for edit mode

*/
module CZ {
    export module UI {

        export class DatePicker {
            // Value that represents infinity date
            private INFINITY_VALUE = 9999;

            // Error messages
            private WRONG_YEAR_INPUT = "Year should be a number.";

            private modeSelector: JQuery;
            private dateContainer: JQuery;
            private errorMsg: JQuery;

            private daySelector: JQuery;
            private monthSelector: JQuery;
            private yearSelector: JQuery;
            private regimeSelector: JQuery;

            private coordinate: number;

            constructor(public datePicker: JQuery) {
                if (!(datePicker instanceof jQuery && datePicker.is("div")))
                    throw "DatePicker parameter is invalid! It should be jQuery instance of DIV.";

                this.coordinate = 0;

                this.initialize();
            };

            /**
            * Creates datepicker based on given JQuery instance of div
            */
            private initialize(): void {
                this.datePicker.addClass("cz-datepicker");

                this.modeSelector = $("<select class='cz-datepicker-mode cz-input'></select>");
                
                var optionYear: JQuery = $("<option value='year'>Year</option>");
                var optionDate: JQuery = $("<option value='date'>Date</option>");

                this.modeSelector.change(event => {
                    var mode = this.modeSelector.find(":selected").val();
                    this.errorMsg.text("");
                    switch (mode) {
                        case "year":
                            this.editModeYear();
                            this.setDate_YearMode(this.coordinate, false);
                            break;
                        case "date":
                            this.editModeDate();
                            this.setDate_DateMode(this.coordinate);
                            break;
                        // optional mode, it can be disabled
                        case "infinite":
                            this.editModeInfinite();
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

                // set "year" mode by default
                this.editModeYear();
                this.setDate(this.coordinate, true);
            }
            
            /**
            * Removes datepicker object
            */
            public remove(): void {
                this.datePicker.empty();

                this.datePicker.removeClass("cz-datepicker");
            }

            /**
            * Adds edit mode "infinite"
            */
            public addEditMode_Infinite(): void {
                var optionIntinite: JQuery = $("<option value='infinite'>Infinite</option>");
                this.modeSelector.append(optionIntinite);
            }
            
            /**
            * Sets date corresponding to given virtual coordinate
            */
            public setDate(coordinate: any, ZeroYearConversation = false) {
                // invalid input
                if (!this.validateNumber(coordinate)) {
                    return false;
                }

                coordinate = Number(coordinate);
                this.coordinate = coordinate;
                var regime = CZ.Dates.convertCoordinateToYear(this.coordinate).regime;
                
                // set edit mode to infinite in case if coordinate is infinity
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
            }

            /**
            * Returns date converted to virtual coordinate if date is valid, otherwise returns false.
            */
            public getDate() {
                var mode = this.modeSelector.find(":selected").val();
                switch (mode) {
                    case "year":
                        return this.getDate_YearMode();
                        break;
                    case "date":
                        return this.getDate_DateMode();
                        break;
                    // optional mode, it can be disabled
                    case "infinite":
                        return this.INFINITY_VALUE;
                        break;
                }
            }

            /**
            * Modify date container to match "year" edit mode
            */
            private editModeYear(): void {
                this.dateContainer.empty();

                this.yearSelector = $("<input type='text' class='cz-datepicker-year-year cz-input'></input>");
                this.regimeSelector = $("<select class='cz-datepicker-regime cz-input'></select>");

                this.yearSelector.focus(event => {
                    this.errorMsg.text("");
                });
                
                this.regimeSelector.change(event => {
                    this.checkAndRemoveNonIntegerPart();
                });

                this.yearSelector.blur(event => {
                    if (!this.validateNumber(this.yearSelector.val())) {
                        this.errorMsg.text(this.WRONG_YEAR_INPUT);
                    }

                    this.checkAndRemoveNonIntegerPart();
                });
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

                this.dateContainer.append(this.yearSelector);
                this.dateContainer.append(this.regimeSelector);
            }

            /**
            * Modify date container to match "date" edit mode
            */
            private editModeDate(): void {
                this.dateContainer.empty();

                this.daySelector = $("<select class='cz-datepicker-day-selector cz-input'></select>");
                this.monthSelector = $("<select class='cz-datepicker-month-selector cz-input'></select>");
                this.yearSelector = $("<input type='text' class='cz-datepicker-year-date cz-input'></input>");

                this.yearSelector.focus(event => {
                    this.errorMsg.text("");
                });

                this.yearSelector.blur(event => {
                    if (!this.validateNumber(this.yearSelector.val()))
                        this.errorMsg.text(this.WRONG_YEAR_INPUT);

                    this.checkAndRemoveNonIntegerPart();
                });

                var self = this;
                this.monthSelector.change(function (event) {
                    self.daySelector.empty();

                    // update days in days select to match current month
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

                // raise change event to initialize days select element
                self.monthSelector.trigger("change");

                this.dateContainer.append(this.monthSelector);
                this.dateContainer.append(this.daySelector);
                this.dateContainer.append(this.yearSelector);
            }

            /**
            * Modify date container to match "infinite" edit mode
            */
            private editModeInfinite(): void {
                this.dateContainer.empty();
            }

            /**
            * If year in CE and BCE mode is not integer - remove non integral part in the box
            */
            private checkAndRemoveNonIntegerPart(): void {
                var regime = this.regimeSelector.find(":selected").val().toLowerCase();
                var mode = this.modeSelector.find(":selected").val().toLowerCase();

                if (regime === 'ce' || regime === 'bce' || mode === 'date') {
                    this.yearSelector.val(parseFloat(this.yearSelector.val()).toFixed());
                }                
            }
            
            /**
            * Sets year corresponding to given virtual coordinate
            */
            private setDate_YearMode(coordinate: number, ZeroYearConversation): void {
                var date = CZ.Dates.convertCoordinateToYear(coordinate);
                if ((date.regime.toLowerCase() == "bce") && (ZeroYearConversation)) date.year--;
                this.yearSelector.val(date.year);
                // reset selected regime
                this.regimeSelector.find(":selected").attr("selected", "false");

                // select appropriate regime
                this.regimeSelector.find("option").each(function () {
                    if (this.value === date.regime.toLowerCase()) {
                        $(this).attr("selected", "selected");
                    }
                });
            }

            /**
            * Sets date corresponding to given virtual coordinate
            */
            private setDate_DateMode(coordinate: number): void {
                var date = CZ.Dates.getYMDFromCoordinate(coordinate);

                this.yearSelector.val(date.year);
                var self = this;

                // set corresponding month in month select element
                this.monthSelector.find("option").each(function (index) {
                    if (this.value === CZ.Dates.months[date.month]) {
                        $(this).attr("selected", "selected");

                        // event handler of "month changed" is async. using $.promise to update days selection element as callback
                        $.when(self.monthSelector.trigger("change")).done(function () {
                            // month was set, now set corresponding day
                            self.daySelector.find("option").each(function () {
                                if (parseInt(this.value) === date.day) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        });
                    }                  
                });
            }

            /**
            * Returns year converted to virtual coordinate if input is valid, otherwise returns false
            */
            private getDate_YearMode() {
                var year = this.yearSelector.val();
                if (!this.validateNumber(year))
                    return false;
                var regime = this.regimeSelector.find(":selected").val();

                return <any>CZ.Dates.convertYearToCoordinate(year, regime);
            }

            /**
            * Returns date converted to virtual coordinate if input is valid, otherwise returns false
            */
            private getDate_DateMode() {
                var year = this.yearSelector.val();
                if (!this.validateNumber(year))
                    return false;
                year = parseInt(year);

                var month = this.monthSelector.find(":selected").val();
                month = CZ.Dates.months.indexOf(month);
                var day = parseInt(this.daySelector.find(":selected").val());

                return <any>CZ.Dates.getCoordinateFromYMD(year, month, day);
            }

            /**
            * Validates that given string is a non infinite number, returns false if not
            */
            private validateNumber(year: string) {
                return !isNaN(Number(year)) && isFinite(Number(year)) && !isNaN(parseFloat(year));
            }
        }
    }
}
