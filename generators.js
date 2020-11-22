// #! /usr/bin/env node
// 'use strict';

import CryptoJS from 'crypto-js';

const PBKDF2_KEY_SIZE_IN_BITS = 512;
const PBKDF2_ITERATIONS = 100203;

export function generatePBK(password, salt = null){
    salt = salt || CryptoJS.lib.WordArray.random(PBKDF2_KEY_SIZE_IN_BITS / 8).toString(CryptoJS.enc.Hex); // Creating a 512 bit/ 64 bytes salt (Salt size is ideally equal to keysize)
    const key = CryptoJS.PBKDF2(
        password, 
        CryptoJS.enc.Hex.parse(salt), 
        {
            keySize: PBKDF2_KEY_SIZE_IN_BITS / 32, // keySize is the size of the key in 4-byte blocks
            iterations: PBKDF2_ITERATIONS
        }
    ).toString(CryptoJS.enc.Hex);
    return {
        key,
        salt,
    }
}

export function generateMAC(text, key){
    const hash = CryptoJS.HmacSHA256(text, key).toString(CryptoJS.enc.Hex);
    return hash;
}


// console.log(masterKey.toString(CryptoJS.enc.Hex)); //The default encoding is HEX only but explicit better than implicit
// console.log('New Master key generated from same passphrase and previously given salt')
// console.log(deriveMasterKey('development', derivation.salt).masterKey.toString())
// console.log(masterKey.toString(CryptoJS.enc.Utf8));


/**
 * CryptoJS extensions for PBKDF2
 *
 * The OpenSSL formatter has a hardcoded salt size that is insufficient for use
 * with this algorithm, and the Hex formatter does not serialize the salt at all.
 * To remedy this, we provide two alternative formatters: 
 *  * CryptoJS.format.JSON: A human-readable escaped JSON string.
 *  * CryptoJS.format.Base64URL: A URL-safe Base64 string, inspired by the OpenSSL format.
 *
 * @example
 *     require("kdf-pbkdf2.js");
 *     var CryptoJS = require("crypto-js");
 *
 *     var encrypted = CryptoJS.AES.encrypt("MySecretData", "password", { kdf: CryptoJS.kdf.PBKDF2, format: CryptoJS.format.Base64URL }).toString();
 *     console.log("Encrypted string:", encrypted);
 *
 *     var decrypted = CryptoJS.AES.decrypt(encrypted, "password", { kdf: CryptoJS.kdf.PBKDF2, format: CryptoJS.format.Base64URL }).toString(CryptoJS.enc.Utf8);
 *     console.log("Decrypted string:", decrypted);
 */

// RFC 4648 Base 64 Encoding with URL and Filename Safe Alphabet
// CryptoJS.enc.Base64URL = {
//     parse: CryptoJS.enc.Base64.parse,
//     stringify: CryptoJS.enc.Base64.stringify,
//     _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_='
// };

// CryptoJS.kdf.PBKDF2 = {
//     /**
//      * Derives a key and IV from a password in a manner compatible with RFC 2898
//      * @param {string} password The password to derive from.
//      * @param {number} keySize The size in words of the key to generate.
//      * @param {number} ivSize The size in words of the IV to generate.
//      * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
//      *
//      * @return {CipherParams} A cipher params object with the key, IV, and salt.
//      *
//      * @static
//      *
//      * @example
//      *
//      *      var derivedParams = CryptoJS.kdf.PBKDF2.execute('Password', 256/32, 128/32);
//      *      var derivedParams = CryptoJS.kdf.PBKDF2.execute('Password', 256/32, 128/32, 'saltsalt');
//      */
//     execute: function (password, keySize, ivSize, salt) {
//         // Generate random salt
//         if (!salt) {
//             salt = CryptoJS.lib.WordArray.random(128 / 8);
//         }

//         // Derive key and IV
//         var key = CryptoJS.algo.PBKDF2.create({ keySize: keySize + ivSize, hasher: CryptoJS.algo.SHA256, iterations: 10 }).compute(password, salt);

