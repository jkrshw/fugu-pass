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
/* Compute the SHA-512 digest of the input and repeat for iterationCount */
function getDigestBase64(input, iterationCount) {
  var iteration = input;
  for (i = 0; i < iterationCount; i++) {
    var digestBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, iteration);
    iteration = Utilities.base64Encode(digestBytes);
  }
  return iteration;
}

/* Get the derived key from the key, salt and iterationCount. 
 *
 * Our encryption function supports keys up to 56 chars in length so we substring the 2 inputs.
 */
function getDerivedKey(key, salt, iterationCount) {
   return Utilities.base64Encode(loopDK(key, salt,iterationCount)).substr(0,56);
}

/* Get a random salt with a fixed prefix of the given length */
function getSalt(prefix, length) {
  //not a secure random function
  return '' + (prefix + (Math.random() * Math.pow(10, length))).substr(0,length);
}

/* Generate DK using HMAC PRF */
function loopDK(p, s, c) {
  var dk = Utilities.computeHmacSha256Signature(p, s);
  s = Utilities.base64Encode(dk);
  for (var i = 1; i < c; i++) {    
    var u = Utilities.computeHmacSha256Signature(p, s);
    dk = arrayXOR(dk,u);
    s = Utilities.base64Encode(u);
  }
  return dk;
}

function arrayXOR(a,b) {
 var c = [];
  for(var i = 0; i < a.length ; i++) {
   c.push(a[i] ^ b[i]); 
  }
  return c;
}