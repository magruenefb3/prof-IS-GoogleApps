// generiert mit Gemini


function createSpreadsheetIn_subfoldersWithTriggers(spreadsheetName, triggerFunctions, _subfolderName) {
  
  try {
    // Ruft die Projektdatei ab.
    const scriptFile = DriveApp.getFileById(ScriptApp.getScriptId());

    // Ruft den übergeordneten Ordner der Projektdatei ab.
    const projectFolder = scriptFile.getParents().next();

    // Überprüft, ob der Unterordner "sheets" existiert oder erstellt ihn.
    let _subfolder = projectFolder.getFoldersByName(_subfolderName);
    if (!_subfolder.hasNext()) {
      _subfolder = projectFolder.createFolder(_subfolderName);
      Logger.log(`Unterordner "${_subfolderName}" erstellt.`);
    } else {
      _subfolder = _subfolder.next();
      Logger.log(`Unterordner "${_subfolderName}" existiert bereits.`);
    }

    // Erstellt das neue Spreadsheet im Root-Verzeichnis.
    const newSpreadsheet = SpreadsheetApp.create(spreadsheetName);
    const newSpreadsheetId = newSpreadsheet.getId();
    const newSpreadsheetFile = DriveApp.getFileById(newSpreadsheetId);

    // Verschiebt die Datei in den Unterordner.
    newSpreadsheetFile.moveTo(_subfolder);
    Logger.log(`Neues Spreadsheet "%s" im Unterordner "${_subfolderName}" erstellt: %s`, spreadsheetName, newSpreadsheet.getUrl());

    // --- Erstellt die angegebenen Trigger für das neue Spreadsheet ---
    const createdTriggers = {};
    const triggerTypesToCreate = ["onOpen", "onEdit", "onChange", "onFormSubmit"];

    triggerTypesToCreate.forEach(triggerType => {
      const functionToTrigger = triggerFunctions[triggerType.toLowerCase()];
      if (functionToTrigger) {
        let triggerBuilder = ScriptApp.newTrigger(functionToTrigger)
          .forSpreadsheet(SpreadsheetApp.openById(newSpreadsheetId));

        let trigger = null;

        switch (triggerType.toLowerCase()) {
          case "onopen":
            trigger = triggerBuilder.onOpen().create();
            break;
          case "onedit":
            trigger = triggerBuilder.onEdit().create();
            break;
          case "onchange":
            trigger = triggerBuilder.onChange().create();
            break;
          case "onformsubmit":
            trigger = triggerBuilder.onFormSubmit().create();
            break;
          default:
            Logger.log('Ungültiger Trigger-Typ für %s: %s', spreadsheetName, triggerType);
            return; // Gehe zum nächsten Trigger-Typ
        }

        if (trigger) {
          createdTriggers[triggerType] = trigger;
          Logger.log('Trigger "%s" für Funktion "%s" auf Spreadsheet "%s" erstellt.',
            triggerType, trigger.getHandlerFunction(), spreadsheetName);
        }
      } else {
        Logger.log('Keine Funktion für Trigger-Typ "%s" in Spreadsheet "%s" definiert.', triggerType, spreadsheetName);
      }
    });

    return newSpreadsheet;

  } catch (error) {
    Logger.log('Fehler beim Erstellen des Spreadsheets mit Triggern: %s', error);
    return null;
  }
}

/**
 * Beispielhafte Funktionen, die durch die Trigger ausgelöst werden könnten.
 */
function handleOpenSheet() {
  SpreadsheetApp.getUi().alert('Das Spreadsheet wurde geöffnet (im Unterordner)!');
}

function handleEditSheet(e) {
  if (e) {
    Logger.log('Bearbeitet (Unterordner): Zelle %s, Neuer Wert: %s', e.range.getA1Notation(), e.value);
  }
}

function handleChangeSheet(e) {
  if (e) {
    Logger.log('Änderung (Unterordner): Typ %s', e.changeType);
  }
}

function handleFormSubmitSheet(e) {
  if (e) {
    Logger.log('Formular-Submit (Unterordner): Antworten %s', JSON.stringify(e.response.getResponses()));
  }
}

function testCreateSpreadsheetInSheetsWithTriggers() {
  const spreadsheetName = "Sheet im Unterordner mit Triggern";

  // Definieren Sie ein Objekt, das die Trigger-Typen ihren Handler-Funktionen zuordnet
  const triggerFunctions = {
    onopen: "handleOpenSheet",
    onedit: "handleEditSheet",
    onchange: "handleChangeSheet",
    onformsubmit: "handleFormSubmitSheet"
  };

  const newSpreadsheetObject = createSpreadsheetIn_subfoldersWithTriggers(spreadsheetName, triggerFunctions, "unterOrdner");

  if (newSpreadsheetObject) {
    Logger.log("Spreadsheet '%s' im Unterordner 'sheets' mit Triggern erfolgreich erstellt. ID: %s",
      spreadsheetName, newSpreadsheetObject.getId());
    Logger.log("Überprüfen Sie die Trigger unter 'Bearbeiten' -> 'Aktuelle Projekt-Trigger'.");
  } else {
    Logger.log("Das Erstellen des Spreadsheets mit Triggern ist fehlgeschlagen.");
  }
}