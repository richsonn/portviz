/* transmogrify csv data files to json */
portviz = {};
require('../src/util/csv2json.js');
module.exports = function (grunt) {
  grunt.registerTask('csvdata', 'transform csv files to js', function() {
    var src = grunt.config('csvdata.src');
    var o = [];
    o.push('/*global portviz */');
    o.push('(function () {');
    src.forEach(function(item) {
      grunt.log.write('Parsing ' + item.file + '...').ok();
      var filecontent = grunt.file.read(item.file);
      o.push('this.' + item.name + ' =');
      var jsoncontent = portviz.csvToJson(filecontent);
      o.push(JSON.stringify(jsoncontent, null, 2) + ';');
    });
    o.push('}).apply(portviz.sampledata);');
    var dest = grunt.config('csvdata.dest');
    var outputstring = o.join('\n');
    grunt.file.write(dest, outputstring);
    grunt.log.ok('wrote ' + src.length + ' datasets to ' + dest)
  });
};
