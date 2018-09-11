var Excel = require("exceljs");

var workbook = new Excel.Workbook();

var resultantObject = {};

var fs = require('fs');

workbook.xlsx.readFile(__dirname + '/input/client.xlsx').then(function(work) {
  work.eachSheet(function(sheet) {
    var keyCol = sheet.getColumn(2);
    var englishCol = sheet.getColumn(3);
    var arabicCol = sheet.getColumn(4);
    arabicCol.eachCell(function(cell, rowNumber) {
      if (rowNumber !== 1) {
        if (sheet.name === 'ROOT') {
          resultantObject[sheet.getRow(rowNumber).getCell(2).value] = cell.value;
        } else {
          resultantObject[sheet.name] = resultantObject[sheet.name] || {};
          resultantObject[sheet.name][sheet.getRow(rowNumber).getCell(2).value] = cell.value;
        }
      }
    });
  });
  fs.writeFile("./output/client.json", JSON.stringify(resultantObject), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});