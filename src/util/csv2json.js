/*global portviz:true */
/**
 * See github.com/cparker15/csv-to-json
 *
 * csv-to-json: A utility that converts data format from CSV to JSON.
 * Copyright (C) 2009-2012 Christopher Parker <http://www.cparker15.com/>
 * 
 * csv-to-json is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * csv-to-json is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with csv-to-json.  If not, see <http://www.gnu.org/licenses/>.
 */



function fixSplitsInsideQuotes(line) {
    for (var i = 0; i < line.length; i++) {
        var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
        var quote = "";
        if (chunk.charAt(0) === '"' || chunk.charAt(0) === "'") {
            quote = chunk.charAt(0);
        }
        if (quote !== "" && chunk.charAt(chunk.length - 1) === quote) {
            quote = "";
        }
        if (quote !== "") {
            var j = i + 1;

            if (j < line.length) {
                chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
            }

            while (j < line.length && chunk.charAt(chunk.length - 1) !== quote) {
                line[i] += ',' + line[j];
                line.splice(j, 1);
                chunk = line[j].replace(/[\s]*$/g, "");
            }

            if (j < line.length) {
                line[i] += ',' + line[j];
                line.splice(j, 1);
            }
        }
    }
}

function trimWhitespace(line) {
    for (var i = 0; i < line.length; i++) {
        line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
    }
}

function trimQuotes(line) {
    for (var i = 0; i < line.length; i++) {
        if (line[i].charAt(0) === '"') {
            line[i] = line[i].replace(/^"|"$/g, "");
        } else if (line[i].charAt(0) === "'") {
            line[i] = line[i].replace(/^'|'$/g, "");
        }
    }
}

function removeEmptyRows(csvRows) {
    var output = [];
    for (var i = 0; i < csvRows.length; i++) {
        if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') !== "") {
            output.push(csvRows[i]);
        }
    }
    return output;
}

function parseCSVLine(wholeline) {
    var line = wholeline.split(',');
    fixSplitsInsideQuotes(line);
    trimWhitespace(line);
    trimQuotes(line);
    return line;
}

function parseRows(csvRows) {
    var fields = [];
    for (var i = 0; i < csvRows.length; i++) {
        fields[i] = parseCSVLine(csvRows[i]);
    }
    return fields;
}

function convertToJson(fields) {
    var objArr = [];
    for (var i = 1; i < fields.length; i++) {
        if (fields[i].length > 0) {
             objArr.push({});
        }
        for (var j = 0; j < fields[i].length; j++) {
            objArr[i - 1][fields[0][j]] = fields[i][j];
        }
    }
    return objArr;
}


/** 
 * @throws if malformed input
 * @returns {Array} Array of js objects 
 */
portviz.csvToJson = function (csvText) {
    if (csvText === "") { throw("empty input"); }
    var csvRows = removeEmptyRows(csvText.split(/[\r\n]/g));
    if (csvRows.length < 2) { throw("missing header"); }
    var fields = parseRows(csvRows);
    var objArr = convertToJson(fields);
    //var jsonText = JSON.stringify(objArr, null, "\t");
    //return jsonText;
    return objArr;
};
