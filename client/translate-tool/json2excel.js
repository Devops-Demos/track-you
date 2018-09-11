var fs = require('fs');
var nodeExcel = require('excel-export');

var json = require('./input/keys.json');

var fields = [];
var keys = Object.keys(json);

var sheets = [];

var res = {};
res.name = 'ROOT';
res.cols = [{
  caption: 'KEY',
  type: 'string'
}, {
  caption: 'VALUE',
  type: 'string'
}];

res.rows = [];

for (var i = 0; i < keys.length; i++) {
  if (typeof json[keys[i]] === 'string') {
    res.rows.push([keys[i], json[keys[i]]]);
  } else {
    var sheet = {
      name: keys[i],
      cols: [{
        caption: 'KEY',
        type: 'string'
      }, {
        caption: 'VALUE',
        type: 'string'
      }]
    };
    sheet.rows = [];
    var currentObj = json[keys[i]];
    var rows = Object.keys(currentObj);
    for (var j = 0; j < rows.length; j++) {
      sheet.rows.push([rows[j], currentObj[rows[j]]]);
    }
    sheets.push(sheet);
  }
}

sheets.push(res);

var result = nodeExcel.execute(sheets);

fs.writeFileSync('./output/data.xlsx', result, 'binary');