// Log erzeugen
// Autor: Laurent Svekis

// diese Funktion is deaktiviert. Aktivieren, um das Logging scharf zu schalten. 
// funktioniert nur, wenn in der Umgebung auch ein Spreadsheet existiert.
function onOpen(){
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('adv')
  .addItem('copy','copytolog')
  .addToUi();
}

function copytolog(){
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet();
  const range = ss.getSelection().getActiveRange();
  const data = range.getValues();
  let sheetLog = ss.getSheetByName('log');
  if(sheetLog == null){
    sheetLog = ss.insertSheet();
    sheetLog.setName('log');
  }
  const newRange = sheetLog.getDataRange();
  const startRow = newRange.getLastRow() +1;
  const setRange = sheetLog.getRange(startRow,1,range.getNumRows(),range.getNumColumns());
  // setRange.setBackground('red');
  setRange.setValues(data);
  sheetLog.appendRow([startRow]);
}
