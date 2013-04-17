/// <reference path='common.ts'/>

/// <reference path='typings/jquery/jquery.d.ts'/>

module CZ {
    export module UI {

        export class DatePicker {
            public coordinate: number;
            public date: {
                day: number;
                month: string;
                year: number;
            };

            constructor(public datePicker: JQuery) {
                this.initialize();
            };

            public initialize() {
                var mode: JQuery = $("<select class='cz-datepicker-mode'></select>");
                
                var optionYear: JQuery = $("<option value='year'>Year</option>");
                var optionDate: JQuery = $("<option value='date'>Date</option>");

                mode.append(optionYear);
                mode.append(optionDate);

                this.datePicker.append(mode);

                var container: JQuery = $("<div class='cz-datepicker-container'></div>");

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

                container.append(yearBox);
                container.append(regimesSelect);

                this.datePicker.append(container);
            }

            public setDate(coordinate: number) {
                this.coordinate = coordinate;
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
                var regime = <any>$(this.datePicker.find(".cz-datepicker-regime option")[0]).val();
                this.datePicker.find(".cz-datepicker-regime option").each(function () {
                    if (this.selected)
                        regime = <any>$(this).val();
                });

                return CZ.Common.convertYearToCoordinate(year, regime);
            }

            public remove() {
                this.datePicker.find(".cz-datepicker-mode").remove();
                this.datePicker.find(".cz-datepicker-container").remove();
            }
        }
    }
}