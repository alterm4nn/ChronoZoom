/**
 * Extends CZ module with CZ.CsvUtils submodule. It contains Reader
 * and Writer constructors for CSV files of CZ's special format.
 */
var CZ = (function (CZ, FileReader, $) {
    var CsvUtils = CZ.CsvUtils = CZ.CsvUtils || {};
    
    /**
     * Reader for CSV files of special format.
     * @constructor
     * @this {Reader}
     * @param {string} file      File's content as text.
     * @param {string} delimiter Delimiter of CSV values (space, tab or comma).
     */
    CsvUtils.Reader = function () {
        // A set of allowed delimiters.
        var _delimitersSet = [' ', '\t', ','];

        var _file = "",
            _delimiter = ',',
            _length = 0,
            _index = 0,
            _buffer = "",
            _header = {},
            _schema = [],
            _data = [];

        Object.defineProperties(this, {
            // properties...
        });

        function skipBlank() {
            // Skip all space characters.
            while (_index < _length && /\s/.test(_file[_index])) {
                _index++;
            }

            // Each record starts from a new line.
            // Exceptions: start and end of file.
            // NOTE: This test fails when spaces and tabs in the end of file without \n.
            if (_index > 0 && _index - 1 < _length && _file[_index - 1] !== '\n') {
                throw "Invalid content of the file (blank area). [" + _index + "]";
            }

            return (_index < _length);
        }

        function parseHeader() {
            // TODO: Check for malformed JSON string, i.e.
            //       {p:1} or {'p':1}. It should be {"p":1}.
            // TODO: Allow multiline JSON.

            _header = $.parseJSON(_buffer);
        }

        function readLine() {
            var start = _index;

            // Read this line until a new line.
            while (_index < _length && _file[_index] !== '\n') {
                _index++;
            }

            // Save readed line in the buffer for parsing.
            _buffer = _file.substring(start, _index);

            // TODO: Handle case of \n as end of file. Now it fails.
            return (_index++ < _length + 1); // Shift to the next line.
        }

        function parseSchema() {
            // Matches all attributes names of schema.
            // NOTE: http://stackoverflow.com/a/1293163/1211780
            // TODO: Extend this regexp for case with empty field.
            var pattern = new RegExp(("(\\" + _delimiter + "|\\r?\\n|\\r|^)" +
                                      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                                      "([^\"\\" + _delimiter + "\\r\\n]*))"), "gi");
            var match = null;

            // Add attributes to schema.
            // TODO: Use other matches for fields in quotes.
            while ((match = pattern.exec(_buffer)) && match[3]) {
                _schema.push({ type: "number", name: match[3] });
            }
        }

        function parseRecord() {
            // Matches all fields of record.
            // NOTE: http://stackoverflow.com/a/1293163/1211780
            // TODO: Extend this regexp for case with empty field.
            var pattern = new RegExp(("(\\" + _delimiter + "|\\r?\\n|\\r|^)" +
                                      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                                      "([^\"\\" + _delimiter + "\\r\\n]*))"), "gi");
            var match = null;
            var n = _schema.length;
            var k = _data.length;

            // Push new record in data rows collection.
            _data.push([]);

            // Add fields to k-th row.
            // TODO: Use other matches for fields in quotes.
            while ((match = pattern.exec(_buffer)) && match[3]) {
                _data[k].push(match[3]);
            }

            // If not match with schema.
            if (_data[k].length !== n) {
                throw "Invalid content of the file (record). [" + _index + "," + (k + 1) + "]";
            }

            // TODO: Implement type determination.
        }

        function parseData() {
            while (readLine()) {
                parseRecord();
            }
        }

        /**
         * Opens file using <input> element and handles
         * file's reading process.
         * @param  {Object} input     DOM <input> element, id or jQuery object.
         * @param  {Object} callbacks { "onloadstart", "onerror", "onabort", "onload", "onloadend" } callbacks.
         *                            These callbacks handle file's reading process.
         */
        this.openFile = function (input, callbacks) {
            if (!input) {
                throw "Input element is undefined.";
            }

            // Is this is a DOM input element, id or jQuery input element?
            if (!(input.tagName !== undefined && input.tagName.toLowerCase() === "input")) {
                if (typeof (input) === "string") {
                    input = $("#" + input);
                    if (input.length === 0) {
                        throw "There is no input element with such id.";
                    }
                    input = input[0];
                } else if (input instanceof jQuery && input.is("input")) {
                    input = input[0];
                } else {
                    throw "Invalid input parameter! It should be input element, id of input or jQuery input.";
                }
            }

            // Add file type attribute to <input> if necessary.
            if (input.hasAttribute("type") && input.getAttribute("type") !== "file") {
                throw "Invalid type of input element. It should be 'file'.";
            } else {
                input.setAttribute("type", "file");
            }

            var file = input.files[0];
            var fileReader = new FileReader();

            // TODO: Add specific verification of file and file extension.

            fileReader.onloadstart = callbacks["onloadstart"];
            fileReader.onerror = callbacks["onerror"];
            fileReader.onabort = callbacks["onabort"];
            fileReader.onload = callbacks["onload"];
            fileReader.onloadend = callbacks["onloadend"];

            fileReader.readAsText(file);
        };

        /**
         * Parses CSV file of special format to JSON object for visualization.
         * @param  {string} file      File's content as text.
         * @param  {string} delimiter Delimiter character.
         * @return {Object}           Data as JSON object for visualization tool.
         */
        this.parseFile = function (file, delimiter) {
            // The file is nonempty.
            if (!file) {
                throw "File parameter is undefined.";
            }

            // Verify that given delimiter from appropriate set of characters.
            if (delimiter && _delimitersSet.indexOf(delimiter) !== -1) {
                throw "Invalid delimiter character.";
            }

            // Reset variables.
            _file = file;
            _length = file.length;
            _index = 0;
            _buffer = "";
            _header = {};
            _schema = [];
            _data = [];

            // Default value of delimiter is comma if it is not defined.
            _delimiter = delimiter || ',';

            // Main parsing route.
            skipBlank();
            readLine();
            parseHeader();
            skipBlank();
            readLine();
            parseSchema();
            parseData();
            skipBlank();

            // Form JSON object for visualization tool.
            var json = {};
            var n = _data.length;

            json.x = new Array(n);
            json.y = new Array(n);

            // Copy properties from header JSON.
            for (var prop in _header) {
                json[prop] = _header[prop];
            }

            // Copy data. It has only 2 columns.
            // TODO: Support different plots in the future.
            for (var i = 0; i < _data.length; ++i) {
                json.x[i] = _data[i][0];
                json.y[i] = _data[i][1];
            }

            return json;
        };
    };

    // NOTE: Under consideration.
    CsvUtils.Writer = function () { };

    return CZ;
})(CZ || {}, FileReader, jQuery);