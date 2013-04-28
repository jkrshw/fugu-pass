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
function testSuite() {
  testGetDerivedKey();
  testEncryption();
  testDecryption();
}

function testGetDerivedKey() {
  var dk1 = getDerivedKey('testpass', 's1234', 1); 
  var dk1S = Utilities.base64Encode(dk1);
  var expected1 = 'dnhzbUVTTG1pYUtCQzRxbUQyTTR5SVMxbEFYTE5haXUySWZRVzN1S283VT0=';
  if (dk1S != expected1) {
    Logger.log("FAILED: dk1S expected[%s] but was [%s]", expected1, dk1S);
  }
  else {
    Logger.log("PASSED: dk1S"); 
  }
  
  var dk2 = getDerivedKey('testpass', 's1234', 2); 
  var dkS = Utilities.base64Encode(dk2);
  var expected = 'Ym51alM0cmkwb0d5RTlYZ0JpT3gzWTJtcEErekg5YTBSVkYxOFYyQW9QND0=';
  if (dkS != expected) {
    Logger.log("FAILED: dkS expected[%s] but was [%s]", expected, dkS); 
  }
  else {
    Logger.log("PASSED: dkS"); 
  }

  var dk1000 = getDerivedKey('testpass', 's1234', 1000); 
  var expected1000 = 'MklnajdQVTQ3RTA1Y1MwY0hyMGJsQWZRcnpWUTVsR3NkSVh4dGpjeE85TT0=';
  var dk1000S = Utilities.base64Encode(dk1000);
  if (dk1000S != expected1000) {
    Logger.log("FAILED: dk1000S expected[%s] but was [%s]", expected1000, dk1000S); 
  }
  else {
    Logger.log("PASSED: dk1000S"); 
  }
}

function testEncryption() {
  var dk = 'MklnajdQVTQ3RTA1Y1MwY0hyMGJsQWZRcnpWUTVsR3NkSVh4dGpjeE85TT0=';
  var testStore = 'store';
  var expected = '7ACF859B7BD8BDA5';
  setKey(dk);
  var cipher = enc(testStore);
  
  if (cipher != expected) {
    Logger.log("FAILED: encryption expected[%s] but was [%s]", expected, cipher); 
  }
  else {
    Logger.log("PASSED: encryption"); 
  }
}

function testDecryption() {
  var dk = 'MklnajdQVTQ3RTA1Y1MwY0hyMGJsQWZRcnpWUTVsR3NkSVh4dGpjeE85TT0=';
  var testCipher = '7ACF859B7BD8BDA5';
  var expected = 'store';
  setKey(dk);
  var text = dec(testCipher);
  
  if (text != expected) {
    Logger.log("FAILED: decryption expected[%s] but was [%s]", expected, text); 
  }
  else {
    Logger.log("PASSED: decryption"); 
  }
}