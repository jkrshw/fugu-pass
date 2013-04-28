/*
    Copyright 2013 Jesse Kershaw jesse.kershaw+fugupass@gmail.com
        
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* Main App function. Initialise the password store and display the UI */
function doGet(e) {
  var app = UiApp.createApplication().setTitle('FuguPass');
  
  //init spreadsheet
  var doc;
  var docId = UserProperties.getProperty('docId');
  if (docId == null) {
    doc = SpreadsheetApp.create('EncryptedPasswords');
    docId = doc.getId();
    UserProperties.setProperty('docId', docId);
  }
  else {
    doc = SpreadsheetApp.openById(docId);
  }  
  SpreadsheetApp.setActiveSpreadsheet(doc);

  if(UserProperties.getProperty('saltHMAC')!=null){
    app.add(createUnlockForm(app, 'unlock'));
  }
  else {
    app.add(createSetupForm(app, 'unlock'));
  }
  
  return app;
}

function doPost(e) {
 return unlock(e);
}

/* Create form to set master key */
function createSetupForm(app, id) {  
  var setupPanel = getDecoratedFormPanel(app).setId(id);
  var panel = app.createFlowPanel();
  var formPanel = app.createFormPanel().add(app.createCaptionPanel().add(panel));
  setupPanel.add(formPanel);
  
  panel.add(getDecoratedLabel(app, 'Set master key'));
  panel.add(getDecoratedTextInput().setName('masterKey').setId('masterKey'));
  
  var loading = getDecoratedLoadingLabel('Initialising...').setId('loading').setVisible(false);
  panel.add(loading);
  var statusLabel = app.createLabel().setId('status').setVisible(false);
  panel.add(statusLabel);
  
  var buttonPanel = getDecoratedButtonPanel(app);
  panel.add(buttonPanel);
  var button = getDecoratedButton('Save');
  button.addClickHandler(app.createClientHandler().forTargets(loading).setVisible(true));
  button.addClickHandler(app.createServerClickHandler('register').addCallbackElement(panel));
  button.addClickHandler(app.createClientHandler().forTargets(app.getElementById('masterKey')).setText(''));
  buttonPanel.add(button);

  return setupPanel;
}

/* Create form to verify master key */
function createUnlockForm(app, id) {
  var unlockPanel = getDecoratedFormPanel(app).setId(id);
  var panel = app.createFlowPanel().setStyleAttribute('width', '100%');
  var formPanel = app.createFormPanel().add(app.createCaptionPanel().add(panel));
  unlockPanel.add(formPanel);
  
  panel.add(getDecoratedLabel(app, 'Master key'));
  panel.add(getDecoratedPasswordInput().setName('masterKey').setId('masterKey'));
  
  var loading = getDecoratedLoadingLabel('Checking key...').setId('loading').setVisible(false);
  panel.add(loading);
  panel.add(app.createLabel().setId('status').setVisible(false));
  
  var button = getDecoratedButton('Unlock');

  var unlockHandler = app.createServerClickHandler('unlock').addCallbackElement(panel);
  button.addClickHandler(app.createClientHandler().forTargets(loading).setVisible(true));
  button.addClickHandler(unlockHandler);
  
  panel.add(getDecoratedButtonPanel(app).add(button));
  

  return unlockPanel;
}

/* Main App form */
function createMainForm(app, masterKey, id) {
  var mainPanel = getDecoratedFormPanel(app).setId(id);
  var panel = app.createFlowPanel();
  var formPanel = app.createFormPanel().add(app.createCaptionPanel().add(panel));
  mainPanel.add(formPanel);
  
  panel.add(getDecoratedLabel(app,'Name'));
  panel.add(getDecoratedTextInput().setName('domain').setId('domain'));
  panel.add(getDecoratedLabel(app,'Password'));
  panel.add(getDecoratedTextInput().setName('plaintext').setId('plaintext'));
  panel.add(app.createHidden('key', masterKey));
  
  var loading = getDecoratedLoadingLabel('Decrypting...').setId('loading').setVisible(false);
  panel.add(loading);
  
  var statusLabel = app.createLabel().setId('status').setVisible(false);
  panel.add(statusLabel);
  
  var buttonPanel = getDecoratedButtonPanel(app);
  panel.add(buttonPanel);
  
  var button = getDecoratedButton('Save');
  button.addClickHandler(app.createClientHandler().forTargets(loading).setText('Encrypting...').setVisible(true));
  button.addClickHandler(app.createServerClickHandler('submit').addCallbackElement(panel));
  button.addClickHandler(app.createClientHandler().forTargets(app.getElementById('plaintext')).setText(''));
  buttonPanel.add(button);
  
  var getButton = getDecoratedButton('Get');
  getButton.addClickHandler(app.createClientHandler().forTargets(loading).setText('Decrypting...').setVisible(true));
  getButton.addClickHandler(app.createServerClickHandler('get').addCallbackElement(panel));
  buttonPanel.add(getButton);

  return mainPanel;
}

// Search for the cipher text of the given domain
// TODO binary search would be quicker. Is it worth it if we only have a handful of passwords?
function findCipher(domain) {
  var result = {};
  var rows = SpreadsheetApp.openById(UserProperties.getProperty('docId')).getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    if(row[0] == domain) {
      result.ciper = row[1];
      result.salt = row[2];
      return result;
    }
  }
  return result;
}