import { deriveMasterKey } from './generateMasterKey.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import CryptoJS from 'crypto-js';


verifyTests();

// Run Tests for all Functions
function verifyTests() {
    let working = true;
    working &= deriveMasterKeyTesting();
    working &= AESencryptionTesting();
    if (working) console.log("All Functions are working correctly");
    else console.log("Something's wrong")
}

// Testing deriveMasterKey
function deriveMasterKeyTesting(password = 'myNameIsSarvagya') {
    const masterKey = deriveMasterKey('myNameIsSarvagya');
    const verifyKey = deriveMasterKey('myNameIsSarvagya', masterKey.salt);
    const result = ((masterKey.encryptionKey === verifyKey.encryptionKey) && (masterKey.salt === verifyKey.salt));

    if (result) console.log("deriveMasterKey - True");
    else console.log('deriveMasterKey - False');
    return result;
}

// Testing AESencrypt decrypt functions
function AESencryptionTesting() {
    const passphrase = "Loreum Ipsum";
    const masterKey = deriveMasterKey('myNameIsSarvagya');
    const encryptedKey = masterKey.encryptionKey.substr(0,masterKey.encryptionKey.length/2);
    const encrypted = AESencrypt(passphrase, encryptedKey);
    const decrytped = AESdecrypt(encrypted.cipherText, encryptedKey, encrypted.iv);
    const result = (passphrase === decrytped);
    if (result) console.log('AESencrypt/AESdecrypt - True');
    else console.log('AESencrypt/AESdecrypt - False');
    return result;
}