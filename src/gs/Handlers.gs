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
// Check the master key with the encrypted and hashed salt
// Return the hashed masterKey to use for encryption of passwords.
function unlock(e) {
  var app = UiApp.getActiveApplication();
  
  var masterKey = e.parameter.masterKey;
  var masterHash = getDigestBase64(masterKey, 1);

  
  /* Check masterKey encrypts salt */
  var encExpected = UserProperties.getProperty('saltHMAC');
  
  var masterSalt = UserProperties.getProperty('masterSalt');
  var derivedKey = getDerivedKey(masterHash, masterSalt, 1000);
  
  var saltHMAC = Utilities.base64Encode(Utilities.computeHmacSha256Signature(masterSalt, derivedKey));
  
  /* If master key matches, create main form with hashed masterkey */
  if(encExpected == saltHMAC) {
    app.remove(app.getElementById('unlock'));
    app.add(createMainForm(app, masterHash, 'main'));
  }
  else {
    app.getElementById('status').setVisible(true).setText('Incorrect master key.'); 
    app.getElementById('loading').setVisible(false);
  }
  
  return app;
}

// Store a salt encrypted and hashed to use for verification.
// Return the hashed masterKey to use for encryption of passwords.
function register(e) {
  var app = UiApp.getActiveApplication();
  
  var masterKey = e.parameter.masterKey;
  var masterHash = getDigestBase64(masterKey, 1);
  
  var salt = getSalt('FP', 6);
  UserProperties.setProperty('masterSalt', salt);
  var derivedKey = getDerivedKey(masterHash, salt, 1000);
  var saltHMAC = Utilities.base64Encode(Utilities.computeHmacSha256Signature(salt, derivedKey));
  
  /* Store hmac of salt using derived key. This is used to verify the entered masterKey */
  UserProperties.setProperty('saltHMAC', saltHMAC);
  
  app.remove(app.getElementById('unlock'));
  
  //TODO where can we store the derivedKey session like? Not on the client or in the spreadsheet
  app.add(createMainForm(app, masterHash, 'main'));
  
  return app;
}

// Return the decyrpted password for the given domain
function get(e) {
  var app = UiApp.getActiveApplication();
  
  var results = findCipher(e.parameter.domain);
  
  var cipher = results.ciper;
  var salt = results.salt;
  
  if (cipher) {
    var derivedKey = getDerivedKey(e.parameter.key, salt, 1000);
    
    setKey(derivedKey);
    
    app.getElementById('plaintext').setText(dec(cipher));
    app.getElementById('status').setVisible(false);
  }
  else {
    app.getElementById('plaintext').setText('');
    app.getElementById('status').setVisible(true).setText('No saved password found for ' + e.parameter.domain);
  }
  app.getElementById('loading').setVisible(false);
  return app; 
}

// Encrypt the password and store it for the given domain if it doesn't already exist
function submit(e) {
  var app = UiApp.getActiveApplication();
  
  
  //Don't submit if we already have a password for this domain
  if(findCipher(e.parameter.domain).cipher !=null) {
     app.getElementById('status').setVisible(true).setText('Password already exists for ' + e.parameter.domain);
  }
  else{
    var salt = getSalt('s', 6);
    var key = e.parameter.key;
    var derivedKey = getDerivedKey(key, salt, 1000);
    
    setKey(derivedKey);
    
    // Write the data in the text boxes back to the Spreadsheet
    var doc = SpreadsheetApp.openById(UserProperties.getProperty('docId'));
    var lastRow = doc.getLastRow();
    var cell = doc.getRange('a1').offset(lastRow, 0);
    cell.setValue(e.parameter.domain);
    cell.offset(0, 1).setValue(enc(e.parameter.plaintext));
    cell.offset(0, 2).setValue(salt);
    
    // Clear the values from the text boxes so that new values can be entered
    
    app.getElementById('domain').setValue('');
    app.getElementById('plaintext').setValue('');
    // Make the status line visible and tell the user the possible actions
    app.getElementById('status').setVisible(false);
  }
  app.getElementById('loading').setVisible(false);
  
  return app;
}​