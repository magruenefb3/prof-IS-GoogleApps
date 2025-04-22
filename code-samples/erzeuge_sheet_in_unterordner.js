function runMe() {
    // legt ein sheets-objekt im unterordner namens sheets an.
    createSpreadsheetInSubfolder ("hallo");
}

function createSpreadsheetInSubfolder(spreadsheetName) {
    const subfolderName = "sheets";
  
    try {
      // Ruft die Projektdatei ab.
      const scriptFile = DriveApp.getFileById(ScriptApp.getScriptId());
  
      // Ruft den übergeordneten Ordner der Projektdatei ab.
      const projectFolder = scriptFile.getParents().next();
  
      // Überprüft, ob der Unterordner "sheets" existiert.
      let subfolder = projectFolder.getFoldersByName(subfolderName);
  
      // Erstellt den Unterordner, falls er nicht existiert.
      if (!subfolder.hasNext()) {
        subfolder = projectFolder.createFolder(subfolderName);
        Logger.log(`Unterordner "${subfolderName}" erstellt.`);
      } else {
        subfolder = subfolder.next(); // Ruft den vorhandenen Unterordner ab.
        Logger.log(`Unterordner "${subfolderName}" existiert bereits.`);
      }
  
      // Erstellt das neue Spreadsheet im Root-Verzeichnis.
      const newSpreadsheet = SpreadsheetApp.create(spreadsheetName);
      const newSpreadsheetFile = DriveApp.getFileById(newSpreadsheet.getId());
  
      // Verschiebt die Datei in den Unterordner.
      newSpreadsheetFile.moveTo(subfolder);
  
      Logger.log(`Neues Spreadsheet "%s" im Unterordner "${subfolderName}" erstellt: %s`, spreadsheetName, newSpreadsheet.getUrl());
      return newSpreadsheet;
  
    } catch (error) {
      Logger.log('Fehler beim Erstellen des Spreadsheets im Unterordner: %s', error);
      return null;
    }
  }