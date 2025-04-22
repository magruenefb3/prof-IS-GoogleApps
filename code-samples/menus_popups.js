// Autor: Laurence Svekis

function onOpen(){
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('adv')
    .addItem('alert','popUp1')
    .addItem('prompt1','popUp2')
      .addItem('prompt2','popUp3')
    .addToUi();
  }
   
  function popUp3(){
    const ui = SpreadsheetApp.getUi();
    const rep = ui.prompt('Do you like Apps Script rate 1-5?',ui.ButtonSet.YES_NO_CANCEL);
    logVal(rep.getSelectedButton());
    if(rep.getSelectedButton() == ui.Button.YES){
      logVal('YES User rated ' + rep.getResponseText());
    }else if(rep.getSelectedButton() == ui.Button.NO){
      logVal('NO User rated ' + rep.getResponseText());
    }else{
      logVal('User Cancel');
    }
  }
   
   
  function popUp2(){
    const ui = SpreadsheetApp.getUi();
    const rep = ui.prompt('Tell me your name?');
    logVal(rep.getSelectedButton());
    if(rep.getSelectedButton() == ui.Button.OK){
      logVal(rep.getResponseText());
    }else{
      logVal('Prompt Closed');
    }
  }
   
   
   
  function popUp1(){
    const ui = SpreadsheetApp.getUi();
    const rep = ui.alert('confirm','Do you agree',ui.ButtonSet.YES_NO);
    logVal(rep);
    if(rep == ui.Button.YES){
      logVal('yes was pressed');
    }else{
      logVal('no was pressed');
    }
  }
   
  function logVal(val){
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log');
    ss.appendRow([val]);
  }
  