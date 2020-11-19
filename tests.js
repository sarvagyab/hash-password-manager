import { deriveMasterKey } from './generateMasterKey.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import CryptoJS from 'crypto-js';

import { passwordGenerator } from './randomGenerator'

verifyTests();

// Run Tests for all Functions
function verifyTests() {
    let working = true;
    working &= deriveMasterKeyTesting();
    working &= AESencryptionTesting();
    working &= RandomPasswordGeneratorTesting();
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
    const encryptedKey = masterKey.encryptionKey.substr(0, masterKey.encryptionKey.length / 2);
    const encrypted = AESencrypt(passphrase, encryptedKey);
    const decrytped = AESdecrypt(encrypted.cipherText, encryptedKey, encrypted.iv);
    const result = (passphrase === decrytped);
    if (result) console.log('AESencrypt/AESdecrypt - True');
    else console.log('AESencrypt/AESdecrypt - False');
    return result;
}

// Testing random password generator
function RandomPasswordGeneratorTesting() {

    // preparations
    const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
    const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const SPECIAL_CASE = "$#@!%^&*()+-,/:;<>[]_~|{}`'?";
    const DIGITS = "0123456789";

    const _countOccurance = (str) => {
        let LL = 0, LU = 0, LS = 0, LD = 0;
        for (const ch of str) {
            if (LOWER_CASE.indexOf(ch) != -1) ++LL;
            else if (UPPER_CASE.indexOf(ch) != -1) ++LU;
            else if (DIGITS.indexOf(ch) != -1) ++LD;
            else if (SPECIAL_CASE.indexOf(ch) != -1) ++LS;
        }
        return [LL, LU, LD, LS];
    }

    const _checkError = (func, expectedMsg, ...params) => {
        try {
            func.apply(this, params);
            return false;
        }
        catch (err) {
            return (expectedMsg == err.message);
        }
    }
    //

    // Check length of generated password
    let password = passwordGenerator.generatePassword(10);
    let result = (password.length == 10);

    // Check correct number of characters are generated or not
    password = passwordGenerator.generatePassword(10, 3, 4, 2, 1);
    let fArray = _countOccurance(password);
    result &= (fArray[0] <= 3 && fArray[1] <= 4 && fArray[2] <= 2 && fArray[3] <= 1);


    // Checking Errors
    result &= _checkError(passwordGenerator.generatePassword, 'Requested password length is too long', 1e10);
    result &= _checkError(passwordGenerator.generatePassword, 'Requested password length is too short', 2);
    result &= _checkError(passwordGenerator.generatePassword, 'minLengthLower + minLengthUpper + minLengthDigit + minLengthSpecial should be less than length', 10, 3, 4, 10, 3);

    if (result) console.log('Random Password Generation - True');
    else console.log('Random Password Generation - False');

    return result;
}