//         // Separate key and IV
//         var iv = CryptoJS.lib.WordArray.create(key.words.slice(keySize), ivSize * 4);
//         key.sigBytes = keySize * 4;

//         // Return params
//         return CryptoJS.lib.CipherParams.create({ key: key, iv: iv, salt: salt });
//     }
// }

// CryptoJS.format.JSON = {
//     /*
//      * Converts a cipher params object to a JSON string.
//      *
//      * @param {CipherParams} cipherParams The cipher params object.
//      *
//      * @return {string} The serialized JSON string.
//      *
//      * @static
//      *
//      * @example
//      *
//      *      var jsonString = CryptoJS.format.JSON.stringify(cipherParams);
//      */
//     stringify: function (cipherParams) {
//         // Shortcuts
//         var ciphertext = cipherParams.ciphertext;
//         var salt = cipherParams.salt;
//         var obj = { ciphertext: ciphertext.toString(CryptoJS.enc.Base64) };

//         if (salt) {
//             obj.salt = salt.toString(CryptoJS.enc.Base64);
//         }

//         return JSON.stringify(obj)
//     },

//     /*
//      * Converts a JSON string to a cipher params object.
//      *
//      * @param {string} JsonStr The JSON string.
//      *
//      * @return {CipherParams} The cipher params object.
//      *
//      * @static
//      *
//      * @example
//      *
//      *      var cipherParams = CryptoJS.format.JSON.parse(JsonString);
//      */
//     parse: function (jsonStr) {
//         var obj = JSON.parse(jsonStr);
//         var salt;
//         var ciphertext = CryptoJS.enc.Base64.parse(obj.ciphertext);

//         if (obj.salt) {
//             salt = CryptoJS.enc.Base64.parse(obj.salt);
//         }

//         return CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext, salt: salt });
//     }
// }

// CryptoJS.format.Base64URL = {
//     /*
//      * Converts a cipher params object to a URL-Safe Base64 String.
//      *
//      * @param {CipherParams} cipherParams The cipher params object.
//      *
//      * @return {string} The serialized Base64URL string.
//      *
//      * @static
//      *
//      * @example
//      *
//      *      var b64UrlString = CryptoJS.format.Base64URL.stringify(cipherParams);
//      */
//     stringify: function (cipherParams) {
//         // Shortcuts
//         var ciphertext = cipherParams.ciphertext;
//         var salt = cipherParams.salt;

//         if (salt) {
//             var wordArray = CryptoJS.lib.WordArray.create([0x4272696e, 0x65645f5f, salt.words.length]).concat(salt).concat(ciphertext);
//         } else {
//             var wordArray = ciphertext;
//         }

//         return wordArray.toString(CryptoJS.enc.Base64URL);
//     },

//     /*
//      * Converts a URL-Safe Base64 string to a cipher params object.
//      *
//      * @param {string} b64Str The Base64URL string.
//      *
//      * @return {CipherParams} The cipher params object.
//      *
//      * @static
//      *
//      * @example
//      *
//      *      var cipherParams = CryptoJS.format.Base64URL.parse(b64UrlString);
//      */
//     parse: function (b64Str) {
//         // Parse base64
//         var ciphertext = CryptoJS.enc.Base64URL.parse(b64Str);

//         // Shortcut
//         var ciphertextWords = ciphertext.words;

//         if (ciphertextWords[0] == 0x4272696e && ciphertextWords[1] == 0x65645f5f) {
//             // Extract salt length
//             var saltEnd = 3 + ciphertextWords[2];
//             // Extract salt
//             var salt = CryptoJS.lib.WordArray.create(ciphertextWords.slice(3, saltEnd));

//             // Remove salt from ciphertext
//             ciphertextWords.splice(0, saltEnd);
//             ciphertext.sigBytes -= (4 * saltEnd);
//         }

//         return CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext, salt: salt });
//     }
// }