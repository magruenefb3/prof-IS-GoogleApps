function createSpreadsheetWithOpenTrigger(spreadsheetName) {
    const subfolderName = "sheets";
    const triggerFunctionName = "onOpenHandler"; // Name der Funktion, die beim Öffnen ausgeführt wird
  
    try {
      // Ruft die Projektdatei ab.
      const scriptFile = DriveApp.getFileById(ScriptApp.getScriptId());
  
      // Ruft den übergeordneten Ordner der Projektdatei ab.
      const projectFolder = scriptFile.getParents().next();
  
      // Überprüft, ob der Unterordner "sheets" existiert oder erstellt ihn.
      let subfolder = projectFolder.getFoldersByName(subfolderName);
      if (!subfolder.hasNext()) {
        subfolder = projectFolder.createFolder(subfolderName);
        Logger.log(`Unterordner "${subfolderName}" erstellt.`);
      } else {
        subfolder = subfolder.next();
        Logger.log(`Unterordner "${subfolderName}" existiert bereits.`);
      }
  
      // Erstellt das neue Spreadsheet im Root-Verzeichnis.
      const newSpreadsheet = SpreadsheetApp.create(spreadsheetName);
      const newSpreadsheetId = newSpreadsheet.getId();
      const newSpreadsheetFile = DriveApp.getFileById(newSpreadsheetId);
  
      // Verschiebt die Datei in den Unterordner.
      newSpreadsheetFile.moveTo(subfolder);
      Logger.log(`Neues Spreadsheet "%s" im Unterordner "${subfolderName}" erstellt: %s`, spreadsheetName, newSpreadsheet.getUrl());
  
      // --- Erstellt einen onOpen-Trigger für das neue Spreadsheet ---
      ScriptApp.newTrigger(triggerFunctionName)
        .forSpreadsheet(SpreadsheetApp.openById(newSpreadsheetId))
        .onOpen()
        .create();
  
      Logger.log(`onOpen-Trigger für Funktion "${triggerFunctionName}" auf Spreadsheet "${spreadsheetName}" erstellt.`);
  
      return newSpreadsheet;
  
    } catch (error) {
      Logger.log('Fehler beim Erstellen des Spreadsheets mit onOpen-Trigger: %s', error);
      return null;
    }
  }
  
  // Funktion, die ausgeführt wird, wenn das Spreadsheet geöffnet wird
  function onOpenHandler() {
    SpreadsheetApp.getUi()
        .alert('Das Spreadsheet wurde geöffnet!');
    // Hier können Sie Ihre gewünschten Aktionen beim Öffnen des Spreadsheets ausführen
  }
  
  function testCreateSpreadsheetWithOpenTrigger() {
    const newSpreadsheetObject = createSpreadsheetWithOpenTrigger("Sheet mit Open Trigger");
    if (newSpreadsheetObject) {
      Logger.log("Spreadsheet mit onOpen-Trigger erfolgreich erstellt. ID: %s", newSpreadsheetObject.getId());
      // Um den Trigger zu testen, schließen Sie das neu erstellte Sheet und öffnen Sie es erneut.
    } else {
      Logger.log("Das Erstellen des Spreadsheets mit onOpen-Trigger ist fehlgeschlagen.");
    }
  }